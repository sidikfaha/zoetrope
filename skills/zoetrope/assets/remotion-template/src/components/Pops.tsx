// Zoetrope — pop & impact accents. Mount inside a <Sequence from={beatFrame}> so frame 0 = the beat.
import React from 'react';
import { random, useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { theme } from '../theme';

/** Expanding ring that dies as it grows — the classic "pop" accent. */
export const RingPop: React.FC<{
  size?: number;
  color?: string;
  delay?: number;
  durationInFrames?: number;
}> = ({ size = 220, color = theme.colors.emphasis, delay = 0, durationInFrames = 20 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${interpolate(p, [0, 1], [14, 1.5])}px solid ${color}`,
        opacity: interpolate(p, [0, 0.12, 1], [0, 0.9, 0]),
        transform: `scale(${interpolate(p, [0, 1], [0.25, 1.7])})`,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Radiating line starburst — pair with a keyword landing or a logo sting. */
export const StarBurst: React.FC<{
  rays?: number;
  length?: number;
  color?: string;
  delay?: number;
  durationInFrames?: number;
}> = ({ rays = 10, length = 130, color = theme.colors.emphasis, delay = 0, durationInFrames = 22 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (p <= 0 || p >= 1) return null;
  const ease = 1 - Math.pow(1 - p, 3);
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
      {new Array(rays).fill(0).map((_, i) => {
        const angle = (360 / rays) * i + (i % 2 === 0 ? 8 : -8);
        const len = length * (i % 2 === 0 ? 1 : 0.62) * ease;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -2,
              top: -len,
              width: 4,
              height: len,
              borderRadius: 2,
              background: color,
              opacity: 1 - p,
              transformOrigin: '50% 100%',
              transform: `rotate(${angle}deg)`,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Emoji (or any glyph) that springs in with playful overshoot and a settle wobble. */
export const EmojiPop: React.FC<{
  emoji: string;
  size?: number;
  delay?: number;
  rotate?: number;
}> = ({ emoji, size = 120, delay = 0, rotate = -8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 170, mass: 0.9 } });
  const settled = s > 0.98;
  const wobble = settled ? Math.sin((frame - delay) / 5) * 2.5 : 0;
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: 'absolute',
        fontSize: size,
        lineHeight: 1,
        transform: `scale(${Math.max(0.01, s)}) rotate(${rotate * (1 - s) + wobble}deg)`,
        filter: `drop-shadow(0 10px 24px rgba(0,0,0,0.45))`,
        pointerEvents: 'none',
      }}
    >
      {emoji}
    </div>
  );
};

/** Full-frame flash for impact moments — mount on the exact impact frame. 10 frames, gone. */
export const ImpactFlash: React.FC<{ color?: string; peak?: number }> = ({ color = '#FFFFFF', peak = 0.8 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 2, 10], [peak, peak * 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity, pointerEvents: 'none' }} />;
};

/** Decaying screen shake wrapper — deterministic, GPU-cheap. */
export const ScreenShake: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  decay?: number;
  durationInFrames?: number;
  seed?: string;
}> = ({ children, intensity = 9, decay = 0.82, durationInFrames = 14, seed = 'shake' }) => {
  const frame = useCurrentFrame();
  if (frame >= durationInFrames) return <>{children}</>;
  const amp = intensity * Math.pow(decay, frame);
  const dx = (random(`${seed}-x-${frame}`) - 0.5) * 2 * amp;
  const dy = (random(`${seed}-y-${frame}`) - 0.5) * 2 * amp;
  const rot = (random(`${seed}-r-${frame}`) - 0.5) * amp * 0.12;
  return (
    <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)` }}>
      {children}
    </AbsoluteFill>
  );
};
