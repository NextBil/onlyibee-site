/* =====================================================================
   IBEE I18N — the site's translation layer (EN · FR · 日本語).
   No dependency, no build. Any page that includes this file self-translates
   from the shared localStorage choice; switching in the shell re-applies
   everywhere (the frame hears the `storage` event).

   HOW TO TRANSLATE AN ELEMENT — tag it, don't hardcode:
     <span data-i18n="nav.shop">SHOP</span>            → textContent
     <input data-i18n-ph="form.email" placeholder="email">   → placeholder
     <button data-i18n-title="close" title="close">✕</button> → title attr
   The English in the HTML stays the fallback; add fr/ja to DICT below.
   Untranslated keys (or whole pages not yet tagged) just stay English —
   canvas text (Music Universe, games), song titles and lyrics are left as-is
   on purpose (artist's voice / drawn on <canvas>, not translatable here).

   Japanese uses the pixel font DotGothic16 (loaded on demand) so it stays
   on-brand; Latin glyphs keep Press Start 2P / VT323.
   ===================================================================== */
(function(){
  "use strict";
  var KEY="ibee_lang", LANGS=["en","fr","ja"];

  /* ---------- the dictionary: key → {fr, ja}. en = whatever's in the HTML ---------- */
  var DICT={
    /* shell chrome */
    "shell.tagline":   {fr:"console d'art et de découverte_", ja:"アートと発見のコンソール_"},
    "shell.pressstart":{fr:"▶ APPUYER SUR START",            ja:"▶ スタート"},
    "nav.console":{fr:"CONSOLE",  ja:"コンソール"},
    "nav.rooms":  {fr:"SALLES",   ja:"ルーム"},
    "nav.tv":     {fr:"TV",       ja:"テレビ"},
    "nav.ics":    {fr:"ICS",      ja:"ICS"},
    "nav.shop":   {fr:"BOUTIQUE", ja:"ショップ"},
    "acct.login":  {fr:"CONNEXION", ja:"ログイン"},
    "acct.profile":{fr:"PROFIL",    ja:"プロフィール"},
    /* lyrics overlay */
    "lyr.empty":  {fr:"pas encore de paroles pour ce signal_", ja:"この信号の歌詞はまだありません_"},
    "lyr.meaning":{fr:"SENS_",            ja:"意味_"},
    "lyr.context":{fr:"CONTEXTE_",        ja:"背景_"},
    "lyr.time":   {fr:"TEMPS DE CRÉATION",ja:"制作時間"},
    "lyr.bpm":    {fr:"BPM",              ja:"BPM"},
    "lyr.close":  {fr:"fermer",           ja:"閉じる"},
    "lyr.soul":   {fr:"l'âme du disque — sens, contexte, ambiance", ja:"レコードの魂 — 意味・背景・雰囲気"},
    /* console: boot + main menu */
    "menu.main":  {fr:"MENU PRINCIPAL", ja:"メインメニュー"},
    "menu.select":{fr:"choisissez une cartouche_", ja:"カートリッジを選択_"},
    "con.hidden": {fr:"certaines choses sur cette console sont cachées_", ja:"このコンソールには隠された物がある_"},
    "menu.utopie":{fr:"UTOPIE™",  ja:"UTOPIE™"},
    "menu.lazone":{fr:"LA ZONE",  ja:"ラ・ゾーン"},
    "menu.ics":   {fr:"ICS",      ja:"ICS"},
    "menu.shop":  {fr:"BOUTIQUE", ja:"ショップ"},
    "menu.rooms": {fr:"SALLES",   ja:"ルーム"},
    "menu.about": {fr:"À PROPOS", ja:"概要"},
    "menu.music": {fr:"MOTEUR MUSICAL", ja:"ミュージックエンジン"},
    "tag.project":{fr:"PROJET",   ja:"プロジェクト"},
    "tag.live":   {fr:"EN LIGNE", ja:"ライブ"},
    "tag.games":  {fr:"JEUX",     ja:"ゲーム"},
    "tag.readme": {fr:"LISEZ-MOI",ja:"説明"},
    "tag.engine": {fr:"MOTEUR",   ja:"エンジン"}
  };
  /* let pages extend the dictionary before applying (e.g. member pages) */
  window.IBEE_I18N_EXTEND=function(more){ for(var k in more) DICT[k]=more[k]; };

  /* ---------- language state ---------- */
  function detect(){
    var n=((navigator.language||navigator.userLanguage||"en")+"").toLowerCase();
    if(n.indexOf("fr")===0) return "fr";
    if(n.indexOf("ja")===0) return "ja";
    return "en";
  }
  function get(){ try{ var l=localStorage.getItem(KEY); if(LANGS.indexOf(l)>=0) return l; }catch(e){} return detect(); }

  /* ---------- Japanese pixel font, injected only when needed ---------- */
  var jaFontAdded=false;
  function ensureJaFont(){
    if(jaFontAdded) return; jaFontAdded=true;
    var l=document.createElement("link"); l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap";
    document.head.appendChild(l);
  }
  var styleAdded=false;
  function ensureStyle(){
    if(styleAdded) return; styleAdded=true;
    var s=document.createElement("style");
    /* Press Start 2P / VT323 have no Japanese glyphs → fall through to DotGothic16 for JA
       characters while Latin stays pixel. */
    s.textContent="html.lang-ja{--px:'Press Start 2P','DotGothic16',monospace;"
      +"--vt:'VT323','DotGothic16',monospace}";
    document.head.appendChild(s);
  }

  /* ---------- apply to a document/root ---------- */
  function tr(key,lang){ var e=DICT[key]; return (e&&e[lang])||null; }
  function apply(root){
    root=root||document; var lang=get();
    try{ document.documentElement.setAttribute("lang",lang); }catch(e){}
    ensureStyle();
    if(lang==="ja"){ ensureJaFont(); document.documentElement.classList.add("lang-ja"); }
    else document.documentElement.classList.remove("lang-ja");
    var i,el,list;
    list=root.querySelectorAll("[data-i18n]");
    for(i=0;i<list.length;i++){ el=list[i];
      if(lang==="en"){ if(el.hasAttribute("data-en")) el.textContent=el.getAttribute("data-en"); continue; }
      if(!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);   // remember the source once
      var v=tr(el.getAttribute("data-i18n"),lang); if(v!=null) el.textContent=v;
    }
    list=root.querySelectorAll("[data-i18n-ph]");
    for(i=0;i<list.length;i++){ el=list[i];
      if(lang==="en"){ if(el.hasAttribute("data-en-ph")) el.setAttribute("placeholder",el.getAttribute("data-en-ph")); continue; }
      if(!el.hasAttribute("data-en-ph")) el.setAttribute("data-en-ph", el.getAttribute("placeholder")||"");
      var vp=tr(el.getAttribute("data-i18n-ph"),lang); if(vp!=null) el.setAttribute("placeholder",vp);
    }
    list=root.querySelectorAll("[data-i18n-title]");
    for(i=0;i<list.length;i++){ el=list[i];
      if(lang==="en"){ if(el.hasAttribute("data-en-title")) el.setAttribute("title",el.getAttribute("data-en-title")); continue; }
      if(!el.hasAttribute("data-en-title")) el.setAttribute("data-en-title", el.getAttribute("title")||"");
      var vt=tr(el.getAttribute("data-i18n-title"),lang); if(vt!=null) el.setAttribute("title",vt);
    }
  }

  /* translate a single string by key (for JS-generated UI, e.g. the account pill) */
  function t(key,fallback){ var v=tr(key,get()); return v!=null?v:(fallback!=null?fallback:key); }

  function set(lang){
    if(LANGS.indexOf(lang)<0) return;
    try{ localStorage.setItem(KEY,lang); }catch(e){}
    apply(document);
    syncSwitchers();
    try{ window.dispatchEvent(new CustomEvent("ibee-lang",{detail:lang})); }catch(e){}
  }

  /* ---------- the switcher UI (segmented EN · FR · 日) ---------- */
  var switchers=[];
  var LABEL={en:"EN",fr:"FR",ja:"日"}, FULL={en:"English",fr:"Français",ja:"日本語"};
  function mount(el){
    if(!el) return; el.classList.add("i18nsw");
    el.innerHTML=LANGS.map(function(l){
      return '<button type="button" data-l="'+l+'" title="'+FULL[l]+'">'+LABEL[l]+'</button>';
    }).join('');
    Array.prototype.forEach.call(el.querySelectorAll("button"),function(b){
      b.onclick=function(){ set(b.getAttribute("data-l")); };
    });
    switchers.push(el); syncSwitchers();
    injectSwitcherCSS();
  }
  function syncSwitchers(){
    var lang=get();
    switchers.forEach(function(el){
      Array.prototype.forEach.call(el.querySelectorAll("button"),function(b){
        b.classList.toggle("on", b.getAttribute("data-l")===lang);
      });
    });
  }
  var swCssAdded=false;
  function injectSwitcherCSS(){
    if(swCssAdded) return; swCssAdded=true;
    var s=document.createElement("style");
    s.textContent=".i18nsw{display:flex;align-items:stretch}"
      +".i18nsw button{font-family:'Press Start 2P',monospace;font-size:8px;color:#7a7a7a;background:transparent;"
      +"border:0;border-left:1px solid #161616;padding:0 8px;cursor:pointer;letter-spacing:1px}"
      +".i18nsw button:hover{color:#e8e8e8}"
      +".i18nsw button.on{color:#000;background:#b6ff00}";
    document.head.appendChild(s);
  }

  /* re-apply when the choice changes in another frame/tab (shared localStorage) */
  window.addEventListener("storage",function(ev){ if(ev&&ev.key===KEY){ apply(document); syncSwitchers(); } });

  window.IBEE_I18N={get:get,set:set,apply:apply,mount:mount,t:t,langs:LANGS,label:LABEL,full:FULL};

  /* self-apply once the DOM is ready */
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){apply(document);});
  else apply(document);
})();
