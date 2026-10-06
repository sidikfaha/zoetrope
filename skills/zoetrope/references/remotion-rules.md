# Remotion Rules — Crash-Proof TSX & Render Commands

Follow these when writing or editing Remotion code. They prevent the failures that waste render cycles.

## Golden rules

1. **All timing from `useCurrentFrame()` and `useVideoConfig()`** — never `Date.now()`, `performance.now()`, or random values during render. Frame math must be deterministic.
2. **`Math.random()` is forbidden in render** — use `random('seed-string')` from `remotion` with a stable seed.
3. **Async data (captions.json, images):** load with `fetch(staticFile('...'))` inside `useEffect` + `delayRender()`/`continueRender()` — the template's `CaptionPages` shows the pattern. Never let a frame render before data is loaded.
4. **Frame-relative math inside `<Sequence>`**: inside a Sequence, `useCurrentFrame()` is local (starts at 0). Pass absolute offsets as props when a child needs global time.
5. **Duration math**: `durationInFrames` must be a positive integer; guard `Math.max(1, Math.round(x))`. A zero/negative duration crashes the render.
6. **Fonts**: load via `@remotion/google-fonts/<Family>` at module top-level; Remotion waits for `document.fonts.ready`. Don't rely on system fonts.
7. **Media**: everything through `staticFile()` from `public/`; no bare relative URLs, no remote URLs at render time (download first).
8. **Never animate `width/height/top/left` when `transform` works** — transforms are GPU-cheap and look smoother.
9. **Opacity ≥ 0.01 trick**: fully transparent elements can disappear from the render pipeline; clamp to 0.01 if something vanishes.
10. **Keep compositions pure** — no DOM measurements (`getBoundingClientRect`) for layout decisions; derive layout from `useVideoConfig()` dimensions.

## Environment

- Node 18+ required. `check_env.sh` verifies; Remotion 4 bundles/downloads its own ffmpeg + Chrome Headless Shell on first render, so a missing system ffmpeg is OK.
- New project: `setup_project.sh` wraps `npx create-video@latest --blank` + installs `@remotion/captions @remotion/install-whisper-cpp @remotion/google-fonts`.
- Remotion's own agent skills (`npx skills add remotion-dev/skills`) are a good complement; this plugin's template already encodes their key rules.

## Commands

```bash
npm run dev                                  # Studio preview (hot reload)
npx remotion still <Comp> out/frame.png --frame=45     # QA stills — always before video
npx remotion render <Comp> out/video.mp4 --crf=18      # master render
npx remotion render <Comp> out/video.mp4 --width=1080 --height=1080  # ratio variant
```

`render.sh` wraps the common cases including `--variants` (9:16 + 1:1 + 16:9 cuts).

## Composition sizing pattern

Drive everything off `width`/`height` from `useVideoConfig()` so one composition renders all aspect variants:

```tsx
const { width, height, fps } = useVideoConfig();
const fontSize = Math.round(width * 0.09);   // scales across 9:16 / 1:1 / 16:9
```

For duration from data (e.g. voiceover length), use `calculateMetadata` on the `<Composition>` to set `durationInFrames` from the audio duration + padding.

## License note

Remotion is free for individuals and small teams; companies above the threshold need a Remotion company license. Mention this to commercial users once, in passing.
