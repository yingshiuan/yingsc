import { test, expect } from '@playwright/test';

// .navbarToggle is display:none at >=900px (NavBar.astro), so the hamburger only
// exists on a narrow viewport. Without this the button is never visible and the
// test fails for the wrong reason.
test.use({ viewport: { width: 390, height: 844 } });

test('the nav toggle exposes its open/closed state', async ({ page }) => {
  await page.goto('./');

  const toggle = page.getByRole('button', { name: /toggle menu/i });
  await expect(toggle).toBeVisible();

  // aria-label names the button; only aria-expanded says whether the menu it
  // controls is currently open.
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.locator('#navbar').getByRole('link', { name: 'Projects' })
  ).toBeVisible();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(
    page.locator('#navbar').getByRole('link', { name: 'Projects' })
  ).toBeHidden();
});

test('the nav toggle is operable by keyboard', async ({ page }) => {
  await page.goto('./');

  const toggle = page.getByRole('button', { name: /toggle menu/i });
  await toggle.focus();
  await page.keyboard.press('Enter');

  // The click handler lives on the <button>, not the wrapping <li>, so a real
  // keypress has to reach it.
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('the toggle sits directly beside the theme-mode button', async ({
  page,
}) => {
  await page.goto('./');

  const geometry = await page.evaluate(() => {
    const rect = (sel: string) =>
      (document.querySelector(sel) as HTMLElement).getBoundingClientRect();
    const title = rect('.theme-link');
    const toggle = rect('#nav-toggle');
    const theme = rect('#mode-button');
    return {
      // Gap between the two controls, in px. nav's ml-auto absorbs the free
      // space in .theme-bar so they end up flush rather than spread apart.
      gap: Math.round(theme.left - toggle.right),
      toggleAfterTitle: toggle.left > title.right,
    };
  });

  expect(geometry.gap).toBeLessThanOrEqual(1);
  expect(geometry.toggleAfterTitle).toBe(true);
});

test('the open panel spans the full page width', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /toggle menu/i }).click();

  const panel = await page.evaluate(() => {
    const el = document.querySelector('#navbar') as HTMLElement;
    const r = el.getBoundingClientRect();
    const header = (
      document.querySelector('.header-container') as HTMLElement
    ).getBoundingClientRect();
    return {
      left: Math.round(r.left),
      width: Math.round(r.width),
      // Drops out of the bottom of the header rather than overlapping it.
      topMatchesHeaderBottom: Math.abs(r.top - header.bottom) <= 1,
      viewportWidth: document.documentElement.clientWidth,
    };
  });

  expect(panel.left).toBe(0);
  expect(panel.width).toBe(panel.viewportWidth);
  expect(panel.topMatchesHeaderBottom).toBe(true);
});

test('the header paints its own background behind the white title', async ({
  page,
}) => {
  await page.goto('./');

  // The mobile header's navy bar used to be painted by NavBar's `fixed w-full`
  // <nav> sitting behind it. Now that the nav is in flow, the header has to
  // paint its own, or the white title and theme button land on the page
  // background and vanish in light mode.
  //
  // This is asserted directly rather than left to axe: axe reports contrast as
  // *incomplete* (not a violation) when it cannot resolve what is behind a fixed
  // element, so the a11y sweep passes either way.
  const header = await page.evaluate(() => {
    const el = document.querySelector('.header-container') as HTMLElement;
    const cs = getComputedStyle(el);
    const alpha = /rgba?\([^)]*?(?:,\s*([\d.]+))?\)$/.exec(cs.backgroundColor);
    return {
      backgroundColor: cs.backgroundColor,
      opaque: cs.backgroundColor !== 'transparent' && (alpha?.[1] ?? '1') !== '0',
      titleColor: getComputedStyle(
        document.querySelector('.theme-link') as HTMLElement
      ).color,
    };
  });

  expect(header.opaque).toBe(true);
  expect(header.titleColor).toBe('rgb(255, 255, 255)');
});

test.describe('at desktop width', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('links show without a toggle', async ({ page }) => {
    await page.goto('./');

    // The mobile nav needed a z-index bump to be clickable at all; this guards
    // the >=900px layout, where the nav goes static and the toggle disappears.
    await expect(
      page.getByRole('button', { name: /toggle menu/i })
    ).toBeHidden();
    await expect(
      page.locator('#navbar').getByRole('link', { name: 'Projects' })
    ).toBeVisible();
  });
});
