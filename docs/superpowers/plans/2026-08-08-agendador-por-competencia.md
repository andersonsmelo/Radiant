# Agendador de revisão por competência — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o agendador de revisão por competência que fabrica evidência `delayed-retention` na hora certa, e ligá-lo à recomendação da jornada sem alterar o comportamento visível enquanto não existir conteúdo v2.

**Architecture:** Um modelo de memória puro (estabilidade/dificuldade, `now` injetado) fica atrás de um serviço fino que só faz store e consulta. Um resolver isolado traduz nó da jornada em competências. A recomendação consulta o que venceu e passa a devolver um motivo, sem nunca destravar nó.

**Tech Stack:** React Native / Expo, TypeScript, Jest, AsyncStorage, Node.js 24.

**Spec:** [`2026-08-08-agendador-por-competencia-design.md`](../specs/2026-08-08-agendador-por-competencia-design.md)

**Implementa:** Task 11 de [`2026-07-31-sistema-aprendizagem-competencias.md`](2026-07-31-sistema-aprendizagem-competencias.md)

## Global Constraints

- Node.js 24 ou superior; comandos rodam a partir de `radiant-app/`.
- Indentação de 4 espaços em `src/features/spaced-repetition` e `src/features/journey`, seguindo os arquivos vizinhos.
- `CompetencyMasteryService`, `types/mastery.ts` e `SpacedRepetitionService` **não podem ser modificados** por este plano. São Task 8 concluída e caminho legado, respectivamente.
- Nenhuma função do modelo pode chamar `Date.now()` nem ler storage. `now` entra sempre como `string` ISO por parâmetro.
- Ambiguidade resolve **contra** conceder domínio: data ilegível, decorrido negativo ou relógio retrocedido nunca produzem `delayed-retention`.
- Gate ao fim de cada task: `cd radiant-app && npm run quality`.

---

### Task 1: Tipos, constantes e a invariante do limiar

**Files:**
- Create: `radiant-app/src/types/competencyReview.ts`
- Create: `radiant-app/src/constants/competencyReview.ts`
- Test: `radiant-app/src/constants/competencyReview.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `ReviewOutcome`, `ReviewGrade`, `CompetencyReviewCard`, `MemoryParams`, `CompetencyReviewStore`, `DEFAULT_MEMORY_PARAMS`, `COMPETENCY_REVIEW_SCHEMA_VERSION`, `COMPETENCY_REVIEW_STORAGE_KEYS`.

- [ ] **Step 1: Escrever o teste da invariante**

Este teste é o que impede uma revisão agendada de acontecer cedo demais e não contar como retenção — falha silenciosa, e a razão de a invariante existir.

```ts
// radiant-app/src/constants/competencyReview.test.ts
import { DEFAULT_MEMORY_PARAMS } from './competencyReview';

describe('constantes do agendador por competência', () => {
    it('mantém o piso de intervalo acima do limiar de retenção retardada', () => {
        const pisoEmHoras = DEFAULT_MEMORY_PARAMS.minIntervalDays * 24;

        expect(pisoEmHoras).toBeGreaterThanOrEqual(
            DEFAULT_MEMORY_PARAMS.delayedRetentionMinHours,
        );
    });

    it('exige retenção mais alta das competências críticas de segurança', () => {
        expect(DEFAULT_MEMORY_PARAMS.targetRetentionCriticalSafety).toBeGreaterThan(
            DEFAULT_MEMORY_PARAMS.targetRetention,
        );
    });

    it('mantém pesos e limiares dentro de faixas utilizáveis', () => {
        expect(DEFAULT_MEMORY_PARAMS.alpha).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.hintPenalty).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.hintPenalty).toBeLessThanOrEqual(1);
        expect(DEFAULT_MEMORY_PARAMS.lapseFactor).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.lapseFactor).toBeLessThan(1);
        expect(DEFAULT_MEMORY_PARAMS.targetRetention).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.targetRetention).toBeLessThan(1);
        expect(DEFAULT_MEMORY_PARAMS.minIntervalDays).toBeLessThan(
            DEFAULT_MEMORY_PARAMS.maxIntervalDays,
        );
    });
});
```

- [ ] **Step 2: Rodar o teste e ver falhar**

Run: `cd radiant-app && npx jest src/constants/competencyReview.test.ts --runInBand`
Expected: FAIL com `Cannot find module './competencyReview'`

- [ ] **Step 3: Escrever os tipos**

```ts
// radiant-app/src/types/competencyReview.ts

/**
 * Agendamento de revisão por competência.
 *
 * A nota não é a escala 0–5 do SM-2. O motor de domínio já registra `outcome` e
 * `hintUsed` por interação em `LearningEvidence`; inventar uma segunda escala
 * aqui criaria duas verdades sobre o mesmo acerto.
 */

export type ReviewOutcome = 'correct' | 'incorrect';

export type ReviewGrade = {
    outcome: ReviewOutcome;
    hintUsed: boolean;
};

export type CompetencyReviewCard = {
    competencyId: string;
    /** Dias até a recuperabilidade cair ao alvo. */
    stability: number;
    /** 0–1. */
    difficulty: number;
    reps: number;
    lapses: number;
    /** ISO. */
    lastReviewedAt: string;
    /** ISO, derivado da estabilidade e do alvo; persistido para consulta barata. */
    dueAt: string;
};

export type MemoryParams = {
    /** Forma da curva de esquecimento. */
    alpha: number;
    /** Quanto um acerto consolida. */
    stabilityGain: number;
    /** Quanto um erro encolhe a estabilidade. */
    lapseFactor: number;
    /** Desconto aplicado ao acerto obtido com dica. */
    hintPenalty: number;
    difficultyStep: number;
    initialStabilityCorrect: number;
    initialStabilityIncorrect: number;
    initialDifficulty: number;
    targetRetention: number;
    targetRetentionCriticalSafety: number;
    /**
     * Decorrido mínimo para uma recuperação contar como retardada. Curto o
     * bastante para uma revisão "no dia seguinte" sempre qualificar mesmo com
     * horas de deriva; longo o bastante para nenhuma repetição na mesma noite
     * qualificar.
     */
    delayedRetentionMinHours: number;
    minIntervalDays: number;
    maxIntervalDays: number;
};

export type CompetencyReviewStore = {
    schemaVersion: number;
    cards: Record<string, CompetencyReviewCard>;
    /** Último `now` observado; detecta relógio que andou para trás. */
    lastSeenClock: string;
    updatedAt: string;
};

