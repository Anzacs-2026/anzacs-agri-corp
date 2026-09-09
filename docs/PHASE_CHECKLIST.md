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

- [x] Responsive pass (mobile/tablet/desktop) — manual check at 375/768/1280px across Home, Products (grid+list), and admin login found no layout defects; added `Mobile Chrome`/`Tablet` Playwright projects (`playwright.config.ts`) so the existing e2e specs now run at 3 breakpoints, not just desktop
- [x] Accessibility hygiene — fixed a real WCAG 2.4.7 bug (`Input`/`Textarea`/two raw `<select>`s removed focus outline with no visible replacement, now have a focus ring), added the `jsx-a11y` oxlint plugin and fixed every finding (mobile-drawer backdrop, unlabeled visibility checkbox, `role="status"`→`<output>`, login autocomplete attributes), and bumped muted text opacity (`/50`/`/60` → `/70`) that measured under 4.5:1 contrast on cream/white backgrounds
- [x] Per-page SEO + Open Graph metadata — new `Seo` component (`src/components/Seo.tsx`) wraps `vite-react-ssg`'s `Head` (react-helmet-async), used on every route with real per-page title/description/OG/canonical, `noindex` on admin routes; verified the actual prerendered HTML gets unique tags per page with no duplicate `<title>`
- [x] Route-based code splitting — the entire `/admin/*` subtree is now `React.lazy`-loaded; public bundle dropped from ~565 KB to 69 KB (gzip 21 KB), admin code (~330 KB incl. icons/query client) only loads for authenticated admin users
- [x] Query key normalization — `usePageContent` used `['page_content', page]` (DB table name) while every other feature used its module name (`['products', ...]`, `['testimonials', ...]`); renamed to `['pages', page]` for a consistent `[feature, ...qualifiers]` / `['admin', feature, ...qualifiers]` convention app-wide
- [x] Bundle analysis — added `rollup-plugin-visualizer` behind `npm run analyze` (`ANALYZE=true`, never runs in normal builds), confirms clean post-split composition, no accidental dupes
- [x] Real favicon set — generated from the real logo (no more client sign-off blocker, see `docs/ARCHITECTURE.md`): `favicon-16x16.png`/`favicon-32x32.png` (leaf mark), `apple-touch-icon.png` + `icon-192.png`/`icon-512.png` (circular badge) + `site.webmanifest`; no `.ico` (unnecessary for evergreen browsers)

**Phase 7 complete: 2026-09-09.**

## Phase 8 — Handoff

- [x] Repo committed locally — all Phase 7 work committed; owner walkthrough recording is on you (script available on request)
- [ ] GitHub push on explicit approval — held per your instruction to ask before any push (auto-deploy consumes Netlify credits)
- [ ] Netlify deploy on explicit approval — same gate as the push above (auto-deploys from `main`); separately confirm `BREVO_API_KEY`/`SUPABASE_SERVICE_ROLE_KEY`/`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are actually set in the Netlify dashboard (`BREVO_API_KEY` was still marked deferred as of Phase 0)
- [x] No DNS changes at any point (until cutover) — none made; `Seo`'s `SITE_URL` constant needs updating at actual domain cutover
