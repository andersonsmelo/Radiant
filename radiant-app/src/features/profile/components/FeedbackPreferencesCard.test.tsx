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
