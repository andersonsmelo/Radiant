import type { LearningActivityV2, LearningInteractionV2 } from '../../types/learningActivity';
import { validateLearningActivity } from '../../types/learningActivity';
import { validateEditorialBatchContract } from '../student-checkpoints/EditorialBatchContract';
import type { EditorialCurriculumCandidateV1 } from '../student-checkpoints/EditorialCurriculumCandidate';

export type EditorialPreviewStage = 'lesson' | 'checkpoint' | 'guided-recovery' | 'different-context-retry';

export type EditorialPreviewInput = Readonly<{
    candidate: EditorialCurriculumCandidateV1;
    checkpointOptionFeedback: readonly Readonly<{ targetId: string; byOptionId: Readonly<Record<string, string>> }>[];
    optionalHelp: Readonly<{ targetId: string; text: string }>;
    recoveryActivities: readonly LearningActivityV2[];
}>;

export type EditorialPreviewSession = Readonly<{
    activity: LearningActivityV2;
    targetIds: Readonly<Record<string, string>>;
    help?: Readonly<{ targetId: string; text: string }>;
}>;

type Result =
    | Readonly<{ ok: true; sessions: Readonly<Record<EditorialPreviewStage, EditorialPreviewSession>> }>
    | Readonly<{ ok: false; issues: readonly string[] }>;

const filled = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const interactions = (activity: LearningActivityV2) => activity.steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);

