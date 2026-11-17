import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { AppConfig } from '../../../config';
import { ListRow } from '../../../ui/components/ListRow';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { DECORATIONS } from '../catalog';
import type { DecorationsState } from '../DecorationsService';
import { availableIds } from '../unlocks';

/** Entrada das decorações no Perfil (F6), no padrão de `ListRow`. Desligada a flag, não monta. */
export function DecorationsProfileRow({ state }: { state: DecorationsState | null }): React.ReactElement | null {
  if (!AppConfig.ENABLE_DECORATIONS) return null;
  const count = state ? availableIds(state.unlocked, state.subscriber).size : null;
  const value = count === null ? 'Ver' : `${count} de ${DECORATIONS.length}`;
  const detail = count === null ? 'Enfeites do seu perfil' : `${count} de ${DECORATIONS.length} disponíveis`;
  return <ListRow title="Decorações" accessibilityLabel={`Decorações. ${detail}.`} onPress={() => router.push('/decoracoes')}
    trailing={<View style={styles.trailing}>
      <Text style={styles.value}>{value}</Text>
      <IconSymbol name="chevron.right" size={18} color={galaxyColors.textSecondary} />
    </View>} />;
}
const styles = StyleSheet.create({
  trailing: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
  value: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
});
