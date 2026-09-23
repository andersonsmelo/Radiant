# Execuções vermelhas — kill switches reais (2026-09-23)

Evidência da [ADR de decisões de 2026-09-23](../../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md),
item 3. Registrada como saída de execução, não como prosa ("falhou antes" é
inauditável: AGENTS.md, "Quatro lições sobre GUARDAS", regra 4).

Ambiente: Node `v20.20.2`, `radiant-app`,
`npx jest --runInBand <arquivo>`.

## 1. A guarda contra o código anterior à mudança (`HEAD` = `1fae7c6`)

Guarda escrita **antes** da correção e rodada sem mexer no código de produção.
Os quatro testes falham, cada um pelo defeito que nomeia. Saída reproduzida numa
worktree limpa em `1fae7c6`, com a guarda final copiada para ela:

```text
    ✓ encontra as flags — a guarda não passa vazia (5 ms)
    ✕ nenhuma flag ENABLE_* é constante fixa: toda uma é acionável (2 ms)
    ✕ toda flag ENABLE_* tem leitor no código de produção, salvo as exceções nomeadas (169 ms)
    ✓ as exceções continuam sem leitor e existindo — a lista não envelhece (103 ms)
    ✕ ENABLE_REVIEW lê EXPO_PUBLIC_ENABLE_REVIEW, com padrão ligado
    ✕ nenhum módulo declara um ENABLE_* local fixo, fora do AppConfig (93 ms)
Tests:       4 failed, 2 passed, 6 total

    +   "ENABLE_REVIEW",
    +   "ENABLE_GAMIFICATION",
    +   "ENABLE_ONBOARDING",
    +   "ENABLE_HEURISTICS",
    +   "ENABLE_GAMIFICATION",
    +   "ENABLE_ONBOARDING",
    +   "ENABLE_HEURISTICS",
    +   "features/onboarding/OnboardingService.ts: ENABLE_ONBOARDING",
```

`ENABLE_PRODUCT_ANALYTICS` e `ENABLE_REVENUECAT` apareceram na primeira versão
da guarda como flags sem leitor. Estão fora da decisão do dono e viraram
exceções nomeadas, com motivo, no próprio teste.

## 2. Mutações depois da correção

Cada defeito foi reintroduzido e desfeito em seguida. `config.ts` e
`OnboardingService.ts` foram conferidos por `cmp` contra a cópia anterior, e
`RatingPromptService.ts` por `git diff --quiet`: os três voltaram idênticos.

```text
### M1 ENABLE_REVIEW com padrão false
    ✕ ENABLE_REVIEW lê EXPO_PUBLIC_ENABLE_REVIEW, com padrão ligado (2 ms)
Tests:       1 failed, 5 passed, 6 total
### M2 ENABLE_REVIEW lendo variável errada
    ✕ ENABLE_REVIEW lê EXPO_PUBLIC_ENABLE_REVIEW, com padrão ligado (2 ms)
Tests:       1 failed, 5 passed, 6 total
### M3 constantes fixas reintroduzidas
    ✕ nenhuma flag ENABLE_* é constante fixa: toda uma é acionável (2 ms)
    ✕ toda flag ENABLE_* tem leitor no código de produção, salvo as exceções nomeadas (185 ms)
    ✕ ENABLE_REVIEW lê EXPO_PUBLIC_ENABLE_REVIEW, com padrão ligado
Tests:       3 failed, 3 passed, 6 total
### M4 const local ENABLE_ONBOARDING reintroduzida
    ✕ nenhum módulo declara um ENABLE_* local fixo, fora do AppConfig (90 ms)
Tests:       1 failed, 5 passed, 6 total
### M5 contraponto: a regra citada em comentário NÃO derruba
Tests:       6 passed, 6 total
### M6 RatingPromptService ignora ENABLE_REVIEW
    ✕ does not prompt when the ENABLE_REVIEW kill switch is off
Tests:       1 failed, 2 passed, 3 total
### M7 exceção ENABLE_REVENUECAT ganha leitor
    ✕ as exceções continuam sem leitor e existindo — a lista não envelhece (102 ms)
    +   "ENABLE_REVENUECAT",
Tests:       1 failed, 5 passed, 6 total
```

Leitura: M1 a M4 e M7 derrubam a guarda de contrato exatamente no teste que
nomeia o defeito. M5 é o contraponto: a regra citada num comentário não derruba
a guarda de AST. M6 derruba o teste de comportamento do `RatingPromptService`.
