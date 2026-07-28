import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import { PIXEL_SIZE_MAP, PixelIllustration } from '../../ui/characters/PixelIllustration';
import type { CharacterSize, CharacterState, CharacterTier } from '../../ui/characters/types';
import { space, typography } from '../../ui/styles';
import { colors, galaxyColors } from '../../ui/theme';
import { ProgressRing } from './ProgressRing';
import { SpeechBubble } from './SpeechBubble';

interface PixelHeroSplitProps {
  eyebrow: string;
  message: string;
  ringValue: number;
  ringTotal: number;
  ringLabel: string;
  state: CharacterState;
  tier: CharacterTier;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  bubbleStyle?: StyleProp<ViewStyle>;
  compactBreakpoint?: number;
  illustrationSize?: CharacterSize;
  compactIllustrationSize?: CharacterSize;
  ringSize?: number;
  compactRingSize?: number;
}

export function PixelHeroSplit({
  eyebrow,
  message,
  ringValue,
  ringTotal,
  ringLabel,
  state,
  tier,
  accessibilityLabel,
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
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <PixelIllustration
          state={state}
          size={isCompact ? compactIllustrationSize : illustrationSize}
          tier={tier}
          accessibilityLabel={accessibilityLabel}
        />
      </View>

      <View style={[styles.contentColumn, isCompact && styles.contentColumnCompact]}>
        <SpeechBubble text={message} style={[styles.bubble, isCompact && styles.bubbleCompact, bubbleStyle]} />
        <ProgressRing
          value={ringValue}
          total={ringTotal}
          size={isCompact ? compactRingSize : ringSize}
          accessibilityLabel={ringLabel}
        >
          {/* O anel existe para mostrar um número. A prop `label` era ignorada
              pelo componente, então todos os anéis do app apareciam vazios. */}
          <Text style={styles.ringValue}>{ringValue}</Text>
          <Text style={styles.ringTotal}>de {ringTotal}</Text>
        </ProgressRing>
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
  ringValue: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  ringTotal: {
    ...typography.micro,
    color: galaxyColors.textSecondary,
  },
});
