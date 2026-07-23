import { colors, galaxyColors } from './theme';

/**
 * Contextual color contracts for UI components.
 *
 * Primitive palettes remain in theme.ts. Components should consume this map so
 * the same role has a deliberate equivalent in the light and galaxy contexts.
 */
export const semanticColorTokenNames = [
  'surface',
  'surfaceElevated',
  'surfaceInverted',
  'textPrimary',
  'textSecondary',
  'textTertiary',
  'textOnAccent',
  'textCritical',
  'border',
  'borderFocus',
  'borderDisabled',
  'actionPrimary',
  'actionPrimaryPressed',
  'statusSuccess',
  'statusWarning',
  'statusError',
  'statusInformation',
  'reward',
] as const;

export type SemanticColorToken = (typeof semanticColorTokenNames)[number];
export type SemanticColorContext = Record<SemanticColorToken, string>;

export const semanticColors = {
  light: {
    surface: colors.background,
    surfaceElevated: colors.surface,
    surfaceInverted: colors.textPrimary,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    textTertiary: colors.textTertiary,
    textOnAccent: '#FFFFFF',
    textCritical: colors.critical,
    border: colors.border,
    borderFocus: colors.primary,
    borderDisabled: colors.disabled,
    actionPrimary: colors.primary,
    actionPrimaryPressed: colors.primaryStrong,
    statusSuccess: colors.success,
    statusWarning: colors.warning,
    statusError: colors.danger,
    statusInformation: colors.primary,
    reward: colors.warning,
  },
  galaxy: {
    surface: galaxyColors.background,
    surfaceElevated: galaxyColors.surface,
    surfaceInverted: galaxyColors.textPrimary,
    textPrimary: galaxyColors.textPrimary,
    textSecondary: galaxyColors.textSecondary,
    textTertiary: galaxyColors.textTertiary,
    textOnAccent: '#FFFFFF',
    textCritical: galaxyColors.critical,
    border: galaxyColors.border,
    borderFocus: galaxyColors.spine,
    borderDisabled: galaxyColors.disabled,
    actionPrimary: galaxyColors.ctaGradientStart,
    actionPrimaryPressed: galaxyColors.ctaPressed,
    statusSuccess: '#5DE3AE',
    statusWarning: galaxyColors.xpColor,
    statusError: galaxyColors.critical,
    statusInformation: '#3DCAE8',
    reward: galaxyColors.xpColor,
  },
} as const satisfies Record<'light' | 'galaxy', SemanticColorContext>;
