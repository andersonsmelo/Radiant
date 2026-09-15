import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../constants/storageKeys';
import { LocalProgressAdapter } from './LocalProgressAdapter';
import type { ProgressBackup } from './progressSync.types';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const AGORA_ISO = '2026-09-14T12:00:00.000Z';

function cartao(lessonId: string, lastReviewedAt: string) {
    return {
        lessonId,
        easeFactor: 2.5,
        interval: 3,
        repetitions: 1,
        nextReviewAt: '2026-09-17T00:00:00.000Z',
        lastReviewedAt,
        createdAt: '2026-09-01T00:00:00.000Z',
    };
}

function trilha(completedNodeIds: string[]) {
    return {
        schemaVersion: '1',
        activeTrackId: 'track-1',
        currentUnitId: 'unit-1',
        currentNodeId: 'n3',
        completedNodeIds,
        pendingReviewNodeIds: [],
        lastUpdatedAt: AGORA_ISO,
        pendingSyncEvents: [],
    };
}

async function semear() {
    await AsyncStorage.setItem(STORAGE_KEYS.JOURNEY_PROGRESS, JSON.stringify({
        schemaVersion: '1',
        activeTrackId: 'track-1',
        tracks: { 'track-1': trilha(['n1', 'n2']) },
    }));
    await AsyncStorage.setItem(STORAGE_KEYS.SPACED_REPETITION_SCHEDULE, JSON.stringify({
        cards: { l1: cartao('l1', '2026-09-10T00:00:00.000Z') },
        reviewHistory: [],
        lastUpdated: AGORA_ISO,
    }));
    await AsyncStorage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify({
        count: 3,
        lastRefillAt: '2026-09-14T11:00:00.000Z',
        unlimitedUntil: null,
    }));
}

function gamificacao(totalXp: number, streakDays: number) {
    return {
        getSnapshot: jest.fn(async () => ({ totalXp, streakDays })),
        absorbBackup: jest.fn(async () => ({ totalXp, streakDays })),
    };
}

describe('LocalProgressAdapter', () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
    });

    it('fotografa nós concluídos, agenda, XP, sequência e lastRefillAt', async () => {
        await semear();
        const adapter = new LocalProgressAdapter({ gamification: gamificacao(120, 4) });

        expect(await adapter.snapshot(AGORA_ISO)).toEqual({
            schemaVersion: 1,
            savedAt: AGORA_ISO,
            completedNodesByTrack: { 'track-1': ['n1', 'n2'] },
            reviewSchedule: { l1: cartao('l1', '2026-09-10T00:00:00.000Z') },
            totalXp: 120,
            streakDays: 4,
            lastRefillAt: '2026-09-14T11:00:00.000Z',
        });
    });

    it('numa instalação limpa a fotografia é vazia, sem lançar', async () => {
        const adapter = new LocalProgressAdapter({ gamification: gamificacao(0, 1) });

        expect(await adapter.snapshot(AGORA_ISO)).toEqual({
            schemaVersion: 1,
            savedAt: AGORA_ISO,
            completedNodesByTrack: {},
            reviewSchedule: {},
            totalXp: 0,
            streakDays: 1,
            lastRefillAt: null,
        });
    });

    it('aplica a mescla sem apagar o que só existia localmente', async () => {
        await semear();
        const gami = gamificacao(120, 4);
        const adapter = new LocalProgressAdapter({ gamification: gami });
        const merged: ProgressBackup = {
            schemaVersion: 1,
            savedAt: AGORA_ISO,
            completedNodesByTrack: { 'track-1': ['n1', 'n2', 'n3'], 'track-desconhecida': ['z1'] },
            reviewSchedule: {
                l1: cartao('l1', '2026-09-13T00:00:00.000Z'),
                l2: cartao('l2', '2026-09-12T00:00:00.000Z'),
            },
            totalXp: 300,
            streakDays: 9,
            lastRefillAt: '2026-09-14T11:30:00.000Z',
        };

        await adapter.apply(merged);

        const journey = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.JOURNEY_PROGRESS))!);
        expect(journey.tracks['track-1'].completedNodeIds).toEqual(['n1', 'n2', 'n3']);
        expect(journey.tracks['track-1'].currentNodeId).toBe('n3');
        expect(journey.tracks['track-desconhecida']).toBeUndefined();

        const schedule = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.SPACED_REPETITION_SCHEDULE))!);
        expect(schedule.cards).toEqual(merged.reviewSchedule);
        expect(schedule.reviewHistory).toEqual([]);

        const hearts = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.HEARTS))!);
        expect(hearts).toEqual({ count: 3, lastRefillAt: '2026-09-14T11:30:00.000Z', unlimitedUntil: null });

        expect(gami.absorbBackup).toHaveBeenCalledWith({ totalXp: 300, streakDays: 9 });
    });

    it('não retrocede o lastRefillAt local quando o da mescla é mais antigo', async () => {
        await semear();
        const adapter = new LocalProgressAdapter({ gamification: gamificacao(120, 4) });

        await adapter.apply({
            schemaVersion: 1,
            savedAt: AGORA_ISO,
            completedNodesByTrack: {},
            reviewSchedule: {},
            totalXp: 0,
            streakDays: 0,
            lastRefillAt: '2026-09-14T10:00:00.000Z',
        });

        const hearts = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.HEARTS))!);
        expect(hearts.lastRefillAt).toBe('2026-09-14T11:00:00.000Z');
    });
});
