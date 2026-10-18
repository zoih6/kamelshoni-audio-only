import {staticFile} from 'remotion';

export const C = {
  bg: '#0C0B09',
  bg2: '#151210',
  ink: '#120E0B',
  gold: '#C9A464',
  goldLight: '#E8C98A',
  goldDim: '#8A6E42',
  burgundy: '#4A0E0E',
  wine: '#7A1F1F',
  cream: '#F2E7D0',
  pink: '#D73A71',
  magenta: '#C24F95',
  blue: '#2036C3',
  navy: '#24364F',
  purple: '#593A93',
  green: '#17A671',
} as const;

export const FONT_CSS = `
@font-face{font-family:'ArefRuqaa';src:url('${staticFile('fonts/ArefRuqaa-Bold.ttf')}') format('truetype');font-weight:700;font-display:block;}
@font-face{font-family:'AmiriQ';src:url('${staticFile('fonts/Amiri-Bold.ttf')}') format('truetype');font-weight:700;font-display:block;}
@font-face{font-family:'PlexAr';src:url('${staticFile('fonts/IBMPlexSansArabic-Bold.ttf')}') format('truetype');font-weight:700;font-display:block;}
@font-face{font-family:'PlexArM';src:url('${staticFile('fonts/IBMPlexSansArabic-Medium.ttf')}') format('truetype');font-weight:500;font-display:block;}
*{box-sizing:border-box;}
`;

export const F = {
  display: "'ArefRuqaa', 'AmiriQ', serif",
  poem: "'AmiriQ', 'ArefRuqaa', serif",
  ui: "'PlexAr', sans-serif",
  uiM: "'PlexArM', sans-serif",
};

// deterministic prng
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// 12fps stutter quantization (Vox "animating on twos" inside 30fps)
export const q12 = (frame: number) => Math.floor(frame / 2.5) * 2.5;

export const BEAT_F = (60 / 91) * 30; // ~19.78 frames per beat
export const pulse = (frame: number, amp = 1) => {
  const p = (frame % BEAT_F) / BEAT_F;
  return 1 + amp * Math.pow(1 - p, 3);
};
