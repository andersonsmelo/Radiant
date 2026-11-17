import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SummaryHero } from './SummaryHero';

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
});
