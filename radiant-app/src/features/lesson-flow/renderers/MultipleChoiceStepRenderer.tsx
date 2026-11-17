import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChoiceOption, type ChoiceOptionState } from '../../../components/ui/ChoiceOption';
import type { ExposureReadingImage } from '../../../types/learningActivity';
import type { MultipleChoicePayload } from '../../../types/lessonFlow';
import { semanticColors } from '../../../ui/semantic-colors';
import { space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

type MultipleChoiceStepRendererProps = {
    payload: MultipleChoicePayload;
    exposureImage?: ExposureReadingImage;
    selectedOptionId?: string;
    onSelect: (optionId: string) => void;
    confirmationLabel?: string;
    submitted?: boolean;
    /** Lido só depois de conferir; sem ele, vale o do próprio `payload`. */
    correctOptionId?: string;
    /** Posição da alternativa escolhida, relativa a este renderer: a aula rola até ela. */
    onChosenLayout?: (layout: { y: number; height: number }) => void;
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
    correctOptionId = payload.correctOptionId,
    onChosenLayout,
}: MultipleChoiceStepRendererProps) {
    // A lista e cada alternativa medem à parte; a escolhida soma as duas.
    const optionsY = useRef<number | null>(null);
    const optionLayouts = useRef(new Map<string, { y: number; height: number }>());
    const reportChosen = useCallback(() => {
        const chosen = selectedOptionId ? optionLayouts.current.get(selectedOptionId) : undefined;
        if (chosen && optionsY.current !== null) onChosenLayout?.({ y: optionsY.current + chosen.y, height: chosen.height });
    }, [onChosenLayout, selectedOptionId]);
    useEffect(reportChosen, [reportChosen]);
    // Mesmo limite lazy da bancada: atividades sem imagem não carregam Skia.
    // A migração global dos dublês/imports pertence à T04a.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ExposureImage = exposureImage ? (require('../../bench/ExposureImage') as typeof import('../../bench/ExposureImage')).ExposureImage : null;
    return (
        <View style={styles.stack}>
            <Text style={styles.prompt}>{payload.prompt}</Text>
            {ExposureImage && exposureImage ? (
                <View style={styles.image}>
                    <ExposureImage input={exposureImage.input} size={240} label={exposureImage.label} />
                    <Text style={styles.caption}>{exposureImage.label}</Text>
                </View>
            ) : null}
            <View testID="multiple-choice-options" style={styles.options}
                onLayout={event => { optionsY.current = event.nativeEvent.layout.y; reportChosen(); }}>
                {payload.options.map((option) => {
                    const selected = option.id === selectedOptionId;
                    const state: ChoiceOptionState = !submitted
                        ? (selected ? 'selected' : 'idle')
                        : option.id === correctOptionId ? 'correct' : selected ? 'incorrect' : 'dimmed';

                    return (
                        <ChoiceOption
                            key={option.id}
                            label={option.label}
                            state={state}
                            chosen={selected}
                            disabled={submitted}
                            onPress={() => { if (!submitted) onSelect(option.id); }}
                            testID={`lesson-option-${option.id}`}
                            onLayout={event => {
                                const { y, height } = event.nativeEvent.layout;
                                optionLayouts.current.set(option.id, { y, height });
                                if (selected) reportChosen();
                            }}
                            accessibilityHint={
                                submitted ? 'Resposta já conferida. Leia o feedback e continue.' : selected
                                    ? `Selecionada. Toque em outra alternativa para trocar antes de ${confirmationLabel}.`
                                    : `Seleciona esta resposta. Você confirma em ${confirmationLabel}.`
                            }
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    stack: {
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
});
