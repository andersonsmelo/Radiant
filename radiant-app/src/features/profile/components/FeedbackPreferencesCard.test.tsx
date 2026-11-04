import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FeedbackPreferencesCard } from './FeedbackPreferencesCard';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('cartão de sons e vibração', () => {
  it('mostra os dois interruptores ligados por padrão enquanto carrega', () => {
    render(<FeedbackPreferencesCard preferences={null} onChange={jest.fn()} />);
    expect(screen.getByLabelText('Sons').props.value).toBe(true);
    expect(screen.getByLabelText('Vibração').props.value).toBe(true);
  });

  it('desligar sons mantém a vibração como estava', () => {
    const onChange = jest.fn();
    render(<FeedbackPreferencesCard preferences={{ sounds: true, haptics: false }} onChange={onChange} />);
    fireEvent(screen.getByLabelText('Sons'), 'valueChange', false);
    expect(onChange).toHaveBeenCalledWith({ sounds: false, haptics: false });
  });
});

it('agrupa durante a aula sem caixa alta e não esconde os dois interruptores do leitor', () => {
  render(<FeedbackPreferencesCard preferences={{ sounds: false, haptics: true }} onChange={jest.fn()} />);
  expect(screen.getByRole('header', { name: 'Durante a aula' })).toBeTruthy();
  expect(screen.getAllByRole('switch')).toHaveLength(2);
  expect(screen.queryByText('LIÇÃO')).toBeNull();
});
it('dois callbacks antes do render preservam ambas as escolhas', () => {
  const change = jest.fn(); render(<FeedbackPreferencesCard preferences={{ sounds: true, haptics: true }} onChange={change} />);
  const sounds = screen.getByRole('switch', { name: 'Sons' }); const haptics = screen.getByRole('switch', { name: 'Vibração' });
  const { act } = require('@testing-library/react-native');
  act(() => { fireEvent(sounds, 'valueChange', false); fireEvent(haptics, 'valueChange', false); });
  expect(change).toHaveBeenLastCalledWith({ sounds: false, haptics: false });
});
it('aguarda leitura antes de gravar, sem transformar defaults visuais em escolha sobre a preferência desconhecida', () => {
  const change = jest.fn(); render(<FeedbackPreferencesCard preferences={null} onChange={change} />);
  const sounds = screen.getByRole('switch', { name: 'Sons' });
  expect(sounds.props.disabled).toBe(true);
  fireEvent(sounds, 'valueChange', false);
  expect(change).not.toHaveBeenCalled();
});
