---
name: zoetrope
description: Create a motion-design video (product launch reel or social short) from a brief — runs the full Zoetrope pipeline.
---

# /zoetrope — make a motion-design video

The user wants a video. Brief: $ARGUMENTS

Run the Zoetrope pipeline end to end (load the `zoetrope` skill and follow it):

1. **Brief** — extract from the arguments: product/topic, platform(s), aspect ratio, duration, vibe, brand assets. Ask only for what's truly missing.
2. **Script** — write the voiceover script + `beats.json` per `references/storyboard.md`.
3. **Voice** — `scripts/voiceover.py` (human-like tier selection per `references/voiceover.md`).
4. **Captions** — `scripts/transcribe_captions.mjs` (word-level).
5. **Visuals** — adapt `assets/remotion-template/` scenes per `references/motion-design.md` and `references/remotion-rules.md`.
6. **Sound** — music bed + SFX from `assets/audio/` per `references/sound-design.md`.
7. **QA** — render stills, inspect them as images, fix issues, repeat until clean.
8. **Export** — render master + platform variants per `references/platform-specs.md`, deliver the .mp4 files.
