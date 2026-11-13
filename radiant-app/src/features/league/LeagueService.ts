import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppConfig } from '../../config';
import { formatLocalDateKey } from '../../constants/gamification';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { GamificationService } from '../gamification/services/GamificationService';
import { resolveLeagueAdapter } from './GameCenterLeagueAdapter';
import { weekStartUtc } from './leagueWeek';
import {
    LeagueError,
    type LeagueEntry,
    type LeagueErrorCode,
    type LeagueScope,
    type LeaguePort,
} from './league.types';

/** Quantos o placar mostra no topo. */
export const LEAGUE_TOP_SIZE = 10;
/** Vizinhança do aluno fora do topo: duas posições acima e duas abaixo. */
const NEIGHBOR_RADIUS = 2;

/**
 * Estado local da liga (`@radiant:league_v1`, inventário G7, classe economia).
 *
 * Fora do backup de progresso por decisão (ADR 2026-11-13): o que importa já
 * está no Game Center, e `loadBoard`/`checkNotice` adotam a pontuação de lá
 * quando ela é maior que a local. O backup do iOS leva a pasta inteira do
 * AsyncStorage (ADR 2026-10-19), e isso não atrapalha: a mesma regra corrige.
 */
type LeagueStore = {
    schemaVersion: 1;
    /** Início (UTC) da semana do balde. */
    week: string;
    weekXp: number;
    /** Último total da semana confirmado pelo Game Center. */
    submittedXp: number | null;
    /** Última posição vista nesta semana, para o aviso de ultrapassagem. */
    lastRank: number | null;
    /** Dia local do último aviso de ultrapassagem. */
    overtakenNoticeDay: string | null;
    /** Semana em que o resumo da semana anterior já foi conferido. */
    summarySeenWeek: string | null;
};

export type FlushResult =
    | { kind: 'sent'; xp: number }
    | { kind: 'nothing-to-send' }
    | { kind: 'not-authenticated' }
    | { kind: 'failed'; code: LeagueErrorCode };

export type LeagueBoard =
    | { kind: 'unavailable'; reason: LeagueErrorCode }
    | { kind: 'needsSignIn' }
    | { kind: 'offline' }
    | { kind: 'empty'; endsAt: string | null }
    | {
        kind: 'ready';
        top: LeagueEntry[];
        /** Vizinhança do aluno quando ele está fora do topo; vazia quando está no topo. */
        neighbors: LeagueEntry[];
        local: LeagueEntry | null;
        totalPlayers: number;
        endsAt: string | null;
    };

export type LeagueNotice =
    | { kind: 'summary'; rank: number; totalPlayers: number; xp: number }
    | { kind: 'overtaken'; rank: number };

/** O que a frente de notificações (F6) pode perguntar, sem tela e sem pedir entrada. */
export type LeagueStanding = { rank: number; totalPlayers: number; xp: number; endsAt: string | null };

type Storage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;

export type LeagueServiceDeps = {
    storage: Storage;
    adapter: () => LeaguePort;
    now: () => Date;
};

const errorCode = (cause: unknown): LeagueErrorCode =>
    cause instanceof LeagueError ? cause.code : 'unrecoverable';

export class LeagueServiceImpl {
    private tail: Promise<unknown> = Promise.resolve();
    private port: LeaguePort | null = null;

    constructor(private readonly deps: LeagueServiceDeps) {}

    private get adapter(): LeaguePort {
        this.port ??= this.deps.adapter();
        return this.port;
    }

    /** Uma fila só: XP, envio e leitura do estado não se atropelam. */
    private serial<T>(work: () => Promise<T>): Promise<T> {
        const result = this.tail.then(work, work);
        this.tail = result.catch(() => undefined);
        return result;
    }

    private async read(): Promise<LeagueStore | null> {
        try {
            const raw = await this.deps.storage.getItem(STORAGE_KEYS.LEAGUE);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as Partial<LeagueStore>;
            // Schema desconhecido (versão mais nova): não grava por cima (G7).
            if (parsed.schemaVersion !== 1) return null;
            return parsed as LeagueStore;
        } catch {
            return null;
        }
    }

