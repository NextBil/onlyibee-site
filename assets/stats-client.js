/* ONLYIBEE — live community telemetry. Requires the safe public RPCs in member/stats.sql. */
(function(){
  "use strict";
  if(window.IBEE_STATS_CLIENT) return;
  var URL="https://hloxwicoeahczifshyoe.supabase.co";
  var KEY="sb_publishable_1GXmfEAlQlq8aeF8hgE-sQ_mKprQbQY";
  var VISITOR_KEY="ibee_network_visitor",lastPlay="";
  function visitor(){try{var id=localStorage.getItem(VISITOR_KEY);if(id)return id;id=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():"v_"+Date.now()+"_"+Math.random().toString(36).slice(2);localStorage.setItem(VISITOR_KEY,id);return id;}catch(e){return "v_"+Math.random().toString(36).slice(2);}}
  function call(name,body){return fetch(URL+"/rest/v1/rpc/"+name,{method:"POST",headers:{"apikey":KEY,"Authorization":"Bearer "+KEY,"Content-Type":"application/json"},body:JSON.stringify(body||{})}).then(function(r){if(!r.ok)throw new Error("stats endpoint unavailable");return r.json();});}
  function fetchStats(){return call("get_public_stats",{}).then(function(data){return Array.isArray(data)?data[0]:data;});}
  function songCounts(){return call("get_song_play_stats",{}).then(function(data){return Array.isArray(data)?data:[];});}
  function heartbeat(){return call("record_site_visit",{visitor_id:visitor(),page_path:location.pathname});}
  function trackPlay(song){var key=(song||"unknown")+":"+Math.floor(Date.now()/1800000);if(key===lastPlay)return Promise.resolve();lastPlay=key;return call("record_song_play",{visitor_id:visitor(),song_slug:String(song||"unknown").slice(0,180)}).then(function(result){try{window.dispatchEvent(new CustomEvent("ibee:play-counted",{detail:{song:song}}));}catch(e){}return result;});}
  function installRadioListener(){var tries=0,timer=setInterval(function(){var radio=window.IBEERADIO;if(!radio||!radio.audio){if(++tries>30)clearInterval(timer);return;}clearInterval(timer);radio.audio.addEventListener("play",function(){var song=radio.song&&radio.song();trackPlay(song&&song.f).catch(function(){});});},500);}
  heartbeat().catch(function(){});setInterval(function(){if(document.visibilityState==="visible")heartbeat().catch(function(){});},60000);installRadioListener();
  window.IBEE_STATS_CLIENT={fetch:fetchStats,songCounts:songCounts,heartbeat:heartbeat,trackPlay:trackPlay};
})();
