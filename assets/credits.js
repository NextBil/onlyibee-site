/* =====================================================================
   IBEE CREDITS — who else is on the record.

   WHY THIS IS ITS OWN FILE, and not a field on song-meta.js:
   the five IBEE STUDIO outputs (beat-data, lyrics-data, lyrics-timed,
   song-meta, songs-extra) are REGENERATED WHOLESALE every time the studio
   exports. Anything hand-written inside one of them survives exactly until
   the next export and then vanishes without a trace. Credits are typed by
   hand, so they live here, where the studio never writes.

   SHAPE
       window.IBEE_CREDITS = {
         "<slug>.mp3": [
           { n:"NAME", role:"WHAT THEY DID", ig:"https://instagram.com/handle" }
         ]
       }
   `role` and `ig` are both optional — a name on its own is a valid credit.
   Add a feature by adding a line. Nothing else needs touching.

   WHERE IT SHOWS
   song/index.html (the shared-record landing page) renders a FEATURING
   block from this. The link opens in a small popup window rather than
   navigating, so the record keeps playing — see openCredit() there.

   The display name of the track itself ("… ft. WENA JELLY") is separate:
   that lives in songs-extra.js, because it is what the radio, the player
   and every track list read. If you re-export songs-extra.js from the
   studio, rename the track IN the studio too or the "ft." is lost.
   ===================================================================== */
window.IBEE_CREDITS={
  "np-27-celui-qu-elle-veut.mp3":[
    {n:"WENA JELLY", role:"FEATURED VOCALS", ig:"https://www.instagram.com/wenajelly/"}
  ]
};
