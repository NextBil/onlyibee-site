/* =====================================================================
   IBEE NEWS — the notification feed (written in tools/newsroom.html).
   window.IBEE_NEWS = [ {id, t, icon, n, d, date, link}, … ]

     id    unique + stable string (the seen-ledger keys off it)
     t     type — decides WHERE the red dot lands (see badges.js TARGET):
             drop | merch | shop      → dot on SHOP
             video | channel | tv     → dot on TV
             song | galaxy | music    → dot on the galaxy button (radio bar)
             note | news | info | item | collection | badge → dot on PROFILE
     icon  an emoji shown on the toast + in the profile feed
     n     short title (e.g. "NEW DROP")
     d     one line of detail
     date  "YYYY-MM-DD" (or leave to ts); newest shows first
     link  optional — where tapping the notification goes (a site path)

   This file is clock-stamped (?cb=) where it's loaded, so replacing it
   goes live within ~1 min — no version bump. Edit it ONLY with the
   newsroom tool (it round-trips this exact array).
   ===================================================================== */
window.IBEE_NEWS = [
];
