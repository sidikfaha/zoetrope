// Zoetrope — animated backgrounds. Layered aurora mesh + vignette for a cinematic base.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { theme } from '../theme';
import { drift } from '../lib/animation';

const Blob: React.FC<{
  x: number; y: number; size: number; color: string; opacity: number; blur: number; phase: number;
}> = ({ x, y, size, color, opacity, blur, phase }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 85 + phase) * 60;
  const dy = Math.cos(frame / 110 + phase * 1.7) * 46;
  const sc = 1 + Math.sin(frame / 95 + phase * 2.3) * 0.08;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 62%)`,
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translate(${dx}px, ${dy}px) scale(${sc})`,
      }}
    />
  );
};

/** Cinematic aurora mesh — the default scene base. variant shifts the mood. */
export const AuroraMesh: React.FC<{ variant?: 'default' | 'reveal' | 'problem' }> = ({
  variant = 'default',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const d = drift(frame, 6);
  const dim = variant === 'problem' ? 0.5 : 1;
  const hot = variant === 'reveal' ? 1.5 : 1;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${150 + d}deg, #07070D 0%, ${theme.colors.bg} 45%, #0E0B1C 100%)`,
        overflow: 'hidden',
      }}
    >
      <Blob x={-width * 0.2} y={height * 0.05} size={width * 1.1} color={theme.colors.accent}
            opacity={0.28 * dim * hot} blur={70} phase={0} />
      <Blob x={width * 0.35} y={height * 0.45} size={width * 0.95} color={theme.colors.accentAlt}
            opacity={0.18 * dim} blur={80} phase={2.1} />
      <Blob x={width * 0.1} y={height * 0.75} size={width * 0.8} color={'#FF5C7A'}
            opacity={0.10 * dim} blur={90} phase={4.4} />
      {/* slow rotating light ray */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.5 - width * 0.9,
          top: -height * 0.3,
          width: width * 1.8,
          height: height * 1.6,
          background: `conic-gradient(from ${frame * 0.4}deg at 50% 50%, transparent 0deg, ${theme.colors.accent}14 40deg, transparent 90deg)`,
          opacity: 0.6 * dim,
        }}
      />
      <Vignette />
    </AbsoluteFill>
  );
};

/** Darkened edges — instant cinema. Render inside any scene base. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 90% 75% at 50% 46%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Floating particle field — depth layer. Seeded random: render-safe (rule #2). */
export const Particles: React.FC<{ count?: number }> = ({ count = 18 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`px-${i}`) * width;
        const baseY = random(`py-${i}`) * height;
        const r = 2 + random(`pr-${i}`) * 5;
        const speed = 0.2 + random(`ps-${i}`) * 0.5;
        const y = (baseY - frame * speed + height) % height;
        const tw = 0.25 + 0.35 * Math.sin(frame / 20 + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              background: theme.colors.accentAlt,
              opacity: tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
