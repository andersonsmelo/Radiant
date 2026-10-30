import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { ExternalLink } from '../../../../components/external-link';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { LEGAL_LINKS } from '../../../config/legal';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { GroupedList } from '../../../ui/components/GroupedList';

const links = [{ ...LEGAL_LINKS.privacy, label: 'Privacidade' }, LEGAL_LINKS.terms, LEGAL_LINKS.support];
interface LegalLinksCardProps { footer?: React.ReactNode }

export function LegalLinksCard({ footer }: LegalLinksCardProps = {}) {
  const { fontScale } = useWindowDimensions();
  return <GroupedList>
    {links.map(link => <ExternalLink key={link.href} href={link.href} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={link.label} accessibilityHint={link.accessibilityHint}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <Text key={`label-${fontScale}`} style={styles.label}>{link.label}</Text>
        <IconSymbol name="chevron.right" size={20} color={galaxyColors.textSecondary} />
      </Pressable>
    </ExternalLink>)}
    {footer}
  </GroupedList>;
}
const styles = StyleSheet.create({
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: space.s2, paddingVertical: space.s2 },
  label: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary, flex: 1 },
  pressed: { opacity: 0.7 },
});
