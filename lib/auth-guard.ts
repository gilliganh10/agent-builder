import type { Permission } from "@/lib/permissions";

/**
 * Single-scope OSS build: this app is designed for local, trusted use.
 * There is no authentication layer, so permission checks are no-ops.
 *
 * If you deploy this app publicly you MUST put it behind a reverse proxy
 * with its own authentication, or re-introduce real permission checks here.
 */
export async function requirePermission(
  _permission: Permission | Permission[],
): Promise<void> {
  return;
}

export async function hasPermission(
  _permission: Permission | Permission[],
): Promise<boolean> {
  return true;
}
