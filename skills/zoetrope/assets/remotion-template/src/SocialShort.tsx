// Zoetrope — SocialShort: 20–45s faceless short, driven by public/beats.json.
// Grammar: HOOK -> SETUP -> BUILD x2-4 -> PAYOFF -> seamless LOOP (frame 0 == last frame visually).
import React, { useCallback, useEffect, useState } from 'react';
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, useDelayRender,
} from 'remotion';
import { AuroraMesh, Particles } from './components/Backgrounds';
import { KineticText, SubLine } from './components/KineticText';
import { CaptionPages } from './components/CaptionPages';
import { SafeZoneGuide } from './lib/safeZones';
import { fadeIn, fadeOut, cameraEase } from './lib/animation';
import { theme } from './theme';

type Beat = { id: string; start: number; end: number; line: string; emphasis?: string[]; sub?: string };
type Beats = { title: string; beats: Beat[] };

const BeatScene: React.FC<{ beat: Beat; index: number }> = ({ beat, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const localFrame = frame; // Sequence-local (rule #4): 0 at scene start
  const inO = fadeIn(localFrame, 0, 8);
  const outO = fadeOut(localFrame, durationInFrames - 8, 8);
  const slide = cameraEase(localFrame, 0, 14, index % 2 === 0 ? 40 : -40, 0); // alternate slide direction
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        opacity: Math.min(inO, outO),
        transform: `translateX(${slide}px)`,
      }}
    >
      <KineticText text={beat.line} emphasis={beat.emphasis} />
      {beat.sub ? (
        <div style={{ marginTop: 32 }}>
          <SubLine text={beat.sub} delay={8} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const SocialShort: React.FC = () => {
  const { fps } = useVideoConfig();
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

  const toFrames = (s: number) => Math.round(s * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <AuroraMesh />
      <Particles count={20} />

      {data.beats.map((beat, i) => (
        <Sequence
          key={beat.id}
          from={toFrames(beat.start)}
          durationInFrames={Math.max(1, toFrames(beat.end - beat.start))}
        >
          <BeatScene beat={beat} index={i} />
        </Sequence>
      ))}

      <CaptionPages file="captions.json" />

      <Audio src={staticFile('voiceover.mp3')} />
      <Audio src={staticFile('audio/music-bed-energy.wav')} volume={0.09} loop />
      {/* whoosh on every scene cut */}
      {data.beats.slice(1).map((beat) => (
        <Sequence key={`sfx-${beat.id}`} from={toFrames(beat.start)} durationInFrames={12}>
          <Audio src={staticFile('audio/whoosh.wav')} volume={0.4} />
        </Sequence>
      ))}

      <SafeZoneGuide show={false} />
    </AbsoluteFill>
  );
};
