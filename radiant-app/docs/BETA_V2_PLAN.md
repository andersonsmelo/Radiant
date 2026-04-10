# Radiant — Plano Beta v2 (Semi-aberta)

Visão Geral

A Beta v2 marca a transição de:

“produto validado internamente”
para
“produto validado com diversidade real de usuários”

Ainda não é lançamento público.

⸻

## 🎯 Objetivo da Beta v2

Validar o Radiant com mais variedade de perfis, mantendo controle emocional e técnico:
- Estudantes iniciantes
- Técnicos experientes
- Pessoas menos engajadas digitalmente
- Usuários que não receberam explicação prévia

O foco é responder:
- O produto se explica sozinho?
- O ritmo funciona fora da bolha?
- Lux continua fazendo sentido?
- Review é intuitivo sem instrução?

⸻

## 👥 Público-alvo

**Tamanho**
- 50 a 150 usuários

**Origem**
- Indicações
- Convites manuais
- Lista de interesse (“Quero participar” do BetaGate)

**Importante**
- ❌ Nada de tráfego pago
- ❌ Nada de formulário público aberto
- ❌ Nada de promessa de “lançamento”

⸻

## 🔓 Acesso (Semi-aberto, controlado)

**Mudança em relação à v1**

Sai:
- Código único fixo

Entra:
- Pool de códigos válidos
- Uso limitado por código (ex: 10 acessos)

**Exemplo**

```typescript
BETA_CODES = {
  'RADIANT-BETA-A': 10,
  'RADIANT-BETA-B': 25,
  'RADIANT-REVIEW': 5
}
```

- Cada código decremente uso
- Quando chega a 0 → inválido automaticamente
- Tudo local (AsyncStorage)

⸻

## 🧠 Experiência do Usuário (o que muda)

**Continua igual**
- Layout
- Motion
- Quiz
- Review
- Gamificação light
- Lux (gated e sutil)

**Ajustes v2**
- Copy mais clara em:
    - Meta diária
    - Review
    - Summary
- Lux aparece menos, porém com frases mais assertivas
- Home mais explicativa (microcopy)

⸻

## 📊 Telemetry (leitura, não ação)

**Mantém**
- Telemetry v1.1
- Health Score (shadow)
- Heurísticas (shadow)

**Adiciona (apenas agregação)**
- “Primeira sessão completa?”
- “Usuário chegou ao Review?”
- “Usuário concluiu 1 ciclo completo (Quiz → Summary → Home)?”

⚠️ Nada de automação baseada nisso ainda.

⸻

## 🧪 Feedback (mais estruturado)

**Novo**
- Categoria extra:
    - “Não entendi o que fazer”

**Rotina recomendada**
- 10–15 feedbacks analisados manualmente/semana
- Agrupar por:
    - Confusão
    - Ritmo
    - Emoção
    - Visual

⸻

## 🚦 Critérios de avanço / pausa

**Avança para Beta v3 se:**
- Usuários entendem Review sem ajuda
- Lux não é percebida como “mascote”
- Meta diária não gera culpa
- Não há loops de navegação confusos
- Feedback começa a repetir (bom sinal)

**Pausa se:**
- Aumento de ansiedade relatada
- Confusão frequente entre Quiz e Review
- Lux ignorada ou rejeitada
- XP vira foco principal

⸻

## ❌ O que ainda NÃO entra na v2
- ❌ Login
- ❌ Backend
- ❌ Push
- ❌ Onboarding complexo
- ❌ Social / ranking
- ❌ Notificações inteligentes
- ❌ IA adaptativa

⸻

## 🧭 Duração sugerida
- 3 a 4 semanas
- Sem pressa
- Melhor parar cedo do que escalar errado

⸻

## 📌 Resultado esperado da Beta v2

Ao final da v2, você deve conseguir responder com segurança:
- “Esse produto funciona sem eu explicar?”
- “Ele respeita o tempo do usuário?”
- “Ele ensina sem pressionar?”
- “Lux agrega ou pode sair?”

Se essas respostas forem sim, aí sim:
👉 Produto pronto para Beta aberta ou Soft Launch.
