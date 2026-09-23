import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
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
                detail: status.willRenew
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
    if (status === null) {
        return (
            <View style={styles.card} accessibilityRole="progressbar" accessibilityLabel="Carregando a assinatura">
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, styles.skeletonShort]} />
            </View>
        );
    }

    const { headline, detail, action } = describe(status);

    return (
        <View style={styles.card}>
            <Text style={styles.eyebrow}>ASSINATURA</Text>
            <Text style={styles.headline} accessibilityRole="header">{headline}</Text>
            <Text style={styles.detail}>{detail}</Text>
            {action ? (
                <AppButton
                    label={action}
                    variant="secondary"
                    onPress={onOpen}
                    style={styles.button}
                    accessibilityHint="Abre a tela da assinatura."
                />
            ) : null}
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
        gap: space.s1,
    },
    eyebrow: {
        ...typography.label,
        color: galaxyColors.textTertiary,
    },
    headline: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    detail: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
    button: {
        marginTop: space.s2,
    },
    skeletonLine: {
        height: 16,
        borderRadius: radius.rSm,
        backgroundColor: galaxyColors.surfaceActive,
    },
    skeletonShort: {
        width: '60%',
    },
});
