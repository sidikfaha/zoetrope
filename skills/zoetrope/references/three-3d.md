# 3D with Three.js (`@remotion/three`)

Real 3D in the render pipeline via React Three Fiber. Use it for what 2D can't fake: rotating product pedestals, floating glass/metal shapes, depth fly-throughs. Not for text or UI — 2D beats 3D there every time.

## Setup

```bash
npm install @remotion/three@<same-version-as-remotion> three @react-three/fiber
```

Then enable WebGL in headless Chrome — without this, renders die with `THREE.WebGLRenderer: Error creating WebGL context` (`setup_project.sh` does it automatically):

```ts
// remotion.config.ts
Config.setChromiumOpenGlRenderer("angle"); // fall back to "swiftshader" on machines where "angle" fails
```

**Version law:** every `@remotion/*` package must be the exact same version (`npx remotion versions` checks). React 19 → `@react-three/fiber` v9, `three` ≥ 0.167.

## The one rule that matters

**Drive everything from `useCurrentFrame()` — never from `useFrame`, clocks, or `Date.now()`.** Remotion renders frames out of order; a clock-based animation renders as garbage. Compute `frame` in the outer component and pass it down as a prop:

```tsx
export const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();          // ✅ outside, passed down
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 7], fov: 40 }}>
      <FloatShapes frame={frame} />
    </ThreeCanvas>
  );
};
```

Rotation per frame: `rotation={[frame * 0.01, frame * 0.013, 0]}` — that's it. Deterministic, scrub-safe, render-safe.

## Camera choreography

Move the camera like a cinematographer, not a screensaver:

```tsx
const camZ = interpolate(frame, [0, 90], [9, 5.5], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const camX = Math.sin(frame / 120) * 0.8;   // gentle sway
camera.position.set(camX, 0, camZ); camera.lookAt(0, 0, 0);
```

- One slow dolly per scene beats constant orbiting.
- Keep `fov` 35–45 for product looks (longer lens = more premium).
- Sway amplitude < 1 unit; the viewer should feel it, not see it.

## Lighting recipes

| Look | Setup |
|---|---|
| Premium product | `ambientLight 0.3` + `directionalLight [5,5,5] intensity 1.2` + `pointLight [-6,-4,-2]` in accent color, intensity 8 |
| Neon/energy | No ambient; two `pointLight`s in `accent`/`accentAlt` at ±4 units, intensity 12–20 |
| Soft/dreamy | `ambientLight 0.8` + one `pointLight` white, low intensity |

Materials: `meshStandardMaterial` with `metalness 0.6–0.9, roughness 0.15–0.35` for glass/metal premium; `metalness 0, roughness 0.9` for clay/playful. Brand-colored emissive (`emissive={accent} emissiveIntensity={0.4}`) makes shapes glow on dark backgrounds.

## Recipes in ThreeScene.tsx

- **`<Float3D variant="shapes">`** — torus knot + icosahedron + ring, brand materials, sine-bob floating, slow dolly. Instant premium background for a reveal or CTA scene.
- **`<Float3D variant="pedestal">`** — rotating cylinder pedestal + product box/card on top, turntable rotation `frame * 0.02`. Mount a screenshot on the box face with `useTexture` if needed.
- Thousands of particles → `THREE.Points` with a precomputed position buffer (see particles.md) — 2D divs can't do this.

## Render performance (headless Chrome = software GL)

Renders use SwiftShader — 3D is the slowest thing in the pipeline. Budget for it:

- `dpr={1}` on ThreeCanvas, always.
- Geometry segments modest: `<torusKnotGeometry args={[1, 0.32, 128, 24]} />` is plenty; never 512.
- No shadows (`castShadow`/`receiveShadow` off), no postprocessing, no environment maps (fake reflections with metalness + colored lights).
- Keep 3D scenes ≤ 5s of the final video; intercut with 2D.
- `<Sequence premountFor={fps}>` so the canvas is warm before its first visible frame.

## Compositing with 2D

ThreeCanvas renders on its own canvas — blend it into the scene like any layer:

- Match the canvas background to `theme.colors.bg` (set `style={{ background }}`), or use `gl={{ alpha: true, preserveDrawingBuffer: true }}` + transparent canvas and layer 2D under/over it.
- Always grade over it: the template's vignette + a grain layer on top make 3D and 2D feel like one world.
- 2D captions/CTAs go **above** the 3D layer — never render text in WebGL.
