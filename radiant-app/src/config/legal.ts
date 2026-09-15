export const LEGAL_LINKS = {
  privacy: {
    label: 'Política de Privacidade',
    description: 'Saiba como seus dados são tratados.',
    accessibilityHint: 'Abre a política de privacidade no navegador interno.',
    href: 'https://saudediagnostica.com/radiant/privacidade/',
  },
  support: {
    label: 'Central de Suporte',
    description: 'Encontre ajuda e canais de atendimento.',
    accessibilityHint: 'Abre a central de suporte no navegador interno.',
    href: 'https://saudediagnostica.com/radiant/suporte/',
  },
  // Guideline 3.1.2 exige link de termos na tela de assinatura. Enquanto o
  // dono não publicar termos próprios, vale o contrato de licença padrão da
  // Apple para apps — é o que a App Review aceita como padrão.
  terms: {
    label: 'Termos de uso',
    description: 'Contrato de licença do aplicativo.',
    accessibilityHint: 'Abre os termos de uso no navegador interno.',
    href: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  },
} as const;
