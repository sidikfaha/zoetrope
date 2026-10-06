// Zoetrope — platform safe zones (1080×1920 reference frame) + dev overlay.
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

/** Conservative cross-platform zone: works on TikTok + Reels + Shorts. */
export const SAFE = {
  top: 250,
  bottom: 576,
  left: 60,
  right: 164,
};

/** Scale safe margins for non-9:16 renders proportionally. */
export const useSafeArea = () => {
  const { width, height } = useVideoConfig();
  const sy = height / 1920;
  const sx = width / 1080;
  return {
    top: Math.round(SAFE.top * sy),
    bottom: Math.round(SAFE.bottom * sy),
    left: Math.round(SAFE.left * sx),
    right: Math.round(SAFE.right * sx),
    padding: {
      paddingTop: Math.round(SAFE.top * sy),
      paddingBottom: Math.round(SAFE.bottom * sy),
      paddingLeft: Math.round(SAFE.left * sx),
      paddingRight: Math.round(SAFE.right * sx),
    } as React.CSSProperties,
  };
};

/** Dev-only overlay showing the safe zone. Render last; set showGuide={false} for finals. */
export const SafeZoneGuide: React.FC<{ show?: boolean }> = ({ show = false }) => {
  const safe = useSafeArea();
  if (!show) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{
          top: safe.top,
          bottom: safe.bottom,
          left: safe.left,
          right: safe.right,
          border: '2px dashed rgba(255,80,80,0.7)',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <span style={{ color: 'rgba(255,80,80,0.8)', fontSize: 24, padding: 8 }}>
          SAFE ZONE
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
