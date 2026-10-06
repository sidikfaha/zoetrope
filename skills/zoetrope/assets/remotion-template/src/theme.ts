// Zoetrope — brand tokens. Edit these first; every component reads from here.
export const theme = {
  colors: {
    bg: '#0B0B12',
    bgAlt: '#14141F',
    fg: '#F5F5FA',
    muted: 'rgba(245,245,250,0.62)',
    accent: '#7C5CFF',
    accentAlt: '#22D3EE',
    emphasis: '#FFD166',
    danger: '#FF5C7A',
  },
  fonts: {
    // load via @remotion/google-fonts in Root.tsx and keep these names in sync
    display: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  // motion personality: 'premium' (tight, damped) | 'playful' (loose, bouncy)
  personality: 'premium' as 'premium' | 'playful',
  voice: {
    // informational only — scripts/voiceover.py reads the CLI flags
    name: 'aria',
    rate: '-2%',
  },
};

export type Theme = typeof theme;
