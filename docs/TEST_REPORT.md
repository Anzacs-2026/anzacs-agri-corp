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
