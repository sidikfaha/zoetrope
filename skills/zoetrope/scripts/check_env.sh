#!/usr/bin/env bash
# Zoetrope — environment check
set -u
ok=1

echo "== Zoetrope environment check =="

if command -v node >/dev/null 2>&1; then
  nv=$(node --version)
  major=$(echo "$nv" | sed 's/v\([0-9]*\).*/\1/')
  if [ "$major" -ge 18 ]; then echo "[ok] node $nv"; else echo "[FAIL] node $nv — need >= 18"; ok=0; fi
else
  echo "[FAIL] node not found — install Node.js 18+"; ok=0
fi

if command -v ffmpeg >/dev/null 2>&1; then
  echo "[ok] ffmpeg $(ffmpeg -version 2>/dev/null | head -1 | cut -d' ' -f1-3)"
else
  echo "[warn] ffmpeg not on PATH — Remotion will use its bundled ffmpeg; mix_audio.py needs ffmpeg on PATH (brew install ffmpeg)"
fi

if python3 -c "import edge_tts" >/dev/null 2>&1; then
  echo "[ok] python edge-tts installed"
else
  echo "[info] edge-tts not installed — voiceover.py will offer: python3 -m pip install edge-tts"
fi

[ -n "${ELEVENLABS_API_KEY:-}" ] && echo "[ok] ELEVENLABS_API_KEY set (tier-1 voice)" || echo "[info] ELEVENLABS_API_KEY not set — using edge-tts"
[ -n "${OPENAI_API_KEY:-}" ] && echo "[ok] OPENAI_API_KEY set" || true

exit $((1-ok))
