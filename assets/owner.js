/* ============================================================
   ONLYIBEE — OWNER FLAG (2026-08-24)
   One shared answer to "is the current visitor the owner?", so private things
   (right now: the NP2 songs in the radio) can hide from everyone else and show
   only for the owner account — without every consumer running its own auth.

   Resolves ONCE off the Supabase session email, then:
     • window.IBEE_IS_OWNER  = true | false   (null until resolved)
     • window.IBEE_SHOW_NP2  = true           (only when owner)
     • fires document event "ibee-owner" (detail = isOwner)
     • window.IBEE_OWNER_READY(cb) — cb(isOwner), immediately if already known.

   Soft flag for presentation only; real data stays protected by RLS. To make
   NP2 public again, just stop hiding it in player.js (and drop privategate on
   the /np2/ pages). ============================================ */
(function(){
  "use strict";
  if(window.IBEE_OWNER_READY) return;                 // already loaded once
  var OWNER  = "droguepuissance4@gmail.com";
  var SB_URL = "https://hloxwicoeahczifshyoe.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";

  var resolved=false, isOwner=false, queue=[];
  window.IBEE_IS_OWNER = null;
  window.IBEE_OWNER_READY = function(cb){ if(resolved){ try{cb(isOwner);}catch(e){} } else queue.push(cb); };

  /* Session cache — once the owner is confirmed, later pages in the same tab
     know it SYNCHRONOUSLY (before the async check comes back), so a page that
     renders once (e.g. product-page) shows private things without a reload.
     Only ever set on the owner's own device; a visitor never has it. */
  var CACHE="ibee_own";
  try{ if(sessionStorage.getItem(CACHE)==="1") window.IBEE_SHOW_NP2 = true; }catch(e){}

  function settle(v){
    if(resolved) return;
    resolved=true; isOwner=!!v;
    window.IBEE_IS_OWNER = isOwner;
    if(isOwner) window.IBEE_SHOW_NP2 = true;
    try{ sessionStorage.setItem(CACHE, isOwner?"1":"0"); }catch(e){}
    try{ document.dispatchEvent(new CustomEvent("ibee-owner",{detail:isOwner})); }catch(e){}
    queue.forEach(function(cb){ try{cb(isOwner);}catch(e){} }); queue=[];
  }

  /* ============================================================
     LAUNCH SWITCH ①  — flip to true to make NOUVEAUX PUNK 2 public for EVERYONE.
     Opens the radio songs, the Music-Universe galaxy, the shop grid, and the
     product pages in one line, and un-locks THE FALL tile in ROOMS. (The three
     covered pages — /np2/, /np2/fall/, /drop/ — are switch ② in privategate.js.)
     ============================================================ */
  var NP2_LAUNCHED = false;
  if(NP2_LAUNCHED){
    window.IBEE_SHOW_NP2 = true;                 // synchronous — product-page reads this at render
    resolved = true; isOwner = false; window.IBEE_IS_OWNER = false;   // public, not "owner"
    try{ document.dispatchEvent(new CustomEvent("ibee-owner",{detail:true})); }catch(e){}
    queue.forEach(function(cb){ try{cb(true);}catch(e){} }); queue=[];
    return;                                       // skip the auth check entirely
  }

  function loadSB(cb){
    if(window.supabase&&window.supabase.createClient) return cb();
    var s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=cb; s.onerror=function(){cb();}; document.head.appendChild(s);
  }
  loadSB(function(){
    if(!(window.supabase&&window.supabase.createClient)){ settle(false); return; }
    try{
      var sb=window.supabase.createClient(SB_URL,SB_KEY);
      sb.auth.getSession().then(function(res){
        var em=res&&res.data&&res.data.session&&res.data.session.user&&res.data.session.user.email;
        settle(!!em && String(em).toLowerCase()===OWNER.toLowerCase());
      }).catch(function(){ settle(false); });
    }catch(e){ settle(false); }
  });
})();
