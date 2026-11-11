#!/bin/bash
# uso: rodada-atrace.sh <nome> — prepara o momento elegível, grava a 60 fps e rastreia no nativo (atrace texto)
set -u
S=/private/tmp/claude-501/-Users-anderson-Developer-Radiant/51a713e1-9f5f-4382-8e3e-41f413e28205/scratchpad/quadro
A=~/Library/Android/sdk/platform-tools/adb
N=$1
cd /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
~/.maestro/bin/maestro test $S/preparar.yaml > $S/$N-preparar.txt 2>&1 || { echo "PREPARO FALHOU"; tail -5 $S/$N-preparar.txt; exit 1; }
sleep 2
$A shell atrace --async_start -a com.ascendcreative.radiant -b 32768 view input > /dev/null 2>&1
sleep 1
$A emu screenrecord start --fps 60 --time-limit 9 $S/$N.webm
sleep 1.5
$A shell input tap 538 2205
sleep 7
$A emu screenrecord stop >/dev/null 2>&1
$A shell atrace --async_stop > $S/$N.atrace.txt 2>/dev/null
sleep 1
ls -la $S/$N.webm $S/$N.atrace.txt
