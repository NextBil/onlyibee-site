# -*- coding: utf-8 -*-
"""NOUVEAUX PUNK 2 — THE 26. Print artwork generator.

One SVG per piece, 100x100 drawing box scaled to 3000x3000, transparent
ground. Colours are the sleeve's, sampled in np2/index.html:
  pink #ff1f6f  acid #e8dc12  petrol #1a2d31  sleeve #0b1719  bone #efece4
Motifs come from three places and nowhere else: the sleeve (the ONLY IBEE
band, the dripping logotype, the advisory block, the shrink-wrap), THE FALL
(the pit walls, the gates, the heart and star pickups, the faller), and the
seven prints already drawn for this capsule.
"""
import os, math

PINK="#ff1f6f"; PINKL="#ff84b0"; PINKD="#c1004e"
ACID="#e8dc12"; ACIDL="#f2ec7d"
BONE="#efece4"; INK="#0b1719"; TEAL="#1a2d31"

HDR=('<?xml version="1.0" encoding="UTF-8"?>\n'
     '<!-- NOUVEAUX PUNK 2 — THE 26 · {title}\n'
     '     {note}\n'
     '     Ink {ink} on the {blank} blank. Vector, transparent ground,\n'
     '     drawn 100x100 and scaled to 3000x3000 so it goes to DTF film at\n'
     '     any size with no resampling.{fontwarn} -->\n'
     '<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="3000" '
     'viewBox="0 0 100 100">\n  <title>NOUVEAUX PUNK 2 — {title}</title>\n  {body}\n</svg>\n')

FONTWARN=("\n     !! CONTAINS LIVE TEXT. Convert type to outlines before sending to\n"
          "        the printer, or the shop may substitute a different face.")

def T(x,y,s,size,fill,ls=0,anchor="middle",w=700,fam="Helvetica,Arial,sans-serif"):
    """SVG letter-spacing is applied after the LAST glyph too, so a
       middle-anchored string drifts left by half a track. Compensate here so
       every line on every shirt is actually centred on the chest."""
    if anchor=="middle": x=x+ls/2.0
    return ('<text x="%g" y="%g" text-anchor="%s" font-family="%s" font-weight="%s" '
            'font-size="%g" letter-spacing="%g" fill="%s">%s</text>'
            %(x,y,anchor,fam,w,size,ls,fill,s))

def drips(y,xs,ink,lo=8,hi=34,seed=7):
    """The logotype's drip, reused: a bar's underside running wet."""
    g=""; r=seed
    for x in xs:
        r=(r*1103515245+12345)%2147483648
        h=lo+(r%1000)/1000.0*(hi-lo)
        g+='<rect x="%g" y="%g" width="4.6" height="%g" fill="%s"/>'%(x,y,h,ink)
        g+='<circle cx="%g" cy="%g" r="2.3" fill="%s"/>'%(x+2.3,y+h,ink)
    return g

def faller(cx,cy,s,ink,alt=None,phase=0.0,head=True):
    """The faller from THE FALL — head-down in the shaft.

       A stick figure only reads as a person if it has mass and joints, so the
       torso is a tapered slab (not a line), the head sits below a real neck
       gap, and the arms and legs bend at points offset from the spine rather
       than all radiating from one dot. Local +y is UP the shirt; the head is
       at negative y because the pit is entered head-first."""
    alt=alt or ink
    def P(x,y): return (cx+x*s, cy-y*s)
    flap=math.sin(phase*2.6); pedal=math.sin(phase*2.2)
    g=""
    # torso — shoulders wider than hips
    g+='<polygon points="%g,%g %g,%g %g,%g %g,%g" fill="%s"/>'%(
        P(-5.4,-16)+P(5.4,-16)+P(4.4,10)+P(-4.4,10)+(ink,))
    if head:
        g+='<rect x="%g" y="%g" width="%g" height="%g" fill="%s"/>'%(
            (cx-1.7*s, cy+16*s, 3.4*s, 5*s, ink))          # neck
        g+='<circle cx="%g" cy="%g" r="%g" fill="%s"/>'%(P(0,-26)+(5.2*s,ink))
    for side in (-1,1):
        # arms swept back and out — the air is coming from the head end
        g+='<polyline points="%g,%g %g,%g %g,%g" fill="none" stroke="%s" stroke-width="%g" stroke-linecap="round" stroke-linejoin="round"/>'%(
            P(side*4.8,-14)+P(side*14.0,-7.5+2.2*flap*side)+P(side*19.0,2.0+3.0*flap*side)+(ink,3.2*s))
        # legs, knees clearly broken outward, shins pedalling
        g+='<polyline points="%g,%g %g,%g %g,%g" fill="none" stroke="%s" stroke-width="%g" stroke-linecap="round" stroke-linejoin="round"/>'%(
            P(side*3.8,9)+P(side*11.0,19+2.4*pedal*side)+P(side*(5.5+3.0*abs(pedal)),29+3.0*pedal*side)+(alt,3.6*s))
    return g

