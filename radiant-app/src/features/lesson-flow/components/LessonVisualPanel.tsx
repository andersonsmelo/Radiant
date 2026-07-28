import React from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { SpeechBubble } from '../../../components/ui/SpeechBubble';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

const LESSON_VISUAL = require('../assets/lesson-xray-panel.png');

interface LessonVisualPanelProps {
  hint: string;
  caption?: string;
}

export function LessonVisualPanel({ hint, caption }: LessonVisualPanelProps) {
  return (
    // TODO(tema): usar variant="galaxy" quando SurfaceCard ganhar a variante;
    // até lá a superfície galaxy é sobrescrita em styles.card.
    <SurfaceCard variant="solid" style={styles.card}>
      <View style={styles.imageFrame}>
        <Image
          source={LESSON_VISUAL}
          contentFit="cover"
          style={styles.image}
          accessible
          accessibilityRole="image"
          accessibilityLabel="Ilustração de um painel de raio-X para examinar"
        />
        <View style={styles.hotspot}>
          <DecorativeIcon name="search" size={30} color="#FFFFFF" />
        </View>
        <Text style={styles.hotspotLabel}>Toque para examinar</Text>
      </View>

      <SpeechBubble text={hint} style={styles.hintBubble} />
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space.s3,
    backgroundColor: galaxyColors.surface,
    borderColor: galaxyColors.border,
  },
  imageFrame: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 180,
    backgroundColor: galaxyColors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: 180,
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
    color: galaxyColors.textSecondary,
    textAlign: 'center',
    marginHorizontal: space.s1,
  },
});
