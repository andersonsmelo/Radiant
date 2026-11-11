import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { LevelBadge } from './LevelBadge';

describe('LevelBadge', () => {
  it('mostra o nível, o título e o progresso que saem do XP', () => {
    render(<LevelBadge xp={75} />);
    expect(screen.getByText('Nível 3')).toBeTruthy();
    expect(screen.getByText('Olhar atento')).toBeTruthy();
    const badge = screen.getByLabelText('Nível 3, Olhar atento. 15 de 60 XP para o próximo nível.');
    expect(badge.props.accessibilityValue).toEqual({ min: 0, max: 60, now: 15 });
    expect(screen.getByTestId('level-fill').props.style).toContainEqual({ width: '25%' });
  });

  it('sem XP lido não mostra nível nenhum', () => {
    render(<LevelBadge xp={null} />);
    expect(screen.queryByText(/Nível/)).toBeNull();
  });

  it('anuncia a subida uma vez por nível, e nunca na primeira leitura', () => {
    const feedback = { emit: jest.fn() };
    const view = render(<LevelBadge xp={null} feedback={feedback} />);
    // Primeira leitura já num nível alto: é o estado do aluno, não uma subida.
    view.rerender(<LevelBadge xp={500} feedback={feedback} />);
    view.rerender(<LevelBadge xp={510} feedback={feedback} />);
    expect(feedback.emit).not.toHaveBeenCalled();
    expect(screen.queryByText('Você subiu de nível')).toBeNull();

    view.rerender(<LevelBadge xp={600} feedback={feedback} />);
    expect(feedback.emit.mock.calls).toEqual([['level_up']]);
    expect(screen.getByText('Você subiu de nível')).toBeTruthy();

    // Releitura no mesmo nível e emissor novo não repetem o aviso.
    view.rerender(<LevelBadge xp={610} feedback={{ emit: feedback.emit }} />);
    expect(feedback.emit).toHaveBeenCalledTimes(1);
  });
});
