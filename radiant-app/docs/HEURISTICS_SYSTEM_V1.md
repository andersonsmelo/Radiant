# 🧠 HEURÍSTICAS AUTOMÁTICAS — RADIANT (v1)

> Objetivo:
> Detectar **problemas reais de produto** automaticamente a partir de Telemetry local
> e acionar **respostas inteligentes** (UI, Lux, UX ou decisão de produto).

Este sistema NÃO envia dados para fora.
Tudo é **local, privado e orientado a hábito**.

---

## 1️⃣ Conceito Central

Uma **heurística** é uma regra simples que responde à pergunta:

> “Isso parece saudável ou preocupante para o hábito de estudo?”

Cada heurística possui:
- Condição (dados)
- Janela temporal
- Severidade
- Ação sugerida (ou automática)

---

## 2️⃣ Estrutura Técnica (Base)

### Interface padrão
```ts
type HeuristicAlert = {
  id: string
  level: 'info' | 'warning' | 'critical'
  message: string
  context?: Record<string, any>
  suggestedAction?: string
  createdAt: number
}
```

### Serviço

`HeuristicsService.evaluate(): HeuristicAlert[]`

Executado:
- Ao abrir o app
- Ao finalizar Quiz
- Ao finalizar Review
- 1x/dia no primeiro app_open

> **⚠️ "Ao abrir o app" segue sem fiação na home atual (registrado em
> 2026-08-03).** A avaliação na abertura era disparada por um `checkHeuristics()`
> local da home legada, que ficou inalcançável com a Learning Road. Em
> 2026-08-03 o restante do bloco de abertura foi migrado para o hook
> `useAppOpenLifecycle` — `app_open`, `markDayOpen()` e o reset de backoff de
> push —, mas a chamada das heurísticas **ficou deliberadamente de fora**: ela
> renderiza nudges, e religá-la muda o que o usuário vê na home, o que é decisão
> de produto e não correção de telemetria. Enquanto isso não for decidido, os
> gatilhos que valem são "ao finalizar Quiz" e "ao finalizar Review".
>
> A regra **H3** depende de `ultimo_app_open`, que lê o mesmo evento: ela ficou
> permanentemente falsa na janela em que o evento não era emitido, e volta a ser
> avaliável a partir de 2026-08-03 — mas só nos gatilhos que ainda existem.

---

## 3️⃣ Heurísticas Essenciais (v1)

### 🔴 H1 — Abandono de Review

**Condição**
`dias_ativos ≥ 3` AND `dias_com_review / dias_ativos < 0.3`

**Interpretação**
O usuário está evitando manutenção do conhecimento.

**Severidade**
🔴 critical

**Ação**
- Lux (Thinking): “Que tal uma revisão rápida hoje? Prometo que é curta.”
- CTA destacado: Iniciar revisão (leve)

---

### 🟡 H2 — Review Longa Demais

**Condição**
`tempo_medio_review > 180s`

**Interpretação**
Review está cansativa → risco de churn futuro.

**Severidade**
🟡 warning

**Ação**
- Ajuste automático (se permitido): Limitar próxima review a 3 cards
- Lux (Oops): “Talvez a revisão esteja um pouco longa hoje.”

---

### 🔴 H3 — Quebra de Hábito (Drop-off)

**Condição**
`ultimo_app_open > 48h`

**Interpretação**
Hábito quebrado.

**Severidade**
🔴 critical

**Ação**
- Lux (Idle → Thinking): “Vamos retomar com algo rápido?”
- Mostrar apenas 1 ação possível (reduzir decisão)

---

### 🟡 H4 — Meta Diária Ignorada

**Condição**
`dias_ativos ≥ 5` AND `dias_com_meta_concluida / dias_ativos < 0.4`

**Interpretação**
Meta pode estar mal calibrada ou mal comunicada.

**Severidade**
🟡 warning

**Ação**
- Ajuste copy (sem mudar lógica): “Só 1 passo hoje já conta.”
- Lux (Thinking)

---

### 🟢 H5 — Fluxo Saudável

**Condição**
`review_complete / learn_complete ∈ [0.5, 1.5]` AND `dias_com_meta_concluida / dias_ativos ≥ 0.6`

**Interpretação**
Produto está equilibrado.

**Severidade**
🟢 info

**Ação**
- Lux (Happy): “Seu ritmo está excelente.”
- Nenhuma intervenção de UX

---

## 4️⃣ Integração com Lux (Regra Clara)

| Severidade | Estado Lux |
|------------|------------|
| info | happy |
| warning | thinking |
| critical | oops |

⚠️ **Lux nunca acusa o usuário.**
Lux sempre sugere, nunca cobra.

---

## 5️⃣ Integração com Motion

| Alerta | Motion |
|--------|--------|
| info | fadeInUp |
| warning | fadeInUp + leve scale |
| critical | fadeInUp + atenção visual (não shake agressivo) |

---

## 6️⃣ Onde Exibir Alertas

Ordem de prioridade:
1. Home (banner sutil)
2. Header contextual
3. Nunca modal bloqueante

**Regra:** No máximo 1 alerta ativo por dia

---

## 7️⃣ Anti-Padrões (NÃO FAZER)

❌ Push notifications externas
❌ Alertas múltiplos simultâneos
❌ Mensagens punitivas
❌ Alertas sem ação clara
❌ Ajustar algoritmo sem observação prévia

---

## 8️⃣ Roadmap de Evolução

**v1.1**
- Score de saúde (0–100)
- Histórico de alertas

**v1.2**
- Ajuste automático de meta diária
- Review adaptativa baseada em fadiga

**v2.0**
- Heurísticas personalizadas por perfil
- Lux com memória curta (“ontem foi pesado…”)

---

## 9️⃣ Regra de Ouro

Se o usuário sente que o app “entende” o ritmo dele, você venceu o problema mais difícil do produto.

Heurísticas não são controle. **São empatia automatizada.**