def heart(cx,cy,s,ink):
    d=("M%g %gC%g %g %g %g %g %g %g %g %g %g %g %g %g %g %g %g %g %g %g %gZ")
    # a plain, fat heart — the pickup, scaled up
    return ('<path transform="translate(%g %g) scale(%g) translate(-50 -50)" '
            'd="M50 88C24 68 10 54 10 36 10 24 20 14 32 14c8 0 14 4 18 10 4-6 10-10 18-10 '
            '12 0 22 10 22 22 0 18-14 32-40 52z" fill="%s"/>'%(cx,cy,s/100.0,ink))

def star(cx,cy,r,ink,pts=5,inner=0.42,rot=-90):
    p=[]
    for i in range(pts*2):
        a=math.radians(rot+i*180.0/pts); rr=r if i%2==0 else r*inner
        p.append("%g,%g"%(cx+rr*math.cos(a), cy+rr*math.sin(a)))
    return '<polygon points="%s" fill="%s"/>'%(" ".join(p),ink)

def walls(ink,gapy,gapx,gapw,op=1.0):
    """Two pit walls with one gate in them — the game's core shape."""
    return ('<path d="M6 4 L6 96 L20 96 L20 4 Z" fill="%s" opacity="%g"/>'
            '<path d="M80 4 L80 96 L94 96 L94 4 Z" fill="%s" opacity="%g"/>'%(ink,op,ink,op))

def gate(y,x0,x1,ink,h=3.2):
    return ('<rect x="20" y="%g" width="%g" height="%g" fill="%s"/>'
            '<rect x="%g" y="%g" width="%g" height="%g" fill="%s"/>'
            %(y,max(0,x0-20),h,ink, x1,y,max(0,80-x1),h,ink))

def band(y,h,ink,label,size,lscale=0.5,txt="#fff",edge=None):
    g='<rect x="0" y="%g" width="100" height="%g" fill="%s"/>'%(y,h,ink)
    if edge:
        g+='<rect x="0" y="%g" width="100" height="2.5" fill="%s" opacity=".75"/>'%(y-4,edge)
        g+='<rect x="0" y="%g" width="100" height="2.5" fill="%s" opacity=".75"/>'%(y+h+1.5,edge)
    g+=T(50,y+h/2+size*0.36,label,size,txt,lscale)
    return g

# ---------------------------------------------------------------- the pieces
D=[]
def add(no,slug,title,blank,ink,note,body,fonts=False):
    D.append(dict(no=no,slug=slug,title=title,blank=blank,ink=ink,note=note,body=body,fonts=fonts))

# --- ABIDJAN ------------------------------------------------------------
add("02","okay","OKAY","black",ACID,
  "The record's shrug, set in the logotype and left to run.",
  '<g>'+T(50,46,"OK",40,ACID,-2)
  +drips(48,[18,27,36,45,54,63,72],ACID,6,24,3)
  +'<rect x="14" y="80" width="72" height="1.6" fill="%s" opacity=".7"/>'%PINK
  +T(50,92,"OKAY",7,PINK,3.4)+'</g>',True)

