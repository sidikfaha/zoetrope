# Transition Design

A transition is a **promise about the relationship between two scenes**. Pick it on purpose: a hard cut says "same story, next beat", a whip pan says "we're moving fast", a light leak says "new chapter". Random transitions say nothing.

## The rules

1. **Sound leads picture.** The whoosh/impact starts 2–4 frames *before* the visual transition. The ear forgives what the eye barely catches.
2. **12-frame sweet spot.** At 30fps: 8–16 frames for most transitions. Faster reads as a glitch cut, slower as a dissolve (both valid — when intentional).
3. **Motion continuity.** If scene A exits moving right, scene B enters from the left already moving right. The camera never stops; only the content changes.
4. **One transition style per video** for scene-to-scene (your "house style"), plus **one special transition** reserved for the single biggest moment (usually the reveal). Variety packs are for demos, not products.
5. **Never transition INTO stillness.** The incoming scene should already be mid-motion (entrance spring running) when the wipe completes.

## The library

Built-in (`@remotion/transitions`): `slide()`, `wipe()`, `fade()`, `flip()`, `clockWipe()`. Custom (TransitionsFX.tsx): `whipPan()`, `zoomPunch()`, `glitch()`, `lightLeak()`, `irisWipe()`.

| Transition | Says | Best for | SFX pairing |
|---|---|---|---|
| Hard cut | "next beat" | Most beats, tight pacing | none, or a tick |
| `slide()` / `wipe()` | "orderly progression" | Feature lists | soft whoosh |
| `whipPan()` | "fast, confident" | Hook → problem, problem → reveal | whoosh (louder) |
| `zoomPunch()` | "pay attention NOW" | Into the reveal, into CTA | impact + riser stop |
| `glitch()` | "broken → fixed", techy | Problem beats, dev tools | digital glitch SFX |
| `lightLeak()` | "new chapter", warmth | Reveal, emotional shifts | riser → swell |
| `irisWipe()` | playful, retro | Doodle/handmade brands | pop |
| `fade()` through black | "section break" | Before CTA if pace needs breath | music dip |

Timing: `linearTiming({ durationInFrames: 12 })` for wipes/slides; `springTiming({ config: { damping: 200 }, durationInFrames: 18 })` for punch/flip (spring gives the overshoot).

## Custom presentation pattern

A transition is a component that wraps a scene and maps `presentationProgress` (0→1) + `presentationDirection` ('entering' | 'exiting') to a style:

```tsx
import { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';

const MyWipe: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children, presentationDirection, presentationProgress,
}) => {
  const style: React.CSSProperties =
    presentationDirection === 'entering'
      ? { clipPath: `inset(0 0 0 ${(1 - presentationProgress) * 100}%)` }
      : {};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const myWipe = (): TransitionPresentation<Record<string, never>> => ({
  component: MyWipe, props: {},
});
```

Usage:

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}><SceneA /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={whipPan()} timing={linearTiming({ durationInFrames: 12 })} />
  <TransitionSeries.Sequence durationInFrames={90}><SceneB /></TransitionSeries.Sequence>
</TransitionSeries>
```

Remember: each sequence **loses** the transition overlap from its visible time — total duration = Σ sequences − Σ transitions. The template's `LaunchReel` already handles this math via `transitionFrames`.

## Match cuts (the pro move)

End scene A with an element at position X, size S — start scene B with a *different* element at the same X, S (circle → circle, card → phone screen). Even a hard cut feels like magic. Plan match cuts in the storyboard, not in the editor.

## Anti-patterns

- Star wipes, page curls, spins — instant 2009 energy.
- A different transition between every scene.
- Transitions longer than the beat they connect (a 1s transition into a 2s scene eats the scene).
- Glitch transitions in a premium/calm brand video (and vice versa: gentle fades in a hype reel).
