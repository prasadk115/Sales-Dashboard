-- RLS remains enabled on every table. These grants only let the authenticated
-- database role reach the tables so the existing SELECT policies can be evaluated.
grant usage on schema public to authenticated;
grant select on table public.sales_reps, public.customers, public.products, public.orders, public.order_items to authenticated;
