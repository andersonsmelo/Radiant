# E2E do caminho 3 afirmando o estado da L1, no simulador — 2026-10-09

**A pergunta, do item 16 da [FILA](../../../docs/FILA.md):** depois que as
vidas acabam no meio da L1 e a folha é fechada, a trilha mostra a L1
concluída e o cabeçalho contando a etapa? Até aqui o caminho 3 não afirmava
isso, de propósito, por causa do defeito 1 do E2E, consertado na PR #36
([ADR](../../../docs/adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md),
opção A).

## Ambiente

- **Simulador temporário** `44F588C3-…`, "Radiant E2E temporario (16)",
  iPhone 17 com iOS 26.5, criado para esta medição e apagado no fim.
- **Build Debug local** de `Sep 24 11:01:25 2026`
  (`ios/build/dd/Build/Products/Debug-iphonesimulator/Radiant.app`), com versão
  nativa `1.3.1`. O JS vem do Metro, no Node `v20.20.2`, a partir da árvore do
  run (`feat/d4-decisoes-de-revisao` sobre `5b55aa5`), com as variáveis do
  `scripts/start-ios-v2.sh` conferidas pelo `check-env-precedence.mjs`. O run
  não mudou código do app: só o flow e o contrato.
- **Maestro** `/Users/anderson/.maestro/bin/maestro`, rodado com o diretório
  de trabalho no scratchpad.
- **Carga da máquina:** subiu a 43 com o Metro e o simulador recém-iniciados.
  O fluxo só começou com a carga de 1 minuto em 7,12, e o verde rodou com ela
  em 3,76.

## Resultado

| Execução | JS | Resultado | Duração |
|---|---|---|---|
| Vermelho | Com o defeito 1 reinjetado (abaixo) | **failed** em `^Fundamentos de Radiologia\. Concluído\.$`, a primeira asserção nova; todos os passos anteriores passaram | 15:37:49–15:46:18 |
| Verde | A árvore do run, sem injeção | **passed**, com as três asserções finais | 15:46:37–15:54:36 |

**O defeito reinjetado** desfaz as duas metades do conserto de `78d2c69`:
- em `resolveNodeStatus`, o retomável volta a vir antes do concluído;
- em `setResumableNode`, a lição já concluída volta a ser gravada como
  retomável.

Só com as duas a L1 reaparece retomável. Depois do vermelho, os dois arquivos
foram restaurados e comparados byte a byte com a cópia de antes.

**O que a árvore do Maestro mostrou no vermelho**, no fim do fluxo:
`Fundamentos de Radiologia. Continuar de onde parou.` e
`Fundamentos de Radiologia. 0 de 8 etapas concluídas.`. É o defeito 1 como foi
medido em 2026-09-24. No verde, as mesmas âncoras viraram `Concluído` e
`1 de 8`.

## O contrato

`scripts/maestro-contract.test.mjs`, no teste dos três caminhos dourados,
passou a exigir que, depois de a folha fechar, o caminho 3:
1. afirme a L1 com o rótulo de concluído que o `JourneyNodeCard` renderiza,
   lido da fonte;
2. afirme o cabeçalho em `1 de \d+ etapas concluídas`, com o formato do rótulo
   conferido no `JourneyStageHeader`;
3. não use mais o padrão `\d+ de \d+`, que casa com o defeito e com o conserto.

Cada uma foi vista falhando pelo defeito que nomeia, com o flow alterado e
restaurado byte a byte: sem a L1 concluída, a 1; o cabeçalho de volta ao padrão
permissivo, a 2; o padrão permissivo ao lado do certo, a 3. O contrato inteiro
passa: 23 de 23.

## Não verificado

- Android, aparelho físico e build de produção.
- Os outros dois caminhos dourados não rodaram nesta medição; o run não os
  tocou.
