/* ============================================================
   ONLYIBEE — CLOUD SAVE (2026-07-15)
   Makes device-local progress follow the ACCOUNT so it survives logging in on a
   new phone / browser (the fix for "favourites & badges don't come back").

   Self-loaded by player.js on the TOP window only (localStorage is shared across
   the whole origin, so the shell's copy covers what the framed pages write).
   No supabase-js needed: it calls the PostgREST RPC endpoint directly with the
   member's own access token (read from the sb-*-auth-token localStorage the shell
   already uses). Server side: member/cloud-sync.sql (get_cloud / save_cloud).

   Flow: on login → GET get_cloud → MERGE server into local (never lose the
   further-along value) → write local → PUSH the merged blob (seeds the server
   from whatever this device already had). Then push whenever the tracked keys
   change, and re-pull periodically so two devices reconcile. Merges are by
   union / max, so nothing a member earned on any device is ever dropped.
   ============================================================ */
(function(){
  "use strict";
  try{ if(window.top !== window.self) return; }catch(e){ return; }   // top window only
  if(window.IBEE_CLOUD) return;

  var SB_URL = "https://hloxwicoeahczifshyoe.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";

  function lget(k){ try{ return JSON.parse(localStorage.getItem(k)||"null"); }catch(e){ return null; } }
  function lset(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

  /* ---------- the member's access token (same source the shell pill reads) ---------- */
  function token(){
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(/^sb-.*-auth-token$/.test(k)){
          var v=JSON.parse(localStorage.getItem(k)||"null"); if(!v) return null;
          var s=v.currentSession||v;
          var t=s.access_token, exp=s.expires_at||v.expiresAt;
          if(!t) return null;
          if(exp && (exp*1000) < Date.now()-5000) return null;   // expired → a library page will refresh it
          return t;
        }
      }
    }catch(e){}
    return null;
  }

  /* ---------- merges: keep the FURTHER-ALONG value, never lose progress ---------- */
  function mNum(a,b){ return Math.max(a||0,b||0); }
  function mapMax(a,b){ a=a||{}; b=b||{}; var o={},k;
    for(k in b)o[k]=b[k]; for(k in a)o[k]=(typeof a[k]==='number'&&typeof o[k]==='number')?Math.max(a[k],o[k]):a[k]; return o; }
  function mapUnion(a,b){ a=a||{}; b=b||{}; var o={},k; for(k in b)if(b[k])o[k]=b[k]; for(k in a)if(a[k])o[k]=a[k]; return o; }

  function mergeFavs(a,b){ return mapUnion(a,b); }                 // {slug:1}
  function mergePet(a,b){ if(!a)return b||null; if(!b)return a; return (a.xp||0)>=(b.xp||0)?a:b; }
  function mergeTransit(a,b){ if(!a)return b||null; if(!b)return a;
    return {miles:mNum(a.miles,b.miles), id:a.id||b.id, name:a.name||b.name}; }
  function mergeGarden(a,b){ a=a||{}; b=b||{}; var o={},k; for(k in b)o[k]=b[k]; for(k in a)o[k]=a[k];
    o.sun=mapMax(a.sun,b.sun); return o; }
  function mergeSav(a,b){ a=a||{}; b=b||{}; var o={},k; for(k in b)o[k]=b[k]; for(k in a)o[k]=a[k];
    o.plays=mapMax(a.plays,b.plays); o.vault=!!(a.vault||b.vault); return o; }
  function mergeBadges(a,b){
    a=a||{}; b=b||{};
    var earned={}, ea=a.earned||{}, eb=b.earned||{}, k;
    for(k in eb)earned[k]=eb[k];
    for(k in ea)earned[k]=(earned[k]!=null)?Math.min(earned[k],ea[k]):ea[k];  // earliest win time
    var pa=a.prog||{}, pb=b.prog||{}, prog={}, keys={};
    for(k in pa)keys[k]=1; for(k in pb)keys[k]=1;
    for(k in keys){ var va=pa[k], vb=pb[k];
      if(typeof va==='number'||typeof vb==='number') prog[k]=Math.max(va||0,vb||0);
      else if((va&&typeof va==='object')||(vb&&typeof vb==='object')) prog[k]=mapMax(va,vb);
      else if(typeof va==='boolean'||typeof vb==='boolean') prog[k]=!!(va||vb);
      else prog[k]=(va!=null?va:vb);
    }
    return { v:a.v||b.v||1, earned:earned, evtT:mNum(a.evtT,b.evtT), prog:prog };
  }

  /* the tracked keys and how each one merges */
  var KEYS={
    ibee_favs:    mergeFavs,
    ibee_badges:  mergeBadges,
    ibee_aquapet: mergePet,
    ibee_sav:     mergeSav,
    ibee_garden:  mergeGarden,
    ibee_transit: mergeTransit
  };

  function blob(){ var o={},k; for(k in KEYS){ var v=lget(k); if(v!=null) o[k]=v; } return o; }
  function serial(){ try{ return JSON.stringify(blob()); }catch(e){ return ""; } }

  /* merge a server blob INTO local, write the winners back, return the merged blob */
  function mergeIn(server){
    server=server||{}; var out={},k;
    for(k in KEYS){
      var loc=lget(k), srv=server[k];
      if(srv===undefined){ if(loc!=null)out[k]=loc; continue; }   // server has nothing → keep local
      var merged=KEYS[k](loc,srv);
      if(merged!=null){ lset(k,merged); out[k]=merged; }
    }
    return out;
  }

  /* ---------- transport: PostgREST RPC with the member's bearer token ---------- */
  function rpc(fn, body, keepalive){
    var t=token(); if(!t) return Promise.reject("no-session");
    return fetch(SB_URL+"/rest/v1/rpc/"+fn, {
      method:"POST",
      headers:{ "apikey":SB_KEY, "Authorization":"Bearer "+t,
                "Content-Type":"application/json", "Accept":"application/json" },
      body: JSON.stringify(body||{}),
      keepalive: !!keepalive
    }).then(function(r){ return r.ok ? r.json() : Promise.reject("http-"+r.status); });
  }

  var lastPush="", busy=false;

  /* pull server → merge → push the union back (so the server ends up with everything) */
  function reconcile(){
    if(busy || !token()) return Promise.resolve();
    busy=true;
    return rpc("get_cloud",{}).then(function(server){
      var merged=mergeIn(server||{});
      lastPush=JSON.stringify(merged);
      return rpc("save_cloud",{c:merged});
    }).then(function(){ busy=false; }).catch(function(){ busy=false; });
  }

  /* push local if it changed since the last push */
  function push(keepalive){
    if(!token()) return Promise.resolve();
    var cur=serial(); if(cur===lastPush) return Promise.resolve();
    lastPush=cur;
    return rpc("save_cloud",{c:blob()},keepalive).catch(function(){ lastPush=""; });  // retry next tick
  }

  /* ---------- run loop ---------- */
  var wasIn=false, ticks=0;
  function tick(){
    var inNow=!!token();
    if(inNow && !wasIn){ wasIn=true; reconcile(); return; }   // just logged in → merge both ways
    if(!inNow){ wasIn=false; return; }                        // logged out → idle (local stays)
    ticks++;
    if(ticks%11===0) reconcile();                             // ~every 90s reconcile with other devices
    else push(false);                                         // otherwise just push local changes
  }
  setInterval(tick, 8000);
  reconcile();                                                // first run: if already logged in, sync now

  /* leaving the page → flush with keepalive so the last change lands */
  window.addEventListener("pagehide", function(){ push(true); });
  document.addEventListener("visibilitychange", function(){ if(document.hidden) push(true); });

  /* exposed for the app + tests */
  window.IBEE_CLOUD={ blob:blob, mergeIn:mergeIn, reconcile:reconcile, push:push,
    _merges:{favs:mergeFavs,badges:mergeBadges,pet:mergePet,sav:mergeSav,garden:mergeGarden,transit:mergeTransit} };
})();
