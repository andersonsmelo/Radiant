import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { galaxyColors, medalColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { planComparison } from '../planComparison';

/**
 * Tabela gratuito × assinante (F8). Cada linha é um nó só para o leitor de
 * tela, lida como "Vidas. Gratuito: … Assinante: …", porque a grade de três
 * colunas não tem ordem de leitura por si.
 */
export function PlanComparison() {
    return (
        <View style={styles.card}>
            <View style={styles.row} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
                <View style={styles.labelCell} />
                <Text style={styles.columnTitle}>Gratuito</Text>
                <Text style={[styles.columnTitle, styles.plus]}>Assinante</Text>
            </View>
            {planComparison().map(row => (
                <View key={row.label} style={[styles.row, styles.divider]} accessible
                    accessibilityLabel={`${row.label}. Gratuito: ${row.free}. Assinante: ${row.plus}.`}>
                    <Text style={[styles.labelCell, styles.label]}>{row.label}</Text>
                    <Text style={styles.cell}>{row.free}</Text>
                    <Text style={[styles.cell, styles.plusCell]}>{row.plus}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: galaxyColors.surface,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s3,
        gap: space.s2,
    },
    row: { flexDirection: 'row', gap: space.s2, alignItems: 'flex-start' },
    divider: { borderTopWidth: 1, borderTopColor: galaxyColors.border, paddingTop: space.s2 },
    labelCell: { flex: 1.1 },
    label: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    columnTitle: { ...typography.caption, flex: 1, color: galaxyColors.textSecondary },
    plus: { color: medalColors.gold.face },
    cell: { ...typography.caption, flex: 1, color: galaxyColors.textSecondary },
    plusCell: { color: galaxyColors.textPrimary },
});
