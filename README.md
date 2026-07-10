# ONLYIBEE OS — Developer Guide

This is the codebase for **onlyibee.com** — a retro video-game-console themed artist site for Only Ibee (music, UTOPIE clothing, LA ZONE, ICS characters). It is a **static site**: no build step, no framework, no dependencies. Every page is a self-contained HTML file with its CSS and JavaScript inline. It deploys on **GitHub Pages** from the `main` branch, with the custom domain set via the `CNAME` file.

**Architecture at a glance:** `index.html` is a thin **persistent app shell** — a fixed top nav, a bottom radio player, and a lyrics overlay wrapped around a single `<iframe id="frame">`. Every "section" of the site is a separate HTML file that loads *inside that frame*; the shell never reloads, so the radio (`assets/player.js`) plays continuously as you move around. The old monolithic console now lives in `console.html` and is just the first page the shell opens. If you remember this codebase as "everything is in `index.html`," that is no longer true — see §3.

Read this before touching anything. Each section says what a file does, how it works in plain language, and what will break if you change it carelessly.

---

## 0. The idea — what this site actually is

**ONLYIBEE is a music player disguised as a game console.** One radio plays the catalog; every page — games, lyrics, planets, the neon frame — *reacts to the song playing*. The goal: the most accurate way to transcribe music **visually**, streaming as a world instead of a list.

**The core inventions (and the challenges they solved):**

1. **One radio, many rooms.** The shell (`index.html`) owns the only audio player; pages load inside its frame, so music never stops when you move around. *Challenge solved:* every navigation used to restart the song.
2. **The pressed groove.** iPhones kill Web Audio when the screen locks — you can't have live audio analysis AND background playback. So every song is analyzed **once, offline**, and ships with its pulse pressed into data (`beat-data.js`): bass envelope (`low`), loudness (`lvl`), hit strength (`imp`), and tempo (`bpm`). The site reads the groove at the playhead — like a needle on vinyl. *Result:* true per-song reactivity everywhere, music survives the lock screen.
3. **Layers of the record.** Each song carries: its **groove** (beat-data), its **words** (lyrics-data plain / lyrics-timed karaoke) and its **soul** (song-meta: meaning, context, vibe, time-to-create). Games and pages read whichever layers they need.
4. **The pressing plant.** `tools/studio.html` (IBEE STUDIO) is a local app where all these layers are made — analyze a song with genre knobs, tap-sync lyrics DistroKid-style, write the song's story — then export the exact files to upload. No coding needed to feed the machine.

**How we build:** no framework, no build step, one HTML file per page, data as tiny `.js` files in `assets/`. Anything can be edited in a text editor and deployed by uploading one file. Every "system" degrades gracefully — if a data layer is missing, there's always a fallback (synthetic pulse, spread lyrics, placeholder text).

**⚠ Discipline: after every big change, update this README.** It must keep the essence of the app — what exists, why it exists, what almost broke. If you (or an AI) change the architecture and don't write it down here, the next session flies blind.

---

## 1. Map of the repository

