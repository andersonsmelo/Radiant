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
    /** Corações/vidas restantes (0–5). Perdem com erros no quiz. */
    hearts: number;
    /** Máximo de corações (padrão: 5) */
    maxHearts: number;
    /** ISO timestamp da última recarga de corações */
    heartsLastRefillAt: string | null;
}

/**
 * Runtime view of gamification state.
 * Usually exposed to UI components.
 */
export interface GamificationSnapshot {
    totalXp: number;
    streakDays: number;
    lastActiveDate: string | null;
    hearts: number;
    maxHearts: number;
    /**
     * ISO timestamp da próxima recarga passiva de coração, ou null quando os
     * corações estão cheios. Opcional para não quebrar mocks existentes.
     */
    heartsNextRefillAt?: string | null;
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
