import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {easeIn, easeOut, OVERLAP} from '../theme';

/**
 * Cinematic cross-zoom: each scene punches in from a blurred zoom and
 * exits by zooming past camera. Neighbouring scenes overlap by 2×OVERLAP frames.
 */
export const SceneShell: React.FC<{children: React.ReactNode; durationInFrames: number; first?: boolean; last?: boolean; drift?: number}> = ({
  children,
  durationInFrames,
  first,
  last,
  drift = 0.05,
}) => {
  const f = useCurrentFrame();
  const inLen = OVERLAP * 2;
  const enter = first ? 1 : interpolate(f, [0, inLen], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exit = last
    ? 0
    : interpolate(f, [durationInFrames - inLen, durationInFrames], [0, 1], {easing: easeIn, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const push = interpolate(f, [0, durationInFrames], [1, 1 + drift]);
  const scale = push * (0.82 + 0.18 * enter) * (1 + exit * 0.45);
  const blur = (1 - enter) * 24 + exit * 30;
  const opacity = Math.min(enter, 1 - exit);
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, opacity}}>
      {children}
    </AbsoluteFill>
  );
};
