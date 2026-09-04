/* =====================================================================
   MINE — the purple cashew (formerly "LISTENS")
   =====================================================================
   ONE currency, ONE discount, earned by BEING HERE and PLAYING. Simple:

     · CASHEWS  — a running count of little purple cashews. You earn them
                  slowly just by LISTENING (the radio ticks them up live),
                  by falling in THE FALL (100 a level), and every badge you
                  hold is worth 40. Shown as a purple cashew everywhere.
     · DISCOUNT — how much off you get. It is the BEST of three things:
                    a) your cashews          (2,600 cashews = 40%, the cap)
                    b) THE FALL levels cleared (all 26 = 40%)
                    c) an EARNED FLOOR         (chess/rooms grant a % directly)
                  capped at 40% no matter what.

   WHO EARNS WHAT
     · Listening to music  → cashews tick up while a song plays, live on the
                             price tags; they FREEZE the moment music stops.
     · THE FALL (np2/fall) → 100 cashews per level.
     · Chess (chess/)      → beat HARD = 40% floor, EASY = 3% (IBEE_PERKS.awardPct).
     · Rooms (arcade/…)    → playing a room grants a small % floor.

   WHERE IT SHOWS
     · Any price opts in:  <span data-perk-price="60" data-perk-cur="€"></span>
     · Any tag opts in:    <span data-perk-badge></span>   (cashew count + −%)
       then the page calls IBEE_PERKS.render() after building its grid.
     · The profile shows the cashew balance.

   ⚠ MONEY IS NEVER SET HERE. Cashews live in localStorage and are trivially
   forgeable, so this file only re-prices the DISPLAY and shows the COUPON
   CODE you earned (FALL01…FALL40). The code is the real discount and each
   whole percent must exist as a Stripe/PayPal coupon, server-side, or the
   price on screen is a promise checkout will not keep. Never wire this into
   a client-set charge amount.

   ARCHITECTURE (so it stays easy to follow)
     · Accrual runs in ONE place — the TOP window (the shell) — so listening
       is counted once no matter how many framed pages are open.
     · Every window (shell + framed page) re-renders on a slow timer, reading
       the shared localStorage, so a price tag on the product page ticks live.
   ===================================================================== */
