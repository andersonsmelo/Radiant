import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SpeechBubble } from '../../components/ui/SpeechBubble';
import { space } from '../styles';
import { PixelIllustration } from './PixelIllustration';
import type { CharacterSlotProps } from './types';

export function CharacterSlot({
  state,
  size = 'md',
  visible = true,
  text,
  align = 'right',
  tier,
}: CharacterSlotProps) {
  if (!visible) {
    return null;
  }

  const reverse = align === 'left';

  return (
    <View style={[styles.row, reverse && styles.rowReverse, align === 'center' && styles.rowCenter]}>
      <PixelIllustration state={state} size={size} tier={tier} accessibilityLabel={`Mascote Pixel em estado ${state}`} />
      {text ? <SpeechBubble text={text} align={reverse ? 'right' : 'left'} style={styles.bubble} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  rowCenter: {
    justifyContent: 'center',
  },
  bubble: {
    flexShrink: 1,
    maxWidth: 220,
  },
});
