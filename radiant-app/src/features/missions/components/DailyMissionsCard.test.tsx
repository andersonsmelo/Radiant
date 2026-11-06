import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { DailyMissionsCard } from './DailyMissionsCard';

describe('DailyMissionsCard', () => {
  it('conta as missões concluídas e abre as missões ao toque', () => {
    const onPress = jest.fn();
    render(<DailyMissionsCard missions={[{ done: true }, { done: false }, { done: false }]} onPress={onPress} />);
    expect(screen.getByText('1 de 3 concluídas')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Missões de hoje. 1 de 3 concluídas. Ver.'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('diz quando todas foram concluídas', () => {
    render(<DailyMissionsCard missions={[{ done: true }, { done: true }, { done: true }]} onPress={jest.fn()} />);
    expect(screen.getByLabelText('Missões de hoje. Todas concluídas. Ver.')).toBeTruthy();
  });

  it('não aparece antes da leitura nem sem missões', () => {
    const view = render(<DailyMissionsCard missions={null} onPress={jest.fn()} />);
    expect(screen.queryByText('Missões de hoje')).toBeNull();
    view.rerender(<DailyMissionsCard missions={[]} onPress={jest.fn()} />);
    expect(screen.queryByText('Missões de hoje')).toBeNull();
  });
});
