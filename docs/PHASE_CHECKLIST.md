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

- [x] Header with nav (text wordmark, no logo image yet — pending client asset) + footer with tagline + contact (`whatsapp_number`/`contact_phone`/`contact_address` read live from `site_settings`, plain text — click-to-call/WhatsApp links are Phase 5)
- [x] Shared brand components: `components/ui/{button,input,label,textarea,card}.tsx` (hand-rolled, shadcn-shaped per your call — swappable for real shadcn/Radix later without touching feature code), `components/Section.tsx`
- [x] DRY refactor: `LoginForm`/`AdminDashboard` now use the shared `Button`/`Input`/`Label` instead of ad-hoc styling

**Phase 2 complete: 2026-09-09.**

## Phase 3 — Products (Medium-High effort)

- [x] Public grid, client-side search, crop/category filter
- [x] Detail page with related products
- [x] Admin CRUD with Storage photo upload, visible/hidden toggle, soft delete
- [x] Soft-delete test: covered at the service layer (`softDeleteProduct` calls `.update`, never `.delete`); a full live E2E version is skip-guarded pending `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Storage migration (`product-images` bucket) run against the live project — pending, same manual step as the Phase 0 schema migration

**Phase 3 complete: 2026-09-09** (migration run pending your action).

## Phase 4 — Page content & media (Medium effort)

- [x] Home/About/Contact wired to `page_content` (fixed section keys per page — copy not finalized yet, falls back to existing placeholder text when a section has no row)
- [x] Admin Pages text editor (`/admin/pages` — page selector, one textarea per section, per-section save)
- [x] Photos media library with labels/tagging (`/admin/photos` — upload, inline label edit, soft delete; reuses the `product-images` bucket from Phase 3, so also pending that migration being run)

**Phase 4 complete: 2026-09-09** (Storage migration run still pending your action — see Phase 3).

## Phase 5 — Enquiry flow (Medium effort, High for failure path)

- [x] Enquiry form → insert → Netlify Function → Brevo notification (`features/enquiries`, wired into `/contact`; notification call is fire-and-forget, never blocks the visitor's success state)
- [x] Click-to-call and WhatsApp links (Footer + Contact, `tel:`/`wa.me` links from `site_settings`)
- [x] Admin Enquiries list with status workflow + CSV export (`/admin/enquiries` — status dropdown per row, confirm-before-delete, client-side CSV download; Excel opens `.csv` natively, no new dependency)
- [x] Test: enquiry insert succeeds when Brevo/notification call fails, at the full-form-flow level (`EnquiryForm.test.tsx`), extending the existing function-level coverage
- [x] Resolve Brevo sender domain question before this phase ships (Option A confirmed — see ARCHITECTURE.md) — no change needed, notification function already built to that spec

**Phase 5 complete: 2026-09-09.**

## Phase 6 — Testimonials & seed (Low-Medium effort)

- [x] Testimonials CRUD behind `site_settings` master switch (`/admin/testimonials` — inline add/edit, shown toggle, confirm-before-delete, master switch checkbox on the same page; public "What growers say" section on Home gated on the switch)
- [x] Placeholder product seed — superseded by the real 24-product catalog (`supabase/seed/products.sql`, grouped into 4 broad categories: Gourds & Melons, Solanaceous Vegetables, Brassicas, Other Vegetables & Herbs) plus real company content on Home/About

**Phase 6 complete: 2026-09-09.** Also shipped ahead of schedule: admin sidebar redesign with nested Pages sub-menu (Home/About/Contact, Photos folded in as inline per-section image uploads — no more standalone media library), a reusable `Hero` component with 3 admin-selectable variants (Split/Mockup/Minimal) and per-page image upload, real ANZ Agricrop branding (logo, favicon), product photo display (grid/list view + pagination on the public catalog), and premium visual polish across the public site.

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
