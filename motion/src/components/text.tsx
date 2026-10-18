import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig, Easing} from 'remotion';
import {C, F} from '../theme';

/* ————— سطر حركي: كلمات تدخل تباعًا ————— */
export const KineticLine: React.FC<{
  text: string;
  startFrame?: number;
  stagger?: number;
  size?: number;
  color?: string;
  font?: string;
  hlWords?: string[];
  hlColor?: string;
  mode?: 'rise' | 'stamp' | 'blur' | 'wipe';
  align?: 'center' | 'right';
  style?: React.CSSProperties;
}> = ({
  text, startFrame = 0, stagger = 4, size = 92, color = C.cream,
  font = F.poem, hlWords = [], hlColor = C.gold, mode = 'rise',
  align = 'center', style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div dir="rtl" style={{
      fontFamily: font, fontSize: size, fontWeight: 700, color,
      lineHeight: 1.7, textAlign: align, textShadow: `0 6px 30px rgba(0,0,0,0.65)`,
      ...style,
    }}>
      {words.map((w, i) => {
        const local = frame - startFrame - i * stagger;
        const sp = spring({frame: Math.max(0, local), fps, config: {damping: 16, stiffness: 120, mass: 0.7}});
        const hl = hlWords.some((h) => w.replace(/[\u064B-\u0652\u0640]/g, '').includes(h));
        let transform = `translateY(${(1 - sp) * 46}px)`;
        let opacity = Math.max(0, Math.min(1, local / 6));
        let filter = 'none';
        if (mode === 'stamp') {
          transform = `scale(${interpolate(sp, [0, 1], [1.65, 1])}) rotate(${interpolate(sp, [0, 1], [-4, 0])}deg)`;
        } else if (mode === 'blur') {
          filter = `blur(${interpolate(Math.max(0, local), [0, 12], [14, 0], {extrapolateRight: 'clamp'})}px)`;
          transform = `scale(${interpolate(sp, [0, 1], [1.18, 1])})`;
        } else if (mode === 'wipe') {
          transform = 'none';
          opacity = 1;
          return (
            <span key={i} style={{
              display: 'inline-block', margin: '0 10px', position: 'relative',
              background: `linear-gradient(to left, ${hl ? hlColor : color} ${Math.max(0, Math.min(100, (local / 12) * 100))}%, transparent 0)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{w}</span>
          );
        }
        return (
          <span key={i} style={{
            display: 'inline-block', margin: '0 10px',
            transform, opacity, filter,
            color: hl ? hlColor : color,
            textShadow: hl ? `0 0 34px ${hlColor}77` : undefined,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

/* ————— كلمة مميزة بضربة قلم ذهبية ————— */
export const HighlightWord: React.FC<{
  text: string; t: number; size?: number; font?: string; color?: string;
}> = ({text, t, size = 120, font = F.display, color = C.goldLight}) => {
  const w = interpolate(t, [0, 1], [0, 105], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const s = interpolate(t, [0, 0.25, 1], [1.5, 1, 1], {extrapolateRight: 'clamp'});
  return (
    <div dir="rtl" style={{position: 'relative', display: 'inline-block', transform: `scale(${s})`}}>
      <div style={{
        fontFamily: font, fontSize: size, fontWeight: 700, color,
        textShadow: `0 0 50px ${C.gold}66`, padding: '0 20px',
      }}>{text}</div>
      <div style={{
        position: 'absolute', right: 0, bottom: '-10px', height: 16, width: `${w}%`,
        background: `linear-gradient(to left, ${C.gold}, ${C.goldLight})`,
        borderRadius: 8, boxShadow: `0 0 24px ${C.gold}88`,
      }}/>
    </div>
  );
};

/* ————— عنوان علوي صغير (Kicker) ————— */
export const Kicker: React.FC<{text: string; t: number; color?: string}> = ({text, t, color = C.gold}) => (
  <div dir="rtl" style={{
    fontFamily: F.ui, fontSize: 40, fontWeight: 700, color,
    letterSpacing: 2, opacity: Math.min(1, t * 2),
    transform: `translateY(${(1 - Math.min(1, t * 2)) * 20}px)`,
    display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'center',
  }}>
    <span style={{width: 60, height: 6, background: color, borderRadius: 4}}/>
    {text}
    <span style={{width: 60, height: 6, background: color, borderRadius: 4}}/>
  </div>
);

/* ————— رقم مشهد بأسلوب راديو ————— */
export const SceneTag: React.FC<{n: number; total?: number}> = ({n, total = 20}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      position: 'absolute', top: 70, left: 64, fontFamily: F.ui, fontSize: 30,
      color: C.gold, opacity: 0.55, letterSpacing: 3,
    }}>
      {String(n).padStart(2, '0')} / {total} · KAMEL SHONI
    </div>
  );
};
