# Kernel de checkpoints e loops do aluno — Plano de implementação

**Data:** 2026-08-09  
**Status:** Onda 2 concluída em `off`; Onda 3 shadow ainda não iniciada
**Spec:**
[`2026-08-09-checkpoints-e-loops-do-aluno-design.md`](../specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md)  
**ADR:**
[`ADR-2026-08-09`](../../adr/ADR-2026-08-09-kernel-de-checkpoints-e-loops-do-aluno.md)

## Regras de execução

- executar uma onda por run Loop, com escopo declarado antes de editar;
- começar por teste/contrato focado e fechar com validação completa;
- não misturar validação Loop com E2E em emulador;
- preservar stores e APIs antigos até existir migração comprovada;
- atualizar roadmap, status e fila em cada marco material;
- não publicar OTA, AAB ou IPA sem autorização separada;
- produção permanece `off` enquanto este plano não fechar os gates de beta.

## Onda 1 — Governança

**Estado em 2026-08-09:** concluída somente como documentação.

Entregas:

- spec e Decision Log aprovados;
- ADR do kernel, modos, local-first, saga e dois loops;
- contrato de privacidade dos checkpoints/eventos;
- runbook de rollout/rollback;
- arquitetura, fluxo, fila, roadmaps e status reconciliados.

Gate: links e contratos documentais verdes. Nenhum código ou comportamento do
app muda nesta onda.

## Onda 2 — Fundação transacional em `off`

**Estado em 2026-08-09:** concluída como kernel isolado e desconectado.
Contratos, stores, quarentena, coordenadores, journal, recibos por autoridade e
outbox auxiliar estão implementados. Nenhum adaptador foi ligado às telas ou
aos serviços legados; essa integração continua nas Ondas 3–4.

Evidência local: TDD vermelho antes dos módulos, depois **5 suítes/58 testes
focados**, lint e typecheck verdes e suíte completa do app com **71 suítes/472
testes**. O run Loop é `run-1786311202497-fd99173e`; seu status público é a
autoridade para validação e fechamento finais.

### 2.1 Contratos e validação

Criar `radiant-app/src/features/student-checkpoints/` com tipos, schemas e
validadores de `StudentCheckpointV1`, `CommitOperationV1`, `CommitIntentV1`,
`CommitJournalEntryV1`, `IdempotencyReceiptV1`, `LocalCheckpointEventV1`,
`SyncEventV1`, `OutboxEventV1`, store envelope, modos, superfícies e fases.
`CommitIntentV1` é união discriminada fechada para conclusão de lição,
conclusão de review e tentativa de checkpoint de unidade, com schemas separados
e replay-completos.

Testes obrigatórios:

- união fechada e fallback de modo inválido para `off`;
- matriz completa de transições;
- rejeição de schema futuro, campo desconhecido e payload proibido;
- `additionalProperties:false` em todo objeto/ramo/item aninhado;
- resultado de item limitado a ids/booleanos e recusa de resposta/valor/texto;
- relógio e ids injetáveis;
- serialização determinística.

### 2.2 Stores isolados

Implementar repositórios ativo e shadow sobre chaves diferentes, com um
checkpoint por superfície, um fluxo retomável, diário de 30 dias/500 entradas,
quarentena e commits pendentes fora da compactação. O limite só compacta
transições efêmeras; fatos confirmados/outbox sem ack exigem ack ou compactação
semântica equivalente.

Testes: corrupção, expiração apenas do efêmero, retenção sem TTL do confirmado,
compactação semântica byte-equivalente, escrita interrompida, chave errada,
quarentena e inércia total em `off`.

### 2.3 Coordenador e adaptadores

Implementar `CheckpointCoordinator` e contrato
`ScreenCheckpointAdapter`. Nesta onda, nenhum adaptador é conectado às telas.

Testes: `enter`, `progress`, `commit`, `leave`, `restoreCandidate`, `invalidate`,
toque duplicado, remount e duas falhas de restauração.

### 2.4 Commit recuperável

