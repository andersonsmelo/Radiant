import React, { useState } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LabelPayload } from '../../../types/learningActivity';
import { semanticColors } from '../../../ui/semantic-colors';
import { VerdictIcon } from '../../../ui/components/VerdictIcons';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { InteractionFigure, isFigureAvailable } from './InteractionFigure';
import type { InteractionImageResolver } from './InteractionImageSource';
import { decodeCategorizeValue } from './InteractionAnswerValue';
import { touchRect } from './hotspotTouch';
import { EnterView, TapChip, f2Styles } from './TapChip';

type Props = {
    payload: LabelPayload;
    accessibilityLabel: string;
    value?: string;
    onChange: (value: string) => void;
    resolveImageSource?: InteractionImageResolver;
    submitted?: boolean;
    confirmationLabel?: string;
};

/** O que o aluno tem na mão: uma ficha ou um ponto, à espera do outro toque. É foco, não resposta. */
type Focus = { kind: 'label' | 'point'; id: string } | null;

const MARKER = 28;

/**
 * Rotular sem arrastar: toca na ficha e depois no ponto, ou no ponto e depois na
 * ficha. Tocar num ponto rotulado devolve a ficha ao banco. A resposta (o mapa
 * ponto → rótulo) sobe ao player; o foco fica aqui.
 */
