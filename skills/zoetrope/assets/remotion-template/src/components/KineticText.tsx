// Zoetrope — kinetic typography. Words reveal with blur + rise + settle; emphasis words pop.
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { entrance, stagger, emphasisPop } from '../lib/animation';
import { theme } from '../theme';

export const KineticText: React.FC<{
  text: string;
  emphasis?: string[];        // words that get the accent treatment
  fontSize?: number;          // defaults to 9% of frame width
  align?: 'left' | 'center';
  color?: string;
  delay?: number;             // frames
  y?: number;                 // entrance travel distance px
  staggerStep?: number;       // frames between words
  underline?: boolean;        // draw an accent underline under the emphasis words
}> = ({
  text,
  emphasis = [],
  fontSize,
  align = 'center',
  color = theme.colors.fg,
  delay = 0,
  y = 44,
  staggerStep = 4,
  underline = false,
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const size = fontSize ?? Math.round(width * 0.09);
  const words = text.split(' ');

  const isEmph = (word: string) => {
    const clean = word.replace(/[^\w'$%★.!?-]/g, '').toLowerCase();
    return emphasis.some((e) => e.toLowerCase().split(' ').some((ew) => ew === clean));
  };

  // underline draws on after the last word lands
  const lastWordAt = delay + stagger(words.length - 1, staggerStep) + 10;
  const lineP = underline
    ? interpolate(frame, [lastWordAt, lastWordAt + 12], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          gap: `0 ${Math.round(size * 0.28)}px`,
          fontFamily: `${theme.fonts.display}, sans-serif`,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.12,
          color,
          textAlign: align,
          textShadow: '0 2px 24px rgba(0,0,0,0.45)',
        }}
      >
        {words.map((word, i) => {
          const at = delay + stagger(i, staggerStep);
          const s = entrance(frame, fps, at);
          const emph = isEmph(word);
          const scale = emph ? emphasisPop(frame, fps, at + 8) : 1;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: Math.max(0.01, s),
                transform: `translateY(${(1 - s) * y}px) scale(${0.85 + 0.15 * s * scale})`,
                filter: `blur(${(1 - s) * 10}px)`,
                color: emph ? theme.colors.emphasis : color,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      {underline ? (
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            bottom: -Math.round(size * 0.18),
            height: Math.max(6, Math.round(size * 0.09)),
            borderRadius: 999,
            background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accentAlt})`,
            transform: `scaleX(${lineP})`,
            transformOrigin: 'left center',
            boxShadow: `0 0 ${24 * lineP}px ${theme.colors.accent}88`,
          }}
        />
      ) : null}
    </div>
  );
};

/** Subtitle / supporting line — soft blur rise, muted color. */
export const SubLine: React.FC<{ text: string; delay?: number; fontSize?: number }> = ({
  text,
  delay = 6,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const s = entrance(frame, fps, delay);
  return (
    <div
      style={{
        fontFamily: `${theme.fonts.body}, sans-serif`,
        fontWeight: 500,
        fontSize: fontSize ?? Math.round(width * 0.038),
        color: theme.colors.muted,
        opacity: Math.max(0.01, s),
        transform: `translateY(${(1 - s) * 24}px)`,
        filter: `blur(${(1 - s) * 6}px)`,
        textAlign: 'center',
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  );
};

/** Giant outlined background keyword — parallax texture behind feature scenes. */
export const GhostWord: React.FC<{ text: string; speed?: number; opacity?: number }> = ({
  text,
  speed = 1.4,
  opacity = 0.14,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        transform: `translateY(-50%) translateX(${-frame * speed}px)`,
        fontFamily: `${theme.fonts.display}, sans-serif`,
        fontWeight: 900,
        fontSize: Math.round(width * 0.22),
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        color: 'transparent',
        WebkitTextStroke: `2px ${theme.colors.fg}`,
        opacity,
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      {text}
    </div>
  );
};
