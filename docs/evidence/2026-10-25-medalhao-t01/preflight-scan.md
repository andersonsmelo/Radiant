# T00 — preflight SDD (2026-10-25)

24 cartões conferidos: T00–T22 incluindo T04a. Nenhuma tarefa de produto executada.

| Cartão | Coerência / dependência / limite |
|---|---|
| Task 1 / T00 | base/política/deps; cérebro e remoto do controlador; sem produto |
| Task 2 / T01 | pronto; domínio src UI + fontes importadas; AST; baseline reduzível |
| Task 3 / T02 | pronto após T01; coração+número; economia intacta |
| Task 4 / T03 | pronto após T01/modelo; primeira ação kV; reentrada |
| Task 5 / T04 | pronto após T01; contrato registrado versus case-decision não registrado |
| Task 6 / T04a | após T04 estabilizada; seis consumidores e fallback; sem GPU alegada |
| Task 7 / T05 | após T04/T04a revisadas; todos os consumidores/resumo sem nó/revisão |
| Task 8 / T06 | após T01; inválido/bloqueado/coletado, idempotência |
| Task 9 / T07 | após T01/useReview; fila real sem Pixel |
| Task 10 / T08 | após T01/catálogo; métricas reais e commit único |
| Task 11 / T09 | G5 limita semântica semana; entrada meta mantida até T10 |
| Task 12 / T10 | interface T09; entrada meta antes da remoção no Perfil |
| Task 13 / T11 | G6 limita prova nativa; displayPrice não é preço numérico |
| Task 14 / T12 | após T01; chamadores a enumerar antes writer; ilimitado não abre folha |
| Task 15 / T13 | G1 para geometria; G3 para aceite quadro; 0/13 não é conserto |
| Task 16 / T14 | G2 conteúdo/posição fechamento; desenvolvimento até resposta literal |
| Task 17 / T15 | inventário permitido; nenhuma retirada/G4 inferida |
| Task 18 / T16 | componentes finais; G8 fala ouvida e três rodadas; parcial distinto |
| Task 19 / T17 | T01–T16 aplicáveis; renome/importadores exatos; copy zero; RF3/5 |
| Task 20 / T18 | segundo dia SOMENTE fechamento; compatibilidade e natural due; RF2 |
| Task 21 / T19 | G4 inventário E política; transação anterior consumidora |
| Task 22 / T20 | G4/G7 IDs; recuperação parcial, restore, futuro; economia preservada |
| Task 23 / T21 | G4/G7/T19/T20; novo catálogo e roteiros; biblioteca fica segundo inventário |
| Task 24 / T22 | após troca; container separado; novo segundo dia; RF2/3/4/5 |

## Pares de arquivo/interface

187 pares gerados por interseção de caminhos literais do integrador (abreviações expandidas e tabela §9) e expansão par a par dos contratos explicitamente compartilhados. A lista de interfaces é conservadora: dependência não concede ownership. Tarefas com consumidores dinâmicos ainda exigem rg antes do writer; uma união definitiva de T15/T19/T21 é impossível antes do inventário aprovado.

