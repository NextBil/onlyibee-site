/* =====================================================================
   IBEE TEE ART — window.IBEE_TEE.svg(product, opts) -> an <svg> string of a
   t-shirt mockup, drawn from the product's own fields (body / ink / motif).

   Why vector and not photos: these are 1-of-1 print-on-demand pieces with no
   stock and no photoshoot. A drawn mockup is honest (it IS the artwork, not a
   staged product shot), stays crisp at any size, weighs ~2KB instead of 400KB,
   and can be recoloured per piece from data with no new asset to upload.

   Add a design: give the product a `motif` key below + `body`/`ink` colours in
   assets/products-data.js. No code change needed here beyond the motif path.
   ===================================================================== */
(function(){
  "use strict";
  if(window.IBEE_TEE) return;

  /* The shirt silhouette. One path, drawn once, reused for every piece —
     collar, shoulders, sleeves, body with a slight A-line drop. */
  var SHIRT="M100 34 L74 24 C66 21 58 20 50 24 L14 42 L4 84 L30 96 L36 78 L36 176 "+
            "C36 180 39 183 43 183 L157 183 C161 183 164 180 164 176 L164 78 L170 96 "+
            "L196 84 L186 42 L150 24 C142 20 134 21 126 24 L100 34 Z";
  /* collar cut-out, sits on top of the body in the shirt's own colour */
  var COLLAR="M74 24 C82 44 118 44 126 24 C118 30 82 30 74 24 Z";

  /* ---- the prints. Each returns paths drawn inside a 100x100 box that gets
     placed on the chest; `ink` is the print colour, `alt` a lighter accent. ---- */
  var MOTIF={
    pawn:function(i,a){return '<path d="M50 12c-7 0-12 5-12 11 0 4 2 7 5 9-4 3-6 8-6 13 0 6 3 11 8 14-3 9-8 17-14 24h38c-6-7-11-15-14-24 5-3 8-8 8-14 0-5-2-10-6-13 3-2 5-5 5-9 0-6-5-11-12-11z" fill="'+i+'"/>'+
      '<rect x="26" y="83" width="48" height="8" rx="2" fill="'+a+'"/>';},
    eye:function(i,a){return '<path d="M8 50c14-19 30-28 42-28s28 9 42 28c-14 19-30 28-42 28S22 69 8 50z" fill="none" stroke="'+i+'" stroke-width="5"/>'+
      '<circle cx="50" cy="50" r="15" fill="'+i+'"/><circle cx="50" cy="50" r="6" fill="#050505"/>'+
      '<circle cx="44" cy="44" r="3.4" fill="'+a+'"/>';},
    skull:function(i,a){return '<path d="M50 10C31 10 18 24 18 42c0 10 4 17 10 22v12c0 3 2 5 5 5h34c3 0 5-2 5-5V64c6-5 10-12 10-22C82 24 69 10 50 10z" fill="'+i+'"/>'+
      '<circle cx="38" cy="42" r="8" fill="#050505"/><circle cx="62" cy="42" r="8" fill="#050505"/>'+
      '<path d="M46 58h8l-4 8z" fill="#050505"/>'+
      '<rect x="36" y="72" width="5" height="9" fill="#050505"/><rect x="47" y="72" width="5" height="9" fill="#050505"/><rect x="58" y="72" width="5" height="9" fill="#050505"/>';},
    leaf:function(i,a){var g="";for(var k=-2;k<=2;k++){var r=k*26;
      g+='<path d="M50 78 C50 60 50 40 50 18" stroke="'+i+'" stroke-width="4" fill="none" transform="rotate('+r+' 50 78)"/>'+
         '<path d="M50 78 C44 58 44 40 50 20 C56 40 56 58 50 78 Z" fill="'+i+'" transform="rotate('+r+' 50 78) scale(1)" opacity="'+(k===0?1:.85)+'"/>';}
      return g+'<rect x="48" y="76" width="4" height="14" fill="'+a+'"/>';},
    bolt:function(i,a){return '<path d="M58 6 26 56h18l-8 40 34-52H50l8-38z" fill="'+i+'"/>'+
      '<path d="M58 6 26 56h18" fill="none" stroke="'+a+'" stroke-width="2" opacity=".8"/>';},
    mask:function(i,a){return '<path d="M50 6c-16 0-26 12-26 30 0 24 12 58 26 58s26-34 26-58C76 18 66 6 50 6z" fill="none" stroke="'+i+'" stroke-width="5"/>'+
      '<path d="M34 36c5-5 11-5 16 0M50 36c5-5 11-5 16 0" stroke="'+i+'" stroke-width="4" fill="none"/>'+
      '<path d="M50 46v18" stroke="'+i+'" stroke-width="4"/>'+
      '<path d="M40 74c6 5 14 5 20 0" stroke="'+a+'" stroke-width="4" fill="none"/>'+
      '<circle cx="50" cy="20" r="4" fill="'+a+'"/>';},
    crown:function(i,a){return '<path d="M14 76 8 26l24 18L50 12l18 32 24-18-6 50z" fill="'+i+'"/>'+
      '<rect x="14" y="80" width="72" height="9" rx="2" fill="'+a+'"/>'+
      '<circle cx="50" cy="52" r="5" fill="#050505"/>';},
    spiral:function(i,a){
      var d="",t=0;
      for(t=0;t<=6.6*Math.PI;t+=0.14){
        var r=2.4+t*2.15, x=50+r*Math.cos(t), y=50+r*Math.sin(t);
        d+=(t===0?"M":"L")+x.toFixed(1)+" "+y.toFixed(1);
      }
      return '<path d="'+d+'" fill="none" stroke="'+i+'" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<circle cx="50" cy="50" r="4" fill="'+a+'"/>';},
    flame:function(i,a){return '<path d="M50 4c8 20-14 26-14 44 0 8 5 14 12 17-3-9 1-16 8-20-2 12 12 15 12 28 0 12-9 21-18 21-16 0-28-13-28-31C22 40 42 30 50 4z" fill="'+i+'"/>'+
      '<path d="M50 52c6 6 8 12 6 20-4-4-8-6-12-5 3-6 5-10 6-15z" fill="'+a+'"/>';},
    moon:function(i,a,u){return '<mask id="mo'+u+'"><rect x="0" y="0" width="100" height="100" fill="#fff"/>'+
      '<circle cx="68" cy="38" r="36" fill="#000"/></mask>'+
      '<circle cx="46" cy="50" r="40" fill="'+i+'" mask="url(#mo'+u+')"/>'+
      '<circle cx="84" cy="20" r="3.6" fill="'+a+'"/><circle cx="92" cy="46" r="2.4" fill="'+a+'"/><circle cx="80" cy="72" r="2.8" fill="'+a+'"/>';},
    tower:function(i,a){return '<path d="M30 90 44 20h12l14 70z" fill="none" stroke="'+i+'" stroke-width="5"/>'+
      '<path d="M36 62h28M33 76h34" stroke="'+i+'" stroke-width="4"/>'+
      '<path d="M50 20V6" stroke="'+a+'" stroke-width="4"/><circle cx="50" cy="5" r="4" fill="'+a+'"/>';},
    heart:function(i,a){return '<path d="M50 88C24 68 10 54 10 36 10 24 20 14 32 14c8 0 14 4 18 10 4-6 10-10 18-10 12 0 22 10 22 22 0 18-14 32-40 52z" fill="'+i+'"/>'+
      '<path d="M28 30c-4 3-6 7-6 12" stroke="'+a+'" stroke-width="4" fill="none" stroke-linecap="round"/>';},
    wave:function(i,a){var g="";for(var k=0;k<3;k++){g+='<path d="M6 '+(38+k*18)+'c11-13 22-13 33 0s22 13 33 0 22-13 22 0" fill="none" stroke="'+(k===1?a:i)+'" stroke-width="5" stroke-linecap="round"/>';}return g;},
    star:function(i,a){return '<path d="M50 4 62 38h36L69 59l11 35-30-22-30 22 11-35L2 38h36z" fill="'+i+'"/>'+
      '<path d="M50 22 56 40h19L60 51l6 19-16-12-16 12 6-19-15-11h19z" fill="'+a+'" opacity=".55"/>';},
    grid:function(i,a){var g="";for(var k=0;k<5;k++){var v=10+k*20;
      g+='<path d="M'+v+' 8V92" stroke="'+i+'" stroke-width="3"/><path d="M8 '+v+'H92" stroke="'+i+'" stroke-width="3"/>';}
      return g+'<rect x="30" y="30" width="20" height="20" fill="'+a+'"/><rect x="50" y="50" width="20" height="20" fill="'+a+'" opacity=".6"/>';}
  };

  function lighten(hex){
    /* cheap tint toward white for the accent ink — keeps every print two-tone */
    var c=String(hex||"#ffffff").replace('#','');
    if(c.length===3) c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    var n=parseInt(c,16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    r=Math.round(r+(255-r)*.45); g=Math.round(g+(255-g)*.45); b=Math.round(b+(255-b)*.45);
    return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
  }

  /* uid keeps <defs> ids unique when many shirts share one document */
  var seq=0;
  function svg(p,opts){
    opts=opts||{};
    var body=p.body||"#111111", ink=p.ink||"#b6ff00", alt=lighten(ink);
    var motif=MOTIF[p.motif]||MOTIF.grid;
    var u="t"+(++seq);
    return ''+
    '<svg class="teeart" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+(p.n||"t-shirt")+'">'+
      '<defs>'+
        '<linearGradient id="fab'+u+'" x1="0" y1="0" x2="0" y2="1">'+
          '<stop offset="0%" stop-color="'+lighten(body)+'" stop-opacity=".55"/>'+
          '<stop offset="45%" stop-color="'+body+'"/>'+
          '<stop offset="100%" stop-color="#000" stop-opacity=".5"/>'+
        '</linearGradient>'+
        /* the foil sweep — a moving highlight that reads as a collectible card */
        '<linearGradient id="foil'+u+'" x1="0" y1="0" x2="1" y2="0">'+
          '<stop offset="0%" stop-color="#fff" stop-opacity="0"/>'+
          '<stop offset="45%" stop-color="#fff" stop-opacity=".30"/>'+
          '<stop offset="55%" stop-color="#fff" stop-opacity=".30"/>'+
          '<stop offset="100%" stop-color="#fff" stop-opacity="0"/>'+
        '</linearGradient>'+
        '<clipPath id="clip'+u+'"><path d="'+SHIRT+'"/></clipPath>'+
      '</defs>'+
      '<path d="'+SHIRT+'" fill="url(#fab'+u+')" stroke="rgba(0,0,0,.65)" stroke-width="2"/>'+
      /* fabric seams */
      '<path d="M36 78 L36 176" stroke="rgba(255,255,255,.07)" stroke-width="2" fill="none"/>'+
      '<path d="M164 78 L164 176" stroke="rgba(255,255,255,.07)" stroke-width="2" fill="none"/>'+
      '<path d="'+COLLAR+'" fill="rgba(0,0,0,.45)"/>'+
      '<g transform="translate(60 62) scale(0.8)">'+motif(ink,alt,u)+'</g>'+
      /* sweep lives inside the shirt only */
      '<g clip-path="url(#clip'+u+')"><rect class="teefoil" x="-220" y="0" width="180" height="200" fill="url(#foil'+u+')"/></g>'+
    '</svg>';
  }

  window.IBEE_TEE={svg:svg, motifs:Object.keys(MOTIF)};
})();
