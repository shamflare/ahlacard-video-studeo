import React from 'react';
import {Composition} from 'remotion';
import {AhlaCardAd} from './AhlaCardAd';
import {AhlaCardAdV2} from './v2/AhlaCardAdV2';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AhlaCardAd" component={AhlaCardAd} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="AhlaCardAdV2" component={AhlaCardAdV2} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
