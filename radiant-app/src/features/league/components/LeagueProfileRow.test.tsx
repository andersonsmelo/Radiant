import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { LeagueProfileRow } from './LeagueProfileRow';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('LeagueProfileRow — entrada da liga no Perfil', () => {
  it('é uma linha de 44 pt ou mais, com o valor à direita, com rótulo próprio, que leva à liga', () => {
    const onPress = jest.fn();
    render(<LeagueProfileRow enabled onPress={onPress} />);
    const row = screen.getByRole('button', { name: 'Liga da semana. Ver sua posição.' });
    expect(StyleSheet.flatten(row.props.style).minHeight).toBeGreaterThanOrEqual(44);
    expect(screen.getByText('Ver posição', { includeHiddenElements: true })).toBeTruthy();
    fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
