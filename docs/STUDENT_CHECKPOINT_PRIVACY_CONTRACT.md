# Contrato de privacidade — checkpoints, replay, commits e eventos do aluno

**Versão do contrato:** 1  
**Data:** 2026-08-09  
**Estado:** normativo para implementação futura; coleta remota desligada

## 1. Regra estrutural

Cada contrato desta página é uma allowlist fechada e independente. O schema usa
`additionalProperties: false` na raiz e em **todo** objeto aninhado, inclusive
item de array, recibo, evento planejado e ramo de união. Uniões são
discriminadas; nenhum ramo herda um saco genérico de `properties`, `metadata`
ou `context`.

Campo, tipo, enum ou valor fora da allowlist é recusado antes de persistir ou
transmitir, recebe somente um `reasonCode` sanitizado e nunca é ecoado em log.
Não existe texto livre, resposta/alternativa do aluno, PII, PHI, identificador
persistente de aparelho, caminho/URI de mídia ou snapshot visual.

## 2. Tipos escalares compartilhados

| Tipo | Definição exata |
| --- | --- |
| `OpaqueId` | string ASCII `^[A-Za-z0-9:_-]{1,96}$`, aleatória ou derivada de contrato, nunca de pessoa |
| `CatalogId` | string ASCII `^[a-z0-9][a-z0-9:_-]{0,127}$`, deve existir no catálogo embarcado |
| `ContentVersion` | string ASCII `^[A-Za-z0-9._:-]{1,128}$` |
| `UtcTimestamp` | string ISO-8601 UTC com sufixo `Z` |
| `SafeCount` | inteiro de 0 a 1.000 |
| `Sequence` | inteiro seguro ≥0 |
| `ProgressPercent` | inteiro de 0 a 100 |
| `ScoreBasisPoints` | inteiro de 0 a 10.000 |
| `Sha256` | string ASCII hexadecimal minúscula `^[a-f0-9]{64}$` |

Enums fechados:

- `StudentCheckpointMode`: `off | shadow | active`;
- `CheckpointSurface`: `first-run | home | missions | progress | lesson |
  legacy-quiz | unit-checkpoint | review | reward`;
  **Reduzido em 2026-08-21.** `galaxy-map`, `galaxy-interior` e
  `planet-interior` saíram junto com as telas: a Galáxia foi absorvida pela
  trilha contínua da aba Estude e deixou de existir como superfície. Menos
  superfícies emitindo é redução de coleta, nunca ampliação — por isso a
  mudança não reabre nenhuma decisão deste contrato.
- `CheckpointPhase`: `entered | in_progress | committed | completed |
  abandoned | superseded | invalidated`;
- `NextAction`: `resume | home | review | retry | support`;
- `DurationBucket`: `lt-15s | 15-59s | 1-2m | 3-5m | gt-5m`;
- `ResumeStrategy`: `direct | canonical-home | discard-incompatible`;
- `IntentKind`: `lesson-completion | review-completion |
  unit-checkpoint-attempt`;
- `MandatoryStep`: `attempt | evidence | mastery | review | xp | goal |
  journey`;
- `MandatoryState`: `not-started | in-progress | paused-retry-limit |
  completed | cancelled-before-effects`;
- `EffectKind`: `learning-attempt-recorded | learning-evidence-recorded |
  competency-mastery-recomputed | spaced-repetition-updated |
  competency-review-updated | xp-awarded | daily-goal-updated |
  journey-node-completed`;
- `AuxiliaryDeliveryState`: `not-required | pending-delivery | delivered`;
- `ResultingSupportState`: `none | cycle-1-required | cycle-2-required |
  support-required`.
- `EvidenceKind`: `guided-practice | independent-recall | applied-transfer |
  delayed-retention | legacy-lesson-recall`;
- `EvidenceOutcome`: `correct | incorrect | skipped`;
- `EvidenceDurationBucket`: `unknown | under-10s | 10-30s | 30-60s |
  over-60s`;
- `ReviewRating`: `review-later | correct`.

## 3. IDs estáveis de catálogo permitidos

