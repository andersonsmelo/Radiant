/**
 * GalaxyStatRow — linha de stat com ícone opcional, label e valor.
 * Usado nas telas de resumo/checkpoint/revisão com a paleta galáctica.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { galaxyColors } from '../theme';
import { space } from '../styles';

export interface GalaxyStatRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

export function GalaxyStatRow({ icon, label, value }: GalaxyStatRowProps) {
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
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  icon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  textBlock: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 6, flex: 1 },
  label: { fontSize: 11, fontWeight: '600', color: galaxyColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 14, fontWeight: '700', color: galaxyColors.textPrimary },
});
