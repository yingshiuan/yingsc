import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { seedConsent } from './consent';

const paths = ['./', './projects', './resume', './about'];
const schemes = ['light', 'dark'] as const;

// Mobile is not just a narrower desktop here: below 900px the header switches
// background and the nav becomes a dropdown, so it has contrast pairs and
// controls that a desktop-only sweep never sees.
const viewports = [
  { name: 'desktop', size: { width: 1280, height: 800 } },
  { name: 'mobile', size: { width: 390, height: 844 } },
];

// Both colour schemes matter for the same reason: the dark palette is a
// different set of contrast pairs.
for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: viewport.size });

    // Audit the pages themselves. The consent dialog covers them on a first
    // visit and is audited separately below.
    test.beforeEach(async ({ page }) => {
      await seedConsent(page);
    });

    for (const path of paths) {
      for (const colorScheme of schemes) {
        test(`${path} (${colorScheme}) has no axe violations`, async ({
          page,
        }) => {
          await page.emulateMedia({ colorScheme });
          await page.goto(path);

          const { violations } = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

          // Mapped to strings so a failure names the rule and the offending
          // element instead of dumping the whole axe result object.
          expect(
            violations.map(
              (v) =>
                `${v.id} (${v.impact}) — ${v.nodes
                  .map((n) => n.target.join(' '))
                  .join(' | ')}`
            )
          ).toEqual([]);
        });
      }
    }
  });
}

test.describe('mobile nav panel', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await seedConsent(page);
  });

  test('the open dropdown has no axe violations', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: /toggle menu/i }).click();

    // The panel only exists once opened, so a page-load sweep never audits it.
    const { violations } = await new AxeBuilder({ page })
      .include('#mynav')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(violations.map((v) => `${v.id} (${v.impact})`)).toEqual([]);
  });
});

// Deliberately unseeded: this is the one place the consent bar is up, and it
// needs auditing in both palettes because its buttons are drawn from the theme
// tokens rather than a fixed colour.
test.describe('consent bar', () => {
  for (const colorScheme of schemes) {
    test(`is free of axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('./');

      const bar = page.getByRole('region', { name: /cookie consent/i });
      await expect(bar).toBeVisible();

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(
        violations.map(
          (v) =>
            `${v.id} (${v.impact}) — ${v.nodes
              .map((n) => n.target.join(' '))
              .join(' | ')}`
        )
      ).toEqual([]);
    });
  }
});
