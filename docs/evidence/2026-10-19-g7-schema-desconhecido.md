# G7 — schema desconhecido nas stores de aprendizagem e economia — 2026-10-19

**Medido em:** 2026-10-19, à tarde (America/Bahia).
**Autoria:** Claude (Opus 5.5), na worktree `claude/g7-schema-desconhecido`, a
partir da `main` em `7726296`. Run do Loop `run-1792430821117-6fdea6d0`.
**Regra:** a da [ADR de 2026-10-19](../adr/ADR-2026-10-19-recuperacao-local-backup-schema-e-reset.md),
decidida por Anderson para a jornada: uma versão antiga do app não grava por
cima de um store com `schemaVersion` que ela não conhece. Esta frente a estende
às outras stores das classes `aprendizagem` e `economia` de
[`storageInventory.ts`](../../radiant-app/src/storage/storageInventory.ts).

Marcação: **[medido]** foi executado e visto; **[código]** foi lido no código, sem
execução; **[não verificado]** ficou de fora, com o motivo.

## Como a tabela foi montada

**[código]** Para cada chave, a busca partiu do texto da chave, passou pela
constante que a nomeia e chegou a **todo** `setItem` e `removeItem` sobre ela,
fora de testes e fixtures. O dono da escrita é quem grava. Um leitor que nunca
grava não entra. Duas linhas que a frente anterior dava como lidas foram
refeitas por esse caminho e estavam erradas (ver [Errata](#errata)).

"Schema desconhecido" é um store que declara `schemaVersion` com um valor que
esta versão do app não lista. Store sem `schemaVersion`, ou que nem é objeto,
continua tratado como cada store sempre o tratou.

## A tabela

Aprendizagem, 17 chaves:

| Chave | Dono da escrita | `schemaVersion` | Antes, diante de um desconhecido | Agora |
| --- | --- | --- | --- | --- |
| `@radiant:journey_progress_v1` | `JourneyProgressService` | `journey-progress.v1`, `v2` | recusa, desde a ADR | igual |
| ″ | `LocalProgressAdapter.applyJourney` (mescla do backup do iCloud) | ″ | **gravava dentro**: mesclava os nós concluídos no store desconhecido, por fora da guarda da jornada | recusa |
| `@radiant:curriculum_runtime_v1` | `CurriculumMigration` | `curriculum-runtime.v1` | preserva: `bootstrap` só grava com a chave ausente, e `prepareV3` lança `CURRICULUM_RUNTIME_INVALID` | igual |
| `@radiant:v3:journey_progress_v1`, `v3:learning_attempts_v1`, `v3:learning_evidence_v1`, `v3:competency_mastery_v1` | nenhum: só a constante em `storageKeys.ts` | — | nada grava | igual |
| `@radiant:learning_attempts_v1` | `LearningAttemptsRepository` | `learning-attempts.v1` | **gravava por cima**: lia o array de qualquer versão e regravava como `v1`, sem os campos novos | recusa, sem lançar |
| `@radiant:learning_evidence_v1` | `LearningEvidenceRepository` | `learning-evidence.v1` | recusa: `evidence-store-unavailable`, `append` devolve `accepted: false` | igual |
| `@radiant:item_review_v1` | `ItemReviewRepository` | `item-review.v1` | recusa: `item-review-store-unavailable` (R6) | igual |
| `@radiant:competency_mastery_v1` | `CompetencyMasteryRepository` | `competency-mastery.v1` | **gravava por cima**, como as tentativas | recusa, sem lançar |
| `@radiant:competency_review_v1` | `CompetencyReviewService` | `1` (número) | número maior: recusa no `saveStore`. Outro valor: quarentena com a string crua inteira | igual |
| `@radiant:assessment_attempts_v1` | `AssessmentAttemptRepository` | `1` | recusa: `assessment-history-invalid` | igual |
| `@radiant:student_checkpoints_active_v1`, `…_shadow_v1` | `CheckpointStore` | `1` | **apagava**: punha só a marca `future-schema` na quarentena, sem o dado, e removia o store. A escrita seguinte gravava um envelope novo | o store fica byte a byte; a marca vai para a quarentena; a leitura devolve vazio; toda escrita lança `checkpoint-store-future-schema` |
| `@radiant:student_checkpoint_outbox_v1` | `OutboxStore` | `1` | recusa: `outbox-store-quarantined`, store intacto | igual |
| `@radiant:student_checkpoint_authority_v1:` (prefixo) | `AuthorityStore` | `1` | recusa: `authority-store-quarantined`, store intacto | igual |
| `@radiant:sr_schedule_v1` | `SpacedRepetitionService`, `LocalProgressAdapter.applySchedule` | **nenhum** | — | proposta ao dono |

Economia, 5 chaves:

| Chave | Dono da escrita | `schemaVersion` | Antes, diante de um desconhecido | Agora |
| --- | --- | --- | --- | --- |
| `radiant:gami:v1` | `GamificationService` | **nenhum** | — | proposta ao dono |
| `radiant:daily-goal:v1` | `DailyGoalService` | **nenhum** | — | proposta ao dono |
| `@radiant:hearts_v1` | `HeartsRepository`, `StorageMigration`, `LocalProgressAdapter.applyHearts` | **nenhum** | — | proposta ao dono |
| `@radiant:checkpoint_charged_items_v1` | `CheckpointChargeLedger` | **nenhum** | — | proposta ao dono |
| `@radiant:subscription_v1` | `SubscriptionService` | `1` | **gravava por cima**: a releitura da loja e a compra regravavam `v1` | recusa; o direito lido vale em memória nesta abertura |

E um marcador de controle que escreve nas vidas:

| Chave | Dono da escrita | Valor | Antes, diante de um desconhecido | Agora |
| --- | --- | --- | --- | --- |
| `@radiant:app_schema_version` | `StorageMigration` (1.4) | `1.4` | **refazia a migração por cima**: só pulava com `1.4`; com o marcador de uma versão mais nova, zerava as vidas e rebaixava o marcador para `1.4` | qualquer marcador presente devolve `unchanged`, sem escrita. A chave não existia antes da 1.4 (ausente da `v1.3.1`; nasceu em `325c4e8`) |

Resumo: das 22 chaves, 8 já recusavam ou preservavam, 4 não têm escritor, 5 não
têm `schemaVersion` e 5 gravavam por cima ou apagavam (tentativas, domínio, os
dois checkpoints e a assinatura). Somam-se a elas o `LocalProgressAdapter`,
segundo escritor da jornada, e o marcador da migração.

## O conserto

**[código]** A regra mora num lugar só,
[`schemaVersionGuard.ts`](../../radiant-app/src/storage/schemaVersionGuard.ts):
`hasUnknownSchemaVersion` e `rawHasUnknownSchemaVersion`, esta para a string crua
do AsyncStorage. As versões que a jornada conhece saíram do serviço para
`KNOWN_JOURNEY_PROGRESS_SCHEMA_VERSIONS`, em `src/types/journey.ts`. Assim a
mescla do backup e o serviço não podem divergir quando houver uma `v3`.

Cada escritor relê o que está gravado imediatamente antes de escrever, como a
jornada já fazia. Tentativas, domínio e assinatura recusam em silêncio, com um
aviso no log, porque são best-effort e a tela não pode cair. O checkpoint
lança, como a autoridade e a outbox já faziam. O journal de commit é a guarda
de idempotência do XP, e fingir que gravou repetiria o efeito.

## Os vermelhos

**[medido]** Os testes novos rodaram contra o código antigo, na `7726296`, com
só os arquivos de teste alterados
([vermelhos.txt](2026-10-19-g7-schema-desconhecido/vermelhos.txt)): **8 falhas
em 96 testes, uma por defeito, e só essas**. Cada falha mostra o defeito
nomeado, e não um vizinho:

| Teste | O que o código antigo fez |
| --- | --- |
| tentativas: "não grava por cima…" | gravou `learning-attempts.v1` sem o campo `porLicao` |
| domínio: "não grava por cima…" | uma chamada de `setItem` onde se esperavam zero |
| assinatura: "a releitura da loja…" e "a compra confirmada…" | gravou `{"schemaVersion":1,…}` sobre o `2` |
| checkpoint ativo e sombra: "keeps the … store byte for byte…" | a chave voltou `undefined`: o store foi apagado |
| backup: "não grava na jornada…" | os nós `["n1"]` viraram `["n1","n2"]` dentro do `journey-progress.v3` |
| migração: "não escreve nem apaga nada…" | as vidas do aluno, `count: 2`, viraram as 5 iniciais |

Cada arquivo tem também um teste de **validade**, que passou antes e depois. Store
sem `schemaVersion` segue regravado no schema atual. A releitura da loja e a
compra ainda liberam as vidas ilimitadas. O resto da mescla do backup segue
aplicado. A instalação 1.3.1, sem marcador, segue migrando.

Um ajuste num teste existente: o `semear()` do `LocalProgressAdapter.test.ts`
gravava a jornada com `schemaVersion: '1'`, que nenhuma versão do app grava.
Com a guarda, esse store passa a ser desconhecido, e o próprio
`JourneyProgressService` já não escrevia nele desde a ADR. O fixture agora usa
`JOURNEY_PROGRESS_SCHEMA_VERSION`. A troca entrou junto com os testes novos,
antes do conserto, e aparece verde no vermelho.

**[medido] Verde** com o conserto
([verde.txt](2026-10-19-g7-schema-desconhecido/verde.txt)): os mesmos arquivos e
o teste do módulo da regra, 7 suítes, 102 testes.

## As stores sem `schemaVersion`: proposta ao dono

Não inventei formato. As cinco são a agenda SM-2, a gamificação, a meta diária,
as vidas e o ledger de cobrança. **[código]** O que a 1.4 faz hoje se uma versão
futura mudar o formato de uma delas:

| Store | O que a 1.4 faria com um formato novo |
| --- | --- |
| agenda SM-2 (`@radiant:sr_schedule_v1`) | lê o JSON como está e regrava o objeto inteiro, com campos novos, mas mexe em `cards` e `reviewHistory` como se fossem os de hoje |
| gamificação (`radiant:gami:v1`) | espalha o JSON lido sobre o padrão, então campos novos sobrevivem; XP e sequência são reescritos pela regra de hoje |
| meta diária (`radiant:daily-goal:v1`) | regrava só os quatro campos que conhece, e o resto some |
| vidas (`@radiant:hearts_v1`) | exige exatamente três campos; com qualquer campo a mais, lê como inválido e grava 5 vidas por cima |
| ledger de cobrança (`@radiant:checkpoint_charged_items_v1`) | é um mapa de nó para lista de ids; descarta toda entrada que não seja lista de strings |

Nenhuma delas tem, hoje, como dizer "sou de outra versão". As duas saídas, para o
dono escolher:
1. **Ler `schemaVersion` sem mudar o formato.** A próxima build passa a recusar
   escrita quando encontrar um `schemaVersion` que não conhece, e continua
   gravando o formato atual. Quem estiver nessa build fica protegido no dia em
   que uma versão futura versionar a store. A 1.4 publicada continua sem
   proteção, por construção.
2. **Deixar como está** até a primeira mudança de formato de cada uma, e decidir
   ali, com a 1.4 ainda em uso.

Recomendo a 1 para as vidas e a meta diária, que perdem dado com campo novo, e a
2 para as outras três, que regravam o objeto preservado ou são descartáveis por
desenho (o ledger vive só durante uma tentativa).

## Errata

Duas afirmações das evidências anteriores estavam erradas, e os dois erros
eram justamente defeitos desta frente:
- a [evidência da FILA 54](2026-10-19-fila54-g4-android-g7.md) dizia que o
  checkpoint com schema futuro ficava "preservado na chave de quarentena". A
  quarentena recebe só a marca, sem o dado, de propósito (o teste existente
  exige que o conteúdo recusado não seja copiado), e o store era removido;
- a [evidência das decisões](2026-10-19-g7-decisoes-de-recuperacao.md) dizia que
  toda escrita da jornada passa pelo `writeStore`. A mescla do backup do iCloud
  grava a mesma chave direto, pelo `LocalProgressAdapter`.

As duas receberam nota de errata no lugar.

## Fora desta frente

- **[código]** O `CheckpointStore` continua removendo o store **corrompido** ou
  **inválido** sem guardar o cru, e a autoridade e a outbox só marcam. É a
  postura de privacidade de propósito, e não é schema desconhecido.
- **[não verificado]** Nada foi ensaiado numa volta de versão real, com duas
  builds no mesmo aparelho. A prova é a dos testes de unidade.

## Merge com a `main` e com a PR aberta

**[medido]** ([merge-tree.log](2026-10-19-g7-schema-desconhecido/merge-tree.log))
Durante o run, a `main` recebeu a #59 (G6, `2415de5`). A simulação deu conflito
em `docs/FILA.md` e `docs/archive/FILA_concluidos.md`, só de documentação. A #59
também tinha reescrito a lista "Próximo" da FILA 54 e acrescentado ao fim do
histórico. A `main` entrou na branch por merge, num segundo run
(`run-1792431612850-d9f75c02`), com esta resolução:
- o "Próximo" da FILA 54 aponta para a lista nova, e a linha do G6 da #59 entrou
  nela sem edição;
- no histórico ficam as duas entradas: a da #59 e a desta frente, que agora
  arquiva o "Próximo" da `main`, com a linha do G6.

A única PR aberta, a #60 (`61f086a`, documentação de estado), conflita com a
árvore integrada nos mesmos dois arquivos. Ela reescreve a mesma linha
"Próximo" (o item do `motion.ts`) e acrescenta ao fim do mesmo histórico. Quem
entrar em segundo resolve: manter a lista nova desta frente, que já registra o
`motion.ts` como integrado, e as entradas de histórico das duas.

A #60 entrou primeiro (`a411ba7`), e a resolução seguiu esse desenho num
terceiro run (`run-1792447152319-121eead0`). O "Próximo" da FILA 54 aponta para
a lista nova. No histórico ficam a entrada da #60 e a desta frente, que arquiva
o "Próximo" como a #60 o deixou.

## Gates

**[medido]** `EXPO_NO_DOTENV=1 npm run quality` no Node 20.20.2, nesta worktree,
com todas as mudanças de código
([log](2026-10-19-g7-schema-desconhecido/quality.log), `exit=0`): 179 suítes e
1.832 testes do Jest, todos os contratos verdes e o visual QA com 0 regressões.
São 1.811 testes da `main` mais os 21 desta frente. O `loop validate` do
`run-1792430821117-6fdea6d0` passou 15/15. Na árvore integrada com a #59, o
gate é o `app-quality` do `loop validate` do `run-1792431612850-d9f75c02`, que
fica no envelope do run.
