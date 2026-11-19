import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InteractionFigure, isFigureAvailable } from './InteractionFigure';
import type { InteractionImageResolver } from './InteractionImageSource';
import { badgeStyle, touchSlop } from './hotspotTouch';
import type { HotspotPayload, NormalizedRegion } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { CheckIcon } from '../../../ui/components/VerdictIcons';

type HotspotStepRendererProps = {
    payload: HotspotPayload;
    accessibilityLabel: string;
    selectedRegionId?: string;
    onSelect: (regionId: string) => void;
    resolveImageSource?: InteractionImageResolver;
    submitted?: boolean;
    confirmationLabel?: string;
};

function regionPosition(region: NormalizedRegion) {
    return {
        left: `${region.x * 100}%` as `${number}%`,
        top: `${region.y * 100}%` as `${number}%`,
        width: `${region.width * 100}%` as `${number}%`,
        height: `${region.height * 100}%` as `${number}%`,
    };
}

export function HotspotStepRenderer({
    payload,
    accessibilityLabel,
    selectedRegionId,
    onSelect,
    resolveImageSource,
    submitted = false,
    confirmationLabel = 'Continuar',
}: HotspotStepRendererProps) {
    if (!isFigureAvailable(payload.imageRef, resolveImageSource)) return <Text>Imagem indisponível para esta atividade.</Text>;
    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{payload.prompt}</Text>

            <InteractionFigure
                imageRef={payload.imageRef}
                // O rótulo da interação vale também para o diagrama: a descrição dele pode entregar a resposta.
                alt={accessibilityLabel}
                resolveImage={resolveImageSource}
            >
                {frame => payload.regions.map((region, index) => {
                    const selected = selectedRegionId === region.id;
                    return (
                        <Pressable
                            key={region.id}
                            onPress={() => { if (!submitted) onSelect(region.id); }}
                            disabled={submitted}
                            // Alvo de 44 pt centrado na região: a parte visível continua sendo a região.
                            hitSlop={touchSlop(region, frame)}
                            accessibilityRole="button"
                            accessibilityLabel={`Selecionar ${region.label} na imagem`}
                            accessibilityHint={submitted ? 'Resposta já conferida. Leia o retorno e continue.' : `Seleciona esta região. Você confirma em ${confirmationLabel}.`}
                            accessibilityState={{ selected, ...(submitted ? { disabled: true } : {}) }}
                            style={[
                                styles.hotspot,
                                regionPosition(region),
                                selected && styles.selected,
                            ]}
                        >
                            {selected ? (
                                <View testID="hotspot-selected-mark" style={[styles.hotspotBadge, badgeStyle(region, frame)]}>
                                    <CheckIcon size={20} color={galaxy.textPrimary} />
                                </View>
                            ) : <Text style={[styles.hotspotIndex, badgeStyle(region, frame)]}>{index + 1}</Text>}
                        </Pressable>
                    );
                })}
            </InteractionFigure>

            <View style={styles.textAlternatives}>
                <Text style={styles.alternativeTitle}>Alternativa textual</Text>
                {payload.regions.map((region, index) => {
                    const selected = selectedRegionId === region.id;
                    return (
                        <Pressable
                            key={region.id}
                            onPress={() => { if (!submitted) onSelect(region.id); }}
                            disabled={submitted}
                            accessibilityRole="button"
                            accessibilityLabel={`Selecionar ${region.label} na lista`}
                            accessibilityHint={submitted ? 'Resposta já conferida. Leia o retorno e continue.' : `Equivale a tocar a região na imagem. Você confirma em ${confirmationLabel}.`}
                            accessibilityState={{ selected, ...(submitted ? { disabled: true } : {}) }}
                            style={[styles.textOption, selected && styles.selected]}
                        >
                            <Text style={styles.optionIndex}>{index + 1}</Text>
                            <Text style={styles.optionLabel}>{region.label}</Text>
                            {selected ? <Text style={styles.selectedLabel}>Selecionada</Text> : null}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
    activity: { gap: space.s3 },
    prompt: { ...typography.h3, color: galaxyColors.textPrimary },
    hotspot: {
        position: 'absolute',
        borderRadius: radius.rMd,
        borderWidth: 2,
        borderColor: galaxy.statusInformation,
        backgroundColor: galaxyColors.imageScrim,
    },
    selected: {
        borderWidth: 3,
        // Só a borda muda: um fundo opaco apagaria a anatomia escolhida.
        borderColor: galaxy.statusSuccess,
    },
    // Opaque badge: the image behind it can be light, as the local diagrams are.
    hotspotIndex: {
        ...typography.bodyStrong,
        color: galaxy.textPrimary,
        backgroundColor: galaxyColors.background,
        borderRadius: radius.rMd,
        overflow: 'hidden',
        textAlign: 'center',
    },
    // Mesmo selo do número, com a marca desenhada no lugar dele.
    hotspotBadge: {
        backgroundColor: galaxyColors.background,
        borderRadius: radius.rMd,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textAlternatives: { gap: space.s2 },
    alternativeTitle: { ...typography.bodyStrong, color: galaxy.textSecondary },
    textOption: {
        minHeight: 44,
        paddingHorizontal: space.s3,
        paddingVertical: space.s2,
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: galaxy.border,
        backgroundColor: galaxyColors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s2,
    },
    optionIndex: { ...typography.bodyStrong, color: galaxy.statusInformation },
    optionLabel: { ...typography.bodyRegular, color: galaxy.textPrimary, flex: 1 },
    selectedLabel: { ...typography.caption, color: galaxy.statusSuccess },
});
