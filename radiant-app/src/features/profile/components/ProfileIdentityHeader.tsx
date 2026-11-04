import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';

type ProfileIdentityHeaderProps = {
  email: string | null;
  /** Sem destino real, não monta uma engrenagem inerte. */
  onOpenSettings?: () => void;
};

/** O avatar identifica o aluno, sem misturá-lo com o Pixel ou inventar perfil social. */
export function ProfileIdentityHeader({ email, onOpenSettings }: ProfileIdentityHeaderProps) {
  const { fontScale } = useWindowDimensions();
  const largeText = isLargeTextScale(fontScale);
  const displayName = email ? email.split('@')[0] : 'Estudante';
  const identity = <View testID="profile-identity-text" style={[styles.identityText, largeText && styles.identityStacked]}>
    <Text key={`name-${fontScale}`} style={styles.name} accessibilityRole="header">{displayName}</Text>
    <Text key={`account-${fontScale}`} style={styles.account}>{email ?? 'Estudo local, sem conta'}</Text>
  </View>;
  return <View style={styles.header}>
    <View style={styles.identityRow}>
      <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Text key={`avatar-${fontScale}`} style={styles.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
      </View>
      {!largeText ? identity : <View style={styles.spacer} />}
      {onOpenSettings ? <Pressable onPress={onOpenSettings} accessibilityRole="button" accessibilityLabel="Ajustes"
        accessibilityHint="Assinatura, meta diária, lembrete, backup, sons e vibração, ajuda." hitSlop={space.s1}
        style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}>
        <IconSymbol name="gearshape.fill" size={22} color={galaxyColors.textSecondary} />
      </Pressable> : null}
    </View>
    {largeText ? identity : null}
  </View>;
}
const styles = StyleSheet.create({
  header: { gap: space.s3 },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  avatar: { minWidth: 64, minHeight: 64, borderRadius: 999, padding: space.s2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: galaxyColors.surface, borderWidth: 1, borderColor: galaxyColors.border },
  avatarInitial: { ...typography.h3, lineHeight: undefined, color: galaxyColors.textPrimary },
  spacer: { flex: 1 },
  identityText: { flex: 1, minWidth: 0, gap: space.s0 },
  identityStacked: { flex: 0, alignSelf: 'stretch' },
  name: { ...typography.h3, lineHeight: undefined, color: galaxyColors.textPrimary },
  account: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  settingsButton: { width: 48, height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
    backgroundColor: galaxyColors.surface, borderWidth: 1, borderColor: galaxyColors.border },
  settingsButtonPressed: { opacity: 0.7 },
});
