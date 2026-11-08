module.exports = {
  apps: [
    {
      name: "sunhaven",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/sunhaven",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "512M",
      error_file: "/var/log/pm2/sunhaven-error.log",
      out_file: "/var/log/pm2/sunhaven-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
