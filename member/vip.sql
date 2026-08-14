-- ONLYIBEE — VIP: full access to every room + game for chosen accounts.
-- Paste ALL of this into Supabase → SQL Editor → New query → Run. Safe to re-run.
-- Run AFTER setup.sql (needs public.items + public.inventory).
--
-- Who: edit the email list in vip_emails() below (lowercase).
-- What: every active 'game' + 'environment' item lands in their inventory
-- (source_code 'vip'), so gate.js and roomgate.js open every door — the same
-- mechanism an all-access arcade pass uses. Nothing client-side to deploy.
--
-- Covers BOTH cases:
--   1) the account already exists → the INSERT at the bottom grants it now
--   2) the account doesn't exist yet → the trigger grants it the moment they sign up

-- ============ the VIP list (edit here) ============
create or replace function public.vip_emails()
returns text[] language sql immutable as $$
  select array['najwa.barton@outlook.com'];
$$;

-- ============ grant helper: everything active, idempotent ============
create or replace function public.vip_grant(uid uuid)
returns void language sql security definer set search_path = public as $$
  insert into public.inventory(user_id, item_id, source_code)
  select uid, i.id, 'vip'
  from public.items i
  where i.active and i.type in ('game','environment')
  on conflict do nothing;
$$;

-- ============ auto-grant on sign-up (if the account doesn't exist yet) ============
create or replace function public.vip_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = any (public.vip_emails()) then
    perform public.vip_grant(new.id);
  end if;
  return new;
end; $$;

drop trigger if exists vip_on_signup on auth.users;
create trigger vip_on_signup after insert on auth.users
  for each row execute function public.vip_on_signup();

-- ============ grant NOW to VIPs that already have an account ============
select public.vip_grant(u.id)
from auth.users u
where lower(u.email) = any (public.vip_emails());

-- check it worked (shows what each VIP now owns):
select u.email, inv.item_id
from auth.users u
join public.inventory inv on inv.user_id = u.id
where lower(u.email) = any (public.vip_emails())
order by u.email, inv.item_id;
