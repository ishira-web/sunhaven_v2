# VPS deploy secrets

The GitHub Actions workflow at `.github/workflows/deploy.yml` needs **four** repository secrets to SSH into the VPS and deploy. Set them once; after that every push to `main` auto-deploys.

## The four secrets

| Name           | Value                                              | Example                                   |
| -------------- | -------------------------------------------------- | ----------------------------------------- |
| `VPS_HOST`     | VPS IP or domain Actions should SSH into           | `203.0.113.42` or `sunhavenlanka.com`     |
| `VPS_USER`     | OS user Actions logs in as                         | `deploy`                                  |
| `VPS_SSH_KEY`  | **Private key** whose public half is in the user's `~/.ssh/authorized_keys` | multi-line PEM (see below) |
| `VPS_APP_PATH` | Absolute path to the cloned repo on the VPS        | `/var/www/sunhaven`                       |

## Step 1 — Generate a dedicated SSH key pair

Do this on your laptop (or the VPS itself — either works):

```bash
ssh-keygen -t ed25519 -f sunhaven_deploy -N "" -C "github-actions-sunhaven"
```

Produces two files in the current directory:

- `sunhaven_deploy` — **private key**, goes into GitHub secret `VPS_SSH_KEY`
- `sunhaven_deploy.pub` — **public key**, goes onto the VPS

> Use a dedicated key, not your personal one. If this key ever leaks, you can revoke only the deploy access by removing one line from `authorized_keys`.

## Step 2 — Install the public key on the VPS

SSH into the VPS as the `deploy` user (or whichever user owns `/var/www/sunhaven`):

```bash
ssh deploy@<vps-ip>
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "<paste full contents of sunhaven_deploy.pub here>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

Verify from your laptop that the key works:

```bash
ssh -i sunhaven_deploy deploy@<vps-ip> "echo ok"
```

Expected output: `ok`. If you see a password prompt, the public key wasn't installed correctly.

## Step 3 — Add the secrets in GitHub

Go to **GitHub → your repo → Settings → Secrets and variables → Actions → New repository secret**, then add each of the four in turn.

### `VPS_HOST`
Just the hostname or IP. No `ssh://`, no port.

### `VPS_USER`
Usually `deploy`. Whatever user owns the app directory on the VPS.

### `VPS_SSH_KEY`
Paste the **entire contents** of the `sunhaven_deploy` private key file, including the header and footer lines:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBPzL7M...<many more lines>...
-----END OPENSSH PRIVATE KEY-----
```

Don't trim whitespace. Don't base64 it. Just paste the raw file contents.

### `VPS_APP_PATH`
Absolute path. No trailing slash. Example: `/var/www/sunhaven`.

## Step 4 — Test the deploy

After adding all four secrets:

1. **GitHub → Actions → Deploy → Run workflow → main → Run workflow**
2. Watch the `deploy` job logs. It should:
   - Connect to the VPS
   - Run `git reset --hard origin/main`
   - Install, migrate, build
   - `pm2 reload` or `pm2 start`
3. `curl https://yourdomain.com` should still return your site (the reload is seamless).

If the SSH step fails, see troubleshooting below.

## Rotating / revoking

**Compromised key or departing contributor:**

1. On the VPS, open `~/.ssh/authorized_keys` and remove the matching public key line.
2. In GitHub, update `VPS_SSH_KEY` with a new private key, then install its new public half on the VPS.

The old key is now useless.

## Troubleshooting

| Error in Actions log                                           | Likely cause                                                                 |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `Permission denied (publickey)`                                | Public key not in `~/.ssh/authorized_keys`, or `VPS_SSH_KEY` is wrong/truncated |
| `Host key verification failed`                                 | First connection — `appleboy/ssh-action` accepts new hosts by default; if you set `fingerprint`, verify it's correct |
| `fatal: not a git repository`                                  | `VPS_APP_PATH` is wrong or the repo wasn't cloned there                       |
| `pm2: command not found`                                       | PM2 isn't installed globally, or the deploy user's PATH lacks the npm global bin |
| `JWT_SECRET environment variable is required`                  | `.env` on the VPS is missing / unreadable by the deploy user                  |
| `Access denied for user 'sunhaven'@'localhost'`                | MySQL credentials in `.env` don't match the DB user                           |

### Checking manually from the VPS

If Actions is failing, SSH in as the `deploy` user and try the exact commands the workflow runs:

```bash
cd /var/www/sunhaven
git fetch --all
git reset --hard origin/main
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload ecosystem.config.js --update-env
```

If these succeed interactively but fail in Actions, the problem is SSH/environment, not the build.

## Security notes

- The deploy user should **not** have `sudo` by default. The workflow does `git pull + build + pm2 reload`, which don't need root. Reserve sudo for initial server setup only.
- Private key is encrypted at rest in GitHub's secret store and only decrypted inside the workflow runner; GitHub masks it in logs automatically. Never `echo "$VPS_SSH_KEY"` in a step.
- If the VPS also hosts other services, firewall MySQL (`3306`) to localhost only so `DATABASE_URL` using `localhost` keeps it off the public internet.
- Rotate `JWT_SECRET` and `DATABASE_URL` only on the VPS (`.env`), not in this guide or any committed file.
