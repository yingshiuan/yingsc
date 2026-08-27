import type { Page } from '@playwright/test';

/**
 * The consent dialog is modal: while it is up it covers the viewport and
 * nothing behind it is clickable. Every spec that is not about consent seeds a
 * stored choice so the dialog never renders — which is also exactly what a
 * returning visitor sees, so the tests still exercise the normal case.
 *
 * `addInitScript` runs before the page's own scripts on every navigation, so
 * the banner script finds the value already there and removes itself before
 * first paint.
 */
export async function seedConsent(
  page: Page,
  choice: 'accepted' | 'rejected' = 'accepted'
) {
  await page.addInitScript((stored) => {
    try {
      localStorage.setItem('analytics_consent', stored);
    } catch {
      // Storage is unavailable on about:blank and in private mode; the dialog
      // simply stays up, which the consent specs cover directly.
    }
  }, choice);
}