Somente estes nomes de propriedade podem referenciar catálogo:

```text
trackId | unitId | journeyNodeId | lessonId | activityId |
checkpointDefinitionId | missionId | reviewCardId | rewardId |
galaxyId | planetId | itemId | competencyIds | weakCompetencyIds
```

Os **onze** primeiros nomes antes de `itemId` são `CatalogId` opcionais nos
contratos que os listam. `itemId` também é `CatalogId`, mas só aparece em
resultado estruturado/evidência. `competencyIds` e `weakCompetencyIds` são
arrays canônicos, sem duplicata, dos tamanhos definidos em cada contrato.
Nenhum outro nome terminado em `Id` é aceito como catálogo. IDs digitados pelo
aluno são proibidos.

## 4. Allowlist exata — `StudentCheckpointV1`

Objeto raiz com `additionalProperties: false`.

| Propriedade | Tipo | Obrigatória |
| --- | --- | --- |
| `schemaVersion` | literal `1` | sim |
| `checkpointId` | `OpaqueId` | sim |
| `flowId` | `OpaqueId` | sim |
| `operationId` | `OpaqueId` | não |
| `surface` | `CheckpointSurface` | sim |
| `phase` | `CheckpointPhase` | sim |
| `trackId` | `CatalogId` | não |
| `unitId` | `CatalogId` | não |
| `journeyNodeId` | `CatalogId` | não |
| `lessonId` | `CatalogId` | não |
| `activityId` | `CatalogId` | não |
| `checkpointDefinitionId` | `CatalogId` | não |
| `missionId` | `CatalogId` | não |
| `reviewCardId` | `CatalogId` | não |
| `rewardId` | `CatalogId` | não |
| `galaxyId` | `CatalogId` | não |
| `planetId` | `CatalogId` | não |
| `competencyIds` | array de 1–30 `CatalogId`, canônico e sem duplicata | não |
| `contentVersion` | `ContentVersion` | sim |
| `cursorId` | `CatalogId` | sim |
| `progressPercent` | `ProgressPercent` | sim |
| `completedStepCount` | `SafeCount` | sim |
| `totalStepCount` | `SafeCount` | sim |
| `nextAction` | `NextAction` | sim |
| `sequence` | `Sequence` | sim |
| `restoreFailureCount` | inteiro `0 | 1 | 2` | sim |
| `createdAt` | `UtcTimestamp` | sim |
| `updatedAt` | `UtcTimestamp` | sim |
| `expiresAt` | `UtcTimestamp` | não; somente estado retomável efêmero |

`expiresAt` nunca se aplica a tentativa, conclusão, evidência, domínio, commit
que iniciou efeito ou evento confirmado ainda sem ack.

## 5. Resultado estruturado e intenção imutável de replay

### `ItemOutcomeV1`

Cada item de `itemOutcomes` tem `additionalProperties: false` e exatamente:

| Propriedade | Tipo |
| --- | --- |
| `itemId` | `CatalogId` |
| `activityId` | `CatalogId` |
| `competencyIds` | array de 1–8 `CatalogId`, canônico e sem duplicata |
| `evidenceKind` | `EvidenceKind` |
| `outcome` | `EvidenceOutcome` |
| `isCriticalError` | boolean |
| `hintUsed` | boolean |
| `durationBucket` | `EvidenceDurationBucket` |

O array contém 1–64 itens, sem `itemId` repetido. `outcome=skipped` e
`isCriticalError=true` nunca contam como acerto. Resultado guarda apenas ids,
enums fechados e booleanos — nunca resposta, valor de alternativa, ordem
escolhida, texto, coordenada livre ou conteúdo clínico.

### `PlannedSyncEventV1`

Cada item de `plannedSyncEvents` tem `additionalProperties: false` e exatamente:

| Propriedade | Tipo |
| --- | --- |
| `eventId` | `OpaqueId` |
| `event` | exatamente um ramo de `SyncEventV1` da seção 9 |

`eventId` aparece apenas neste envelope planejado e, depois, no envelope da
outbox; o objeto `event` não contém outro id de evento.

