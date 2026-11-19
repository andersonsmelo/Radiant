import React from 'react';
import { AccessibilityInfo, Platform, StyleSheet, Text, View } from 'react-native';
import type { BenchControl, ParameterLabPayload } from '../../../types/learningActivity';
import { DiagramView } from '../../../ui/diagrams/DiagramView';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { BenchControlRow } from '../../bench/BenchControlRow';
import { LAB_MODELS } from '../../parameter-lab/labModels';

type Props = {
    payload: ParameterLabPayload;
    /** O valor do controle como texto; sem ele, o controle mostra `start` e a interação segue incompleta. */
    value?: string;
    onChange: (value: string) => void;
    submitted?: boolean;
};

/**
 * Laboratório de parâmetros: o desenho e as leituras acompanham o controle. A
 * resposta só existe depois do primeiro ajuste, para o ponto de partida não
 * valer como resposta. O desenho é decorativo; as leituras em texto carregam a
 * informação, e são anunciadas a cada ajuste (região viva no Android, anúncio no iOS).
 */
export function ParameterLabStepRenderer({ payload, value, onChange, submitted = false }: Props) {
    const model = LAB_MODELS[payload.model];
    const parsed = value === undefined ? Number.NaN : Number(value);
    const current = Number.isFinite(parsed) ? parsed : payload.start;
    const readouts = model.readouts(current).map(readout => `${readout.label}: ${readout.value}`);
    // O `id` só serve de testID do deslizante: a linha de controle é a da bancada e tipa o id pelos controles dela.
    const control = { id: payload.model, ...model.parameter, initial: payload.start } as unknown as BenchControl;

    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{payload.prompt}</Text>
            <View style={styles.figure}>
                <DiagramView id={model.diagramId} progress={model.progress(current)} decorative />
            </View>
            <View testID="parameter-lab-readouts" accessibilityLiveRegion="polite" style={styles.readouts}>
                {readouts.map(text => <Text key={text} style={styles.readout}>{text}</Text>)}
            </View>
            <View style={styles.controls}>
                <BenchControlRow
                    control={control}
                    value={current}
                    disabled={submitted}
                    onChange={next => {
                        onChange(String(next));
                        if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(model.readouts(next).map(readout => `${readout.label}: ${readout.value}`).join('. '));
                    }}
                />
            </View>
        </View>
    );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
    activity: { gap: space.s3 },
    prompt: { ...typography.h3, color: galaxyColors.textPrimary },
    figure: { alignItems: 'center' },
    readouts: { gap: space.s1 },
    readout: { ...typography.bodyStrong, color: galaxy.statusInformation },
    controls: {
        padding: space.s3,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxy.border,
        backgroundColor: galaxyColors.surface,
    },
});
