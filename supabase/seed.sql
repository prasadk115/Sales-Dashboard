-- Idempotent synthetic demo data. It is safe to run repeatedly in the Supabase SQL Editor.
insert into public.sales_reps (full_name, email) values
  ('Anika Desai', 'anika@revenue-studio.example')
on conflict (email) do update set full_name = excluded.full_name;

insert into public.customers (name, company_name, email) values
  ('Aarav Mehta', 'Northstar Labs', 'aarav@northstarlabs.example'),
  ('Maya Iyer', 'Veridian Health', 'maya@veridian.example'),
  ('Karan Shah', 'Sable & Co.', 'karan@sable.example'),
  ('Nisha Rao', 'Forma Studio', 'nisha@forma.example')
on conflict (email) do update set name = excluded.name, company_name = excluded.company_name;

insert into public.products (name, sku, unit_price) values
  ('Enterprise annual plan', 'ENT-ANNUAL', 18600.00),
  ('Growth annual plan', 'GROW-ANNUAL', 7400.00),
  ('Starter annual plan', 'START-ANNUAL', 2800.00)
on conflict (sku) do update set name = excluded.name, unit_price = excluded.unit_price, active = true;

insert into public.orders (order_number, customer_id, sales_rep_id, status, total_amount, ordered_at)
select 'ORD-1001', customer.id, rep.id, 'paid', 18600.00, '2026-11-24T10:15:00Z'::timestamptz
from public.customers customer cross join public.sales_reps rep
where customer.email = 'aarav@northstarlabs.example' and rep.email = 'anika@revenue-studio.example'
on conflict (order_number) do update set customer_id = excluded.customer_id, sales_rep_id = excluded.sales_rep_id, status = excluded.status, total_amount = excluded.total_amount, ordered_at = excluded.ordered_at;

insert into public.orders (order_number, customer_id, sales_rep_id, status, total_amount, ordered_at)
select 'ORD-1002', customer.id, rep.id, 'paid', 7400.00, '2026-11-22T14:30:00Z'::timestamptz
from public.customers customer cross join public.sales_reps rep
where customer.email = 'maya@veridian.example' and rep.email = 'anika@revenue-studio.example'
on conflict (order_number) do update set customer_id = excluded.customer_id, sales_rep_id = excluded.sales_rep_id, status = excluded.status, total_amount = excluded.total_amount, ordered_at = excluded.ordered_at;

insert into public.orders (order_number, customer_id, sales_rep_id, status, total_amount, ordered_at)
select 'ORD-1003', customer.id, rep.id, 'pending', 2800.00, '2026-11-21T09:45:00Z'::timestamptz
from public.customers customer cross join public.sales_reps rep
where customer.email = 'karan@sable.example' and rep.email = 'anika@revenue-studio.example'
on conflict (order_number) do update set customer_id = excluded.customer_id, sales_rep_id = excluded.sales_rep_id, status = excluded.status, total_amount = excluded.total_amount, ordered_at = excluded.ordered_at;

insert into public.order_items (order_id, product_id, quantity, unit_price)
select orders.id, products.id, 1, products.unit_price
from public.orders orders join public.products products on (orders.order_number = 'ORD-1001' and products.sku = 'ENT-ANNUAL') or (orders.order_number = 'ORD-1002' and products.sku = 'GROW-ANNUAL') or (orders.order_number = 'ORD-1003' and products.sku = 'START-ANNUAL')
on conflict (order_id, product_id) do update set quantity = excluded.quantity, unit_price = excluded.unit_price;
