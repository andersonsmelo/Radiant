import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { AppConfig } from '../../../config';
import { ListRow } from '../../../ui/components/ListRow';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type LeagueProfileRowProps = { onPress: () => void; enabled?: boolean };

/**
 * Entrada da liga no Perfil, no padrão de `ListRow`. Não lê o Game Center ao
 * abrir o Perfil: a posição aparece na tela da liga. Com a liga desligada, não existe.
 */
export function LeagueProfileRow({ onPress, enabled = AppConfig.ENABLE_LEAGUE }: LeagueProfileRowProps): React.ReactElement | null {
  if (!enabled) return null;
  return <ListRow title="Liga da semana" accessibilityLabel="Liga da semana. Ver sua posição." onPress={onPress} testID="league-profile-row"
    trailing={<View style={styles.trailing}>
      <Text style={styles.value}>Ver posição</Text>
      <IconSymbol name="chevron.right" size={18} color={galaxyColors.textSecondary} />
    </View>} />;
}

const styles = StyleSheet.create({
  trailing: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
  value: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
});
