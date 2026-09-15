import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ExternalLink } from '../../../../components/external-link';
import { AppButton } from '../../../components/ui/AppButton';
import { LEGAL_LINKS } from '../../../config/legal';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { formatShortDate } from '../components/SubscriptionCard';
import { SubscriptionService, subscriptionService } from '../SubscriptionService';
import type { StoreProduct, SubscriptionOffers, SubscriptionStatus } from '../subscription.types';

type SubscriptionScreenProps = {
    service?: SubscriptionService;
    nowMs?: () => number;
};

type Notice =
    | { kind: 'restored' }
    | { kind: 'nothing-to-restore' }
    | { kind: 'cancelled' }
    | { kind: 'failed'; message: string }
    | { kind: 'store-unavailable' }
    | null;

const CANCEL_COPY = 'Para gerenciar ou cancelar: Ajustes do iOS → seu nome → Assinaturas.';

function periodCopy(product: StoreProduct): string {
    return product.period === 'monthly' ? 'por mês' : 'por ano';
}

/**
 * Tela da assinatura "Radiant Ilimitado" (spec §6). Preço e período vêm da
 * porta ou não aparecem; a Apple exige (3.1.2) renovação por extenso,
 * Restaurar compras, termos, privacidade e como cancelar. Rede e dinheiro só
 * existem aqui, na folha de vidas e no cartão de backup — nunca no estudo.
 */
