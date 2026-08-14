-- ONLYIBEE — LIVE COMMUNITY TELEMETRY. Run once in Supabase → SQL Editor.
-- pgcrypto gives us digest() for one-way IP hashing (the raw IP is NEVER stored).
-- On Supabase extensions live in the "extensions" schema, so install it there and
-- call it as extensions.digest(). If it is already installed elsewhere this is a
-- no-op and the hash simply degrades to NULL (see the exception block below).
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create table if not exists public.site_visits (visitor_id text primary key, first_seen timestamptz not null default now(), last_seen timestamptz not null default now(), last_path text not null default '/', country_code text);
alter table public.site_visits add column if not exists country_code text;
alter table public.site_visits add column if not exists city_name text;
alter table public.site_visits add column if not exists ip_hash text;   -- one-way SHA-256 of visitor IP (raw IP is NEVER stored)
create index if not exists site_visits_last_seen_idx on public.site_visits(last_seen desc);
create index if not exists site_visits_iphash_idx on public.site_visits(ip_hash, last_seen desc);
create table if not exists public.song_plays (id bigint generated always as identity primary key, visitor_id text not null, song_slug text not null, played_at timestamptz not null default now());
alter table public.song_plays add column if not exists city_name text;
create index if not exists song_plays_played_at_idx on public.song_plays(played_at desc);
alter table public.site_visits enable row level security;
alter table public.song_plays enable row level security;

-- Replace the older three-argument visit function with the city-aware version.
drop function if exists public.record_site_visit(text,text,text);
-- search_path MUST include "extensions": Supabase installs pgcrypto there, not in
-- public. With search_path=public alone, digest() below is unresolvable and the
-- whole function throws ("function digest(text, unknown) does not exist") on EVERY
-- call — which is exactly why site_visits stayed empty while song_plays filled up.
create or replace function public.record_site_visit(visitor_id text, page_path text default '/', country_code text default null, city_name text default null) returns void language plpgsql security definer set search_path=public, extensions as $$
declare
  cc text := upper(left(nullif($3,''),2));
  cy text := left(nullif(trim($4),''),80);
  caller_ip text;
  v_ip_hash text;
  recent_visits bigint;
begin
  if $1 is null or length($1) < 8 or length($1) > 200 then return; end if;

  -- Hard block: Singapore. Most "SG" hits are datacenter/scraper traffic. Also
  -- DELETE any row this visitor already has, because the heartbeat writes the visit
  -- with an EMPTY country first and only fills in 'SG' a second later.
  -- Bare column names are avoided throughout this function: every parameter
  -- (visitor_id, country_code, city_name) shares a name with a site_visits column,
  -- so an unqualified reference raises "column reference is ambiguous" at runtime
  -- and aborts the whole insert. Use $n for the params and an alias for the table.
  if cc = 'SG' or cy ~* 'singapore' then
    delete from public.site_visits sv1 where sv1.visitor_id = $1;
    return;
  end if;

  -- One-way SHA-256 hash of the caller IP. The RAW IP is never stored, so the site's
  -- privacy claim ("No IP address is saved in the ONLY IBEE database") stays true.
  -- The hash feeds ONLY the optional bot-swarm filter below. It must never be able
  -- to cost us a real visit, so any failure here (pgcrypto missing, header absent,
  -- schema moved) leaves v_ip_hash NULL and recording carries on regardless.
  begin
    caller_ip := current_setting('request.headers', true)::json->>'x-forwarded-for';
    caller_ip := split_part(coalesce(caller_ip,''), ',', 1);
    if caller_ip <> '' then
      v_ip_hash := encode(extensions.digest(caller_ip, 'sha256'), 'hex');
    end if;
  exception when others then
    v_ip_hash := null;
  end;

  -- Swarm filter ONLY: this catches a single source IP cycling hundreds of fresh
  -- visitor IDs in minutes — the classic bot-farm signature. Set high enough that
  -- it never trips on real shared IPs (mobile carriers/CGNAT, offices, VPN exits,
  -- universities can legitimately put many real people behind one IP). The threshold
  -- below is deliberately permissive: ~8 brand-new visitors per minute from one IP
  -- sustained for an hour. Real shared-IP use does not approach this; bot floods do.
  -- NOTE: the local variable is named v_ip_hash (not ip_hash) so it cannot collide
  -- with the site_visits.ip_hash COLUMN. A prior version named both the same, which
  -- made "where ip_hash = ip_hash" raise "column reference is ambiguous" on EVERY
  -- call — the function aborted before its insert, so site_visits stayed empty and
  -- POPULATION read 0 forever while song plays (a different function) kept working.
  if v_ip_hash is not null then
    select count(*) into recent_visits from public.site_visits sv2
      where sv2.ip_hash = v_ip_hash
        and sv2.first_seen >= now() - interval '1 hour';   -- only BRAND-NEW visitors count toward the limit
    if recent_visits >= 500 then return; end if;
  end if;

  -- NOTE: there is intentionally NO "no country = bot" filter here. Many real
  -- visitors NEVER resolve a country — adblockers, Brave Shields, privacy tools,
  -- and rate-limited/slow geo lookups all produce legitimate country-less visits.
  -- Penalizing them would drop real fans and is unacceptable for a business.
  -- The Singapore block + swarm rate-limit above catch the bots without touching
  -- those users.

  -- Persist. country_code holds a real 2-letter code (or NULL); the IP hash lives
  -- in its own column that the public stats queries never read.
  insert into public.site_visits as sv(visitor_id,first_seen,last_seen,last_path,country_code,city_name,ip_hash)
  values($1, now(), now(), left(coalesce($2,'/'),200),
         nullif(cc,''),
         nullif(cy,''),
         v_ip_hash)
  on conflict on constraint site_visits_pkey do update
  set last_seen = excluded.last_seen,
      last_path = excluded.last_path,
      country_code = coalesce(nullif(cc,''), sv.country_code),   -- a real country, once known, sticks
      city_name = coalesce(nullif(cy,''), sv.city_name),
      ip_hash = coalesce(excluded.ip_hash, sv.ip_hash);
