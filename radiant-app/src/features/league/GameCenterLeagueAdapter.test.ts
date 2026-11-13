import { AUTH_TIMEOUT_MS, GameCenterLeagueAdapter, NATIVE_CALL_TIMEOUT_MS } from './GameCenterLeagueAdapter';
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
        await new GameCenterLeagueAdapter(n).submitWeeklyXp(42.7, '2026-11-09T00:00:00.000Z');
        expect(n.submitScore).toHaveBeenCalledWith(LEAGUE_LEADERBOARD_ID, 42, '2026-11-09T00:00:00.000Z');
    });

    it('não envia XP inválido', async () => {
        const n = nativo();
        await expect(new GameCenterLeagueAdapter(n).submitWeeklyXp(-3, '2026-11-09T00:00:00.000Z')).rejects.toMatchObject({ code: 'unrecoverable' });
        await expect(new GameCenterLeagueAdapter(n).submitWeeklyXp(Number.NaN, '2026-11-09T00:00:00.000Z')).rejects.toMatchObject({ code: 'unrecoverable' });
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
        ['stale-week', 'stale-week'],
        ['friends-unavailable', 'friends-unavailable'],
        ['algo-novo', 'unrecoverable'],
    ])('erro nativo %s vira LeagueError %s', async (nativeCode, code) => {
        const n = nativo({ submitScore: jest.fn(async () => { throw erroNativo(nativeCode); }) });
        const promessa = new GameCenterLeagueAdapter(n).submitWeeklyXp(10, '2026-11-09T00:00:00.000Z');
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
        await expect(a.submitWeeklyXp(10, '2026-11-09T00:00:00.000Z')).rejects.toMatchObject({ code: 'unavailable' });
        await expect(a.loadPage({ scope: 'global', occurrence: 'current', start: 1, length: 10 })).rejects.toMatchObject({ code: 'unavailable' });
    });
});

// Medido em 2026-11-13 num simulador iOS 26.5 sem conta: o GameKit registrou
// erro de comunicação e nunca chamou o `authenticateHandler`. Sem prazo, a tela
// ficava em "Carregando a liga…" e a fila do LeagueService travava o envio.
describe('GameCenterLeagueAdapter — autenticação que nunca responde', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('desiste no prazo e responde Game Center indisponível', async () => {
        const n = nativo({ authenticate: jest.fn(() => new Promise<never>(() => undefined)) });
        const resposta = new GameCenterLeagueAdapter(n).authenticate();
        await jest.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS);
        await expect(resposta).resolves.toEqual({ status: 'unavailable', reason: 'not-authenticated' });
    });
});

describe('GameCenterLeagueAdapter — envio e leitura que nunca respondem', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('desistem no prazo como "sem rede", sem travar a fila', async () => {
        const nunca = () => new Promise<never>(() => undefined);
        const a = new GameCenterLeagueAdapter(nativo({ submitScore: jest.fn(nunca), loadEntries: jest.fn(nunca) }));
        const envio = a.submitWeeklyXp(10, '2026-11-09T00:00:00.000Z');
        const leitura = a.loadPage({ scope: 'global', occurrence: 'current', start: 1, length: 10 });
        const pegos = [expect(envio).rejects.toMatchObject({ code: 'network-unavailable' }),
            expect(leitura).rejects.toMatchObject({ code: 'network-unavailable' })];
        await jest.advanceTimersByTimeAsync(NATIVE_CALL_TIMEOUT_MS);
        await Promise.all(pegos);
    });
});
