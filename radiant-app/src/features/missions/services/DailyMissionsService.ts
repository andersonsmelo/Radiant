import AsyncStorage from '@react-native-async-storage/async-storage';

import { formatLocalDateKey } from '../../../constants/gamification';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { rawHasUnknownSchemaVersion } from '../../../storage/schemaVersionGuard';
import type { ItemAttempt } from '../../../types/itemReview';

/**
 * Missões do dia (plano de 2026-11-05, frente D).
 *
 * Três por dia local, escolhidas pela data. O progresso não tem contador
 * próprio: é lido do diário de respostas (estudo, revisão e conferência) e da
 * meta diária, que o app já grava. Missão concluída rende um bônus pequeno de
 * XP uma única vez: a marca do bônus é gravada antes do XP, então uma falha no
 * meio perde o bônus em vez de pagá-lo duas vezes.
 */
export type MissionId = 'aula-1' | 'aula-2' | 'seguidas-5' | 'acertos-10' | 'revisao' | 'meta';
export type DailyMission = { id: MissionId; title: string; progress: number; goal: number; done: boolean; rewarded: boolean };
export type MissionAttempt = Pick<ItemAttempt, 'recordedAt' | 'firstOutcome' | 'mode'> & { item: Pick<ItemAttempt['item'], 'activityId'> };
export type MissionRecords = { attempts: readonly MissionAttempt[]; goal: { earnedXpToday: number; goalXp: number } | null };
export type DailyMissionsResult = { missions: DailyMission[]; bonusXp: number };

export const MISSION_BONUS_XP = 5;

const TITLES: Readonly<Record<MissionId, string>> = {
    'aula-1': 'Conclua 1 aula',
    'aula-2': 'Conclua 2 aulas',
    'seguidas-5': 'Acerte 5 seguidas',
    'acertos-10': 'Acerte 10 questões',
    revisao: 'Faça uma revisão',
    meta: 'Bata a meta diária',
};
const MISSION_IDS = Object.keys(TITLES) as MissionId[];
/** Quatro famílias; uma fica de fora por dia, e as duas primeiras alternam a variante. */
const FAMILIES: readonly (readonly MissionId[])[] = [['aula-1', 'aula-2'], ['seguidas-5', 'acertos-10'], ['revisao'], ['meta']];
const REVIEW_FAMILY = 2;

function dayNumber(dateKey: string): number {
    const [year, month, day] = dateKey.split('-').map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/** As três missões do dia. Sem revisão disponível, a de revisão é a que fica de fora. */
export function missionIdsForDay(dateKey: string, reviewAvailable: boolean): MissionId[] {
    const day = dayNumber(dateKey);
    const skipped = reviewAvailable ? day % FAMILIES.length : REVIEW_FAMILY;
    const variant = Math.floor(day / FAMILIES.length) % 2;
    return FAMILIES.filter((_, index) => index !== skipped).map(family => family[variant % family.length]);
}

/** Progresso de uma missão, só com o que os registros de `dateKey` provam. */
export function missionProgress(id: MissionId, records: MissionRecords, dateKey: string): { progress: number; goal: number } {
    const today = records.attempts
        .filter(attempt => formatLocalDateKey(new Date(attempt.recordedAt)) === dateKey)
        .sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt));
    const capped = (value: number, goal: number) => ({ progress: Math.min(goal, Math.max(0, value)), goal });
    switch (id) {
        case 'aula-1':
        case 'aula-2':
            return capped(new Set(today.filter(attempt => attempt.mode === 'study').map(attempt => attempt.item.activityId)).size, id === 'aula-1' ? 1 : 2);
        case 'seguidas-5': {
            let best = 0;
            let run = 0;
            for (const attempt of today) {
                run = attempt.firstOutcome === 'correct' ? run + 1 : 0;
                best = Math.max(best, run);
            }
            return capped(best, 5);
        }
        case 'acertos-10':
            return capped(today.filter(attempt => attempt.firstOutcome === 'correct').length, 10);
        case 'revisao':
            return capped(today.some(attempt => attempt.mode === 'review-answer' || attempt.mode === 'self-review') ? 1 : 0, 1);
        case 'meta': {
            const goal = records.goal && Number.isFinite(records.goal.goalXp) && records.goal.goalXp > 0 ? records.goal.goalXp : 0;
            return goal ? capped(Number.isFinite(records.goal!.earnedXpToday) ? records.goal!.earnedXpToday : 0, goal) : { progress: 0, goal: 1 };
        }
    }
}

const SCHEMA_VERSION = 1;
const KNOWN_SCHEMA_VERSIONS: readonly unknown[] = [SCHEMA_VERSION];
type Store = { schemaVersion: 1; dateKey: string; missionIds: MissionId[]; rewarded: MissionId[] };

