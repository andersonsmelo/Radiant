import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { LEGAL_LINKS } from '../../../config/legal';
import { LegalLinksCard } from './LegalLinksCard';
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../../components/external-link', () => {
  const React = require('react');

  return {
    ExternalLink: ({
      children,
      href,
    }: {
      children: React.ReactElement<{ href?: string }>;
      href: string;
    }) => React.cloneElement(children, { href }),
  };
});

describe('LegalLinksCard', () => {
  it.each([
    ['Privacidade', LEGAL_LINKS.privacy.href],
    ['Central de Suporte', LEGAL_LINKS.support.href],
    ['Termos de uso', LEGAL_LINKS.terms.href],
  ])('renders %s as an accessible link to the approved destination', (label, href) => {
    render(<LegalLinksCard />);

    const link = screen.getByRole('link', { name: label });
    expect(link).toHaveProp('href', href);
    expect(link.props.accessibilityHint).toContain('navegador interno');
  });

  it('identifies the section', () => {
    render(<LegalLinksCard />);

    expect(screen.queryByText('↗')).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('renderiza a ação extra dentro do card', () => {
    render(<LegalLinksCard footer={<Text>Rever apresentação</Text>} />);

    expect(screen.getByText('Rever apresentação')).toBeTruthy();
  });
});
