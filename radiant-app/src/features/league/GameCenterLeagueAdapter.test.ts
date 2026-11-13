import { GameCenterLeagueAdapter } from './GameCenterLeagueAdapter';
import { UnavailableLeagueAdapter } from './UnavailableLeagueAdapter';
import { LEAGUE_LEADERBOARD_ID, LeagueError, type RadiantGameCenterNative } from './league.types';

function nativo(overrides: Partial<RadiantGameCenterNative> = {}): jest.Mocked<RadiantGameCenterNative> {
    return {
        authenticate: jest.fn(async () => ({ status: 'authenticated' as const, alias: 'Raio-X' })),
        presentSignIn: jest.fn(async () => true),
        submitScore: jest.fn(async () => undefined),
        loadEntries: jest.fn(async () => null),
        addListener: jest.fn(() => ({ remove: jest.fn() })),
        ...overrides,
    } as jest.Mocked<RadiantGameCenterNative>;
}

const erroNativo = (code: string) => Object.assign(new Error(code), { code });

describe('GameCenterLeagueAdapter', () => {
    it('envia o XP inteiro e não negativo ao placar da liga', async () => {
        const n = nativo();
        await new GameCenterLeagueAdapter(n).submitWeeklyXp(42.7);
        expect(n.submitScore).toHaveBeenCalledWith(LEAGUE_LEADERBOARD_ID, 42);
    });

    it('não envia XP inválido', async () => {
        const n = nativo();
        await expect(new GameCenterLeagueAdapter(n).submitWeeklyXp(-3)).rejects.toMatchObject({ code: 'unrecoverable' });
        await expect(new GameCenterLeagueAdapter(n).submitWeeklyXp(Number.NaN)).rejects.toMatchObject({ code: 'unrecoverable' });
        expect(n.submitScore).not.toHaveBeenCalled();
    });

    it('traduz a página: pontuação vira XP, datas da ocorrência viram início e fim', async () => {
        const n = nativo({
            loadEntries: jest.fn(async () => ({
                local: { rank: 3, score: 80, alias: 'Eu', isLocalPlayer: true },
                entries: [{ rank: 1, score: 120, alias: 'Ana', isLocalPlayer: false }],
                totalPlayerCount: 7,
                startDate: '2026-11-09T00:00:00Z',
                nextStartDate: '2026-11-16T00:00:00Z',
                durationSeconds: 604800,
            })),
        });

        const pagina = await new GameCenterLeagueAdapter(n).loadPage({ scope: 'friends', occurrence: 'current', start: 1, length: 10 });

        expect(n.loadEntries).toHaveBeenCalledWith(LEAGUE_LEADERBOARD_ID, 'friends', 'current', 1, 10);
        expect(pagina).toEqual({
            local: { rank: 3, xp: 80, alias: 'Eu', isLocalPlayer: true },
            entries: [{ rank: 1, xp: 120, alias: 'Ana', isLocalPlayer: false }],
            totalPlayers: 7,
            startsAt: '2026-11-09T00:00:00Z',
            endsAt: '2026-11-16T00:00:00Z',
        });
    });

    it('ocorrência inexistente continua null', async () => {
        await expect(new GameCenterLeagueAdapter(nativo()).loadPage({ scope: 'global', occurrence: 'previous', start: 1, length: 1 }))
            .resolves.toBeNull();
    });

    it.each([
        ['network-unavailable', 'network-unavailable'],
        ['not-authenticated', 'not-authenticated'],
        ['leaderboard-not-found', 'leaderboard-not-found'],
        ['algo-novo', 'unrecoverable'],
    ])('erro nativo %s vira LeagueError %s', async (nativeCode, code) => {
        const n = nativo({ submitScore: jest.fn(async () => { throw erroNativo(nativeCode); }) });
        const promessa = new GameCenterLeagueAdapter(n).submitWeeklyXp(10);
        await expect(promessa).rejects.toBeInstanceOf(LeagueError);
        await expect(promessa).rejects.toMatchObject({ code });
    });

    it('autenticação: motivo desconhecido não vaza como código novo', async () => {
        const n = nativo({ authenticate: jest.fn(async () => ({ status: 'unavailable' as const, reason: 'qualquer' })) });
        await expect(new GameCenterLeagueAdapter(n).authenticate()).resolves.toEqual({ status: 'unavailable', reason: 'unrecoverable' });
    });

    it('falha ao autenticar não é exceção: é Game Center indisponível', async () => {
        const n = nativo({ authenticate: jest.fn(async () => { throw new Error('boom'); }) });
        await expect(new GameCenterLeagueAdapter(n).authenticate()).resolves.toEqual({ status: 'unavailable', reason: 'unrecoverable' });
    });
});

describe('UnavailableLeagueAdapter', () => {
    it('diz que não há Game Center e não finge placar', async () => {
        const a = new UnavailableLeagueAdapter();
        await expect(a.authenticate()).resolves.toEqual({ status: 'unavailable', reason: 'unavailable' });
        await expect(a.presentSignIn()).resolves.toBe(false);
        await expect(a.submitWeeklyXp(10)).rejects.toMatchObject({ code: 'unavailable' });
        await expect(a.loadPage({ scope: 'global', occurrence: 'current', start: 1, length: 10 })).rejects.toMatchObject({ code: 'unavailable' });
    });
});
