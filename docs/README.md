# ANZ Agricrop Website

Rebuild of anzacs.in as a Vite + React + TypeScript + Supabase application.
Standard: E902 Engineering Playbook. Full plan: `ANZ_Agricrop_Website_Plan.pdf`
(client-provided).

## Structure

```
apps/web/           Vite + React + TS app (the site + admin)
netlify/functions/   Enquiry notification (Brevo), holds no secrets in code
supabase/            Migrations, seed data, config
docs/                This file, phase checklist, test report, architecture
```

## Setup

1. `npm install` at repo root (installs both the `apps/web` workspace and
   root-level Netlify Function tooling)
2. Copy `apps/web/.env.example` → `apps/web/.env` and fill in
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from your Supabase
   project (Settings → API)
3. Copy `.env.example` → `.env` at repo root for local Netlify Function
   testing (`BREVO_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) — never commit
   the filled-in `.env`

## Scripts (run inside `apps/web`)

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + `vite-react-ssg build` (prerenders public pages) |
| `npm run preview` | Serve the built `dist/` locally |
| `npm test` | Jest unit tests |
| `npm run test:e2e` | Playwright E2E tests (starts preview server automatically) |

Root-level:

| Script | What it does |
|---|---|
| `npm run test:functions` | Jest tests for `netlify/functions/*` |

## Environment variables

**Client (`apps/web/.env`, `VITE_` prefix — safe to expose, RLS is the
access-control boundary):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Netlify dashboard only (never in a committed `.env`, never in client code):**
- `BREVO_API_KEY` — transactional-send-only Brevo key
- `SUPABASE_SERVICE_ROLE_KEY` — used only by
  `netlify/functions/send-enquiry-notification.ts` to write failure logs to
  `server_logs` (anon has no insert policy on that table by design)

## Database migrations

Migrations live in `supabase/migrations/`, timestamped, one concern per
file. Run against the linked Supabase project with the Supabase CLI:

```
supabase link --project-ref <project-ref>
supabase db push
```

See `docs/ARCHITECTURE.md` for the RLS policy table and other key decisions.
