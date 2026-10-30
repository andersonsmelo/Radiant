import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ListRow } from './ListRow';

describe('ListRow', () => {
  afterEach(() => jest.restoreAllMocks());
  it('agrupa título e detalhe numa linha estática com divisória, sem cartão', () => {
    render(<ListRow title="Aula de origem" detail="Revisado há 2 dias" leading={<Text>medalha</Text>} trailing={<Text>fim</Text>} />);
    const row = screen.getByRole('text', { name: 'Aula de origem. Revisado há 2 dias' });
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByText('medalha', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('fim', { includeHiddenElements: true })).toBeTruthy();
    const style = StyleSheet.flatten(row.props.style);
    expect(style.borderBottomWidth).toBeGreaterThan(0);
    expect(style.borderRadius ?? 0).toBe(0);
    expect(style.backgroundColor).toBeUndefined();
  });
  it('vira botão somente com ação, respeitando rótulo e alvo mínimo de 44 pt', () => {
    const onPress = jest.fn();
    render(<ListRow title="Aula" onPress={onPress} accessibilityLabel="Abrir aula" />);
    const row = screen.getByRole('button', { name: 'Abrir aula' });
    fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(StyleSheet.flatten(row.props.style).minHeight).toBeGreaterThanOrEqual(44);
  });
  it('monta com fonte máxima sem truncar texto, limitar escala ou fixar altura', () => {
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 3.1 });
    render(<ListRow title={'Uma aula de origem com título extenso '.repeat(4)} detail={'Revisado anteriormente '.repeat(4)} />);
    for (const text of screen.UNSAFE_getAllByType(Text)) {
      expect(text.props.numberOfLines).toBeUndefined();
      expect(text.props.allowFontScaling).not.toBe(false);
      expect(text.props.maxFontSizeMultiplier).toBeUndefined();
      expect(StyleSheet.flatten(text.props.style).lineHeight).toBeUndefined();
    }
    for (const view of screen.UNSAFE_getAllByType(View)) {
      const style = StyleSheet.flatten(view.props.style);
      expect(style?.height).toBeUndefined();
      expect(style?.flex).not.toBe(1);
    }
  });
});
