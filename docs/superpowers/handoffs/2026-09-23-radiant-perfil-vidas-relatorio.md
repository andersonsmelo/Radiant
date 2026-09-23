# Relatório — duas fontes de vidas: Perfil e recompensa passam para a fonte viva (2026-09-23)

**Branch:** `claude/sharp-dijkstra-747d12`, criada sobre `feat/quiztopbar-infinito`
em `0b0283e`. Nessa data a `feat/quiztopbar-infinito` estava **18 commits à
frente de `origin/main`** e existia só localmente. **Não mergeado, não empurrado,
não construído.**
**Run do Loop:** `run-1790175973846-afe8a064`, aberto na worktree.
**Vermelhos:** [`2026-09-23-radiant-perfil-vidas-vermelhos.md`](2026-09-23-radiant-perfil-vidas-vermelhos.md).

## O defeito

O caminho vivo desconta vidas no `heartsRepository` (`src/features/hearts/`),
que conhece a assinatura (`unlimitedUntil`, status `'unlimited'`). A seção
**Vidas** do Perfil (`MissionsScreen` embutida por `ProfileScreen`) lia
`GamificationService.getSnapshot().hearts`, um contador legado que o caminho
vivo nunca desconta. Resultado medido: o Perfil mostrava sempre 5 vidas,
divergia do HUD da Jornada e nunca mostrava ∞ para o assinante.

**A enumeração achou um segundo leitor vivo com o mesmo defeito:** o HUD do
`RewardScreen` (`/reward`). A rota é alcançável porque os nós de recompensa
estão na trilha de produção (`JourneyDefinitionService`, `defaultTrack`). O dono
decidiu corrigi-lo junto.

## Enumeração — quem lê e quem escreve o contador legado

Medido em 2026-09-23 sobre `0b0283e`, em `radiant-app/src`. O comando está na
FILA; ele é um **superconjunto**, porque casa também a prop `maxHearts` do
`HUD`. Cada linha abaixo foi classificada pela origem do valor.

### Escritores

| Onde | O que faz | Alcance |
| --- | --- | --- |
| `GamificationService.loseHeart` | −1 no legado | chamado só por `useQuiz.ts:144` → `QuizScreen` → rota `/quiz`, **sem entrada no app**, só por deep link |
| `GamificationService.refillHearts` | enche o legado | **nenhum chamador** |
| `GamificationService.canStartLesson` | lê o legado e aplica a recarga | **nenhum chamador** |
| `applyPassiveHeartRefill` (privado) | recarga por tempo, grava | roda em todo `getSnapshot()`, ou seja, em toda tela que lê XP ou sequência |
| `DEFAULT_STORE` / `reset()` | inicializa com 5 | `reset()` só pelo `IosHomologationService` (ferramenta de dev) |

### Leitores

| Onde | Estado |
| --- | --- |
| `MissionsScreen` (Perfil), seção Vidas | ✅ **corrigido nesta entrega** |
| `RewardScreen`, HUD | ✅ **corrigido nesta entrega** |
| `useQuiz` / `QuizScreen` (`/quiz`) | legado, só por deep link — sai com a aposentadoria |
| `HomeScreen` via `createLocalHomeDashboardService` → `HomeDashboardService` (`hearts.current/maximum`) | só renderiza com `ENABLE_LEARNING_ROAD` desligado (kill switch; padrão ligado e ligado nos quatro perfis do `eas.json`). Alcançável se o switch for acionado |
| `JourneyHomeScreen:166-167` | fallback: `hearts?.count ?? gamification?.hearts ?? 5` antes de o repositório responder, e `maxHearts={gamification?.maxHearts ?? 5}` sempre. Na prática vale 5 |

### Não leem, conferido no código

- `LessonFlowScreen`, `CheckpointScreen` e `ReviewScreen`: vidas do
  `heartsRepository`; `maxHearts={5}` é literal. Do `GamificationService` só
  usam XP.
- `ProfileScreen`: só `streakDays` e `totalXp`. `ProgressScreen`,
  `LessonOutcomeService` e `useReview`: XP e sequência.
- **Backup no iCloud** (`LocalProgressAdapter`): do `GamificationService` lê só
  `totalXp`/`streakDays` e absorve só esses dois (`absorbBackup`). As vidas do
  backup vêm de `STORAGE_KEYS.HEARTS` (`lastRefillAt`), que é a fonte viva.
- **Migração 1.4** (`StorageMigrationService`): guarda e restaura o blob
  `radiant:gami:v1` **inteiro e opaco**, sem ler os campos. O `v131Fixtures`
  tem `hearts: 2` só como conteúdo do blob.

