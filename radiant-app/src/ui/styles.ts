// src/ui/styles.ts
/**
 * Radiant CSS Referential Layer
 * Centralized styling constants for spacing, radii, typography, and layout
 * Note: Colors remain in individual screens or UI Kit components
 */

import { StyleSheet } from 'react-native';
import { colors, gradients, shadows } from './theme';
import { semanticColors } from './semantic-colors';

// ============================================================================
// SPACING CONSTANTS
// ============================================================================
export const space = {
    none: 0,
    s0: 4,   // XS
    s1: 8,   // SM
    s2: 12,  // MD
    s3: 16,  // LG
    s4: 20,  // XL
    s5: 24,  // 2XL
    s6: 32,  // 3XL
};

// ============================================================================
// BORDER RADIUS CONSTANTS
// ============================================================================
export const radius = {
    rSm: 8,   // Small elements
    rMd: 12,  // Buttons, cards
    rLg: 16,  // Large cards, containers
    rXl: 20,  // Extra large
};

// ============================================================================
// TYPOGRAPHY STYLES
// ============================================================================
// Font sizes and weights only - colors are set per screen
export const typography = StyleSheet.create({
    h1: {
        fontSize: 40,
        lineHeight: 46,
        fontWeight: '800',
    },
    h2: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: '800',
    },
    h3: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '700',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    bodyRegular: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    caption: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
    },
    micro: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600',
    },
});

// ============================================================================
// LAYOUT STYLES
// ============================================================================
export const layout = StyleSheet.create({
    // Full-screen base
    screen: {
        flex: 1,
        padding: space.s3,
    },

    // Max-width container for web + centered
    container: {
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
    },

    // Horizontal flex layout
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Horizontal with space-between
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    // Centered content
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Vertical stack with small gap (12px)
    stackSm: {
        gap: space.s2,
    },

    // Vertical stack with medium gap (24px)
    stackMd: {
        gap: space.s5,
    },
});

export { colors, gradients, semanticColors, shadows };

// ============================================================================
// FONT FAMILY TOKENS
// ============================================================================
export const fontFamily = {
  sora: 'Sora-Regular',
  soraMedium: 'Sora-Medium',
  soraSemiBold: 'Sora-SemiBold',
  soraBold: 'Sora-Bold',
  soraExtraBold: 'Sora-ExtraBold',
};

// ============================================================================
// TEXT STYLE TOKENS
// ============================================================================
export const textStyles = {
  h1: { fontFamily: 'Sora-ExtraBold', fontSize: 40, lineHeight: 46, letterSpacing: -1 } as const,
  h2: { fontFamily: 'Sora-ExtraBold', fontSize: 28, lineHeight: 34, letterSpacing: -0.6 } as const,
  h3: { fontFamily: 'Sora-Bold', fontSize: 22, lineHeight: 28, letterSpacing: -0.4 } as const,
  body: { fontFamily: 'Sora-Medium', fontSize: 15, lineHeight: 22 } as const,
  bodyStrong: { fontFamily: 'Sora-Bold', fontSize: 15, lineHeight: 22 } as const,
  caption: { fontFamily: 'Sora-SemiBold', fontSize: 13, lineHeight: 18, letterSpacing: 0.1 } as const,
  micro: { fontFamily: 'Sora-Bold', fontSize: 11, lineHeight: 14, letterSpacing: 1, textTransform: 'uppercase' } as const,
  label: { fontFamily: 'Sora-Bold', fontSize: 10, lineHeight: 14, letterSpacing: 1, textTransform: 'uppercase' } as const,
};
