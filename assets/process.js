/* =====================================================================
   HOW I MAKE THE CLOTHES  +  SCAN THE MONSTER — two shared sections.

   One file, used on every page that sells something: the vault (drop/),
   the folder pages (shop/?f=) and the console's INVENTORY screen. They
   are a script instead of pasted markup so the copy can only be written
   once — a made-to-order piece is the promise the product descriptions
   make, so the process behind it must not drift page to page.

   USE
     <div id="howmade"></div>   → the process: videos + the stills
     <div id="howscan"></div>   → how the NFC monster patch is scanned
   Both auto-mount if their div exists, inject their scoped CSS (.hm*)
   once, and inherit each page's colour variables.

   NO PROSE ON PURPOSE. The process section is deliberately just the
   films and the sketches: the videos already explain how a piece is
   made, and anything written here would have to be re-checked every
   drop (run size, turnaround, whether a piece is pressed or one-off by
   hand — none of that is true of ICS V1 and the vault at the same
   time). Drop-specific facts live on the drop's own page.

   WEIGHT. Nothing loads until it is looked at: the loops carry their
   source in data-loop-src and an IntersectionObserver gives them a src
   and plays them only while they are actually on screen (and pauses
   them when they leave), the long film is preload="none", and the
   stills are loading="lazy". Inside the console's hidden screens this
   costs zero bytes until the shop is opened.
   ===================================================================== */