add("03","money-upp","MONEY UPP","clay",PINK,
  "Bars stacked into an arrow — the only graph on the record that goes up.",
  '<g>'+"".join('<rect x="%g" y="%g" width="9" height="%g" rx="1" fill="%s"/>'
      %(22+i*11, 62-i*9.5, 8+i*9.5, PINK if i<4 else PINKL) for i in range(5))
  +'<path d="M74 26 L92 26 L92 44" fill="none" stroke="%s" stroke-width="4" stroke-linecap="square"/>'%ACID
  +'<path d="M92 26 L58 60" stroke="%s" stroke-width="4" stroke-linecap="round"/>'%ACID
  +T(50,84,"MONEY UPP",9,ACID,2.2)+'</g>',True)

add("04","drop-it","DROP IT","bone",PINK,
  "The logotype's drip, isolated. Paths only — nothing to go wrong at the printer.",
  '<g><rect x="8" y="18" width="84" height="22" fill="%s"/>'%PINK
  +drips(40,[13,25,37,49,61,73,85],PINK,12,38,11)
  +'<rect x="8" y="18" width="84" height="4" fill="%s" opacity=".8"/>'%PINKL
  +T(50,32,"DROP IT",11,"#fff",3.0)+'</g>',True)

# --- TORONTO ------------------------------------------------------------
add("05","pikatchuu","PIKATCHUU","black",ACID,
  "The bolt, doubled — the acid one on top of its pink shadow.",
  '<g><path d="M62 2 26 54h20l-9 38 36-52H52l10-36z" fill="%s"/>'%PINK
  +'<path d="M58 6 22 58h20l-9 38 36-52H48l10-36z" fill="%s"/>'%ACID
  +T(50,99,"PIKATCHUU",6.4,PINKL,3.6)+'</g>',True)

add("06","write-a-song","WRITE A SONG","bone",INK,
  "Five lines of stave, and the notes are the pit's gates.",
  '<g>'+"".join('<rect x="8" y="%g" width="84" height="1.3" fill="%s"/>'%(30+i*7,INK) for i in range(5))
  +"".join('<rect x="%g" y="%g" width="7" height="3.6" fill="%s"/>'%(16+i*13, 28.4+((i*3)%5)*7, PINK if i%2 else INK) for i in range(6))
  +'<rect x="8" y="72" width="84" height="1.3" fill="%s"/>'%INK
  +T(50,84,"WRITE A SONG",8,INK,2.6)+'</g>',True)

add("07","u-mine","U MINE","sage",PINK,
  "The heart the pit drops when it decides to keep you alive.",
  '<g><circle cx="50" cy="50" r="34" fill="none" stroke="%s" stroke-width="1.4" opacity=".55"/>'%PINK
  +'<circle cx="50" cy="50" r="40" fill="none" stroke="%s" stroke-width="0.9" opacity=".3"/>'%PINK
  +heart(50,49,54,PINK)
  +'<path d="M34 36c4-4 9-5 13-3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>'
  +T(50,92,"U MINE",7.4,INK,4.2)+'</g>',True)

add("08","let-go","LET GO","black",ACID,
  "The faller, head-down, arms open. Nothing is holding on.",
  '<g>'+faller(50,49.4,1.20,ACID,PINK,1.15)
  +T(50,95,"LET GO",7,PINK,5)+'</g>',True)

add("09","between-the-lines","BETWEEN THE LINES","white",INK,
  "Two walls, one gap, and something small going through it.",
  '<g><path d="M10 4 L10 82 L26 82 L30 44 L26 4 Z" fill="%s"/>'%INK
  +'<path d="M90 4 L90 82 L74 82 L70 44 L74 4 Z" fill="%s"/>'%INK
  +"".join('<rect x="26" y="%g" width="4" height="2" fill="%s" opacity=".5"/>'%(9+i*9,PINK) for i in range(8))
  +"".join('<rect x="70" y="%g" width="4" height="2" fill="%s" opacity=".5"/>'%(13+i*9,PINK) for i in range(8))
  +faller(50,43.6,0.76,PINK,PINK,0.6)
  +T(50,95,"BETWEEN THE LINES",5.6,INK,2.4)+'</g>',True)

