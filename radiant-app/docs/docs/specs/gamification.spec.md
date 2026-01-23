# Gamification — Specification (Radiant)

> Este documento define **exatamente** como XP, Streak e Badges funcionam no MVP do Radiant.
> A gamificação deve **reforçar o aprendizado** e permanecer **discreta**.
> Implementar somente o que está descrito aqui.

---

## 1. Objetivo da Feature

Implementar uma camada de gamificação no MVP para:

* Incentivar constância (streak)
* Recompensar execução e desempenho (XP)
* Tornar progresso tangível com marcos clínicos (badges)

Gamificação **não** é o objetivo final; é suporte ao aprendizado.

---

## 2. Escopo (MVP)

### Inclui

* XP por conclusão de lição e performance
* Streak diário (dias consecutivos com estudo)
* Badges por marcos (streak e competência)
* Persistência local

### Não inclui

* Leaderboards / ligas
* Desafios sociais
* Compra de itens
* Streak freeze (pode ser premium no futuro)
* Economia complexa

---

## 3. Arquivos Envolvidos

### Criar

* `src/services/gamification.ts`
* `src/hooks/useGamification.ts`
* `src/storage/gamificationStore.ts`
* `src/constants/badges.ts`

### Modificar

* `src/constants/gamification.ts`

---

## 4. Estrutura de Pastas

```
src/
 ├─ services/
 │   └─ gamification.ts
 ├─ hooks/
 │   └─ useGamification.ts
 ├─ storage/
 │   └─ gamificationStore.ts
 └─ constants/
     ├─ gamification.ts
     └─ badges.ts
```

---

## 5. Conceitos e Definições

### GamificationState

```ts
type GamificationState = {
  totalXp: number
  currentStreak: number
  bestStreak: number
  lastStudyDate: string | null // YYYY-MM-DD em timezone local
  earnedBadges: Record<string, { earnedAt: string }>
}
```

### Study Event

No MVP, um "study" conta quando o usuário **finaliza** uma Lesson (quiz concluído).

---

## 6. Regras de XP (MVP)

### 6.1 Valores base

Definidos em `constants/gamification.ts`:

* `XP_LESSON_COMPLETE = 10`
* `XP_PERFECT_BONUS = 5` (score == 1.0)
* `XP_HIGH_SCORE_BONUS = 3` (score >= 0.8 e < 1.0)
* `XP_REVIEW_BONUS = 2` (se a lição era "due" e foi revisada)

### 6.2 Cálculo de XP por lesson

Ao finalizar uma lesson:

* Sempre ganha `XP_LESSON_COMPLETE`
* Se score == 1.0 adiciona `XP_PERFECT_BONUS`
* Se score >= 0.8 e < 1.0 adiciona `XP_HIGH_SCORE_BONUS`
* Se a lesson estava "due" no spaced repetition adiciona `XP_REVIEW_BONUS`

> XP é acumulativo e apenas incrementa `totalXp`.

---

## 7. Regras de Streak (MVP)

### 7.1 Definição

* Streak é o número de dias consecutivos em que o usuário concluiu pelo menos 1 lesson.
* Streak é calculada com base na data local (YYYY-MM-DD).

### 7.2 Atualização

Ao concluir uma lesson em `today`:

* Se `lastStudyDate == today` → não altera streak
* Se `lastStudyDate == yesterday` → `currentStreak += 1`
* Se `lastStudyDate` é null → `currentStreak = 1`
* Caso contrário → `currentStreak = 1`

Após atualizar:

* `bestStreak = max(bestStreak, currentStreak)`
* `lastStudyDate = today`

### 7.3 Sem punição extra

* Perder streak apenas reinicia para 1.
* Não há penalidade de XP.

---

## 8. Badges (MVP)

### 8.1 Princípios

* Badges devem ser **clinicamente significativos** ou ligados à constância.
* Badges não devem ser excessivos.
* No MVP, badges são condições determinísticas.

### 8.2 Estrutura

`constants/badges.ts` define a lista e as regras.

```ts
type Badge = {
  id: string
  title: string
  description: string
  type: 'streak' | 'performance' | 'progress'
}
```

### 8.3 Badges incluídos no MVP

#### Streak

* `streak_7`: 7 dias consecutivos
* `streak_30`: 30 dias consecutivos

#### Performance (baseado em score)

* `perfect_10`: 10 lessons com score 1.0 (acumulativo)

#### Progress

* `xp_500`: alcançar 500 XP

> Nota: badges "diagnósticos" por patologia ficam para fase futura, quando conteúdo estiver totalmente tagueado e estável.

### 8.4 Regras de concessão

* Badges são avaliados **após** cada lesson concluída.
* Se condição for verdadeira e o badge não tiver sido ganho, registrar em `earnedBadges`.

---

## 9. Integração com Quiz e Spaced Repetition

### Entrada obrigatória ao registrar conclusão

O Quiz deve chamar `recordStudyEvent()` com:

* `lessonId`
* `score`
* `wasReview` (boolean) — se a lesson estava due
* `completedAt` (Date)

---

## 10. API Interna (assinaturas)

### gamification.ts

```ts
export function calculateXp(params: {
  score: number
  wasReview: boolean
}): number

export function updateStreak(params: {
  state: GamificationState
  today: string // YYYY-MM-DD
}): GamificationState

export function evaluateBadges(params: {
  state: GamificationState
  stats: {
    perfectLessonsTotal: number
  }
}): GamificationState
```

### useGamification.ts

```ts
export function useGamification(): {
  state: GamificationState
  recordStudyEvent: (params: {
    score: number
    wasReview: boolean
    completedAt: Date
  }) => Promise<void>
}
```

### gamificationStore.ts

```ts
export function loadGamification(): Promise<GamificationState>
export function saveGamification(state: GamificationState): Promise<void>
```

---

## 11. Pseudo-código

```txt
ON lessonCompleted(score, wasReview, completedAt):
  today = formatDateYYYYMMDD(completedAt)
  state = loadGamification()

  // XP
  xpDelta = calculateXp(score, wasReview)
  state.totalXp += xpDelta

  // Streak
  state = updateStreak(state, today)

  // Badges
  stats.perfectLessonsTotal += (score == 1.0 ? 1 : 0)
  state = evaluateBadges(state, stats)

  saveGamification(state)
```

---

## 12. Limitações do MVP

* Sem níveis visuais (leveling) com fórmula
* Sem streak freeze
* Sem leaderboards
* Sem badges por patologia/competência específica

---

## 13. Critérios de Aceitação

* XP calculado conforme regras
* Streak atualiza corretamente com base em datas
* Badges concedidos corretamente e apenas uma vez
* Estado persiste após fechar/reabrir app

---

## 14. Fora de Escopo

Qualquer comportamento não descrito aqui.
