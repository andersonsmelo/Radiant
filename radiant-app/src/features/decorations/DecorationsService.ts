/**
 * Decorações do perfil (F6 da 1.6, ADR 2026-11-15). Grava os ganhos em
 * `@radiant:decorations_v1`, em silêncio: não existe evento de desbloqueio,
 * então a atualização não dispara celebração para quem já tinha cumprido.
 * Os exclusivos de assinante não se gravam: valem enquanto a assinatura vale.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { rawHasUnknownSchemaVersion } from '../../storage/schemaVersionGuard';
import { DECORATIONS, type DecorationSlot } from './catalog';
import { levelFromXp } from '../gamification/services/levelFromXp';
import type { CurriculumTrail } from '../journey/services/JourneyCurriculumService';
import { availableIds, newlyEarned, resolveEquipped, type DecorationProgress, type EquippedDecorations, type EquippedIds } from './unlocks';

const SCHEMA_VERSION = 1;
const SLOTS: readonly DecorationSlot[] = ['moldura', 'selo', 'cartao'];

type Store = { schemaVersion: 1; unlocked: string[]; equipped: EquippedIds };
export type DecorationsBackup = { unlocked: string[]; equipped: EquippedIds };
export type DecorationsState = { unlocked: string[]; equipped: EquippedDecorations; subscriber: boolean };

export type DecorationsPorts = {
    progress(): Promise<DecorationProgress>;
    subscriber(): Promise<boolean>;
};

// Só os que se ganham pelo estudo se gravam: o exclusivo de assinante nunca entra em `unlocked`.
const KNOWN_IDS = new Set(DECORATIONS.filter(d => d.rule.kind !== 'assinante').map(d => d.id));

function cleanEquipped(value: unknown): EquippedIds {
    const equipped: EquippedIds = {};
    if (typeof value !== 'object' || value === null) return equipped;
    for (const slot of SLOTS) {
        const id = (value as Record<string, unknown>)[slot];
        if (typeof id === 'string' && DECORATIONS.some(d => d.id === id && d.slot === slot)) equipped[slot] = id;
    }
    return equipped;
}

function parse(raw: string | null): Store {
    try {
        const value = JSON.parse(raw ?? 'null') as Partial<Store> | null;
        if (value && value.schemaVersion === SCHEMA_VERSION && Array.isArray(value.unlocked)) {
            return { schemaVersion: 1, unlocked: value.unlocked.filter(id => typeof id === 'string' && KNOWN_IDS.has(id)), equipped: cleanEquipped(value.equipped) };
        }
    } catch { /* registro ilegível vale vazio */ }
    return { schemaVersion: 1, unlocked: [], equipped: {} };
}

export class DecorationsCoordinator {
    // Fila única, como as missões: duas telas não gravam uma sobre a outra.
    private tail: Promise<unknown> = Promise.resolve();
    // Um `sync` que leu o progresso antes de um reset não regrava os ganhos depois dele.
    private generation = 0;

    constructor(private readonly ports: DecorationsPorts = livePorts) {}

    private queued<T>(operation: () => Promise<T>): Promise<T> {
        const result = this.tail.then(operation);
        this.tail = result.catch(() => undefined);
        return result;
    }

