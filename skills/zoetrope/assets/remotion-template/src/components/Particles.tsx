// Zoetrope — deterministic particle systems. See references/particles.md.
// RULES: seeded random() only, closed-form physics (pure function of frame), transform-only.
import React, { useMemo } from 'react';
import { random, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../theme';

export type ParticlePreset = 'confetti' | 'burst' | 'sparks' | 'dust' | 'bokeh' | 'stars';

const DEFAULT_COUNT: Record<ParticlePreset, number> = {
  confetti: 120,
  burst: 40,
  sparks: 50,
  dust: 60,
  bokeh: 18,
  stars: 90,
};

const LIFETIME: Record<ParticlePreset, number> = {
  confetti: 90,
  burst: 26,
  sparks: 38,
  dust: Infinity,
  bokeh: Infinity,
  stars: Infinity,
};

interface ParticleSpec {
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  g: number;
  w: number;
  h: number;
  rot0: number;
  spin: number;
  color: string;
  phase: number;
  amp: number;
  freq: number;
  blur: number;
  opacity: number;
  round: boolean;
  glow: boolean;
  depth: number;
}

export const Particles: React.FC<{
  preset?: ParticlePreset;
  count?: number;
  colors?: string[];
  seed?: string;
  /** launch point in 0–1 screen space (confetti / burst / sparks) */
  origin?: { x: number; y: number };
}> = ({
  preset = 'dust',
  count,
  colors = [theme.colors.accent, theme.colors.accentAlt, theme.colors.emphasis, theme.colors.fg],
  seed = 'rf',
  origin = { x: 0.5, y: 0.45 },
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const specs = useMemo<ParticleSpec[]>(() => {
    const n = count ?? DEFAULT_COUNT[preset];
    const ox = origin.x * width;
    const oy = origin.y * height;
    return new Array(n).fill(0).map((_, i): ParticleSpec => {
      const r = (k: string) => random(`${seed}-${preset}-${i}-${k}`);
      if (preset === 'confetti') {
        const angle = -Math.PI / 2 + (r('a') - 0.5) * 1.7;
        const speed = 500 + r('s') * 800;
        return {
          x0: ox, y0: oy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, g: 1800,
          w: 8 + r('w') * 6, h: 12 + r('h') * 8,
          rot0: r('r') * 360, spin: (r('sp') - 0.5) * 720,
          color: colors[i % colors.length],
          phase: r('p') * Math.PI * 2, amp: 10 + r('am') * 30, freq: 4 + r('f') * 4,
          blur: 0, opacity: 0.95, round: r('ro') > 0.7, glow: false, depth: 1,
        };
      }
      if (preset === 'burst') {
        const angle = (i / n) * Math.PI * 2 + (r('a') - 0.5) * 0.5;
        const dist = 140 + r('s') * 380;
        return {
          x0: ox, y0: oy,
          vx: Math.cos(angle) * dist, vy: Math.sin(angle) * dist, g: 0,
          w: 4 + r('w') * 7, h: 4 + r('w') * 7,
          rot0: 0, spin: 0,
          color: colors[i % colors.length],
          phase: 0, amp: 0, freq: 0,
          blur: 0, opacity: 1, round: true, glow: true, depth: 1,
        };
      }
      if (preset === 'sparks') {
        const angle = -Math.PI / 2 + (r('a') - 0.5) * 1.2;
        const speed = 900 + r('s') * 900;
        return {
          x0: ox, y0: oy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, g: 2600,
          w: 3, h: 14 + r('h') * 12,
          rot0: 0, spin: 0,
          color: r('c') > 0.4 ? theme.colors.emphasis : '#FFFFFF',
          phase: 0, amp: 0, freq: 0,
          blur: 0, opacity: 1, round: false, glow: true, depth: 1,
        };
      }
      if (preset === 'bokeh') {
        const size = 20 + r('w') * 60;
        return {
          x0: r('x') * width, y0: r('y') * height,
          vx: (r('vx') - 0.5) * 16, vy: (r('vy') - 0.5) * 12, g: 0,
          w: size, h: size,
          rot0: 0, spin: 0,
          color: [theme.colors.accent, theme.colors.accentAlt, theme.colors.muted][i % 3],
          phase: r('p') * Math.PI * 2, amp: 14 + r('am') * 20, freq: 0.15 + r('f') * 0.2,
          blur: Math.round(size / 4), opacity: 0.05 + r('o') * 0.09, round: true, glow: false,
          depth: 0.3 + r('d') * 0.7,
        };
      }
      if (preset === 'stars') {
        const size = 1 + r('w') * 2.2;
        return {
          x0: r('x') * width, y0: r('y') * height,
          vx: 0, vy: 0, g: 0,
          w: size, h: size,
          rot0: 0, spin: 0,
          color: '#FFFFFF',
          phase: r('p') * Math.PI * 2, amp: 0, freq: 0.4 + r('f') * 0.8,
          blur: 0, opacity: 0.25 + r('o') * 0.6, round: true, glow: false,
          depth: 0.2 + r('d') * 0.8,
        };
      }
      // dust
      const size = 2 + r('w') * 3;
      return {
        x0: r('x') * width, y0: r('y') * height,
        vx: (r('vx') - 0.5) * 10, vy: -(12 + r('vy') * 18), g: 0,
        w: size, h: size,
        rot0: 0, spin: 0,
        color: theme.colors.fg,
        phase: r('p') * Math.PI * 2, amp: 10 + r('am') * 15, freq: 0.2 + r('f') * 0.3,
        blur: 0, opacity: 0.15 + r('o') * 0.3, round: true, glow: false, depth: 1,
      };
    });
  }, [preset, count, seed, colors, width, height, origin.x, origin.y]);

  const t = frame / fps;
  const life = LIFETIME[preset];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {specs.map((p, i) => {
        const tN = life === Infinity ? 0 : Math.min(frame / life, 1);
        if (tN >= 1) return null;

        let x: number;
        let y: number;
        if (preset === 'burst') {
          const ease = 1 - Math.pow(1 - tN, 3);
          x = p.x0 + p.vx * ease;
          y = p.y0 + p.vy * ease;
        } else if (preset === 'dust') {
          const span = height + 60;
          y = (((p.y0 + p.vy * t) % span) + span) % span - 30;
          x = p.x0 + p.vx * t + Math.sin(t * p.freq * Math.PI * 2 + p.phase) * p.amp;
        } else {
          x = p.x0 + p.vx * t + Math.sin(t * p.freq + p.phase) * p.amp;
          y = p.y0 + p.vy * t + 0.5 * p.g * t * t;
        }

        let opacity = p.opacity;
        if (preset === 'stars' || preset === 'dust') {
          opacity *= 0.55 + 0.45 * Math.sin(t * p.freq * Math.PI * 2 + p.phase);
        }
        if (life !== Infinity) {
          opacity *= interpolate(tN, [0.65, 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        }
        if (preset === 'confetti') {
          // fade in over the first 3 frames so the launch doesn't pop
          opacity *= interpolate(frame, [0, 3], [0.01, 1], { extrapolateRight: 'clamp' });
        }

        const scale = preset === 'burst' ? interpolate(tN, [0, 1], [1, 0.2]) : 1;
        const rot = preset === 'sparks'
          ? (Math.atan2(p.vy + p.g * t, p.vx) * 180) / Math.PI + 90
          : p.rot0 + p.spin * t;
        // stars drift slightly by depth for parallax
        const px = preset === 'stars' ? x + frame * 0.02 * p.depth : x;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: p.w,
              height: p.h,
              borderRadius: p.round ? '50%' : 2,
              background: p.color,
              opacity: Math.max(0, opacity),
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              boxShadow: p.glow ? `0 0 8px ${p.color}` : undefined,
              transform: `translate3d(${px}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`,
            }}
          />
        );
      })}
    </div>
  );
};
