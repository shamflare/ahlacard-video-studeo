"""Arabic voice-over with Azure neural TTS (free F0 tier).
Usage: python make_voice_azure.py <voice e.g. ar-SY-LaithNeural> <script.json> <out_dir> [region]
The API key is injected by the session's network proxy; it is never stored in this repo.
Each line: SSML text, base rate/pitch (%), placed at 'at' seconds; sped up until it fits 'max'."""
import json, os, sys, io, wave, urllib.request
import numpy as np

voice, script, out = sys.argv[1], sys.argv[2], sys.argv[3]
region = sys.argv[4] if len(sys.argv) > 4 else "northeurope"
URL = f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1"
KEY = os.environ.get("AZURE_SPEECH_KEY", "proxy-injected")
SR = 48000

def tts(ssml_text, rate, pitch):
    lang = "-".join(voice.split("-")[:2])
    ssml = (f"<speak version='1.0' xml:lang='{lang}' xmlns='http://www.w3.org/2001/10/synthesis'>"
            f"<voice name='{voice}'><prosody rate='{rate:+.0f}%' pitch='{pitch:+.0f}%'>{ssml_text}</prosody></voice></speak>")
    req = urllib.request.Request(URL, data=ssml.encode("utf-8"), method="POST", headers={
        "Ocp-Apim-Subscription-Key": KEY, "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "riff-48khz-16bit-mono-pcm", "User-Agent": "ahlacard-video-studio"})
    with urllib.request.urlopen(req, timeout=60) as r:
        w = wave.open(io.BytesIO(r.read()))
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    # trim leading/trailing silence
    idx = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, idx[0] - 480): idx[-1] + 2400] if len(idx) else x

def save(path, x):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

os.makedirs(out, exist_ok=True)
track = np.zeros(30 * SR, np.float32)
for i, ln in enumerate(json.load(open(script))):
    rate = ln["rate"]
    x = tts(ln["ssml"], rate, ln["pitch"])
    for _ in range(5):
        dur = len(x) / SR
        if dur <= ln["max"] * 0.97: break
        rate += max(4, (dur / (ln["max"] * 0.95) - 1) * 100)
        x = tts(ln["ssml"], rate, ln["pitch"])
    s = int(ln["at"] * SR); track[s:s + len(x)] += x[: len(track) - s]
    save(f"{out}/line-{i+1}.wav", x)
    print(f"line {i+1}: {len(x)/SR:.2f}s (slot {ln['max']}s, rate {rate:+.0f}%)")
save(f"{out}/voice.wav", track)
