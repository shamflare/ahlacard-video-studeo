#!/usr/bin/env bash
# "Announcer" voice chain: deeper pitch (formants preserved), warmth, presence, harmonics, tight compression.
# Usage: scripts/voice_fx.sh <in.wav> <out.wav> <pitch_factor e.g. 0.89 = -2 semitones>
set -e
ffmpeg -hide_banner -loglevel error -y -i "$1" -af "
aresample=48000,rubberband=pitch=$3:formant=preserved:pitchq=quality:transients=smooth,
highpass=f=70,bass=g=4:f=130:w=0.8,equalizer=f=320:t=q:w=1.2:g=-3,equalizer=f=3500:t=q:w=1.0:g=3.5,
aexciter=amount=2:drive=5:freq=3500,
acompressor=threshold=0.06:ratio=4:attack=3:release=90:makeup=3,alimiter=limit=0.95" "$2"
