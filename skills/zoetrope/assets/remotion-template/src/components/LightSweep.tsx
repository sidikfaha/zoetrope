// Zoetrope — diagonal light sweep. Fires once, e.g. on a logo reveal or CTA landing.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

export const LightSweep: React.FC<{
  at?: number;          // local frame to fire
  duration?: number;    // sweep length in frames
  angle?: number;       // deg
  opacity?: number;
}> = ({ at = 0, duration = 22, angle = 18, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  if (p <= 0 || p >= 1) return null;
  const x = -width + p * width * 2.4;
  const band = Math.round(width * 0.35);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: -height * 0.2,
          left: x,
          width: band,
          height: height * 1.4,
          transform: `rotate(${angle}deg)`,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
          opacity: opacity * Math.sin(p * Math.PI),
          filter: 'blur(6px)',
        }}
      />
    </AbsoluteFill>
  );
};
