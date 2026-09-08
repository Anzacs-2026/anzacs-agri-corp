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

---

## 2026-09-09 — Phase 2: Public layout & shared components

**Feature:** Header/Footer/Section, shared `components/ui` primitives (Button, Input, Label, Textarea, Card), `site_settings` read hook

**Test files:**
- `apps/web/tests/unit/components/ui/Button.test.tsx`
- `apps/web/tests/unit/components/Header.test.tsx`
- `apps/web/tests/unit/components/Footer.test.tsx`

**Results:**
- Jest unit (`apps/web`): 16 passed, 16 total (9 new, 7 carried over from Phase 1, all still passing after the LoginForm/AdminDashboard refactor to shared components)
  - Button renders children, variant classes (primary/secondary/outline), disabled state — all PASS
  - Header renders wordmark and all 4 nav links with correct hrefs — PASS
  - Footer renders tagline while loading, renders contact fields once `site_settings` resolves, renders gracefully (no "null" text) when fields are unset — all PASS
- Playwright E2E: 2 passed, 2 total (unchanged specs, confirms the Layout refactor didn't break routing)
- `tsc -b`: clean, no errors
- `npm run build`: 6 pages prerendered; nav links and tagline confirmed present in static HTML; contact fields correctly absent from the SSG-time snapshot (query resolves client-side post-hydration, by design) with no error thrown during the build's server render

**Note:** Second `import.meta.env`-via-mocked-module gotcha found and fixed — `Footer.test.tsx`'s `jest.mock('@/hooks/useSiteSettings')` needed an explicit factory (bare automock still transitively loads `@/lib/supabase.ts` to learn the real module's shape). Same rule as Phase 1: always use an explicit factory when mocking anything upstream of the Supabase client.

**Coverage:** not yet measured

**Date:** 2026-09-09
