import React from 'react';
import {useCurrentFrame, interpolate, Easing, AbsoluteFill, Img, staticFile} from 'remotion';
import {C, mulberry32, q12, pulse, F} from '../theme';

/* ————— ذرات الغبار الذهبي ————— */
export const GoldDust: React.FC<{seed?: number; count?: number; opacity?: number}> = ({
  seed = 7, count = 26, opacity = 0.75,
}) => {
  const frame = useCurrentFrame();
  const rnd = mulberry32(seed);
  const items = Array.from({length: count}, () => {
    const x = rnd() * 100, y = rnd() * 100, sz = 3 + rnd() * 9;
    const sp = 0.25 + rnd() * 0.9, ph = rnd() * Math.PI * 2, rot = rnd() * 60;
    return {x, y, sz, sp, ph, rot};
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      {items.map((it, i) => {
        const t = frame / 30;
        const dy = Math.sin(t * it.sp + it.ph) * 26;
        const dx = Math.cos(t * it.sp * 0.7 + it.ph) * 18;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.6 + it.ph));
        return (
          <div key={i} style={{
            position: 'absolute', left: `${it.x}%`, top: `${it.y}%`,
            width: it.sz, height: it.sz, borderRadius: '50%',
            background: `radial-gradient(circle, ${C.goldLight}, ${C.gold}00)`,
            transform: `translate(${dx}px, ${dy}px) rotate(${it.rot}deg)`,
            opacity: tw, filter: 'blur(0.5px)',
          }}/>
        );
      })}
    </AbsoluteFill>
  );
};

/* ————— خط النبض ECG يرسم نفسه ————— */
export const EcgLine: React.FC<{
  progress: number; color?: string; width?: number; glow?: boolean; y?: string; dash?: boolean;
}> = ({progress, color = C.gold, width = 6, glow = true, y = '50%', dash = true}) => {
  // مسار ECG بأسلوب SVG
  const d = 'M0,80 L120,80 L150,80 L165,40 L180,120 L195,20 L210,80 L330,80 L360,80 L375,55 L390,105 L405,30 L420,80 L560,80 L590,80 L605,45 L620,115 L635,25 L650,80 L820,80';
  const len = 1100;
  return (
    <svg viewBox="0 0 820 160" style={{
      position: 'absolute', width: '108%', right: '-4%', top: y,
      transform: 'translateY(-50%)', overflow: 'visible',
    }}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dash ? len : undefined}
        strokeDashoffset={dash ? len * (1 - progress) : undefined}
        style={glow ? {filter: `drop-shadow(0 0 18px ${color}aa)`} : undefined}/>
    </svg>
  );
};

/* ————— قوس قلب ذهبي يملأ الشاشة (انتقال) ————— */
export const HeartWipe: React.FC<{t: number}> = ({t}) => {
  // t: 0..1 — يكبر ليغطي ثم ينكشف
  const scale = interpolate(t, [0, 0.55, 1], [0, 2.6, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.6, 0, 0.3, 1),
  });
  const rot = interpolate(t, [0, 1], [-12, 8]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', pointerEvents: 'none'}}>
      <svg width="700" height="700" viewBox="0 0 100 100"
        style={{transform: `scale(${scale}) rotate(${rot}deg)`, opacity: t > 0.02 ? 1 : 0}}>
        <defs>
          <radialGradient id="hw" cx="50%" cy="35%">
            <stop offset="0%" stopColor={C.goldLight}/><stop offset="100%" stopColor={C.gold}/>
          </radialGradient>
        </defs>
        <path fill="url(#hw)" d="M50,88 C20,64 6,48 6,32 C6,18 17,8 29,8 C38,8 45,13 50,21 C55,13 62,8 71,8 C83,8 94,18 94,32 C94,48 80,64 50,88 Z"/>
      </svg>
    </AbsoluteFill>
  );
};

/* ————— ومضة ضوئية تمر ————— */
export const LightSweep: React.FC<{t: number; angle?: number}> = ({t, angle = 18}) => {
  const x = interpolate(t, [0, 1], [-40, 140], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return (
    <div style={{
      position: 'absolute', inset: '-30%', pointerEvents: 'none',
      background: `linear-gradient(${angle}deg, transparent 42%, rgba(255,240,200,0.32) 50%, transparent 58%)`,
      transform: `translateX(${x}%)`, mixBlendMode: 'screen',
    }}/>
  );
};

/* ————— صورت عين مرسومة (رمز "في عيوني") ————— */
export const EyeGlyph: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 120, style}) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 100 62" style={style}>
    <path d="M4,31 Q50,-8 96,31 Q50,70 4,31 Z" fill="none" stroke={C.gold} strokeWidth="4"/>
    <circle cx="50" cy="31" r="13" fill={C.goldLight}/>
    <circle cx="50" cy="31" r="6" fill={C.ink}/>
    <circle cx="45" cy="26" r="2.5" fill={C.cream}/>
  </svg>
);

