import { test, expect } from '@playwright/test';
import { seedConsent } from './consent';

const paths = ['./', './projects', './resume', './about', './privacy'];

test.beforeEach(async ({ page }) => {
  await seedConsent(page);
});

// A loose character typed between two `{cond && (...)}` blocks in a layout or
// component is valid Astro — it just renders as a text node. Two of these have
// shipped ("cla" and "can", both in Analytics.astro), landing as visible junk
// above the header on every page. Nothing else catches it: the build passes,
// eslint passes, and axe has no rule for it.
for (const path of paths) {
  test(`${path} has no loose text directly under <body>`, async ({ page }) => {
    await page.goto(path);

    const stray = await page.evaluate(() =>
      Array.from(document.body.childNodes)
        .filter(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim()
        )
        .map((n) => (n.textContent ?? '').trim())
    );

    expect(stray).toEqual([]);
  });
}
