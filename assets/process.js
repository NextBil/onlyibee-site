/* =====================================================================
   HOW I MAKE THE CLOTHES — the shared process section.

   One block, used on every page that sells something: the vault (drop/),
   the folder pages (shop/?f=), and the console's INVENTORY screen. It is
   a script instead of pasted markup because the copy has to say the same
   thing in all three places — a made-to-order piece is the promise the
   product descriptions make, so the process behind it can't drift.

   USE: put <div id="howmade"></div> where you want it and load this file.
   With no such div it appends itself to <main> (or <body>). It injects
   its own scoped CSS (.hm*) exactly once and inherits each page's colour
   variables, so it looks native on the vault and in the console alike.

   WEIGHT: the two videos are preload="none" with posters — they cost
   nothing until pressed. The stills are loading="lazy", which is also
   what keeps them off the wire inside the console's hidden screens.
   ===================================================================== */
(function(){
  "use strict";
  if (window.IBEE_PROCESS) return;

  var IMG = "/assets/img/ics-process/";

  var STEPS = [
    ["01", "PEN", "every character starts as a pen sketch on paper. nothing generated, nothing traced."],
    ["02", "INK", "scanned, then inked and coloured in photoshop until the file is ready to print."],
    ["03", "PRESS", "pressed onto the shirt by hand, one at a time. painted and embroidered where the design asks for it."],
    ["04", "PATCH", "the ics monster patch goes on last, with the nfc chip inside it. tap it and the piece proves itself."]
  ];

  var VIDS = [
    ["process-recap.mp4",   "process-recap-poster.jpg",   "",     "PROCESS RECAP", "from the first sketch to the finished shirt — how the clothes get made_"],
    ["process-nfc-demo.mp4","process-nfc-demo-poster.jpg","wide", "SCAN THE SHIRT", "the chip lives in the patch. tap your phone on it and the piece opens its own page_"]
  ];

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

  var CSS = ''
    + '.hm{margin-top:42px;border-top:2px solid var(--border,#2a2a2a);padding-top:28px}'
    + '.hm h2{font-family:var(--px),monospace;font-size:13px;color:var(--gold,#ffd60a);'
    +   'letter-spacing:1px;line-height:1.6;margin-bottom:10px}'
    + '.hm .hmsub{color:var(--dim,#7a7a7a);font-size:19px;line-height:1.4;max-width:660px;margin-bottom:22px}'
    + '.hmsteps{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:26px}'
    + '.hmstep{border:1px solid var(--border,#2a2a2a);background:#0a0a0a;padding:16px 13px}'
    + '.hmstep .n{font-family:var(--px),monospace;font-size:16px;color:var(--gold,#ffd60a);margin-bottom:10px}'
    + '.hmstep b{display:block;font-family:var(--px),monospace;font-size:8px;color:var(--acid,#b6ff00);'
    +   'margin-bottom:8px;line-height:1.6;font-weight:normal;letter-spacing:1px}'
    + '.hmstep span{color:var(--dim,#7a7a7a);font-size:17px;line-height:1.35}'
    + '.hmvids{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;'
    +   'max-width:760px;margin-bottom:20px}'
    + '.hmvids .vc{border:2px solid var(--border,#2a2a2a);background:#0e0e0e}'
    + '.hmvids video{width:100%;display:block;aspect-ratio:9/16;object-fit:cover;background:#000}'
    + '.hmvids .vc.wide video{aspect-ratio:5/4}'
    + '.hmvids .vcap{padding:9px 10px;border-top:2px solid var(--border,#2a2a2a)}'
    + '.hmvids .vcap b{font-family:var(--px),monospace;font-size:8px;color:var(--ink,#e8e8e8);'
    +   'display:block;line-height:1.7;font-weight:normal}'
    + '.hmvids .vcap span{color:var(--dim,#7a7a7a);font-size:16px;line-height:1.3;display:block;margin-top:3px}'
    + '.hmshots{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;max-width:760px}'
    + '.hmshots a{display:block;text-decoration:none;border:2px solid var(--border,#2a2a2a);background:#0e0e0e}'
    + '.hmshots .ph{display:block;aspect-ratio:1/1;overflow:hidden;background:#0a0a0c}'
    + '.hmshots .ph img{width:100%;height:100%;object-fit:cover;display:block}'
    + '.hmshots .cn{display:flex;justify-content:space-between;align-items:baseline;gap:6px;'
    +   'padding:8px 9px;border-top:2px solid var(--border,#2a2a2a);'
    +   'font-family:var(--px),monospace;font-size:7px;color:var(--ink,#e8e8e8);letter-spacing:1px}'
    + '.hmshots .rr{color:var(--dim,#7a7a7a);font-size:6.5px}'
    + '.hmshots a:hover{border-color:var(--acid,#b6ff00)}'
    + '.hmnote{margin-top:20px;border:1px solid var(--border,#2a2a2a);background:#0a0a0a;'
    +   'padding:14px 15px;color:var(--dim,#7a7a7a);font-size:18px;line-height:1.4;max-width:760px}'
    + '.hmnote b{color:var(--acid,#b6ff00);font-weight:normal}'
    + '@media(max-width:820px){.hmsteps{grid-template-columns:repeat(2,1fr)}}'
    + '@media(max-width:460px){.hmsteps{grid-template-columns:1fr}}';

  function e2(s){
    return String(s==null?"":s).replace(/[&<>"]/g,function(m){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m];
    });
  }

  function html(){
    var h = '<section class="hm" id="hmsec">'
      + '<h2>HOW I MAKE THE CLOTHES_</h2>'
      + '<div class="hmsub">no factory. every piece starts as a pen sketch on paper and ends on a '
      + 'table in paris.</div><div class="hmsteps">';

    for (var i=0;i<STEPS.length;i++){
      h += '<div class="hmstep"><div class="n">'+STEPS[i][0]+'</div><b>'+STEPS[i][1]+'</b>'
         + '<span>'+STEPS[i][2]+'</span></div>';
    }
    h += '</div><div class="hmvids">';

    for (var v=0;v<VIDS.length;v++){
      h += '<div class="vc'+(VIDS[v][2]?" "+VIDS[v][2]:"")+'">'
         + '<video controls playsinline preload="none" poster="'+IMG+e2(VIDS[v][1])+'" '
         + 'src="'+IMG+e2(VIDS[v][0])+'"></video>'
         + '<div class="vcap"><b>'+e2(VIDS[v][3])+'</b><span>'+e2(VIDS[v][4])+'</span></div></div>';
    }
    h += '</div><div class="hmshots">';

    for (var s=0;s<SHOTS.length;s++){
      h += '<a href="'+IMG+e2(SHOTS[s][0])+'">'
         + '<span class="ph"><img loading="lazy" src="'+IMG+e2(SHOTS[s][0])+'" '
         + 'alt="'+e2(SHOTS[s][1])+' — '+e2(SHOTS[s][2])+'"></span>'
         + '<span class="cn">'+e2(SHOTS[s][1])+'<span class="rr">'+e2(SHOTS[s][2])+'</span></span></a>';
    }
    h += '</div>'
      /* deliberately says nothing about run size or turnaround: those are a
         property of whichever drop is open, and they live on the drop's own
         page. This block has to still be true next drop. */
      + '<div class="hmnote">nothing is made in advance. <b>you claim it, then i make it.</b></div>'
      + '</section>';
    return h;
  }

  function mount(host){
    host = host || document.getElementById("howmade")
        || document.querySelector("main") || document.body;
    if (host.getAttribute && host.getAttribute("data-hm") === "1") return host;
    if (!document.getElementById("hmcss")){
      var st=document.createElement("style"); st.id="hmcss"; st.textContent=CSS;
      document.head.appendChild(st);
    }
    /* a dedicated #howmade div is replaced-into; anything else is appended to */
    if (host.id === "howmade") host.innerHTML = html();
    else host.insertAdjacentHTML("beforeend", html());
    if (host.setAttribute) host.setAttribute("data-hm","1");
    return host;
  }

  window.IBEE_PROCESS = { mount: mount, html: html };

  /* auto-mount only where the page asked for it by name; pages without the div
     (the console, where the shop screen mounts it on first open) stay untouched */
  function auto(){ if (document.getElementById("howmade")) mount(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
})();
