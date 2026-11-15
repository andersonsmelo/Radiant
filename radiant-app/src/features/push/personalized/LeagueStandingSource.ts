/**
 * Porta mínima da posição na liga para o lembrete (F6). A liga semanal é da F4
 * (PR #72) e ainda não está na `main`: este módulo não a importa. Depois do merge,
 * um adaptador sobre `LeagueService.getStanding()` substitui o vazio em
 * `reminderContext.ts`, sem mudar o compositor.
 */
export type LeagueStanding = { rank: number; totalPlayers: number };

export interface LeagueStandingSource {
    getStanding(): Promise<LeagueStanding | null>;
}

export const EMPTY_LEAGUE_STANDING: LeagueStandingSource = { getStanding: async () => null };
