#!/usr/bin/env bash
# One preview still per v2 scene.
set -e
cd "$(dirname "$0")/.."
mkdir -p previews/v2
i=1
for fr in 90 230 400 545 700 795 890; do
  npx remotion still AhlaCardAdV2 "previews/v2/scene-$i.jpg" --frame=$fr --image-format=jpeg --log=error
  i=$((i+1))
done
ffmpeg -hide_banner -loglevel error -y -i previews/v2/scene-%d.jpg -vf "scale=540:960,tile=4x2:padding=12:color=0x050507" -frames:v 1 previews/v2/contact-sheet.jpg
