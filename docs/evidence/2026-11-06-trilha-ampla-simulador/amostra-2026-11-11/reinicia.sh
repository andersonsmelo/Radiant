#!/bin/zsh
# Liga o simulador se caiu, fecha o app e reabre no Metro; reabre o link se o dev client ficar no lançador.
U=E262D4C1-99BE-496B-8567-0291C14E6533
xcrun simctl bootstatus $U -b > /dev/null 2>&1
xcrun simctl terminate $U com.ascendcreative.radiant 2>/dev/null; sleep 2
for i in {1..45}; do
  (( i % 15 == 1 )) && xcrun simctl openurl $U "radiantapp://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
  sleep 2
  ~/.maestro/bin/maestro --device $U hierarchy 2>/dev/null | grep -q '"accessibilityText" : "Fechar quiz"\|de 5 vidas' && break
done
