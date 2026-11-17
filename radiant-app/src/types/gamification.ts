/**
 * Gamification Core Types
 * Defines the shape of the persistence layer and runtime snapshots.
 */

/**
 * Persisted state for gamification.
 * stored in AsyncStorage or similar.
 */
export interface GamificationStore {
    /** Total XP accumulated since install */
    totalXp: number;
    /** Current streak in days */
    streakDays: number;
    /** Format: YYYY-MM-DD, used to calculate streaks */
    lastActiveDate: string | null;
    /** ISO timestamp of last update */
    updatedAt: string;
    // As vidas moram no `heartsRepository` desde 2026-09-23. Quem instalou a
    // 1.3.1 ainda tem `hearts`, `maxHearts` e `heartsLastRefillAt` neste blob:
    // o serviço os carrega e regrava intocados, e nada os lê.
}

/**
 * Runtime view of gamification state.
 * Usually exposed to UI components.
 */
export interface GamificationSnapshot {
    totalXp: number;
    /** A contagem guardada: só muda quando o aluno estuda. Regra e sincronização leem esta. */
    streakDays: number;
    lastActiveDate: string | null;
    /** A sequência que vale no dia da leitura: 0 se parou (decisão do dono, 2026-11-17). */
    standingStreakDays?: number;
}

/** O número de sequência que as telas mostram: o que vale hoje, nunca a contagem parada. */
export function shownStreakDays(snapshot: Pick<GamificationSnapshot, 'streakDays' | 'standingStreakDays'> | null | undefined): number {
    // shortcut: snapshot sem o campo (mock antigo) cai na contagem guardada; tornar o campo
    // obrigatório quando todo teste de tela devolver o snapshot completo.
    return snapshot?.standingStreakDays ?? snapshot?.streakDays ?? 0;
}

/**
 * Details of an XP grant event.
 */
export interface XpAward {
    baseXp: number;
    bonusXp: number;
    totalXpAwarded: number;
    reason: 'quiz_complete';
}
