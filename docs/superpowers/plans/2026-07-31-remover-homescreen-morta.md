# Remoção da HomeScreen morta e da flag ENABLE_LEARNING_ROAD — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover a `HomeScreen` clássica — que não renderiza em nenhum build distribuído — e a flag `ENABLE_LEARNING_ROAD`, que tem o mesmo valor em todos os perfis e finge uma configurabilidade que não existe.

**Architecture:** A aba Home é hoje `ENABLE_LEARNING_ROAD ? <JourneyHomeScreen /> : <HomeScreen />`. A flag tem default `true` em `src/config.ts` e está declarada `"true"` nos quatro perfis do `eas.json`. A remoção acontece em três movimentos que deixam o gate verde a cada commit: primeiro some a ramificação, depois o código morto e suas referências nos contratos estruturais, por último a flag e seus vestígios em scripts e configuração.

**Tech Stack:** React Native 0.81 / Expo SDK 54, Expo Router (rotas por arquivo em `src/app/`), Jest, contratos estruturais em Node puro (`radiant-app/scripts/*.test.mjs`), EAS Build.

## Quando executar

**Pós-beta.** Este plano toca o binário: executá-lo obriga a novo build e nova rodada de E2E. Ele foi escrito em 2026-07-31, no dia em que o primeiro AAB entrou em build e o closed test de 14 dias estava para começar, e a decisão registrada foi **executar no dia seguinte ao início do relógio**, quando os 12 testadores já estiverem dentro e a estabilidade da janela não depender mais de nada nosso.

## Decisão que este plano implementa

**Opção A**, escolhida pelo dono em 2026-07-31: apagar a `HomeScreen` e a flag, **mantendo `/review` viva**.

`HomeScreen.tsx:122` é o único `router.push('/review')` do código, então a rota dedicada de revisão fica sem ponto de entrada na interface. Ela **não** é apagada, por três motivos medidos naquela data:

1. `ReviewScreen` **funciona**: o `useReview` está ligado a `SpacedRepetitionService.getDueLessons()`, `LessonCatalogService`, `GamificationService`, fila de sync e telemetria. Não é protótipo. (O `features/review/data/mockData.ts` existe mas é órfão — nem a tela nem o hook o referenciam.)
2. Sendo rota de arquivo do Expo Router, `app/review.tsx` continua alcançável por deep link mesmo sem link na interface.
3. A pergunta "os usuários querem um modo de revisão dedicado além da revisão embutida na trilha?" tem um instrumento chegando — os 12 testadores. Apagar antes deles joga fora a medição.

**Gatilho explícito para revisitar:** se o feedback do beta pedir revisão avulsa, `/review` deixa de ser código morto e vira candidata a ativação (dar-lhe um ponto de entrada real), não a deleção.

## Global Constraints

- Toda alteração de arquivo passa por `loop-development`: `run start` → `context build` → `step begin` com **todos** os arquivos da task → editar → `loop validate` → `step finish` → `memory write` → `run close`. Nunca encadear `memory write && run close`.
- O escopo do step é **imutável** e só pode ser declarado a partir de `context_ready`. Declare a mais, nunca a menos.
- Um escritor por vez no projeto. `PROJECT_BUSY` significa outra sessão editando — não contornar.
- `npm run quality` (que é o validador `app-quality`) precisa sair `EXIT=0` ao fim de **cada** task. Nenhum estado intermediário pode deixar o gate vermelho.
- Nunca canalizar build ou suíte para `| tail`; filtrar por padrão explícito e ler o `EXIT`.
- Builds e suítes E2E rodam **fora** da janela de edição do Loop.
- `writePolicy.allowedRoots` cobre todos os caminhos deste plano (`src`, `scripts`, `docs`, `radiant-app/src`, `radiant-app/scripts`, `radiant-app/eas.json`). `radiant-app/.gitignore` **não** está coberto e devolveria `INVALID_SCOPE` — nenhuma task precisa dele.

## File Structure