| Produtor → consumidor | Arquivos / interface compartilhada | Conflito / resolução proposta |
|---|---|---|
| T00 → T15 | `.loop/project.yaml`; política/inventário/validadores | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T00 → T17 | `radiant-app/scripts/visual-qa-policy.json` | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T00 → T19 | `.loop/project.yaml`; política/inventário/validadores | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T00 → T20 | política/inventário/validadores | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T00 → T21 | política/inventário/validadores | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T01 → T02 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T03 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T04 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T05 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T06 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T07 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T08 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T09 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T10 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T11 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T12 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T13 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T14 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T17 | `radiant-app/scripts/copy-style-baseline.json`; copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T01 → T21 | copy/baseline por arquivo T01→telas→zero T17 | tela baixa sua baseline; T17 cobra zero sem excluir domínio; T21 atualiza copy/roteiros do catálogo |
| T02 → T03 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T04 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T05 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T06 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T07 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T08 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T09 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T10 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T11 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T12 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T18 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T20 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T02 → T22 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T04 | copy/baseline por arquivo T01→telas→zero T17; modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T04a | modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T05 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T06 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T07 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T08 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T09 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T10 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T11 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T12 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T14 | `radiant-app/src/features/bench/exposureModel.ts`; copy/baseline por arquivo T01→telas→zero T17; modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T16 | `radiant-app/src/features/bench/BenchControlRow.tsx`; modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T03 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T04a | `radiant-app/src/features/bench/CollimationImage.test.tsx`; `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx`; `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`; `radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx`; `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`; player/registro/feedback/primeira resposta; modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T05 | `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`; `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`; copy/baseline por arquivo T01→telas→zero T17; player/registro/feedback/primeira resposta | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T06 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T07 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T08 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T09 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T10 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T11 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T12 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T14 | `radiant-app/src/features/bench/lessons/BenchLessonCatalog.test.ts`; `radiant-app/src/features/bench/lessons/exposicao.ts`; `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`; copy/baseline por arquivo T01→telas→zero T17; player/registro/feedback/primeira resposta; modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T16 | modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T18 | player/registro/feedback/primeira resposta | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04 → T22 | player/registro/feedback/primeira resposta | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04a → T05 | `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`; player/registro/feedback/primeira resposta | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04a → T14 | `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`; player/registro/feedback/primeira resposta; modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04a → T16 | modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04a → T18 | player/registro/feedback/primeira resposta | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T04a → T22 | player/registro/feedback/primeira resposta | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T06 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T07 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T08 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T09 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T10 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T11 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T12 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T14 | `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`; copy/baseline por arquivo T01→telas→zero T17; player/registro/feedback/primeira resposta | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T18 | player/registro/feedback/primeira resposta; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T20 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T05 → T22 | player/registro/feedback/primeira resposta; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T07 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T08 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T09 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T10 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T11 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T12 | copy/baseline por arquivo T01→telas→zero T17; reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T18 | `radiant-app/.maestro/reward-locked.yaml`; `radiant-app/.maestro/reward-unlock.yaml`; reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T21 | copy/baseline por arquivo T01→telas→zero T17; reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T06 → T22 | reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T08 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T09 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T10 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T11 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T12 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T18 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T20 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T07 → T22 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T09 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T10 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T11 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T12 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T14 | copy/baseline por arquivo T01→telas→zero T17; catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T15 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T18 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T19 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T20 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T21 | copy/baseline por arquivo T01→telas→zero T17; catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T08 → T22 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T09 → T10 | copy/baseline por arquivo T01→telas→zero T17; entrada edição meta Perfil→Ajustes | T09 mantém entrada meta; T10 cria substituta testada antes da remoção; G5 separado |
| T09 → T11 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T09 → T12 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T09 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T09 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T09 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T09 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T10 → T11 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T10 → T12 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T10 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T10 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T10 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T10 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T12 | copy/baseline por arquivo T01→telas→zero T17; economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T16 | bridge StoreKit/binário→conferência nativa | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T17 | copy/baseline por arquivo T01→telas→zero T17; bridge StoreKit/binário→conferência nativa | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T18 | economia vidas e retorno revisão/assinatura; bridge StoreKit/binário→conferência nativa | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T20 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T11 → T22 | economia vidas e retorno revisão/assinatura; bridge StoreKit/binário→conferência nativa | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T12 → T13 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T12 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T12 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T12 → T18 | `radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml`; economia vidas e retorno revisão/assinatura; reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T12 → T20 | economia vidas e retorno revisão/assinatura | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T12 → T21 | copy/baseline por arquivo T01→telas→zero T17; reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T12 → T22 | economia vidas e retorno revisão/assinatura; reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T13 → T14 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T13 → T17 | copy/baseline por arquivo T01→telas→zero T17; geometria/momento→renome/importadores→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T13 → T18 | geometria/momento→renome/importadores→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T13 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T13 → T22 | geometria/momento→renome/importadores→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T15 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T16 | modelo bancada/modelos finais/prova de arrasto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T17 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T18 | player/registro/feedback/primeira resposta; catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T19 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T20 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T21 | copy/baseline por arquivo T01→telas→zero T17; catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T14 → T22 | player/registro/feedback/primeira resposta; catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T15 → T18 | catálogo/IDs/checkpoint/roteiros legado versus substituto | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T15 → T19 | `.github/workflows/content-scripts.yml`; `.loop/project.yaml`; `scripts/content`; catálogo/IDs/checkpoint/roteiros legado versus substituto; política/inventário/validadores | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T15 → T20 | catálogo/IDs/checkpoint/roteiros legado versus substituto; política/inventário/validadores | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T15 → T21 | catálogo/IDs/checkpoint/roteiros legado versus substituto; política/inventário/validadores | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T15 → T22 | catálogo/IDs/checkpoint/roteiros legado versus substituto | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T16 → T17 | bridge StoreKit/binário→conferência nativa | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T16 → T18 | bridge StoreKit/binário→conferência nativa | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T16 → T22 | bridge StoreKit/binário→conferência nativa | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T17 → T18 | bridge StoreKit/binário→conferência nativa; geometria/momento→renome/importadores→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T17 → T21 | copy/baseline por arquivo T01→telas→zero T17 | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T17 → T22 | bridge StoreKit/binário→conferência nativa; geometria/momento→renome/importadores→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |
| T18 → T19 | catálogo/IDs/checkpoint/roteiros legado versus substituto | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T18 → T20 | economia vidas e retorno revisão/assinatura; catálogo/IDs/checkpoint/roteiros legado versus substituto | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T18 → T21 | catálogo/IDs/checkpoint/roteiros legado versus substituto; reward Maestro/vidas→conferência | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T18 → T22 | player/registro/feedback/primeira resposta; economia vidas e retorno revisão/assinatura; bridge StoreKit/binário→conferência nativa; catálogo/IDs/checkpoint/roteiros legado versus substituto; geometria/momento→renome/importadores→conferência; reward Maestro/vidas→conferência | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T19 → T20 | catálogo/IDs/checkpoint/roteiros legado versus substituto; política/inventário/validadores | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T19 → T21 | catálogo/IDs/checkpoint/roteiros legado versus substituto; política/inventário/validadores | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T19 → T22 | catálogo/IDs/checkpoint/roteiros legado versus substituto | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T20 → T21 | catálogo/IDs/checkpoint/roteiros legado versus substituto; política/inventário/validadores | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T20 → T22 | economia vidas e retorno revisão/assinatura; catálogo/IDs/checkpoint/roteiros legado versus substituto | legado e substituto têm provas distintas; exigir inventário/G4/G7/política; reservado só T18 |
| T21 → T22 | catálogo/IDs/checkpoint/roteiros legado versus substituto; reward Maestro/vidas→conferência | sequenciar; congelar snapshot após produtor; remedir consumidor e declarar união exata antes de STEP_STARTED |

