import React from 'react';
import { Text, View } from 'react-native';
import type { ClozePayload } from '../../../types/learningActivity';
import { decodeInteractionIdSequence, encodeInteractionIdSequence } from './InteractionAnswerValue';
import { EnterView, TapChip, f2Styles } from './TapChip';

type Props = { payload: ClozePayload; value?: string; onChange: (value: string) => void; submitted?: boolean; confirmationLabel?: string };

const GAP = '_____';

/**
 * Completar a frase: tocar numa palavra do banco preenche a próxima lacuna, e
 * tocar numa lacuna preenchida devolve a palavra ao banco. A resposta é a lista
 * de palavras na ordem das lacunas; quem confere é o player.
 */
export function ClozeStepRenderer({ payload, value, onChange, submitted = false, confirmationLabel = 'Conferir resposta' }: Props) {
    const tokenIds = new Set(payload.tokens.map(token => token.id));
    // Uma posição por lacuna, '' quando vazia: esvaziar a 1 não empurra a palavra da 2.
    const decoded = decodeInteractionIdSequence(value);
    const filled = payload.blanks.map((_, index) => (tokenIds.has(decoded[index]) && decoded.indexOf(decoded[index]) === index ? decoded[index] : ''));
    const label = (id: string | undefined) => payload.tokens.find(token => token.id === id)?.label;
    const nextEmpty = filled.indexOf('');
    const place = (id: string) => {
        if (submitted || nextEmpty < 0) return;
        onChange(encodeInteractionIdSequence(filled.map((entry, index) => (index === nextEmpty ? id : entry))));
    };
    const clear = (index: number) => { if (!submitted) onChange(encodeInteractionIdSequence(filled.map((entry, at) => (at === index ? '' : entry)))); };
    const sentence = payload.segments.map((segment, index) => index < payload.blanks.length
        ? `${segment}${label(filled[index]) ?? GAP}` : segment).join('');

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            <Text style={f2Styles.body} accessibilityLabel={`Frase: ${sentence.split(GAP).join('lacuna vazia')}`}>{sentence}</Text>
            <View style={f2Styles.column}>
                {payload.blanks.map((blank, index) => {
                    const chosen = label(filled[index]);
                    const right = filled[index] === blank.correctTokenId;
                    return (
                        <TapChip key={blank.id} testID={`cloze-blank-${index + 1}`}
                            label={`Lacuna ${index + 1}: ${chosen ?? 'vazia'}${submitted && !right ? ` (certa: ${label(blank.correctTokenId)})` : ''}`}
                            accessibilityLabel={`Lacuna ${index + 1}: ${chosen ?? 'vazia'}`}
                            accessibilityHint={chosen && !submitted ? 'Toque para devolver a palavra ao banco.' : undefined}
                            selected={Boolean(chosen)} disabled={submitted || !chosen} onPress={() => clear(index)}
                            verdict={submitted ? (right ? 'correct' : 'incorrect') : undefined} />
                    );
                })}
            </View>
            <Text style={f2Styles.section}>Banco de palavras</Text>
            <View style={f2Styles.wrap}>
                {payload.tokens.filter(token => !filled.includes(token.id)).map(token => (
                    <TapChip key={token.id} testID={`cloze-token-${token.label}`} label={token.label}
                        accessibilityLabel={`Usar ${token.label} na lacuna ${nextEmpty + 1}`}
                        accessibilityHint={`Preenche a próxima lacuna. Você confirma em ${confirmationLabel}.`}
                        disabled={submitted || nextEmpty < 0} onPress={() => place(token.id)} />
                ))}
            </View>
        </EnterView>
    );
}