**Conclusão:** nenhum dado persistido depende dos campos legados. Aposentá-los
é trabalho só de código. Os campos que sobrarem no blob de quem atualizar são
inertes se nada os ler.

## O que mudou

- `MissionsScreen.tsx`: a seção Vidas lê `heartsRepository.getSnapshot(Date.now())`
  no mesmo `load` que já roda no foco. Por estado:
  - **Assinante** (`status === 'unlimited'`): **∞** e "Assinante: ilimitadas".
    Sem corações, sem relógio, sem aviso, como pedem a spec §5.1 (ILIMITADA:
    "corações somem") e a §3.5 (Perfil: "assinante: ilimitadas"). O rótulo de
    acessibilidade é "Vidas ilimitadas", o mesmo do HUD e da fatia do
    `QuizTopBar`. A cor do ∞ é `heartFull`, também a mesma da fatia.
  - **Relógio**: `nextRefillAt` do snapshot. Ao zerar, recarrega pelo mesmo
    `load`.
  - **Aviso de bloqueio**: segue `status === 'empty'`, não a contagem.
  - **Antes da leitura**: nenhum coração. Desenhar 5 com o snapshot ainda
    nulo piscaria vidas cheias para quem tem 0 ou para o assinante.
- `RewardScreen.tsx`: o HUD recebe `heartsSnapshot` do `heartsRepository`, no
  mesmo padrão do `JourneyHomeScreen`. O `HUD` já sabia mostrar ∞. Sem
  `onHeartsPress`, porque a folha só aparece no bloqueio (spec §5.1).
- O `GamificationService` continua sendo a fonte de XP e sequência nas duas
  telas.

## Evidência

- **Vermelhos**: 7 testes novos contra `HEAD`, e todos falham. Uma mutação
  depois da correção reprova na asserção que nomeia o defeito. Saídas no
  [arquivo de vermelhos](2026-09-23-radiant-perfil-vidas-vermelhos.md).
- **Gate**: `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, Node
  `v20.20.2`, saiu 0. **134 suítes / 1181 testes**, lint 0 erros / 26 avisos,
  Visual QA com 0 regressões. É a suíte inteira, não só as tocadas.
- O teste do Perfil usa o `heartsRepository` **real** sobre o storage em
  memória do `async-storage-mock`, sem dublê do repositório. O do
  `RewardScreen` também usa o repositório real, com o `getItem` do mock
  existente do arquivo respondendo a chave `HEARTS`.

## Decisão do dono (2026-09-23)

1. **O contador legado sai depois, em run próprio.** O bloqueio é o commit da
   fatia do `QuizTopBar` ∞, aberta e não comitada no checkout principal
   (`feat/quiztopbar-infinito`), que mexe em `quiz/` e `LessonFlowScreen`. O
   único escritor do legado mora em `useQuiz` e entraria em conflito.
2. **O `RewardScreen` foi corrigido junto.**

## Para o run da aposentadoria

- Decidir o que `/quiz` faz com vidas: passar a `heartsRepository.spend` ou
  deixar de contar. A spec §5.2 só desconta em "lição nova ou checkpoint", e
  `/quiz?mode=review` é revisão.
- Remover `hearts`/`maxHearts`/`heartsLastRefillAt` de `GamificationStore` e
  `hearts`/`maxHearts`/`heartsNextRefillAt` de `GamificationSnapshot`. Remover
  também `loseHeart`, `refillHearts`, `canStartLesson`,
  `applyPassiveHeartRefill` e `HEART_REFILL_INTERVAL_MS`.
- `getOrLoadStore` faz `{ ...DEFAULT_STORE, ...parsed }`, então os campos
  antigos do blob continuariam no cache e seriam regravados a cada save. Para
  que saiam do disco, grave só os campos conhecidos.
- `HomeDashboardService` e `home.types.ts`: `hearts` passa a vir do
  `heartsRepository`, ou sai do painel. `HomeScreen` é o fallback do kill
  switch, então não é código morto.
- `JourneyHomeScreen`: trocar os dois fallbacks legados por `MAX_HEARTS`.
- Os mocks de teste que devolvem `hearts`/`maxHearts` no snapshot de
  gamificação (Checkpoint, LessonFlow, Journey, Progress, Profile, Review, Quiz
  e `LessonOutcomeService.test`) precisam acompanhar a mudança do tipo.

## Ambiente, para reproduzir

A worktree não tinha `node_modules`. Foi usado um link simbólico para
`radiant-app/node_modules` do checkout principal, com o mesmo
`package-lock.json` (conferido por hash). A regra `node_modules/` do
`.gitignore` **não casa com link simbólico**, porque a barra final só vale
para diretório. Por isso entrou uma linha `/radiant-app/node_modules` em
`.git/info/exclude`. Os dois são removidos no fim da sessão.
