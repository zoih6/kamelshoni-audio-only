import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {C, mulberry32} from '../theme';

/* ————— حبيبات ورق + فينييت + هاف تون (ثابتة/خفيفة) ————— */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.14}) => (
  <AbsoluteFill style={{
    backgroundImage: `url(${staticFile('grain.png')})`,
    backgroundSize: '320px 320px', opacity, mixBlendMode: 'overlay',
    pointerEvents: 'none',
  }}/>
);

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.75}) => (
  <AbsoluteFill style={{
    background: `radial-gradient(ellipse at 50% 42%, transparent 42%, rgba(5,4,3,${strength}) 100%)`,
    pointerEvents: 'none',
  }}/>
);

export const Halftone: React.FC<{opacity?: number; size?: number; color?: string}> = ({
  opacity = 0.16, size = 16, color = 'rgba(255,215,150,1)',
}) => (
  <AbsoluteFill style={{
    backgroundImage: `radial-gradient(${color} 1.7px, transparent 1.9px)`,
    backgroundSize: `${size}px ${size}px`, opacity, pointerEvents: 'none',
  }}/>
);

/* ————— لوحة صورة بحواف ورق ممزق (clip-path) ————— */
const TORN_PATHS = [
  'polygon(2% 4%, 20% 1%, 44% 3%, 68% 0%, 88% 3%, 99% 6%, 97% 26%, 100% 52%, 98% 74%, 99% 95%, 80% 99%, 55% 97%, 30% 100%, 9% 98%, 1% 92%, 3% 70%, 0% 46%, 2% 24%)',
  'polygon(3% 2%, 28% 5%, 52% 1%, 76% 4%, 98% 2%, 96% 24%, 99% 48%, 97% 72%, 98% 96%, 74% 98%, 48% 96%, 22% 99%, 4% 97%, 2% 74%, 0% 50%, 3% 26%)',
  'polygon(1% 6%, 18% 2%, 40% 5%, 64% 1%, 86% 4%, 99% 8%, 97% 30%, 100% 55%, 96% 78%, 98% 96%, 76% 98%, 50% 95%, 26% 99%, 6% 96%, 2% 76%, 4% 50%, 0% 28%)',
];

export const PaperPlate: React.FC<{
  src: string; style?: React.CSSProperties; imgStyle?: React.CSSProperties;
  variant?: number; border?: boolean; shadow?: boolean;
}> = ({src, style, imgStyle, variant = 0, border = true, shadow = true}) => (
  <div style={{
    position: 'absolute', overflow: 'hidden',
    clipPath: TORN_PATHS[variant % TORN_PATHS.length],
    boxShadow: shadow ? '0 30px 80px rgba(0,0,0,0.65)' : undefined,
    ...style,
  }}>
    <Img src={staticFile(src)} style={{
      width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...imgStyle,
    }}/>
    {border && (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: 'inset 0 0 0 6px rgba(242,231,208,0.16), inset 0 0 60px rgba(20,12,8,0.5)',
      }}/>
    )}
  </div>
);

/* ————— خلفية متدرجة دافئة ————— */
export const WarmBackdrop: React.FC<{from?: string; to?: string; glow?: string}> = ({
  from = C.bg, to = C.burgundy, glow = 'rgba(201,164,100,0.20)',
}) => (
  <AbsoluteFill style={{background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`}}>
    <div style={{
      position: 'absolute', width: 1200, height: 1200, right: -300, top: -400,
      borderRadius: '50%', background: `radial-gradient(circle, ${glow}, transparent 65%)`,
    }}/>
  </AbsoluteFill>
);

/* ————— كاميرا/ريج ثلاثي الأبعاد للطبقات ————— */
export const CameraRig: React.FC<{
  t: number; // 0..1 progress داخل المشهد
  kind: 'dolly' | 'panR' | 'panL' | 'orbit' | 'crash' | 'pull' | 'push' | 'lock' | 'up';
  children: React.ReactNode;
  shake?: number;
}> = ({t, kind, children, shake = 0}) => {
  const e = Easing.bezier(0.4, 0, 0.35, 1)(Math.min(1, Math.max(0, t)));
  let transform = '';
  switch (kind) {
    case 'dolly': transform = `scale(${1.04 + e * 0.14}) translateY(${e * -22}px)`; break;
    case 'panR': transform = `scale(${1.16}) translateX(${(e - 0.5) * -130}px)`; break;
    case 'panL': transform = `scale(${1.16}) translateX(${(e - 0.5) * 130}px)`; break;
    case 'orbit': transform = `scale(${1.1 + e * 0.1}) rotate(${(e - 0.5) * 4.5}deg) translateX(${(e - 0.5) * -60}px)`; break;
    case 'crash': transform = `scale(${interpolate(e, [0, 0.25, 1], [1.55, 1.02, 1.06])})`; break;
    case 'pull': transform = `scale(${interpolate(e, [0, 1], [1.32, 1.02])})`; break;
    case 'push': transform = `scale(${1 + e * 0.12})`; break;
    case 'up': transform = `scale(1.14) translateY(${(e - 0.5) * 150}px)`; break;
    default: transform = 'scale(1.02)';
  }
  const sx = shake ? Math.sin(t * 80) * shake * (1 - t) : 0;
  return (
    <AbsoluteFill style={{transform: `${transform} translateX(${sx}px)`, transformOrigin: '50% 45%'}}>
      {children}
    </AbsoluteFill>
  );
};
