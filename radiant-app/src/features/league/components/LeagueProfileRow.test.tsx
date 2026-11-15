import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { LeagueProfileRow } from './LeagueProfileRow';

describe('LeagueProfileRow — entrada da liga no Perfil', () => {
  it('é um botão de 44 pt com rótulo próprio, que leva à liga', () => {
    const onPress = jest.fn();
    render(<LeagueProfileRow enabled onPress={onPress} />);
    const row = screen.getByRole('button', { name: 'Liga da semana. Ver sua posição.' });
    expect(row.props.style).toMatchObject({ minHeight: 44 });
    fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
