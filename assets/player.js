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
    bsc.src = BASE + "beat-data.js?v=1";
    document.head.appendChild(bsc);
  }catch(e){}
  /* f = tidy path in assets/audio/songs/ · r = original filename at site root (fallback) */
  var SONGS = [
    {f:"all-i-need.mp3",    r:"all i need v1.mp3",  n:"ALL I NEED",      hue:210},
    {f:"bounceee.mp3",      r:"bounceee3.mp3",      n:"BOUNCEEE",        hue:285},
    {f:"callin-on-u.mp3",   r:"callin on u .mp3",   n:"CALLIN ON U",     hue:200},
    {f:"freestyle-sept9.mp3",r:"freestylesept9.mp3",n:"FREESTYLE SEPT9", hue:150},
    {f:"head.mp3",          r:"head .mp3",          n:"HEAD",            hue:120},
    {f:"lonely22.mp3",      r:"lonely22.mp3",       n:"LONELY22",        hue:230},
    {f:"maintenant.mp3",    r:"maintenant.mp3",     n:"MAINTENANT",      hue:40},
    {f:"mix-100.mp3",       r:"mix 100.mp3",        n:"MIX 100",         hue:20},
    {f:"nananannn.mp3",     r:"nananannn.mp3",      n:"NANANANNN",       hue:300},
    {f:"obsess.mp3",        r:"obsess.mp3",         n:"OBSESS",          hue:320},
    {f:"real-to-me.mp3",    r:"real to me .mp3",    n:"REAL TO ME",      hue:190},
    {f:"ride-it.mp3",       r:"riddeit2.mp3",       n:"RIDE IT",         hue:265},
    {f:"right-middle.mp3",  r:"right middle.mp3",   n:"RIGHT MIDDLE",    hue:175},
    {f:"silouhette.mp3",    r:"silouhette.mp3",     n:"SILOUHETTE",      hue:250},
    {f:"strippin-down.mp3", r:"strippin down.mp3",  n:"STRIPPIN DOWN",   hue:340},
    {f:"to-our-pain.mp3",   r:"to our pain .mp3",   n:"TO OUR PAIN",     hue:0},
    {f:"write-a-song.mp3",  r:"write a song v1.mp3",n:"WRITE A SONG",    hue:45},
    {f:"yo-body.mp3",       r:"yo body .mp3",       n:"YO BODY",         hue:75}
  ];

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
  +"#radiopanel{position:fixed;right:14px;bottom:104px;z-index:8996;width:min(320px,92vw);"
  +"background:rgba(0,0,0,.94);border:2px solid #2a2a2a;display:none;flex-direction:column;font-family:'VT323',monospace;color:#e8e8e8}"
  +"#radiopanel.open{display:flex}"
  +"#rp-head{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #2a2a2a;"
  +"font-family:'Press Start 2P',monospace;font-size:9px;color:#b6ff00}"
  +"#rp-close{cursor:pointer;color:#7a7a7a;font-size:12px;padding:2px 6px}#rp-close:hover{color:#ff2b2b}"
  +"#rp-now{padding:12px;border-bottom:1px solid #2a2a2a}"
  +"#rp-title{font-family:'Press Start 2P',monospace;font-size:10px;color:#fff;margin-bottom:3px;"
  +"white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  +"#rp-sub{color:#7a7a7a;font-size:16px;margin-bottom:10px}"
  +"#rp-seek{position:relative;height:14px;border:1px solid #2a2a2a;padding:2px;cursor:pointer;touch-action:none}"
  +"#rp-fill{height:100%;width:0%;background:#b6ff00;position:relative}"
  +"#rp-times{display:flex;justify-content:space-between;color:#7a7a7a;font-size:14px;margin-top:3px}"
  +"#rp-ctrl{display:flex;gap:8px;margin-top:10px}"
  +"#rp-ctrl button{font-family:'Press Start 2P',monospace;font-size:10px;flex:1;padding:9px 0;"
  +"background:#0e0e0e;color:#e8e8e8;border:1px solid #2a2a2a;cursor:pointer}"
  +"#rp-ctrl button:hover{border-color:#b6ff00;color:#b6ff00}"
  +"#rp-ctrl button.main{background:#b6ff00;color:#000;border-color:#b6ff00}"
  +"#rp-lyr{border-color:#b6ff00 !important;animation:rlyrglow 1.8s ease-in-out infinite}"
  +"#rp-lyr img{width:24px;height:24px;image-rendering:pixelated;display:block;margin:auto}"
  +"#rp-lyr:hover{background:#131a00}"
  +"@keyframes rlyrglow{0%,100%{box-shadow:0 0 6px rgba(182,255,0,.2)}50%{box-shadow:0 0 16px rgba(182,255,0,.55)}}"
  +"#rp-list{overflow-y:auto;max-height:min(300px,38vh)}"
  +".rp-row{display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;color:#9a9a9a;font-size:18px;border-bottom:1px solid #161616}"
  +".rp-row:hover{background:#101010;color:#fff}"
  +".rp-row.now{color:#b6ff00;background:#0d1400}"
  +".rp-row .no{font-family:'Press Start 2P',monospace;font-size:8px;width:24px;color:#555}"
  +".rp-row.now .no{color:#b6ff00}"
  +".rp-row .dot{width:8px;height:8px;flex:none}"
  ;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

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
    +'  <div id="rp-title">—</div><div id="rp-sub">rare soul sessions</div>'
    +'  <div id="rp-seek"><div id="rp-fill"></div></div>'
    +'  <div id="rp-times"><span id="rp-cur">0:00</span><span id="rp-tot">--:--</span></div>'
    +'  <div id="rp-ctrl">'
    +'    <button id="rp-prev">◀◀</button>'
    +'    <button id="rp-play" class="main">►</button>'
    +'    <button id="rp-next">▶▶</button>'
    +'    <button id="rp-lyr" title="LYRICS ENGINE"><img alt="lyrics" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M1 3 Q4.5 1.4 8 3 Q11.5 1.4 15 3 V13 Q11.5 11.4 8 13 Q4.5 11.4 1 13 Z\' fill=\'%23b6ff00\' stroke=\'%23223300\' stroke-width=\'.7\'/%3E%3Cline x1=\'8\' y1=\'3\' x2=\'8\' y2=\'13\' stroke=\'%23223300\' stroke-width=\'.9\'/%3E%3Cline x1=\'2.8\' y1=\'5\' x2=\'6.4\' y2=\'4.6\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'2.8\' y1=\'7\' x2=\'6.4\' y2=\'6.6\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'2.8\' y1=\'9\' x2=\'6.4\' y2=\'8.6\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'9.6\' y1=\'4.6\' x2=\'13.2\' y2=\'5\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Cline x1=\'9.6\' y1=\'6.6\' x2=\'13.2\' y2=\'7\' stroke=\'%23223300\' stroke-width=\'.6\'/%3E%3Crect x=\'11\' y=\'2\' width=\'1.6\' height=\'4.4\' fill=\'%23ff2b2b\'/%3E%3C/svg%3E"></button>'
    +'  </div>'
    +'</div>'
    +'<div id="rp-list"></div>';
  document.body.appendChild(panel);

  var audio = document.createElement("audio");
  audio.id = "radioaudio"; audio.preload = "none";
  document.body.appendChild(audio);

  var $ = function(id){ return document.getElementById(id); };
  var list = $("rp-list");
  SONGS.forEach(function(s, i){
    var row = document.createElement("div");
    row.className = "rp-row"; row.dataset.i = i;
    row.innerHTML = '<span class="no">'+String(i+1).padStart(2,"0")+'</span>'
      +'<span class="dot" style="background:hsl('+s.hue+',85%,55%)"></span>'
      +'<span>'+s.n+'</span>';
    row.onclick = function(){ play(i); openPanel(); };
    list.appendChild(row);
  });

  /* ---------- state ---------- */
  var cur = -1, wantResume = false, needLoad = false, pendingTime = 0;
  function save(){
    try{ localStorage.setItem("ibee_radio", JSON.stringify({
      i: cur, t: needLoad ? (pendingTime||0) : (audio.currentTime||0), p: !audio.paused && cur>=0
    })); }catch(e){}
  }
  setInterval(save, 2000);
  window.addEventListener("pagehide", save);

  function fmt(s){ if(!isFinite(s)) return "--:--"; var m=Math.floor(s/60), ss=Math.floor(s%60); return m+":"+(ss<10?"0":"")+ss; }

  function markRows(){
    var rows = list.children;
    for(var i=0;i<rows.length;i++) rows[i].classList.toggle("now", i===cur);
  }

  function load(i, time){
    cur = ((i % SONGS.length) + SONGS.length) % SONGS.length;
    var s = SONGS[cur];
    // try: tidy folder → tidy name at site root → original name at site root
    var cands = [BASE + "audio/songs/" + s.f, ROOT + s.f, ROOT + encodeURI(s.r)];
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
    $("rp-title").textContent = s.n;
    markRows();
  }
  function play(i, time){
    if(i !== cur || needLoad){
      load(i, time != null ? time : (pendingTime||0));
      needLoad = false; pendingTime = 0;
    }
    if(load._arm) load._arm();
    initGraph();
    if(actx && actx.state === "suspended") actx.resume();
    // pause any other audio on the page (music engine etc.)
    document.querySelectorAll("audio,video").forEach(function(a){
      if(a !== audio && !a.paused){ try{ a.pause(); }catch(e){} }
    });
    // set the lock-screen "now playing" (song title, not the page title) up front,
    // so it shows immediately and updates the instant the track changes
    setSession();
    audio.play().then(function(){
      $("rp-play").textContent = "❚❚";
      chip.classList.remove("idle");
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
      navigator.mediaSession.metadata = new MediaMetadata({
        title: SONGS[cur].n,
        artist: "ONLY IBEE",
        album: "RARE SOUL SESSIONS",
        artwork: [{src: ROOT + "assets/img/follow-me.jpg", sizes: "512x512", type: "image/jpeg"}]
      });
      navigator.mediaSession.setActionHandler("play", function(){ play(cur); });
      navigator.mediaSession.setActionHandler("pause", function(){ pause(); });
      navigator.mediaSession.setActionHandler("previoustrack", function(){ play(cur-1); });
      navigator.mediaSession.setActionHandler("nexttrack", function(){ play(cur+1); });
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
  $("rp-prev").onclick = function(){ if(cur>=0) play(cur-1); else play(SONGS.length-1); };
  $("rp-next").onclick = function(){ play(cur+1); };
  $("rp-lyr").onclick = function(){ location.href = ROOT + "lyrics/"; };
  audio.addEventListener("ended", function(){ play(cur+1); });
  audio.addEventListener("loadedmetadata", function(){ $("rp-tot").textContent = fmt(audio.duration); });
  audio.addEventListener("timeupdate", function(){
    $("rp-cur").textContent = fmt(audio.currentTime);
    if(audio.duration) $("rp-fill").style.width = (audio.currentTime/audio.duration*100)+"%";
  });

  /* if some other player starts (music engine planets), pause the radio */
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
  /* click anywhere outside the box closes it — music keeps playing */
  document.addEventListener("pointerdown", function(e){
    if(!panel.classList.contains("open")) return;
    if(panel.contains(e.target) || chip.contains(e.target)) return;
    panel.classList.remove("open");
  });

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
    var a = Math.min(1, 0.08 + beat*0.85 + level*0.25);
    var root = document.documentElement.style;
    if(playing || beat > 0.02){
      nf.style.borderColor = "hsla("+hue+",95%,60%,"+(a*0.9).toFixed(3)+")";
      nf.style.boxShadow =
        "inset 0 0 "+(16+beat*70)+"px hsla("+hue+",95%,55%,"+(a*0.7).toFixed(3)+"),"
        +"inset 0 0 5px hsla("+hue+",95%,70%,"+(a*0.9).toFixed(3)+")";
      root.setProperty("--beat", beat.toFixed(3));
      root.setProperty("--songhue", hue);
      root.setProperty("--ga", Math.min(1, 0.12 + beat*1.1).toFixed(3));
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
      $("rp-title").textContent = SONGS[i].n;
      markRows(); save();
    },
    setPending: function(t){ if(needLoad){ pendingTime = t || 0; } },
    current: function(){ return cur; },
    count: SONGS.length,
    song: function(i){ return SONGS[i == null ? cur : i]; },
    control: {
      play: function(i){ play(i == null ? (cur < 0 ? 0 : cur) : i); },
      pause: function(){ pause(); },
      next: function(){ play(cur < 0 ? 0 : cur + 1); },
      prev: function(){ play(cur < 0 ? SONGS.length - 1 : cur - 1); }
    }
  };

  /* ---------- restore across pages ---------- */
  try{
    var sv = JSON.parse(localStorage.getItem("ibee_radio") || "null");
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
})();