## Rulings técnicos propostos, sem consumir gates

1. R1: usar intervalo histórico conservador BASE_PLAN=02b6a5d para os quatro planos, anterior a toda implementação Medalhão; custo: pacote maior, reduz risco de revisão parcial. RF filtra requisitos e mantém dependências. Referências WIP divergentes não são tratadas como commits entregues.
2. R2: domínio de T01 segue integrador: UI src e fontes importadas. Excluir por função comprovada (clínico/legal/interno), nunca por pasta para fazer zero; strings dinâmicas e imports precisam estratégia explícita. fixtures distinguem comentário/identificador/traço legítimo.
3. R3: baseline por arquivo é monotônica nas tarefas seguintes e zero em T17; ajuste de texto implica consumidores Maestro medidos, sem reciclar sete.
4. R4: uma versão de arquivo por vez para T04→T04a→T05; mocks não provam rasterização. Configuração do dublê global deve preservar falhas/uniformes.
5. R5: T11 pode ser implementada e validada estaticamente com G6 nativo pendente; não declarar API nova disponível no binário antigo.
6. R6: T18 prova catálogo legado; T22 prova substituto. Não limpar nem migrar reservado antes T18; revisão naturalmente devida sem relógio alterado.
7. R7: T15 expande lista dinâmica de conteúdo e validadores; T19 exige aprovação da lista/hash e política. Todas as janelas de grafia real fechadas permanecem fechadas.

