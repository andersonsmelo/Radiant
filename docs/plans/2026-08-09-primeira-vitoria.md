# Primeira vitória após a apresentação — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fazer o CTA final da apresentação abrir o próximo passo elegível da jornada, preservando **Pular → Home**, as três telas e o início pedagógico da lição.

**Architecture:** O `RootLayout` coordena a saída porque já controla o gate e a montagem do `Stack`. `FirstRunService` continua cuidando apenas da persistência; `JourneyProgressService` e `JourneyNodeRouting` continuam sendo as autoridades sobre recomendação, elegibilidade e rota. Um destino pendente é consumido por efeito somente depois que a apresentação desmonta e o `Stack` monta.

**Tech Stack:** React Native, Expo Router, TypeScript, Jest + `@testing-library/react-native`, Maestro, Node.js 20.20.2, Loop.

**Spec:** [`../superpowers/specs/2026-08-09-primeira-vitoria-design.md`](../superpowers/specs/2026-08-09-primeira-vitoria-design.md)

---

### Task 1: Prender o novo contrato do gate em teste

**Files:**
- Modify: `radiant-app/src/features/first-run/startup-gate.flow.test.tsx`

**Step 1: Adicionar os dublês da jornada**

Mockar `JourneyProgressService.bootstrap()` e importar o mock de
`router.replace`. Usar como fixture um nó de lição navegável com `blockId`, sem
fixar essa identidade na implementação.

**Step 2: Escrever os casos vermelhos**

Adicionar casos que provem:

- `markSeen()` resolve antes de `router.replace()`;
- conclusão monta o `Stack` e abre o nó recomendado;
- salto monta o `Stack` sem consultar jornada ou router;
- toque duplo dispara uma saída;
- snapshot sem nó e snapshot rejeitado caem na Home;
- nó de revisão/retomada recomendado preserva seu destino.

**Step 3: Rodar a suíte focada e observar o vermelho**

```bash
cd radiant-app
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:/usr/bin:/bin \
  EXPO_NO_DOTENV=1 CI=1 npm test -- \
  src/features/first-run/startup-gate.flow.test.tsx --runInBand --no-cache
```

Esperado: FAIL porque o `RootLayout` ainda apenas desmonta a apresentação.

### Task 2: Coordenar persistência, recomendação e navegação

**Files:**
- Modify: `radiant-app/src/app/_layout.tsx`
- Test: `radiant-app/src/features/first-run/startup-gate.flow.test.tsx`

**Step 1: Importar as autoridades existentes**

Usar imports diretos de:

```ts
import type { Href } from 'expo-router';
import { JourneyProgressService } from '../features/journey/services/JourneyProgressService';
import {
  canOpenJourneyNode,
  getJourneyNodeHref,
} from '../features/journey/services/JourneyNodeRouting';
```

**Step 2: Criar estado transitório e guarda de reentrada**

Adicionar `pendingWelcomeHref: Href | null` e um `useRef<boolean>` que recusa o
segundo toque enquanto a saída está em voo. Não adicionar trabalho ao bootstrap.

**Step 3: Implementar o handler estável**

`handleWelcomeFinish(reason, step)` deve:

1. recusar reentrada;
2. aguardar `FirstRunService.markSeen()`;
3. só em `completed`, obter o snapshot e validar/produzir a rota;
4. capturar falha com `TelemetryService.captureError()` usando apenas fase e
   motivo;
5. sempre desmontar a apresentação;
6. deixar o destino nulo em qualquer fallback.

**Step 4: Navegar só depois de montar o Stack**

Um `useEffect` observa `showWelcome === false` e `pendingWelcomeHref !== null`,
executa `router.replace()` uma vez e limpa o destino.

**Step 5: Rodar a suíte focada até ficar verde**

Usar o comando da Task 1. Esperado: PASS.

### Task 3: Fazer o contrato Maestro provar a primeira vitória

