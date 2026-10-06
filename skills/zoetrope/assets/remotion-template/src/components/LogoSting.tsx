// Zoetrope — logo sting: anticipation pull-back → slam → overshoot settle → glow bloom.
import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile, interpolate } from 'remotion';
import { entrance, cameraEase } from '../lib/animation';
import { theme } from '../theme';

export const LogoSting: React.FC<{
  logo?: string;        // staticFile() path, e.g. 'logo.png'. If omitted, renders productName as type.
  productName?: string;
}> = ({ logo, productName = '' }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // anticipation: slight shrink frames 0-6, then slam in with overshoot
  const antic = cameraEase(frame, 0, 6, 1, 0.92);
  const slam = entrance(frame, fps, 6);
  const scale = frame < 6 ? antic : 0.92 + slam * 0.08;
  const glow = interpolate(frame, [8, 20], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const size = Math.round(width * 0.42);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: Math.max(0.01, frame < 6 ? 1 : slam),
          boxShadow: `0 0 ${120 * glow}px ${theme.colors.accent}66`,
          borderRadius: 32,
        }}
      >
        {logo ? (
          <Img src={staticFile(logo)} style={{ width: size, height: size, objectFit: 'contain' }} />
        ) : (
          <div
            style={{
              fontFamily: `${theme.fonts.display}, sans-serif`,
              fontWeight: 900,
              fontSize: Math.round(width * 0.11),
              color: theme.colors.fg,
              letterSpacing: '-0.02em',
            }}
          >
            {productName}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
