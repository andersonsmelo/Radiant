import { LEGAL_LINKS } from './legal';

describe('LEGAL_LINKS', () => {
  it('keeps the approved public HTTPS destinations', () => {
    expect(LEGAL_LINKS.privacy.href).toBe(
      'https://saudediagnostica.com/radiant/privacidade/',
    );
    expect(LEGAL_LINKS.support.href).toBe(
      'https://saudediagnostica.com/radiant/suporte/',
    );

    for (const link of Object.values(LEGAL_LINKS)) {
      expect(new URL(link.href).protocol).toBe('https:');
    }
  });
});