# --- PARIS --------------------------------------------------------------
add("10","satisfied","SATISFIED","clay",ACID,
  "The face from the capsule's second print, kept exactly as drawn.",
  '<g><path d="M50 8C27 8 9 26 9 49s18 41 41 41 41-18 41-41S73 8 50 8z" fill="none" stroke="%s" stroke-width="5" stroke-linecap="round"/>'%ACID
  +'<path d="M28 32l13 14M41 32L28 46" stroke="%s" stroke-width="5.5" stroke-linecap="round"/>'%ACID
  +'<path d="M59 32l13 14M72 32L59 46" stroke="%s" stroke-width="5.5" stroke-linecap="round"/>'%ACID
  +'<path d="M28 60c6 12 15 18 22 18s16-6 22-18" fill="none" stroke="%s" stroke-width="5.5" stroke-linecap="round"/>'%ACIDL
  +'</g>')

add("11","rockstar","ROCKSTAR","black",PINK,
  "The guitar the pit hands you when it wants you to go faster.",
  '<g><path d="M42 58c-9 0-16 7-16 15s7 15 16 15c7 0 12-4 14-9h10c2 5 7 9 14 9 9 0 16-7 16-15s-7-15-16-15c-7 0-12 4-14 9H56c-2-5-7-9-14-9z" fill="%s"/>'%PINK
  +'<circle cx="44" cy="73" r="6" fill="%s"/>'%INK
  +'<rect x="52" y="16" width="7" height="46" transform="rotate(18 55 40)" fill="%s"/>'%PINK
  +'<rect x="60" y="8" width="13" height="12" rx="2" transform="rotate(18 66 14)" fill="%s"/>'%ACID
  +T(50,96,"ROCKSTAR",7,ACID,4.4)+'</g>',True)

add("12","i-feel-alive","I FEEL ALIVE","black",ACID,
  "One heartbeat, read straight off the smile-meter.",
  '<g><polyline points="2,52 26,52 33,42 40,52 47,16 56,84 63,38 70,52 98,52" fill="none" stroke="%s" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'%ACID
  +heart(86,26,19,PINK)
  +'<rect x="10" y="72" width="80" height="1.2" fill="%s" opacity=".6"/>'%PINK
  +T(50,86,"I FEEL ALIVE",8.4,PINK,3.2)+'</g>',True)

add("13","mama-is-a-preacher","MAMA IS A PREACHER","sage",INK,
  "A voice with rays coming off it. The loudest room on the record.",
  '<g>'+"".join('<rect x="49.2" y="6" width="1.6" height="20" fill="%s" opacity=".85" transform="rotate(%g 50 44)"/>'%(INK,a) for a in range(-70,71,14))
  +'<circle cx="50" cy="44" r="13" fill="%s"/>'%INK
  +'<circle cx="50" cy="44" r="7" fill="none" stroke="%s" stroke-width="2"/>'%ACID
  +'<path d="M28 64h44v2.6H28zM34 70h32v2.6H34z" fill="%s"/>'%INK
  +T(50,88,"MAMA IS A PREACHER",5.2,INK,2.0)+'</g>',True)

add("14","pas-de-soucis","PAS DE SOUCIS","bone",PINK,
  "Three words, wet. The most French thing on the sleeve.",
  '<g>'+T(50,40,"PAS DE",15,PINK,1)+T(50,58,"SOUCIS",15,PINK,1)
  +drips(60,[20,30,40,50,60,70],PINK,6,26,23)
  +T(50,92,"NOUVEAUX PUNK 2",5,PINKD,3.4)+'</g>',True)

