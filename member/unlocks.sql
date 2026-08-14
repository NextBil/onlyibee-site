-- ONLYIBEE — the UNLOCK LADDER: earn the rhythm games by playing.
-- Paste into Supabase → SQL Editor → Run. Safe to re-run. Run AFTER setup.sql.
--
-- The three environment rooms (aqua/terrarium/transit) are FREE picks; the three
-- rhythm GAMES are earned:
--   game-runner ← listen to 10 R&B records  OR  beat ICS chess at LV1
--   game-rush   ← sign in on 3 different days
--   game-tiles  ← finish a full MIMI GUITAR RUSH song without dying
--
-- The conditions are tracked client-side (badges.js), so this grant is client-TRUSTED:
-- it only lets an account grant itself one of the three free starter GAMES (type='game'),
-- never an epic room — the same guard claim_card_pick uses. Good enough for a playful
-- site; it is not an anti-cheat wall (a static site can't be).

create or replace function public.grant_game(want text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); pick public.items%rowtype;
begin
  if uid is null then return jsonb_build_object('status','need_login'); end if;
  -- only an active starter GAME may be self-granted this way
  select * into pick from public.items where id = want and active and type = 'game';
  if not found then return jsonb_build_object('status','bad_pick'); end if;
  if exists(select 1 from public.inventory where user_id = uid and item_id = want) then
    return jsonb_build_object('status','owned','item',to_jsonb(pick));
  end if;
  insert into public.inventory(user_id,item_id,source_code) values (uid,want,'earned')
    on conflict do nothing;
  return jsonb_build_object('status','granted','item',to_jsonb(pick));
end; $$;

grant execute on function public.grant_game(text) to authenticated;
