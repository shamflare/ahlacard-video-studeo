import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import './fonts';
import {Background, CutFlashes, FilmFinish, Particles} from './components/Effects';
import {Logo} from './components/Props';
import {SceneShell} from './components/SceneShell';
import {CtaScene, GamesScene, HookScene, LogoScene, MobileScene, StepsScene} from './scenes/Scenes';
import {CUTS, OVERLAP} from './theme';

const SCENES = [HookScene, MobileScene, GamesScene, StepsScene, LogoScene, CtaScene];

/** Small brand bug at the top while the product scenes play. */
const BrandBug: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [CUTS[1], CUTS[1] + 15, CUTS[4] - 15, CUTS[4]], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center', opacity: o}}>
      <Logo width={170} style={{filter: 'drop-shadow(0 0 14px rgba(242,182,48,0.35))'}} />
    </div>
  );
};

export const AhlaCardAd: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#050507'}}>
    <Background />
    <Particles />
    {SCENES.map((Scene, i) => {
      const first = i === 0;
      const last = i === SCENES.length - 1;
      const from = first ? 0 : CUTS[i] - OVERLAP;
      const to = last ? CUTS[i + 1] : CUTS[i + 1] + OVERLAP;
      return (
        <Sequence key={i} from={from} durationInFrames={to - from} name={Scene.name}>
          <SceneShell durationInFrames={to - from} first={first} last={last}>
            <Scene />
          </SceneShell>
        </Sequence>
      );
    })}
    <BrandBug />
    <CutFlashes />
    <FilmFinish />
    <Audio src={staticFile('audio/music.wav')} />
  </AbsoluteFill>
);
