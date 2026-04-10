import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors } from '../../ui/theme';
import { radius, space, typography } from '../../ui/styles';

interface SpeechBubbleProps {
  text: string;
  align?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function SpeechBubble({ text, align = 'left', style, textStyle }: SpeechBubbleProps) {
  return (
    <View style={[styles.wrapper, align === 'right' && styles.wrapperRight, style]}>
      <View style={[styles.bubble, align === 'right' && styles.bubbleRight]}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
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
    backgroundColor: colors.surfaceGlass,
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  text: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    fontWeight: '600',
  },
  tail: {
    position: 'absolute',
    bottom: 10,
    width: 18,
    height: 18,
    backgroundColor: colors.surfaceGlass,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '45deg' }],
  },
  tailLeft: {
    left: 10,
  },
  tailRight: {
    right: 10,
  },
});
