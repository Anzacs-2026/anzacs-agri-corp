-- product-images: public bucket, policies mirroring the products table.
-- Public buckets serve reads without an RLS check; only writes need policies.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_authenticated_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "product_images_authenticated_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images');

create policy "product_images_authenticated_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images');