### `CommitIntentV1` — união discriminada fechada

`CommitIntentV1` é exatamente um dos três ramos abaixo. Cada ramo é imutável,
tem `additionalProperties: false` e lista todas as propriedades; não há campos
comuns implícitos.

#### Ramo `lesson-completion`

| Propriedade | Tipo |
| --- | --- |
| `schemaVersion` | literal `1` |
| `intentKind` | literal `lesson-completion` |
| `operationId`, `checkpointId`, `flowId`, `attemptId` | `OpaqueId` |
| `surface` | literal `lesson` |
| `contentVersion` | `ContentVersion` |
| `lessonId`, `unitId`, `journeyNodeId`, `activityId` | `CatalogId` |
| `itemOutcomes` | array de 1–64 `ItemOutcomeV1` |
| `totalItemCount`, `correctItemCount` | `SafeCount` |
| `scoreBasisPoints` | `ScoreBasisPoints` |
| `eligibleForReward`, `completesJourneyNode` | boolean |
| `xpDelta`, `goalProgressDelta` | `SafeCount` |
| `committedAt` | `UtcTimestamp` |
| `plannedSyncEvents` | array de 0–100 `PlannedSyncEventV1`, ids únicos |

Esse ramo espelha `LessonOutcomeService`: bloco/atividade e nó já resolvidos,
acerto, `hintUsed`, faixa de duração e evidência por interação, tentativa,
review, XP/meta, jornada e sync planejado.

#### Ramo `review-completion`

| Propriedade | Tipo |
| --- | --- |
| `schemaVersion` | literal `1` |
| `intentKind` | literal `review-completion` |
| `operationId`, `checkpointId`, `flowId`, `reviewSessionId`, `attemptId` | `OpaqueId` |
| `surface` | literal `review` |
| `contentVersion` | `ContentVersion` |
| `lessonId`, `unitId`, `reviewCardId`, `activityId` | `CatalogId` |
| `journeyNodeId` | `CatalogId | null` |
| `itemOutcomes` | array com exatamente 1 `ItemOutcomeV1` |
| `reviewRating` | `ReviewRating` |
| `outcome` | `EvidenceOutcome` |
| `xpDelta` | `SafeCount` |
| `completesJourneyNode` | boolean |
| `committedAt` | `UtcTimestamp` |
| `plannedSyncEvents` | array de 0–100 `PlannedSyncEventV1`, ids únicos |

Esse ramo espelha `useReview`: lição/pergunta estáveis, rating
`review-later|correct`, outcome, atualização da repetição, XP quando aplicável e
sync. Resposta revelada ou selecionada nunca é persistida.

#### Ramo `unit-checkpoint-attempt`

| Propriedade | Tipo |
| --- | --- |
| `schemaVersion` | literal `1` |
| `intentKind` | literal `unit-checkpoint-attempt` |
| `operationId`, `checkpointId`, `flowId`, `attemptId` | `OpaqueId` |
| `surface` | literal `unit-checkpoint` |
| `contentVersion` | `ContentVersion` |
| `checkpointDefinitionId`, `unitId`, `journeyNodeId`, `activityId` | `CatalogId` |
| `itemOutcomes` | array de 1–64 `ItemOutcomeV1` |
| `totalItemCount`, `correctItemCount`, `criticalErrorCount`, `skippedItemCount` | `SafeCount` |
| `scoreBasisPoints` | `ScoreBasisPoints` |
| `passed` | boolean |
| `weakCompetencyIds` | array de 0–30 `CatalogId`, canônico e sem duplicata |
| `reinforcementPlanId`, `sourceAttemptId` | `OpaqueId | null` |
| `reinforcementCycle` | inteiro `0 | 1 | 2` |
| `resultingSupportState` | `ResultingSupportState` |
| `xpDelta`, `goalProgressDelta` | `SafeCount` |
| `completesJourneyNode` | boolean |
| `committedAt` | `UtcTimestamp` |
| `plannedSyncEvents` | array de 0–100 `PlannedSyncEventV1`, ids únicos |

