import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { SpeechBubble } from '../../../components/ui/SpeechBubble';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

const LESSON_VISUAL = require('../assets/lesson-xray-panel.png');

interface LessonVisualPanelProps {
  hint: string;
  caption?: string;
}

export function LessonVisualPanel({ hint, caption }: LessonVisualPanelProps) {
  return (
    <SurfaceCard variant="elevated" style={styles.card}>
      <View style={styles.imageFrame}>
        <Image source={LESSON_VISUAL} contentFit="cover" style={styles.image} />
        <View style={styles.hotspot}>
          <MaterialIcons name="search" size={30} color="#FFFFFF" />
        </View>
        <Text style={styles.hotspotLabel}>Tap to inspect</Text>
      </View>

      <SpeechBubble text={hint} style={styles.hintBubble} />
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space.s3,
  },
  imageFrame: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 280,
    backgroundColor: colors.surfaceStrong,
  },
  image: {
    width: '100%',
    height: 280,
  },
  hotspot: {
    position: 'absolute',
    top: 44,
    left: 44,
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: 'rgba(89, 222, 255, 0.28)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotLabel: {
    position: 'absolute',
    top: 138,
    left: 34,
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  hintBubble: {
    marginHorizontal: space.s1,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: space.s1,
  },
});
