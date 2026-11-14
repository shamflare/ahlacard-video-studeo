"""Original synthesized soundtrack for the AhlaCard 30s ad (royalty-free, made from scratch).
120 BPM, minor cinematic-electronic. Impacts + whooshes land on scene cuts."""
import numpy as np, wave, sys
SR = 48000; DUR = 30.0; N = int(SR * DUR); BPM = 120; BEAT = 60 / BPM
PROFILES = {
    # v1: original concept ad
    "v1": dict(cuts=[4.0, 9.0, 15.0, 21.0, 26.0], intro=4.0, half=(21.0, 26.0), outro=26.0,
               arp=(9.0, 21.0), riser2=(16.5, 4.5), shimmer=21.0, big=21.0, extra=[]),
    # v2: real-screens ad (3 slams for the value props at 24/25/26 s)
    "v2": dict(cuts=[3.5, 9.0, 14.0, 19.0, 24.0, 27.0], intro=3.5, half=(24.0, 27.0), outro=27.0,
               arp=(9.0, 19.0), riser2=(19.5, 4.5), shimmer=27.0, big=24.0, extra=[25.0, 26.0]),
}
P = PROFILES[sys.argv[2] if len(sys.argv) > 2 else "v1"]
CUTS = P["cuts"]
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
t_all = np.arange(N) / SR

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR); j = min(N, i + len(sig))
    if j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.414
    R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.414

def env(n, a, d):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    nd = max(1, int(d * SR)); e[-nd:] *= np.linspace(1, 0, nd); return e

def lowpass(x, fc):
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + 0.3 * rng.standard_normal(n) * np.exp(-t * 200)

def clap():
    n = int(0.3 * SR); t = np.arange(n) / SR; nz = rng.standard_normal(n)
    e = np.exp(-t * 18) + 0.6 * np.exp(-((t - 0.012) * 400) ** 2)
    return np.diff(np.concatenate([[0], nz])) * e * 0.5

def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); t = np.arange(n) / SR
    nz = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    return nz * np.exp(-t * (18 if open_ else 90)) * 0.35

def impact():
    n = int(2.2 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.2)
    nz = lowpass(rng.standard_normal(n), 2500 * np.exp(-t * 3) + 120) * np.exp(-t * 3)
    return boom * 1.1 + nz * 1.6

def whoosh(length):
    n = int(length * SR); t = np.linspace(0, 1, n)
    nz = rng.standard_normal(n); fc = 200 + 7000 * t ** 2
    return lowpass(nz, fc) * (t ** 2) * 1.4

def riser(length, f0=200, f1=1600):
    n = int(length * SR); t = np.arange(n) / SR; k = t / length
    f = f0 * (f1 / f0) ** k; ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) + 0.5 * np.sin(2 * ph)) * k ** 2 * 0.25

def saw(f, n, detune=(0.0, 0.11, -0.13)):
    t = np.arange(n) / SR; s = np.zeros(n)
    for d in detune:
        ff = f * 2 ** (d / 12); s += 2 * ((t * ff + rng.random()) % 1) - 1
    return s / len(detune)

# Chords (A minor cinematic): Am - F - C - G  (2 bars = 4 s each... use 2s per chord)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55, 60], [55, 59, 62]]
bass = [45, 41, 36, 43]

# --- Pads (whole track, swells)
seg = 2.0
for k in range(int(DUR / seg)):
    ch = prog[k % 4]; n = int(seg * SR) + int(0.4 * SR)
    pad = sum(saw(mtof(m), n) for m in ch) / len(ch)
    pad = lowpass(pad, 900 + 500 * np.sin(np.linspace(0, np.pi, n)))
    g = 0.16 if P['intro'] <= k * seg < P['outro'] else 0.22
    add(pad * env(n, 0.3, 0.5), k * seg, g, pan=-0.3 if k % 2 else 0.3)

# --- Sub bass (from first cut until the end-hit)
for k in range(int(P['intro'] / BEAT), int(P['outro'] / BEAT)):
    t0 = k * BEAT; f = mtof(bass[int(t0 // seg) % 4] - 12)
    n = int(BEAT * SR * 0.95); tt = np.arange(n) / SR
    b = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)
    side = np.clip((tt / 0.12), 0.25, 1)          # sidechain feel
    add(b * side * env(n, 0.005, 0.05), t0, 0.33)

# --- Drums: build in intro, full groove 4-21s, halftime 21-26 (logo), end hit
for k in range(int(DUR / (BEAT / 2))):
    t0 = k * BEAT / 2; beat_i = k // 2; off = k % 2
    if t0 < P['intro']:
        if t0 >= P['intro'] - 2.0 and off == 0: add(kick(), t0, 0.5 * (t0 / P['intro']))
        continue
    if P['half'][0] <= t0 < P['half'][1]:                   # halftime section
        if off == 0 and beat_i % 4 == 0: add(kick(), t0, 0.8)
        if off == 0 and beat_i % 4 == 2: add(clap(), t0, 0.6)
        add(hat(), t0, 0.25, pan=0.4)
        continue
    if t0 >= P['outro']:
        if t0 < 29.0 and off == 0: add(kick(), t0, 0.75); add(hat(True), t0 + BEAT / 2, 0.35, -0.3)
        continue
    if off == 0: add(kick(), t0, 0.85)
    if off == 0 and beat_i % 2 == 1: add(clap(), t0, 0.7)
    add(hat(open_=(off == 1 and beat_i % 4 == 3)), t0, 0.5, pan=0.35 if off else -0.35)

# --- Arp sparkles (gaming vibe) 9-21s
arp_notes = [0, 3, 7, 12, 7, 3]
for k in range(int(P['arp'][0] / (BEAT / 4)), int(P['arp'][1] / (BEAT / 4))):
    t0 = k * BEAT / 4; root = prog[int(t0 // seg) % 4][0] + 12
    f = mtof(root + arp_notes[k % len(arp_notes)]); n = int(0.14 * SR); tt = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + np.sin(2 * np.pi * 2 * f * tt) * 0.5
    add(lowpass(s, 3000) * np.exp(-tt * 25), t0, 0.07, pan=0.5 if k % 2 else -0.5)

# --- Transitions FX
add(riser(P['intro'] - 0.4), 0.4, 1.0)
for c in CUTS:
    add(whoosh(0.9), c - 0.9, 0.35)
    add(impact(), c, 0.55 if c != P['big'] else 0.75)
for c in P["extra"]:
    add(whoosh(0.5), c - 0.5, 0.3); add(impact(), c, 0.6)
add(riser(P['riser2'][1], 300, 2400), P['riser2'][0], 0.6)
# final shimmer chord on logo / CTA
for m in [69, 72, 76, 81]:
    n = int(4.5 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * mtof(m) * tt) * np.exp(-tt * 0.8) * env(n, 0.01, 1.0), P['shimmer'], 0.05)

# --- Simple stereo reverb (multi-tap feedback delays)
def reverb(x, taps=((0.031, .45), (0.047, .4), (0.071, .35), (0.113, .3), (0.167, .25))):
    y = x.copy()
    for d, g in taps:
        n = int(d * SR); z = np.zeros_like(x); z[n:] = x[:-n] * g; y += lowpass(z, 4000)
    return y
L = reverb(L); R = reverb(R)

mix = np.stack([L, R], 1)
mix *= np.minimum(1, np.minimum(t_all / 0.05, (DUR - t_all) / 1.2))[:, None]  # fades
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.6) / np.tanh(1.6) * 0.89          # soft clip
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok", sys.argv[1])
