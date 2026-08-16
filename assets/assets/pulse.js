/* =====================================================================
   IBEE PULSE — the whole site breathes with the record.

   The rooms have always read the music (arcade/terrarium, transit, aqua…),
   but every ordinary page sat still: player.js writes --beat / --songhue on
   the SHELL's document, and the pages live inside an iframe, so none of it
   reached them. This is the missing bridge — one include per page.

   WHAT IT PUBLISHES (on the page's own <html>, so any CSS can use it):
       --pulse    0..1   THE ONE TO USE — the beat already scaled down to the
                         site-wide gentle level
       --pbeat    0..1   raw percussive envelope, snaps up on a hit, decays
       --plvl     0..1   overall loudness, smooth
       --phue     deg    the current record's hue

   ⚠ The names are prefixed on purpose. player.js is loaded on these pages too
   and writes --beat / --songhue / --ga on the very same <html>; when its own
   radio is idle it writes --beat:0 every frame. Sharing those names means two
   writers fighting over one property and a pulse that reads as dead. Do not
   "tidy" these back to --beat.

   …plus a `playing` class on <html> while the radio is on air.

   HOW IT READS THE MUSIC
   Same source the rooms use: the precomputed groove in assets/beat-data.js
   at the playhead, falling back to the live analyser values IBEERADIO
   exposes. Precomputed is what makes this work on iOS, where the analyser
   cannot run without killing lock-screen playback (see the room engines).

   ⚠ RESTRAINT IS THE POINT. This runs on pages people READ and TAP — shops,
   product pages, stats. So: nothing here moves layout, nothing intercepts a
   click, and the built-in visual is a soft hue wash at the edges, nothing
   that strobes. GENTLE caps how far --pulse can go; raise it and you will
   make the site hard to use. Anything stronger belongs in a room.

   OPTING OUT / IN
     window.IBEE_NO_PULSE = true   before the script → skip entirely
                                   (the rooms already drive their own visuals)
     <element data-pulse>          gets a subtle hue glow + breath for free
   ===================================================================== */
