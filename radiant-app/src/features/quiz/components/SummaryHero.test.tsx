import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SummaryHero, ctaClearance, scrollClearance } from './SummaryHero';

jest.mock('../../../ui/characters/PixelIllustration', () => {
  const { Text: T } = require('react-native');
  return { PixelIllustration: ({ accessibilityLabel }: { accessibilityLabel: string }) => <T>{accessibilityLabel}</T> };
});

describe('SummaryHero', () => {
  it('mostra a medalha e, quando pedido, o Pixel ao lado', () => {
    render(<SummaryHero pixel={{ state: 'celebrate', expression: 'orgulhoso', accessibilityLabel: 'Pixel comemorando' }}><Text>medalha</Text></SummaryHero>);
    expect(screen.getByText('medalha')).toBeTruthy();
    expect(screen.getByText('Pixel comemorando')).toBeTruthy();
  });

  it('sem `pixel`, só a medalha', () => {
    render(<SummaryHero><Text>medalha</Text></SummaryHero>);
    expect(screen.getByText('medalha')).toBeTruthy();
    expect(screen.queryByText('Pixel comemorando')).toBeNull();
  });

  it('a folga da rolagem é a altura medida do rodapé, e a estimada de um botão antes da medida', () => {
    expect(scrollClearance(null)).toBe(ctaClearance);
    expect(scrollClearance(180)).toBe(180);
  });
});
