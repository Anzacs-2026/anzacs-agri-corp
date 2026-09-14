-- Run this in Supabase SQL Editor after the existing schema is installed.
-- Seeds only the three supplied homepage testimonials.

begin;

update public.site_settings
set testimonials_enabled = true;

update public.testimonials
set shown = false
where customer_name not in ('Md. Adnan', 'Mirza Shoeb', 'Swamy Chinna')
  and deleted_at is null;

update public.testimonials as existing
set quote = seed.quote,
    photo_url = seed.photo_url,
    shown = true
from (
  values
    ('Md. Adnan', 'ANZ Agricrop provides dependable seed quality and support for every growing season.', '/testimonials/Md-Adnan.png'),
    ('Mirza Shoeb', 'The team understands farming needs and helps us choose better solutions for our fields.', '/testimonials/Mirza-Shoeb.png'),
    ('Swamy Chinna', 'Reliable products and practical guidance have made a real difference to our crop production.', '/testimonials/Swamy-Chinna.png')
) as seed(customer_name, quote, photo_url)
where existing.customer_name = seed.customer_name
  and existing.deleted_at is null;

insert into public.testimonials (customer_name, quote, photo_url, shown)
select seed.customer_name, seed.quote, seed.photo_url, true
from (
  values
    ('Md. Adnan', 'ANZ Agricrop provides dependable seed quality and support for every growing season.', '/testimonials/Md-Adnan.png'),
    ('Mirza Shoeb', 'The team understands farming needs and helps us choose better solutions for our fields.', '/testimonials/Mirza-Shoeb.png'),
    ('Swamy Chinna', 'Reliable products and practical guidance have made a real difference to our crop production.', '/testimonials/Swamy-Chinna.png')
) as seed(customer_name, quote, photo_url)
where not exists (
  select 1
  from public.testimonials existing
  where existing.customer_name = seed.customer_name
    and existing.deleted_at is null
);

commit;
