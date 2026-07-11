# The accounts + claim-once system (Supabase) — setup

This is the backend that makes it real: **login (email + Google), one claim per card,
"seat taken", and reward unlock.** Supabase is free and you don't run any server — your
static site talks to it directly. Do these steps, send me the two keys at the bottom, and
I wire + test the member page against it.

> **Apple login costs money** (Apple Developer Program, $99/yr) so we skip it for now.
> **Email + Google are free** and cover everyone. Apple can be added later if you get the account.

---

## 1. Create the project
1. Go to **supabase.com** → sign up (free) → **New project**. Pick a name + a strong DB password (save it).
2. Wait ~2 min for it to spin up.

## 2. Create the table + the claim logic
Open **SQL Editor** → **New query** → paste ALL of this → **Run**:

```sql
-- the cards: one row per physical NFC card
create table if not exists public.cards (
  code         text primary key,
  drop_code    text not null,
  serial       int,
  reward_type  text,          -- 'download' | 'track' | 'skin' | 'feature'
  reward_url   text,          -- the file/skin the card unlocks
  claimed_by   uuid references auth.users(id),
  claimed_at   timestamptz,
  created_at   timestamptz not null default now()
);

-- lock the table: NO direct row access. Everything goes through the 2 functions below.
alter table public.cards enable row level security;

-- read a card's state without exposing who claimed it
create or replace function public.card_status(card_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare rec public.cards%rowtype;
begin
  select * into rec from public.cards where code = card_code;
  if not found then return jsonb_build_object('status','invalid'); end if;
  if rec.claimed_by is null then
    return jsonb_build_object('status','available','serial',rec.serial,'drop',rec.drop_code);
  elsif rec.claimed_by = auth.uid() then
    return jsonb_build_object('status','owned','reward_type',rec.reward_type,'reward_url',rec.reward_url,'serial',rec.serial);
  else
    return jsonb_build_object('status','taken','serial',rec.serial);
  end if;
end; $$;

-- claim a card ONCE, atomically (race-safe: two people tapping at once can't both win)
create or replace function public.claim_card(card_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
declare rec public.cards%rowtype;
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  select * into rec from public.cards where code = card_code;
  if not found then return jsonb_build_object('status','invalid'); end if;
  if rec.claimed_by is not null then
    if rec.claimed_by = uid then
      return jsonb_build_object('status','owned','reward_type',rec.reward_type,'reward_url',rec.reward_url);
    else
      return jsonb_build_object('status','taken');
    end if;
  end if;
  update public.cards set claimed_by = uid, claimed_at = now()
    where code = card_code and claimed_by is null;
  if not found then return jsonb_build_object('status','taken'); end if;  -- someone beat us to it
  return jsonb_build_object('status','claimed','reward_type',rec.reward_type,'reward_url',rec.reward_url);
end; $$;

grant execute on function public.card_status(text) to anon, authenticated;
grant execute on function public.claim_card(text)  to anon, authenticated;
```

## ⭐ 2b. UPDATED MODEL — games + magical inventory (RUN THIS instead of the block in §2)

This replaces the simple version above with the **collect-them-all** system: claiming a card
draws a random item into your inventory; games unlock when you own their item. If you already
ran §2, this is safe to run on top (it adds tables + replaces the functions).

