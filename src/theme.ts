import {Easing} from 'remotion';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 30 * FPS; // 900 frames

// Scene cuts (frames). Music impacts are synced to these (see scripts/make_music.py).
export const CUTS = [0, 120, 270, 450, 630, 780, DURATION];
export const OVERLAP = 8; // cross-zoom transition half-length

export const C = {
  bg: '#050507',
  charcoal: '#16161B',
  gold: '#F2B630',
  goldDeep: '#C98B12',
  goldLight: '#FFE08A',
  cream: '#FFF3CC',
  white: '#FFFFFF',
};

export const GOLD_GRADIENT =
  'linear-gradient(180deg, #FFF6D5 0%, #FFD85C 30%, #F2B630 55%, #C98B12 78%, #FFE08A 100%)';

export const FONT = "'Cairo', sans-serif";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
