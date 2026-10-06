// Zoetrope — FX showcase: a living demo of every effect component. Delete or repurpose freely.
import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { theme } from './theme';
import { Particles } from './components/Particles';
import { RingPop, StarBurst, EmojiPop } from './components/Pops';
import { whipPan, lightLeak } from './components/TransitionsFX';
import { WobbleFilter, SketchCircle, SketchArrow, SketchCheck, SketchCross, Highlight } from './components/Doodles';
import { ScrambleText, GlitchText, Typewriter, Counter, WaveText } from './components/TextFX';
import { Float3D } from './components/ThreeScene';

loadCaveat('normal', { weights: ['600'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

const S1 = 100;
const S2 = 90;
const S3 = 100;
const T1 = 12;
const T2 = 14;
export const FX_DURATION = S1 + S2 + S3 - T1 - T2; // 264

const SceneParticles: React.FC = () => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <Particles preset="dust" seed="fx-s1" />
      <div style={{ position: 'absolute', left: '50%', top: '34%' }}>
        <Sequence from={16} durationInFrames={24}>
          <StarBurst length={width * 0.16} />
        </Sequence>
        <Sequence from={16} durationInFrames={22}>
          <RingPop size={width * 0.34} />
        </Sequence>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: `${theme.fonts.mono}, monospace`,
            fontSize: width * 0.026,
            letterSpacing: '0.35em',
            color: theme.colors.accentAlt,
            marginBottom: 28,
          }}
        >
          ZOETROPE FX
        </div>
        <div
          style={{
            fontFamily: `${theme.fonts.display}, sans-serif`,
            fontWeight: 900,
            fontSize: width * 0.115,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
          }}
        >
          <ScrambleText text="MOTION," delay={8} />
          <br />
          <ScrambleText text="UNCHAINED" delay={16} />
        </div>
        <div
          style={{
            marginTop: 44,
            fontFamily: `${theme.fonts.display}, sans-serif`,
            fontWeight: 800,
            fontSize: width * 0.06,
            color: theme.colors.emphasis,
          }}
        >
          <Counter to={10000} suffix="+" delay={40} />{' '}
          <span style={{ color: theme.colors.muted, fontWeight: 500, fontSize: width * 0.034 }}>frames, zero plugins</span>
        </div>
      </div>
      <Sequence from={52} durationInFrames={48}>
        <Particles preset="confetti" seed="fx-s1c" origin={{ x: 0.5, y: 0.62 }} />
      </Sequence>
      <div style={{ position: 'absolute', left: '50%', top: '62%' }}>
        <Sequence from={52}>
          <EmojiPop emoji="🎉" size={width * 0.1} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

const SceneDoodle: React.FC = () => {
  const { width } = useVideoConfig();
  const hand = `'Caveat', cursive`;
  return (
    <AbsoluteFill style={{ background: theme.colors.bgAlt, justifyContent: 'center', alignItems: 'center' }}>
      <WobbleFilter id="fx-wobble" />
      <div style={{ fontFamily: hand, fontSize: width * 0.075, color: theme.colors.fg, marginBottom: 40 }}>
        <WaveText text="annotate anything." amplitude={5} />
      </div>
      <div style={{ position: 'relative', width: width * 0.3, height: width * 0.3, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <span style={{ fontSize: width * 0.13 }}>⚡</span>
        <div style={{ position: 'absolute', inset: -18 }}>
          <SketchCircle width={width * 0.3 + 36} delay={14} wobbleId="fx-wobble" />
        </div>
      </div>
      <div
        style={{
          marginTop: 46,
          fontFamily: `${theme.fonts.display}, sans-serif`,
          fontWeight: 800,
          fontSize: width * 0.052,
          color: theme.colors.fg,
        }}
      >
        circle the <Highlight delay={30}>thing that matters</Highlight>
      </div>
      <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: `${theme.fonts.body}, sans-serif`, fontSize: width * 0.036, color: theme.colors.fg }}>
          <SketchCheck width={44} delay={44} wobbleId="fx-wobble" /> ship the good part
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: `${theme.fonts.body}, sans-serif`, fontSize: width * 0.036, color: theme.colors.muted }}>
          <SketchCross width={44} delay={54} wobbleId="fx-wobble" /> skip the boring part
        </div>
      </div>
      <div style={{ position: 'absolute', right: width * 0.14, bottom: 340, transform: 'rotate(12deg)' }}>
        <SketchArrow width={width * 0.2} delay={66} flipY wobbleId="fx-wobble" />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 250,
          background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentAlt})`,
          borderRadius: 999,
          padding: '22px 58px',
          fontFamily: `${theme.fonts.display}, sans-serif`,
          fontWeight: 800,
          fontSize: width * 0.038,
          color: '#0B0B12',
          boxShadow: `0 14px 44px ${theme.colors.accent}55`,
        }}
      >
        Try it free
      </div>
    </AbsoluteFill>
  );
};

const Scene3D: React.FC = () => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Float3D variant="shapes" />
      <Particles preset="stars" seed="fx-s3" />
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 330 }}>
        <div
          style={{
            fontFamily: `${theme.fonts.display}, sans-serif`,
            fontWeight: 900,
            fontSize: width * 0.1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          <GlitchText text="3D, BAKED IN." intensity={0.7} />
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: `${theme.fonts.mono}, monospace`,
            fontSize: width * 0.03,
            color: theme.colors.muted,
          }}
        >
          <Typewriter text="real geometry. deterministic frames." cps={24} delay={20} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FXShowcase: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={S1}>
        <SceneParticles />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whipPan()} timing={linearTiming({ durationInFrames: T1 })} />
      <TransitionSeries.Sequence durationInFrames={S2}>
        <SceneDoodle />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={lightLeak()} timing={linearTiming({ durationInFrames: T2 })} />
      <TransitionSeries.Sequence durationInFrames={S3}>
        <Scene3D />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