end; $$;
drop function if exists public.record_song_play(text,text);
create or replace function public.record_song_play(visitor_id text, song_slug text, city_name text default null) returns void language plpgsql security definer set search_path=public as $$
declare cy text := left(nullif(trim($3),''),80);
begin
  if $1 is null or length($1) < 8 or $2 is null or length($2)=0 then return; end if;
  -- Same Singapore bot filter as record_site_visit, applied to plays.
  if cy ~* 'singapore' then return; end if;
  if not exists (select 1 from song_plays sp where sp.visitor_id=$1 and sp.song_slug=$2 and sp.played_at > now()-interval '30 minutes') then insert into song_plays(visitor_id,song_slug,city_name) values($1,left($2,180),cy); end if;
end; $$;
-- POPULATION is a ROLLING 30-DAY window, not "since the 1st of the month".
-- date_trunc('month',now()) sent the number to 0 at every midnight on the 1st and
-- made it climb back from nothing — the counter looked broken once a month. A
-- rolling window always covers 30 real days, so it never resets to zero.
create or replace function public.get_public_stats() returns table(population bigint, signals bigint, citizens bigint, entrances bigint, online bigint, updated timestamptz) language sql stable security definer set search_path=public as $$
  select (select count(*) from site_visits where last_seen >= now()-interval '30 days')::bigint, (select count(distinct visitor_id) from song_plays)::bigint, (select count(*) from auth.users)::bigint, (select count(*) from song_plays)::bigint, (select count(*) from site_visits where last_seen >= now()-interval '2 minutes')::bigint, now();
$$;
create or replace function public.get_song_play_stats() returns table(song_slug text, plays bigint) language sql stable security definer set search_path=public as $$
  select song_slug, count(*)::bigint from song_plays group by song_slug order by count(*) desc;
$$;
create or replace function public.get_top_countries() returns table(country_code text, visitors bigint) language sql stable security definer set search_path=public as $$
  select country_code, count(*)::bigint from site_visits where country_code is not null and last_seen >= now()-interval '30 days' group by country_code order by count(*) desc, country_code asc limit 5;
$$;
create or replace function public.get_top_cities() returns table(city_name text, visitors bigint) language sql stable security definer set search_path=public as $$
  select city_name, count(*)::bigint from site_visits where city_name is not null and last_seen >= now()-interval '30 days' group by city_name order by count(*) desc, city_name asc limit 5;
$$;
create or replace function public.get_song_top_cities(p_song_slug text) returns table(city_name text, listeners bigint) language sql stable security definer set search_path=public as $$
  select sp.city_name, count(distinct sp.visitor_id)::bigint from song_plays sp where sp.song_slug=left(coalesce(p_song_slug,''),180) and sp.city_name is not null group by sp.city_name order by count(distinct sp.visitor_id) desc, sp.city_name asc limit 5;
$$;
revoke all on table public.site_visits, public.song_plays from anon, authenticated;
grant execute on function public.record_site_visit(text,text,text,text) to anon, authenticated;
grant execute on function public.record_song_play(text,text,text) to anon, authenticated;
grant execute on function public.get_public_stats() to anon, authenticated;
grant execute on function public.get_song_play_stats() to anon, authenticated;
grant execute on function public.get_top_countries() to anon, authenticated;
grant execute on function public.get_top_cities() to anon, authenticated;
grant execute on function public.get_song_top_cities(text) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- ─────────────────────────────────────────────────────────────────────────
-- ONE-TIME CLEANUP: delete Singapore bot traffic already sitting in the DB.
-- Run this once after updating the functions above. Safe to re-run.
-- NOTE: we deliberately do NOT delete rows just because they have no country.
-- Many real visitors (adblockers, Brave, slow/limited geo lookups) legitimately
-- have NULL country_code — deleting them would drop real fans.
-- ─────────────────────────────────────────────────────────────────────────
delete from public.song_plays where city_name ~* 'singapore';
delete from public.site_visits where country_code = 'SG' or city_name ~* 'singapore';
-- NOTE: if you later want to block other bot-heavy regions, add their country
-- codes to the list in record_site_visit (e.g.  if cc in ('SG','CN','RU') then ...).
-- NOTE: to see the busiest source IPs (one-way hashes, never raw IPs), run:
--   select left(ip_hash,12) as source, count(*) as visitors, max(last_seen) as last_seen
--     from site_visits where last_seen >= now() - interval '24 hours'
--     group by ip_hash order by visitors desc limit 10;
