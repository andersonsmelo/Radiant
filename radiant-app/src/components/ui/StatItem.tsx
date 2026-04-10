import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../ui/theme';
import { space, typography } from '../../ui/styles';

interface StatItemProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

export function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <View style={styles.row}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
  },
  icon: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
