/* =====================================================================
   IBEE BADGES — the trophy system (PS4-style corner pops).
   Loaded by the SHELL (index.html) where it tracks + pops toasts, and by
   member/profile/ where it only exposes the catalog for rendering
   (only the top window tracks — a framed copy stays passive, so nothing
   is ever counted twice).

   What it watches (all data that already exists — no new backend):
     • window.IBEERADIO           — real listening time, per song
     • localStorage ibee_sav      — universe plays + vault flag
     • localStorage ibee_engine10 — player.js's "felt a track 10s" flag
     • localStorage sb-*-auth-token — signed-in member (same trick as shell)
     • localStorage ibee_badge_evt — one-shot events written by the games
       (finished run / score), chess (checkmate) and member/ (shared pass)

   State lives in localStorage "ibee_badges":
     {v:1, earned:{id:ts}, evtT:lastEventTs,
      prog:{listen,night,songs:{slug:1},full,days:{ymd:1},rooms:{g:1},best,shared,chess}}
   ===================================================================== */
(function(){
  "use strict";
  var TOP=(function(){ try{ return window.top===window.self; }catch(e){ return true; } })();
  var KEY="ibee_badges", EVT="ibee_badge_evt";

  /* ---------- state ---------- */
  function blank(){ return {v:1,earned:{},evtT:0,
    prog:{listen:0,night:0,songs:{},full:0,days:{},rooms:{},best:0,shared:0,chess:0}}; }
  function load(){
    try{ var s=JSON.parse(localStorage.getItem(KEY)||"null");
      if(s&&s.v===1&&s.prog) return s; }catch(e){}
    return blank();
  }
  var S=load(), dirty=false;
  function save(){ if(!dirty) return; dirty=false;
    try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} }

  /* ---------- shared readers (same patterns as shell/console) ---------- */
  function loggedIn(){ try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i);
    if(/^sb-.*-auth-token$/.test(k)){ var v=localStorage.getItem(k); if(v&&v!=="null") return true; } } }catch(e){} return false; }
  function eng10(){ try{ return localStorage.getItem("ibee_engine10")==="1"; }catch(e){ return false; } }
  function sav(){ try{ return JSON.parse(localStorage.getItem("ibee_sav")||"{}")||{}; }catch(e){ return {}; } }
  function playsTotal(){ var p=sav().plays||{},t=0; for(var k in p) t+=(+p[k]||0); return t; }
  function ymd(d){ d=d||new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }
  function streak(){
    var n=0,d=new Date();
    if(!S.prog.days[ymd(d)]) d.setDate(d.getDate()-1);      // today not yet marked → count from yesterday
    while(S.prog.days[ymd(d)]){ n++; d.setDate(d.getDate()-1); }
    return n;
  }

  /* ---------- the catalog (profile page renders from this) ----------
     chk(P) → earned?  pr(P) → short progress string shown while locked */
  function nkeys(o){ var n=0; for(var k in o) n++; return n; }
  var DEFS=[
    {id:"first-signal",ico:"📡",n:"FIRST SIGNAL",d:"felt a track for 10 seconds",
      chk:function(P){return P.listen>=10||P.eng10;},
      pr:function(P){return Math.min(10,Math.floor(P.listen))+"/10s";}},
    {id:"engine",ico:"🌌",n:"UNIVERSE ENGINE",n2:"UNIVERSE MUSIC ENGINE",gold:true,
      d:"signed in + felt the music — the engine is yours",
      chk:function(P){return (P.listen>=10||P.eng10)&&P.loggedIn;},
      pr:function(P){return ((P.listen>=10||P.eng10)?"✓ listened":"○ listen 10s")+" · "+(P.loggedIn?"✓ signed in":"○ sign in");}},
    {id:"needle-20",ico:"🎯",n:"NEEDLE DROP",d:"20 seconds deep in one record",
      chk:function(P){return P.maxPlay>=20;},
      pr:function(P){return Math.min(20,Math.floor(P.maxPlay))+"/20s";}},
    {id:"full-spin",ico:"💿",n:"FULL SPIN",d:"a record heard front to back",
      chk:function(P){return P.full>=1;},pr:function(){return "play one to the end";}},
    {id:"digger",ico:"🎧",n:"CRATE DIGGER",d:"felt 10 different records",
      chk:function(P){return P.nsongs>=10;},pr:function(P){return P.nsongs+"/10 records";}},
    {id:"night",ico:"🌙",n:"NIGHT SIGNAL",d:"listening after midnight",
      chk:function(P){return P.night>=60;},pr:function(P){return Math.min(60,Math.floor(P.night))+"/60s after 00:00";}},
    {id:"streak",ico:"🔥",n:"ON FREQUENCY",d:"listened 3 days in a row",
      chk:function(P){return P.streak>=3;},pr:function(P){return P.streak+"/3 days";}},
    {id:"rotation",ico:"🔁",n:"HEAVY ROTATION",d:"25 plays in the universe",
      chk:function(P){return P.plays>=25;},pr:function(P){return P.plays+"/25 plays";}},
    {id:"first-run",ico:"🕹",n:"FIRST RUN",d:"finished a run in a room",
      chk:function(P){return P.roomsN>=1;},pr:function(){return "play any room";}},
    {id:"score-100",ico:"🏆",n:"SCORE HUNTER",d:"scored 100+ in one run",
      chk:function(P){return P.best>=100;},pr:function(P){return "best "+Math.floor(P.best)+"/100";}},
    {id:"room-hopper",ico:"👾",n:"ROOM HOPPER",d:"ran all 3 rooms",
      chk:function(P){return P.roomsN>=3;},pr:function(P){return P.roomsN+"/3 rooms";}},
    {id:"checkmate",ico:"♟",n:"CHECKMATE",d:"beat the CPU at ICS chess",
      chk:function(P){return P.chess>=1;},pr:function(){return "win a match";}},
    {id:"recruiter",ico:"📣",n:"RECRUITER",d:"put a friend on the frequency",
      chk:function(P){return P.shared>=1;},pr:function(){return "share your pass";}},
    {id:"vault",ico:"🔓",n:"VAULT FINDER",d:"found the hidden vault",
      chk:function(P){return P.vault;},pr:function(){return "it's out there_";}}
  ];

  /* one enriched snapshot per tick — every chk/pr reads from this */
  var maxPlay=0;   // longest single-song stretch this session (needle-drop)
  function snapshot(){
    var p=S.prog;
    return {listen:p.listen,night:p.night,full:p.full,best:p.best,shared:p.shared,chess:p.chess,
      nsongs:nkeys(p.songs),roomsN:nkeys(p.rooms),days:p.days,streak:streak(),
      plays:playsTotal(),vault:!!sav().vault,loggedIn:loggedIn(),eng10:eng10(),maxPlay:maxPlay};
  }

  /* public: the profile page (and anything else) renders from this */
  window.IBEE_BADGES={defs:DEFS,state:function(){return load();},snapshot:snapshot,
    earned:function(){ var s=load(),n=0; for(var k in s.earned) n++; return n; }};

  if(!TOP) return;   /* framed copy = catalog only; the shell above is tracking */

  /* =====================  TOASTS (small, corner, brief)  ===================== */
  var css=document.createElement("style");
  css.textContent=
    "#bgtoasts{position:fixed;top:50px;right:10px;z-index:8600;display:flex;flex-direction:column;"
    +"gap:8px;align-items:flex-end;pointer-events:none;font-family:'Press Start 2P',monospace}"
    +".bgt{display:flex;align-items:center;gap:10px;max-width:min(320px,86vw);pointer-events:auto;"
    +"background:rgba(8,8,10,.94);border:1px solid #2a2a2a;border-left:3px solid #b6ff00;"
    +"padding:9px 12px 9px 10px;box-shadow:0 4px 18px rgba(0,0,0,.6),0 0 12px rgba(182,255,0,.12);"
    +"transform:translateX(115%);opacity:0;transition:transform .38s cubic-bezier(.2,.9,.25,1.2),opacity .3s}"
    +".bgt.on{transform:translateX(0);opacity:1}"
    +".bgt.bye{transform:translateX(0) translateY(-6px);opacity:0;transition:opacity .45s,transform .45s}"
    +".bgt .bi{font-size:22px;line-height:1;flex:none;filter:drop-shadow(0 0 6px rgba(182,255,0,.5));"
    +"animation:bgpop .5s cubic-bezier(.2,1.6,.4,1)}"
    +"@keyframes bgpop{0%{transform:scale(.2) rotate(-18deg)}100%{transform:scale(1) rotate(0)}}"
    +".bgt .bx{display:flex;flex-direction:column;gap:5px;min-width:0}"
    +".bgt .bh{font-size:7px;color:#7a7a7a;letter-spacing:1px}"
    +".bgt .bn{font-size:9px;color:#b6ff00;line-height:1.5}"
    +".bgt .bd2{font-family:'VT323',monospace;font-size:14px;color:#9a9a9a;line-height:1.15}"
    +".bgt.gold{border-left-color:#ffd60a;box-shadow:0 4px 18px rgba(0,0,0,.6),0 0 16px rgba(255,214,10,.22)}"
    +".bgt.gold .bn{color:#ffd60a}.bgt.gold .bi{filter:drop-shadow(0 0 8px rgba(255,214,10,.6))}"
    +".bgt.link{cursor:pointer;border-left-color:#26e0ff;box-shadow:0 4px 18px rgba(0,0,0,.6),0 0 16px rgba(38,224,255,.2)}"
    +".bgt.link .bn{color:#26e0ff}.bgt.link:hover{background:rgba(10,16,18,.96)}"
    +".bgt .bxx{flex:none;color:#555;font-size:9px;padding:2px 0 2px 6px;cursor:pointer}.bgt .bxx:hover{color:#fff}";
  document.head.appendChild(css);
  var host=document.createElement("div"); host.id="bgtoasts"; document.body.appendChild(host);

  function blipT(){ try{
    var C=window.AudioContext||window.webkitAudioContext; if(!C) return;
    blipT.ctx=blipT.ctx||new C(); var a=blipT.ctx; if(a.state==="suspended") return;
    [660,990].forEach(function(f,i){
      var o=a.createOscillator(),g=a.createGain();
      o.type="square"; o.frequency.value=f;
      g.gain.setValueAtTime(.0001,a.currentTime+i*.09);
      g.gain.exponentialRampToValueAtTime(.02,a.currentTime+i*.09+.02);
      g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+i*.09+.14);
      o.connect(g); g.connect(a.destination); o.start(a.currentTime+i*.09); o.stop(a.currentTime+i*.09+.16);
    });
  }catch(e){} }

  var queue=[],showing=false;
  function esc(s){return String(s).replace(/[&<>]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[m];});}
  function pump(){
    if(showing||!queue.length) return; showing=true;
    var t=queue.shift(), el=document.createElement("div");
    el.className="bgt"+(t.gold?" gold":"")+(t.link?" link":"");
    el.innerHTML='<div class="bi">'+t.ico+'</div><div class="bx"><div class="bh">'+esc(t.h)
      +'</div><div class="bn">'+esc(t.n)+'</div>'+(t.d?'<div class="bd2">'+esc(t.d)+'</div>':'')
      +'</div>'+(t.link?'<div class="bxx" title="dismiss">✕</div>':'');
    host.appendChild(el);
    requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add("on");});});
    blipT();
    var life=t.link?9000:4600, gone=false;
    function bye(){ if(gone) return; gone=true;
      el.classList.add("bye");
      setTimeout(function(){ el.remove(); showing=false; setTimeout(pump,350); },480);
    }
    if(t.link){
      el.querySelector(".bxx").addEventListener("click",function(ev){ev.stopPropagation();bye();});
      el.addEventListener("click",function(){
        bye();
        var f=document.getElementById("frame");
        if(f) f.src="member/?login=1"; else location.href="member/?login=1";
      });
    }
    setTimeout(bye,life);
  }
  function toast(t){ queue.push(t); pump(); }

  /* =====================  TRACKING (top window only)  ===================== */
  var curSlug=null,lastT=0,playSec=0,fullDone=false,daySec=0,promptShown=false;

  function consumeEvent(){
    try{
      var raw=localStorage.getItem(EVT); if(!raw) return;
      var e=JSON.parse(raw); if(!e||!e.t||e.t<=S.evtT) return;
      S.evtT=e.t;
      if(e.k==="game"&&e.g){ S.prog.rooms[e.g]=1; if((+e.v||0)>S.prog.best) S.prog.best=(+e.v||0); }
      else if(e.k==="share"){ S.prog.shared=1; }
      else if(e.k==="chess"){ S.prog.chess=1; }
      dirty=true;
    }catch(err){}
  }
  window.addEventListener("storage",function(ev){ if(ev&&ev.key===EVT){ consumeEvent(); check(); } });

  function check(){
    var P=snapshot();
    DEFS.forEach(function(def){
      if(S.earned[def.id]) return;
      var ok=false; try{ ok=def.chk(P); }catch(e){}
      if(!ok) return;
      S.earned[def.id]=Date.now(); dirty=true;
      toast({ico:def.ico,h:def.gold?"⭐ UNLOCKED":"BADGE EARNED",n:def.n2||def.n,d:def.d,gold:def.gold});
      if(def.id==="engine"){ try{ localStorage.setItem("ibee_engine10","1"); }catch(e){} }
    });
    /* the hook: signal felt but no account yet → one small nudge per visit */
    if(!promptShown && S.earned["first-signal"] && !S.earned["engine"] && !P.loggedIn && P.listen>=10){
      promptShown=true;
      toast({ico:"🌌",h:"ONE LAST THING",n:"UNLOCK THE UNIVERSE MUSIC ENGINE",
        d:"a few seconds — sign in & it's yours. tap here_",link:true});
    }
    save();
  }

  setInterval(function(){
    consumeEvent();
    var r=window.IBEERADIO;
    if(r&&r.audio){
      var slug=null; try{ slug=r.slug&&r.slug(); }catch(e){}
      if(slug!==curSlug){ curSlug=slug; playSec=0; fullDone=false; try{lastT=r.audio.currentTime||0;}catch(e){lastT=0;} }
      var playing=false; try{ playing=r.playing(); }catch(e){}
      if(playing){
        var t=0,d=0; try{ t=r.audio.currentTime||0; d=r.audio.duration||0; }catch(e){}
        var dt=t-lastT; lastT=t;
        if(dt>0&&dt<2){            /* seeks/track jumps (dt>=2 or <0) don't count */
          S.prog.listen+=dt; playSec+=dt; daySec+=dt; dirty=true;
          if(playSec>maxPlay) maxPlay=playSec;
          var h=new Date().getHours(); if(h<5) S.prog.night+=dt;
          if(playSec>=20&&slug&&!S.prog.songs[slug]) S.prog.songs[slug]=1;
          if(!fullDone&&d>60&&playSec>=d*0.9){ fullDone=true; S.prog.full++; }
          if(daySec>=30&&!S.prog.days[ymd()]){
            S.prog.days[ymd()]=1;
            var ks=Object.keys(S.prog.days); if(ks.length>45){ ks.sort(); delete S.prog.days[ks[0]]; }
          }
        }
      }
    }
    check();
  },1000);
})();
