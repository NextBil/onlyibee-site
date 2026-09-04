/* =====================================================================
   ONLYIBEE — CONSOLE NAV  (2026-09)
   A cute console-style top nav with the same rotating voxel icons as the
   new homepage (console-v2). It rides on EVERY page EXCEPT the main menu,
   so nobody gets stranded on a sub-page.

   Include once, anywhere in <head> or before </body>:
       <script defer src="/assets/console-nav.js"></script>

   Rules it enforces on its own (no per-page config needed):
     · hidden on the main menu / homepage (that page IS the menu);
     · hidden inside the shell iframe (window.top !== self) — the shell
       already carries its own nav there, so we don't double it;
     · a page can opt out with <body data-nonav> or  window.IBEE_NO_CONSOLE_NAV=true.
   Pure presentation — self-contained CSS + DOM, no dependencies.
   ===================================================================== */
(function(){
  "use strict";
  if(window.__ibeeConsoleNav) return; window.__ibeeConsoleNav=1;

  /* never inside the shell frame — the shell owns the nav + the bottom player,
     and this is what stops a redirect loop (framed pages just render normally) */
  try{ if(window.top!==window.self) return; }catch(e){}
  if(window.IBEE_NO_CONSOLE_NAV) return;

  /* is this the shell / main menu itself? then do nothing */
  var p=(location.pathname||"/").toLowerCase();
  var isHome = p==="/" || /\/(index|console|console-v2)\.html$/.test(p);
  if(isHome) return;

  /* ---- ONE nav, ONE player, everywhere ---------------------------------------
     Every content page is meant to live INSIDE the shell (index.html), which
     carries the single top nav and the persistent bottom player. Opened directly
     (a shared link, a search result), a page would otherwise show its own nav and
     the player would collapse to a chip. So send a real top-level visitor into the
     shell, framing THIS page: /?p=<path>. The standalone HTML still serves for
     crawlers (they read it before this runs; canonical stays on the real URL).
     Pages that must stay bare (checkout, popups) opt out with <body data-nonav>. */
  try{
    if(document.body && document.body.hasAttribute("data-nonav")) { /* fall through to render */ }
    else {
      var rel=(location.pathname||"/").replace(/^\//,"")+location.search+location.hash;
      if(rel && !/^\?/.test(rel)){
        location.replace("/?p="+encodeURIComponent(rel));
        return;
      }
    }
  }catch(e){}
  return;   /* redirector only — the floating pill below is retired (one nav lives in the shell) */

  /* the same voxel icons the homepage uses */
  var SVG={
    home:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 2 L14 7 V14 H10 V10 H6 V14 H2 V7 Z' fill='#161616' stroke='#b6ff00' stroke-width='.7'/><rect x='6.6' y='10.4' width='2.8' height='3.6' fill='#b6ff00' opacity='.85'/></svg>",
    rooms:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5 5 H11 C13 5 13.4 6.2 13.9 8 L14.7 11.4 C15 13.1 13.3 13.7 12.2 12.5 L10.3 10.4 H5.7 L3.8 12.5 C2.7 13.7 1 13.1 1.3 11.4 L2.1 8 C2.6 6.2 3 5 5 5 Z' fill='#161616' stroke='#26e0ff' stroke-width='.6'/><rect x='3.9' y='7.35' width='2.5' height='.8' fill='#26e0ff'/><rect x='4.75' y='6.5' width='.8' height='2.5' fill='#26e0ff'/><circle cx='11' cy='6.85' r='.55' fill='#ff2b2b'/><circle cx='12.05' cy='7.9' r='.55' fill='#b6ff00'/><circle cx='9.95' cy='7.9' r='.55' fill='#26e0ff'/><circle cx='11' cy='8.95' r='.55' fill='#ff2bd6'/></svg>",
    shop:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 3 L5.2 1 L6.4 2.2 H9.6 L10.8 1 L14 3 L12.4 6.2 L11 5.2 V15 H5 V5.2 L3.6 6.2 Z' fill='#ff2bd6' stroke='#3a0030' stroke-width='.5'/><rect x='6.6' y='7' width='2.8' height='2.8' fill='#161616'/><path d='M6.4 2.2 A1.8 1.8 0 0 0 9.6 2.2' fill='#070707'/></svg>",
    tv:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.4 3.1 7.2 5.4 8.8 5.4 11.6 3.1' stroke='#ff2b2b' stroke-width='.9' fill='none'/><rect x='1.5' y='5' width='13' height='9' rx='1.2' fill='#161616' stroke='#ff2b2b' stroke-width='.7'/><rect x='2.7' y='6.2' width='8.6' height='6.6' fill='#26e0ff' opacity='.85'/><rect x='2.7' y='6.2' width='8.6' height='1.1' fill='#fff' opacity='.35'/><circle cx='13' cy='7.4' r='.7' fill='#b6ff00'/></svg>",
    you:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect x='1.5' y='3.5' width='13' height='9' rx='1.1' fill='#161616' stroke='#5ad17a' stroke-width='.7'/><circle cx='5' cy='7' r='1.7' fill='#5ad17a'/><path d='M2.6 11.1 a2.5 2.5 0 0 1 4.8 0 Z' fill='#5ad17a'/><rect x='8.4' y='5.6' width='4.6' height='.9' fill='#b6ff00'/><rect x='8.4' y='7.5' width='4.6' height='.9' fill='#555'/><rect x='8.4' y='9.4' width='3' height='.9' fill='#555'/></svg>"
  };
  var ITEMS=[
    {k:"home", nm:"HOME",  href:"/",        ac:"#b6ff00", match:null},
    {k:"rooms",nm:"ROOMS", href:"/arcade/", ac:"#26e0ff", match:["/arcade","/room","/20minzasession","/beebee","/np2"]},
    {k:"shop", nm:"SHOP",  href:"/shop/",   ac:"#ff2bd6", match:["/shop","/drop","/product-page","/utopie","/blackdenim","/garment"]},
    {k:"ics",  nm:"ICS",   href:"/chess/",  ac:"#ffd60a", ics:1, match:["/chess","/mimi","/goli","/nannan","/ablah","/sworda","/swordy","/sworda"]},
    {k:"tv",   nm:"TV",    href:"/tv/",     ac:"#ff2b2b", match:["/tv","/nouveauxpunk"]},
    {k:"you",  nm:"YOU",   href:"/member/", ac:"#5ad17a", match:["/member","/cert","/stats","/support"]}
  ];
  function active(it){ if(!it.match) return false; for(var i=0;i<it.match.length;i++){ if(p.indexOf(it.match[i])===0) return true; } return false; }

  var css=
   "#icnav{position:fixed;top:calc(8px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2147483000;"
  +"display:flex;align-items:center;gap:4px;padding:6px;background:rgba(9,9,9,.82);border:1px solid #242424;border-radius:18px;"
  +"box-shadow:0 8px 30px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.4);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);"
  +"font-family:'Press Start 2P',monospace;max-width:calc(100vw - 20px);overflow-x:auto;scrollbar-width:none;transition:opacity .3s,transform .3s}"
  +"#icnav::-webkit-scrollbar{display:none}"
  +"#icnav.hide{opacity:0;transform:translate(-50%,-130%);pointer-events:none}"
  +"#icnav .it{--ac:#b6ff00;position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;"
  +"text-decoration:none;padding:7px 9px 6px;border-radius:12px;min-width:52px;transition:background .16s}"
  +"#icnav .it:hover,#icnav .it.on{background:rgba(255,255,255,.06)}"
  +"#icnav .it .ic{position:relative;width:30px;height:30px;perspective:200px}"
  +"#icnav .it .ic::before{content:'';position:absolute;inset:-32% -22% -6%;z-index:-1;border-radius:50%;"
  +"background:radial-gradient(circle at 50% 45%,color-mix(in srgb,var(--ac) 60%,transparent),transparent 68%);opacity:.5}"
  +"#icnav .it:hover .ic::before,#icnav .it.on .ic::before{opacity:.95}"
  +"#icnav .o3{position:relative;display:block;width:100%;height:100%;transform-style:preserve-3d;animation:icnsp 5.5s linear infinite}"
  +"#icnav .it:hover .o3,#icnav .it.on .o3{animation-duration:2.4s}"
  +"#icnav .o3 img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}"
  +"@keyframes icnsp{from{transform:rotateY(0) rotateX(8deg)}to{transform:rotateY(360deg) rotateX(8deg)}}"
  +"#icnav .lb{font-size:6px;letter-spacing:.5px;color:#8a8a8a;transition:color .16s}"
  +"#icnav .it:hover .lb,#icnav .it.on .lb{color:#fff}"
  +"#icnav .it.on{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ac) 45%,transparent)}"
  +"#icnav .it.on .lb{color:var(--ac)}"
  +"@media(max-width:400px){#icnav .lb{display:none}#icnav .it{min-width:0;padding:7px}}";

  function voxel(svg){
    var w=document.createElement("span"); w.className="o3";
    var uri="data:image/svg+xml,"+encodeURIComponent(svg), z=[-3.2,-1.9,-.6,.6,1.9,3.2];
    z.forEach(function(t,i){ var im=new Image(); im.src=uri; im.alt="";
      im.style.transform="translateZ("+t+"px)"; if(i<5) im.style.filter="brightness(.42)"; w.appendChild(im); });
    return w;
  }
  function icsImg(){ var w=document.createElement("span"); w.className="o3";
    var im=new Image(); im.src="/assets/img/brand/utopie-umbrella-pixel-acid.png"; im.onerror=function(){this.src="/assets/chess/bishop2.png";};
    im.src="/assets/chess/bishop2.png"; w.appendChild(im); return w; }

  function build(){
    if(document.getElementById("icnav")) return;
    var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
    var bar=document.createElement("nav"); bar.id="icnav"; bar.setAttribute("aria-label","ONLYIBEE nav");
    ITEMS.forEach(function(it){
      var a=document.createElement("a"); a.className="it"+(active(it)?" on":""); a.href=it.href; a.style.setProperty("--ac",it.ac);
      a.title=it.nm;
      var ic=document.createElement("span"); ic.className="ic";
      ic.appendChild(it.ics?icsImg():voxel(SVG[it.k]||SVG.home));
      var lb=document.createElement("span"); lb.className="lb"; lb.textContent=it.nm;
      a.appendChild(ic); a.appendChild(lb); bar.appendChild(a);
    });
    document.body.appendChild(bar);

    /* tuck away on scroll-down, come back on scroll-up — stays out of the way */
    var last=0;
    window.addEventListener("scroll",function(){
      var y=window.pageYOffset||document.documentElement.scrollTop||0;
      if(y>90 && y>last+4) bar.classList.add("hide");
      else if(y<last-4 || y<40) bar.classList.remove("hide");
      last=y;
    },{passive:true});
  }

  if(document.body){ if(document.body.hasAttribute("data-nonav")) return; build(); }
  else document.addEventListener("DOMContentLoaded",function(){ if(!document.body.hasAttribute("data-nonav")) build(); });
})();