    private async write(store: LeagueStore): Promise<void> {
        try {
            const raw = await this.deps.storage.getItem(STORAGE_KEYS.LEAGUE);
            const version = raw ? (JSON.parse(raw) as { schemaVersion?: unknown }).schemaVersion : undefined;
            if (version !== undefined && version !== 1) return;
        } catch { /* ilegível: segue e grava o novo */ }
        await this.deps.storage.setItem(STORAGE_KEYS.LEAGUE, JSON.stringify(store));
    }

    /** O estado da semana corrente; semana diferente recomeça o balde e preserva as marcas de aviso. */
    private async current(): Promise<LeagueStore> {
        const week = weekStartUtc(this.deps.now());
        const stored = await this.read();
        if (stored && stored.week === week) return stored;
        return {
            schemaVersion: 1, week, weekXp: 0, submittedXp: null, lastRank: null,
            overtakenNoticeDay: stored?.overtakenNoticeDay ?? null,
            summarySeenWeek: stored?.summarySeenWeek ?? null,
        };
    }

    /** XP ganho (de `GamificationService.onXpEarned`). Grava no balde da semana de `at`. */
    recordXpEarned(xp: number, at: Date): Promise<void> {
        return this.serial(async () => {
            if (!Number.isFinite(xp) || xp <= 0) return;
            const week = weekStartUtc(at);
            const stored = await this.read();
            const store: LeagueStore = stored && stored.week === week ? stored : {
                schemaVersion: 1, week, weekXp: 0, submittedXp: null, lastRank: null,
                overtakenNoticeDay: stored?.overtakenNoticeDay ?? null,
                summarySeenWeek: stored?.summarySeenWeek ?? null,
            };
            store.weekXp += xp;
            await this.write(store);
        });
    }

    /**
     * Envia o total da semana corrente, se ainda não confirmado. Enviar o total,
     * e não o incremento, é o que torna o reenvio seguro: o placar guarda a
     * melhor pontuação, então repetir o mesmo total não duplica nada. XP de uma
     * semana já encerrada não é enviado, porque cairia na ocorrência nova.
     */
    flush(): Promise<FlushResult> {
        return this.serial(() => this.flushUnlocked());
    }

    private async flushUnlocked(): Promise<FlushResult> {
        const store = await this.current();
        if (store.weekXp <= 0 || store.submittedXp === store.weekXp) return { kind: 'nothing-to-send' };
        const auth = await this.adapter.authenticate();
        if (auth.status !== 'authenticated') return { kind: 'not-authenticated' };
        const xp = store.weekXp;
        try {
            await this.adapter.submitWeeklyXp(xp);
        } catch (cause) {
            const code = errorCode(cause);
            return code === 'not-authenticated' ? { kind: 'not-authenticated' } : { kind: 'failed', code };
        }
        await this.write({ ...store, submittedXp: xp });
        return { kind: 'sent', xp };
    }

    /** Reinstalação ou outro aparelho: a pontuação do Game Center maior que a local vira a local. */
    private async adopt(local: LeagueEntry | null): Promise<void> {
        if (!local) return;
        const store = await this.current();
        if (local.xp <= store.weekXp) return;
        await this.write({ ...store, weekXp: local.xp, submittedXp: local.xp });
    }

    /** O placar da tela "Liga da semana". Nunca lança: todo estado tem texto. */
    loadBoard(scope: LeagueScope): Promise<LeagueBoard> {
        return this.serial(async () => {
            const auth = await this.adapter.authenticate();
            if (auth.status === 'needsSignIn') return { kind: 'needsSignIn' };
            if (auth.status === 'unavailable') return { kind: 'unavailable', reason: auth.reason };
            await this.flushUnlocked();
            try {
                const page = await this.adapter.loadPage({ scope, occurrence: 'current', start: 1, length: LEAGUE_TOP_SIZE });
                if (page === null || page.totalPlayers === 0 || page.entries.length === 0) {
                    return { kind: 'empty', endsAt: page?.endsAt ?? null };
                }
                if (scope === 'global') await this.adopt(page.local);
                let neighbors: LeagueEntry[] = [];
                const rank = page.local?.rank;
                if (rank !== undefined && rank > LEAGUE_TOP_SIZE) {
                    const start = Math.max(LEAGUE_TOP_SIZE + 1, rank - NEIGHBOR_RADIUS);
                    const around = await this.adapter.loadPage({ scope, occurrence: 'current', start, length: NEIGHBOR_RADIUS * 2 + 1 });
                    neighbors = around?.entries ?? [];
                }
                if (scope === 'global' && rank !== undefined) await this.rememberRank(rank);
                return { kind: 'ready', top: page.entries, neighbors, local: page.local, totalPlayers: page.totalPlayers, endsAt: page.endsAt };
            } catch (cause) {
                const code = errorCode(cause);
                if (code === 'network-unavailable') return { kind: 'offline' };
                if (code === 'not-authenticated') return { kind: 'needsSignIn' };
                return { kind: 'unavailable', reason: code };
            }
        });
    }

