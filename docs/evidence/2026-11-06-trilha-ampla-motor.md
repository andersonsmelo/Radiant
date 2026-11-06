# Trilha ampla: motor da frente A (contrato, gerador e trilha)

**Medido em 2026-11-05, 23:15 (America/Bahia), na worktree `trilha-2026-10-20`, branch
`claude/conteudo-reinicio-tecnologo`, com a árvore suja pelo trabalho das frentes C e D.**
Node v20.20.2 em todos os comandos abaixo. Autor: Claude (Fable 5.1), como subagente da
frente A do [plano](../plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md), sob a
[ADR da delegação](../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md).

Os números desta página foram medidos com as unidades presentes em
`content-manifest/rtg-2026/aulas/` naquele momento: m01, m02, m03, m05, m06, m07.
Eles mudam a cada unidade que chega; os testes não os fixam, derivam das aulas-fonte.

## O que foi construído

- **Verificador de forma** `scripts/content/rtg-lesson-lint.mjs`: porte do verificador de
  autoria, exporta `lintUnit(doc): string[]` e roda como linha de comando. Duas regras a mais
  que a cópia de autoria, ambas para o autor ver antes o que o app reprovaria depois: a
  conferência da unidade precisa usar as quatro posições de resposta (régua do contrato,
  `checkpoint-answer-position-bias`), e texto do aluno não pode ser todo em caixa alta (régua
  do `copy-style-contract`).
- **Contrato amplo** `EditorialWideContract.ts`, ligado a `EditorialBatchContract.ts`: de 3 a 8
  interações, quatro famílias, fonte com `use`, par de recuperação por competência. O candidato
  amplo tem tipo próprio (`EditorialWideCandidateV1`); o tipo do contrato v1 não mudou de forma.
- **Tipos de runtime**: `validateLearningActivity` passou a conferir `dialogue` (falante do
  elenco, fala preenchida, nome obrigatório para `paciente`), `keyPoints` e `help`.
- **Fábrica** `batches/rtgBatchFactory.ts` (módulo puro; o app não a importa) e **gerador**
  `scripts/content/build-rtg-batches.mjs`, com `--check`.
- **Lotes gerados** em `radiant-app/src/features/student-checkpoints/batches/`, com `index.ts` e
  `entries.ts`; `production-batches.ts` e `production-catalog-entries.ts` passaram a ler dali.
- **Cobertura estrutural**: `ProductionCurriculumCoverage.ts` liga as afirmações das quatro
  famílias, das apresentações e dos itens de recuperação (`promotedRecoveryItems`).
- **Catálogo**: `getRecoveryByCheckpointNodeId(nodeId)` em `createProductionCurriculumCatalog.ts`.
- **Testes de vazio viraram testes de consistência**: `ContentRetirement.test.ts`,
  `TrailCoverage.test.ts` e `JourneyCatalogReachability.test.ts` comparam o catálogo com uma
  leitura direta das aulas-fonte. `check-pilot-payloads.mjs` deixou de exigir catálogo vazio e
  passou a exigir que nele só haja lote amplo da trilha, nunca o piloto.
- **CI**: `content-scripts.yml` roda `build-rtg-batches.mjs --check`; os dois testes novos entram
  no passo de testes pelo padrão de nome.

## Como os itens de recuperação chegam ao aluno

Chegam ao lote e ao catálogo; **ainda não chegam à tela**.

O que o app faz hoje depois de uma conferência reprovada, sem mudança nesta frente:
`AssessmentAttemptRepository` bloqueia nova tentativa até o aluno refazer a atividade da
competência frágil, e `CheckpointScreen` leva a ela. Com uma atividade por competência, isso é
refazer a aula inteira, com as ajudas. O teste "conferência reprovada numa unidade ampla"
(`RtgCatalog.test.ts`) mede esse caminho com a unidade de teste.

Os itens `recovery.guided` e `recovery.transfer` ficam em `wide.recovery`, com identidade e
proveniência conferidas pelo contrato e cobertas pelo hash dos aceites, e o catálogo os entrega
por nó de conferência. Para a revisão servi-los faltam duas mudanças, em arquivos fora da lista
desta frente:

1. `features/spaced-repetition/services/ItemReviewService.ts`, em `catalog.definitions`: no ramo
   do nó de conferência, acrescentar às definições os dois itens de
   `ProductionCurriculumCatalog.getRecoveryByCheckpointNodeId(lessonId)`, com
   `evidenceKind` `guided-practice` e `applied-transfer`.
