import React from 'react';
import {
  AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from 'remotion';
import {C, F, mulberry32, pulse} from '../theme';
import {GoldDust} from './fx';
import {Grain, Vignette} from './overlays';

/*
  بناء شعار WAMD بطبقات احترافية — المشهدان 19-20
  1) حلقة تدرّج ترسم نفسها     2) معينات ملوّنة تطير لمواضعها
  3) شرائط SVG تنساب          4) البوابة الرسومية (الشعار) تُبنى بزنبرك
  5) WAMD + اسم الاستوديو       6) لمعة ضوئية + نبضة + استقرار
*/
export const WamdLogoBuild: React.FC<{phase: 'A' | 'B'}> = ({phase}) => {
  const frame = useCurrentFrame(); // local frame داخل الـSequence
  const {fps} = useVideoConfig();

  // ————— توقيت الطبقات (بالإطارات المحلية) —————
  const ringT = interpolate(frame, [4, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.5, 0, 0.2, 1)});
  const ribT = interpolate(frame, [20, 84], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const badgeSp = spring({frame: frame - 34, fps, config: {damping: 14, stiffness: 90, mass: 1.1}});
  const markSp = spring({frame: frame - 78, fps, config: {damping: 15, stiffness: 110}});
  const wordSp = spring({frame: frame - 92, fps, config: {damping: 13, stiffness: 120}});
  const tagT = interpolate(frame, [128, 158], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shineT = interpolate(frame, [150, 200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const settle = interpolate(frame, [180, 230], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const breathe = 1 + Math.sin(frame / 22) * 0.006 * settle;
  const camZ = interpolate(frame, [0, 230], [1.08, 1.0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});

  // نبضة قلب مزدوجة على الاستقرار
  const pulseVal = frame > 170 ? pulse(frame, 0.035) : 1;

  // معينات الشعار (وردي/أخضر) — طيران لمواضعها
  const rnd = mulberry32(11);
  const diamonds = [
    {x: 250, y: 330, rot: -18, col: C.pink, delay: 42, s: 1},
    {x: 318, y: 470, rot: 14, col: C.green, delay: 52, s: 0.85},
    {x: 214, y: 610, rot: -8, col: C.green, delay: 62, s: 0.7},
    {x: 840, y: 300, rot: 20, col: C.pink, delay: 48, s: 0.8},
  ];

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      {/* خلفية: توهّج مركزي + غبار ذهبي */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 46%, rgba(90,60,40,0.55), ${C.bg} 68%)`,
      }}/>
      <GoldDust seed={31} count={30} opacity={0.8}/>

      <AbsoluteFill style={{transform: `scale(${camZ * breathe * pulseVal})`}}>
        {/* ——— 1) الحلقة التدرجية ترسم نفسها ——— */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={C.pink}/>
              <stop offset="35%" stopColor={C.purple}/>
              <stop offset="65%" stopColor={C.blue}/>
              <stop offset="100%" stopColor={C.green}/>
            </linearGradient>
            <linearGradient id="ribbon1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.pink}/><stop offset="100%" stopColor={C.magenta}/>
            </linearGradient>
            <linearGradient id="ribbon2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.blue}/><stop offset="100%" stopColor={C.purple}/>
            </linearGradient>
            <filter id="glowF" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* الحلقة: محيط دائرة r=470 → ~2953 */}
          <circle cx="540" cy="860" r="470" fill="none" stroke="url(#ringGrad)" strokeWidth="14"
            strokeDasharray={2953} strokeDashoffset={2953 * (1 - ringT)}
            transform="rotate(-90 540 860)" filter="url(#glowF)" strokeLinecap="round"/>
          <circle cx="540" cy="860" r="470" fill="none" stroke="rgba(255,235,200,0.25)" strokeWidth="2"
            strokeDasharray={2953} strokeDashoffset={2953 * (1 - ringT)} transform="rotate(-90 540 860)"/>

          {/* ——— 3) شرائط متحركة (صدى شرائط الشعار) ——— */}
          <g opacity={ribT * 0.85}>
            <path d="M120,1120 C320,1280 480,1360 540,1380 C640,1410 800,1340 980,1180"
              fill="none" stroke="url(#ribbon1)" strokeWidth="26" strokeLinecap="round"
              strokeDasharray={1100} strokeDashoffset={1100 * (1 - ribT)} opacity="0.9"/>
            <path d="M140,600 C300,480 460,420 540,410 C660,395 820,430 960,560"
              fill="none" stroke="url(#ribbon2)" strokeWidth="20" strokeLinecap="round"
              strokeDasharray={1000} strokeDashoffset={1000 * (1 - ribT)} opacity="0.85"/>
          </g>

          {/* ——— 2) معينات ملوّنة ——— */}
          {diamonds.map((d, i) => {
            const sp = spring({frame: frame - d.delay, fps, config: {damping: 12, stiffness: 100}});
            const fromX = 540 + (d.x - 540) * 2.2;
            const fromY = 860 + (d.y - 860) * 2.2;
            return (
              <g key={i} opacity={Math.min(1, sp * 1.6)}
                transform={`translate(${fromX + (d.x - fromX) * sp},${fromY + (d.y - fromY) * sp}) rotate(${d.rot * sp} 0 0) scale(${(0.4 + 0.6 * sp) * d.s})`}>
                <rect x="-16" y="-34" width="32" height="68" rx="4" fill={d.col} opacity="0.95"
                  filter="url(#glowF)"/>
              </g>
            );
          })}
        </svg>

        {/* ——— 4) البوابة/الشعار يُبنى بزنبرك داخل الحلقة ——— */}
        <div style={{
          position: 'absolute', left: 540, top: 860, transform: `translate(-50%,-50%) scale(${interpolate(badgeSp, [0, 1], [0.62, 1])})`,
          opacity: Math.min(1, badgeSp * 1.5),
          filter: `drop-shadow(0 40px 90px rgba(0,0,0,0.7)) drop-shadow(0 0 ${50 * (1 - badgeSp) + 18}px rgba(255,210,150,0.35))`,
        }}>
          <div style={{
            width: 780, height: 780, borderRadius: '50%', overflow: 'hidden',
            border: '5px solid rgba(255,236,200,0.25)',
            transform: `rotate(${interpolate(badgeSp, [0, 1], [-7, 0])}deg)`,
          }}>
            <Img src={staticFile('logo-circle.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
          </div>

          {/* لمعة ضوئية تمر على الشعار */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute', top: '-40%', bottom: '-40%', width: '45%',
              left: `${interpolate(shineT, [0, 1], [-70, 160])}%`,
              background: 'linear-gradient(105deg, transparent, rgba(255,246,220,0.5), transparent)',
              transform: 'skewX(-18deg)', mixBlendMode: 'screen',
            }}/>
          </div>
        </div>

        {/* ——— 5) علامة W (شرائط أربع) + الكلمة + السطر ——— */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 1345, textAlign: 'center',
        }}>
          {/* W mark مرسومة — تظهر كبناء */}
          <svg width="150" height="86" viewBox="0 0 150 86" style={{opacity: Math.min(1, markSp * 1.4), transform: `translateY(${(1 - markSp) * 26}px)`}}>
            <defs>
              <linearGradient id="wG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={C.blue}/><stop offset="55%" stopColor={C.purple}/><stop offset="100%" stopColor={C.pink}/>
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((i) => {
              const sp = spring({frame: frame - 78 - i * 5, fps, config: {damping: 14, stiffness: 130}});
              return (
                <rect key={i} x={8 + i * 36} y={8 + (i === 1 || i === 3 ? 8 : 0)} width="26" height={70 - (i === 1 || i === 3 ? 14 : 0)} rx="12"
                  fill="url(#wG)" opacity={sp}
                  transform={`rotate(-16 ${21 + i * 36} 45) scale(1)`}
                  style={{transformOrigin: `${21 + i * 36}px 45px`, transform: `translateY(${(1 - sp) * 20}px)`}}/>
              );
            })}
          </svg>

          {/* WAMD — حروف تدخل تباعًا */}
          <div dir="ltr" style={{
            fontFamily: F.ui, fontSize: 74, fontWeight: 700, letterSpacing: 26,
            color: C.cream, marginTop: 6,
          }}>
            {'WAMD'.split('').map((ch, i) => {
              const sp = spring({frame: frame - 94 - i * 6, fps, config: {damping: 13, stiffness: 140}});
              return (
                <span key={i} style={{
                  display: 'inline-block', opacity: sp,
                  transform: `translateY(${(1 - sp) * 34}px) scale(${0.8 + sp * 0.2})`,
                  textShadow: '0 6px 28px rgba(0,0,0,0.6)',
                }}>{ch}</span>
              );
            })}
          </div>

          {/* اسم الاستوديو */}
          <div dir="rtl" style={{
            marginTop: 18, opacity: tagT,
            transform: `translateY(${(1 - tagT) * 22}px)`,
          }}>
            <div style={{
              fontFamily: F.ui, fontSize: 68, fontWeight: 700,
              background: `linear-gradient(to left, ${C.goldLight}, ${C.gold})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: 2,
            }}>ومض</div>
            <div style={{
              fontFamily: F.uiM, fontSize: 34, color: C.cream, opacity: 0.92,
              marginTop: 8, letterSpacing: 1,
            }}>استوديو الإعلانات والإنتاج الإبداعي</div>
          </div>
        </div>
      </AbsoluteFill>

      <Grain opacity={0.12}/>
      <Vignette strength={0.72}/>
    </AbsoluteFill>
  );
};