Em todos os ramos, `totalItemCount=itemOutcomes.length`;
`correctItemCount` é a contagem de `outcome=correct` sem erro crítico;
`scoreBasisPoints=floor(10000×correctItemCount/totalItemCount)`; contagens de
skip/erro derivam do array. `passed` do checkpoint equivale a score ≥8000 e
zero erro crítico. Deltas, elegibilidade, rating e relação de tentativas são
imutáveis e coerentes com o ramo.

Os campos bastam para repetir os efeitos aplicáveis sem UI nem outro store não
confirmado. Eventos planejados coincidem em operação/tentativa/catálogo/versão,
entram na outbox somente depois dos passos obrigatórios e nunca contêm resposta,
texto, PII ou PHI.

### `CommitJournalEntryV1`

O registro raiz do journal tem `additionalProperties: false` e exatamente:

| Propriedade | Tipo |
| --- | --- |
| `schemaVersion` | literal `1` |
| `operation` | `CommitOperationV1` |
| `intent` | `CommitIntentV1` |

`operation.operationId`, `intent.operationId`, checkpoint, fluxo, superfície e
versão devem coincidir. O journal serializa e persiste `operation + intent` na
**mesma escrita atômica antes de qualquer efeito**. A intenção nunca muda; só a
máquina de `operation` avança. Se a escrita conjunta falhar, nenhum efeito pode
começar.

## 6. Allowlist exata — `CommitOperationV1`

Objeto com `additionalProperties: false` e exatamente:

| Propriedade | Tipo |
| --- | --- |
| `schemaVersion` | literal `1` |
| `operationId` | `OpaqueId` |
| `checkpointId` | `OpaqueId` |
| `flowId` | `OpaqueId` |
| `surface` | `CheckpointSurface` |
| `contentVersion` | `ContentVersion` |
| `mandatoryState` | `MandatoryState` |
| `nextMandatoryStep` | `MandatoryStep | null` |
| `requiredMandatorySteps` | subconjunto canônico, ordenado e sem duplicata de `MandatoryStep` |
| `completedMandatorySteps` | array ordenado, sem duplicata, de `MandatoryStep` |
| `auxiliaryDeliveryState` | `AuxiliaryDeliveryState` |
| `outboxEventIds` | array de 0–100 `OpaqueId`, ordenado e sem duplicata |
| `automaticRetryCount` | inteiro 0–20 |
| `retryEpoch` | `SafeCount` |
| `lastFailureCode` | `CommitFailureCode | null` |
| `createdAt` | `UtcTimestamp` |
| `updatedAt` | `UtcTimestamp` |

`CommitFailureCode` é fechado:

```text
storage-failed | invariant-failed | dependency-unavailable |
outbox-enqueue-failed | outbox-ack-failed | privacy-rejected
```

Invariantes:

- ordem canônica é `attempt,evidence,mastery,review,xp,goal,journey`;
- `requiredMandatorySteps` é derivado do ramo do intent; etapa não aplicável é
  ausente, nunca no-op implícito;
- derivação exata: lição exige `attempt,evidence,mastery,review,journey` e inclui
  `xp,goal` quando `eligibleForReward=true`; review exige
  `attempt,evidence,mastery,review`, inclui `xp` quando `xpDelta>0` e `journey`
  quando `completesJourneyNode=true`; checkpoint exige
  `attempt,evidence,mastery,review`, inclui `xp`/`goal` quando o delta respectivo
  é positivo e `journey` quando conclui o nó;
- `completedMandatorySteps` é prefixo exato de `requiredMandatorySteps` e
  `nextMandatoryStep` é o primeiro item ainda ausente;
- `cancelled-before-effects` exige zero recibo/efeito e
  `completedMandatorySteps=[]`;
- depois do primeiro efeito, cancelamento, invalidação e expiração são
  proibidos; a operação fica `in-progress` até reconciliar exatamente uma vez;
- `mandatoryState=completed` exige
  `completedMandatorySteps=requiredMandatorySteps` e
  `nextMandatoryStep=null`;