export type DailyMissionsPorts = {
    attempts(): Promise<readonly MissionAttempt[]>;
    goal(now: Date): Promise<MissionRecords['goal']>;
    dueReviewCount(now: Date): Promise<number>;
    grantXp(amount: number): Promise<unknown>;
};

/* eslint-disable @typescript-eslint/no-require-imports -- resolução tardia: a regra pura não inicializa catálogo nem storage nativo. */
const livePorts: DailyMissionsPorts = {
    attempts: () => require('../../spaced-repetition/repositories/ItemReviewRepository').itemReviewRepository.getAttempts(),
    goal: now => require('../../daily-goal/services/DailyGoalService').DailyGoalService.getSnapshot(now),
    dueReviewCount: now => require('../../spaced-repetition/services/SpacedRepetitionService').SpacedRepetitionService.getDueCount(now),
    grantXp: amount => require('../../gamification/services/GamificationService').GamificationService.addManualXp(amount),
};
/* eslint-enable @typescript-eslint/no-require-imports */

export class DailyMissionsCoordinator {
    // Uma fila só: duas telas lendo ao mesmo tempo não pagam o mesmo bônus duas vezes.
    private tail: Promise<unknown> = Promise.resolve();

    constructor(private readonly ports: DailyMissionsPorts = livePorts) {}

    /** Lê as missões de hoje e paga o bônus das que acabaram de ser concluídas. */
    sync(now: Date = new Date()): Promise<DailyMissionsResult> {
        const at = new Date(now.getTime());
        const result = this.tail.then(() => this.syncUnlocked(at));
        this.tail = result.catch(() => undefined);
        return result;
    }

    private async syncUnlocked(now: Date): Promise<DailyMissionsResult> {
        const dateKey = formatLocalDateKey(now);
        // Fonte que não lê vale "sem registro": missão não conclui e não rende bônus.
        const [attempts, goal, due] = await Promise.all([
            this.ports.attempts().catch(() => [] as readonly MissionAttempt[]),
            this.ports.goal(now).catch(() => null),
            this.ports.dueReviewCount(now).catch(() => 0),
        ]);
        const records: MissionRecords = { attempts, goal };
        const reviewAvailable = due > 0 || missionProgress('revisao', records, dateKey).progress > 0;

        let raw: string | null = null;
        let writable = true;
        try {
            raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_MISSIONS);
            // Store de uma versão mais nova do app: esta não grava por cima (G7) e, sem
            // poder marcar o bônus, também não paga.
            writable = !rawHasUnknownSchemaVersion(raw, KNOWN_SCHEMA_VERSIONS);
        } catch {
            writable = false;
        }
        const saved = writable ? parseStore(raw) : null;
        const store: Store = saved && saved.dateKey === dateKey ? saved
            : { schemaVersion: SCHEMA_VERSION, dateKey, missionIds: missionIdsForDay(dateKey, reviewAvailable), rewarded: [] };

        const state = store.missionIds.map(id => ({ id, ...missionProgress(id, records, dateKey) }));
        const earned = state.filter(mission => mission.progress >= mission.goal && !store.rewarded.includes(mission.id)).map(mission => mission.id);
        let bonusXp = 0;
        if (writable && (store !== saved || earned.length)) {
            try {
                const next: Store = { ...store, rewarded: [...store.rewarded, ...earned] };
                await AsyncStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(next));
                store.rewarded = next.rewarded;
                if (earned.length) {
                    bonusXp = earned.length * MISSION_BONUS_XP;
                    await this.ports.grantXp(bonusXp).catch(error => {
                        bonusXp = 0;
                        console.error('[DailyMissionsService] Bônus marcado e não creditado:', error);
                    });
                }
            } catch (error) {
                console.error('[DailyMissionsService] Falha ao gravar as missões:', error);
            }
        }
        return {
            bonusXp,
            missions: state.map(mission => ({ ...mission, title: TITLES[mission.id], done: mission.progress >= mission.goal, rewarded: store.rewarded.includes(mission.id) })),
        };
    }
}

function parseStore(raw: string | null): Store | null {
    try {
        const value = raw === null ? null : JSON.parse(raw) as Partial<Store> | null;
        const valid = (ids: unknown): ids is MissionId[] => Array.isArray(ids) && ids.every(id => MISSION_IDS.includes(id as MissionId));
        return value && value.schemaVersion === SCHEMA_VERSION && typeof value.dateKey === 'string'
            && valid(value.missionIds) && value.missionIds.length === 3 && valid(value.rewarded)
            ? { schemaVersion: SCHEMA_VERSION, dateKey: value.dateKey, missionIds: value.missionIds, rewarded: value.rewarded } : null;
    } catch {
        return null;
    }
}

export const DailyMissionsService = new DailyMissionsCoordinator();
