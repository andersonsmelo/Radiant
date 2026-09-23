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


## 3. Adendo — as duas flags sem leitor e a guarda de analytics

Decisão do dono, item 4 da ADR. A guarda de analytics passa sobre o código
atual (P0), porque o mecanismo já estava correto; o vermelho dela vem por
mutação. `TelemetryService.ts` e `config.ts` foram restaurados e conferidos por
`cmp`/`git diff --quiet`.

```text
### P0 guarda nova sobre o código atual (esperado: verde)
    product analytics
      ✓ o ponto de registro ainda existe com este nome — a guarda não passa vazia por renomeação (1 ms)
      ✓ nenhum código de produção registra adaptador de product analytics (99 ms)
Tests:       11 passed, 11 total
### P1 adaptador de analytics registrado em produção
      ✕ nenhum código de produção registra adaptador de product analytics (100 ms)
    +   "features/telemetry/TelemetryService.ts:456",
Tests:       1 failed, 10 passed, 11 total
### P2 método renomeado (a guarda não pode passar vazia)
      ✕ o ponto de registro ainda existe com este nome — a guarda não passa vazia por renomeação (2 ms)
Tests:       1 failed, 10 passed, 11 total
### P3 contraponto: chamada citada em comentário NÃO derruba
Tests:       11 passed, 11 total
### K1 flags apagadas, lista de exceções ainda antiga (esperado: vermelho em 'não envelhece')
    ✓ encontra as flags — a guarda não passa vazia (4 ms)
    ✓ nenhuma flag ENABLE_* é constante fixa: toda uma é acionável (1 ms)
    ✓ toda flag ENABLE_* tem leitor no código de produção, salvo as exceções nomeadas (175 ms)
    ✕ as exceções continuam sem leitor e existindo — a lista não envelhece (101 ms)
    ✓ ENABLE_REVIEW lê EXPO_PUBLIC_ENABLE_REVIEW, com padrão ligado
    ✓ nenhum módulo declara um ENABLE_* local fixo, fora do AppConfig (91 ms)
    +   "ENABLE_PRODUCT_ANALYTICS",
    +   "ENABLE_REVENUECAT",
Tests:       1 failed, 5 passed, 6 total
### K2 flag de ambiente sem leitor reintroduzida (ENABLE_REVENUECAT)
    ✕ toda flag ENABLE_* tem leitor no código de produção (170 ms)
    +   "ENABLE_REVENUECAT",
Tests:       1 failed, 4 passed, 5 total
```

Leitura: P1 derruba a guarda ao registrar um adaptador de verdade; P2 prova que
ela não passa vazia se o método for renomeado; P3 é o contraponto do
comentário. K1 é o vermelho previsto da própria guarda de kill switches:
apagadas as flags, a lista de exceções acusou as duas como vencidas, e só então
a lista foi removida. K2 mostra que a regra, agora sem exceção, pega uma flag
sem leitor reintroduzida.