- na 20ª falha automática, `mandatoryState=paused-retry-limit`,
  `automaticRetryCount=20` e o próximo passo/estado exato são preservados;
  retry explícito incrementa `retryEpoch`, zera `automaticRetryCount` e retoma
  o mesmo passo; Home não cancela operação que já iniciou efeito;
- conclusão obrigatória e entrega auxiliar são estados independentes;
- `not-required` exige `outboxEventIds=[]` e nenhum evento planejado;
- `pending-delivery|delivered` exige que `outboxEventIds` seja exatamente a
  lista de ids de `intent.plannedSyncEvents`; `delivered` exige todos com ack.

## 7. Recibo atômico de idempotência

`IdempotencyReceiptV1` tem `additionalProperties: false` e exatamente:

| Propriedade | Tipo |
| --- | --- |
| `schemaVersion` | literal `1` |
| `operationId` | `OpaqueId` |
| `mandatoryStep` | `MandatoryStep` |
| `effectKind` | `EffectKind` |
| `effectRecordId` | `OpaqueId` |
| `persistedAt` | `UtcTimestamp` |

Cada autoridade grava o recibo identificado por `(operationId,effectKind)` no
**mesmo registro durável ou transação atômica daquele único efeito**. Não pode
existir janela com efeito confirmado e recibo ausente. `attempt`, `evidence`,
`mastery`, `xp`, `goal` e `journey` mapeiam respectivamente às autoridades
homônimas; `review` exige os recibos `spaced-repetition-updated` e/ou
`competency-review-updated` determinados pelo ramo. Evidência é gravada como
lote atômico da intenção. A saga marca o passo somente após todos os recibos
exigidos; crash depois de efeito+recibo e antes do marcador retorna o recibo e
não reaplica o efeito.

## 8. `LocalCheckpointEventV1` — telemetria/ciclo de vida local

Esta é a união exata usada pelo beta local
`beta-checkpoint-local-v1.jsonl`. Ela nunca entra na outbox e nunca é enviada
por `POST /v1/sync/events/batch`. Cada ramo tem
`additionalProperties: false`; a linha lista todas as propriedades, sem campos
comuns implícitos.

Tipos específicos:

- `localEventId/checkpointId/flowId/operationId=OpaqueId`;
- `occurredAt=UtcTimestamp`, `surface=CheckpointSurface`;
- `contentVersion=ContentVersion`, `cursorId/checkpointDefinitionId=CatalogId`;
- `reasonCode=content-version-mismatch | cursor-missing | surface-mismatch |
  expired-ephemeral | corrupt | future-schema | privacy-rejected |
  storage-failed | navigation-unavailable | retry-limit`;
- `commitResult=mandatory-completed | deferred-delivery`;
- `restoreFailureCount=1 | 2`, `reinforcementCycle=1 | 2`;
- demais tipos vêm da seção 2.

| `eventName` | Propriedades exatas |
| --- | --- |
| `checkpoint_entered` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,cursorId,phase` |
| `checkpoint_progressed` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,cursorId,phase,progressPercent,completedStepCount,totalStepCount` |
| `checkpoint_committed` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,operationId,commitResult` |
| `checkpoint_completed` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,durationBucket` |
| `checkpoint_abandoned` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,durationBucket` |
| `checkpoint_invalidated` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,reasonCode` |
| `restore_offered` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,resumeStrategy` |
| `restore_succeeded` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,resumeStrategy,durationBucket` |
| `restore_failed` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,reasonCode,restoreFailureCount` |
| `commit_resumed` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,operationId,mandatoryStep` |
| `checkpoint_attempted` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,operationId,checkpointDefinitionId,scoreBasisPoints,passed,criticalErrorCount,skippedItemCount` |
| `reinforcement_assigned` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,operationId,reinforcementCycle,weakCompetencyCount` |
| `support_required` | `schemaVersion,localEventId,eventName,occurredAt,surface,checkpointId,flowId,contentVersion,operationId,weakCompetencyCount` |

