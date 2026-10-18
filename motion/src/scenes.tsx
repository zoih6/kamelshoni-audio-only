import React from 'react';
import {
  AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from 'remotion';
import {C, F, mulberry32, pulse, q12} from './theme';
import {SCENES, LINES, SceneDef} from './data';
import {KineticLine, HighlightWord, Kicker} from './components/text';
import {GoldDust, EcgLine, EquationBurst, EyeGlyph, PulseHeart, WarmGlow, BeatFlash, LightSweep, Tape} from './components/fx';
import {Grain, Vignette, Halftone, PaperPlate, WarmBackdrop, CameraRig} from './components/overlays';

/* ————— آلة حاسبة SVG بزرار قلوب ————— */
const MiniCalc: React.FC<{t: number; style?: React.CSSProperties}> = ({t, style}) => {
  const frame = useCurrentFrame();
  const keys = Array.from({length: 12}, (_, i) => i);
  return (
    <div style={{
      width: 320, background: `linear-gradient(160deg, ${C.goldDim}, ${C.gold})`,
      borderRadius: 26, padding: 22, border: '4px solid rgba(30,20,10,0.55)',
      boxShadow: '0 30px 70px rgba(0,0,0,0.6)', ...style,
    }}>
      <div style={{
        background: 'rgba(20,14,8,0.85)', borderRadius: 12, padding: '14px 18px',
        fontFamily: F.ui, fontSize: 54, color: C.goldLight, textAlign: 'left',
        letterSpacing: 4, marginBottom: 18,
      }}>
        {Math.round(interpolate(t, [0, 1], [0, 143]))} ♥
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12}}>
        {keys.map((k) => {
          const lit = Math.floor(q12(frame) / 6) % 12 === k;
          return (
            <div key={k} style={{
              height: 58, borderRadius: 12,
              background: lit ? C.goldLight : 'rgba(40,26,12,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: lit ? C.ink : C.goldLight, fontFamily: F.ui, fontSize: 30, fontWeight: 700,
              boxShadow: lit ? `0 0 24px ${C.goldLight}` : undefined,
            }}>{k % 3 === 0 ? '♥' : (k * 7) % 10}</div>
          );
        })}
      </div>
    </div>
  );
};

/* ————— غلاف مشهد قياسي: خلفية + طبقات + نص ————— */
const ActLabel: React.FC<{act: number; t: number}> = ({act, t}) => {
  const names = ['حِسَابَات', 'دَوَاء', 'شَوْق', 'عِشْق'];
  return <Kicker text={names[act] ?? ''} t={t}/>;
};