# --- THE STARS ----------------------------------------------------------
add("15","spoof","SPOOF","white",INK,
  "The advisory block off the bottom-left of the sleeve, blown up to chest size.",
  '<g><rect x="8" y="26" width="84" height="48" fill="%s"/>'%INK
  +'<rect x="12" y="30" width="76" height="40" fill="none" stroke="#fff" stroke-width="1.6"/>'
  +T(50,41.5,"PARENTAL",7,"#fff",1.9)+T(50,57,"SPOOF",16,"#fff",-0.2)
  +T(50,66.5,"NOUVEAUX PUNK 2",5.2,"#fff",0.9)+'</g>',True)

add("16","benda","BENDA","black",ACID,
  "The star the pit drops for five invincible seconds.",
  '<g>'+"".join('<rect x="49.4" y="4" width="1.2" height="14" fill="%s" opacity=".7" transform="rotate(%g 50 46)"/>'%(ACID,a) for a in range(0,360,30))
  +star(50,46,30,ACID)+star(50,46,13,PINK)
  +T(50,90,"BENDA",9,ACID,5)+'</g>',True)

add("17","buss-in-it","BUSS IN IT","black",BONE,
  "A field of stars and one of them going off.",
  '<g>'+"".join('<circle cx="%g" cy="%g" r="%g" fill="%s" opacity="%g"/>'
      %(8+((i*37)%84), 8+((i*53)%84), 0.7+((i*7)%3)*0.5, BONE, 0.35+((i*11)%5)*0.13) for i in range(46))
  +"".join('<rect x="49.5" y="18" width="1" height="12" fill="%s" transform="rotate(%g 50 50)"/>'%(PINK,a) for a in range(0,360,22))
  +star(50,50,17,PINK)+star(50,50,7,ACID)
  +T(50,92,"BUSS IN IT",7,BONE,4)+'</g>',True)

add("18","cigarette","CIGARETTE","clay",BONE,
  "Held, lit, not smoked. The ember is the only pink on the shirt.",
  '<g><rect x="14" y="56" width="58" height="10" rx="1" fill="%s"/>'%BONE
  +'<rect x="60" y="56" width="12" height="10" fill="%s" opacity=".55"/>'%INK
  +'<rect x="8" y="56" width="7" height="10" rx="1" fill="%s"/>'%PINK
  +'<circle cx="8" cy="61" r="3.4" fill="%s"/>'%ACID
  +'<path d="M20 52c8-8-6-12 2-20s-4-12 4-20" fill="none" stroke="%s" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>'%BONE
  +'<path d="M34 52c8-8-6-12 2-20" fill="none" stroke="%s" stroke-width="2" stroke-linecap="round" opacity=".5"/>'%BONE
  +T(50,84,"CIGARETTE",8,BONE,4)+'</g>',True)

add("19","da-shit","DA SHIT","red",ACID,
  "Slab type, dripping. Read it from across the room.",
  '<g><rect x="6" y="30" width="88" height="30" fill="%s"/>'%ACID
  +drips(60,[12,24,36,48,60,72,84],ACID,8,30,31)
  +T(50,53,"DA SHIT",19,"#7a0f0d",0.5)
  +'<rect x="6" y="30" width="88" height="4" fill="#fff" opacity=".45"/>'
  +T(50,90,"NOUVEAUX PUNK 2",5,ACID,3.2)+'</g>',True)

# --- THE VOID -----------------------------------------------------------
add("22","epic-film","EPIC FILM","black",BONE,
  "The viewfinder print from the capsule, re-timed to this track.",
  '<g><path d="M4 16V4h14M96 16V4H82M4 84v12h14M96 84v12H82" stroke="%s" stroke-width="6" fill="none"/>'%BONE
  +'<circle cx="24" cy="44" r="6.5" fill="%s"/>'%PINK
  +T(37,48,"REC",12,BONE,1.4,anchor="start")
  +T(50,66,"EPIC FILM",8,BONE,3.6,fam="Courier New,Courier,monospace")
  +T(50,76,"00:09:40",8,"#f7f6f2",0.4,fam="Courier New,Courier,monospace")
  +'<rect x="18" y="24" width="64" height="2" fill="#f7f6f2" opacity=".5"/></g>',True)