Em cada ramo, `schemaVersion=1` e `eventName` é o literal da primeira coluna.
`support_required` só pode ser emitido após: tentativa inicial reprovada, ciclo
1 concluído, nova tentativa reprovada, ciclo 2 concluído e outra nova tentativa
ainda não aprovada.

## 9. `SyncEventV1` e envelope exato da outbox

`SyncEventV1` contém somente fatos pedagógicos confirmados necessários à união
monotônica/recomputação. Cada ramo tem `additionalProperties: false`, não tem
`eventId` próprio e lista todas as propriedades:

| `eventName` | Propriedades exatas |
| --- | --- |
| `attempt_confirmed` | `schemaVersion,eventName,occurredAt,operationId,attemptId,intentKind,activityId,checkpointDefinitionId,unitId,contentVersion,totalItemCount,correctItemCount,scoreBasisPoints,passed,criticalErrorCount,skippedItemCount` |
| `competency_evidence_confirmed` | `schemaVersion,eventName,occurredAt,operationId,attemptId,itemId,activityId,competencyIds,contentVersion,evidenceKind,outcome,isCriticalError,hintUsed,durationBucket` |
| `review_completion_confirmed` | `schemaVersion,eventName,occurredAt,operationId,attemptId,reviewSessionId,reviewCardId,lessonId,unitId,activityId,contentVersion,reviewRating,outcome` |
| `journey_completion_confirmed` | `schemaVersion,eventName,occurredAt,operationId,attemptId,journeyNodeId,unitId,contentVersion` |
| `reinforcement_cycle_completed` | `schemaVersion,eventName,occurredAt,operationId,reinforcementPlanId,cycleStateId,reinforcementCycle,unitId,competencyIds,sourceAttemptId,followUpAttemptId,contentVersion` |
| `support_required_confirmed` | `schemaVersion,eventName,occurredAt,operationId,reinforcementPlanId,supportStateId,unitId,competencyIds,sourceAttemptId,followUpAttemptId,contentVersion` |

Tipos: `schemaVersion=1`; `eventName` é o literal da coluna; ids de operação,
tentativa, sessão, plano e estado são `OpaqueId`; `checkpointDefinitionId` é
`CatalogId|null`; ids de catálogo seguem a seção 3; `competencyIds` tem 1–30
itens; enums, timestamps, versão, score e contagens seguem a seção 2. Não há
resposta ou valor selecionado.

Merge remoto faz união por `eventId`. Mesmo id com payload canônico idêntico é
ack idempotente; mesmo id com payload diferente é conflito
`idempotency-payload-mismatch`, fica em quarentena e não altera projeção.
Tentativa/evidência são imutáveis; domínio é recalculado. Ciclo de reforço faz
união por `(reinforcementPlanId,reinforcementCycle)` e preserva a relação
source→follow-up. `support_required_confirmed` é monotônico para o plano; uma
aprovação posterior cria novo fato, nunca apaga o histórico nem desbloqueia por
last-write-wins.

`OutboxEventV1` tem `additionalProperties: false` e exatamente:

| Propriedade | Tipo |
| --- | --- |
| `schemaVersion` | literal `1` |
| `eventId` | `OpaqueId` |
| `event` | exatamente um ramo de `SyncEventV1` |
| `deliveryState` | `pending | paused-retry-limit | acknowledged` |
| `automaticDeliveryRetryCount` | inteiro 0–20 |
| `deliveryRetryEpoch` | `SafeCount` |
| `nextAttemptAt` | `UtcTimestamp | null` |
| `createdAt` | `UtcTimestamp` |
| `acknowledgedAt` | `UtcTimestamp | null` |

O `eventId` da outbox deve ser igual ao id do `PlannedSyncEventV1`
correspondente; como `SyncEventV1` não contém `eventId`, não há fonte duplicada.
Na 20ª falha automática, entrega pausa preservando o envelope; retry explícito
incrementa a época e zera o contador. Evento pendente/pausado não expira.

## 10. Dados proibidos

