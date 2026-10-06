#!/usr/bin/env bash
# Zoetrope — render helper.
# Usage:
#   bash render.sh <project-dir> <CompositionId> <out.mp4>            master (as composed)
#   bash render.sh <project-dir> <CompositionId> <out.mp4> --variants also render 1:1 and 16:9 cuts
#   bash render.sh <project-dir> <CompositionId> <out.mp4> --stills   render 5 QA stills only
set -euo pipefail

DIR="${1:?project dir}"; COMP="${2:?composition id}"; OUT="${3:?output file}"; MODE="${4:-}"
cd "$DIR"
mkdir -p "$(dirname "$OUT")" out/qa

if [ "$MODE" = "--stills" ]; then
  # 5 stills spread across the video — read these as images before rendering video
  DUR=$(npx remotion compositions --quiet 2>/dev/null | grep -w "$COMP" | awk '{print $3}' || echo "")
  for f in 15 45 90 150 210; do
    npx remotion still "$COMP" "out/qa/${COMP}-f${f}.png" --frame="$f" || true
  done
  echo ">> QA stills in $DIR/out/qa/ — inspect them before rendering video"
  exit 0
fi

echo ">> rendering $COMP -> $OUT"
npx remotion render "$COMP" "$OUT" --crf=18

if [ "$MODE" = "--variants" ]; then
  base="${OUT%.mp4}"
  echo ">> 1:1 cut"
  npx remotion render "$COMP" "${base}-1x1.mp4" --width=1080 --height=1080 --crf=18 || true
  echo ">> 16:9 cut"
  npx remotion render "$COMP" "${base}-16x9.mp4" --width=1920 --height=1080 --crf=18 || true
fi

echo ">> done: $OUT"
