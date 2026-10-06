# Zoetrope Remotion Template

Copy everything in `src/` into your Remotion project's `src/` (created by `setup_project.sh`), then adapt.

## Files

- `theme.ts` — brand tokens (colors, fonts, voice). Edit first; everything reads from here.
- `lib/animation.ts` — spring/easing presets encoding the motion rules (never hand-roll linear tweens).
- `lib/safeZones.ts` — platform safe-zone constants + `<SafeZoneGuide>` dev overlay (set `showGuide=false` for finals).
- `components/KineticText.tsx` — blur-reveal word-staggered headlines, emphasis pops, accent underline draw-on, `GhostWord` outline parallax keywords.
- `components/CaptionPages.tsx` — TikTok-style word-highlight captions from `public/captions.json`.
- `components/Backgrounds.tsx` — cinematic `AuroraMesh` (drifting color blobs + rotating light ray + vignette) and particle field.
- `components/CameraRig.tsx` — continuous slow camera move per scene (scale/rotate/drift).
- `components/LightSweep.tsx` — diagonal light sweep for reveals and CTA landings.
- `components/ProgressBar.tsx` — story-style progress bar.
- `components/LogoSting.tsx` — logo slam reveal with anticipation + overshoot.
- `components/EndCard.tsx` — CTA end card (holds to last frame).
- `components/FeatureCard.tsx` — glass feature card with 3D perspective entrance.
- `components/Particles.tsx` — deterministic particle systems: `confetti`, `burst`, `sparks`, `dust`, `bokeh`, `stars` presets (seeded random, closed-form physics).
- `components/Pops.tsx` — `RingPop`, `StarBurst`, `EmojiPop`, `ImpactFlash`, `ScreenShake` — mount on the beat frame.
- `components/TransitionsFX.tsx` — custom scene transitions: `whipPan()`, `zoomPunch()`, `glitch()`, `lightLeak()`, `irisWipe()` for `TransitionSeries`.
- `components/Doodles.tsx` — hand-drawn annotations with boiling-line wobble: `SketchCircle`, `SketchArrow`, `SketchUnderline`, `SketchCheck`, `SketchCross`, `SketchSpark`, `Highlight`, `WobbleFilter`.
- `components/TextFX.tsx` — `ScrambleText`, `Typewriter`, `GlitchText`, `WaveText`, `Counter`.
- `components/ThreeScene.tsx` — real 3D via `@remotion/three`: `Float3D` floating shapes / product pedestal turntable (frame-driven, never clock-driven).
- `FXShowcase.tsx` — living demo of the whole FX toolbox (whip-pan + light-leak transitions between three scenes). Render `FXShowcase` once to see every effect; delete or repurpose freely.
- `LaunchReel.tsx` — 15–30s product launch composition: TransitionSeries scenes (slide/wipe/fade) driven by `beats.json` `scenes[]`.
- `SocialShort.tsx` — 20–45s faceless-short composition.
- `Root.tsx` — registers the compositions at 1080×1920, 30fps, plus 1:1 and 16:9 variants and `FXShowcase`.

## Data flow

1. `public/beats.json` — the storyboard (see plugin `references/storyboard.md` § beats.json contract).
2. `public/voiceover.mp3` + `public/voiceover.timings.json` — from `scripts/voiceover.py`.
3. `public/captions.json` — from `scripts/transcribe_captions.mjs` (word-level).
4. `public/audio/*.wav` — SFX + music bed from the plugin's `assets/audio/`.
5. Brand assets (logo, screenshots) — drop in `public/` and reference via `staticFile()`.

## QA loop (mandatory)

```bash
npx remotion still LaunchReel out/qa/f15.png --frame=15   # a few frames per scene
# read the PNGs, fix overflow/contrast/safe-zone issues, THEN render:
npx remotion render LaunchReel out/launch.mp4 --crf=18
```
