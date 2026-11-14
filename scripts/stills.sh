#!/usr/bin/env bash
# Render one preview still per scene (frame numbers chosen after each scene's entrance settles).
set -e
cd "$(dirname "$0")/.."
mkdir -p previews
i=1
for fr in 75 230 400 600 740 880; do
  npx remotion still AhlaCardAd "previews/scene-$i.jpg" --frame=$fr --image-format=jpeg --log=error
  i=$((i+1))
done