| Arquivo | Responsabilidade | Destino |
| --- | --- | --- |
| `radiant-app/src/app/(tabs)/index.tsx` | rota da aba Home | modificar: perde a ramificação, passa a renderizar só `JourneyHomeScreen` |
| `radiant-app/src/features/home/HomeScreen.tsx` e 5 irmãos | tela clássica, seus tipos, serviço de dashboard e testes | **apagar o diretório inteiro** |
| `radiant-app/scripts/tab-bar-clearance-contract.test.mjs` | afirma que as telas roláveis usam `tabBarClearance` | modificar: sai a linha da `HomeScreen` |
| `radiant-app/scripts/visual-qa-policy.json` | tolerâncias de QA visual por arquivo | modificar: saem as duas entradas da `HomeScreen` |
| `radiant-app/src/config.ts` | flags de runtime | modificar: sai `ENABLE_LEARNING_ROAD` e seu comentário |
| `radiant-app/src/config/contracts.ts` | contrato de config remota | modificar: sai `enableLearningRoad` |
| `radiant-app/eas.json` | perfis de build | modificar: saem as 4 declarações da variável |
| `radiant-app/scripts/maestro-contract.test.mjs` | contrato dos flows E2E | modificar: sai a variável do ambiente esperado |
| `radiant-app/scripts/start-ios-v2.sh` | script de arranque local | modificar: sai o export e o argumento |

`features/review/`, `app/review.tsx` e `features/onboarding/` **não são tocados**. O `OnboardingService` tem um segundo consumidor vivo (`features/progress/services/IosHomologationService.ts:62`) e não morre com a `HomeScreen`.

---

### Task 1: Remover a ramificação da aba Home

A `HomeScreen` continua existindo no disco ao fim desta task — só deixa de ser alcançável pelo roteador. O gate segue verde porque os contratos que citam o arquivo continuam encontrando o arquivo.

**Files:**
- Modify: `radiant-app/src/app/(tabs)/index.tsx` (integral, 7 linhas)

**Interfaces:**
- Consumes: `JourneyHomeScreen` (default export de `@/src/features/journey/screens/JourneyHomeScreen`), inalterado.
- Produces: `HomeRoute` sem dependência de `AppConfig` nem de `features/home`.

- [ ] **Step 1: Abrir o run e declarar o escopo**

```bash
cd /Users/anderson/Developer/Radiant
loop run start --task "Remover a ramificacao ENABLE_LEARNING_ROAD da aba Home"
loop context build --run <runId>
loop step begin --run <runId> --files "radiant-app/src/app/(tabs)/index.tsx"
```

- [ ] **Step 2: Substituir o arquivo inteiro**

O conteúdo final de `radiant-app/src/app/(tabs)/index.tsx`, integral:

```tsx
import JourneyHomeScreen from '@/src/features/journey/screens/JourneyHomeScreen';

export default function HomeRoute() {
  return <JourneyHomeScreen />;
}
```

- [ ] **Step 3: Rodar o gate**

```bash
cd /Users/anderson/Developer/Radiant && loop validate --run <runId>
```

Esperado: `VALIDATION_PASSED`, nove validadores `passed`. Se `app-quality` falhar por import não usado de `AppConfig` ou `HomeScreen`, é porque o Step 2 não substituiu o arquivo inteiro — refaça.

- [ ] **Step 4: Fechar o step, gravar memória e fechar o run**

```bash
loop step finish --run <runId>
loop memory write --run <runId> --input <arquivo.json>
loop run close --run <runId>
```

O `summary` do candidato de memória tem teto de **1000 caracteres**. Os `evidenceIds` saem de `.loop/runs/<runId>/`. **Não encadear** `memory write && run close`.

---

### Task 2: Apagar `features/home/` e limpar os contratos que a citam

Esta task é atômica de propósito: apagar o diretório sem tirar as referências deixaria `tab-bar-clearance-contract` procurando um arquivo inexistente, e a política de QA visual com tolerâncias para um arquivo que não existe.

**Files:**
- Delete: `radiant-app/src/features/home/screens/HomeScreen.tsx`
- Delete: `radiant-app/src/features/home/screens/HomeScreen.flow.test.tsx`
- Delete: `radiant-app/src/features/home/home.types.ts`
- Delete: `radiant-app/src/features/home/services/HomeDashboardService.ts`
- Delete: `radiant-app/src/features/home/services/HomeDashboardService.test.ts`
- Delete: `radiant-app/src/features/home/services/createLocalHomeDashboardService.ts`
- Modify: `radiant-app/scripts/tab-bar-clearance-contract.test.mjs:17`
- Modify: `radiant-app/scripts/visual-qa-policy.json:15-16`

