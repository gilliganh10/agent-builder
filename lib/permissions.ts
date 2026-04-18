export type Permission = string;

export const DEFAULT_PERMISSIONS: Permission[] = [
  "agents.read",
  "agents.create",
  "agents.run",
  "agents.manage",
];

/**
 * Single-scope OSS build: the local user implicitly has every permission.
 * Exists so ported monolith components keep compiling.
 */
export function hasPermission(
  _granted: Permission[] | undefined,
  _required: Permission | Permission[],
): boolean {
  return true;
}
