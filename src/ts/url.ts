// Astro serves this site under a deploy base (`/yingsc/` on GitHub Pages), so
// internal links written in content files can't be plain root-relative paths.
const BASE_URL = import.meta.env.BASE_URL ?? '/';

/** True for anything already pointing off-site: http(s), mailto:, tel:, //cdn. */
export function isExternal(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

/**
 * Resolves an href written in content (resume.json, markdown frontmatter).
 * External URLs and in-page anchors pass through untouched; everything else is
 * treated as site-relative and gets the deploy base prefixed — so content can
 * say `projects/afatt` instead of hardcoding the production domain.
 */
export function resolveHref(href: string): string {
  if (isExternal(href) || href.startsWith('#')) return href;
  return `${BASE_URL}${href.replace(/^\//, '')}`;
}
