import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppConfig } from '../../config';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { rawHasUnknownSchemaVersion } from '../../storage/schemaVersionGuard';
import { heartsRepository } from '../hearts/HeartsRepository';
import type { HeartsSnapshot } from '../hearts/hearts.types';
import { subscriptionService } from '../subscription/SubscriptionService';
import type { SubscriptionStatus } from '../subscription/subscription.types';

/** Duração da amostra única de vidas ilimitadas (ADR 2026-11-15). */
export const SAMPLE_MINUTES = 30;

export type ConversionMoment = 'hearts-empty' | 'unit-complete';
export type FunnelEvent =
    | 'invite_seen_hearts_empty'
    | 'invite_seen_unit_complete'
    | 'screen_opened'
    | 'purchase_started'
    | 'purchase_completed'
    | 'sample_taken';

export type ConversionStateV1 = {
    schemaVersion: 1;
    /** Dia LOCAL do último convite, `AAAA-MM-DD`. */
    lastInviteDay: string | null;
    sampleTakenAt: string | null;
    counts: Record<FunnelEvent, number>;
};

type Deps = {
    storage?: Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;
    subscription?: { getStatus(nowMs: number): Promise<SubscriptionStatus>; storeAvailable(): boolean };
    hearts?: { setUnlimited(until: string | null, nowMs: number): Promise<HeartsSnapshot> };
    enabled?: () => boolean;
};

const FUNNEL_EVENTS: readonly FunnelEvent[] = [
    'invite_seen_hearts_empty', 'invite_seen_unit_complete', 'screen_opened',
    'purchase_started', 'purchase_completed', 'sample_taken',
];
const SEEN: Record<ConversionMoment, FunnelEvent> = {
    'hearts-empty': 'invite_seen_hearts_empty',
    'unit-complete': 'invite_seen_unit_complete',
};

function emptyState(): ConversionStateV1 {
    return {
        schemaVersion: 1,
        lastInviteDay: null,
        sampleTakenAt: null,
        counts: Object.fromEntries(FUNNEL_EVENTS.map(event => [event, 0])) as Record<FunnelEvent, number>,
    };
}

function localDay(nowMs: number): string {
    const date = new Date(nowMs);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parse(raw: string | null): ConversionStateV1 {
    const state = emptyState();
    if (raw === null) return state;
    try {
        const value = JSON.parse(raw) as Record<string, unknown> | null;
        if (typeof value !== 'object' || value === null || value.schemaVersion !== 1) return state;
        if (typeof value.lastInviteDay === 'string') state.lastInviteDay = value.lastInviteDay;
        if (typeof value.sampleTakenAt === 'string') state.sampleTakenAt = value.sampleTakenAt;
        const counts = (value.counts ?? {}) as Record<string, unknown>;
        for (const event of FUNNEL_EVENTS) {
            const n = counts[event];
            if (typeof n === 'number' && Number.isInteger(n) && n >= 0) state.counts[event] = n;
        }
    } catch {
        // Ilegível vale como vazio: o pior caso é um convite a mais num dia.
    }
    return state;
}

/**
 * Convites de assinatura (F8, ADR 2026-11-15). Decide se um convite pode
 * aparecer agora, guarda o limite de um por dia local e conta o funil, tudo
 * no aparelho: nada sai dele. Com `ENABLE_CONVERSION_PROMPTS` desligada, não
 * convida, não amostra e não escreve.
 */
export class ConversionService {
    private readonly storage: NonNullable<Deps['storage']>;
    private readonly subscription: NonNullable<Deps['subscription']>;
    private readonly hearts: NonNullable<Deps['hearts']>;
    private readonly isEnabled: () => boolean;

    constructor(deps: Deps = {}) {
        this.storage = deps.storage ?? AsyncStorage;
        this.subscription = deps.subscription ?? subscriptionService;
        this.hearts = deps.hearts ?? heartsRepository;
        this.isEnabled = deps.enabled ?? (() => AppConfig.ENABLE_CONVERSION_PROMPTS);
    }

    enabled(): boolean {
        return this.isEnabled();
    }

    /**
     * Toma o convite do dia, se houver: marca o dia e conta o convite visto.
     * Só para quem pode comprar e não tem nem pediu a assinatura.
     */
    async takeInvite(moment: ConversionMoment, nowMs: number): Promise<{ sampleAvailable: boolean } | null> {
        if (!this.enabled() || !this.subscription.storeAvailable()) return null;
        const status = await this.subscription.getStatus(nowMs);
        if (status.kind !== 'none' && status.kind !== 'expired') return null;

        const loaded = await this.load();
        if (loaded === null) return null;
        const today = localDay(nowMs);
        if (loaded.lastInviteDay === today) return null;

        loaded.lastInviteDay = today;
        loaded.counts[SEEN[moment]] += 1;
        await this.save(loaded);
        return {
            // Ex-assinante não recebe amostra: `refresh` de quem está `expired`
            // chama `setUnlimited(null)` e a apagaria na próxima abertura.
            sampleAvailable: moment === 'hearts-empty' && status.kind === 'none' && loaded.sampleTakenAt === null,
        };
    }

    /** Amostra única: `SAMPLE_MINUTES` de vidas ilimitadas, pela regra de vidas que já existe. */
    async takeSample(nowMs: number): Promise<HeartsSnapshot | null> {
        if (!this.enabled()) return null;
        if ((await this.subscription.getStatus(nowMs)).kind !== 'none') return null;
        const loaded = await this.load();
        if (loaded === null || loaded.sampleTakenAt !== null) return null;

        // Marca antes de dar: um segundo toque durante a escrita não dá duas.
        loaded.sampleTakenAt = new Date(nowMs).toISOString();
        loaded.counts.sample_taken += 1;
        await this.save(loaded);
        return this.hearts.setUnlimited(new Date(nowMs + SAMPLE_MINUTES * 60_000).toISOString(), nowMs);
    }

    async record(event: FunnelEvent): Promise<void> {
        if (!this.enabled()) return;
        const loaded = await this.load();
        if (loaded === null) return;
        loaded.counts[event] += 1;
        await this.save(loaded);
    }

    /** Leitura para a tela de desenvolvimento; store de outra versão aparece vazio. */
    async read(): Promise<ConversionStateV1> {
        return (await this.load()) ?? emptyState();
    }

    /** `null`: o store é de uma versão mais nova (G7), e esta não o toca. */
    private async load(): Promise<ConversionStateV1 | null> {
        const raw = await this.storage.getItem(STORAGE_KEYS.CONVERSION);
        if (rawHasUnknownSchemaVersion(raw, [1])) return null;
        return parse(raw);
    }

    private async save(state: ConversionStateV1): Promise<void> {
        await this.storage.setItem(STORAGE_KEYS.CONVERSION, JSON.stringify(state));
    }
}

export const conversionService = new ConversionService();
