import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { isResolvedInteractionImage, type InteractionImageResolver } from './InteractionImageSource';
import type { ComparisonPayload } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

type ComparisonStepRendererProps = {
    payload: ComparisonPayload;
    selectedOptionId?: string;
    onSelect: (optionId: string) => void;
    resolveImageSource?: InteractionImageResolver;
    submitted?: boolean;
    confirmationLabel?: string;
};

export function ComparisonStepRenderer({ payload, selectedOptionId, onSelect, resolveImageSource, submitted = false, confirmationLabel = 'Continuar' }: ComparisonStepRendererProps) {
    const images = payload.options.map(option => option.imageRef ? resolveImageSource?.(option.imageRef) : undefined);
    if (resolveImageSource && payload.options.some((option, index) => option.imageRef && !isResolvedInteractionImage(images[index])))
        return <Text>Imagem indisponível para esta atividade.</Text>;
    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{payload.prompt}</Text>
            <View style={styles.options}>
                {payload.options.map((option, index) => {
                    const selected = selectedOptionId === option.id;
                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => { if (!submitted) onSelect(option.id); }}
                            disabled={submitted}
                            accessibilityRole="button"
                            accessibilityLabel={option.label}
                            accessibilityHint={submitted ? 'Resposta já conferida. Leia o retorno e continue.' : `Seleciona esta comparação. Você confirma em ${confirmationLabel}.`}
                            accessibilityState={{ selected, ...(submitted ? { disabled: true } : {}) }}
                            style={[styles.option, selected && styles.selected]}
                        >
                            {option.imageRef ? (
                                <Image
                                    source={images[index]?.source ?? { uri: option.imageRef }}
                                    resizeMode={images[index] ? 'contain' : 'cover'}
                                    // Image injects the asset's intrinsic size; without clearing height the diagram renders at full size and is cropped.
                                    style={[styles.optionImage, images[index] && { height: undefined, aspectRatio: images[index]!.width / images[index]!.height }]}
                                    accessible={false}
                                />
                            ) : (
                                <View style={styles.visualPlaceholder} accessible={false}>
                                    <Text style={styles.placeholderText}>Opção {index + 1}</Text>
                                </View>
                            )}
                            <View style={styles.optionCopy}>
                                <Text style={styles.optionIndex}>{index + 1}</Text>
                                <Text style={styles.optionLabel}>{option.label}</Text>
                            </View>
                            {selected ? <Text style={styles.selectedLabel}>✓ Selecionada</Text> : null}
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
    prompt: { ...typography.h3, color: galaxy.textPrimary },
    options: { gap: space.s2 },
    option: {
        minHeight: 44,
        overflow: 'hidden',
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxy.border,
        backgroundColor: galaxyColors.surface,
        padding: space.s3,
        gap: space.s2,
    },
    selected: {
        borderWidth: 2,
        borderColor: galaxy.statusSuccess,
        backgroundColor: 'rgba(93,227,174,0.10)',
    },
    optionImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: radius.rMd },
    visualPlaceholder: {
        minHeight: 72,
        borderRadius: radius.rMd,
        backgroundColor: galaxyColors.backgroundAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: { ...typography.caption, color: galaxy.textSecondary },
    optionCopy: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s2 },
    optionIndex: { ...typography.bodyStrong, color: galaxy.statusInformation },
    optionLabel: { ...typography.bodyRegular, color: galaxy.textPrimary, flex: 1 },
    selectedLabel: { ...typography.caption, color: galaxy.statusSuccess },
});
