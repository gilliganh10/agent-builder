/**
 * Single-scope OSS build: the full "projects" feature is not shipped. This
 * stub exists only so that ported Agent Builder components which optionally
 * accept a `projects` array continue to compile. The new app never produces
 * or consumes any Project rows.
 */
export interface Project {
  id: string;
  slug: string;
  name: string;
}
