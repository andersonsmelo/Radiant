import AsyncStorage from '@react-native-async-storage/async-storage';

import { MAX_STREAK_FREEZES, StreakFreezeService, advanceStreak } from './StreakFreezeService';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('advanceStreak (regra pura da sequência)', () => {
    it('primeiro dia e data ilegível começam em 1, sem mexer nas proteções', () => {
        expect(advanceStreak({ streakDays: 1, lastActiveDate: null }, 1, '2026-11-06'))
            .toEqual({ streakDays: 1, lastActiveDate: '2026-11-06', freezes: 1, usedFreeze: false, earnedFreeze: false });
        expect(advanceStreak({ streakDays: 9, lastActiveDate: '2026-02-31' }, 0, '2026-11-06').streakDays).toBe(1);
    });

    it('o mesmo dia não muda nada e o dia seguinte soma um, inclusive na virada de mês e de ano', () => {
        expect(advanceStreak({ streakDays: 3, lastActiveDate: '2026-11-06' }, 0, '2026-11-06'))
            .toEqual({ streakDays: 3, lastActiveDate: '2026-11-06', freezes: 0, usedFreeze: false, earnedFreeze: false });
        expect(advanceStreak({ streakDays: 3, lastActiveDate: '2026-11-05' }, 0, '2026-11-06').streakDays).toBe(4);
        expect(advanceStreak({ streakDays: 3, lastActiveDate: '2026-10-31' }, 0, '2026-11-01').streakDays).toBe(4);
        expect(advanceStreak({ streakDays: 3, lastActiveDate: '2026-12-31' }, 0, '2027-01-01').streakDays).toBe(4);
    });

    it('um único dia perdido gasta uma proteção e a sequência continua', () => {
        expect(advanceStreak({ streakDays: 4, lastActiveDate: '2026-11-04' }, 1, '2026-11-06'))
            .toEqual({ streakDays: 5, lastActiveDate: '2026-11-06', freezes: 0, usedFreeze: true, earnedFreeze: false });
    });

    it('sem proteção, um dia perdido recomeça em 1', () => {
        expect(advanceStreak({ streakDays: 4, lastActiveDate: '2026-11-04' }, 0, '2026-11-06'))
            .toMatchObject({ streakDays: 1, freezes: 0, usedFreeze: false });
    });

    it('dois ou mais dias perdidos recomeçam em 1 mesmo com duas proteções, que ficam guardadas', () => {
        expect(advanceStreak({ streakDays: 20, lastActiveDate: '2026-11-03' }, 2, '2026-11-06'))
            .toMatchObject({ streakDays: 1, freezes: 2, usedFreeze: false });
        expect(advanceStreak({ streakDays: 20, lastActiveDate: '2026-11-07' }, 2, '2026-11-06'))
            .toMatchObject({ streakDays: 1, freezes: 2, usedFreeze: false });
    });

    it('ganha uma proteção a cada 7 dias seguidos, até 2 guardadas', () => {
        expect(advanceStreak({ streakDays: 6, lastActiveDate: '2026-11-05' }, 0, '2026-11-06')).toMatchObject({ streakDays: 7, freezes: 1, earnedFreeze: true });
        expect(advanceStreak({ streakDays: 7, lastActiveDate: '2026-11-05' }, 1, '2026-11-06')).toMatchObject({ streakDays: 8, freezes: 1, earnedFreeze: false });
        expect(advanceStreak({ streakDays: 13, lastActiveDate: '2026-11-05' }, 1, '2026-11-06')).toMatchObject({ streakDays: 14, freezes: 2 });
        expect(advanceStreak({ streakDays: 20, lastActiveDate: '2026-11-05' }, 2, '2026-11-06')).toMatchObject({ streakDays: 21, freezes: MAX_STREAK_FREEZES });
        // Contagem guardada fora da faixa não vira proteção extra.
        expect(advanceStreak({ streakDays: 2, lastActiveDate: '2026-11-05' }, 99, '2026-11-06').freezes).toBe(2);
        expect(advanceStreak({ streakDays: 2, lastActiveDate: '2026-11-04' }, -3, '2026-11-06')).toMatchObject({ streakDays: 1, freezes: 0 });
    });
});

describe('StreakFreezeService (store)', () => {
    beforeEach(async () => { await AsyncStorage.clear(); });

    it('grava a proteção ganha com schemaVersion e a gasta num dia perdido', async () => {
        expect(await StreakFreezeService.getFreezes()).toBe(0);
        await StreakFreezeService.advance({ streakDays: 6, lastActiveDate: '2026-11-05' }, '2026-11-06');
        expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.STREAK_FREEZE))!)).toEqual({ schemaVersion: 1, freezes: 1 });

        const covered = await StreakFreezeService.advance({ streakDays: 7, lastActiveDate: '2026-11-06' }, '2026-11-08');
        expect(covered).toMatchObject({ streakDays: 8, usedFreeze: true, freezes: 0 });
        expect(await StreakFreezeService.getFreezes()).toBe(0);
    });

    it('não grava por cima de um store com schemaVersion desconhecido, e não usa as proteções dele', async () => {
        const future = JSON.stringify({ schemaVersion: 2, freezes: 2, novoCampo: true });
        await AsyncStorage.setItem(STORAGE_KEYS.STREAK_FREEZE, future);

        expect(await StreakFreezeService.getFreezes()).toBe(0);
        const earned = await StreakFreezeService.advance({ streakDays: 6, lastActiveDate: '2026-11-05' }, '2026-11-06');
        expect(earned).toMatchObject({ streakDays: 7, earnedFreeze: true });
        const missed = await StreakFreezeService.advance({ streakDays: 7, lastActiveDate: '2026-11-06' }, '2026-11-08');
        expect(missed).toMatchObject({ streakDays: 1, usedFreeze: false });
        expect(await AsyncStorage.getItem(STORAGE_KEYS.STREAK_FREEZE)).toBe(future);
    });

    it('store corrompido vale zero proteções e não derruba o dia de estudo', async () => {
        await AsyncStorage.setItem(STORAGE_KEYS.STREAK_FREEZE, '{quebrado');
        expect(await StreakFreezeService.getFreezes()).toBe(0);
        expect((await StreakFreezeService.advance({ streakDays: 2, lastActiveDate: '2026-11-05' }, '2026-11-06')).streakDays).toBe(3);
    });
});
