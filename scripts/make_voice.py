"""Arabic voice-over with the free, offline Piper voice ar_JO-kareem (piper-tts).
Usage: python make_voice.py <model_dir> <script.json> <out_dir> [speed] [noise_scale] [noise_w]
Per-line optional "rate" in the JSON multiplies the speed (emphasis lines slower, hook faster).
Writes one WAV per line plus a 30 s timeline track (voice.wav) placed at each line's 'at'."""
import json, sys, os, numpy as np, wave
from piper import PiperVoice, SynthesisConfig

mdir, script, out = sys.argv[1], sys.argv[2], sys.argv[3]
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
NOISE = float(sys.argv[5]) if len(sys.argv) > 5 else 0.6     # higher = livelier intonation
NOISE_W = float(sys.argv[6]) if len(sys.argv) > 6 else 0.7   # higher = more rhythm variation
name = [f for f in os.listdir(mdir) if f.endswith(".onnx")][0]
voice = PiperVoice.load(f"{mdir}/{name}", config_path=f"{mdir}/{name}.json")

class _A:  # tiny adapter: piper -> (samples, sample_rate)
    def __init__(self, x, sr): self.samples, self.sample_rate = x, sr

class tts:
    @staticmethod
    def generate(text, sid=0, speed=1.0):
        cfg = SynthesisConfig(length_scale=1.0 / speed, noise_scale=NOISE, noise_w_scale=NOISE_W)
        chunks = list(voice.synthesize(text, syn_config=cfg))
        x = np.concatenate([c.audio_float_array for c in chunks])
        gap = np.zeros(int(0.12 * chunks[0].sample_rate), np.float32)
        if len(chunks) > 1:
            x = np.concatenate(sum(([c.audio_float_array, gap] for c in chunks), [])[:-1])
        return _A(x, chunks[0].sample_rate)
os.makedirs(out, exist_ok=True)
lines = json.load(open(script)); SR = None; track = None

def save(path, x, sr):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

for i, ln in enumerate(lines):
    sp = speed * ln.get("rate", 1.0)
    a = tts.generate(ln["tts"], sid=0, speed=sp)
    x = np.array(a.samples, dtype=np.float32); SR = a.sample_rate
    dur = len(x) / SR
    for _ in range(4):  # too long for its scene -> re-generate faster until it fits
        if dur <= ln["max"] * 0.97: break
        sp *= dur / (ln["max"] * 0.95)
        a = tts.generate(ln["tts"], sid=0, speed=sp)
        x = np.array(a.samples, dtype=np.float32); dur = len(x) / SR
    if track is None: track = np.zeros(int(30 * SR), dtype=np.float32)
    s = int(ln["at"] * SR); track[s:s + len(x)] += x[: len(track) - s]
    save(f"{out}/line-{i+1}.wav", x, SR)
    print(f"line {i+1}: {len(x)/SR:.2f}s (slot {ln['max']}s) {ln['plain']}")
save(f"{out}/voice.wav", track, SR)
