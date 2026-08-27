import { test, expect } from '@playwright/test';
import { seedConsent } from './consent';

const loadMore = /load more projects/i;

test.beforeEach(async ({ page }) => {
  await seedConsent(page);
});

test('focus stays in the page when the button removes itself', async ({
  page,
}) => {
  await page.goto('./');

  const button = page.getByRole('button', { name: loadMore });
  await expect(button).toBeVisible();

  // Bounded, so a logic change in the reveal step cannot hang the suite.
  for (let i = 0; i < 10 && (await button.isVisible()); i++) {
    await button.click();
  }
  await expect(button).toBeHidden();

  const focused = await page.evaluate(() => ({
    tag: document.activeElement?.tagName ?? null,
    isCard:
      document.activeElement?.classList.contains('project-item') ?? false,
  }));

  // BODY means focus fell back to the document root when the focused button was
  // hidden, so the next Tab restarts from the top of the page.
  expect(focused.tag).not.toBe('BODY');
  expect(focused.isCard).toBe(true);
});

test('revealing cards is announced', async ({ page }) => {
  await page.goto('./');

  const status = page.locator('#load-more-status');
  await expect(status).toHaveAttribute('role', 'status');
  await expect(status).toBeEmpty();

  await page.getByRole('button', { name: loadMore }).click();

  // Without this a screen-reader user gets no feedback that the click did
  // anything: revealing cards is an otherwise silent DOM change.
  await expect(status).toHaveText(/more projects? shown/);
});

test('hidden cards are out of the tab order until revealed', async ({
  page,
}) => {
  await page.goto('./');

  const hidden = page.locator('.project-item.hidden');
  await expect(hidden.first()).toBeHidden();

  // display:none keeps the links inside from being tabbable, so there is no
  // keyboard trap in the collapsed state.
  const reachable = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.project-item.hidden a')).filter(
      (a) => (a as HTMLElement).offsetParent !== null
    ).length
  );
  expect(reachable).toBe(0);
});
