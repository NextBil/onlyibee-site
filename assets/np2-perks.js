/* =====================================================================
   LISTENS — the yellow coin
   ---------------------------------------------------------------------
   One currency, one number, one rule:

       2,600 LISTENS = 40% off everything. That is the cap.
       Getting out of a level is worth 100, so the record is exactly 2,600.
       Every badge you already hold is worth 40 more.

   You earn LISTENS by falling (np2/fall/). They show as a yellow coin on
   the profile and beside every price. Nothing else to read.
   ---------------------------------------------------------------------
   Clearing all 26 reaches the cap on its own; coins picked up along the
   way, clean runs and stopping to read only get you there sooner.

   ---------------------------------------------------------------------
   ⚠ READ THIS BEFORE TRUSTING THE NUMBER ON A PRICE TAG
   Points live in localStorage, so they are trivially editable by anyone
   who opens a console. That is fine for a badge and NOT fine for money.
   So this file never changes what anybody is charged:

     · It re-prices the DISPLAY, and shows the code you earned.
     · The code is what actually discounts, and that has to be created
       once in Stripe/PayPal — server side, where it cannot be forged.

   The PayPal Smart Buttons in product-page/checkout.html set the amount
   client-side. Wiring this discount into that amount would have "worked"
   and would also have let anyone pay 60% by editing one localStorage key.
   Deliberately not done. See the README block in that file.
   ===================================================================== */
(function(){
  "use strict";
  if(window.IBEE_PERKS) return;

  var LS_PTS="ibee_np2pts";          /* running total of LISTENS */
  var COIN="\u25c9";                  /* the yellow coin */
  var LS_OUT="ibee_np2fall_out";     /* which levels are cleared */
  var LEVELS=26;
  var CLEAR=100;                     /* points for getting out of a level */
  var MAXPCT=40;
  var POINTS_FOR_MAX=LEVELS*CLEAR;

  function readN(k){
    try{ var v=parseInt(localStorage.getItem(k)||"0",10); return isFinite(v)&&v>0?v:0; }
    catch(e){ return 0; }
  }
  function cleared(){
    try{ var o=JSON.parse(localStorage.getItem(LS_OUT)||"{}")||{}; return Object.keys(o).length; }
    catch(e){ return 0; }
  }
  /* ---- BADGES PAY OUT TOO -------------------------------------------------
     A trophy you already earned should be worth something at the till. Each
     badge in badges.js is worth BADGE_WORTH listens, counted live off the
     badge state rather than copied — so nothing can drift out of sync and
     nothing is double-credited when a new badge lands. */
  var BADGE_WORTH=40;
  function badges(){
    /* Read the badge STORE, not the badge module. This file runs on the shop,
       the drop, the product page and the game — badges.js is only loaded on
       some of them, so depending on window.IBEE_BADGES silently paid out zero
       exactly where the price tags are. localStorage is the shared truth. */
    try{
      var st=JSON.parse(localStorage.getItem("ibee_badges")||"null");
      if(st&&st.earned) return Object.keys(st.earned).length;
    }catch(e){}
    try{
      var B=window.IBEE_BADGES;
      if(B&&B.state){ var s2=B.state(); if(s2&&s2.earned) return Object.keys(s2.earned).length; }
    }catch(e){}
    return 0;
  }
  function badgeListens(){ return badges()*BADGE_WORTH; }

  /* what you carry = what you fell for + what you already had */
  function points(){ return readN(LS_PTS)+badgeListens(); }
  function fallen(){ return readN(LS_PTS); }

  function add(n){
    if(!(n>0)) return points();
    var t=readN(LS_PTS)+Math.round(n);
    try{ localStorage.setItem(LS_PTS,String(t)); }catch(e){}
    return t;
  }

  /* the cap is reachable by finishing the record, and only by finishing it —
     a very good run of half the levels still is not 40% */
  function discount(){
    var byPoints=Math.floor(MAXPCT*points()/POINTS_FOR_MAX);
    var byLevels=Math.floor(MAXPCT*cleared()/LEVELS);
    return Math.max(0, Math.min(MAXPCT, Math.max(byPoints, byLevels)));
  }

  /* One code per whole percent. These are what you create in Stripe once —
     the site can promise a price only as far as the coupon behind it. */
  function code(){
    var d=discount();
    return d>0 ? ("FALL"+(d<10?"0":"")+d) : null;
  }

  function priceOf(orig){
    var d=discount(), n=parseFloat(orig);
    if(!isFinite(n)) return null;
    if(d<=0) return {was:n, now:n, off:0, saved:0, pct:0};
    var now=Math.round(n*(100-d))/100;
    return {was:n, now:now, off:d, saved:Math.round((n-now)*100)/100, pct:d};
  }

  function money(v,cur){
    cur=cur||"€";
    var s=(Math.round(v*100)/100).toFixed(2).replace(/\.00$/,"");
    return cur+s;
  }

  /* ---------------------------------------------------------------------
     Re-price anything on the page that declares its own original price:

        <span data-perk-price="60" data-perk-cur="€"></span>

     The element is REPLACED with was/now/saved, so a page opts in per
     price and nothing gets re-priced by accident. Idempotent — safe to
     call again after a re-render.
     --------------------------------------------------------------------- */
  function render(root){
    root=root||document;
    var d=discount();
    var nodes=root.querySelectorAll("[data-perk-price]");
    for(var i=0;i<nodes.length;i++){
      var el=nodes[i];
      var p=priceOf(el.getAttribute("data-perk-price"));
      if(!p) continue;
      var cur=el.getAttribute("data-perk-cur")||"€";
      if(d<=0){ el.innerHTML='<span class="perk-now">'+money(p.was,cur)+'</span>'; continue; }
      el.innerHTML =
        '<s class="perk-was">'+money(p.was,cur)+'</s> '+
        '<span class="perk-now">'+money(p.now,cur)+'</span> '+
        '<span class="perk-off">−'+d+'%</span>';
    }
    var tags=root.querySelectorAll("[data-perk-badge]");
    for(var k=0;k<tags.length;k++){
      tags[k].innerHTML = d>0
        ? ('<b class="perk-coin">'+COIN+' '+points()+'</b> · −'+d+"% OFF")
        : ('<b class="perk-coin">'+COIN+' '+points()+'</b> · FALL TO EARN');
    }
    return d;
  }

  /* styling ships with the module so every page shows a price the same way */
  try{
    var css=document.createElement("style");
    css.textContent=
      ".perk-was{opacity:.5;text-decoration:line-through}"+
      ".perk-now{color:#ff1f6f}"+
      ".perk-off{font-family:'Press Start 2P',monospace;font-size:7px;letter-spacing:1px;"+
        "color:#e8dc12;white-space:nowrap}"+
      ".perk-coin{color:#e8dc12;font-weight:400}";
    document.head.appendChild(css);
  }catch(e){}

  window.IBEE_PERKS={
    points:points, add:add, cleared:cleared, discount:discount, code:code,
    price:priceOf, money:money, render:render, COIN:COIN,
    badges:badges, badgeListens:badgeListens, fallen:fallen, BADGE_WORTH:BADGE_WORTH,
    MAXPCT:MAXPCT, LEVELS:LEVELS, CLEAR:CLEAR, POINTS_FOR_MAX:POINTS_FOR_MAX
  };
  try{ document.addEventListener("DOMContentLoaded",function(){ render(); }); }catch(e){}
  if(document.readyState!=="loading") setTimeout(function(){ render(); },0);
})();
