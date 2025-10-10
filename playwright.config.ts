import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Look for tests only in the e2e directory
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Run tests for public pages and the main authenticated page
      testMatch: /(app|login|registration)\.spec\.ts/,
    },
  ],

  webServer: {
    command: 'pnpm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
});
