/* ============================================================
   IBEE CHART DATA — the drum pattern for THE FALL, per record.

   window.IBEE_CHART = {
     "np2-04-drop-it.mp3": {
       bpm: 142,                       // optional, for reference only
       beats: [                        // MUST be in time order
         { t: 0.52, side: -1 },        // t = seconds into the song
         { t: 1.04, side:  1 },        // side = -1 left pad, 1 right pad
         { t: 1.55, side: -1 }
       ]
     }
   };

   WHAT THIS IS FOR
   THE FALL asks you to play the record's drums on two pads. With no entry
   here it falls back to the groove already pressed into the song
   (beat-data.js `imp` peaks, alternating hands) — playable on every track
   from day one, but generic. An entry here REPLACES that with the pattern
   you actually want for that song.

   HOW TO FILL IT
   Tap the pattern in IBEE STUDIO and export this file, the same way the
   other data files are made. Keyed by the song's filename, so it matches
   whatever the radio calls the record; the extension may be left off.

   Nothing else has to change. Drop the file in, push, done — it is
   clock-stamped where it loads, so it goes live within the minute with no
   version bump.

   Ships EMPTY on purpose: every record currently plays its pressed groove.
   ============================================================ */
window.IBEE_CHART = {};
