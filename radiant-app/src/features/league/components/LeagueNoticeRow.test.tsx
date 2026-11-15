import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { LeagueNoticeRow, noticeText } from './LeagueNoticeRow';
import { LeagueService } from '../LeagueService';

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    const state = jest.requireMock('expo-router');
    React.useEffect(() => {
      state.__focus = () => { callback(); };
      return callback();
    }, [callback, state]);
  },
}));
jest.mock('../LeagueService', () => ({ LeagueService: { checkNotice: jest.fn() } }));

const checkNotice = LeagueService.checkNotice as jest.Mock;

beforeEach(() => checkNotice.mockReset());

describe('LeagueNoticeRow — aviso da liga na Estude', () => {
  it('resumo da semana encerrada, sem culpa, levando à liga', async () => {
    checkNotice.mockResolvedValue({ kind: 'summary', rank: 4, totalPlayers: 37, xp: 120 });
    const onPress = jest.fn();
    render(<LeagueNoticeRow enabled onPress={onPress} />);
    const row = await screen.findByLabelText('Semana encerrada: você terminou em 4º de 37, com 120 XP. Ver liga.');
    fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('alguém passou o aluno', async () => {
    checkNotice.mockResolvedValue({ kind: 'overtaken', rank: 5 });
    render(<LeagueNoticeRow enabled onPress={jest.fn()} />);
    expect(await screen.findByText('Alguém passou você na liga. Agora você está em 5º.')).toBeTruthy();
  });

  it('sem aviso, não aparece', async () => {
    checkNotice.mockResolvedValue(null);
    render(<LeagueNoticeRow enabled onPress={jest.fn()} />);
    await Promise.resolve();
    expect(screen.queryByTestId('league-notice-row')).toBeNull();
  });

  it('aviso já mostrado sai quando a nova consulta não tem aviso', async () => {
    const state = jest.requireMock('expo-router');
    checkNotice.mockResolvedValueOnce({ kind: 'overtaken', rank: 5 }).mockResolvedValueOnce(null);
    render(<LeagueNoticeRow enabled onPress={jest.fn()} />);
    await screen.findByTestId('league-notice-row');
    await act(async () => { state.__focus(); });
    expect(screen.queryByTestId('league-notice-row')).toBeNull();
  });

  it('nenhum texto fala em perder, culpa ou sequência quebrada', () => {
    const textos = [noticeText({ kind: 'summary', rank: 9, totalPlayers: 10, xp: 5 }), noticeText({ kind: 'overtaken', rank: 9 })];
    for (const texto of textos) expect(texto).not.toMatch(/perd|culpa|vergonha|falh|abandon|!/i);
  });
});
