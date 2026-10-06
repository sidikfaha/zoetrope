---
name: zoetrope
description: Create motion-design videos with code — product launch reels, feature announcements, faceless social shorts (TikTok / Reels / Shorts) — with Remotion animations, human-like AI voiceover, word-synced captions, sound design, and platform-perfect exports. Use when the user asks to make/animate a launch video, product reel, promo, teaser, social short, kinetic-typography video, or add voiceover/captions/music to a video.
---

# Zoetrope — AI Motion-Design Video Studio

Turn a product, feature, or idea into a finished motion-design video: scripted, voiced, animated, captioned, sound-designed, and exported per platform. All visuals are **code** (Remotion / React), so every frame is reproducible, reviewable, and editable.

## When to use

- "Make a launch video / reel / teaser / promo for my product"
- "Create a TikTok / Reel / Short about X" (faceless or branded)
- "Animate this announcement / changelog / feature list"
- "Add a voiceover, captions, or music to my video"

## The pipeline (always in this order)

```
1. BRIEF      → gather: product, audience, platform(s), aspect, duration, vibe, brand colors/logo
2. SCRIPT     → write voiceover script + beats.json   (references/storyboard.md)
3. VOICE      → generate human-like voiceover          (scripts/voiceover.py, references/voiceover.md)
4. CAPTIONS   → word-level timestamps                  (scripts/transcribe_captions.mjs, references/captions.md)
5. VISUALS    → Remotion TSX scenes from the template  (assets/remotion-template/, references/motion-design.md + remotion-rules.md)
                + FX toolbox: particles, pops, custom transitions, doodles, text FX, 3D
                (references/particles.md, transitions.md, doodle.md, animation-recipes.md, three-3d.md)
6. SOUND      → music bed + SFX, ducked and normalized (scripts/mix_audio.py, references/sound-design.md, assets/audio/)
7. QA         → render stills at phone scale and LOOK at them before full render
8. EXPORT     → per-platform masters                   (scripts/render.sh, references/platform-specs.md)
```

Never skip QA (step 7). Render 4–6 still frames (`npx remotion still`) at real output size and read them as images before committing to a full render. Fix overflow, contrast, and safe-zone violations at the still stage — it is 100× cheaper than re-rendering video.

## Setup (once per project)

```bash
bash scripts/check_env.sh                 # verifies node 18+, ffmpeg (Remotion bundles one if missing)
bash scripts/setup_project.sh <dir>       # scaffolds Remotion project + installs caption/whisper/fonts packages
```

Then copy the template scenes from `assets/remotion-template/src/` into the project's `src/` and adapt them to the brief. The template ships working compositions (`LaunchReel`, `SocialShort`, `FXShowcase`), kinetic-text and caption components, an FX toolbox (`Particles`, `Pops`, `TransitionsFX`, `Doodles`, `TextFX`, `ThreeScene`), brand tokens (`theme.ts`), spring/easing presets (`lib/animation.ts`), and platform safe-zone helpers (`lib/safeZones.tsx`). Read `assets/remotion-template/README.md` first.

## Voiceover (human-like, tiered)

```bash
python3 scripts/voiceover.py script.txt --voice aria --out public/voiceover.mp3
```

Tier order, best first: **ElevenLabs** (if `ELEVENLABS_API_KEY` set — most human) → **edge-tts** (free default, no key, very natural neural voices) → **OpenAI TTS** (if `OPENAI_API_KEY`). Script-writing rules that make TTS sound human (contractions, short sentences, punctuation-driven pacing) are in `references/voiceover.md` — apply them to every script before synthesis.

## Captions (word-synced)

```bash
node scripts/transcribe_captions.mjs public/voiceover.mp3 public/captions.json
```

Uses local whisper.cpp with token-level timestamps (free, offline). Feed `captions.json` into the template's `<CaptionPages>` component for TikTok-style word-highlight captions. Details: `references/captions.md`.

## Sound design

Bundled assets in `assets/audio/`: `whoosh.wav`, `pop.wav`, `riser.wav`, `impact.wav`, `music-bed-chill.wav`, `music-bed-energy.wav` (all generated, license-free). Layer them in Remotion with `<Audio>`/`<Sequence>`, or post-mix with:

```bash
python3 scripts/mix_audio.py --voice public/voiceover.mp3 --music assets/audio/music-bed-chill.wav --out public/mix.wav
```

Mixing rules (ducking, -14 LUFS, SFX-on-cuts): `references/sound-design.md`.

## Render & export

```bash
bash scripts/render.sh <project-dir> LaunchReel out/launch.mp4
bash scripts/render.sh <project-dir> LaunchReel out/launch.mp4 --variants   # also 1:1 and 16:9 cuts
```

Platform specs, safe zones, durations, and bitrates: `references/platform-specs.md`. Master at **1080×1920, 30fps, H.264 + AAC, high bitrate** for vertical; keep text inside the cross-platform safe zone (top 250px, bottom 576px, right 164px, left 60px of a 1080×1920 frame).

## Hard rules (non-negotiable)

1. **Hook in the first 1.5s** — motion + a bold claim/question. No logo intros first.
2. **Never linear motion** — springs or eased interpolation only (`references/motion-design.md`).
3. **Captions on by default** — 80% of social video plays muted.
4. **Safe zones always** — compose inside them from frame 0, not as an afterthought.
5. **Stills before renders** — QA step 7 is mandatory.
6. **Follow `references/remotion-rules.md`** when writing TSX — it prevents the crashes that waste render cycles.
7. Deliver the `.mp4` file(s) plus a one-line summary of scenes, duration, voice, and platform cuts.
