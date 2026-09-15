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

describe('LEGAL_LINKS.terms', () => {
  it('aponta para o contrato de licença padrão da Apple até o dono publicar termos próprios', () => {
    // A tela de assinatura precisa de um link de termos (Guideline 3.1.2). O
    // EULA padrão da Apple é o que vale quando o app não publica o seu.
    expect(LEGAL_LINKS.terms.label).toBe('Termos de uso');
    expect(LEGAL_LINKS.terms.href).toBe('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/');
  });
});
