# Execuções vermelhas — `QuizTopBar` mostra ∞ para assinante (2026-09-23)

Evidência da Task 8, fatia 3, da 1.4. Registrada como saída de execução, não
como prosa. Relatório em
[`2026-09-23-radiant-quiztopbar-infinito-relatorio.md`](2026-09-23-radiant-quiztopbar-infinito-relatorio.md).

Ambiente: Node `v20.20.2`, `radiant-app`, branch `feat/quiztopbar-infinito`
aberta de `fix/ask-to-buy-pendente` em `0b0283e`, árvore limpa fora dos quatro
arquivos da mudança. Comando de cada execução:

```bash
EXPO_NO_DOTENV=1 CI=1 npx jest --runInBand \
  src/features/quiz/components/QuizTopBar.test.tsx \
  src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx
```

## 1. Testes novos contra o código anterior (`0b0283e`)

Os dois testes do assinante falham porque não há ∞ nenhum:

```text
● LessonFlowScreen — economia de vidas › assinante vê ∞ no topo da lição, sem as vidas
  Unable to find an element with accessibility label: Vidas ilimitadas
● QuizTopBar — vidas por estado da assinatura › assinante vê ∞ e nenhum coração
  Unable to find an element with accessibility label: Vidas ilimitadas
Tests:       2 failed, 21 passed, 23 total
```

Os dois vermelhos têm a **mesma** causa — o componente ainda não tinha a
propriedade. Nessa etapa o vermelho do teste da tela não provava nada sobre a
ligação da tela, que é o defeito que ele existe para pegar.

## 2. Componente pronto, tela ainda sem a ligação

Com o `QuizTopBar` implementado e a `LessonFlowScreen` ainda sem passar
`unlimited`, o teste do componente fica verde e o da tela continua vermelho —
agora só pela ligação que falta:

```text
● LessonFlowScreen — economia de vidas › assinante vê ∞ no topo da lição, sem as vidas
  Unable to find an element with accessibility label: Vidas ilimitadas
Tests:       1 failed, 22 passed, 23 total
```

## 3. Mutações depois da mudança

As guardas "sem assinatura não vê ∞" e "assinante não vê coração" passavam
desde a primeira execução. Cada defeito que elas nomeiam foi reintroduzido e
desfeito; os arquivos voltaram idênticos (cópia e restauração do arquivo).

**A — todo mundo vê ∞** (`unlimited = true` como padrão do componente):

```text
● QuizTopBar — vidas por estado da assinatura › sem assinatura ativa vê as vidas e nenhum ∞
  Unable to find an element with accessibility label: 3 de 5 vidas
Tests:       1 failed, 22 passed, 23 total
```

**B — ∞ ao lado dos corações** (o `HeartsDisplay` renderizado também no ramo
ilimitado; é o defeito que o `HUD` tem hoje):

```text
● QuizTopBar — vidas por estado da assinatura › assinante vê ∞ e nenhum coração
  expect(received).toBeNull()   ← queryByTestId('hud-heart-0')
● LessonFlowScreen — economia de vidas › assinante vê ∞ no topo da lição, sem as vidas
  expect(received).toBeNull()   ← queryByTestId('hearts-display')
Tests:       2 failed, 21 passed, 23 total
```

**C — a tela liga ∞ para todos** (`unlimited={true}` na `LessonFlowScreen`):

```text
● LessonFlowScreen — economia de vidas › quem não assina vê as vidas no topo da lição, sem ∞
  Unable to find an element with testID: hearts-display
Tests:       1 failed, 22 passed, 23 total
```

**Restaurado:**

```text
Tests:       23 passed, 23 total
```

## 4. O que não tem vermelho novo aqui, e por quê

`pending` e `expired` não ganharam teste neste componente porque não chegam a
ele como estados próprios: chegam como `HeartsSnapshot` comum. O mapeamento de
assinatura para vidas já é guardado em
`src/features/subscription/SubscriptionService.test.ts` — "pedido pendente
também não toca as vidas na releitura", "direito expirado lido da loja deixa o
estado cheio", "direito reembolsado deixa o estado cheio mesmo antes da data de
expiração", "cache vencido sem releitura volta ao estado cheio, nunca
ilimitado". Esses testes passaram no gate desta mudança e não foram alterados.
