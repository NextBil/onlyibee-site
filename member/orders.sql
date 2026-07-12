-- =====================================================================
-- IBEE ORDERS — run this ONCE in Supabase → SQL Editor.
-- The checkout page (product-page/checkout.html) records every order here.
-- INSERT-ONLY for the public anon key: visitors can create orders but can
-- NEVER read, change or delete them. You read them in Supabase →
-- Table Editor → orders (newest first: sort by created_at).
-- =====================================================================
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  product_id   text,
  product_name text,
  price        numeric,
  currency     text,
  buyer_name   text,
  email        text,
  address      text,
  note         text,
  method       text,    -- 'paypal' | 'stripe-link' | 'paypal-me' | 'invoice'
  pay_ref      text,    -- PayPal capture id when paid on-page
  status       text default 'new'   -- 'paid' | 'pending' | 'new'
);

alter table public.orders enable row level security;

-- anyone may write an order…
drop policy if exists "orders: public insert" on public.orders;
create policy "orders: public insert" on public.orders
  for insert to anon, authenticated with check (true);

-- …nobody (with the public key) may read them. No select/update/delete
-- policies on purpose — only the dashboard / service role sees orders.
