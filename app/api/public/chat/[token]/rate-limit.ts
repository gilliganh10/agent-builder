import { HttpError } from "@/lib/api-error";

const WINDOW_MS = 60_000;
const MAX_PER_IP = 10;

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

export async function publicRateLimitGuard(ip: string): Promise<void> {
  const now = Date.now();
  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_PER_IP) {
    throw new HttpError(429, "Rate limit exceeded");
  }

  entry.timestamps.push(now);
}

// Periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.timestamps.every((t) => now - t >= WINDOW_MS)) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
