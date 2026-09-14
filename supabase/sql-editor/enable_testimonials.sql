-- Run this script in Supabase SQL Editor after the schema already exists.
-- It does not recreate or modify the initial schema tables.

begin;

-- Enable the testimonials section for the existing settings row.
update public.site_settings
set testimonials_enabled = true
where testimonials_enabled is distinct from true;

-- Keep future settings rows enabled by default.
alter table public.site_settings
  alter column testimonials_enabled set default true;

commit;
