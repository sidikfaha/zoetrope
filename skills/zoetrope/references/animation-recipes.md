# Complex Animation Recipes

The difference between "animated" and "motion design" is choreography: layers, offsets, physics, and restraint. This file is the recipe book — copy the patterns, don't reinvent them.

## Spring cookbook

| Feel | `config` | Use for |
|---|---|---|
| Confident pop | `{ damping: 13, stiffness: 120, mass: 0.9 }` | Titles, cards (template default) |
| Snappy UI | `{ damping: 20, stiffness: 300, mass: 0.6 }` | Buttons, chips, icons |
| Playful bounce | `{ damping: 8, stiffness: 160, mass: 1.1 }` | Emoji, stickers, doodles |
| Heavy slam | `{ damping: 26, stiffness: 400, mass: 2 }` | Hook words, impact moments |
| Slow reveal | `{ damping: 100, stiffness: 40 }` | Backgrounds, camera settles |

Rule: one scene uses **one** personality. Mix premium springs for content + playful springs only for accents (emoji, doodles).

## The six laws

1. **One hero motion per beat.** If the title is slamming in, the background only breathes. Never choreograph two focal points at once.
2. **Anticipation before action.** A 3–5 frame counter-move (scale 1→0.94, or dip 10px) before a pop makes it feel physical.
3. **Overshoot, then settle.** Entrances should pass 100% and come back (springs do this naturally — never clamp them to `Math.min(s, 1)` on scale).
4. **Stagger, don't sync.** Lists, letters, cards: offset each by 2–5 frames. Perfect sync reads as a PowerPoint.
5. **Exits are not reversed entrances.** Exit fast and simple (fade + slight drift, 8–12 frames). Save the drama for entrances.
6. **Stillness is a beat.** After a complex move, hold 15–30 frames of near-stillness. Constant motion exhausts the eye and reads as cheap.

## Choreography patterns (copy-paste)

### Letter cascade (kinetic type)
Each letter: entrance spring delayed `i * 2` frames, translateY 40→0, rotate -6→0deg, blur 8→0. Word level: group words in spans and stagger by word instead for long lines.

### Whip-in card
Card starts translateX ±60% of width + rotate ±8deg + opacity 0 → spring (heavy slam). Add a 4-frame motion-blur fake: render a second copy at 0.3 opacity offset 24px backward, fading out over 6 frames.

### Mask reveal (text or media)
```tsx
clipPath: `inset(0 ${interpolate(s, [0, 1], [100, 0])}% 0 0)`
```
Animate the inset with a spring. For diagonal reveals use `polygon()` and interpolate two corner points. Pair with a thin accent bar that leads the mask edge by 4 frames.

### Camera punch (impact moment)
On the impact frame: parent scale 1→1.06 over 3 frames (Easing.out quad) → settle back over 18 frames (spring, damped). Add `<ScreenShake intensity={8} decay={0.85}>` (Pops.tsx) for 10 frames. Never shake longer than 0.4s.

### Hit-stop (game-feel accent)
Freeze **all** animation for 2–3 frames at the moment of impact (gate progress: `const p = frame < hitFrame + 2 ? frozenValue : liveValue`). Then release. Reads as weight.

### Speed ramp (time remapping)
Drive a value with a piecewise-interpolated time curve instead of raw frame:
```tsx
const t = interpolate(frame, [0, 20, 35, 60], [0, 8, 12, 40]); // slow → fast
const y = interpolate(t, [0, 40], [200, -200]);
```
Use for logo fly-throughs and scroll-mock scenes: slow on content, fast through gaps.

### Parallax depth (3+ layers)
Background drifts `frame * 0.2`, mid `0.6`, foreground `1.2` px/frame; foreground also gets `blur(2px)` and scale 1.05. Depth = different speeds + different blur, nothing more.

### Rolling counter (proof beats)
Use `Counter` from TextFX.tsx — eased cubic-out over 30–45 frames, `fontVariantNumeric: 'tabular-nums'` so digits don't jitter. Pop scale 1→1.1→1 when it lands.

### Scramble-in (terminal/hacker energy)
`ScrambleText` from TextFX.tsx. Best on keywords, mono font, 18–24 frames duration. Follow with 2 frames of `GlitchText` if the brand is edgy — never both on body copy.

## Nested composition structure

```
Scene (AbsoluteFill)
├── Background layer (drift only)
├── Content layer (Sequence from=X)   ← hero motion lives here
├── FX layer (particles, pops)        ← Sequence offset to land on beats
└── Grade layer (vignette, grain)     ← static, always last
```

Use `<Sequence premountFor={fps}>` on scenes containing video or 3D so the first visible frame is never a loading state.

## Performance hard rules

- Animate **transform and opacity only**. No width/height/top/left animation.
- No per-frame `Math.random()` — use `random(seed)` from remotion (deterministic) or precompute in `useMemo`.
- Blur radii ≤ 20px, box-shadow ≤ 60px spread. Bigger = slow renders.
- If a scene drops frames in Studio, it will be 10× worse in render. Simplify layers, not frame rate.
