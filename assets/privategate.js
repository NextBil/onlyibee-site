/* ============================================================
   ONLYIBEE — PRIVATE GATE (2026-08-24)
   Keeps a page OUT OF SIGHT for everyone except the owner account, until we
   decide to launch it. Put it FIRST in <head> so the cover is up before any
   content paints — a visitor never glimpses what's behind it.

   Owner = the signed-in Supabase email in OWNER below. That account sees the
   page exactly as it is; everyone else (guests and any other account) gets a
   "COMING SOON" cover.

   This is a soft, client-side gate — the point is presentation, not security.
   Anything sensitive (the FALL leaderboard, accounts) is already protected
   server-side by RLS regardless of this file. To LAUNCH the page to everyone,
   just remove its <script src=".../privategate.js"> line (or empty OWNER's
   effect by deleting the tag). ============================================ */
(function(){
  "use strict";
  var OWNER  = "droguepuissance4@gmail.com";
  var SB_URL = "https://hloxwicoeahczifshyoe.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";

  /* ---- cover the page IMMEDIATELY (body may not exist yet in <head>) ---- */
  var ov=document.createElement("div");
  ov.id="pgate";
  ov.setAttribute("style",
    "position:fixed;inset:0;z-index:2147483647;background:#050507;color:#e8e8e8;"
    +"display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;"
    +"text-align:center;padding:28px;font-family:'Press Start 2P',monospace");
  ov.innerHTML=
     "<div style=\"position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)\"></div>"
    +"<div style=\"font-family:'Press Start 2P',monospace;font-size:clamp(13px,5vw,18px);color:#ff2bd6;letter-spacing:3px;text-shadow:0 0 18px rgba(255,43,214,.45)\">NOUVEAUX PUNK 2</div>"
    +"<div style=\"font-family:'Press Start 2P',monospace;font-size:11px;color:#b6ff00;letter-spacing:3px\">COMING SOON</div>"
    +"<div style=\"font-family:'VT323',monospace;font-size:21px;color:#9a9a9a;max-width:340px;line-height:1.4\">this one isn’t open yet_<br>the fall is being tuned. it’s coming.</div>"
    +"<a href=\"/console.html#menu\" style=\"font-family:'Press Start 2P',monospace;font-size:10px;padding:14px 16px;text-decoration:none;border:1px solid #2a2a2a;color:#7a7a7a;margin-top:4px\">◀ BACK TO ONLYIBEE</a>"
    +"<div id=\"pgw\" style=\"font-family:'VT323',monospace;font-size:14px;color:#3a3a3a;margin-top:6px;letter-spacing:1px\">checking access_</div>";
  function mount(){ (document.body||document.documentElement).appendChild(ov); }
  mount();
  /* body might replace documentElement's children as it parses — re-mount on ready */
  document.addEventListener("DOMContentLoaded",function(){ if(!document.getElementById("pgate")) mount(); });

  function reveal(){ var e=document.getElementById("pgate"); if(e&&e.parentNode) e.parentNode.removeChild(e); }
  function note(m){ var w=document.getElementById("pgw"); if(w) w.textContent=m||""; }

  function loadSB(cb){
    if(window.supabase&&window.supabase.createClient) return cb();
    var s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=cb; s.onerror=function(){cb();}; document.head.appendChild(s);
  }
  loadSB(function(){
    if(!(window.supabase&&window.supabase.createClient)){ note("offline — try again in a moment_"); return; }
    try{
      var sb=window.supabase.createClient(SB_URL,SB_KEY);
      sb.auth.getSession().then(function(res){
        var em=res&&res.data&&res.data.session&&res.data.session.user&&res.data.session.user.email;
        if(em && String(em).toLowerCase()===OWNER.toLowerCase()){ reveal(); }
        else { note(em?"":"sign in to preview_"); }
      }).catch(function(){ note(""); });
    }catch(e){ note(""); }
  });
})();
