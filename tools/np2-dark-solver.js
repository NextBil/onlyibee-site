/* THE DARK — level solver.  node tools/np2-dark-solver.js
   Runs the GAME'S OWN constants, generator and step() (lifted out of
   np2/dark/index.html) and drives a bot through all 26 levels, so it
   proves the shipped code rather than a copy that can drift.
   Deaths are counted by wrapping respawn(), which is the only honest
   place to count them.
   Already caught, in order: the step-up assist cancelling jumps in
   mid-air, checkpoints with 2 samples of runway before a spike, and
   spikes placed part-way up a climb. */
/* Runs the GAME'S OWN step() — constants, generator and physics are all lifted
   out of np2/dark/index.html, so this proves the shipped code, not a copy. */
const fs=require("fs");
global.window={};
eval(fs.readFileSync("assets/beat-data.js","utf8").replace(/window\.IBEE_BEAT/g,"global.window.IBEE_BEAT"));
const html=fs.readFileSync("np2/dark/index.html","utf8");
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b));

const NP2=JSON.parse("["+cut("var NP2=[","];\n\n/* ====").slice(9)
  .replace(/\{f:"([^"]+)",\s*t:"([^"]*)"\}/g,(m,f,t)=>JSON.stringify({f,t}))+"]");

// constants + generator + heightfield lookups
eval(cut("var CELL=7;","/* =====================================================================\n   3. STATE"));
// the real physics
eval(cut("function respawn(){","/* =====================================================================\n   7. LIGHT"));

// the bits step()/respawn() reach for
var DEATHS=0;
var _respawn=respawn;
respawn=function(){ DEATHS++; _respawn(); };
var P={x:0,y:0,vx:0,vy:0,onGround:false,face:1,dead:0};
var keys={left:false,right:false,jump:false};
var L=null, ckAt=0, armed=false, lvIdx=0, ENDED=null, grace=0;
function RADIO(){ return null; }
function flash(){}
function endLevel(win){ ENDED=win?"win":"lose"; }
global.P=P; global.keys=keys;

function solve(L0){
  L=global.L=L0; ENDED=null; ckAt=0; global.ckAt=0; grace=0.6; global.grace=grace;
  P.x=CELL*2; P.y=L.floor[0]-PH; P.vx=0; P.vy=0; P.onGround=true; P.dead=0;
  keys.right=true; keys.left=false; keys.jump=false;
  let t=0, dt=1/60, best=0; DEATHS=0;
  const limit=L.dur*3.2;
  while(t<limit && !ENDED){
    t+=dt;
    // greedy look-ahead: jump for pits, spikes and walls
    const here=idxAt(L,P.x+PW/2); let need=false;
    /* A pit and a spike want completely different timing. You clear a spike by
       being high when you reach it, so you leave early. You clear a PIT by
       using the whole arc, so you leave from the very lip — jumping early is
       how you land in it. Using one lead for both was the bot losing levels
       that are actually fine. */
    for(let k=1;k<=10;k++){
      const j=Math.min(L.n-1,here+k);
      if(L.pit[j]){ need = k<=2; break; }
      if(L.spike[j]){ need = k<=6; break; }
      if(L.floor[j] < P.y+PH-STEP-1){ need = k<=4; break; }
    }
    keys.jump = need && P.onGround;
    step(dt);
    global.ckAt=ckAt;
    if(DEATHS>250) return {ok:false,why:"stuck",pct:+(100*best/L.w).toFixed(0),deaths:DEATHS};
    best=Math.max(best,P.x);
  }
  if(ENDED==="win") return {ok:true,deaths:DEATHS,t:+t.toFixed(0)};
  return {ok:false,why:ENDED||"timeout",pct:+(100*best/L.w).toFixed(0),deaths:DEATHS};
}

let bad=0;
NP2.forEach((s,i)=>{
  const Lv=build(s.f);
  if(!Lv){ console.log(String(i+1).padStart(2),"NO GROOVE"); bad++; return; }
  const r=solve(Lv);
  const holes=(()=>{let c=0;for(let k=1;k<Lv.n;k++)if(Lv.pit[k]&&!Lv.pit[k-1])c++;return c;})();
  const spk=Lv.spike.reduce((a,b)=>a+b,0);
  if(!r.ok){ bad++; console.log(String(i+1).padStart(2),"FAIL",s.t.padEnd(19),JSON.stringify(r),"holes",holes,"spikes",spk); }
  else console.log(String(i+1).padStart(2),"ok  ",s.t.padEnd(19),"deaths",String(r.deaths).padStart(3),
    "| holes",String(holes).padStart(2),"spikes",String(spk).padStart(2),"| run",r.t+"s of",Math.round(Lv.dur)+"s");
});
console.log(bad? "\n*** "+bad+" NOT COMPLETABLE ***" : "\nALL 26 COMPLETABLE");
