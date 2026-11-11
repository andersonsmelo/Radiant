import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    DailyMissionsCoordinator, MISSION_BONUS_XP, missionIdsForDay, missionProgress,
    type DailyMissionsPorts, type MissionAttempt, type MissionId,
} from './DailyMissionsService';
import { formatLocalDateKey } from '../../../constants/gamification';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const NOW = new Date(2026, 10, 6, 15, 0);
const TODAY = formatLocalDateKey(NOW);
const at = (hour: number, minute = 0, day = 6) => new Date(2026, 10, day, hour, minute).toISOString();
const attempt = (recordedAt: string, firstOutcome: MissionAttempt['firstOutcome'], mode: MissionAttempt['mode'] = 'study', activityId = 'aula:a'): MissionAttempt =>
    ({ recordedAt, firstOutcome, mode, item: { activityId } });

describe('missionIdsForDay', () => {
    const days = Array.from({ length: 56 }, (_, index) => formatLocalDateKey(new Date(2026, 10, 1 + index)));

    it('escolhe três missões de famílias diferentes, sempre as mesmas para a mesma data', () => {
        const family = (id: MissionId) => id.split('-')[0];
        for (const day of days) {
            const ids = missionIdsForDay(day, true);
            expect(ids).toHaveLength(3);
            expect(new Set(ids.map(family)).size).toBe(3);
            expect(missionIdsForDay(day, true)).toEqual(ids);
        }
    });

    it('varia de um dia para o outro e usa as seis missões ao longo de oito dias', () => {
        expect(missionIdsForDay(days[0], true)).not.toEqual(missionIdsForDay(days[1], true));
        expect(new Set(days.slice(0, 8).flatMap(day => missionIdsForDay(day, true)))).toEqual(
            new Set(['aula-1', 'aula-2', 'seguidas-5', 'acertos-10', 'revisao', 'meta']));
    });

    it('sem revisão disponível, nunca pede revisão', () => {
        for (const day of days) {
            expect(missionIdsForDay(day, false)).not.toContain('revisao');
            expect(missionIdsForDay(day, false)).toHaveLength(3);
        }
    });
});

describe('missionProgress', () => {
    it('conta aulas distintas estudadas hoje, e não as de ontem nem revisão', () => {
        const records = { goal: null, attempts: [
            attempt(at(9), 'correct', 'study', 'aula:a'), attempt(at(9, 1), 'incorrect', 'study', 'aula:a'),
            attempt(at(10), 'correct', 'review-answer', 'aula:b'), attempt(at(10, 0, 5), 'correct', 'study', 'aula:c'),
        ] };
        expect(missionProgress('aula-1', records, TODAY)).toEqual({ progress: 1, goal: 1 });
        expect(missionProgress('aula-2', records, TODAY)).toEqual({ progress: 1, goal: 2 });
        expect(missionProgress('aula-2', { goal: null, attempts: [...records.attempts, attempt(at(11), 'incorrect', 'study', 'aula:d')] }, TODAY))
            .toEqual({ progress: 2, goal: 2 });
    });

    it('mede a maior sequência de acertos do dia pela ordem das respostas, e o erro zera a contagem', () => {
        const outcomes = ['correct', 'correct', 'correct', 'incorrect', 'correct', 'correct', 'correct', 'correct'] as const;
        const attempts = outcomes.map((outcome, index) => attempt(at(9, index), outcome));
        expect(missionProgress('seguidas-5', { goal: null, attempts: [...attempts].reverse() }, TODAY)).toEqual({ progress: 4, goal: 5 });
        expect(missionProgress('seguidas-5', { goal: null, attempts: [...attempts, attempt(at(9, 30), 'correct')] }, TODAY)).toEqual({ progress: 5, goal: 5 });
        expect(missionProgress('acertos-10', { goal: null, attempts }, TODAY)).toEqual({ progress: 7, goal: 10 });
        // Ajuda revelada ("skipped") não é acerto.
        expect(missionProgress('acertos-10', { goal: null, attempts: [attempt(at(9), 'skipped')] }, TODAY).progress).toBe(0);
    });

    it('revisão conta só quando foi feita hoje, e a meta usa o XP do dia', () => {
        expect(missionProgress('revisao', { goal: null, attempts: [attempt(at(9), 'correct', 'study')] }, TODAY).progress).toBe(0);
        expect(missionProgress('revisao', { goal: null, attempts: [attempt(at(9, 0, 5), 'correct', 'review-answer')] }, TODAY).progress).toBe(0);
        expect(missionProgress('revisao', { goal: null, attempts: [attempt(at(9), 'incorrect', 'self-review')] }, TODAY)).toEqual({ progress: 1, goal: 1 });
        expect(missionProgress('meta', { attempts: [], goal: { earnedXpToday: 30, goalXp: 50 } }, TODAY)).toEqual({ progress: 30, goal: 50 });
        expect(missionProgress('meta', { attempts: [], goal: { earnedXpToday: 80, goalXp: 50 } }, TODAY)).toEqual({ progress: 50, goal: 50 });
        expect(missionProgress('meta', { attempts: [], goal: null }, TODAY)).toEqual({ progress: 0, goal: 1 });
    });
});

