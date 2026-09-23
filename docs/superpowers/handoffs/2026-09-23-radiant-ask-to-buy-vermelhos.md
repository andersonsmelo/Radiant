# Execuções vermelhas — Ask to Buy pendente nunca trava (2026-09-23)

Evidência da [ADR de decisões de 2026-09-23](../../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md),
item 5. Registrada como saída de execução, não como prosa.

Ambiente: Node `v20.20.2`, `radiant-app`,
`npx jest --runInBand src/features/subscription`.

## 1. Testes novos contra o código anterior à mudança (`HEAD` = `71b3f92`)

Testes escritos antes da correção. Quatro falham, cada um pelo defeito que
nomeia: o pendente não tinha prazo, a tela escondia planos e Restaurar, e o
cartão ficava sem botão.

```text
● SubscriptionScreen — estados › Ask to Buy avisa o pedido e mantém planos e Restaurar à mão
● SubscriptionScreen — estados › pedido com mais de 24 h não é mais anunciado: a tela volta ao normal
● SubscriptionCard › pendente informa que aguarda aprovação e continua abrindo a tela
● SubscriptionService — compra e restauração › o pendente vale 24 h a partir do pedido e depois deixa de existir
Tests:       4 failed, 81 passed, 85 total
```

Motivo do vermelho do serviço — com 24 h cravadas o estado ainda era pendente:

```text
- Expected  - 1
+ Received  + 2
-   "kind": "none",
+   "kind": "pending",
+   "since": "2026-09-14T12:00:00.000Z",
> 202 |         expect(await service.getStatus(AGORA + DIA)).toEqual({ kind: 'none' });
```

O teste "pedido novo depois do vencido reabre as 24 h" já passava antes: um
pedido novo sempre sobrescreveu `pendingSince`. Ele fica para garantir que o
prazo não quebre isso.

## 2. Mutações depois da correção

Cada defeito foi reintroduzido e desfeito; os três arquivos voltaram idênticos
(`cmp`). "● Console" é o agrupamento de log do Jest e foi omitido.

```text
### A1 prazo errado (48 h)
  ● SubscriptionScreen — estados › pedido com mais de 24 h não é mais anunciado: a tela volta ao normal
  ● SubscriptionService — compra e restauração › o pendente vale 24 h a partir do pedido e depois deixa de existir
Tests:       2 failed, 83 passed, 85 total
### A2 fronteira errada (> em vez de >=)
  ● SubscriptionScreen — estados › pedido com mais de 24 h não é mais anunciado: a tela volta ao normal
  ● SubscriptionService — compra e restauração › o pendente vale 24 h a partir do pedido e depois deixa de existir
Tests:       2 failed, 83 passed, 85 total
### A3 pendente sem prazo (o defeito original do serviço)
  ● SubscriptionScreen — estados › pedido com mais de 24 h não é mais anunciado: a tela volta ao normal
  ● SubscriptionService — compra e restauração › o pendente vale 24 h a partir do pedido e depois deixa de existir
Tests:       2 failed, 83 passed, 85 total
### A4 tela volta a esconder planos e Restaurar no pendente (o defeito original da tela)
  ● SubscriptionScreen — estados › Ask to Buy avisa o pedido e mantém planos e Restaurar à mão
Tests:       1 failed, 84 passed, 85 total
### A5 cartão sem botão no pendente (o defeito original do cartão)
  ● SubscriptionCard › pendente informa que aguarda aprovação e continua abrindo a tela
Tests:       1 failed, 84 passed, 85 total
```

A3, A4 e A5 são os três defeitos originais, um por arquivo. A1 e A2 provam que o
teste fixa o prazo (24 h, não 48 h) e a fronteira (`>=`, não `>`).
