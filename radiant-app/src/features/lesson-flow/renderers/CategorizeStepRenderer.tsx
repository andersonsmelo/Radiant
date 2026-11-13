import React, { useState } from 'react';
import { Text, View } from 'react-native';
import type { CategorizePayload } from '../../../types/learningActivity';
import { decodeCategorizeValue } from './InteractionAnswerValue';
import { EnterView, TapChip, f2Styles } from './TapChip';

type Props = { payload: CategorizePayload; value?: string; onChange: (value: string) => void; submitted?: boolean; confirmationLabel?: string };

/**
 * Classificar sem arrastar: toca no item e depois no grupo. O item escolhido é
 * só foco visual, não resposta, por isso fica em estado local; a resposta (o
 * mapa item → grupo) sobe ao player. Tocar num item já colocado o devolve.
 */
export function CategorizeStepRenderer({ payload, value, onChange, submitted = false, confirmationLabel = 'Conferir resposta' }: Props) {
    const assigned = decodeCategorizeValue(value);
    const groupIds = new Set(payload.categories.map(category => category.id));
    const pending = payload.items.filter(item => !groupIds.has(assigned[item.id]));
    const [picked, setPicked] = useState<string | null>(null);
    const active = pending.find(item => item.id === picked) ?? pending[0];
    const write = (next: Record<string, string>) => onChange(JSON.stringify(next));
    const put = (groupId: string) => { if (!submitted && active) { write({ ...assigned, [active.id]: groupId }); setPicked(null); } };
    const unput = (itemId: string) => {
        if (submitted) return;
        const next = { ...assigned };
        delete next[itemId];
        write(next);
        setPicked(itemId);
    };

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            {pending.length && !submitted ? (
                <View style={f2Styles.column}>
                    <Text style={f2Styles.section}>Itens para classificar</Text>
                    <View style={f2Styles.wrap}>
                        {pending.map(item => (
                            <TapChip key={item.id} testID={`categorize-item-${item.label}`} label={item.label} selected={item.id === active?.id}
                                accessibilityLabel={`Item: ${item.label}`} accessibilityHint="Escolhe este item; depois toque no grupo." onPress={() => setPicked(item.id)} />
                        ))}
                    </View>
                </View>
            ) : null}
            {payload.categories.map(category => (
                <View key={category.id} style={f2Styles.column}>
                    <TapChip testID={`categorize-group-${category.label}`} label={active && !submitted ? `Colocar em ${category.label}` : category.label}
                        accessibilityLabel={active ? `Colocar ${active.label} em ${category.label}` : `Grupo ${category.label}`}
                        accessibilityHint={active ? `Classifica o item escolhido. Você confirma em ${confirmationLabel}.` : undefined}
                        disabled={submitted || !active} onPress={() => put(category.id)} />
                    <View style={f2Styles.wrap}>
                        {payload.items.filter(item => assigned[item.id] === category.id).map(item => {
                            const right = item.categoryId === category.id;
                            const correctLabel = payload.categories.find(entry => entry.id === item.categoryId)?.label;
                            return (
                                <TapChip key={item.id} label={submitted && !right ? `${item.label} (certo: ${correctLabel})` : item.label} selected
                                    accessibilityLabel={`${item.label}, em ${category.label}${submitted ? (right ? ', certo' : `, errado; o grupo certo é ${correctLabel}`) : ''}`}
                                    accessibilityHint={submitted ? undefined : 'Toque para devolver o item.'}
                                    disabled={submitted} onPress={() => unput(item.id)} verdict={submitted ? (right ? 'correct' : 'incorrect') : undefined} />
                            );
                        })}
                    </View>
                </View>
            ))}
        </EnterView>
    );
}
