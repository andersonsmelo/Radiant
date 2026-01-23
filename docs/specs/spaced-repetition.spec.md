# Spaced Repetition — Specification (Radiant)

> Este documento define **exatamente** como o sistema de Repetição Espaçada do Radiant deve funcionar.
> A IA deve **implementar apenas o que está descrito aqui**, sem adicionar comportamento implícito.

---

## 1. Objetivo da Feature

Implementar um sistema de **repetição espaçada** que:

* Identifica conteúdo que precisa ser revisado
* Agenda revisões automáticas baseadas em desempenho
* Maximiza retenção de longo prazo
* Mantém o usuário engajado com conteúdo relevante

O sistema usa uma **versão simplificada do algoritmo SM-2** (SuperMemo 2).

---

## 2. Escopo do Sistema (MVP)

### Inclui

* Algoritmo SM-2 simplificado
* Agendamento automático de revisões
* Priorização de cards por data de revisão
* Ajuste de intervalo baseado em desempenho

### Não inclui

* Algoritmos avançados (SM-17, FSRS)
* Revisão manual forçada
* Estatísticas detalhadas de retenção
* Sincronização entre dispositivos (fase futura)

---

## 3. Arquivos Envolvidos

### Criar

* `src/hooks/useSpacedRepetition.ts`
* `src/utils/sm2.ts`
* `src/data/reviewSchedule.ts`

### Modificar

* `src/hooks/useQuiz.ts`
* `src/app/HomeScreen.tsx`

---

## 4. Estrutura de Pastas

```
src/
 ├─ app/
 │   └─ HomeScreen.tsx
 ├─ hooks/
 │   ├─ useQuiz.ts
 │   └─ useSpacedRepetition.ts
 ├─ utils/
 │   └─ sm2.ts
 └─ data/
     └─ reviewSchedule.ts
```

---

## 5. Fluxo do Sistema (Passo a Passo)

1. Usuário completa uma lição
2. Sistema registra desempenho de cada pergunta
3. Algoritmo SM-2 calcula próximo intervalo de revisão
4. Pergunta é agendada para revisão futura
5. Na data agendada, pergunta aparece na fila de revisão
6. Usuário revisa a pergunta
7. Intervalo é ajustado baseado no novo desempenho
8. Ciclo se repete

---

## 6. Estruturas de Dados

### ReviewCard

```ts
type ReviewCard = {
  questionId: string
  lessonId: string
  easeFactor: number // Fator de facilidade (≥ 1.3)
  interval: number // Intervalo em dias
  repetitions: number // Número de repetições corretas consecutivas
  nextReviewDate: Date
  lastReviewedAt: Date
}
```

### ReviewSession

```ts
type ReviewSession = {
  cardId: string
  reviewedAt: Date
  quality: number // 0-5 (qualidade da resposta)
  timeSpentMs: number
}
```

---

## 7. Regras de Negócio

### Qualidade da Resposta (0-5)

* **5** — Resposta perfeita, fácil
* **4** — Resposta correta após hesitação
* **3** — Resposta correta com dificuldade
* **2** — Resposta incorreta, mas lembrou parcialmente
* **1** — Resposta incorreta, não lembrou
* **0** — Blackout completo

### Mapeamento Simplificado (MVP)

* Acertou na primeira tentativa → **quality = 4**
* Errou → **quality = 1**

### Regras do SM-2

* Se `quality < 3`: resetar intervalo para 1 dia
* Se `quality ≥ 3`: aumentar intervalo progressivamente
* `easeFactor` nunca pode ser menor que 1.3

---

## 8. Lógica Principal (Algoritmo SM-2 Simplificado)

```txt
FUNCTION calculateNextReview(card, quality):
  IF quality < 3:
    card.interval = 1
    card.repetitions = 0
  ELSE:
    IF card.repetitions == 0:
      card.interval = 1
    ELSE IF card.repetitions == 1:
      card.interval = 6
    ELSE:
      card.interval = card.interval * card.easeFactor
    END
    card.repetitions += 1
  END

  card.easeFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  
  IF card.easeFactor < 1.3:
    card.easeFactor = 1.3
  END

  card.nextReviewDate = TODAY + card.interval
  card.lastReviewedAt = NOW

  RETURN card
END
```

---

## 9. Priorização de Revisões

Cards devem ser exibidos na seguinte ordem:

1. Cards vencidos (nextReviewDate ≤ hoje)
2. Ordenados por data mais antiga primeiro
3. Limite de 20 cards por sessão de revisão (MVP)

---

## 10. UI / UX (Comportamento Esperado)

### HomeScreen

* Exibir contador de cards para revisar
* Botão "Revisar Agora" visível quando há cards vencidos
* Indicador visual de progresso de revisão

### Durante Revisão

* Interface idêntica ao quiz normal
* Indicação clara de que é uma revisão
* Feedback imediato

---

## 11. Integração com Quiz Engine

* Após cada pergunta respondida no quiz:
  * Criar ou atualizar `ReviewCard`
  * Calcular próximo intervalo
  * Salvar localmente

* Na tela inicial:
  * Verificar cards vencidos
  * Exibir contador
  * Permitir iniciar sessão de revisão

---

## 12. Persistência de Dados

* Salvar `ReviewCard[]` em AsyncStorage (React Native) ou localStorage (Web)
* Chave: `@radiant:review_cards`
* Formato: JSON

---

## 13. Critérios de Aceitação

* Algoritmo SM-2 implementado corretamente
* Cards são agendados após cada quiz
* Revisões aparecem na data correta
* Intervalo aumenta com bom desempenho
* Intervalo reseta com desempenho ruim
* Dados persistem entre sessões

---

## 14. Limitações do MVP

* Apenas 2 níveis de qualidade (acerto/erro)
* Sem estatísticas de retenção
* Sem ajuste manual de intervalo
* Sem sincronização na nuvem

---

## 15. Integrações Futuras (Fora do MVP)

* Algoritmo FSRS (mais preciso)
* Estatísticas de retenção
* Gráficos de progresso
* Sincronização multi-dispositivo
* Ajuste manual de dificuldade

---

## 16. Fora de Escopo

Qualquer comportamento não explicitamente descrito neste documento.
