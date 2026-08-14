-- ONLYIBEE — CLOUD SAVE: make favourites, badges and room progress follow the
-- ACCOUNT instead of living only in one browser.
-- Paste ALL of this into Supabase → SQL Editor → New query → Run. Safe to re-run.
-- Run AFTER room.sql (it extends the public.profiles table).
--
-- WHY: favourites (ibee_favs), badges (ibee_badges) and the aqua pet (ibee_aquapet)
-- were stored only in localStorage — device-local, so logging in on another phone
-- or after the browser cleared storage showed nothing. assets/cloudsync.js now
-- pushes them here and merges them back on login. One JSON blob per member.

-- a single per-member bag of synced state (favs, badges, pet, plays, garden, transit)
alter table public.profiles
  add column if not exists cloud jsonb not null default '{}'::jsonb;

-- read your own synced blob (empty object if you have none yet)
create or replace function public.get_cloud()
returns jsonb language sql security definer set search_path = public as $$
  select coalesce((select cloud from public.profiles where user_id = auth.uid()), '{}'::jsonb);
$$;

-- overwrite your own synced blob (the client sends the already-merged blob).
-- upserts a profile row even for members who haven't picked a nickname yet, so
-- a brand-new account still saves its favourites/badges from the first session.
create or replace function public.save_cloud(c jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  if length(c::text) > 300000 then return jsonb_build_object('status','too_big'); end if;
  insert into public.profiles(user_id, cloud) values (uid, c)
    on conflict (user_id) do update set cloud = excluded.cloud, updated_at = now();
  return jsonb_build_object('status','ok');
end; $$;

grant execute on function public.get_cloud()        to authenticated;
grant execute on function public.save_cloud(jsonb)  to authenticated;
