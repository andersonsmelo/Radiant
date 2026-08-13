import React from 'react';
import { DecorativeIcon, type DecorativeIconName } from '../../../components/ui/DecorativeIcon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningTrack } from '../../content/content.types';
import { galaxyColors, shadows } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

type MaterialIconName = DecorativeIconName;

type JourneyTrackState = 'active' | 'available';

type JourneyTrackCardProps = {
  track: LearningTrack;
  lessonCount: number;
  progressPercent: number;
  state: JourneyTrackState;
  onPress: (track: LearningTrack) => void;
};

function getTrackIcon(slug: string): MaterialIconName {
  if (slug.includes('torax')) {
    return 'air';
  }

  if (slug.includes('abdome')) {
    return 'center-focus-strong';
  }

  return 'auto-stories';
}

function getStateCopy(state: JourneyTrackState): string {
  // "Pronta" e "catálogo pronto" descreviam a disponibilidade do CONTEÚDO, e o
  // aluno lia como estado do PRÓPRIO progresso. O rótulo agora fala do que ele
  // fez, que é a única coisa que a barra ao lado mede.
  return state === 'active' ? 'Em andamento' : 'Não iniciada';
}

export function JourneyTrackCard({ track, lessonCount, progressPercent, state, onPress }: JourneyTrackCardProps) {
  const isActive = state === 'active';

  return (
    <Pressable
      testID={`journey-track-${track.slug}`}
      onPress={() => onPress(track)}
      accessibilityRole="button"
      accessibilityLabel={`${track.title}. ${lessonCount} lições. ${getStateCopy(state)}.${isActive ? ` ${progressPercent}% concluída.` : ''}`}
      accessibilityHint={isActive ? 'Mantém esta trilha selecionada e atualiza o mapa.' : 'Seleciona esta trilha e atualiza o mapa.'}
      accessibilityState={{ selected: isActive }}
      style={({ pressed }) => [
        styles.card,
        isActive && styles.cardActive,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconTile, isActive && styles.iconTileActive]}>
          <DecorativeIcon name={getTrackIcon(track.slug)} size={22} color={isActive ? '#FFFFFF' : galaxyColors.ctaGradientEnd} />
        </View>
        <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeReady]}>
          <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextReady]}>
            {getStateCopy(state)}
          </Text>
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{track.description}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>{lessonCount} lições</Text>
        <Text style={styles.meta}>{isActive ? `${progressPercent}%` : 'não iniciada'}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          testID={`journey-track-progress-${track.slug}`}
          style={[
            styles.progressFill,
            // A barra mede o progresso do aluno e nada mais. Antes ela recebia
            // 100% para toda trilha não-ativa — verde cheio sobre conteúdo nunca
            // aberto — e um piso de 8% que desenhava resto de barra ao lado do
            // rótulo "0%".
            { width: `${isActive ? progressPercent : 0}%` },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    minHeight: 188,
    borderRadius: radius.rXl,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    backgroundColor: galaxyColors.surface,
    padding: space.s3,
    gap: space.s3,
  },
  cardActive: {
    borderColor: galaxyColors.ctaGradientEnd,
    backgroundColor: galaxyColors.surfaceActive,
    ...shadows.card,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.rMd,
    backgroundColor: galaxyColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileActive: {
    backgroundColor: galaxyColors.ctaGradientEnd,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: space.s2,
    paddingVertical: space.s0,
  },
  badgeActive: {
    // Preenchimento translúcido, texto na cor cheia — o mesmo par de badgeReady.
    // Antes o fundo usava `galaxy.statusInformation`, o MESMO token do texto:
    // 1,00:1, uma pílula sólida sem glifo legível dentro.
    backgroundColor: 'rgba(61,202,232,0.16)',
  },
  badgeReady: {
    // Neutro, não verde de sucesso: o selo diz que a trilha existe, não que
    // ela foi concluída. Verde ao lado de uma barra vazia era a mesma afirmação
    // falsa por outro canal.
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badgeText: {
    ...typography.micro,
    fontWeight: '800',
  },
  badgeTextActive: {
    color: galaxy.statusInformation,
  },
  badgeTextReady: {
    color: galaxyColors.textSecondary,
  },
  copy: {
    gap: space.s1,
  },
  title: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.s2,
  },
  meta: {
    ...typography.micro,
    color: galaxyColors.textTertiary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: galaxyColors.surfaceMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: galaxyColors.ctaGradientEnd,
  },
});