**Interfaces:**
- Consumes: nada. Task 1 já removeu o único import de `features/home` em código de produção (verificado em 2026-07-31: `src/app/(tabs)/index.tsx:3` era o único).
- Produces: nada. Nenhum outro módulo passa a existir.

- [ ] **Step 1: Confirmar que nada mais importa `features/home`**

```bash
cd /Users/anderson/Developer/Radiant/radiant-app && grep -rn "features/home" --include='*.ts' --include='*.tsx' src/ | grep -v "^src/features/home/"
```

Esperado: **nenhuma saída**. Se aparecer alguma linha, pare: apareceu um consumidor novo desde 2026-07-31 e o plano precisa de uma task para ele.

Controle na mesma invocação, para provar que o `grep` está funcionando:

```bash
cd /Users/anderson/Developer/Radiant/radiant-app && grep -rn "features/journey" --include='*.tsx' src/app/ | head -3
```

Esperado: **pelo menos uma linha** (a rota da aba). Se este também vier vazio, o problema é o instrumento, não o mundo.

- [ ] **Step 2: Abrir o run e declarar o escopo**

```bash
cd /Users/anderson/Developer/Radiant
loop run start --task "Apagar features/home e limpar os contratos que a citam"
loop context build --run <runId>
loop step begin --run <runId> \
  --files radiant-app/src/features/home/screens/HomeScreen.tsx \
  --files radiant-app/src/features/home/screens/HomeScreen.flow.test.tsx \
  --files radiant-app/src/features/home/home.types.ts \
  --files radiant-app/src/features/home/services/HomeDashboardService.ts \
  --files radiant-app/src/features/home/services/HomeDashboardService.test.ts \
  --files radiant-app/src/features/home/services/createLocalHomeDashboardService.ts \
  --files radiant-app/scripts/tab-bar-clearance-contract.test.mjs \
  --files radiant-app/scripts/visual-qa-policy.json
```

Em zsh, `$ARGS` **não** sofre word splitting. Se preferir montar por laço, use array: `args+=(--files "$f")` e chame `loop "${args[@]}"`.

- [ ] **Step 3: Remover a linha da HomeScreen do contrato de tab bar**

Em `radiant-app/scripts/tab-bar-clearance-contract.test.mjs`, apagar a linha 17, que é exatamente:

```js
  'src/features/home/screens/HomeScreen.tsx',
```

As demais entradas da lista (`ProgressScreen`, `MissionsScreen`, `GalaxyMapScreen`, `JourneyHomeScreen`) permanecem.

- [ ] **Step 4: Remover as duas tolerâncias de QA visual**

Em `radiant-app/scripts/visual-qa-policy.json`, apagar os dois objetos das linhas 15 e 16, que são as regras `R1` e `R2` cujo campo `"file"` é `"src/features/home/screens/HomeScreen.tsx"`. Cuidado com a vírgula do JSON: se a linha 16 for a última do array, a linha 14 não pode terminar com vírgula.

- [ ] **Step 5: Apagar os seis arquivos**

```bash
cd /Users/anderson/Developer/Radiant && rm -r radiant-app/src/features/home
```

- [ ] **Step 6: Rodar o gate**

```bash
cd /Users/anderson/Developer/Radiant && loop validate --run <runId>
```

Esperado: `VALIDATION_PASSED`. O `app-test` deve rodar **duas suítes a menos** (`HomeScreen.flow.test.tsx` e `HomeDashboardService.test.ts`); anote a contagem nova, porque o status canônico registra "32 suites, 110 testes" de 2026-07-30 e esse número passa a estar errado.

- [ ] **Step 7: Fechar o step, gravar memória e fechar o run**

Mesma sequência da Task 1, Step 4.

---

### Task 3: Remover a flag `ENABLE_LEARNING_ROAD`

