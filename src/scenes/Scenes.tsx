import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Coin, GameCard, Gamepad, Icon, Logo, LOGO, Phone} from '../components/Props';
import {SpeedLines} from '../components/Effects';
import {Words} from '../components/Text';
import {C, easeInOut, easeOut, FONT, GOLD_GRADIENT} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ───────────── 1. HOOK (0–4s) ───────────── */
export const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  // glitch window for the headline entrance
  const glitch = f > 8 && f < 30 && random(`g${Math.floor(f / 2)}`) > 0.35;
  const gx = glitch ? (random(`gx${f}`) - 0.5) * 40 : 0;
  const ring = (k: number) => interpolate((f + k * 30) % 90, [0, 90], [0, 1]);
  const head = interpolate(f, [8, 26], [0, 1], {easing: easeOut, ...clamp});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <SpeedLines opacity={0.55} />
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            width: 300 + ring(k) * 900,
            height: 300 + ring(k) * 900,
            borderRadius: '50%',
            border: '3px solid rgba(242,182,48,0.6)',
            opacity: (1 - ring(k)) * 0.7,
            boxShadow: '0 0 40px rgba(242,182,48,0.4)',
          }}
        />
      ))}
      <div style={{position: 'absolute', top: 640, width: 1000, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 1000,
            fontSize: 150,
            whiteSpace: 'nowrap',
            direction: 'rtl',
            lineHeight: 1.3,
            color: '#fff',
            opacity: head,
            transform: `translateX(${gx}px) scale(${1.4 - head * 0.4})`,
            filter: `blur(${(1 - head) * 18}px)`,
            textShadow: glitch
              ? '10px 0 0 rgba(255,0,80,0.85), -10px 0 0 rgba(0,220,255,0.85)'
              : '4px 0 0 rgba(242,182,48,0.55), -3px 0 0 rgba(255,255,255,0.15), 0 0 60px rgba(242,182,48,0.5)',
            clipPath: glitch ? `inset(${random(`c${f}`) * 40}% 0 ${random(`d${f}`) * 40}% 0)` : undefined,
          }}
        >
          جاهز للعب؟
        </div>
        <Words text="لا تدع الرصيد يوقفك" size={78} delay={42} weight={700} gold shine style={{marginTop: 30}} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 2. MOBILE TOP-UP (4–9s) ───────────── */
export const MobileScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pIn = spring({frame: f - 4, fps, config: {damping: 14, mass: 0.9}});
  const progress = interpolate(f, [30, 110], [0, 1], {easing: easeInOut, ...clamp});
  const done = interpolate(f, [110, 122], [0, 1], clamp);
  const float = Math.sin(f / 18) * 12;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 250, width: 1000}}>
        <Words text="اشحن رصيد هاتفك" size={100} delay={6} gold shine />
        <Words text="بكل سهولة" size={70} delay={22} weight={600} style={{marginTop: 4, opacity: 0.92}} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 720,
          transform: `perspective(1600px) translateY(${(1 - pIn) * 700 + float}px) rotateY(${-28 + pIn * 16}deg) rotateX(${8 - pIn * 4}deg)`,
        }}
      >
        <Phone progress={progress} done={done} />
      </div>
      {/* coins flying into the phone */}
      {new Array(8).fill(0).map((_, i) => {
        const start = 18 + i * 11;
        const t = interpolate(f, [start, start + 34], [0, 1], {easing: easeInOut, ...clamp});
        const side = i % 2 ? 1 : -1;
        const x0 = 540 + side * (560 + random(`cx${i}`) * 140);
        const y0 = 760 + random(`cy${i}`) * 900;
        const x = interpolate(t, [0, 1], [x0, 540]);
        const y = interpolate(t, [0, 1], [y0, 1130]) - Math.sin(t * Math.PI) * 220;
        const s = 120 * (1 - t * 0.7);
        return (
          <div key={i} style={{position: 'absolute', left: x - s / 2, top: y - s / 2, opacity: t > 0 && t < 1 ? 1 : 0}}>
            <Coin size={s} spin={f / 4 + i} />
          </div>
        );
      })}
      {/* success burst */}
      <div
        style={{
          position: 'absolute',
          top: 1190 - 300,
          left: 540 - 300,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,224,138,0.75), transparent 65%)',
          opacity: interpolate(f, [110, 116, 140], [0, 1, 0], clamp),
          transform: `scale(${interpolate(f, [110, 140], [0.4, 1.6], clamp)})`,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};

