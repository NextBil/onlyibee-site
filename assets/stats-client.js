/* ONLYIBEE — live community telemetry. Requires the safe public RPCs in member/stats.sql. */
(function(){
  "use strict";
  if(window.IBEE_STATS_CLIENT) return;
  var URL="https://hloxwicoeahczifshyoe.supabase.co";
  var KEY="sb_publishable_1GXmfEAlQlq8aeF8hgE-sQ_mKprQbQY";
  var VISITOR_KEY="ibee_network_visitor",COUNTRY_KEY="ibee_network_country",CITY_KEY="ibee_network_city",lastPlay="";
  function visitor(){try{var id=localStorage.getItem(VISITOR_KEY);if(id)return id;id=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():"v_"+Date.now()+"_"+Math.random().toString(36).slice(2);localStorage.setItem(VISITOR_KEY,id);return id;}catch(e){return "v_"+Math.random().toString(36).slice(2);}}
  function call(name,body){return fetch(URL+"/rest/v1/rpc/"+name,{method:"POST",headers:{"apikey":KEY,"Authorization":"Bearer "+KEY,"Content-Type":"application/json"},body:JSON.stringify(body||{})}).then(function(r){if(!r.ok)throw new Error("stats endpoint unavailable");return r.status===204?null:r.text().then(function(text){return text?JSON.parse(text):null;});});}
  function fetchStats(){return call("get_public_stats",{}).then(function(data){return Array.isArray(data)?data[0]:data;});}
  function songCounts(){return call("get_song_play_stats",{}).then(function(data){return Array.isArray(data)?data:[];});}
  function countries(){return call("get_top_countries",{}).then(function(data){return Array.isArray(data)?data:[];});}
  function cities(){return call("get_top_cities",{}).then(function(data){return Array.isArray(data)?data:[];});}
  function songCities(song){return call("get_song_top_cities",{p_song_slug:String(song||"").slice(0,180)}).then(function(data){return Array.isArray(data)?data:[];});}
  function place(){try{var sc=localStorage.getItem(COUNTRY_KEY)||"",ss=localStorage.getItem(CITY_KEY)||"";if(sc||ss)return Promise.resolve({country:sc,city:ss});}catch(e){}return fetch("https://ipwho.is/",{headers:{"Accept":"application/json"}}).then(function(r){return r.ok?r.json():null;}).then(function(d){var c=d&&/^[A-Z]{2}$/i.test(d.country_code||"")?d.country_code.toUpperCase():"",city=d&&typeof d.city==="string"?d.city.trim().slice(0,80):"";try{if(c)localStorage.setItem(COUNTRY_KEY,c);if(city)localStorage.setItem(CITY_KEY,city);}catch(e){}return {country:c,city:city};}).catch(function(){return {country:"",city:""};});}
  /* Presence must never depend on the optional country service: privacy tools or
     a slow lookup used to prevent the visit from being recorded at all. */
  function heartbeat(){var id=visitor(),path=location.pathname;return call("record_site_visit",{visitor_id:id,page_path:path,country_code:"",city_name:""}).then(function(result){return place().then(function(p){return(p.country||p.city)?call("record_site_visit",{visitor_id:id,page_path:path,country_code:p.country,city_name:p.city}):result;}).catch(function(){return result;});});}
  function trackPlay(song){var key=(song||"unknown")+":"+Math.floor(Date.now()/1800000);if(key===lastPlay)return Promise.resolve();lastPlay=key;return place().then(function(p){return call("record_song_play",{visitor_id:visitor(),song_slug:String(song||"unknown").slice(0,180),city_name:p.city||""});}).then(function(result){try{window.dispatchEvent(new CustomEvent("ibee:play-counted",{detail:{song:song}}));}catch(e){}return result;});}
  function installRadioListener(){var tries=0,timer=setInterval(function(){var radio=window.IBEERADIO;if(!radio||!radio.audio){if(++tries>30)clearInterval(timer);return;}clearInterval(timer);radio.audio.addEventListener("play",function(){var song=radio.song&&radio.song();trackPlay(song&&song.f).catch(function(){});});},500);}
  heartbeat().catch(function(){});setInterval(function(){if(document.visibilityState==="visible")heartbeat().catch(function(){});},60000);installRadioListener();
  window.IBEE_STATS_CLIENT={fetch:fetchStats,songCounts:songCounts,countries:countries,cities:cities,songCities:songCities,heartbeat:heartbeat,trackPlay:trackPlay};
})();
