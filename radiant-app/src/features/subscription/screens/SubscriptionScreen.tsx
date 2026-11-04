import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ExternalLink } from '../../../../components/external-link';
import { AppButton } from '../../../components/ui/AppButton';
import { LEGAL_LINKS } from '../../../config/legal';
import { depth, galaxyColors, medalColors } from '../../../ui/theme';
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
    | { kind: 'manage-failed' }
    | null;

const CANCEL_COPY = 'Para gerenciar ou cancelar: Ajustes do iOS → seu nome → Assinaturas.';

/** Nunca interpreta displayPrice: o binário antigo simplesmente não mostra esta linha. */
function monthlyEquivalent(product: StoreProduct): string | null {
    if (product.period !== 'annual' || typeof product.price !== 'number'
        || !Number.isFinite(product.price) || product.price < 0
        || typeof product.currencyCode !== 'string' || !/^[A-Z]{3}$/.test(product.currencyCode)) return null;
    try {
        return `${new Intl.NumberFormat(undefined, { style: 'currency', currency: product.currencyCode }).format(product.price / 12)} por mês`;
    } catch {
        return null;
    }
}

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
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    // Só a carga de ofertas mais recente escreve na tela. A da abertura e a da
    // troca de loja correm juntas, e sem ordem a mais antiga podia chegar por
    // último e trazer a moeda velha de volta (revisão da PR #38).
    const ultimaCargaDeOfertas = useRef(0);

    useEffect(() => {
        let alive = true;
        const carga = ++ultimaCargaDeOfertas.current;
        setStatus(null);
        setOffers(null);
        void Promise.all([service.refresh(nowMs()), service.loadOffers()])
            .then(([nextStatus, nextOffers]) => {
                if (!alive) return;
                setStatus(nextStatus);
                if (carga === ultimaCargaDeOfertas.current) setOffers(nextOffers);
            })
            .catch((cause) => {
                console.error('[SubscriptionScreen] Falha ao carregar a assinatura:', cause);
                if (!alive) return;
                setStatus({ kind: 'none' });
                if (carga === ultimaCargaDeOfertas.current) setOffers({ status: 'store-unavailable' });
            });
        return () => {
            alive = false;
        };
    }, [attempt, nowMs, service]);

    // Ask to Buy aprovado, renovação ou reembolso chegam com a tela aberta, e ela
    // não remonta: sem esta escuta, o pedido aprovado seguia como pendente até
    // fechar e abrir de novo (medido no StoreKit Testing em 2026-09-27).
    useEffect(() => {
        let alive = true;
        const parar = service.watchStoreUpdates(nowMs, (nextStatus) => {
            if (alive) setStatus(nextStatus);
        });
        return () => {
            alive = false;
            parar();
        };
    }, [nowMs, service]);

    // A troca de loja da conta muda a moeda: os preços já na tela ficam errados
    // até serem pedidos de novo (ADR de 2026-09-25, item 4). Só as ofertas são
    // recarregadas; o estado da assinatura não depende da loja.
    useEffect(() => {
        let alive = true;
        const parar = service.watchStorefront(() => {
            const carga = ++ultimaCargaDeOfertas.current;
            void service.loadOffers().then((nextOffers) => {
                if (alive && carga === ultimaCargaDeOfertas.current) setOffers(nextOffers);
            });
        });
        return () => {
            alive = false;
            parar();
        };
    }, [service]);

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

    // Troca de plano e cancelamento acontecem na folha da Apple (ADR de
    // 2026-09-25, "Gerenciar", opção A). Quando ela fecha, o serviço relê a
    // assinatura, e a tela mostra o que mudou lá.
    const manage = useCallback(async () => {
        setBusy(true);
        setNotice(null);
        try {
            const result = await service.manageSubscription(nowMs());
            if (result.kind === 'shown') setStatus(result.status);
            else setNotice({ kind: 'manage-failed' });
        } finally {
            setBusy(false);
        }
    }, [nowMs, service]);

    const close = useCallback(() => {
        router.back();
    }, []);

    // O pedido do Ask to Buy é aviso, não trava: a Apple não avisa a recusa
    // nem a expiração e recomenda permitir nova compra depois de `.pending`
    // (developer.apple.com/forums/thread/685183). Planos e Restaurar seguem à
    // mão; o aviso some sozinho quando o pedido passa de 24 h, no serviço.
    const pendingNote = status?.kind === 'pending' ? (
        <View style={styles.card}>
            <Text style={styles.cardTitle} accessibilityRole="header">Pedido enviado para aprovação</Text>
            <Text style={styles.body}>
                Quando for aprovado, suas vidas ficam ilimitadas. Até lá, tudo continua funcionando como hoje.
            </Text>
        </View>
    ) : null;

    const selectedProduct = offers?.status === 'available'
        ? offers.products.find(product => product.id === selectedProductId)
            ?? offers.products.find(product => product.period === 'annual') ?? offers.products[0]
        : undefined;

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
                    {status.willRenew === null
                        ? `Ativa — acesso até ${formatShortDate(status.expiresAt)}. Suas vidas são ilimitadas até lá.`
                        : status.willRenew
                            ? `Renova em ${formatShortDate(status.expiresAt)}. Suas vidas são ilimitadas até lá — e continuam, enquanto a assinatura renovar.`
                            : `Cancelada — válida até ${formatShortDate(status.expiresAt)}. Depois disso, suas vidas voltam a 5 e continuam se recuperando.`}
                </Text>
                <AppButton
                    label="Gerenciar assinatura"
                    variant="secondary"
                    disabled={busy}
                    onPress={() => void manage()}
                    accessibilityHint="Abre a folha da Apple para trocar de plano ou cancelar."
                />
                {notice?.kind === 'manage-failed' ? (
                    <Text style={styles.notice}>O gerenciamento da Apple não abriu agora. Tente de novo mais tarde.</Text>
                ) : null}
                <Text style={styles.body}>{CANCEL_COPY}</Text>
            </View>
        );
    } else if (offers.status === 'store-unavailable') {
        body = (
            <>
                {pendingNote}
                <View style={styles.card}>
                    <Text style={styles.cardTitle} accessibilityRole="header">A loja não respondeu agora</Text>
                    <Text style={styles.body}>
                        Suas vidas continuam funcionando normalmente — tente de novo mais tarde.
                    </Text>
                    <AppButton label="Tentar de novo" variant="secondary" onPress={() => setAttempt((n) => n + 1)} />
                </View>
            </>
        );
    } else {
        body = (
            <>
                {pendingNote}
                {status.kind === 'expired' ? (
                    <View style={styles.card}>
                        <Text style={styles.body}>
                            {`Sua assinatura expirou em ${formatShortDate(status.expiredAt)}. Suas vidas voltaram a 5 e continuam se recuperando.`}
                        </Text>
                    </View>
                ) : null}

                <View style={styles.introduction}>
                    <Text style={styles.cardTitle}>Errar não custa vida.</Text>
                    <Text style={styles.body}>As aulas são as mesmas para todo mundo.</Text>
                </View>

                <View style={styles.plans} accessibilityRole="radiogroup" accessibilityLabel="Escolha seu plano">
                    {offers.products.map((product) => {
                        const annual = product.period === 'annual';
                        const selected = selectedProduct?.id === product.id;
                        const monthly = monthlyEquivalent(product);
                        const tone = annual ? medalColors.gold : medalColors.unit;
                        return (
                            <Pressable
                                key={product.id}
                                accessibilityRole="radio"
                                accessibilityLabel={`${annual ? 'Anual' : 'Mensal'}, ${product.displayPrice} ${periodCopy(product)}${monthly ? `, ${monthly}` : ''}`}
                                accessibilityState={{ checked: selected, disabled: busy }}
                                disabled={busy}
                                onPress={() => setSelectedProductId(product.id)}
                                style={styles.plan}
                            >
                                {({ pressed }) => (
                                    <>
                                        <View style={styles.medal}>
                                            <View pointerEvents="none" style={[styles.medalLip, { backgroundColor: tone.lip }]} />
                                            <View style={[
                                                styles.medalFace,
                                                { backgroundColor: tone.face, borderColor: selected ? galaxyColors.textPrimary : tone.inner,
                                                    transform: [{ translateY: pressed ? depth.lip - 1 : 0 }] },
                                            ]}>
                                                <Text style={[styles.planTitle, annual && styles.goldLabel]}>{annual ? 'Anual' : 'Mensal'}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.price}>{product.displayPrice}</Text>
                                        <Text style={styles.period}>{periodCopy(product)}</Text>
                                        {monthly ? <Text style={styles.equivalent}>{monthly}</Text> : null}
                                    </>
                                )}
                            </Pressable>
                        );
                    })}
                </View>
                {selectedProduct ? (
                    <AppButton
                        label={selectedProduct.period === 'annual' ? 'Assinar anual' : 'Assinar mensal'}
                        variant={selectedProduct.period === 'annual' ? 'gold' : 'galaxy'}
                        loading={busy}
                        onPress={() => void purchase(selectedProduct)}
                    />
                ) : null}

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
                    <AppButton label="Restaurar compras" variant="ghost" disabled={busy} onPress={() => void restore()} />
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
    introduction: {
        gap: space.s1,
        paddingVertical: space.s2,
    },
    plans: {
        flexDirection: 'row',
        gap: space.s2,
        paddingVertical: space.s2,
    },
    plan: {
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
        gap: space.s1,
    },
    medal: {
        width: '100%',
        maxWidth: 128,
        paddingBottom: depth.lip,
    },
    // Diâmetro aprovado de 128 pt, raio de 64 pt composto do token existente.
    medalLip: {
        position: 'absolute',
        top: depth.lip,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: radius.rLg * 4,
    },
    medalFace: {
        minHeight: 112,
        borderRadius: radius.rLg * 4,
        borderWidth: 3,
        padding: space.s2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    planTitle: {
        ...typography.bodyStrong,
        color: galaxyColors.textPrimary,
        textAlign: 'center',
    },
    goldLabel: {
        color: galaxyColors.background,
    },
    price: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
        textAlign: 'center',
    },
    period: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
        textAlign: 'center',
    },
    equivalent: {
        ...typography.caption,
        color: medalColors.gold.face,
        textAlign: 'center',
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
