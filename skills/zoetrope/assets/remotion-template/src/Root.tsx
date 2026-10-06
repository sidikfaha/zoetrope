// Zoetrope — composition registry.
import React from 'react';
import { Composition } from 'remotion';
import { LaunchReel } from './LaunchReel';
import { SocialShort } from './SocialShort';
import { FXShowcase, FX_DURATION } from './FXShowcase';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

loadInter('normal', { weights: ['400', '500', '800', '900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
loadMono('normal', { weights: ['400'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// Default durations; adjust per video (or drive from voiceover via calculateMetadata).
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vertical masters */}
      <Composition id="LaunchReel" component={LaunchReel} durationInFrames={617} fps={FPS} width={1080} height={1920} />
      <Composition id="SocialShort" component={SocialShort} durationInFrames={30 * FPS} fps={FPS} width={1080} height={1920} />
      {/* Feed cuts */}
      <Composition id="LaunchReel-1x1" component={LaunchReel} durationInFrames={20 * FPS} fps={FPS} width={1080} height={1080} />
      <Composition id="LaunchReel-16x9" component={LaunchReel} durationInFrames={20 * FPS} fps={FPS} width={1920} height={1080} />
      <Composition id="SocialShort-1x1" component={SocialShort} durationInFrames={30 * FPS} fps={FPS} width={1080} height={1080} />
      {/* Living demo of every FX component — render it once to learn the toolbox */}
      <Composition id="FXShowcase" component={FXShowcase} durationInFrames={FX_DURATION} fps={FPS} width={1080} height={1920} />
    </>
  );
};
