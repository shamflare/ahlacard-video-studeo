#!/usr/bin/env bash
# Mix voice-over + music: voice EQ/compression, music ducked under the voice, final -14 LUFS.
# Usage: scripts/mix_vo.sh <voice.wav> <music.wav> <out.wav>
set -e
ffmpeg -hide_banner -loglevel error -y -i "$1" -i "$2" -filter_complex "
[0:a]aresample=48000,highpass=f=90,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=3,
     acompressor=threshold=0.1:ratio=3:attack=5:release=120:makeup=2,
     aecho=0.85:0.4:35|70:0.10|0.06,pan=stereo|c0=c0|c1=c0,asplit=2[vo][sc];
[1:a][sc]sidechaincompress=threshold=0.015:ratio=10:attack=10:release=400:makeup=1[duck];
[duck]volume=0.75[mus];
[vo]volume=2.4[vox];
[mus][vox]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[out]" -map "[out]" -ar 48000 "$3"
