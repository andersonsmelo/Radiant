import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AppButton } from '../../../components/ui/AppButton';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import type { PaywallOffer } from '../PaywallService';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

type PaywallOfferCardProps = {
  offer: PaywallOffer;
  onPrimary: () => void;
  onDismiss: () => void;
  submitting?: boolean;
};

export function PaywallOfferCard({ offer, onPrimary, onDismiss, submitting = false }: PaywallOfferCardProps) {
  return (
    <SurfaceCard variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons name="workspace-premium" size={20} color={colors.primary} />
        <Text style={styles.eyebrow}>Radiant Plus</Text>
      </View>

      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.body}>
        {offer.description} Esta oferta só aparece depois de valor percebido e sem bloquear seu fluxo principal.
      </Text>

      <AppButton onPress={onPrimary} loading={submitting} style={styles.button}>
        {submitting ? 'Registrando interesse...' : 'Quero saber quando abrir'}
      </AppButton>

      <AppButton variant="secondary" onPress={onDismiss} disabled={submitting} style={styles.button}>
        Agora não
      </AppButton>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space.s2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s1,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  body: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
});
