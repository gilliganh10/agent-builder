/**
 * Stream reveal controller — chases a target string at a capped visual rate
 * so the assistant bubble grows smoothly (ChatGPT-like) instead of appearing
 * all at once due to React 18 batching or bursty SSE deltas.
 *
 * Presentation-only: no server / SSE contract changes.
 */

export const STREAM_REVEAL_DEFAULTS = {
  tickMs: 32,
  maxCharsPerTick: 3,
} as const;

export interface StreamRevealOptions {
  /** Callback to push the currently-visible text into React state. */
  apply: (displayed: string) => void;
  /** Return true to silently stop the loop (e.g. stale epoch). */
  isStale?: () => boolean;
  tickMs?: number;
  maxCharsPerTick?: number;
}

export interface StreamRevealController {
  /** Update the full target string; starts the loop if not already running. */
  setTarget(full: string): void;
  /** Immediately set displayed = target (one final apply) and stop the loop. */
  flush(): void;
  /** Stop the loop without applying — discard pending reveal. */
  cancel(): void;
}

export function createStreamReveal(
  opts: StreamRevealOptions
): StreamRevealController {
  const tickMs = opts.tickMs ?? STREAM_REVEAL_DEFAULTS.tickMs;
  const maxChars = opts.maxCharsPerTick ?? STREAM_REVEAL_DEFAULTS.maxCharsPerTick;

  let target = "";
  let displayed = "";
  let timer: ReturnType<typeof setTimeout> | null = null;
  let cancelled = false;

  function tick() {
    timer = null;
    if (cancelled) return;
    if (opts.isStale?.()) {
      cancelled = true;
      return;
    }

    if (displayed.length < target.length) {
      const end = Math.min(displayed.length + maxChars, target.length);
      displayed = target.slice(0, end);
      opts.apply(displayed);
    }

    if (displayed.length < target.length) {
      timer = setTimeout(tick, tickMs);
    }
  }

  function ensureRunning() {
    if (cancelled || timer != null) return;
    if (displayed.length < target.length) {
      timer = setTimeout(tick, tickMs);
    }
  }

  return {
    setTarget(full: string) {
      if (cancelled) return;
      target = full;
      ensureRunning();
    },

    flush() {
      if (timer != null) {
        clearTimeout(timer);
        timer = null;
      }
      if (!cancelled && target.length > 0) {
        displayed = target;
        opts.apply(displayed);
      }
      cancelled = true;
    },

    cancel() {
      if (timer != null) {
        clearTimeout(timer);
        timer = null;
      }
      cancelled = true;
    },
  };
}
