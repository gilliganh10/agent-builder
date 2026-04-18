"use client";

import type { ReactNode } from "react";
import { DEFAULT_PERMISSIONS, type Permission } from "@/lib/permissions";

/**
 * Single-scope OSS build: viewer mode collapses to "admin" with full
 * local-trust permissions. Stubbed so ported monolith components keep working.
 */
export type ViewerMode = "admin" | "viewer";

interface ViewerModeContextValue {
  mode: ViewerMode;
  permissions: Permission[];
}

const VALUE: ViewerModeContextValue = {
  mode: "admin",
  permissions: DEFAULT_PERMISSIONS,
};

export function ViewerModeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useViewerMode(): ViewerModeContextValue {
  return VALUE;
}