2. `features/student-checkpoints/AssessmentAttemptRepository.ts`, em `submit`: quando a tentativa
   reprova, semear cartões vencidos na hora para esses itens (o repositório de revisão já tem
   `seedLegacyGroups`, que cria cartão sem tentativa).

A alternativa de transformar a recuperação numa segunda atividade do lote foi descartada: toda
atividade vira nó de aula na trilha, e `CheckpointScreen` abre o reforço com
`nodeId: node:<atividade>`, que precisaria existir.

## Execuções vermelhas

Regra do repositório: toda asserção nova é vista falhando com o defeito que nomeia. Em duas
asserções o vermelho foi natural; nas demais a implementação veio antes do teste, e o vermelho
foi produzido depois, por injeção: um defeito por vez, com âncora única no arquivo (contagem
exigida igual a 1), o teste que nomeia o defeito, e o arquivo restaurado e conferido byte a
byte em seguida. O roteiro das injeções ficou fora do repositório.

### Vermelhos naturais

**N1. Arquivos gerados ausentes.** Antes da primeira geração,
`node scripts/content/build-rtg-batches.mjs --check`:

```text
rtg-generated-stale: rode node scripts/content/build-rtg-batches.mjs
  - index.ts (ausente)
  - entries.ts (ausente)
exit=1
```

**N2. Índice defasado.** Com `m01`, `m02`, `m03` e `m07` recém-chegados a `content-manifest` e
o índice ainda vazio, `npx jest src/features/student-checkpoints/batches/RtgCatalog.test.ts -t "índice gerado"`:

```text
✕ tem um lote por aula-fonte, na ordem da trilha, com as mesmas contagens da leitura direta (2 ms)
    ✕ cada lote gerado passa na mesma validação do lote promovido e tem apresentação
    ✕ o catálogo de produção é exatamente o índice gerado, uma trilha por unidade (1 ms)
    ✕ o gerador confirma que os arquivos versionados estão em dia (197 ms)
    - Expected  - 6
    + Received  + 1
    - Array [
    -   "batch:rtg-2026:m01",
    -   "batch:rtg-2026:m02",
    -   "batch:rtg-2026:m03",
    -   "batch:rtg-2026:m07",
    + Array []
    > 41 |         expect(RTG_2026_BATCHES.map(batch => batch.batchId)).toEqual(sources.map(source => `batch:rtg-2026:${source.unit.id}`));
    - Expected  - 4
    + Received  + 4
      Array [
    > 63 |         expect(sources.map(source => RTG_2026_PRESENTATIONS[`batch:rtg-2026:${source.unit.id}`]?.title)).toEqual(sources.map(source => source.unit.title));
    - Expected  - 6
    + Received  + 1
    - Array [
    -   "batch:rtg-2026:m01",
    -   "batch:rtg-2026:m02",
    -   "batch:rtg-2026:m03",
    -   "batch:rtg-2026:m07",
    + Array []
    > 70 |         expect(PRODUCTION_CATALOG_ENTRIES.map((entry: ProductionCatalogEntry) => entry.batch.batchId)).toEqual(sources.map(source => `batch:rtg-2026:${source.unit.id}`));
Tests:       4 failed, 2 skipped, 6 total
```

### Vermelhos por injeção

**A1. Paciente sem nome aceito pelo validador.** Arquivo `radiant-app/src/types/learningActivity.ts`.

