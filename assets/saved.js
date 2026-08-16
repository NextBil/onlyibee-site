/* =====================================================================
   SAVED PIECES — the list half of the cart (assets/cart.js is the store).

   Shown on BOTH the profile and the login page, at the very TOP of the page.
   The login page matters as much as the profile: saving needs no account, so a
   visitor who saved something and then landed on the sign-in screen must see
   their list waiting there rather than an empty form. Seeing it is also the
   argument for making an account.

   It prepends itself to <main>, so it sits above whatever the page's own first
   section is without either page having to leave a slot for it.
   ===================================================================== */
(function(){
  "use strict";
  var C=window.IBEE_CART; if(!C) return;

  var st=document.createElement('style');
  st.textContent=
     '#savedwrap{max-width:820px;margin:18px auto 6px;padding:0 16px;font-family:VT323,monospace}'
    +'#savedwrap h3{font-family:"Press Start 2P",monospace;font-size:11px;color:#b6ff00;margin:0 0 4px}'
    +'#savedwrap .sub{color:#7a7a7a;font-size:16px;margin-bottom:12px}'
    +'#savedgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:11px}'
    +'.scard{position:relative;border:2px solid #2a2a2a;background:#0d0d10}'
    +'.scard a{display:block;text-decoration:none}'
    +'.scard img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#000}'
    +'.scard .t{display:block;font-family:"Press Start 2P",monospace;font-size:7px;color:#e8e8e8;'
      +'padding:8px 7px;line-height:1.6;border-top:2px solid #2a2a2a}'
    +'.scard .p{display:block;margin-top:4px;color:#b6ff00}'
    +'.srm{position:absolute;top:5px;right:5px;width:22px;height:22px;line-height:20px;text-align:center;'
      +'background:rgba(0,0,0,.78);border:1px solid #ff2b2b;color:#ff2b2b;font-size:11px;cursor:pointer;z-index:2}'
    +'#savedempty{color:#4a4a4a;font-size:17px}';
  document.head.appendChild(st);

  function esc(x){ return String(x==null?'':x).replace(/[&<>"]/g,function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }

  function mount(){
    if(document.getElementById('savedwrap')) return;
    var host=document.createElement('div'); host.id='savedwrap';
    host.innerHTML='<h3>// SAVED PIECES_</h3>'
      +'<div class="sub">pieces you are keeping an eye on_</div>'
      +'<div id="savedgrid"></div>'
      +'<div id="savedempty" style="display:none">nothing saved yet — tap ☆ on any piece in the shop_</div>';
    var main=document.querySelector('main')||document.body;
    main.insertBefore(host, main.firstChild);          /* TOP of the page, both pages */
    draw();
  }

  function draw(){
    var g=document.getElementById('savedgrid'), e=document.getElementById('savedempty');
    if(!g) return;
    var l=C.list();
    /* Nothing saved → show NOTHING. An empty section with a heading, a subtitle
       and an explainer is three lines of noise, and it is worst on the sign-in
       screen where someone is trying to do one thing. It appears the moment
       there is something to show. */
    var wrap=document.getElementById('savedwrap');
    if(wrap) wrap.style.display = l.length ? '' : 'none';
    e.style.display='none';
    g.innerHTML=l.map(function(x){
      return '<div class="scard"><span class="srm" data-rm="'+esc(x.id)+'" title="remove">✕</span>'
        +'<a href="/product-page/?id='+encodeURIComponent(x.id)+'">'
        +'<img src="'+esc(x.img||'')+'" alt="">'
        +'<span class="t">'+esc(x.n||x.id)+'<span class="p">'+esc(x.price||'')+'</span></span></a></div>';
    }).join('');
  }

  document.addEventListener('click',function(ev){
    var r=ev.target.closest&&ev.target.closest('[data-rm]');
    if(r){ ev.preventDefault(); C.remove(r.getAttribute('data-rm')); draw(); }
  });
  document.addEventListener('ibee-cart-change',draw);

  /* opening either page counts as having seen the list — clears the header dot */
  function boot(){ mount(); C.markSeen(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