## União de escopo para próximas entregas

As raízes de UI/scripts/módulo/Jest/Maestro/docs/package.json exigidas pelas tarefas cabem em allowedRoots. .superpowers está excluído exatamente. .loop/project.yaml está permitido, mas sua alteração exige G4/decisão expressa. Classes conteúdo/extrações e Conteúdo/classificação na grafia real do disco NÃO ganham autorização por similaridade com entradas NFC/minúsculas. T15 precisa produzir união por arquivo e medir NFD/NFC; não alterar política em run consumidor. Caminhos narrativos como “seus testes”, “chamadores”, “todos importadores”, YAMLs e inventário são deliberadamente abertos e precisam lista nominal antes de run.

Caminhos literais/expandidos por tarefa (proposta de conferência, não lista autorizada de writer):

### T00
- `.github/workflows/radiant-app-quality.yml`
- `.loop/project.yaml`
- `radiant-app/scripts/visual-qa-policy.json`

### T01
- `radiant-app/package.json`
- `radiant-app/scripts/ast-helpers.mjs`
- `radiant-app/scripts/copy-style-baseline.json`
- `radiant-app/scripts/copy-style-contract.test.mjs`
- `radiant-app/scripts/maestro-contract.test.mjs`
- `radiant-app/src` (diretório/raiz a expandir)
- `radiant-app/src/features/journey/components/nodeCopy.ts`

### T02
- `radiant-app/src/ui/components/HUD.test.tsx`
- `radiant-app/src/ui/components/HUD.tsx`

### T03
- `radiant-app/src/features/bench/BenchControlRow.tsx`
- `radiant-app/src/features/bench/ExposureImage.tsx`
- `radiant-app/src/features/bench/exposureModel.ts`
- `radiant-app/src/features/first-run/components/WelcomeSlide.test.tsx`
- `radiant-app/src/features/first-run/components/WelcomeSlide.tsx`
- `radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx`
- `radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx`
- `radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx`

### T04
- `radiant-app/src/features/bench/CollimationImage.test.tsx`
- `radiant-app/src/features/bench/CollimationImage.tsx`
- `radiant-app/src/features/bench/lessons/BenchLessonCatalog.test.ts`
- `radiant-app/src/features/bench/lessons/exposicao.ts`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`
- `radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx`
- `radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.tsx`
- `radiant-app/src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- `radiant-app/src/features/lesson-flow/services/feedbackFor.test.ts`
- `radiant-app/src/features/lesson-flow/services/feedbackFor.ts`
- `radiant-app/src/types/learningActivity.ts`

### T04a
- `radiant-app/jest.config.cjs`
- `radiant-app/src/features/bench/CollimationImage.test.tsx`
- `radiant-app/src/features/bench/ExposureImage.test.tsx`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`
- `radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- `radiant-app/src/test/mocks/reactNativeSkia.test.tsx`
- `radiant-app/src/test/mocks/reactNativeSkia.tsx`
- `radiant-app/src/ui/illustrations/ThemeIllustration.test.tsx`

