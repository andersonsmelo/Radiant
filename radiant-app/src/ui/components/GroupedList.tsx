import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { galaxyColors } from '../theme';
import { radius, space, typography } from '../styles';

type GroupedListProps = { header?: string; footer?: string; children: React.ReactNode };

/** Uma superfície contínua; os filhos conservam seus próprios controles acessíveis. */
export function GroupedList({ header, footer, children }: GroupedListProps): React.ReactElement {
  const { fontScale } = useWindowDimensions();
  return <View style={styles.group}>
    {header ? <Text key={`header-${fontScale}`} style={styles.header} accessibilityRole="header">{header}</Text> : null}
    <View style={styles.surface}>
      {React.Children.toArray(children).map((child, index) => <View key={React.isValidElement(child) ? child.key ?? index : index}
        style={index > 0 ? styles.divider : undefined}>{child}</View>)}
    </View>
    {footer ? <Text key={`footer-${fontScale}`} style={styles.footer}>{footer}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  group: { gap: space.s1 },
  surface: { backgroundColor: galaxyColors.surface, borderRadius: radius.rMd, paddingHorizontal: space.s3 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: galaxyColors.border },
  header: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textSecondary, paddingHorizontal: space.s3 },
  footer: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary, paddingHorizontal: space.s3 },
});
