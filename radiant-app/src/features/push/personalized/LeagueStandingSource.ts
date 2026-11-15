/**
 * Porta mínima da posição na liga para o lembrete (F6). Com `ENABLE_LEAGUE`
 * ligada, lê `LeagueService.getStanding()` (F4); desligada, é vazia e o módulo
 * da liga nem é carregado, como no `_layout`.
 */
import { AppConfig } from '../../../config';

export type LeagueStanding = { rank: number; totalPlayers: number };

export interface LeagueStandingSource {
    getStanding(): Promise<LeagueStanding | null>;
}

export const EMPTY_LEAGUE_STANDING: LeagueStandingSource = { getStanding: async () => null };

export function liveLeagueStanding(enabled: boolean = AppConfig.ENABLE_LEAGUE): LeagueStandingSource {
    if (!enabled) return EMPTY_LEAGUE_STANDING;
    return {
        async getStanding() {
            // eslint-disable-next-line @typescript-eslint/no-require-imports -- carga tardia: só com a liga ligada.
            const standing = await require('../../league/LeagueService').LeagueService.getStanding();
            return standing ? { rank: standing.rank, totalPlayers: standing.totalPlayers } : null;
        },
    };
}
