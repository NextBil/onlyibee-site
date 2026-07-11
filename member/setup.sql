-- ONLYIBEE — accounts + collectible inventory + single-use card claims
-- Paste ALL of this into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.

-- ============ ITEMS: the loot catalog (games, songs, environments, clothes) ============
create table if not exists public.items (
  id      text primary key,             -- 'game-runner', 'env-aqua', 'tee-cow-green', ...
  name    text not null,
  type    text not null,                -- 'game' | 'environment' | 'song' | 'clothing' | 'collectible' | 'exclusive'
  rarity  text not null default 'common',   -- 'common' | 'rare' | 'epic' | 'legendary'
  value   int  not null default 0,      -- worth (how sophisticated/costly to make)
  image   text,
  payload text,                         -- game route / file url / info
  weight  int  not null default 100,    -- draw odds (rarer = smaller number)
  active  boolean not null default true -- in the pool?
);
alter table public.items enable row level security;
drop policy if exists "items readable" on public.items;
create policy "items readable" on public.items for select using (true);

-- ============ INVENTORY: what each account owns ============
create table if not exists public.inventory (
  user_id     uuid not null references auth.users(id),
  item_id     text not null references public.items(id),
  source_code text,
  obtained_at timestamptz not null default now(),
  primary key (user_id, item_id)
);
alter table public.inventory enable row level security;
drop policy if exists "read own inventory" on public.inventory;
create policy "read own inventory" on public.inventory for select using (user_id = auth.uid());

-- ============ CARDS: one row per physical NFC card ============
create table if not exists public.cards (
  code       text primary key,
  drop_code  text not null,
  serial     int,
  claimed_by uuid references auth.users(id),
  claimed_at timestamptz,
  item_id    text references public.items(id),
  created_at timestamptz not null default now()
);
alter table public.cards add column if not exists item_id text references public.items(id);
alter table public.cards enable row level security;   -- no policies: access only via functions

-- ============ card_status: read a card's state (available / SEAT TAKEN / owned) ============
create or replace function public.card_status(card_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare rec public.cards%rowtype; declare pick public.items%rowtype;
begin
  select * into rec from public.cards where code = card_code;
  if not found then return jsonb_build_object('status','invalid'); end if;
  if rec.claimed_by is null then
    return jsonb_build_object('status','available','serial',rec.serial,'drop',rec.drop_code);
  elsif rec.claimed_by = auth.uid() then
    select * into pick from public.items where id = rec.item_id;
    return jsonb_build_object('status','owned','item',to_jsonb(pick));
  else
    return jsonb_build_object('status','taken');
  end if;
end; $$;

-- ============ claim_card: claim ONCE + draw a random unowned item (race-safe, weighted) ============
create or replace function public.claim_card(card_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); declare rec public.cards%rowtype; declare pick public.items%rowtype;
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  select * into rec from public.cards where code = card_code;
  if not found then return jsonb_build_object('status','invalid'); end if;
  if rec.claimed_by is not null then
    if rec.claimed_by = uid then
      select * into pick from public.items where id = rec.item_id;
      return jsonb_build_object('status','owned','item',to_jsonb(pick));
    else
      return jsonb_build_object('status','taken');
    end if;
  end if;
  update public.cards set claimed_by = uid, claimed_at = now()
    where code = card_code and claimed_by is null;
  if not found then return jsonb_build_object('status','taken'); end if;   -- someone beat us
  select * into pick from public.items
    where active and id not in (select item_id from public.inventory where user_id = uid)
    order by power(random(), 1.0/greatest(weight,1)) desc limit 1;         -- weighted draw
  if not found then return jsonb_build_object('status','claimed','item',null); end if;
  insert into public.inventory(user_id,item_id,source_code) values (uid,pick.id,card_code) on conflict do nothing;
  update public.cards set item_id = pick.id where code = card_code;
  return jsonb_build_object('status','claimed','item',to_jsonb(pick));
end; $$;

-- ============ claim_card_pick: claim ONCE + grant the room the member CHOSE (Pokémon starter) ============
-- The member picks 1 of the 3 starter games; the other two are found later. Server-side we only
-- allow a pick that is an active game (type='game'), so nobody can claim an epic room this way.
create or replace function public.claim_card_pick(card_code text, want text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); rec public.cards%rowtype; pick public.items%rowtype;
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  -- the chosen room must be one of the free starter games
  select * into pick from public.items where id = want and active and type = 'game';
  if not found then return jsonb_build_object('status','bad_pick'); end if;
  select * into rec from public.cards where code = card_code;
  if not found then return jsonb_build_object('status','invalid'); end if;
  if rec.claimed_by is not null then
    if rec.claimed_by = uid then
      select * into pick from public.items where id = rec.item_id;
      return jsonb_build_object('status','owned','item',to_jsonb(pick));
    else
      return jsonb_build_object('status','taken');
    end if;
  end if;
  update public.cards set claimed_by = uid, claimed_at = now(), item_id = pick.id
    where code = card_code and claimed_by is null;
  if not found then return jsonb_build_object('status','taken'); end if;   -- someone beat us
  insert into public.inventory(user_id,item_id,source_code) values (uid,pick.id,card_code) on conflict do nothing;
  return jsonb_build_object('status','claimed','item',to_jsonb(pick));
end; $$;
grant execute on function public.claim_card_pick(text,text) to anon, authenticated;

-- ============ inventory + game-gate helpers ============
create or replace function public.my_inventory()
returns jsonb language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(to_jsonb(i)),'[]'::jsonb)
  from public.inventory inv join public.items i on i.id = inv.item_id
  where inv.user_id = auth.uid();
$$;
create or replace function public.owns(item text)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.inventory where user_id = auth.uid() and item_id = item);
$$;

grant execute on function public.card_status(text) to anon, authenticated;
grant execute on function public.claim_card(text)  to anon, authenticated;
grant execute on function public.my_inventory()     to authenticated;
grant execute on function public.owns(text)         to authenticated;

-- ============ seed: the 7 unlockable games/environments (chess stays free, not an item) ============
insert into public.items (id,name,type,rarity,value,payload,weight) values
 ('game-runner','RUN BEEBEE','game','common',10,'arcade/runner/',100),
 ('game-rush','MIMI GUITAR RUSH','game','common',10,'arcade/rush/',100),
 ('game-tiles','MIMI MUSIC TILES','game','common',10,'arcade/tiles/',100),
 ('env-aqua','AQUA BASS','environment','rare',30,'arcade/aqua/',60),
 ('env-bedroom','ICS LOFI BEDROOM','environment','rare',30,'arcade/bedroom/',60),
 ('env-terrarium','SYNTH TERRARIUM','environment','epic',60,'arcade/terrarium/',35),
 ('env-transit','MIDNIGHT TRANSIT','environment','epic',60,'arcade/transit/',35)
on conflict (id) do nothing;
