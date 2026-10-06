# Voiceover — Human-Like AI Narration

`scripts/voiceover.py` synthesizes a voiceover from a plain-text script (one line per beat). It picks the best available engine automatically.

## Engine tiers (best first)

| Tier | Engine | When | Quality |
|---|---|---|---|
| 1 | **ElevenLabs** (`eleven_multilingual_v2` / v3) | `ELEVENLABS_API_KEY` set | The most human: emotion, breath, natural prosody. Use for finals. |
| 2 | **edge-tts** (Microsoft neural voices) | default, no key, free | Surprisingly natural; great for iteration and finals on a budget. |
| 3 | **OpenAI TTS** (`gpt-4o-mini-tts`) | `OPENAI_API_KEY` set | Good, instruction-steerable ("speak excitedly"). |

Voice recommendations (edge-tts names; the script's `--voice` accepts friendly aliases):

- `andrew` → `en-US-AndrewMultilingualNeural` — **default**; the most natural free male voice, warm and conversational
- `ava` → `en-US-AvaMultilingualNeural` — natural, expressive female; great for launches
- `brian` → `en-US-BrianMultilingualNeural` — casual, youthful; good for shorts
- `emma` → `en-US-EmmaMultilingualNeural` — upbeat female
- `aria` → `en-US-AriaNeural` — classic fallback
- Multilingual: `edge-tts --list-voices` for 300+ voices; prefer names ending in `MultilingualNeural` — they carry noticeably more human prosody than the single-language ones.

## Make TTS sound human (do all of these)

1. **Write spoken language** — see references/storyboard.md § Script writing.
2. **Punctuate for breath** — commas and periods shape prosody more than engine choice.
3. **Slow down slightly for authority**: edge-tts `--rate=-4%` for cinematic reads, `+2%` for hype shorts.
4. **Pitch for warmth**: edge-tts `--pitch=+2Hz` (female voices) or `-2Hz` (male) often sounds more natural.
5. **One beat per line** — the script file's line breaks become the beat boundaries; the tool returns per-line timings for scene sync.
6. **Always audition the real script**, not a test sentence, before committing.

## ElevenLabs settings that work for reels

- Model: `eleven_multilingual_v2` (stable) or `eleven_v3` (most expressive, 70+ languages)
- stability 0.35–0.5 (lower = more expressive), similarity 0.75, style 0.3–0.5
- Pick voices from their library; "professional" + "conversational" tags fit product videos.

## Licensing note

edge-tts uses an unofficial endpoint — fine for drafts/personal content; for commercial campaigns prefer ElevenLabs (paid plan includes commercial license) or OpenAI. Mention this to the user when the video is for paid ads.
