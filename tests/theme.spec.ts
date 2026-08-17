import { test, expect, type Page } from '@playwright/test';

// The theme script in Head.astro has to run synchronously while <head> is still
// parsing. Anything that defers it — a DOMContentLoaded wrapper, a bundled
// module script — gives a dark-mode visitor a flash of the light theme on every
// page load. These tests pin that behaviour down.

async function storeMode(page: Page, mode: string) {
  // Storage has to be written from a real page context; localStorage on the
  // initial about:blank origin throws.
  await page.goto('./');
  await page.evaluate((m) => localStorage.setItem('mode', m), mode);
}

test('a stored dark preference is applied to <html>', async ({ page }) => {
  await storeMode(page, 'dark_mode');
  await page.reload();

  await expect(page.locator('html')).toHaveClass(/dark_mode/);
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute(
    'content',
    'dark'
  );
});

test('a stored light preference wins over a dark system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await storeMode(page, 'light_mode');
  await page.reload();

  // Guards the prefers-color-scheme fallback in global.css: if that block were
  // still keyed off `body:not(.light_mode)` it would override this choice.
  await expect(page.locator('html')).toHaveClass(/light_mode/);
  await expect(page.locator('html')).not.toHaveClass(/dark_mode/);
});

test('tonality follows the system, and keeps following it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await storeMode(page, 'tonality');
  await page.reload();

  await expect(page.locator('html')).toHaveClass(/dark_mode/);
  // On tonality the OS stays in charge of scrollbars and form controls.
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute(
    'content',
    'light dark'
  );

  // The system flipping while the page is open must repaint rather than wait
  // for a reload — this is the matchMedia listener in Header.astro.
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveClass(/light_mode/);
});

test('the theme is already applied when DOMContentLoaded fires', async ({
  page,
}) => {
  await storeMode(page, 'dark_mode');

  // addInitScript runs before any script belonging to the page, so this
  // listener registers first and therefore fires first. If the theme script
  // ever gets wrapped in its own DOMContentLoaded handler again, the class will
  // not be there yet at this point — which is exactly the flash regression.
  await page.addInitScript(() => {
    (window as Window & { __classAtDCL?: string }).__classAtDCL =
      'listener never fired';
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        (window as Window & { __classAtDCL?: string }).__classAtDCL =
          document.documentElement.className;
      },
      { once: true }
    );
  });

  await page.reload();

  const classAtDCL = await page.evaluate(
    () => (window as Window & { __classAtDCL?: string }).__classAtDCL
  );
  expect(classAtDCL).toContain('dark_mode');
});

test('the document has one head and one body', async ({ page }) => {
  await page.goto('./');

  // The theme script depends on being inside <head>, which only holds while the
  // layout nests <Head> and <body> correctly. Emitting a <script> or <header>
  // before <body> makes the browser insert implied tags and silently drop the
  // explicit ones, and the structure stops being what the source looks like.
  const counts = await page.evaluate(() => ({
    heads: document.querySelectorAll('head').length,
    bodies: document.querySelectorAll('body').length,
    themeScriptInHead: !!document.querySelector('head > script:not([src])'),
    headerInBody: !!document.querySelector('body header'),
  }));

  expect(counts).toEqual({
    heads: 1,
    bodies: 1,
    themeScriptInHead: true,
    headerInBody: true,
  });
});
