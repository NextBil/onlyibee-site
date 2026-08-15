/* =====================================================================
   IBEE CART — pieces you want to keep an eye on.

   Not a checkout. The first drop is closed and everything is one-of-one, so
   this is a SAVED list: tap a piece, it lands on your profile, and the header
   carries a red dot until you have looked at it. Same dot the news system uses
   (.ibdot from assets/badges.js), so the site keeps one visual language.

   WHERE IT LIVES
   localStorage `ibee_cart` — a plain array of {id, n, price, img, at}. Device
   local on purpose: no account required to save something, and nothing to sync
   or lose. The `seen` flag rides along so the dot can clear without dropping
   the list.

   THE CROSS-FRAME PART
   The button is on a product page inside the shell's iframe; the dot belongs to
   the shell's own header. Same origin, so the page calls up to
   window.top.IBEE_CART.refresh() after a change. A `storage` listener covers
   the other direction (a second tab, or the profile removing an item).
   ===================================================================== */
(function(){
  "use strict";
  var KEY='ibee_cart', SEEN='ibee_cart_seen';

  function read(){
    try{ var v=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(v)?v:[]; }
    catch(e){ return []; }
  }
  function write(list){
    try{
      localStorage.setItem(KEY, JSON.stringify(list));
      /* Clamp the seen marker to the list length. Without this, removing a piece
         leaves seen ABOVE count (save 2, view them, remove 1 → seen 2, count 1)
         and the next genuinely new save is swallowed: unseen stays 0 and the dot
         never fires again. */
      var sc=parseInt(localStorage.getItem(SEEN)||'0',10)||0;
      if(sc>list.length) localStorage.setItem(SEEN, String(list.length));
    }catch(e){}
    refreshEverywhere();
  }
  function seenCount(){ try{ return parseInt(localStorage.getItem(SEEN)||'0',10)||0; }catch(e){ return 0; } }

  function has(id){ return read().some(function(x){ return x.id===id; }); }
  function count(){ return read().length; }
  /* the dot shows only what has arrived since the profile was last opened */
  function unseen(){ return Math.max(0, count() - seenCount()); }

  function add(item){
    if(!item||!item.id) return false;
    var l=read();
    if(l.some(function(x){ return x.id===item.id; })) return false;
    l.push({id:item.id, n:item.n||item.id, price:item.price||'', img:item.img||'', at:Date.now()});
    write(l); return true;
  }
  function remove(id){ write(read().filter(function(x){ return x.id!==id; })); }
  function toggle(item){ if(has(item.id)){ remove(item.id); return false; } return add(item); }
  /* called when the profile is opened — clears the dot, keeps the list */
  function markSeen(){ try{ localStorage.setItem(SEEN, String(count())); }catch(e){} refreshEverywhere(); }

  /* ---- the red dot on the header's PROFILE button ---- */
  function paintDot(){
    var btn=document.getElementById('acctbtn'); if(!btn) return;
    var n=unseen(), d=btn.querySelector(':scope > .ibdot');
    if(n>0){
      if(!d){ d=document.createElement('span'); d.className='ibdot'; btn.appendChild(d); }
      var t=n>9?'9+':String(n); if(d.textContent!==t) d.textContent=t;
    }else if(d){ d.remove(); }
  }

  function refreshEverywhere(){
    paintDot();
    /* the button that changed may be inside the frame; the dot is not */
    try{ if(window.top!==window && window.top.IBEE_CART) window.top.IBEE_CART.refresh(); }catch(e){}
    try{ document.dispatchEvent(new CustomEvent('ibee-cart-change')); }catch(e){}
  }

  window.addEventListener('storage', function(ev){
    if(ev && (ev.key===KEY || ev.key===SEEN)) paintDot();
  });

  window.IBEE_CART={
    add:add, remove:remove, toggle:toggle, has:has, list:read,
    count:count, unseen:unseen, markSeen:markSeen, refresh:paintDot
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',paintDot);
  else paintDot();
})();
