import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import LeagueScreen from './LeagueScreen';
import { LeagueService, type LeagueBoard } from '../LeagueService';
import type { LeagueEntry } from '../league.types';

jest.mock('expo-router', () => ({
    router: { back: jest.fn() },
    useFocusEffect: (callback: () => void | (() => void)) => {
        const React = require('react');
        React.useEffect(() => callback(), [callback]);
    },
}));
jest.mock('../../../../components/ui/icon-symbol', () => ({ IconSymbol: () => null }));
jest.mock('../../../ui/components/StarfieldBackground', () => ({ StarfieldBackground: () => null }));
jest.mock('../LeagueService', () => ({
    LeagueService: {
        loadBoard: jest.fn(),
        presentSignIn: jest.fn(),
        onAuthenticationChanged: jest.fn(() => () => undefined),
    },
}));

const loadBoard = LeagueService.loadBoard as jest.Mock;
const presentSignIn = LeagueService.presentSignIn as jest.Mock;

const entry = (rank: number, alias: string, xp: number, isLocalPlayer = false): LeagueEntry => ({ rank, alias, xp, isLocalPlayer });
const mostrar = (board: LeagueBoard) => { loadBoard.mockResolvedValue(board); render(<LeagueScreen />); };

// Tira a estreia da árvore (~500 ms) da janela dos `findBy*` (AGENTS.md, lição da PR #18).
beforeAll(() => {
    loadBoard.mockReturnValue(new Promise(() => undefined));
    render(<LeagueScreen />).unmount();
});

beforeEach(() => { loadBoard.mockReset(); presentSignIn.mockReset(); });

describe('LeagueScreen — cada estado com texto próprio', () => {
    it('carregando', () => {
        loadBoard.mockReturnValue(new Promise(() => undefined));
        render(<LeagueScreen />);
        expect(screen.getByText('Carregando a liga…')).toBeTruthy();
        expect(screen.getByLabelText('Carregando a liga')).toBeTruthy();
    });

    it('sem Game Center, com entrada oferecida: convite e botão para entrar', async () => {
        mostrar({ kind: 'needsSignIn' });
        expect(await screen.findByRole('header', { name: 'Entre no Game Center para participar' })).toBeTruthy();
        presentSignIn.mockResolvedValue(true);
        fireEvent.press(screen.getByLabelText('Entrar no Game Center'));
        expect(presentSignIn).toHaveBeenCalledTimes(1);
    });

    it('sem Game Center e sem tela de entrada: explica o caminho pelos Ajustes', async () => {
        mostrar({ kind: 'needsSignIn' });
        presentSignIn.mockResolvedValue(false);
        fireEvent.press(await screen.findByLabelText('Entrar no Game Center'));
        expect(await screen.findByText(/abra Ajustes, toque em Game Center/)).toBeTruthy();
        expect(screen.getByLabelText('Tentar de novo')).toBeTruthy();
    });

    it('jogador recusou o Game Center: mesmo convite, caminho pelos Ajustes', async () => {
        mostrar({ kind: 'unavailable', reason: 'not-authenticated' });
        expect(await screen.findByRole('header', { name: 'Entre no Game Center para participar' })).toBeTruthy();
        expect(screen.getByText(/abra Ajustes, toque em Game Center/)).toBeTruthy();
    });

    it('Game Center indisponível (Android, binário sem módulo)', async () => {
        mostrar({ kind: 'unavailable', reason: 'unavailable' });
        expect(await screen.findByRole('header', { name: 'Game Center indisponível' })).toBeTruthy();
    });

    it('placar ainda não criado', async () => {
        mostrar({ kind: 'unavailable', reason: 'leaderboard-not-found' });
        expect(await screen.findByRole('header', { name: 'A liga ainda não abriu' })).toBeTruthy();
    });

    it('sem rede, com nova tentativa', async () => {
        mostrar({ kind: 'offline' });
        expect(await screen.findByRole('header', { name: 'Sem conexão' })).toBeTruthy();
        loadBoard.mockResolvedValue({ kind: 'empty', endsAt: null });
        fireEvent.press(screen.getByLabelText('Tentar de novo'));
        expect(await screen.findByRole('header', { name: 'Ninguém pontuou nesta semana ainda' })).toBeTruthy();
    });

    it('semana sem participantes', async () => {
        mostrar({ kind: 'empty', endsAt: null });
        expect(await screen.findByRole('header', { name: 'Ninguém pontuou nesta semana ainda' })).toBeTruthy();
    });

    it('amigos sem pontos têm texto próprio', async () => {
        mostrar({ kind: 'empty', endsAt: null });
        await screen.findByRole('header', { name: 'Ninguém pontuou nesta semana ainda' });
        fireEvent.press(screen.getByRole('tab', { name: 'Amigos' }));
        expect(await screen.findByRole('header', { name: 'Nenhum amigo pontuou nesta semana' })).toBeTruthy();
        expect(loadBoard).toHaveBeenLastCalledWith('friends');
    });

    it('lista com o aluno destacado, lida em ordem, num rótulo só por linha, sem depender de cor', async () => {
        mostrar({ kind: 'ready', top: [entry(1, 'Ana', 120), entry(2, 'Raio-X', 80, true), entry(3, 'Bia', 40)],
            neighbors: [], local: entry(2, 'Raio-X', 80, true), totalPlayers: 3, endsAt: null });

        const rows = await screen.findAllByLabelText(/º lugar/);
        expect(rows.map(row => row.props.accessibilityLabel)).toEqual([
            '1º lugar, Ana, 120 XP', '2º lugar, você, 80 XP', '3º lugar, Bia, 40 XP',
        ]);
        expect(screen.getByText('Você (Raio-X)')).toBeTruthy();
        expect(screen.getByText('3 participantes nesta semana.')).toBeTruthy();
        expect(screen.queryByLabelText('Posições intermediárias omitidas')).toBeNull();
    });

    it('aluno fora do topo: topo, separador e a vizinhança dele', async () => {
        const top = Array.from({ length: 10 }, (_, i) => entry(i + 1, `A${i + 1}`, 1000 - i));
        const neighbors = [entry(21, 'B', 50), entry(22, 'C', 49), entry(23, 'Eu', 48, true), entry(24, 'D', 47), entry(25, 'E', 46)];
        mostrar({ kind: 'ready', top, neighbors, local: neighbors[2], totalPlayers: 40, endsAt: null });

        const rows = await screen.findAllByLabelText(/º lugar/);
        expect(rows).toHaveLength(15);
        expect(rows[9].props.accessibilityLabel).toBe('10º lugar, A10, 991 XP');
        expect(rows[10].props.accessibilityLabel).toBe('21º lugar, B, 50 XP');
        expect(screen.getByLabelText('Posições intermediárias omitidas')).toBeTruthy();
        expect(screen.getByTestId('league-row-local').props.accessibilityLabel).toBe('23º lugar, você, 48 XP');
    });

    it('mostra quanto falta para a semana acabar quando o Game Center informa', async () => {
        const fim = new Date(Date.now() + (2 * 24 + 3) * 3600 * 1000 + 60_000).toISOString();
        mostrar({ kind: 'empty', endsAt: fim });
        expect(await screen.findByText(/^Termina em 2 dias e 3 h\./)).toBeTruthy();
    });
});