(function(){
  "use strict";
  if(window.IBEE_PULSE || window.IBEE_NO_PULSE) return;

  /* the radio and the groove table live at the top of the frame tree */
  function RAD(){ try{ return window.IBEERADIO || (window.top && window.top.IBEERADIO) || null; }catch(e){ return null; } }
  function DB(n){ try{ return window[n] || (window.top && window.top[n]) || null; }catch(e){ return null; } }

  var GENTLE = 0.55;            /* how much of the raw beat reaches --pulse */
  var calm = false;
  try{ calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

  var root = document.documentElement;
  var beat = 0, emaLow = 0, lvl = 0, hue = 75, wasPlaying = null, lastW = {};

  /* write only on real change — these vars are read by CSS, and a write on
     every frame for an unchanged value is pure style recalc */
  function setVar(k, v){
    if(lastW[k] === v) return;
    lastW[k] = v; root.style.setProperty(k, v);
  }

  /* the pressed groove at the playhead — identical maths to the room engines */
  function groove(r){
    var B = DB('IBEE_BEAT'), g = B && B[r.slug && r.slug()];
    var t = (r.audio && r.audio.currentTime) || 0;
    if(!g){
      return { low: r.beat ? r.beat() : 0, lvl: r.level ? r.level() : 0 };
    }
    var i = Math.max(0, Math.min(g.low.length - 1, Math.floor(t * g.r)));
    return {
      low: parseInt(g.low.charAt(i), 36) / 35,
      lvl: parseInt(g.lvl.charAt(i), 36) / 35
    };
  }

  /* the record's colour: player.js already resolved it on the shell's root */
  function songHue(){
    try{
      var top = window.top.document.documentElement;
      var h = parseFloat(getComputedStyle(top).getPropertyValue('--songhue'));
      if(!isNaN(h)) return h;
    }catch(e){}
    return hue;
  }

  function frame(){
    requestAnimationFrame(frame);
    if(document.hidden) return;

    var r = RAD();
    var on = !!(r && r.playing && r.playing());

    if(on){
      var g = groove(r);
      /* onset detection: how far the bass sits above its own running average.
         Same shape player.js uses, so the site pulses in step with the shell. */
      emaLow += (g.low - emaLow) * 0.1;
      var onset = Math.max(0, g.low - emaLow * 1.15);
      beat = Math.max(beat * 0.86, Math.min(1, g.low * 0.5 + onset * 3.2));
      lvl += (g.lvl - lvl) * 0.12;
      hue = songHue();
    }else{
      beat *= 0.9; lvl *= 0.92;
      if(beat < 0.002) beat = 0;
      if(lvl  < 0.002) lvl  = 0;
    }

    if(on !== wasPlaying){
      wasPlaying = on;
      root.classList.toggle('playing', on);
    }

    var p = calm ? 0 : beat * GENTLE;
    setVar('--pulse', p.toFixed(3));
    setVar('--pbeat', beat.toFixed(3));
    setVar('--plvl',  lvl.toFixed(3));
    setVar('--phue',  String(Math.round(hue)));
  }

  /* ---- the built-in look: a hue wash that breathes at the edges ----
     Fixed, behind everything, and pointer-events:none — it can never eat a
     tap. Opacity is deliberately low; this should register out of the corner
     of your eye, not compete with the page. */
  function paint(){
    var st = document.createElement('style');
    st.id = 'ibee-pulse-css';
    st.textContent =
      '#ibee-pulse{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;'
        + 'transition:opacity .5s ease;'
        + 'box-shadow:inset 0 0 calc(38px + var(--pulse,0)*52px) '
        + 'hsla(var(--phue,75),95%,55%,calc(0.030 + var(--pulse,0)*0.095)),'
        + 'inset 0 0 2px hsla(var(--phue,75),95%,65%,calc(var(--pulse,0)*0.12))}'
      /* On a phone the blur radius is a big fraction of the screen WIDTH, so an
         edge glow sized for a laptop bleeds all the way into the middle and the
         whole display looks lit. Same effect, tighter to the edges. */
      + '@media(max-width:600px){#ibee-pulse{'
        + 'box-shadow:inset 0 0 calc(20px + var(--pulse,0)*26px) '
        + 'hsla(var(--phue,75),95%,55%,calc(0.022 + var(--pulse,0)*0.065)),'
        + 'inset 0 0 2px hsla(var(--phue,75),95%,65%,calc(var(--pulse,0)*0.09))}}'
      + 'html.playing #ibee-pulse{opacity:1}'
      /* The brand mark is the one element on every page in the same place, so
         it carries the beat where you can actually see it — the edge wash alone
         reads as ambient light rather than rhythm. Glow only, no transform: the
         header must not twitch while you are aiming at it.
         Three selectors because the brand is not marked up the same everywhere:
         [data-home] on most pages, .brand on console/stats, a bare first link
         on the older ones. */
      + 'header [data-home],header .brand,header>a:first-child{transition:text-shadow .12s linear}'
      + 'html.playing header [data-home],html.playing header .brand,html.playing header>a:first-child{'
        + 'text-shadow:0 0 calc(3px + var(--pulse,0)*10px) hsla(var(--phue,75),95%,62%,calc(0.13 + var(--pulse,0)*0.30))}'
      /* opt-in, for anything that wants to move with the record */
      + '[data-pulse]{transition:text-shadow .12s linear}'
      + 'html.playing [data-pulse]{'
        + 'text-shadow:0 0 calc(6px + var(--pulse,0)*16px) hsla(var(--phue,75),95%,60%,calc(0.25 + var(--pulse,0)*0.5))}';
    document.head.appendChild(st);

    var el = document.createElement('div');
    el.id = 'ibee-pulse';
    el.setAttribute('aria-hidden', 'true');
    (document.body || document.documentElement).appendChild(el);
  }

  function boot(){ paint(); requestAnimationFrame(frame); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.IBEE_PULSE = {
    beat:  function(){ return beat; },
    level: function(){ return lvl; },
    hue:   function(){ return hue; }
  };
})();
