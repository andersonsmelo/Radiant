# Relatório — o caminho 3 do E2E afirma o estado da L1 (FILA, 16), 2026-10-09

**Branch:** `feat/d4-decisoes-de-revisao` (PR #38). **Run do Loop:**
`run-1791570761838-2eaf2052`.

## O que mudou

- **`radiant-1-4-vidas-esgotadas.yaml`:** depois que a folha de vidas fecha, o
  caminho 3 afirma `^Fundamentos de Radiologia\. Concluído\.$` e
  `^Fundamentos de Radiologia\. 1 de \d+ etapas concluídas\.$`. Antes ele
  afirmava `\d+ de \d+`, de propósito: o defeito 1 do E2E deixava a L1 retomável
  e o cabeçalho em "0 de N", e o padrão casava com os dois. O conserto entrou
  pela PR #36 em 2026-09-25.
- **`scripts/maestro-contract.test.mjs`:** o teste dos três caminhos dourados
  passou a exigir essas duas asserções depois da folha e a proibir ali o padrão
  permissivo. O rótulo "Concluído" é lido do `JourneyNodeCard`, e o formato do
  cabeçalho é conferido no `JourneyStageHeader`.

Nenhum código do app mudou.

## Evidência

- **Contrato, vermelho natural:** contra o flow antigo, a primeira asserção
  nova falhou com `after the hearts sheet closes, path 3 must assert L1 still
  "Concluído"`.
- **Contrato, por injeção no flow,** cada asserção pelo defeito que nomeia, com
  o flow restaurado byte a byte: sem a L1 concluída depois da folha, a 1; o
  cabeçalho de volta ao padrão permissivo, a 2; o padrão permissivo ao lado do
  certo, a 3. Inteiro, o contrato passa: 23 de 23.
- **E2E no simulador** ([evidência](../../../radiant-app/docs/evidence/2026-10-09-e2e-caminho-3-estado-da-l1.md)):
  - **vermelho**, com as duas metades do conserto do defeito 1 desfeitas no JS:
    o fluxo falhou na asserção `Concluído`, e a árvore mostrou "Continuar de
    onde parou" e "0 de 8 etapas concluídas";
  - **verde**, com os arquivos restaurados e conferidos byte a byte: o fluxo
    passou inteiro;
  - simulador temporário apagado e Metro desligado no fim.

## O que não foi verificado

- Android, aparelho físico e build de produção.
- Os caminhos 1 e 2 não rodaram; o run não os tocou.

## Próximo

Pela FILA, o primeiro item do agente passa a ser o **38**: os seis fluxos E2E
antigos desatualizados e o ramo sem perguntas da tela do checkpoint.
