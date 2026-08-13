import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { HotspotPayload, NormalizedRegion } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

type HotspotStepRendererProps = {
    payload: HotspotPayload;
    accessibilityLabel: string;
    selectedRegionId?: string;
    onSelect: (regionId: string) => void;
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
}: HotspotStepRendererProps) {
    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{payload.prompt}</Text>

            <View style={styles.imageFrame}>
                <Image
                    source={{ uri: payload.imageRef }}
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
                            onPress={() => onSelect(region.id)}
                            accessibilityRole="button"
                            accessibilityLabel={`Selecionar ${region.label} na imagem`}
                            accessibilityHint="Seleciona esta região. Você confirma em Continuar."
                            accessibilityState={{ selected }}
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
                            onPress={() => onSelect(region.id)}
                            accessibilityRole="button"
                            accessibilityLabel={`Selecionar ${region.label} na lista`}
                            accessibilityHint="Equivale a tocar a região na imagem. Você confirma em Continuar."
                            accessibilityState={{ selected }}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        borderWidth: 3,
        borderColor: galaxy.statusSuccess,
        backgroundColor: 'rgba(93,227,174,0.16)',
    },
    hotspotIndex: { ...typography.bodyStrong, color: galaxy.textPrimary },
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
