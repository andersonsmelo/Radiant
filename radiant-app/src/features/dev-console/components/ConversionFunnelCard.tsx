import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { conversionService, type ConversionService, type ConversionStateV1, type FunnelEvent } from '../../conversion/ConversionService';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type Props = Readonly<{ service?: Pick<ConversionService, 'read' | 'enabled'> }>;

const LABELS: readonly [FunnelEvent, string][] = [
    ['invite_seen_hearts_empty', 'Convite visto, sem vidas'],
    ['invite_seen_unit_complete', 'Convite visto, fim de unidade'],
    ['screen_opened', 'Tela de assinatura aberta'],
    ['purchase_started', 'Compra iniciada'],
    ['purchase_completed', 'Compra concluída'],
    ['sample_taken', 'Amostra usada'],
];

/** Funil local dos convites (F8, ADR 2026-11-15), lido do aparelho. Nada disto sai dele. */
export function ConversionFunnelCard({ service = conversionService }: Props) {
    const [state, setState] = useState<ConversionStateV1 | null>(null);
    useEffect(() => { void service.read().then(setState); }, [service]);
    const chave = service.enabled() ? 'ligada' : 'desligada · nada é contado';
    return (
        <View style={styles.card}>
            <Text style={styles.headline} accessibilityRole="header">Convites de assinatura</Text>
            {state === null ? null : (
                <>
                    <Text style={styles.line}>
                        {`Chave ENABLE_CONVERSION_PROMPTS: ${chave} · ${state.lastInviteDay ? `último convite em ${state.lastInviteDay}` : 'nenhum convite ainda'}`}
                    </Text>
                    {LABELS.map(([event, label]) => (
                        <Text key={event} style={styles.line}>{`${label}: ${state.counts[event]}`}</Text>
                    ))}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: galaxyColors.surface, borderRadius: radius.rLg, borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s1 },
    headline: { ...typography.h3, color: galaxyColors.textPrimary },
    line: { ...typography.caption, color: galaxyColors.textSecondary },
});
