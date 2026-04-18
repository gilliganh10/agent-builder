"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_PREFIX = "copilot-session";

export function usePersistedSessionId(key: string) {
  const storageKey = useMemo(() => `${STORAGE_PREFIX}:${key}`, [key]);
  const [sessionId, setSessionIdState] = useState<string | undefined>(() => readStoredSessionId(storageKey));

  useEffect(() => {
    setSessionIdState(readStoredSessionId(storageKey));
  }, [storageKey]);

  const setSessionId = useCallback(
    (nextSessionId: string | undefined) => {
      setSessionIdState(nextSessionId);

      if (typeof window === "undefined") return;

      if (nextSessionId) {
        window.sessionStorage.setItem(storageKey, nextSessionId);
      } else {
        window.sessionStorage.removeItem(storageKey);
      }
    },
    [storageKey],
  );

  const clearSessionId = useCallback(() => {
    setSessionId(undefined);
  }, [setSessionId]);

  return {
    sessionId,
    setSessionId,
    clearSessionId,
  };
}

function readStoredSessionId(storageKey: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.sessionStorage.getItem(storageKey) ?? undefined;
}
