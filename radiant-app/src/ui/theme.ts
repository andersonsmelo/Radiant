import { DefaultTheme, type Theme } from '@react-navigation/native';
import { Platform, type ViewStyle } from 'react-native';

export const colors = {
  background: '#F5FAFF',
  backgroundSecondary: '#EAF4FF',
  backgroundTint: '#DDF6FF',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F8FF',
  surfaceGlass: 'rgba(255, 255, 255, 0.82)',
  surfaceStrong: '#E8F2FF',
  borderSoft: 'rgba(57, 111, 219, 0.14)',
  borderStrong: '#7CB8FF',
  primary: '#2155FF',
  primaryStrong: '#1039BF',
  accent: '#3DCAE8',
  accentStrong: '#1FAFDD',
  highlight: '#A6EFFF',
  textPrimary: '#14233F',
  textSecondary: '#5B6B85',
  // 4.53:1 sobre background e 4.76:1 sobre surface. O valor anterior (#93A0B8)
  // reprovava WCAG AA em todos os contextos (2.51:1).
  textTertiary: '#64748B',
  // Vivos: usados como preenchimento (badges, dots, barras), nunca como texto.
  success: '#1A9C71',
  successSoft: '#E6FFF6',
  warning: '#D79022',
  warningSoft: '#FFF6DF',
  danger: '#D8506F',
  dangerSoft: '#FFF0F4',
  // Escuros: mesmos papéis quando o valor vira TEXTO sobre fundo claro.
  // Os vivos acima reprovam AA como texto (3.31 / 2.53 / 3.78).
  successText: '#137051',
  warningText: '#8F5A0B',
  dangerText: '#C13355',
  critical: '#B51D44',
  disabled: '#D6E0EE',
  shadow: 'rgba(45, 97, 188, 0.16)',
  shadowStrong: 'rgba(38, 87, 172, 0.26)',
  rail: '#D9E7FB',

  // New Layout extensions
  primary2: '#3D6BFF',
  accent2: '#6FE0F2',
  bg2: '#EAF2FF',
  border: '#E3ECF7',
  border2: '#D6E0EE',
  streak: '#FF6B2C',
} as const;

export const gradients = {
  hero: ['#FFFFFF', '#D8F6FF', '#7EDFFF'],
  primaryButton: ['#1B47FF', '#2F71FF'],
  cyanGlow: ['#C7F8FF', '#75DEFF'],
  journeyTrack: ['#3BC8E8', '#4A78FF'],
} as const;

export const shadows = {
  soft: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  } satisfies ViewStyle,
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  } satisfies ViewStyle,
  glow: {
    shadowColor: colors.highlight,
    shadowOpacity: Platform.select({ ios: 0.7, default: 0.4 }),
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  } satisfies ViewStyle,
} as const;

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surfaceGlass,
    text: colors.textPrimary,
    border: 'transparent',
    notification: colors.accentStrong,
  },
};

