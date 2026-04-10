import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import { PixelIllustration } from '../../ui/characters/PixelIllustration';
import type { CharacterSize, CharacterState, CharacterTier } from '../../ui/characters/types';
import { space, typography } from '../../ui/styles';
import { colors } from '../../ui/theme';
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

  return (
    <View style={[styles.topRow, isCompact && styles.topRowCompact, style]}>
      <View style={[styles.characterColumn, isCompact && styles.characterColumnCompact]}>
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
          label={ringLabel}
          size={isCompact ? compactRingSize : ringSize}
        />
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
  characterColumnCompact: {
    width: 124,
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
});
