# Radiant Continuation and Product Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transformar o Radiant v1.2.0 de uma interface visualmente avançada, porém parcialmente demonstrativa, em um aplicativo educacional local-first confiável, acessível, testável em dispositivo e pronto para validação com usuários antes de qualquer reativação de infraestrutura remota.

**Architecture:** Preservar Expo Router + React Native + serviços locais existentes. Extrair regras de apresentação da Home para um contrato de domínio independente de React, manter catálogo e progresso locais como caminho funcional principal, usar adaptadores explícitos para API/telemetria e tornar o design system verificável em isolamento. A API permanece uma decisão separada e bloqueada por auditoria read-only e autorização operacional.

**Tech Stack:** Expo SDK 54, React Native 0.81.5, React 19.1, TypeScript, Expo Router, Jest, React Native Testing Library, Storybook for React Native v10, Maestro, Reanimated 4, AsyncStorage, Node.js 20.20.2 e API Node/TypeScript/PostgreSQL existente.

---

## Progresso de execução — atualizado em 2026-07-23

| Faixa | Estado | Evidência |
|---|---|---|
| Tasks 0–3 | concluídas | baseline documental, quality gates e Visual QA recuperados (`3942714`, `97b2c89`) |
| Tasks 4–6 | concluídas | Home e Progresso usam contratos locais e copy honesta (`c2f37ad` → `0ad57b4`) |
| Task 7 | concluída | tokens semânticos light/galaxy e migração de controles (`3d92ffc`, `78fe3bb`) |
| Task 8 | concluída | Storybook isolado do entrypoint de produção (`8ea561c`) |
| Task 9 | concluída em código | semântica de interação, foco e preferência de movimento (`5467b15`) |
| Task 10 | harness concluído; evidência de device pendente | flows Maestro, perfil `e2e-test` e runbook (`25667b1`); não há Maestro CLI nem simulador/emulador disponível neste checkout |
| Tasks 11–16 | pendentes | aguardam a saída real em device e as decisões de produto/infraestrutura descritas abaixo |

Estado dos gates locais após Task 10: 27 suítes e 71 testes passam; `npm run quality` passa com 54 warnings legados e zero erros; Visual QA estrito registra zero regressões, 122 achados no baseline e 2 exceções delimitadas.

O status operacional canônico está em [`docs/archive/EXECUTION_STATUS_2026-07-23.md`](../archive/EXECUTION_STATUS_2026-07-23.md). Os blocos de tarefa abaixo preservam o plano original como histórico de execução; esta tabela prevalece sobre verbos no futuro dentro daquele texto.

---

## 1. Resumo executivo

O próximo passo não é redesenhar novamente o Radiant. A base visual v1.2 já existe e deve ser preservada. O problema prioritário é tornar verdadeira, coerente e verificável a experiência que a interface promete.

Ordem de execução:

1. Restaurar a verdade documental e deixar os gates locais verdes.
2. Substituir dados fictícios da Home por um dashboard derivado de catálogo, jornada, revisão espaçada, gamificação e sessão reais.
3. Transformar o design system em uma superfície executável com Storybook, estados acessíveis e testes por semântica.
4. Cobrir o fluxo crítico em dispositivo com Maestro e validação manual de acessibilidade.
5. Validar a experiência com usuários-alvo e revisão de domínio.
6. Pilotar movimento avançado do Pixel com Rive somente após estabilidade funcional e medição.
7. Decidir separadamente se a API deve ser reativada; nenhuma mutação de VPS pertence a este plano.

## 2. Entendimento consolidado

- O produto é um aplicativo premium de microaprendizagem em radiologia, com sessões de 2 a 5 minutos, casos, revisão espaçada e gamificação séria.
- O MVP não inclui DICOM completo, upload do usuário, comunidade, ranking global, certificação ou vídeos longos.
- A linguagem visual atual é intencionalmente mista: superfícies claras para Home, Quiz, Progresso, Missões e Checkpoint; superfícies escuras para Galáxia e Recompensa.
- O branch atual contém a implementação v1.2.0 acrescida das Tasks 0–10 executadas nesta continuação. Há artefatos não rastreados que pertencem ao usuário e não devem ser omitidos ou sobrescritos.
- O aplicativo deve continuar útil sem API. O remoto é um aprimoramento futuro, não uma dependência para abrir, aprender, revisar e acompanhar progresso.
- Dados clínicos, identidade do usuário, métricas de estudo e telemetria não podem ser inventados para preencher a UI.
- Acessibilidade, legibilidade, redução de movimento e testes em dispositivo fazem parte da definição de pronto.

## 3. Estado confirmado em 2026-07-23

### 3.1 Git e artefatos

- Branch: `codex/wave1-hardening-api-smoke`.
- HEAD/tag: `25667b1`; base de release histórica `b5b0967`, `v1.2.0`.
- Artefatos não rastreados preservados:
  - `Mascote.png`
  - `New Layout/`
  - `docs/NOVO_VPS.md`
  - `docs/superpowers/plans/2026-04-30-design-system-final.md`
- O plano de design de 2026-04-30 ainda exibe checkboxes vazios, embora a sequência de commits tenha implementado grande parte dele. Isso é drift documental.

### 3.2 Gates locais

| Gate | Resultado atual | Evidência |
|---|---:|---|
| `radiant-app` typecheck | PASS | TypeScript sem erros |
| `radiant-app` lint/quality | PASS | 54 warnings legados, zero erros; typecheck, contratos e Visual QA passam |
| `radiant-app` testes | PASS | 27 suítes; 71 testes |
| Visual QA estrito | PASS com dívida | zero regressões; 122 achados no baseline e 2 exceções delimitadas |
| `radiant-api` testes | PASS | 13 testes |
| `radiant-api` build | PASS | build TypeScript concluído |
| Validação de conteúdo | PASS com dívida | 42 itens ainda marcados para revisão de formato |
| Smoke local | PASS | sync, app, API local, conteúdo e editorial |
| Smoke remoto read-only | FAIL | `/health`, `/ready` e catálogo retornam HTTP 502 |

Falhas específicas resolvidas nas Tasks 0–3:

- Apostrophes sem escape em:
  - `radiant-app/src/app/onboarding/index.tsx`
  - `radiant-app/src/features/galaxy/screens/MissionsScreen.tsx`
  - `radiant-app/src/features/home/screens/HomeScreen.tsx`
- `AuthService.test.ts` não fornece `TelemetryService.setUserContext`.
- `RewardScreen.flow.test.tsx` não isola corretamente o AsyncStorage.
- `CheckpointScreen.flow.test.tsx` espera uma cópia anterior à interface entregue.
- `npm run test:flows` não inclui o fluxo de checkpoint.

### 3.3 Verdade do produto

Antes das Tasks 4–6, `radiant-app/src/features/home/screens/HomeScreen.tsx` continha dados de demonstração apresentados como fatos. O estado atual deriva missão, progresso, gamificação e estados vazios dos serviços locais; não devem ser reintroduzidos valores fictícios.

