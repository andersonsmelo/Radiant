# Execuções vermelhas — aposentar o contador legado de vidas (2026-09-23)

Evidência da Task 8, item 3d, da 1.4. Registrada como saída de execução, não
como prosa. Relatório em
[`2026-09-23-radiant-aposenta-vidas-legado-relatorio.md`](2026-09-23-radiant-aposenta-vidas-legado-relatorio.md).

Ambiente: Node `v20.20.2`, `radiant-app`, branch `refactor/aposenta-vidas-legado`
aberta de `origin/main` em `def864f`, `EXPO_NO_DOTENV=1 CI=1 npx jest
--runInBand <arquivo>`.

## 1. `/quiz` — testes novos contra o código de `def864f`

```text
● QuizScreen — vidas vêm do heartsRepository › o topo mostra a contagem do heartsRepository
  Unable to find an element with accessibility label: 3 de 5 vidas
● QuizScreen — vidas vêm do heartsRepository › errar gasta uma vida do heartsRepository e vibra a perda
  Unable to find an element with accessibility label: 3 de 5 vidas
● QuizScreen — vidas vêm do heartsRepository › acertar não gasta vida
  Unable to find an element with accessibility label: 3 de 5 vidas
● QuizScreen — vidas vêm do heartsRepository › assinante vê ∞ no topo e nenhum coração
  Unable to find an element with accessibility label: Vidas ilimitadas
● QuizScreen — vidas vêm do heartsRepository › assinante que erra não sente a vibração de vida perdida
  Unable to find an element with accessibility label: Vidas ilimitadas
Tests:       5 failed, 20 passed, 25 total
```

Os cinco param na mesma primeira asserção: a contagem e o ∞ não vêm do
`heartsRepository`. Por isso o gasto foi implementado **em duas etapas**. Com
só a leitura pronta, o teste do gasto ficou vermelho pelo gasto, sozinho:

```text
● QuizScreen — vidas vêm do heartsRepository › errar gasta uma vida do heartsRepository e vibra a perda
  expect(jest.fn()).toHaveBeenCalledTimes(expected)
  Received number of calls: 0
  > 892 |     await waitFor(() => expect(heartsRepository.spend).toHaveBeenCalledTimes(1));
Tests:       1 failed, 24 passed, 25 total
```

## 2. Home — testes novos contra `def864f`

```text
● HomeScreen › assinante vê ∞ no lugar da contagem
  Unable to find an element with text: ∞
● HomeDashboardService › as vidas vêm de getHearts, não do snapshot de gamificação
  -   "current": 2,
  +   "current": 5,
● HomeDashboardService › assinante chega à tela como ilimitado
  -   "unlimited": true,
  +   "current": undefined,
Tests:       3 failed, 8 passed, 11 total
```

## 3. `GamificationService` — teste novo contra `def864f`

```text
● GamificationService — vidas aposentadas › o snapshot não expõe mais vidas
  Expected path: not "hearts"
  Received value: 5
Tests:       1 failed, 3 passed, 4 total
```

O blob gravado tinha `hearts: 2`, e o snapshot devolveu **5**: a recarga
passiva antiga reenchia as vidas na leitura e **gravava** no disco. É mais um
efeito do contador que sai junto com ele.

## 4. Mutações depois da mudança

Guardas que passavam desde a primeira execução, ou cujo vermelho parava numa
asserção anterior. Cada defeito foi injetado e desfeito por script; o arquivo
voltou com o mesmo SHA-256 (asserção no próprio script).

| # | Defeito injetado | Guarda que reprovou |
|---|---|---|
| M1 | acertar também gasta (`if (journeyCompletionMode !== 'review')`) | `acertar não gasta vida` |
| M2 | revisão também cobra (`if (!feedbackResult.isCorrect)`) | `o modo revisão não cobra vida ao errar` |
| M3 | vibra mesmo sem queda (`if (true)`) | `assinante que erra não sente a vibração de vida perdida` |
| M4 | nunca vibra a perda (sem `hapticLifeLost()`) | `errar gasta uma vida do heartsRepository e vibra a perda` |
| M5 | Home sempre ∞ | `mostra as vidas como atual/máximo para quem não assina, sem ∞` |
| M6 | a gravação apaga os campos legados do blob | `os campos legados já gravados sobrevivem a uma gravação: voltar à 1.3.1 não perde nada` |
| M7 | a Jornada volta a ler `gamification?.hearts` | `tsc`: `JourneyHomeScreen.tsx(168,50): error TS2339: Property 'hearts' does not exist on type 'GamificationSnapshot'.` |

Cada uma de M1–M6 derrubou **só** o teste listado (`Tests: 1 failed`). M7 é a
guarda estrutural: com os campos fora do tipo, qualquer leitor novo do
contador legado quebra o typecheck do gate.