export default function SubscriptionScreen({ service = subscriptionService, nowMs = Date.now }: SubscriptionScreenProps) {
    const [status, setStatus] = useState<SubscriptionStatus | null>(null);
    const [offers, setOffers] = useState<SubscriptionOffers | null>(null);
    const [notice, setNotice] = useState<Notice>(null);
    const [busy, setBusy] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let alive = true;
        setStatus(null);
        setOffers(null);
        void Promise.all([service.refresh(nowMs()), service.loadOffers()])
            .then(([nextStatus, nextOffers]) => {
                if (!alive) return;
                setStatus(nextStatus);
                setOffers(nextOffers);
            })
            .catch((cause) => {
                console.error('[SubscriptionScreen] Falha ao carregar a assinatura:', cause);
                if (!alive) return;
                setStatus({ kind: 'none' });
                setOffers({ status: 'store-unavailable' });
            });
        return () => {
            alive = false;
        };
    }, [attempt, nowMs, service]);

    const purchase = useCallback(async (product: StoreProduct) => {
        setBusy(true);
        setNotice(null);
        try {
            const result = await service.purchase(product.id, nowMs());
            switch (result.kind) {
                case 'purchased':
                    setStatus(result.status);
                    break;
                case 'pending':
                    setStatus({ kind: 'pending', since: new Date(nowMs()).toISOString() });
                    break;
                case 'cancelled':
                    setNotice({ kind: 'cancelled' });
                    break;
                case 'failed':
                    setNotice({ kind: 'failed', message: result.message });
                    break;
                case 'store-unavailable':
                    setNotice({ kind: 'store-unavailable' });
                    break;
            }
        } finally {
            setBusy(false);
        }
    }, [nowMs, service]);

    const restore = useCallback(async () => {
        setBusy(true);
        setNotice(null);
        try {
            const result = await service.restore(nowMs());
            if (result.kind === 'restored') {
                setStatus(result.status);
                setNotice({ kind: 'restored' });
            } else {
                setNotice({ kind: result.kind });
            }
        } finally {
            setBusy(false);
        }
    }, [nowMs, service]);

    const close = useCallback(() => {
        router.back();
    }, []);

    let body: React.ReactNode;
    if (status === null || offers === null) {
        body = (
            <View style={styles.card} accessibilityRole="progressbar" accessibilityLabel="Carregando os planos">
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, styles.skeletonShort]} />
                <View style={styles.skeletonLine} />
            </View>
        );
    } else if (status.kind === 'unlimited') {
        body = (
            <View style={styles.card}>
                <Text style={styles.cardTitle} accessibilityRole="header">
                    {notice?.kind === 'restored' ? 'Compra restaurada' : 'Você é assinante'}
                </Text>
                <Text style={styles.body}>
                    {status.willRenew
                        ? `Renova em ${formatShortDate(status.expiresAt)}. Suas vidas são ilimitadas até lá — e continuam, enquanto a assinatura renovar.`
                        : `Cancelada — válida até ${formatShortDate(status.expiresAt)}. Depois disso, suas vidas voltam a 5 e continuam se recuperando.`}
                </Text>
                <Text style={styles.body}>{CANCEL_COPY}</Text>
            </View>
        );
    } else if (status.kind === 'pending') {
        body = (
            <View style={styles.card}>
                <Text style={styles.cardTitle} accessibilityRole="header">Pedido enviado para aprovação</Text>
                <Text style={styles.body}>
                    Quando for aprovado, suas vidas ficam ilimitadas. Até lá, tudo continua funcionando como hoje.
                </Text>
            </View>
        );
    } else if (offers.status === 'store-unavailable') {
        body = (
            <View style={styles.card}>
                <Text style={styles.cardTitle} accessibilityRole="header">A loja não respondeu agora</Text>
                <Text style={styles.body}>
                    Suas vidas continuam funcionando normalmente — tente de novo mais tarde.
                </Text>
                <AppButton label="Tentar de novo" variant="secondary" onPress={() => setAttempt((n) => n + 1)} />
            </View>
        );
    } else {
        body = (
            <>
                {status.kind === 'expired' ? (
                    <View style={styles.card}>
                        <Text style={styles.body}>
                            {`Sua assinatura expirou em ${formatShortDate(status.expiredAt)}. Suas vidas voltaram a 5 e continuam se recuperando.`}
                        </Text>
                    </View>
                ) : null}

                <View style={styles.card}>
                    <Text style={styles.cardTitle} accessibilityRole="header">Vidas ilimitadas — e só isso.</Text>
                    <Text style={styles.body}>
                        Errar não custa vida e a folha de vidas nunca aparece. Todo o conteúdo continua igual para todo mundo.
                    </Text>
                </View>

                {offers.products.map((product) => (
                    <View key={product.id} style={styles.card}>
                        <Text style={styles.planTitle}>{product.title}</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>{product.displayPrice}</Text>
                            <Text style={styles.period}>{periodCopy(product)}</Text>
                        </View>
                        <AppButton
                            label={`Assinar ${product.title}`}
                            variant="galaxy"
                            disabled={busy}
                            onPress={() => void purchase(product)}
                        />
                    </View>
                ))}

                {notice?.kind === 'cancelled' ? <Text style={styles.notice}>Tudo bem — nada foi cobrado.</Text> : null}
                {notice?.kind === 'nothing-to-restore' ? (
                    <Text style={styles.notice}>Não encontramos uma assinatura para restaurar nesta conta da Apple.</Text>
                ) : null}
                {notice?.kind === 'failed' ? (
                    <Text style={styles.notice}>A compra não foi concluída. Nada foi cobrado; tente de novo mais tarde.</Text>
                ) : null}
                {notice?.kind === 'store-unavailable' ? (
                    <Text style={styles.notice}>A loja não respondeu agora. Nada foi cobrado; tente de novo mais tarde.</Text>
                ) : null}

                <View style={styles.card}>
                    <Text style={styles.legal}>
                        A assinatura renova automaticamente pelo mesmo valor e período até ser cancelada. A cobrança
                        acontece na sua conta da Apple ao confirmar a compra e a cada renovação, até 24 horas antes
                        do fim do período atual.
                    </Text>
                    <Text style={styles.legal}>{CANCEL_COPY}</Text>
                    <AppButton label="Restaurar compras" variant="secondary" disabled={busy} onPress={() => void restore()} />
                    <View style={styles.links}>
                        {[LEGAL_LINKS.terms, LEGAL_LINKS.privacy].map((link) => (
                            <ExternalLink key={link.href} href={link.href} asChild>
                                <Pressable accessibilityRole="link" accessibilityLabel={link.label} accessibilityHint={link.accessibilityHint}>
                                    <Text style={styles.link}>{link.label}</Text>
                                </Pressable>
                            </ExternalLink>
                        ))}
                    </View>
                </View>
            </>
        );
    }

    return (
        <SafeAreaView style={[layout.screen, styles.root, styles.noPadding]}>
            <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">Radiant Ilimitado</Text>
                <Pressable
                    onPress={close}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                    hitSlop={12}
                    style={styles.close}
                >
                    <Text style={styles.closeText}>✕</Text>
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={[layout.container, styles.content]} showsVerticalScrollIndicator={false}>
                {body}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: galaxyColors.background,
    },
    // `layout.screen` traz `padding: s3`; aqui o cabeçalho e a rolagem têm o
    // próprio respiro, então o padding da base é zerado de propósito.
    noPadding: {
        padding: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: space.s3,
        paddingVertical: space.s2,
    },
    title: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    close: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: galaxyColors.surface,
    },
    closeText: {
        ...typography.bodyStrong,
        color: galaxyColors.textPrimary,
    },
    content: {
        gap: space.s2,
        paddingBottom: space.s6,
    },
    card: {
        backgroundColor: galaxyColors.surface,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s3,
        gap: space.s2,
    },
    cardTitle: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    body: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
    planTitle: {
        ...typography.bodyStrong,
        color: galaxyColors.textPrimary,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: space.s1,
    },
    price: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    period: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
    notice: {
        ...typography.bodyRegular,
        color: galaxyColors.textPrimary,
        textAlign: 'center',
    },
    legal: {
        ...typography.caption,
        color: galaxyColors.textSecondary,
    },
    links: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: space.s3,
    },
    link: {
        ...typography.bodyStrong,
        color: galaxyColors.navBlue,
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