- data fixa e saudação fictícia;
- missão clínica fixa;
- quantidade de casos, duração e XP fixos;
- capítulo e progresso fixos;
- 23 casos dominados e 84% de precisão fixos;
- cinco corações fixos, embora o snapshot real já exponha `hearts`;
- CTA que abre `/quiz` sem resolver a próxima atividade elegível.

`radiant-app/src/features/progress/screens/ProgressScreen.tsx` também foi migrado para valores derivados ou estados honestos. Métricas ausentes não devem voltar como placeholders numéricos.

### 3.4 Verdade operacional

Os READMEs ainda descrevem a API como publicada/saudável, mas a documentação operacional mais recente e o smoke público indicam 502. Até auditoria posterior, a afirmação correta é:

> O aplicativo está funcional local-first; a API pública conhecida está indisponível e não é pré-requisito para o caminho principal.

## 4. Decisões de arquitetura

### D1. Home e Progresso consomem view models

Criar um `HomeDashboardService` e um `LearningStatsService` independentes de React. As telas não devem decidir próxima aula, nome, estatísticas, fallback ou copy clínica.

### D2. Local-first é contrato, não fallback acidental

O catálogo local, a jornada local, o progresso e a revisão espaçada precisam formar um fluxo completo quando a API está desconfigurada ou indisponível.

### D3. Dados ausentes produzem UI ausente ou estado vazio

- Sem sessão: usar “Olá” e avatar neutro; não inventar nome ou iniciais.
- Sem estatística: ocultar o card ou mostrar uma mensagem honesta.
- Sem próxima aula: oferecer revisão ou exploração da jornada.
- Sem duração editorial aprovada: não exibir estimativa.

### D4. Testes de componente consultam semântica

React Native Testing Library deve priorizar role, accessible name, state e text. `testID` fica reservado para Maestro ou elementos sem semântica acessível equivalente.

### D5. O design system terá uma bancada executável

Storybook for React Native será um entrypoint de desenvolvimento, sem código no bundle de produção. Cada componente crítico terá histórias de estados, temas e acessibilidade.

### D6. Movimento avançado é experimento

Rive entra apenas como spike do Pixel, sob feature flag, com fallback estático e respeito a reduce motion. Nenhum fluxo funcional dependerá dele.

### D7. Produção é uma trilha separada

Auditoria da API pode ser read-only. Backup, restore, deploy, alteração de DNS/proxy, restart ou migração exigem autorização explícita e plano operacional próprio.

## 5. Pesquisa: ferramentas recomendadas

| Ferramenta | Decisão | Uso no Radiant | Gate |
|---|---|---|---|
| Storybook for React Native v10 | Adotar | tokens, componentes, light/dark, loading/empty/error, Dynamic Type | gates locais verdes |
| Maestro | Adotar localmente | fluxo Onboarding → Home → Jornada → Quiz → Checkpoint → Reward → Progresso | build dev estável |
| Figma Variables | Adotar no handoff | mapear tokens sem duplicar uma nova estética | API dos componentes estabilizada |
| Figma Code Connect | Pilotar | ligar componentes React Native à biblioteca de design | Storybook e naming estáveis |
| React Native Testing Library | Reforçar | testes por role/name/state | imediato |
| Rive | Spike opcional | máquina de estados do Pixel | acessibilidade e fluxo crítico verdes |
| Flashlight | Pilotar | baseline de startup/FPS em Android | dispositivo e cenário repetível |
| Sentry React Native | Reforçar antes do beta | crashes e performance com scrub de PII | política de dados aprovada |
| Maze | Opcional | estudo remoto não moderado | protótipo navegável e recrutamento |
| Mobbin | Referência | repertório, não especificação | sem bloquear implementação |

Notas:

- O runtime atual do Rive suporta a versão técnica do projeto, mas exige dev build e código nativo; não funciona como uma dependência puramente Expo Go.
- Maestro usa a camada de acessibilidade do React Native e aceita `testID`, mas o job Maestro do EAS Workflows ainda deve ser tratado como integração posterior, não como primeiro gate.
- Storybook v10 recomenda troca de entrypoint; quando desabilitado, não deve integrar o bundle da aplicação.
- Ferramentas de fornecedores foram avaliadas com suas próprias limitações comerciais e de marketing.

## 6. Pesquisa: referências de design e especialistas

Estas são referências de prática, não recomendações de contratação já verificadas.

| Referência | O que estudar | O que não copiar literalmente |
|---|---|---|
| Khan Academy / Caitlyn Mayers | cores semânticas, tokens, acessibilidade e reconciliação Figma-código | linguagem infantil ou paleta da marca |
| Duolingo Design / Hoshi Ludwig / Mig Reyes | colaboração entre produto, arte, research e writing; mascote com função | gamificação agressiva ou padrões que desviem da aprendizagem |
| Val Head | motion com propósito e reduced motion | animação decorativa contínua |
| Dan Mall / Design System University | governança, adoção e produto sobre documentação | cerimônia de design system maior que a equipe |
| NHS App Design System | clareza, acessibilidade e padrões de saúde | aparência institucional fora do posicionamento premium |
| thoughtbot / Relias | descoberta e entrega em educação para saúde | inferir eficácia clínica a partir de case study |
| Estudos de apps de radiologia | labels, task success, SUS e observação de fluxo | concluir qualidade só com SUS ou amostras pequenas |

Direção visual recomendada:

- preservar Sora, a paleta e as superfícies v1.2;
- aumentar coerência sem unificar artificialmente light/dark;
- tornar o Pixel um guia de estado, não decoração permanente;
- usar movimento para progresso, feedback e orientação espacial;
- preferir labels clínicos inequívocos a copy publicitária;
- medir compreensão e sucesso de tarefa antes de adicionar “delight”.

## 7. Skills encontradas e curadas

Nenhuma skill foi instalada durante o planejamento.

### Recomendadas para execução

1. Expo oficial, UI nativa:

   ```bash
   npx skills add https://github.com/expo/skills --skill building-native-ui
   ```

   58,7 mil instalações, repositório oficial, auditorias públicas aprovadas.

2. Práticas React Native/Expo da Vercel:

   ```bash
   npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-native-skills
   ```

   172 mil instalações, foco direto em listas, animação, navegação e APIs nativas.

3. Performance baseada na Callstack:

   ```bash
   npx skills add https://github.com/callstackincubator/agent-skills --skill react-native-best-practices
   ```

   19,8 mil instalações; usar apenas quando houver baseline mensurável.

4. Storybook oficial:

   ```bash
   npx skills add https://github.com/storybookjs/react-native --skill setup-react-native-storybook
   npx skills add https://github.com/storybookjs/react-native --skill writing-react-native-storybook-stories
   ```

   Adoção menor, mas autoria canônica, repositório ativo e correspondência exata justificam a recomendação.

### Opcionais com ressalvas