**Files:**
- Modify: `radiant-app/src/config.ts` (o bloco de comentário e a linha da flag, hoje linhas 33–36)
- Modify: `radiant-app/src/config/contracts.ts:6`
- Modify: `radiant-app/eas.json` (linhas 15, 33, 46, 59)
- Modify: `radiant-app/scripts/maestro-contract.test.mjs:223`
- Modify: `radiant-app/scripts/start-ios-v2.sh` (linhas 10 e 19)

**Interfaces:**
- Consumes: nada. Depois da Task 1 e da Task 2, `AppConfig.ENABLE_LEARNING_ROAD` não tem leitor.
- Produces: `AppConfig` sem `ENABLE_LEARNING_ROAD`; `RuntimeRemoteConfig` sem `enableLearningRoad`.

- [ ] **Step 1: Confirmar que a flag não tem mais leitor**

```bash
cd /Users/anderson/Developer/Radiant && grep -rn "ENABLE_LEARNING_ROAD\|enableLearningRoad" --include='*.ts' --include='*.tsx' --include='*.mjs' --include='*.json' --include='*.sh' radiant-app/src radiant-app/scripts radiant-app/eas.json
```

Esperado: **exatamente as 8 ocorrências** listadas em "Files" acima, e nenhuma em código que lê o valor para decidir algo. Se aparecer um leitor novo, pare e trate-o antes.

- [ ] **Step 2: Abrir o run e declarar o escopo**

```bash
cd /Users/anderson/Developer/Radiant
loop run start --task "Remover a flag ENABLE_LEARNING_ROAD e seus vestigios"
loop context build --run <runId>
loop step begin --run <runId> \
  --files radiant-app/src/config.ts \
  --files radiant-app/src/config/contracts.ts \
  --files radiant-app/eas.json \
  --files radiant-app/scripts/maestro-contract.test.mjs \
  --files radiant-app/scripts/start-ios-v2.sh
```

- [ ] **Step 3: Remover a flag de `src/config.ts`**

Apagar o comentário e a declaração, hoje nas linhas 33–36:

```ts
    // A Learning Road é a home oficial (ADR 2026-07-27). O default acompanha a
    // produção de propósito: quando ele divergia, o E2E validava uma tela que o
    // build distribuído não renderizava. A flag permanece como kill switch.
    ENABLE_LEARNING_ROAD: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_LEARNING_ROAD, true),
```

As linhas vizinhas (`ENABLE_TELEMETRY_DEBUG_SCREEN` acima, o comentário `// kill switches (safety)` abaixo) permanecem.

- [ ] **Step 4: Remover do contrato de config remota**

Em `radiant-app/src/config/contracts.ts`, apagar a linha 6 da interface `RuntimeRemoteConfig`:

```ts
    enableLearningRoad: boolean;
```

- [ ] **Step 5: Remover as quatro declarações do `eas.json`**

Apagar as linhas 15, 33, 46 e 59, todas idênticas:

```json
        "EXPO_PUBLIC_ENABLE_LEARNING_ROAD": "true",
```

São os perfis `development`, `e2e-test`, `preview` e `production`. Confira a vírgula do JSON em cada bloco: se a linha apagada era a última do objeto `env`, a anterior não pode terminar com vírgula.

- [ ] **Step 6: Remover do contrato do Maestro**

Em `radiant-app/scripts/maestro-contract.test.mjs`, apagar a linha 223:

```js
    EXPO_PUBLIC_ENABLE_LEARNING_ROAD: 'true',
```

- [ ] **Step 7: Remover do script de arranque**

Em `radiant-app/scripts/start-ios-v2.sh`, apagar a linha 10:

```sh
export EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true
```

e o argumento na linha 19:

```sh
  "$EXPO_PUBLIC_ENABLE_LEARNING_ROAD" \
```

