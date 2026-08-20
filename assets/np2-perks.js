/* =====================================================================
   IBEE PERKS — what falling is worth
   ---------------------------------------------------------------------
   THE FALL (np2/fall/) pays out points. Points buy a discount on the
   clothes, capped at 40%, and clearing all 26 levels reaches the cap on
   its own — everything else (threading gates, surviving a level without
   dying, stopping to read the writing) only gets you there sooner.

       discount% = min(40, floor(40 * points / POINTS_FOR_MAX))
       POINTS_FOR_MAX = 26 * CLEAR = clearing every level, once.

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

  var LS_PTS="ibee_np2pts";          /* running total */
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
  function points(){ return readN(LS_PTS); }

  function add(n){
    if(!(n>0)) return points();
    var t=points()+Math.round(n);
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
        '<span class="perk-off">−'+d+'% · save '+money(p.saved,cur)+'</span>';
    }
    var tags=root.querySelectorAll("[data-perk-badge]");
    for(var k=0;k<tags.length;k++){
      tags[k].textContent = d>0
        ? (points()+" PTS · −"+d+"% · "+code())
        : (points()+" PTS · fall to earn a discount");
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
        "color:#e8dc12;white-space:nowrap}";
    document.head.appendChild(css);
  }catch(e){}

  window.IBEE_PERKS={
    points:points, add:add, cleared:cleared, discount:discount, code:code,
    price:priceOf, money:money, render:render,
    MAXPCT:MAXPCT, LEVELS:LEVELS, CLEAR:CLEAR, POINTS_FOR_MAX:POINTS_FOR_MAX
  };
  try{ document.addEventListener("DOMContentLoaded",function(){ render(); }); }catch(e){}
  if(document.readyState!=="loading") setTimeout(function(){ render(); },0);
})();