- `pbakaus/impeccable@impeccable`: útil para crítica/polimento e preservação de identidade; auditar antes de instalar porque agregadores exibem avisos de segurança.
- `nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max`: amplo e popular, mas genérico e com auditoria pública desfavorável; não é recomendação para a trilha principal.
- Skills de redesign/landing page: não usar para conduzir o app, pois tendem a privilegiar web/marketing e podem apagar a linguagem existente.

## 8. Ondas, gates e dependências

| Onda | Resultado | Gate de saída |
|---|---|---|
| 0 | documentação verdadeira e baseline verde | lint, typecheck, testes, API e conteúdo passam |
| 1 | Home e navegação alimentadas por dados reais | nenhum dado fictício; fluxo local-first coberto |
| 2 | design system executável e acessível | Storybook + testes semânticos + checklist manual |
| 3 | fluxo crítico validado em dispositivo | Maestro iOS/Android local + evidência |
| 4 | produto validado com usuários e domínio | problemas priorizados por evidência |
| 5 | piloto de motion/performance | métricas antes/depois e fallback acessível |
| 6 | decisão de infraestrutura e beta | ADR da API + matriz real-device + observabilidade |

Não iniciar uma onda se o gate anterior estiver vermelho, salvo spike isolado que não altere produção.

---

## Task 0: Proteger o estado atual e criar baseline reproduzível

**Files:**

- Create: `docs/archive/EXECUTION_STATUS_2026-07-23.md`
- Create: `scripts/qa/toolchain-preflight.mjs`
- Test: `scripts/qa/toolchain-preflight.test.mjs`
- Modify: `README.md`
- Modify: `docs/README.md`
- Modify: `radiant-app/README.md`

**Step 1: Resolver os artefatos não rastreados antes do worktree**

Enumerar os quatro alvos já identificados e decidir, com o usuário, quais são fonte oficial. Não criar worktree que omita silenciosamente `New Layout/`, o mascote ou documentação recente.

**Step 2: Criar o teste do toolchain**

O teste deve verificar:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveToolchain } from './toolchain-preflight.mjs';

test('requires the project Node 20 runtime and npm', () => {
  const result = resolveToolchain({
    nodeVersion: 'v20.20.2',
    npmPath: '/Users/anderson/.nvm/versions/node/v20.20.2/bin/npm',
  });

  assert.deepEqual(result, {
    ok: true,
    nodeMajor: 20,
    npmAvailable: true,
  });
});
```

**Step 3: Executar o teste vermelho**

Run:

```bash
node --test scripts/qa/toolchain-preflight.test.mjs
```

Expected: FAIL porque `toolchain-preflight.mjs` ainda não existe.

**Step 4: Implementar o preflight mínimo**

O script deve falhar com mensagem acionável se Node/npm não estiverem disponíveis e nunca deve tentar instalar runtimes.

**Step 5: Registrar baseline honesto**

O novo status deve registrar branch, commit, arquivos não rastreados, versões, resultado dos gates e indisponibilidade remota, sem cookies, tokens, e-mails ou PII.

**Step 6: Criar worktree somente após resolver a fonte**

Branch sugerido:

```bash
git worktree add ../Radiant-wave0 -b codex/radiant-wave0-truth-gates codex/wave1-hardening-api-smoke
```

**Step 7: Commit**

```bash
git add docs/archive/EXECUTION_STATUS_2026-07-23.md scripts/qa/toolchain-preflight.mjs scripts/qa/toolchain-preflight.test.mjs README.md docs/README.md radiant-app/README.md
git commit -m "docs: establish Radiant continuation baseline"
```

## Task 1: Tornar a documentação um contrato verificável

**Files:**

- Create: `scripts/qa/docs-contract.mjs`
- Test: `scripts/qa/docs-contract.test.mjs`
- Modify: `docs/ARCHITECTURE_STATE.md`
- Modify: `radiant-app/docs/CHANGELOG.md`
- Modify: `docs/superpowers/plans/2026-04-30-design-system-final.md`
- Review: `docs/NOVO_VPS.md`

**Step 1: Escrever testes para drift conhecido**

Casos:

- reprovar caminhos absolutos antigos `/Users/anderson/Documents/Radiant`;
- reprovar “API healthy/published” quando o status canônico diz 502;
- exigir que planos implementados estejam marcados como `historical`, `completed` ou tenham vínculo com commits;
- reprovar exemplos com e-mail, token, cookie ou senha em documentos operacionais.

**Step 2: Executar**

```bash
node --test scripts/qa/docs-contract.test.mjs
```

Expected: FAIL com os drifts atuais.

**Step 3: Corrigir somente as afirmações comprovadamente desatualizadas**

Não reescrever decisões históricas. Marcar a data e o status da fonte.

**Step 4: Adicionar ao smoke local**

Modificar `scripts/qa/wave-1-smoke.mjs` para executar o contrato documental como verificação local, sem acesso remoto por padrão.

**Step 5: Verificar**

```bash
node --test scripts/qa/docs-contract.test.mjs
node scripts/qa/docs-contract.mjs
node scripts/qa/wave-1-smoke.mjs --skip-remote
```

Expected: PASS.

**Step 6: Commit**

```bash
git add scripts/qa docs README.md radiant-app/README.md radiant-app/docs/CHANGELOG.md
git commit -m "docs: reconcile architecture and operational truth"
```

## Task 2: Restaurar todos os gates do aplicativo

**Files:**

- Modify: `radiant-app/src/app/onboarding/index.tsx`
- Modify: `radiant-app/src/features/galaxy/screens/MissionsScreen.tsx`
- Modify: `radiant-app/src/features/home/screens/HomeScreen.tsx`
- Modify: `radiant-app/src/features/auth/AuthService.test.ts`
- Modify: `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx`
- Modify: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx`
- Modify: `radiant-app/package.json`

**Step 1: Fixar o runtime**

```bash
export PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH"
node --version
npm --version
```

Expected: Node `v20.20.2` e npm disponível.

**Step 2: Atualizar testes antes do código**

- Adicionar mock de `setUserContext`.
- Adicionar mock de AsyncStorage no fluxo de recompensa.
- Fazer o teste de checkpoint consultar a cópia e semântica atualmente aprovadas.
- Incluir checkpoint em `test:flows`.

**Step 3: Executar os testes focados**

```bash
npm --prefix radiant-app test -- --runInBand \
  src/features/auth/AuthService.test.ts \
  src/features/rewards/screens/RewardScreen.flow.test.tsx \
  src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx
```

Expected: PASS.

**Step 4: Corrigir os três erros de lint**

Preferir copy em português aprovada, sem desligar regras.

**Step 5: Classificar warnings**

Resolver dependências de hooks e variáveis mortas. Para warnings mantidos, documentar regra, motivo e owner; não criar um blanket disable.

**Step 6: Executar gates completos**

```bash
npm --prefix radiant-app run typecheck
npm --prefix radiant-app run lint
npm --prefix radiant-app test -- --runInBand
npm --prefix radiant-app run test:flows
```

Expected: todos PASS.

