import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {C, CUTS, easeOut} from '../theme';

/** Deep animated background: drifting gold glows + perspective "gaming" grid floor. */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const gx = 50 + Math.sin(f / 70) * 18;
  const gy = 38 + Math.cos(f / 90) * 10;
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${gx}% ${gy}%, rgba(242,182,48,0.20), transparent 60%),
             radial-gradient(700px 700px at ${100 - gx}% ${80 - gy / 3}%, rgba(201,139,18,0.16), transparent 65%),
             radial-gradient(1200px 800px at 50% 110%, rgba(255,200,80,0.10), transparent 70%)`,
        }}
      />
      {/* perspective grid floor */}
      <div
        style={{
          position: 'absolute',
          left: -1080,
          right: -1080,
          bottom: -200,
          height: 1300,
          transform: 'perspective(700px) rotateX(72deg)',
          transformOrigin: '50% 100%',
          backgroundImage:
            'linear-gradient(rgba(242,182,48,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(242,182,48,0.35) 2px, transparent 2px)',
          backgroundSize: '120px 120px',
          backgroundPosition: `0px ${(f * 6) % 120}px`,
          maskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 35%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 35%, transparent 80%)',
          opacity: 0.55,
        }}
      />
      {/* horizon glow */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1340,
          height: 6,
          background: 'linear-gradient(90deg, transparent, rgba(255,216,92,0.7), transparent)',
          filter: 'blur(4px)',
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

/** Floating gold dust + soft bokeh. Deterministic (seeded) so every render is identical. */
export const Particles: React.FC<{count?: number}> = ({count = 70}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const big = i % 9 === 0;
        const size = big ? 30 + random(`s${i}`) * 50 : 3 + random(`s${i}`) * 7;
        const speed = 0.6 + random(`v${i}`) * 1.8;
        const x = random(`x${i}`) * 1080 + Math.sin((f + i * 40) / 50) * 25;
        const y = (((random(`y${i}`) * 2100 - f * speed) % 2100) + 2100) % 2100 - 90;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin((f + i * 13) / (12 + (i % 7))));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: big
                ? 'radial-gradient(circle, rgba(255,216,92,0.35), rgba(255,216,92,0) 70%)'
                : 'radial-gradient(circle, #FFF3CC, rgba(242,182,48,0.9) 45%, rgba(242,182,48,0) 75%)',
              opacity: big ? 0.5 : tw,
              filter: big ? 'blur(6px)' : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Film grain + vignette for a cinematic finish. */
export const FilmFinish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.75) 100%)'}}
      />
      <svg width="1080" height="1920" style={{position: 'absolute', opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Light bloom + anamorphic streak on every scene cut. */
export const CutFlashes: React.FC<{cuts?: number[]}> = ({cuts: all = CUTS}) => {
  const f = useCurrentFrame();
  const cuts = all.slice(1, -1);
  let a = 0;
  let streak = 0;
  let sx = 0;
  for (const c of cuts) {
    const d = f - c;
    if (d >= -6 && d <= 16) {
      a = Math.max(a, interpolate(d, [-6, 0, 16], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
      streak = Math.max(streak, interpolate(d, [-6, 0, 12], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
      sx = interpolate(d, [-6, 12], [-700, 700], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    }
  }
  if (a <= 0.001) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 48%, rgba(255,246,213,1), rgba(255,200,80,0.55) 30%, transparent 70%)',
          opacity: a,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 940,
          left: -200 + sx,
          width: 1480,
          height: 26,
          borderRadius: 20,
          background: 'linear-gradient(90deg, transparent, rgba(255,240,200,1), transparent)',
          filter: 'blur(8px)',
          opacity: streak,
        }}
      />
    </AbsoluteFill>
  );
};

/** Diagonal speed lines (energy / gaming feel). */
export const SpeedLines: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity, transform: 'rotate(-20deg) scale(1.4)'}}>
      {new Array(14).fill(0).map((_, i) => {
        const y = random(`ly${i}`) * 1920;
        const len = 200 + random(`ll${i}`) * 500;
        const sp = 40 + random(`lv${i}`) * 50;
        const x = ((random(`lx${i}`) * 2400 + f * sp) % 2600) - 800;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: y,
              left: x,
              width: len,
              height: 3 + (i % 3),
              borderRadius: 4,
              background: 'linear-gradient(90deg, transparent, rgba(255,216,92,0.9))',
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
