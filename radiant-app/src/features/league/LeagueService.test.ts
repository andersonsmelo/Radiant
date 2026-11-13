import AsyncStorage from '@react-native-async-storage/async-storage';

import { LeagueServiceImpl, LEAGUE_TOP_SIZE } from './LeagueService';
import {
    LeagueError,
    type LeagueAuth,
    type LeagueEntry,
    type LeaguePage,
    type LeaguePageQuery,
    type LeaguePort,
} from './league.types';
import { STORAGE_KEYS } from '../../constants/storageKeys';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

/**
 * Game Center de mentira, mas fiel ao que importa: guarda a MAIOR pontuação
 * da ocorrência (placar "melhor pontuação"), ranqueia de verdade e pode ficar
 * sem rede ou sem jogador autenticado.
 */
class FakeGameCenter implements LeaguePort {
    auth: LeagueAuth = { status: 'authenticated', alias: 'Eu' };
    offline = false;
    week = 'atual';
    best = new Map<string, number>();
    previous: LeaguePage | null = null;
    others: { alias: string; xp: number }[] = [];
    submissions: number[] = [];
    pageCalls: LeaguePageQuery[] = [];
    endsAt = '2026-11-16T00:00:00.000Z';

    async authenticate() { return this.auth; }
    async presentSignIn() { return false; }
    onAuthenticationChanged() { return () => undefined; }

    async submitWeeklyXp(xp: number) {
        if (this.auth.status !== 'authenticated') throw new LeagueError('not-authenticated');
        if (this.offline) throw new LeagueError('network-unavailable');
        this.submissions.push(xp);
        this.best.set(this.week, Math.max(this.best.get(this.week) ?? 0, xp));
    }

    async loadPage(query: LeaguePageQuery): Promise<LeaguePage | null> {
        this.pageCalls.push(query);
        if (this.offline) throw new LeagueError('network-unavailable');
        if (query.occurrence === 'previous') return this.previous;
        const mine = this.best.get(this.week);
        const all = [...this.others.map(o => ({ ...o, isLocalPlayer: false })),
            ...(mine === undefined ? [] : [{ alias: 'Eu', xp: mine, isLocalPlayer: true }])]
            .sort((a, b) => b.xp - a.xp)
            .map((e, i): LeagueEntry => ({ rank: i + 1, ...e }));
        return {
            local: all.find(e => e.isLocalPlayer) ?? null,
            entries: all.slice(query.start - 1, query.start - 1 + query.length),
            totalPlayers: all.length,
            startsAt: '2026-11-09T00:00:00.000Z',
            endsAt: this.endsAt,
        };
    }
}

const QUINTA = new Date('2026-11-12T15:00:00Z');
const SEGUNDA_SEGUINTE = new Date('2026-11-16T10:00:00Z');

function montar(now: () => Date = () => QUINTA) {
    const gc = new FakeGameCenter();
    const service = new LeagueServiceImpl({ storage: AsyncStorage, adapter: () => gc, now });
    return { gc, service };
}

const gravado = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.LEAGUE)) ?? 'null');

beforeEach(async () => { await AsyncStorage.clear(); });

describe('LeagueService — envio do XP da semana', () => {
    it('soma o XP ganho na semana e envia o total ao Game Center', async () => {
        const { gc, service } = montar();
        await service.recordXpEarned(20, QUINTA);
        await service.recordXpEarned(5, QUINTA);
        await service.flush();
        expect(gc.submissions).toEqual([25]);
    });

    it('sem XP novo, não reenvia', async () => {
        const { gc, service } = montar();
        await service.recordXpEarned(20, QUINTA);
        await service.flush();
        await service.flush();
        expect(gc.submissions).toEqual([20]);
    });

    it('XP zero, negativo ou inválido não entra na liga', async () => {
        const { service } = montar();
        await service.recordXpEarned(0, QUINTA);
        await service.recordXpEarned(-5, QUINTA);
        await service.recordXpEarned(Number.NaN, QUINTA);
        expect(await gravado()).toBeNull();
    });

    it('sem rede: guarda, e reenvia o total uma vez só quando a rede volta', async () => {
        const { gc, service } = montar();
        gc.offline = true;
        await service.recordXpEarned(20, QUINTA);
        await expect(service.flush()).resolves.toEqual({ kind: 'failed', code: 'network-unavailable' });
        await service.recordXpEarned(10, QUINTA);
        await service.flush();
        expect(gc.submissions).toEqual([]);

        gc.offline = false;
        await expect(service.flush()).resolves.toEqual({ kind: 'sent', xp: 30 });
        await service.flush();
        expect(gc.submissions).toEqual([30]);
        expect(gc.best.get('atual')).toBe(30);
    });

    it('a fila sobrevive a fechar o app (outra instância lê o que ficou pendente)', async () => {
        const primeiro = montar();
        primeiro.gc.offline = true;
        await primeiro.service.recordXpEarned(15, QUINTA);
        await primeiro.service.flush();

        const segundo = montar();
        await segundo.service.flush();
        expect(segundo.gc.submissions).toEqual([15]);
    });

    it('dois envios ao mesmo tempo não mandam o mesmo total duas vezes', async () => {
        const { gc, service } = montar();
        await service.recordXpEarned(20, QUINTA);
        await Promise.all([service.flush(), service.flush(), service.flush()]);
        expect(gc.submissions).toEqual([20]);
    });

    it('jogador não autenticado: nada é enviado e o XP fica guardado', async () => {
        const { gc, service } = montar();
        gc.auth = { status: 'needsSignIn' };
        await service.recordXpEarned(20, QUINTA);
        await expect(service.flush()).resolves.toEqual({ kind: 'not-authenticated' });
        expect(gc.submissions).toEqual([]);
        expect((await gravado()).weekXp).toBe(20);

        gc.auth = { status: 'authenticated', alias: 'Eu' };
        await service.flush();
        expect(gc.submissions).toEqual([20]);
    });
});

