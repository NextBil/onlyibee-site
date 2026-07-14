/* ============================================================
   ONLYIBEE — THE UNLOCK LADDER (2026-07-13)
   Earn the three rhythm GAMES by playing. Runs on the shell (top window),
   reads the conditions badges.js already tracks, and — once the member is
   signed in — grants the Supabase game item via grant_game() (see
   member/unlocks.sql). Deduped locally in `ibee_unlocks`; the server call
   is idempotent too. Pops a toast + drops a "YOU JUST WON" news entry.

     game-runner ← felt 10 records  OR  beat ICS chess at LV1
     game-rush   ← signed in on 3 different days
     game-tiles  ← finished a full MIMI GUITAR RUSH song without dying
                   (the rush game writes localStorage `ibee_rush_clear`)
   ============================================================ */
(function(){
  "use strict";
  if(window.top!==window.self) return;                 // top window only (no double grants)

  var SB_URL="https://hloxwicoeahczifshyoe.supabase.co";
  var SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";

  var GAMES={
    "game-runner":{name:"RUN BEEBEE!", slug:"runner",
      why:"you felt 10 records / beat chess — the city opens up_",
      test:function(P){ return P.chess>=1 || P.nsongs>=10; }},
    "game-rush":{name:"MIMI GUITAR RUSH", slug:"rush",
      why:"you came back 3 days — the highway is yours_",
      test:function(P){ try{return Object.keys(P.days||{}).length>=3;}catch(e){return false;} }},
    "game-tiles":{name:"MIMI MUSIC TILES", slug:"tiles",
      why:"you cleared a full RUSH song without dying — nice hands_",
      test:function(){ try{return localStorage.getItem("ibee_rush_clear")==="1";}catch(e){return false;} }}
  };

  function granted(){ try{return JSON.parse(localStorage.getItem("ibee_unlocks")||"{}")||{};}catch(e){return {};} }
  function markGranted(id){ try{var g=granted();g[id]=Date.now();localStorage.setItem("ibee_unlocks",JSON.stringify(g));}catch(e){} }

  /* a small corner toast (self-contained; doesn't depend on badges.js's toast) */
  function toast(txt,slug){
    var t=document.createElement("div");
    t.textContent="🎮 "+txt;
    t.style.cssText="position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);"
      +"background:#050505;border:1px solid #b6ff00;color:#b6ff00;font-family:'Press Start 2P',monospace;"
      +"font-size:9px;padding:12px 16px;z-index:9600;opacity:0;transition:.3s;max-width:90vw;text-align:center;cursor:pointer";
    document.body.appendChild(t);
    requestAnimationFrame(function(){t.style.opacity="1";t.style.transform="translateX(-50%) translateY(0)";});
    t.onclick=function(){ try{ if(window.navigate)window.navigate("arcade/"+slug+"/"); }catch(e){} };
    setTimeout(function(){t.style.opacity="0";setTimeout(function(){t.remove();},400);},5200);
  }

  /* drop a one-shot news entry so the profile's "YOU JUST WON" feed shows it (+ red dot) */
  function pushNews(id,name,slug){
    try{
      var k="ibee_auto_news",arr=JSON.parse(localStorage.getItem(k)||"[]")||[];
      var nid="unlock-"+id;
      if(arr.some(function(x){return x&&x.id===nid;})) return;
      arr.push({id:nid,t:"collection",icon:"🎮",n:name+" UNLOCKED",
        d:"you earned it — play it now",date:Date.now(),link:"arcade/"+slug+"/"});
      localStorage.setItem(k,JSON.stringify(arr));
    }catch(e){}
  }

  var sb=null,loaded=false;
  function loadSB(cb){
    if(window.supabase&&window.supabase.createClient) return cb();
    var s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=cb; s.onerror=function(){cb();}; document.head.appendChild(s);
  }

  var busy=false;
  async function tick(){
    if(busy) return;
    var B=window.IBEE_BADGES; if(!B||!B.snapshot) return;
    var P=B.snapshot();
    /* which games are earned-but-not-yet-granted? */
    var g=granted(), want=[];
    Object.keys(GAMES).forEach(function(id){
      if(!g[id]){ try{ if(GAMES[id].test(P)) want.push(id); }catch(e){} }
    });
    if(!want.length) return;
    if(!(window.supabase&&window.supabase.createClient)) return;   // sb not ready yet
    if(!sb) sb=window.supabase.createClient(SB_URL,SB_KEY);
    busy=true;
    try{
      var sess=(await sb.auth.getSession()).data.session;
      if(!sess){ busy=false; return; }                 // hold until they sign in — conditions persist
      for(var i=0;i<want.length;i++){
        var id=want[i];
        var r=await sb.rpc("grant_game",{want:id});
        if(!r.error && r.data && (r.data.status==="granted"||r.data.status==="owned")){
          markGranted(id);
          if(r.data.status==="granted"){
            toast(GAMES[id].name+" UNLOCKED — "+GAMES[id].why, GAMES[id].slug);
            pushNews(id,GAMES[id].name,GAMES[id].slug);
          }
        }
      }
    }catch(e){}
    busy=false;
  }

  loadSB(function(){ loaded=true; });
  setInterval(tick, 6000);
  setTimeout(tick, 3000);
  /* re-check right after a sign-in (badges.js flips loggedIn; grant then) */
  window.addEventListener("storage",function(e){ if(e&&/supabase|sb-/.test(e.key||"")) setTimeout(tick,800); });
})();
