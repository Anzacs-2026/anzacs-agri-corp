# Architecture decisions

Record of key patterns and why, per E902 §07/§08. Append, never delete history.

## No roles table

Admin identity is Supabase's built-in `auth.users`. There is no `roles` /
`user_roles` hierarchy. With a single owner account and at most one staff
login sharing identical permissions, a roles hierarchy is YAGNI. RLS
distinguishes `anon` from `authenticated`, which is the entire access model
this site needs. If owner-versus-staff permissions are ever required, it is
a migration, not a rebuild.

## Netlify Functions, not Supabase Edge Functions

The one server-side operation this project has — sending the enquiry
notification — runs as a Netlify Function. The site already deploys to
Netlify; adding Supabase Edge Functions would mean two deploy pipelines for
one function.

## Deferred: client-side trackEvent() / ui_events

The E902 default includes UI event tracking. There is no analytics consumer
on this project and the owner has no use for the data yet — building the
pipeline now would be speculative. Add it as a single feature slice
whenever a real analytics requirement appears.

## Brevo sender address — Option A (Brevo shared domain)

Brevo will not send from `@anzacs.in` until the domain is authenticated
(SPF/DKIM/verification DNS records), and the brief freezes DNS changes
until cutover. Chosen: **Option A** — Brevo's shared sending domain, no DNS
changes, ANZ named as display sender. The only recipient is an internal
inbox (nazar@anzacs.in) that can whitelist the sender, so deliverability
risk is low. Revisit as **Option B** (authenticate anzacs.in) at domain
cutover, when DNS is being edited anyway.

Client confirmed: Brevo free tier plan for now.

## Enquiry notification requires SUPABASE_SERVICE_ROLE_KEY in Netlify

The Netlify Function logs Brevo failures to `server_logs`. Anon has no
insert policy on that table (by design — see RLS table below), so the
function uses the Supabase **service role** key, kept as a Netlify
environment variable, never in client code. This is in addition to
`BREVO_API_KEY`.

## Prerendering trade-off

`vite-react-ssg` prerenders Home, About, Contact and the Products index at
build time. Product detail routes (`/products/:slug`) are database-driven
and are NOT prerendered at this stage — they render client-side, with a
Netlify redirect (`/products/*` → `/index.html`, 200) so direct navigation
and refreshes don't 404. Revisit prerendering per-product once the real
catalogue lands (Phase 6) and page count is known; per-product prerendering
on every deploy is the natural next step if SEO on individual product pages
becomes a priority.

## RLS policy summary

| Table | anon | authenticated |
|---|---|---|
| products, photos, page_content | select where visible/active | full |
| testimonials | select where shown + active | full |
| site_settings | select on public columns only (column grants) | full |
| enquiries | insert only — never select | full |
| server_logs | none | select |

## Accepted risk: react-router advisory (no fix available)

`npm audit` flags `react-router` 6.0.0–7.17.0 (open redirect via backslash
in `Link`/`useNavigate`) with no fix currently published. Plan pins React
Router v6 (required by `vite-react-ssg`'s peer dependency). This site has
no user-supplied redirect targets — all routes are static or database-slug
driven, not attacker-controlled URLs — so exposure is low. Tracked here;
revisit when a fixed version ships.

## Favicon exception — pending client sign-off

See open item in project docs / final plan §03. The brand guidelines'
90px lockup minimum and no-crop rule cannot both be satisfied at
16–32px tab size. Current placeholder in `apps/web/public/favicon.svg` is
a temporary green disc, NOT the final emblem-only design — needs the real
logo master files and ANZ's sign-off before Phase 7.
