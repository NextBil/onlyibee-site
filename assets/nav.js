/* =====================================================================
   IBEE NAV — shared page navigation. Include on any page that loads inside
   the shell frame, AFTER its markup.

   Two jobs:

   1) BACK THAT MEANS BACK. Pages used to hardcode "../console.html#shop" as
      their back link, so back always went to one fixed screen instead of where
      the visitor actually came from — and if you had arrived from ROOMS, back
      dumped you somewhere you had never been. Any element marked
      `data-back` now asks the shell to step back through the real trail, and
      **hides itself when there is nothing to go back to** (so a page opened
      directly shows no back button at all).

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
      /* visibility is re-evaluated on every refresh… */
      el.style.display = can ? '' : 'none';
      /* …but the handler is bound once, or refresh() would stack duplicates */
      if(el.__ibeeBound) return;
      el.__ibeeBound=1;
      el.addEventListener('click',function(e){
        e.preventDefault();
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
