import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { rawHasUnknownSchemaVersion } from '../../../storage/schemaVersionGuard';

/**
 * Proteção de sequência (plano de 2026-11-05, frente D).
 *
 * A cada 7 dias seguidos o aluno ganha uma proteção, até 2 guardadas. Um único
 * dia sem estudo gasta uma e a sequência continua; dois ou mais dias sem estudo
 * recomeçam a sequência, como sempre. Não se compra e não depende de assinatura.
 */
export const MAX_STREAK_FREEZES = 2;
export const STREAK_DAYS_PER_FREEZE = 7;

export type StreakState = { streakDays: number; lastActiveDate: string | null };
export type StreakAdvance = StreakState & { freezes: number; usedFreeze: boolean; earnedFreeze: boolean };

/** Dia do calendário como número, lido da chave local `AAAA-MM-DD`. Nunca passa por fuso. */
function dayNumber(dateKey: string | null): number | null {
    const match = typeof dateKey === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey) : null;
    if (!match) return null;
    const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const utc = new Date(Date.UTC(year, month - 1, day));
    return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day
        ? utc.getTime() / 86_400_000 : null;
}

/** A regra inteira da sequência, pura: o que vale depois de um dia de estudo em `todayKey`. */
export function advanceStreak(state: StreakState, freezes: number, todayKey: string): StreakAdvance {
    const stored = Number.isInteger(freezes) ? Math.min(MAX_STREAK_FREEZES, Math.max(0, freezes)) : 0;
    const today = dayNumber(todayKey);
    const last = dayNumber(state.lastActiveDate);
    const restart: StreakAdvance = { streakDays: 1, lastActiveDate: todayKey, freezes: stored, usedFreeze: false, earnedFreeze: false };
    if (today === null || last === null) return restart;
    const gap = today - last;
    if (gap === 0) return { ...state, freezes: stored, usedFreeze: false, earnedFreeze: false };
    const usedFreeze = gap === 2 && stored > 0;
    if (gap !== 1 && !usedFreeze) return restart;
    const streakDays = state.streakDays + 1;
    const earnedFreeze = streakDays % STREAK_DAYS_PER_FREEZE === 0;
    return {
        streakDays,
        lastActiveDate: todayKey,
        freezes: Math.min(MAX_STREAK_FREEZES, stored - (usedFreeze ? 1 : 0) + (earnedFreeze ? 1 : 0)),
        usedFreeze,
        earnedFreeze,
    };
}

const SCHEMA_VERSION = 1;
const KNOWN_SCHEMA_VERSIONS: readonly unknown[] = [SCHEMA_VERSION];

class StreakFreezeServiceImpl {
    /** Quantas proteções estão guardadas. Store ilegível ou de versão mais nova vale zero. */
    async getFreezes(): Promise<number> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_FREEZE);
            if (raw === null || rawHasUnknownSchemaVersion(raw, KNOWN_SCHEMA_VERSIONS)) return 0;
            const freezes = (JSON.parse(raw) as { freezes?: unknown } | null)?.freezes;
            return typeof freezes === 'number' && Number.isInteger(freezes) ? Math.min(MAX_STREAK_FREEZES, Math.max(0, freezes)) : 0;
        } catch {
            return 0;
        }
    }

    /** Aplica um dia de estudo: gasta ou ganha proteção e devolve a sequência que vale. */
    async advance(state: StreakState, todayKey: string): Promise<StreakAdvance> {
        const before = await this.getFreezes();
        const next = advanceStreak(state, before, todayKey);
        if (next.freezes !== before) {
            try {
                // Store de uma versão mais nova do app: esta não grava por cima (G7).
                const raw = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_FREEZE);
                if (!rawHasUnknownSchemaVersion(raw, KNOWN_SCHEMA_VERSIONS)) {
                    await AsyncStorage.setItem(STORAGE_KEYS.STREAK_FREEZE, JSON.stringify({ schemaVersion: SCHEMA_VERSION, freezes: next.freezes }));
                }
            } catch (error) {
                console.error('[StreakFreezeService] Falha ao gravar a proteção:', error);
            }
        }
        return next;
    }
}

export const StreakFreezeService = new StreakFreezeServiceImpl();