    private async rememberRank(rank: number): Promise<void> {
        const store = await this.current();
        if (store.lastRank !== rank) await this.write({ ...store, lastRank: rank });
    }

    /**
     * O aviso da Estude: o resumo da semana encerrada, na primeira abertura
     * depois da virada; senão, "alguém passou você", no máximo uma vez por dia.
     * Não pede entrada no Game Center e não mostra erro: sem dado, sem aviso.
     */
    checkNotice(): Promise<LeagueNotice | null> {
        return this.serial(async () => {
            try {
                const auth = await this.adapter.authenticate();
                if (auth.status !== 'authenticated') return null;
                await this.flushUnlocked();

                const store = await this.current();
                if (store.summarySeenWeek !== store.week) {
                    const previous = await this.adapter.loadPage({ scope: 'global', occurrence: 'previous', start: 1, length: 1 });
                    await this.write({ ...store, summarySeenWeek: store.week });
                    if (previous?.local) {
                        return { kind: 'summary', rank: previous.local.rank, totalPlayers: previous.totalPlayers, xp: previous.local.xp };
                    }
                }

                const page = await this.adapter.loadPage({ scope: 'global', occurrence: 'current', start: 1, length: 1 });
                const local = page?.local ?? null;
                if (!local) return null;
                await this.adopt(local);
                const after = await this.current();
                const today = formatLocalDateKey(this.deps.now());
                const passed = after.lastRank !== null && local.rank > after.lastRank;
                const notify = passed && after.overtakenNoticeDay !== today;
                await this.write({ ...after, lastRank: local.rank, ...(notify ? { overtakenNoticeDay: today } : {}) });
                return notify ? { kind: 'overtaken', rank: local.rank } : null;
            } catch {
                return null;
            }
        });
    }

    /** Posição e tempo restante para a F6 (notificações). `null` sem dado real. */
    getStanding(): Promise<LeagueStanding | null> {
        return this.serial(async () => {
            try {
                const auth = await this.adapter.authenticate();
                if (auth.status !== 'authenticated') return null;
                await this.flushUnlocked();
                const page = await this.adapter.loadPage({ scope: 'global', occurrence: 'current', start: 1, length: 1 });
                if (!page?.local) return null;
                return { rank: page.local.rank, totalPlayers: page.totalPlayers, xp: page.local.xp, endsAt: page.endsAt };
            } catch {
                return null;
            }
        });
    }

    presentSignIn(): Promise<boolean> {
        return this.adapter.presentSignIn();
    }

    onAuthenticationChanged(listener: () => void): () => void {
        return this.adapter.onAuthenticationChanged(listener);
    }
}

export const LeagueService = new LeagueServiceImpl({
    storage: AsyncStorage,
    adapter: resolveLeagueAdapter,
    now: () => new Date(),
});

let stopListening: (() => void) | null = null;

/**
 * Liga a liga na abertura do app: ouve o XP ganho e tenta enviar o que ficou
 * pendente. Com `ENABLE_LEAGUE` desligada não faz nada: nem ouvinte, nem
 * leitura, nem gravação, e o app se comporta como a `main`.
 */
export function startLeague(
    enabled: boolean = AppConfig.ENABLE_LEAGUE,
    service: LeagueServiceImpl = LeagueService,
): void {
    if (!enabled || stopListening) return;
    stopListening = GamificationService.onXpEarned((xp, at) => {
        void service.recordXpEarned(xp, at).then(() => service.flush());
    });
    void service.flush();
}

/** Só para testes. */
export function stopLeagueForTests(): void {
    stopListening?.();
    stopListening = null;
}
