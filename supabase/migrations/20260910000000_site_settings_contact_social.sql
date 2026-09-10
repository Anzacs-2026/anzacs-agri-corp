-- Extends site_settings with contact email, a map embed, and social links so
-- the Contact page and Footer can show them, editable later from admin.
alter table site_settings
  add column contact_email text,
  add column map_embed_url text,
  add column social_facebook text,
  add column social_instagram text,
  add column social_twitter text,
  add column social_linkedin text,
  add column social_youtube text;

grant select (
  contact_email,
  map_embed_url,
  social_facebook,
  social_instagram,
  social_twitter,
  social_linkedin,
  social_youtube
) on site_settings to anon;
