// Zoetrope — TikTok-style word-highlight captions from public/captions.json.
// Data loads via delayRender so no frame renders without captions (remotion-rules #3).
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  useDelayRender,
  spring,
} from 'remotion';
import { createTikTokStyleCaptions } from '@remotion/captions';
import type { Caption } from '@remotion/captions';
import { theme } from '../theme';
import { useSafeArea } from '../lib/safeZones';

const SWITCH_EVERY_MS = 900;

const CaptionPageView: React.FC<{ page: { startMs: number; tokens: { text: string; fromMs: number; toMs: number }[] } }> = ({
  page,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `0 ${Math.round(width * 0.012)}px`,
        fontFamily: `${theme.fonts.display}, sans-serif`,
        fontWeight: 800,
        fontSize: Math.round(width * 0.055),
        lineHeight: 1.2,
        textAlign: 'center',
      }}
    >
      {page.tokens.map((tok, i) => {
        const active = nowMs >= tok.fromMs && nowMs < tok.toMs;
        const spoken = nowMs >= tok.toMs;
        const pop = active
          ? spring({ frame, fps, config: { damping: 10, stiffness: 220 } })
          : 1;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: active ? theme.colors.emphasis : theme.colors.fg,
              opacity: active || spoken ? 1 : 0.85,
              transform: active ? `scale(${1 + 0.08 * Math.min(pop, 1)})` : undefined,
              textShadow: '0 2px 18px rgba(0,0,0,0.65)',
            }}
          >
            {tok.text.trim()}
          </span>
        );
      })}
    </div>
  );
};

export const CaptionPages: React.FC<{ file?: string }> = ({ file = 'captions.json' }) => {
  const { fps } = useVideoConfig();
  const safe = useSafeArea();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const load = useCallback(async () => {
    try {
      const res = await fetch(staticFile(file));
      setCaptions((await res.json()) as Caption[]);
      continueRender(handle);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [continueRender, cancelRender, handle, file]);

  useEffect(() => {
    load();
  }, [load]);

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: captions ?? [],
        combineTokensWithinMilliseconds: SWITCH_EVERY_MS,
      }),
    [captions],
  );

  if (!captions) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        paddingBottom: safe.bottom + 40,
        paddingLeft: safe.left,
        paddingRight: safe.right,
        pointerEvents: 'none',
      }}
    >
      {pages.map((page, i) => {
        const next = pages[i + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.min(
          next ? Math.round((next.startMs / 1000) * fps) : Infinity,
          startFrame + (SWITCH_EVERY_MS / 1000) * fps * 2,
        );
        const dur = Math.max(1, Math.round(endFrame - startFrame));
        return (
          <Sequence key={i} from={startFrame} durationInFrames={dur} layout="none">
            <CaptionPageView page={page as never} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
