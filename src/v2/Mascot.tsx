import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import mouthData from './mouth-mona.json';

/**
 * "Cardo" — an original AhlaCard mascot: a black card with a gold frame (like the logo),
 * the logo's gold pill as a badge and the gold ribbon as a scarf.
 * Mouth is driven by the voice-over (open = loudness, wide = brightness of the sound).
 * Acts per scene: pops in & waves (hook), points at the content (features),
 * jumps on each value-prop slam, points up at the CTA and winks at the end.
 */
const SLAMS = [720, 750, 780];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Mascot: React.FC<{size?: number}> = ({size = 330}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = mouthData.open[Math.min(f, mouthData.open.length - 1)] ?? 0;
  const wide = mouthData.wide[Math.min(f, mouthData.wide.length - 1)] ?? 0;

  // entrance pop
  const pop = spring({frame: f - 6, fps, config: {damping: 9, mass: 0.8}});
  // jumps on slams
  let jump = 0;
  let squash = 0;
  for (const s of SLAMS) {
    const t = (f - s) / 14;
    if (t >= 0 && t <= 1) jump = Math.max(jump, Math.sin(t * Math.PI));
    const l = f - (s + 14);
    if (l >= 0 && l < 6) squash = Math.max(squash, Math.sin((l / 6) * Math.PI));
  }
  const idle = Math.sin(f / 9) * 6;
  const talkBob = open * 4;
  const y = (1 - pop) * 520 - jump * 90 + idle - talkBob;
  const sx = 1 + squash * 0.08 - jump * 0.04;
  const sy = 1 - squash * 0.08 + jump * 0.06;
  const tilt = Math.sin(f / 23) * 3 + (f > 810 ? -4 : 0);

  // blink every ~3 s (deterministic), plus a wink at the end
  const bt = f % 95;
  const blink = bt < 4 ? [1, 0.15, 0.15, 1][bt] : 1;
  const wink = interpolate(f, [872, 876, 886, 890], [1, 0.12, 0.12, 1], clamp);

  // gaze toward the content (up-right), toward the button at the CTA
  const gx = f > 810 ? 0.6 : 0.75;
  const gy = f > 810 ? -0.75 : -0.35;

  // right arm (toward the content): wave -> point -> celebrate -> point up
  let armR: number;
  if (f < 105) armR = -95 + Math.sin(f / 3.2) * 28; // waving
  else if (f < 712) armR = -32 + Math.sin(f / 14) * 6; // pointing at features
  else if (f < 810) armR = -60 + jump * -25; // celebrating (up-right)
  else armR = -62 + Math.sin(f / 10) * 4; // pointing up at the CTA
  const armL = f >= 712 && f < 810 ? -120 - jump * -25 : 125 + Math.sin(f / 11) * 5; // up-left when celebrating, else hanging
  const brow = jump * 9 + (f < 105 ? 4 : 0) + open * 3;

  const mouthRx = 16 + wide * 14 + open * 6;
  const mouthRy = 3 + open * 22;
  const shine = ((f * 1.6) % 260) - 80;

  const Arm: React.FC<{x: number; y: number; angle: number}> = ({x, y: ay, angle}) => (
    <g transform={`translate(${x} ${ay}) rotate(${angle})`}>
      <line x1={0} y1={0} x2={78} y2={0} stroke="#E9AC2A" strokeWidth={15} strokeLinecap="round" />
      <line x1={4} y1={-3} x2={74} y2={-3} stroke="#FFE08A" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <circle cx={86} cy={0} r={17} fill="url(#mGold)" stroke="#8a5a06" strokeWidth={2} />
    </g>
  );

  return (
    <div
      style={{
        width: size,
        height: size * (400 / 300),
        transform: `translateY(${y}px) rotate(${tilt}deg) scale(${sx}, ${sy})`,
        transformOrigin: '50% 95%',
        opacity: Math.min(1, pop * 2),
      }}
    >
      <svg viewBox="-20 0 340 400" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="mGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF1C1" />
            <stop offset="0.45" stopColor="#F2B630" />
            <stop offset="1" stopColor="#B07A0C" />
          </linearGradient>
          <linearGradient id="mBody" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#34343c" />
            <stop offset="0.55" stopColor="#141418" />
            <stop offset="1" stopColor="#060608" />
          </linearGradient>
          <linearGradient id="mShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.22} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <clipPath id="mClip">
            <rect x={40} y={40} width={220} height={270} rx={36} />
          </clipPath>
          <filter id="mGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ground shadow */}
        <ellipse cx={150} cy={392} rx={90 - jump * 30} ry={12 - jump * 4} fill="rgba(0,0,0,0.55)" />
        {/* legs */}
        {[115, 185].map((lx, i) => (
          <g key={lx}>
            <line x1={lx} y1={300} x2={lx} y2={360 + (i ? Math.sin(f / 9) : -Math.sin(f / 9)) * 2} stroke="#E9AC2A" strokeWidth={15} strokeLinecap="round" />
            <ellipse cx={lx + (i ? 10 : -10)} cy={370} rx={26} ry={12} fill="url(#mGold)" stroke="#8a5a06" strokeWidth={2} />
          </g>
        ))}
        {/* left arm (behind) */}
        <Arm x={44} y={200} angle={armL} />

        {/* body */}
        <g filter="url(#mGlow)">
          <rect x={40} y={40} width={220} height={270} rx={36} fill="url(#mBody)" stroke="url(#mGold)" strokeWidth={7} />
        </g>
        <g clipPath="url(#mClip)">
          <rect x={shine} y={0} width={70} height={400} fill="url(#mShine)" transform="skewX(-18)" />
          {/* gold ribbon scarf (echo of the logo's "A" ribbon) */}
          <path d="M20 300 C 80 250, 140 330, 280 262" stroke="url(#mGold)" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M20 300 C 80 250, 140 330, 280 262" stroke="rgba(255,255,255,0.35)" strokeWidth={4} fill="none" transform="translate(0 -6)" />
        </g>
        {/* logo pill badge */}
        <rect x={178} y={62} width={60} height={16} rx={8} fill="url(#mGold)" />

        {/* eyebrows */}
        <path d={`M92 ${118 - brow} Q115 ${104 - brow} 138 ${116 - brow}`} stroke="url(#mGold)" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={`M162 ${116 - brow} Q185 ${104 - brow} 208 ${118 - brow}`} stroke="url(#mGold)" strokeWidth={7} fill="none" strokeLinecap="round" />

        {/* eyes */}
        {[115, 185].map((ex, i) => {
          const k = i === 1 ? Math.min(blink, wink) : blink;
          return (
            <g key={ex} transform={`translate(${ex} 162) scale(1 ${k})`}>
              <ellipse cx={0} cy={0} rx={29} ry={35} fill="#fff" />
              <circle cx={gx * 9} cy={gy * 11} r={15} fill="#16110a" />
              <circle cx={gx * 9 + 5} cy={gy * 11 - 6} r={5} fill="#fff" />
              <circle cx={gx * 9} cy={gy * 11} r={15} fill="none" stroke="#F2B630" strokeWidth={3} opacity={0.7} />
            </g>
          );
        })}

        {/* cheeks */}
        <circle cx={88} cy={214} r={12} fill="rgba(242,182,48,0.35)" />
        <circle cx={212} cy={214} r={12} fill="rgba(242,182,48,0.35)" />

        {/* mouth */}
        {open < 0.08 ? (
          <path d="M128 226 Q150 246 172 226" stroke="url(#mGold)" strokeWidth={6} fill="none" strokeLinecap="round" />
        ) : (
          <g transform="translate(150 232)">
            <ellipse cx={0} cy={0} rx={mouthRx} ry={mouthRy} fill="#2a0707" stroke="url(#mGold)" strokeWidth={4} />
            {mouthRy > 10 ? <ellipse cx={0} cy={mouthRy * 0.45} rx={mouthRx * 0.55} ry={mouthRy * 0.35} fill="#d9566b" /> : null}
            {mouthRy > 8 ? <rect x={-mouthRx * 0.55} y={-mouthRy + 2} width={mouthRx * 1.1} height={Math.min(7, mouthRy * 0.3)} rx={3} fill="#fff" /> : null}
          </g>
        )}

        {/* right arm (front) */}
        <Arm x={256} y={200} angle={armR} />
      </svg>
    </div>
  );
};