| Path | What it is |
|---|---|
| `index.html` | **The app shell.** Top section-nav, bottom radio player, lyrics overlay, and one `<iframe>` that every section loads into. Loads `assets/player.js` + `assets/lyrics-data.js`, then opens `console.html` (or the `?p=` deep-link) in the frame. Small — most of the site's weight is in the pages it hosts. See §3. |
| `console.html` | **The console** (formerly `index.html`): boot screen, main menu, and the screens Music Universe, UTOPIE, LA ZONE, ICS, Shop, About. The biggest file. Loaded inside the shell frame. See §4. |
| `assets/player.js` | The site-wide radio player + neon reactive frame. Included by **every** HTML file (21 of them), but the *authoritative* instance is the one the shell loads — it owns the audio while you navigate. |
| `assets/lyrics-data.js` | `window.IBEE_LYRICS` — a map of `"filename.mp3" → [plain line, …]` for the shell's lyrics overlay and the rhythm arcade games. **Not the same data as `lyrics/index.html`** (that one is timestamped; this one is plain text). See §6. |
| `assets/beat-data.js` | `window.IBEE_BEAT` — **the groove pressed into each record**: per song `low` (bass envelope), `lvl` (loudness), `imp` (**impulse — hit strength; the games spawn on it**), and `bpm` (20 samples/sec, base36). On iOS (where the live analyser can't run without killing background playback) all visuals read this at `audio.currentTime` — true per-song reactivity with zero Web Audio. Self-loaded by `player.js` (clock-stamped `?cb=` — just replace the file, no version bump); press grooves in **IBEE STUDIO** or regenerate all with `tools/make-beat-data.py`. |
| `assets/song-meta.js` | `window.IBEE_META` — **the record's soul**: per song `{vibe, meaning, context, took}`. Written in IBEE STUDIO's INFO tab; shown on the lyrics overlay's INFO side. |
| `assets/lyrics-timed.js` | `window.IBEE_LYRICS_TIMED` — karaoke-synced lyrics (`{t,w}` lines) consumed by **the shell's lyrics overlay** (line highlight + tap-to-seek use real timestamps when present) and `lyrics/index.html`. Exported from IBEE STUDIO's tap-sync. |
| `assets/songs-extra.js` | `window.IBEE_SONGS_EXTRA` — **new records joining the site with zero code edits**: `{songs:[{f,r,n,hue,g,len}], galaxies:[{id,name,sub,hue}]}`. `player.js` appends the songs to the radio (self-loaded, clock-stamped); `console.html` gives each a planet and each new album a galaxy. **Additive + deduped by filename** — built-in songs always win, so this file can only ever ADD; if it's missing the site is exactly as before. Exported from IBEE STUDIO's RADIO & UNIVERSE card (INFO tab). |
| `tools/studio.html` | **IBEE STUDIO — the pressing plant.** Local-only (not deployed). Four tabs: **GROOVE** (drop an mp3 → press with genre/vibe knobs → live preview with the site's exact beat math), **LYRICS** (tap-sync DistroKid-style), **INFO** (vibe / meaning / context / time-to-create + **BPM override** + the **RADIO & UNIVERSE card**: ON THE RADIO toggle, COLOR, ALBUM/galaxy incl. founding new albums), **EXPORT** (per-record file list + download deploy-ready `songs-extra.js` / `beat-data.js` / `lyrics-data.js` / `lyrics-timed.js` / `song-meta.js`). Edits persist in the browser until exported. |
| `tools/make-beat-data.py` | Batch generator for `beat-data.js` (uses macOS's built-in `afconvert` + python3, no installs). Same algorithm as the studio; handy for re-pressing everything at once. Not part of the deployed site. |
| `assets/img/` | Logos, album covers, shop image, ICS full-set render. |
| `assets/audio/20mzs.mp3` | The 20MZS track (streaming quality). `20mzs-raw.mp3` is the higher-quality Vault version. |
| `assets/audio/songs/` | The "Rare Soul sessions" mp3s (tidy filenames). Copies may also exist at the repo root — the code finds either. |
| `assets/cert/` | The character animation videos (mp4, 720×720). |
| `assets/chess/` | The character chess-piece cutouts (transparent PNGs, 512px tall). |
| `chess/index.html` | ICS Chess — full chess game with the characters as pieces. See §5. |
| `lyrics/index.html` | The Lyrics Engine — karaoke-style timed lines + song stories. See §6. |
| `arcade/` | The **arcade hub** (`arcade/index.html`) plus the beat-runner games in `arcade/runner/` (BEEBEE CITY), `arcade/rush/` (RUN, MIMI), and `arcade/tiles/` (MIMI MUSIC TILES). Covers live in `arcade/covers/`. See §9. |
| `auth/index.html` | The **access terminal** — the landing/registry for authenticated NFC tags; shows the owner's collection + a site directory and can flip the console's Vault flag. See §10. |
| `product-page/utopie-hoodie/index.html` | A self-hosted product page (replaces the old Wix hotlink for that item). |
| `tv/index.html` | **IBEE TV** — a retro CRT set that broadcasts the "ibee tv" YouTube playlist: CH ▲/▼ with static between channels, a programming dial of all videos. The `CHANNELS` array at the top of its script is the whole grid — one line per video. Tuning in pauses the radio. See §11. |
| `utopie/index.html` | UTOPIE world page (manifesto + spinning object vault). |
| `nouveauxpunk/index.html` | Nouveaux Punk album page (encrypted tracks + sealed surprises). |
| `mimi/ goli/ swordy/ sworda/ beebee/ nannan/ ablah/` | 7 NFC certification pages, one per character. Each is one `index.html`. |
| `CNAME` | Contains `onlyibee.com`. **Never delete** — deleting disconnects the domain. Lives in the deployed repo. |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll processing. Keep it. |

URL model: GitHub Pages serves `folder/index.html` at `/folder/`. So `beebee/index.html` = `onlyibee.com/beebee`, and `arcade/runner/index.html` = `onlyibee.com/arcade/runner/`. NFC tags on clothing point to these URLs. The **repo root `index.html` is the shell**, so `onlyibee.com/` boots the shell, which then loads `console.html` into its frame.

---

## 2. Design system (shared by every page)

All pages use the same visual language, defined as CSS variables at the top of each file:

- `--bg #070707` page black · `--panel #0e0e0e` card black · `--border #2a2a2a` grey borders
- `--acid #b6ff00` the signature green · `--red #ff2b2b` the signature red · `--dim #7a7a7a` muted text
- `--px` = *Press Start 2P* (pixel font, headings/buttons) · `--vt` = *VT323* (terminal font, body text)

Two fixed overlays create the CRT effect on every page: `body::before` draws scanlines, `body::after` draws the dark vignette. They are `pointer-events:none` at z-index 9000/9001 — keep interactive UI **below** z-index 9000.

The "3D spinning object" trick used everywhere: a wrapper with `perspective`, an inner element with `transform-style:preserve-3d` and an infinite `rotateY` keyframe animation. For fake-voxel depth (menu vinyl/tee/cartridge, NP guitars), the same image is stacked 6 times at different `translateZ` offsets, back copies darkened. **Gotcha:** the spinning element must not be `display:inline` — inline elements ignore transforms (this bug happened once already).

---

## 3. The shell (`index.html`) and the console (`console.html`)

### 3.0 The app shell — `index.html`
`index.html` is the persistent frame around the whole site. It renders three fixed pieces and one hole:

- **Top nav** (`#nav`) — buttons built from the `NAV` array: `CONSOLE → console.html#menu`, `UNIVERSE → console.html#playing`, `ARCADE → arcade/`, `TV → tv/`, `ICS → console.html#ics`, `SHOP → console.html#shop`. (LYRICS left the nav — the spinning book in the player opens the overlay.)
- **The frame** (`#frame`) — every section loads here. `navigate(url)` swaps `frame.src`, *except* when only the hash changes on the page already loaded, in which case it sets `frame.contentWindow.location.hash` so the page switches screens **without reloading** (no music blip). There's a fade via the `.on` class on load.
- **Bottom player** (`#player`) — the site-wide radio's UI (title, seek, transport, the **aleatory ⤨ toggle** — shuffle mode, persisted in `ibee_radio.s` — and spinning LYRICS/UNIVERSE shortcuts), redrawn by the shell. `player.js`'s own chip/panel are hidden with CSS; the shell **keeps `#nf`** (the neon frame glow) — don't hide that.
- **Lyrics overlay** (`#lyr`) — opens straight into a black room over the frame. Lines are **tappable — jump to that moment** (real timestamps when the song is tap-synced in `lyrics-timed.js`, even spread otherwise). The spinning vinyl in the center bar flips to the **INFO side**: meaning, context, vibe chips, time-to-create (from `song-meta.js`) + BPM (from `beat-data.js`).

Things the shell guarantees, and that you must not break:

- **No autoplay.** An inline script clears the "was playing" flag in `ibee_radio` *before* the radio boots, and PRESS START only dismisses the overlay — music starts only on a real user action.
- **Deep links via `?p=`.** The first frame page comes from `?p=` (used by NFC/links) or defaults to `console.html#menu`; external URLs in `?p=` are rejected. `sync()` writes the current frame location back into `?p=` and mirrors the frame's `<title>`.
- **Frame-bust guard.** If the shell ever loads *inside* a frame, it redirects to `console.html`.
- **One heartbeat.** A single 350 ms `setInterval` drives the player title/time/seek/beat dot and the lyrics sync. Everything reads the one radio via `window.IBEERADIO` (§4).
- **Load order matters:** clear-flag script → `player.js` → `lyrics-data.js` → shell logic. Keep it.

### 3.1 The console — `console.html`
The console is one page, several "screens" (`<section class="screen">`): `menu`, `music` (the Music Universe), `utopie`, `lazone`, `ics`, `shop`, `about`. Only one screen has the `.on` class at a time; `go(id)` switches them — client-side show/hide, no framework routing. It runs inside the shell frame but is also a valid standalone page.

**Hash routing (how the shell's nav drives it):** on load and on `hashchange`, `console.html` reads `location.hash` and calls `go(screen)` for any matching screen id, so the shell's top nav can switch screens in place. Two aliases map to the Music Universe: `#playing` and `#nowplaying` both open the `music` screen and jump straight into the live "planets" room (`ENG.enterPlaying()`). `#tag=…` is read here too (Vault unlock, §3.5).

**Boot sequence.** Fake loading bar with random increments → "PRESS START" → click/Enter reveals `#os`. **Skip hook:** arriving with a screen hash such as `#menu` (e.g. the shell opening `console.html#menu`, or a sub-page's HOME button) bypasses boot entirely. The check sits at the very end of the console script.

### 3.2 Main menu
`#menulist` items carry `data-go="sectionId"`. A global click handler on `[data-go]` elements drives all navigation (also used by BACK buttons). Keyboard arrows/Enter work too. Each item has a `.mico` spinning icon; the MUSIC ENGINE item gets the `.playingnow` class (pulsing green) while the universe's audio plays — wired to the engine `audio` element's play/pause events.

### 3.3 The Music Universe (`ENG` module, inside the same `<script>`)
A canvas "engine" where **galaxies = releases** and **planets = songs**, drawn as spinning vinyl discs.

Key data at the top of the module:
- `GALX` — array of galaxies `{id,name,sub,hue,hidden}`. The `vault` galaxy has `hidden:true` and only appears after unlock.
- `TRACKS` — array of songs `{id, g:galaxyId, name, file, alt, len, hue, cover, locked}`. `locked:true` renders a dashed "?" planet that refuses to play. **`alt` is a fallback path** — if `file` 404s, the audio element's `onerror` swaps in `alt` (this is how songs load whether they live in `assets/audio/songs/` or at the repo root).

To **add a real song**: the no-code way is IBEE STUDIO's RADIO & UNIVERSE card → export `songs-extra.js` (see §13) — new songs/albums are merged into `TRACKS`/`GALX` at load (additive, deduped by filename slug). Hand-editing still works: drop the mp3 in `assets/audio/songs/`, add a `TRACKS` entry with its galaxy id, remove `locked`. To **add a galaxy** by hand: add to `GALX`.

Mechanics worth knowing:
- Planets wander with per-planet personality values; when a track plays, the performer floats to center and the rest **orbit** it (`assignOrbits`), pulsing to real audio analysis (`updateAudio` computes `audioBeat`/`audioLevel` from a WebAudio analyser).
- **Grid mode:** tapping empty void space toggles `gridMode` — planets ease into a grid (`gridSlot`) — tap again to free them.
- **Ghost performer:** if the site-wide radio is playing one of these songs, the engine shows that planet performing (variable `ghost`) driven by the *radio's* beat — visuals only, no second audio.
- **On-air galaxy:** in the galaxy picker, the galaxy holding the playing record glows to the song — beat-driven halo, pulse ring, faster spin, colored "▶ ON AIR" label (`drawGalaxies` reads the engine's `audioBeat` or the radio's `beat()`). The music screen's top bar has MENU + **GALAXIES** buttons (the old lyrics-page link is gone; `#topgal` → `exitToGalaxies`).
- **Playbar** (`#pbar`): tapping the song info (`#pbi`) opens the track list (`#pblist`); tapping outside the bar hides it and shows the pulsing `#pbmini` chip (music continues); `#pblyr` is now the **GALAXIES** button (planet icon → `exitToGalaxies()`; it used to link to the lyrics page). `updEngback()` keeps the GALAXIES back-button above the bar.
- **Plays persistence:** each play increments `SAV.plays[trackId]` in localStorage key **`ibee_sav`**; planets grow with plays (max 10).

### 3.4 Hidden mechanics (do not expose these in UI)
`unlockVault(msg)` reveals the Vault galaxy and saves the flag in `ibee_sav`. Three triggers: the **Konami code** (↑↑↓↓←→←→BA, listener on `document`), a **URL parameter** `?tag=ANYTHING` (this is the NFC-tag hook — garments link to `onlyibee.com/?tag=XXX`), and 7 rapid taps on the header brand showing a hint. A one-time hint toast fires after 3 plays of 20MZS.

### 3.5 Shop
**Currently marked TEMPORARILY CLOSED** — a red blinking banner at the top of the screen (inline-styled div under `.scrsub`) announces creative research; remove that div when the shop reopens. The inventory grid is **rendered by JavaScript** from the `SHOP` array (search for `SHOP=[`). Each item: `{n:name, p:price, r:rarity(c/sr/sdr/leg), u:productPageSlug, i:imageURL, out:1 if sold out}`. Images currently **hotlink to Wix** (`static.wixstatic.com`) and items link to the old Wix store for checkout. To add/edit products, edit that array only — the HTML is generated. Rarity affects border color/glow via classes `.r-c .r-sr .r-sdr .r-leg`.

### 3.6 Media session & radio handoff
The engine registers lock-screen metadata (MediaSession) when playing, resumes its AudioContext on `visibilitychange`, and **coordinates with the radio** through `window.IBEERADIO` (see §4): when a planet plays a song the radio knows, the radio "adopts" it (same track, same position — continuity across pages).

---

## 4. `assets/player.js` — the radio (loaded on every page)

Self-contained IIFE. It injects its own CSS and DOM: the neon frame (`#nf` + four `.nfc` corner glows), the RADIO chip, the panel with playlist/seek/controls, and a hidden `<audio>` element.

**Where it actually runs:** it's included by every HTML file, but the copy that matters is the one loaded by the **shell** (`index.html`) — because sections load in the shell's frame, that shell instance owns the audio and keeps playing across navigation. The shell hides player.js's own chip/panel (`#radiochip`/`#radiopanel`) and draws its own bars, but keeps `#nf`. Pages opened standalone (or the console's own instance) still work; state is shared through the `ibee_radio` localStorage key so playback position survives.

- `SONGS` array: `{f: tidy filename, r: original root filename, n: display name, hue}`. Loading tries `assets/audio/songs/f` → `f` at site root → `r` at site root (audio `onerror` chain).
- **State persistence:** localStorage key **`ibee_radio`** `{i: song index, t: seconds, p: was playing}` saved every 2s. On page load it restores and tries to resume (browsers may require one tap — a one-time `pointerdown` listener handles that).
- **Neon frame:** a rAF loop reads a WebAudio analyser → `beat`/`level` → paints the frame border + corner glows in the song's hue, and sets CSS vars `--beat`, `--songhue`, `--ga` on `<html>` (the lyrics page and anything else can read `--beat`).
- **Politeness:** a capture-phase `play` listener pauses the radio if any other media on the page starts, and the radio pauses everything else when it starts.
- **MediaSession** gives lock-screen controls; `wake()` resumes the AudioContext when the tab returns.
- **Panel UX:** clicking outside the panel closes it (music continues). The ✎ book button goes to `/lyrics/`.

### The bridge: `window.IBEERADIO`
Public API used by the universe engine and the lyrics page. **Do not rename these methods** — three files depend on them:
`audio` (the element), `playing()`, `beat()`, `level()`, `slug()`, `indexBySlug(s)`, `adopt(i,t)` (point the radio at a song/time without playing — used for engine→radio handoff), `setPending(t)`, `current()`, `count`, `song(i)`, and `control.{play(i),pause(),next(),prev()}`.

### Cache busting
**The five data files auto-refresh — never version them.** The IBEE STUDIO outputs (`beat-data.js`, `lyrics-data.js`, `lyrics-timed.js`, `song-meta.js`, `songs-extra.js`) are loaded with a clock-stamp `?cb=<Date.now()>`, so replacing a file and pushing goes live within ~1 min with **no `?v=` editing at all**. `beat-data.js` and `songs-extra.js` are clock-stamped in self-loaders inside `player.js` (songs-extra is also loaded by `console.html` for the universe); the others are clock-stamped via inline `document.write` where they're included (`index.html`, `lyrics/index.html`, and the three `arcade/*/index.html` games) — the `document.write` keeps them synchronous and in load order (the shell logic reads their globals right after). The old `?v=N` on these was retired 2026-07-10.

**`player.js` itself is still manually versioned** — every page includes it as `player.js?v=N` (currently `v=13`). **If you change player.js's *code*, bump `?v=` in every HTML file** — a repo-wide find-and-replace `player.js?v=13` → `?v=14`. There are **21** such files today (shell, console, lyrics, chess, TV, the arcade hub + its games, auth, product page, and the 7 character pages); `grep -rl 'player.js' --include='*.html' .` lists them all. Miss one and browsers/GitHub's CDN keep serving the old file. This bump is rare now — it's only for player.js logic changes, never for song-data updates.

---

## 5. `chess/index.html` — ICS Chess

Three layers in one file:

1. **Chess engine** (plain JS, no library): board is an 8×8 array of `{t:type,c:color}`. `pseudo()` generates raw moves per piece, `legalMoves()` filters out self-checks, `applyMove()` returns a new state (handles castling, en passant, promotion). Don't "simplify" `attacked()` — every branch matters for check detection.
2. **AI**: minimax with alpha-beta (`search`), material + centralization eval. `level` 1–3 sets search depth (LV1 also plays a random move 35% of the time). CPU always plays red/black.
3. **FIGHT FX** (`FX` module at the bottom): all the arcade juice. `FX.move` = slide + dust + blip; `FX.capture` = flash, shake, sparks, "POW!" text, and for Queen/Rook captures a full-screen `koClash` overlay (attacker lunges, victim flies off, "K.O.!"); `FX.mate` = the win sequence. Sounds are synthesized square waves/noise (`osc`/`noise`) — there are no sound files. Piece art paths live in the `ART` map; visual side colors are the `.base.w/.b` glow discs (green vs red).

The board grid **must** keep `grid-template-rows:repeat(8,1fr)` and the square `img` positioned `absolute` — that's what guarantees 64 identical tiles regardless of image sizes.

---

## 6. Lyrics — two separate systems

There are **two** lyrics stores, and they are not the same thing:

1. **`assets/lyrics-data.js`** (`window.IBEE_LYRICS`) — a map of `"filename.mp3" → ["line", "line", …]`, **plain text, no timestamps**. This feeds the **shell's lyrics overlay** (the LYRICS button / book icon) and the rhythm arcade games. The overlay has no per-line timing, so it spreads the lines evenly across the song's duration and highlights the current one. To add words for a song here, add an entry keyed by its mp3 filename.
2. **`assets/lyrics-timed.js`** (`window.IBEE_LYRICS_TIMED`) — `"filename.mp3": [{t: seconds, w: "line"}, …]`, **timestamped** for true karaoke sync on the Lyrics Engine page. Tap-synced and exported from IBEE STUDIO (`tools/studio.html`). `lyrics/index.html` reads this file (its inline `LYRICS` map still exists and overrides per-song if ever needed). Editing this does *not* change the shell overlay, and vice-versa; if you want both, update both (the studio saves/exports both).

### 6.1 `lyrics/index.html` — the Lyrics Engine page
Drives the **radio's** audio through `window.IBEERADIO` — it has no audio element of its own, which is why playback continues seamlessly from other pages.

- `LORE` map: per-song `{mood, story}` shown in the MEANING & PROCESS card. Edit freely — it's just text.
- `LYRICS` map: **this is where real lyrics go.** Format: `"filename.mp3": [{t: seconds, w: "line"}, …]`. Any song present here gets true synced lines; songs absent fall back to a generated structure guide (INTRO/VERSE/HOOK markers spread across the duration, interleaved with placeholder "transmission" lines from the `GHOST` pool).
- Clicking a line seeks the audio to its timestamp. The active line scales with the live `--beat` CSS var. The floating background glyphs are drawn on a fixed canvas.
- `▼ BG` adds class `mini` to `<body>` (ambient mode: only title + lines); the `▲` chip removes it. `⌂` goes to `../#menu` (boot-skip).

---

## 7. Certification pages (`/beebee`, `/mimi`, …)

Seven near-identical single files, generated from one template. Each: autoplaying looped muted video from `assets/cert/<name>.mp4` (Beebee randomly picks between two videos — see the `vids` array in its script), rarity-colored frame (`--rc` variable), a fake scan sequence that flips to "✓ VERIFIED — AUTHENTIC" after 2.2s, and two buttons: ENTER THE CONSOLE (`../?tag=NAME` — which also unlocks the Vault) and PLAY ICS CHESS. If you edit one, edit all seven the same way (or regenerate them with a script).

Video files are H.264 mp4, padded to 720×720 — browsers cannot play the original HEVC `.mov` files, so always convert new animations (`ffmpeg -i in.mov -vf "scale=720:720:force_original_aspect_ratio=decrease,pad=720:720:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an out.mp4`).

---

## 8. `utopie/` and `nouveauxpunk/` — world pages

Both are content pages built from the same ingredients: hero with spinning 3D object(s), manifesto/about prose, and a grid of "slots" — unlocked ones show a spinning artifact, locked ones show a blacked-out silhouette + blinking "?" + `UNLOCK SOON/SEALED` chip. **To unlock a slot later:** remove the `locked` class (utopie) or replace the slot's contents (np) — the CSS does the rest. The NP page also has: a scrolling marquee, an encrypted track list (pure decoration, generated in JS), and an easter egg — 5 taps on the album cover reveal the Konami fragment.

The pixel guitars on the NP page are inline SVG data-URIs (`V` and `S` constants) stacked into 3D by the `stack()` helper — edit the SVG strings to change the artwork.

---

## 9. `arcade/` — the arcade

`arcade/index.html` is the **hub**: it renders a grid of game cards from a `GAMES` array (search `var GAMES`). Each entry is `{name, by, cover, url, status:"live"|"soon", isnew?:true}`. `live` games render as `<a href>` cards; `soon` games render as dead `.soon` boxes; `isnew` adds a NEW ribbon. Covers are in `arcade/covers/`. To add a game: drop its folder under `arcade/`, drop a cover in `arcade/covers/`, add one `GAMES` entry.

The games themselves are self-contained pages, each in its own folder:

- `arcade/runner/` — **BEEBEE CITY** (a beat-runner; Beebee runs the punk city to the music).
- `arcade/rush/` — **RUN, MIMI** (neon-highway dash on the beat).
- `arcade/tiles/` — **MIMI MUSIC TILES** (tap lyric tiles on the beat; reads `assets/lyrics-data.js`).

All three include `player.js` (so the radio persists) and the rhythm games pull words from `lyrics-data.js`. The hub's HOME/BACK links point at `../#menu`, which the shell/console boot-skip understands.

**Beat timing (three layers, best available wins):** ① the **impulse layer** — `impOn()`/`impOnset()` read `beat-data.js`'s `imp` string at the playhead and fire on real hits (all three games); ② radio-beat crossings; ③ a metronome locked to the song's `bpm` (`songIV()`). **Music-on-start:** every game starts/resumes the radio when you hit start, so you always play inside the currently-playing record — its words drift through the game, its hits drive the spawns. (Beebee's old lyrics-page link was removed.)

## 10. `auth/` — the access terminal, and product pages

`auth/index.html` is the landing page for **authenticated NFC tags** (the `ACCESS TERMINAL`). It holds a registry of tag codes; a valid tag reveals a "GRANTED" card with the owner's 3D character collection (chess-piece art) and a **site directory** linking every app/section. Some tags carry `vault:true` — those also flip the console's Vault flag by writing `vault:true` into the shared **`ibee_sav`** localStorage key, so unlocking here unlocks the Vault in the console too. It saves its own record under its own localStorage key. Like the character pages, treat the tag codes as a physical contract (§12, the NFC note).

`product-page/utopie-hoodie/index.html` is a **self-hosted product page** — the beginning of moving checkout off the old Wix hotlinks. The Shop grid in the console (`SHOP` array, §3.5) can point an item's `u` slug at pages like this instead of Wix.

## 11. `tv/` — IBEE TV

A retro CRT television (`IBEETRON 2000`) that broadcasts the **"ibee tv" YouTube playlist** (`youtube.com/playlist?list=PLeMZDG5P8Kko`) — 14 channels, ALL I SEE through DANS LA STREET. The `CHANNELS` array at the top of the script mirrors the playlist: `{id: youtubeVideoId, t: "TITLE"}` — **to add a new video, add it to the playlist on YouTube AND add one line here** (get the id from the video URL). Autoplay is double-armed: `autoplay=1` on the embed plus a `playVideo` command posted to the player once it loads (nested-iframe browsers sometimes ignore the param). CH ▲/▼ zap through channels with a static-noise burst and a green channel OSD; the dial below the set jumps straight to any channel. The set boots to static — nothing autoplays until the viewer tunes in (that first click is also the autoplay-permission gesture). Tuning in **pauses the site radio** (one soundtrack at a time — YouTube's iframe is invisible to player.js's politeness listener, so the TV pauses the radio itself in `tune()`). Embeds use `youtube-nocookie.com`.

## 12. Things that will bite you if you don't know

1. **`CNAME` and `.nojekyll` must stay** at the repo root. Removing CNAME kills the custom domain; a re-upload of the whole folder that omits them has the same effect.
2. **`index.html` files are position-sensitive.** The **repo-root `index.html` is the shell** — the whole site's frame. Uploading any folder's `index.html` (a character page, a game) to the repo root will *replace the shell and break the homepage* (this has happened). Always upload from inside the destination folder on GitHub.
3. **The shell/console split.** Section data moved out of the root file: `TRACKS`, `GALX`, `SHOP`, the boot sequence, and all the screens live in **`console.html`**, not `index.html`. The root `index.html` is only the nav + player + frame. Edit the right file — a "change the shop"/"add a song planet" task is a `console.html` edit.
4. **GitHub's 25MB web-upload limit.** Files over 25MB (`Only Ibee - 20MZS.mp3`, 48MB) cannot go through the browser uploader and will silently block the whole batch. The site doesn't need that file — `assets/audio/20mzs-raw.mp3` (under the limit) is the Vault version.
5. **Cache:** GitHub Pages caches ~10 min; browsers cache aggressively. The four data files dodge this automatically — they're clock-stamped (`?cb=`), so a replaced file goes live within ~1 min with no version bump (§4). `player.js` still uses manual `?v=` versioning, so editing *its code* means bumping `?v=` in **all 21** HTML files (§4). When testing any change, hard-refresh or use a private window before assuming something is broken.
6. **localStorage keys:** `ibee_sav` (universe plays + vault unlock + hint flag) and `ibee_radio` (radio state). Changing their shape breaks returning visitors' saves — migrate, don't rename. The `auth/` terminal also writes `ibee_sav.vault`.
7. **Audio fallbacks are load-bearing.** Both players try multiple file locations on purpose (songs exist in two places in the repo). Don't remove the `onerror` chains.
8. **Autoplay policies:** browsers block un-tapped audio. All resume paths already `catch()` rejections and arm a one-tap fallback — keep that pattern for anything new that plays sound. The shell deliberately clears the "was playing" flag on load so music never auto-starts (§3.0).
9. **The `?tag=`, `?p=`, and folder routes are contracts.** Physical clothing tags are burned with URLs like `onlyibee.com/?tag=UTOPIE01` and `onlyibee.com/beebee`; NFC/deep links also use the shell's `?p=<page>` form. Never change these routes or parameter names without re-writing the physical tags.
10. **Z-index bands:** page content < 100, playbars/chips ~8990–9500, CRT overlays 9000–9001 (non-interactive). Keep new UI out of the 9000+ band unless it's decorative.
11. **No build step is a feature.** Everything is editable with a text editor and deployable by uploading one file. Please keep it dependency-free — no npm, no bundlers, fonts are the only external resource (Google Fonts) plus Wix-hosted shop images.

---

## 13. Quick recipes

- **Add a NEW song — the no-code way (since 2026-07-10):** upload the mp3 (repo root or `assets/audio/songs/`, tidy-slug name preferred) → open `tools/studio.html` → drop the mp3 (GROOVE tab; PRESS + SAVE its groove) → INFO tab → **RADIO & UNIVERSE card**: check ON THE RADIO, pick COLOR + ALBUM (or + NEW to found an album) → SAVE → EXPORT `songs-extra.js` (+ `beat-data.js` for the groove) → upload both to `assets/`. The song is on the radio everywhere AND has a planet. No code edits, no version bumps. (`player.js`'s built-in `SONGS` and `console.html`'s `TRACKS` stay the hand-written core; songs-extra rides on top, deduped by filename.)
- **Regenerate the beat grooves** (after replacing/remastering a song file): `python3 tools/make-beat-data.py` → upload `assets/beat-data.js`. That's it — it auto-refreshes (`?cb=`), no version bump.
- **Add karaoke (timed) lyrics:** open `tools/studio.html` → LYRICS tab → paste lines → tap-sync while the song plays → EXPORT → upload `assets/lyrics-timed.js` (auto-refreshes, no bump). Powers the shell overlay's exact line-sync + tap-to-seek AND the Lyrics Engine page.
- **Write a song's story (meaning/context/vibe/time-to-create):** studio → INFO tab → fill the fields → SAVE → EXPORT `song-meta.js` → upload to `assets/` (auto-refreshes, no bump). Shows on the lyrics overlay's INFO side.
- **Fix a wrong auto-BPM:** studio → INFO tab → BPM OVERRIDE → SAVE → re-export `beat-data.js` (override wins over the machine's guess).
- **Add a TV channel:** one `{id:"youtubeId", t:"TITLE"}` line in the `CHANNELS` array in `tv/index.html`.
- **Add overlay / rhythm-game lyrics:** add a `"filename.mp3": ["line", …]` entry to **`assets/lyrics-data.js`** (or SAVE WORDS in the studio and export). This feeds the shell's LYRICS overlay and the arcade tile game (separate from the timed map above).
- **Press / re-press a groove with a vibe:** `tools/studio.html` → GROOVE tab → drop the mp3 → pick TRAP/SOUL/PUNK/AMBIENT or tweak the knobs → PRESS → preview → SAVE → EXPORT `beat-data.js` → upload it (auto-refreshes, no bump).
- **Add a shop item:** one entry in the `SHOP` array in **`console.html`**.
- **Add an arcade game:** create `arcade/<slug>/index.html`, add a cover to `arcade/covers/`, add one entry to the `GAMES` array in `arcade/index.html`.
- **Unlock a Vault-of-Objects slot:** edit `utopie/index.html`, remove `locked` from the slot, swap the image/name/description.
- **New character page:** copy an existing character folder, change the name/role/rarity/color/video paths, convert the video to mp4, add the video to `assets/cert/`.
- **Change the site colors:** edit the `:root` variables at the top of each file (they're duplicated per page deliberately — pages can theme themselves, e.g. Nouveaux Punk runs red). The shell (`index.html`) has its own `:root` too.

*Written by the original build process — keep this file updated when the architecture changes.*
