import {continueRender, delayRender, staticFile} from 'remotion';

// Cairo (SIL Open Font License) — variable font, weights 200–1000.
const handle = delayRender('Loading Cairo font');
const cairo = new FontFace('Cairo', `url(${staticFile('fonts/Cairo.ttf')}) format('truetype')`, {
  weight: '200 1000',
});

cairo
  .load()
  .then(() => {
    (document.fonts as unknown as {add: (f: FontFace) => void}).add(cairo);
    continueRender(handle);
  })
  .catch((err) => {
    console.error('Font failed to load', err);
    continueRender(handle);
  });