export type DueCompetency = {
    competencyId: string;
    /** Recuperabilidade estimada no instante da consulta; menor é mais urgente. */
    retrievability: number;
    criticalSafety: boolean;
};
```

- [ ] **Step 4: Escrever as constantes**

```ts
// radiant-app/src/constants/competencyReview.ts

import type { MemoryParams } from '../types/competencyReview';

export const COMPETENCY_REVIEW_SCHEMA_VERSION = 1;

export const COMPETENCY_REVIEW_STORAGE_KEYS = {
    STORE: '@radiant:competency_review_v1',
    QUARANTINE: '@radiant:competency_review_v1:quarantine',
} as const;

/**
 * Oito constantes de modelo e cinco de política. O FSRS traz 17–21, otimizadas
 * sobre históricos enormes de flashcards; herdá-las aqui seria adotar números
 * que ninguém neste projeto pode justificar nem reajustar. O formato do estado
 * é o mesmo, então promover a fórmula completa depois troca a matemática sem
 * remodelar dados.
 *
 * INVARIANTE, travada por teste em `competencyReview.test.ts`:
 *   minIntervalDays * 24 >= delayedRetentionMinHours
 * Sem ela, uma revisão agendada pode acontecer antes do limiar e não contar
 * como retenção — e o sistema não daria sinal nenhum.
 */
export const DEFAULT_MEMORY_PARAMS: MemoryParams = {
    alpha: 0.5,
    stabilityGain: 2.5,
    lapseFactor: 0.4,
    hintPenalty: 0.5,
    difficultyStep: 0.1,
    initialStabilityCorrect: 3,
    initialStabilityIncorrect: 1,
    initialDifficulty: 0.3,
    targetRetention: 0.9,
    targetRetentionCriticalSafety: 0.95,
    delayedRetentionMinHours: 20,
    minIntervalDays: 1,
    maxIntervalDays: 365,
};
```

- [ ] **Step 5: Rodar o teste e ver passar**

Run: `cd radiant-app && npx jest src/constants/competencyReview.test.ts --runInBand`
Expected: PASS, 3 testes

- [ ] **Step 6: Gate e commit**

```bash
cd radiant-app && npm run quality
git add src/types/competencyReview.ts src/constants/competencyReview.ts src/constants/competencyReview.test.ts
git commit -m "feat(review): tipos e constantes do agendador por competencia"
```

---

### Task 2: O modelo de memória, puro

**Files:**
- Create: `radiant-app/src/features/spaced-repetition/models/memoryModel.ts`
- Test: `radiant-app/src/features/spaced-repetition/models/memoryModel.test.ts`

**Interfaces:**
- Consumes: `CompetencyReviewCard`, `ReviewGrade`, `MemoryParams` de `types/competencyReview`; `DEFAULT_MEMORY_PARAMS` de `constants/competencyReview`.
- Produces:
  - `retrievability(elapsedDays: number, stability: number, params: MemoryParams): number`
  - `intervalForTarget(stability: number, targetRetention: number, params: MemoryParams): number`
  - `elapsedDaysBetween(fromIso: string, toIso: string): number`
  - `isDelayedRetention(lastExposureIso: string, nowIso: string, params: MemoryParams): boolean`
  - `scheduleNext(input: ScheduleInput): CompetencyReviewCard`, onde
    `ScheduleInput = { card: CompetencyReviewCard | null; competencyId: string; grade: ReviewGrade; criticalSafety: boolean; params: MemoryParams; now: string }`

- [ ] **Step 1: Escrever os testes vermelhos**

```ts
// radiant-app/src/features/spaced-repetition/models/memoryModel.test.ts
import { DEFAULT_MEMORY_PARAMS } from '../../../constants/competencyReview';
import type { CompetencyReviewCard, ReviewGrade } from '../../../types/competencyReview';
import {
    elapsedDaysBetween,
    intervalForTarget,
    isDelayedRetention,
    retrievability,
    scheduleNext,
} from './memoryModel';

const P = DEFAULT_MEMORY_PARAMS;
const ACERTO: ReviewGrade = { outcome: 'correct', hintUsed: false };
const ACERTO_COM_DICA: ReviewGrade = { outcome: 'correct', hintUsed: true };
const ERRO: ReviewGrade = { outcome: 'incorrect', hintUsed: false };

function cartao(overrides: Partial<CompetencyReviewCard> = {}): CompetencyReviewCard {
    return {
        competencyId: 'competency:protecao-radiologica:blindagem',
        stability: 10,
        difficulty: 0.3,
        reps: 2,
        lapses: 0,
        lastReviewedAt: '2026-01-01T00:00:00.000Z',
        dueAt: '2026-01-03T00:00:00.000Z',
        ...overrides,
    };
}

describe('retrievability', () => {
    it('vale 1 no instante da revisão e decresce com o tempo', () => {
        expect(retrievability(0, 10, P)).toBeCloseTo(1, 6);
        expect(retrievability(5, 10, P)).toBeLessThan(1);
        expect(retrievability(30, 10, P)).toBeLessThan(retrievability(5, 10, P));
    });

    it('trata decorrido negativo como zero', () => {
        expect(retrievability(-5, 10, P)).toBeCloseTo(1, 6);
    });

    it('devolve 0 para estabilidade não positiva', () => {
        expect(retrievability(1, 0, P)).toBe(0);
    });
});

describe('intervalForTarget', () => {
    it('respeita o piso mesmo quando a fórmula pede menos', () => {
        // Com r=0,95, S=3 e alpha=0,5 a fórmula pede ~0,324 dia (7,8 h).
        expect(intervalForTarget(3, 0.95, P)).toBe(P.minIntervalDays);
    });

    it('cresce com a estabilidade e respeita o teto', () => {
        expect(intervalForTarget(100, 0.9, P)).toBeGreaterThan(intervalForTarget(10, 0.9, P));
        expect(intervalForTarget(1e9, 0.9, P)).toBe(P.maxIntervalDays);
    });

    it('pede intervalo menor quando a retenção alvo é mais alta', () => {
        expect(intervalForTarget(100, 0.95, P)).toBeLessThan(intervalForTarget(100, 0.9, P));
    });
});

describe('isDelayedRetention', () => {
    it('aceita decorrido acima do limiar', () => {
        expect(isDelayedRetention('2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z', P)).toBe(true);
    });

    it('recusa decorrido abaixo do limiar', () => {
        expect(isDelayedRetention('2026-01-01T00:00:00.000Z', '2026-01-01T10:00:00.000Z', P)).toBe(false);
    });

    it('recusa relógio retrocedido', () => {
        expect(isDelayedRetention('2026-01-02T00:00:00.000Z', '2026-01-01T00:00:00.000Z', P)).toBe(false);
    });

    it('recusa data ilegível', () => {
        expect(isDelayedRetention('nao-e-data', '2026-01-02T00:00:00.000Z', P)).toBe(false);
    });
});

