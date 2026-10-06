// Zoetrope — CameraRig: continuous slow camera move across a scene (kills the "static" feel).
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const CameraRig: React.FC<{
  durationInFrames: number;   // the SCENE's duration (pass explicitly — useVideoConfig gives the comp's)
  fromScale?: number;
  toScale?: number;
  fromY?: number;             // px drift
  toY?: number;
  fromRotate?: number;        // deg
  toRotate?: number;
  children: React.ReactNode;
}> = ({
  durationInFrames,
  fromScale = 1.06,
  toScale = 1.0,
  fromY = 0,
  toY = 0,
  fromRotate = 0,
  toRotate = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic), // fast accel, long tail
  });
  const scale = fromScale + (toScale - fromScale) * p;
  const y = fromY + (toY - fromY) * p;
  const rot = fromRotate + (toRotate - fromRotate) * p;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translateY(${y}px) rotate(${rot}deg)`,
        transformOrigin: '50% 46%',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
