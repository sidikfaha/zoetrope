# Particle Systems

Particles are the cheapest way to make a frame feel alive — and the fastest way to make it look cheap if they're random mush. Two rules make them professional: **determinism** and **closed-form physics**.

## Determinism (non-negotiable)

Remotion re-renders any frame at any time, in any order. Therefore:

- Never `Math.random()`. Use `random(seed)` from `remotion` — a pure hash of the seed string.
- Precompute particle configs once in `useMemo` with seeds like `` `${seed}-${i}` ``.
- Position must be a **pure function of frame**: `x(t) = x0 + vx·t`, never `x += vx` accumulation.

## Closed-form physics

For anything with gravity (confetti, sparks, bursts):

```
t = (frame - startFrame) / fps          // seconds since launch
x = x0 + vx * t
y = y0 + vy * t + 0.5 * g * t²
```

with `g ≈ 1400–2400 px/s²` for confetti, `3000+` for sparks. Rotation: `rot = rot0 + spin * t`. Flutter (confetti): add `Math.sin(t * 6 + phase) * amp` to x. All cheap, all deterministic, all scrub-safe.

## Preset recipes (built into Particles.tsx)

| Preset | Count | Look | Motion | Use for |
|---|---|---|---|---|
| `confetti` | 120 | Small rects, brand colors, spinning | Up-cone launch + gravity + flutter | Feature moments, CTA celebration |
| `burst` | 40 | Tiny circles, accent color | Radial 360°, 25-frame life, shrink out | Pops on keyword, click moments |
| `sparks` | 50 | 2×18px streaks, hot color, glow | Fast cone + heavy gravity, 35-frame life | Impact frames, "power" features |
| `dust` | 60 | 2–5px soft dots | Slow rise + sine sway, twinkle opacity | Ambient life on any dark scene |
| `bokeh` | 18 | 20–80px blurred circles | Very slow float, low opacity | Premium backgrounds, depth |
| `stars` | 90 | 1–3px dots | Static + opacity twinkle, slight parallax | Night/space themes, calm scenes |

## Usage

```tsx
// Ambient: mount for the whole scene
<Particles preset="dust" />

// One-shot: mount in a Sequence starting ON the beat frame —
// physics start at frame 0 of the component
<Sequence from={keywordFrame} durationInFrames={70}>
  <Particles preset="burst" origin={{ x: 0.5, y: 0.42 }} colors={[theme.colors.emphasis]} />
</Sequence>
```

`origin` is in 0–1 screen space. For confetti synced to a voiceover word, start the Sequence exactly on the word's frame from the word-timing JSON.

## Taste rules

- **One particle system per scene**, two max (ambient + one-shot). Confetti + dust + sparks together = birthday clown.
- Match the palette: default colors come from `theme.colors` — override only to echo the emphasis word.
- Ambient particles should be **barely noticeable**: opacity ≤ 0.5, count low. If the viewer consciously sees dust, there's too much.
- One-shots must die: `durationInFrames` long enough for gravity to finish (confetti ~90f, burst ~30f, sparks ~40f). Lingering particles on the next scene break the cut.
- On light backgrounds use darker/more saturated particle colors; on dark, lighter + `mixBlendMode: 'screen'` for glow presets.

## Performance

- Hard caps: confetti 150, dust 80, stars 120, bokeh 25. Beyond that renders crawl and nobody can tell the difference.
- Particles render as `<div>`s with `transform: translate3d(...) rotate(...)`. No layout props, no SVG per particle.
- Blur only bokeh (few, big). Never blur 100 small elements.
- If a scene needs thousands of particles (sand, rain), that's a shader/job for ThreeScene with `THREE.Points` — see three-3d.md.
