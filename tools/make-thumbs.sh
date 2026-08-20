#!/bin/sh
# =============================================================================
# make-thumbs.sh — the small copies the radio lists actually draw
# -----------------------------------------------------------------------------
# Safari decodes an <img> at its NATURAL size and holds that bitmap for as long
# as the element lives. The shell's radio lists 65 rows at 34x34 CSS pixels; if
# those rows point at the full covers, one tab is carrying hundreds of megabytes
# of decoded art and iOS reloads the page ("this webpage was reloaded...").
#
# So every image in assets/img/ and assets/covers/ gets two generated copies,
# under the SAME filename:
#
#     thumb/  128px  — 34px list rows (128 covers a 3x iPhone with room to spare)
#     mid/    384px  — 68x120 shelf cards and the grid tiles
#
# index.html's sized(url, bucket) is just a path rewrite, and the full-size file
# stays next in the candidate chain, so an image with no thumb still shows.
#
# Run this after adding or replacing anything in assets/img or assets/covers.
# Nothing else to update — no manifest, no version bump.
# =============================================================================
cd "$(dirname "$0")/.." || exit 1
for dir in assets/img assets/covers; do
  mkdir -p "$dir/thumb" "$dir/mid"
  n=0
  find "$dir" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | while read -r f; do
    b=$(basename "$f")
    sips -Z 128 "$f" --out "$dir/thumb/$b" >/dev/null 2>&1
    sips -Z 384 "$f" --out "$dir/mid/$b"   >/dev/null 2>&1
    echo "  $b"
  done
done
echo "thumbs rebuilt."