(function(){
  "use strict";
  if(window.IBEE_PERKS) return;

  var LS_PTS  = "ibee_np2pts";     /* cashews: fall + listening (kept key for continuity) */
  var LS_FLOOR= "ibee_mine_floor"; /* discount % floor granted by chess / rooms */
  var LS_OUT  = "ibee_np2fall_out";/* which FALL levels are cleared */
  var LEVELS  = 26;
  var CLEAR   = 100;               /* cashews for getting out of a level */
  var MAXPCT  = 40;                /* the cap */
  var POINTS_FOR_MAX = LEVELS*CLEAR;   /* 2,600 cashews = 40% */
  var BADGE_WORTH = 40;
  var LISTEN_RATE = 1/3;           /* cashews per second of listening (slow, ~60 a song) */

  /* the cute purple cashew — an inline SVG so it renders the same everywhere */
  var COIN = "<svg class='cashew' viewBox='0 0 16 16' aria-hidden='true'>"
    + "<path d='M10.6 2.1c2.7.8 4.2 3.3 3.6 6.1-.7 3.4-4 5.7-7.6 5.1-2.3-.4-4-2-4.5-4.1.9 1.5 2.6 2.5 4.5 2.5 3.1 0 5.2-2.3 5.2-5.1 0-1.8-.6-3.4-1.2-4.5z' fill='#b06bff'/>"
    + "<circle cx='6.2' cy='6.4' r='1' fill='#d7b3ff'/></svg>";

  function readN(k){ try{ var v=parseInt(localStorage.getItem(k)||"0",10); return isFinite(v)&&v>0?v:0; }catch(e){ return 0; } }
  function writeN(k,v){ try{ localStorage.setItem(k,String(v)); }catch(e){} }
  function cleared(){ try{ var o=JSON.parse(localStorage.getItem(LS_OUT)||"{}")||{}; return Object.keys(o).length; }catch(e){ return 0; } }

  /* a trophy you already earned is worth cashews at the till — read live off the store */
  function badges(){
    try{ var st=JSON.parse(localStorage.getItem("ibee_badges")||"null"); if(st&&st.earned) return Object.keys(st.earned).length; }catch(e){}
    try{ var B=window.IBEE_BADGES; if(B&&B.state){ var s2=B.state(); if(s2&&s2.earned) return Object.keys(s2.earned).length; } }catch(e){}
    return 0;
  }
  function badgeListens(){ return badges()*BADGE_WORTH; }

  function points(){ return readN(LS_PTS)+badgeListens(); }   /* total cashews carried */
  function fallen(){ return readN(LS_PTS); }
  function floorPct(){ return Math.max(0, Math.min(MAXPCT, readN(LS_FLOOR))); }

  function add(n){ if(!(n>0)) return points(); var t=readN(LS_PTS)+Math.round(n); writeN(LS_PTS,t); return t; }

  /* chess / rooms grant a discount FLOOR directly (a % you keep) */
  function awardPct(p){ p=Math.max(0,Math.min(MAXPCT,Math.round(p||0))); if(p>floorPct()){ writeN(LS_FLOOR,p); try{render();}catch(e){} } return floorPct(); }

  function discount(){
    var byPoints=Math.floor(MAXPCT*points()/POINTS_FOR_MAX);
    var byLevels=Math.floor(MAXPCT*cleared()/LEVELS);
    return Math.max(0, Math.min(MAXPCT, Math.max(byPoints, byLevels, floorPct())));
  }
  function code(){ var d=discount(); return d>0 ? ("FALL"+(d<10?"0":"")+d) : null; }

  function priceOf(orig){ var d=discount(), n=parseFloat(orig);
    if(!isFinite(n)) return null;
    if(d<=0) return {was:n, now:n, off:0, saved:0, pct:0};
    var now=Math.round(n*(100-d))/100;
    return {was:n, now:now, off:d, saved:Math.round((n-now)*100)/100, pct:d}; }
  function money(v,cur){ cur=cur||"€"; var s=(Math.round(v*100)/100).toFixed(2).replace(/\.00$/,""); return cur+s; }

  function RADIO(){ try{ return (window.top&&window.top.IBEERADIO)||window.IBEERADIO||null; }catch(e){ return window.IBEERADIO||null; } }
  function playing(){ var R=RADIO(); return !!(R&&R.playing&&R.playing()); }

  /* ---- re-price everything that opted in (idempotent) ---- */
  function render(root){
    root=root||document; var d=discount(), live=playing();
    var nodes=root.querySelectorAll("[data-perk-price]");
    for(var i=0;i<nodes.length;i++){ var el=nodes[i], p=priceOf(el.getAttribute("data-perk-price")); if(!p) continue;
      var cur=el.getAttribute("data-perk-cur")||"€";
      if(d<=0){ el.innerHTML='<span class="perk-now">'+money(p.was,cur)+'</span>'; continue; }
      el.innerHTML='<s class="perk-was">'+money(p.was,cur)+'</s> <span class="perk-now">'+money(p.now,cur)+'</span> <span class="perk-off">−'+d+'%</span>'; }
    var tags=root.querySelectorAll("[data-perk-badge]");
    for(var k=0;k<tags.length;k++){
      tags[k].className=(tags[k].className.replace(/\bperk-live\b/g,'').trim())+(live?' perk-live':'');
      tags[k].innerHTML = d>0
        ? ('<b class="perk-coin">'+COIN+' '+points()+'</b> · −'+d+'% OFF'+(live?' <i class="perk-tick">mining_</i>':''))
        : ('<b class="perk-coin">'+COIN+' '+points()+'</b> · '+(live?'<i class="perk-tick">mining_</i>':'PLAY TO EARN')); }
    return d;
  }

  /* styling ships with the module */
  try{ var css=document.createElement("style");
    css.textContent=
      ".cashew{width:1em;height:1em;vertical-align:-2px;display:inline-block}"+
      ".perk-was{opacity:.5;text-decoration:line-through}"+
      ".perk-now{color:#ff1f6f}"+
      ".perk-off{font-family:'Press Start 2P',monospace;font-size:7px;letter-spacing:1px;color:#b06bff;white-space:nowrap}"+
      ".perk-coin{color:#c79bff;font-weight:400}"+
      ".perk-tick{color:#b06bff;font-style:normal;font-family:'Press Start 2P',monospace;font-size:7px;animation:perkbl 1s steps(1) infinite}"+
      "@keyframes perkbl{50%{opacity:.35}}";
    document.head.appendChild(css);
  }catch(e){}

  window.IBEE_PERKS={
    points:points, add:add, awardPct:awardPct, floorPct:floorPct, cleared:cleared,
    discount:discount, code:code, price:priceOf, money:money, render:render, COIN:COIN,
    badges:badges, badgeListens:badgeListens, fallen:fallen, playing:playing,
    BADGE_WORTH:BADGE_WORTH, MAXPCT:MAXPCT, LEVELS:LEVELS, CLEAR:CLEAR, POINTS_FOR_MAX:POINTS_FOR_MAX
  };

  /* ---- ACCRUAL: only in the TOP window (the shell), so listening is counted
     once even with a framed page open. Cashews ONLY move while music plays. ---- */
  if(window.top===window.self){
    var acc=0, last=Date.now();
    setInterval(function(){
      var now=Date.now(), dt=(now-last)/1000; last=now;
      if(dt<=0||dt>2) return;                 /* backgrounded/hitch — don't dump a lump */
      if(discount()>=MAXPCT) return;          /* at the cap, nothing to earn */
      if(playing()){ acc+=LISTEN_RATE*dt; if(acc>=1){ var w=Math.floor(acc); acc-=w; add(w); } }
    }, 500);
  }
  /* ---- DISPLAY: every window re-renders slowly so price tags tick live ---- */
  function boot(){ render(); }
  try{ document.addEventListener("DOMContentLoaded",boot); }catch(e){}
  if(document.readyState!=="loading") setTimeout(boot,0);
  setInterval(function(){ try{ render(); }catch(e){} }, 900);
})();
