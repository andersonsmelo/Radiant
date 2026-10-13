import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { JourneyNode, NextNodeDecision } from '../../../types/journey';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type Props = {
  /** A tela entrega somente a recomendação elegível do snapshot existente. */
  node: JourneyNode | null;
  reason?: NextNodeDecision['reason'];
  futureReviewAtMs?: number;
  onOpen: () => void;
};

function recommendationCopy(node: JourneyNode, reason?: Props['reason']) {
  const resuming = node.status === 'resumable' || reason === 'paused-lesson';
  switch (node.type) {
    case 'review':
      return { state: resuming ? 'Continuar revisão' : 'Revisão disponível', action: resuming ? 'Retomar revisão' : 'Fazer revisão' };
    case 'checkpoint':
      return { state: resuming ? 'Continuar avaliação' : 'Avaliação disponível', action: resuming ? 'Retomar avaliação' : 'Fazer avaliação' };
    case 'reward':
      return { state: 'Conquista disponível', action: 'Receber conquista' };
    default:
      return { state: resuming ? 'Continuar de onde parou' : 'Próxima lição', action: resuming ? 'Retomar lição' : 'Continuar jornada' };
  }
}

/** Sem resolver ou efeitos: apresenta o nó e delega a abertura à tela. */
export function JourneyRecommendationCard({ node, reason, futureReviewAtMs, onOpen }: Props) {
  const copy = node ? recommendationCopy(node, reason) : null;
  const date = futureReviewAtMs !== undefined && Number.isFinite(futureReviewAtMs)
    ? new Date(futureReviewAtMs) : null;
  const reviewDate = date
    ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} às ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    : null;

  return (
    <View style={styles.card} testID="journey-recommendation-card">
      <View style={styles.heading}>
        <Text style={styles.state}>{copy?.state ?? 'Sua jornada'}</Text>
        <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
          <PixelIllustration size="sm" state="guide" />
        </View>
      </View>
      <Text style={styles.title} accessibilityRole="header">{node?.title ?? 'Nenhuma etapa disponível agora'}</Text>
      {node?.description ? <Text style={styles.description}>{node.description}</Text> : null}
      {node && copy ? (
        <View testID="journey-recommendation-action" collapsable={false}>
          <AppButton
            label={copy.action}
            variant="galaxy"
            onPress={onOpen}
            accessibilityLabel={copy.action}
            accessibilityHint="Abre o próximo passo elegível da trilha ativa."
          />
        </View>
      ) : <Text style={styles.description}>As etapas disponíveis aparecem nesta trilha.</Text>}
      {reviewDate ? <Text style={styles.description}>{`Próxima revisão em ${reviewDate}`}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: galaxyColors.backgroundAlt, borderColor: galaxyColors.borderActive, borderWidth: 1, borderRadius: radius.rLg, padding: space.s3, gap: space.s2 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2 },
  state: { ...typography.label, color: galaxyColors.textSecondary, flex: 1 },
  title: { ...typography.h3, color: galaxyColors.textPrimary },
  description: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
});
