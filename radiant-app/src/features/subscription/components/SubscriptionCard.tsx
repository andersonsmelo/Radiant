import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { GroupedList } from '../../../ui/components/GroupedList';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import type { SubscriptionStatus } from '../subscription.types';

type SubscriptionCardProps = {
    /** `null` enquanto o cache ainda não foi lido: esqueleto, nunca branco. */
    status: SubscriptionStatus | null;
    onOpen: () => void;
};

export function formatShortDate(iso: string): string {
    const date = new Date(iso);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${date.getFullYear()}`;
}

function describe(status: SubscriptionStatus): { headline: string; detail: string; action: string | null } {
    switch (status.kind) {
        case 'none':
            return { headline: 'Radiant Ilimitado', detail: 'Vidas ilimitadas — e só isso.', action: 'Conhecer' };
        case 'pending':
            // Nunca sem botão: a Apple não avisa a recusa, então a tela precisa
            // continuar alcançável para comprar de novo ou restaurar.
            return { headline: 'Radiant Ilimitado', detail: 'Pedido aguardando aprovação', action: 'Ver' };
        case 'unlimited':
            return {
                headline: 'Assinante · vidas ilimitadas',
                detail: status.willRenew === null
                    // Desconhecida: ativa, sem prometer renovação nem afirmar
                    // cancelamento (ADR de 2026-09-25, 2A).
                    ? `Ativa · acesso até ${formatShortDate(status.expiresAt)}`
                    : status.willRenew
                        ? `Renova em ${formatShortDate(status.expiresAt)}`
                        : `Cancelada · válida até ${formatShortDate(status.expiresAt)}`,
                action: 'Gerenciar',
            };
        case 'expired':
            return { headline: 'Assinatura expirada', detail: 'Suas vidas voltaram a 5 e continuam se recuperando.', action: 'Renovar' };
    }
}

/**
 * Cartão **Assinatura** do Perfil (spec §3.5): estado e a porta para a tela
 * de assinatura. Sem palavra de infraestrutura — nada de loja, recibo ou
 * transação; só o que o aluno tem e quando renova.
 */
export function SubscriptionCard({ status, onOpen }: SubscriptionCardProps) {
    const { fontScale } = useWindowDimensions();
    if (status === null) return <GroupedList><View style={styles.row} accessibilityRole="progressbar" accessibilityLabel="Carregando a assinatura">
        <Text key={`loading-${fontScale}`} style={styles.detail}>Carregando assinatura…</Text>
    </View></GroupedList>;
    const { headline, detail, action } = describe(status);
    return <GroupedList><Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={action ?? 'Radiant Ilimitado'}
        accessibilityHint={`${headline}. ${detail} Abre a tela da assinatura.`} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={styles.copy}>
            <Text key={`title-${fontScale}`} style={styles.headline}>{headline}</Text>
            <Text key={`detail-${fontScale}`} style={styles.detail}>{detail}</Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color={galaxyColors.textSecondary} />
    </Pressable></GroupedList>;
}
const styles = StyleSheet.create({
    row: { minHeight: 56, paddingVertical: space.s2, flexDirection: 'row', alignItems: 'center', gap: space.s2 },
    copy: { flex: 1, minWidth: 0, gap: space.s0 },
    headline: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
    detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
    pressed: { opacity: 0.7 },
});
