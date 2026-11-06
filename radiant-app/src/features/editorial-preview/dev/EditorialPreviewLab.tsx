import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../../components/ui/AppButton';
import { galaxyColors } from '../../../ui/theme';
import { layout, space, typography } from '../../../ui/styles';
import { ContentUpdatedScreen } from '../../content/components/ContentUpdatedScreen';
import { EditorialLessonPreview, EditorialPreviewSessionView } from '../EditorialLessonPreview';
import { EditorialPracticePreview } from '../EditorialPracticePreview';
import type { EditorialPreviewStage } from '../EditorialPreviewMaterial';
import { lessonMaterial, practiceMaterial } from './EditorialPreviewLabMaterial';
import { syntheticCaseSession } from './SyntheticCasePreview';

type Selection = { kind: 'lesson'; stage: EditorialPreviewStage } | { kind: 'practice'; activityId: string } | { kind: 'case' } | { kind: 'retired'; review: boolean };
const stages: readonly { stage: EditorialPreviewStage; label: string }[] = [
    { stage: 'lesson', label: 'M01.01 · Aula e ajuda' },
    { stage: 'checkpoint', label: 'M01.01 · Avaliação' },
    { stage: 'guided-recovery', label: 'M01.01 · Recuperação guiada' },
    { stage: 'different-context-retry', label: 'M01.01 · Tentativa em outro contexto' },
];
const practices = [
    { id: 'm01-02-a', label: 'Q5 · Ordenar etapas' },
    { id: 'm02-01-a', label: 'Q2 · Regiões na vista de frente' },
    { id: 'm02-01-b', label: 'Q2 · Regiões na vista de costas' },
    { id: 'm02-02-a', label: 'Q3 · Comparar diagramas' },
    { id: 'm06-04-a', label: 'Q4 · Campo abstrato' },
];

/** Ephemeral reviewer host: it never imports a store, economy or lesson-flow screen. */
export default function EditorialPreviewLab() {
    const [selection, setSelection] = useState<Selection | null>(null);
    const { fontScale } = useWindowDimensions();
    return <SafeAreaView style={[layout.screen, styles.background]}>
        {selection ? <View style={styles.toolbar}>
            <AppButton label="Voltar às prévias" variant="secondary" onPress={() => setSelection(null)} />
        </View> : null}
        {selection?.kind === 'lesson' ? <EditorialLessonPreview material={lessonMaterial} stage={selection.stage} />
            : selection?.kind === 'practice' ? <EditorialPracticePreview material={practiceMaterial} activityId={selection.activityId} />
                : selection?.kind === 'case' ? <View style={layout.screen}>
                    <Text key={`synthetic-${fontScale}`} style={styles.note}>Cenário sintético para testar o motor. Não é uma aula aprovada.</Text>
                    <EditorialPreviewSessionView session={syntheticCaseSession} stage="practice" />
                </View>
                    : selection?.kind === 'retired' ? <ContentUpdatedScreen review={selection.review} />
                        : <ScrollView contentContainerStyle={[layout.container, styles.menu]}>
                            <Text key={`title-${fontScale}`} accessibilityRole="header" style={styles.title}>Prévias do conteúdo · PC06-E</Text>
                            <Text key={`note-${fontScale}`} style={styles.note}>Ambiente local de revisão. As respostas são descartadas ao sair. Sem progresso, XP, vidas ou aprovações.</Text>
                            {stages.map(({ stage, label }) => <AppButton key={stage} label={label} variant="secondary"
                                onPress={() => setSelection({ kind: 'lesson', stage })} />)}
                            {practices.map(({ id, label }) => <AppButton key={id} label={label} variant="secondary"
                                onPress={() => setSelection({ kind: 'practice', activityId: `activity:rtg-2026:pilot:${id}` })} />)}
                            <AppButton label="Q6 · Minicaso sintético" variant="secondary" onPress={() => setSelection({ kind: 'case' })} />
                            <AppButton label="Aviso de aula retirada" variant="secondary" onPress={() => setSelection({ kind: 'retired', review: false })} />
                            <AppButton label="Aviso de revisão indisponível" variant="secondary" onPress={() => setSelection({ kind: 'retired', review: true })} />
                        </ScrollView>}
    </SafeAreaView>;
}
const styles = StyleSheet.create({
    background: { backgroundColor: galaxyColors.background },
    toolbar: { padding: space.s2 },
    menu: { gap: space.s3, paddingVertical: space.s4 },
    title: { ...typography.h3, color: galaxyColors.textPrimary },
    note: { ...typography.bodyRegular, color: galaxyColors.textSecondary, padding: space.s2 },
});
