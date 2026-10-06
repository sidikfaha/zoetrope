// Zoetrope — feature beat card: glass card with 3D perspective entrance.
import React from 'react';
import { useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { entrance } from '../lib/animation';
import { theme } from '../theme';

export const FeatureCard: React.FC<{
  icon?: string;        // staticFile path to icon/screenshot (optional)
  emoji?: string;       // fallback icon
  title: string;        // benefit-led: "Ship faster" — not "v2 engine"
  sub?: string;
  delay?: number;       // frames
  direction?: 1 | -1;   // slide in from right (1) or left (-1)
}> = ({ icon, emoji = '⚡', title, sub, delay = 0, direction = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const s = entrance(frame, fps, delay);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: Math.round(width * 0.03),
        background: `linear-gradient(135deg, ${theme.colors.fg}14, ${theme.colors.fg}08)`,
        border: `1px solid ${theme.colors.fg}22`,
        borderRadius: 28,
        padding: `${Math.round(width * 0.034)}px ${Math.round(width * 0.042)}px`,
        backdropFilter: 'blur(14px)',
        boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
        opacity: Math.max(0.01, s),
        transform: `perspective(1200px) rotateY(${(1 - s) * -28 * direction}deg) translateX(${(1 - s) * 140 * direction}px) scale(${0.92 + 0.08 * s})`,
        transformOrigin: direction === 1 ? 'left center' : 'right center',
        width: '100%',
      }}
    >
      <div
        style={{
          width: Math.round(width * 0.11),
          height: Math.round(width * 0.11),
          borderRadius: 20,
          background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentAlt})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: Math.round(width * 0.05),
          flexShrink: 0,
          boxShadow: `0 8px 30px ${theme.colors.accent}66`,
        }}
      >
        {icon ? (
          <Img src={staticFile(icon)} style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
        ) : (
          emoji
        )}
      </div>
      <div>
        <div
          style={{
            fontFamily: `${theme.fonts.display}, sans-serif`,
            fontWeight: 800,
            fontSize: Math.round(width * 0.046),
            color: theme.colors.fg,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
        {sub ? (
          <div
            style={{
              fontFamily: `${theme.fonts.body}, sans-serif`,
              fontSize: Math.round(width * 0.031),
              color: theme.colors.muted,
              marginTop: 8,
              lineHeight: 1.35,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};
