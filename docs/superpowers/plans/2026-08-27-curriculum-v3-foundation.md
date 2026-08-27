# Currículo V3 — plano de implementação da fundação e migração

> **Execução obrigatória:** aplicar este plano com `superpowers:executing-plans`,
> `superpowers:test-driven-development`, `loop-development` e
> `superpowers:verification-before-completion`. Cada alteração de produção nasce
> depois de um teste focalizado falhar pelo motivo esperado.

**Data:** 2026-08-27  
**Escopo:** J2 — fundação versionada e migração segura.  
**Fora do escopo:** conteúdo do Arco 1, corte das superfícies, exclusão física do
legado, build e submissão às lojas.

## Objetivo

Criar a fronteira técnica de `curriculum:v3` sem mudar ainda o currículo exibido.
O aplicativo passa a reconhecer identidades curriculares estáveis, preparar uma
fotografia imutável do histórico anterior e reservar armazenamento separado para
o progresso futuro do V3. A autoridade continua em `curriculum:legacy` até o
primeiro bloco V3 estar completo e os gates J3/J4 permitirem o corte J5.

## Decisões de arquitetura

1. A versão do currículo não será inferida de `journey-progress.v2`. A primeira
   descreve significado educacional; a segunda descreve formato de storage.
2. O legado continua nas chaves atuais. O V3 recebe chaves próprias e nunca lê
   tentativas, evidências ou domínio do legado como crédito de aprendizagem.
3. Uma fotografia copia valores JSON de jornada, tentativas, evidências e
   domínio. Ela é uma fotografia parcial dessas quatro fontes, não um backup
   completo do app: revisões SM-2, checkpoints ativos, XP e preferências
   permanecem intactos em suas chaves. Inventariar esses consumidores é gate J5.
4. A preparação é idempotente: depois de criada, a fotografia não é regravada,
   mesmo que as chaves legadas mudem.
5. Estado ausente ou inválido falha fechado para `curriculum:legacy`. A ativação
   do V3 não faz parte deste plano.
6. Nenhum catálogo vazio é publicado. O esqueleto V3 expõe ordem e IDs dos arcos,
   mas seu manifesto publicável permanece indisponível até conter um caminho
   completo validado.

## Contratos novos

### Identidade curricular

Arquivo: `radiant-app/src/features/curriculum-v3/curriculum.types.ts`

```ts
export type CurriculumId = 'curriculum:legacy' | 'curriculum:v3';
export type CurriculumArcId =
  | 'arc:foundations'
  | 'arc:radiography'
  | 'arc:mammography'
  | 'arc:computed-tomography'
  | 'arc:magnetic-resonance'
  | 'arc:nuclear-medicine'
  | 'arc:radiotherapy'
  | 'arc:other-specializations';
```

IDs de lição, objetivo, atividade e item usarão prefixos estáveis e não terão
título ou posição como autoridade. O plano do Arco 1 definirá os IDs concretos.

### Estado de runtime

Arquivo: `radiant-app/src/features/curriculum-v3/curriculumRuntime.types.ts`

```ts
export type CurriculumRuntimeState = {
  schemaVersion: 'curriculum-runtime.v1';
  activeCurriculumId: CurriculumId;
  preparedCurriculumIds: CurriculumId[];
  legacySnapshotId?: 'legacy-snapshot:v1';
  v3PreparedAt?: string;
};
```

### Fotografia somente de leitura

Arquivo: `radiant-app/src/features/curriculum-v3/legacySnapshot.types.ts`

```ts
export type JsonValue = null | boolean | number | string | JsonValue[] | {
  [key: string]: JsonValue;
};

export type LegacyCurriculumSnapshot = {
  schemaVersion: 'legacy-curriculum-snapshot.v1';
  id: 'legacy-snapshot:v1';
  curriculumId: 'curriculum:legacy';
  capturedAt: string;
  sources: {
    journeyProgress: JsonValue | null;
    learningAttempts: JsonValue | null;
    learningEvidence: JsonValue | null;
    competencyMastery: JsonValue | null;
  };
};
```

