-- ONLYIBEE — FIX: "Database error deleting user" when removing accounts.
-- Paste ALL of this into Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- WHY: profiles / guestbook / inventory / cards / pass_redemptions all point at
-- auth.users WITHOUT "on delete cascade", so Postgres blocks the delete as soon
-- as an account owns any row. This re-points every constraint so deleting a user
-- automatically wipes their site data (and frees their claimed NFC cards).
-- After running it once, deleting from Authentication → Users just works.

-- their profile (nickname + annex) goes with them — the username is freed
alter table public.profiles
  drop constraint if exists profiles_user_id_fkey;
alter table public.profiles
  add constraint profiles_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- guestbook notes they received…
alter table public.guestbook
  drop constraint if exists guestbook_room_owner_fkey;
alter table public.guestbook
  add constraint guestbook_room_owner_fkey
  foreign key (room_owner) references auth.users(id) on delete cascade;

-- …and notes they wrote in other rooms
alter table public.guestbook
  drop constraint if exists guestbook_author_fkey;
alter table public.guestbook
  add constraint guestbook_author_fkey
  foreign key (author) references auth.users(id) on delete cascade;

-- everything they collected
alter table public.inventory
  drop constraint if exists inventory_user_id_fkey;
alter table public.inventory
  add constraint inventory_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- their pass redemptions (NOTE: passes.uses stays counted — see below)
alter table public.pass_redemptions
  drop constraint if exists pass_redemptions_user_id_fkey;
alter table public.pass_redemptions
  add constraint pass_redemptions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- an NFC card claimed by a deleted account goes back to "available"
-- (set null, NOT cascade — the physical card row must survive)
alter table public.cards
  drop constraint if exists cards_claimed_by_fkey;
alter table public.cards
  add constraint cards_claimed_by_fkey
  foreign key (claimed_by) references auth.users(id) on delete set null;

-- ---------------------------------------------------------------------
-- OPTIONAL — bulk-delete test accounts right here instead of the dashboard
-- (uncomment, put the real emails in, Run):
--
-- delete from auth.users
--   where email in ('test1@example.com','test2@example.com');
--
-- OPTIONAL — if a deleted test account had redeemed a limited pass and you
-- want its seat back (uses is a plain counter, cascade doesn't lower it):
--
-- update public.passes p
--   set uses = (select count(*) from public.pass_redemptions r where r.code = p.code);
-- ---------------------------------------------------------------------
