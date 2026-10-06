// Zoetrope — custom TransitionSeries presentations. See references/transitions.md for when to use which.
// Usage: <TransitionSeries.Transition presentation={whipPan()} timing={linearTiming({ durationInFrames: 12 })} />
import React from 'react';
import { AbsoluteFill, interpolate, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { theme } from '../theme';

type NoProps = Record<string, never>;
type PC = TransitionPresentationComponentProps<NoProps>;

/** Fast lateral slide with motion blur — "we're moving". 10–14 frames. */
const WhipPanComp: React.FC<PC> = ({ children, presentationDirection, presentationProgress: p }) => {
  const blur = interpolate(p, [0, 0.5, 1], [0, 14, 0]);
  const style: React.CSSProperties =
    presentationDirection === 'exiting'
      ? { transform: `translateX(${-p * 45}%) skewX(${-p * 4}deg)`, filter: `blur(${blur}px)` }
      : { transform: `translateX(${(1 - p) * 45}%) skewX(${(1 - p) * 4}deg)`, filter: `blur(${blur}px)` };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
export const whipPan = (): TransitionPresentation<NoProps> => ({ component: WhipPanComp, props: {} });

/** Incoming scene punches in from 2× scale — the "pay attention NOW" cut. Pair with impact.wav. */
const ZoomPunchComp: React.FC<PC> = ({ children, presentationDirection, presentationProgress: p }) => {
  const style: React.CSSProperties =
    presentationDirection === 'exiting'
      ? { transform: `scale(${interpolate(p, [0, 1], [1, 1.25])})`, opacity: 1 - p * 0.4, filter: `blur(${p * 5}px)` }
      : {
          transform: `scale(${interpolate(p, [0, 1], [1.9, 1])})`,
          opacity: Math.min(1, p * 2.2),
          filter: `blur(${(1 - p) * 7}px)`,
        };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
export const zoomPunch = (): TransitionPresentation<NoProps> => ({ component: ZoomPunchComp, props: {} });

/** Digital slice-glitch — problem beats, dev tools, "broken → fixed" stories. 8–12 frames. */
const GlitchComp: React.FC<PC> = ({ children, presentationDirection, presentationProgress: p }) => {
  const amp = presentationDirection === 'entering' ? 1 - p : p;
  const q = Math.floor(p * 7); // quantized so the jitter steps, not swims
  const dx = (random(`gl-x-${q}`) - 0.5) * 60 * amp;
  const sliceTop = random(`gl-t-${q}`) * 30 * amp;
  const sliceBottom = random(`gl-b-${q}`) * 30 * amp;
  const hue = (random(`gl-h-${q}`) - 0.5) * 120 * amp;
  const style: React.CSSProperties = {
    transform: `translateX(${dx}px)`,
    clipPath: `inset(${sliceTop}% 0 ${sliceBottom}% 0)`,
    filter: `hue-rotate(${hue}deg) saturate(${1 + amp})`,
  };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
export const glitch = (): TransitionPresentation<NoProps> => ({ component: GlitchComp, props: {} });

/** Warm light leak crossfade — "new chapter". 14–20 frames. Pair with a riser → swell. */
const LightLeakComp: React.FC<PC> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === 'exiting') {
    return (
      <AbsoluteFill style={{ filter: `brightness(${1 + p * 0.5}) saturate(${1 + p * 0.4})`, opacity: 1 - p * 0.3 }}>
        {children}
      </AbsoluteFill>
    );
  }
  const sweep = interpolate(p, [0, 1], [-120, 120]);
  const leakOpacity = Math.sin(p * Math.PI) * 0.85;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.8) }}>
      {children}
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, transparent 20%, ${theme.colors.emphasis}CC 42%, #FF7A59CC 50%, ${theme.colors.emphasis}CC 58%, transparent 80%)`,
          transform: `translateX(${sweep}%)`,
          opacity: leakOpacity,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
export const lightLeak = (): TransitionPresentation<NoProps> => ({ component: LightLeakComp, props: {} });

/** Playful iris circle reveal — doodle/handmade brands. 14–18 frames. */
const IrisWipeComp: React.FC<PC> = ({ children, presentationDirection, presentationProgress: p }) => {
  const style: React.CSSProperties =
    presentationDirection === 'exiting'
      ? { transform: `scale(${1 - p * 0.06})` }
      : { clipPath: `circle(${p * 140}% at 50% 45%)` };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
export const irisWipe = (): TransitionPresentation<NoProps> => ({ component: IrisWipeComp, props: {} });