Confira que a continuação de linha (`\`) da linha anterior continua correta depois da remoção.

- [ ] **Step 8: Rodar o gate**

```bash
cd /Users/anderson/Developer/Radiant && loop validate --run <runId>
```

Esperado: `VALIDATION_PASSED`. O `api-typecheck` é quem pega uma remoção incompleta em `contracts.ts`.

- [ ] **Step 9: Fechar o step, gravar memória e fechar o run**

Mesma sequência da Task 1, Step 4.

---

### Task 4: Atualizar a documentação que descreve o que deixou de existir

**Files:**
- Modify: `radiant-app/README.md` (a seção "Learning Road", que descreve o plano de remoção como futuro)
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md` (B0.2 e B6, que citam a `HomeScreen` e o wizard)
- Modify: `docs/EXECUTION_STATUS_2026-07-29.md` (§6, "Uma tela inteira viaja no bundle sem nunca renderizar")

**Interfaces:**
- Consumes: os resultados das Tasks 1–3, incluindo a contagem nova de suítes/testes anotada na Task 2, Step 6.
- Produces: nada de código.

- [ ] **Step 1: Abrir o run e declarar o escopo**

```bash
cd /Users/anderson/Developer/Radiant
loop run start --task "Atualizar a documentacao apos a remocao da HomeScreen e da flag"
loop context build --run <runId>
loop step begin --run <runId> \
  --files radiant-app/README.md \
  --files docs/plans/2026-07-27-radiant-launch-roadmap.md \
  --files docs/EXECUTION_STATUS_2026-07-29.md
```

- [ ] **Step 2: Corrigir as afirmações em presente, preservando as datadas**

Regra que este repositório já aplica: **tabelas datadas registram o que foi medido naquele dia e não devem ser alteradas** — alterá-las falsificaria histórico. Corrija apenas o texto em presente. Concretamente:

- No `README.md`, a seção "Learning Road" descreve um plano futuro de remoção da `HomeScreen`. Ele foi executado: reescrever em passado, citando este plano.
- Em **B0.2** do roadmap, idem.
- Em **B6** do roadmap, atenção: a recomendação manda remover "o wizard `src/app/onboarding/*`" junto com a `HomeScreen`. **Esse wizard já não existia em 2026-07-31** — apenas `features/onboarding/OnboardingService`, que tem um segundo consumidor vivo (`IosHomologationService.ts:62`) e permanece. Corrigir a afirmação em vez de repeti-la.
- No status canônico §6, o parágrafo "Uma tela inteira viaja no bundle sem nunca renderizar em produção" passa a ser histórico: marcar como resolvido, com a data e o link deste plano.
- Registrar a contagem nova de suítes e testes do `npm run quality`, substituindo o "32 suites, 110 testes" onde ele aparecer **em presente**.

- [ ] **Step 3: Rodar o gate**

```bash
cd /Users/anderson/Developer/Radiant && loop validate --run <runId>
```

Esperado: `VALIDATION_PASSED`. O validador `docs-contract` é quem vigia o status canônico.

- [ ] **Step 4: Fechar o step, gravar memória e fechar o run**

Mesma sequência da Task 1, Step 4.

---

## Verificação final (fora da janela de edição)

Depois das quatro tasks, e **fora** de qualquer run aberto:

- [ ] **Gate completo sobre o estado commitado**

```bash
cd /Users/anderson/Developer/Radiant/radiant-app && npm run quality; echo "EXIT=$?"
```

Esperado: `EXIT=0`. Rodar com a árvore limpa (`git status --porcelain` sem arquivos rastreados modificados), para que o verde seja propriedade do repositório e não da árvore de trabalho de quem rodou.

- [ ] **E2E do fluxo crítico, uma plataforma por vez**

O host de 16 GB não sustenta simulador iOS e emulador Android juntos — rodar separado, com watchdog. Esperado: `3/3 Flows Passed` na plataforma escolhida. O ambiente do perfil `e2e-test` deixou de declarar `EXPO_PUBLIC_ENABLE_LEARNING_ROAD`; como a ramificação não existe mais, a home entregue é a mesma. **É exatamente isso que este passo verifica** — se o flow falhar em `boot-to-home`, a suspeita é a Task 1.

- [ ] **Novo build de produção**

```bash
cd /Users/anderson/Developer/Radiant/radiant-app && npx eas-cli build --platform android --profile production
```

O `versionCode` é governado pelo servidor (`appVersionSource: "remote"` + `autoIncrement`), então ele incrementa sozinho — não editar `app.json` para isso.
