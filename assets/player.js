/* ============================================================
   IBEE RADIO — site-wide music player + neon reactive frame
   include on any page: <script src=".../assets/player.js"></script>
   ============================================================ */
(function(){
  "use strict";
  /* ---- seamless-shell awareness: never run two radios in one experience ----
     Standalone pages behave exactly as before. When a page is loaded INSIDE the
     ONLYIBEE shell/app frame, it defers to the parent's radio so the music never
     restarts. If a radio already exists in this document (SPA re-inject), skip. */
  try{
    if(window.top !== window.self){
      // Inside the ONLYIBEE shell/app frame → use the parent's persistent radio and
      // NEVER start a second one (a 2nd radio is exactly what makes the music restart).
      try{ window.IBEERADIO = window.top.IBEERADIO || null; }catch(e){ window.IBEERADIO = null; }
      return;
    }
  }catch(e){}
  if(window.IBEERADIO){ return; }
  var BASE = document.currentScript.src.replace(/player\.js.*$/, "");
  var ROOT = BASE.replace(/assets\/$/, "");
  /* iOS/iPadOS: keep the <audio> on the NATIVE path — never route it through
     Web Audio. iOS suspends the AudioContext when the screen locks, which
     silences anything piped through it; a plain media element keeps playing in
     the background (lock-screen controls via MediaSession). The neon frame then
     runs on the synthetic beat instead of a live analyser (no visuals while
     locked anyway). Desktop/Android keep the real analyser + full reactivity. */
  var IS_IOS = /iP(hone|od|ad)/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  /* the groove pressed into each record: precomputed bass/level envelopes
     (assets/beat-data.js -> window.IBEE_BEAT). Where the live analyser can't run
     (iOS native path), visuals read the groove at audio.currentTime instead —
     true per-song reactivity with zero Web Audio. Self-loaded so no page needs
     an extra <script> tag; everything degrades gracefully if it's missing. */
  try{
    var bsc = document.createElement("script");
    /* Stamped per BROWSING SESSION, not per load. A fresh stamp still picks up a
       newly pushed beat-data.js the next time the site is opened, so IBEE STUDIO
       still just replaces the file — but Date.now() meant this 300KB file could
       never be cached, and iOS re-downloads it every time it reloads a tab it
       evicted for memory. sessionStorage survives that reload; the tab reuses
       the copy it already has. Old ?v=N versioning stays retired. */
    var stamp;
    try{ stamp = sessionStorage.getItem("ibee_cb"); if(!stamp){ stamp = String(Date.now()); sessionStorage.setItem("ibee_cb", stamp); } }
    catch(e){ stamp = String(Date.now()); }
    bsc.src = BASE + "beat-data.js?cb=" + stamp;
    document.head.appendChild(bsc);
  }catch(e){}
  /* extra records pressed in IBEE STUDIO (assets/songs-extra.js →
     window.IBEE_SONGS_EXTRA). ADDITIVE ONLY: slugs already in SONGS below are
     skipped, so the built-in list always wins; if the file doesn't exist the
     radio is exactly as before. This is how new songs join the site with no
     code edits — studio exports the file, it gets uploaded, done. */
  try{
    var xsc = document.createElement("script");
    xsc.src = BASE + "songs-extra.js?cb=" + Date.now();
    xsc.onload = function(){ addExtras(); };
    document.head.appendChild(xsc);
  }catch(e){}
  /* owner flag: NOUVEAUX PUNK 2 is private for now — its songs are kept OUT of
     the radio for everyone (see addExtras) and folded back in only when the
     owner account is confirmed. owner.js resolves that once and fires the event
     we listen for below. Remove this + the np2 guards in addExtras to go public. */
  try{
    var osc = document.createElement("script");
    osc.src = BASE + "owner.js?cb=" + Date.now();
    document.head.appendChild(osc);
  }catch(e){}
  try{
    document.addEventListener("ibee-owner", function(ev){
      if(ev && ev.detail){ window.IBEE_SHOW_NP2 = true; try{ addExtras(); }catch(e){} }
    });
  }catch(e){}
  /* cloud save: sync favourites / badges / room progress to the signed-in ACCOUNT
     so they follow the member across devices (assets/cloudsync.js self-guards to
     the top window; needs member/cloud-sync.sql). Loaded once here so no page needs
     its own <script> tag — same self-loading pattern as beat-data / songs-extra. */
  try{
    var csc = document.createElement("script");
    csc.src = BASE + "cloudsync.js?cb=" + Date.now();
    document.head.appendChild(csc);
  }catch(e){}
  /* Public community telemetry: the client keeps an anonymous presence heartbeat
     on every standalone page and listens for actual radio play events. Framed
     pages defer to the shell above, so a visit is never counted twice. */
  try{
    var tsc = document.createElement("script");
    tsc.src = BASE + "stats-client.js?v=8";
    document.head.appendChild(tsc);
  }catch(e){}

  /* ---------- albums: the cover + name every song wears, and (for specials)
     the ROOM it belongs to + the galaxy it maps to in the music universe.
     `room` present ⇒ the album is a "special project" that has its own
     immersive page; those get a GO TO THE ROOM button by the player. -------- */
  var ALBUMS = {
    /* `ib` is the unfiled fallback — every real record names its album below.
       (RARE SOUL SESSIONS was retired 2026-08-19; the catalogue is the three
       records now: NOUVEAUX PUNK, NOUVEAUX PUNK 2, 20 MIN ZA SESSION.) */
    ib:  { name:"ONLY IBEE",          cover: ROOT+"assets/img/follow-me.jpg" },
    np:  { name:"NOUVEAUX PUNK",      cover: ROOT+"assets/img/nouveaux-punk.jpg",
           room: ROOT+"nouveauxpunk/", galaxy:"np",  tint:"#ff2b2b", tag:"THE EXPERIENCE" },
    np2: { name:"NOUVEAUX PUNK 2",    cover: ROOT+"assets/img/nouveaux-punk-2.jpg",
           room: ROOT+"np2/",          galaxy:"np2", tint:"#ff1f6f", tag:"THE SEQUEL" },
    mzs: { name:"20 MIN ZA SESSION",  cover: ROOT+"assets/img/20mzs-album.jpg",
           room: ROOT+"20minzasession/", galaxy:"mzs", tint:"#ff7a1a" }
  };
  function album(id){ return ALBUMS[id] || ALBUMS.ib; }

  /* f = tidy path in assets/audio/songs/ · r = original filename at site root (fallback)
     al = album id (cover + name) · special albums also expose a ROOM. */
  var SONGS = [
    /* ---- special projects — playable on the radio AND have their own room ---- */
    {f:"20mzs.mp3",         r:"Only Ibee - 20MZS.mp3", n:"20 MIN ZA SESSION", hue:32, al:"mzs"}
  ];
  /* NOUVEAUX PUNK lives as a full 27-track EXPERIENCE inside its room, so on the
     radio it shows as one album card whose action is "go to the room" (roomOnly).
     Any album with a `room` also gets a persistent GO TO THE ROOM button. */
  var ROOMS = [
    {al:"np", roomOnly:true},
    {al:"np2", roomOnly:true}
  ];
  function songCover(s){ return s.cover || album(s.al).cover; }

  /* ---------- styles ---------- */
  var css = ""
  +"#nf{position:fixed;inset:0;pointer-events:none;z-index:8990;border:2px solid transparent;transition:border-color .3s}"
  +".nfc{position:fixed;pointer-events:none;z-index:8991;opacity:var(--ga,0);"
  +"width:calc(110px + var(--beat,0)*260px);height:calc(110px + var(--beat,0)*260px)}"
  +".nfc.c1{top:0;left:0;background:radial-gradient(circle at 0 0,hsla(var(--songhue,75),100%,60%,.95),hsla(var(--songhue,75),100%,55%,.35) 40%,transparent 72%)}"
  +".nfc.c2{top:0;right:0;background:radial-gradient(circle at 100% 0,hsla(var(--songhue,75),100%,60%,.95),hsla(var(--songhue,75),100%,55%,.35) 40%,transparent 72%)}"
  +".nfc.c3{bottom:0;left:0;background:radial-gradient(circle at 0 100%,hsla(var(--songhue,75),100%,60%,.95),hsla(var(--songhue,75),100%,55%,.35) 40%,transparent 72%)}"
  +".nfc.c4{bottom:0;right:0;background:radial-gradient(circle at 100% 100%,hsla(var(--songhue,75),100%,60%,.95),hsla(var(--songhue,75),100%,55%,.35) 40%,transparent 72%)}"
  +"#radiochip{position:fixed;right:14px;bottom:60px;z-index:8995;font-family:'Press Start 2P',monospace;"
  +"font-size:9px;background:#000;color:#b6ff00;border:1px solid #2a2a2a;padding:10px 12px;cursor:pointer;user-select:none}"
  +"#radiochip:hover{border-color:#b6ff00}"
  +"#radiochip .eq{display:inline-flex;gap:2px;align-items:flex-end;height:10px;margin-right:7px;vertical-align:middle}"
  +"#radiochip .eq i{width:2px;height:3px;background:#b6ff00;animation:req .7s ease-in-out infinite}"
  +"#radiochip .eq i:nth-child(2){animation-delay:.2s}#radiochip .eq i:nth-child(3){animation-delay:.4s}"
  +"#radiochip.idle .eq i{animation:none;height:3px}"
  +"@keyframes req{0%,100%{height:3px}50%{height:10px}}"
  +"#radiopanel{position:fixed;right:14px;bottom:104px;z-index:8996;width:min(340px,92vw);"
  +"background:rgba(0,0,0,.94);border:2px solid #2a2a2a;display:none;flex-direction:column;font-family:'VT323',monospace;color:#e8e8e8}"
  +"#radiopanel.open{display:flex}"
  +"#rp-head{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #2a2a2a;"
  +"font-family:'Press Start 2P',monospace;font-size:9px;color:#b6ff00}"
  +"#rp-close{cursor:pointer;color:#7a7a7a;font-size:12px;padding:2px 6px}#rp-close:hover{color:#ff2b2b}"
  +"#rp-now{padding:12px;border-bottom:1px solid #2a2a2a}"
  /* now-playing: album cover next to the title, album name small under it */
  +"#rp-nowtop{display:flex;gap:11px;align-items:center;cursor:pointer;margin-bottom:11px}"
  +"#rp-cover{width:52px;height:52px;flex:none;object-fit:cover;background:#111;border:1px solid #2a2a2a;image-rendering:auto}"
  +"#rp-cover{cursor:zoom-in}#rp-cover:hover{border-color:#b6ff00;box-shadow:0 0 12px rgba(182,255,0,.35)}"
  +"#rp-nowtext{min-width:0;flex:1}"
  +"#rp-title{font-family:'Press Start 2P',monospace;font-size:10px;color:#fff;margin-bottom:5px;line-height:1.4;"
  +"white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  +"#rp-album{color:#8f8f8f;font-size:15px;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  +"#rp-album .browse{color:#b6ff00;opacity:.75}"
  +"#rp-seek{position:relative;height:14px;border:1px solid #2a2a2a;padding:2px;cursor:pointer;touch-action:none}"
  +"#rp-fill{height:100%;width:0%;background:#b6ff00;position:relative}"
  +"#rp-times{display:flex;justify-content:space-between;color:#7a7a7a;font-size:14px;margin-top:3px}"
  +"#rp-ctrl{display:flex;gap:8px;margin-top:10px}"
  +"#rp-ctrl button{font-family:'Press Start 2P',monospace;font-size:10px;flex:1;padding:9px 0;"
  +"background:#0e0e0e;color:#e8e8e8;border:1px solid #2a2a2a;cursor:pointer}"
  +"#rp-ctrl button:hover{border-color:#b6ff00;color:#b6ff00}"
  +"#rp-ctrl button.main{background:#b6ff00;color:#000;border-color:#b6ff00}"
  +"#rp-shuf svg{display:block;margin:auto}"
  +"#rp-shuf.on{background:#b6ff00;color:#000;border-color:#b6ff00}"
  +"#rp-lyr{border-color:#b6ff00 !important;animation:rlyrglow 1.8s ease-in-out infinite}"
  +"#rp-lyr img{width:24px;height:24px;image-rendering:pixelated;display:block;margin:auto}"
  +"#rp-lyr:hover{background:#131a00}"
  +"@keyframes rlyrglow{0%,100%{box-shadow:0 0 6px rgba(182,255,0,.2)}50%{box-shadow:0 0 16px rgba(182,255,0,.55)}}"
  /* GO TO THE ROOM — special-project button, always near the player */
  +"#rp-room{margin-top:10px;display:none;text-decoration:none}"
  +"#rp-room.show{display:block}"
  +"#rp-room a{display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Press Start 2P',monospace;"
  +"font-size:9px;padding:11px 10px;text-decoration:none;color:#000;background:var(--roomtint,#ff2b2b);"
  +"border:1px solid var(--roomtint,#ff2b2b);letter-spacing:1px;animation:roompulse 1.9s ease-in-out infinite}"
  +"#rp-room a:hover{filter:brightness(1.12)}"
  +"@keyframes roompulse{0%,100%{box-shadow:0 0 6px rgba(255,80,40,.35)}50%{box-shadow:0 0 18px rgba(255,80,40,.75)}}"
  /* search + view toggle */
  +"#rp-tools{display:flex;gap:8px;align-items:center;padding:9px 12px;border-bottom:1px solid #2a2a2a}"
  +"#rp-search{flex:1;background:#0a0a0a;border:1px solid #2a2a2a;color:#e8e8e8;font-family:'VT323',monospace;"
  +"font-size:17px;padding:7px 9px;outline:none}"
  +"#rp-search:focus{border-color:#b6ff00}"
  +"#rp-search::placeholder{color:#5a5a5a}"
  +"#rp-view{font-family:'Press Start 2P',monospace;font-size:8px;padding:0 9px;height:33px;flex:none;"
  +"background:#0e0e0e;color:#7a7a7a;border:1px solid #2a2a2a;cursor:pointer}"
  +"#rp-view:hover,#rp-view.on{border-color:#b6ff00;color:#b6ff00}"
  +"#rp-list{overflow-y:auto;max-height:min(340px,44vh)}"
  /* ----- list rows (with mini cover) ----- */
  +".rp-row{display:flex;align-items:center;gap:10px;padding:7px 12px;cursor:pointer;color:#9a9a9a;font-size:17px;border-bottom:1px solid #161616}"
  +".rp-row:hover{background:#101010;color:#fff}"
  +".rp-row.now{color:#b6ff00;background:#0d1400}"
  +".rp-row .no{font-family:'Press Start 2P',monospace;font-size:8px;width:22px;color:#555}"
  +".rp-row.now .no{color:#b6ff00}"
  +".rp-row .rc{width:34px;height:34px;flex:none;object-fit:cover;background:#111;border:1px solid #222}"
  +".rp-row .rt{min-width:0;flex:1;overflow:hidden}"
  +".rp-row .rt .rn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  +".rp-row .rt .ra{font-size:13px;color:#6a6a6a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  +".rp-row .rmroom{font-family:'Press Start 2P',monospace;font-size:7px;color:#000;background:var(--rt,#ff2b2b);padding:5px 6px;flex:none}"
  +".rp-row.locked{opacity:.5;cursor:not-allowed}"
  +".rp-row.locked .rc{filter:brightness(.4) grayscale(.7)}"
  +".rp-row .lk{width:13px;height:13px;flex:none;color:#ff2b2b}"
  /* ----- Spotify-style grid with 3D sideways tilt ----- */
  +"#rp-list.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:12px}"
  +".rp-tile{cursor:pointer;perspective:640px}"
  +".rp-tile .art{position:relative;width:100%;aspect-ratio:1;background:#0c0c0c;border:1px solid #222;"
  +"transform:rotateY(-19deg);transform-origin:center;transition:transform .4s cubic-bezier(.2,.7,.2,1),box-shadow .4s;"
  +"box-shadow:-12px 9px 24px rgba(0,0,0,.65);overflow:hidden}"
  +".rp-tile:hover .art{transform:rotateY(0);box-shadow:0 10px 26px rgba(0,0,0,.6)}"
  +".rp-tile.now .art{border-color:#b6ff00;box-shadow:-10px 9px 24px rgba(0,0,0,.6),0 0 16px rgba(182,255,0,.4)}"
  +".rp-tile .art img{width:100%;height:100%;object-fit:cover;display:block}"
  +".rp-tile .art.pad img{object-fit:contain;padding:9%;background:radial-gradient(circle at 50% 40%,#241207,#0a0604)}"
  +".rp-tile .gtag{position:absolute;left:0;bottom:0;right:0;padding:5px 6px;font-family:'VT323',monospace;font-size:13px;"
  +"color:#d7d7d7;background:linear-gradient(0deg,rgba(0,0,0,.82),transparent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  +".rp-tile .gnow{position:absolute;top:6px;left:6px;font-family:'Press Start 2P',monospace;font-size:7px;color:#000;background:#b6ff00;padding:3px 4px}"
  +".rp-tile .nm{font-family:'Press Start 2P',monospace;font-size:8px;color:#cfcfcf;margin-top:8px;line-height:1.5;"
  +"white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  +".rp-tile:hover .nm{color:#fff}"
  +".rp-tile.now .nm{color:#b6ff00}"
  /* locked tiles: darkened + lock badge */
  +".rp-tile.locked .art img{filter:brightness(.32) grayscale(.75)}"
  +".rp-tile.locked .art::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,.35)}"
  +".rp-tile.locked .lockb{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;"
  +"width:30px;height:30px;color:#ff2b2b;filter:drop-shadow(0 0 8px rgba(255,43,43,.6))}"
  +".rp-tile.locked .nm{color:#6a6a6a}"
  /* room tile flag */
  +".rp-tile .roomb{position:absolute;top:6px;right:6px;z-index:2;font-family:'Press Start 2P',monospace;font-size:7px;"
  +"color:#000;background:var(--rt,#ff2b2b);padding:4px 5px;letter-spacing:.5px}"
  +"#rp-empty{padding:22px 12px;text-align:center;color:#5a5a5a;font-family:'Press Start 2P',monospace;font-size:8px;line-height:2;display:none}"
  /* ----- favourites: hearts on every song + the ♥ filter ----- */
  +".rp-row .fv{flex:none;font-size:16px;line-height:1;color:#3a3a3a;cursor:pointer;padding:3px 5px}"
  +".rp-row .fv:hover{color:#ff2b6b}"
  +".rp-row .fv.on{color:#ff2b6b;text-shadow:0 0 8px rgba(255,43,107,.6)}"
  +".rp-tile .fv{position:absolute;right:5px;bottom:26px;z-index:3;font-size:16px;line-height:1;"
  +"color:rgba(255,255,255,.45);cursor:pointer;text-shadow:0 1px 4px #000;padding:3px}"
  +".rp-tile .fv.on{color:#ff2b6b;text-shadow:0 0 8px rgba(255,43,107,.8)}"
  +"#rp-favtgl{font-family:'Press Start 2P',monospace;font-size:10px;padding:0 9px;height:33px;flex:none;"
  +"background:#0e0e0e;color:#7a7a7a;border:1px solid #2a2a2a;cursor:pointer}"
  +"#rp-favtgl:hover,#rp-favtgl.on{border-color:#ff2b6b;color:#ff2b6b}"
  +"#rp-favb.on{color:#ff2b6b;border-color:#ff2b6b}"
  +"#rp-info{position:fixed;inset:0;z-index:9002;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.72);font-family:'VT323',monospace}"
  +"#rp-info.on{display:flex}#rp-info-card{position:relative;width:min(390px,94vw);max-height:min(580px,86vh);overflow:auto;border:2px solid #2a2a2a;background:#0a0a0a;padding:18px;box-shadow:0 18px 55px rgba(0,0,0,.75)}"
  +"#rp-info-close{position:absolute;top:9px;right:9px;border:1px solid #2a2a2a;background:#111;color:#aaa;padding:5px 8px;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:9px}#rp-info-close:hover{border-color:#ff2b2b;color:#ff2b2b}"
  +"#rp-info-top{display:flex;gap:14px;padding-right:32px;align-items:center}#rp-info-art{width:92px;height:92px;object-fit:cover;border:1px solid #b6ff00;background:#111}#rp-info-title{font-family:'Press Start 2P',monospace;font-size:13px;line-height:1.5;color:#fff}#rp-info-album{font-size:16px;color:#999;margin-top:5px}"
  +"#rp-info-plays{margin:17px 0 13px;padding:9px 10px;border-left:2px solid #b6ff00;background:#101408;font-family:'Press Start 2P',monospace;font-size:9px;color:#b6ff00}#rp-info-copy{font-size:18px;line-height:1.38;color:#c5c5c5}#rp-info-copy p{margin:10px 0}#rp-info-copy b{font-family:'Press Start 2P',monospace;font-size:8px;color:#777}"
  ;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var LOCK_SVG = "<svg class='lk' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='11' width='14' height='9' rx='1.5'/><path d='M8 11V8a4 4 0 0 1 8 0v3' fill='none' stroke='currentColor' stroke-width='2'/></svg>";
  var LOCK_BIG = "<svg class='lockb' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='11' width='14' height='9' rx='1.5'/><path d='M8 11V8a4 4 0 0 1 8 0v3' fill='none' stroke='currentColor' stroke-width='2'/></svg>";

  /* ---------- DOM ---------- */
  var nf = document.createElement("div"); nf.id = "nf"; document.body.appendChild(nf);
  ["c1","c2","c3","c4"].forEach(function(c){
    var d = document.createElement("div"); d.className = "nfc "+c; document.body.appendChild(d);
  });
  var chip = document.createElement("div"); chip.id = "radiochip"; chip.className = "idle";
  chip.innerHTML = '<span class="eq"><i></i><i></i><i></i></span>RADIO';
  document.body.appendChild(chip);
  var panel = document.createElement("div"); panel.id = "radiopanel";
  panel.innerHTML = ''
    +'<div id="rp-head"><span>IBEE RADIO_</span><span id="rp-close">✕</span></div>'
    +'<div id="rp-now">'
    +'  <div id="rp-nowtop" title="browse all songs & albums">'
    +'    <img id="rp-cover" alt="" src="">'
    +'    <div id="rp-nowtext"><div id="rp-title">—</div>'
    +'      <div id="rp-album">rare soul sessions <span class="browse">· tap to browse</span></div></div>'
    +'  </div>'
    +'  <div id="rp-seek"><div id="rp-fill"></div></div>'
    +'  <div id="rp-times"><span id="rp-cur">0:00</span><span id="rp-tot">--:--</span></div>'
    +'  <div id="rp-ctrl">'
    +'    <button id="rp-prev">◀◀</button>'
    +'    <button id="rp-play" class="main">►</button>'
    +'    <button id="rp-next">▶▶</button>'
    +'    <button id="rp-shuf" title="aleatory — let fate pick"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h4l10 10h4"/><path d="M3 17h4l2.5-2.5"/><path d="M14.5 9.5 17 7h4"/><path d="M18 4l3 3-3 3"/><path d="M18 14l3 3-3 3"/></svg></button>'
    +'    <button id="rp-favb" title="save to my favourites">♡</button>'
    +'    <button id="rp-share" title="share a link to this song">⤴</button>'
    +'    <button id="rp-lyr" title="LYRICS ENGINE"><img alt="lyrics" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M1 3 Q4.5 1.4 8 3 Q11.5 1.4 15 3 V13 Q11.5 11.4 8 13 Q4.5 11.4 1 13 Z\' fill=\'%23b6ff00\' stroke=\'%23223300\' stroke-width=\'.7\'/%3E%3Cline x1=\'8\' y1=\'3\' x2=\'8\' y2=\'13\' stroke=\'%23223300\' stroke-width=\'.9\'/%3E%3Cline x1=\'2.8\' y1=\'5\' x2=\'6.4\' y2=\'4.6\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'2.8\' y1=\'7\' x2=\'6.4\' y2=\'6.6\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'2.8\' y1=\'9\' x2=\'6.4\' y2=\'8.6\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'9.6\' y1=\'4.6\' x2=\'13.2\' y2=\'5\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'9.6\' y1=\'6.6\' x2=\'13.2\' y2=\'7\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Crect x=\'11\' y=\'2\' width=\'1.6\' height=\'4.4\' fill=\'%23ff2b2b\'/%3E%3C/svg%3E"></button>'
    +'  </div>'
    +'  <div id="rp-room"></div>'
    +'</div>'
    +'<div id="rp-tools">'
    +'  <input id="rp-search" type="text" placeholder="search songs & albums_" autocomplete="off" spellcheck="false">'
    +'  <button id="rp-favtgl" title="my favourites only">♥</button>'
    +'  <button id="rp-view" title="grid / list view">▦ GRID</button>'
    +'</div>'
    +'<div id="rp-list"></div>'
    +'<div id="rp-empty">NO SIGNALS_<br>TRY ANOTHER WORD</div>';
  document.body.appendChild(panel);
  var infoPanel=document.createElement("div"); infoPanel.id="rp-info";
  infoPanel.innerHTML='<section id="rp-info-card" role="dialog" aria-modal="true" aria-label="Song information"><button id="rp-info-close" aria-label="Close song information">✕</button><div id="rp-info-top"><img id="rp-info-art" alt=""><div><div id="rp-info-title">—</div><div id="rp-info-album">—</div></div></div><div id="rp-info-plays">PLAYS // READING_</div><div id="rp-info-copy"></div></section>';
  document.body.appendChild(infoPanel);

  var audio = document.createElement("audio");
  audio.id = "radioaudio"; audio.preload = "none";
  document.body.appendChild(audio);

  var $ = function(id){ return document.getElementById(id); };
  var list = $("rp-list");

  /* placeholder cover generator (hue disc) so a missing image never shows broken */
  function fallbackCover(hue){
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E"
      +"%3Crect width='100' height='100' fill='hsl("+(hue||190)+",45%25,12%25)'/%3E"
      +"%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='hsl("+(hue||190)+",90%25,55%25)' stroke-width='3'/%3E"
      +"%3Ccircle cx='50' cy='50' r='7' fill='hsl("+(hue||190)+",90%25,55%25)'/%3E%3C/svg%3E";
  }
  /* ---- COVER SIZE ---------------------------------------------------------
     Safari decodes an <img> at its NATURAL size and holds that bitmap for as
     long as the element lives — the drawn size is irrelevant. The radio panel
     lists 65 records at 34x34; pointed at the full covers that is hundreds of
     megabytes of decoded art in one tab, which is what makes iOS announce
     "this webpage was reloaded". assets/img/thumb (128px) and assets/img/mid
     (384px) hold generated copies under the SAME filename, so picking a size
     is a path rewrite — and the full-size file is the first onerror fallback,
     so a cover with no thumb still shows. Rebuild with tools/make-thumbs.sh. */
  function sized(u, bucket){
    var m = String(u||"").match(/^((?:[^?#]*\/)?assets\/(?:img|covers)\/)([^\/?#]+)$/);
    return m ? m[1]+bucket+"/"+m[2] : u;
  }
  function coverImg(cls, src, hue, bucket){
    var small = sized(src, bucket||"thumb"), esc2 = function(x){ return String(x).replace(/'/g,"%27"); };
    return '<img class="'+cls+'" alt="" loading="lazy" decoding="async" src="'+small+'" '
      +'onerror="if(this.src.indexOf(\''+esc2(small)+'\')>-1&&\''+esc2(small)+'\'!==\''+esc2(src)+'\'){this.src=\''+esc2(src)+'\';return;}this.onerror=null;this.src=\''+fallbackCover(hue)+'\'">';
  }

  /* ---------- favourites: hearts saved on this device (ibee_favs = {slug:1}) ---------- */
  function favs(){ try{ return JSON.parse(localStorage.getItem("ibee_favs")||"{}")||{}; }catch(e){ return {}; } }
  function isFav(slug){ return !!favs()[slug]; }
  function setFav(slug,on){ var f=favs(); if(on)f[slug]=1; else delete f[slug];
    try{ localStorage.setItem("ibee_favs",JSON.stringify(f)); }catch(e){} }

  /* ===================== LIST + GRID RENDERING ===================== */
  var viewMode = "list";   // "list" | "grid"
  var query = "";
  var favOnly = false;     // ♥ filter: only the songs you saved

  function matches(name, albName){
    if(!query) return true;
    var q = query.toLowerCase();
    return name.toLowerCase().indexOf(q) >= 0 || albName.toLowerCase().indexOf(q) >= 0;
  }

  function render(){
    list.className = viewMode === "grid" ? "grid" : "";
    var html = "", shown = 0, i;
    if(viewMode === "grid"){
      for(i=0;i<SONGS.length;i++){
        var s = SONGS[i], al = album(s.al);
        if(!matches(s.n, al.name)) continue;
        if(favOnly && !isFav(s.f)) continue;
        shown++;
        var padc = al.pad ? " pad" : "";
        html += '<div class="rp-tile'+(i===cur?" now":"")+(s.locked?" locked":"")+'" data-i="'+i+'"'
          + (al.room?' style="--rt:'+(al.tint||"#ff2b2b")+'"':'')+'>'
          + '<div class="art'+padc+'">'+coverImg("", songCover(s), s.hue, "mid")
          + (i===cur?'<span class="gnow">NOW</span>':'')
          + (s.locked?LOCK_BIG:'')
          + (al.room?'<span class="roomb">ROOM</span>':'')
          + '<span class="fv'+(isFav(s.f)?" on":"")+'" data-fv="'+i+'" title="favourite">♥</span>'
          + '<span class="gtag">'+esc(al.name)+'</span></div>'
          + '<div class="nm">'+esc(s.n)+'</div></div>';
      }
      /* album cards for room-only specials (e.g. NOUVEAUX PUNK) */
      ROOMS.forEach(function(r){
        var al = album(r.al);
        if(!matches(al.name, al.name)) return;
        if(favOnly) return;
        shown++;
        html += '<div class="rp-tile" data-room="'+r.al+'" style="--rt:'+(al.tint||"#ff2b2b")+'">'
          + '<div class="art'+(al.pad?" pad":"")+'">'+coverImg("", al.cover, 110, "mid")
          + '<span class="roomb">ROOM</span>'
          + '<span class="gtag">ALBUM · '+esc(al.tag||"THE EXPERIENCE")+'</span></div>'
          + '<div class="nm">'+esc(al.name)+'</div></div>';
      });
    } else {
      for(i=0;i<SONGS.length;i++){
        var s2 = SONGS[i], al2 = album(s2.al);
        if(!matches(s2.n, al2.name)) continue;
        if(favOnly && !isFav(s2.f)) continue;
        shown++;
        html += '<div class="rp-row'+(i===cur?" now":"")+(s2.locked?" locked":"")+'" data-i="'+i+'"'
          + (al2.room?' style="--rt:'+(al2.tint||"#ff2b2b")+'"':'')+'>'
          + '<span class="no">'+String(i+1).padStart(2,"0")+'</span>'
          + coverImg("rc", songCover(s2), s2.hue, "thumb")
          + '<span class="rt"><span class="rn">'+esc(s2.n)+'</span><span class="ra">'+esc(al2.name)+'</span></span>'
          + '<span class="fv'+(isFav(s2.f)?" on":"")+'" data-fv="'+i+'" title="favourite">♥</span>'
          + (s2.locked?LOCK_SVG:(al2.room?'<span class="rmroom">ROOM</span>':''))
          + '</div>';
      }
      ROOMS.forEach(function(r){
        var al = album(r.al);
        if(!matches(al.name, al.name)) return;
        if(favOnly) return;
        shown++;
        html += '<div class="rp-row" data-room="'+r.al+'" style="--rt:'+(al.tint||"#ff2b2b")+'">'
          + '<span class="no">EP</span>'
          + coverImg("rc", al.cover, 110, "thumb")
          + '<span class="rt"><span class="rn">'+esc(al.name)+'</span><span class="ra">'+esc((al.tag||"the experience").toLowerCase())+' · tap for the room</span></span>'
          + '<span class="rmroom">ROOM</span></div>';
      });
    }
    list.innerHTML = html;
    $("rp-empty").innerHTML = (favOnly && !query) ? "NO FAVOURITES YET_<br>TAP ♥ ON A SONG" : "NO SIGNALS_<br>TRY ANOTHER WORD";
    $("rp-empty").style.display = shown ? "none" : "block";
    bindRows();
  }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m];}); }

  function bindRows(){
    Array.prototype.forEach.call(list.children, function(el){
      var roomId = el.getAttribute("data-room");
      if(roomId){ el.onclick = function(){ gotoRoom(roomId); }; return; }
      var i = +el.dataset.i;
      el.onclick = function(){
        var s = SONGS[i];
        if(s && s.locked){ return; }   // locked → not playable
        play(i); openPanel();
      };
    });
    /* the hearts: toggle without playing the row */
    Array.prototype.forEach.call(list.querySelectorAll(".fv"), function(el){
      el.onclick = function(ev){
        ev.stopPropagation();
        var i = +el.getAttribute("data-fv"), s = SONGS[i]; if(!s) return;
        var on = !isFav(s.f); setFav(s.f, on);
        el.classList.toggle("on", on);
        if(i === cur) paintFav();
        if(favOnly && !on) render();   // un-hearted inside the ♥ filter → it leaves the list
      };
    });
  }

  function gotoRoom(id){
    var al = album(id);
    if(al.room){ location.href = al.room; }
  }

  /* ---------- state ---------- */
  var cur = -1, wantResume = false, needLoad = false, pendingTime = 0, shuffle = false;
  function save(){
    try{ localStorage.setItem("ibee_radio", JSON.stringify({
      i: cur, t: needLoad ? (pendingTime||0) : (audio.currentTime||0), p: !audio.paused && cur>=0, s: shuffle
    })); }catch(e){}
  }
  /* aleatory mode: next song is a surprise (never the same one twice); skip locked */
  /* ---------- THE QUEUE ----------
     The shell hands us the list the visitor is actually looking at (an album,
     the hearts, a search) via setQueue. Playback then walks THAT, in that order,
     so LIKED SONGS behaves like a playlist and an album plays album-order.
     Empty or unset → the whole catalogue, exactly as before. Shuffle still
     shuffles, but inside the queue rather than across everything. */
  var QUEUE = null;
  function queueList(){
    if(!QUEUE || !QUEUE.length) return null;
    var q = QUEUE.filter(function(i){ return i>=0 && i<SONGS.length && !SONGS[i].locked; });
    return q.length ? q : null;
  }
  function stepQueue(dir){
    var q = queueList(); if(!q) return -1;
    var at = q.indexOf(cur);
    if(at < 0) return q[0];                       /* playing something outside it → start at its head */
    if(shuffle && q.length > 1){
      var j, guard=0; do{ j = q[Math.floor(Math.random()*q.length)]; }while(j===cur && ++guard<40);
      return j;
    }
    return q[(at + dir + q.length) % q.length];
  }

  function nextIndex(){
    var qi = stepQueue(1); if(qi >= 0) return qi;
    if(shuffle && SONGS.length > 1){
      var j, guard=0; do{ j = Math.floor(Math.random()*SONGS.length); }while((j === cur || SONGS[j].locked) && ++guard<40);
      return j;
    }
    var k = cur, guard2=0;
    do{ k = (k + 1) % SONGS.length; }while(SONGS[k].locked && ++guard2 < SONGS.length);
    return k;
  }
  function prevIndex(){
    var qi = stepQueue(-1); if(qi >= 0) return qi;
    var k = cur < 0 ? 0 : cur, guard=0;
    do{ k = (k - 1 + SONGS.length) % SONGS.length; }while(SONGS[k].locked && ++guard < SONGS.length);
    return k;
  }
  function setShuffle(on){
    shuffle = !!on;
    var b = document.getElementById("rp-shuf");
    if(b) b.classList.toggle("on", shuffle);
    save();
  }
  setInterval(save, 2000);
  window.addEventListener("pagehide", save);

  function fmt(s){ if(!isFinite(s)) return "--:--"; var m=Math.floor(s/60), ss=Math.floor(s%60); return m+":"+(ss<10?"0":"")+ss; }

  function markRows(){
    Array.prototype.forEach.call(list.children, function(el){
      if(el.getAttribute("data-room")) return;
      var on = (+el.dataset.i === cur);
      el.classList.toggle("now", on);
      if(viewMode==="grid"){
        var g = el.querySelector(".gnow");
        if(on && !g && !el.classList.contains("locked")){
          var s=document.createElement("span"); s.className="gnow"; s.textContent="NOW";
          var art=el.querySelector(".art"); if(art) art.insertBefore(s, art.firstChild);
        } else if(!on && g){ g.remove(); }
      }
    });
  }

  /* update the now-playing header: cover + title + album, and the ROOM button */
  function paintNow(){
    if(cur < 0) return;
    var s = SONGS[cur], al = album(s.al);
    $("rp-title").textContent = s.n;
    $("rp-album").innerHTML = esc(al.name) + ' <span class="browse">· tap to browse</span>';
    var cov = $("rp-cover"), full = songCover(s), small = sized(full, "mid");
    /* 52px on screen: the 384px copy is plenty, and the full file is the first
       thing tried if that copy is missing. */
    cov.onerror = function(){ if(cov.src.indexOf(small)>-1 && small!==full){ cov.src=full; return; } cov.onerror=null; cov.src = fallbackCover(s.hue); };
    cov.src = small;
    cov.style.padding = al.pad ? "6px" : "0";
    cov.style.background = al.pad ? "radial-gradient(circle at 50% 40%,#241207,#0a0604)" : "#111";
    paintRoomBtn(al);
    paintFav();
  }
  function paintFav(){
    var b = $("rp-favb"); if(!b) return;
    var on = cur >= 0 && isFav(SONGS[cur].f);
    b.textContent = on ? "♥" : "♡";
    b.classList.toggle("on", on);
  }
  /* a song's shareable address: the site root adopts ?s=<slug> and plays it */
  function songLink(s){ return ROOT + "?s=" + encodeURIComponent(s.f.replace(/\.mp3$/i,"")); }
  function shareSong(s, btn){
    var url = songLink(s);
    try{ if(navigator.clipboard) navigator.clipboard.writeText(url); }catch(e){}
    if(navigator.share){ navigator.share({title:s.n+" — ONLY IBEE", url:url}).catch(function(){}); }
    if(btn){ var t = btn.textContent; btn.textContent = "✓"; btn.title = "link copied_";
      setTimeout(function(){ btn.textContent = t; }, 1400); }
  }
  function paintRoomBtn(al){
    var box = $("rp-room");
    if(al && al.room){
      box.innerHTML = '<a href="'+al.room+'">▶ GO TO THE ROOM</a>';
      box.style.setProperty("--roomtint", al.tint || "#ff2b2b");
      box.classList.add("show");
    } else {
      box.classList.remove("show");
      box.innerHTML = "";
    }
  }

  function load(i, time){
    cur = ((i % SONGS.length) + SONGS.length) % SONGS.length;
    var s = SONGS[cur];
    // try: tidy folder → tidy name at site root → original name at site root
    var cands = [BASE + "audio/songs/" + s.f, ROOT + s.f, ROOT + encodeURI(s.r)];
    /* 20mzs lives in assets/audio/ (not /songs/) and at the site root */
    if(s.al === "mzs"){ cands = [BASE + "audio/" + s.f, ROOT + s.f, ROOT + encodeURI(s.r)]; }
    /* A record whose `r` is already a PATH (the NP and NP2 albums live in their
       own folders) knows exactly where it is — try that first instead of eating
       two guaranteed 404s per track on the way to it. The tidy-folder guesses
       stay behind it as the fallback for everything else. */
    if(s.r && s.r.indexOf("/") >= 0){ cands.unshift(ROOT + encodeURI(s.r)); }
    var ci = 0;
    audio.onerror = function(){
      ci++;
      if(ci < cands.length){
        audio.src = cands[ci];
        try{ if(time) audio.currentTime = time; }catch(e){}
        if(wantAuto) audio.play().then(function(){
          $("rp-play").textContent = "❚❚";
          chip.classList.remove("idle");
        }).catch(function(){});
      }
    };
    var wantAuto = false;
    load._arm = function(){ wantAuto = true; };
    audio.src = cands[0];
    try{ if(time) { audio.currentTime = time; } }catch(e){}
    paintNow();
    markRows();
  }
  function play(i, time){
    if(i != null && SONGS[i] && SONGS[i].locked) return;   // never play a locked song
    if(i !== cur || needLoad){
      load(i, time != null ? time : (pendingTime||0));
      needLoad = false; pendingTime = 0;
    }
    if(load._arm) load._arm();
    initGraph();
    if(actx && actx.state === "suspended") actx.resume();
    // pause any other audio on the page (galaxys engine etc.)
    document.querySelectorAll("audio,video").forEach(function(a){
      if(a !== audio && !a.paused){ try{ a.pause(); }catch(e){} }
    });
    // set the lock-screen "now playing" (song title, not the page title) up front,
    // so it shows immediately and updates the instant the track changes
    setSession();
    audio.play().then(function(){
      $("rp-play").textContent = "❚❚";
      chip.classList.remove("idle");
      /* Telemetry belongs here, after the browser confirms that audio really
         started. This catches every radio play even if the visitor stayed on
         the page longer than the stats client's initial setup window. */
      (function reportRealPlay(){
        var S=window.IBEE_STATS_CLIENT;
        if(S){
          try{ if(S.heartbeat) S.heartbeat().catch(function(){}); }catch(e){}
          try{ if(S.trackPlay) S.trackPlay(SONGS[cur].f).catch(function(){}); }catch(e){}
        } else {
          setTimeout(reportRealPlay,700);
        }
      })();
      var np = document.getElementById("nowplaying");
      if(np) np.textContent = "RADIO ▶ " + SONGS[cur].n + " — ONLY IBEE";
      setSession();
      save();
    }).catch(function(){ $("rp-play").textContent = "►"; });
  }

  /* ---------- background playback: OS media session ---------- */
  function setSession(){
    if(!("mediaSession" in navigator) || cur < 0) return;
    try{
      var s = SONGS[cur], al = album(s.al);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: s.n,
        artist: "ONLY IBEE",
        album: al.name,
        artwork: [{src: songCover(s), sizes: "512x512", type: "image/jpeg"}]
      });
      navigator.mediaSession.setActionHandler("play", function(){ play(cur); });
      navigator.mediaSession.setActionHandler("pause", function(){ pause(); });
      navigator.mediaSession.setActionHandler("previoustrack", function(){ play(prevIndex()); });
      navigator.mediaSession.setActionHandler("nexttrack", function(){ play(nextIndex()); });
      navigator.mediaSession.setActionHandler("seekto", function(d){
        if(d.seekTime != null && audio.duration){ try{ audio.currentTime = d.seekTime; }catch(e){} }
      });
      navigator.mediaSession.playbackState = "playing";
    }catch(e){}
  }
  /* keep the audio graph alive when the tab comes back / screen unlocks */
  function wake(){
    if(actx && actx.state === "suspended" && !audio.paused){
      actx.resume().catch(function(){});
    }
  }
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("focus", wake);
  window.addEventListener("pageshow", wake);
  function pause(){
    audio.pause(); $("rp-play").textContent = "►"; chip.classList.add("idle");
    try{ if("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused"; }catch(e){}
    save();
  }

  $("rp-play").onclick = function(){
    if(cur < 0){ play(0); return; }
    if(audio.paused) play(cur); else pause();
  };
  $("rp-prev").onclick = function(){ play(prevIndex()); };
  $("rp-next").onclick = function(){ play(nextIndex()); };
  $("rp-shuf").onclick = function(){ setShuffle(!shuffle); };
  $("rp-favb").onclick = function(){
    if(cur < 0) return;
    setFav(SONGS[cur].f, !isFav(SONGS[cur].f));
    paintFav(); render();
  };
  $("rp-share").onclick = function(){ if(cur >= 0) shareSong(SONGS[cur], this); };
  /* the LYRICS ENGINE now lives as the shell's lyrics overlay (opened by the book
     icon in the shell player). This standalone panel button just returns to the
     shell, where that overlay is available. */
  $("rp-lyr").onclick = function(){ location.href = ROOT; };
  audio.addEventListener("ended", function(){ play(nextIndex()); });
  audio.addEventListener("loadedmetadata", function(){ $("rp-tot").textContent = fmt(audio.duration); });
  audio.addEventListener("timeupdate", function(){
    $("rp-cur").textContent = fmt(audio.currentTime);
    if(audio.duration) $("rp-fill").style.width = (audio.currentTime/audio.duration*100)+"%";
  });
  /* unlock the Galaxys Engine after ~10s of real listening (member flow). Sets a
     localStorage flag the console checks; guards seeks/track-changes with dt<1. */
  var _lt=0,_listened=0;
  audio.addEventListener("timeupdate", function(){
    try{
      if(localStorage.getItem("ibee_engine10")==="1") return;
      var t=audio.currentTime||0, dt=t-_lt; _lt=t;
      if(dt>0 && dt<1 && !audio.paused){ _listened+=dt; if(_listened>=10) localStorage.setItem("ibee_engine10","1"); }
    }catch(e){}
  });

  /* if some other player starts (galaxys engine planets), pause the radio */
  document.addEventListener("play", function(e){
    if(e.target !== audio && !audio.paused) pause();
  }, true);

  /* ---------- draggable seek ---------- */
  var seek = $("rp-seek"), scrubbing = false;
  function seekTo(e){
    var r = seek.getBoundingClientRect();
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    var fr = Math.max(0, Math.min(1, x / r.width));
    if(audio.duration){ audio.currentTime = fr * audio.duration; }
    $("rp-fill").style.width = (fr*100)+"%";
  }
  seek.addEventListener("pointerdown", function(e){
    if(cur<0) return;
    scrubbing = true;
    try{ seek.setPointerCapture(e.pointerId); }catch(err){}
    seekTo(e);
  });
  seek.addEventListener("pointermove", function(e){ if(scrubbing) seekTo(e); });
  seek.addEventListener("pointerup", function(e){
    scrubbing = false;
    try{ seek.releasePointerCapture(e.pointerId); }catch(err){}
  });
  seek.addEventListener("pointercancel", function(){ scrubbing = false; });

  /* ---------- panel ---------- */
  function openPanel(){ panel.classList.add("open"); }
  function togglePanel(){ panel.classList.toggle("open"); }
  chip.onclick = togglePanel;
  $("rp-close").onclick = function(){ panel.classList.remove("open"); };
  function openSongInfo(){
    if(cur<0)return;
    var s=SONGS[cur], al=album(s.al), meta=(window.IBEE_META&&window.IBEE_META[s.f])||{};
    $("rp-info-title").textContent=s.n;$("rp-info-album").textContent=al.name;
    var art=$("rp-info-art");art.onerror=function(){art.onerror=null;art.src=fallbackCover(s.hue);};art.src=songCover(s);
    var copy="";
    if(meta.vibe)copy+='<p><b>VIBE //</b> '+esc(meta.vibe)+'</p>';
    if(meta.meaning)copy+='<p>'+esc(meta.meaning)+'</p>';
    if(meta.context)copy+='<p><b>MADE //</b> '+esc(meta.context)+'</p>';
    if(meta.took)copy+='<p><b>TIME //</b> '+esc(meta.took)+'</p>';
    $("rp-info-copy").innerHTML=copy||'<p>INFO TRANSMISSION INCOMING_</p>';
    $("rp-info-plays").textContent="PLAYS // READING_";infoPanel.classList.add("on");
    var S=window.IBEE_STATS_CLIENT;
    if(S&&S.songCounts)S.songCounts().then(function(rows){var hit=(rows||[]).filter(function(row){return row.song_slug===s.f;})[0];$("rp-info-plays").textContent="PLAYS // "+(hit?Number(hit.plays).toLocaleString():"0");}).catch(function(){$("rp-info-plays").textContent="PLAYS // UNAVAILABLE";});
    else $("rp-info-plays").textContent="PLAYS // UNAVAILABLE";
  }
  $("rp-info-close").onclick=function(){infoPanel.classList.remove("on");};
  infoPanel.onclick=function(e){if(e.target===infoPanel)infoPanel.classList.remove("on");};
  /* Only the cover opens song information; the rest of this row still browses songs. */
  $("rp-cover").onclick=function(e){e.stopPropagation();openSongInfo();};
  $("rp-cover").setAttribute("role","button");$("rp-cover").setAttribute("tabindex","0");$("rp-cover").onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();openSongInfo();}};
  /* tap the title/album area → open the browser (grid) + focus search */
  $("rp-nowtop").onclick = function(){
    viewMode = "grid";
    $("rp-view").textContent = "≡ LIST"; $("rp-view").classList.add("on");
    render();
    openPanel();
    setTimeout(function(){ try{ $("rp-search").focus(); }catch(e){} }, 60);
  };
  /* search box */
  $("rp-search").addEventListener("input", function(){ query = this.value.trim(); render(); });
  /* ♥ filter: only the songs you saved */
  $("rp-favtgl").onclick = function(){
    favOnly = !favOnly;
    this.classList.toggle("on", favOnly);
    render();
  };
  /* grid / list toggle */
  $("rp-view").onclick = function(){
    viewMode = (viewMode === "grid") ? "list" : "grid";
    this.textContent = viewMode === "grid" ? "≡ LIST" : "▦ GRID";
    this.classList.toggle("on", viewMode === "grid");
    render();
  };
  /* click anywhere outside the box closes it — music keeps playing */
  document.addEventListener("pointerdown", function(e){
    if(!panel.classList.contains("open")) return;
    if(panel.contains(e.target) || chip.contains(e.target) || infoPanel.contains(e.target)) return;
    panel.classList.remove("open");
  });

  render();   // initial paint (list view)

  /* ---------- analyser → neon frame ---------- */
  var actx = null, analyser = null, freq = null;
  var beat = 0, level = 0, emaLow = 0;
  function initGraph(){
    if(actx || IS_IOS) return;   // iOS: leave audio on the native path (background/lock-safe)
    try{
      actx = new (window.AudioContext || window.webkitAudioContext)();
      var src = actx.createMediaElementSource(audio);
      analyser = actx.createAnalyser(); analyser.fftSize = 128;
      freq = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser); analyser.connect(actx.destination);
    }catch(e){ analyser = null; }
  }
  /* read the pressed groove at the playhead: {low, lv} or null if no data */
  function groove(){
    try{
      var B = window.IBEE_BEAT; if(!B || cur < 0) return null;
      var g = B[SONGS[cur].f]; if(!g) return null;
      var i = Math.max(0, Math.min(g.low.length-1, Math.floor((audio.currentTime||0)*g.r)));
      return { low: parseInt(g.low.charAt(i),36)/35, lv: parseInt(g.lvl.charAt(i),36)/35 };
    }catch(e){ return null; }
  }
  function loop(){
    requestAnimationFrame(loop);
    var playing = cur >= 0 && !audio.paused, gv;
    if(playing && analyser){
      analyser.getByteFrequencyData(freq);
      var sum = 0, i; for(i=0;i<freq.length;i++) sum += freq[i];
      var lv = sum/(freq.length*255);
      var low = 0; for(i=0;i<4;i++) low += freq[i]; low /= (4*255);
      emaLow += (low-emaLow)*0.1;
      var on = Math.max(0, low - emaLow*1.15);
      beat = Math.max(beat*0.86, Math.min(1, low*0.5 + on*3.2));
      level += (lv-level)*0.2;
    } else if(playing && (gv = groove())){
      /* no analyser (iOS native path) → same beat math, fed by the groove */
      emaLow += (gv.low-emaLow)*0.1;
      var onG = Math.max(0, gv.low - emaLow*1.15);
      beat = Math.max(beat*0.86, Math.min(1, gv.low*0.5 + onG*3.2));
      level += (gv.lv-level)*0.2;
    } else if(playing){
      beat = Math.max(beat*0.86, Math.pow(Math.abs(Math.sin(performance.now()/430)), 8));
      level += (0.3-level)*0.05;
    } else {
      beat *= 0.9; level *= 0.92;
    }
    var hue = cur >= 0 ? SONGS[cur].hue : 75;
    /* THE RADIO LIST IS THE MAIN FEATURE — while it is being scrolled on a phone,
       skip the neon-frame repaint entirely. Rewriting a blurred, viewport-sized
       box-shadow every frame saturates the phone's frame budget and makes the
       composited scroll stutter. The glow just holds still for the ~180ms of the
       drag, then resumes. (Flag set by the shell's tracklist scroll handler.)
       The next frame is already scheduled at the top of loop(), so just return. */
    if(window.__IBEE_SCROLLING){ return; }
    /* overall brightness of the neon frame — kept low enough to read the page
       under it for a long session rather than for a first impression */
    var a = Math.min(1, 0.02 + beat*0.11 + level*0.04);
    var root = document.documentElement.style;
    if(playing || beat > 0.02){
      nf.style.borderColor = "hsla("+hue+",95%,60%,"+(a*0.42).toFixed(3)+")";
      /* narrow screens get a tighter radius: a blur sized for a laptop is a big
         slice of a phone's width and washes the middle of the display */
      var narrow = (window.innerWidth||9999) < 600;
      var blur = narrow ? (2+beat*5) : (4+beat*10);
      nf.style.boxShadow =
        "inset 0 0 "+blur+"px hsla("+hue+",95%,55%,"+(a*(narrow?0.12:0.18)).toFixed(3)+"),"
        +"inset 0 0 3px hsla("+hue+",95%,70%,"+(a*0.30).toFixed(3)+")";
      root.setProperty("--beat", beat.toFixed(3));
      root.setProperty("--songhue", hue);
      root.setProperty("--ga", Math.min(1, 0.09 + beat*0.8).toFixed(3));
    } else {
      nf.style.borderColor = "transparent";
      nf.style.boxShadow = "none";
      root.setProperty("--ga", "0");
      root.setProperty("--beat", "0");
    }
  }
  loop();

  /* ---------- bridge: universe engine ↔ radio ---------- */
  window.IBEERADIO = {
    audio: audio,
    playing: function(){ return cur >= 0 && !audio.paused; },
    beat: function(){ return beat; },
    level: function(){ return level; },
    slug: function(){ return cur >= 0 ? SONGS[cur].f : null; },
    indexBySlug: function(s){ for(var i=0;i<SONGS.length;i++) if(SONGS[i].f===s) return i; return -1; },
    /* adopt a song without playing it — UI + saved state follow along */
    adopt: function(i, t){
      if(i < 0 || i >= SONGS.length) return;
      cur = i; needLoad = true; pendingTime = t || 0;
      paintNow();
      markRows(); save();
    },
    setPending: function(t){ if(needLoad){ pendingTime = t || 0; } },
    current: function(){ return cur; },
    count: SONGS.length,
    song: function(i){ return SONGS[i == null ? cur : i]; },
    album: function(i){ return album((SONGS[i == null ? cur : i]||{}).al); },
    /* room-only special albums (e.g. NOUVEAUX PUNK's full EXPERIENCE lives only in
       its room, not as a single radio track) — the shell's browser renders these
       as extra album cards alongside the playable songs. */
    rooms: function(){
      return ROOMS.map(function(r){
        var al = album(r.al);
        return { id:r.al, name:al.name, cover:al.cover, room:al.room, tint:al.tint, pad:al.pad, tag:al.tag };
      });
    },
    shuffled: function(){ return shuffle; },
    /* the shell calls this on every re-render of the track list */
    setQueue: function(arr){ QUEUE = (arr && arr.length) ? arr.slice() : null; },
    queue: function(){ return QUEUE ? QUEUE.slice() : null; },
    toggleShuffle: function(){ setShuffle(!shuffle); return shuffle; },
    control: {
      play: function(i){ play(i == null ? (cur < 0 ? 0 : cur) : i); },
      pause: function(){ pause(); },
      next: function(){ play(cur < 0 ? 0 : nextIndex()); },
      prev: function(){ play(cur < 0 ? SONGS.length - 1 : prevIndex()); }
    }
  };

  /* ---------- restore across pages ---------- */
  function restoreState(){
    if(cur >= 0) return;   // already playing/loaded — nothing to restore
    try{
      var sv = JSON.parse(localStorage.getItem("ibee_radio") || "null");
      if(sv && sv.s) setShuffle(true);
      if(sv && sv.i >= 0 && sv.i < SONGS.length){
        load(sv.i, sv.t || 0);
        $("rp-tot").textContent = "--:--";
        if(sv.p){
          wantResume = true;
          // try to continue where the last page left off (browsers may block un-tapped audio)
          play(sv.i, sv.t || 0);
          // if autoplay is blocked, resume on the FIRST interaction of any kind on this page,
          // captured early so nothing can swallow it — keeps the radio playing across every page.
          var kickEvents = ["pointerdown","touchstart","mousedown","keydown","click","scroll"];
          var kick = function(){
            if(wantResume && audio.paused && cur >= 0) play(cur);
            wantResume = false;
            kickEvents.forEach(function(ev){ document.removeEventListener(ev, kick, true); });
          };
          kickEvents.forEach(function(ev){ document.addEventListener(ev, kick, true); });
        }
      }
    }catch(e){}
  }
  restoreState();

  /* ---------- shared song links ----------
     A friend's link looks like <site>/?s=<slug> (made by the SHARE buttons). When the
     radio boots on a page whose URL carries ?s=, that record is adopted and played —
     if the browser blocks un-tapped audio, the very first interaction starts it
     (same kick trick as restoreState). Extras are retried after songs-extra.js lands. */
  var DEEP = (function(){
    try{ var m = /[?&]s=([^&]+)/.exec(location.search); return m ? decodeURIComponent(m[1]).toLowerCase() : null; }catch(e){ return null; }
  })();
  function tryDeepLink(){
    if(!DEEP) return;
    for(var i=0;i<SONGS.length;i++){
      var f = (SONGS[i].f||"").toLowerCase();
      if(f !== DEEP && f.replace(/\.mp3$/,"") !== DEEP) continue;
      DEEP = null;
      if(SONGS[i].locked) return;                    // a locked record never leaks
      play(i, 0);                                    // shared links beat the saved state
      var kickEvents = ["pointerdown","touchstart","mousedown","keydown","click"];
      var kick = function(){
        if(audio.paused && cur >= 0) play(cur);
        kickEvents.forEach(function(ev){ document.removeEventListener(ev, kick, true); });
      };
      kickEvents.forEach(function(ev){ document.addEventListener(ev, kick, true); });
      return;
    }
  }
  tryDeepLink();

  /* ---------- VIP welcome: a special hello for special people ----------
     Site-wide (player.js runs on every page's top window). When a VIP's session
     appears, a brief neon overlay says their line — once per visit; logging out
     and back in says it again. Member grants live in member/vip.sql.

     ⚠ The email used to be written here in plain text. player.js loads on EVERY page,
     so that published a real person's address — next to a private message — to anyone
     who opened the source. The greeting is worth keeping; publishing her address is not.
     Keyed on a SHA-256 of the lowercased address instead: same behaviour, but the source
     no longer discloses who it is. (Someone who ALREADY knows the address could confirm
     it by hashing — that is fine. The point is that the page stops handing it out.)
     To add a VIP: node/python -c "hashlib.sha256(b'their@email').hexdigest()". */
  var VIPS = { "d82b31810bbcd05ec6803ac28c285c2410b2ce149ebbb744adfe3b40f9cf7deb": "welcome babe" };
  function sha256hex(s){
    try{
      if(!(window.crypto&&crypto.subtle)) return Promise.resolve("");
      return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(function(b){
        return Array.prototype.map.call(new Uint8Array(b),function(x){return ("0"+x.toString(16)).slice(-2);}).join("");
      }).catch(function(){ return ""; });
    }catch(e){ return Promise.resolve(""); }
  }
  var _vipH=null, _vipFor="";        // cached hash + the address it was computed for
  function sessEmail(){
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(/^sb-.*-auth-token$/.test(k)){
          var v=JSON.parse(localStorage.getItem(k)||"null");
          var em=(v&&((v.user&&v.user.email)||(v.currentSession&&v.currentSession.user&&v.currentSession.user.email)))||"";
          return String(em).toLowerCase();
        }
      }
    }catch(e){}
    return "";
  }
  function vipGreet(msg){
    if(document.getElementById("vipwelcome")) return;
    var st2=document.createElement("style");
    st2.textContent=
      "#vipwelcome{position:fixed;inset:0;z-index:99980;display:flex;flex-direction:column;align-items:center;"
      +"justify-content:center;gap:18px;background:rgba(2,2,6,.86);pointer-events:none;opacity:0;transition:opacity .5s}"
      +"#vipwelcome.on{opacity:1}"
      +"#vipwelcome::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.3) 0 1px,transparent 1px 3px)}"
      +"#vipwelcome .vh{font-size:44px;line-height:1;color:#ff2b6b;text-shadow:0 0 22px rgba(255,43,107,.9);"
      +"animation:vipbeat 1s ease-in-out infinite}"
      +"@keyframes vipbeat{0%,100%{transform:scale(1)}30%{transform:scale(1.22)}45%{transform:scale(1.06)}60%{transform:scale(1.18)}}"
      +"#vipwelcome .vm{font-family:'Press Start 2P',monospace;font-size:clamp(15px,4.6vw,26px);color:#fff;"
      +"letter-spacing:3px;text-shadow:0 0 18px rgba(255,43,107,.85),0 0 40px rgba(255,43,107,.5)}"
      +"#vipwelcome .fh{position:absolute;bottom:-40px;color:#ff2b6b;opacity:.75;animation:vipfloat linear infinite}"
      +"@keyframes vipfloat{to{transform:translateY(-110vh) rotate(24deg);opacity:0}}";
    document.head.appendChild(st2);
    var ov=document.createElement("div"); ov.id="vipwelcome";
    var hearts="";
    for(var h=0;h<10;h++){
      hearts+="<span class='fh' style='left:"+(4+Math.random()*92)+"%;font-size:"+(13+Math.random()*20)+"px;"
        +"animation-duration:"+(3.4+Math.random()*3)+"s;animation-delay:"+(Math.random()*1.6)+"s'>♥</span>";
    }
    ov.innerHTML=hearts+"<div class='vh'>♥</div><div class='vm'>"+esc(msg)+"</div>";
    document.body.appendChild(ov);
    requestAnimationFrame(function(){requestAnimationFrame(function(){ov.classList.add("on");});});
    setTimeout(function(){ ov.classList.remove("on"); setTimeout(function(){ov.remove();},600); },3400);
  }
  setInterval(function(){
    var em=sessEmail();
    if(!em){ try{ sessionStorage.removeItem("ibee_vip_hi"); }catch(e){} _vipH=null; _vipFor=""; return; }  // logged out → next login greets again
    /* the shell's PRESS START curtain sits above everything — wait until it's gone */
    var en=document.getElementById("enter");
    if(en && en.style.display!=="none" && en.offsetParent!==null) return;
    /* hashing is async, and this ticks every 2.5s — so hash once per session and
       reuse it, otherwise we'd fire a digest on every single tick for nothing */
    if(_vipFor!==em){ _vipFor=em; _vipH=null; sha256hex(em).then(function(h){ if(_vipFor===em) _vipH=h; }); return; }
    if(!_vipH) return;                                    // still hashing, or crypto unavailable
    var msg=VIPS[_vipH]; if(!msg) return;
    try{
      if(sessionStorage.getItem("ibee_vip_hi")===_vipH) return;
      sessionStorage.setItem("ibee_vip_hi",_vipH);        // the HASH, not the address
    }catch(e){ return; }
    vipGreet(msg);
  },2500);

  /* ---------- merge the studio's extra records into the live radio ----------
     Runs when assets/songs-extra.js arrives (see the self-loader up top).
     Additive: dedupes by filename so built-in songs are never touched; new
     songs get playlist rows and the public count updates so the shell and
     every page pick them up. If the saved song was an extra (its index is past
     the built-in list), restore is retried now that the list is long enough. */
  function addExtras(){
    try{
      /* new albums first: a studio-founded galaxy (IBEE_SONGS_EXTRA.galaxies) is
         registered as an album here too, so its songs wear the real album name /
         tint / cover on the radio instead of falling back to the unfiled album
         (the universe already knows these galaxies; the radio didn't). Built-in
         albums are never overridden. Optional per-galaxy `cover`/`tint`/`room`. */
      /* NP2 is private for now: its album + songs are hidden from the radio
         until owner.js confirms the owner account (window.IBEE_SHOW_NP2). */
      var HIDE_NP2 = !window.IBEE_SHOW_NP2;
      var GX = (window.IBEE_SONGS_EXTRA && window.IBEE_SONGS_EXTRA.galaxies) || [];
      GX.forEach(function(ga){
        if(!ga || !ga.id || ALBUMS[ga.id]) return;
        if(HIDE_NP2 && ga.id==="np2") return;
        var a = { name: ga.name || String(ga.id).toUpperCase() };
        if(ga.cover) a.cover = ga.cover;      // else songs use own cover / hue disc
        if(ga.tint)  a.tint  = ga.tint;
        if(ga.room){ a.room = ga.room; a.galaxy = ga.id; }
        ALBUMS[ga.id] = a;
      });
      var X = (window.IBEE_SONGS_EXTRA && window.IBEE_SONGS_EXTRA.songs) || [];
      var added = false;
      X.forEach(function(e){
        if(!e || !e.f || !e.n) return;
        if(HIDE_NP2 && e.g==="np2") return;                 // NP2 hidden until owner
        for(var i=0;i<SONGS.length;i++) if(SONGS[i].f === e.f) return;
        /* a studio song can name an album id (g) or bring its own cover */
        var alId = e.g && ALBUMS[e.g] ? e.g : "ib";
        SONGS.push({ f:e.f, r:e.r || e.f, n:e.n, hue:(e.hue != null ? e.hue : 190),
          al:alId, cover:e.cover || "", locked:!!e.locked });
        added = true;
      });
      if(added){
        window.IBEERADIO.count = SONGS.length;
        render();
        restoreState();   // no-op unless the saved song needed the longer list
        tryDeepLink();    // a shared link to a studio-pressed record resolves now
      }
    }catch(e){}
  }
})();