    /** `null` quando o registro é de uma versão mais nova: esta não grava por cima. */
    private async load(): Promise<{ store: Store; writable: boolean; existed: boolean }> {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS);
        return { store: parse(raw), writable: !rawHasUnknownSchemaVersion(raw, [SCHEMA_VERSION]), existed: raw !== null };
    }

    private async save(store: Store): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(store));
    }

    private async subscriber(): Promise<boolean> {
        return this.ports.subscriber().catch(() => false);
    }

    async sync(): Promise<DecorationsState> {
        // As fontes leem fora da fila: uma leitura que demora ou trava não prende equipar nem o próximo foco.
        const startedAt = this.generation;
        const [progress, subscriber] = await Promise.all([this.ports.progress(), this.subscriber()]);
        return this.queued(async () => {
            const { store, writable } = await this.load();
            if (startedAt !== this.generation) return { unlocked: [], subscriber, equipped: resolveEquipped({}, availableIds([], subscriber)) };
            const earned = newlyEarned(progress, store.unlocked);
            const unlocked = [...store.unlocked, ...earned];
            if (earned.length && writable) await this.save({ ...store, unlocked });
            return { unlocked, subscriber, equipped: resolveEquipped(store.equipped, availableIds(unlocked, subscriber)) };
        });
    }

    /** `id` nulo tira o item do encaixe. Devolve `false` sem gravar quando o item não está disponível. */
    equip(slot: DecorationSlot, id: string | null): Promise<boolean> {
        return this.queued(async () => {
            const { store, writable } = await this.load();
            if (!writable) return false;
            if (id !== null) {
                const item = DECORATIONS.find(d => d.id === id);
                if (!item || item.slot !== slot || !availableIds(store.unlocked, await this.subscriber()).has(id)) return false;
            }
            const equipped = { ...store.equipped };
            if (id === null) delete equipped[slot]; else equipped[slot] = id;
            await this.save({ ...store, equipped });
            return true;
        });
    }

    backupPayload(): Promise<DecorationsBackup | null> {
        return this.queued(async () => {
            const { store, existed } = await this.load();
            return existed ? { unlocked: store.unlocked, equipped: store.equipped } : null;
        });
    }

    /** Une os ganhos; o equipado local vence, e o da nuvem só entra no lugar de um vazio. */
    absorbBackup(backup: DecorationsBackup): Promise<void> {
        return this.queued(async () => {
            const { store, writable } = await this.load();
            if (!writable) return;
            const remote = parse(JSON.stringify({ schemaVersion: 1, ...backup }));
            const unlocked = [...new Set([...store.unlocked, ...remote.unlocked])];
            const equipped = Object.keys(store.equipped).length ? store.equipped : remote.equipped;
            await this.save({ schemaVersion: 1, unlocked, equipped });
        });
    }

    reset(): Promise<void> {
        this.generation += 1;
        return this.queued(() => AsyncStorage.removeItem(STORAGE_KEYS.DECORATIONS));
    }
}

/** Progresso que as regras leem, a partir das fontes existentes. Exportado para teste. */
export function progressFromSources(
    trail: CurriculumTrail, gamification: { streakDays: number; totalXp: number }, missions: readonly { done: boolean }[],
): DecorationProgress {
    const units = trail.segments.flatMap(s => s.units);
    const lessons = units.flatMap(u => u.nodes).filter(n => n.type === 'lesson');
    return {
        lessonsCompleted: lessons.filter(n => n.status === 'completed').length,
        // A revisão não conta para concluir (ADR 2026-10-16): uma revisão que vence de novo não tira a unidade.
        unitsCompleted: units.map(u => u.nodes.filter(n => n.type !== 'review'))
            .filter(nodes => nodes.length > 0 && nodes.every(n => n.status === 'completed')).length,
        streakDays: gamification.streakDays,
        allMissionsDoneToday: missions.length > 0 && missions.every(m => m.done),
        level: levelFromXp(gamification.totalXp).level,
    };
}

/* eslint-disable @typescript-eslint/no-require-imports -- resolução tardia: as regras puras não inicializam catálogo, loja nem storage nativo. */
const livePorts: DecorationsPorts = {
    async progress() {
        const { JourneyCurriculumService } = require('../journey/services/JourneyCurriculumService');
        const { GamificationService } = require('../gamification/services/GamificationService');
        const { DailyMissionsService } = require('../missions/services/DailyMissionsService');
        const [trail, gamification, missions] = await Promise.all([
            JourneyCurriculumService.getCurriculumTrail(), GamificationService.getSnapshot(),
            DailyMissionsService.sync().catch(() => ({ missions: [] })),
        ]);
        return progressFromSources(trail, gamification, missions.missions);
    },
    async subscriber() {
        const { subscriptionService } = require('../subscription/SubscriptionService');
        return (await subscriptionService.getStatus(Date.now())).kind === 'unlimited';
    },
};
/* eslint-enable @typescript-eslint/no-require-imports */

export const DecorationsService = new DecorationsCoordinator();