Implementar a máquina de `CommitOperationV1` e adaptadores idempotentes para
tentativa, evidência, domínio/revisão, XP/meta e jornada. O terminal obrigatório
é separado da entrega auxiliar por outbox. Adicionar
deduplicação por `operationId` sem remover as assinaturas existentes; chamadas
legadas geram operação interna compatível.

Persistir `CommitOperationV1 + CommitIntentV1` no mesmo
`CommitJournalEntryV1`, por uma única escrita serializada/atômica antes de
qualquer efeito. A intenção imutável carrega resultados estruturados, deltas,
referências de catálogo e `PlannedSyncEventV1` suficientes para replay; não
aponta para payload em store não confirmado. Cada serviço grava
`IdempotencyReceiptV1` na mesma transação/registro durável do efeito, e a saga
só marca a etapa depois de ler o recibo.

Separar passos por autoridade em `attempt,evidence,mastery,review,xp,goal,
journey`. Persistir `requiredMandatorySteps` como subconjunto canônico do ramo;
etapa não aplicável fica ausente. Cada recibo identifica `effectKind`, e a chave
`operationId+effectKind` é atômica com aquele único efeito.

Testes de crash injection devem cobrir: antes do journal; antes de cada efeito;
efeito antes do recibo — janela que a implementação deve tornar impossível —;
depois de efeito+recibo e antes do marcador da saga; antes/depois do enqueue; e
relaunch. Todos provam exatamente uma aplicação. Cancelamento/invalidação só
existe antes do primeiro efeito; depois dele a saga reconcilia até
`mandatoryState=completed`. Falha de enqueue persiste `pending-delivery` e os
eventos planejados; crash depois do enqueue reenvia o mesmo `eventId`, sem
duplicar. Falha auxiliar não bloqueia conclusão nem perde evento.

Na 20ª falha automática, pausar duravelmente com contador 20 e próximo passo
intacto. Retry explícito incrementa a época, zera o contador e retoma; Home não
cancela operação com efeito. Testar cada fronteira das sete autoridades.

**Gate da Onda 2:** modo `off` produz estado observável byte-equivalente para
progresso, XP, desbloqueio e recomendação; suíte completa do app verde.

## Onda 3 — Shadow em todas as superfícies

Conectar adaptadores em apresentação, Home, Galáxia, interior da galáxia,
interior do planeta, Missões, Progresso, Lição, quiz legado, checkpoint, Revisão
e recompensa.

Regras:

- `preview=shadow`, `production=off`;
- nenhuma decisão shadow alimenta navegação ou domínio;
- divergências usam somente códigos/ids allowlisted;
- nenhum campo livre ou identificador de pessoa entra no store/evento.

Testes de integração cobrem entrada/saída, background, relaunch, deep link
inválido, catálogo alterado, storage indisponível e navegação repetida.

**Gate da Onda 3:** zero divergência determinística numa matriz local completa;
contrato de privacidade e regressão legada verdes.

## Onda 4 — Runtime ativo interno

Habilitar `active` apenas em build interna. Primeira allowlist de restauração:

- apresentação;
- Lição;
- Revisão;
- checkpoint de unidade.

As demais superfícies preservam o registro, mas retomam pela recomendação
canônica da Home. A primeira interface oferece CTA de retomada; não redireciona
automaticamente. Descarte incompatível explica o retorno seguro sem linguagem
técnica.

Testes E2E locais: instalação, abandono, kill/relaunch offline, retomada,
catálogo incompatível, duas falhas, fallback Home e ausência de loop de
navegação.

**Gate da Onda 4:** no mesmo aparelho/perfil, com mínimo de 20 execuções
antes/depois, persistência p95 ≤75 ms, restauração p95 ≤100 ms e delta de p95
para cold start/Home→Lição
`novo_p95 - baseline_p95 <= max(0,05 × baseline_p95, 50 ms)`.

## Onda 5 — Task 12 educacional: checkpoint e reforço adaptativo

### 5.1 Domínio

Implementar `CheckpointAttemptV1`, `ReinforcementPlanV1` e
`UnitCheckpointService` como serviços puros. A nota usa itens com peso igual,
limite inclusivo de 80%, item pulado incorreto e erro crítico não compensável.

### 5.2 Integração

