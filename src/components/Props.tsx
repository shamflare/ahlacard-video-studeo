import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {easeOut} from '../theme';

export const LOGO = staticFile('brand/logo.png');

export const Logo: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => (
  <Img src={LOGO} style={{width, height: 'auto', display: 'block', ...style}} />
);

/** Spinning gold coin (generic — no currency symbol, no amounts). */
export const Coin: React.FC<{size: number; spin?: number}> = ({size, spin = 0}) => {
  const sx = Math.cos(spin);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        transform: `scaleX(${Math.max(0.12, Math.abs(sx))})`,
        background: sx > 0
          ? 'radial-gradient(circle at 35% 30%, #FFF6D5, #FFD85C 30%, #E3A21E 60%, #9A6508 100%)'
          : 'radial-gradient(circle at 65% 30%, #FFE9A8, #F2B630 40%, #B07A0C 100%)',
        boxShadow: '0 0 40px rgba(242,182,48,0.55), inset 0 0 0 6px rgba(255,240,190,0.55), inset 0 0 0 14px rgba(160,100,10,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24">
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" fill="rgba(120,75,5,0.55)" />
      </svg>
    </div>
  );
};

/** Smartphone mockup with an animated top-up ring on screen. */
export const Phone: React.FC<{progress: number; done: number}> = ({progress, done}) => {
  const f = useCurrentFrame();
  const R = 130;
  const circ = 2 * Math.PI * R;
  return (
    <div
      style={{
        width: 470,
        height: 940,
        borderRadius: 78,
        padding: 14,
        background: 'linear-gradient(145deg, #FFE08A, #C98B12 35%, #3a2a08 60%, #F2B630)',
        boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 90px rgba(242,182,48,0.35)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 66,
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 35%, #2a2418, #0b0b0e 70%)',
        }}
      >
        {/* notch */}
        <div style={{position: 'absolute', top: 18, left: '50%', width: 130, height: 34, marginLeft: -65, borderRadius: 20, background: '#000'}} />
        {/* signal bars */}
        <div style={{position: 'absolute', top: 92, right: 46, display: 'flex', gap: 8, alignItems: 'flex-end'}}>
          {[0, 1, 2, 3].map((i) => {
            const h = interpolate(progress, [i * 0.2, i * 0.2 + 0.25], [6, 22 + i * 14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return <div key={i} style={{width: 16, height: h, borderRadius: 4, background: '#F2B630', boxShadow: '0 0 12px rgba(242,182,48,0.8)'}} />;
          })}
        </div>
        {/* ring */}
        <svg width={360} height={360} style={{position: 'absolute', top: 230, left: 42}} viewBox="0 0 360 360">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFF1C1" />
              <stop offset="0.5" stopColor="#F2B630" />
              <stop offset="1" stopColor="#C98B12" />
            </linearGradient>
          </defs>
          <circle cx={180} cy={180} r={R} stroke="rgba(255,255,255,0.08)" strokeWidth={22} fill="none" />
          <circle
            cx={180}
            cy={180}
            r={R}
            stroke="url(#ring)"
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            transform="rotate(-90 180 180)"
            style={{filter: 'drop-shadow(0 0 14px rgba(242,182,48,0.8))'}}
          />
          {/* lightning bolt -> check */}
          <g opacity={1 - done} transform="translate(180 180)">
            <path d="M12 -70 L-40 10 L-2 10 L-14 70 L42 -14 L4 -14 Z" fill="#F2B630" style={{filter: 'drop-shadow(0 0 16px rgba(242,182,48,0.9))'}} />
          </g>
          <g opacity={done} transform={`translate(180 180) scale(${0.6 + done * 0.4})`}>
            <path d="M-55 0 L-15 40 L60 -45" stroke="#FFE08A" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" style={{filter: 'drop-shadow(0 0 16px rgba(242,182,48,0.9))'}} />
          </g>
        </svg>
        {/* screen pills (abstract UI, no text claims) */}
        {[0, 1, 2].map((i) => {
          const p = interpolate(f, [20 + i * 6, 40 + i * 6], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 50,
                right: 50,
                top: 640 + i * 66,
                height: 46,
                borderRadius: 23,
                background: i === 0 ? 'linear-gradient(90deg, #C98B12, #FFD85C)' : 'rgba(255,255,255,0.08)',
                opacity: p,
                transform: `translateX(${(1 - p) * 60}px)`,
                width: i === 0 ? undefined : `${70 - i * 15}%`,
                marginLeft: 'auto',
              }}
            />
          );
        })}
        {/* glass reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.10) ${45 + Math.sin(f / 20) * 5}%, transparent 55%)`,
          }}
        />
      </div>
    </div>
  );
};

/** Stylised gamepad (original drawing). */
export const Gamepad: React.FC<{width: number; glow?: number}> = ({width, glow = 1}) => (
  <svg width={width} height={width * 0.62} viewBox="0 0 400 248" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${30 * glow}px rgba(242,182,48,0.6))`}}>
    <defs>
      <linearGradient id="padBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b2b33" />
        <stop offset="1" stopColor="#0c0c10" />
      </linearGradient>
      <linearGradient id="padEdge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFF1C1" />
        <stop offset="0.5" stopColor="#F2B630" />
        <stop offset="1" stopColor="#C98B12" />
      </linearGradient>
    </defs>
    <path
      d="M110 40 H290 C350 40 380 80 392 150 C402 212 370 238 340 228 C314 219 300 188 280 172 H120 C100 188 86 219 60 228 C30 238 -2 212 8 150 C20 80 50 40 110 40Z"
      fill="url(#padBody)"
      stroke="url(#padEdge)"
      strokeWidth={6}
    />
    {/* d-pad */}
    <g fill="#F2B630">
      <rect x={88} y={92} width={24} height={64} rx={5} />
      <rect x={68} y={112} width={64} height={24} rx={5} />
    </g>
    {/* buttons */}
    {[
      [300, 96],
      [326, 122],
      [274, 122],
      [300, 148],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={13} fill={i === 0 ? '#FFE08A' : '#F2B630'} />
    ))}
    {/* sticks */}
    <circle cx={160} cy={170} r={24} fill="#1b1b22" stroke="#F2B630" strokeWidth={4} />
    <circle cx={240} cy={170} r={24} fill="#1b1b22" stroke="#F2B630" strokeWidth={4} />
    <rect x={180} y={80} width={40} height={12} rx={6} fill="rgba(242,182,48,0.6)" />
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  gem: <path d="M6 3h12l4 6-10 12L2 9z M2 9h20 M9 3l3 6 3-6 M12 9v12" stroke="#FFE08A" strokeWidth={1.4} fill="none" strokeLinejoin="round" />,
  star: <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" fill="#F2B630" />,
  trophy: <path d="M7 3h10v5a5 5 0 01-10 0z M7 5H3v2a4 4 0 004 4 M17 5h4v2a4 4 0 01-4 4 M12 13v4 M8 21h8 M9 17h6v4H9z" stroke="#FFE08A" strokeWidth={1.4} fill="none" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#F2B630" />,
  pad: <path d="M6 8h12a4 4 0 014 4v2a3 3 0 01-5 2l-2-2H9l-2 2a3 3 0 01-5-2v-2a4 4 0 014-4z M7 11v3 M5.5 12.5h3 M16 11.5h.01 M18 13h.01" stroke="#FFE08A" strokeWidth={1.5} fill="none" strokeLinecap="round" />,
};

export const Icon: React.FC<{name: keyof typeof ICONS | string; size: number}> = ({name, size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 10px rgba(242,182,48,0.7))'}}>
    {ICONS[name]}
  </svg>
);

/** Dark card echoing the logo (black card + gold pill), with a moving shine. */
export const GameCard: React.FC<{icon: string; shine: number; w?: number}> = ({icon, shine, w = 400}) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: w * 0.63,
      borderRadius: w * 0.07,
      overflow: 'hidden',
      background: 'linear-gradient(150deg, #2a2a31 0%, #111116 55%, #050507 100%)',
      border: '3px solid rgba(242,182,48,0.85)',
      boxShadow: '0 30px 70px rgba(0,0,0,0.65), 0 0 40px rgba(242,182,48,0.25)',
    }}
  >
    <div style={{position: 'absolute', top: w * 0.09, right: w * 0.08, width: w * 0.28, height: w * 0.065, borderRadius: 99, background: 'linear-gradient(180deg, #FFE08A, #E3A21E)'}} />
    <div style={{position: 'absolute', bottom: w * 0.08, left: w * 0.08}}>
      <Icon name={icon} size={w * 0.24} />
    </div>
    <div style={{position: 'absolute', bottom: w * 0.1, right: w * 0.08, display: 'flex', gap: w * 0.025}}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{width: w * 0.06, height: w * 0.06, borderRadius: 99, background: 'rgba(242,182,48,0.45)'}} />
      ))}
    </div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(115deg, transparent ${shine - 15}%, rgba(255,240,200,0.35) ${shine}%, transparent ${shine + 15}%)`,
      }}
    />
  </div>
);
