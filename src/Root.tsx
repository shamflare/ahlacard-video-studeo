import React from 'react';
import {Composition} from 'remotion';
import {AhlaCardAd} from './AhlaCardAd';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="AhlaCardAd" component={AhlaCardAd} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
