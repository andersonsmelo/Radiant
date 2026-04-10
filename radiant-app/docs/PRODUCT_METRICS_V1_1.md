# 📊 PRODUCT_METRICS_V1_1 — Radiant

> Extensão do sistema de métricas do Radiant
> Foco: **retenção, consistência e hábito**
> Base técnica: **Telemetry v1.1 (local-first com fallback remoto no soft launch)**

---

## 🎯 Objetivo do v1.1

Enquanto o v1 responde:
> “O usuário completa o fluxo?”

O v1.1 responde:
> “O usuário **volta** e **repete o comportamento certo**?”

Aqui validamos se o Radiant deixa de ser uma experiência pontual
e começa a se comportar como **ferramenta de estudo contínuo**.

---

## 🧠 Hipóteses do Produto (v1.1)

1. Usuários que revisam em dias consecutivos tendem a voltar ao app.
2. A meta diária aumenta consistência, não apenas sessões longas.
3. O equilíbrio Learn ↔ Review é sinal de maturidade do uso.
4. Retenção local (D+1, D+7) continua útil como baseline, mesmo quando a telemetria remota entra no fluxo.

---

## 🥇 Métricas-Chave v1.1 (Oficiais)

---

### 1️⃣ Retenção Local (D+1 / D+3 / D+7)

**O que mede**
Se o usuário retorna ao app após o primeiro uso.

**Definição**
- D+1: abriu o app no dia seguinte
- D+3: abriu após 3 dias
- D+7: abriu após 7 dias

**Fonte**
- Eventos `app_open`
- Comparação por data (YYYY-MM-DD)

**Metas iniciais**
- 🟢 D+1 ≥ 40%
- 🟡 D+1 entre 25–39%
- 🔴 D+1 < 25%

(D+7 ainda é exploratório neste estágio)

**Interpretação**
- Baixa retenção → produto não virou hábito
- Boa retenção mesmo local → forte sinal de valor

---

## 🛰️ Operacionalização no soft launch

O v1.1 continua priorizando leitura simples, mas agora precisa funcionar em um modelo híbrido:

- fallback local quando o usuário está offline ou a coleta remota falha;
- analytics remota quando release instrumentation estiver habilitada;
- leitura de auth, sync e crash-free sessions junto com retenção e review;
- sem depender de métricas de vaidade para decidir se o produto está saudável.

### Watchlist de release

- `app_open`
- `auth_login_success`
- `auth_refresh_failed`
- `sync_flush_success`
- `sync_flush_failed`
- `review_complete`
- `crash_free_sessions`

---

### 2️⃣ Review Stickiness

**Pergunta-chave**
> Quem revisa hoje, revisa novamente em outro dia?

**Definição**

Review Stickiness =
dias_com_review / dias_ativos

**Fonte**
- `review_start`
- `app_open`

**Meta saudável**
- 🟢 ≥ 0.40
- 🟡 0.25–0.39
- 🔴 < 0.25

**Interpretação**
- Stickiness baixa = Review não se sustenta
- Stickiness alta = Review vira rotina

---

### 3️⃣ Consistência da Meta Diária

**O que mede**
Se a meta diária estimula constância,
não apenas sessões isoladas.

**Definição**

dias_com_meta_concluida / dias_ativos

**Meta inicial**
- 🟢 ≥ 50%
- 🟡 30–49%
- 🔴 < 30%

**Interpretação**
- Meta concluída em poucos dias → meta mal calibrada
- Meta quase sempre concluída → meta fácil demais

---

### 4️⃣ Learning vs Maintenance Ratio

**Pergunta**
> O usuário está aprendendo *e* mantendo o conhecimento?

**Definição**

review_complete / learn_complete

**Faixa saudável**
- 🟢 0.7 – 1.3
- 🔴 < 0.5 → esquecimento provável
- 🔴 > 1.5 → estagnação (só revisão)

**Interpretação**
- Esse número mostra maturidade do estudo

---

## 🥈 Métricas de Leitura Cruzada

Essas métricas **não decidem sozinhas**, mas ajudam no diagnóstico:

- Tempo médio de Review por dia
- Número médio de itens revisados por sessão
- XP Review / XP Learn (proporção)

Usadas apenas para **entender desvios**.

---

## 📉 O que NÃO medir no v1.1

- Usuários únicos
- Sessões totais
- Tempo total no app
- XP acumulado absoluto

Essas métricas **não indicam aprendizado nem hábito**.

---

## 🧪 Plano de Avaliação (v1.1)

### Duração mínima
- **7 dias reais** de uso (ideal: 14)

### Ritual de leitura (2× por semana)
1. Abrir `/telemetry`
2. Ler:
   - Retenção D+1
   - Review Stickiness
   - Consistência da Meta
3. Comparar com este documento
4. Anotar **sensação subjetiva**

---

## 🧭 Decisões Baseadas nos Resultados

### 🟢 Caso A — Produto saudável
- Boa retenção
- Review recorrente
- Meta consistente

➡️ Próximo passo:
- Escalar conteúdo
- Planejar Radiant v2

---

### 🟡 Caso B — Uso existe, mas não sustenta
- Retenção razoável
- Stickiness baixa

➡️ Próximo passo:
- Ajustar Review (v2.1)
- Melhorar convite e timing

---

### 🔴 Caso C — Produto não retém
- Retenção fraca
- Review pouco usada

➡️ Próximo passo:
- Reavaliar promessa central
- Simplificar experiência

---

## 🧠 Regra de Ouro do v1.1

> **Se o usuário volta e revisa sem ser forçado, o produto está certo.**

Todo o resto é otimização.

---

## 📌 Conclusão

O `PRODUCT_METRICS_V1_1.md` transforma Telemetry em **ferramenta de decisão**.

Antes de:
- adicionar features
- criar backend
- expandir personagens

👉 **olhe estes números**.

Eles dizem se o Radiant merece crescer.
