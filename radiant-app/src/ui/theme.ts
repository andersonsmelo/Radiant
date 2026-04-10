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
  textSecondary: '#4C638B',
  textTertiary: '#7A90B4',
  success: '#1A9C71',
  successSoft: '#E6FFF6',
  warning: '#D79022',
  warningSoft: '#FFF6DF',
  danger: '#D8506F',
  dangerSoft: '#FFF0F4',
  shadow: 'rgba(45, 97, 188, 0.16)',
  shadowStrong: 'rgba(38, 87, 172, 0.26)',
  rail: '#D9E7FB',
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
  background: '#03030d',
  backgroundAlt: '#070718',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceMuted: 'rgba(255, 255, 255, 0.03)',
  surfaceActive: 'rgba(255, 255, 255, 0.09)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderActive: 'rgba(255, 255, 255, 0.22)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.55)',
  textTertiary: 'rgba(255, 255, 255, 0.28)',
  spine: 'rgba(255, 255, 255, 0.12)',
  hudPill: 'rgba(255, 255, 255, 0.07)',
  hudPillBorder: 'rgba(255, 255, 255, 0.10)',
  heartFull: '#FF3B30',
  heartEmpty: 'rgba(255, 255, 255, 0.20)',
  xpColor: '#F5A623',
  streakColor: '#F5A623',
  nodeCompleted: 'rgba(255, 255, 255, 0.03)',
  nodeLocked: 'rgba(255, 255, 255, 0.04)',
  ctaGradientStart: '#1535E8',
  ctaGradientEnd: '#3060FF',
} as const;

export const galaxyNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A9EFF',
    background: '#03030d',
    card: '#07071a',
    text: '#FFFFFF',
    border: 'transparent',
    notification: '#3DCAE8',
  },
};
