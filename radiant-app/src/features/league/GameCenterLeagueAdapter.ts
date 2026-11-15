import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';

import { AppConfig } from '../../config';
import {
    LEAGUE_LEADERBOARD_ID,
    LeagueError,
    type LeagueAuth,
    type LeagueEntry,
    type LeagueErrorCode,
    type LeaguePage,
    type LeaguePageQuery,
    type LeaguePort,
    type RadiantGameCenterNative,
    type RadiantGameCenterNativeEntry,
} from './league.types';
import { UnavailableLeagueAdapter } from './UnavailableLeagueAdapter';

const KNOWN_CODES: readonly LeagueErrorCode[] = [
    'not-authenticated', 'network-unavailable', 'leaderboard-not-found', 'stale-week', 'friends-unavailable',
];

function codeOf(cause: unknown): LeagueErrorCode {
    const code = typeof cause === 'object' && cause !== null ? (cause as { code?: unknown }).code : undefined;
    return KNOWN_CODES.find(known => known === code) ?? 'unrecoverable';
}

/**
 * Prazo da autenticação. Medido em 2026-11-13 num simulador sem conta: o
 * GameKit falhou por dentro e nunca chamou o `authenticateHandler`. Sem prazo,
 * a fila do `LeagueService` travava, e com ela o envio do XP.
 */
export const AUTH_TIMEOUT_MS = 15_000;

const AUTH_TIMED_OUT: LeagueAuth = { status: 'unavailable', reason: 'not-authenticated' };

/** Prazo do envio e da leitura: um GameKit que não responde não pode travar a fila. */
export const NATIVE_CALL_TIMEOUT_MS = 20_000;

function withTimeout<T>(work: Promise<T>, ms: number, onTimeout: () => T): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    // `then` transforma o throw de `onTimeout` em rejeição, em vez de exceção solta no timer.
    const timeout = new Promise<T>(resolve => { timer = setTimeout(() => resolve(Promise.resolve().then(onTimeout)), ms); });
    return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
}

const timedOut = (): never => { throw new LeagueError('network-unavailable', 'Game Center não respondeu no prazo.'); };

const toEntry = (entry: RadiantGameCenterNativeEntry): LeagueEntry => ({
    rank: entry.rank, xp: entry.score, alias: entry.alias, isLocalPlayer: entry.isLocalPlayer,
});

/** Liga sobre o módulo Expo local `radiant-gamecenter`. Só iOS. */
export class GameCenterLeagueAdapter implements LeaguePort {
    constructor(private readonly native: RadiantGameCenterNative) {}

    async authenticate(): Promise<LeagueAuth> {
        try {
            const auth = await withTimeout(this.native.authenticate(), AUTH_TIMEOUT_MS, () => AUTH_TIMED_OUT);
            if (auth.status !== 'unavailable') return auth;
            return { status: 'unavailable', reason: codeOf({ code: auth.reason }) };
        } catch {
            // Autenticar é trabalho de abertura: falhar aqui é "sem Game Center", nunca erro fatal.
            return { status: 'unavailable', reason: 'unrecoverable' };
        }
    }

    async presentSignIn(): Promise<boolean> {
        try {
            return await this.native.presentSignIn();
        } catch {
            return false;
        }
    }

    async submitWeeklyXp(xp: number, weekStart: string): Promise<void> {
        if (!Number.isFinite(xp) || xp < 0) throw new LeagueError('unrecoverable', 'XP inválido para a liga.');
        try {
            await withTimeout(this.native.submitScore(LEAGUE_LEADERBOARD_ID, Math.floor(xp), weekStart), NATIVE_CALL_TIMEOUT_MS, timedOut);
        } catch (cause) {
            throw cause instanceof LeagueError ? cause : new LeagueError(codeOf(cause));
        }
    }

    async loadPage(query: LeaguePageQuery): Promise<LeaguePage | null> {
        let page;
        try {
            page = await withTimeout(
                this.native.loadEntries(LEAGUE_LEADERBOARD_ID, query.scope, query.occurrence, query.start, query.length),
                NATIVE_CALL_TIMEOUT_MS, timedOut);
        } catch (cause) {
            throw cause instanceof LeagueError ? cause : new LeagueError(codeOf(cause));
        }
        if (page === null) return null;
        return {
            local: page.local ? toEntry(page.local) : null,
            entries: page.entries.map(toEntry),
            totalPlayers: page.totalPlayerCount,
            startsAt: page.startDate,
            endsAt: page.nextStartDate,
        };
    }

    onAuthenticationChanged(listener: () => void): () => void {
        const subscription = this.native.addListener('onAuthenticationChanged', listener);
        return () => subscription.remove();
    }
}

/** Nome do módulo Expo local; só existe num build iOS que o compilou. */
export const RADIANT_GAMECENTER_MODULE = 'RadiantGameCenter';

/**
 * Com a chave desligada, fora do iOS ou sem o módulo nativo, a liga fica
 * indisponível. Resolver adaptador nunca derruba a abertura.
 */
export function resolveLeagueAdapter(): LeaguePort {
    if (!AppConfig.ENABLE_LEAGUE || Platform.OS !== 'ios') return new UnavailableLeagueAdapter();
    try {
        const native = requireOptionalNativeModule<RadiantGameCenterNative>(RADIANT_GAMECENTER_MODULE);
        return native ? new GameCenterLeagueAdapter(native) : new UnavailableLeagueAdapter();
    } catch (cause) {
        console.error('[GameCenterLeagueAdapter] Falha ao resolver o módulo nativo:', cause);
        return new UnavailableLeagueAdapter();
    }
}
