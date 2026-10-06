# Sound Design

Sound is 50% of the perceived quality. Every video gets: **voiceover** + **music bed** + **SFX accents**.

## Bundled assets (`assets/audio/`)

Generated in-code, license-free, safe for any platform:

- `whoosh.wav` — transitions, text entrances
- `pop.wav` — UI element pops, emphasis words
- `riser.wav` — builds into the reveal beat
- `impact.wav` — logo slam, beat drops
- `music-bed-chill.wav` — calm ambient pad loop (product/SaaS vibe)
- `music-bed-energy.wav` — driving pulse loop (hype/shorts vibe)

Copy them into the Remotion project's `public/` and place with `<Audio>` inside `<Sequence>` at the right frames.

## Placement rules

- **Music**: starts at frame 0 (or a 0.5s fade-in), loops under everything, ducked.
- **Whoosh**: on every scene transition and major text entrance — not on every element (fatigue).
- **Pop**: staggered with list item entrances.
- **Riser**: 1–1.5s before the REVEAL/CTA beat, ending exactly on the cut.
- **Impact**: on the logo slam and the final CTA landing.
- Never stack more than 2 SFX on the same frame.

## Mixing

Voice is king. Target balance:

- Voiceover: 0 dB reference
- Music bed: **−18 to −22 dB under the voice** (ducking), −12 dB in any instrumental intro/outro
- SFX: −8 to −12 dB, short and felt more than heard

`scripts/mix_audio.py` does this with ffmpeg: sidechain-style volume automation, then **loudness normalize to −14 LUFS** (platform standard) with a true-peak ceiling of −1.5 dB:

```bash
python3 scripts/mix_audio.py --voice voice.mp3 --music music.wav --sfx-plan sfx-plan.json --out mix.wav
```

`sfx-plan.json` (optional): `[{"file": "whoosh.wav", "at": 1.5}, ...]` — seconds.

## In-Remotion alternative

Prefer keeping the mix in code? Use `<Audio volume={...}>` with a callback that dips music during voice ranges, plus `audio()` fades. Post-mix with ffmpeg is simpler for finals; in-code is better for iteration in Studio.

## Beat sync

If the music has a pulse, cut scenes on beats. At 120 BPM a beat = 0.5s = 15 frames at 30fps — round scene boundaries to multiples of that.
