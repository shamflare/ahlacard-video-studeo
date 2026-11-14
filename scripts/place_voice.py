"""Cut a single voice recording into lines and place each on its scene.
Usage: python place_voice.py <recording.wav (48k mono)> <cuts.json> <out_dir>
cuts.json: [{from, to, at, max}] seconds. Lines longer than 'max' are time-stretched
(tempo only, pitch unchanged) with ffmpeg atempo."""
import json, os, subprocess, sys, wave
import numpy as np
src, cuts, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
SR = 48000; PAD = 0.04
w = wave.open(src); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
track = np.zeros(30 * SR, np.float32)

def save(p, y):
    with wave.open(p, "wb") as o:
        o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
        o.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())

for i, c in enumerate(json.load(open(cuts))):
    a = max(0, int((c["from"] - PAD) * SR)); b = min(len(x), int((c["to"] + PAD) * SR))
    y = x[a:b].copy(); f = int(0.015 * SR)
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    p = f"{out}/line-{i+1}.wav"; save(p, y)
    dur = len(y) / SR
    if dur > c["max"] * 0.97:
        t = dur / (c["max"] * 0.96)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", p, "-af", f"atempo={t:.4f}", "-ar", str(SR), p + ".tmp.wav"], check=True)
        os.replace(p + ".tmp.wav", p)
        w2 = wave.open(p); y = np.frombuffer(w2.readframes(w2.getnframes()), np.int16).astype(np.float32) / 32768
        print(f"line {i+1}: tempo x{t:.3f}")
    s = int(c["at"] * SR); track[s:s + len(y)] += y[: len(track) - s]
    print(f"line {i+1}: {len(y)/SR:.2f}s at {c['at']}s (slot {c['max']}s)")
save(f"{out}/voice.wav", track)
