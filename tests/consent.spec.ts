import { test, expect, type Page } from '@playwright/test';
import { seedConsent } from './consent';

// The bar only renders from a production build (`import.meta.env.PROD` in
// Analytics.astro), which is what `npm run preview` serves.

// Nothing here should ever reach the real GA4 property, so every measurement
// endpoint is aborted. The tag scripts themselves are left alone.
async function blockHits(page: Page) {
  await page.route('**://*.google-analytics.com/**', (r) => r.abort());
  await page.route('**/collect**', (r) => r.abort());
}

const bar = (page: Page) => page.getByRole('region', { name: /cookie consent/i });

const stored = (page: Page) =>
  page.evaluate(() => localStorage.getItem('analytics_consent'));

test.beforeEach(async ({ page }) => {
  await blockHits(page);
});

// Consent Mode state, asserted without depending on Google.
//
// GA4 runs on the main thread, so its commands land in the page's own
// `dataLayer`. Blocking googletagmanager means gtag.js never loads to consume
// and rewrite that array, which leaves the raw command queue readable — each
// entry is the `arguments` object of one gtag() call. That makes these
// assertions exact and offline, where reading `gcs` off a network request
// would be neither.
async function commands(page: Page) {
  return page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []).map((e) =>
      Array.from(e as ArrayLike<unknown>)
    )
  );
}

const consentArg = (cmds: unknown[][], kind: 'default' | 'update') =>
  cmds.find((c) => c[0] === 'consent' && c[1] === kind)?.[2] as
    | Record<string, string>
    | undefined;

test.describe('Consent Mode state', () => {
  // Blocking gtag.js here too keeps `dataLayer` as the raw command queue.
  test.beforeEach(async ({ page }) => {
    await page.route('**://*.googletagmanager.com/**', (r) => r.abort());
  });

  test('A. first visit defaults to denied', async ({ page }) => {
    await page.goto('./');
    const def = consentArg(await commands(page), 'default');

    expect(def).toBeDefined();
    expect(def?.analytics_storage).toBe('denied');
    // Never granted by this component, ads or not.
    expect(def?.ad_storage).toBe('denied');
  });

  test('B. Reject updates to denied', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Reject' }).click();

    expect(consentArg(await commands(page), 'update')?.analytics_storage).toBe(
      'denied'
    );
  });

  test('C. Accept updates to granted on the live page', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Accept' }).click();

    // No reload, no navigation: the update has to reach the tag in this page.
    expect(consentArg(await commands(page), 'update')?.analytics_storage).toBe(
      'granted'
    );
  });

  test('D. a returning visitor who accepted starts granted', async ({
    page,
  }) => {
    await seedConsent(page, 'accepted');
    await page.goto('./');
    const cmds = await commands(page);

    // Applied as the *default*, not corrected afterwards by an update.
    expect(consentArg(cmds, 'default')?.analytics_storage).toBe('granted');
    expect(consentArg(cmds, 'update')).toBeUndefined();
  });

  test('E. a returning visitor who rejected starts denied', async ({
    page,
  }) => {
    await seedConsent(page, 'rejected');
    await page.goto('./');
    const cmds = await commands(page);

    expect(consentArg(cmds, 'default')?.analytics_storage).toBe('denied');
    expect(consentArg(cmds, 'update')).toBeUndefined();
  });
});

test('a first visit is asked, and the choice sticks', async ({ page }) => {
  await page.goto('./');

  await expect(bar(page)).toBeVisible();

  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(bar(page)).toHaveCount(0);
  expect(await stored(page)).toBe('accepted');

  // A returning visitor is not asked again.
  await page.reload();
  await expect(bar(page)).toHaveCount(0);
});

test('rejecting is remembered too', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Reject' }).click();

  await expect(bar(page)).toHaveCount(0);
  expect(await stored(page)).toBe('rejected');

  await page.reload();
  await expect(bar(page)).toHaveCount(0);
});

test('the page stays readable and scrollable while the bar is up', async ({
  page,
}) => {
  await page.goto('./');
  await expect(bar(page)).toBeVisible();

  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow)
  ).not.toBe('hidden');

  // The whole point of the non-blocking bar: a visitor can read and move
  // around the page before deciding.
  const scrolled = await page.evaluate(async () => {
    const before = window.scrollY;
    window.scrollBy(0, 400);
    await new Promise((r) => requestAnimationFrame(r));
    return { before, after: window.scrollY };
  });
  expect(scrolled.after).toBeGreaterThan(scrolled.before);

  await expect(bar(page)).toBeVisible();
});

test('the page behind the bar stays clickable', async ({ page }) => {
  await page.goto('./');
  await expect(bar(page)).toBeVisible();

  // A modal scrim would swallow this click. Nothing is seeded here, so the bar
  // is genuinely up while the page is used.
  const link = page.locator('#navbar').getByRole('link', { name: 'Projects' });
  await expect(link).toBeVisible();
  await link.click();

  await expect(page).toHaveURL(/\/projects\/?$/);
  // ...and it is still up on the page navigated to.
  await expect(bar(page)).toBeVisible();
});

test('the bar does not obscure the end of the page', async ({ page }) => {
  await page.goto('./');
  const barBox = await bar(page).boundingBox();
  expect(barBox).not.toBeNull();

  // Body padding is grown by the bar's height so a focused element tabbed to
  // at the bottom is not hidden underneath it (WCAG 2.2 Focus Not Obscured).
  const padding = await page.evaluate(
    () => parseFloat(getComputedStyle(document.body).paddingBottom) || 0
  );
  expect(padding).toBeGreaterThanOrEqual(barBox!.height - 1);

  await page.getByRole('button', { name: 'Accept' }).click();
  const after = await page.evaluate(
    () => parseFloat(getComputedStyle(document.body).paddingBottom) || 0
  );
  expect(after).toBeLessThan(barBox!.height);
});

test('the bar does not steal focus on load', async ({ page }) => {
  await page.goto('./');
  await expect(bar(page)).toBeVisible();

  // It does not block the page, so grabbing focus would interrupt reading.
  const focusedInBar = await page.evaluate(() => {
    const b = document.getElementById('privacy-choice');
    return !!b && b.contains(document.activeElement);
  });
  expect(focusedInBar).toBe(false);
});

test('dismissing does not strand focus on the removed bar', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Accept' }).click();

  const state = await page.evaluate(() => ({
    barGone: !document.getElementById('privacy-choice'),
    // A detached activeElement is the failure mode: focus pointing at a node
    // that is no longer in the document swallows the next keystroke.
    focusConnected: document.activeElement?.isConnected ?? false,
  }));
  expect(state.barGone).toBe(true);
  expect(state.focusConnected).toBe(true);
});