**Step 7: Commit**

```bash
git add radiant-app
git commit -m "test: restore app quality gates"
```

## Task 3: Calibrar o visual QA e limpar duplicatas com prova

**Files:**

- Modify: `radiant-app/scripts/visual-qa.mjs`
- Test: `radiant-app/scripts/visual-qa.test.mjs`
- Delete only after verification:
  - `radiant-app/src/features/gamification/services/xp 2.ts`
  - `radiant-app/src/features/spaced-repetition/models/sm2 2.ts`
  - `radiant-app/src/services/index 2.ts`
  - `radiant-app/src/types/annotation 2.ts`

**Step 1: Criar fixtures do scanner**

O scanner deve distinguir:

- valor mágico de spacing/radius que deveria usar token;
- círculo intencional;
- SVG/asset vectorial;
- constante de duração de motion centralizada;
- exceção documentada com owner e expiração.

**Step 2: Rodar os testes vermelhos**

```bash
node --test radiant-app/scripts/visual-qa.test.mjs
```

**Step 3: Implementar categorias e allowlist estruturada**

Não reduzir contagem apenas para “ficar verde”. Cada supressão deve indicar a semântica.

**Step 4: Enumerar e comparar duplicatas**

```bash
rg -n "xp 2|sm2 2|index 2|annotation 2" radiant-app/src radiant-app/app
shasum -a 256 <arquivo-original> <arquivo-duplicado>
diff -u <arquivo-original> <arquivo-duplicado>
```

Excluir somente os arquivos sem import e com equivalência confirmada. Registrar a lista exata no commit.

**Step 5: Verificar**

```bash
npm --prefix radiant-app run visual:qa:strict
npm --prefix radiant-app run quality
```

Expected: PASS ou backlog residual explicitamente aprovado, sem falsos positivos de alta prioridade.

**Step 6: Commit**

```bash
git add radiant-app/scripts radiant-app/src
git commit -m "chore: calibrate visual gate and remove verified duplicates"
```

## Task 4: Especificar o contrato de domínio da Home

**Files:**

- Create: `radiant-app/src/features/home/home.types.ts`
- Create: `radiant-app/src/features/home/services/HomeDashboardService.ts`
- Test: `radiant-app/src/features/home/services/HomeDashboardService.test.ts`
- Create: `radiant-app/src/features/progress/services/LearningStatsService.ts`
- Test: `radiant-app/src/features/progress/services/LearningStatsService.test.ts`
- Review: `radiant-app/src/features/content/services/LessonCatalogService.ts`
- Review: `radiant-app/src/features/journey/services/JourneyProgressService.ts`
- Review: `radiant-app/src/features/journey/services/JourneyRecommendationService.ts`

**Step 1: Definir o view model**

```ts
export type HomePrimaryAction =
  | { kind: 'learn'; lessonId: string; nodeId: string | null; blockId: string | null }
  | { kind: 'review'; dueCount: number }
  | { kind: 'journey' };

export interface HomeMissionViewModel {
  title: string;
  caseCount: number | null;
  durationMinutes: number | null;
  xpReward: number | null;
  action: HomePrimaryAction;
}

export interface HomeDashboardViewModel {
  greeting: string;
  avatarInitials: string | null;
  dateLabel: string;
  streakDays: number;
  totalXp: number;
  hearts: { current: number; maximum: number };
  dailyGoal: { completed: number; target: number };
  mission: HomeMissionViewModel | null;
  masteredCases: number | null;
  accuracyPercent: number | null;
  dueReviewCount: number;
}
```

**Step 2: Definir portas pequenas**

```ts
export interface HomeDashboardDependencies {
  now(): Date;
  locale: string;
  getDisplayName(): string | null;
  getCatalog(): Promise<{
    lessons: Array<{
      id: string;
      title: string;
      caseCount?: number;
      durationMinutes?: number;
      xpReward?: number;
    }>;
  }>;
  getNextActivity(): Promise<{
    lessonId: string;
    nodeId: string | null;
    blockId: string | null;
  } | null>;
  getDueLessonIds(): Promise<string[]>;
  getGamification(): Promise<{
    streakDays: number;
    totalXp: number;
    hearts: number;
    maxHearts: number;
  }>;
  getDailyGoal(): Promise<{ completedToday: number; goalPerDay: number }>;
  getLearningStats(): Promise<{
    masteredCases: number | null;
    accuracyPercent: number | null;
  }>;
}
```

**Step 3: Escrever testes vermelhos**

Cobrir:

1. revisão vencida tem prioridade quando a política determinar;
2. próxima aula elegível resolve título e rota;
3. nome ausente produz “Olá”, sem persona fictícia;
4. métricas ausentes permanecem `null`;
5. catálogo vazio oferece jornada;
6. data usa locale e relógio injetados;
7. falha remota não quebra o catálogo local.

Para `LearningStatsService`, cobrir agregação de resultados persistidos, tendência por janela, domínio por tópico e estado vazio. Não inferir domínio a partir de XP.

**Step 4: Executar**

```bash
npm --prefix radiant-app test -- --runInBand \
  src/features/home/services/HomeDashboardService.test.ts
```

Expected: FAIL porque o serviço ainda não existe.

**Step 5: Implementar o mínimo**

O serviço deve apenas combinar contratos existentes. Não importar React, Expo Router, AsyncStorage ou componentes.

**Step 6: Verificar e commit**

```bash
npm --prefix radiant-app test -- --runInBand \
  src/features/home/services/HomeDashboardService.test.ts
git add radiant-app/src/features/home
git commit -m "feat: define truthful home dashboard contract"
```

## Task 5: Integrar a Home e remover toda ficção

**Files:**

- Modify: `radiant-app/src/features/home/screens/HomeScreen.tsx`
- Create: `radiant-app/src/features/home/screens/HomeScreen.flow.test.tsx`
- Modify: `radiant-app/src/features/journey/services/JourneyNodeRouting.ts`
- Modify: `radiant-app/src/features/telemetry/TelemetryService.ts`

**Step 1: Escrever teste de fluxo**

O teste deve montar a tela com dependências determinísticas e provar:

- saudação real/neutra;
- missão real;
- CTA abre a rota do view model;
- métricas nulas não viram números fictícios;
- loading, empty e error têm label acessível;
- eventos de telemetria não carregam título clínico, e-mail ou identificador sensível.

**Step 2: Executar teste vermelho**

```bash
npm --prefix radiant-app test -- --runInBand \
  src/features/home/screens/HomeScreen.flow.test.tsx
```

**Step 3: Substituir estados fragmentados por um view model**

Manter onboarding, push e health score apenas se tiverem contratos comprovados; não misturar seu carregamento ao cálculo da missão.

**Step 4: Tornar a navegação explícita**

Usar `JourneyNodeRouting` ou um resolvedor central. Evitar cast genérico `as any`.

**Step 5: Verificar ausência de ficção**

