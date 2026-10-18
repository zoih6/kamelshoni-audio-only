import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, delayRender, continueRender,
} from 'remotion';
import {C, FONT_CSS} from './theme';
import {SCENES, FPS, TOTAL_FRAMES, F_OF} from './data';
import {SceneView} from './scenes';
import {WamdLogoBuild} from './components/logo';
import {HeartWipe} from './components/fx';
import {Grain, Vignette} from './components/overlays';

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          (document as any).fonts.load('700 100px ArefRuqaa'),
          (document as any).fonts.load('700 100px AmiriQ'),
          (document as any).fonts.load('700 100px PlexAr'),
          (document as any).fonts.load('500 100px PlexArM'),
        ]);
        await (document as any).fonts.ready;
      } catch (e) { /* continue anyway */ }
      continueRender(handle);
    };
    load();
  }, [handle]);
};

/* ————— انتقالات بين المشاهد ————— */
const Transition: React.FC<{idx: number; dur: number}> = ({idx, dur}) => {
  const frame = useCurrentFrame(); // محلي داخل الانتقال
  const def = SCENES[idx];
  const t = frame / dur;
  if (def.transition === 'heart') return <HeartWipe t={t}/>;
  if (def.transition === 'flash') {
    return <AbsoluteFill style={{
      background: C.goldLight,
      opacity: interpolate(t, [0, 0.35, 1], [0.85, 0.25, 0], {extrapolateRight: 'clamp'}),
      mixBlendMode: 'screen', pointerEvents: 'none',
    }}/>;
  }
  if (def.transition === 'iris') {
    const r = interpolate(t, [0, 1], [0, 160], {extrapolateRight: 'clamp'});
    return <AbsoluteFill style={{
      background: C.bg,
      clipPath: `circle(${r}% at 50% 50%)`,
      opacity: interpolate(t, [0.75, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      pointerEvents: 'none',
    }}/>;
  }
  if (def.transition === 'slide') {
    return <AbsoluteFill style={{
      background: `linear-gradient(to left, ${C.burgundy}, ${C.goldDim})`,
      transform: `translateX(${interpolate(t, [0, 1], [-105, 105])}%)`,
      opacity: 0.6, pointerEvents: 'none',
    }}/>;
  }
  if (def.transition === 'beat') {
    return <AbsoluteFill style={{
      background: C.goldLight,
      opacity: interpolate(t, [0, 0.5, 1], [0.7, 0.12, 0], {extrapolateRight: 'clamp'}),
      mixBlendMode: 'screen', pointerEvents: 'none',
    }}/>;
  }
  return null;
};

export const KamelShoni: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <style>{FONT_CSS}</style>

      {/* المشاهد */}
      {SCENES.map((def, i) => {
        const from = F_OF(def.start);
        const to = F_OF(def.end);
        const dur = to - from;
        return (
          <Sequence key={def.id} from={from} durationInFrames={dur} name={`S${def.id}-${def.kind}`}>
            <SceneInner def={def} dur={dur}/>
          </Sequence>
        );
      })}

      {/* انتقالات بادئة من المشهد التالي */}
      {SCENES.map((def, i) => {
        if (def.transition === 'none') return null;
        const from = F_OF(def.start);
        return (
          <Sequence key={`tr-${def.id}`} from={from} durationInFrames={14} name={`T${def.id}`}>
            <Transition idx={i} dur={14}/>
          </Sequence>
        );
      })}

      {/* طبقات عامة */}
      <Grain opacity={0.13}/>
      <Vignette strength={0.55}/>

      {/* الصوت الكامل */}
      <Audio src={staticFile('song.mp3')}/>
    </AbsoluteFill>
  );
};

const SceneInner: React.FC<{def: typeof SCENES[number]; dur: number}> = ({def, dur}) => {
  const frame = useCurrentFrame();
  if (def.kind === 'logoA' || def.kind === 'logoB') {
    // الشعار يمتد عبر المشهدين — نمرر الإطار المحلي المطلق
    return null;
  }
  return <SceneView def={def} local={frame} dur={dur}/>;
};

/* ————— تغليف الشعار: مشهدان تحت Sequence واحدة ————— */
export const KamelShoniWithLogo: React.FC = () => {
  return (
    <AbsoluteFill>
      <KamelShoni/>
    </AbsoluteFill>
  );
};
