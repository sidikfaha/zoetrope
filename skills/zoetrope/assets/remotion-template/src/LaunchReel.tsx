// Zoetrope — LaunchReel: 15–30s product launch composition.
// Cinematic cut: TransitionSeries scenes, camera rigs, ghost words, light sweeps.
// Driven by public/beats.json (scenes[] with startSec; durations derive from the next scene).
import React, { useCallback, useEffect, useState } from 'react';
import {
  AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useDelayRender,
} from 'remotion';
import { TransitionSeries, springTiming, linearTiming } from '@remotion/transitions';
import type { TransitionPresentation } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';
import { AuroraMesh, Particles } from './components/Backgrounds';
import { KineticText, SubLine, GhostWord } from './components/KineticText';
import { LogoSting } from './components/LogoSting';
import { FeatureCard } from './components/FeatureCard';
import { EndCard } from './components/EndCard';
import { CaptionPages } from './components/CaptionPages';
import { CameraRig } from './components/CameraRig';
import { LightSweep } from './components/LightSweep';
import { ProgressBar } from './components/ProgressBar';
import { SafeZoneGuide, useSafeArea } from './lib/safeZones';
import { theme } from './theme';

type Scene = {
  id: 'hook' | 'reveal' | 'feature' | 'cta';
  startSec: number;
  // hook
  line?: string; line2?: string; emphasis?: string[]; sub?: string; subDelaySec?: number; ghost?: string;
  // feature
  keyword?: string; title?: string; emoji?: string; icon?: string;
};
type Beats = {
  title: string; productName?: string; cta?: string; url?: string; logo?: string;
  transitionFrames?: number; scenes: Scene[];
};

const HookScene: React.FC<{ scene: Scene; dur: number }> = ({ scene, dur }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {scene.ghost ? <GhostWord text={scene.ghost} speed={1.2} opacity={0.12} /> : null}
      <CameraRig durationInFrames={dur} fromScale={1.09} toScale={1.0}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: 60 }}>
            <KineticText text={scene.line ?? ''} delay={2} />
            <KineticText text={scene.line2 ?? ''} emphasis={scene.emphasis} underline delay={12} />
            {scene.sub ? <SubLine text={scene.sub} delay={Math.round((scene.subDelaySec ?? 1.8) * fps)} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};

const RevealScene: React.FC<{ data: Beats; dur: number }> = ({ data, dur }) => (
  <AbsoluteFill>
    <CameraRig durationInFrames={dur} fromScale={1.14} toScale={1.0}>
      <LogoSting logo={data.logo} productName={data.productName ?? data.title} />
    </CameraRig>
    <LightSweep at={8} />
  </AbsoluteFill>
);