(function(){
  "use strict";
  if (window.IBEE_PROCESS) return;

  var IMG  = "/assets/img/ics-process/";
  var SCAN = "/assets/img/scan/";

  /* the stills: pen sketch → photoshop → the finished character */
  var SHOTS = [
    ["process-sketches-spread.jpg",     "SKETCHES", "PEN"],
    ["process-sketch-kings-mask.jpg",   "NANNAN",   "PEN"],
    ["process-sketch-hippo-knight.jpg", "HIPPO",    "PEN"],
    ["process-sketch-beebee.jpg",       "BEEBEE",   "PEN"],
    ["process-photoshop-mask.jpg",      "INKING",   "PSD"],
    ["process-photoshop-swordy.jpg",    "SWORDY+A", "PSD"],
    ["process-beebee-final.jpg",        "BEEBEE",   "FINAL"],
    ["sketch-07.jpg",                   "SET",      "FINAL"]
  ];

  /* the monster patch on three different garments — this is what you are
     looking for when you go to scan a piece */
  var PATCHES = [
    ["monster-blue.jpg",  "ON THE HEM"],
    ["monster-red.jpg",   "ON THE SLEEVE"],
    ["monster-black.jpg", "ON THE ARM"]
  ];

  var STEPS = [
    ["01", "FIND THE MONSTER", "sleeve or hem."],
    ["02", "TAP YOUR PHONE",   "hold it there a second."],
    ["03", "IT OPENS",         "the piece proves itself."]
  ];

  /* the contactless mark, drawn rather than pixels: the icon has to stay
     sharp from a 44px chip to a 120px header on a retina phone */
  /* three arcs 6 units apart at stroke 2.5 — closer or thicker and they merge
     into one blob at chip size, which is where this icon spends its life */
  var NFCICON = '<svg class="hmnfc" viewBox="0 0 64 64" aria-hidden="true" focusable="false">'
    + '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">'
    +   '<path d="M26.24 39.06 A8 8 0 0 0 26.24 24.94"/>'
    +   '<path d="M23.43 44.36 A14 14 0 0 0 23.43 19.64"/>'
    +   '<path d="M20.61 49.66 A20 20 0 0 0 20.61 14.34"/>'
    +   '<rect x="34" y="9" width="22" height="46" rx="5"/>'
    +   '<path d="M41 15h8"/>'
    +   '<path d="M41 49h8"/>'
    + '</g></svg>';

  var CSS = ''
    /* ---- shared shell ---- */
    + '.hm{margin-top:42px;border-top:2px solid var(--border,#2a2a2a);padding-top:28px}'
    + '.hm h2{font-family:var(--px),monospace;font-size:13px;color:var(--gold,#ffd60a);'
    +   'letter-spacing:1px;line-height:1.6;margin-bottom:18px}'
    + '.hm .hmhead{display:flex;align-items:center;gap:12px;margin-bottom:18px}'
    + '.hm .hmhead h2{margin:0}'
    + '.hmnfc{width:34px;height:34px;flex:none;color:var(--acid,#b6ff00)}'
    /* ---- videos ---- */
    + '.hmvids{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;'
    +   'max-width:660px;margin-bottom:20px}'
    + '.hmvids .vc{border:2px solid var(--border,#2a2a2a);background:#0e0e0e}'
    + '.hmvids video{width:100%;display:block;aspect-ratio:9/16;object-fit:cover;background:#000}'
    + '.hmvids .vcap{padding:9px 10px;border-top:2px solid var(--border,#2a2a2a)}'
    + '.hmvids .vcap b{font-family:var(--px),monospace;font-size:8px;color:var(--ink,#e8e8e8);'
    +   'display:block;line-height:1.7;font-weight:normal}'
    + '.hmvids .vcap span{color:var(--dim,#7a7a7a);font-size:16px;line-height:1.3;display:block;margin-top:3px}'
    /* ---- the stills ---- */
    + '.hmshots{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;max-width:760px}'
    + '.hmshots a{display:block;text-decoration:none;border:2px solid var(--border,#2a2a2a);background:#0e0e0e}'
    + '.hmshots .ph{display:block;aspect-ratio:1/1;overflow:hidden;background:#0a0a0c}'
    + '.hmshots .ph img{width:100%;height:100%;object-fit:cover;display:block}'
    + '.hmshots .cn{display:flex;justify-content:space-between;align-items:baseline;gap:6px;'
    +   'padding:8px 9px;border-top:2px solid var(--border,#2a2a2a);'
    +   'font-family:var(--px),monospace;font-size:7px;color:var(--ink,#e8e8e8);letter-spacing:1px}'
    + '.hmshots .rr{color:var(--dim,#7a7a7a);font-size:6.5px}'
    + '.hmshots a:hover{border-color:var(--acid,#b6ff00)}'
    /* ---- SCAN: the two demo loops beside the three numbered steps. On a phone
           the loops go on top and the steps stack underneath, full width. ---- */
    + '.hmscan{display:grid;grid-template-columns:minmax(0,260px) minmax(0,1fr);gap:18px;'
    +   'align-items:start;max-width:760px;margin-bottom:22px}'
    + '.hmdemos{display:flex;flex-direction:column;gap:12px}'
    + '.hmscan .demo{border:2px solid var(--border,#2a2a2a);background:#0e0e0e;overflow:hidden}'
    + '.hmscan .demo video{width:100%;display:block;aspect-ratio:9/16;object-fit:cover;background:#000}'
    + '.hmscan .demo.wide video{aspect-ratio:5/4}'
    + '.hmscan .demo .tag{padding:8px 10px;border-top:2px solid var(--border,#2a2a2a);'
    +   'font-family:var(--px),monospace;font-size:7.5px;color:var(--acid,#b6ff00);letter-spacing:1px;'
    +   'display:flex;align-items:center;gap:7px}'
    + '.hmscan .demo .tag i{width:6px;height:6px;border-radius:50%;background:var(--acid,#b6ff00);'
    +   'box-shadow:0 0 7px var(--acid,#b6ff00);flex:none}'
    + '.hmsteps{display:flex;flex-direction:column;gap:8px}'
    + '.hmstep{display:flex;gap:10px;align-items:baseline;border:1px solid var(--border,#2a2a2a);'
    +   'background:#0a0a0a;padding:10px 12px}'
    + '.hmstep .n{font-family:var(--px),monospace;font-size:9px;color:var(--gold,#ffd60a);'
    +   'line-height:1.2;flex:none;min-width:20px}'
    + '.hmstep b{display:block;font-family:var(--px),monospace;font-size:7.5px;'
    +   'color:var(--acid,#b6ff00);margin-bottom:4px;line-height:1.6;font-weight:normal;letter-spacing:1px}'
    + '.hmstep span{color:var(--dim,#7a7a7a);font-size:15px;line-height:1.3;display:block}'
    /* ---- what the patch looks like ---- */
    + '.hmpatch{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;max-width:760px}'
    + '.hmpatch figure{border:2px solid var(--border,#2a2a2a);background:#0e0e0e;margin:0}'
    + '.hmpatch img{width:100%;display:block;aspect-ratio:1/1;object-fit:cover;background:#0a0a0c}'
    + '.hmpatch figcaption{padding:8px 10px;border-top:2px solid var(--border,#2a2a2a);'
    +   'font-family:var(--px),monospace;font-size:7px;color:var(--dim,#7a7a7a);letter-spacing:1px}'
    /* ---- phone ---- */
    + '@media(max-width:700px){'
    +   '.hmscan{grid-template-columns:1fr;gap:14px}'
    +   '.hmdemos{max-width:320px;margin:0 auto;width:100%}'
    +   '.hmvids{grid-template-columns:1fr;max-width:340px;margin-left:auto;margin-right:auto}'
    +   '.hm h2{font-size:11px}'
    +   '.hmnfc{width:28px;height:28px}'
    + '}'
    + '@media(max-width:420px){.hmpatch{grid-template-columns:repeat(2,1fr)}}';

  function e2(s){
    return String(s==null?"":s).replace(/[&<>"]/g,function(m){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m];
    });
  }

  /* a loop: no src until it is on screen, paused again when it leaves */
  function loopVid(src,poster){
    return '<video muted loop playsinline preload="none" poster="'+e2(poster)+'" '
         + 'data-loop-src="'+e2(src)+'"></video>';
  }

  /* A still, held back the same way. loading="lazy" is NOT enough here: an image
     inside display:none (the console keeps its screens that way) has no box to
     intersect, so the browser gives up deferring and fetches it — which would
     put every sketch on the wire on a console load that never opens the shop.
     Carrying the url in data-img-src and letting the observer hand it over is
     the only version that actually costs nothing until it is looked at. */
  function still(src,alt,attrs){
    return '<img loading="lazy" alt="'+e2(alt)+'" data-img-src="'+e2(src)+'"'
         + (attrs?" "+attrs:"")+'>';
  }

  function madeHTML(){
    var h = '<section class="hm" id="hmsec">'
      + '<h2>HOW I MAKE THE CLOTHES_</h2>'
      + '<div class="hmvids">'
      + '<div class="vc"><video controls playsinline preload="none" '
      +   'poster="'+IMG+'process-recap-poster.jpg" src="'+IMG+'process-recap.mp4"></video>'
      +   '<div class="vcap"><b>PROCESS RECAP</b><span>from the first sketch to the finished shirt_</span></div></div>'
      + '<div class="vc">'+loopVid(IMG+"embroidery-loop.mp4", IMG+"embroidery-poster.jpg")
      +   '<div class="vcap"><b>THE LOGO, STITCHED</b><span>thread going into the fabric, needle by needle_</span></div></div>'
      + '</div><div class="hmshots">';

    for (var s=0;s<SHOTS.length;s++){
      h += '<a href="'+IMG+e2(SHOTS[s][0])+'">'
         + '<span class="ph">'+still(IMG+SHOTS[s][0], SHOTS[s][1]+" — "+SHOTS[s][2])+'</span>'
         + '<span class="cn">'+e2(SHOTS[s][1])+'<span class="rr">'+e2(SHOTS[s][2])+'</span></span></a>';
    }
    return h + '</div></section>';
  }

  function scanHTML(){
    var h = '<section class="hm" id="hmscansec">'
      + '<div class="hmhead">'+NFCICON+'<h2>SCAN THE MONSTER_</h2></div>'
      + '<div class="hmscan">'
      +   '<div class="hmdemos">'
      +     '<div class="demo wide">'+loopVid(IMG+"process-nfc-demo.mp4", IMG+"process-nfc-demo-poster.jpg")
      +       '<div class="tag"><i></i>THE CHIP_</div></div>'
      +     '<div class="demo">'+loopVid(SCAN+"scan-monster-loop.mp4", SCAN+"scan-monster-poster.jpg")
      +       '<div class="tag"><i></i>TAP TO OPEN_</div></div>'
      +   '</div>'
      +   '<div class="hmsteps">';

    for (var i=0;i<STEPS.length;i++){
      h += '<div class="hmstep"><span class="n">'+STEPS[i][0]+'</span>'
         + '<span><b>'+e2(STEPS[i][1])+'</b><span>'+e2(STEPS[i][2])+'</span></span></div>';
    }
    h += '</div></div><div class="hmpatch">';

    for (var p=0;p<PATCHES.length;p++){
      h += '<figure>'+still(SCAN+PATCHES[p][0], "the monster patch "+PATCHES[p][1].toLowerCase())
         + '<figcaption>'+e2(PATCHES[p][1])+'</figcaption></figure>';
    }
    return h + '</div></section>';
  }

  /* Hand every held-back source over the moment its element is on screen: the
     loops start playing (and pause again when they leave), the stills get their
     src once and are done with. No observer (old Safari) → load everything up
     front rather than show empty frames. */
  var io=null;
  function start(el){
    if(el.tagName==="IMG"){
      if(!el.getAttribute("src")) el.src=el.getAttribute("data-img-src");
      if(io) io.unobserve(el);
      return;
    }
    if(!el.getAttribute("src")) el.src=el.getAttribute("data-loop-src");
    var pr=el.play(); if(pr&&pr.catch) pr.catch(function(){});
  }
  function arm(root){
    var held=root.querySelectorAll("video[data-loop-src],img[data-img-src]");
    if(!held.length) return;
    if(!window.IntersectionObserver){
      Array.prototype.forEach.call(held,start); return;
    }
    if(!io){
      io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting) start(en.target);
          else if(en.target.tagName==="VIDEO" && !en.target.paused) en.target.pause();
        });
      /* a little ahead of the scroll so a still is never caught half-drawn,
         and so a loop is already rolling by the time it is properly in view */
      },{threshold:0.01, rootMargin:"150px 0px"});
    }
    Array.prototype.forEach.call(held,function(el){ io.observe(el); });
  }

  function mount(host,which){
    host = host || document.getElementById(which==="scan"?"howscan":"howmade");
    if (!host) return null;
    if (host.getAttribute && host.getAttribute("data-hm")==="1") return host;
    if (!document.getElementById("hmcss")){
      var st=document.createElement("style"); st.id="hmcss"; st.textContent=CSS;
      document.head.appendChild(st);
    }
    var html = which==="scan" ? scanHTML() : madeHTML();
    if (host.id==="howmade" || host.id==="howscan") host.innerHTML=html;
    else host.insertAdjacentHTML("beforeend",html);
    if (host.setAttribute) host.setAttribute("data-hm","1");
    arm(host);
    return host;
  }

  window.IBEE_PROCESS = {
    mount:     function(h){ return mount(h,"made"); },
    mountScan: function(h){ return mount(h,"scan"); },
    html: madeHTML, scanHtml: scanHTML
  };

  function auto(){
    if (document.getElementById("howmade")) mount(null,"made");
    if (document.getElementById("howscan")) mount(null,"scan");
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",auto);
  else auto();
})();