# --- THE CLIMB ----------------------------------------------------------
add("23","illegal-2","ILLEGAL 2","white",PINK,
  "Stencil, taped off. The 2 is the record's, not the track's.",
  '<g><rect x="6" y="24" width="88" height="52" fill="none" stroke="%s" stroke-width="3"/>'%PINK
  +"".join('<rect x="%g" y="21" width="9" height="6" fill="#fff"/>'%(12+i*16) for i in range(6))
  +"".join('<rect x="%g" y="73" width="9" height="6" fill="#fff"/>'%(12+i*16) for i in range(6))
  +T(50,52,"ILLEGAL",15,PINK,1)+T(50,68,"2",13,INK,0)
  +'</g>',True)

add("24","like-jimi-hendrix","LIKE JIMI HENDRIX","black",PINK,
  "A neck on fire. The tribute is in the flame, not the face.",
  '<g><path d="M50 2c9 22-16 29-16 49 0 9 6 16 14 19-4-10 1-18 9-22-2 13 13 17 13 31 0 13-10 23-20 23-18 0-31-14-31-34C19 42 41 31 50 2z" fill="%s"/>'%PINK
  +'<path d="M50 22c5 14-9 19-9 32 0 6 3 10 8 12-2-7 1-12 5-15-1 9 8 11 8 20 0 8-6 15-12 15-11 0-19-9-19-22 0-19 13-27 19-42z" fill="%s"/>'%ACID
  +'<rect x="72" y="18" width="6" height="52" transform="rotate(12 75 44)" fill="%s"/>'%BONE
  +"".join('<rect x="72" y="%g" width="6" height="1.2" transform="rotate(12 75 44)" fill="%s"/>'%(24+i*7,INK) for i in range(6))
  +T(50,92,"LIKE JIMI HENDRIX",5.8,ACID,2.6)+'</g>',True)

add("25","lonely-3","LONELY 3","natural",INK,
  "One figure, printed small on purpose, with the whole shirt left empty around it.",
  '<g>'+faller(50,49.6,0.62,INK,INK,0.9)
  +'<rect x="41" y="74" width="18" height="0.9" fill="%s" opacity=".7"/>'%PINK
  +T(50,83,"LONELY 3",4.6,INK,3.8)+'</g>',True)

add("26","no-name","NO NAME","black",PINK,
  "The ONLY IBEE band off the top of the sleeve, with the name struck out.",
  '<g>'+band(33,34,PINK,"ONLY IBEE",13,0.5,"#fff",PINKL)
  +'<rect x="14" y="48.5" width="72" height="2.6" fill="%s"/>'%INK
  +T(50,80,"NO NAME",7,ACID,5)+'</g>',True)

BLANKINK={"black":"#0b1719 (black)","bone":"#efece4 (bone)","natural":"#f2ecdd (natural)",
          "clay":"#8b5646 (clay)","sage":"#c2c1a6 (sage)","white":"#f2f0f1 (white)",
          "red":"#bd2c29 (red)"}
out=os.environ.get("NP2_PRINT_DIR","/tmp/np2build/prints")
for d in D:
    s=HDR.format(title=d["title"], note=d["note"], ink=d["ink"], blank=BLANKINK[d["blank"]],
                 fontwarn=FONTWARN if d["fonts"] else "", body=d["body"])
    open(os.path.join(out,"%s-%s.svg"%(d["no"],d["slug"])),"w").write(s)
import json
json.dump([{k:v for k,v in d.items() if k!="body"} for d in D],
          open(os.path.join(out,"manifest.json"),"w"),indent=1)
print("wrote",len(D),"prints")