const FeatureScene: React.FC<{ scene: Scene; index: number; dur: number }> = ({ scene, index, dur }) => {
  const safe = useSafeArea();
  const dir = index % 2 === 0 ? 1 : -1;
  return (
    <AbsoluteFill style={{ justifyContent: 'center' }}>
      {scene.keyword ? (
        <GhostWord text={scene.keyword} speed={dir * 1.6} opacity={0.13} />
      ) : null}
      <CameraRig durationInFrames={dur} fromScale={1.05} toScale={1.0} fromRotate={dir * 1.2} toRotate={0}>
        <AbsoluteFill style={{ justifyContent: 'center' }}>
          <div style={{ ...safe.padding, display: 'flex' }}>
            <FeatureCard
              icon={scene.icon}
              emoji={scene.emoji}
              title={scene.title ?? ''}
              sub={scene.sub}
              delay={5}
              direction={dir as 1 | -1}
            />
          </div>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{ data: Beats; scene: Scene; dur: number }> = ({ data, scene, dur }) => (
  <AbsoluteFill>
    <CameraRig durationInFrames={dur} fromScale={1.04} toScale={1.0}>
      <EndCard productName={data.productName ?? data.title} cta={data.cta ?? 'Try it free'} url={data.url} />
    </CameraRig>
    <LightSweep at={10} opacity={0.35} />
  </AbsoluteFill>
);

export const LaunchReel: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const [data, setData] = useState<Beats | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const load = useCallback(async () => {
    try {
      const res = await fetch(staticFile('beats.json'));
      setData(await res.json());
      continueRender(handle);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [continueRender, cancelRender, handle]);

  useEffect(() => { load(); }, [load]);
  if (!data) return null;

  const T = data.transitionFrames ?? 12;
  const scenes = data.scenes;
  // scene i duration = time to next scene + transition overlap; last fills the comp
  const durations = scenes.map((s, i) => {
    if (i === scenes.length - 1) return null; // computed after starts are known
    return Math.max(1, Math.round((scenes[i + 1].startSec - s.startSec) * fps) + T);
  });
  const starts: number[] = [];
  let cursor = 0;
  scenes.forEach((_, i) => {
    starts.push(cursor);
    if (durations[i]) cursor += (durations[i] as number) - T;
  });
  const lastDur = Math.max(1, durationInFrames - cursor);

  const transitionFor = (i: number) => {
    // between scene i-1 and scene i
    const id = scenes[i].id;
    const timing = springTiming({ config: { damping: 200 }, durationInFrames: T });
    if (id === 'reveal') return <TransitionSeries.Transition key={`t${i}`} presentation={slide({ direction: 'from-bottom' })} timing={timing} />;
    if (id === 'feature') {
      const featurePres = (i % 2 === 0 ? wipe() : slide({ direction: 'from-right' })) as TransitionPresentation<Record<string, unknown>>;
      return <TransitionSeries.Transition key={`t${i}`} presentation={featurePres} timing={timing} />;
    }
    if (id === 'cta') return <TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />;
    return <TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />;
  };

  let featureIdx = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: `${theme.fonts.body}, sans-serif` }}>
      <AuroraMesh />
      <Particles count={16} />

      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const dur = (i === scenes.length - 1 ? lastDur : durations[i]) as number;
          const el =
            scene.id === 'hook' ? (
              <TransitionSeries.Sequence key={scene.id + i} durationInFrames={dur}>
                <HookScene scene={scene} dur={dur} />
              </TransitionSeries.Sequence>
            ) : scene.id === 'reveal' ? (
              <TransitionSeries.Sequence key={scene.id + i} durationInFrames={dur}>
                <RevealScene data={data} dur={dur} />
              </TransitionSeries.Sequence>
            ) : scene.id === 'feature' ? (
              <TransitionSeries.Sequence key={scene.id + i} durationInFrames={dur}>
                <FeatureScene scene={scene} index={featureIdx++} dur={dur} />
              </TransitionSeries.Sequence>
            ) : (
              <TransitionSeries.Sequence key={scene.id + i} durationInFrames={dur}>
                <CtaScene data={data} scene={scene} dur={dur} />
              </TransitionSeries.Sequence>
            );
          return i === 0 ? [el] : [transitionFor(i), el];
        })}
      </TransitionSeries>

      <CaptionPages file="captions.json" />
      <ProgressBar />

      {/* audio (absolute frames): voice + bed + SFX on transitions */}
      <Audio src={staticFile('voiceover.mp3')} />
      <Audio src={staticFile('audio/music-bed-chill.wav')} volume={0.1} loop />
      {starts.slice(1).map((start) => (
        <Sequence key={`whoosh-${start}`} from={start} durationInFrames={T + 4}>
          <Audio src={staticFile('audio/whoosh.wav')} volume={0.35} />
        </Sequence>
      ))}
      {scenes.map((scene, i) =>
        scene.id === 'reveal' ? (
          <React.Fragment key={`sfx-${i}`}>
            <Sequence from={Math.max(0, starts[i] - 26)} durationInFrames={26}>
              <Audio src={staticFile('audio/riser.wav')} volume={0.45} />
            </Sequence>
            <Sequence from={starts[i] + 6} durationInFrames={21}>
              <Audio src={staticFile('audio/impact.wav')} volume={0.5} />
            </Sequence>
          </React.Fragment>
        ) : null,
      )}

      <SafeZoneGuide show={false} />
    </AbsoluteFill>
  );
};