describe('DailyMissionsCoordinator', () => {
    const fiveCorrect = Array.from({ length: 5 }, (_, index) => attempt(at(9, index), 'correct'));
    function setup(overrides: Partial<DailyMissionsPorts> = {}) {
        const ports = {
            attempts: jest.fn(async () => fiveCorrect as readonly MissionAttempt[]),
            goal: jest.fn(async () => ({ earnedXpToday: 10, goalXp: 50 })),
            dueReviewCount: jest.fn(async () => 0),
            grantXp: jest.fn(async () => undefined),
            ...overrides,
        };
        return { ports, service: new DailyMissionsCoordinator(ports) };
    }
    const seed = (store: unknown) => AsyncStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(store));
    const saved = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.DAILY_MISSIONS))!);

    beforeEach(async () => { await AsyncStorage.clear(); });

    it('paga o bônus de cada missão concluída uma única vez no dia, mesmo com leituras simultâneas', async () => {
        await seed({ schemaVersion: 1, dateKey: TODAY, missionIds: ['aula-1', 'seguidas-5', 'meta'], rewarded: [] });
        const { ports, service } = setup();
        const [first, second] = await Promise.all([service.sync(NOW), service.sync(NOW)]);

        expect(first.bonusXp).toBe(2 * MISSION_BONUS_XP);
        expect(second.bonusXp).toBe(0);
        expect((ports.grantXp as jest.Mock).mock.calls).toEqual([[2 * MISSION_BONUS_XP]]);
        expect(first.missions.map(mission => [mission.id, mission.progress, mission.goal, mission.done, mission.rewarded])).toEqual([
            ['aula-1', 1, 1, true, true], ['seguidas-5', 5, 5, true, true], ['meta', 10, 50, false, false],
        ]);
        expect(await saved()).toEqual({ schemaVersion: 1, dateKey: TODAY, missionIds: ['aula-1', 'seguidas-5', 'meta'], rewarded: ['aula-1', 'seguidas-5'] });

        // Outra instância (app reaberto) lê a marca gravada e não paga de novo.
        const reopened = setup();
        expect((await reopened.service.sync(NOW)).bonusXp).toBe(0);
        expect(reopened.ports.grantXp).not.toHaveBeenCalled();
    });

    it('grava a marca antes de creditar: bônus que falha ao creditar não é pago em dobro depois', async () => {
        await seed({ schemaVersion: 1, dateKey: TODAY, missionIds: ['aula-1', 'seguidas-5', 'meta'], rewarded: [] });
        let markedWhenCredited: unknown = null;
        const { ports, service } = setup({ grantXp: jest.fn(async () => {
            markedWhenCredited = (await saved()).rewarded;
            throw new Error('xp-indisponível');
        }) });
        const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        expect((await service.sync(NOW)).bonusXp).toBe(0);
        expect(markedWhenCredited).toEqual(['aula-1', 'seguidas-5']);
        expect((await service.sync(NOW)).bonusXp).toBe(0);
        expect(ports.grantXp).toHaveBeenCalledTimes(1);
        error.mockRestore();
    });

    it('fixa as missões na primeira leitura do dia e recomeça no dia seguinte', async () => {
        const { service } = setup({ attempts: jest.fn(async () => []) });
        const first = await service.sync(NOW);
        expect(first.missions.map(mission => mission.id)).toEqual(missionIdsForDay(TODAY, false));
        expect((await saved()).missionIds).toEqual(missionIdsForDay(TODAY, false));

        // Uma revisão que vence mais tarde não troca as missões já mostradas.
        const later = setup({ attempts: jest.fn(async () => []), dueReviewCount: jest.fn(async () => 3) });
        expect((await later.service.sync(NOW)).missions.map(mission => mission.id)).toEqual(first.missions.map(mission => mission.id));

        const tomorrow = new Date(2026, 10, 7, 8, 0);
        const next = await later.service.sync(tomorrow);
        expect(next.missions.map(mission => mission.id)).toEqual(missionIdsForDay(formatLocalDateKey(tomorrow), true));
        expect(await saved()).toMatchObject({ dateKey: formatLocalDateKey(tomorrow), rewarded: [] });
    });

    it('não grava por cima de um store com schemaVersion desconhecido, e sem poder marcar não paga bônus', async () => {
        const future = JSON.stringify({ schemaVersion: 2, dateKey: TODAY, missionIds: ['aula-1'], rewarded: [], extra: 1 });
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, future);
        const { ports, service } = setup({ goal: jest.fn(async () => ({ earnedXpToday: 50, goalXp: 50 })) });

        const result = await service.sync(NOW);
        expect(result.missions.filter(mission => mission.done).length).toBeGreaterThan(0);
        expect(result.missions.every(mission => !mission.rewarded)).toBe(true);
        expect(result.bonusXp).toBe(0);
        expect(ports.grantXp).not.toHaveBeenCalled();
        expect(await AsyncStorage.getItem(STORAGE_KEYS.DAILY_MISSIONS)).toBe(future);
    });

    it('registro que não lê vale progresso zero: nada conclui e nada é pago', async () => {
        await seed({ schemaVersion: 1, dateKey: TODAY, missionIds: ['aula-1', 'seguidas-5', 'meta'], rewarded: [] });
        const { ports, service } = setup({
            attempts: jest.fn(async () => { throw new Error('journal-unavailable'); }),
            goal: jest.fn(async () => { throw new Error('goal-unavailable'); }),
        });
        const result = await service.sync(NOW);
        expect(result.missions.map(mission => mission.progress)).toEqual([0, 0, 0]);
        expect(ports.grantXp).not.toHaveBeenCalled();
    });
});
