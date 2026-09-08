# Phase checklist

Living checklist, updated every session. Never delete history — mark items
done, in progress, or deferred.

## Phase 0 — Scaffold (Low effort)

- [x] Monorepo scaffold (`apps/web`, `netlify/functions`, `supabase/`, `docs/`)
- [x] Vite + React 18 + TypeScript strict
- [x] Tailwind wired with §03 brand tokens (`tailwind.config.ts`)
- [x] shadcn/ui dependencies installed, behind `components/ui` (components pending Phase 2)
- [x] Placeholder favicon/logo into `public/` — REAL assets pending from client
- [x] Supabase client (`src/lib/supabase.ts`) + `.env.example`
- [x] Prerender configuration (`vite-react-ssg`) — decided at Phase 0, not retrofitted
- [x] CI-ready build (`npm run build` = typecheck + SSG build), verified locally
- [x] Empty Jest/Playwright harness with one smoke test each
- [x] Root `.env.example` documenting `BREVO_API_KEY` + `SUPABASE_SERVICE_ROLE_KEY`
- [x] Netlify Function: `send-enquiry-notification` (Brevo call, insert-independent failure handling), unit tested (success + 2 failure paths)
- [x] Supabase migration: full schema, soft-delete columns, RLS policies
- [x] Push to GitHub (`Anzacs-2026/anzacs-agri-corp`, `main`)
- [x] Supabase migration run against live project (`jqroehofufcetjekojxt`) — schema + RLS confirmed via SQL Editor
- [x] Netlify site connected + env vars set, live at anzacs.netlify.app — all 5 routes return 200 with prerendered content confirmed in raw HTML
- [ ] `BREVO_API_KEY` — deferred (Brevo phone verification pending); function fails safe without it (logs to server_logs, never blocks an enquiry)

**Phase 0 complete: 2026-09-08.**

## Phase 1 — Auth, schema, RLS (Medium/High effort)

- [x] Supabase Auth email/password wired in `features/auth` (`authService`, `AuthProvider`, `useAuth`, `LoginForm`)
- [ ] Seeded owner account (manual, root-only — no self-service signup) — pending you creating it in the Supabase dashboard (Authentication → Users → Add user)
- [x] `/admin/*` protected route guard (`ProtectedRoute`), verified via Playwright (redirects to `/admin/login` when logged out) and confirmed no dashboard content leaks into the prerendered `/admin` static HTML
- [x] Anonymous select on `enquiries` fails (security-boundary test) — `tests/integration/enquiries-rls.test.ts`, plants + cleans up a canary row via service-role client; skips gracefully without `SUPABASE_SERVICE_ROLE_KEY` locally, run manually to execute against the live project

## Phase 2 — Public layout & shared components (Medium effort)

- [ ] Header with nav + logo, footer with tagline + contact
- [ ] Shared brand components: buttons, cards, section wrappers, form controls

## Phase 3 — Products (Medium-High effort)

- [ ] Public grid, client-side search, crop/category filter
- [ ] Detail page with related products
- [ ] Admin CRUD with Storage photo upload, visible/hidden toggle, soft delete
- [ ] Soft-delete test: deleted product gone from public site, row survives with `deleted_at` set

## Phase 4 — Page content & media (Medium effort)

- [ ] Home/About/Contact wired to `page_content`
- [ ] Admin Pages text editor
- [ ] Photos media library with labels/tagging

## Phase 5 — Enquiry flow (Medium effort, High for failure path)

- [ ] Enquiry form → insert → Netlify Function → Brevo notification (function already built in Phase 0, needs form wiring)
- [ ] Click-to-call and WhatsApp links
- [ ] Admin Enquiries list with status workflow + Excel export
- [ ] Test: enquiry insert succeeds when Brevo call fails (already covered at function level — extend to full form flow)
- [ ] Resolve Brevo sender domain question before this phase ships (Option A confirmed — see ARCHITECTURE.md)

## Phase 6 — Testimonials & seed (Low-Medium effort)

- [ ] Testimonials CRUD behind `site_settings` master switch
- [ ] Placeholder product seed (hybrid maize, vegetable varieties, NPK fertilizer, bio-stimulant)

## Phase 7 — Polish (Low-Medium effort)

- [ ] Responsive pass (mobile/tablet/desktop)
- [ ] Accessibility hygiene
- [ ] Per-page SEO + Open Graph metadata
- [ ] Route-based code splitting
- [ ] Query key normalization
- [ ] Bundle analysis
- [ ] Real favicon set (client sign-off required — see ARCHITECTURE.md)

## Phase 8 — Handoff

- [ ] Repo committed locally, owner walkthrough recorded
- [ ] GitHub push on explicit approval
- [ ] Netlify deploy on explicit approval
- [ ] No DNS changes at any point (until cutover)
