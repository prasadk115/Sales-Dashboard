create extension if not exists "pgcrypto";

create table public.sales_reps (id uuid primary key default gen_random_uuid(), full_name text not null, email text not null unique, created_at timestamptz not null default now());
create table public.customers (id uuid primary key default gen_random_uuid(), name text not null, company_name text, email text not null unique, created_at timestamptz not null default now());
create table public.products (id uuid primary key default gen_random_uuid(), name text not null, sku text not null unique, unit_price numeric(12,2) not null check (unit_price >= 0), active boolean not null default true, created_at timestamptz not null default now());
create table public.orders (id uuid primary key default gen_random_uuid(), order_number text not null unique, customer_id uuid not null references public.customers(id) on delete restrict, sales_rep_id uuid references public.sales_reps(id) on delete set null, status text not null default 'pending' check (status in ('pending','paid','cancelled','refunded')), total_amount numeric(12,2) not null default 0 check (total_amount >= 0), ordered_at timestamptz not null default now(), created_at timestamptz not null default now());
create table public.order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, product_id uuid not null references public.products(id) on delete restrict, quantity integer not null check (quantity > 0), unit_price numeric(12,2) not null check (unit_price >= 0), created_at timestamptz not null default now(), unique(order_id, product_id));
create index orders_customer_id_idx on public.orders(customer_id); create index orders_ordered_at_idx on public.orders(ordered_at desc); create index order_items_order_id_idx on public.order_items(order_id);

alter table public.sales_reps enable row level security; alter table public.customers enable row level security; alter table public.products enable row level security; alter table public.orders enable row level security; alter table public.order_items enable row level security;
-- Demo policy: signed in users may read dashboard data. Add organization_id plus membership checks before enabling writes.
create policy "authenticated users can read sales reps" on public.sales_reps for select to authenticated using (true);
create policy "authenticated users can read customers" on public.customers for select to authenticated using (true);
create policy "authenticated users can read products" on public.products for select to authenticated using (true);
create policy "authenticated users can read orders" on public.orders for select to authenticated using (true);
create policy "authenticated users can read order items" on public.order_items for select to authenticated using (true);
