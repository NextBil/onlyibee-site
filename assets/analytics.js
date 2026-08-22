/* ONLYIBEE — anonymous, site-wide analytics.
   Runs only in the persistent shell. It records aggregate activity, never
   names, emails, typed text, full query strings, or a cross-site identifier. */
(function(){
  "use strict";
  var SB_URL="https://hloxwicoeahczifshyoe.supabase.co";
  /* Public Supabase anon key — the same key already used elsewhere in the site. */
  var SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb3h3aWNvZWFoY3ppZnNoeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjM1MzMsImV4cCI6MjA5OTI5OTUzM30.IK7f4tU6Bb6O9oW5fwfO2Tv3dEZhh3IAj5y_91nier8";
  var KEY="ibee_analytics_session", page="", started=Date.now(), active=0, tick=Date.now();
  function session(){
    try{ var id=sessionStorage.getItem(KEY); if(id)return id;
      id=(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
      sessionStorage.setItem(KEY,id); return id;
    }catch(e){ return "s-"+Date.now().toString(36); }
  }
  var sid=session();
  function clean(s){ return String(s||"").slice(0,120).replace(/\?.*$/,""); }
  function addTime(){ var now=Date.now(); if(!document.hidden) active+=Math.min(30,(now-tick)/1000); tick=now; }
  function post(type, props, keep){
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
