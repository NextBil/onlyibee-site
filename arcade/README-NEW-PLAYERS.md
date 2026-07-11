# THE FOUR NEW MUSIC PLAYERS — install guide

Four new "crazy music player" apps now live in this folder. **Nothing in the existing
site was modified** — they are pure additions, waiting to be wired into the arcade hub.

| Folder | App | One-liner |
|---|---|---|
| `arcade/bedroom/` | **THE ICS LOFI BEDROOM** | A pixel bedroom that breathes with the record. Lava lamp drinks the bass (`low`), desk fan spins at the true `bpm`, Beebee bobs on real hits (`imp`), the CRT types the tap-synced karaoke, and the notebook/clock open the song's soul (`song-meta`). Idle = Beebee sleeps; tap the vinyl deck to wake the room. |
| `arcade/transit/` | **MIDNIGHT TRANSIT** | A lofi subway through a neon city painted in the song's `hue`. The rattle is the loudness (`lvl`), streetlights whip past strictly on `imp` hits, passengers change with the album (galaxy), and **the playlist is the subway line** — click any stop to ride to that song. Click a window for zen mode. Passengers sing the current lyric when tapped. |
| `arcade/terrarium/` | **SYNTH-BOTANICAL TERRARIUM** | A Tamagotchi greenhouse: one plant per record. The `vibe` decides the species (trap→cactus, soul→fern, lonely→willow…), plays (`ibee_sav` — the same counter that grows the planets) + minutes listened here feed the growth (10 stages → RADIANT), leaves photosynthesize the live groove, and clicking a plant releases spores carrying the song's real words. Hover/click opens a museum plaque with the full story. |
| `arcade/aqua/` | **AQUA BASS** | The subaquatic music world. The surface swells on the bass (`low`), fish cruise at the true `bpm` and dart on `imp` hits, the species come from the `vibe` (trap→razorfin sharks, ambient/lonely→jellyfish…), the water wears the song's `hue`, and lyric bubbles rise from the gravel to POP exactly on the tap-synced karaoke line. The **B MAJOR pet** at the center evolves Egg→Baby→Juvenile→Evolved→APEX (crown + gold B-chain) on the same plays that grow the planets + listening time (shared `ibee_garden` sunlight with the terrarium — feeding one feeds the other). Tap the glass for ripples + food pellets the fish chase, tap a fish for lore from the song's meaning, tap the chest for the time-to-create, and say hi to diver Beebee on his rock. |

## To put them on the site

1. Upload the four folders (`bedroom/`, `transit/`, `terrarium/`, `aqua/`) into `arcade/` and the
   four covers (`lofi-bedroom.png`, `midnight-transit.png`, `terrarium.png`, `aqua-bass.png`) into `arcade/covers/`.
   Note: `bedroom/` contains **two files** — `index.html` AND `beebee-sleeping.png` (the real
   vinyl-figure render used for the sleeping pose; copied from `arcade assests/beebee sleeping.png`).
2. Add these three lines to the `GAMES` array in `arcade/index.html` (search `var GAMES`):

```js
{name:"ICS LOFI BEDROOM",  by:"A room that breathes with the record",     cover:"covers/lofi-bedroom.png",     url:"bedroom/",   status:"live", isnew:true},
{name:"MIDNIGHT TRANSIT",  by:"Ride the neon city — the playlist is the line", cover:"covers/midnight-transit.png", url:"transit/",   status:"live", isnew:true},
{name:"SYNTH TERRARIUM",   by:"Your plays grow a botanical garden",       cover:"covers/terrarium.png",        url:"terrarium/", status:"live", isnew:true},
{name:"AQUA BASS",         by:"The record is water — raise your B MAJOR pet", cover:"covers/aqua-bass.png",    url:"aqua/",      status:"live", isnew:true},
```

That's it — no version bumps needed (they include `player.js?v=13` like every other page,
and load the data layers with the standard clock-stamped `?cb=` includes).

## How they fit the machine (for the README, §9)

- All three read the **site radio** through `window.IBEERADIO` (with the `window.top`
  fallback, so they work standalone AND inside the shell frame) — no second audio, ever.
- All three read the **pressed groove** (`IBEE_BEAT`: `low`/`lvl`/`imp`/`bpm`) at
  `audio.currentTime` — full reactivity on iPhone with zero Web Audio.
- Words come from `lyrics-timed.js` (karaoke) with graceful fallback to `lyrics-data.js`
  (spread) and then to placeholders; lore from `song-meta.js`. Missing layers never break anything.
- They are **visualizers, not games**: when the radio pauses they idle beautifully
  (Beebee sleeps / the train waits at the station / the garden dims) and any click that
  makes sense starts the radio. No music gate needed.
- New records from `songs-extra.js` appear automatically (the transit line and the
  terrarium enumerate the radio playlist; extra songs with a `g` galaxy id even bring
  their own passenger crew).
- The terrarium **reads** `ibee_sav.plays` (never writes it) and keeps its own listening
  credit in a new localStorage key **`ibee_garden`** (`{sun:{slug:seconds}}`, 75 s = +1 stage).
- Standard design system: `--acid/--red/--dim`, Press Start 2P + VT323, `body::before`
  scanlines + `body::after` vignette at z-index 9000/9001, interactive UI kept below 9000.
- Each page posts `ibee-frame-tap` to the shell on tap (closes the shell's track list),
  same as the other arcade games.