describe('scheduleNext', () => {
    it('cria cartão na primeira exposição com acerto', () => {
        const resultado = scheduleNext({
            card: null,
            competencyId: 'competency:x:y',
            grade: ACERTO,
            criticalSafety: false,
            params: P,
            now: '2026-01-01T00:00:00.000Z',
        });

        expect(resultado.stability).toBe(P.initialStabilityCorrect);
        expect(resultado.difficulty).toBe(P.initialDifficulty);
        expect(resultado.reps).toBe(1);
        expect(resultado.lapses).toBe(0);
        expect(resultado.lastReviewedAt).toBe('2026-01-01T00:00:00.000Z');
    });

    it('cria cartão mais frágil na primeira exposição com erro', () => {
        const resultado = scheduleNext({
            card: null,
            competencyId: 'competency:x:y',
            grade: ERRO,
            criticalSafety: false,
            params: P,
            now: '2026-01-01T00:00:00.000Z',
        });

        expect(resultado.stability).toBe(P.initialStabilityIncorrect);
        expect(resultado.lapses).toBe(1);
    });

    it('nunca reduz estabilidade no acerto nem aumenta no erro', () => {
        const base = cartao();

        const comAcerto = scheduleNext({
            card: base, competencyId: base.competencyId, grade: ACERTO,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        });
        const comErro = scheduleNext({
            card: base, competencyId: base.competencyId, grade: ERRO,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        });

        expect(comAcerto.stability).toBeGreaterThanOrEqual(base.stability);
        expect(comErro.stability).toBeLessThanOrEqual(base.stability);
    });

    it('nunca deixa a estabilidade cair abaixo do piso de erro', () => {
        const frageil = cartao({ stability: 1.2 });

        const resultado = scheduleNext({
            card: frageil, competencyId: frageil.competencyId, grade: ERRO,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        });

        expect(resultado.stability).toBeGreaterThanOrEqual(P.initialStabilityIncorrect);
    });

    it('mantém a dificuldade dentro de [0, 1] sob sequência longa', () => {
        let atual = cartao({ difficulty: 0.95 });
        for (let i = 0; i < 40; i += 1) {
            atual = scheduleNext({
                card: atual, competencyId: atual.competencyId, grade: ERRO,
                criticalSafety: false, params: P, now: `2026-02-${String((i % 27) + 1).padStart(2, '0')}T00:00:00.000Z`,
            });
        }
        expect(atual.difficulty).toBeLessThanOrEqual(1);
        expect(atual.difficulty).toBeGreaterThanOrEqual(0);
    });

    it('consolida MENOS quando o acerto veio com dica', () => {
        const base = cartao();
        const argumentos = {
            card: base, competencyId: base.competencyId,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        };

        const semDica = scheduleNext({ ...argumentos, grade: ACERTO });
        const comDica = scheduleNext({ ...argumentos, grade: ACERTO_COM_DICA });

        expect(comDica.stability).toBeLessThan(semDica.stability);
    });

    it('consolida MAIS quando a revisão acontece mais tarde', () => {
        const base = cartao();
        const argumentos = {
            card: base, competencyId: base.competencyId, grade: ACERTO,
            criticalSafety: false, params: P,
        };

        const cedo = scheduleNext({ ...argumentos, now: '2026-01-02T00:00:00.000Z' });
        const tarde = scheduleNext({ ...argumentos, now: '2026-01-25T00:00:00.000Z' });

        expect(tarde.stability).toBeGreaterThan(cedo.stability);
    });

    it('agenda a competência crítica de segurança mais cedo', () => {
        const base = cartao({ stability: 100 });
        const argumentos = {
            card: base, competencyId: base.competencyId, grade: ACERTO,
            params: P, now: '2026-01-11T00:00:00.000Z',
        };

        const comum = scheduleNext({ ...argumentos, criticalSafety: false });
        const critica = scheduleNext({ ...argumentos, criticalSafety: true });

        expect(Date.parse(critica.dueAt)).toBeLessThan(Date.parse(comum.dueAt));
    });

    it('sempre agenda no mínimo o piso de intervalo à frente', () => {
        const resultado = scheduleNext({
            card: null, competencyId: 'competency:x:y', grade: ERRO,
            criticalSafety: true, params: P, now: '2026-01-01T00:00:00.000Z',
        });

        const horas = elapsedDaysBetween(resultado.lastReviewedAt, resultado.dueAt) * 24;
        expect(horas).toBeGreaterThanOrEqual(P.delayedRetentionMinHours);
    });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/spaced-repetition/models/memoryModel.test.ts --runInBand`
Expected: FAIL com `Cannot find module './memoryModel'`

- [ ] **Step 3: Implementar o modelo**

```ts
// radiant-app/src/features/spaced-repetition/models/memoryModel.ts

/**
 * Modelo de memória por competência.
 *
 * Puro e determinístico: não lê relógio, não lê storage, não conhece o
 * catálogo. `now` entra por parâmetro. É a mesma disciplina de
 * `calculateCompetencyMastery`, e pelo mesmo motivo — sem relógio interno, as
 * mesmas entradas sempre produzem o mesmo estado, e discordar do resultado vira
 * discutir limiares em vez de caçar não-determinismo.
 *
 * Este módulo existe para fabricar `delayed-retention` na hora certa. O
 * intervalo que ele escolhe é o que decide se a evidência conta.
 */

import type {
    CompetencyReviewCard,
    MemoryParams,
    ReviewGrade,
} from '../../../types/competencyReview';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export type ScheduleInput = {
    card: CompetencyReviewCard | null;
    competencyId: string;
    grade: ReviewGrade;
    criticalSafety: boolean;
    params: MemoryParams;
    now: string;
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Decorrido em dias, **clampado em zero**. Data ilegível ou relógio retrocedido
 * devolvem 0 — ambiguidade resolve contra conceder domínio.
 */
export function elapsedDaysBetween(fromIso: string, toIso: string): number {
    const from = Date.parse(fromIso);
    const to = Date.parse(toIso);

    if (Number.isNaN(from) || Number.isNaN(to)) {
        return 0;
    }

    return Math.max(0, (to - from) / MS_POR_DIA);
}

/**
 * Decaimento por potência, não exponencial: esquecimento tem cauda pesada, e a
 * exponencial erra justamente nos intervalos longos, que são os que interessam
 * a um sistema de manutenção de competência.
 */
export function retrievability(
    elapsedDays: number,
    stability: number,
    params: MemoryParams,
): number {
    if (stability <= 0) {
        return 0;
    }

    const t = Math.max(0, elapsedDays);
    return Math.pow(1 + t / stability, -params.alpha);
}

/** Inverte a curva no alvo de retenção e aplica piso e teto. */
export function intervalForTarget(
    stability: number,
    targetRetention: number,
    params: MemoryParams,
): number {
    const bruto = stability * (Math.pow(targetRetention, -1 / params.alpha) - 1);
    return clamp(bruto, params.minIntervalDays, params.maxIntervalDays);
}

/**
 * Uma recuperação só conta como retardada se o decorrido passou do limiar.
 * Falha fechado em data ilegível e em relógio retrocedido.
 */
export function isDelayedRetention(
    lastExposureIso: string,
    nowIso: string,
    params: MemoryParams,
): boolean {
    const from = Date.parse(lastExposureIso);
    const to = Date.parse(nowIso);

    if (Number.isNaN(from) || Number.isNaN(to)) {
        return false;
    }

    const horas = (to - from) / (60 * 60 * 1000);
    return horas >= params.delayedRetentionMinHours;
}

function cartaoInicial(input: ScheduleInput): CompetencyReviewCard {
    const { competencyId, grade, criticalSafety, params, now } = input;
    const acertou = grade.outcome === 'correct';

    const stability = acertou
        ? params.initialStabilityCorrect
        : params.initialStabilityIncorrect;

    const alvo = criticalSafety
        ? params.targetRetentionCriticalSafety
        : params.targetRetention;

    return {
        competencyId,
        stability,
        difficulty: params.initialDifficulty,
        reps: 1,
        lapses: acertou ? 0 : 1,
        lastReviewedAt: now,
        dueAt: somaDias(now, intervalForTarget(stability, alvo, params)),
    };
}

function somaDias(iso: string, dias: number): string {
    const base = Date.parse(iso);
    const referencia = Number.isNaN(base) ? 0 : base;
    return new Date(referencia + dias * MS_POR_DIA).toISOString();
}

export function scheduleNext(input: ScheduleInput): CompetencyReviewCard {
    const { card, grade, criticalSafety, params, now } = input;

    if (card === null) {
        return cartaoInicial(input);
    }

    const decorrido = elapsedDaysBetween(card.lastReviewedAt, now);
    const r = retrievability(decorrido, card.stability, params);

    let stability: number;
    let difficulty: number;
    let lapses = card.lapses;

    if (grade.outcome === 'correct') {
        // (1 - r) é o coração da decisão: acertar quando a recuperabilidade já
        // caiu vale mais que acertar logo depois. É a dificuldade desejável
        // expressa como aritmética, e é o que o easeFactor do SM-2 não sabe
        // fazer — ele não conhece o tempo decorrido.
        const desconto = grade.hintUsed ? params.hintPenalty : 1;
        const ganho = params.stabilityGain * (1 - card.difficulty) * (1 - r) * desconto;

        stability = card.stability * (1 + ganho);
        difficulty = clamp(card.difficulty - params.difficultyStep, 0, 1);
    } else {
        // O piso é a própria estabilidade inicial de erro: um lapso devolve a
        // competência ao ponto de partida de quem errou na primeira exposição,
        // e nunca abaixo disso.
        stability = Math.max(params.initialStabilityIncorrect, card.stability * params.lapseFactor);
        difficulty = clamp(card.difficulty + params.difficultyStep, 0, 1);
        lapses += 1;
    }

    const alvo = criticalSafety
        ? params.targetRetentionCriticalSafety
        : params.targetRetention;

    return {
        competencyId: card.competencyId,
        stability,
        difficulty,
        reps: card.reps + 1,
        lapses,
        lastReviewedAt: now,
        dueAt: somaDias(now, intervalForTarget(stability, alvo, params)),
    };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/spaced-repetition/models/memoryModel.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Gate e commit**

```bash
cd radiant-app && npm run quality
git add src/features/spaced-repetition/models/memoryModel.ts src/features/spaced-repetition/models/memoryModel.test.ts
git commit -m "feat(review): modelo de memoria por competencia, puro e determinista"
```

---

### Task 3: O serviço de revisão por competência

**Files:**
- Create: `radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.ts`
- Test: `radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.test.ts`

**Interfaces:**
- Consumes: tudo o que a Task 2 produz; `COMPETENCY_REVIEW_SCHEMA_VERSION`, `COMPETENCY_REVIEW_STORAGE_KEYS`, `DEFAULT_MEMORY_PARAMS`; `CompetencyReviewStore`, `DueCompetency`.
- Produces, todos `static` em `CompetencyReviewService`:
  - `recordReview(input: { competencyId: string; grade: ReviewGrade; criticalSafety: boolean; now: string }): Promise<{ evidenceKind: 'delayed-retention' | 'independent-recall' }>`
  - `observeExposure(input: { competencyId: string; grade: ReviewGrade; criticalSafety: boolean; now: string }): Promise<void>`
  - `getDue(now: string, isCriticalSafety: (competencyId: string) => boolean): Promise<DueCompetency[]>`
  - `reset(): Promise<void>`

`getDue` recebe o consultor de `criticalSafety` em vez de guardá-lo no cartão: assim o serviço não precisa conhecer o currículo, e uma mudança de marcação vale imediatamente sem migrar dados.

- [ ] **Step 1: Escrever os testes vermelhos**

```ts
// radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPETENCY_REVIEW_STORAGE_KEYS } from '../../../constants/competencyReview';
import type { ReviewGrade } from '../../../types/competencyReview';
import { CompetencyReviewService } from './CompetencyReviewService';

const ACERTO: ReviewGrade = { outcome: 'correct', hintUsed: false };
const ERRO: ReviewGrade = { outcome: 'incorrect', hintUsed: false };
const SEM_CRITICO = () => false;

beforeEach(async () => {
    await AsyncStorage.clear();
});

describe('CompetencyReviewService', () => {
    it('não devolve nada quando nunca houve exposição', async () => {
        expect(await CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO)).toEqual([]);
    });

    it('cria cartão na exposição e não o devolve como vencido no mesmo instante', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        expect(await CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO)).toEqual([]);
    });

    it('devolve como vencido depois de passado o intervalo', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const vencidas = await CompetencyReviewService.getDue('2026-06-01T00:00:00.000Z', SEM_CRITICO);

        expect(vencidas.map((item) => item.competencyId)).toEqual(['competency:a:b']);
    });

    it('ordena as vencidas por recuperabilidade crescente', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:antiga', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:recente', grade: ACERTO,
            criticalSafety: false, now: '2026-05-01T00:00:00.000Z',
        });

        const vencidas = await CompetencyReviewService.getDue('2026-06-01T00:00:00.000Z', SEM_CRITICO);

        expect(vencidas[0].competencyId).toBe('competency:antiga');
        expect(vencidas[0].retrievability).toBeLessThan(vencidas[1].retrievability);
    });

    it('concede delayed-retention quando o decorrido passa do limiar', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-05T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('delayed-retention');
    });

    it('recusa delayed-retention no mesmo dia', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T09:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('recusa delayed-retention quando o relógio andou para trás', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-10T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-02T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('nunca concede delayed-retention no erro', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ERRO,
            criticalSafety: false, now: '2026-02-01T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('põe store ilegível em quarentena em vez de apagar em silêncio', async () => {
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, '{ isto nao e json');

        expect(await CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO)).toEqual([]);
        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE))
            .toBe('{ isto nao e json');
    });

    it('lê como vazio e recusa escrever sobre schema mais novo', async () => {
        const futuro = JSON.stringify({
            schemaVersion: 999, cards: {}, lastSeenClock: '', updatedAt: '',
        });
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, futuro);

        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE)).toBe(futuro);
    });

    it('não propaga erro de storage para o chamador', async () => {
        const espia = jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('disco cheio'));

        await expect(
            CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO),
        ).resolves.toEqual([]);

        espia.mockRestore();
    });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/spaced-repetition/services/CompetencyReviewService.test.ts --runInBand`
Expected: FAIL com `Cannot find module './CompetencyReviewService'`

- [ ] **Step 3: Implementar o serviço**

```ts
// radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.ts

/**
 * Agendamento de revisão por competência.
 *
 * Serviço paralelo ao `SpacedRepetitionService`: chave e schema novos, sem
 * migração destrutiva. O caminho legado por lição continua exatamente como
 * está.
 *
 * Impuro e fino de propósito — carrega, pergunta ao modelo, salva. Toda a regra
 * pedagógica vive em `memoryModel`, que é puro e testável sem esperar dias.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    COMPETENCY_REVIEW_SCHEMA_VERSION,
    COMPETENCY_REVIEW_STORAGE_KEYS,
    DEFAULT_MEMORY_PARAMS,
} from '../../../constants/competencyReview';
import type {
    CompetencyReviewStore,
    DueCompetency,
    ReviewGrade,
} from '../../../types/competencyReview';
import {
    elapsedDaysBetween,
    isDelayedRetention,
    retrievability,
    scheduleNext,
} from '../models/memoryModel';

type ReviewInput = {
    competencyId: string;
    grade: ReviewGrade;
    criticalSafety: boolean;
    now: string;
};

function storeVazio(now: string): CompetencyReviewStore {
    return {
        schemaVersion: COMPETENCY_REVIEW_SCHEMA_VERSION,
        cards: {},
        lastSeenClock: now,
        updatedAt: now,
    };
}

export class CompetencyReviewService {
    /**
     * Store ilegível não é apagado em silêncio: a string crua vai para uma
     * chave de quarentena. Perder progresso é ruim; perder progresso sem deixar
     * rastro é pior.
     *
     * `schemaVersion` maior que a atual lê como vazio — e `saveStore` recusa
     * escrever, para uma versão antiga do app não corromper dados de uma nova.
     */
    private static async loadStore(now: string): Promise<CompetencyReviewStore> {
        try {
            const cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
            if (!cru) {
                return storeVazio(now);
            }

            const parsed = JSON.parse(cru) as CompetencyReviewStore;
            if (parsed.schemaVersion > COMPETENCY_REVIEW_SCHEMA_VERSION) {
                return storeVazio(now);
            }

            return { ...storeVazio(now), ...parsed };
        } catch (error) {
            console.error('[CompetencyReviewService] Store ilegivel, indo para quarentena:', error);
            try {
                const cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
                if (cru) {
                    await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE, cru);
                    await AsyncStorage.removeItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
                }
            } catch (quarantineError) {
                console.error('[CompetencyReviewService] Falha ao pôr em quarentena:', quarantineError);
            }
            return storeVazio(now);
        }
    }

    private static async saveStore(store: CompetencyReviewStore, now: string): Promise<void> {
        try {
            const cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
            if (cru) {
                const atual = JSON.parse(cru) as CompetencyReviewStore;
                if (atual.schemaVersion > COMPETENCY_REVIEW_SCHEMA_VERSION) {
                    return;
                }
            }

            await AsyncStorage.setItem(
                COMPETENCY_REVIEW_STORAGE_KEYS.STORE,
                JSON.stringify({ ...store, lastSeenClock: now, updatedAt: now }),
            );
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao salvar:', error);
        }
    }

    /**
     * Atividade autorada: o agendador apenas observa. O tipo da evidência
     * continua sendo do autor, por `interaction.evidenceKind`.
     */
    static async observeExposure(input: ReviewInput): Promise<void> {
        const store = await this.loadStore(input.now);
        const atual = store.cards[input.competencyId] ?? null;

        store.cards[input.competencyId] = scheduleNext({
            card: atual,
            competencyId: input.competencyId,
            grade: input.grade,
            criticalSafety: input.criticalSafety,
            params: DEFAULT_MEMORY_PARAMS,
            now: input.now,
        });

        await this.saveStore(store, input.now);
    }

    /**
     * Sessão de revisão: aqui o agendador é a autoridade sobre o tipo da
     * evidência, porque foi ele quem marcou a hora.
     */
    static async recordReview(
        input: ReviewInput,
    ): Promise<{ evidenceKind: 'delayed-retention' | 'independent-recall' }> {
        const store = await this.loadStore(input.now);
        const atual = store.cards[input.competencyId] ?? null;

        const retardada = input.grade.outcome === 'correct'
            && atual !== null
            && isDelayedRetention(atual.lastReviewedAt, input.now, DEFAULT_MEMORY_PARAMS);

        store.cards[input.competencyId] = scheduleNext({
            card: atual,
            competencyId: input.competencyId,
            grade: input.grade,
            criticalSafety: input.criticalSafety,
            params: DEFAULT_MEMORY_PARAMS,
            now: input.now,
        });

        await this.saveStore(store, input.now);

        return { evidenceKind: retardada ? 'delayed-retention' : 'independent-recall' };
    }

    /** Vencidas primeiro, e entre elas quem está mais perto de ser esquecido. */
    static async getDue(
        now: string,
        isCriticalSafety: (competencyId: string) => boolean,
    ): Promise<DueCompetency[]> {
        try {
            const store = await this.loadStore(now);
            const referencia = Date.parse(now);
            if (Number.isNaN(referencia)) {
                return [];
            }

            return Object.values(store.cards)
                .filter((card) => {
                    const vence = Date.parse(card.dueAt);
                    return !Number.isNaN(vence) && vence <= referencia;
                })
                .map((card) => ({
                    competencyId: card.competencyId,
                    retrievability: retrievability(
                        elapsedDaysBetween(card.lastReviewedAt, now),
                        card.stability,
                        DEFAULT_MEMORY_PARAMS,
                    ),
                    criticalSafety: isCriticalSafety(card.competencyId),
                }))
                .sort((a, b) => {
                    if (a.retrievability !== b.retrievability) {
                        return a.retrievability - b.retrievability;
                    }
                    return Number(b.criticalSafety) - Number(a.criticalSafety);
                });
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao consultar vencidas:', error);
            return [];
        }
    }

    static async reset(): Promise<void> {
        try {
            await AsyncStorage.removeItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao limpar:', error);
        }
    }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/spaced-repetition/services/CompetencyReviewService.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Gate e commit**

```bash
cd radiant-app && npm run quality
git add src/features/spaced-repetition/services/CompetencyReviewService.ts src/features/spaced-repetition/services/CompetencyReviewService.test.ts
git commit -m "feat(review): servico de revisao por competencia com quarentena e relogio fechado"
```

---

### Task 4: O resolver de nó para competência

**Files:**
- Create: `radiant-app/src/features/journey/services/JourneyNodeCompetencyResolver.ts`
- Test: `radiant-app/src/features/journey/services/JourneyNodeCompetencyResolver.test.ts`

**Interfaces:**
- Consumes: `JourneyNodeDefinition` de `types/journey`; `LEGACY_COMPETENCY_PREFIX` de `features/lesson-flow/services/LegacyLessonAdapter`.
- Produces: `resolveNodeCompetencies(node: JourneyNodeDefinition): NodeCompetencyResolution`, onde `NodeCompetencyResolution = { nodeId: string; competencyIds: string[]; legacyOnly: boolean }`.

Este é o ponto fraco declarado da spec: hoje os dois espaços de identificador não se tocam. A jornada usa `node:lesson-1`; o currículo usa `competency:protecao-radiologica:blindagem`. O resolver isola essa tradução num lugar só, para que a Task 13 tenha um alvo único quando unificar Galáxia e jornada.

- [ ] **Step 1: Escrever os testes vermelhos**

```ts
// radiant-app/src/features/journey/services/JourneyNodeCompetencyResolver.test.ts
import type { JourneyNodeDefinition } from '../../../types/journey';
import { resolveNodeCompetencies } from './JourneyNodeCompetencyResolver';

function no(overrides: Partial<JourneyNodeDefinition> = {}): JourneyNodeDefinition {
    return {
        id: 'node:lesson-1',
        unitId: 'unit:foundations',
        type: 'lesson',
        title: 'Lição 1',
        lessonId: 'lesson-1',
        ...overrides,
    } as JourneyNodeDefinition;
}

describe('resolveNodeCompetencies', () => {
    it('resolve nó de lição legada para a competência sintética da lição', () => {
        const resultado = resolveNodeCompetencies(no());

        expect(resultado.competencyIds).toEqual(['competency:legacy:lesson-1']);
        expect(resultado.legacyOnly).toBe(true);
        expect(resultado.nodeId).toBe('node:lesson-1');
    });

    it('devolve lista vazia e não-legado quando o nó não aponta para lição', () => {
        const resultado = resolveNodeCompetencies(
            no({ id: 'node:checkpoint:foundations', type: 'checkpoint', lessonId: undefined }),
        );

        expect(resultado.competencyIds).toEqual([]);
        expect(resultado.legacyOnly).toBe(false);
    });

    it('marca legacyOnly quando toda competência resolvida tem o prefixo legado', () => {
        const resultado = resolveNodeCompetencies(no({ lessonId: 'lesson-2' }));

        expect(resultado.competencyIds.every((id) => id.startsWith('competency:legacy:'))).toBe(true);
        expect(resultado.legacyOnly).toBe(true);
    });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/journey/services/JourneyNodeCompetencyResolver.test.ts --runInBand`
Expected: FAIL com `Cannot find module './JourneyNodeCompetencyResolver'`

- [ ] **Step 3: Implementar o resolver**

```ts
// radiant-app/src/features/journey/services/JourneyNodeCompetencyResolver.ts

/**
 * Traduz nó da jornada em competências.
 *
 * Existe isolado porque hoje os dois espaços de identificador não se tocam: a
 * jornada usa `node:lesson-1`, o currículo usa
 * `competency:protecao-radiologica:blindagem`. Enquanto não houver atividade
 * v2, todo nó resolve para a competência sintética por lição que o
 * `LegacyLessonAdapter` emite — e o motor de domínio descarta evidência legada
 * por padrão.
 *
 * Consequência desejada: `legacyOnly` é `true` em tudo, `getDue` volta vazio, e
 * a recomendação cai no comportamento de hoje. O sistema entra desligado e
 * acende sozinho quando o conteúdo v2 existir.
 */

import { LEGACY_COMPETENCY_PREFIX } from '../../lesson-flow/services/LegacyLessonAdapter';
import type { JourneyNodeDefinition } from '../../../types/journey';

export type NodeCompetencyResolution = {
    nodeId: string;
    competencyIds: string[];
    legacyOnly: boolean;
};

export function resolveNodeCompetencies(node: JourneyNodeDefinition): NodeCompetencyResolution {
    if (!node.lessonId) {
        return { nodeId: node.id, competencyIds: [], legacyOnly: false };
    }

    const competencyIds = [`${LEGACY_COMPETENCY_PREFIX}${node.lessonId}`];

    return {
        nodeId: node.id,
        competencyIds,
        legacyOnly: competencyIds.every((id) => id.startsWith(LEGACY_COMPETENCY_PREFIX)),
    };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/journey/services/JourneyNodeCompetencyResolver.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Gate e commit**

```bash
cd radiant-app && npm run quality
git add src/features/journey/services/JourneyNodeCompetencyResolver.ts src/features/journey/services/JourneyNodeCompetencyResolver.test.ts
git commit -m "feat(journey): resolver de no para competencia, isolado"
```

---

### Task 5: Recomendação explicável, com guarda de regressão

**Files:**
- Modify: `radiant-app/src/types/journey.ts`
- Modify: `radiant-app/src/features/journey/services/JourneyRecommendationService.ts`
- Create: `radiant-app/src/features/journey/services/JourneyRecommendationService.test.ts`

**Interfaces:**
- Consumes: `DueCompetency` de `types/competencyReview`; `resolveNodeCompetencies` da Task 4.
- Produces:
  - `RecommendationReason = 'due-review' | 'weak-competency' | 'next-new'` em `types/journey`
  - `JourneySnapshot.recommendationReason: RecommendationReason`
  - `computeSnapshot(trackDefinition, progress, dueCompetencies?: DueCompetency[])` — **terceiro parâmetro opcional, default `[]`**

> **O arquivo de teste NÃO existe** — há `JourneyProgressService.test.ts` e
> `JourneyDefinitionService.test.ts`, mas nenhum para o recomendador. Esta task
> o cria, com os helpers escritos aqui. Não procure um helper existente para
> reaproveitar.

> **`computeSnapshot` continua SÍNCRONO.** A lista de vencidas entra por
> parâmetro em vez de o serviço ir buscá-la, por três razões: torná-lo `async`
> quebraria todos os chamadores; o serviço declara no próprio código que status
> é derivado e não armazenado, e ir ao AsyncStorage contradiria isso; e com a
> lista injetada o motivo fica testável sem mockar storage.
>
> O default `[]` é o que dá a degradação graciosa de graça: **todo chamador
> existente continua compilando e recebendo `next-new`**, sem alteração.

**As unlock rules continuam soberanas.** O motivo ordena entre os nós já disponíveis e nunca destrava nó algum.

- [ ] **Step 1: Escrever os testes vermelhos**

```ts
// radiant-app/src/features/journey/services/JourneyRecommendationService.test.ts
import { defaultTrack } from '../../../data/journey/defaultTrack';
import type { DueCompetency } from '../../../types/competencyReview';
import type { JourneyProgress } from '../../../types/journey';
import { JourneyRecommendationService } from './JourneyRecommendationService';

function progressoInicial(): JourneyProgress {
    return {
        schemaVersion: '1',
        activeTrackId: defaultTrack.id,
        currentUnitId: defaultTrack.initialUnitId,
        currentNodeId: null,
        completedNodeIds: [],
        pendingReviewNodeIds: [],
        lastUpdatedAt: '2026-01-01T00:00:00.000Z',
        pendingSyncEvents: [],
    };
}

function vencida(competencyId: string, criticalSafety = false): DueCompetency {
    return { competencyId, retrievability: 0.2, criticalSafety };
}

describe('motivo da recomendação', () => {
    it('GUARDA DE REGRESSÃO: sem vencidas, o motivo é next-new', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(defaultTrack, progressoInicial());

        expect(snapshot.recommendationReason).toBe('next-new');
    });

    it('GUARDA DE REGRESSÃO: omitir o parâmetro dá o mesmo resultado que passar lista vazia', () => {
        const semParametro = JourneyRecommendationService.computeSnapshot(defaultTrack, progressoInicial());
        const comVazia = JourneyRecommendationService.computeSnapshot(defaultTrack, progressoInicial(), []);

        expect(semParametro).toEqual(comVazia);
    });

    it('GUARDA DE REGRESSÃO: o nó recomendado não muda por causa do parâmetro novo', () => {
        const semParametro = JourneyRecommendationService.computeSnapshot(defaultTrack, progressoInicial());
        const comVencidaIrrelevante = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:inexistente')],
        );

        expect(comVencidaIrrelevante.nextRecommendedNode?.id).toBe(semParametro.nextRecommendedNode?.id);
    });

    it('devolve due-review quando uma vencida é coberta por nó já desbloqueado', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:lesson-1')],
        );

        expect(snapshot.recommendationReason).toBe('due-review');
    });

    it('NÃO destrava nó bloqueado, mesmo com vencida crítica apontando para ele', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:lesson-2', true)],
        );

        expect(snapshot.nextRecommendedNode?.status).not.toBe('locked');
        expect(snapshot.recommendationReason).toBe('next-new');
    });
});
```

> **Nota para quem implementa:** o teste assume que, no progresso inicial do
> `defaultTrack`, `node:lesson-1` está disponível e `node:lesson-2` ainda não —
> que é o que as `unlockRule` daquele arquivo produzem. Se a trilha padrão
> mudar, ajuste os identificadores dos testes, não a regra.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/journey/services/JourneyRecommendationService.test.ts --runInBand`
Expected: FAIL — `recommendationReason` é `undefined`

- [ ] **Step 3: Acrescentar o tipo**

```ts
// radiant-app/src/types/journey.ts — acrescentar junto aos demais tipos

export type RecommendationReason = 'due-review' | 'weak-competency' | 'next-new';
```

E acrescentar o campo a `JourneySnapshot`:

```ts
export type JourneySnapshot = {
    track: JourneyTrack;
    progress: JourneyProgress;
    nextRecommendedNode: JourneyNode | null;
    completedCount: number;
    dueReviewCount: number;
    /**
     * Por que este nó foi recomendado. Ordena entre os já disponíveis; nunca
     * destrava.
     */
    recommendationReason: RecommendationReason;
};
```

- [ ] **Step 4: Integrar na recomendação**

Acrescentar o import e a função pura no topo do arquivo, junto das outras
funções de módulo:

```ts
import { resolveNodeCompetencies } from './JourneyNodeCompetencyResolver';
import type { DueCompetency } from '../../../types/competencyReview';
import type { RecommendationReason } from '../../../types/journey';

/**
 * O motivo ordena entre nós JÁ DESBLOQUEADOS. Uma competência vencida num nó
 * bloqueado não abre o nó — o currículo continua sendo do autor.
 *
 * Puro e síncrono de propósito: a lista de vencidas entra por parâmetro em vez
 * de o serviço ir ao storage, porque este arquivo já declara que status é
 * derivado e não armazenado.
 */
function resolveReason(track: JourneyTrack, dueCompetencies: DueCompetency[]): RecommendationReason {
    if (dueCompetencies.length === 0) {
        return 'next-new';
    }

    const idsVencidos = new Set(dueCompetencies.map((item) => item.competencyId));

    const cobreVencida = track.units.some((unit) => unit.nodes.some((node) => (
        node.status !== 'locked'
        && resolveNodeCompetencies(node).competencyIds.some((id) => idsVencidos.has(id))
    )));

    return cobreVencida ? 'due-review' : 'next-new';
}
```

E mudar a assinatura de `computeSnapshot`, acrescentando o parâmetro opcional e
o campo ao retorno:

```ts
static computeSnapshot(
    trackDefinition: JourneyTrackDefinition,
    progress: JourneyProgress,
    dueCompetencies: DueCompetency[] = [],
): JourneySnapshot {
    // ... o corpo existente permanece, montando `track` e os contadores ...

    return {
        // ... os campos existentes permanecem ...
        recommendationReason: resolveReason(track, dueCompetencies),
    };
}
```

> **`weak-competency` fica declarado no tipo e ainda não é emitido.** Ele
> depende de ler domínio por competência, e com o catálogo atual todo domínio é
> `not-started` — emitir esse motivo hoje produziria uma explicação falsa na
> tela. Entra junto com o conteúdo v2, na Task 12.

- [ ] **Step 5: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/journey/services/JourneyRecommendationService.test.ts --runInBand`
Expected: PASS

- [ ] **Step 6: Gate e commit**

```bash
cd radiant-app && npm run quality
git add src/types/journey.ts src/features/journey/services/JourneyRecommendationService.ts src/features/journey/services/JourneyRecommendationService.test.ts
git commit -m "feat(journey): recomendacao explicavel sem destravar no algum"
```

---

### Task 6: Alimentar o agendador a partir da atividade concluída

**Files:**
- Modify: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts`
- Test: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts`

**Interfaces:**
- Consumes: `CompetencyReviewService.observeExposure` da Task 3.
- Produces: nada de novo. Fecha o laço — sem esta task, nenhum cartão é criado em produção e as Tasks 1–5 ficam corretas e inertes.

`recordEvidence` já grava uma evidência por interação. Esta task acrescenta, ao
final dela, a observação por competência. O agendador **observa**: o tipo da
evidência continua sendo do autor, por `interaction.evidenceKind`.

- [ ] **Step 1: Escrever os testes vermelhos**

```ts
// acrescentar a radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts
import { CompetencyReviewService } from '../../spaced-repetition/services/CompetencyReviewService';

describe('alimentação do agendador por competência', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('observa uma vez por competência, não uma por interação', async () => {
        const espia = jest.spyOn(CompetencyReviewService, 'observeExposure').mockResolvedValue();

        await registrarLicaoLegadaComDuasInteracoes();

        expect(espia).toHaveBeenCalledTimes(1);
    });

    it('marca acerto só quando todas as interações da competência acertaram', async () => {
        const espia = jest.spyOn(CompetencyReviewService, 'observeExposure').mockResolvedValue();

        await registrarLicaoLegadaComUmErro();

        expect(espia).toHaveBeenCalledWith(
            expect.objectContaining({ grade: expect.objectContaining({ outcome: 'incorrect' }) }),
        );
    });

    it('marca dica quando qualquer interação da competência usou dica', async () => {
        const espia = jest.spyOn(CompetencyReviewService, 'observeExposure').mockResolvedValue();

        await registrarLicaoLegadaComDica();

        expect(espia).toHaveBeenCalledWith(
            expect.objectContaining({ grade: expect.objectContaining({ hintUsed: true }) }),
        );
    });

    it('não derruba a conclusão da atividade quando a observação falha', async () => {
        jest.spyOn(CompetencyReviewService, 'observeExposure')
            .mockRejectedValue(new Error('storage'));

        await expect(registrarLicaoLegadaComDuasInteracoes()).resolves.not.toThrow();
    });
});
```

> **Nota para quem implementa:** os quatro helpers `registrarLicaoLegada*`
> montam um `LessonOutcomeInput` a partir de um bloco do catálogo legado e
> chamam `LessonOutcomeService.record(...)`, variando `confirmedAnswers` e
> `hintUsedByInteraction`. Escreva-os no topo do `describe`, seguindo o formato
> de entrada que os testes já existentes neste arquivo usam para montar
> `LessonOutcomeInput`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/lesson-flow/services/LessonOutcomeService.test.ts --runInBand`
Expected: FAIL — `observeExposure` não foi chamado

- [ ] **Step 3: Implementar a observação**

Ao final de `recordEvidence`, depois do laço que grava as evidências:

```ts
await this.observeCompetencies(activity, input, recordedAt);
```

E acrescentar o método privado:

```ts
/**
 * Uma observação por COMPETÊNCIA, não por interação: o cartão modela a memória
 * da competência, e chamar o agendador uma vez por interação faria a mesma
 * sessão consolidar várias vezes o mesmo conhecimento.
 *
 * Acerto exige que todas as interações daquela competência tenham acertado;
 * dica basta uma. É a leitura conservadora, coerente com o resto do sistema:
 * ambiguidade resolve contra conceder domínio.
 *
 * Best-effort como o resto do arquivo: agendar não pode derrubar a conclusão.
 */
private async observeCompetencies(
    activity: LearningActivityV2,
    input: LessonOutcomeInput,
    recordedAt: string,
): Promise<void> {
    try {
        const porCompetencia = new Map<string, { acertou: boolean; usouDica: boolean }>();

        for (const step of activity.steps) {
            if (step.kind !== 'interaction') continue;

            const { interaction } = step;
            const competencyId = interaction.competencyIds[0];
            if (!competencyId) continue;

            const acertou = input.confirmedAnswers[interaction.id] === true;
            const usouDica = input.hintUsedByInteraction?.[interaction.id] ?? false;
            const atual = porCompetencia.get(competencyId);

            porCompetencia.set(competencyId, {
                acertou: atual ? atual.acertou && acertou : acertou,
                usouDica: atual ? atual.usouDica || usouDica : usouDica,
            });
        }

        for (const [competencyId, resumo] of porCompetencia) {
            await CompetencyReviewService.observeExposure({
                competencyId,
                grade: {
                    outcome: resumo.acertou ? 'correct' : 'incorrect',
                    hintUsed: resumo.usouDica,
                },
                // Competência legada não está no currículo, logo não carrega a
                // marcação de segurança. Quando houver atividade v2, este valor
                // passa a vir do currículo.
                criticalSafety: false,
                now: recordedAt,
            });
        }
    } catch (error) {
        console.error('[LessonOutcomeService] Falha ao observar competencias:', error);
    }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/lesson-flow/services/LessonOutcomeService.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Gate e commit**

```bash
cd radiant-app && npm run quality
git add src/features/lesson-flow/services/LessonOutcomeService.ts src/features/lesson-flow/services/LessonOutcomeService.test.ts
git commit -m "feat(review): atividade concluida alimenta o agendador por competencia"
```

---

## Fora deste plano

- **`weak-competency` emitido de verdade** — Task 12, junto com o reforço adaptativo.
- **Exibir o teto alcançável por competência na UI** — consequência da decisão registrada na §3 da spec, mas o desenho da tela pertence à Task 13.
- **E2E** — nada muda para o usuário até o corte vertical existir; um flow do Maestro aqui testaria a ausência de mudança por um caminho caro. Pertence à Task 15.
- **Limpar `models/sm2.ts` e `sm2 2.ts`**, que são código morto — ninguém importa `applySm2Step`. Run próprio, não misturado com feature.