```sql
-- ITEMS: the loot catalog — games, clothes, collectibles, exclusives
create table if not exists public.items (
  id      text primary key,            -- 'game-runner', 'tee-cow-green', ...
  name    text not null,
  type    text not null,               -- 'game'|'clothing'|'collectible'|'track'|'exclusive'
  rarity  text not null default 'common',
  image   text,
  payload text,                        -- game route / download url / info
  weight  int  not null default 100,   -- draw weight (rarer = smaller number)
  active  boolean not null default true -- in the loot pool?
);
alter table public.items enable row level security;
create policy "items readable" on public.items for select using (true);

-- INVENTORY: what each account owns
create table if not exists public.inventory (
  user_id     uuid not null references auth.users(id),
  item_id     text not null references public.items(id),
  source_code text,
  obtained_at timestamptz not null default now(),
  primary key (user_id, item_id)
);
alter table public.inventory enable row level security;
create policy "read own inventory" on public.inventory for select using (user_id = auth.uid());

-- CARDS: one row per physical NFC card
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
alter table public.cards enable row level security;  -- no policies: access only via the functions

-- read a card's state (for the "available / SEAT TAKEN / owned" screen)
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
  else return jsonb_build_object('status','taken'); end if;
end; $$;

-- claim ONCE + draw a random unowned item (race-safe + weighted by rarity)
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
    else return jsonb_build_object('status','taken'); end if;
  end if;
  update public.cards set claimed_by = uid, claimed_at = now()
    where code = card_code and claimed_by is null;
  if not found then return jsonb_build_object('status','taken'); end if;   -- someone beat us
  select * into pick from public.items
    where active and id not in (select item_id from public.inventory where user_id = uid)
    order by power(random(), 1.0/greatest(weight,1)) desc limit 1;          -- weighted draw
  if not found then return jsonb_build_object('status','claimed','item',null); end if;
  insert into public.inventory(user_id,item_id,source_code) values (uid,pick.id,card_code) on conflict do nothing;
  update public.cards set item_id = pick.id where code = card_code;
  return jsonb_build_object('status','claimed','item',to_jsonb(pick));
end; $$;

-- the collection book + a game-gate check
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

-- seed the 3 unlockable games (chess stays free, not an item). Add clothes/rares later.
insert into public.items (id,name,type,rarity,payload,weight) values
 ('game-runner','RUN BEEBEE','game','common','arcade/runner/',100),
 ('game-rush','MIMI NEON RUSH','game','common','arcade/rush/',100),
 ('game-tiles','MIMI MUSIC TILES','game','common','arcade/tiles/',100)
on conflict (id) do nothing;
```

> Add a new item later (a hoodie, a rare, the "expensive" grails) = one `insert into items`.
> `weight` sets the odds (legendary → small weight → rare pull). Card-factory codes stay the
> same — every claim just draws from whatever's `active` in the pool.

## 3. Turn on login
**Authentication → URL Configuration:** set **Site URL** to `https://onlyibee.com` (add `http://localhost` too if you test locally).

- **Email** — already on. It sends a magic link / code; nothing else to do.
- **Google** — **Authentication → Providers → Google → Enable.** It needs a Google OAuth client:
  1. **console.cloud.google.com** → new project → **APIs & Services → Credentials → Create OAuth client → Web application**.
  2. Under **Authorized redirect URIs**, paste the callback Supabase shows you (looks like `https://<your-project>.supabase.co/auth/v1/callback`).
  3. Copy the **Client ID** + **Client secret** back into Supabase's Google provider → Save.

## 4. Load your cards
Use **`tools/card-factory.html`** → mint a batch → copy the **SUPABASE SQL** tab → paste in the SQL editor → Run. That registers the batch as unclaimed. (The factory also gives you the NFC URLs to burn onto the chips.)

## 5. Rewards ("feels like winning")
- `reward_type='download'` or `'track'` + `reward_url` = a file. Host it in **Supabase → Storage** (private bucket) and I'll have the page hand the claimant a signed download link; or use any URL.
- `reward_type='skin'` = a Beebee game skin id; the game unlocks it for logged-in owners.
- `reward_type='feature'` = the future members-only room/feature.

## Send me these 2 things (both safe to share)
1. **Project URL** — `https://<your-project>.supabase.co`
2. **anon public key** — Supabase → **Project Settings → API → Project API keys → `anon` `public`**

> The `anon` key is *designed* to be public and embedded in websites — safety comes from the
> locked table + the two functions above, not from hiding the key. **Never** send the
> `service_role` key.

Once I have those, I wire the member page's **login → redeem → owned / SEAT TAKEN** flow and test it end-to-end on your real project.