```bash
rg -n "Dr\\. Alvarez|TUESDAY|DAY 24|Pulmonary nodules|8 cases|12 min|120 XP|Thoracic Imaging|23|84%" \
  radiant-app/src/features/home
```

Expected: nenhuma ocorrência apresentada como dado do usuário.

**Step 6: Verificar e commit**

```bash
npm --prefix radiant-app run quality
npm --prefix radiant-app test -- --runInBand
git add radiant-app/src/features/home radiant-app/src/features/journey radiant-app/src/features/telemetry
git commit -m "feat: connect home to real learning state"
```

## Task 6: Remover métricas fictícias de Progresso e normalizar copy

**Files:**

- Create: `radiant-app/src/ui/copy/pt-BR.ts`
- Test: `radiant-app/src/ui/copy/pt-BR.test.ts`
- Modify: `radiant-app/src/features/progress/services/LearningStatsService.ts`
- Modify: `radiant-app/src/features/progress/screens/ProgressScreen.tsx`
- Modify: `radiant-app/src/features/progress/screens/ProgressScreen.flow.test.tsx`
- Modify:
  - `radiant-app/src/features/home/screens/HomeScreen.tsx`
  - `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`
  - `radiant-app/src/features/rewards/screens/RewardScreen.tsx`
  - `radiant-app/src/features/galaxy/screens/MissionsScreen.tsx`
  - `radiant-app/src/app/onboarding/index.tsx`

**Step 1: Escrever testes de Progresso**

Provar:

- streak e calendário derivam de dias realmente ativos;
- precisão e tendência derivam de resultados persistidos;
- tópico sem evidência não aparece como dominado;
- zero tentativas produz estado vazio, não `84%`;
- XP não é traduzido para nível fictício;
- dados locais permanecem disponíveis sem sessão/API.

**Step 2: Executar o teste vermelho**

```bash
npm --prefix radiant-app test -- --runInBand \
  src/features/progress/services/LearningStatsService.test.ts \
  src/features/progress/screens/ProgressScreen.flow.test.tsx
```

**Step 3: Remover datasets estáticos**

Excluir `STREAK_DATA`, `ACCURACY_DATA`, `TOPICS`, streak `12 days`, delta `+12%`, nível fixo e contagens demonstrativas. Se o histórico persistido ainda não suporta uma métrica, mostrar estado vazio e abrir uma tarefa de schema; não sintetizar dados.

**Step 4: Inventariar copy visível**

```bash
rg -n "\"[A-Za-z][A-Za-z ']+\"|'[A-Za-z][A-Za-z ]+'" radiant-app/src radiant-app/app
```

Classificar: produto, conteúdo clínico, debug ou identificador.

**Step 5: Criar contrato de copy**

Centralizar apenas copy de interface compartilhada. Conteúdo clínico continua no catálogo editorial.

**Step 6: Testar termos críticos**

Provar consistência de “Revisar”, “Continuar”, “Concluído”, “Tentar novamente”, “Sem conexão” e estados vazios.

**Step 7: Implementar e verificar**

```bash
npm --prefix radiant-app test -- --runInBand src/ui/copy/pt-BR.test.ts
npm --prefix radiant-app run lint
```

**Step 8: Commit**

```bash
git add radiant-app/src radiant-app/app
git commit -m "feat: normalize product copy and locale"
```

## Task 7: Fortalecer tokens sem apagar os dois contextos visuais

**Files:**

- Modify: `radiant-app/src/ui/theme.ts`
- Modify: `radiant-app/src/ui/styles.ts`
- Create: `radiant-app/src/ui/semantic-colors.ts`
- Test: `radiant-app/src/ui/__tests__/semantic-colors.test.ts`
- Modify: `radiant-app/docs/ui/RADIANT_UI_KIT.md`

**Step 1: Definir tokens semânticos**

Cobrir:

- surface, elevated, inverted;
- text primary, secondary, on-accent, critical;
- border, focus, disabled;
- success, warning, error, information;
- galaxy/reward dark sem perder equivalência semântica.

**Step 2: Escrever testes**

Testar completude de chaves light/dark, ausência de `undefined` e pares de contraste críticos.

**Step 3: Migrar uma fatia vertical**

Começar por `AppButton`, `StatPill`, `ProgressRing` e Home. Não migrar toda a árvore em um commit.

**Step 4: Verificar**

```bash
npm --prefix radiant-app test -- --runInBand src/ui/__tests__
npm --prefix radiant-app run visual:qa:strict
```

**Step 5: Commit por fatia**

```bash
git commit -m "feat: add semantic color contracts"
git commit -m "refactor: migrate core controls to semantic tokens"
```

## Task 8: Instalar Storybook como bancada de componentes

**Files:**

- Modify: `radiant-app/package.json`
- Modify: `radiant-app/metro.config.js`
- Create: `radiant-app/.rnstorybook/main.ts`
- Create: `radiant-app/.rnstorybook/preview.tsx`
- Create: `radiant-app/src/components/ui/AppButton.stories.tsx`
- Create: `radiant-app/src/components/ui/StatPill.stories.tsx`
- Create: `radiant-app/src/components/ui/ProgressRing.stories.tsx`
- Create: `radiant-app/src/ui/characters/PixelIllustration.stories.tsx`

**Step 1: Revalidar compatibilidade oficial**

Consultar a documentação do Storybook for React Native no momento da execução. Todas as dependências Storybook devem compartilhar o mesmo major.

**Step 2: Inicializar**

```bash
cd radiant-app
npm create storybook@latest
```

Revisar o diff antes de aceitar mudanças automáticas.

**Step 3: Usar entrypoint swapping**

Configurar `withStorybook` no Metro. `STORYBOOK_ENABLED` ausente deve resultar em zero código Storybook no bundle normal.

**Step 4: Escrever histórias**

Para cada componente:

- default;
- pressed/disabled/loading;
- light/dark;
- texto longo;
- fonte ampliada;
- reduce motion;
- erro/sucesso quando aplicável.

**Step 5: Adicionar scripts**

```json
{
  "storybook": "STORYBOOK_ENABLED=true expo start",
  "storybook:ios": "STORYBOOK_ENABLED=true expo start --ios",
  "storybook:android": "STORYBOOK_ENABLED=true expo start --android"
}
```

**Step 6: Verificar bundle normal**

```bash
npm run storybook -- --non-interactive
npx expo export --platform ios
npx expo export --platform android
```

Inspecionar que Storybook não é importado no entrypoint de produção.

**Step 7: Commit**

```bash
git add package.json package-lock.json metro.config.js .rnstorybook src
git commit -m "feat: add isolated React Native component workshop"
```

## Task 9: Tornar acessibilidade um gate

**Files:**

- Create: `radiant-app/src/ui/accessibility/useReducedMotionPreference.ts`
- Test: `radiant-app/src/ui/accessibility/useReducedMotionPreference.test.ts`
- Modify: `radiant-app/src/ui/motion.ts`
- Modify: `radiant-app/src/components/ui/AppButton.tsx`
- Modify: componentes interativos das telas do fluxo crítico
- Create: `radiant-app/docs/ACCESSIBILITY_QA_V1.md`