Uma chave ausente é `null`. JSON inválido em uma fonte impede a preparação,
sem alterar a origem; falha de I/O também é propagada. Uma fotografia já existente
mas inválida não pode ser sobrescrita: leitura pública retorna `null` e tentativa
de criação falha. `bootstrap()` preserva bytes de estados futuros ou corrompidos,
retornando legado sem os regravar. Nenhum payload bruto aparece em logs.

A preparação não é chamada automaticamente: deve ocorrer com escritores legados
pausados no corte J5. Como a fotografia é imutável, uma preparação antecipada não
serve como fotografia final do corte; as chaves vivas continuam preservadas.
Chamadas concorrentes no mesmo processo são serializadas e falhas liberam a fila.

## Task 1 — Fixar identidade e ordem do V3

**Arquivos**

- criar `radiant-app/src/features/curriculum-v3/curriculum.types.ts`;
- criar `radiant-app/src/features/curriculum-v3/CurriculumV3Definition.ts`;
- criar `radiant-app/src/features/curriculum-v3/CurriculumV3Definition.test.ts`.

**Teste vermelho**

O teste exige:

- `CURRICULUM_V3_ID === 'curriculum:v3'`;
- oito arcos com IDs únicos;
- ordem Fundamentos → Radiografia → Mamografia → TC → RM → Medicina Nuclear →
  Radioterapia → outras especializações;
- Fundamentos declara anatomia, fisiologia e física como pilares;
- o esqueleto não oferece manifesto publicável vazio.

Comando:

```bash
cd radiant-app
npm test -- --runInBand src/features/curriculum-v3/CurriculumV3Definition.test.ts
```

**Implementação mínima**

Exportar uma definição `readonly` com a ordem aprovada e
`getPublishableManifest(): null`. Não conectar ao `LessonCatalogService` neste
passo.

**Commit:** `feat(curriculo): fixa identidade e arcos do v3`

## Task 2 — Criar chaves isoladas e repositório da fotografia

**Arquivos**

- modificar `radiant-app/src/constants/storageKeys.ts`;
- criar `radiant-app/src/features/curriculum-v3/legacySnapshot.types.ts`;
- criar `radiant-app/src/features/curriculum-v3/LegacyCurriculumSnapshotRepository.ts`;
- criar `radiant-app/src/features/curriculum-v3/LegacyCurriculumSnapshotRepository.test.ts`.

**Chaves exatas**

```ts
CURRICULUM_RUNTIME: '@radiant:curriculum_runtime_v1'
LEGACY_CURRICULUM_SNAPSHOT: '@radiant:legacy_curriculum_snapshot_v1'
V3_JOURNEY_PROGRESS: '@radiant:v3:journey_progress_v1'
V3_LEARNING_ATTEMPTS: '@radiant:v3:learning_attempts_v1'
V3_LEARNING_EVIDENCE: '@radiant:v3:learning_evidence_v1'
V3_COMPETENCY_MASTERY: '@radiant:v3:competency_mastery_v1'
```

**Teste vermelho**

Cobrir:

- leitura ausente devolve `null`;
- escrita e leitura preservam exatamente os quatro valores JSON;
- segunda tentativa de criação devolve a fotografia original e não chama nova
  escrita;
- JSON corrompido é ignorado com retorno `null`;
- criação com fotografia existente inválida recusa a substituição;
- chamadas concorrentes de criação preservam a primeira fotografia;
- o repositório não oferece métodos públicos de atualização ou exclusão.

Comando:

```bash
cd radiant-app
npm test -- --runInBand src/features/curriculum-v3/LegacyCurriculumSnapshotRepository.test.ts
```

**Commit:** `feat(curriculo): isola storage e fotografia do legado`

## Task 3 — Preparar migração idempotente e fail-closed

**Arquivos**

- criar `radiant-app/src/features/curriculum-v3/curriculumRuntime.types.ts`;
- criar `radiant-app/src/features/curriculum-v3/CurriculumMigrationService.ts`;
- criar `radiant-app/src/features/curriculum-v3/CurriculumMigrationService.test.ts`.

**API**

```ts
bootstrap(): Promise<CurriculumRuntimeState>
prepareV3(): Promise<CurriculumRuntimeState>
getLegacySnapshot(): Promise<LegacyCurriculumSnapshot | null>
```

