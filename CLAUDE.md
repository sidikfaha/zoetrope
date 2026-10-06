# Zoetrope — repo guidance for Claude Code

This repo is the Zoetrope plugin: an AI motion-design video studio. When the user asks for a launch video, product reel, promo, teaser, or social short (TikTok/Reels/Shorts), load `skills/zoetrope/SKILL.md` and run its 8-step pipeline (brief → script → voice → captions → visuals → sound → QA stills → export).

Key conventions:

- All visuals are Remotion (React) code derived from `skills/zoetrope/assets/remotion-template/`. Never write Remotion code from scratch without copying the template first.
- Read `skills/zoetrope/references/remotion-rules.md` before writing any TSX; read `motion-design.md` before animating; read `platform-specs.md` before exporting.
- Voiceover: `python3 skills/zoetrope/scripts/voiceover.py script.txt --out voiceover.mp3` (ElevenLabs if ELEVENLABS_API_KEY, else free edge-tts).
- Captions: `node skills/zoetrope/scripts/transcribe_captions.mjs voiceover.mp3 captions.json`.
- QA is mandatory: render ≥4 stills at output size and view them before any full render.
- Bundled audio (license-free) lives in `skills/zoetrope/assets/audio/`.
