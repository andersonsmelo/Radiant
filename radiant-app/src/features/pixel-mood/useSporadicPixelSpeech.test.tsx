import React from 'react';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PixelMood } from './PixelMood';
import { useSporadicPixelSpeech } from './useSporadicPixelSpeech';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const timing = { initialMinMs: 100, initialMaxMs: 100, visibleMs: 200, intervalMinMs: 300, intervalMaxMs: 300 } as const;
const fixedRandom = () => 0;

function Probe() {
  const speech = useSporadicPixelSpeech({ timing, random: fixedRandom });
  return <Text testID="speech">{speech?.phrase ?? 'silêncio'}</Text>;
}

describe('useSporadicPixelSpeech', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(PixelMood, 'resolveSporadic').mockResolvedValue({ expression: 'feliz', phrase: 'Olá', phraseIndex: 0 });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('aparece, some e agenda outra fala com um intervalo de silêncio', async () => {
    render(<Probe />);
    expect(screen.getByTestId('speech').props.children).toBe('silêncio');

    await act(async () => { jest.advanceTimersByTime(100); });
    expect(screen.getByTestId('speech').props.children).toBe('Olá');

    await act(async () => { jest.advanceTimersByTime(200); });
    expect(screen.getByTestId('speech').props.children).toBe('silêncio');

    await act(async () => { jest.advanceTimersByTime(300); });
    expect(PixelMood.resolveSporadic).toHaveBeenCalledTimes(2);
  });
});
