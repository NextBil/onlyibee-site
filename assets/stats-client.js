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
  /* ---------- WHERE A VISITOR IS, WITHOUT TELLING ANYONE ----------
     This used to call https://ipwho.is/ from the visitor's browser, which handed
     their IP address to a third party on every single page load, before they had
     been told anything. The database side was always clean (the IP is hashed and
     never stored) but the third-party call happened regardless — and it is the one
     thing that pushed this out of the CNIL's "first-party audience measurement"
     exemption, i.e. the thing that would have forced a cookie banner onto the site.

     The browser already knows where it is. Intl gives us the IANA timezone
     ("Europe/Paris") with no network call at all: the country comes from the map
     below, and the zone's own last segment IS a representative city. Nothing
     leaves the device, nothing can rate-limit us, and it resolves instantly
     instead of costing a round-trip on first paint.

     Trade-off, stated plainly: this is zone-accurate, not IP-accurate. A visitor
     in Lyon reads as "Paris" and a VPN reads as wherever it exits. For a top-5
     countries/cities readout that is the same order of precision the IP lookup
     gave us, and it costs a visitor nothing. */
  var TZC=("Europe/Paris FR|Europe/London GB|Europe/Dublin IE|Europe/Lisbon PT|Europe/Madrid ES|Europe/Brussels BE|Europe/Amsterdam NL|Europe/Luxembourg LU|Europe/Berlin DE|Europe/Zurich CH|Europe/Vienna AT|Europe/Rome IT|Europe/Malta MT|Europe/Prague CZ|Europe/Bratislava SK|Europe/Budapest HU|Europe/Warsaw PL|Europe/Ljubljana SI|Europe/Zagreb HR|Europe/Sarajevo BA|Europe/Belgrade RS|Europe/Skopje MK|Europe/Tirane AL|Europe/Athens GR|Europe/Sofia BG|Europe/Bucharest RO|Europe/Chisinau MD|Europe/Kyiv UA|Europe/Kiev UA|Europe/Minsk BY|Europe/Vilnius LT|Europe/Riga LV|Europe/Tallinn EE|Europe/Helsinki FI|Europe/Stockholm SE|Europe/Oslo NO|Europe/Copenhagen DK|Europe/Reykjavik IS|Europe/Moscow RU|Europe/Kaliningrad RU|Europe/Samara RU|Europe/Istanbul TR|Europe/Monaco MC|Europe/Andorra AD|Europe/Gibraltar GI|Atlantic/Canary ES|Atlantic/Azores PT|Atlantic/Reykjavik IS|"+
  "America/New_York US|America/Detroit US|America/Chicago US|America/Denver US|America/Phoenix US|America/Los_Angeles US|America/Anchorage US|America/Boise US|America/Indiana/Indianapolis US|America/Kentucky/Louisville US|Pacific/Honolulu US|America/Toronto CA|America/Vancouver CA|America/Edmonton CA|America/Winnipeg CA|America/Halifax CA|America/St_Johns CA|America/Mexico_City MX|America/Tijuana MX|America/Monterrey MX|America/Cancun MX|America/Guatemala GT|America/San_Salvador SV|America/Tegucigalpa HN|America/Managua NI|America/Costa_Rica CR|America/Panama PA|America/Havana CU|America/Jamaica JM|America/Port-au-Prince HT|America/Santo_Domingo DO|America/Puerto_Rico PR|America/Bogota CO|America/Caracas VE|America/Lima PE|America/La_Paz BO|America/Santiago CL|America/Argentina/Buenos_Aires AR|America/Montevideo UY|America/Asuncion PY|America/Sao_Paulo BR|America/Bahia BR|America/Fortaleza BR|America/Recife BR|America/Manaus BR|America/Guayaquil EC|America/Paramaribo SR|"+
  "Africa/Casablanca MA|Africa/Algiers DZ|Africa/Tunis TN|Africa/Tripoli LY|Africa/Cairo EG|Africa/Khartoum SD|Africa/Addis_Ababa ET|Africa/Nairobi KE|Africa/Kampala UG|Africa/Dar_es_Salaam TZ|Africa/Kigali RW|Africa/Lagos NG|Africa/Accra GH|Africa/Abidjan CI|Africa/Dakar SN|Africa/Bamako ML|Africa/Ouagadougou BF|Africa/Niamey NE|Africa/Conakry GN|Africa/Douala CM|Africa/Libreville GA|Africa/Kinshasa CD|Africa/Luanda AO|Africa/Lusaka ZM|Africa/Harare ZW|Africa/Maputo MZ|Africa/Johannesburg ZA|Africa/Windhoek NA|Africa/Gaborone BW|Indian/Antananarivo MG|Indian/Mauritius MU|Indian/Reunion RE|"+
  "Asia/Jerusalem IL|Asia/Beirut LB|Asia/Damascus SY|Asia/Amman JO|Asia/Baghdad IQ|Asia/Riyadh SA|Asia/Kuwait KW|Asia/Qatar QA|Asia/Bahrain BH|Asia/Dubai AE|Asia/Muscat OM|Asia/Tehran IR|Asia/Kabul AF|Asia/Karachi PK|Asia/Kolkata IN|Asia/Calcutta IN|Asia/Colombo LK|Asia/Kathmandu NP|Asia/Dhaka BD|Asia/Yangon MM|Asia/Bangkok TH|Asia/Phnom_Penh KH|Asia/Vientiane LA|Asia/Ho_Chi_Minh VN|Asia/Jakarta ID|Asia/Makassar ID|Asia/Kuala_Lumpur MY|Asia/Singapore SG|Asia/Manila PH|Asia/Hong_Kong HK|Asia/Macau MO|Asia/Taipei TW|Asia/Shanghai CN|Asia/Urumqi CN|Asia/Seoul KR|Asia/Pyongyang KP|Asia/Tokyo JP|Asia/Ulaanbaatar MN|Asia/Almaty KZ|Asia/Tashkent UZ|Asia/Baku AZ|Asia/Tbilisi GE|Asia/Yerevan AM|Asia/Yekaterinburg RU|Asia/Novosibirsk RU|Asia/Krasnoyarsk RU|Asia/Irkutsk RU|Asia/Vladivostok RU|"+
  "Australia/Sydney AU|Australia/Melbourne AU|Australia/Brisbane AU|Australia/Perth AU|Australia/Adelaide AU|Australia/Hobart AU|Australia/Darwin AU|Pacific/Auckland NZ|Pacific/Fiji FJ|Pacific/Guam GU|Pacific/Port_Moresby PG|Pacific/Noumea NC|Pacific/Tahiti PF").split("|");
  var TZMAP=null;
  function tzmap(){if(TZMAP)return TZMAP;TZMAP={};for(var i=0;i<TZC.length;i++){var s=TZC[i],x=s.lastIndexOf(" ");if(x>0)TZMAP[s.slice(0,x)]=s.slice(x+1);}return TZMAP;}
  function place(){
    try{var sc=localStorage.getItem(COUNTRY_KEY)||"",ss=localStorage.getItem(CITY_KEY)||"";if(sc||ss)return Promise.resolve({country:sc,city:ss});}catch(e){}
    var country="",city="";
    try{
      var tz=(Intl&&Intl.DateTimeFormat&&Intl.DateTimeFormat().resolvedOptions().timeZone)||"";
      if(tz){
        country=tzmap()[tz]||"";
        /* the zone's last segment is its representative city: Europe/Paris → Paris,
           America/Argentina/Buenos_Aires → Buenos Aires */
        var seg=tz.split("/").pop()||"";
        city=seg.replace(/_/g," ").trim().slice(0,80);
        if(!/^[A-Za-z .'-]{2,80}$/.test(city)) city="";
        /* an unmapped zone gives us a city we cannot attribute — drop both rather
           than file a city under no country */
        if(!country) city="";
      }
    }catch(e){ country=""; city=""; }
    try{if(country)localStorage.setItem(COUNTRY_KEY,country);if(city)localStorage.setItem(CITY_KEY,city);}catch(e){}
    return Promise.resolve({country:country,city:city});
  }
  /* This used to fire TWICE per heartbeat — once immediately with an empty country,
     then again once the network geo lookup came back — because presence must never
     depend on a slow or blocked third party. place() is local and instant now, so
     one write does the whole job and the site makes half as many calls. */
  function heartbeat(){var id=visitor(),path=location.pathname;
    return place().then(function(p){return call("record_site_visit",{visitor_id:id,page_path:path,country_code:p.country||"",city_name:p.city||""});});}
  function trackPlay(song){var key=(song||"unknown")+":"+Math.floor(Date.now()/1800000);if(key===lastPlay)return Promise.resolve();lastPlay=key;return place().then(function(p){return call("record_song_play",{visitor_id:visitor(),song_slug:String(song||"unknown").slice(0,180),city_name:p.city||""});}).then(function(result){try{window.dispatchEvent(new CustomEvent("ibee:play-counted",{detail:{song:song}}));}catch(e){}return result;});}
  function installRadioListener(){var tries=0,timer=setInterval(function(){var radio=window.IBEERADIO;if(!radio||!radio.audio){if(++tries>30)clearInterval(timer);return;}clearInterval(timer);radio.audio.addEventListener("play",function(){var song=radio.song&&radio.song();trackPlay(song&&song.f).catch(function(){});});},500);}
  heartbeat().catch(function(){});setInterval(function(){if(document.visibilityState==="visible")heartbeat().catch(function(){});},60000);installRadioListener();
  window.IBEE_STATS_CLIENT={fetch:fetchStats,songCounts:songCounts,countries:countries,cities:cities,songCities:songCities,heartbeat:heartbeat,trackPlay:trackPlay};
})();
