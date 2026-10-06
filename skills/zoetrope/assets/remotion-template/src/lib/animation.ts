// Zoetrope — animation presets. Encode the motion rules so scenes never hand-roll tweens.
import { spring, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

export const springConfig = () =>
  theme.personality === 'premium'
    ? { damping: 13, stiffness: 120, mass: 0.9 } // confident overshoot, quick settle
    : { damping: 8, stiffness: 160, mass: 1.1 }; // playful bounce

/** Entrance spring: 0→1 with the theme's personality. Delay in frames. */
export const entrance = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: springConfig() });

/** Emphasis pop for keywords: 1 → 1.15 → 1 on the spoken frame. */
export const emphasisPop = (frame: number, fps: number, at: number) => {
  const s = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 200 } });
  return 1 + 0.15 * Math.sin(Math.min(Math.max(frame - at, 0) / 6, 1) * Math.PI) * (s > 0 ? 1 : 0);
};

/** Smooth eased value; use for camera moves (fast accel, long tail). */
export const cameraEase = (frame: number, start: number, dur: number, from: number, to: number) =>
  interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

/** Fade through zero for scene cuts: 1→0 over `dur` frames starting at `start`. */
export const fadeOut = (frame: number, start: number, dur = 10) =>
  interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

export const fadeIn = (frame: number, start: number, dur = 10) =>
  interpolate(frame, [start, start + dur], [0.01, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

/** Stagger delay for list children (frames). */
export const stagger = (index: number, step = 4) => index * step;

/** Continuous ambient drift for backgrounds — alive but calm. */
export const drift = (frame: number, amount = 6) => Math.sin(frame / 90) * amount;
