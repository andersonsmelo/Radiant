# Onda 2 — fundação transacional de checkpoints em `off`

**Data:** 2026-08-09  
**Run Loop:** `run-1786311202497-fd99173e`  
**Escopo:** kernel isolado; nenhum adaptador conectado a tela ou serviço legado

## Entrega

- módulo `src/features/student-checkpoints/` com contratos fechados, schemas e
  serialização determinística;
- fallback de modo inválido para `off`;
- stores ativo e shadow em chaves físicas distintas, um fluxo retomável global,
  diário efêmero de 30 dias/500 transições e quarentena sanitizada;
- `CommitOperationV1 + CommitIntentV1` na mesma escrita antes do primeiro
  efeito;
- sete autoridades isoladas com efeito e `IdempotencyReceiptV1` no mesmo
  registro serializado;
- `CheckpointCoordinator` e contrato `ScreenCheckpointAdapter`, sem ligação a
  rotas ou telas;
- outbox local auxiliar, deduplicada por `eventId`, sem transporte remoto;
- branches recuperáveis para lição, review e tentativa de checkpoint de
  unidade.

Os records das autoridades são a fundação transacional isolada. Eles ainda não
substituem nem chamam `JourneyProgressService`, `LessonOutcomeService`,
`GamificationService`, `DailyGoalService`, `CompetencyReviewService` ou as filas
legadas. Essa integração pertence às ondas shadow/runtime e precisa preservar a
compatibilidade antes de qualquer ativação.

## TDD e intervalos de crash exercitados

A primeira execução focada ocorreu antes dos módulos de produção existirem e
falhou nas cinco suítes por imports ausentes. Depois da implementação, a suíte
focada passou com **5 suítes/58 testes**.

Os testes injetam crash nos limites enumerados:

- antes da escrita conjunta do journal: zero efeito;
- antes de cada autoridade `attempt,evidence,mastery,review,xp,goal,journey`;
- depois de efeito+recibo atômicos e antes do marcador da saga, em cada uma das
  sete autoridades;
- antes e depois do enqueue auxiliar;
- relaunch com dedupe por `operationId+effectKind` e `eventId`;
- 20 falhas automáticas, pausa durável e retry explícito em nova época;
- `review` com `spaced-repetition-updated` e
  `competency-review-updated`, conforme o ramo.

Essa evidência demonstra deduplicação apenas nos intervalos testados. Não é uma
afirmação irrestrita de “exactly once”.

## Equivalência em `off`

O teste de compatibilidade pré-carrega bytes representativos de progresso,
gamificação, meta diária, revisão espaçada e última rota. Todos os métodos
públicos do coordenador retornam antes de storage, relógio, gerador de ids ou
autoridade: os bytes permanecem idênticos e os contadores de leitura/escrita
ficam em zero. Como nenhum ponto de integração foi conectado, o runtime legado
permanece a única autoridade observável.

## Validação local antes do fechamento Loop

- Jest focado: **5 suítes/58 testes**, exit 0;
- ESLint focado: exit 0, sem warnings;
- TypeScript `tsc --noEmit`: exit 0;
- Jest completo do app: **71 suítes/472 testes**, exit 0.

O resultado dos validadores completos, `step finish`, memória e fechamento é
autoridade do status público do run Loop acima; este arquivo não antecipa essas
transições.

## Fora desta onda

- nenhum adaptador em tela, navegação ou bootstrap;
- nenhum shadow de produção/preview ativado;
- nenhuma mutação pelos serviços legados e nenhuma migração de fila;
- nenhum sync remoto, endpoint ou sink;
- nenhuma Task 12 educacional;
- nenhum build, OTA, binário, mudança de `1.3.1 (7)` ou publicação em loja.