### T05
- `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonCharacter.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- `radiant-app/src/features/quiz/components/LessonSummary.test.tsx`
- `radiant-app/src/features/quiz/components/LessonSummary.tsx`
- `radiant-app/src/features/quiz/screens/QuizScreen.flow.test.tsx`
- `radiant-app/src/features/quiz/screens/QuizScreen.tsx`
- `radiant-app/src/ui/motion.ts`

### T06
- `radiant-app/.maestro/reward-locked.yaml`
- `radiant-app/.maestro/reward-unlock.yaml`
- `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx`
- `radiant-app/src/features/rewards/screens/RewardScreen.tsx`

### T07
- `radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx`
- `radiant-app/src/features/review/screens/ReviewScreen.tsx`
- `radiant-app/src/ui/components/ListRow.test.tsx`
- `radiant-app/src/ui/components/ListRow.tsx`

### T08
- `radiant-app/scripts/checkpoint-cdp-collector.test.mjs`
- `radiant-app/scripts/checkpoint-cohort-runner.test.mjs`
- `radiant-app/scripts/checkpoint-performance-report.test.mjs`
- `radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx`
- `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`

### T09
- `radiant-app/src/features/gamification/services/GamificationService.ts`
- `radiant-app/src/features/profile/components/MedalShelf.test.tsx`
- `radiant-app/src/features/profile/components/MedalShelf.tsx`
- `radiant-app/src/features/profile/components/ProfileIdentityHeader.test.tsx`
- `radiant-app/src/features/profile/components/ProfileIdentityHeader.tsx`
- `radiant-app/src/features/profile/components/StreakWeek.test.tsx`
- `radiant-app/src/features/profile/components/StreakWeek.tsx`
- `radiant-app/src/features/profile/components/TodayGoals.test.tsx`
- `radiant-app/src/features/profile/components/TodayGoals.tsx`
- `radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx`
- `radiant-app/src/features/profile/screens/ProfileScreen.tsx`
- `radiant-app/src/features/progress/services/LearningAttemptsRepository.ts`
- `radiant-app/src/types/gamification.ts`

### T10
- `radiant-app/src/features/profile/components/FeedbackPreferencesCard.test.tsx`
- `radiant-app/src/features/profile/components/FeedbackPreferencesCard.tsx`
- `radiant-app/src/features/progress-sync/components/ICloudBackupCard.test.tsx`
- `radiant-app/src/features/progress-sync/components/ICloudBackupCard.tsx`
- `radiant-app/src/features/progress/components/LegalLinksCard.test.tsx`
- `radiant-app/src/features/progress/components/LegalLinksCard.tsx`
- `radiant-app/src/features/settings/screens/SettingsScreen.flow.test.tsx`
- `radiant-app/src/features/settings/screens/SettingsScreen.tsx`
- `radiant-app/src/features/subscription/components/SubscriptionCard.test.tsx`
- `radiant-app/src/features/subscription/components/SubscriptionCard.tsx`
- `radiant-app/src/ui/components/GroupedList.test.tsx`
- `radiant-app/src/ui/components/GroupedList.tsx`

### T11
- `radiant-app/modules/radiant-storekit/index.ts`
- `radiant-app/modules/radiant-storekit/ios/RadiantStoreKitModule.swift`
- `radiant-app/src/features/subscription/StoreKit2Adapter.test.ts`
- `radiant-app/src/features/subscription/StoreKit2Adapter.ts`
- `radiant-app/src/features/subscription/radiantStoreKitModule.contract.test.ts`
- `radiant-app/src/features/subscription/screens/SubscriptionScreen.flow.test.tsx`
- `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`
- `radiant-app/src/features/subscription/storekitNative.types.ts`
- `radiant-app/src/features/subscription/storekitTestingConfig.contract.test.ts`
- `radiant-app/src/features/subscription/subscription.types.ts`

### T12
- `radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml`
- `radiant-app/src/features/hearts/components/HeartsSheet.test.tsx`
- `radiant-app/src/features/hearts/components/HeartsSheet.tsx`

### T13
- `docs/evidence/2026-10-23-trilha-medalhao-quadro.md`
- `docs/evidence/2026-10-23-trilha-medalhao-retomada.md`
- `radiant-app/src/features/journey/components/JourneyTrail.test.tsx`
- `radiant-app/src/features/journey/components/JourneyTrail.tsx`
- `radiant-app/src/features/journey/components/trailLayout.test.ts`
- `radiant-app/src/features/journey/components/trailLayout.ts`
- `radiant-app/src/features/journey/screens/JourneyHomeScreen.flow.test.tsx`
- `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`

### T14
- `docs/adr/ADR-2026-10-24-aula-bancada-fisica-digital-e-colimacao.md`
- `docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md`
- `radiant-app/src/features/bench/collimationModel.test.ts`
- `radiant-app/src/features/bench/collimationModel.ts`
- `radiant-app/src/features/bench/exposureModel.test.ts`
- `radiant-app/src/features/bench/exposureModel.ts`
- `radiant-app/src/features/bench/lessons/BenchLessonCatalog.test.ts`
- `radiant-app/src/features/bench/lessons/colimacao.ts`
- `radiant-app/src/features/bench/lessons/exposicao.ts`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`

