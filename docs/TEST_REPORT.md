# Test report

Append-only log of test runs per feature. Never edit past entries — add new
ones below.

---

## 2026-09-08 — Phase 0 scaffold

**Feature:** Monorepo scaffold, prerendering, Netlify enquiry-notification function

**Test files:**
- `apps/web/tests/unit/smoke.test.ts` (harness smoke test)
- `apps/web/tests/e2e/smoke.spec.ts` (harness smoke test)
- `netlify/functions/send-enquiry-notification.test.ts`

**Results:**
- Jest (`apps/web`): 1 passed, 1 total
- Jest (root, functions): 3 passed, 3 total
  - sends the email on the success path — PASS
  - logs to server_logs and still returns 200 when Brevo fails — PASS
  - logs and returns 200 when the Brevo call throws (network failure) — PASS
- `tsc -b` (apps/web strict mode): clean, no errors
- `npm run build` (apps/web, vite-react-ssg): 5 pages prerendered (`/`, `/about`, `/contact`, `/products`, `/admin/login`), content confirmed present in served static HTML (not only post-hydration)

**Coverage:** not yet measured (no coverage threshold configured at Phase 0; introduce with first real feature slice in Phase 1)

**Date:** 2026-09-08

---

## 2026-09-09 — Phase 1: Auth, route guard, RLS boundary test

**Feature:** Supabase Auth email/password, `/admin/*` client-side route guard, enquiries anonymous-select security boundary

**Test files:**
- `apps/web/tests/unit/features/auth/LoginForm.test.tsx`
- `apps/web/tests/unit/features/auth/ProtectedRoute.test.tsx`
- `apps/web/tests/integration/enquiries-rls.test.ts` (live Supabase, not mocked)
- `apps/web/tests/e2e/admin-guard.spec.ts`

**Results:**
- Jest unit (`apps/web`): 7 passed, 7 total (includes prior Phase 0 smoke test)
  - LoginForm renders email/password fields — PASS
  - LoginForm navigates to /admin on successful sign in — PASS
  - LoginForm shows error message on failed sign in — PASS
  - ProtectedRoute renders nothing while loading — PASS
  - ProtectedRoute redirects to /admin/login with no session — PASS
  - ProtectedRoute renders protected content with a session — PASS
- Jest integration (`apps/web`, `test:integration`): 1 skipped (no `SUPABASE_SERVICE_ROLE_KEY` configured locally) — run manually once available; plants a canary row via service-role client, confirms anon sees zero rows, cleans up after
- Playwright E2E: 2 passed, 2 total — includes "/admin redirects to /admin/login when logged out"
- `tsc -b`: clean, no errors
- `npm run build`: 6 pages prerendered including `/admin` and `/admin/login`; confirmed `/admin`'s prerendered HTML contains no dashboard content (empty `<main>`, loading state during SSG build — by design, since `ProtectedRoute`/`AdminLogin` render nothing until the client resolves the session)

**Coverage:** not yet measured

**Date:** 2026-09-09
