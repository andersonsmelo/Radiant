import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import type { HeartsSnapshot } from '../hearts.types';

type HeartsSheetProps = {
  visible: boolean;
  snapshot: HeartsSnapshot;
  dueReviewCount: number;
  storeAvailable: boolean;
  onClose: () => void;
  onReview: () => void;
  onSubscribe: () => void;
  nowMs?: number;
};

function waitCopy(snapshot: HeartsSnapshot, nowMs: number): string {
  if (snapshot.status === 'full') return 'Suas vidas estão cheias';
  if (snapshot.status === 'unlimited') return 'Suas vidas são ilimitadas';
  if (snapshot.nextRefillAt === null) return 'A próxima vida chegará em breve';

  const remainingMs = Math.max(0, Date.parse(snapshot.nextRefillAt) - nowMs);
  const minutes = Math.max(1, Math.ceil(remainingMs / 60_000));
  return `Próxima vida em ${minutes} min`;
}

export function HeartsSheet({
  visible,
  snapshot,
  dueReviewCount,
  storeAvailable,
  onClose,
  onReview,
  onSubscribe,
  nowMs = Date.now(),
}: HeartsSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar opções de vidas"
        />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} />
          <Text accessibilityRole="header" style={styles.title}>
            {snapshot.count === 0 ? 'Suas vidas acabaram' : 'Suas vidas'}
          </Text>
          <Text style={styles.body}>
            Você pode esperar, revisar algo que já estudou ou conhecer as vidas ilimitadas.
          </Text>

          <View style={styles.waitCard}>
            <Text style={styles.waitTitle}>Esperar</Text>
            <Text style={styles.waitText}>{waitCopy(snapshot, nowMs)}</Text>
          </View>

          {dueReviewCount > 0 ? (
            <AppButton label="Revisar agora" variant="secondary" onPress={onReview} />
          ) : null}

          {storeAvailable ? (
            <AppButton label="Ver assinatura" variant="galaxy" onPress={onSubscribe} />
          ) : (
            <Text style={styles.unavailable}>Assinatura indisponível neste aparelho.</Text>
          )}

          <AppButton label="Voltar" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(3, 3, 13, 0.72)',
  },
  sheet: {
    borderTopLeftRadius: radius.rLg,
    borderTopRightRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    backgroundColor: galaxyColors.backgroundAlt,
    padding: space.s3,
    paddingBottom: space.s4,
    gap: space.s2,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: galaxyColors.border,
  },
  title: { ...typography.h2, color: galaxyColors.textPrimary },
  body: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  waitCard: {
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    backgroundColor: galaxyColors.surface,
    padding: space.s2,
    gap: space.s1,
  },
  waitTitle: { ...typography.body, color: galaxyColors.textPrimary, fontWeight: '800' },
  waitText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  unavailable: { ...typography.caption, color: galaxyColors.textSecondary, textAlign: 'center' },
});
