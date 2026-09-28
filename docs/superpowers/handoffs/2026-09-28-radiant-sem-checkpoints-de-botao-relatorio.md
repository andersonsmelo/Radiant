# Relatório — a trilha sem os checkpoints de botão (FILA, 34) — 2026-09-28

**Frente:** o item 34, aberto pela decisão do dono sobre o 29
([ADR](../../adr/ADR-2026-09-28-checkpoints-de-botao-saem-da-trilha.md)).
**Entra na 1.4, na PR #38, por decisão do dono na conversa.**

**Condição de pronto, combinada com o dono antes do run:**
1. teste vermelho antes, no `buildUnit`;
2. validade: as 5 avaliações da V2 continuam, e a conquista ainda exige a
   última lição;
3. teste da migração do progresso de quem já usa o app;
4. código de produção só no `JourneyDefinitionService.ts`, com a tela do
   checkpoint mantida;
5. os 5 fluxos E2E ajustados e rodados num simulador temporário;
6. o gate, o Loop, o push e a documentação.

## O que mudou

- **`JourneyDefinitionService.buildUnit`:** as trilhas do catálogo deixaram de
  criar o nó de checkpoint, e cada lição passa a exigir a anterior. A trilha da
  V2 é montada por `ProductionCurriculumCatalog.journeyFor` e não mudou.
- **Testes unitários:**
  - `JourneyDefinitionService.test.ts`: a ordem dos nós sem checkpoint, a
    regra de cada lição, a conquista exigindo a última lição e as 5 avaliações
    da V2 pelo título;
  - `JourneyProgressService.test.ts`: dois casos de progresso gravado com os
    checkpoints que saíram, e um teste antigo que concluía o checkpoint;
  - `JourneyNodeCompletionGuard.test.tsx`:
    - a prova de que a tela do checkpoint não conclui um nó bloqueado passou
      para a "Avaliação 1 de 5" da V2, respondendo e acertando as perguntas;
    - um caso novo: o link antigo para um checkpoint que saiu não oferece
      conclusão nem grava nada;
    - a prova de que a guarda lê a regra passou a usar a lição 2.
- **Fluxos E2E** (`radiant-app/.maestro/`):
  - `learning-critical-path`, `offline-relaunch`, `reward-unlock` e
    `store-capture` passam de uma lição à seguinte pelo botão "Continuar
    jornada" da Estude;
  - `radiant-1-4-segundo-dia` mudou só num comentário;
  - `store-capture` deixou de tirar `04-checkpoint` e `05-conquista` (FILA, 37).
- **Consertos que já faltavam nesses quatro fluxos,** encontrados ao rodá-los:
  - o resumo da lição, que entrou na 1.4, fica entre "Concluir e voltar" e a
    trilha;
  - a âncora da Estude `'^\d+ de \d+$'` não existe mais na árvore desde os
    consertos de acessibilidade. O contador é lido no rótulo do cabeçalho;
  - o dev client era guardado com `runFlow when`, que perdia a folha atrasada.
    Os fluxos passaram a usar `subflows/dismiss-dev-client.yaml`, também
    depois da reabertura do `offline-relaunch`.
- **`scripts/maestro-contract.test.mjs`:** os três testes que descreviam a
  estrutura antiga foram reescritos:
  - o toque guardado passa a ser em "Continuar jornada";
  - o caminho crítico passa pelo rótulo que a Estude mostra para lição, sem
    checkpoint;
  - o `reward-unlock` conta 8 marcos (7 lições e a conquista), e não 14. Ele
    toca 6 vezes em "Continuar jornada" e nenhuma em checkpoint.

## Medido

- **Vermelho antes:**
  - o teste do `buildUnit` falhou contra o código de antes, com os dois nós
    `node:checkpoint:radiology:*` a mais;
  - os dois testes da migração falharam: a lição seguinte vinha `locked`, e o
    id do checkpoint ainda era um nó real.
- **Validade:** o teste da trilha V2 passou antes e depois, com as 5
  avaliações pelo título.
- **A guarda da tela, na V2,** vista falhando: com a tela comemorando sem
  conferir o snapshot que voltou, o caso reprovou. O arquivo foi restaurado e
  conferido com `shasum`.
- **O contrato novo,** visto falhando:
  - contra os fluxos antigos, os três testes reescritos reprovaram;
  - com um toque de checkpoint injetado nos fluxos novos, as duas guardas
    "sem checkpoint" dispararam pelo motivo delas.
- **Verde:** as 53 suítes das áreas tocadas (586 testes), o contrato (23) e o
  `tsc`.
- **E2E,** num simulador temporário, apagado no fim
  ([evidência](../../../radiant-app/docs/evidence/2026-09-28-e2e-sem-checkpoints-de-botao.md)):
  - `learning-critical-path`, `offline-relaunch` e `store-capture`: **passed**;
  - `reward-unlock`: as sete lições passaram em ordem, com seis passagens pela
    Estude, mas o fluxo **reprovou no último passo**, em que espera a Estude
    oferecer a conquista. A causa é anterior ao 34: o motor de recomendação da
    1.4 exclui a conquista (FILA, 39);
  - a carga da máquina ficou entre 20 e 40 o tempo todo, por causa de outros
    aplicativos abertos.
- **O gate** `EXPO_NO_DOTENV=1 npm run quality`, às 20:37, no Node `v20.20.2`: exit 0,
  **155 suítes / 1482 testes** (os 3 novos da migração e do link antigo), os 15
  contratos verdes, lint com 0 erros e 26 avisos e visual QA sem regressão.

## Não verificado

- **O `radiant-1-4-segundo-dia`:** depende do relógio do dia seguinte. Ele
  mudou só num comentário.
- **O modo avião do `offline-relaunch` no iOS:** o passo do Maestro concluiu,
  mas não se conferiu se o simulador ficou mesmo sem rede.
- **O aparelho e o build de produção.**

## Fica para o dono

- **39, a Estude nunca oferece a conquista.** Depois da última lição da trilha,
  o botão diz "Aguardando nova etapa" enquanto a conquista espera a coleta. É
  anterior ao 34 e vale para a 1.4 como está. O agente recomenda decidir antes
  da build.

- **37, a vitrine da loja:** `APP_STORE_LISTING_MATRIX.md` descreve a vitrine
  com `04-checkpoint` e `05-conquista`, que o fluxo não produz mais.
- **36, o reforço das avaliações da V2,** que só existe no texto.
- O merge da #38 e o build de produção.