/* ───────────── 3. GAME CARDS (9–15s) ───────────── */
const CARD_ICONS = ['gem', 'trophy', 'star', 'bolt', 'pad'];
export const GamesScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fan = spring({frame: f - 14, fps, config: {damping: 16, mass: 1.1}});
  const pad = spring({frame: f - 4, fps, config: {damping: 11}});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 250, width: 1000}}>
        <Words text="وبطاقات الألعاب" size={124} delay={6} gold shine />
        <Words text="لمتعة لا تتوقف" size={70} delay={22} weight={600} />
      </div>
      {/* fan of cards */}
      <div style={{position: 'absolute', top: 760, left: 540, width: 0, height: 0}}>
        {CARD_ICONS.map((ic, i) => {
          const k = i - 2;
          const sway = Math.sin((f + i * 10) / 28) * 2;
          const rot = k * 17 * fan + sway;
          const lift = -Math.abs(k) * 30 * fan;
          return (
            <div
              key={ic}
              style={{
                position: 'absolute',
                left: -200,
                top: -126 + lift,
                transformOrigin: '50% 260%',
                transform: `rotate(${rot}deg) translateY(${(1 - fan) * 120}px)`,
                opacity: interpolate(f, [10 + i * 2, 22 + i * 2], [0, 1], clamp),
                zIndex: 10 - Math.abs(k),
              }}
            >
              <GameCard icon={ic} shine={((f * 2.2 + i * 30) % 220) - 60} />
            </div>
          );
        })}
      </div>
      {/* gamepad hero */}
      <div
        style={{
          position: 'absolute',
          top: 1080,
          transform: `translateY(${(1 - pad) * 500 + Math.sin(f / 16) * 14}px) rotate(${Math.sin(f / 24) * 4 - (1 - pad) * 25}deg) scale(${0.6 + pad * 0.4})`,
        }}
      >
        <Gamepad width={720} glow={1 + Math.sin(f / 8) * 0.25} />
      </div>
      {/* orbiting icons */}
      {['star', 'gem', 'bolt', 'trophy'].map((ic, i) => {
        const a = f / 40 + (i * Math.PI) / 2;
        return (
          <div
            key={ic}
            style={{
              position: 'absolute',
              left: 540 + Math.cos(a) * 430 - 45,
              top: 1640 + Math.sin(a) * 70 - 45,
              opacity: interpolate(f, [30, 45], [0, 0.9], clamp),
              transform: `scale(${0.75 + (Math.sin(a) + 1) * 0.25})`,
              zIndex: Math.sin(a) > 0 ? 5 : 0,
            }}
          >
            <Icon name={ic} size={90} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────── 4. SIMPLE STEPS (15–21s) ───────────── */
const STEPS = [
  {n: '١', t: 'اختر ما تحتاجه', icon: 'gem'},
  {n: '٢', t: 'أكمل طلبك', icon: 'bolt'},
  {n: '٣', t: 'واستمتع باللعب', icon: 'pad'},
];
export const StepsScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 300, width: 1000}}>
        <Words text="بخطوات بسيطة" size={128} delay={6} gold shine />
      </div>
      {/* connecting line */}
      <div
        style={{
          position: 'absolute',
          top: 720,
          right: 177,
          width: 6,
          height: interpolate(f, [30, 130], [0, 560], {easing: easeInOut, ...clamp}),
          borderRadius: 3,
          background: 'linear-gradient(180deg, #FFE08A, #C98B12)',
          boxShadow: '0 0 20px rgba(242,182,48,0.8)',
        }}
      />
      {STEPS.map((s, i) => {
        const start = 24 + i * 34;
        const p = spring({frame: f - start, fps, config: {damping: 15}});
        const active = interpolate(f, [start + 8, start + 18, start + 40], [0, 1, 0.35], clamp);
        return (
          <div
            key={s.n}
            style={{
              position: 'absolute',
              top: 640 + i * 280,
              width: 900,
              height: 220,
              direction: 'rtl',
              display: 'flex',
              alignItems: 'center',
              gap: 44,
              padding: '0 50px',
              boxSizing: 'border-box',
              borderRadius: 44,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))',
              border: `2px solid rgba(242,182,48,${0.3 + active * 0.6})`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${active * 60}px rgba(242,182,48,0.45)`,
              backdropFilter: 'blur(10px)',
              opacity: p,
              transform: `translateX(${(1 - p) * -700}px) scale(${0.9 + p * 0.1})`,
            }}
          >
            <div
              style={{
                width: 140,
                height: 140,
                flexShrink: 0,
                borderRadius: '50%',
                background: GOLD_GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 84,
                color: '#1a1205',
                boxShadow: '0 0 40px rgba(242,182,48,0.6)',
                lineHeight: 1,
              }}
            >
              {s.n}
            </div>
            <div style={{flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 66, color: '#fff', whiteSpace: 'nowrap'}}>{s.t}</div>
            <Icon name={s.icon} size={96} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────── 5. LOGO REVEAL (21–26s) ───────────── */
export const LogoScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f - 6, fps, config: {damping: 13, mass: 1.2}});
  const shine = interpolate(f, [24, 60], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 70%)'}} />
      {/* light beams */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 790,
            left: 540,
            width: 1600,
            height: 60,
            marginLeft: -800,
            marginTop: -30,
            background: 'linear-gradient(90deg, transparent, rgba(255,216,92,0.18), transparent)',
            transform: `rotate(${i * 30 + f * 0.6}deg)`,
            opacity: interpolate(f, [0, 20], [0, 1], clamp),
            filter: 'blur(6px)',
          }}
        />
      ))}
      {/* expanding rings */}
      {[0, 1, 2].map((k) => {
        const t = interpolate(f, [6 + k * 8, 50 + k * 8], [0, 1], {easing: easeOut, ...clamp});
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              top: 790 - (200 + t * 700) / 2,
              left: 540 - (200 + t * 700) / 2,
              width: 200 + t * 700,
              height: 200 + t * 700,
              borderRadius: '50%',
              border: '3px solid rgba(255,224,138,0.8)',
              opacity: (1 - t) * (t > 0 ? 1 : 0),
            }}
          />
        );
      })}
      {/* sparks */}
      {new Array(36).fill(0).map((_, i) => {
        const a = random(`sa${i}`) * Math.PI * 2;
        const d = interpolate(f, [6, 45], [0, 300 + random(`sd${i}`) * 450], {easing: easeOut, ...clamp});
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 + Math.cos(a) * d,
              top: 790 + Math.sin(a) * d,
              width: 8,
              height: 8,
              borderRadius: 4,
              background: '#FFE08A',
              boxShadow: '0 0 12px #F2B630',
              opacity: interpolate(f, [6, 12, 45], [0, 1, 0], clamp),
            }}
          />
        );
      })}
      {/* glow */}
      <div
        style={{
          position: 'absolute',
          top: 790 - 450,
          left: 540 - 450,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,182,48,0.35), transparent 60%)',
          opacity: pop,
        }}
      />
      {/* logo with shine sweep masked to its alpha */}
      <div
        style={{
          position: 'absolute',
          top: 790 - 260,
          transform: `perspective(1400px) scale(${0.55 + pop * 0.45}) rotateY(${(1 - pop) * 40}deg)`,
          filter: `blur(${(1 - Math.min(1, pop)) * 26}px) drop-shadow(0 0 40px rgba(242,182,48,0.45)) drop-shadow(0 0 2px rgba(255,224,138,0.9))`,
          opacity: Math.min(1, pop * 1.4),
        }}
      >
        <div style={{position: 'relative', width: 830}}>
          <Logo width={830} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(115deg, transparent ${shine - 10}%, rgba(255,255,255,0.85) ${shine}%, transparent ${shine + 10}%)`,
              WebkitMaskImage: `url(${LOGO})`,
              maskImage: `url(${LOGO})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </div>
      <div style={{position: 'absolute', top: 1170, width: 1000}}>
        <Words text="أهلا كارد" size={150} delay={26} stagger={7} gold shine />
        <Words text="رصيدك وألعابك في مكان واحد" size={62} delay={46} stagger={4} weight={600} style={{marginTop: 6}} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 6. CALL TO ACTION (26–30s) ───────────── */
export const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const btn = spring({frame: f - 14, fps, config: {damping: 10}});
  const url = interpolate(f, [30, 52], [0, 1], {easing: easeOut, ...clamp});
  const pulse = 1 + Math.max(0, Math.sin((f - 30) / 6)) * 0.04 * (f > 30 ? 1 : 0);
  const underline = interpolate(f, [44, 70], [0, 1], {easing: easeInOut, ...clamp});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 360,
          opacity: interpolate(f, [4, 18], [0, 1], clamp),
          transform: `translateY(${interpolate(f, [4, 22], [-60, 0], {easing: easeOut, ...clamp})}px)`,
          filter: 'drop-shadow(0 0 30px rgba(242,182,48,0.4))',
        }}
      >
        <Logo width={480} />
      </div>
      <div style={{position: 'absolute', top: 760, width: 1000}}>
        <Words text="لا تنتظر" size={92} delay={8} weight={700} />
      </div>
      {/* button */}
      <div
        style={{
          position: 'absolute',
          top: 920,
          transform: `scale(${(0.4 + btn * 0.6) * pulse})`,
          opacity: Math.min(1, btn * 1.5),
        }}
      >
        {[0, 1].map((k) => {
          const t = ((f - 30 + k * 20) % 40) / 40;
          return f > 30 ? (
            <div
              key={k}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 999,
                border: '4px solid rgba(255,224,138,0.8)',
                transform: `scale(${1 + t * 0.35}, ${1 + t * 0.8})`,
                opacity: 1 - t,
              }}
            />
          ) : null;
        })}
        <div
          style={{
            position: 'relative',
            padding: '18px 110px 30px',
            borderRadius: 999,
            background: GOLD_GRADIENT,
            fontFamily: FONT,
            fontWeight: 1000,
            fontSize: 112,
            color: '#140d02',
            direction: 'rtl',
            boxShadow: '0 0 80px rgba(242,182,48,0.65), inset 0 -8px 0 rgba(120,75,5,0.35)',
          }}
        >
          اشحن الآن
        </div>
      </div>
      {/* URL */}
      <div
        style={{
          position: 'absolute',
          top: 1230,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 104,
          letterSpacing: 2,
          color: '#fff',
          direction: 'ltr',
          opacity: url,
          transform: `translateY(${(1 - url) * 50}px)`,
          filter: `blur(${(1 - url) * 12}px)`,
          textShadow: '0 0 40px rgba(242,182,48,0.55)',
        }}
      >
        ahlacard<span style={{color: C.gold}}>.com</span>
        <div
          style={{
            height: 8,
            marginTop: 4,
            borderRadius: 4,
            width: `${underline * 100}%`,
            marginLeft: `${(1 - underline) * 50}%`,
            background: 'linear-gradient(90deg, transparent, #F2B630, transparent)',
            boxShadow: '0 0 20px rgba(242,182,48,0.9)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
