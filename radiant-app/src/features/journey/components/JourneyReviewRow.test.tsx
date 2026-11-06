import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { JourneyReviewRow } from './JourneyReviewRow';

describe('JourneyReviewRow', () => {
  it('some quando não há revisão devida', () => {
    const { toJSON } = render(<JourneyReviewRow dueCount={0} onPress={jest.fn()} />);

    expect(toJSON()).toBeNull();
  });

  it('diz "1 item para revisar" no singular', () => {
    render(<JourneyReviewRow dueCount={1} onPress={jest.fn()} />);

    expect(screen.getByText('1 item para revisar')).toBeTruthy();
    expect(screen.getByText('Revisar')).toBeTruthy();
  });

  it('diz "N itens para revisar" no plural', () => {
    render(<JourneyReviewRow dueCount={2} onPress={jest.fn()} />);

    expect(screen.getByText('2 itens para revisar')).toBeTruthy();
  });

  it('é um botão só, com a contagem e a ação no rótulo', () => {
    render(<JourneyReviewRow dueCount={2} onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: '2 itens para revisar. Revisar.' })).toBeTruthy();
  });

  it('escreve "Revisar" em frase, sem caixa alta', () => {
    render(<JourneyReviewRow dueCount={2} onPress={jest.fn()} />);
    const action = StyleSheet.flatten(screen.getByText('Revisar').props.style);

    expect(action.textTransform).toBe('none');
    expect(action.letterSpacing).toBe(0);
  });

  it('abre a revisão ao tocar na linha', () => {
    const onPress = jest.fn();
    render(<JourneyReviewRow dueCount={2} onPress={onPress} />);

    fireEvent.press(screen.getByText('Revisar'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
