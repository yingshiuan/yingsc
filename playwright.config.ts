import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

// astro.config.mjs sets `base: '/yingsc/'`, so every page lives under that
// prefix. Playwright resolves goto() as `new URL(path, baseURL)`, which means a
// leading slash escapes the base: goto('/projects') would 404. Keep the
// trailing slash here and use relative paths ('./', './projects') in tests.
const baseURL = `http://localhost:${PORT}/yingsc/`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // `preview` serves the real build, so the tests exercise the bundled and
    // minified scripts that actually ship rather than dev-server versions.
    command: 'npm run build && npm run preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
