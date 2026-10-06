# Storyboard & Script Grammar

Structure every video as **beats**, written to `beats.json` before any visual work. One beat = one on-screen idea.

## Launch reel beat grammar (15–30s, product/feature launch)

| Beat | Duration | Job | Visual pattern |
|---|---|---|---|
| HOOK | 0–1.5s | Stop the scroll. Bold claim, question, or the end-result first. | Kinetic type slam, quick zoom, high contrast |
| PROBLEM | 1.5–5s | Name the pain in the user's words. | Dimmed/muted scene, glitch or static motif |
| REVEAL | 5–8s | Introduce the product as the answer. | Logo sting, light sweep, theme shifts dark→bright |
| FEATURES | 8–22s | Max 3 features, one per beat, benefit-led ("Ship faster", not "v2 engine"). | UI card pop-ins, mock screens with punch-ins, icons |
| PROOF (optional) | 2–3s | One number or logo: "10k teams", "4.9★". | Counter animation, marquee |
| CTA | last 2–3s | One action: "Try free — link in bio". Hold to the last frame. | End card, logo + URL, spring overshoot on button |

Rules: max **one idea per beat**, max **3 features**, end-card holds ≥ 1.5s, and frame 0 must work as the thumbnail.

## Faceless short beat grammar (20–45s, TikTok/Reels/Shorts)

HOOK (frame 0 = the thumbnail) → SETUP (context in one line) → BUILD (2–4 escalating points) → PAYOFF/TWIST (the thing they stayed for) → LOOP (last frame visually rhymes with frame 0 so the loop is seamless).

Rules: no CTA outros on organic shorts (kills loop retention); end on the payoff; the loop seam matters more than the ending.

## Script writing for AI voiceover

Write for the **ear**, not the eye:

- Contractions always ("it's", "you'll"). Formal written English sounds robotic read aloud.
- Sentences ≤ 15 words. One clause per breath.
- Punctuation is pacing: commas = short pause, periods = beat, "..." = deliberate hold, em-dashes for dramatic pivots.
- Spell out numbers and acronyms the way they should sound ("twenty twenty-six", "A P I" or "ay-pee-eye" — pick one and be consistent).
- 125–150 words ≈ 60s at a natural reel pace. For a 20s launch reel: 45–55 words max. Less is more.
- Read it aloud once before synthesis. If you run out of breath, split the sentence.

## beats.json contract

The template's `LaunchReel` composition reads a **scenes** format. Scene durations are derived from the next scene's `startSec`, and `LaunchReel` extends each scene by `transitionFrames` so `TransitionSeries` can overlap them (slide / wipe / fade).

```json
{
  "title": "Acme v2",
  "productName": "Acme v2",
  "cta": "Try it free",
  "url": "acme.dev",
  "transitionFrames": 12,
  "scenes": [
    {
      "id": "hook",
      "startSec": 0,
      "line": "Your deploys take",
      "line2": "40 minutes?",
      "emphasis": ["40", "minutes?"],
      "sub": "Yeah... forty.",
      "subDelaySec": 1.91,
      "ghost": "40 MINUTES"
    },
    { "id": "reveal", "startSec": 2.55 },
    {
      "id": "feature",
      "startSec": 4.19,
      "keyword": "SECONDS",
      "title": "Builds in seconds",
      "sub": "Parallel pipelines do the waiting for you.",
      "emoji": "⚡"
    },
    { "id": "cta", "startSec": 16.55 }
  ]
}
```

Field guide:

- `startSec` (float, seconds): when the scene starts. Derive these from the voiceover word timings so the visual cut lands **on** the spoken line — never hardcode round numbers.
- Scene `id` selects the layout: `hook` (kinetic type + ghost word), `reveal` (logo sting + light sweep), `feature` (glass card, repeatable), `cta` (end card; reads top-level `productName` / `cta` / `url`).
- `hook`: `line`/`line2` are the two kinetic-type lines; `emphasis` words get the accent color + underline draw-on; `sub` is a delayed punch line shown after `subDelaySec`; `ghost` is the huge watermark word drifting behind.
- `feature`: `keyword` (small caps eyebrow), `title`, `sub`, `emoji` (icon).
- `transitionFrames`: overlap duration for scene transitions, 10–14 feels cinematic at 30fps.

The total composition duration = last scene's `startSec` + its derived duration, so the voiceover length drives the edit. Write the script first, synthesize the voiceover, then set `startSec` values from the actual word timings.