`bootstrap()` apenas normaliza o estado e nunca ativa V3. `prepareV3()` lê as
quatro chaves antigas, cria a fotografia se ainda não existir e marca V3 como
preparado. O relógio entra por construtor/fábrica no teste; em produção usa
`new Date().toISOString()`.

**Teste vermelho**

Cobrir:

- instalação limpa inicia em legado;
- atualização com stores antigos preserva os valores na fotografia;
- preparação repetida mantém `capturedAt` e conteúdo originais;
- reinício retoma o estado preparado;
- estado futuro, corrompido ou inconsistente volta a legado sem apagar dados;
- nenhum ID de nó, lição ou evidência antiga é copiado para uma chave V3;
- falha de leitura ou JSON inválido de fonte impede marcar preparação;
- falha de escrita da fotografia impede marcar a migração como preparada;
- falha entre fotografia e runtime permite retomada sem recapturar o legado;
- duas preparações concorrentes não disputam a fotografia;
- timestamps e listas de IDs inconsistentes são recusados.

Comando:

```bash
cd radiant-app
npm test -- --runInBand src/features/curriculum-v3/CurriculumMigrationService.test.ts
```

**Commit:** `feat(curriculo): prepara migracao v3 sem herdar dominio`

## Task 4 — Inicializar a fronteira no catálogo sem alterar a UI

**Arquivos**

- modificar `radiant-app/src/features/content/services/LessonCatalogService.ts`;
- ampliar `radiant-app/src/features/content/services/LessonCatalogService.test.ts`.

**Comportamento**

Encadear `CurriculumMigrationService.bootstrap()` na promessa compartilhada do
`LessonCatalogService.bootstrap()` antes de `refresh()`. A inicialização cria
somente o estado em legado. Não chama `prepareV3()`, não troca catálogo e não
muda a rota recomendada. Erros sobem para o tratamento de retry já existente no
`RootLayout`; a promessa compartilhada é liberada em `finally`.

**Teste vermelho**

Provar que:

- duas chamadas concorrentes fazem uma só inicialização e um só refresh;
- erro de storage impede refresh e a tentativa seguinte consegue reiniciar;
- estado futuro/corrompido preservado pelo serviço não troca a autoridade;
- os contratos existentes de catálogo local e remoto continuam passando.

```bash
cd radiant-app
npm test -- --runInBand src/features/content/services/LessonCatalogService.test.ts
```

**Commit:** `feat(curriculo): inicializa fronteira v3 no app`

## Task 5 — Regressão e sinalização operacional

**Arquivos**

- modificar `docs/STATUS.md`;
- modificar `docs/plans/2026-07-27-radiant-launch-roadmap.md`.

**Verificação focalizada**

```bash
cd radiant-app
npm test -- --runInBand \
  src/features/curriculum-v3/CurriculumV3Definition.test.ts \
  src/features/curriculum-v3/LegacyCurriculumSnapshotRepository.test.ts \
  src/features/curriculum-v3/CurriculumMigrationService.test.ts \
  src/features/journey/services/JourneyProgressService.test.ts \
  src/features/content/services/LessonCatalogService.test.ts
npm run typecheck
npm run lint
```

Depois executar os validadores do Loop no run declarado. J2 só pode ser marcada
concluída se todos os testes de instalação limpa, atualização, idempotência e
retomada estiverem verdes. J3, J4 e J5 permanecem abertas.

## Isolamento de execução

A inspeção revelou que os validadores editoriais dependem de acervo local
não versionado sob `Conteúdo`. Uma worktree limpa não contém essa baseline.
Executar em branch dedicada `codex/curriculum-v3-foundation` no checkout atual,
com escritor exclusivo do Loop e arquivos declarados, sem copiar o acervo nem
relaxar validadores. Commits locais permanecem separados da branch de origem.

## Critérios de aceite

- a versão curricular é explícita e independente do schema de jornada;
- V3 e legado não compartilham chaves de progresso;
- uma atualização preserva uma fotografia imutável das quatro fontes antigas;
- preparar duas vezes produz o mesmo estado observável;
- corrupção ou versão desconhecida não ativa V3;
- nenhuma superfície do app muda ainda;
- nenhum arquivo legado é removido;
- o plano de corte continua condicionado ao Arco 1 completo, auditoria de
  domínio, acessibilidade e validação física no iPhone 16.