**Step 1: Escrever testes por semântica**

Consultar controles por role/name/state. Cobrir:

- label e hint úteis;
- disabled/busy/selected;
- foco e ordem de leitura;
- erro não comunicado apenas por cor;
- botão com alvo mínimo e área de toque;
- reduce motion sem transições essenciais perdidas.

**Step 2: Implementar preferência de movimento**

Usar `AccessibilityInfo.isReduceMotionEnabled()` e subscription de mudança. O fallback deve ser estável em teste.

**Step 3: Aplicar no sistema de motion**

Quando reduce motion estiver ativo:

- remover parallax/bounce;
- reduzir entrada a mudança curta de opacidade ou nenhuma animação;
- manter confirmação de estado por texto/ícone.

**Step 4: Checklist manual**

- VoiceOver em iOS;
- TalkBack em Android;
- fonte ampliada;
- contraste WCAG 2.2 AA;
- alvos de toque;
- orientação e safe areas;
- light/dark;
- sem estado comunicado somente por cor ou motion.

**Step 5: Verificar**

```bash
npm --prefix radiant-app test -- --runInBand
npm --prefix radiant-app run quality
```

**Step 6: Commit**

```bash
git add radiant-app/src radiant-app/docs/ACCESSIBILITY_QA_V1.md
git commit -m "feat: add accessible interaction and reduced-motion contracts"
```

## Task 10: Cobrir o fluxo crítico com Maestro local

**Files:**

- Create: `radiant-app/.maestro/config.yaml`
- Create: `radiant-app/.maestro/onboarding-to-home.yaml`
- Create: `radiant-app/.maestro/learning-critical-path.yaml`
- Create: `radiant-app/.maestro/offline-relaunch.yaml`
- Modify: controles do fluxo para labels/testIDs estáveis
- Modify: `radiant-app/eas.json`
- Create: `radiant-app/docs/E2E_RUNBOOK.md`

**Step 1: Definir o contrato do harness**

O harness executável é Maestro CLI contra um dev build local com estado resetável. Não usar apenas pseudocódigo de E2E.

**Step 2: Criar fluxo mínimo**

```yaml
appId: com.ascendcreative.radiant
---
- launchApp:
    clearState: true
- assertVisible: "Começar"
- tapOn: "Começar"
- assertVisible: "Olá"
```

Adaptar labels ao produto aprovado.

**Step 3: Criar caminho crítico**

Onboarding → Home → próxima atividade → Quiz → Checkpoint → Reward → Progresso.

**Step 4: Criar cenário offline**

Provar que relaunch sem API conserva progresso e oferece conteúdo local.

**Step 5: Executar localmente**

```bash
maestro test radiant-app/.maestro/onboarding-to-home.yaml
maestro test radiant-app/.maestro/learning-critical-path.yaml
maestro test radiant-app/.maestro/offline-relaunch.yaml
```

Expected: PASS em ao menos um iPhone simulator e um Android emulator antes de CI.

**Step 6: Integrar EAS somente depois**

Adicionar perfil `e2e-test` sem segredos no repositório. Tratar o job Maestro de EAS Workflows como integração em evolução e custo separado.

**Step 7: Commit**

```bash
git add radiant-app/.maestro radiant-app/eas.json radiant-app/docs/E2E_RUNBOOK.md radiant-app/src
git commit -m "test: cover the local-first learning path on device"
```

## Task 11: Preparar Figma, handoff e governança do design system

**Files:**

- Create: `radiant-app/docs/ui/DESIGN_TOKEN_MAP.md`
- Create: `radiant-app/docs/ui/COMPONENT_STATE_MATRIX.md`
- Modify: `radiant-app/docs/ui/RADIANT_UI_KIT.md`

**Step 1: Exportar o mapa de tokens**

Cada token deve registrar:

- nome em código;
- nome em Figma;
- semântica;
- valor light/dark;
- componentes consumidores;
- status de depreciação.

**Step 2: Criar matriz de estados**

Para controles e cards críticos: default, pressed, focused, disabled, loading, empty, error, success, long text, reduce motion.

**Step 3: Construir componentes Figma**

Reproduzir o código entregue. Não criar uma segunda API visual em Figma.

**Step 4: Pilotar Code Connect**

Conectar primeiro `AppButton` e `ProgressRing`. Só expandir se nomes/props forem estáveis e o snippet representar a implementação real.

**Step 5: Revisão**

Comparar Figma, Storybook e simulador. Divergência deve gerar issue com owner, nunca correção silenciosa em apenas uma superfície.

**Step 6: Commit**

```bash
git add radiant-app/docs/ui
git commit -m "docs: define design token and component handoff contracts"
```

## Task 12: Validar aprendizagem e usabilidade com pessoas reais

**Files:**

- Create: `docs/research/RADIANT_USABILITY_PROTOCOL_V1.md`
- Create: `docs/research/RADIANT_TASK_SCRIPT_V1.md`
- Create: `docs/research/RADIANT_FINDINGS_TEMPLATE.md`
- Create: `docs/research/RADIANT_CLINICAL_REVIEW_CHECKLIST.md`

**Step 1: Recrutar 5 a 8 participantes-alvo**

Prioridade: estudantes de radiologia, tecnólogos ou residentes compatíveis com o ICP; incluir ao menos um revisor de domínio para segurança e precisão do conteúdo.

**Step 2: Definir tarefas observáveis**

- entender a missão do dia;
- iniciar o próximo conteúdo correto;
- responder e interpretar feedback;
- encontrar revisão pendente;
- compreender checkpoint e progresso;
- retomar após fechar o app;
- usar o fluxo com fonte ampliada/reduce motion em pelo menos uma sessão.

**Step 3: Medir**

- sucesso por tarefa;
- tempo e hesitações;
- erros de navegação;
- labels mal interpretados;
- SUS ao final;
- confiança percebida;
- análise temática do think-aloud.

SUS não substitui task success. Estudos de radiologia encontraram correlação fraca entre as duas medidas.

**Step 4: Avaliar aprendizagem**

Usar perguntas pré/pós ou retenção curta apenas como sinal exploratório. Separar:

- engajamento;
- recall;
- transferência para caso novo;
- profundidade de compreensão.

**Step 5: Priorizar achados**

Severidade:

- P0: risco clínico, perda de progresso ou bloqueio total;
- P1: atividade errada, label enganoso, resposta inacessível;
- P2: fricção importante;
- P3: polimento.

**Step 6: Gate**

Nenhuma expansão grande de gamificação antes de resolver P0/P1 e validar que recompensas não obscurecem o objetivo educacional.

**Step 7: Commit**

```bash
git add docs/research
git commit -m "docs: define Radiant usability and learning validation"
```

## Task 13: Pilotar Rive no Pixel com fallback mensurável

**Files:**

