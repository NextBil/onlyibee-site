/* IBEE TRANSIT THEMES — custom city skins for the MIDNIGHT TRANSIT room.
   HOW IT WORKS
   - Keys: "album:<galaxyId>" themes a whole album · "song:<file.mp3>" themes one song
     (song beats album if both match). Galaxy ids: rss, mzs, np, pp, mv, ddlf, bip, vault
     (+ any new album id you created in IBEE STUDIO).
   - The theme fades in while a matching record plays, fades out after.
   - Every field is OPTIONAL and validated by the game — wrong/missing values fall
     back to safe defaults, so this file can never crash the room.
   - NOUVEAUX PUNK ("album:np") already has a built-in halloween-punk theme; add an
     "album:np" entry here only if you want to REPLACE it.
   - Full schema + an AI prompt template: tools/TRANSIT-THEME-GUIDE.md
   DEPLOY: upload this file to assets/ on GitHub (same as the IBEE STUDIO exports). */

window.IBEE_TRANSIT_THEMES = {

  /* DROP IT — pink city, hearts everywhere, "NAJWA U DA BEST" glowing in the sky */
  "song:drop-it.mp3": {
    name: "💗 NAJWA LINE",
    skyTop: "#2a0a1e",
    skyMid: "#521230",
    skyLow: "#8a2050",
    skyAlpha: 0.85,
    moonHue: 330,
    moonFace: "none",
    windowHue: 330,
    flyers: "hearts",
    lightning: false,
    fogAlpha: 0.03,
    fogHue: 320,
    roofSign: "bars",
    prop: "lantern",
    led: "💗 NAJWA U DA BEST  ⟶  NOW PLAYING: ",
    moteHue: 330,
    bgText: "NAJWA U DA BEST"
  },

  /* EXAMPLE — remove the wrapping slash-star comments to activate:
  "album:mzs": {
    name: "GOLDEN HOUR LINE",        // HUD title in the whole-train view (max 26 chars)
    skyTop: "#1a0e02",               // sky gradient — top (hex only, #rrggbb)
    skyMid: "#3a2004",               // sky gradient — middle
    skyLow: "#7a4a08",               // sky gradient — horizon
    skyAlpha: 0.75,                  // how hard the sky takes over (0–0.95)
    moonHue: 45,                     // moon colour hue 0–360 (45 = gold)
    moonFace: "crescent",            // "none" | "pumpkin" | "skull" | "crescent"
    windowHue: 45,                   // city window lights hue 0–360
    flyers: "birds",                 // "none" | "bats" | "ghosts" | "birds"
    lightning: false,                // thunder bolts on the heavy hits
    fogAlpha: 0.03,                  // ground fog 0 (off) – 0.12 (thick)
    fogHue: 40,                      // fog colour hue
    roofSign: "bars",                // rooftop neon: "bars" | "guitar"
    prop: "lantern",                 // station platform prop: "none" | "pumpkin" | "lantern"
    led: "✦ GOLDEN HOUR SERVICE  ⟶  NOW ARRIVING: ",   // LED sign prefix (max 70 chars)
    moteHue: 45                      // in-car magic motes hue · -1 = follow the song
  }
  */

};
