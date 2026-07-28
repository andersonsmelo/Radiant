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
// FLOATING TAB BAR CLEARANCE
// ============================================================================
// The tab bar in src/app/(tabs)/_layout.tsx is absolutely positioned, so it
// floats over scroll content instead of insetting it. Scrollable tab screens
// must reserve this much bottom padding, otherwise their last element renders
// underneath the bar and can never be fully seen or tapped.
export const tabBar = {
    height: 72,
    bottomOffset: 14,
};

export const tabBarClearance = tabBar.height + tabBar.bottomOffset + space.s3;

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
// TYPOGRAPHY STYLES — escala única do produto
// ============================================================================
// Sora é a fonte da marca e é carregada em src/app/_layout.tsx. Antes destes
// tokens ela quase não aparecia: as telas consomem `typography` (100 usos) e
// só `textStyles` (13 usos) declarava fontFamily. Uma escala só, com a família
// declarada por papel, faz a marca aparecer em todo o app.
//
// `fontWeight` continua declarado porque alguns consumidores o sobrescrevem;
// no iOS a família nomeada prevalece, então o corte correto é preservado.
// Cores continuam por tela.
export const typography = StyleSheet.create({
    h1: {
        fontFamily: 'Sora-ExtraBold',
        fontSize: 40,
        lineHeight: 46,
        letterSpacing: -1,
        fontWeight: '800',
    },
    h2: {
        fontFamily: 'Sora-ExtraBold',
        fontSize: 32,
        lineHeight: 38,
        letterSpacing: -0.6,
        fontWeight: '800',
    },
    h3: {
        fontFamily: 'Sora-Bold',
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: -0.4,
        fontWeight: '700',
    },
    body: {
        fontFamily: 'Sora-SemiBold',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    bodyStrong: {
        fontFamily: 'Sora-Bold',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '700',
    },
    bodyRegular: {
        fontFamily: 'Sora-Regular',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    caption: {
        fontFamily: 'Sora-SemiBold',
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: 0.1,
        fontWeight: '600',
    },
    micro: {
        fontFamily: 'Sora-SemiBold',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600',
    },
    // Rótulo em caixa alta: tracking aberto porque maiúsculas encostam no
    // espaçamento padrão.
    label: {
        fontFamily: 'Sora-Bold',
        fontSize: 11,
        lineHeight: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: '700',
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
// TEXT STYLE TOKENS (compatibilidade)
// ============================================================================
// `textStyles` existia como uma SEGUNDA escala, com tamanhos próprios (h2 28 vs
// 32, body 15 vs 16, micro 11 vs 12). Duas escalas concorrentes produzem
// hierarquia embaçada, então os papéis agora derivam de `typography` — há uma
// escala só. Preferir `typography` em código novo.
export const textStyles = {
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  body: typography.bodyRegular,
  bodyStrong: typography.bodyStrong,
  caption: typography.caption,
  micro: typography.label,
  label: typography.label,
};
