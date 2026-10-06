# Doodle & Hand-Drawn Animation

Doodles humanize a video: a sketchy arrow pointing at your UI says "a person made this" — the highest-trust signal on social. The style lives or dies on three things: **imperfect paths, boiling line, restraint**.

## The look

1. **Imperfect paths.** Real hand-drawn lines wobble. Never use straight `M x y L x y` for underlines/arrows — use gentle multi-point curves with slight overshoot past the endpoint. Double-stroke key shapes (two offset circle paths) for the sketch look.
2. **Boiling line.** Hand-drawn animation "boils" — the line redraws slightly differently ~8×/second. Fake it with an SVG `feTurbulence` + `feDisplacementMap` filter whose `seed` steps every 3 frames (`seed={Math.floor(frame / 3)}`). The `WobbleFilter` in Doodles.tsx does this.
3. **Restraint.** Doodles are seasoning: one arrow, one circle, one underline per scene. A full doodle scene only works if the *entire* video commits to the style (paper background, hand font, everything wobbling).

## Draw-on animation

Every doodle draws itself on with `evolvePath` from `@remotion/paths`:

```tsx
import { evolvePath } from '@remotion/paths';

const progress = spring({ frame: frame - delay, fps, config: { damping: 100, stiffness: 60 } });
const { strokeDasharray, strokeDashoffset } = evolvePath(progress, d);

<path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
  strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
```

- Draw-on duration: 15–25 frames for arrows/underlines, 25–40 for circles. Slow damped springs (`damping: 100`) feel like a marker moving; snappy springs feel robotic.
- `strokeLinecap: 'round'` always — flat caps kill the hand feel.
- For arrows, draw the shaft 0→80% progress, then the head 75→100% (overlapping) as a second path — like a real stroke.
- Follow the stroke tip with a dot/marker: `getPointAtLength(d, progress * getLength(d))`.

## Components (Doodles.tsx)

| Component | Use | Notes |
|---|---|---|
| `SketchCircle` | Circle a word, emoji, or UI element | Draws ~1.2 turns, slight overshoot; size it 15% larger than the target |
| `SketchArrow` | Point at the CTA, connect cause→effect | `flip` props to aim; head draws after shaft |
| `SketchUnderline` | Emphasize one word in a sentence | Wavy path; pair with `emphasis` color |
| `SketchCheck` / `SketchCross` | Do/don't lists, before/after | Check = green/emphasis, cross = danger |
| `SketchStar` | "New!", ratings, delight | 4-point spark, quick pop |
| `Highlight` | Marker swipe behind text | `mixBlendMode: multiply` on light bg, `screen` on dark; animate scaleX 0→1 origin left |
| `WobbleFilter` | Wrap any doodle (or text!) for boil | `id` must be unique per scene |

## Fonts & palette

- Handwriting fonts via `@remotion/google-fonts`: `Caveat` (confident), `Kalam` (friendly), `Shadows Into Light` (casual). Load in Root.tsx, use ONLY for doodle-adjacent text — never body copy.
- Doodle color: `theme.colors.emphasis` (yellow) on dark, or a marker red `#FF4D4D`. One doodle color per video.
- Stroke width: 5–8px at 1080×1920. Thinner reads as wireframe, thicker as crayon.

## Mixing doodles with clean UI (the money shot)

The highest-performing pattern: **clean product UI + one sketchy annotation**. Glass card slides in premium → 10 frames later a sketchy circle draws around the key number → a tiny arrow points to the CTA. The contrast makes both elements stronger.

Anti-patterns:
- Doodles + glitch + particles in one scene (pick a lane).
- Wobble filter on large regions or photos (GPU pain, visual noise).
- More than ~30% of scenes using doodles in a premium brand video.
