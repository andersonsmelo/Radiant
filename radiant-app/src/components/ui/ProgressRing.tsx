import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../ui/theme';
import { typography } from '../../ui/styles';

interface ProgressRingProps {
  value: number;
  total: number;
  label?: string;
  size?: number;
}

export function ProgressRing({ value, total, label, size = 116 }: ProgressRingProps) {
  const safeTotal = Math.max(1, total);
  const percentage = Math.max(0, Math.min(100, Math.round((value / safeTotal) * 100)));
  const thickness = Math.max(8, Math.round(size * 0.11));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
          },
        ]}
      >
        <View style={[styles.inner, { borderRadius: (size - thickness * 2) / 2 }]}>
          <Text style={styles.value}>{value}/{safeTotal}</Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  ring: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.highlight,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  inner: {
    flex: 1,
    width: '100%',
    margin: 6,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  percentage: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
