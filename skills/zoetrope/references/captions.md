# Captions — Word-Synced, TikTok-Style

Captions are mandatory: ~80% of social video is watched muted, and word-highlight captions measurably lift retention.

## Pipeline

1. Generate voiceover first (`scripts/voiceover.py`).
2. Transcribe with word-level timestamps:

```bash
node scripts/transcribe_captions.mjs <audio.mp3> <captions.json> [--model medium.en] [--lang en]
```

This uses local **whisper.cpp** via `@remotion/install-whisper-cpp` (free, offline, no key):
- converts input to 16kHz WAV with ffmpeg automatically
- `tokenLevelTimestamps: true` (whisper.cpp ≥1.5.5 `--dtw`) — required for accurate per-word timing
- post-processed via `toCaptions()` into Remotion's `Caption[]` format (one entry per word, ms timestamps; note the leading space on words after the first — keep it)

Models: `base.en` for fast iteration, `medium.en` for finals (English). Non-English: `medium` or `large-v3` + `--lang <code>`.

Alternative if the user has an OpenAI key: `@remotion/openai-whisper` (`openAiWhisperApiToCaptions`) with `timestamp_granularities: ['word']`.

3. Render with the template's `<CaptionPages>` component — it groups words into pages (`createTikTokStyleCaptions`, `combineTokensWithinMilliseconds ≈ 900`), mounts each page in a `<Sequence>`, and highlights the active word.

## Caption styling rules

- Position: center-lower third, but **above the safe-zone floor** (≥ 600px from the bottom on 1080×1920).
- 2–5 words per page for shorts; full sentence pages for 16:9.
- Active word: accent color + scale pop (spring, ~8%); inactive words at 85% opacity.
- Font: heavy weight (700–900), size 5–7% of frame width on vertical, with a subtle shadow or stroke for legibility over any background.
- Emphasis words from `beats.json` get the accent treatment even when inactive.

## Languages without spaces (Japanese, Chinese…)

Whisper emits sub-word tokens; per-token highlighting flickers. Fix: lower `combineTokensWithinMilliseconds` to 500–800 and highlight the whole page, or merge tokens with <50ms gaps before rendering.

## SRT import

Have an `.srt` instead? `parseSrt()` from `@remotion/captions` converts it — but line-level timing makes word highlight approximate; prefer Whisper transcription when the audio exists.
