import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SummaryHero, useFixedFooter } from './SummaryHero';
import { space } from '../../../ui/styles';

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

  it('o rodapé fixo deixa à rolagem só space.s3 e leva o inset de baixo no próprio respiro', () => {
    let footer: ReturnType<typeof useFixedFooter> | undefined;
    const Probe = () => { footer = useFixedFooter(); return null; };
    render(<Probe />);
    expect(footer?.scrollPaddingBottom).toBe(space.s3);
    // Sem provider de área segura o inset é 0.
    expect(footer?.footerStyle).toEqual({ paddingBottom: space.s3 });
  });
});