export function LabelStepRenderer({ payload, accessibilityLabel, value, onChange, resolveImageSource, submitted = false, confirmationLabel = 'Conferir resposta' }: Props) {
    const [focus, setFocus] = useState<Focus>(null);
    if (!isFigureAvailable(payload.imageRef, resolveImageSource)) return <Text>Imagem indisponível para esta atividade.</Text>;

    const pointIds = new Set(payload.points.map(point => point.id));
    const labelIds = new Set(payload.labels.map(entry => entry.id));
    const assigned = Object.fromEntries(Object.entries(decodeCategorizeValue(value)).filter(([pointId, labelId]) => pointIds.has(pointId) && labelIds.has(labelId)));
    const textOf = (labelId: string) => payload.labels.find(entry => entry.id === labelId)?.label ?? '';
    const placed = new Set(Object.values(assigned));
    const bank = payload.labels.filter(entry => !placed.has(entry.id));
    const write = (next: Record<string, string>) => onChange(JSON.stringify(next));
    // Grava o rótulo no ponto e o anuncia: quem ouve não vê a ficha cair no lugar.
    const put = (pointId: string, labelId: string) => {
        write({ ...assigned, [pointId]: labelId });
        AccessibilityInfo.announceForAccessibility(`Ponto ${payload.points.findIndex(point => point.id === pointId) + 1}: ${textOf(labelId)}`);
        setFocus(null);
    };
    const focusedPoint = focus?.kind === 'point' ? payload.points.findIndex(point => point.id === focus.id) + 1 : 0;

    const pressPoint = (pointId: string) => {
        if (submitted) return;
        if (assigned[pointId] && focus?.kind === 'label') {
            // Troca: a ficha nova entra e a antiga volta ao banco, que é o que sobra fora do mapa.
            put(pointId, focus.id);
        } else if (assigned[pointId]) {
            const { [pointId]: returned, ...rest } = assigned;
            write(rest);
            setFocus({ kind: 'label', id: returned });
        } else if (focus?.kind === 'label') {
            put(pointId, focus.id);
        } else setFocus(focus?.id === pointId ? null : { kind: 'point', id: pointId });
    };
    const pressChip = (labelId: string) => {
        if (submitted) return;
        if (focus?.kind === 'point') {
            put(focus.id, labelId);
        } else setFocus(focus?.id === labelId ? null : { kind: 'label', id: labelId });
    };
    const verdictOf = (pointId: string, correctLabelId: string) => (submitted ? (assigned[pointId] === correctLabelId ? 'correct' : 'incorrect') : undefined);

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            <Text style={f2Styles.secondary}>Toque numa ficha e depois no ponto, ou no ponto e depois na ficha.</Text>
            <InteractionFigure
                imageRef={payload.imageRef}
                // O rótulo da interação vale também para o diagrama: a descrição dele nomearia as partes e entregaria a resposta.
                alt={accessibilityLabel}
                resolveImage={resolveImageSource}
            >
                {frame => payload.points.map((point, index) => {
                    const verdict = verdictOf(point.id, point.correctLabelId);
                    const current = assigned[point.id];
                    const selected = focus?.kind === 'point' && focus.id === point.id;
                    const spoken = `Ponto ${index + 1}, ${point.where}, ${current ? `rótulo ${textOf(current)}` : 'sem rótulo'}`
                        + (verdict === 'correct' ? ', certo' : verdict === 'incorrect' ? `, errado; o rótulo certo é ${textOf(point.correctLabelId)}` : '');
                    return (
                        <Pressable
                            key={point.id}
                            testID={`label-point-${index + 1}`}
                            onPress={() => pressPoint(point.id)}
                            disabled={submitted}
                            accessibilityRole="button"
                            accessibilityLabel={spoken}
                            accessibilityHint={submitted ? 'Resposta já conferida. Leia o retorno e continue.' : current ? 'Toque para devolver a ficha.' : `Põe a ficha escolhida neste ponto. Você confirma em ${confirmationLabel}.`}
                            accessibilityState={{ selected, ...(submitted ? { disabled: true } : {}) }}
                            // Alvo de 44 pt centrado no ponto: a mesma conta da régua do verificador.
                            style={[styles.target, touchRectStyle(point, frame)]}
                        >
                            <View style={[styles.marker, (selected || current) && styles.markerOn, selected && styles.markerFocus]}>
                                <Text style={styles.markerNumber}>{index + 1}</Text>
                                {verdict ? <VerdictIcon verdict={verdict} size={16} testID={`label-point-verdict-${verdict}`} /> : null}
                            </View>
                        </Pressable>
                    );
                })}
            </InteractionFigure>

            {/* O que cada ponto leva, em texto; o leitor de tela já ouve isso no próprio ponto. */}
            <View style={f2Styles.column} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                {payload.points.map((point, index) => (
                    <Text key={point.id} style={f2Styles.body}>{`${index + 1}. ${assigned[point.id] ? textOf(assigned[point.id]) : 'sem rótulo'}`}</Text>
                ))}
            </View>

            {bank.length && !submitted ? (
                <View style={f2Styles.column}>
                    <Text style={f2Styles.section}>Rótulos</Text>
                    <View style={f2Styles.wrap}>
                        {bank.map(entry => (
                            <TapChip key={entry.id} testID={`label-chip-${entry.label}`} label={entry.label} selected={focus?.kind === 'label' && focus.id === entry.id}
                                accessibilityLabel={`Rótulo ${entry.label}`}
                                accessibilityHint={focusedPoint ? `Põe esta ficha no ponto ${focusedPoint}. Você confirma em ${confirmationLabel}.` : `Escolhe esta ficha; depois toque no ponto. Você confirma em ${confirmationLabel}.`}
                                onPress={() => pressChip(entry.id)} />
                        ))}
                    </View>
                </View>
            ) : null}
        </EnterView>
    );
}

function touchRectStyle(point: { x: number; y: number }, frame: { width: number; height: number }) {
    const { left, top, width, height } = touchRect(point, frame);
    return { left, top, width, height };
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
    target: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
    marker: {
        minWidth: MARKER,
        height: MARKER,
        paddingHorizontal: space.s1,
        borderRadius: radius.rMd,
        borderWidth: 2,
        borderColor: galaxy.statusInformation,
        backgroundColor: galaxyColors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space.s1,
    },
    markerOn: { borderColor: galaxy.statusSuccess },
    markerFocus: { borderWidth: 3, borderColor: galaxy.reward },
    markerNumber: { ...typography.bodyStrong, color: galaxy.textPrimary },
});
