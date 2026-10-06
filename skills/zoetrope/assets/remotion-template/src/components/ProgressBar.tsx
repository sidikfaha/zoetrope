// Zoetrope — thin story-style progress bar across the top edge.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

export const ProgressBar: React.FC<{ height?: number; opacity?: number }> = ({
  height = 6,
  opacity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const p = Math.min(1, frame / durationInFrames);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        background: 'rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          width: Math.round(width * p),
          height: '100%',
          background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accentAlt})`,
          opacity,
          borderRadius: `0 ${height / 2}px ${height / 2}px 0`,
        }}
      />
    </div>
  );
};
