import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { AppConfig } from '../../../config';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { DECORATIONS } from '../catalog';
import type { DecorationsState } from '../DecorationsService';
import { availableIds } from '../unlocks';

/** Entrada das decorações no Perfil (F6). Desligada a flag, não monta. */
export function DecorationsProfileRow({ state }: { state: DecorationsState | null }): React.ReactElement | null {
  const { fontScale } = useWindowDimensions();
  if (!AppConfig.ENABLE_DECORATIONS) return null;
  const count = state ? availableIds(state.unlocked, state.subscriber).size : null;
  const detail = count === null ? 'Enfeites do seu perfil' : `${count} de ${DECORATIONS.length} disponíveis`;
  return <Pressable onPress={() => router.push('/decoracoes')} accessibilityRole="button" accessibilityLabel={`Decorações. ${detail}.`}
    style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
    <View style={styles.text}>
      <Text key={`title-${fontScale}`} style={styles.title}>Decorações</Text>
      <Text key={`detail-${fontScale}`} style={styles.detail}>{detail}</Text>
    </View>
    <IconSymbol name="chevron.right" size={18} color={galaxyColors.textSecondary} />
  </Pressable>;
}
const styles = StyleSheet.create({
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: space.s2, paddingHorizontal: space.s3, paddingVertical: space.s2,
    borderRadius: radius.rMd, backgroundColor: galaxyColors.surface, borderWidth: 1, borderColor: galaxyColors.border },
  pressed: { opacity: 0.7 },
  text: { flex: 1, minWidth: 0, gap: space.s0 },
  title: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
  detail: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
});
