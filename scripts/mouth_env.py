"""Lip-flap data for the mascot: per video frame (30 fps) mouth 'open' (loudness) and
'wide' (spectral brightness: bright 'ee/s' sounds -> wide, dark 'oo/o' sounds -> round).
Usage: python mouth_env.py <voice.wav> <out.json>"""
import json, sys, wave
import numpy as np
w = wave.open(sys.argv[1]); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
if w.getnchannels() > 1: x = x.reshape(-1, w.getnchannels()).mean(1)
FPS, N = 30, 900; hop = sr // FPS
db, cen = [], []
for i in range(N):
    s = x[i * hop:(i + 1) * hop]
    if len(s) < hop: s = np.pad(s, (0, hop - len(s)))
    db.append(20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-9))
    sp = np.abs(np.fft.rfft(s * np.hanning(len(s)))); fr = np.fft.rfftfreq(len(s), 1 / sr)
    band = (fr > 200) & (fr < 5000)
    cen.append(float((sp[band] * fr[band]).sum() / (sp[band].sum() + 1e-9)))
db = np.array(db); peak = np.percentile(db, 99)
op = np.clip((db - (peak - 28)) / 24, 0, 1)
out = np.zeros(N); a = 0.0
for i, v in enumerate(op):           # fast open, slower close (natural lip flap)
    a = v if v > a else a * 0.55 + v * 0.45
    out[i] = a
wide = np.clip((np.array(cen) - 900) / 1800, 0, 1) * (out > 0.08)
json.dump({"open": [round(float(v), 3) for v in out], "wide": [round(float(v), 3) for v in wide]}, open(sys.argv[2], "w"))
print("frames", N, "speaking frames", int((out > 0.15).sum()))