/** Explicit review input only. No catalog lookup, approval, scoring, persistence or production side effect. */
export function createEditorialPreviewMaterial(raw: unknown): Result {
    try {
        const input = raw as EditorialPreviewInput;
        const candidate = input.candidate;
        const issues = Array.from(validateEditorialBatchContract(candidate));
        if (issues.length) return { ok: false, issues };
        // This first preview covers the one fully authored, text-only lesson.
        if (candidate.activities.length !== 1 || candidate.competencyIds.length !== 1 || candidate.pilot !== undefined
            || interactions(candidate.activities[0]).some(interaction => interaction.type !== 'multiple-choice'))
            return { ok: false, issues: ['unsupported-preview-material'] };
        const lesson = candidate.activities[0];
        const sources = new Set(candidate.sources.map(source => source.id));
        const ids = new Set<string>();
        const identity = (id: string) => {
            if (!/^[a-z]+:rtg-2026:(?:[a-z0-9-]+:)*[a-z0-9-]+$/.test(id)) issues.push('invalid-preview-identity');
            if (ids.has(id)) issues.push('duplicate-preview-identity');
            ids.add(id);
        };
        [candidate.trackId, candidate.unitId, candidate.checkpoint.id, ...candidate.competencyIds, ...candidate.sources.map(source => source.id)].forEach(identity);
        if (!Array.isArray(input.recoveryActivities) || input.recoveryActivities.length !== 2)
            return { ok: false, issues: ['invalid-recovery-cycles'] };
        const recoveryActivities: readonly LearningActivityV2[] = input.recoveryActivities;
        for (const activity of [lesson, ...recoveryActivities]) {
            identity(activity.id);
            if (validateLearningActivity(activity).length || activity.competencyIds.length !== 1
                || activity.competencyIds[0] !== candidate.competencyIds[0]
                || activity.provenance.contentVersion !== candidate.contentVersion
                || !activity.provenance.sourceIds.length || activity.provenance.sourceIds.some(id => !sources.has(id))
                || interactions(activity).length !== 1
                || interactions(activity).some(interaction => interaction.type !== 'multiple-choice'
                    || interaction.completionRule !== 'confirmed' || interaction.competencyIds.length !== 1
                    || interaction.competencyIds[0] !== candidate.competencyIds[0]))
                issues.push('invalid-recovery-material');
            for (const step of activity.steps) {
                if (step.kind === 'presentation') { identity(step.id); continue; }
                identity(step.interaction.id);
                if (step.interaction.type === 'multiple-choice') step.interaction.payload.options.forEach(option => identity(option.id));
            }
        }
        if (interactions(recoveryActivities[0])[0]?.evidenceKind !== 'guided-practice'
            || interactions(recoveryActivities[1])[0]?.evidenceKind !== 'applied-transfer'
            || recoveryActivities.some(activity => interactions(activity).some(interaction => interaction.criticalSafety)))
            issues.push('invalid-recovery-modes');
        if (!filled(input.optionalHelp?.text) || input.optionalHelp.targetId !== lesson.id) issues.push('invalid-preview-help');
        const feedback = input.checkpointOptionFeedback;
        if (!Array.isArray(feedback) || feedback.length !== candidate.checkpoint.items.length)
            return { ok: false, issues: [...issues, 'invalid-checkpoint-option-feedback'] };
        for (const item of candidate.checkpoint.items) {
            identity(item.id); item.options.forEach(option => identity(option.id));
            const entries = feedback.filter(entry => entry.targetId === item.id);
            if (entries.length !== 1 || Object.keys(entries[0].byOptionId).length !== item.options.length
                || item.options.some(option => !filled(entries[0].byOptionId[option.id])))
                issues.push('invalid-checkpoint-option-feedback');
        }
        if (issues.length) return { ok: false, issues };
        const checkpointId = candidate.checkpoint.id;
        const checkpoint: LearningActivityV2 = {
            id: checkpointId.replace(/^checkpoint:/, 'activity:'),
            competencyIds: [...candidate.competencyIds],
            provenance: { sourceIds: candidate.sources.map(source => source.id), contentVersion: candidate.contentVersion },
            steps: [
                { kind: 'presentation', id: checkpointId.replace(/^checkpoint:/, 'step:') + '-check-hook', role: 'hook',
                    payload: { title: 'Avaliação', body: 'Responda cada questão e confirme sua escolha.' } },
                ...candidate.checkpoint.items.map(item => {
                    const byOptionId = feedback.find(entry => entry.targetId === item.id)!.byOptionId;
                    const interaction: LearningInteractionV2 = {
                        id: item.id.replace(/^item:/, 'interaction:'), type: 'multiple-choice',
                        competencyIds: [...item.competencyIds], evidenceKind: 'independent-recall',
                        completionRule: 'confirmed', criticalSafety: false,
                        payload: { prompt: item.prompt, options: item.options.map(option => ({ ...option, explanation: byOptionId[option.id] })),
                            correctOptionId: item.correctOptionId },
                        feedback: { correct: byOptionId[item.correctOptionId], incorrect: item.feedback.incorrect },
                        accessibility: { label: 'Selecione uma alternativa e confirme a resposta.' },
                    };
                    return { kind: 'interaction' as const, interaction };
                }),
                { kind: 'presentation', id: checkpointId.replace(/^checkpoint:/, 'step:') + '-check-closing', role: 'closing',
                    payload: { title: 'Questões conferidas', body: 'Você conferiu as questões desta prévia.' } },
            ],
        };
        identity(checkpoint.id);
        for (const step of checkpoint.steps) identity(step.kind === 'presentation' ? step.id : step.interaction.id);
        if (validateLearningActivity(checkpoint).length) issues.push('invalid-checkpoint-preview');
        if (issues.length) return { ok: false, issues };
        const activitySession = (activity: LearningActivityV2): EditorialPreviewSession => ({
            activity, targetIds: Object.fromEntries(interactions(activity).map(interaction => [interaction.id, activity.id])),
        });
        return { ok: true, sessions: {
            lesson: { ...activitySession(lesson), help: { ...input.optionalHelp } },
            checkpoint: { activity: checkpoint, targetIds: Object.fromEntries(candidate.checkpoint.items.map(item => [item.id.replace(/^item:/, 'interaction:'), item.id])) },
            'guided-recovery': activitySession(input.recoveryActivities[0]),
            'different-context-retry': activitySession(input.recoveryActivities[1]),
        } };
    } catch {
        return { ok: false, issues: ['invalid-preview-shape'] };
    }
}
