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

// The stored value is `{choice, ts}` since the six-month expiry landed, and
// older builds wrote the bare choice. Read through both so these assertions
// stay about the decision rather than about how it happens to be encoded.
const stored = async (page: Page) => {
  const raw = await page.evaluate(() =>
    localStorage.getItem('analytics_consent')
  );
  if (!raw) return null;
  if (raw === 'accepted' || raw === 'rejected') return raw;
  try {
    return (JSON.parse(raw).choice as string) ?? null;
  } catch {
    return null;
  }
};

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

  // The bar is hidden rather than removed now — it has to survive a choice so
  // Cookie settings has something to reopen. So "gone" means gone from the
  // accessibility tree, not gone from the DOM.
  await expect(bar(page)).toHaveCount(0);

  const state = await page.evaluate(() => {
    const el = document.getElementById('privacy-choice');
    return {
      barHidden: !!el && getComputedStyle(el).display === 'none',
      // Focus stranded inside a display:none subtree is the failure mode: the
      // next keystroke goes nowhere. Browsers move it to <body>, so assert
      // that rather than trusting them.
      focusConnected: document.activeElement?.isConnected ?? false,
      focusInBar: !!el && el.contains(document.activeElement),
    };
  });
  expect(state.barHidden).toBe(true);
  expect(state.focusConnected).toBe(true);
  expect(state.focusInBar).toBe(false);
});

// Withdrawal was unreachable before these: the bar promised "Cookie settings in
// the footer" and linked to a /privacy page, and neither existed — and the bar
// removed itself from the DOM on a choice, so there was nothing left to reopen.
test.describe('reopening after a choice', () => {
  const trigger = (page: Page) =>
    page.locator('footer [data-cookie-settings]');

  test('the footer trigger is revealed and reopens the bar', async ({
    page,
  }) => {
    await seedConsent(page, 'accepted');
    await page.goto('./');

    // A returning visitor is not asked again...
    await expect(bar(page)).toHaveCount(0);

    // ...but the control is there. It ships `hidden` and is revealed only by
    // wireTriggers, so this failing means the bar never found it.
    await expect(trigger(page)).toBeVisible();

    await trigger(page).click();
    await expect(bar(page)).toBeVisible();
  });

  test('the reopened bar reports the current choice and can be escaped', async ({
    page,
  }) => {
    await seedConsent(page, 'rejected');
    await page.goto('./');
    await trigger(page).click();

    await expect(bar(page)).toContainText(/analytics is currently off/i);

    // Reopening is a request, so unlike the first visit it takes focus and
    // Escape backs out without forcing a second decision.
    await page.keyboard.press('Escape');
    await expect(bar(page)).toHaveCount(0);
    expect(await stored(page)).toBe('rejected');
  });

  test('withdrawing from the footer flips the choice and expires _ga', async ({
    page,
    context,
  }) => {
    // Unlike the other tests here this one reads the raw command queue, so
    // gtag.js has to stay out: once it loads it consumes `dataLayer` and
    // rewrites the entries, and there is nothing left to assert against.
    await page.route('**://*.googletagmanager.com/**', (r) => r.abort());

    await seedConsent(page, 'accepted');
    // Stand in for what GA4 would have written; the real tag is blocked here.
    await context.addCookies([
      { name: '_ga', value: 'GA1.1.test', url: 'http://localhost:4321/' },
    ]);
    await page.goto('./');

    await trigger(page).click();
    await page.getByRole('button', { name: 'Reject' }).click();

    expect(await stored(page)).toBe('rejected');
    expect(consentArg(await commands(page), 'update')?.analytics_storage).toBe(
      'denied'
    );

    // A consent update alone would stop new writes and leave this behind, so
    // assert the cookie is actually gone rather than merely unused.
    const names = (await context.cookies()).map((c) => c.name);
    expect(names).not.toContain('_ga');
  });
});

test('the policy link in the bar goes to a real page', async ({ page }) => {
  await page.goto('./');

  await bar(page).getByRole('link', { name: /privacy policy/i }).click();

  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible();
});

// The padding assertion above passes even when this fails, which is how the
// overlap survived: the reservation is set on <body>, but while
// `body { height: 100% }` pinned the content box to the viewport it landed
// mid-scroll instead of after the footer. So assert the geometry that actually
// matters — and at both widths, since the bar stacks below `sm` and is roughly
// twice as tall there.
for (const viewport of [
  { name: 'desktop', size: { width: 1280, height: 800 } },
  { name: 'mobile', size: { width: 390, height: 844 } },
]) {
  test.describe(`${viewport.name} bottom of page`, () => {
    test.use({ viewport: viewport.size });

    test('the bar does not cover the footer', async ({ page }) => {
      await page.goto('./');
      await expect(bar(page)).toBeVisible();

      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      );

      const box = await page.evaluate(() => {
        const footer = document.querySelector('footer');
        const el = document.getElementById('privacy-choice');
        if (!footer || !el) return null;
        return {
          footerBottom: footer.getBoundingClientRect().bottom,
          barTop: el.getBoundingClientRect().top,
        };
      });

      expect(box).not.toBeNull();
      // Sub-pixel layout rounding, not a gap worth asserting away.
      expect(box!.footerBottom).toBeLessThanOrEqual(box!.barTop + 1);
    });
  });
}
