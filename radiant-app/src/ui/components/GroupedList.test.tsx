import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { GroupedList } from './GroupedList';

it('reúne linhas numa superfície raio12 com divisórias internas, preservando controles acessíveis', () => {
  const toggle = jest.fn();
  const view = render(<GroupedList header="Durante a aula" footer="O modo silencioso também desliga os sons.">
    <Text>Sons</Text><Switch accessibilityLabel="Vibração" value={false} onValueChange={toggle} />
  </GroupedList>);
  const surfaces = view.UNSAFE_getAllByType(View).filter(node => StyleSheet.flatten(node.props.style)?.backgroundColor);
  expect(surfaces).toHaveLength(1);
  expect(StyleSheet.flatten(surfaces[0].props.style)).toMatchObject({ borderRadius: 12 });
  const borders = view.UNSAFE_getAllByType(View).map(node => StyleSheet.flatten(node.props.style)).filter(style => style?.borderTopWidth);
  expect(borders).toHaveLength(1);
  expect(screen.getByRole('header', { name: 'Durante a aula' })).toBeTruthy();
  fireEvent(screen.getByRole('switch', { name: 'Vibração' }), 'valueChange', true);
  expect(toggle).toHaveBeenCalledWith(true);
  for (const text of view.UNSAFE_getAllByType(Text)) {
    expect(StyleSheet.flatten(text.props.style)?.textTransform).not.toBe('uppercase');
    expect(text.props.maxFontSizeMultiplier).toBeUndefined(); expect(text.props.numberOfLines).toBeUndefined();
  }
});
it('cabeçalho/rodapé opcionais não acrescentam texto vazio ou borda de cartão por linha', () => {
  const view = render(<GroupedList><Text>Uma linha</Text></GroupedList>);
  expect(screen.queryByRole('header')).toBeNull();
  expect(screen.getAllByText('Uma linha')).toHaveLength(1);
  expect(view.UNSAFE_getAllByType(View).some(node => StyleSheet.flatten(node.props.style)?.borderWidth)).toBe(false);
});
