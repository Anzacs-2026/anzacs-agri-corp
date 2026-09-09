-- Allow 'products' as a page_content page, so the Products catalog page
-- can have an admin-editable hero section like Home/About.

alter table page_content drop constraint if exists page_content_page_check;
alter table page_content add constraint page_content_page_check check (page in ('home', 'about', 'contact', 'products'));
