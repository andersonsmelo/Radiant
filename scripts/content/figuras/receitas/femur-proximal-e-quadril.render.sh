#!/bin/zsh
# uso: render.sh in.svg out.png largura altura [fundo]  (caminhos de saída absolutos ou relativos)
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
IN=${1:A}; OUT=${2:A}
H=$(mktemp -d)/p.html
echo "<html><body style='margin:0;background:${5:-#171920}'><img src='file://$IN' style='width:${3}px;height:${4}px;display:block'></body></html>" > $H
"$C" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=$3,$4 --screenshot=$OUT file://$H >/dev/null 2>&1
