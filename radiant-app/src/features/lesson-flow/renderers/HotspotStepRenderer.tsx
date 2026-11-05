import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { isResolvedInteractionImage, type InteractionImageResolver } from './InteractionImageSource';
import type { HotspotPayload, NormalizedRegion } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

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
    const resolved = resolveImageSource?.(payload.imageRef);
    if (resolveImageSource && !isResolvedInteractionImage(resolved)) return <Text>Imagem indisponível para esta atividade.</Text>;
    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{payload.prompt}</Text>

            <View testID="hotspot-image-frame" style={[styles.imageFrame, resolved && { aspectRatio: resolved.width / resolved.height }]}>
                <Image
                    source={resolved?.source ?? { uri: payload.imageRef }}
                    resizeMode="contain"
                    style={styles.image}
                    accessible
                    accessibilityLabel={accessibilityLabel}
                />
                {payload.regions.map((region, index) => {
                    const selected = selectedRegionId === region.id;
                    return (
                        <Pressable
                            key={region.id}
                            onPress={() => { if (!submitted) onSelect(region.id); }}
                            disabled={submitted}
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
                            <Text style={styles.hotspotIndex}>{selected ? '✓' : index + 1}</Text>
                        </Pressable>
                    );
                })}
            </View>

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
    imageFrame: {
        width: '100%',
        aspectRatio: 4 / 3,
        overflow: 'hidden',
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxy.border,
        backgroundColor: galaxyColors.backgroundAlt,
    },
    image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
    hotspot: {
        position: 'absolute',
        minWidth: 44,
        minHeight: 44,
        borderRadius: radius.rMd,
        borderWidth: 2,
        borderColor: galaxy.statusInformation,
        backgroundColor: 'rgba(3,3,13,0.34)',
        // The corner keeps the index clear of labels drawn inside the image itself.
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: space.s1,
    },
    selected: {
        borderWidth: 3,
        borderColor: galaxy.statusSuccess,
        backgroundColor: 'rgba(93,227,174,0.16)',
    },
    // Opaque badge: the image behind it can be light, as the local diagrams are.
    hotspotIndex: {
        ...typography.bodyStrong,
        color: galaxy.textPrimary,
        backgroundColor: galaxyColors.background,
        borderRadius: radius.rMd,
        overflow: 'hidden',
        paddingHorizontal: space.s2,
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
