import type { CaseDecisionPayload, LearningActivityV2, LearningInteractionV2 } from '../../../types/learningActivity';
import type { EditorialPreviewSession } from '../EditorialPreviewMaterial';

// Engine-only scenario: no patient, clinical instruction, editorial identity or approval.
const chapters: readonly { phase: NonNullable<CaseDecisionPayload['phase']>; context: string; prompt: string; options: readonly [string, string]; feedback: string }[] = [
    { phase: 'decision', context: 'Em um treino fictício, a ficha da peça diz círculo, mas a peça é um quadrado.',
        prompt: 'Como seguir no treino?', options: ['Pedir conferência da ficha', 'Continuar sem conferir'],
        feedback: 'A divergência deve ser conferida antes de continuar o treino.' },
    { phase: 'reason', context: 'A ficha e a peça fictícias continuam diferentes.',
        prompt: 'Qual é o motivo da pausa?', options: ['A descrição não corresponde à peça', 'A cor da mesa mudou'],
        feedback: 'O motivo é a diferença entre a ficha e a peça, sem relação com a cor da mesa.' },
    { phase: 'support', context: 'Neste treino, uma pessoa responsável pode conferir a ficha fictícia.',
        prompt: 'Que apoio solicitar?', options: ['Solicitar a conferência da pessoa responsável', 'Alterar a ficha sem avisar'],
        feedback: 'Solicitar apoio permite conferir a divergência antes de retomar o treino.' },
];
const steps: LearningActivityV2['steps'] = chapters.map(chapter => {
    const id = `interaction:pc06e-synthetic:${chapter.phase}`;
    const interaction: LearningInteractionV2 = {
        id, type: 'case-decision', competencyIds: ['competency:pc06e-synthetic:engine'],
        evidenceKind: 'applied-transfer', criticalSafety: false, completionRule: 'answered',
        accessibility: { label: chapter.prompt },
        feedback: { correct: chapter.feedback, incorrect: chapter.feedback },
        payload: { phase: chapter.phase, context: chapter.context, prompt: chapter.prompt,
            options: chapter.options.map((label, index) => ({ id: `${id}:${index}`, label })), correctOptionId: `${id}:0` },
    };
    return { kind: 'interaction', interaction };
});
export const syntheticCaseSession: EditorialPreviewSession = {
    activity: { id: 'activity:pc06e-synthetic:engine', competencyIds: ['competency:pc06e-synthetic:engine'],
        provenance: { contentVersion: 'pc06e-synthetic-v1', sourceIds: ['source:pc06e-synthetic:engine'] }, steps },
    targetIds: Object.fromEntries(steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, 'activity:pc06e-synthetic:engine']] : [])),
};
