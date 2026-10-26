# NP2 notice image changes

## What changed

- Added 14 transparent PNGs in `assets/img/np2-notices/`, one for every NP2 notice mood.
- Removed the supplied green-screen background from each image while preserving the character, pose, props, and colors.
- Updated `np2/index.html` so each notice uses its matching image by the existing notice key:
  - `night` → alone at night
  - `hope` → hope
  - `smoke` → smoke
  - `broken` → heart broken
  - `nonsense` → nothing makes sense
  - `grind` → grinding
  - `dance` → dance
  - `sleep` → sleep
  - `drive` → drive
  - `sensual` → sad and sensual
  - `punk` → punk
  - `beats` → beats by ibee
  - `afro` → afro
  - `french` → french
- Increased the notice image display area from 34px to 62px on desktop (54px on small screens), keeping the existing notice behavior unchanged.

## Not changed

- No text, songs, notice labels, playlist behavior, layout outside the notice images, or other site files were changed.
- The pre-existing uncommitted edit in `.claude/launch.json` was left untouched.
