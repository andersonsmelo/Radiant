// Cores dos diagramas sobre o painel escuro do tocador de aulas. Os valores são
// cópia dos tokens de `ui/theme.ts`, que importa `react-native` e não pode ser
// carregado pelo verificador de conteúdo; `diagramRegistry.test.ts` confere
// cada cópia contra o token de origem e o contraste contra `bg`.
export const P = {
  /** galaxyColors.backgroundAlt: o fundo do quadro. */
  bg: '#171920',
  /** galaxyColors.surfaceMuted: massas sólidas (ânodo, lâminas). */
  fill: '#2a2e3a',
  /** galaxyColors.textPrimary: traço principal. */
  line: '#eef0f6',
  /** galaxyColors.textSecondary: traço de apoio. */
  muted: '#a3aabb',
  /** galaxyColors.navBlue: vidro, janela, receptor. */
  accent: '#4A9EFF',
  /** hudIconTones.bolt.face: o feixe útil de raios X. */
  beam: '#FFC21A',
  /** pixelColors.glow: os elétrons. */
  electron: '#5CF0FF',
} as const;
