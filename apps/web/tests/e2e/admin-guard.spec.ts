import { test, expect } from '@playwright/test'

test('visiting /admin while logged out redirects to /admin/login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login$/)
})
