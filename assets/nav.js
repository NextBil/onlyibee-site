/* =====================================================================
   IBEE NAV — shared page navigation. Include on any page that loads inside
   the shell frame, AFTER its markup.

   Two jobs:

   1) BACK, WHERE THE HEADER IS NOT ENOUGH. The shell's nav header is always on
      screen, so on pages it already reaches (shop, stats, drop, member,
      product-page…) a second way "back" was redundant and confusing — removed
      2026-08-15. Three cases keep one:
        · the 7 ICS character pages and chess/ — they open from the ICS screen,
          which has no header entry, so visitors got stranded on a card;
        · tv/ and arcade/ — reachable BOTH from the console menu and from the
          header, so their button is conditional (`data-back-only`, below).
      `data-back` asks the shell to step the real trail — not history.back() —
      and hides itself when there is nowhere to go. console.html's own screens
      have a separate, console-internal back (§20.4); this file is not involved.

   2) NEVER LOAD THE SHELL INSIDE THE SHELL. Several headers linked to `../`
      or `../#menu`. Inside the frame that loads index.html *into the frame*,
      whose own guard then redirects to console.html — the "console opens under
      the current page" bug. Anything marked `data-home` goes straight to
      console.html instead.

   Markup:
       <span class="back" data-back>◀ BACK</span>
       <a href="../console.html#menu" data-home>ONLYIBEE OS</a>

   Both degrade fine standalone (no shell): data-back uses history.back() and
   data-home follows its own href.
   ===================================================================== */
(function(){
  "use strict";
  function shell(){ try{ return window.parent && window.parent!==window ? window.parent.IBEE_SHELL : null; }catch(e){ return null; } }

  /* A page reached by "back" should not replay its CRT boot-in — that reads as
     a brand-new page opening, which is the opposite of going back. The shell
     leaves a one-shot flag; we consume it here. */
  try{
    if(sessionStorage.getItem('ibee_noanim')==='1'){
      sessionStorage.removeItem('ibee_noanim');
      document.documentElement.classList.add('noanim');
      var st=document.createElement('style');
      st.textContent='.noanim main,.noanim .screen,.noanim #os,.noanim body{animation:none!important}';
      document.head.appendChild(st);
    }
  }catch(e){}

  function wire(){
    var sh=shell();

    /* ---- back ---- */
    var backs=document.querySelectorAll('[data-back]');
    var can = sh ? !!sh.canBack() : (history.length>1);
    Array.prototype.forEach.call(backs,function(el){
      /* `data-back-only="console.html"` — show ONLY when that is where back
         would land. TV and ROOMS are reachable both from the console menu and
         from the always-on nav header; they get a back button in the first case
         (you stepped in from a menu, you expect a way out) and none in the
         second (the header is already the way out). */
      var only=el.getAttribute('data-back-only'), show=can;
      if(show && only && sh) show = (sh.prev()||'').indexOf(only)===0;

      /* visibility is re-evaluated on every refresh… */
      el.style.display = show ? '' : 'none';
      /* …but the handler is bound once, or refresh() would stack duplicates */
      if(el.__ibeeBound) return;
      el.__ibeeBound=1;
      el.addEventListener('click',function(e){
        e.preventDefault();
        /* `data-back-to` — a hint for the destination about WHERE on itself to
           land. Leaving a character card should put you back on the row of
           cards you tapped, not at the top of a page you already scrolled past.
           The destination consumes the flag; nothing breaks if it ignores it. */
        var to=el.getAttribute('data-back-to');
        if(to){ try{ sessionStorage.setItem('ibee_returnto',to); }catch(err){} }
        var s2=shell();
        if(s2) s2.back(); else history.back();
      });
    });

    /* ---- home (the ONLYIBEE OS brand) ---- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-home]'),function(el){
      if(el.__ibeeBound) return;
      el.__ibeeBound=1;
      el.addEventListener('click',function(e){
        var s2=shell();
        if(!s2) return;                    /* standalone: let the href work */
        e.preventDefault(); s2.home();
      });
    });
  }

  /* The shell records the arrival in its trail on the frame's load event, which
     fires AFTER this script runs — so a first read of canBack() sees the previous
     page's state and the back button was hidden when it should not have been.
     The shell calls refresh() once it has updated the trail. */
  window.IBEE_NAV={refresh:wire};

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wire);
  else wire();
})();