- nome, email, telefone, endereço, matrícula, nascimento ou conta social;
- token, cookie, credencial, IP persistido, advertising/vendor/device id,
  serial ou fingerprint;
- texto livre, justificativa, anotação, transcrição, enunciado, resposta ou
  alternativa/valor selecionado;
- imagem clínica, DICOM, paciente, exame, caminho, URL, URI ou nome de arquivo;
- localização, contatos, fotos, microfone, câmera ou clipboard;
- stack trace, mensagem crua de exceção, objeto `metadata/context/properties`;
- inferência de risco sobre uma pessoa.

Chaves `name`, `email`, `userId`, `deviceId`, `answer`, `selectedValue`, `text`,
`notes`, `uri`, `url`, `path`, `metadata`, `context`, `patient` e `dicom`,
inclusive com variação de caixa ou valor vazio, são recusadas.

## 11. Retenção, ack e compactação sem perda

- transição efêmera sem fato pedagógico pode ser limitada a 30 dias/500 itens;
- checkpoint retomável sem efeito iniciado pode expirar e ser invalidado;
- journal com `CommitIntentV1` após o primeiro efeito não expira e deve terminar;
- tentativa, evidência, domínio, conclusão e evento confirmado ainda sem ack
  **não podem ser removidos por idade**;
- outbox `pending|paused-retry-limit` não tem TTL e só é removida depois de ack idempotente ou
  compactação semântica determinística;
- compactação semântica só remove eventos quando cria, na mesma transação, um
  fato/snapshot durável equivalente, versionado e capaz de regenerar a mesma
  projeção e os mesmos ids idempotentes;
- store shadow pode ser apagado ao desligar shadow somente porque não é
  autoridade pedagógica nem outbox;
- rollback do checkpoint nunca apaga fatos pedagógicos confirmados.

## 12. Fronteira local/remota

Beta pedagógico local roda com sync `off` e usa somente
`LocalCheckpointEventV1` no artefato sanitizado
`beta-checkpoint-local-v1.jsonl`, acompanhado de evidência manual sanitizada.
Evento local de lifecycle/telemetria não é convertido implicitamente em sync.

O export é gerado pela UI interna **Exportar diagnóstico do beta** ou pelo
harness que lê apenas o sandbox do app; backup integral, advertising/vendor id,
nome do aparelho e id de usuário são proibidos. O diretório local, ignorado pelo
git, é
`radiant-app/.maestro/artifacts/student-checkpoint-beta/<betaRunId>/` e contém:

- `beta-checkpoint-local-v1.jsonl`: uma linha `LocalCheckpointEventV1`;
- `beta-checkpoint-local-v1.manifest.json`: `additionalProperties:false` e
  exatamente `schemaVersion=1,exportId,betaRunId,platform,appVersion,buildNumber,
  contentVersion,createdAt,eventCount,eventsSha256`, em que ids são `OpaqueId`,
  `platform=ios|android`, versões são `ContentVersion`, build/count são
  `SafeCount`, data é UTC e hash é `Sha256`;
- `beta-checkpoint-local-v1.audit.json`: `additionalProperties:false` e
  exatamente `schemaVersion=1,exportId,eventsSha256,decision,reviewerRef,
  reviewedAt,rejectedEventCount,reasonCounts`; decisão é `approved|rejected`,
  refs são opacas e cada item de `reasonCounts` também fecha propriedades em
  `reasonCode,count`;
- `beta-checkpoint-local-v1.aggregate.json`: `additionalProperties:false` e
  exatamente `schemaVersion=1,betaRunId,sourceExportIds,sourceAuditHashes,
  eligibleRestoreCount,successfulRestoreCount,successRateBasisPoints,
  fallbackCounts,duplicateLocalEventCount,iosEventCount,androidEventCount,
  generatedAt`; arrays têm 1–100 ids/hashes únicos e cada fallback fecha em
  `reasonCode,count`.

