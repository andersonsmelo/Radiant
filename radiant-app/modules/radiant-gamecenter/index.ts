/**
 * Ponto de entrada do módulo Expo local `radiant-gamecenter`.
 *
 * O `GameCenterLeagueAdapter` não importa este arquivo: resolve o módulo pelo
 * nome, com `requireOptionalNativeModule`, para que a ausência do binário
 * nativo (Android, Jest, Expo Go) seja caminho normal. O contrato espelhado
 * vive em `src/features/league/league.types.ts`; ele não é importado daqui
 * para não inverter a direção da dependência.
 */
import { requireOptionalNativeModule } from 'expo-modules-core';

export type RadiantGameCenterEntry = { rank: number; score: number; alias: string; isLocalPlayer: boolean };

export type RadiantGameCenterAuth =
    | { status: 'authenticated'; alias: string }
    | { status: 'needsSignIn' }
    | { status: 'unavailable'; reason: string };

export type RadiantGameCenterPage = {
    local: RadiantGameCenterEntry | null;
    entries: RadiantGameCenterEntry[];
    totalPlayerCount: number;
    startDate: string | null;
    nextStartDate: string | null;
    durationSeconds: number;
};

export interface RadiantGameCenterModule {
    authenticate(): Promise<RadiantGameCenterAuth>;
    presentSignIn(): Promise<boolean>;
    /** Recusa com `stale-week` se a ocorrência atual não começa em `expectedStartDate`. */
    submitScore(leaderboardId: string, score: number, expectedStartDate: string): Promise<void>;
    loadEntries(
        leaderboardId: string,
        scope: 'global' | 'friends',
        occurrence: 'current' | 'previous',
        start: number,
        length: number,
    ): Promise<RadiantGameCenterPage | null>;
    /** Sem corpo: avisa que a autenticação mudou (o aluno entrou pela tela do GameKit). */
    addListener(eventName: 'onAuthenticationChanged', listener: () => void): { remove(): void };
}

/** `null` fora de um build iOS que compilou este módulo. */
export const RadiantGameCenter = requireOptionalNativeModule<RadiantGameCenterModule>('RadiantGameCenter');

export default RadiantGameCenter;
