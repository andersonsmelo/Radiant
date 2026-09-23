import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HybridLessonMetricsCard } from './HybridLessonMetricsCard';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('cartão de medidas do piloto', () => {
  it('lista a sessão com precisão, tempo, vidas, itens que voltaram e confusões', async () => {
    const repository = { list: jest.fn().mockResolvedValue([{
      finishedAt: '2026-09-23T10:00:00.000Z', outcome: 'abandoned', abandonedAtItemId: 'h07-sup-prof',
      summary: { xp: 10, accuracy: 0.75, durationMs: 185_000, bestStreak: 4, requeued: 2, heartsSpent: 2, misconceptions: { 'E-REL': 2 }, itemTimesMs: { a: 10_000, b: 20_000 } },
    }]) };
    render(<HybridLessonMetricsCard repository={repository} />);
    expect(await screen.findByText(/Abandonou em h07-sup-prof/)).toBeTruthy();
    expect(screen.getByText(/Precisão 75%/)).toBeTruthy();
    expect(screen.getByText(/Tempo 3:05/)).toBeTruthy();
    expect(screen.getByText(/Média por item 15 s/)).toBeTruthy();
    expect(screen.getByText(/E-REL × 2/)).toBeTruthy();
  });

  it('sem sessões, diz que não há medida ainda', async () => {
    render(<HybridLessonMetricsCard repository={{ list: jest.fn().mockResolvedValue([]) }} />);
    expect(await screen.findByText('Nenhuma sessão do piloto neste aparelho.')).toBeTruthy();
  });
});
