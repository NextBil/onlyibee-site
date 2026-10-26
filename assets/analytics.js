/* ONLYIBEE — anonymous, site-wide analytics.
   Runs only in the persistent shell. It records aggregate activity, never
   names, emails, typed text, full query strings, or a cross-site identifier. */
(function(){
  "use strict";
  var SB_URL="https://hloxwicoeahczifshyoe.supabase.co";
  /* Public Supabase anon key — the same key already used elsewhere in the site. */
  var SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";

  /* ---- IS THIS A PERSON? -------------------------------------------------
     Only writes are gated; reading the public counters stays open to anyone.

     The signals below are the ones NO human browser produces. They are kept
     deliberately narrow, because a false positive here deletes a real listener
     and you would never know:
       navigator.webdriver   set by every automation driver (Puppeteer,
                             Playwright, Selenium) and by nothing else
       Headless in the UA    headless Chrome announces itself
       the crawler list      Googlebot, link-preview fetchers, curl, wget,
                             python-requests and friends
       _phantom / Cypress    older harnesses that predate navigator.webdriver

     ⚠ TIMEZONE IS NOT ON THIS LIST, on purpose. The "city" this file reports
     is the last segment of the browser's IANA timezone, so a datacentre box on
     US-Pacific files itself as "Los Angeles" — which is where a sudden crowd
     of LA listeners comes from. But America/Los_Angeles is also the honest
     clock of everyone actually in Los Angeles, so treating the zone itself as
     a bot signal would throw away real people to tidy up a number. What is
     filtered here is automation, not a place.                               */
  var BOTS=/bot|crawl|spider|slurp|mediapartners|facebookexternalhit|whatsapp|telegram|discord|preview|scrape|curl|wget|python-requests|axios|node-fetch|okhttp|lighthouse|pagespeed|gtmetrix|pingdom|headless|phantom|puppeteer|playwright|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|applebot|yandex|baidu|duckduck|archive\.org/i;
  function botLike(){
    try{
      if(navigator.webdriver) return true;
      var ua=navigator.userAgent||"";
      if(!ua) return true;                      /* no UA at all is not a browser */
      if(BOTS.test(ua)) return true;
      if(window._phantom||window.callPhantom||window.__nightmare||window.Cypress) return true;
    }catch(e){}
    return false;
  }
  var KEY="ibee_analytics_session", page="", started=Date.now(), active=0, tick=Date.now();
  function session(){
    try{ var id=sessionStorage.getItem(KEY); if(id)return id;
      id=(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
      sessionStorage.setItem(KEY,id); return id;
    }catch(e){ return "s-"+Date.now().toString(36); }
  }
  var sid=session(), isBot=botLike();
  function clean(s){ return String(s||"").slice(0,120).replace(/\?.*$/,""); }
  function addTime(){ var now=Date.now(); if(!document.hidden) active+=Math.min(30,(now-tick)/1000); tick=now; }
  function post(type, props, keep){
    if(isBot) return;                       /* a crawler is not a visit */
    if(!page && type!=="page_view") return;
    var body={session_id:sid,event_type:type,page:page||"shell",active_seconds:Math.round(active),metadata:props||{}};
    active=0;
    try{ fetch(SB_URL+"/rest/v1/analytics_events",{method:"POST",keepalive:!!keep,
      headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(body)}).catch(function(){}); }catch(e){}
  }
  function setPage(next){
    next=clean(next); if(!next||next===page)return;
    addTime(); if(page)post("active_time",{}); page=next; started=Date.now(); post("page_view",{});
  }
  function event(name, props){ addTime(); post("event",Object.assign({name:clean(name)},props||{})); }
  setInterval(function(){ addTime(); if(page&&active>=25)post("active_time",{}); },10000);
  document.addEventListener("visibilitychange",function(){ addTime(); if(document.hidden&&page)post("active_time",{}); });
  addEventListener("pagehide",function(){ addTime(); if(page)post("session_end",{page_seconds:Math.round((Date.now()-started)/1000)},true); });
  window.IBEE_ANALYTICS={page:setPage,event:event};
})();
