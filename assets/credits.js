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
           { n:"NAME", role:"WHAT THEY DID",
             ig:"https://instagram.com/handle",
             img:"/assets/img/credits/handle.jpg" }
         ]
       }
   `role`, `ig` and `img` are all optional — a name alone is a valid credit.
   Add a feature by adding a line. Nothing else needs touching.

   ABOUT `img` — THEIR PICTURE
   Drop a square image in assets/img/credits/ and point `img` at it. With no
   `img` the avatar is the first letter of their name, and if the path is wrong
   it falls back to that letter too, so a typo can never leave a broken image.

   It MUST be a local file. An Instagram profile picture cannot be hotlinked:
   the cdninstagram URLs are signed and expire within days, and Instagram
   blocks fetching them from anywhere else. Save the picture, host it here.

   WHERE IT SHOWS
   song/index.html (the shared-record landing page) renders a FEATURING
   block from this. Tapping a credit opens a window ON that page holding their
   real Instagram, via instagram.com/<handle>/embed/ — the one Instagram URL
   that can be framed. Nothing navigates, so the record keeps playing. See
   openCredit() there.

   The display name of the track itself ("… ft. WENA JELLY") is separate:
   that lives in songs-extra.js, because it is what the radio, the player
   and every track list read. If you re-export songs-extra.js from the
   studio, rename the track IN the studio too or the "ft." is lost.
   ===================================================================== */
window.IBEE_CREDITS={
  "np-27-celui-qu-elle-veut.mp3":[
    {n:"WENA JELLY", role:"FEATURED VOCALS",
     ig:"https://www.instagram.com/wenajelly/",
     /* drop a square photo at this path and it replaces the "W" everywhere.
        Until the file exists the letter shows instead — nothing breaks. */
     img:"/assets/img/credits/wenajelly.jpg"}
  ]
};
