# Zoetrope 🎬

**AI motion-design video studio for coding agents.** Turn a product or idea into a polished launch reel or vertical social short — code-driven animation (Remotion), human-like AI voiceover, word-synced TikTok-style captions, sound design, and platform-perfect exports.

Works with **Kimi Code / Kimi Work** and **Claude Code**.

```
brief → script + beats.json → AI voiceover → word-level captions →
Remotion scenes → music + SFX mix → still-frame QA → per-platform .mp4 exports
```

## What's inside

| Piece | Path | What it does |
|---|---|---|
| Skill | `skills/zoetrope/SKILL.md` | The 8-step pipeline + hard rules (hook first, no linear motion, captions on, safe zones) |
| Knowledge | `skills/zoetrope/references/` | Storyboard grammar, motion-design principles, 2026 platform specs & safe zones, voiceover tuning, caption workflow, sound design, crash-proof Remotion rules |
| Scripts | `skills/zoetrope/scripts/` | `setup_project.sh`, `voiceover.py` (ElevenLabs → edge-tts → OpenAI tiers), `transcribe_captions.mjs` (local whisper.cpp word timestamps), `mix_audio.py` (ducking + −14 LUFS), `render.sh`, `check_env.sh` |
| Remotion template | `skills/zoetrope/assets/remotion-template/` | Working `LaunchReel` + `SocialShort` compositions, kinetic text, word-highlight captions, logo sting, end card, feature cards, animated backgrounds, spring presets, safe-zone helpers |
| Audio assets | `skills/zoetrope/assets/audio/` | License-free generated `whoosh / pop / riser / impact` SFX + `music-bed-chill / music-bed-energy` loops |

## Requirements

- Node.js 18+ and an agent (Kimi Code or Claude Code)
- ffmpeg recommended (Remotion bundles one if missing; `mix_audio.py` needs system ffmpeg)
- Optional API keys for premium voices: `ELEVENLABS_API_KEY` (best, most human) or `OPENAI_API_KEY`. Without keys, edge-tts neural voices are used — free and very natural.
- Optional: `python3 -m pip install edge-tts` (voiceover script will tell you if missing)

## Install — Kimi Code / Kimi Work

The plugin is registered in your personal market. Open the **插件 (Plugins)** page → **个人 (Personal)** tab → click **＋** on **Zoetrope**. Then just ask:

> “Make a 20s product launch reel for my app, dark theme, vertical.”

## Install — Claude Code

```bash
# from any project where you want the skill
claude plugin install /path/to/zoetrope
# or copy the skill into your user skills:
cp -R zoetrope/skills/zoetrope ~/.claude/skills/zoetrope
```

The repo also carries `CLAUDE.md` + `.claude-plugin/plugin.json`, so opening this folder in Claude Code gives the agent the full pipeline guidance automatically.

## Usage examples (natural language)

- “Make a 20-second launch reel for my note-taking app — dark, premium feel, vertical for Reels.”
- “Create a faceless TikTok short explaining how coffee is made, energetic, with captions.”
- “Here's my changelog — turn it into a feature-announcement video with a confident female voiceover.”
- “Add word-synced captions and a chill music bed to my existing launch.mp4.”

## How it beats a prompt-and-pray workflow

1. **Deterministic visuals** — every frame is code; reproducible, diffable, brand-token driven.
2. **Word-exact captions** — local whisper.cpp token timestamps, not guessed SRT timing.
3. **Human-like voice** — script rules (contractions, breath punctuation, pacing) + tiered engines.
4. **Retention grammar** — hook in 1.5s, beat structure, seamless loops, end-card holds.
5. **Platform correctness** — 2026 specs, safe zones, and bitrate masters baked in.

## License

MIT for the plugin. Bundled audio assets are generated and license-free. Remotion itself is free for individuals/small teams — check their license for company use. edge-tts uses an unofficial endpoint (fine for drafts/personal; use ElevenLabs/OpenAI for commercial campaigns).