### T15
- `.github/workflows/content-scripts.yml`
- `.loop/project.yaml`
- `content-manifest` (diretório/raiz a expandir)
- `docs/curriculum-v3` (diretório/raiz a expandir)
- `docs/superpowers/plans/2026-10-25-retirada-e-recomeco-inventario.md`
- `radiant-app/src/data` (diretório/raiz a expandir)
- `radiant-app/src/features/student-checkpoints` (diretório/raiz a expandir)
- `scripts/content` (diretório/raiz a expandir)

### T16
- `docs/evidence` (diretório/raiz a expandir)
- `docs/evidence/2026-10-24-aula-bancada.md`
- `radiant-app/src/features/bench/BenchControlRow.tsx`

### T17
- `docs/DESIGN.md`
- `radiant-app/scripts/copy-style-baseline.json`
- `radiant-app/scripts/visual-qa-policy.json`
- `radiant-app/src/ui/components/MedallionBackground.test.tsx`
- `radiant-app/src/ui/components/MedallionBackground.tsx`
- `radiant-app/src/ui/components/StarfieldBackground.test.tsx`
- `radiant-app/src/ui/components/StarfieldBackground.tsx`

### T18
- `radiant-app/.maestro/radiant-1-4-primeira-execucao.yaml`
- `radiant-app/.maestro/radiant-1-4-segundo-dia.yaml`
- `radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml`
- `radiant-app/.maestro/reward-locked.yaml`
- `radiant-app/.maestro/reward-unlock.yaml`

### T19
- `.github/workflows/content-scripts.yml`
- `.loop/project.yaml`
- `scripts/content` (diretório/raiz a expandir)

### T20
- `radiant-app/src/app/_layout.tsx`
- `radiant-app/src/constants/storageKeys.ts`
- `radiant-app/src/features/curriculum-reset/CurriculumResetService.test.ts`
- `radiant-app/src/features/curriculum-reset/CurriculumResetService.ts`
- `radiant-app/src/features/journey/services/JourneyProgressService.test.ts`
- `radiant-app/src/features/journey/services/JourneyProgressService.ts`
- `radiant-app/src/features/progress-sync/LocalProgressAdapter.test.ts`
- `radiant-app/src/features/progress-sync/LocalProgressAdapter.ts`
- `radiant-app/src/features/progress-sync/ProgressSyncService.test.ts`
- `radiant-app/src/features/progress-sync/ProgressSyncService.ts`
- `radiant-app/src/features/progress-sync/progressSync.types.ts`
- `radiant-app/src/features/progress-sync/startupRestore.test.ts`
- `radiant-app/src/features/progress-sync/startupRestore.ts`
- `radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts`
- `radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.ts`
- `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.test.ts`
- `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts`
- `radiant-app/src/storage/schemaVersionGuard.test.ts`
- `radiant-app/src/storage/schemaVersionGuard.ts`
- `radiant-app/src/storage/storageInventory.test.ts`
- `radiant-app/src/storage/storageInventory.ts`

### T21
- `radiant-app/src/features/journey/services/JourneyCatalogAudit.ts`
- `radiant-app/src/features/journey/services/JourneyCatalogReachability.test.ts`
- `radiant-app/src/features/journey/services/JourneyCurriculumService.ts`
- `radiant-app/src/features/journey/services/JourneyDefinitionService.ts`
- `radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.ts`
- `radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.ts`
- `radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts`

### T22

Nota de conferência: nomes abreviados de testes foram resolvidos pela tabela §9; os testes WelcomeFlow ficam em screens, os modelos exposure/collimation em bench, não em lessons. Arquivos Criar/Renomear ausentes são esperados, não bloqueios.