- Create: `docs/adr/ADR-00X-pixel-rive-pilot.md`
- Create: `radiant-app/src/ui/characters/RivePixelIllustration.tsx`
- Test: `radiant-app/src/ui/characters/RivePixelIllustration.test.tsx`
- Modify: `radiant-app/src/ui/characters/PixelIllustration.tsx`
- Modify: `radiant-app/src/config.ts`

**Step 1: Escrever ADR**

Estados permitidos: `idle`, `encouraging`, `celebrating`, `warning`. Definir eventos, fallback, budget e kill switch.

**Step 2: Escrever testes vermelhos**

- feature flag off usa asset estático;
- reduce motion usa frame estático;
- arquivo Rive ausente não quebra a tela;
- nenhum evento clínico ou progresso depende da animação.

**Step 3: Instalar com compatibilidade Expo**

Revalidar documentação e usar dev build. Não afirmar suporte no Expo Go.

**Step 4: Implementar um único ponto**

Pilotar na Recompensa ou Home, não em todas as telas.

**Step 5: Medir antes/depois**

- tamanho do bundle/app;
- cold start;
- JS/UI frame rate;
- memória;
- crash-free session;
- resposta com reduce motion.

**Step 6: Decidir**

Promover, manter experimental ou remover. A decisão deve citar métricas, não preferência estética.

**Step 7: Commit**

```bash
git add docs/adr radiant-app
git commit -m "experiment: pilot accessible Pixel state-machine motion"
```

## Task 14: Tornar ciência da aprendizagem um contrato de produto

**Files:**

- Create: `radiant-app/src/features/learning-policy/LearningPolicy.ts`
- Test: `radiant-app/src/features/learning-policy/LearningPolicy.test.ts`
- Modify: `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts`
- Modify: tipos e catálogo editorial relevantes
- Create: `docs/specs/LEARNING_POLICY_V1.md`

**Step 1: Especificar objetivos**

- recuperação ativa antes de mostrar resposta;
- feedback explicativo;
- repetição espaçada baseada em desempenho;
- revisões intercaladas;
- progressão por domínio, não apenas XP;
- conteúdo e imagem com proveniência/revisão.

**Step 2: Escrever testes do scheduler/política**

Cobrir erro, acerto com baixa confiança, acerto repetido, revisão vencida, clock injetado e migração de schema.

**Step 3: Implementar sem acoplar à UI**

O serviço retorna decisão e justificativa serializável; a UI só apresenta.

**Step 4: Verificar conteúdo**

```bash
node scripts/content/validate-foundation.mjs
npm --prefix radiant-app test -- --runInBand src/features/learning-policy
```

**Step 5: Gate editorial**

Os 42 itens `formatNeedsReview` devem ser revisados, aceitos com motivo ou removidos do caminho público antes de declarar o catálogo completamente aprovado.

**Step 6: Commit**

```bash
git add radiant-app/src/features/learning-policy radiant-app/src/features/spaced-repetition docs/specs
git commit -m "feat: codify retrieval and spaced-practice policy"
```

## Task 15: Tomar uma decisão explícita sobre a API

**Files:**

- Create: `docs/adr/ADR-00Y-api-runtime-strategy.md`
- Modify: `docs/ARCHITECTURE_STATE.md`
- Modify: `radiant-app/src/config.ts`
- Modify only if authorized later: `radiant-api/**`

**Step 1: Auditoria read-only**

Confirmar separadamente:

- DNS/TLS e respostas públicas;
- proxy e serviço no VPS;
- processo da API;
- banco/migrations;
- catálogo;
- auth/sync;
- scheduler/monitoramento;
- backups e capacidade de rollback.

Não reiniciar, corrigir, restaurar ou publicar nesta etapa.

**Step 2: Comparar três opções**

1. manter local-first e API desativada;
2. reativar somente catálogo remoto;
3. reativar catálogo + auth + sync.

Avaliar valor, privacidade, custo, manutenção, falha offline e risco operacional.

**Step 3: Registrar ADR**

Se a decisão for manter inativa, flags e docs devem refletir isso. Se for reativar, criar um plano operacional separado contendo backup verificado, dry-run, deploy, smoke público e rollback.

**Step 4: Testar contrato local-first**

```bash
npm --prefix radiant-app test -- --runInBand
maestro test radiant-app/.maestro/offline-relaunch.yaml
```

Expected: PASS independentemente da opção de API.

**Step 5: Commit**

```bash
git add docs/adr docs/ARCHITECTURE_STATE.md radiant-app/src/config
git commit -m "docs: decide the Radiant API runtime strategy"
```

## Task 16: Fechar beta real-device, observabilidade e release

**Files:**

- Create: `radiant-app/docs/REAL_DEVICE_MATRIX_V1.md`
- Create: `radiant-app/docs/PRIVACY_TELEMETRY_CONTRACT.md`
- Create: `radiant-app/docs/RELEASE_CHECKLIST_V1_3.md`
- Modify: `radiant-app/eas.json`
- Modify: `radiant-app/src/features/telemetry/TelemetryService.ts`
- Modify: `radiant-app/package.json`
- Modify: `radiant-app/package-lock.json`
- Modify: `radiant-app/docs/CHANGELOG.md`

**Step 1: Definir matriz**

Ao menos:

- iPhone pequeno e grande;
- Android compacto e médio;
- iOS/Android suportados;
- light/dark;
- fonte normal/ampliada;
- reduce motion;
- offline/reconexão;
- instalação limpa/upgrade.

**Step 2: Definir contrato de telemetria**

Proibir por padrão:

- e-mail;
- nome;
- conteúdo de resposta livre;
- título clínico;
- token;
- payload de API;
- identificador persistente sem base legal.

Definir allowlist de eventos e propriedades.

**Step 3: Medir performance**

Usar RN DevTools, Instruments/Android Profiler e, se útil, Flashlight. Registrar aparelho, build, cenário, cinco execuções e mediana.

**Step 4: Executar release gate**

```bash
export PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH"
npm --prefix radiant-app run quality
npm --prefix radiant-app test -- --runInBand
npm --prefix radiant-app run test:flows
npm --prefix radiant-api test
npm --prefix radiant-api run build
node scripts/content/validate-foundation.mjs
node scripts/qa/wave-1-smoke.mjs --skip-remote
```

Expected: tudo PASS.

**Step 5: Verificar versão cruzada**

`package.json`, `package-lock.json`, app config, changelog e metadata da loja devem identificar a mesma versão.

**Step 6: Smoke público**

Somente se a API tiver sido autorizada e reativada, executar endpoints públicos sem credenciais e sem payload sensível.

**Step 7: Commit e tag**

```bash
git add radiant-app docs scripts radiant-api
git commit -m "release: prepare Radiant v1.3 beta"
git tag -a v1.3.0-beta.1 -m "Radiant v1.3.0 beta 1"
```

Tag apenas após todos os gates e revisão do diff.

---

## 9. Critérios globais de pronto

