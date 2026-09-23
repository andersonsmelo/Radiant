# Relatório — 1.4, Task 8, item 3d: aposentar o contador legado de vidas (2026-09-23)

O `GamificationService` guardava um contador de vidas ao lado do
`heartsRepository`. Ele nunca soube da assinatura, e o caminho vivo (`/learn`)
nunca o descontava. Decisão do dono em 2026-09-23: a `/quiz` passa a usar o
`heartsRepository`, e o contador sai. Branch `refactor/aposenta-vidas-legado`,
aberta de `origin/main` em `def864f`. Run do Loop
`run-1790189547896-0aaaba1b`.

## O que mudou

| Onde | Antes | Depois |
|---|---|---|
| `/quiz` (`useQuiz`, `QuizScreen`) | lia `GamificationService.getSnapshot().hearts` e gastava com `loseHeart()` | lê e gasta pelo `heartsRepository`, e passa `unlimited` ao `QuizTopBar`: o assinante vê ∞ |
| Home (`HomeDashboardService`, `HomeScreen`) | contagem vinda do snapshot de gamificação | nova dependência `getHearts` (do `heartsRepository`), com `unlimited`; a pílula mostra ∞ |
| `JourneyHomeScreen` | reserva `gamification?.hearts ?? 5` | `MAX_HEARTS` |
| `GamificationService` | `loseHeart`, `refillHearts`, `canStartLesson`, recarga passiva, campos no snapshot | nada disso; XP e sequência apenas |
| `types/gamification.ts` | `hearts`, `maxHearts`, `heartsLastRefillAt`, `heartsNextRefillAt` | fora dos tipos |

O que **não** mudou, de propósito:

- **O blob já gravado.** Quem instalou a 1.3.1 tem `hearts`, `maxHearts` e
  `heartsLastRefillAt` em `radiant:gami:v1`. O serviço carrega com
  `{...DEFAULT_STORE, ...parsed}` e regrava o objeto inteiro, então esses
  campos **continuam no disco, intocados**. Nada os lê. Voltar à 1.3.1 não
  perde nada. Um teste guarda isso (mutação M6).
- **A `/quiz` não bloqueia com zero vidas.** Antes não bloqueava, e o dono não
  decidiu que deveria. Ela só passou a descontar do mesmo cofre.
- A fixture `v131Fixtures.ts` guarda os campos antigos porque representa
  dados da 1.3.1.

## Conferido antes de apagar

- A migração 1.4 (`StorageMigrationService`) copia a chave
  `LEGACY_GAMIFICATION` inteira, sem ler campos.
- O backup (`LocalProgressAdapter`) lê do `GamificationService` só
  `totalXp` e `streakDays`; as vidas ele lê da chave do `heartsRepository`.
- Leitores de produção do contador depois da mudança: **zero**. O `tsc` é a
  guarda (mutação M7).

## Medido

- Vermelhos e mutações em
  [`2026-09-23-radiant-aposenta-vidas-legado-vermelhos.md`](2026-09-23-radiant-aposenta-vidas-legado-vermelhos.md):
  12 testes novos. Nove falharam contra o código de `def864f` (5 da `/quiz`,
  3 da Home, 1 do serviço); os três que passavam lá (revisão não cobra,
  Home sem ∞, campos legados sobrevivem) e três asserções que o primeiro
  vermelho mascarava ganharam vermelho próprio por mutação — sete ao todo,
  incluindo a do `tsc` —, e o gasto da `/quiz` foi isolado em duas etapas.
- Gate: `EXPO_NO_DOTENV=1 npm run quality`, Node `v20.20.2` → **exit 0, 134
  suítes / 1224 testes** (1212 + os 12 novos); lint 0 erros / 26 avisos, o
  mesmo total de antes; Visual QA sem regressão.
- Com a CPU presa aos núcleos de eficiência (`/usr/sbin/taskpolicy -b`,
  `--no-cache`), os 13 arquivos de teste alterados passam: 145 testes. A
  checagem existe por causa da falha de estreia no CI da PR #18.

## Não verificado

- A `/quiz` só abre por deep link (`radiantapp://quiz?...`); nada no app
  aponta para ela. Não foi aberta em aparelho.
- A Home só aparece com o kill switch `ENABLE_LEARNING_ROAD` desligado. Não
  foi vista em aparelho.
