# Motion Design Principles (for code-driven animation)

Motion quality is decided by **timing and easing**, not by how many effects you stack. Internalize these rules; the template's `lib/animation.ts` encodes them as presets.

## The 4 S's

- **Style** — one visual language per video (palette, type, motion personality). Never mix.
- **Surprise** — one unexpected move per beat (an overshoot, a whip pan, a hard cut on the beat).
- **Smoothness** — everything eases; nothing starts or stops instantly.
- **Simplicity** — if an element doesn't serve the message, delete it. Clean beats fancy.

## The physics rules

1. **No linear motion, ever.** Real objects accelerate and decelerate. Use springs or cubic easing.
2. **Anticipation** — a small counter-move before the main move (2–4 frames, 5–10% of the distance).
3. **Overshoot & settle** — entrances should pass the target and spring back (spring damping 10–14 gives a premium feel; damping <8 is playful/bouncy).
4. **Follow-through** — secondary elements (shadows, glows, particles) lag the primary by 3–6 frames.
5. **Squash & stretch** — on impacts, scale along the motion axis (max ~8%) for one or two frames.
6. **Stagger** — never animate lists together; offset children by 3–5 frames each (80–150ms). Direction of stagger = reading direction.

## Timing cheat sheet (30fps)

| Action | Frames | Feel |
|---|---|---|
| UI micro-pop | 8–12 | snappy |
| Text/element entrance | 12–20 | confident |
| Scene transition | 10–15 | fast, invisible |
| Camera punch-in | 20–30 | cinematic |
| Slow ambient drift (backgrounds) | continuous, ≤2% scale/s | alive but calm |

## Kinetic typography rules

- Sync word/line entrances to the voiceover or music beat — rhythm is the point.
- Emphasis words: scale 1.0→1.15 with a spring + accent color, on the spoken frame.
- Keep line length ≤ 6 words on screen; huge type (8–14% of frame height for heroes).
- Contrast ratio ≥ 4.5:1 against the background — always, even mid-animation.
- Don't animate more than 2 properties at once on the same text layer (e.g. y + opacity; or scale + rotate — not all four).

## Camera & depth

- Treat UI/screenshots as physical objects: slow punch-ins (scale 1.0→1.08), subtle parallax between layers (background moves 30–50% of foreground).
- Easing for camera moves: fast acceleration, long deceleration tail (`Easing.out(Easing.cubic)` or spring damping ~20).
- Hard cuts on music beats maintain momentum in short-form; use wipes/slides only when the content changes topic.

## Accessibility

- No flashes faster than 3 per second (seizure risk).
- Motion should never be the only carrier of meaning — captions/labels carry the message.

## FX toolbox — pick by intent, not by novelty

| You want the viewer to feel… | Reach for | Reference |
|---|---|---|
| Alive, premium | `dust`/`bokeh` particles, aurora background, camera drift | references/particles.md |
| Impact, power | `zoomPunch()` transition, `ImpactFlash`, `ScreenShake`, `sparks` | references/transitions.md |
| Speed, confidence | `whipPan()`, hard cuts on the beat, speed ramps | references/transitions.md |
| Human, handmade | Doodles (`SketchCircle`, `SketchArrow`, `Highlight`), Caveat font | references/doodle.md |
| Technical, hacker | `ScrambleText`, `GlitchText`, `glitch()` transition, mono font | references/animation-recipes.md |
| Celebration | `confetti`, `EmojiPop`, `StarBurst`, `RingPop` | references/particles.md |
| Proof, scale | `Counter`, rolling stats, logo marquee | references/animation-recipes.md |
| Depth, "wow" | `Float3D` shapes/pedestal, parallax layers | references/three-3d.md |

One intent per scene. The toolbox is a spice rack — a great dish uses two spices.
