// Zoetrope — hand-drawn doodles: sketchy draw-on SVG annotations with a boiling-line wobble.
// See references/doodle.md. RULES: round linecaps, damped draw-on springs, ONE doodle accent per scene.
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { theme } from '../theme';

/** SVG filter that makes strokes "boil" like hand-drawn animation (seed steps every 3 frames). */
export const WobbleFilter: React.FC<{ id: string; scale?: number; baseFrequency?: number }> = ({
  id,
  scale = 1.8,
  baseFrequency = 0.025,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }}>
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={2}
          seed={Math.floor(frame / 3)}
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} />
      </filter>
    </svg>
  );
};

/** Core draw-on path. Progress is a slow damped spring — like a marker moving. */
export const DrawOn: React.FC<{
  d: string;
  viewBox?: string;
  width: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  wobbleId?: string; // pass a WobbleFilter id to boil the stroke
  style?: React.CSSProperties;
}> = ({ d, viewBox = '0 0 100 100', width, color = theme.colors.emphasis, strokeWidth = 5, delay = 0, wobbleId, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 100, stiffness: 60 } });
  const { strokeDasharray, strokeDashoffset } = evolvePath(Math.max(0, Math.min(progress, 1)), d);
  const height = (width * parseFloat(viewBox.split(' ')[3])) / parseFloat(viewBox.split(' ')[2]);
  return (
    <svg width={width} height={height} viewBox={viewBox} style={{ overflow: 'visible', ...style }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        filter={wobbleId ? `url(#${wobbleId})` : undefined}
      />
    </svg>
  );
};

/** Rough circle (~1.15 turns, overshoots the start) — circle a word, emoji, or UI element. */
export const SketchCircle: React.FC<{ width?: number; color?: string; delay?: number; wobbleId?: string }> = ({
  width = 240,
  color,
  delay = 0,
  wobbleId,
}) => (
  <DrawOn
    d="M 50 6 C 74 4 94 22 94 50 C 94 78 74 96 48 94 C 24 92 6 74 8 48 C 10 24 32 8 62 12"
    width={width}
    color={color}
    delay={delay}
    wobbleId={wobbleId}
  />
);

/** Curved arrow — point at the CTA. flipX/flipY to aim it. Head draws after the shaft. */
export const SketchArrow: React.FC<{
  width?: number;
  color?: string;
  delay?: number;
  flipX?: boolean;
  flipY?: boolean;
  wobbleId?: string;
}> = ({ width = 220, color = theme.colors.emphasis, delay = 0, flipX, flipY, wobbleId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shaft = spring({ frame: frame - delay, fps, config: { damping: 100, stiffness: 70 } });
  const head = spring({ frame: frame - delay - 10, fps, config: { damping: 100, stiffness: 90 } });
  const shaftD = 'M 8 18 C 28 46 56 60 84 62';
  const headD = 'M 68 48 C 74 54 80 58 87 63 C 80 66 73 71 67 78';
  const s1 = evolvePath(Math.max(0, Math.min(shaft, 1)), shaftD);
  const s2 = evolvePath(Math.max(0, Math.min(head, 1)), headD);
  const height = width * 0.9;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 90"
      style={{ overflow: 'visible', transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` }}
    >
      <g filter={wobbleId ? `url(#${wobbleId})` : undefined}>
        <path d={shaftD} fill="none" stroke={color} strokeWidth={5.5} strokeLinecap="round" strokeDasharray={s1.strokeDasharray} strokeDashoffset={s1.strokeDashoffset} />
        <path d={headD} fill="none" stroke={color} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s2.strokeDasharray} strokeDashoffset={s2.strokeDashoffset} />
      </g>
    </svg>
  );
};

/** Wavy underline for one emphasized word. */
export const SketchUnderline: React.FC<{ width?: number; color?: string; delay?: number; wobbleId?: string }> = ({
  width = 200,
  color,
  delay = 0,
  wobbleId,
}) => (
  <DrawOn
    d="M 4 26 C 22 18 40 30 60 24 C 74 20 88 24 96 21"
    viewBox="0 0 100 40"
    width={width}
    color={color}
    delay={delay}
    wobbleId={wobbleId}
  />
);

/** Marker check — do lists, delivered promises. */
export const SketchCheck: React.FC<{ width?: number; color?: string; delay?: number; wobbleId?: string }> = ({
  width = 64,
  color = '#3DDC84',
  delay = 0,
  wobbleId,
}) => (
  <DrawOn d="M 12 52 C 20 62 26 70 33 79 C 48 55 68 32 90 14" width={width} color={color} strokeWidth={8} delay={delay} wobbleId={wobbleId} />
);

/** Marker cross — don't lists, the old way. */
export const SketchCross: React.FC<{ width?: number; color?: string; delay?: number; wobbleId?: string }> = ({
  width = 64,
  color = theme.colors.danger,
  delay = 0,
  wobbleId,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p1 = spring({ frame: frame - delay, fps, config: { damping: 100, stiffness: 110 } });
  const p2 = spring({ frame: frame - delay - 6, fps, config: { damping: 100, stiffness: 110 } });
  const d1 = 'M 18 18 C 36 38 58 62 82 82';
  const d2 = 'M 82 18 C 62 40 40 62 18 82';
  const e1 = evolvePath(Math.max(0, Math.min(p1, 1)), d1);
  const e2 = evolvePath(Math.max(0, Math.min(p2, 1)), d2);
  return (
    <svg width={width} height={width} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <g filter={wobbleId ? `url(#${wobbleId})` : undefined}>
        <path d={d1} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={e1.strokeDasharray} strokeDashoffset={e1.strokeDashoffset} />
        <path d={d2} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={e2.strokeDasharray} strokeDashoffset={e2.strokeDashoffset} />
      </g>
    </svg>
  );
};

/** 4-point spark — "new!", ratings, delight moments. */
export const SketchSpark: React.FC<{ width?: number; color?: string; delay?: number; wobbleId?: string }> = ({
  width = 72,
  color = theme.colors.emphasis,
  delay = 0,
  wobbleId,
}) => (
  <DrawOn
    d="M 50 4 C 54 30 58 36 86 40 C 60 46 54 52 50 86 C 46 52 40 46 14 40 C 42 36 46 30 50 4"
    width={width}
    color={color}
    strokeWidth={4.5}
    delay={delay}
    wobbleId={wobbleId}
  />
);

/** Marker highlight swipe behind text. Put text as children; the swipe renders behind it. */
export const Highlight: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
}> = ({ children, color = theme.colors.emphasis, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 60, stiffness: 90 } });
  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 0.12em' }}>
      <span
        style={{
          position: 'absolute',
          inset: '0.02em -0.04em',
          background: color,
          opacity: 0.32,
          borderRadius: '0.18em',
          transform: `scaleX(${Math.max(0.001, s)}) rotate(-1.2deg)`,
          transformOrigin: 'left center',
        }}
      />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};
