import { LeagueError, type LeagueAuth, type LeaguePort } from './league.types';

/**
 * Sem Game Center: Android, Jest, Expo Go, binário sem o módulo e chave
 * `ENABLE_LEAGUE` desligada. Não finge placar nem competidor: a tela diz que a
 * liga não está disponível e o estudo segue igual.
 */
export class UnavailableLeagueAdapter implements LeaguePort {
    async authenticate(): Promise<LeagueAuth> {
        return { status: 'unavailable', reason: 'unavailable' };
    }

    async presentSignIn(): Promise<boolean> {
        return false;
    }

    submitWeeklyXp: LeaguePort['submitWeeklyXp'] = async () => {
        throw new LeagueError('unavailable');
    };

    loadPage: LeaguePort['loadPage'] = async () => {
        throw new LeagueError('unavailable');
    };

    onAuthenticationChanged(): () => void {
        return () => undefined;
    }
}