describe('LeagueService — virada de semana', () => {
    it('XP da semana nova começa do zero', async () => {
        let agora = QUINTA;
        const { gc, service } = montar(() => agora);
        await service.recordXpEarned(40, QUINTA);
        await service.flush();

        agora = SEGUNDA_SEGUINTE;
        gc.week = 'seguinte';
        await service.recordXpEarned(5, SEGUNDA_SEGUINTE);
        await service.flush();

        expect(gc.submissions).toEqual([40, 5]);
        expect(gc.best.get('seguinte')).toBe(5);
    });

    it('XP pendente da semana encerrada não vai para a semana nova', async () => {
        let agora = QUINTA;
        const { gc, service } = montar(() => agora);
        gc.offline = true;
        await service.recordXpEarned(40, QUINTA);
        await service.flush();

        agora = SEGUNDA_SEGUINTE;
        gc.week = 'seguinte';
        gc.offline = false;
        await expect(service.flush()).resolves.toEqual({ kind: 'nothing-to-send' });
        expect(gc.submissions).toEqual([]);
    });
});

describe('LeagueService — placar', () => {
    it('sem Game Center, diz que está indisponível e não pede nada ao placar', async () => {
        const { gc, service } = montar();
        gc.auth = { status: 'unavailable', reason: 'unavailable' };
        await expect(service.loadBoard('global')).resolves.toEqual({ kind: 'unavailable', reason: 'unavailable' });
        expect(gc.pageCalls).toEqual([]);
    });

    it('com entrada oferecida, pede entrada', async () => {
        const { gc, service } = montar();
        gc.auth = { status: 'needsSignIn' };
        await expect(service.loadBoard('global')).resolves.toEqual({ kind: 'needsSignIn' });
    });

    it('sem rede, diz que está sem rede', async () => {
        const { gc, service } = montar();
        gc.offline = true;
        await expect(service.loadBoard('global')).resolves.toEqual({ kind: 'offline' });
    });

    it('placar ainda não criado no App Store Connect é indisponível, não erro', async () => {
        const { gc, service } = montar();
        gc.loadPage = async () => { throw new LeagueError('leaderboard-not-found'); };
        await expect(service.loadBoard('global')).resolves.toEqual({ kind: 'unavailable', reason: 'leaderboard-not-found' });
    });

    it('semana sem participantes', async () => {
        const { service } = montar();
        await expect(service.loadBoard('global')).resolves.toMatchObject({ kind: 'empty' });
    });

    it('envia o XP pendente antes de ler, e destaca o aluno no topo', async () => {
        const { gc, service } = montar();
        gc.others = [{ alias: 'Ana', xp: 50 }, { alias: 'Bia', xp: 10 }];
        await service.recordXpEarned(30, QUINTA);

        const board = await service.loadBoard('global');

        expect(board).toMatchObject({ kind: 'ready', totalPlayers: 3, endsAt: gc.endsAt, neighbors: [] });
        if (board.kind !== 'ready') return;
        expect(board.top.map(e => [e.rank, e.alias, e.isLocalPlayer])).toEqual([[1, 'Ana', false], [2, 'Eu', true], [3, 'Bia', false]]);
    });

    it('aluno fora do topo: mostra o topo e a vizinhança dele, sem repetir ninguém', async () => {
        const { gc, service } = montar();
        gc.others = Array.from({ length: 30 }, (_, i) => ({ alias: `A${i + 1}`, xp: 1000 - i * 10 }));
        await service.recordXpEarned(785, QUINTA); // fica em 23º

        const board = await service.loadBoard('global');

        if (board.kind !== 'ready') throw new Error(board.kind);
        expect(board.top).toHaveLength(LEAGUE_TOP_SIZE);
        expect(board.local?.rank).toBe(23);
        expect(board.neighbors.map(e => e.rank)).toEqual([21, 22, 23, 24, 25]);
        expect(board.neighbors.find(e => e.isLocalPlayer)?.alias).toBe('Eu');
    });

    it('vizinhança logo abaixo do topo não repete o 10º', async () => {
        const { gc, service } = montar();
        gc.others = Array.from({ length: 20 }, (_, i) => ({ alias: `A${i + 1}`, xp: 1000 - i * 10 }));
        await service.recordXpEarned(895, QUINTA); // 12º

        const board = await service.loadBoard('global');
        if (board.kind !== 'ready') throw new Error(board.kind);
        expect(board.neighbors.map(e => e.rank)).toEqual([11, 12, 13, 14, 15]);
    });

    it('reinstalou no meio da semana: adota a pontuação do Game Center em vez de recomeçar do zero', async () => {
        const { gc, service } = montar();
        gc.best.set('atual', 70);
        await service.loadBoard('global');
        await service.recordXpEarned(5, QUINTA);
        await service.flush();
        expect(gc.submissions).toEqual([75]);
    });
});

