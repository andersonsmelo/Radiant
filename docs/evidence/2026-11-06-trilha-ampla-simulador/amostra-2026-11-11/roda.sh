#!/bin/zsh
# Roda os roteiros da lista em ordem; registra passou/falhou e o tempo; reinicia o app depois de falha.
S=${0:a:h}; U=E262D4C1-99BE-496B-8567-0291C14E6533; L=$S/flows/$1; R=$S/resultado-${1%.txt}.tsv
: > $R
for f in $(cat $L); do
  for w in {1..40}; do (( $(sysctl -n vm.loadavg | awk "{print int(\$2)}") < 8 )) && break; sleep 30; done
  t0=$(date +%s)
  ~/.maestro/bin/maestro --device $U test $S/flows/$f > $S/logs/$f.log 2>&1; rc=$?
  st=$([ $rc -eq 0 ] && echo passou || echo FALHOU)
  echo "$f\t$st\t$(( $(date +%s)-t0 ))" >> $R
  if [ $rc -ne 0 ]; then
    ~/.maestro/bin/maestro --device $U hierarchy 2>/dev/null | $HOME/.nvm/versions/node/v20.20.2/bin/node $S/rot.mjs > $S/logs/$f.tela.txt
    $S/reinicia.sh
  fi
done
echo FIM >> $R
