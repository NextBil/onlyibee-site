#!/bin/bash
# NOUVEAUX PUNK 2 — THE 26. Regenerate the flat prints and the shirt mockups.
#
#   bash tools/np2-tee-build.sh "/path/to/np2/tee artwork"
#
# The blanks are Printify "Front" exports and are NOT in this repo — they live in
# the artwork folder on the desktop, passed in as $1. Nothing here needs Node,
# PIL or ImageMagick (none of which are on this machine): the prints are written
# as SVG by python3, and the compositing is Swift against AppKit, which loads SVG
# natively and blends per pixel.
#
# Pieces 01, 20 and 21 are photographs of shirts that were already pressed. They
# are copied straight through and never regenerated.
set -e
T="${1:?usage: np2-tee-build.sh <path to 'tee artwork' folder>}"
M="$T/mockups tshirts "
K="$T/keep those"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/tees/np2/mockups"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

mkdir -p "$TMP/prints" "$OUT/thumb"
NP2_PRINT_DIR="$TMP/prints" python3 "$ROOT/tools/np2-tee-prints.py"
swiftc -O -o "$TMP/comp" "$ROOT/tools/np2-tee-mockup.swift"

blank(){ case "$1" in
  black)   echo "$M/Front (20).png";;
  natural) echo "$M/Front (21).png";;
  clay)    echo "$M/Front (22).png";;
  sage)    echo "$M/Front (23).png";;
  white)   echo "$M/tshirt blanc vide template.png";;
  red)     echo "$M/tshirt rouge vide template.png";;
esac; }

# no | slug | blank | source: NEW = generated above, else a file in the artwork folder
while IFS='|' read -r no slug bl src; do
  [ -z "$no" ] && continue
  case "$src" in NEW) art="$TMP/prints/$no-$slug.svg";; *) art="$T/$src";; esac
  "$TMP/comp" "$(blank $bl)" "$art" "$OUT/$no-$slug.jpg"
done <<'LIST'
02|okay|black|NEW
03|money-upp|clay|NEW
04|drop-it|natural|07-the-drip.svg
05|pikatchuu|black|NEW
06|write-a-song|white|02-wordmark-print.png
07|u-mine|sage|NEW
08|let-go|black|NEW
09|between-the-lines|white|NEW
10|satisfied|black|02-new-punk.svg
11|rockstar|black|04-only-ibee-band.svg
12|i-feel-alive|black|NEW
13|mama-is-a-preacher|sage|NEW
14|pas-de-soucis|natural|NEW
15|spoof|natural|03-advisory.svg
16|benda|black|06-twenty-six.svg
17|buss-in-it|black|01-the-bat.svg
18|cigarette|clay|NEW
19|da-shit|red|NEW
22|epic-film|black|05-cam-01.svg
23|illegal-2|white|NEW
24|like-jimi-hendrix|black|NEW
25|lonely-3|natural|NEW
26|no-name|natural|Gemini_Generated_Image_jqg9arjqg9arjqg9.jpeg
LIST

# the three that were pressed before the 26 existed
sips -s format jpeg -s formatOptions 86 --out "$OUT/01-all-i-need.jpg" "$K/Front (9).png" >/dev/null
sips -s format jpeg -s formatOptions 86 --out "$OUT/21-deranger.jpg"   "$K/Front (4).png" >/dev/null
cp "$K/Front, Pine Green.jpg" "$OUT/20-damn.jpg"

# Two sizes, always. Safari decodes an <img> at its NATURAL size, so 26 full-size
# mockups on one shelf is ~436MB of bitmap and the phone reloads the tab under you.
cd "$OUT"
for f in *.jpg; do
  sips -Z 1200 "$f" >/dev/null
  sips -Z 400 --out "thumb/$f" "$f" >/dev/null
done
echo "built $(ls "$OUT"/*.jpg | wc -l | tr -d ' ') mockups + thumbs"
