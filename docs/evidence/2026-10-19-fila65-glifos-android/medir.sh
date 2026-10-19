#!/bin/zsh
# Uso: medir.sh <pasta> <rotulo> — captura a tela atual do emulator-5554 de três jeitos:
# maestro hierarchy, uiautomator dump completo e uiautomator dump --compressed.
set -u
A=~/Library/Android/sdk/platform-tools/adb; S=emulator-5554
cd $1; r=$2
maestro --device $S hierarchy 2>/dev/null > $r.maestro.json
$A -s $S shell uiautomator dump /sdcard/$r.full.xml >/dev/null 2>&1; $A -s $S pull /sdcard/$r.full.xml . >/dev/null 2>&1
$A -s $S shell uiautomator dump --compressed /sdcard/$r.comp.xml >/dev/null 2>&1; $A -s $S pull /sdcard/$r.comp.xml . >/dev/null 2>&1
$A -s $S exec-out screencap -p > $r.png
ls -la $r.*
