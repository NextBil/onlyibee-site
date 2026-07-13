-- ONLYIBEE — MY ROOM: nicknames, personal rooms, guestbook
-- Paste ALL of this into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once. Run AFTER setup.sql (needs auth.users only).

-- ============ PROFILES: one row per member — the nickname + the room ============
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id),
  username   text unique,                    -- the member's chosen id (lowercase, permanent)
  room       jsonb not null default '{}'::jsonb,   -- {v,k:kind,tiles:[{i,x,y,f}],shelf:[ids],hue}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_shape check (username is null or username ~ '^[a-z0-9_]{3,16}$')
);
alter table public.profiles enable row level security;
drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);
-- no insert/update policies: writes go through the functions below only.

-- ============ GUESTBOOK: short visitor notes left in a room ============
create table if not exists public.guestbook (
  id         bigint generated always as identity primary key,
  room_owner uuid not null references auth.users(id),
  author     uuid not null references auth.users(id),
  author_name text not null default 'anon',
  msg        text not null check (char_length(msg) between 1 and 140),
  created_at timestamptz not null default now()
);
alter table public.guestbook enable row level security;
drop policy if exists "guestbook readable" on public.guestbook;
create policy "guestbook readable" on public.guestbook for select using (true);
-- writes via sign_guestbook / erase_note only.

-- ============ claim_profile: pick your unique nickname + found your room (ONCE) ============
-- name must be 3-16 chars of a-z 0-9 _ ; the room0 json is the starter room the member chose.
create or replace function public.claim_profile(name text, room0 jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); nm text := lower(trim(name)); cur public.profiles%rowtype;
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  if nm !~ '^[a-z0-9_]{3,16}$' then return jsonb_build_object('status','invalid'); end if;
  select * into cur from public.profiles where user_id = uid;
  if found and cur.username is not null then
    return jsonb_build_object('status','have','username',cur.username);
  end if;
  if exists(select 1 from public.profiles where username = nm) then
    return jsonb_build_object('status','taken');
  end if;
  insert into public.profiles(user_id, username, room)
    values (uid, nm, coalesce(room0,'{}'::jsonb))
    on conflict (user_id) do update set username = nm, room = coalesce(room0,'{}'::jsonb), updated_at = now();
  return jsonb_build_object('status','ok','username',nm);
exception when unique_violation then
  return jsonb_build_object('status','taken');
end; $$;

-- ============ save_room: overwrite your own room layout ============
create or replace function public.save_room(r jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  if length(r::text) > 20000 then return jsonb_build_object('status','too_big'); end if;
  update public.profiles set room = r, updated_at = now() where user_id = uid;
  if not found then return jsonb_build_object('status','no_profile'); end if;
  return jsonb_build_object('status','ok');
end; $$;

-- ============ my_profile: your own row (or null) ============
create or replace function public.my_profile()
returns jsonb language sql security definer set search_path = public as $$
  select coalesce(
    (select jsonb_build_object('username',p.username,'room',p.room,'since',p.created_at)
       from public.profiles p where p.user_id = auth.uid()),
    'null'::jsonb);
$$;

-- ============ get_room: anyone can visit a room by nickname (read-only) ============
create or replace function public.get_room(name text)
returns jsonb language sql security definer set search_path = public as $$
  select coalesce(
    (select jsonb_build_object('username',p.username,'room',p.room,'since',p.created_at)
       from public.profiles p where p.username = lower(trim(name))),
    'null'::jsonb);
$$;

-- ============ get_guestbook: the last 50 notes in a room ============
create or replace function public.get_guestbook(name text)
returns jsonb language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'id',g.id,'who',g.author_name,'msg',g.msg,'at',g.created_at) order by g.created_at desc),'[]'::jsonb)
  from (select g0.id, g0.author_name, g0.msg, g0.created_at
        from public.guestbook g0
        join public.profiles p on p.user_id = g0.room_owner
        where p.username = lower(trim(name))
        order by g0.created_at desc limit 50) g;
$$;

-- ============ sign_guestbook: a signed-in visitor leaves a short note ============
create or replace function public.sign_guestbook(name text, note text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); own uuid; me text; n text := trim(note);
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  if n is null or char_length(n) < 1 or char_length(n) > 140 then
    return jsonb_build_object('status','bad_note'); end if;
  select user_id into own from public.profiles where username = lower(trim(name));
  if not found then return jsonb_build_object('status','no_room'); end if;
  select coalesce(username,'anon') into me from public.profiles where user_id = uid;
  if me is null then me := 'anon'; end if;
  -- gentle flood guard: max 5 notes per author per room per day
  if (select count(*) from public.guestbook
      where room_owner = own and author = uid and created_at > now() - interval '1 day') >= 5 then
    return jsonb_build_object('status','slow_down');
  end if;
  insert into public.guestbook(room_owner, author, author_name, msg) values (own, uid, me, n);
  return jsonb_build_object('status','ok');
end; $$;

-- ============ erase_note: the room's owner (or the note's author) removes a note ============
create or replace function public.erase_note(note_id bigint)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  delete from public.guestbook where id = note_id and (room_owner = uid or author = uid);
  if not found then return jsonb_build_object('status','not_yours'); end if;
  return jsonb_build_object('status','ok');
end; $$;

grant execute on function public.claim_profile(text,jsonb) to authenticated;
grant execute on function public.save_room(jsonb)          to authenticated;
grant execute on function public.my_profile()               to authenticated;
grant execute on function public.get_room(text)             to anon, authenticated;
grant execute on function public.get_guestbook(text)        to anon, authenticated;
grant execute on function public.sign_guestbook(text,text)  to authenticated;
grant execute on function public.erase_note(bigint)         to authenticated;