describe('LeagueService — avisos na Estude', () => {
    it('resumo da semana na primeira abertura depois da virada, uma vez só', async () => {
        let agora = QUINTA;
        const { gc, service } = montar(() => agora);
        await service.checkNotice(); // marca a semana atual como vista

        agora = SEGUNDA_SEGUINTE;
        gc.week = 'seguinte';
        gc.previous = { local: { rank: 4, xp: 120, alias: 'Eu', isLocalPlayer: true }, entries: [], totalPlayers: 37, startsAt: null, endsAt: null };

        await expect(service.checkNotice()).resolves.toEqual({ kind: 'summary', rank: 4, totalPlayers: 37, xp: 120 });
        await expect(service.checkNotice()).resolves.toBeNull();
    });

    it('quem não jogou a semana passada não recebe resumo', async () => {
        const { gc, service } = montar(() => SEGUNDA_SEGUINTE);
        gc.previous = { local: null, entries: [], totalPlayers: 12, startsAt: null, endsAt: null };
        await expect(service.checkNotice()).resolves.toBeNull();
    });

    it('alguém passou o aluno: avisa no máximo uma vez por dia', async () => {
        let agora = new Date('2026-11-12T12:00:00Z');
        const { gc, service } = montar(() => agora);
        gc.others = [{ alias: 'Ana', xp: 10 }];
        await service.recordXpEarned(50, agora);
        await service.flush();
        await service.checkNotice(); // 1º, registra a posição

        gc.others = [{ alias: 'Ana', xp: 60 }];
        await expect(service.checkNotice()).resolves.toEqual({ kind: 'overtaken', rank: 2 });

        gc.others = [{ alias: 'Ana', xp: 60 }, { alias: 'Bia', xp: 70 }];
        await expect(service.checkNotice()).resolves.toBeNull(); // mesmo dia

        agora = new Date('2026-11-13T12:00:00Z');
        gc.others = [{ alias: 'Ana', xp: 60 }, { alias: 'Bia', xp: 70 }, { alias: 'Caio', xp: 80 }];
        await expect(service.checkNotice()).resolves.toEqual({ kind: 'overtaken', rank: 4 });
    });

    it('sem Game Center ou sem rede, nenhum aviso e nenhum erro', async () => {
        const { gc, service } = montar();
        gc.offline = true;
        await expect(service.checkNotice()).resolves.toBeNull();
        gc.auth = { status: 'needsSignIn' };
        await expect(service.checkNotice()).resolves.toBeNull();
    });
});

describe('LeagueService.getStanding — o que a F6 pode perguntar', () => {
    it('posição, total, XP e fim da semana, sem pedir entrada', async () => {
        const { gc, service } = montar();
        gc.others = [{ alias: 'Ana', xp: 50 }];
        await service.recordXpEarned(30, QUINTA);
        await expect(service.getStanding()).resolves.toEqual({ rank: 2, totalPlayers: 2, xp: 30, endsAt: gc.endsAt });
    });

    it('sem jogador autenticado, null', async () => {
        const { gc, service } = montar();
        gc.auth = { status: 'needsSignIn' };
        await expect(service.getStanding()).resolves.toBeNull();
    });
});
