import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeartIcon } from '../../../ui/components/HudIcons';
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
  return `A próxima volta em ${minutes} min.`;
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
  if (snapshot.status === 'unlimited') return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar opções de vidas"
        />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} />
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              {snapshot.count === 0 ? 'Sem vidas' : 'Suas vidas'}
            </Text>
            <View style={styles.hearts} accessible accessibilityLabel={`${snapshot.count} de 5 vidas`}>
              {[0, 1, 2, 3, 4].map(index => (
                <HeartIcon key={index} size={40} filled={index < snapshot.count} />
              ))}
            </View>
            <Text style={styles.body}>
              Você pode esperar, revisar algo que já estudou ou conhecer as vidas ilimitadas.
            </Text>

            <Text style={styles.waitText}>{waitCopy(snapshot, nowMs)}</Text>

            {dueReviewCount > 0 ? (
              <AppButton label="Revisar agora" variant="galaxy" onPress={onReview} />
            ) : null}

            {storeAvailable ? (
              <Pressable accessibilityRole="link" onPress={onSubscribe} style={styles.subscribe}>
                <Text style={styles.subscribeText}>Vidas ilimitadas</Text>
              </Pressable>
            ) : (
              <Text style={styles.unavailable}>Assinatura indisponível neste aparelho.</Text>
            )}

            <AppButton label="Voltar" variant={dueReviewCount > 0 ? 'ghost' : 'galaxy'} onPress={onClose} />
          </ScrollView>
        </View>
      </SafeAreaView>
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
    maxHeight: '100%',
    flexShrink: 1,
    paddingTop: space.s2,
  },
  scroll: { flexShrink: 1 },
  content: { padding: space.s3, paddingBottom: space.s4, gap: space.s2 },
  hearts: { flexDirection: 'row', justifyContent: 'center', gap: space.s1 },
  subscribe: { minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  subscribeText: { ...typography.body, color: galaxyColors.navBlue, textDecorationLine: 'underline', textAlign: 'center' },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: galaxyColors.border,
  },
  title: { ...typography.h2, color: galaxyColors.textPrimary },
  body: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  waitText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  unavailable: { ...typography.caption, color: galaxyColors.textSecondary, textAlign: 'center' },
});
