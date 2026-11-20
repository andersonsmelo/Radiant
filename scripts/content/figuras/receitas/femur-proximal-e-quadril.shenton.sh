#!/bin/zsh
# monta shenton.svg (composição + arco e pontos de overlay.txt) e shenton.png
VB="3050 2350 1000 750" OUT=$PWD/sh.svg node gerar.mjs >/dev/null
sed -i '' "s#</svg>#$(sed 's/[#&]/\\&/g' overlay.txt)</svg>#" sh.svg
cp sh.svg shenton.svg; ./render.sh sh.svg shenton.png 1200 900
