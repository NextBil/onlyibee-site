/* THE FALL — level solver.   node tools/np2-fall-solver.js
   Runs the GAME'S OWN generator and constants, lifted out of np2/fall/index.html
   via the __FALL export, and flies a bot down all 26 shafts.

   The point of this file: the previous game (np2/dark) shipped levels that were
   generated-then-hoped-about, and 19 of 26 turned out to be impossible. Here the
   channel is authored first and the walls hung around it, so this should pass by
   construction — and if it ever stops passing, the generator broke. */
const fs=require("fs");
global.window={};
eval(fs.readFileSync("assets/beat-data.js","utf8").replace(/window\.IBEE_BEAT/g,"global.window.IBEE_BEAT"));

const html=fs.readFileSync("np2/fall/index.html","utf8");
const body=html.slice(html.indexOf("(function(){\n\"use strict\";"), html.lastIndexOf("})();")+5);
/* the page's IIFE wants a DOM; give it just enough to reach the export */
const el=()=>({textContent:"",innerHTML:"",style:{},classList:{add(){},remove(){},contains(){return false}},
  addEventListener(){},getBoundingClientRect:()=>({width:390,height:844}),
  getContext:()=>({setTransform(){},clearRect(){},fillRect(){},beginPath(){},arc(){},stroke(){},fill(){},
    moveTo(){},lineTo(){},createLinearGradient:()=>({addColorStop(){}}),
    createRadialGradient:()=>({addColorStop(){}}),getImageData:()=>null,putImageData(){}}),
  querySelector:()=>null, disabled:false, getAttribute:()=>"0"});
global.document={getElementById:el, querySelector:el, querySelectorAll:()=>[],
  createElement:el, head:{appendChild(){}}, body:{classList:{add(){},remove(){}}},
  addEventListener(){}};
global.addEventListener=()=>{}; global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.requestAnimationFrame=()=>{}; global.matchMedia=()=>({matches:false});
global.devicePixelRatio=2; global.prompt=()=>null; global.alert=()=>{}; global.confirm=()=>false;
global.performance={now:()=>0};
Object.assign(global.window,{IBEERADIO:null,document:global.document,
  addEventListener:()=>{},localStorage:global.localStorage,supabase:null});
eval(body);

const F=global.window.__FALL, C=F.C, NP2=F.NP2;

function fly(L,idx){
  const {VW,SCROLL,LAT,LATA,SINK,RISE,TOPMARGIN,BOTMARGIN,PR}=C;
  const H_over_SC = 844/(390/VW);          /* a real portrait phone, in world units */
  const isVoid = L.zone.id==="void";
  let x=F.chanAt(L,0).m, sy=0.62, vx=0, collapse=0, t=0;
  const dt=1/60;
  let minMargin=99, closest=99;
  while(t<L.dur-0.25){
    t+=dt;
    const ch=F.chanAt(L,t);
    const s=Math.max(0,Math.min(L.n-1,Math.floor(t*20)));
    const hit=L.im[s];

    /* the bot: lean toward the channel centre; in the void, stop moving */
    let hold=1, side=0;
    if(isVoid){ hold = (sy > TOPMARGIN+0.16) ? 1 : 0; side=0; }
    else {
      const err=ch.m-x;
      side = Math.abs(err)<1.2 ? 0 : (err<0?-1:1);
      /* if the collapse is close, prioritise sinking (side 0 still sinks) */
      if(sy < collapse+0.10) side = Math.abs(err)<3 ? 0 : side;
    }
    const accel=LATA*(L.zone.id==="water"?0.42:1);
    const fric =(L.zone.id==="water"?1.1:6.5);
    vx += (hold?side:0)*accel*dt;
    vx -= vx*Math.min(1,fric*dt);
    if(L.zone.wind) vx += Math.sin(t*0.9+idx)*L.zone.wind*26*dt;
    vx = Math.max(-LAT,Math.min(LAT,vx));
    x  = Math.max(1,Math.min(VW-1,x+vx*dt));

    const push = isVoid ? (hold? -1 : 1) : (hold? 1 : -1);
    sy += (push>0 ? SINK : -RISE)/H_over_SC*dt;
    sy = Math.max(0.02,Math.min(BOTMARGIN,sy));

    collapse = collapse + ((TOPMARGIN+(isVoid?0.06:0)+hit*0.03)-collapse)*(1-Math.pow(0.02,dt));
    const vMargin = sy-collapse;
    if(vMargin<=0.005) return {ok:false,why:"caught",at:+t.toFixed(1),of:+L.dur.toFixed(0)};
    minMargin=Math.min(minMargin,vMargin);

    if(!isVoid){
      const edge=Math.abs(x-ch.m)-(ch.h-PR);
      if(edge>0) return {ok:false,why:"wall",at:+t.toFixed(1),of:+L.dur.toFixed(0),over:+edge.toFixed(1)};
      closest=Math.min(closest,-edge);
    }
  }
  return {ok:true, vMargin:+minMargin.toFixed(3), wallMargin:+closest.toFixed(1)};
}

let bad=0;
NP2.forEach((s,i)=>{
  const L=F.build(s[0],i);
  if(!L){ console.log(String(i+1).padStart(2),"NO GROOVE",s[1]); bad++; return; }
  const r=fly(L,i);
  const z=L.zone.id.padEnd(6);
  if(!r.ok){ bad++; console.log(String(i+1).padStart(2),"FAIL",z,s[1].padEnd(19),JSON.stringify(r)); }
  else console.log(String(i+1).padStart(2),"ok  ",z,s[1].padEnd(19),
    "secs",String(L.secs.length).padStart(2),
    "| collapse margin",String(r.vMargin).padStart(5),
    "| wall clearance",String(r.wallMargin).padStart(5),
    "|",Math.round(L.dur)+"s");
});
console.log(bad? "\n*** "+bad+" NOT SURVIVABLE ***" : "\nALL 26 SURVIVABLE");
