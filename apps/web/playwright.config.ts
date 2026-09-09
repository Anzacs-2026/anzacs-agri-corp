import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    // Chromium at an iPad viewport rather than the WebKit-based 'iPad Mini'
    // device preset — avoids requiring a separate WebKit browser install
    // just for a tablet breakpoint check.
    { name: 'Tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
  ],
})