**Files:**
- Modify: `radiant-app/.maestro/first-run.yaml`
- Modify: `radiant-app/scripts/maestro-contract.test.mjs`
- Modify: `radiant-app/docs/E2E_RUNBOOK.md`

**Step 1: Atualizar o flow**

Depois de `tapOn: 'Começar'`, afirmar o texto do primeiro passo da lição:

```yaml
- assertVisible: 'Você vai começar pelo papel dos raios-X e pelo raciocínio básico de contraste e radiopacidade.'
```

Manter `clearState: true`, as três telas e o aviso legal.

**Step 2: Prender o destino à fonte real**

No contrato, ler também `src/data/journey/defaultBlocks.ts`, extrair o corpo do
primeiro passo de `block:lesson-1:intro` e exigir a asserção correspondente no
flow. Exigir que o flow não termine apenas com `assertNotVisible` da apresentação.

**Step 3: Atualizar o runbook**

Registrar que `first-run.yaml` prova **Começar → primeiro passo**, enquanto o
subflow de salto e `boot-to-home.yaml` preservam **Pular → Home**. Não promover
execução nova em device sem executá-la.

**Step 4: Rodar o contrato**

```bash
cd radiant-app
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:/usr/bin:/bin \
  npm run test:maestro-contract
```

Esperado: PASS.

### Task 4: Reconciliar estado e instruções

**Files:**
- Create: `docs/EXECUTION_STATUS_2026-08-09.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`
- Modify: `README.md`
- Modify: `docs/README.md`
- Modify: `docs/ARCHITECTURE_STATE.md`
- Modify: `radiant-app/README.md`
- Modify: `docs/release/CHECKLIST_RELEASE_V1.3.md`
- Modify: `scripts/qa/docs-contract.mjs`
- Test: `scripts/qa/docs-contract.test.mjs`
- Modify: `.loop/project.yaml`

**Step 1: Criar o status canônico**

Declarar que o arquivo substitui `EXECUTION_STATUS_2026-08-08.md`. Preservar os
bloqueios Apple/Play, mídia/direitos, API e device. Registrar a entrega e separar
testes locais de eventual execução Maestro.

**Step 2: Marcar a entrega no roadmap**

Adicionar uma unidade nova e concluída ao redor da B6, sem reabrir nem reescrever
a decisão de 2026-08-02. Referenciar spec, plano, código e evidência.

**Step 3: Repontar documentos vivos**

Trocar ponteiros canônicos de 08-08 para 08-09 nos documentos vivos e na lista
governada do contrato. Trocar também o include do Loop.

**Step 4: Rodar o contrato documental**

```bash
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:/usr/bin:/bin \
  node --test scripts/qa/docs-contract.test.mjs
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:/usr/bin:/bin \
  node scripts/qa/docs-contract.mjs
```

Esperado: PASS.

### Task 5: Validar, registrar memória se houver e fechar

**Files:** todos os arquivos declarados no run `run-1786276592865-83a97233`.

**Step 1: Rodar verificações focadas**

Executar suíte do gate, contrato Maestro, docs-contract, typecheck e lint.

**Step 2: Executar o flow em device se houver runtime disponível**

Fazer a sondagem antes. Não iniciar E2E se não houver simulador/build pronto e
nunca deixá-lo concorrer com `loop validate`. Registrar honestamente o resultado.

**Step 3: Rodar a validação do Loop**

```bash
loop validate --run run-1786276592865-83a97233
```

Checar `code === VALIDATION_PASSED`.

**Step 4: Finalizar o step**

```bash
loop step finish --run run-1786276592865-83a97233
```

Checar `code === STEP_SUCCEEDED`.

**Step 5: Gravar aprendizado apenas se a validação produzir um candidato durável**

Se houver, criar `MemoryCandidateV1` com evidência aprovada, executar
`loop memory write` e checar o `code`. Caso contrário, não inventar memória.

**Step 6: Fechar o run**

```bash
loop run close --run run-1786276592865-83a97233
```

Checar `code === RUN_CLOSED`. Somente depois, revisar o diff final e decidir o
commit conforme a autorização da sessão.