- Nenhum dado fictício é apresentado como pertencente ao usuário.
- O fluxo principal funciona com API ausente.
- Todos os testes, lint, typecheck, API build/test e conteúdo passam.
- O visual QA estrito tem zero achado de alta prioridade não explicado.
- Componentes críticos estão isolados no Storybook.
- VoiceOver, TalkBack, fonte ampliada e reduce motion foram testados em dispositivo.
- Maestro cobre instalação limpa, fluxo de aprendizagem e relaunch offline.
- Copy clínica e de produto foi revisada.
- Telemetria segue allowlist e não envia PII/conteúdo clínico.
- Documentação descreve o estado real, inclusive limitações.
- Figma, Storybook e código usam o mesmo mapa de tokens/estados.
- Rive, API e EAS cloud permanecem opcionais até seus gates específicos.

## 10. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Novo polimento esconder dados fictícios | concluir Tasks 4–6 antes de expansão visual |
| Storybook alterar bundle de produção | entrypoint swapping e export de produção como gate |
| E2E flakey | estado resetável, labels estáveis, execução local antes de CI |
| Gamificação dominar o objetivo | medir aprendizagem e task success; gate de pesquisa |
| Movimento causar desconforto/jank | reduce motion, fallback estático e benchmark |
| Reativar API cedo demais | ADR + auditoria read-only + plano autorizado separado |
| Docs voltarem a divergir | docs contract integrado ao smoke |
| PII em evidência/telemetria | allowlist, scrub e exemplos sintéticos |
| Worktree perder artefatos não rastreados | resolver sua fonte antes de criar o ambiente |

## 11. Métricas de produto

Manter as métricas de negócio do PRD, mas adicionar métricas de qualidade:

- sucesso no fluxo crítico ≥ 90% após correções P0/P1;
- 0 label clínico enganoso;
- 0 perda de progresso em relaunch offline;
- crash-free sessions conforme meta definida antes do beta;
- tempo de início da próxima atividade;
- taxa de conclusão de sessão curta;
- retenção D1/D7/D30;
- acurácia e retenção posterior separadas de XP/streak;
- percentual de componentes críticos com histórias e estados acessíveis.

Não usar métricas de vaidade como volume de animações, quantidade de badges ou número de stories isoladamente.

## 12. Fontes da pesquisa

### Primárias e oficiais

1. [Expo Skills](https://github.com/expo/skills)
2. [Expo EAS Workflows: E2E tests with Maestro](https://docs.expo.dev/eas/workflows/examples/e2e-tests/)
3. [Expo debugging tools](https://docs.expo.dev/debugging/tools/)
4. [Maestro: React Native](https://docs.maestro.dev/platform-support/react-native)
5. [Storybook for React Native](https://storybookjs.github.io/react-native/docs/intro/)
6. [Storybook for React Native repository](https://github.com/storybookjs/react-native)
7. [React Native accessibility](https://reactnative.dev/docs/accessibility)
8. [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
9. [React Native profiling](https://reactnative.dev/docs/profiling)
10. [React Native Testing Library: querying](https://callstack.github.io/react-native-testing-library/12.x/docs/guides/how-to-query)
11. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
12. [Android accessibility: touch target size](https://support.google.com/accessibility/android/answer/7101858?hl=en)
13. [Apple Human Interface Guidelines: motion](https://developer.apple.com/design/human-interface-guidelines/motion)
14. [Rive React Native migration guide](https://rive.app/docs/runtimes/react-native/migration-guide)
15. [Rive with Expo](https://rive.app/docs/runtimes/react-native/adding-rive-to-expo)
16. [Rive file loading](https://rive.app/docs/runtimes/react-native/loading-rive-files)
17. [Figma MCP server](https://developers.figma.com/docs/figma-mcp-server/)
18. [Figma Code Connect for React](https://developers.figma.com/docs/code-connect/react/)
19. [Sentry React Native setup](https://docs.sentry.dev/platforms/react-native/manual-setup/)
20. [Flashlight documentation](https://docs.flashlight.dev/)

### Design, produto e referências

21. [Khan Academy color-system rebuild](https://blog.khanacademy.org/how-we-rebuilt-khan-academys-color-system-from-the-ground-up/)
22. [Wonder Blocks design system](https://www.designsystems.com/about-wonder-blocks-khan-academys-design-system-and-the-story-behind-it/)
23. [Duolingo Design](https://careers.duolingo.com/design)
24. [Hoshi Ludwig](https://hoshiludwig.com/)
25. [Mig Reyes](https://migreyes.com/)
26. [Val Head](https://valhead.com/)
27. [Design System University](https://designsystem.university/about)
28. [NHS App Design System](https://design-system.nhsapp.service.nhs.uk/)
29. [thoughtbot: Relias](https://thoughtbot.com/case-studies/relias)
30. [Mobbin documentation](https://docs.mobbin.com/)
31. [Maze mobile unmoderated studies](https://help.maze.co/articles/2253302011-testing-unmoderated-studies-on-mobile-devices)

### Evidência acadêmica e de domínio

32. [Spaced repetition in medical education: systematic review and meta-analysis](https://pubmed.ncbi.nlm.nih.gov/41601436/)
33. [Retrieval practice in classroom learning](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2019.00005/full)
34. [Gamification in medical education: depth-of-learning review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10765768/)
35. [Gamification in medical education: meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC10591086/)
36. [Usability evaluation of radiology apps](https://www.sciencedirect.com/science/article/abs/pii/S1546144015007206)
37. [Student-centered medical learning app development](https://pmejournal.org/articles/1223)
38. [Mobile apps in radiology education](https://www.sciencedirect.com/science/article/pii/S1687850725000652)
39. [Media-rich radiology apps and professional UX design](https://pure.johnshopkins.edu/en/publications/evaluation-and-comparison-of-two-media-rich-radiology-apps-regard/)
40. [Primer for medical and radiology app development](https://pmc.ncbi.nlm.nih.gov/articles/PMC10395180/)

## 13. Limitações da pesquisa

- Parte das páginas de ferramentas é material do próprio fornecedor; adoção deve ser confirmada por spike e métrica.
- Perfis de designers e estúdios servem como referência de prática, não como due diligence de contratação.
- Estudos de usabilidade em radiologia frequentemente usam amostras pequenas e alguns são anteriores ao stack atual.
- Preço, limites e disponibilidade de Maze, Mobbin, Figma e EAS podem mudar.
- Storybook skills têm baixa adoção relativa, embora sejam oficiais.
- Evidência de repetição espaçada apoia a estratégia educacional, mas não garante eficácia do Radiant sem validação própria.

## 14. Handoff

Plano completo e salvo. Duas formas de execução:

1. **Execução nesta tarefa**: usar `superpowers:executing-plans`, começar pela Onda 0, verificar cada gate e manter commits pequenos.
2. **Execução em tarefa separada**: abrir um worktree dedicado somente depois de resolver os artefatos não rastreados e executar por checkpoints.

Recomendação: começar pela Onda 0 nesta tarefa, sem tocar na VPS e sem instalar skills opcionais até aprovação explícita.
