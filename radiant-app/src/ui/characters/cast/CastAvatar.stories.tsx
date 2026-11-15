import type { Meta, StoryObj } from '@storybook/react-native';
import type React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { LessonCastId } from '../../../types/learningActivity';
import { space, typography } from '../../styles';
import { galaxyColors } from '../../theme';
import type { CharacterSize } from '../types';
import { PIXEL_HEAD_SIZE_MAP } from '../PixelIllustration';
import { CastAvatar, CastPortrait } from './CastAvatar';
import { CAST_CANDIDATES } from './castCandidates';
import { CAST_EXPRESSIONS } from './castExpressions';
import { CAST_LOOKS } from './castLooks';
import { CAST } from './castRegistry';

/** Cada linha da grade: quem é e como o avatar o chama. */
const ROWS: { key: string; title: string; speaker: LessonCastId; name?: string }[] = [
    { key: 'pixel', title: CAST.pixel.displayName, speaker: 'pixel' },
    { key: 'lia', title: CAST.lia.displayName, speaker: 'lia' },
    { key: 'caio', title: CAST.caio.displayName, speaker: 'caio' },
    { key: 'duda', title: CAST.duda.displayName, speaker: 'duda' },
    { key: 'seu', title: 'Seu Jorge', speaker: 'paciente', name: 'Seu Jorge' },
    { key: 'dona', title: 'Dona Marta', speaker: 'paciente', name: 'Dona Marta' },
];

/**
 * A grade elenco × expressão da bíblia de 2026-11-13: `sm` é o avatar da fala
 * na cena de diálogo; `lg`, o do retorno. Todo personagem novo entra aqui antes
 * de entrar numa aula.
 */
/** Em `sm` a legenda fica numa linha só, no topo; nos maiores, embaixo de cada retrato. */
function Cell({ expression, size, children }: { expression: string; size: CharacterSize; children: React.ReactNode }) {
    return (
        <View style={[styles.cell, { width: PIXEL_HEAD_SIZE_MAP[size] }]}>
            {children}
            {size === 'sm' ? null : <Text style={styles.caption}>{expression}</Text>}
        </View>
    );
}

function CastGrid({ size }: { size: CharacterSize }) {
    return (
        <ScrollView style={styles.grid} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{size === 'lg' ? 'Retorno (lg, 96 pt)' : `Fala (${size}, ${PIXEL_HEAD_SIZE_MAP[size]} pt)`}</Text>
            {size === 'sm' ? <Text style={styles.caption}>{`Da esquerda para a direita: ${CAST_EXPRESSIONS.join(', ')}.`}</Text> : null}
            {ROWS.map((row) => (
                <View key={row.key} style={styles.block}>
                    <Text style={styles.name}>{row.title}</Text>
                    <View style={styles.row}>
                        {CAST_EXPRESSIONS.map((expression) => (
                            <Cell key={expression} expression={expression} size={size}>
                                <CastAvatar speaker={row.speaker} name={row.name} expression={expression} size={size} />
                            </Cell>
                        ))}
                    </View>
                </View>
            ))}
            <Text style={styles.title}>Candidatos (fora das aulas até a decisão)</Text>
            {CAST_CANDIDATES.map((candidate) => (
                <View key={candidate.look} style={styles.block}>
                    <Text style={styles.name}>{`${candidate.displayName}, ${candidate.role}`}</Text>
                    <View style={styles.row}>
                        {CAST_EXPRESSIONS.map((expression) => (
                            <Cell key={expression} expression={expression} size={size}>
                                <View style={styles.plate} accessible accessibilityRole="image"
                                    accessibilityLabel={`${candidate.displayName}, ${candidate.role}, ${expression}`}>
                                    <CastPortrait look={CAST_LOOKS[candidate.look]} expression={expression} size={size} />
                                </View>
                            </Cell>
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const meta = {
    title: 'Personagens/Elenco',
    component: CastGrid,
    args: { size: 'sm' },
    argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof CastGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GradeDaFala: Story = { args: { size: 'sm' } };

export const GradeDoRetorno: Story = { args: { size: 'lg' } };

const styles = StyleSheet.create({
    grid: { flex: 1, backgroundColor: galaxyColors.background },
    content: { gap: space.s3, padding: space.s3 },
    title: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textPrimary },
    block: { gap: space.s1 },
    name: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
    cell: { alignItems: 'center', gap: space.s0 },
    caption: { ...typography.micro, lineHeight: undefined, color: galaxyColors.textSecondary },
    plate: { backgroundColor: galaxyColors.surfaceActive, borderRadius: 999, overflow: 'hidden' },
});
