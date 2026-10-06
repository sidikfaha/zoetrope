// Zoetrope — text effects: scramble decode, typewriter, glitch, wave, rolling counter.
// All deterministic (seeded random / pure functions of frame). See references/animation-recipes.md.
import React from 'react';
import { random, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { theme } from '../theme';

const GLYPHS = '!<>-_\\/[]{}=+*^?#@$%&';

/** Decode/scramble-in — terminal energy for keywords. Mono font recommended. */
export const ScrambleText: React.FC<{
  text: string;
  delay?: number;
  durationInFrames?: number;
  color?: string;
  hotColor?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, durationInFrames = 26, color = theme.colors.fg, hotColor = theme.colors.accentAlt, style }) => {
  const frame = useCurrentFrame();
  const n = text.length;
  return (
    <span style={style}>
      {text.split('').map((ch, i) => {
        if (ch === ' ') return <span key={i}> </span>;
        const revealAt = delay + (i / n) * durationInFrames * 0.6;
        const settledAt = revealAt + durationInFrames * 0.4;
        if (frame < revealAt) {
          return <span key={i} style={{ opacity: 0 }}>{ch}</span>;
        }
        if (frame >= settledAt) {
          return <span key={i} style={{ color }}>{ch}</span>;
        }
        const g = GLYPHS[Math.floor(random(`scr-${i}-${Math.floor(frame / 2)}`) * GLYPHS.length)];
        return (
          <span key={i} style={{ color: hotColor, opacity: 0.9 }}>
            {g}
          </span>
        );
      })}
    </span>
  );
};

/** Typewriter with blinking caret. */
export const Typewriter: React.FC<{
  text: string;
  cps?: number;
  delay?: number;
  caret?: boolean;
  style?: React.CSSProperties;
}> = ({ text, cps = 20, delay = 0, caret = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = Math.min(text.length, Math.max(0, Math.floor(((frame - delay) / fps) * cps)));
  const caretOn = Math.floor(frame / 16) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, shown)}
      {caret ? <span style={{ opacity: caretOn ? 1 : 0, color: theme.colors.accentAlt }}>▍</span> : null}
    </span>
  );
};

/** RGB-split glitch text — short SPIKES of chaos (5 frames every ~1.5s), clean in between. Never for body copy. */
export const GlitchText: React.FC<{
  text: string;
  intensity?: number;
  spikeEvery?: number;
  style?: React.CSSProperties;
}> = ({ text, intensity = 1, spikeEvery = 45, style }) => {
  const frame = useCurrentFrame();
  const cycle = frame % spikeEvery;
  const active = cycle < 5; // brief spike, then calm
  const q = Math.floor(frame / 2); // step the jitter every 2 frames
  const amp = active ? intensity : 0;
  const dx1 = (random(`gt1-${q}`) - 0.5) * 12 * amp;
  const dx2 = (random(`gt2-${q}`) - 0.5) * 12 * amp;
  const clip1 = random(`gc1-${q}`) * 60;
  const clip2 = random(`gc2-${q}`) * 60;
  const layerOpacity = active ? 0.85 : 0;
  return (
    <span style={{ position: 'relative', display: 'inline-block', color: theme.colors.fg, ...style }}>
      <span style={{ position: 'relative' }}>{text}</span>
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0, color: theme.colors.accentAlt,
          transform: `translateX(${dx1}px)`,
          clipPath: `inset(${clip1}% 0 ${100 - clip1 - 18}% 0)`,
          opacity: layerOpacity,
        }}
      >
        {text}
      </span>
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0, color: theme.colors.danger,
          transform: `translateX(${dx2}px)`,
          clipPath: `inset(${clip2}% 0 ${100 - clip2 - 18}% 0)`,
          opacity: layerOpacity,
        }}
      >
        {text}
      </span>
    </span>
  );
};

/** Per-letter sine bounce after a staggered entrance — playful headlines. */
export const WaveText: React.FC<{
  text: string;
  amplitude?: number;
  staggerFrames?: number;
  style?: React.CSSProperties;
}> = ({ text, amplitude = 9, staggerFrames = 2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={{ display: 'inline-block', ...style }}>
      {text.split('').map((ch, i) => {
        const s = spring({ frame: frame - i * staggerFrames, fps, config: { damping: 9, stiffness: 150, mass: 0.8 } });
        const y = Math.sin((frame - i * 3) / 7) * amplitude * Math.min(1, s);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: Math.max(0.01, Math.min(s, 1)),
              transform: `translateY(${y}px) scale(${Math.max(0.01, s)})`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/** Eased rolling counter for proof beats — "10,000 teams", "4.9★". */
export const Counter: React.FC<{
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  durationInFrames?: number;
  style?: React.CSSProperties;
}> = ({ to, from = 0, decimals = 0, prefix = '', suffix = '', delay = 0, durationInFrames = 40, style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + durationInFrames], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const text = v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
};
