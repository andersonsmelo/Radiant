import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { galaxyColors } from '../theme';
import { space, typography } from '../styles';
import { isLargeTextScale } from '../accessibility/useLargeTextLayout';

type ListRowProps = {
  leading?: React.ReactNode;
  title: string;
  detail?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** A continuous reading row; an action is the only reason it becomes a button. */
export function ListRow({ leading, title, detail, trailing, onPress, accessibilityLabel }: ListRowProps): React.ReactElement {
  const { fontScale } = useWindowDimensions();
  const stacked = isLargeTextScale(fontScale);
  const content = <>
    {leading ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{leading}</View> : null}
    <View style={[styles.copy, stacked && styles.copyStacked]}>
      {/* Native text measurements must renew on live scale changes, including max → max. */}
      <Text key={`title-${fontScale}`} style={styles.title}>{title}</Text>
      {detail ? <Text key={`detail-${fontScale}`} style={styles.detail}>{detail}</Text> : null}
    </View>
    {trailing ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{trailing}</View> : null}
  </>;
  const shared = {
    accessible: true,
    accessibilityLabel: accessibilityLabel ?? [title, detail].filter(Boolean).join('. '),
    style: [styles.row, stacked && styles.stacked],
  };
  return onPress
    ? <Pressable {...shared} accessibilityRole="button" onPress={onPress}>{content}</Pressable>
    : <View {...shared} accessibilityRole="text">{content}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2, minHeight: 56,
    paddingVertical: space.s2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: galaxyColors.border },
  stacked: { flexDirection: 'column', alignItems: 'flex-start' },
  copy: { flex: 1, minWidth: 0, alignSelf: 'stretch', gap: space.s0 },
  copyStacked: { flex: 0, width: '100%' },
  title: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1 },
  detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary, flexShrink: 1 },
});
