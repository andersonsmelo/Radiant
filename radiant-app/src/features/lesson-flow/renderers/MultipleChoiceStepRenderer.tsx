import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ExposureReadingImage } from '../../../types/learningActivity';
import type { MultipleChoicePayload } from '../../../types/lessonFlow';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

type MultipleChoiceStepRendererProps = {
    payload: MultipleChoicePayload;
    exposureImage?: ExposureReadingImage;
    selectedOptionId?: string;
    onSelect: (optionId: string) => void;
    confirmationLabel?: string;
    submitted?: boolean;
};

// Selecionar não confirma: enquanto o passo está na tela, a escolha continua
// trocável e nada foi commitado. Quem confirma é a ação do rodapé — por
// isso não existe estado travado aqui.
export function MultipleChoiceStepRenderer({
    payload,
    exposureImage,
    selectedOptionId,
    onSelect,
    confirmationLabel = 'Continuar',
    submitted = false,
}: MultipleChoiceStepRendererProps) {
    // Mesmo limite lazy da bancada: atividades sem imagem não carregam Skia.
    // A migração global dos dublês/imports pertence à T04a.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ExposureImage = exposureImage ? (require('../../bench/ExposureImage') as typeof import('../../bench/ExposureImage')).ExposureImage : null;
    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{payload.prompt}</Text>
            {ExposureImage && exposureImage ? (
                <View style={styles.image}>
                    <ExposureImage input={exposureImage.input} size={240} label={exposureImage.label} />
                    <Text style={styles.caption}>{exposureImage.label}</Text>
                </View>
            ) : null}
            <View style={styles.options}>
                {payload.options.map((option) => {
                    const selected = option.id === selectedOptionId;

                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => { if (!submitted) onSelect(option.id); }}
                            testID={`lesson-option-${option.id}`}
                            accessibilityRole="button"
                            accessibilityLabel={option.label}
                            accessibilityHint={
                                submitted ? 'Resposta já conferida. Leia o feedback e continue.' : selected
                                    ? `Selecionada. Toque em outra alternativa para trocar antes de ${confirmationLabel}.`
                                    : `Seleciona esta resposta. Você confirma em ${confirmationLabel}.`
                            }
                            accessibilityState={{ selected, disabled: submitted }}
                            style={[
                                styles.option,
                                selected && styles.optionSelected,
                            ]}
                        >
                            <View style={styles.optionContent}>
                                <Text style={styles.optionLabel}>{option.label}</Text>
                                {selected ? <Text style={styles.selectionLabel}>Selecionada</Text> : null}
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.s4,
    },
    image: { alignItems: 'center', gap: space.s1 },
    caption: { ...typography.caption, color: galaxy.textSecondary },
    prompt: {
        ...typography.h3,
        color: galaxy.textPrimary,
    },
    options: {
        gap: space.s2,
    },
    option: {
        minHeight: 56,
        justifyContent: 'center',
        backgroundColor: galaxy.surface,
        borderWidth: 1,
        borderColor: galaxy.border,
        borderRadius: radius.rLg,
        padding: space.s3,
    },
    optionSelected: {
        backgroundColor: galaxy.surfaceElevated,
        borderColor: galaxy.statusInformation,
    },
    optionContent: {
        gap: space.s1,
    },
    selectionLabel: {
        ...typography.micro,
        color: galaxy.statusInformation,
    },
    optionLabel: {
        ...typography.body,
        color: galaxy.textPrimary,
    },
});
