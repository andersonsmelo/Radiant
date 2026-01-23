# Quiz Engine — Specification (Radiant)

> Este documento define **exatamente** como o sistema de Quiz do Radiant deve funcionar.
> A IA deve **implementar apenas o que está descrito aqui**, sem adicionar comportamento implícito.

---

## 1. Objetivo da Feature

Implementar o **núcleo de aprendizado do Radiant**, responsável por:

* Apresentar perguntas clínicas e técnicas
* Coletar respostas do usuário
* Fornecer feedback imediato
* Registrar desempenho para progressão, gamificação e repetição espaçada

O Quiz Engine é a **base de todo o produto**.

---

## 2. Escopo do Quiz (MVP)

### Inclui

* Perguntas de múltipla escolha
* Perguntas baseadas em imagem (com ou sem anotação)
* Feedback imediato (acerto/erro)
* Avanço sequencial de perguntas
* Registro de respostas e desempenho

### Não inclui

* Questões discursivas
* Upload de imagens pelo usuário
* Discussão de respostas
* Dificuldade adaptativa complexa (fica para fase futura)

---

## 3. Arquivos Envolvidos

### Criar

* `src/app/QuizScreen.tsx`
* `src/hooks/useQuiz.ts`
* `src/components/QuizQuestion.tsx`
* `src/components/QuizFeedback.tsx`

### Modificar

* `src/data/lessons.ts`
* `src/constants/quiz.ts`

---

## 4. Estrutura de Pastas

```
src/
 ├─ app/
 │   └─ QuizScreen.tsx
 ├─ components/
 │   ├─ QuizQuestion.tsx
 │   └─ QuizFeedback.tsx
 ├─ hooks/
 │   └─ useQuiz.ts
 ├─ data/
 │   └─ lessons.ts
 └─ constants/
     └─ quiz.ts
```

---

## 5. Fluxo do Usuário (Passo a Passo)

1. Usuário inicia uma lição
2. Sistema carrega lista de perguntas da lição
3. Primeira pergunta é exibida
4. Usuário seleciona uma resposta
5. Sistema valida resposta
6. Feedback imediato é exibido
7. Usuário avança para próxima pergunta
8. Ao final, sistema retorna resumo da lição

---

## 6. Estruturas de Dados

### Lesson

```ts
type Lesson = {
  id: string
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  questions: Question[]
}
```

### Question

```ts
type Question = {
  id: string
  type: 'multiple-choice' | 'image'
  prompt: string
  imageUrl?: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}
```

### QuizResult

```ts
type QuizResult = {
  lessonId: string
  totalQuestions: number
  correctAnswers: number
  answeredAt: Date
}
```

---

## 7. Regras de Negócio

* Cada pergunta tem apenas **uma resposta correta**
* Usuário não pode alterar resposta após confirmação
* Feedback deve aparecer em **menos de 500ms**
* Avanço só ocorre após feedback ser exibido
* Resultado da lição deve ser salvo localmente

---

## 8. Lógica Principal (Pseudo-código)

```txt
INIT quiz with lesson.questions
SET currentQuestionIndex = 0
SET correctAnswers = 0

ON answerSelected(answerIndex):
  IF answerIndex == correctAnswerIndex
    correctAnswers += 1
    SHOW correct feedback
  ELSE
    SHOW incorrect feedback
  END

  WAIT for user action
  MOVE to next question

ON quizFinished:
  SAVE QuizResult
  RETURN summary
```

---

## 9. UI / UX (Comportamento Esperado)

### QuizQuestion

* Exibir pergunta de forma clara
* Mostrar imagem apenas quando aplicável
* Botões grandes e fáceis de tocar

### QuizFeedback

* Acerto: verde + mensagem curta
* Erro: cinza/alerta + explicação curta
* Nenhuma animação obrigatória no MVP

---

## 10. Integrações Futuras (Fora do MVP)

* Spaced repetition
* Gamificação (XP, streak)
* Anotação avançada em imagens
* Dificuldade adaptativa

---

## 11. Critérios de Aceitação

* Fluxo completo funciona sem erros
* Todas as perguntas são exibidas
* Feedback aparece corretamente
* Resultado final é consistente
* Código segue exatamente esta especificação

---

## 12. Fora de Escopo

Qualquer comportamento não explicitamente descrito neste documento.
