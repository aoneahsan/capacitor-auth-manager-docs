/**
 * Every place Capacitor Auth Manager is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * `npm view capacitor-auth-manager version` answered, this site answered 200.
 */
export type PlatformId = 'npm' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in Capacitor Auth Manager's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'npm', name: 'npm', href: 'https://www.npmjs.com/package/capacitor-auth-manager', title: 'npm install capacitor-auth-manager', text: 'One sign-in API for Google and the other providers on web, Android and iOS in a Capacitor app.', cta: 'View on npm', primary: true, verified: '2026-11-20'},
  {id: 'docs', name: 'Documentation', href: 'https://capacitor-auth-manager-docs.aoneahsan.com', title: 'These docs', text: 'Installation, a five-minute quick start, and the full API.', cta: 'Read the docs', verified: '2026-11-20'},
];

export const APPS_PAGE = {
  title: 'Get Capacitor Auth Manager',
  description: 'Every place Capacitor Auth Manager is released: the npm package and these docs.',
  lead: 'Install it from npm and keep these docs a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter((platform) => platform.id !== CURRENT_SURFACE);
export const PRIMARY_PLATFORM: Platform = PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string = PLATFORMS.map((platform) => platform.verified).sort().at(-1) ?? '2026-11-20';
