import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MultipleChoicePayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

type MultipleChoiceStepRendererProps = {
    payload: MultipleChoicePayload;
    selectedOptionId?: string;
    onSelect: (optionId: string) => void;
};

// Selecionar não confirma: enquanto o passo está na tela, a escolha continua
// trocável e nada foi commitado. Quem confirma é o "Continuar" do rodapé — por
// isso não existe estado travado aqui.
export function MultipleChoiceStepRenderer({
    payload,
    selectedOptionId,
    onSelect,
}: MultipleChoiceStepRendererProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{payload.prompt}</Text>
            <View style={styles.options}>
                {payload.options.map((option) => {
                    const selected = option.id === selectedOptionId;

                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => onSelect(option.id)}
                            testID={`lesson-option-${option.id}`}
                            accessibilityRole="button"
                            accessibilityLabel={option.label}
                            accessibilityHint={
                                selected
                                    ? 'Selecionada. Toque em outra alternativa para trocar antes de continuar.'
                                    : 'Seleciona esta resposta. Você confirma em Continuar.'
                            }
                            accessibilityState={{ selected }}
                            style={[
                                styles.option,
                                selected && styles.optionSelected,
                            ]}
                        >
                            <Text style={styles.optionLabel}>{option.label}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.s3,
    },
    prompt: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    options: {
        gap: space.s2,
    },
    option: {
        backgroundColor: galaxyColors.surface,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        borderRadius: radius.rLg,
        padding: space.s3,
    },
    optionSelected: {
        backgroundColor: galaxyColors.surfaceActive,
        borderColor: galaxy.statusInformation,
    },
    optionLabel: {
        ...typography.body,
        color: galaxyColors.textPrimary,
    },
});
