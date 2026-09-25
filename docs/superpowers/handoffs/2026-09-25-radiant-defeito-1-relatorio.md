# Relatório — defeito 1 do E2E: a lição concluída continua concluída (2026-09-25)

**Decisão:** opção A da
[ADR de 2026-09-25](../../adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md):
o concluído vence o retomável.  
**Branch:** `fix/defeito-1-licao-concluida`, empilhado sobre
`docs/estado-2026-09-25`, sem push e sem build.

## O defeito

O aluno reabre a L1, que já está concluída, e sai no meio. Pode ser pela folha
de vidas ou por qualquer outra saída, porque a `LessonFlowScreen` marca a lição
como atual e retomável ao abrir e ao sair. A trilha então mostrava:
- "Continuar de onde parou" na L1;
- o cabeçalho em "0 de 14";
- a recomendação de refazer a lição, em vez do checkpoint.

`resolveNodeStatus` testava o retomável e o atual **antes** do concluído.

## O conserto

- **`isSettledCompletion`** (em `JourneyRecommendationService.ts`): um nó está
  assentado quando está concluído e não está devido de novo.
- **Na leitura:**
  - em `resolveNodeStatus`, um nó assentado não vira `resumable` nem `active`;
  - em `resolveCurrentUnitId`, um retomável ou atual assentado não decide a
    unidade em foco.
- **Na escrita:** em `setResumableNode`, um nó assentado não é gravado como
  retomável. Isso também preserva a retomada de outra lição em andamento, porque
  só existe uma retomada.
- **A população protegida** (lição 2 dos guardas): uma revisão que já foi
  feita e está devida de novo continua em `pendingReviewNodeIds`. Ela **não**
  está assentada e continua retomável.

**Não foi preciso mudar a `LessonFlowScreen`.** A trava na escrita cobre as
três chamadas (`:117`, `:249` e `:285`). O `setCurrentNode` continua gravando o
nó atual, mas a leitura o ignora quando ele está assentado.

## Evidência medida

**Vermelhos antes do conserto,** no Node 20, com `--runInBand`:

| Teste | Esperado | Recebido |
|---|---|---|
| o nó continua concluído | `completed` | `resumable` |
| a contagem do cabeçalho não cai | a mesma de antes | um a menos |
| a recomendação não volta para a lição concluída | `node:checkpoint:foundations` | `node:foundation-1` |
| a unidade em foco não muda (trilha de duas unidades) | `unit-b` | `unit-a` |
| outra lição em andamento mantém a retomada | `node:foundation-2` | `node:foundation-1` |

- **A unidade em foco** foi testada primeiro na trilha de teste, e passou de
  primeira, sem provar nada: a trilha tinha uma unidade só, e o foco não tinha
  para onde ir. O teste foi refeito numa trilha dividida em duas unidades.
  Nela, o controle (sem reabrir) dá `unit-b`, e a asserção do defeito falhou.

**Vermelhos fabricados,** para as guardas que passam de primeira por
construção:
- **A revisão devida e pausada continua retomável:** ao tirar a checagem de
  `pendingReviewNodeIds` de `isSettledCompletion`, a guarda falhou com
  `due-review` no lugar de `resumable`.
- **Com o estado antigo já gravado, a recomendação não volta:** ao devolver ao
  retomável a precedência sobre o concluído, a guarda falhou com
  `node:lesson-1` no lugar de `node:lesson-2`.
- Nos dois casos, o arquivo foi restaurado e conferido com `cmp`.

**Uma linha foi removida por ser redundante.** No início, o conserto também
limitava o `pausedStepIndex` aos nós `resumable`. Com e sem essa linha, todos os
testes, inclusive o do estado antigo gravado, deram o mesmo resultado, porque o
`NextNodeResolver` já descarta candidatos concluídos. Então ela saiu.

**Gate:** `EXPO_NO_DOTENV=1 npm run quality`, no Node v20.20.2, sobre o código
final:
- exit 0;
- **151 suítes / 1430 testes**, 7 a mais que os 1423 anteriores;
- lint com 0 erros e os mesmos 26 avisos;
- visual QA sem regressão.

**Na tela:** no simulador `E3C547AE` (iOS 26.5), com o Metro servindo este
branch, `radiant-1-4-vidas-esgotadas.yaml` rodou das 14:05:23 às 14:13:46,
com exit 0. Logo depois, sem relançar o app, um flow avulso passou, com exit 0,
afirmando:
- `Fundamentos de Radiologia. Concluído.`;
- `Fundamentos de Radiologia. 1 de N etapas concluídas.`;
- que "Continuar de onde parou" não está visível.

Em 2026-09-24, o mesmo caminho deixava "Continuar de onde parou" e "0 de 14"
([evidência do E2E](../../../radiant-app/docs/evidence/2026-09-24-e2e-caminhos-dourados-1-4.md)).

## Não verificado

- **A tela foi vista com a versão que ainda tinha a linha redundante.** Os
  testes provaram que ela não muda o comportamento, mas a tela não foi
  reconferida depois de a linha sair.
- Aparelho físico, Android e build Release.
- **O flow do caminho 3 continua sem afirmar o estado da L1.** O comentário
  dele diz que isso é de propósito, por causa deste defeito. Com o defeito
  corrigido, a asserção pode entrar, num run próprio: `.maestro` não estava no
  escopo deste.
