import { formatLocalDateKey } from '../../constants/gamification';
import { advanceStreak } from '../gamification/services/StreakFreezeService';

/**
 * Retrato que o app grava no App Group para os widgets (ADR 2026-11-15).
 *
 * A linha do tempo vem calculada daqui: o widget só escolhe a entrada que vale
 * na hora e nunca refaz a regra da sequência em Swift. Cada meia-noite local
 * vira uma entrada, para que o widget pare de dizer "hoje conta" sem depender
 * de o app abrir.
 */
export const WIDGET_SNAPSHOT_SCHEMA_VERSION = 1;

export type WidgetEntry = {
    /** Início da validade, em ms desde a época. */
    startsAt: number;
    streakDays: number;
    countsToday: boolean;
    goalCompleted: number;
    goalTarget: number;
};

export type WidgetSource = {
    streakDays: number;
    lastActiveDate: string | null;
    freezes: number;
    goalCompleted: number;
    goalTarget: number;
    goalDateKey: string | null;
    nextLesson: { title: string; url: string } | null;
};

export type WidgetSnapshot = {
    schemaVersion: typeof WIDGET_SNAPSHOT_SCHEMA_VERSION;
    generatedAt: number;
    entries: WidgetEntry[];
    nextLesson: WidgetSource['nextLesson'];
};

/** Hoje mais três viradas: depois de dois dias perdidos, com ou sem proteção, nada mais muda. */
const MAX_DAYS = 4;

/** A sequência que vale no dia `dayKey` se o aluno ainda não estudou nele. */
function standing(source: WidgetSource, dayKey: string): { streakDays: number; countsToday: boolean } {
    // Chave `AAAA-MM-DD` compara como texto. Estudo "no futuro" (viagem para oeste, relógio
    // atrasado) vale como hoje: zerar aqui mostraria 0 com a home mostrando N.
    if (source.lastActiveDate !== null && source.lastActiveDate >= dayKey) {
        return { streakDays: source.streakDays, countsToday: true };
    }
    // Viva se estudar hoje a estenderia; a regra (proteção, recomeço) é só a do StreakFreezeService.
    const ifStudied = advanceStreak({ streakDays: source.streakDays, lastActiveDate: source.lastActiveDate }, source.freezes, dayKey);
    const alive = source.lastActiveDate !== null && ifStudied.streakDays === source.streakDays + 1;
    return { streakDays: alive ? source.streakDays : 0, countsToday: false };
}

export function buildWidgetSnapshot(source: WidgetSource, now: Date): WidgetSnapshot {
    const entries: WidgetEntry[] = [];
    for (let offset = 0; offset < MAX_DAYS; offset += 1) {
        // O construtor local acerta a meia-noite mesmo em dia de horário de verão.
        const day = offset === 0 ? now : new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
        const dayKey = formatLocalDateKey(day);
        const entry: WidgetEntry = {
            startsAt: day.getTime(),
            ...standing(source, dayKey),
            goalCompleted: source.goalDateKey === dayKey ? source.goalCompleted : 0,
            goalTarget: source.goalTarget,
        };
        // Dia igual ao anterior não vira entrada, mas não encerra a conta: a quebra pode vir depois.
        const previous = entries[entries.length - 1];
        if (previous && previous.streakDays === entry.streakDays && previous.countsToday === entry.countsToday
            && previous.goalCompleted === entry.goalCompleted) continue;
        entries.push(entry);
    }
    return { schemaVersion: WIDGET_SNAPSHOT_SCHEMA_VERSION, generatedAt: now.getTime(), entries, nextLesson: source.nextLesson };
}
