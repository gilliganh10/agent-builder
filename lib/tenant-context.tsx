"use client";

import type { ReactNode } from "react";

/**
 * Single-scope OSS build: no tenancy. This stub exists only so that ported
 * monolith components which expected a tenant context continue to compile.
 * Consumers should ignore `tenantSlug` (it is always "").
 */
export interface TenantInfo {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  membershipRole: string;
}

const DEFAULT: TenantInfo = {
  tenantId: "",
  tenantSlug: "",
  tenantName: "Local",
  membershipRole: "owner",
};

export function TenantProvider({ children }: { value?: TenantInfo; children: ReactNode }) {
  return <>{children}</>;
}

export function useTenant(): TenantInfo {
  return DEFAULT;
}