export const SceneView: React.FC<{def: SceneDef; local: number; dur: number}> = ({def, local, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = local / dur; // 0..1
  const line = def.lineIdx >= 0 ? LINES[def.lineIdx] : '';
  const lineT = interpolate(local, [6, dur * 0.82], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outT = interpolate(local, [dur - 10, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const act = def.lineIdx >= 0 ? Math.floor(def.lineIdx / 4) : 0;

  const wrap = (children: React.ReactNode, shake = 0) => (
    <CameraRig t={t} kind={def.cam} shake={shake}>{children}</CameraRig>
  );

  switch (def.kind) {
    /* ═══ 1: المقدمة — ECG يرسم العنوان ═══ */
    case 'intro': {
      const draw = interpolate(local, [0, 42], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#0A0806" to="#2A1008" glow="rgba(201,164,100,0.14)"/>
          <Halftone opacity={0.10}/>
          <EcgLine progress={draw} y="38%" width={7}/>
          <div style={{position: 'absolute', left: 0, right: 0, top: '44%', textAlign: 'center'}}>
            <Kicker text="قصيدة كامل شوني" t={Math.min(1, local / 18)}/>
            <div style={{marginTop: 26}}>
              <HighlightWord text="حِسَابَاتْ الْمَحَبَّهْ" t={interpolate(local, [22, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} size={128}/>
            </div>
            <div style={{
              marginTop: 30, fontFamily: F.uiM, fontSize: 40, color: C.cream,
              opacity: interpolate(local, [40, 60], [0, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              letterSpacing: 6,
            }}>MOTION · VOX · 2026</div>
          </div>
          <PulseHeart size={130} color={C.wine} glow={`${C.gold}55`}
            style={{position: 'absolute', left: '50%', top: '25%', transform: 'translateX(-50%)', opacity: 0.85}}/>
          <GoldDust seed={3} count={22}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 2: قلب زجاجي + آلة حاسبة ═══ */
    case 'heartCalc': {
      const z = interpolate(t, [0, 1], [1, 1.12]);
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#0B0906" to="#3A120C"/>
          <PaperPlate src="assets/01-heart-calculator.jpg" variant={0}
            style={{right: '6%', top: '10%', width: '68%', height: '52%'}}/>
          <MiniCalc t={t} style={{position: 'absolute', left: 44, top: 640, transform: `rotate(-6deg) scale(${0.85 + t * 0.05})`}}/>
          <Tape x="24%" y="12%" rot={-9}/>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1180, padding: '0 40px'}}>
            <KineticLine text={line} size={86} hlWords={['حْسَابَاتْ', 'الْمَحَبَّهْ']} startFrame={8} mode="rise"/>
          </div>
          <ActLabel act={0} t={Math.min(1, t * 4)}/>
          <GoldDust seed={5} count={18}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 3: أرقام تتحول لقلوب وعيون ═══ */
    case 'numbersEyes': {
      const rnd = mulberry32(9);
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#0A0908" to="#2C0E14" glow="rgba(201,164,100,0.16)"/>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 50% 40%, rgba(201,164,100,0.18), transparent 60%)`,
          }}/>
          {Array.from({length: 12}, (_, i) => {
            const x = rnd() * 90 + 5, y = rnd() * 70 + 8, d = rnd() * 40, sz = 60 + rnd() * 90;
            const sp = spring({frame: local - 8 - d, fps, config: {damping: 14}});
            return (
              <div key={i} style={{
                position: 'absolute', left: `${x}%`, top: `${y}%`,
                opacity: sp * 0.9, transform: `translateY(${(1 - sp) * 60}px) rotate(${(rnd() - 0.5) * 30}deg)`,
              }}>
                {i % 3 === 0 ? <EyeGlyph size={sz}/> : (
                  <div style={{fontFamily: F.ui, fontSize: sz * 0.62, color: i % 2 ? C.gold : C.goldLight, fontWeight: 700}}>
                    {i % 2 ? '♥' : String((i * 17) % 100)}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center'}}>
            <MiniCalc t={t} style={{margin: '0 auto', transform: `scale(${1.15 - t * 0.15}) rotate(${3 - t * 6}deg)`}}/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 180, padding: '0 40px'}}>
            <KineticLine text={line} size={88} hlWords={['غَلَاتَكْ']} startFrame={6} mode="blur"/>
          </div>
          <BeatFlash intensity={0.7}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 4: معادلات طائرة (عمق) ═══ */
    case 'equations': {
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#080706" to="#1C0A1E" glow="rgba(89,58,147,0.22)"/>
          <PaperPlate src="assets/02-equations-burst.jpg" variant={1}
            style={{left: '4%', top: '8%', width: '92%', height: '56%'}} imgStyle={{opacity: 0.9}}/>
          <EquationBurst t={t}/>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 200, padding: '0 50px'}}>
            <KineticLine text={line} size={84} hlWords={['جَمَعْتْ', 'طَرَحْتَهْ']} startFrame={8} mode="rise"/>
          </div>
          <Halftone opacity={0.12}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 5: ختم ذهبي — "حبك" ═══ */
    case 'stamp': {
      const st = spring({frame: local - 6, fps, config: {damping: 11, stiffness: 130}});
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#0B0806" to="#4A0E0E" glow="rgba(201,164,100,0.22)"/>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{
              fontFamily: F.display, fontSize: 330, color: C.goldLight,
              transform: `scale(${interpolate(st, [0, 1], [2.2, 1])}) rotate(${interpolate(st, [0, 1], [-8, -2])}deg)`,
              opacity: Math.min(1, st * 1.4),
              textShadow: `0 0 90px ${C.gold}, 0 30px 80px rgba(0,0,0,0.7)`,
            }}>حَبَّكْ</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 170, padding: '0 40px'}}>
            <KineticLine text={line} size={78} hlWords={['مَا', 'يْسَاوِي']} startFrame={26} mode="wipe"/>
          </div>
          <div style={{position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 90}}>
            <EyeGlyph size={150} style={{opacity: 0.85}}/>
            <EyeGlyph size={150} style={{opacity: 0.85}}/>
          </div>
          <BeatFlash intensity={1.1}/>
          <GoldDust seed={12} count={24}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 6: رف الصيدلية ═══ */
    case 'apothecary': {
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#080605" to="#20100A" glow="rgba(201,164,100,0.18)"/>
          <PaperPlate src="assets/03-apothecary-shelf.jpg" variant={2}
            style={{left: '2%', top: '6%', width: '96%', height: '60%'}}/>
          <Tape x="70%" y="8%" rot={8}/>
          {/* دخان يكتب "دوا قلبي" */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center'}}>
            <KineticLine text="دَوَا قَلْبِي" size={120} font={F.display} color={C.goldLight}
              hlWords={['دَوَا']} startFrame={14} mode="blur" style={{opacity: 0.95}}/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 160, padding: '0 40px'}}>
            <KineticLine text={line} size={80} startFrame={8} mode="rise"/>
          </div>
          <ActLabel act={1} t={Math.min(1, t * 4)}/>
          <Halftone opacity={0.10}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 7: القارورة المضيئة "أنت" ═══ */
    case 'bottle': {
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#090706" to="#2A0C0C"/>
          <WarmGlow x="50%" y="42%" r={900} color="rgba(201,164,100,0.30)" o={0.7}/>
          <PaperPlate src="assets/04-glowing-bottle.jpg" variant={0}
            style={{left: '50%', top: '7%', width: '56%', height: '58%', transform: 'translateX(-50%)'}}/>
          <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 150, color: C.goldLight, textShadow: `0 0 60px ${C.gold}`}}>أَنْتَ</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, padding: '0 40px'}}>
            <KineticLine text={line} size={82} hlWords={['كَامِلْ']} startFrame={10} mode="rise"/>
          </div>
          <PulseHeart size={120} color={C.wine} glow={`${C.gold}66`}
            style={{position: 'absolute', left: '50%', top: '64%', transform: 'translateX(-50%)'}}/>
          <GoldDust seed={21} count={20}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 8: زوم انتحاري "آه" + كشف الصحراء ═══ */
    case 'crash': {
      const z = interpolate(local, [0, 14, 40, dur], [4.2, 1.35, 1.06, 1.1], {extrapolateRight: 'clamp'});
      const sh = interpolate(local, [0, 20], [26, 0], {extrapolateRight: 'clamp'});
      const ahScale = interpolate(local, [0, 12], [0.2, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#070606" to="#1A0A12" glow="rgba(201,164,100,0.12)"/>
          <AbsoluteFill style={{transform: `scale(${z})`, opacity: interpolate(local, [30, 48], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <Img src={staticFile('assets/05-desert-night.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85}}/>
          </AbsoluteFill>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: interpolate(local, [26, 40], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}>
            <div style={{
              fontFamily: F.display, fontSize: 420, color: C.goldLight,
              transform: `scale(${ahScale})`, textShadow: `0 0 120px ${C.gold}`,
            }}>آهْ</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, padding: '0 40px'}}>
            <KineticLine text={line} size={78} startFrame={42} mode="rise"/>
          </div>
          <BeatFlash intensity={1.3}/>
        </AbsoluteFill>, sh
      );
    }

    /* ═══ 9: الصحراء والقمر — "أضمك" بالنجوم ═══ */
    case 'desert': {
      return wrap(
        <AbsoluteFill>
          <AbsoluteFill>
            <Img src={staticFile('assets/05-desert-night.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
            <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(12,10,8,0.92) 6%, rgba(12,10,8,0.15) 45%, rgba(12,10,8,0.55) 100%)'}}/>
          </AbsoluteFill>
          {/* القمر الطويل */}
          <PaperPlate src="assets/06-giant-moon.jpg" variant={1}
            style={{left: '56%', top: '6%', width: '40%', height: '34%', borderRadius: '50%', clipPath: 'circle(48% at 50% 50%)'}} border={false}/>
          {/* نجوم تكتب أضمك */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center'}}>
            <KineticLine text="أَضُمَّكْ" size={150} font={F.display} color={C.cream}
              startFrame={12} mode="stamp" style={{textShadow: `0 0 70px ${C.goldLight}, 0 0 140px ${C.gold}`}}/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 140, padding: '0 36px'}}>
            <KineticLine text={line} size={76} hlWords={['أَضُمَّكْ', 'حَنِينِي']} startFrame={20} mode="blur"/>
          </div>
          <GoldDust seed={33} count={18} opacity={0.55}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 10: الكتاب المفتوح ═══ */
    case 'book': {
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#0A0705" to="#2A1408" glow="rgba(201,164,100,0.2)"/>
          <PaperPlate src="assets/07-open-book-ink.jpg" variant={2}
            style={{left: '3%', top: '8%', width: '94%', height: '58%'}}/>
          <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}>
            <Kicker text="وَدِعْتُهَا رُوحِي" t={Math.min(1, t * 3)}/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, padding: '0 40px'}}>
            <KineticLine text={line} size={82} hlWords={['رُوحِي', 'عِشْقَهْ']} startFrame={8} mode="rise"/>
          </div>
          <GoldDust seed={44} count={16}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 11: حبر يرسم خريطة القلب ═══ */
    case 'inkMap': {
      const draw = interpolate(local, [8, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#090605" to="#20100A"/>
          <PaperPlate src="assets/07-open-book-ink.jpg" variant={0}
            style={{left: '50%', top: '10%', width: '72%', height: '46%', transform: 'translateX(-50%)', opacity: 0.85}}/>
          <svg viewBox="0 0 600 300" style={{position: 'absolute', left: '50%', top: 640, width: 900, transform: 'translateX(-50%)', overflow: 'visible'}}>
            <path d="M300,250 C150,170 60,120 60,70 C60,35 90,15 125,15 C165,15 195,40 210,65 C225,40 255,15 295,15 C335,15 360,38 360,72 C360,120 300,180 300,250 Z"
              fill="none" stroke={C.gold} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={900} strokeDashoffset={900 * (1 - draw)}
              style={{filter: `drop-shadow(0 0 22px ${C.gold}aa)`}}/>
          </svg>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 140, padding: '0 40px'}}>
            <KineticLine text={line} size={80} hlWords={['أَمَانِي', 'مُنَايَ']} startFrame={12} mode="rise"/>
          </div>
        </AbsoluteFill>
      );
    }

    /* ═══ 12: نجوم وعشق ═══ */
    case 'stars': {
      const rnd = mulberry32(77);
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#060508" to="#140A24" glow="rgba(89,58,147,0.28)"/>
          {Array.from({length: 40}, (_, i) => {
            const x = rnd() * 100, y = rnd() * 100, sz = 2 + rnd() * 5;
            const tw = 0.3 + 0.7 * Math.abs(Math.sin(local / 9 + i));
            return <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`, width: sz, height: sz,
              borderRadius: '50%', background: C.cream, opacity: tw * 0.9,
              boxShadow: `0 0 ${sz * 3}px ${C.goldLight}`,
            }}/>;
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center'}}>
            <KineticLine text="أَعْشَقَكْ" size={170} font={F.display} color={C.goldLight} startFrame={8} mode="stamp"/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 170, padding: '0 40px'}}>
            <KineticLine text={line} size={84} hlWords={['أَعْشَقَكْ']} startFrame={16} mode="blur"/>
          </div>
          <GoldDust seed={55} count={14} opacity={0.5}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 13: ECG الأحلام ═══ */
    case 'ecgDreams': {
      const draw = interpolate(local, [4, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#080605" to="#241008" glow="rgba(201,164,100,0.16)"/>
          <PaperPlate src="assets/08-ecg-gold-line.jpg" variant={1}
            style={{left: '2%', top: '10%', width: '96%', height: '50%'}}/>
          <EcgLine progress={draw} y="70%" width={6}/>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 140, padding: '0 40px'}}>
            <KineticLine text={line} size={82} hlWords={['الْأَحْلَامْ']} startFrame={10} mode="rise"/>
          </div>
          <BeatFlash intensity={0.8}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 14: إعادة — القلب ═══ */
    case 'rHeart': {
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#0B0906" to="#4A0E0E" glow="rgba(201,164,100,0.2)"/>
          <PaperPlate src="assets/01-heart-calculator.jpg" variant={1}
            style={{left: '50%', top: '8%', width: '64%', height: '50%', transform: 'translateX(-50%) rotate(-2deg)'}}/>
          <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 130, color: C.goldLight, textShadow: `0 0 60px ${C.gold}`}}>حْسَابَاتْ</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, padding: '0 40px'}}>
            <KineticLine text={line} size={86} startFrame={6} mode="stamp"/>
          </div>
          <BeatFlash intensity={1}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 15: إعادة — العيون ═══ */
    case 'rEyes': {
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#090706" to="#2C0E14" glow="rgba(201,164,100,0.16)"/>
          <div style={{position: 'absolute', top: 320, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 120}}>
            <EyeGlyph size={230} style={{opacity: 0.9}}/>
            <EyeGlyph size={230} style={{opacity: 0.9}}/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center'}}>
            <HighlightWord text="غَلَاتَكْ" t={interpolate(local, [6, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} size={170}/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, padding: '0 40px'}}>
            <KineticLine text={line} size={82} startFrame={12} mode="rise"/>
          </div>
          <EquationBurst t={t * 0.5}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 16: إعادة — القارورة ═══ */
    case 'rBottle': {
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#080605" to="#2A0C0C"/>
          <WarmGlow x="50%" y="45%" r={1000} color="rgba(201,164,100,0.28)"/>
          <PaperPlate src="assets/04-glowing-bottle.jpg" variant={2}
            style={{left: '50%', top: '12%', width: '52%', height: '52%', transform: `translateX(-50%) rotate(${2 - t * 4}deg)`}}/>
          <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 120, color: C.goldLight, textShadow: `0 0 50px ${C.gold}`}}>دَوَا قَلْبِي</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 140, padding: '0 40px'}}>
            <KineticLine text={line} size={82} startFrame={8} mode="blur"/>
          </div>
          <GoldDust seed={66} count={18}/>
        </AbsoluteFill>
      );
    }

    /* ═══ 17: النبضة الكبيرة ═══ */
    case 'bigPulse': {
      const blow = interpolate(local, [0, 30], [1, 1.25], {extrapolateRight: 'clamp'});
      return wrap(
        <AbsoluteFill>
          <WarmBackdrop from="#0A0806" to="#5A1212" glow="rgba(201,164,100,0.3)"/>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <PulseHeart size={860} beatAmp={0.09} color={C.wine} glow={`${C.gold}77`}/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', transform: `scale(${blow})`}}>
            <KineticLine text="يَا هَوَا قَلْبِي" size={140} font={F.display} color={C.goldLight} startFrame={8} mode="stamp"/>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, padding: '0 40px'}}>
            <KineticLine text={line} size={84} startFrame={18} mode="rise"/>
          </div>
          <BeatFlash intensity={1.4}/>
          <GoldDust seed={77} count={26}/>
        </AbsoluteFill>, 8
      );
    }

    /* ═══ 18: جسر — نبض يتلاشى ═══ */
    case 'bridge': {
      const fade = interpolate(local, [0, dur * 0.7], [1, 0], {extrapolateRight: 'clamp'});
      return (
        <AbsoluteFill style={{background: C.bg}}>
          <AbsoluteFill style={{opacity: fade}}>
            <WarmBackdrop from="#0A0806" to="#3A1208"/>
            <EcgLine progress={1} y="50%" width={5} glow/>
          </AbsoluteFill>
          <GoldDust seed={88} count={18} opacity={0.6}/>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.ui, fontSize: 44, letterSpacing: 14, color: C.gold,
            opacity: interpolate(local, [20, 40, dur - 10], [0, 0.9, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}),
          }}>WAMD STUDIO</div>
        </AbsoluteFill>
      );
    }

    /* ═══ 19-20: يُعالجان في Video.tsx بمكوّن الشعار ═══ */
    default:
      return null;
  }
};

export const sceneIndexOfFrame = (f: number, fps: number): number => {
  const sec = f / fps;
  for (let i = 0; i < SCENES.length; i++) {
    if (sec >= SCENES[i].start && sec < SCENES[i].end) return i;
  }
  return SCENES.length - 1;
};
