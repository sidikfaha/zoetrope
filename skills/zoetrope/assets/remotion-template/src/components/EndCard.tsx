// Zoetrope — CTA end card. Holds to the last frame (rule: end card holds >= 1.5s).
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { entrance } from '../lib/animation';
import { theme } from '../theme';
import { useSafeArea } from '../lib/safeZones';

export const EndCard: React.FC<{
  productName: string;
  cta: string;          // e.g. "Try it free"
  url?: string;         // e.g. "acme.dev"
}> = ({ productName, cta, url }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const safe = useSafeArea();

  const title = entrance(frame, fps, 0);
  const btn = entrance(frame, fps, 8);
  const pulse = 1 + 0.03 * Math.sin(frame / 12); // gentle CTA pulse

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: Math.round(width * 0.05),
        ...safe.padding,
      }}
    >
      <div
        style={{
          fontFamily: `${theme.fonts.display}, sans-serif`,
          fontWeight: 900,
          fontSize: Math.round(width * 0.1),
          color: theme.colors.fg,
          opacity: Math.max(0.01, title),
          transform: `translateY(${(1 - title) * 30}px)`,
          letterSpacing: '-0.02em',
        }}
      >
        {productName}
      </div>
      <div
        style={{
          opacity: Math.max(0.01, btn),
          transform: `scale(${btn * pulse})`,
          background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentAlt})`,
          borderRadius: 999,
          padding: `${Math.round(width * 0.028)}px ${Math.round(width * 0.07)}px`,
          fontFamily: `${theme.fonts.display}, sans-serif`,
          fontWeight: 800,
          fontSize: Math.round(width * 0.045),
          color: '#0B0B12',
          boxShadow: `0 8px 60px ${theme.colors.accent}88`,
        }}
      >
        {cta}
      </div>
      {url ? (
        <div
          style={{
            fontFamily: `${theme.fonts.mono}, monospace`,
            fontSize: Math.round(width * 0.034),
            color: theme.colors.muted,
            opacity: Math.max(0.01, interpolate(frame, [16, 26], [0.01, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })),
          }}
        >
          {url}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
