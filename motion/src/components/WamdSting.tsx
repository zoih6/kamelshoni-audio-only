import React from 'react';
import {
  AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from 'remotion';
import {C, F, mulberry32} from '../theme';
import {Grain, Vignette} from './overlays';
import {GoldDust} from './fx';

/*
  ═════════ WAMD LOGO STING — البناء الاحترافي ═════════
  الشعار يُبنى من 4 قطع (طبقات مقصوصة كورق ممزق) + حلقة تدرّج
  + معينات + شرائط + لمعة + تنفّس حيوي.
  301 إطار @30fps (≈10 ثوانٍ)
*/

// قطع الشعار الأربع (clip-path inset — بدون تداخل)
const PIECES = [
  { // 1) أعلى اليسار: الرأس + المعينات
    key: 'p1', clip: 'inset(0% 47.4% 35.4% 0%)',
    from: {x: -320, y: -260, r: -9}, delay: 6,
  },
  { // 2) أسفل اليسار: الجسد + الكاميرا + الشرائط
    key: 'p2', clip: 'inset(63.4% 47.4% 0% 0%)',
    from: {x: -360, y: 280, r: 8}, delay: 14,
  },
  { // 3) أعلى اليمين: علامة W + الفراغ العلوي
    key: 'p3', clip: 'inset(0% 0% 57.4% 51.4%)',
    from: {x: 340, y: -280, r: 10}, delay: 22,
  },
  { // 4) أسفل اليمين: ومض WAMD + السطر + الشرائط
    key: 'p4', clip: 'inset(41.4% 0% 0% 51.4%)',
    from: {x: 360, y: 260, r: -8}, delay: 30,
  },
];

export const WamdSting: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ————— المراحل —————
  const guideT = interpolate(frame, [0, 12, 44, 58], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringT = interpolate(frame, [10, 62], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
  const baseSp = spring({frame: frame - 2, fps, config: {damping: 18, stiffness: 80}}); // ظل البناء
  const diamondSp = (i: number) => spring({frame: frame - 88 - i * 7, fps, config: {damping: 11, stiffness: 120}});
  const swooshT = interpolate(frame, [70, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const shineT = interpolate(frame, [135, 185], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tagT = interpolate(frame, [120, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const settle = interpolate(frame, [150, 200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // التنفّس الحيوي (Parallax نبضي بعد البناء)
  const breathe = 1 + Math.sin(frame / 26) * 0.007 * settle;
  const drift = (i: number) => {
    const amp = (1 - settle) * 0 + settle * 6;
    return {
      x: Math.sin(frame / 30 + i * 1.7) * amp,
      y: Math.cos(frame / 34 + i * 2.1) * amp * 0.7,
    };
  };
  const camZ = interpolate(frame, [0, 120, 301], [1.12, 1.02, 1.0], {
    extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });
  const glowPulse = 1 + Math.sin(frame / 18) * 0.12 * settle;

  return (
    <AbsoluteFill style={{background: '#070605', overflow: 'hidden'}}>
      {/* خلفية المسرح */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 44%, rgba(96,62,42,0.5), #070605 66%)`,
      }}/>
      <GoldDust seed={51} count={26} opacity={0.7}/>

      <AbsoluteFill style={{transform: `scale(${camZ * breathe})`, transformOrigin: '50% 42%'}}>

        {/* ——— أدلة التصميم (تظهر وتختفي عند البناء) ——— */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, opacity: guideT}}>
          <rect x="140" y="410" width="800" height="800" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="14 12" opacity="0.5"/>
          <line x1="540" y1="360" x2="540" y2="1260" stroke={C.gold} strokeWidth="1.5" strokeDasharray="6 10" opacity="0.4"/>
          <line x1="90" y1="810" x2="990" y2="810" stroke={C.gold} strokeWidth="1.5" strokeDasharray="6 10" opacity="0.4"/>
          <circle cx="540" cy="810" r="404" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.35"/>
        </svg>

        {/* ——— قاعدة الظل الدائري ——— */}
        <div style={{
          position: 'absolute', left: 540, top: 810,
          width: 808, height: 808, marginLeft: -404, marginTop: -404,
          borderRadius: '50%', background: 'rgba(0,0,0,0.55)',
          transform: `scale(${0.9 + baseSp * 0.1})`, opacity: baseSp * 0.8,
          filter: 'blur(2px)',
        }}/>

        {/* ——— قطع الشعار الأربع: تطير وتُقفل كورق مقصوص ——— */}
        {PIECES.map((p, i) => {
          const sp = spring({frame: frame - p.delay, fps, config: {damping: 15, stiffness: 95, mass: 1}});
          const d = drift(i);
          return (
            <div key={p.key} style={{
              position: 'absolute', left: 540, top: 810,
              width: 808, height: 808, marginLeft: -404, marginTop: -404,
              transform: `translate(${p.from.x * (1 - sp) + d.x}px, ${p.from.y * (1 - sp) + d.y}px) rotate(${p.from.r * (1 - sp)}deg)`,
              opacity: Math.min(1, sp * 1.8),
              filter: sp < 0.92 ? `drop-shadow(0 ${18 * (1 - sp)}px ${34 * (1 - sp)}px rgba(0,0,0,0.55))` : 'none',
              borderRadius: '50%', overflow: 'hidden',
            }}>
              <div style={{width: '100%', height: '100%', clipPath: p.clip}}>
                <Img src={staticFile('logo-circle.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
              </div>
            </div>
          );
        })}

        {/* ——— الحلقة التدرجية ترسم نفسها حول البناء ——— */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="stingRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={C.pink}/>
              <stop offset="32%" stopColor={C.purple}/>
              <stop offset="64%" stopColor={C.blue}/>
              <stop offset="100%" stopColor={C.green}/>
            </linearGradient>
            <linearGradient id="stingSwooshA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.pink}/><stop offset="100%" stopColor={C.magenta}/>
            </linearGradient>
            <linearGradient id="stingSwooshB" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.blue}/><stop offset="100%" stopColor={C.purple}/>
            </linearGradient>
            <filter id="stingGlow" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="16" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* الحلقة */}
          <circle cx="540" cy="810" r="424" fill="none" stroke="url(#stingRing)" strokeWidth="16"
            strokeDasharray={2664} strokeDashoffset={2664 * (1 - ringT)}
            transform="rotate(-90 540 810)" strokeLinecap="round" filter="url(#stingGlow)"
            opacity={0.95 * glowPulse}/>
          <circle cx="540" cy="810" r="424" fill="none" stroke="rgba(255,236,205,0.3)" strokeWidth="2.5"
            strokeDasharray={2664} strokeDashoffset={2664 * (1 - ringT)} transform="rotate(-90 540 810)"/>

          {/* شرائط محيطة (صدى شرائط الشعار) */}
          <g opacity={swooshT * 0.9}>
            <path d="M150,1170 C330,1330 500,1395 540,1408 C650,1430 810,1355 950,1210"
              fill="none" stroke="url(#stingSwooshA)" strokeWidth="22" strokeLinecap="round"
              strokeDasharray={1150} strokeDashoffset={1150 * (1 - swooshT)}/>
            <path d="M170,470 C320,360 470,315 540,308 C660,296 810,330 930,440"
              fill="none" stroke="url(#stingSwooshB)" strokeWidth="17" strokeLinecap="round"
              strokeDasharray={1050} strokeDashoffset={1050 * (1 - swooshT)} opacity="0.9"/>
          </g>

          {/* معينات العلامة تنبثق */}
          {[
            {x: 205, y: 405, r: -16, col: C.pink, s: 1},
            {x: 268, y: 525, r: 12, col: C.green, s: 0.85},
            {x: 172, y: 645, r: -7, col: C.green, s: 0.7},
            {x: 872, y: 395, r: 17, col: C.pink, s: 0.8},
            {x: 916, y: 560, r: -12, col: C.pink, s: 0.6},
          ].map((d, i) => {
            const sp = diamondSp(i);
            return (
              <g key={i} transform={`translate(${d.x},${d.y}) rotate(${d.r * sp}) scale(${(0.2 + 0.8 * sp) * d.s})`}
                opacity={Math.min(1, sp * 1.6)}>
                <rect x="-15" y="-32" width="30" height="64" rx="4" fill={d.col} filter="url(#stingGlow)"/>
              </g>
            );
          })}
        </svg>

        {/* ——— لمعة ضوئية تجتاح البناء ——— */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
          borderRadius: 0,
        }}>
          <div style={{
            position: 'absolute', top: '-25%', bottom: '-25%', width: '38%',
            left: `${interpolate(shineT, [0, 1], [-60, 150])}%`,
            background: 'linear-gradient(105deg, transparent, rgba(255,247,224,0.42), transparent)',
            transform: 'skewX(-16deg)', mixBlendMode: 'screen',
          }}/>
        </div>

        {/* ——— اسم الاستوديو يُضاء تحت البناء ——— */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 1285, textAlign: 'center',
          opacity: tagT, transform: `translateY(${(1 - tagT) * 24}px)`,
        }}>
          <div style={{
            fontFamily: F.ui, fontSize: 30, letterSpacing: 10, color: C.gold,
            opacity: 0.9,
          }}>ADVERTISING & CREATIVE PRODUCTION</div>
        </div>
      </AbsoluteFill>

      {/* وهج ختامي نابض */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 42%, rgba(255,214,150,${0.10 * glowPulse * settle}), transparent 55%)`,
        mixBlendMode: 'screen', pointerEvents: 'none',
      }}/>
      <Grain opacity={0.11}/>
      <Vignette strength={0.7}/>
    </AbsoluteFill>
  );
};
