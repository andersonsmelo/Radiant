import React from 'react';
import { Text, View } from 'react-native';
import type { MultiSelectPayload } from '../../../types/learningActivity';
import { decodeInteractionIdSequence, encodeInteractionIdSequence } from './InteractionAnswerValue';
import { EnterView, TapChip, f2Styles } from './TapChip';

type Props = { payload: MultiSelectPayload; value?: string; onChange: (value: string) => void; submitted?: boolean; confirmationLabel?: string };

/** Marque todas as corretas. Depois de conferir, cada alternativa diz se faltou ou se sobrou. */
export function MultiSelectStepRenderer({ payload, value, onChange, submitted = false, confirmationLabel = 'Conferir resposta' }: Props) {
    const optionIds = new Set(payload.options.map(option => option.id));
    const chosen = decodeInteractionIdSequence(value).filter((id, index, all) => optionIds.has(id) && all.indexOf(id) === index);
    const toggle = (id: string) => {
        if (submitted) return;
        onChange(encodeInteractionIdSequence(chosen.includes(id) ? chosen.filter(entry => entry !== id) : [...chosen, id]));
    };

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            <Text style={f2Styles.secondary}>Pode haver mais de uma correta.</Text>
            <View style={f2Styles.column}>
                {payload.options.map(option => {
                    const isChosen = chosen.includes(option.id);
                    const isCorrect = payload.correctOptionIds.includes(option.id);
                    const note = !submitted ? '' : isCorrect && !isChosen ? ' (faltou marcar)' : !isCorrect && isChosen ? ' (marcou a mais)' : '';
                    return (
                        <TapChip key={option.id} role="checkbox" testID={`multi-select-${option.label}`} label={`${option.label}${note}`}
                            selected={isChosen} disabled={submitted} onPress={() => toggle(option.id)}
                            accessibilityLabel={`${option.label}${note}`}
                            accessibilityHint={submitted ? undefined : `Marca ou desmarca. Você confirma em ${confirmationLabel}.`}
                            verdict={submitted && (isChosen || isCorrect) ? (isChosen === isCorrect ? 'correct' : 'incorrect') : undefined} />
                    );
                })}
            </View>
        </EnterView>
    );
}