- trecho `&& (line.speaker !== 'paciente' || isFilled(line.name)));` trocado por `);`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t paciente sem nome`

```text
✕ recusa paciente sem nome, e aceita o mesmo paciente com nome (2 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 1
    - Array [
    -   "step:rtg-2026:m01:aula-01:abertura|invalid-dialogue",
    - ]
    + Array []
      154 |         expect(line.name).toBe('Dona Marta');
      155 |         delete line.name;
    > 156 |         expect(rules(activity)).toEqual([`${hookId}|invalid-dialogue`]);
          |                                 ^
      157 |         line.name = 'Seu Jorge';
```

**A2. Falante fora do elenco aceito.** Arquivo `radiant-app/src/types/learningActivity.ts`.

- trecho `&& (LESSON_CAST_IDS as readonly unknown[]).includes(line.speaker)` trocado por `&& true`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t falante fora do elenco`

```text
✕ recusa falante fora do elenco (2 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 1
    - Array [
    -   "step:rtg-2026:m01:aula-01:abertura|invalid-dialogue",
    - ]
    + Array []
      137 |         const activity = copy();
      138 |         (hookOf(activity).lines[0] as { speaker: string }).speaker = 'narrador';
    > 139 |         expect(rules(activity)).toEqual([`${hookId}|invalid-dialogue`]);
          |                                 ^
      140 |     });
```

**A3. Pontos-chave vazios aceitos.** Arquivo `radiant-app/src/types/learningActivity.ts`.

- trecho `keyPoints.length === 0 || !keyPoints.every(isFilled)` trocado por `false`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t pontos-chave`

```text
✕ recusa pontos-chave vazios ou em branco (1 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 1
    - Array [
    -   "step:rtg-2026:m01:aula-01:conceito|invalid-key-points",
    - ]
    + Array []
      165 |             if (step.kind !== 'presentation') throw new Error('conceito fora de lugar');
      166 |             step.payload.keyPoints = keyPoints;
    > 167 |             expect(rules(activity)).toEqual([`${conceptId}|invalid-key-points`]);
          |                                     ^
      168 |         }
```

**A4. Ajuda em branco aceita.** Arquivo `radiant-app/src/types/learningActivity.ts`.

- trecho `if (interaction.help !== undefined && !isFilled(interaction.help)) {` trocado por `if (false) {`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t ajuda em branco`

```text
✕ recusa ajuda em branco (2 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 1
    - Array [
    -   "interaction:rtg-2026:m01:aula-01:i1|invalid-help",
    - ]
    + Array []
      173 |         const interaction = interactionsOf(activity.steps)[0];
      174 |         interaction.help = '  ';
    > 175 |         expect(rules(activity)).toEqual([`${interaction.id}|invalid-help`]);
          |                                 ^
      176 |     });
```

**A5. Nove interações aceitas pelo validador de atividade.** Arquivo `radiant-app/src/types/learningActivity.ts`.

- trecho `const MAX_INTERACTIONS = 8;` trocado por `const MAX_INTERACTIONS = 9;`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t limites novos`

```text
✕ os limites novos valem: doze passos e oito interações passam, treze e nove não (3 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 1
    - Array [
    -   "activity:rtg-2026:m01:aula-01|invalid-interaction-count",
    - ]
    + Array []
      189 |         const nine = copy();
      190 |         nine.steps.splice(7, 0, extra(1), extra(2), extra(3), extra(4));
    > 191 |         expect(rules(nine)).toEqual([`${nine.id}|invalid-interaction-count`]);
          |                             ^
      192 |         const thirteen = copy();
```

**B1. Contrato amplo aceita nove interações.** Arquivo `radiant-app/src/features/student-checkpoints/EditorialWideContract.ts`.

- trecho `if (interactions.length < WIDE_MIN_INTERACTIONS || interactions.length > WIDE_MAX_INTERACTIONS) add(` trocado por `if (false) add(`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/EditorialWideContract.test.ts -t recusa nove`

```text
✕ recusa nove interações e também duas (3 ms)
    expect(received).toContain(expected) // indexOf
    Expected value: "invalid-wide-interaction-count:activity:rtg-2026:m01:aula-01"
    Received array: ["invalid-activity:activity:rtg-2026:m01:aula-01", "missing-claim-provenance:interaction:rtg-2026:m01:aula-01:extra-1:prompt", "missing-claim-provenance:option:rtg-2026:m01:aula-01:extra-1:0", "missing-claim-pr
      63 |             expect(interactionsOf(steps as LearningStepV2[])).toHaveLength(9);
      64 |         });
    > 65 |         expect(nine).toContain(`invalid-wide-interaction-count:${ACTIVITY}`);
         |                      ^
      66 |         const two = issuesAfter(value => {
      67 |             const steps = value.activities[0].steps;
      68 |             const kept = steps.filter(step => step.kind === 'interaction').slice(0, 2);
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

**B2. Contrato amplo aceita hotspot.** Arquivo `radiant-app/src/features/student-checkpoints/EditorialWideContract.ts`.

- trecho `export const WIDE_ACTIVITY_FAMILIES = ['multiple-choice', 'case-decision', 'ordering', 'matching'] as const;` trocado por `export const WIDE_ACTIVITY_FAMILIES = ['multiple-choice', 'case-decision', 'ordering', 'matching', 'hotspot'] as const;`
- trecho `matching: ['prompt', 'pairs'],` trocado por `matching: ['prompt', 'pairs'],
    hotspot: ['prompt', 'imageRef', 'regions', 'correctRegionIds'],`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/EditorialWideContract.test.ts -t hotspot`

```text
✕ recusa `hotspot`, que depende de ativo que esta etapa não tem (3 ms)
    expect(received).toContain(expected) // indexOf
    Expected value: "unsupported-activity-family:activity:rtg-2026:m01:aula-01"
    Received array: ["orphan-claim:item:rtg-2026:m01:aula-01:i2:3", "orphan-claim:item:rtg-2026:m01:aula-01:i2:1", "orphan-claim:item:rtg-2026:m01:aula-01:i2:2", "orphan-claim:item:rtg-2026:m01:aula-01:i2:4"]
      84 |             };
      85 |         });
    > 86 |         expect(issues).toContain(`unsupported-activity-family:${ACTIVITY}`);
         |                        ^
      87 |     });
      88 |
      89 |     it('recusa fonte sem `use`, com `use` fora da lista e com hash de corpo recuperado', () => {
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

**B3. Fonte sem use aceita.** Arquivo `radiant-app/src/features/student-checkpoints/EditorialWideContract.ts`.

- trecho `|| (source.use !== 'cc-by-4.0' && source.use !== 'factual-reference')) add(` trocado por `) add(`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/EditorialWideContract.test.ts -t fonte sem`

```text
✕ recusa fonte sem `use`, com `use` fora da lista e com hash de corpo recuperado (3 ms)
    expect(received).toContain(expected) // indexOf
    Expected value: "invalid-source-metadata:source:rtg-2026:m01:guia-de-estudo"
    Received array: []
      89 |     it('recusa fonte sem `use`, com `use` fora da lista e com hash de corpo recuperado', () => {
      90 |         const id = batch.sources[0].id;
    > 91 |         expect(issuesAfter(value => { delete (value.sources[0] as { use?: string }).use; })).toContain(`invalid-source-metadata:${id}`);
         |                                                                                              ^
      92 |         expect(issuesAfter(value => { (value.sources[0] as { use: string }).use = 'cc-by-nc-4.0'; })).toContain(`invalid-source-metadata:${id}`);
      93 |         expect(issuesAfter(value => { (value.sources[0] as Record<string, unknown>).retrievedMaterialSha256 = 'a'.repeat(64); }))
      94 |             .toContain(`invalid-source-metadata:${id}`);
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

**B4. Competência sem par de recuperação aceita.** Arquivo `radiant-app/src/features/student-checkpoints/EditorialWideContract.ts`.

- trecho `if (entries.length !== 1) add('missing-wide-recovery', id);` trocado por `if (false) add('missing-wide-recovery', id);`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/EditorialWideContract.test.ts -t par de recuperação`

```text
✕ exige um par de recuperação por competência, com proveniência por afirmação (4 ms)
    expect(received).toContain(expected) // indexOf
    Expected value: "missing-wide-recovery:competency:rtg-2026:m01:aula-01"
    Received array: ["orphan-claim:recovery-item:rtg-2026:m01:aula-01:guiada:prompt", "orphan-claim:option:rtg-2026:m01:aula-01:rg:a", "orphan-claim:option:rtg-2026:m01:aula-01:rg:b", "orphan-claim:option:rtg-2026:m01:aula-01:rg:c
      108 |     it('exige um par de recuperação por competência, com proveniência por afirmação', () => {
      109 |         const competency = batch.competencyIds[0];
    > 110 |         expect(issuesAfter(value => { value.wide!.recovery.shift(); })).toContain(`missing-wide-recovery:${competency}`);
          |                                                                         ^
      111 |         expect(issuesAfter(value => { value.wide!.recovery[0].guided.sourceIds = []; })).toContain(`invalid-wide-recovery:${competency}`);
      112 |         const guided = batch.wide!.recovery[0].guided;
      113 |         expect(issuesAfter(value => { value.claimProvenance = value.claimProvenance.filter(claim => claim.claimId !== `${guided.id}:prompt`); }))
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

**C1. Ordenação entregue na ordem correta.** Arquivo `radiant-app/src/features/student-checkpoints/batches/rtgBatchFactory.ts`.

- trecho `items: seededDisplayOrder(items, interactionId), correctOrder` trocado por `items, correctOrder`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t embaralhada`

```text
✕ a ordenação chega embaralhada, sem perder nem repetir item, e a resposta é a ordem da aula-fonte (2 ms)
    expect(received).not.toEqual(expected) // deep equality
    Expected: not ["item:rtg-2026:m01:aula-01:i2:1", "item:rtg-2026:m01:aula-01:i2:2", "item:rtg-2026:m01:aula-01:i2:3", "item:rtg-2026:m01:aula-01:i2:4"]
      61 |             const shown = ordering.payload.items.map(item => item.id);
      62 |             expect(ordering.payload.correctOrder.map(id => labelOf.get(id))).toEqual(authored.items);
    > 63 |             expect(shown).not.toEqual(ordering.payload.correctOrder);
         |                               ^
      64 |             expect([...shown].sort()).toEqual([...ordering.payload.correctOrder].sort());
      65 |         }
      66 |         // A ordem depende só da semente e nunca é a original, nem no menor caso.
Test Suites: 1 failed, 1 total
Tests:       1 failed, 14 skipped, 15 total
Snapshots:   0 total
```

**C2. Aceite registrado com papel que não é o da ADR.** Arquivo `radiant-app/src/features/student-checkpoints/batches/rtgBatchFactory.ts`.

- trecho `reviewerRole: 'ai-review-delegated',` trocado por `reviewerRole: 'human-review',`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t seis aceites`

```text
✕ registra os seis aceites como revisão por IA sob a ADR, presos ao hash do material (2 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
      Object {
        "decidedAt": "2026-11-06T00:00:00.000Z",
        "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
    -   "reviewerRole": "ai-review-delegated",
    +   "reviewerRole": "human-review",
      }
      76 |
      77 |     it('registra os seis aceites como revisão por IA sob a ADR, presos ao hash do material', () => {
    > 78 |         expect(RTG_REVIEW).toEqual({ reviewerRole: 'ai-review-delegated', reviewerRef: 'claude-fable-5.1:ADR-2026-11-05', decidedAt: '2026-11-06T00:00:00.000Z' });
```

**C3. Ajuda da aula-fonte não chega à interação.** Arquivo `radiant-app/src/features/student-checkpoints/batches/rtgBatchFactory.ts`.

- trecho `}, help: source.help,` trocado por `},`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t cada aula vira`

```text
✕ cada aula vira uma atividade: cena, conceito, cinco interações com ajuda e fecho (3 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 5
    + Received  + 5
      Array [
    -   "Pense no que evita retrabalho com a ficha.",
    -   "Comece pelo passo que não depende de nenhum outro.",
    -   "Leia o que cada passo faz antes de ligar as colunas.",
    -   "Divergência não se resolve sozinho nem em silêncio.",
    -   "Leve para a turma nova o mesmo cuidado com a ficha.",
    +   undefined,
    +   undefined,
    +   undefined,
```

**C4. Cena de abertura não chega à apresentação.** Arquivo `radiant-app/src/features/student-checkpoints/batches/rtgBatchFactory.ts`.

- trecho `dialogue: { setting: lesson.scene.setting, lines: lesson.scene.lines },` trocado por `(removido)`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/rtgBatchFactory.test.ts -t cada aula vira`

```text
✕ cada aula vira uma atividade: cena, conceito, cinco interações com ajuda e fecho (3 ms)
    expect(received).toMatchObject(expected)
    - Expected  - 18
    + Received  +  0
      Object {
        "body": "Hoje você vai conseguir organizar fichas de estudo em uma sessão curta de estudo.",
    -   "dialogue": Object {
    -     "lines": Array [
    -       Object {
    -         "speaker": "duda",
    -         "text": "Eu nunca sei por onde começar com a ficha.",
    -       },
    -       Object {
```

**D1. Catálogo não expõe a recuperação da conferência.** Arquivo `radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts`.

- trecho `=> recoveries.get(id) ?? null,` trocado por `=> null,`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/RtgCatalog.test.ts -t conferência reprovada`

```text
✕ bloqueia nova tentativa até refazer a aula da competência, e expõe os itens de recuperação dela (15 ms)
    TypeError: Cannot read properties of null (reading 'competencyId')
      142 |
      143 |         const recovery = ProductionCurriculumCatalog.getRecoveryByCheckpointNodeId(nodeId)!;
    > 144 |         expect(evaluation.attempt.weakCompetencyIds).toContain(recovery.competencyId);
          |                                                                         ^
      145 |         const checkpointIds = checkpoint.items.map(item => item.id);
      146 |         expect([recovery.guided.id, recovery.transfer.id].some(id => checkpointIds.includes(id))).toBe(false);
      147 |         expect(recovery.guided.prompt).not.toBe(recovery.transfer.prompt);
Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 skipped, 6 total
Snapshots:   0 total
Time:        0.644 s, estimated 1 s
```

**D2. Trilha nova não aparece (tela vazia) para o aluno antigo.** Arquivo `radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts`.

- trecho `listTracks: (): LearningTrack[] => [...tracks],` trocado por `listTracks: (): LearningTrack[] => [],`

Comando, em `radiant-app`: `npx jest src/features/student-checkpoints/batches/RtgCatalog.test.ts -t aula retirada`

```text
✕ com progresso de aula retirada gravado, a trilha nova aparece aberta e o ponto antigo aciona o aviso (5 ms)
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 1
    - Array [
    -   "track:rtg-2026:m01",
    - ]
    + Array []
      100 |
      101 |         const trail = await JourneyCurriculumService.getCurriculumTrail();
    > 102 |         expect(trail.segments.map(segment => segment.trackId)).toEqual([fixture.batch.trackId]);
          |                                                                ^
      103 |         const nodes = trail.segments[0].units.flatMap(unit => unit.nodes);
```

**D3. Cobertura não entende as quatro famílias.** Arquivo `radiant-app/src/features/student-checkpoints/ProductionCurriculumCoverage.ts`.

- trecho `const expected = batch.wide !== undefined ? wideInteractionClaims(` trocado por `const expected = false ? wideInteractionClaims(`

Comando, em `radiant-app`: `npx jest src/features/journey/services/JourneyCatalogReachability.test.ts -t inventário`

```text
✕ o inventário executável publica a cobertura separando legado de fonte editorial (348 ms)
    Command failed: /Users/anderson/.nvm/versions/node/v20.20.2/bin/node scripts/qa/trilha-structural-inventory.cjs --check
      55 |     const { resolve } = jest.requireActual<typeof import('node:path')>('node:path');
      56 |     const root = resolve(__dirname, '../../../../..');
    > 57 |     const report = JSON.parse(execFileSync(process.execPath, ['scripts/qa/trilha-structural-inventory.cjs', '--check'], { cwd: root, encoding: 'utf8' }));
         |                               ^
      58 |     expect(report.schemaVersion).toBe(3);
      59 |     // As contagens saem das aulas-fonte: toda interação, todo item de conferência e de recuperação tem proveniência ligada.
      60 |     expect(report.coverage.summary).toMatchObject({
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 skipped, 2 total
Snapshots:   0 total
Time:        0.608 s, estimated 1 s
```

**D4. Catálogo ativo vazio com aulas-fonte presentes.** Arquivo `radiant-app/src/features/student-checkpoints/production-batches.ts`.

- trecho `= RTG_2026_BATCHES;` trocado por `= [];`

Comando, em `radiant-app`: `npx jest --verbose src/features/content/services/ContentRetirement.test.ts src/features/journey/services/TrailCoverage.test.ts src/features/journey/services/JourneyCatalogReachability.test.ts`

```text
✕ resolve todos os nós do catálogo local pelo mesmo caminho usado em Estude (2 ms)
✕ o inventário executável publica a cobertura separando legado de fonte editorial (214 ms)
✕ deixa vazias todas as fontes antigas, sem perder o marcador explícito, e só a trilha rtg-2026 entra
✕ bootstrap e refresh não consultam remoto/cache nem migram dados do aluno
✕ toda lição do catálogo aparece em alguma unidade da trilha (1 ms)
    expect(received).toHaveLength(expected)
    Expected length: 4
    Received length: 0
    Received array:  []
      44 |     expect(jest.requireActual('../../../data/curriculum-state.json').state).toBe('retired');
      45 |     // Por unidade: um nó de aula e um de conferência por aula-fonte, mais a conquista.
    > 46 |     expect(report.tracks).toHaveLength(sourceUnits.length);
         |                           ^
      47 |     expect(report.tracks.reduce((total, track) => total + track.nodes, 0)).toBe(sum(unit => unit.lessons.length * 2 + 1));
      48 |     expect(report.tracks.reduce((total, track) => total + track.resolvedActivityNodes, 0)).toBe(sum(unit => unit.lessons.length));
      49 |     expect(report.tracks.reduce((total, track) => total + track.resolvedCheckpointNodes, 0)).toBe(sum(unit => unit.lessons.length));
  ● o inventário executável publica a cobertura separando legado de fonte editorial
```

**L1. Correta mais longa aceita.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (correct[0].label.length > longest * 1.2) err(` trocado por `if (false) err(`

Comando, em `.`: `node --test --test-name-pattern correta mais longa scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 2 - reprova a correta mais longa que 1,2 vez o maior distrator
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:39:1'
  failureType: 'testCodeFailure'
  error: 'o defeito passou sem erro'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    expectOnly (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:24:10)
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:44:3)
```

**L2. Posição acima de 40% aceita.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (choiceCount >= 12 && count / choiceCount > 0.4) err(` trocado por `if (false) err(`

Comando, em `.`: `node --test --test-name-pattern acima de 40 scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 3 - reprova a unidade com a correta sempre na mesma posição (acima de 40%)
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:47:1'
  failureType: 'testCodeFailure'
  error: |-
    unidade: a posição 2 quase nunca é a correta (0/42); distribua
    unidade: a posição 3 quase nunca é a correta (0/42); distribua
    unidade: a posição 4 quase nunca é a correta (0/42); distribua
    unidade: nos itens de conferência a correta nunca cai na posição 2; o contrato do lote exige as quatro posições
    unidade: nos itens de conferência a correta nunca cai na posição 3; o contrato do lote exige as quatro posições
    unidade: nos itens de conferência a correta nunca cai na posição 4; o contrato do lote exige as quatro posições
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
```

**L3. Retorno repetido aceito.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (new Set(options.map((o) => norm(o.feedback))).size !== 4) err(` trocado por `if (false) err(`

Comando, em `.`: `node --test --test-name-pattern retorno repetido scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 5 - reprova retorno repetido entre alternativas
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:66:1'
  failureType: 'testCodeFailure'
  error: 'o defeito passou sem erro'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    expectOnly (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:24:10)
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:71:3)
```

**L4. Resposta constante aceita.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (answers.length === 2 && norm(answers[0]) === norm(answers[1])) err(` trocado por `if (false) err(`

Comando, em `.`: `node --test --test-name-pattern resposta constante scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 6 - reprova a conferência de resposta constante
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:74:1'
  failureType: 'testCodeFailure'
  error: 'o defeito passou sem erro'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    expectOnly (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:24:10)
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:79:3)
```

**L5. Item sem fonte aceito.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (!Array.isArray(ids) || !ids.length) return err(where, 'sourceIds vazio');` trocado por `if (!Array.isArray(ids)) return;`

Comando, em `.`: `node --test --test-name-pattern item sem fonte scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 7 - reprova item sem fonte e fonte que a unidade não declara
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:82:1'
  failureType: 'testCodeFailure'
  error: 'o defeito passou sem erro'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    expectOnly (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:24:10)
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:83:3)
```

**L6. Travessão com espaços aceito.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (/\s[—–]\s/.test(value)) err(` trocado por `if (false) err(`

Comando, em `.`: `node --test --test-name-pattern travessão scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 8 - reprova travessão com espaços em texto do aluno
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:90:1'
  failureType: 'testCodeFailure'
  error: 'o defeito passou sem erro'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    expectOnly (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:24:10)
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:92:3)
```

**L7. Conferência sem uma das quatro posições aceita.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (count === 0) err('unidade', `nos itens` trocado por `if (false) err('unidade', `nos itens`

Comando, em `.`: `node --test --test-name-pattern nunca usa uma das quatro scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 4 - reprova a conferência que nunca usa uma das quatro posições, mesmo abaixo de 40%
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:56:1'
  failureType: 'testCodeFailure'
  error: 'o defeito passou sem erro'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    expectOnly (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:24:10)
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:63:3)
```

**L8. Texto todo em caixa alta aceito.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (caps && (value.match(` trocado por `if (false && (value.match(`

Comando, em `.`: `node --test --test-name-pattern caixa alta scripts/content/rtg-lesson-lint.test.mjs`

```text
not ok 9 - reprova texto do aluno todo em caixa alta, e aceita sigla só como nome de editora
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:95:1'
  failureType: 'testCodeFailure'
  error: 'o defeito passou sem erro'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    expectOnly (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:24:10)
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/rtg-lesson-lint.test.mjs:97:3)
```

**G1. Gerador aceita unidade com a correta sempre na mesma posição.** Arquivo `scripts/content/rtg-lesson-lint.mjs`.

- trecho `if (choiceCount >= 12 && count / choiceCount > 0.4) err(` trocado por `if (false) err(`
- trecho `if (count === 0) err('unidade', `nos itens` trocado por `if (false) err('unidade', `nos itens`
- trecho `if (choiceCount >= 12 && count / choiceCount < 0.1) err(` trocado por `if (false) err(`

Comando, em `.`: `node --test --test-name-pattern editada à mão scripts/content/build-rtg-batches.test.mjs`

```text
not ok 4 - reprova a unidade editada à mão com a correta sempre na mesma posição
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/build-rtg-batches.test.mjs:66:1'
  failureType: 'testCodeFailure'
  error: |-
    The validation function is expected to return "true". Received false
    Caught error:
    Error: rtg-contract:m01.json:production-batch-invalid:invalid-editorial-candidate:checkpoint-answer-position-bias
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  stack: |-
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/build-rtg-batches.test.mjs:73:10)
    Test.runInAsyncScope (node:async_hooks:206:9)
```

**G2. --check não percebe arquivo defasado.** Arquivo `scripts/content/build-rtg-batches.mjs`.

- trecho `if (current !== content) stale.push(` trocado por `if (false) stale.push(`

Comando, em `.`: `node --test --test-name-pattern falha quando a aula-fonte muda scripts/content/build-rtg-batches.test.mjs`

```text
not ok 7 - --check passa logo após gerar e falha quando a aula-fonte muda, um arquivo some ou sobra
  ---
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/scripts/content/build-rtg-batches.test.mjs:94:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    0 !== 1
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 1
  actual: 0
  operator: 'strictEqual'
  stack: |-
```

## Execução verde

Comandos focados, não o gate. O gate é `EXPO_NO_DOTENV=1 npm run quality` mais `loop validate`,
e **não foi rodado** por esta frente.

| Comando | Resultado |
| --- | --- |
| `cd radiant-app && npx jest src/features/student-checkpoints src/features/journey src/features/content src/features/spaced-repetition src/features/review src/features/checkpoint` | Test Suites: 70 passed, 70 total; Tests:       956 passed, 956 total |
| `cd radiant-app && npx jest src/features/lesson-flow/services` | Test Suites: 6 passed, 6 total; Tests:       177 passed, 177 total |
| `node --test` nas suítes de `scripts/content/*.test.mjs`, com as três exclusões do CI | tests 148; pass 148; fail 0 |
| `node scripts/content/rtg-lesson-lint.mjs content-manifest/rtg-2026/aulas/*.json` | 6 unidades OK, 0 reprovadas |
| `node scripts/content/build-rtg-batches.mjs --check` | saída 0, 6 unidades em dia |
| `node scripts/content/audit-production-batches.mjs --check` | "publicationReady": true, "totalBatches": 6, "promotionValid": 6 |
| `node scripts/qa/trilha-structural-inventory.cjs --check` | saída 0; 6 trilhas, 180 interações, 72 itens de conferência, 72 de recuperação, 2346 de 2346 afirmações ligadas, 0 problemas de cobertura, 0 de alcance |
| `node scripts/content/check-pilot-payloads.mjs` | `errors: []` |
| `cd radiant-app && npx tsc --noEmit -p .` | saída 0 |
| `cd radiant-app && npx eslint` nos arquivos desta frente | saída 0 |
| `cd radiant-app && node --test scripts/copy-style-contract.test.mjs` | tests 65 pass 65 fail 0 |

`node --test scripts/content/*.test.mjs` sem as exclusões reprova em `register-source`, que lê
um PDF do acervo local e não é versionado. O CI já o exclui, e esta frente não o tocou.

## Limites e o que não foi verificado

- **Nada foi visto no simulador.** Nenhuma tela foi aberta; a cena, a ajuda e os pontos-chave
  estão no dado, e mostrá-los é da frente C.
- **Associação respondível pela posição.** `MatchingStepRenderer` lista a coluna da direita na
  mesma ordem de `payload.pairs`, e a resposta certa é o par de mesmo índice. O dado não
  resolve: a correção precisa ser na exibição, embaralhando a coluna da direita. A ordenação
  não tem esse problema, porque o gerador já grava a ordem de exibição embaralhada.
- **Retorno por alternativa na conferência.** O item de conferência só tem um retorno de acerto
  e um de erro; o retorno de cada alternativa errada, escrito na aula-fonte, não é levado. Nas
  interações da aula ele vai em `explanation`.
- **`feedback.incorrect` das escolhas é uma frase genérica**; o texto autoral está em
  `explanation` de cada alternativa.
- **`contentVersion` é fixa** (`rtg-2026-<unidade>-v1`). Reescrever uma unidade depois de
  publicada pede subir o sufixo na fábrica; hoje nada obriga.
- **`scripts/content/production-batch.mjs` não conhece `wide`.** A cópia em Node do hash do
  material (`productionBatchMaterial`) daria outro valor para um lote amplo. O gerador não a
  usa: ele chama o hash do próprio app. O arquivo está fora da lista desta frente.
- **A regra nova de `check-pilot-payloads.mjs` não foi vista falhando.** O script lê o catálogo
  real e não aceita um catálogo injetado; o teste dele não está na lista desta frente.
- **Fontes declaradas e não citadas** aparecem no inventário como lacuna
  `unused-declared-source`, não como problema. Não foram contadas por unidade.
- **Tamanho.** Os lotes gerados somam 1.4M de fonte TypeScript para
  6 unidades. O efeito no pacote do app e no tempo de abertura da aba Estude,
  que lê um retrato por trilha, não foi medido.
- **O job Linux do CI não foi executado.** O passo novo foi escrito e não rodou em runner.
- **Sem revisão humana da área.** Os aceites dos lotes registram revisão por IA sob delegação.

