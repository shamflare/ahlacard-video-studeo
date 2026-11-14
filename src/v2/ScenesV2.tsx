import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Coin, Logo, LOGO} from '../components/Props';
import {SpeedLines} from '../components/Effects';
import {Words} from '../components/Text';
import {easeInOut, easeOut, FONT, GOLD_GRADIENT} from '../theme';
import {Callout, Chip, Highlight, screen, ScreenPhone, Tap} from './parts';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const useSpring = (delay: number, damping = 14, mass = 1) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, mass}});
};

const Title: React.FC<{title: string; sub?: string; size?: number; top?: number}> = ({title, sub, size = 104, top = 230}) => (
  <div style={{position: 'absolute', top, width: 1040, left: 20}}>
    <Words text={title} size={size} delay={6} gold shine style={{whiteSpace: 'nowrap', flexWrap: 'nowrap'}} />
    {sub ? <Words text={sub} size={54} delay={20} stagger={3} weight={600} style={{marginTop: 2}} /> : null}
  </div>
);

/* ───────────── 1. HOOK (0–3.5s) ───────────── */
export const HookV2: React.FC = () => {
  const f = useCurrentFrame();
  const phones = [
    {src: 'mobile', x: -330, rot: -16, y: 90, d: 10},
    {src: 'bills', x: 330, rot: 16, y: 90, d: 14},
    {src: 'orders', x: 0, rot: 0, y: 0, d: 4},
  ];
  const glitch = f > 4 && f < 24 && random(`hg${Math.floor(f / 2)}`) > 0.35;
  const head = interpolate(f, [4, 20], [0, 1], {easing: easeOut, ...clamp});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <SpeedLines opacity={0.35} />
      {phones.map((p) => {
        const s = useSpring(p.d, 15, 1.1); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div
            key={p.src}
            style={{
              position: 'absolute',
              top: 820 + p.y,
              left: 540 - 220 + p.x,
              transform: `perspective(1800px) translateY(${(1 - s) * 1100 + Math.sin((f + p.d * 9) / 20) * 10}px) rotateZ(${p.rot * s}deg) rotateY(${-p.rot * 0.8}deg) scale(${p.x === 0 ? 1 : 0.88})`,
              filter: p.x === 0 ? undefined : 'brightness(0.7)',
            }}
          >
            <ScreenPhone src={screen(p.src)} width={440} />
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 250, width: 1040}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 1000,
            fontSize: 100,
            textAlign: 'center',
            direction: 'rtl',
            whiteSpace: 'nowrap',
            color: '#fff',
            opacity: head,
            transform: `translateX(${glitch ? (random(`hx${f}`) - 0.5) * 36 : 0}px) scale(${1.35 - head * 0.35})`,
            filter: `blur(${(1 - head) * 16}px)`,
            textShadow: glitch
              ? '9px 0 0 rgba(255,0,80,0.85), -9px 0 0 rgba(0,220,255,0.85)'
              : '0 0 50px rgba(242,182,48,0.5), 0 6px 30px rgba(0,0,0,0.8)',
          }}
        >
          زبونك يطلب شحن؟
        </div>
        <Words text="خلّيها على أهلا كارد" size={78} delay={34} gold shine style={{marginTop: 6}} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 2. GAMES & APPS (3.5–9s) ───────────── */
const TILES = [
  {n: 'tile-8ball', x: -330, r: -10},
  {n: 'tile-pubg', x: 330, r: 10},
  {n: 'tile-4fun', x: 0, r: 0},
];
export const GamesV2: React.FC = () => {
  const f = useCurrentFrame();
  const bar = useSpring(40, 16);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Title title="شحن الألعاب والتطبيقات" sub="أكثر من 80 قسمًا بين ألعاب وتطبيقات" size={80} />
      {TILES.map((t, i) => {
        const s = useSpring(12 + i * 7, 13, 0.9); // eslint-disable-line react-hooks/rules-of-hooks
        const mid = t.x === 0;
        const w = mid ? 360 : 300;
        return (
          <div
            key={t.n}
            style={{
              position: 'absolute',
              top: (mid ? 610 : 680) + Math.sin((f + i * 20) / 18) * 12,
              left: 540 + t.x - w / 2,
              width: w,
              borderRadius: 34,
              overflow: 'hidden',
              border: '4px solid #F2B630',
              boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 50px rgba(242,182,48,0.45)',
              transform: `perspective(1400px) translateZ(${(1 - s) * -1600}px) rotateY(${(1 - s) * (t.x >= 0 ? -70 : 70) + t.r * -1.2}deg) rotateZ(${t.r * s}deg)`,
              opacity: Math.min(1, s * 2),
              zIndex: mid ? 3 : 1,
            }}
          >
            <Img src={screen(t.n)} style={{width: '100%', display: 'block'}} />
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 1270}}>
        <Callout src={screen('games-head')} width={920} p={bar} from={{x: 0, y: 160, s: 0.7}} radius={26}>
          <Highlight x={0} y={2} w={130} h={62} at={62} />
        </Callout>
      </div>
      {/* coins bursting upward */}
      {new Array(10).fill(0).map((_, i) => {
        const st = 20 + i * 6;
        const t = interpolate(f, [st, st + 45], [0, 1], clamp);
        const x = 540 + (random(`gx${i}`) - 0.5) * 900;
        const y = 1700 - t * (900 + random(`gy${i}`) * 400);
        const s = 70 + random(`gs${i}`) * 50;
        return t > 0 && t < 1 ? (
          <div key={i} style={{position: 'absolute', left: x - s / 2, top: y, opacity: Math.sin(t * Math.PI)}}>
            <Coin size={s} spin={f / 4 + i} />
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

/* ───────────── 3. TURKISH MOBILE LINES (9–14s) ───────────── */
export const MobileV2: React.FC = () => {
  const f = useCurrentFrame();
  const ph = useSpring(6, 15);
  const pop = useSpring(34, 13);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Title title="شحن الخطوط التركية" sub="اكتب الرقم… واعرف الباقات بأسعارك" size={90} />
      <div
        style={{
          position: 'absolute',
          top: 560,
          transform: `perspective(1800px) translateY(${(1 - ph) * 900 + Math.sin(f / 18) * 10}px) rotateY(${-22 + ph * 6}deg) rotateX(4deg)`,
        }}
      >
        <ScreenPhone src={screen('mobile')} width={500} />
      </div>
      <div style={{position: 'absolute', top: 1150}}>
        <Callout src={screen('mobile-input')} width={900} p={pop} from={{x: -40, y: -380, s: 0.5}}>
          <Tap x={450} y={326} at={78} />
        </Callout>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 4. BILLS (14–19s) ───────────── */
export const BillsV2: React.FC = () => {
  const f = useCurrentFrame();
  const ph = useSpring(6, 15);
  const pop = useSpring(30, 14);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Title title="ادفع الفواتير" sub="كهرباء · ماء · غاز · إنترنت" size={112} />
      <div
        style={{
          position: 'absolute',
          top: 560,
          transform: `perspective(1800px) translateY(${(1 - ph) * 900 + Math.sin(f / 18) * 10}px) rotateY(${20 - ph * 6}deg) rotateX(4deg)`,
        }}
      >
        <ScreenPhone src={screen('bills')} width={500} />
      </div>
      <div style={{position: 'absolute', top: 1230, transform: `translateX(${interpolate(f, [30, 150], [0, -40])}px)`}}>
        <Callout src={screen('bills-cats')} width={1000} p={pop} from={{x: 700, y: 0, s: 0.8}} radius={26}>
          <Highlight x={770} y={6} w={200} h={186} at={64} />
        </Callout>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 5. ORDERS & PROFIT (19–24s) ───────────── */
export const OrdersV2: React.FC = () => {
  const f = useCurrentFrame();
  const ph = useSpring(6, 15);
  const pop = useSpring(28, 13);
  const chips = ['ربح واضح لكل طلب', 'تصدير Excel', 'تقارير'];
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Title title="تابع طلباتك وأرباحك" size={96} />
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 290,
          transform: `perspective(1800px) translateX(${(1 - ph) * -700}px) translateY(${Math.sin(f / 18) * 10}px) rotateY(${14 + (1 - ph) * 30}deg) rotateX(4deg)`,
          filter: `brightness(${interpolate(f, [28, 45], [1, 0.6], clamp)})`,
        }}
      >
        <ScreenPhone src={screen('orders')} width={500} />
      </div>
      <div style={{position: 'absolute', top: 1040}}>
        <Callout src={screen('orders-card')} width={980} p={pop} from={{x: 0, y: -100, s: 0.45}}>
          <Highlight x={398} y={70} w={196} h={78} at={56} />
        </Callout>
      </div>
      <div style={{position: 'absolute', top: 1470, display: 'flex', gap: 18, direction: 'rtl'}}>
        {chips.map((c, i) => (
          <Chip key={c} text={c} p={interpolate(f, [70 + i * 9, 84 + i * 9], [0, 1], {easing: easeOut, ...clamp})} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 6. VALUE PROPS SLAM (24–27s) ───────────── */
const SLAMS = [
  {t: 'أسعار منافسة', at: 8, size: 124, gold: true, top: 560},
  {t: 'تنفيذ سريع', at: 38, size: 132, gold: false, top: 800},
  {t: 'كل خدماتك في مكان واحد', at: 68, size: 70, gold: true, top: 1060},
];
export const ValueV2: React.FC = () => {
  const f = useCurrentFrame();
  const shake = SLAMS.reduce((acc, s) => {
    const d = f - s.at;
    return d >= 0 && d < 10 ? acc + (10 - d) * 2.2 : acc;
  }, 0);
  const sx = (random(`sx${f}`) - 0.5) * shake;
  const sy = (random(`sy${f}`) - 0.5) * shake;
  return (
    <AbsoluteFill style={{alignItems: 'center', transform: `translate(${sx}px, ${sy}px)`}}>
      <SpeedLines opacity={interpolate(f, [36, 44, 66, 74], [0, 0.9, 0.9, 0.2], clamp)} />
      {SLAMS.map((s) => {
        const p = interpolate(f - s.at, [0, 7], [0, 1], {easing: easeOut, ...clamp});
        const flash = interpolate(f - s.at, [0, 3, 14], [0, 1, 0], clamp);
        if (f < s.at) return null;
        return (
          <div
            key={s.t}
            style={{
              position: 'absolute',
              top: s.top,
              width: 1060,
              textAlign: 'center',
              direction: 'rtl',
              whiteSpace: 'nowrap',
              fontFamily: FONT,
              fontWeight: 1000,
              fontSize: s.size,
              lineHeight: 1.35,
              transform: `scale(${2.6 - p * 1.6})`,
              opacity: p,
              filter: `blur(${(1 - p) * 20}px) drop-shadow(0 0 ${20 + flash * 50}px rgba(242,182,48,${0.45 + flash * 0.5}))`,
              ...(s.gold
                ? {backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}
                : {color: '#fff'}),
            }}
          >
            {s.t}
          </div>
        );
      })}
      {/* underline sweep under the second slam */}
      <div
        style={{
          position: 'absolute',
          top: 1010,
          height: 8,
          borderRadius: 4,
          width: interpolate(f, [42, 58], [0, 700], {easing: easeInOut, ...clamp}),
          background: 'linear-gradient(90deg, transparent, #F2B630, transparent)',
          boxShadow: '0 0 24px rgba(242,182,48,0.9)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ───────────── 7. CTA (27–30s) ───────────── */
export const CtaV2: React.FC = () => {
  const f = useCurrentFrame();
  const logo = useSpring(8, 13, 1.1);
  const btn = useSpring(22, 10);
  const url = interpolate(f, [34, 52], [0, 1], {easing: easeOut, ...clamp});
  const shine = interpolate(f, [20, 55], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 320,
          transform: `scale(${0.6 + logo * 0.4})`,
          opacity: Math.min(1, logo * 1.5),
          filter: 'drop-shadow(0 0 40px rgba(242,182,48,0.5))',
        }}
      >
        <div style={{position: 'relative', width: 560}}>
          <Logo width={560} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(115deg, transparent ${shine - 10}%, rgba(255,255,255,0.85) ${shine}%, transparent ${shine + 10}%)`,
              WebkitMaskImage: `url(${LOGO})`,
              WebkitMaskSize: '100% 100%',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </div>
      <div style={{position: 'absolute', top: 720, width: 1040}}>
        <Words text="ألعاب · موبايل · فواتير" size={70} delay={14} stagger={4} weight={700} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 900,
          transform: `scale(${(0.4 + btn * 0.6) * (1 + Math.max(0, Math.sin((f - 36) / 6)) * 0.04 * (f > 36 ? 1 : 0))})`,
          opacity: Math.min(1, btn * 1.5),
          padding: '16px 120px 30px',
          borderRadius: 999,
          background: GOLD_GRADIENT,
          fontFamily: FONT,
          fontWeight: 1000,
          fontSize: 116,
          color: '#140d02',
          direction: 'rtl',
          boxShadow: '0 0 90px rgba(242,182,48,0.7), inset 0 -8px 0 rgba(120,75,5,0.35)',
        }}
      >
        ابدأ الآن
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1200,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 108,
          letterSpacing: 2,
          color: '#fff',
          direction: 'ltr',
          opacity: url,
          transform: `translateY(${(1 - url) * 50}px)`,
          filter: `blur(${(1 - url) * 12}px)`,
          textShadow: '0 0 40px rgba(242,182,48,0.55)',
        }}
      >
        ahlacard<span style={{color: '#F2B630'}}>.com</span>
      </div>
    </AbsoluteFill>
  );
};
