import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config';

const allBrowserProjects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
];

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['html'], ['github']] : [['list'], ['html']],
  use: {
    baseURL: env.baseUrl,
    extraHTTPHeaders: env.xAccessKey ? { 'X-Access-Key': env.xAccessKey } : {},
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects:
    process.env.RUN_ALL_BROWSERS === '1'
      ? allBrowserProjects
      : [
          {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
          },
        ],
});
