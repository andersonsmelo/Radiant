#!/bin/zsh
# FILA 64 — condução por adb das medições de 2026-10-19 no emulador radiant-entrada-api34.
#
# Uso: conduzir.sh <escala 0|1> <tela revisao|quiz|inicio> <rotulo> [espera-em-s]
#
# Pré-condições:
# - emulador ligado como emulator-5554, com o dev client Debug 1.4.0 (3) da FILA 61;
# - Metro desta worktree na porta 8081 (Node 20, EXPO_NO_TYPESCRIPT_SETUP=1) e
#   `adb reverse tcp:8081 tcp:8081`;
# - para `inicio` (a HomeScreen legada), o Metro sobe com
#   EXPO_PUBLIC_ENABLE_LEARNING_ROAD=false e --clear;
# - para `revisao`, cartões vencidos por preparar-revisao-devida-android.py.
#
# Escreve <rotulo>.png e <rotulo>.json (árvore do `maestro hierarchy`) na pasta
# corrente e imprime a árvore filtrada. Por que não um roteiro Maestro: com as
# animações ligadas, o Maestro no Android não avança (FILA 54, tentativa 1).
set -eu
escala=$1; tela=$2; rotulo=$3; espera=${4:-6}
A=~/Library/Android/sdk/platform-tools/adb
S=emulator-5554
case $S in emulator-*) ;; *) echo "só emulador"; exit 2;; esac

for k in animator_duration_scale transition_animation_scale window_animation_scale; do
  $A -s $S shell settings put global $k $escala
done

$A -s $S shell am force-stop com.ascendcreative.radiant; sleep 1
$A -s $S shell am start -a android.intent.action.VIEW \
  -d "exp+radiant-app://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081" \
  com.ascendcreative.radiant >/dev/null
case $tela in
  revisao)
    sleep 15
    $A -s $S shell am start -a android.intent.action.VIEW -d "radiantapp://review" com.ascendcreative.radiant >/dev/null
    sleep 5
    $A -s $S shell input tap 540 667   # "Começar revisão"
    sleep $espera ;;
  quiz)
    sleep 15
    $A -s $S shell am start -a android.intent.action.VIEW \
      -d "radiantapp://quiz?mode=review\&lessonIds=lesson-1" com.ascendcreative.radiant >/dev/null
    sleep $espera ;;
  inicio)
    sleep $espera
    $A -s $S shell input swipe 540 1800 540 700 600   # rola até "Revisões pendentes"
    sleep 2 ;;
  *) echo "tela desconhecida: $tela"; exit 2 ;;
esac

maestro --device $S hierarchy 2>/dev/null > $rotulo.json
$A -s $S exec-out screencap -p > $rotulo.png
python3 -I - $rotulo.json <<'EOF'
import json, sys
skip = ('android:id', 'com.android.systemui')
def walk(n):
    a = n.get('attributes', {})
    txt = a.get('text') or a.get('accessibilityText') or ''
    rid = a.get('resource-id') or ''
    if (txt or rid) and not rid.startswith(skip) and not rid.startswith('hud-') \
            and 'notification' not in txt and 'signal' not in txt and 'Battery' not in txt:
        print(repr(txt)[:80], rid, a.get('bounds'))
    for c in n.get('children', []):
        walk(c)
walk(json.load(open(sys.argv[1])))
EOF
