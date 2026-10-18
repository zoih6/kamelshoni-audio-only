import React from 'react';
import {Composition, Sequence, AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {KamelShoni} from './Video';
import {WamdLogoBuild} from './components/logo';
import {F_OF, TOTAL_FRAMES, SCENES} from './data';
import {C} from './theme';
import {Grain, Vignette} from './components/overlays';
import {GoldDust} from './components/fx';

const Full: React.FC = () => {
  const frame = useCurrentFrame();
  const logoFrom = F_OF(SCENES[18].start); // 117.6s
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <KamelShoni/>
      {/* بناء الشعار عبر المشهدين 19+20 */}
      <Sequence from={logoFrom} durationInFrames={TOTAL_FRAMES - logoFrom} name="WAMD-Logo-Build">
        <LogoWithPhases/>
      </Sequence>
    </AbsoluteFill>
  );
};

const LogoWithPhases: React.FC = () => {
  const frame = useCurrentFrame();
  // phase B يبدأ بعد 5.4s داخل بناء الشعار
  return <WamdLogoBuild phase={frame < 162 ? 'A' : 'B'}/>;
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="KamelShoni"
      component={Full}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
