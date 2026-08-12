import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import { PIXEL_SIZE_MAP, PixelIllustration } from '../../ui/characters/PixelIllustration';
import type { CharacterSize, CharacterState, CharacterTier } from '../../ui/characters/types';
import { space, typography } from '../../ui/styles';
import { colors, galaxyColors } from '../../ui/theme';
import { ProgressRing } from './ProgressRing';
import { SpeechBubble } from './SpeechBubble';
import type { PixelExpression } from '../../ui/characters/pixelExpressions';

interface PixelHeroSplitProps {
  eyebrow: string;
  message?: string;
  ringValue: number;
  ringTotal: number;
  ringLabel: string;
  state: CharacterState;
  tier: CharacterTier;
  accessibilityLabel: string;
  expression?: PixelExpression;
  style?: StyleProp<ViewStyle>;
  bubbleStyle?: StyleProp<ViewStyle>;
  compactBreakpoint?: number;
  illustrationSize?: CharacterSize;
  compactIllustrationSize?: CharacterSize;
  ringSize?: number;
  compactRingSize?: number;
}

// A coluna do personagem tem largura fixa (ver `characterWidth` abaixo), então o
// eyebrow não tem para onde crescer: num ajuste de fonte grande do sistema ele
// passa a quebrar dentro da palavra. O teto vale SÓ para este rótulo, que é
// decorativo e repete informação disponível em outro lugar da tela — a mensagem
// do balão e o resto do app seguem acompanhando o ajuste por inteiro.
const ESCALA_MAXIMA_DO_EYEBROW = 1.5;

export function PixelHeroSplit({
  eyebrow,
  message,
  ringValue,
  ringTotal,
  ringLabel,
  state,
  tier,
  accessibilityLabel,
  expression,
  style,
  bubbleStyle,
  compactBreakpoint = 390,
  illustrationSize = 'lg',
  compactIllustrationSize = 'md',
  ringSize = 110,
  compactRingSize = 96,
}: PixelHeroSplitProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < compactBreakpoint;

  // A coluna do personagem é fixada na largura da própria ilustração. Sem isso
  // o eyebrow (caixa alta, com tracking) define a largura intrínseca da coluna,
  // rouba o espaço do irmão e o texto do balão quebra no meio da palavra.
  const characterWidth = PIXEL_SIZE_MAP[isCompact ? compactIllustrationSize : illustrationSize];

  return (
    <View style={[styles.topRow, isCompact && styles.topRowCompact, style]}>
      <View style={[styles.characterColumn, { width: characterWidth }]}>
        <Text style={styles.eyebrow} maxFontSizeMultiplier={ESCALA_MAXIMA_DO_EYEBROW}>
          {eyebrow}
        </Text>
        <PixelIllustration
          state={state}
          size={isCompact ? compactIllustrationSize : illustrationSize}
          tier={tier}
          accessibilityLabel={accessibilityLabel}
          expression={expression}
        />
      </View>

      <View style={[styles.contentColumn, isCompact && styles.contentColumnCompact]}>
        {message ? (
          <SpeechBubble
            text={message}
            testID="journey-hero-bubble"
            style={[styles.bubble, isCompact && styles.bubbleCompact, bubbleStyle]}
          />
        ) : null}
        <View style={styles.ringSection}>
          <Text style={styles.ringLabel}>{ringLabel}</Text>
          <ProgressRing
            value={ringValue}
            total={ringTotal}
            size={isCompact ? compactRingSize : ringSize}
            accessibilityLabel={ringLabel}
          >
            <Text style={styles.ringValue}>{ringValue}</Text>
            <Text style={styles.ringTotal}>de {ringTotal}</Text>
          </ProgressRing>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    gap: space.s3,
    alignItems: 'flex-start',
  },
  topRowCompact: {
    gap: space.s2,
  },
  characterColumn: {
    gap: space.s1,
    alignItems: 'flex-start',
  },
  contentColumn: {
    flex: 1,
    alignItems: 'flex-end',
    gap: space.s3,
  },
  contentColumnCompact: {
    gap: space.s2,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bubble: {
    width: '100%',
    minHeight: 104,
  },
  bubbleCompact: {
    minHeight: 88,
  },
  ringSection: {
    alignItems: 'center',
    gap: space.s1,
  },
  ringLabel: {
    ...typography.micro,
    color: galaxyColors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  ringValue: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  ringTotal: {
    ...typography.micro,
    color: galaxyColors.textSecondary,
  },
});