// ── Dark Galaxy Theme ────────────────────────────────────────────
// Tokens para o redesign galáctico (dark mode unificado)
export const galaxyColors = {
  // Paleta Medalhão (2026-10-21): grafite opaco no lugar do céu e das
  // superfícies translúcidas. Quem lia `surface` como transparência sobre o
  // céu passa a ler a cor final. Escala de superfícies, do fundo para cima:
  // #13151c, #171920, #1b1e27, #232733, #2a2e3a.
  background: '#13151c',
  backgroundAlt: '#171920',
  surface: '#1b1e27',
  surfaceMuted: '#2a2e3a',
  surfaceActive: '#232733',
  border: '#323747',
  borderActive: '#4a5166',
  textPrimary: '#eef0f6',
  // 7,15:1 sobre surface.
  textSecondary: '#a3aabb',
  // 5,68:1 sobre surface. O valor anterior (0.28) reprovava WCAG AA até para
  // texto grande (2.34:1).
  textTertiary: '#8f97a9',
  spine: '#2a2e3a',
  hudPill: '#232733',
  hudPillBorder: '#323747',
  heartFull: '#FF3B30',
  heartEmpty: 'rgba(255, 255, 255, 0.20)',
  xpColor: '#F5A623',
  // XP e sequência são moedas distintas e o HUD as mostra lado a lado. Com o
  // mesmo âmbar nas duas, a cor deixava de distinguir uma da outra.
  streakColor: '#FF6B2C',
  // Azul claro o bastante para sobreviver ao escuro: 7,11:1 sobre a barra,
  // contra 3,56:1 do `#2155FF`. Azul saturado é uma cor ESCURA — quase todo o
  // seu brilho vive no canal azul, que responde por 7,22% da luminância
  // percebida. Este é o azul de estado ativo, foco e seleção; o `#2155FF`
  // continua sendo superfície e CTA grande.
  //
  // Paleta Medalhão (2026-10-21): a aba ativa deixou de usar este azul e passou
  // a `textPrimary` (15,4:1; 2,77x de separação do inativo `#8a91a3`), então o
  // valor original voltou. O ícone da aba ativa vem de `medalColors.unit`.
  navBlue: '#4A9EFF',
  tabBarSurface: '#171920',
  // A prancheta dava `#6d7487`, 3,76:1 sobre a barra (reprova AA no rótulo de
  // 11px). Este rende 5,57:1.
  tabBarInactive: '#8a91a3',
  shadowHard: '#000000',
  nodeCompleted: '#171920',
  nodeLocked: '#1b1e27',
  // Verde do modo galaxy. O `colors.success` (#1A9C71) é da paleta clara e o
  // contrato de identidade proíbe usá-lo em `features` — além de ser escuro
  // demais para ler sobre o fundo galaxy. Este marca CONCLUÍDO, e existe
  // porque a trilha não tinha como distinguir feito de bloqueado: os dois
  // eram o mesmo cartão cinza, e a diferença vivia só numa palavra.
  nodeCompletedAccent: '#3DD68C',
  // Cinza do estado bloqueado. Substitui o `opacity: 0.5` que era aplicado ao
  // cartão inteiro — opacidade global derruba junto o contraste do texto, e o
  // contrato de contraste não vê isso porque calcula tokens, não runtime.
  nodeLockedAccent: 'rgba(255, 255, 255, 0.38)',
  ctaGradientStart: '#1535E8',
  ctaGradientEnd: '#3060FF',
  ctaPressed: '#1027B5',
  critical: '#FF8298',
  disabled: 'rgba(255, 255, 255, 0.20)',

  /**
   * Faixa de celebração do fim de lição. Vive na paleta ESCURA de propósito:
   * o contrato de identidade proíbe telas de importarem a paleta clara
   * `colors`, e a faixa precisa de cor clara sem reabrir aquela porta.
   * Nenhum texto de leitura é pintado sobre ela — só a arte do Pixel.
   */
  celebrationBand: '#F5C518',

  // Galaxy mode extended
  galaxyBg2: '#171920',
  galaxyBg3: '#1b1e27',
  galaxySurface2: '#232733',
  galaxyBorder2: '#3a4052',
  galaxyGlow: 'rgba(61,202,232,0.55)',
  galaxyCtaStart: '#1535E8',
  galaxyCtaEnd: '#3060FF',
} as const;

// ── Medalhão ─────────────────────────────────────────────────────
// Cada peça da trilha tem relevo: uma face e um lábio mais escuro por baixo.
// `inner` é o miolo, a área central da medalha. O desenho vive em Skia; as
// cores vivem aqui, nunca em arquivo de tela.
export const medalColors = {
  gold: { face: '#FFC21A', lip: '#C98A00', inner: '#F2AE00' },
  unit: { face: '#2F6BFF', lip: '#1846C9', inner: '#275CEB' },
  // `silhouette` é o contorno do ícone sobre a face bloqueada (1,3:1 ou mais).
  locked: { face: '#343947', lip: '#22252f', inner: '#2d313d', silhouette: '#4B5163' },
} as const;

// Tons dos ícones do HUD, desenhados em três tons como as peças do Medalhão
// (traçados da prancheta da trilha). O corpo da chama é `galaxyColors.streakColor`,
// que já existia; aqui vive o que é novo.
export const hudIconTones = {
  bolt: { face: '#FFC21A', light: '#FFE07A', shade: '#E59A00' },
  flame: { core: '#FFC21A' },
  heart: { face: '#FF4B4B', shade: '#D92F3A', highlight: '#FFB3B3' },
} as const;

// Números do HUD ao lado de cada ícone, nos tons da prancheta. Sobre a pílula
// (`hudPill`, `#232733`): 9,21, 6,38 e 5,37:1. `xpColor` e `streakColor`
// continuam como papéis de status e recompensa fora do HUD.
export const hudLabelTones = {
  xp: '#FFC21A',
  streak: '#FF8A4C',
  hearts: '#FF6B6B',
} as const;

// Retorno de acerto e erro. `onFill` é o texto escuro pintado SOBRE o
// preenchimento (8,1:1 e 7,12:1); o título usa o próprio `fill` sobre
// `surface` (8,14:1 e 7,07:1).
export const feedbackColors = {
  success: { fill: '#2BD67B', lip: '#1A9E58', surface: '#14281f', onFill: '#0b2a18' },
  error: { fill: '#FF8298', lip: '#C9566B', surface: '#2c1820', onFill: '#3a0d17' },
} as const;

// Profundidade em pontos: lábio de 5 no botão e de 8 na medalha.
export const depth = { lip: 5, medalLip: 8 } as const;

export const galaxyNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: galaxyColors.navBlue,
    background: galaxyColors.background,
    card: galaxyColors.backgroundAlt,
    text: galaxyColors.textPrimary,
    border: 'transparent',
    notification: '#3DCAE8',
  },
};
