/* ============================================================
   IBEE GAME GATE — locks a game until the logged-in member OWNS its item.
   Add to a gated game (NOT chess): <script src="../../assets/gate.js?v=1"></script>
   Note: this is a client-side gate — it deters casual access; it is not an
   unbreakable lock (a static site can't truly hide the file). Good enough to make
   the games feel earned; real enforcement would need server-rendered content.
   ============================================================ */
(function(){
  "use strict";
  var MAP={runner:"game-runner",rush:"game-rush",tiles:"game-tiles",
    aqua:"env-aqua",bedroom:"env-bedroom",terrarium:"env-terrarium",transit:"env-transit"};
  var parts=location.pathname.replace(/\/+$/,"").split("/");
  var itemId=MAP[parts[parts.length-1]];
  if(!itemId) return;                                  // not a gated game → do nothing
  var SB_URL="https://hloxwicoeahczifshyoe.supabase.co";
  var SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";
  var MEMBER="../../member/";

  var css="#ibgate{position:fixed;inset:0;z-index:99999;background:#050507;display:flex;flex-direction:column;"
    +"align-items:center;justify-content:center;gap:16px;text-align:center;padding:28px;font-family:'Press Start 2P',monospace;color:#e8e8e8}"
    +"#ibgate::before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}"
    +"#ibgate .lk{font-size:44px;filter:drop-shadow(0 0 14px rgba(182,255,0,.35))}"
    +"#ibgate h2{font-size:15px;color:#b6ff00;letter-spacing:2px;line-height:1.6}"
    +"#ibgate p{font-family:'VT323',monospace;font-size:20px;color:#9a9a9a;max-width:360px;line-height:1.4}"
    +"#ibgate .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}"
    +"#ibgate a,#ibgate button{font-family:'Press Start 2P',monospace;font-size:11px;padding:14px 18px;text-decoration:none;cursor:pointer;border:1px solid #2a2a2a;background:transparent;color:#7a7a7a}"
    +"#ibgate a.go{background:#b6ff00;color:#000;border-color:#b6ff00}";
  var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);

  var ov=document.createElement("div"); ov.id="ibgate";
  ov.innerHTML='<div class="lk">🔒</div><h2 id="ibgt">CHECKING ACCESS…</h2><p id="ibgp">verifying your pass_</p><div class="row" id="ibgr"></div>';
  function mount(){ if(document.body && !document.getElementById("ibgate")) document.body.appendChild(ov); }
  if(document.body) mount(); else document.addEventListener("DOMContentLoaded",mount);

  function locked(owns){
    mount();
    document.getElementById("ibgt").textContent="LOCKED";
    document.getElementById("ibgp").textContent = owns===false
      ? "this one isn't in your collection yet — unlock it with a pass_"
      : (owns==="error" ? "couldn't verify access — try again_" : "log in or grab a pass to play_");
    document.getElementById("ibgr").innerHTML =
      '<a class="go" href="'+MEMBER+'">▶ GET A PASS / LOG IN</a>'
      +(owns==="error"?'<button onclick="location.reload()">↻ RETRY</button>':'')
      +'<a href="../">◀ ARCADE</a>';
  }
  function unlock(){ var e=document.getElementById("ibgate"); if(e)e.remove(); }

  var done=false, tmo=setTimeout(function(){ if(!done){done=true;locked("error");} },8000); // fail-CLOSED on hang
  function finish(fn){ if(done)return; done=true; clearTimeout(tmo); fn(); }
  function load(cb){ if(window.supabase&&window.supabase.createClient)return cb();
    var s=document.createElement("script"); s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"; s.onload=cb; s.onerror=function(){cb();}; document.head.appendChild(s); }
  load(function(){
    if(!(window.supabase&&window.supabase.createClient)){ finish(function(){locked("error");}); return; }
    var sb=window.supabase.createClient(SB_URL,SB_KEY);
    sb.auth.getSession().then(function(res){
      if(!res.data.session){ finish(function(){locked(null);}); return; }        // not logged in
      sb.rpc("owns",{item:itemId}).then(function(r){
        finish(function(){ if(r.data===true) unlock(); else locked(false); });    // owns? play : locked
      }).catch(function(){ finish(function(){locked("error");}); });
    }).catch(function(){ finish(function(){locked("error");}); });
  });
})();
