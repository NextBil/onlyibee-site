-- ONLYIBEE — ARCADE PASSES: mint codes that grant ALL rooms + games at once.
-- Paste into Supabase → SQL Editor → Run. Safe to re-run. Run AFTER setup.sql.
--
-- Flow: you mint codes with tools/pass-minter.html (it prints the INSERT to paste
-- here), then share links like  https://onlyibee.com/arcade/pass/?c=CODE
-- The pass page (arcade/pass/) shows the loot preview, has the visitor join /
-- log in, then calls redeem_pass() → every active 'game' + 'environment' item
-- lands in their inventory, and roomgate lets them into every room they own.

-- ============ PASSES: one row per minted code ============
create table if not exists public.passes (
  code       text primary key,
  label      text,                          -- who/what this code was minted for
  max_uses   int  not null default 1,       -- how many DIFFERENT accounts may redeem it
  uses       int  not null default 0,
  active     boolean not null default true, -- flip off to kill a code
  created_at timestamptz not null default now()
);
alter table public.passes enable row level security;   -- no policies: functions only

-- who redeemed what (one redemption per account per code)
create table if not exists public.pass_redemptions (
  code    text not null references public.passes(code),
  user_id uuid not null references auth.users(id) on delete cascade,
  at      timestamptz not null default now(),
  primary key (code, user_id)
);
alter table public.pass_redemptions enable row level security;  -- functions only

-- ============ pass_status: preview a code before signing up (anon-safe) ============
create or replace function public.pass_status(pass_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare rec public.passes%rowtype;
begin
  select * into rec from public.passes where code = upper(trim(pass_code));
  if not found or not rec.active then return jsonb_build_object('status','invalid'); end if;
  if auth.uid() is not null and exists(
      select 1 from public.pass_redemptions where code = rec.code and user_id = auth.uid()) then
    return jsonb_build_object('status','owned','label',rec.label);
  end if;
  if rec.uses >= rec.max_uses then return jsonb_build_object('status','used'); end if;
  return jsonb_build_object('status','valid','label',rec.label,
    'seats_left', rec.max_uses - rec.uses);
end; $$;

-- ============ redeem_pass: grant EVERY active game + environment (idempotent) ============
create or replace function public.redeem_pass(pass_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); rec public.passes%rowtype; loot jsonb;
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  select * into rec from public.passes where code = upper(trim(pass_code)) for update;
  if not found or not rec.active then return jsonb_build_object('status','invalid'); end if;

  select coalesce(jsonb_agg(to_jsonb(i) order by i.type desc, i.id),'[]'::jsonb) into loot
    from public.items i where i.active and i.type in ('game','environment');

  -- already redeemed by this account → just show the loot again
  if exists(select 1 from public.pass_redemptions where code = rec.code and user_id = uid) then
    return jsonb_build_object('status','owned','items',loot);
  end if;
  if rec.uses >= rec.max_uses then return jsonb_build_object('status','used'); end if;

  insert into public.pass_redemptions(code,user_id) values (rec.code, uid);
  update public.passes set uses = uses + 1 where code = rec.code;
  insert into public.inventory(user_id,item_id,source_code)
    select uid, i.id, 'pass:'||rec.code
    from public.items i where i.active and i.type in ('game','environment')
    on conflict do nothing;

  return jsonb_build_object('status','granted','items',loot);
end; $$;

grant execute on function public.pass_status(text) to anon, authenticated;
grant execute on function public.redeem_pass(text) to authenticated;
