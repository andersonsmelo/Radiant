import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileIdentityHeader } from './ProfileIdentityHeader';
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

it('mostra a identidade local sem duplicar contador/XP e abre Ajustes', () => {
  const onOpenSettings = jest.fn();
  render(<ProfileIdentityHeader email={null} onOpenSettings={onOpenSettings} />);
  expect(screen.getByText('Estudante')).toBeTruthy();
  expect(screen.getByText('Estudo local, sem conta')).toBeTruthy();
  expect(screen.queryByText('SEQUÊNCIA')).toBeNull();
  expect(screen.queryByText('XP TOTAL')).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Ajustes' }));
  expect(onOpenSettings).toHaveBeenCalledTimes(1);
});
it('identidade recebida não vira mascote e não desenha engrenagem inerte', () => {
  render(<ProfileIdentityHeader email="ana@example.test" />);
  expect(screen.getByText('ana')).toBeTruthy();
  expect(screen.getByText('ana@example.test')).toBeTruthy();
  expect(screen.queryByRole('button')).toBeNull();
});

it('texto máximo põe a identidade inteira abaixo do avatar e da engrenagem, sem cortar nome', () => {
  const Native = require('react-native');
  const dimensions = jest.spyOn(Native, 'useWindowDimensions').mockReturnValue({ width: 320, height: 800, scale: 2, fontScale: 3.1 });
  const result = render(<ProfileIdentityHeader email={null} onOpenSettings={jest.fn()} />);
  expect(Native.StyleSheet.flatten(screen.getByTestId('profile-identity-text').props.style).flex).toBe(0);
  for (const text of result.UNSAFE_getAllByType(Native.Text)) {
    expect(text.props.numberOfLines).toBeUndefined();
    expect(text.props.maxFontSizeMultiplier).toBeUndefined();
  }
  dimensions.mockRestore();
});
