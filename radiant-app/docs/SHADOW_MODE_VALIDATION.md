# 🧪 Checklist de Calibração — Radiant (Health Score v1 + Heurísticas)

Este documento guia a validação do Health Score v1 e das Heurísticas enquanto o sistema opera em **Shadow Mode** (sem interrupções na UI principal).

## Regras gerais
- **Janela**: últimos 7 dias (rolling window).
- **Health Score**: só é confiável com ≥ 3 dias ativos.
- **Prioridade de Heurísticas**: H3 (Habit Break) > H1 (Avoidance) > H2 (Fatigue) > H4 (Goal) > H5 (Flow).
- **Shadow Mode**: heurísticas são avaliadas e persistidas, mas só aparecem no `/telemetry`. Não há alertas na Home.

---

## 0) Sanity checks (antes de tudo)

### ✅ SC-1 — Sem dados suficientes
- **Setup**: 1–2 dias ativos apenas.
- **Esperado**:
  - Health Score: placeholder (“em construção” / null).
  - Heurísticas: podem existir, mas não devem “gritar” sem base (ideal: nenhuma ou só info).

### ✅ SC-2 — Cache diário
- **Setup**: abrir/fechar Home várias vezes no mesmo dia.
- **Esperado**:
  - Health Score não recalcula sem `force: true`.
  - Debug screen mostra `dayKey` igual e `computedAt` estável.

---

## 1) Casos de Hábito (Consistency / H3)

### ✅ C-1 — Hábito forte (7/7)
- **Setup**: 7 dias ativos (abre o app todo dia).
- **Esperado**:
  - Consistency (C) ≈ 35.
  - Health Score: ≥ 60.
  - Heurística: H5 (info) ou nenhuma.

### ✅ C-2 — Hábito moderado (5/7)
- **Setup**: 5 dias ativos.
- **Esperado**:
  - C na faixa de ~21.
  - Score: 30–70.
  - Heurística: não deve disparar H3.

### ✅ C-3 — Quebra de hábito (48–72h)
- **Setup**: ficar 2 dias sem abrir (passar de 48h desde último open).
- **Esperado**:
  - Heurística: **H3 (critical)** aparece no `/telemetry`.
  - Penalidade de score: -8.

### ✅ C-4 — Quebra forte (72h+)
- **Setup**: 3 dias sem abrir (72h+).
- **Esperado**:
  - Heurística: **H3 (critical)**.
  - Penalidade: -15.
  - Score cai significativamente.

---

## 2) Casos de Review (Stickiness / H1 / H2)

### ✅ R-1 — Review saudável
- **Setup**: 5 dias ativos; review em 3 dias (~60%).
- **Esperado**:
  - Review Stickiness: 3/5=0.6 → R ≈ 35.
  - Heurística: não deve disparar H1.

### ✅ R-2 — Evita review
- **Setup**: 5 dias ativos; review em 1 dia (<30%).
- **Esperado**:
  - Heurística: **H1 (critical)**.
  - R baixo (≈ 10–20).
  - Score cai.

### ✅ R-3 — Review longa demais
- **Setup**: review com duração média > 180s (3min).
- **Esperado**:
  - Heurística: **H2 (warning)**.
  - Score pode estar bom, mas o alerta aponta fricção.

---

## 3) Casos de Equilíbrio (Balance / H5)

### ✅ B-1 — Equilíbrio ideal
- **Setup**: `review_complete` ~= `learn_complete` (ratio ~1.0).
- **Esperado**:
  - Balance (B) ≈ 20.
  - Heurística: H5 tende a aparecer se meta e consistência também forem boas.

### ✅ B-2 — Só learn
- **Setup**: `learn_complete` alto, `review_complete` quase zero.
- **Esperado**:
  - B cai (próximo de 0).
  - Provável H1 também.

### ✅ B-3 — Só review
- **Setup**: `review_complete` muito maior que `learn_complete`.
- **Esperado**:
  - B cai.
  - Score reflete estagnação.

---

## 4) Casos de Meta (Goal Consistency / H4)

### ✅ G-1 — Meta consistente
- **Setup**: meta concluída em ≥60% dos dias ativos.
- **Esperado**:
  - G alto (6/10 a 10/10).
  - H4 não aparece.

### ✅ G-2 — Meta ignorada
- **Setup**: 5+ dias ativos; meta concluída em <40%.
- **Esperado**:
  - Heurística: **H4 (warning)**.
  - Score sofre leve impacto (G é só 10%).

---

## 5) Casos de Conflito

### ✅ X-1 — Score alto mas alerta crítico
- **Setup**: usuário muito ativo (C alto), mas zero review (R baixo).
- **Esperado**:
  - Score não deveria ficar "excelente" (>85).
  - Heurística: **H1 (critical)** deve dominar.
  - Ação: se score ficar alto demais, ajustar pesos (aumentar R, reduzir C).

### ✅ X-2 — Score médio mas tudo “ok”
- **Setup**: 3 dias ativos apenas, com review em 1.
- **Esperado**:
  - Score moderado/baixo por pouca base.
  - Heurística não deve ser agressiva.
  - Ideal: info leve ou placeholder.

---

## Critério de Saída (Fim do Shadow Mode)

1. Health Score parece justo em ≥ 80% dos cenários.
2. H3 dispara só quando faz sentido (48h+).
3. H1 não dispara em iniciante (poucos dias).
4. H2 só aparece quando review realmente está pesada.
5. Não há conflito grave (Excelência vs Crítico).

**Falhas comuns e ajustes:**
- Score oscilando demais → aumentar janela (7→10) ou suavizar penalidade.
- H1 cedo demais → exigir `activeDaysLast7 >= 5`.
- H2 sensível demais → subir threshold (180s → 240s).
- Score "bondoso" sem review → aumentar peso R (35→40) e reduzir C.
