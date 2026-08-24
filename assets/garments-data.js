/* =====================================================================
   IBEE GARMENTS — the living-garment layer (window.IBEE_GARMENTS).

   The catalog (products-data.js) sells a piece once. THIS file is what the
   piece becomes after: a physical thing with a life. Who owns it now, how it
   has changed hands, and a PHOTOGRAPHED HISTORY of every yearly refresh.

   Buy it once. Wear it for years. We keep evolving it.

   Keyed by SERIAL — the garment's permanent identity, printed/chipped into the
   piece and never reused. `pid` points at the catalog entry in
   products-data.js for its name, rarity and origin imagery.

   Edited in tools/garment-manager.html -> EXPORT -> deploy to
   assets/garments-data.js. Loaded clock-stamped (?cb=) by garment/ and
   product-page/ — replacing the file goes live in ~1 min, no version bumps.

   entry: {
     pid:        catalog id in products-data.js (name / rarity / first images)
     serial:     permanent identity, shown as the piece's name (e.g. IBEE-0001)
     owner:      current owner handle (display only — no account needed)
     acquired:   ISO date it became theirs
     status:     "owned" | "resale" | "refresh"
                   resale  = listed to pass on, with its whole history
                   refresh = sent back, being evolved right now
     nextDue:    ISO date the next yearly refresh is due (optional; the page
                   also derives one from the last history date + 1 year)
     provenance: [{owner, from}]           ownership chain, oldest first
     history:    [{date, v, title, note, img}]  the refresh timeline, oldest
                   first. v1 is birth; every send-back adds the next version.
   }
   ===================================================================== */
window.IBEE_GARMENTS = {
  "v": 1,
  "garments": {
    "IBEE-0001": {
      "pid": "tee-np2-all-i-need",
      "serial": "IBEE-0001",
      "owner": "loïc",
      "acquired": "2026-08-01",
      "status": "owned",
      "nextDue": "2027-08-01",
      "provenance": [
        { "owner": "loïc", "from": "2026-08-01" }
      ],
      "history": [
        {
          "date": "2026-08-01",
          "v": "v1",
          "title": "PRESSED",
          "note": "Born in Paris. The Goli mask, 01/26 — printed a single time on heavyweight natural cotton and retired. This is where its history starts.",
          "img": "/assets/tees/np2/mockups/01-all-i-need.jpg"
        }
      ]
    }
  }
};
