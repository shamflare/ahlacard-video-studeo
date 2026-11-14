import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {Background, CutFlashes, FilmFinish, Particles} from '../components/Effects';
import {Logo} from '../components/Props';
import {SceneShell} from '../components/SceneShell';
import {OVERLAP} from '../theme';
import {Mascot} from './Mascot';
import {BillsV2, CtaV2, GamesV2, HookV2, MobileV2, OrdersV2, ValueV2} from './ScenesV2';

// Scene cuts (frames @30fps) — synced with `make_music.py ... v2`
export const CUTS_V2 = [0, 105, 270, 420, 570, 720, 810, 900];
const SCENES = [HookV2, GamesV2, MobileV2, BillsV2, OrdersV2, ValueV2, CtaV2];

const BrandBug: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [CUTS_V2[1], CUTS_V2[1] + 15, CUTS_V2[5] - 12, CUTS_V2[5]], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center', opacity: o}}>
      <Logo width={160} style={{filter: 'drop-shadow(0 0 14px rgba(242,182,48,0.35))'}} />
    </div>
  );
};

export const AhlaCardAdV2: React.FC<{audio?: string; mascot?: boolean}> = ({audio = 'audio/music-v2.wav', mascot = false}) => (
  <AbsoluteFill style={{backgroundColor: '#050507'}}>
    <Background />
    <Particles count={50} />
    {SCENES.map((Scene, i) => {
      const first = i === 0;
      const last = i === SCENES.length - 1;
      const from = first ? 0 : CUTS_V2[i] - OVERLAP;
      const to = last ? CUTS_V2[i + 1] : CUTS_V2[i + 1] + OVERLAP;
      return (
        <Sequence key={i} from={from} durationInFrames={to - from} name={Scene.name}>
          <SceneShell durationInFrames={to - from} first={first} last={last} drift={0.04}>
            <Scene />
          </SceneShell>
        </Sequence>
      );
    })}
    <BrandBug />
    {mascot ? (
      <div style={{position: 'absolute', left: 24, top: 1500}}>
        <Mascot size={300} />
      </div>
    ) : null}
    <CutFlashes cuts={CUTS_V2} />
    <FilmFinish />
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
