import { formatLocalDateKey } from '../../constants/gamification';
import { standingStreakDays } from '../gamification/services/StreakFreezeService';

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

/**
 * Teto de viradas. O horizonte normal vem da quebra real (`settled`), no máximo três dias à
 * frente com proteção; o teto só segura um `lastActiveDate` absurdo, de relógio muito atrasado.
 * shortcut: estudo mais de ~4 dias "no futuro" deixa a quebra fora do horizonte e o widget mostra
 * a sequência até o app abrir; ampliar o teto se isso aparecer em campo.
 */
const MAX_HORIZON_DAYS = 7;

/** A sequência que vale no dia `dayKey` se o aluno ainda não estudou nele. */
function standing(source: WidgetSource, dayKey: string): { streakDays: number; countsToday: boolean } {
    // A regra (proteção, recomeço, estudo "no futuro") é a mesma do topo e do perfil.
    return {
        streakDays: standingStreakDays({ streakDays: source.streakDays, lastActiveDate: source.lastActiveDate }, source.freezes, dayKey),
        countsToday: source.lastActiveDate !== null && source.lastActiveDate >= dayKey,
    };
}

export function buildWidgetSnapshot(source: WidgetSource, now: Date): WidgetSnapshot {
    const entries: WidgetEntry[] = [];
    for (let offset = 0; offset <= MAX_HORIZON_DAYS; offset += 1) {
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
        if (!previous || previous.streakDays !== entry.streakDays || previous.countsToday !== entry.countsToday
            || previous.goalCompleted !== entry.goalCompleted) entries.push(entry);
        // Sequência quebrada e meta já vencida: nenhum dia seguinte muda o que o widget mostra.
        const settled = entry.streakDays === 0 && (source.goalDateKey === null || source.goalDateKey < dayKey);
        if (settled) break;
    }
    return { schemaVersion: WIDGET_SNAPSHOT_SCHEMA_VERSION, generatedAt: now.getTime(), entries, nextLesson: source.nextLesson };
}
