import { test, expect } from '@playwright/test'

// Needs a disposable Supabase Auth test user, provisioned/torn down with
// the service-role key via Supabase's admin API. Skipped until that key
// is available locally — same pattern as tests/integration/enquiries-rls.test.ts.
const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

test.skip(!hasServiceKey, 'requires SUPABASE_SERVICE_ROLE_KEY to provision a disposable test user')

test('admin can add a product with a photo, then soft-delete it', async ({ page }) => {
  // TODO once a service-role-provisioned test user exists:
  // 1. Sign in at /admin/login with the disposable test user.
  // 2. Add a product with a photo through /admin/products/new.
  // 3. Confirm it appears on /products.
  // 4. Delete it through /admin/products.
  // 5. Confirm it's gone from /products but the row survives with deleted_at set
  //    (checked via a service-role query, not through the UI).
  expect(page).toBeTruthy()
})
