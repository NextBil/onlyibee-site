/* ============================================================
   ONLYIBEE — ROOM GATE (2026-07-13)
   Each member picks ONE living room (aqua / terrarium / transit) at sign-up and
   only has access to that one. This gate (on the three env pages) does two jobs:

   1) LOCK — if the signed-in member's chosen room (profiles.room.env) isn't THIS
      one, cover the page with "this isn't your room".
   2) SYNC — for the room that IS theirs, mirror the game's evolution
      (ibee_garden = plant/pet growth, ibee_transit = miles) into their Supabase
      profile (profiles.room_state) so it follows them across devices; on load it
      restores the server copy (merged with local, whichever is further along).

   Guests (not signed in) and members who haven't picked yet may preview freely.
   Needs member/room.sql (adds room_state + save_room_state). ============ */
(function(){
  "use strict";
  var parts=location.pathname.replace(/\/+$/,"").split("/");
  var ENV=parts[parts.length-1];                       // aqua | terrarium | transit
  if(["aqua","terrarium","transit"].indexOf(ENV)<0) return;
  var NAME={aqua:"AQUA BASS",terrarium:"TERRARIUM",transit:"MIDNIGHT TRANSIT"};

  var SB_URL="https://hloxwicoeahczifshyoe.supabase.co";
  var SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";
  var OWNER="droguepuissance4@gmail.com";

  function ls(k){ try{return JSON.parse(localStorage.getItem(k)||"null");}catch(e){return null;} }
  function setls(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} }

  /* ---- lock overlay (3 flavours: members-only / pick-first / not-your-room) ---- */
  var styled=false;
  function ensureStyle(){
    if(styled)return; styled=true;
    var css="#rgate{position:fixed;inset:0;z-index:99999;background:#050507;display:flex;flex-direction:column;"
      +"align-items:center;justify-content:center;gap:16px;text-align:center;padding:28px;font-family:'Press Start 2P',monospace;color:#e8e8e8}"
      +"#rgate::before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}"
      +"#rgate .lk{width:44px;height:44px;color:#ff2b2b;filter:drop-shadow(0 0 12px rgba(255,43,43,.55))}"
      +"#rgate h2{font-size:14px;color:#b6ff00;letter-spacing:2px;line-height:1.7}"
      +"#rgate p{font-family:'VT323',monospace;font-size:20px;color:#9a9a9a;max-width:360px;line-height:1.4}"
      +"#rgate .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}"
      +"#rgate a{font-family:'Press Start 2P',monospace;font-size:10px;padding:14px 16px;text-decoration:none;cursor:pointer;border:1px solid #2a2a2a;background:transparent;color:#7a7a7a}"
      +"#rgate a.go{background:#b6ff00;color:#000;border-color:#b6ff00}";
    var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  }
  var LOCK="<svg class='lk' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='11' width='14' height='9' rx='2' fill='currentColor'/>"
    +"<path d='M8 11V7.5a4 4 0 0 1 8 0V11' stroke='currentColor' stroke-width='2.2' fill='none' stroke-linecap='round'/><circle cx='12' cy='15' r='1.5' fill='#050505'/></svg>";
  function overlay(html){
    ensureStyle();
    var ov=document.createElement("div");ov.id="rgate";ov.innerHTML=LOCK+html;
    function mount(){ if(document.body&&!document.getElementById("rgate"))document.body.appendChild(ov); }
    if(document.body)mount(); else document.addEventListener("DOMContentLoaded",mount);
  }
  /* guests: the rooms are for members only */
  function lockMembers(){
    overlay("<h2>MEMBERS ONLY</h2>"
      +"<p>the rooms are for members. join free in 2 seconds, pick your room, and it grows with you every time you come back.</p>"
      +"<div class='row'><a class='go' href='../../member/?login=1'>＋ JOIN — FREE, 2 SEC</a><a href='../'>◀ ROOMS</a></div>");
  }
  /* signed in but hasn't chosen a room yet */
  function lockPick(){
    overlay("<h2>PICK YOUR ROOM FIRST</h2>"
      +"<p>choose your one room on your profile — aqua, terrarium or transit. it becomes yours and grows with you.</p>"
      +"<div class='row'><a class='go' href='../../room/'>▶ CHOOSE MY ROOM</a><a href='../'>◀ ROOMS</a></div>");
  }
  /* signed in, but this is not the room they chose */
  function lockMismatch(picked){
    overlay("<h2>THIS ISN'T YOUR ROOM</h2>"
      +"<p>you chose <b style='color:#b6ff00'>"+(NAME[picked]||picked.toUpperCase())+"</b> as your room — it grows with you. you only get one.</p>"
      +"<div class='row'><a class='go' href='../"+picked+"/'>▶ ENTER MY ROOM</a><a href='../../room/'>☺ MY PROFILE</a><a href='../'>◀ ROOMS</a></div>");
  }

  /* ---- evolution sync (only for the room that is theirs) ---- */
  var sb=null,syncing=false;
  function blob(){ return {garden:ls("ibee_garden")||{sun:{}}, transit:ls("ibee_transit")||null, at:Date.now()}; }
  function restore(server){
    if(!server) return;
    /* garden: take the further-along sun per song (max seconds) */
    var lg=ls("ibee_garden")||{sun:{}}; if(!lg.sun)lg.sun={};
    var sg=server.garden&&server.garden.sun||{};
    Object.keys(sg).forEach(function(k){ lg.sun[k]=Math.max(lg.sun[k]||0, sg[k]||0); });
    setls("ibee_garden",lg);
    try{ if(window.GARDEN){ window.GARDEN.sun=window.GARDEN.sun||{};
      Object.keys(lg.sun).forEach(function(k){ window.GARDEN.sun[k]=Math.max(window.GARDEN.sun[k]||0,lg.sun[k]); }); } }catch(e){}
    /* transit: take the higher mileage, keep a stable car id */
    if(server.transit){
      var lt=ls("ibee_transit")||{miles:0,id:0};
      lt.miles=Math.max(lt.miles||0, server.transit.miles||0);
      lt.id=lt.id||server.transit.id;
      setls("ibee_transit",lt);
      try{ if(window.TRANSIT){ window.TRANSIT.miles=Math.max(window.TRANSIT.miles||0,lt.miles); if(!window.TRANSIT.id)window.TRANSIT.id=lt.id; } }catch(e){}
    }
  }
  async function push(){
    if(!sb||syncing) return; syncing=true;
    try{ await sb.rpc("save_room_state",{s:blob()}); }catch(e){}
    syncing=false;
  }

  function loadSB(cb){
    if(window.supabase&&window.supabase.createClient) return cb();
    var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=cb;s.onerror=function(){cb();};document.head.appendChild(s);
  }

  function startSync(server){
    restore(server);
    setInterval(push, 20000);
    window.addEventListener("pagehide",push);
    document.addEventListener("visibilitychange",function(){ if(document.hidden)push(); });
  }

  loadSB(function(){
    /* Supabase couldn't load → we can't verify membership → members-only (fail closed) */
    if(!(window.supabase&&window.supabase.createClient)){ lockMembers(); return; }
    sb=window.supabase.createClient(SB_URL,SB_KEY);
    sb.auth.getSession().then(function(res){
      var sess=res.data.session;
      if(!sess){ lockMembers(); return; }                              // GUESTS ARE LOCKED OUT (2026-07-13)
      var email=((sess.user&&sess.user.email)||"").toLowerCase();
      sb.rpc("my_profile").then(function(r){
        var prof=r&&r.data, picked=prof&&prof.room&&prof.room.env;
        if(picked) setls("ibee_room",picked);
        if(email===OWNER){ startSync(prof&&prof.room_state); return; } // owner: full access
        if(!picked){ lockPick(); return; }                             // signed in but hasn't chosen yet
        if(picked!==ENV){ lockMismatch(picked); return; }              // chose a different room
        startSync(prof&&prof.room_state);                              // this room is theirs
      }).catch(function(){ lockMembers(); });                          // can't read profile → fail closed
    }).catch(function(){ lockMembers(); });
  });
})();