O validador futuro
`scripts/checkpoints/validate-beta-checkpoint-local.mjs` verifica schema, hash,
allowlist e revisão de privacidade; o agregador
`scripts/checkpoints/aggregate-beta-checkpoint-local.mjs` recusa export sem
audit aprovado. Primeiro deduplica por `localEventId`: cópia byte-idêntica conta
uma vez; mesmo id com payload diferente reprova o lote. Denominador é exatamente
o número de `checkpointId` únicos com `restore_offered` validado e
`resumeStrategy=direct`. Numerador é o subconjunto com `restore_succeeded`
posterior e correspondente. Falha/invalidação/fallback entra em contagem por
`reasonCode`. O gate exige denominador ≥100 e sucesso ≥99%; o aggregate e o
audit são a evidência, nunca o JSONL bruto. Raw/audit ficam com acesso restrito
por até 30 dias; não entram em git, issue ou chat.

Somente `SyncEventV1` confirmado pode entrar em `OutboxEventV1`. Sync remoto
exige conta, aviso/consentimento aplicável, declarações de loja reconciliadas e
sink verificado. Token vive no header de autenticação, nunca no evento. O
servidor associa conta no perímetro autenticado; o payload não contém email ou
id público de usuário.

## 13. Testes obrigatórios

- `additionalProperties:false` na raiz e em cada objeto/ramo/item aninhado;
- um teste positivo e ao menos um negativo por propriedade e por ramo;
- rejeição de chave desconhecida, tipo, enum, limite, charset e array duplicado;
- `CommitOperationV1 + CommitIntentV1` sobrevivem juntos à serialização,
  corrupção, relaunch e schema futuro; nunca existe operação sem intenção;
- testes positivos/negativos cobrem os três ramos do intent e sua derivação de
  score/contagens;
- falha na escrita atômica inicial prova zero efeito obrigatório;
- crash antes do efeito não cria recibo nem efeito;
- janela efeito-antes-do-recibo é impossível por transação/registro atômico;
- crash depois de efeito+recibo e antes do marcador da saga retorna o recibo e
  não duplica tentativa, evidência, domínio/revisão, XP/meta ou jornada;
- crash injection cobre cada fronteira de autoridade em
  `attempt,evidence,mastery,review,xp,goal,journey` e todos os `effectKind`;
- na 20ª falha automática a operação pausa com próximo passo intacto; retry
  explícito incrementa a época, zera o contador e não cancela efeito anterior;
- resultado estruturado rejeita resposta, valor selecionado, texto e mais de
  64 itens; invariantes de skip/erro crítico são testadas;
- `LocalCheckpointEventV1` é recusado pela outbox e pelo endpoint remoto;
- `OutboxEventV1.event` recusa todo ramo que não seja `SyncEventV1`;
- `eventId` planejado/outbox é único, estável no relaunch e não existe no ramo;
- varredura case-insensitive de chaves proibidas, URI e marcador clínico;
- payload rejeitado não aparece em store, log, journal, outbox ou transporte;
- relógio avançado além de 30 dias não remove fato confirmado sem ack;
- outbox pendente sobrevive a compactação, relaunch e retry;
- compactação semântica reproduz projeção e ids antes/depois de forma
  byte-equivalente;
- crash depois do enqueue e antes do ack reenvia o mesmo `eventId` sem duplicar;
- merge testa duplicata idêntica, mismatch de mesmo eventId, ciclos fora de
  ordem e suporte monotônico sem last-write-wins;
- export iOS/Android, manifest, auditoria e aggregate são fechados; dedupe por
  `localEventId`, denominador/numerador e reason codes têm fixtures reproduzíveis;
- sequência de suporte exige duas rodadas completas de reforço e três
  tentativas não aprovadas antes de `support_required`;
- fuzz/property tests geram objetos aninhados, chaves Unicode/case variants e
  payloads acima do limite;
- mudança de allowlist falha snapshot/contrato até esta página, schema e revisão
  de privacidade serem atualizados juntos.

## 14. Gate de mudança

Adicionar campo, intenção ou evento exige finalidade/minimização escrita,
schema, testes positivos/negativos, retenção, fronteira remota e nova revisão
das declarações de loja quando houver coleta remota. Produção exige autorização
explícita.
