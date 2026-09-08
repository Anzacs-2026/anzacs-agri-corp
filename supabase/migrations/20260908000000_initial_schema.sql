-- ANZ Agricrop — initial schema, soft-delete columns, and RLS policies.
-- Access model: anon vs authenticated only (no roles table — see ARCHITECTURE.md).

create extension if not exists "pgcrypto";

-- ── products ────────────────────────────────────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  short_description text,
  description text,
  specs jsonb,
  traits text[],
  visible boolean not null default true,
  sort_order integer not null default 0,
  primary_photo_id uuid,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id)
);

-- ── photos ──────────────────────────────────────────────────────────────
create table photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  label text,
  alt_text text,
  product_id uuid references products(id),
  page text check (page in ('home', 'about', 'contact')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id)
);

alter table products
  add constraint products_primary_photo_fk foreign key (primary_photo_id) references photos(id);

-- ── page_content ────────────────────────────────────────────────────────
create table page_content (
  id uuid primary key default gen_random_uuid(),
  page text not null check (page in ('home', 'about', 'contact')),
  section_key text not null,
  content jsonb not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id),
  unique (page, section_key)
);

-- ── enquiries ───────────────────────────────────────────────────────────
create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id)
);

-- ── testimonials ────────────────────────────────────────────────────────
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  quote text not null,
  photo_url text,
  shown boolean not null default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id)
);

-- ── site_settings ───────────────────────────────────────────────────────
-- Single-row table. No soft delete — a settings row is edited, never removed.
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  testimonials_enabled boolean not null default false,
  notify_email text not null default 'nazar@anzacs.in',
  whatsapp_number text,
  contact_phone text,
  contact_address text,
  enquiry_subjects text[] not null default array['General enquiry', 'Request a quote'],
  created_at timestamptz not null default now()
);

-- ── server_logs ─────────────────────────────────────────────────────────
-- No soft delete — logs are append-only and never edited or restored.
create table server_logs (
  id uuid primary key default gen_random_uuid(),
  error_message text not null,
  stack text,
  context jsonb,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ── indexes ─────────────────────────────────────────────────────────────
create index products_visible_active_idx on products (visible, deleted_at);
create index products_slug_idx on products (slug);
create index photos_product_id_idx on photos (product_id);
create index enquiries_status_idx on enquiries (status);
create index enquiries_created_at_idx on enquiries (created_at desc);

-- ── row level security ──────────────────────────────────────────────────
alter table products enable row level security;
alter table photos enable row level security;
alter table page_content enable row level security;
alter table enquiries enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;
alter table server_logs enable row level security;

-- products: anon reads visible + active rows only; authenticated has full access
create policy "products_anon_select" on products
  for select to anon
  using (visible = true and deleted_at is null);

create policy "products_authenticated_all" on products
  for all to authenticated
  using (true)
  with check (true);

-- photos: same shape as products
create policy "photos_anon_select" on photos
  for select to anon
  using (deleted_at is null);

create policy "photos_authenticated_all" on photos
  for all to authenticated
  using (true)
  with check (true);

-- page_content: anon reads active content only
create policy "page_content_anon_select" on page_content
  for select to anon
  using (deleted_at is null);

create policy "page_content_authenticated_all" on page_content
  for all to authenticated
  using (true)
  with check (true);

-- enquiries: anon can INSERT ONLY, never SELECT.
-- This is the security boundary of the whole build — the anon key ships
-- inside the client bundle, so a permissive select here leaks every
-- customer's name, phone and email to anyone who opens dev tools.
create policy "enquiries_anon_insert" on enquiries
  for insert to anon
  with check (true);

create policy "enquiries_authenticated_all" on enquiries
  for all to authenticated
  using (true)
  with check (true);

-- testimonials: anon reads shown + active rows only; the site_settings
-- master switch is enforced in the query layer (withActiveOnly), not RLS,
-- since RLS cannot cheaply join against a second table's boolean here.
create policy "testimonials_anon_select" on testimonials
  for select to anon
  using (shown = true and deleted_at is null);

create policy "testimonials_authenticated_all" on testimonials
  for all to authenticated
  using (true)
  with check (true);

-- site_settings: anon reads public fields only via a view (see below);
-- direct table access for anon is select on the row, filtered to expose
-- only public-facing fields by column grants.
create policy "site_settings_anon_select" on site_settings
  for select to anon
  using (true);

create policy "site_settings_authenticated_all" on site_settings
  for all to authenticated
  using (true)
  with check (true);

revoke select on site_settings from anon;
grant select (testimonials_enabled, whatsapp_number, contact_phone, contact_address, enquiry_subjects) on site_settings to anon;

-- server_logs: anon has no access at all; authenticated can read (never insert from client)
create policy "server_logs_authenticated_select" on server_logs
  for select to authenticated
  using (true);

-- seed the single site_settings row
insert into site_settings (notify_email) values ('nazar@anzacs.in');
