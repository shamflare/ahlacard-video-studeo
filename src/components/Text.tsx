import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {easeOut, FONT, GOLD_GRADIENT} from '../theme';

type Props = {
  text: string;
  size: number;
  delay?: number;
  stagger?: number;
  gold?: boolean;
  weight?: number;
  color?: string;
  shine?: boolean;
  style?: React.CSSProperties;
};

/**
 * Arabic-safe kinetic text: animates whole WORDS (never individual letters,
 * so Arabic joining is preserved). Words rise from a blur, staggered right→left.
 */
export const Words: React.FC<Props> = ({
  text,
  size,
  delay = 0,
  stagger = 5,
  gold = false,
  weight = 900,
  color = '#fff',
  shine = false,
  style,
}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        direction: 'rtl',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `0 ${size * 0.28}px`,
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.35,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const local = f - delay - i * stagger;
        const p = interpolate(local, [0, 18], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const shinePos = interpolate(f - delay, [10, 70], [140, -40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * size * 0.6}px) scale(${0.9 + p * 0.1})`,
              filter: `blur(${(1 - p) * 14}px)${gold ? ' drop-shadow(0 0 22px rgba(242,182,48,0.45))' : ''}`,
              ...(gold
                ? {
                    backgroundImage: shine
                      ? `linear-gradient(110deg, transparent ${shinePos - 12}%, rgba(255,255,255,0.95) ${shinePos}%, transparent ${shinePos + 12}%), ${GOLD_GRADIENT}`
                      : GOLD_GRADIENT,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    paddingBottom: size * 0.08,
                  }
                : {color, textShadow: '0 4px 30px rgba(0,0,0,0.6)'}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