/* ————— رقاقات معادلات طائرة ————— */
export const EquationBurst: React.FC<{t: number}> = ({t}) => {
  const rnd = mulberry32(42);
  const items = Array.from({length: 14}, (_, i) => ({
    sym: ['+', '−', '=', '×', '÷', '♥'][i % 6],
    x: 10 + rnd() * 80, y: 12 + rnd() * 72,
    vx: (rnd() - 0.5) * 340, vy: (rnd() - 0.5) * 300,
    rot: rnd() * 360, sz: 44 + rnd() * 88, sp: 0.5 + rnd(),
  }));
  return (
    <AbsoluteFill style={{perspective: 900, pointerEvents: 'none'}}>
      {items.map((it, i) => {
        const p = interpolate(t, [0, 1], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
        const ease = Easing.bezier(0.15, 0.8, 0.3, 1)(p);
        return (
          <div key={i} style={{
            position: 'absolute', left: `${it.x}%`, top: `${it.y}%`,
            fontFamily: F.ui, fontWeight: 700, fontSize: it.sz,
            color: i % 3 === 0 ? C.goldLight : C.gold,
            opacity: Math.min(1, p * 3) * (1 - Math.pow(p, 2) * 0.25),
            transform: `translate(${it.vx * ease}px, ${it.vy * ease}px) rotate(${it.rot * ease}deg) translateZ(${(i % 5) * 60 - 120}px)`,
            textShadow: `0 0 22px ${C.gold}88`,
          }}>{it.sym}</div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ————— قلب SVG نابض ————— */
export const PulseHeart: React.FC<{size?: number; beatAmp?: number; color?: string; glow?: string; style?: React.CSSProperties}> = ({
  size = 300, beatAmp = 0.06, color = C.gold, glow, style,
}) => {
  const frame = useCurrentFrame();
  const sc = pulse(frame, beatAmp);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{transform: `scale(${sc})`, filter: glow ? `drop-shadow(0 0 40px ${glow})` : undefined, ...style}}>
      <path fill={color} d="M50,88 C20,64 6,48 6,32 C6,18 17,8 29,8 C38,8 45,13 50,21 C55,13 62,8 71,8 C83,8 94,18 94,32 C94,48 80,64 50,88 Z"/>
    </svg>
  );
};

/* ————— موجة رملية/ضوء ————— */
export const WarmGlow: React.FC<{x: string; y: string; r: number; color: string; o?: number}> = ({x, y, r, color, o = 0.5}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: r, height: r,
    transform: 'translate(-50%,-50%)', borderRadius: '50%',
    background: `radial-gradient(circle, ${color}, transparent 70%)`,
    opacity: o, pointerEvents: 'none',
  }}/>
);

/* ————— عدّاد أرقام ————— */
export const Counter: React.FC<{to: number; t: number; style?: React.CSSProperties}> = ({to, t, style}) => {
  const v = Math.round(interpolate(t, [0, 1], [0, to], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}));
  return <span style={style}>{v.toLocaleString('en-US')}</span>;
};

/* ————— شريط لاصق ————— */
export const Tape: React.FC<{x: string; y: string; rot?: number; w?: number}> = ({x, y, rot = -7, w = 150}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: 38,
    background: 'rgba(240,225,190,0.32)', border: '1px dashed rgba(255,230,180,0.35)',
    transform: `translate(-50%,-50%) rotate(${rot}deg)`, pointerEvents: 'none',
  }}/>
);

/* ————— وميض قلب على الإيقاغ ————— */
export const BeatFlash: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  const p = (frame % 19.78) / 19.78;
  const a = Math.pow(1 - p, 4) * 0.16 * intensity;
  return <AbsoluteFill style={{background: C.goldLight, opacity: a, mixBlendMode: 'screen', pointerEvents: 'none'}}/>;
};

export const q = (frame: number) => q12(frame);
