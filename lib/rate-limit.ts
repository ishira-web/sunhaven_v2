type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const bucket = store.get(key) ?? { timestamps: [] };

  const recent = bucket.timestamps.filter((t) => t > cutoff);

  if (recent.length >= limit) {
    const oldest = recent[0];
    const retryAfterMs = Math.max(0, oldest + windowMs - now);
    store.set(key, { timestamps: recent });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  recent.push(now);
  store.set(key, { timestamps: recent });

  return {
    allowed: true,
    remaining: limit - recent.length,
    retryAfterSeconds: 0,
  };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

// Sweep stale buckets occasionally so the Map doesn't grow unbounded in a
// long-lived server process. Runs at most once per minute on access.
let lastSweep = Date.now();
export function sweepIfDue(maxWindowMs: number): void {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  const cutoff = now - maxWindowMs;
  for (const [key, bucket] of store) {
    const recent = bucket.timestamps.filter((t) => t > cutoff);
    if (recent.length === 0) store.delete(key);
    else bucket.timestamps = recent;
  }
}