Conectar tentativa imutável ao commit recuperável. O desbloqueio depende do
resultado, nunca de XP. Aprovação não promove competências em massa.

### 5.3 Reforço

Gerar somente competências frágeis. Primeiro ciclo usa explicação causal e
prática guiada; segundo muda modalidade, exige aplicação independente e nova
variante equivalente. Sequência obrigatória: tentativa inicial reprovada →
ciclo 1 → nova tentativa; se reprovar → ciclo 2 → outra nova tentativa. Somente
se essa terceira tentativa ainda não for aprovada, depois dos dois ciclos
completos, registrar `support-required`, manter dependências bloqueadas e
oferecer Revisão/Home.

### 5.4 Ativação controlada do agendador

Ativar leitura por competência apenas para conteúdo curricular v2. Competência
sintética `legacy:*` continua falhando fechada e não cria recomendação.

Testes: exatamente 80%, abaixo de 80%, erro crítico, item pulado, dica,
multicompetência, competência não crítica frágil, tentativa inicial/ciclo
1/reteste/ciclo 2/terceira tentativa, suporte somente depois dessa sequência e
reexecução idempotente.

**Gate da Onda 5:** checkpoint e reforço acessíveis, nenhum progresso apagado e
regressão legada integral.

## Onda 6 — Galáxia, produção editorial e Unidade 1

### 6.1 Galáxia canônica

Executar a Task 13: projetar nós e status a partir da jornada. Configuração
visual continua autoral; conteúdo e desbloqueio vêm da fonte canônica. Vidas não
bloqueiam lições.

### 6.2 Pipeline v2 e painel

Executar a Task 14 e evoluir `tools/editorial-panel/`:

- binding exclusivo em `127.0.0.1`;
- `ProductionBatchV1` e schemas;
- hash esperado, lock, temporário+rename;
- gates automáticos, clínicos, direitos, acessibilidade e promoção;
- invalidação por alteração material;
- biblioteca de promoção allowlisted, sem shell arbitrário;
- catálogo imutável, hashes, changelog e rollback.

### 6.3 Corte vertical

Executar a Task 15: Unidade 1 com 5 competências, 10–12 sessões, ao menos quatro
interações, checkpoint, reforços e recuperação posterior. Promoção só acontece
depois de todas as revisões humanas explícitas.

Testes: concorrência por hash, dupla promoção, gate ausente, alteração após
aprovação, proveniência por afirmação, promoção atômica, falha intermediária e
rollback para último catálogo aprovado.

**Gate da Onda 6:** Unidade 1 promovida integralmente e validada; promoção
parcial impossível.

## Onda 7 — Outbox local, beta, sync remoto opcional e expansão

### 7.1 Outbox e compatibilidade

Migrar gradualmente `pendingSyncEvents` e filas especializadas para outbox
genérica. Enquanto houver leitores antigos, escrita dupla deve ser idempotente e
comparada; remover legado somente depois de migração validada. Evento confirmado
sem ack não expira por idade. Remoção exige ack idempotente ou compactação
semântica determinística num fato/snapshot durável equivalente.

`OutboxEventV1.event` aceita somente `SyncEventV1`: tentativa confirmada,
evidência imutável por competência/item, review/jornada, ciclo de reforço e
support-required confirmados. Os dois últimos preservam plan/state ids e
relações source/follow-up. O `eventId`
existe uma vez no envelope e é preservado desde `PlannedSyncEventV1`.
`LocalCheckpointEventV1` é lifecycle/telemetria local e nunca entra nessa fila.

Testes obrigatórios: relaunch com outbox pendente, retry com mesmo `eventId`,
crash antes/depois do enqueue, ack perdido, escrita dupla, compactação semântica
byte-equivalente e ausência de perda depois de 30 dias simulados.

### 7.2 Beta pedagógico local/offline

Executar instrumentação sanitizada, VoiceOver/TalkBack, viewport curto e E2E em
iOS/Android Release com sync `off`. A fonte inicial de evidência é o artefato
local `beta-checkpoint-local-v1.jsonl`, formado exclusivamente por
`LocalCheckpointEventV1` e acompanhado de
evidência manual sanitizada; ele não contém respostas, PII, PHI ou caminhos.

