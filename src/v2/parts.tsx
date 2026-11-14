import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const screen = (name: string) => staticFile(`screens/${name}.jpg`);

/** Gold phone frame showing a REAL ahlacard.com screenshot (1080×1740). */
export const ScreenPhone: React.FC<{src: string; width: number; style?: React.CSSProperties}> = ({src, width, style}) => {
  const f = useCurrentFrame();
  const pad = width * 0.035;
  const inner = width - pad * 2;
  const screenH = inner * (1740 / 1080);
  return (
    <div
      style={{
        width,
        padding: pad,
        paddingTop: pad * 2.2,
        paddingBottom: pad * 2.2,
        borderRadius: width * 0.13,
        background: 'linear-gradient(145deg, #FFE08A, #C98B12 30%, #2b1f06 55%, #F2B630 85%, #FFE08A)',
        boxShadow: '0 70px 140px rgba(0,0,0,0.75), 0 0 110px rgba(242,182,48,0.35)',
        ...style,
      }}
    >
      <div style={{position: 'relative', width: inner, height: screenH, borderRadius: width * 0.08, overflow: 'hidden', background: '#000'}}>
        <Img src={src} style={{width: '100%', height: '100%', display: 'block'}} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.16) ${42 + Math.sin(f / 22) * 6}%, transparent 54%)`,
          }}
        />
      </div>
    </div>
  );
};

/** A real UI detail that pops out of the screen toward the camera, framed in gold. */
export const Callout: React.FC<{
  src: string;
  width: number;
  p: number; // 0..1 entrance progress
  from?: {x: number; y: number; s: number};
  radius?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({src, width, p, from = {x: 0, y: 80, s: 0.55}, radius = 30, children, style}) => (
  <div
    style={{
      position: 'relative',
      width,
      borderRadius: radius,
      overflow: 'hidden',
      border: '4px solid #F2B630',
      boxShadow: `0 40px 90px rgba(0,0,0,0.7), 0 0 ${30 + p * 40}px rgba(242,182,48,0.55)`,
      transform: `translate(${(1 - p) * from.x}px, ${(1 - p) * from.y}px) scale(${from.s + (1 - from.s) * p}) perspective(1200px) rotateX(${(1 - p) * 25}deg)`,
      opacity: Math.min(1, p * 2),
      filter: p < 0.98 ? `blur(${(1 - p) * 8}px)` : undefined,
      ...style,
    }}
  >
    <Img src={src} style={{width: '100%', display: 'block'}} />
    {children}
  </div>
);

/** Finger-tap ripple (for "pressing" a real button). */
export const Tap: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const t = interpolate(f - at, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (f < at - 10 || t >= 1) return null;
  const press = interpolate(f - at, [-10, 0, 6], [0, 1, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - 40,
          top: y - 40,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
          border: '3px solid rgba(255,255,255,0.9)',
          opacity: press * (1 - t),
          transform: `scale(${1 - press * 0.2})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 40,
          top: y - 40,
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '5px solid #FFE08A',
          opacity: 1 - t,
          transform: `scale(${1 + t * 2.5})`,
        }}
      />
    </>
  );
};

/** Gold highlight ring around a region of a callout. */
export const Highlight: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin((f - at) / 5) * 0.03;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 18,
        border: '5px solid #FFD85C',
        boxShadow: '0 0 30px rgba(255,216,92,0.9), inset 0 0 20px rgba(255,216,92,0.35)',
        opacity: p,
        transform: `scale(${(1.4 - p * 0.4) * pulse})`,
      }}
    />
  );
};

/** Small gold-outlined feature chip. */
export const Chip: React.FC<{text: string; p: number}> = ({text, p}) => (
  <div
    style={{
      direction: 'rtl',
      padding: '10px 34px 16px',
      borderRadius: 999,
      border: '2px solid rgba(242,182,48,0.8)',
      background: 'rgba(20,16,6,0.75)',
      color: '#FFE08A',
      fontFamily: "'Cairo', sans-serif",
      fontWeight: 700,
      fontSize: 46,
      whiteSpace: 'nowrap',
      opacity: p,
      transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + p * 0.15})`,
      boxShadow: '0 0 24px rgba(242,182,48,0.25)',
    }}
  >
    {text}
  </div>
);
