# 📈 Radiant — Guia de Interpretação de Dados Reais (v1)

Use este guia junto do TelemetryDebugScreen
Frequência ideal: leitura diária rápida + revisão semanal

---

## 🧭 Antes de olhar números (check mental obrigatório)

Sempre responda essas 3 perguntas antes de analisar qualquer métrica:
1. Eu usei o app como um usuário real (sem forçar fluxo)?
2. A Review aconteceu no contexto certo (tempo curto, sem distração)?
3. Alguma coisa “me irritou” antes de desistir ou concluir?

👉 Se a resposta 1 for “não”, ignore os dados.

---

## 🥇 Métrica 1 — Review Completion Rate (RCR)

**Como ler**

review_complete / review_start

**Interpretação real**

🟢 **≥ 70%**
✔️ Review é curta, clara e útil
✔️ Fluxo mental correto
➡️ Não mexa em UX agora

🟡 **50–69%**
⚠️ Review é aceitável, mas cansa
Pergunte:
- Onde você pensou “ok, chega”?
- Foi no meio ou no final?

➡️ Ajuste:
- número de cards
- ritmo de animação
- copy do final

🔴 **< 50%**
🚨 Review está errada conceitualmente
Normalmente indica:
- Parece quiz
- Demora demais
- Exige esforço cognitivo alto

➡️ Prioridade máxima de ajuste

---

## 🥈 Métrica 2 — Tempo Médio de Review

**Como ler**

avg(totalReviewDurationMs / review_complete)

**Interpretação**

🟢 **≤ 60s**
✔️ Cabe na rotina
✔️ Pode virar hábito

🟡 **60–90s**
⚠️ Aceitável, mas no limite
➡️ Avaliar:
- Reduzir cards
- Tornar feedback mais automático

🔴 **> 90s**
❌ Review não é manutenção, é tarefa
➡️ Review precisa ser redesenhada

---

## 🥉 Métrica 3 — Adoção Review vs Learn

**Como ler**

review_start / (review_start + learn_start)

**Interpretação**

🟢 **≥ 40%**
✔️ Usuário entende valor da revisão
✔️ Mensagem do Home funciona

🟡 **25–39%**
⚠️ Review é usada, mas não priorizada
➡️ Ajuste:
- copy do Home
- destaque visual
- Lux mais ativo no convite

🔴 **< 25%**
❌ Review não está clara
Normalmente é problema de:
- comunicação
- timing
- percepção de valor

---

## 🔍 Métricas secundárias (como diagnosticar)

**XP Review vs XP Learn**
- Review ≈ 25–40% do XP total → saudável
- < 20% → review ignorada
- 50% → farming

**Review Items por Sessão**
- Ideal: 3–7
- < 3 → valor baixo
- 7 → cansaço

---

## 🧠 Como cruzar métricas (muito importante)

**Caso clássico 1**
- RCR alto
- Adoção baixa

➡️ **UX boa, comunicação ruim**
Ajuste Home, não Review

---

**Caso clássico 2**
- Adoção alta
- RCR baixo

➡️ **Usuário entra, mas desiste**
Problema de ritmo ou esforço

---

**Caso clássico 3**
- Tudo baixo

➡️ **Produto ainda não encaixou**
Voltar para:
- promessa
- proposta de valor
- clareza do fluxo

---

## 📅 Ritual semanal (15 minutos)

Toda semana, responda:
1. Review está sendo concluída?
2. Review cabe em 1 minuto?
3. Review está sendo escolhida espontaneamente?

Se 2 dessas 3 forem “sim”, o Radiant está saudável.

---

## 🚨 Sinais de alerta precoce

Pare e ajuste se:
- Você evita clicar em “Iniciar revisão”
- Review parece “mais um quiz”
- Lux começa a incomodar
- Você sente alívio ao terminar (não satisfação)

Esses sinais vêm antes dos números.

---

## 🧭 O que fazer depois de 7 dias

Você vai cair em um desses cenários:

**A) Review validada**

➡️ Escalar conteúdo
➡️ Telemetry v1.1 (coortes)

**B) Review quase lá**

➡️ Review v2.1 (ritmo + copy)

**C) Review rejeitada**

➡️ Redesenhar conceito (menos cards, mais automático)

---

## 💬 Como vamos trabalhar juntos daqui

Quando você rodar o app e quiser analisar:

Me mande:
- Screenshot ou texto do TelemetryDebugScreen
- Sua sensação pessoal (1 frase)

Eu respondo com:
- Diagnóstico
- Prioridade
- Próximo passo claro
