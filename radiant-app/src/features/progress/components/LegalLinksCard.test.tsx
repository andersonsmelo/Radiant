import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { LEGAL_LINKS } from '../../../config/legal';
import { LegalLinksCard } from './LegalLinksCard';

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
    ['Política de Privacidade', LEGAL_LINKS.privacy.href],
    ['Central de Suporte', LEGAL_LINKS.support.href],
  ])('renders %s as an accessible link to the approved destination', (label, href) => {
    render(<LegalLinksCard />);

    const link = screen.getByRole('link', { name: label });
    expect(link).toHaveProp('href', href);
    expect(link.props.accessibilityHint).toContain('navegador interno');
  });

  it('identifies the section', () => {
    render(<LegalLinksCard />);

    expect(screen.getByRole('header', { name: 'Ajuda e informações' })).toBeTruthy();
  });
});
