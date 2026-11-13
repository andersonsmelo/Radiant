/**
 * Liga semanal (ADR 2026-11-13): placar recorrente do Game Center, sem
 * servidor próprio. A porta fala a língua do app; o módulo nativo
 * `radiant-gamecenter` fala a do GameKit e é espelhado em `RadiantGameCenterNative`.
 *
 * Do outro aluno só atravessa o apelido do Game Center, a posição e o XP.
 */

/** Identificador do placar recorrente no App Store Connect (runbook 2026-11-13). */
export const LEAGUE_LEADERBOARD_ID = 'radiant.liga.semanal.xp';

export type LeagueErrorCode =
    | 'not-authenticated'
    | 'network-unavailable'
    | 'leaderboard-not-found'
    /** Sem Game Center neste binário: Android, Jest, chave desligada. */
    | 'unavailable'
    | 'unrecoverable';

export class LeagueError extends Error {
    constructor(readonly code: LeagueErrorCode, message: string = code) {
        super(message);
        this.name = 'LeagueError';
    }
}

export type LeagueAuth =
    | { status: 'authenticated'; alias: string }
    /** O GameKit ofereceu a tela de entrada; ela só aparece se o aluno pedir. */
    | { status: 'needsSignIn' }
    | { status: 'unavailable'; reason: LeagueErrorCode };

export type LeagueEntry = { rank: number; xp: number; alias: string; isLocalPlayer: boolean };

export type LeagueScope = 'global' | 'friends';

export type LeaguePageQuery = {
    scope: LeagueScope;
    occurrence: 'current' | 'previous';
    /** Posição inicial, a partir de 1. */
    start: number;
    length: number;
};

export type LeaguePage = {
    local: LeagueEntry | null;
    entries: LeagueEntry[];
    totalPlayers: number;
    startsAt: string | null;
    endsAt: string | null;
};

export interface LeaguePort {
    authenticate(): Promise<LeagueAuth>;
    /** `false` quando não há tela de entrada a mostrar. */
    presentSignIn(): Promise<boolean>;
    /** Envia o XP total da semana corrente. Reenviar o mesmo total não duplica. */
    submitWeeklyXp(xp: number): Promise<void>;
    /** `null` quando a ocorrência pedida não existe (primeira semana do placar). */
    loadPage(query: LeaguePageQuery): Promise<LeaguePage | null>;
    /** Avisa quando a autenticação muda (o aluno entrou pela tela do GameKit). */
    onAuthenticationChanged(listener: () => void): () => void;
}

// ── Fronteira nativa: espelho de `modules/radiant-gamecenter/index.ts` ──

export type RadiantGameCenterNativeEntry = { rank: number; score: number; alias: string; isLocalPlayer: boolean };

export type RadiantGameCenterNativeAuth =
    | { status: 'authenticated'; alias: string }
    | { status: 'needsSignIn' }
    | { status: 'unavailable'; reason: string };

export type RadiantGameCenterNativePage = {
    local: RadiantGameCenterNativeEntry | null;
    entries: RadiantGameCenterNativeEntry[];
    totalPlayerCount: number;
    startDate: string | null;
    nextStartDate: string | null;
    durationSeconds: number;
};

export interface RadiantGameCenterNative {
    authenticate(): Promise<RadiantGameCenterNativeAuth>;
    presentSignIn(): Promise<boolean>;
    submitScore(leaderboardId: string, score: number): Promise<void>;
    loadEntries(
        leaderboardId: string,
        scope: LeagueScope,
        occurrence: 'current' | 'previous',
        start: number,
        length: number,
    ): Promise<RadiantGameCenterNativePage | null>;
    addListener(eventName: 'onAuthenticationChanged', listener: () => void): { remove(): void };
}
