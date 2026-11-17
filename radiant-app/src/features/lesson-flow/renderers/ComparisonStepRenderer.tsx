import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { isResolvedInteractionImage, type InteractionImageResolver } from './InteractionImageSource';
import type { ComparisonPayload } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { ChoiceOption } from '../../../components/ui/ChoiceOption';

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
                        <ChoiceOption
                            key={option.id}
                            label={`${index + 1}. ${option.label}`}
                            state={selected ? 'selected' : 'idle'}
                            selectedMark
                            onPress={() => { if (!submitted) onSelect(option.id); }}
                            disabled={submitted}
                            accessibilityLabel={option.imageAlt ? `${option.label}. ${option.imageAlt}` : option.label}
                            accessibilityHint={submitted ? 'Resposta já conferida. Leia o retorno e continue.' : `Seleciona esta comparação. Você confirma em ${confirmationLabel}.`}
                            media={option.imageRef ? (
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
                        />
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
    optionImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: radius.rMd },
    visualPlaceholder: {
        minHeight: 72,
        borderRadius: radius.rMd,
        backgroundColor: galaxyColors.backgroundAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: { ...typography.caption, color: galaxy.textSecondary },
});
