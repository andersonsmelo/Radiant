# Radiant 1.4 — CloudKit: segunda validação física da instalação limpa

Data: 2026-09-15 · Branch: `feat/1-4-cloudkit-private-backup` · PR: #14

Continua [`2026-09-15-radiant-1-4-cloudkit-device-validation-2.md`](2026-09-15-radiant-1-4-cloudkit-device-validation-2.md).

## Estado

> **REPROVADO EM APARELHO / NÃO FAZER MERGE.**

A correção dos commits `4d0036e` / `460b398` foi exercitada em um novo build interno EAS gerado exatamente do HEAD autorizado `460b3986d79fd69c39c908c4fd8655bc4a9a45d5`.

Build físico testado:

- EAS build ID: `b86cb497-0a7c-4b12-9437-e5feaa3046a5`
- perfil: `preview`
- iOS, distribuição interna
- commit: `460b3986d79fd69c39c908c4fd8655bc4a9a45d5`

## Passagem 1 — restore automático após reinstalação

Procedimento executado pelo dono:

1. backup remoto existente e previamente validado;
2. app apagado completamente;
3. mesmo build interno novo instalado;
4. app aberto sem tocar no interruptor do iCloud e sem iniciar lição/checkpoint.

Resultado observado no iPhone:

- Backup no iCloud: **OFF**;
- texto: **“Nenhum backup ainda”**;
- XP: **0**;
- trilha Fundamentos de Radiologia: **0/14**;
- progresso não restaurado automaticamente;
- sequência exibida: 1 dia;
- vidas: 5.

Conclusão: a correção da instalação limpa **não passou no aparelho**. O comportamento esperado era restaurar automaticamente o remoto utilizável e reativar o backup. Isso não aconteceu.

A Passagem 2 (opt-out explícito → reinstalação → nada volta) **não deve ser executada ainda**, porque a Passagem 1 já reprova o gate principal.

## Próximo diagnóstico

Antes de nova implementação, medir no mesmo build se ligar manualmente `Backup no iCloud` recupera o remoto existente. Esse teste separa dois cenários:

- se o progresso voltar, o registro remoto e `pull/merge/apply` continuam íntegros e o defeito permanece no caminho de startup/restore automático;
- se não voltar, investigar leitura do registro remoto, ambiente/container/conta e compatibilidade do payload antes de qualquer push.

Não criar novo build, não fazer submit e não fazer merge até fechar a causa raiz.

## Divergência documental

`docs/STATUS.md` na branch ainda afirma `IMPLEMENTADO / AGUARDANDO NOVA VALIDAÇÃO FÍSICA`. Após esta medição isso está obsoleto e deve ser atualizado para refletir a reprovação física antes da próxima rodada de implementação.
