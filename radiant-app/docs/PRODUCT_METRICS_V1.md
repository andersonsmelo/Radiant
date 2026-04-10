# 📊 PRODUCT_METRICS_V1 — Radiant

> Documento oficial de métricas do produto Radiant (v1)
> Objetivo: validar se o **core loop Learn → Review → Retenção** está funcionando
> Fonte de dados: **Telemetry v1 (local, privacy-first)**

---

## 🎯 Objetivo deste documento

Definir **quais métricas importam agora**, como medi-las e como interpretá-las para decidir:

- Se o Radiant **funciona como produto**
- Se a **Review Experience** realmente gera retenção
- Onde focar esforços na v2 (UX, conteúdo ou engajamento)

⚠️ Este documento **não** busca métricas de vaidade (downloads, XP total, etc).

---

## 🧠 Hipótese central do produto

> Usuários que revisam com frequência têm maior retenção e retornam ao app mais vezes.

A Review é o **coração do Radiant**, não o Quiz.

---

## 🧩 Core Loop do Radiant

Abrir App
↓
Aprender (Quiz)
↓
Revisar (Flashcards)
↓
Reforço de Memória + XP
↓
Retorno ao App

Todas as métricas existem para validar esse loop.

---

## 🥇 Métricas-Chave Oficiais (v1)

### 1️⃣ Review Completion Rate (RCR)

**O que mede**
Se os usuários que começam uma revisão conseguem finalizá-la.

**Definição**

review_complete / review_start

**Fonte**
- `review_start`
- `review_complete`

**Meta inicial**
- 🟢 **≥ 70%** → saudável
- 🟡 50–69% → fricção moderada
- 🔴 < 50% → Review está cansativa ou confusa

**Interpretação**
- Baixo RCR = Review parece “quiz 2” ou está lenta demais

---

### 2️⃣ Tempo Médio de Review

**O que mede**
Se a revisão é rápida o suficiente para caber no dia a dia.

**Definição**

avg(totalReviewDurationMs / review_complete)

**Fonte**
- Timer entre `review_start` → `review_complete`

**Meta inicial**
- 🟢 **≤ 60 segundos**
- 🟡 60–90 segundos
- 🔴 > 90 segundos

**Interpretação**
- Review longa demais quebra o modelo mental “manutenção de memória”

---

### 3️⃣ Adoção de Review vs Learn

**O que mede**
Se os usuários realmente usam revisão, ou só fazem quiz.

**Definição**

Review Adoption =
review_start / (review_start + learn_start)

**Fonte**
- `review_start`
- `learn_start`

**Meta inicial**
- 🟢 **≥ 40%**
- 🟡 25–39%
- 🔴 < 25%

**Interpretação**
- Baixa adoção = Review não está clara ou não parece valiosa

---

## 🥈 Métricas de Suporte (diagnóstico)

### XP por Fonte

XP Review / XP Learn

- Review deve gerar **menos XP**, mas ainda ser percebida como útil
- Se XP Review for irrelevante → revisão é ignorada
- Se XP Review for alta demais → vira farming

---

### Review Items por Sessão

review_item count por review_complete

Ajuda a calibrar:
- Quantos cards por revisão
- Se o número ideal está entre 3–7

---

### Erros em Review
- `review_item { correct: false }`
- Erro **não é problema**
- Muitos erros + alta desistência = conteúdo mal resolvido

---

## 🚫 Métricas que NÃO importam agora

- XP total acumulado
- Número total de eventos
- Quantidade de quizzes criados
- “Tempo total no app”

Essas métricas **não orientam decisão de produto** neste estágio.

---

## 🧪 Plano de Validação (7 dias)

### Dia 1–2
- Usar o app normalmente
- Ver se Review é intuitiva sem esforço

### Dia 3–5
- Forçar uso de Review diariamente
- Observar:
  - tempo
  - fricção
  - vontade de pular

### Dia 6–7
- Analisar TelemetryDebugScreen
- Preencher tabela simples:

| Métrica | Valor |
|-------|------|
| Review Completion Rate | |
| Tempo Médio de Review | |
| Adoção Review vs Learn | |

---

## 🧭 Decisões Baseadas nos Dados

### Se RCR ≥ 70% e Tempo ≤ 60s
👉 Review está **boa o suficiente** → escalar conteúdo

### Se RCR < 60%
👉 Ajustar UX (ritmo, copy, feedback)

### Se Adoção < 30%
👉 Review não está clara → melhorar comunicação no Home

---

## 📌 Conclusão

Este documento define **como o Radiant decide o que fazer a seguir**.

Antes de:
- novos personagens
- novas mecânicas
- novos modos

👉 **os dados deste documento mandam**.
