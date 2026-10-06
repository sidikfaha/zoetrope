// Zoetrope — real 3D via @remotion/three. See references/three-3d.md.
// THE ONE RULE: everything derives from useCurrentFrame() passed down as props — never clocks/useFrame.
// Requires: @remotion/three + three + @react-three/fiber (installed by scripts/setup_project.sh).
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import '@react-three/fiber';
import { theme } from '../theme';

const Shapes: React.FC<{ frame: number; accent: string; accentAlt: string }> = ({ frame, accent, accentAlt }) => {
  const dolly = interpolate(frame, [0, 120], [0.58, 0.72], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <group scale={dolly} rotation={[0, frame * 0.0035, 0]}>
      <mesh rotation={[frame * 0.011, frame * 0.014, 0]} position={[0, Math.sin(frame / 38) * 0.22, 0]}>
        <torusKnotGeometry args={[1, 0.3, 128, 24]} />
        <meshStandardMaterial color={accent} metalness={0.75} roughness={0.22} emissive={accent} emissiveIntensity={0.25} />
      </mesh>
      <mesh rotation={[frame * 0.02, -frame * 0.016, 0]} position={[-2.6, Math.sin(frame / 30 + 2) * 0.3, -1]}>
        <icosahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color={accentAlt} metalness={0.85} roughness={0.15} emissive={accentAlt} emissiveIntensity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, frame * 0.008]} position={[2.5, Math.sin(frame / 34 + 4) * 0.26, -0.6]}>
        <torusGeometry args={[0.9, 0.07, 16, 64]} />
        <meshStandardMaterial color="#F5F5FA" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

const Pedestal: React.FC<{ frame: number; accent: string }> = ({ frame, accent }) => {
  const rise = interpolate(frame, [0, 26], [-1.4, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <group position={[0, rise, 0]}>
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[1.5, 1.75, 0.4, 48]} />
        <meshStandardMaterial color="#1C1C2A" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.35 + Math.sin(frame / 26) * 0.12, 0]} rotation={[0, frame * 0.022, 0]}>
        <boxGeometry args={[1.75, 1.1, 0.14]} />
        <meshStandardMaterial color="#12121C" metalness={0.7} roughness={0.25} emissive={accent} emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
};

/** Full-frame 3D layer. variant 'shapes' = floating premium primitives; 'pedestal' = product turntable. */
export const Float3D: React.FC<{
  variant?: 'shapes' | 'pedestal';
  accent?: string;
  accentAlt?: string;
  style?: React.CSSProperties;
}> = ({ variant = 'shapes', accent = theme.colors.accent, accentAlt = theme.colors.accentAlt, style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      dpr={1}
      camera={{ position: [0, 0, 7], fov: 40 }}
      style={{ background: theme.colors.bg, ...style }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-6, -4, -2]} intensity={40} color={accent} />
      <pointLight position={[6, 3, 2]} intensity={24} color={accentAlt} />
      {variant === 'shapes' ? (
        <Shapes frame={frame} accent={accent} accentAlt={accentAlt} />
      ) : (
        <Pedestal frame={frame} accent={accent} />
      )}
    </ThreeCanvas>
  );
};
