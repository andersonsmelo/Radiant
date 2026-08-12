import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { galaxyColors } from '../../ui/theme';
import { radius, space, typography } from '../../ui/styles';

interface SpeechBubbleProps {
  text: string;
  align?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * O balão do Pixel usava vidro branco (`colors.surfaceGlass`) e texto escuro —
 * e aparece em todo `PixelHeroSplit`, ou seja, em Journey, Quiz, Reward,
 * Checkpoint e Review. Era a maior superfície clara sobrevivente dentro do
 * app galaxy.
 */
export function SpeechBubble({ text, align = 'left', style, textStyle, testID }: SpeechBubbleProps) {
  return (
    <View style={[styles.wrapper, align === 'right' && styles.wrapperRight, style]}>
      <View style={[styles.bubble, align === 'right' && styles.bubbleRight]}>
        <Text testID={testID} style={[styles.text, textStyle]}>{text}</Text>
      </View>
      <View style={[styles.tail, align === 'right' ? styles.tailRight : styles.tailLeft]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  wrapperRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    backgroundColor: galaxyColors.galaxySurface2,
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    borderWidth: 1,
    borderColor: galaxyColors.borderActive,
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  text: {
    ...typography.body,
    color: galaxyColors.textPrimary,
    lineHeight: 24,
  },
  tail: {
    position: 'absolute',
    bottom: 10,
    width: 18,
    height: 18,
    backgroundColor: galaxyColors.galaxySurface2,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: galaxyColors.borderActive,
    transform: [{ rotate: '45deg' }],
  },
  tailLeft: {
    left: 10,
  },
  tailRight: {
    right: 10,
  },
});