Implementar
`scripts/checkpoints/validate-beta-checkpoint-local.mjs` e
`scripts/checkpoints/aggregate-beta-checkpoint-local.mjs`. A UI interna ou
harness exporta somente o sandbox para
`radiant-app/.maestro/artifacts/student-checkpoint-beta/<betaRunId>/`, com
manifest, audit de privacidade e aggregate. Deduplicar por `localEventId`;
conflito reprova. Denominador é checkpoint único com `restore_offered/direct`,
numerador é o `restore_succeeded` correspondente e fallback é reason-coded.

Medir denominador de ao menos 100 retomadas elegíveis, sucesso ≥99%, zero P0/P1 e zero incidente
de privacidade. Esse beta pode fechar e liberar expansão pedagógica sem API,
conta, conflito remoto ou sink de analytics.

### 7.3 Gate reproduzível de workload remoto

Tratar 10 mil alunos ativos como premissa a validar:

- 10.000 contas/dia × 40 eventos = 400.000 eventos/dia;
- pico de 1.000 contas e 100 requests/s por 15 minutos;
- batch médio 20, máximo 100, dois requests em voo por cliente;
- unicidade/index `(account_id,event_id)` e cursor
  `(account_id,server_sequence)`;
- até 20 tentativas por evento, backoff com jitter de 1 s a 6 h e backpressure
  em `429/5xx` sem descarte.

O harness versionado deve carregar 400 mil eventos, repetir duplicatas, simular
reconexão, sustentar o pico por 15 minutos e executar soak de 24 h. Gate: p95 de
ingestão ≤300 ms, p95 de projeção ≤500 ms, erro não controlado <0,1%, zero perda,
zero efeito duplicado e backlog drenado em ≤30 minutos. Publicar relatório
reproduzível com parâmetros, versão, ambiente e resultados.

### 7.4 API e sync remoto futuros

Adicionar atrás de flag e autenticação:

- `POST /v1/sync/events/batch` com 1–100 eventos;
- `GET /v1/sync/state?cursor` com projeção incremental.

Eventos repetidos devolvem sucesso idempotente. O endpoint aceita somente
`OutboxEventV1` cujo ramo aninhado é `SyncEventV1`; evento local é recusado.
Conclusões/evidências fazem união monotônica; domínio é recalculado. Cursor
incompleto não cruza aparelhos.
Evento anônimo só sai do aparelho depois de vínculo de conta e revisão das
declarações de privacidade. Além do gate de carga, produção exige API/auth,
conflitos e um **sink remoto verificado**: evento sintético allowlisted deve ser
aceito, consultável por id e reconciliado com o ack. Log local ou HTTP 2xx sem
consulta do sink não autoriza afirmação de observabilidade remota.

### 7.5 Expansão

Produzir unidades 2–6 somente após o gate da Unidade 1. Cada unidade é lote
independente e pode adicionar no máximo um novo tipo de interação quando houver
necessidade pedagógica demonstrada.

**Gate da Onda 7:** beta local aprovado antes da expansão. Carga, API,
autenticação, conflitos, idempotência e sink remoto verificado bloqueiam somente
o sync remoto; não bloqueiam estudo offline nem o beta pedagógico local.

## Matriz de rollback

| Falha | Ação imediata | Estado preservado |
| --- | --- | --- |
| divergência shadow | manter produção `off`; desabilitar shadow | todo estado legado |
| payload proibido | `off`, quarentena, incidente de privacidade | fatos pedagógicos confirmados |
| crash loop/restauração | remover superfície da allowlist ou `off` | stores e progresso |
| duplicação de efeito | `off`, bloquear rollout e auditar `operationId` | evidência original |
| catálogo v2 inválido | rollback para último manifesto aprovado | catálogo anterior |
| API/sync indisponível | desligar sync; usar outbox local | estudo offline |

## Critério final de conclusão

Este plano só está concluído quando as sete ondas fecharam, a documentação foi
reconciliada com evidência atual e uma autorização específica permitiu o
rollout. O status de Onda 1 não pode ser usado para afirmar que kernel, Task 12 educacional,
painel, endpoints ou sync já existem.
