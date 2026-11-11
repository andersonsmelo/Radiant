import { realEditorialPreview } from '../../test/fixtures/realEditorialPreview';
import { createEditorialPreviewMaterial } from './EditorialPreviewMaterial';

describe('PC06-A real editorial preview material', () => {
    it('preserves the four lesson steps and distinct contexts without promoting anything', () => {
        const input = realEditorialPreview();
        const result = createEditorialPreviewMaterial(input);
        expect(result.ok).toBe(true);
        if (!result.ok) throw Error(result.issues.join(','));
        expect(result.sessions.lesson.activity).toEqual(input.candidate.activities[0]);
        expect(result.sessions['guided-recovery'].activity.id).toBe(input.recoveryActivities[0].id);
        expect(result.sessions['different-context-retry'].activity.id).toBe(input.recoveryActivities[1].id);
        expect(result.sessions.lesson.help?.text).toBe(input.optionalHelp.text);
        expect(input.candidate.promotionState).toBe('human-gates-pending');
        expect(Object.values(input.candidate.approvals)).toEqual(Array(6).fill('pending'));
    });

    it('maps every checkpoint option to its exact authored explanation and original target', () => {
        const input = realEditorialPreview();
        const result = createEditorialPreviewMaterial(input);
        if (!result.ok) throw Error(result.issues.join(','));
        const interactions = result.sessions.checkpoint.activity.steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);
        expect(interactions).toHaveLength(2);
        interactions.forEach((interaction, index) => {
            if (interaction.type !== 'multiple-choice') throw Error('Expected choice');
            const item = input.candidate.checkpoint.items[index];
            expect(result.sessions.checkpoint.targetIds[interaction.id]).toBe(item.id);
            expect(interaction.evidenceKind).toBe('independent-recall');
            expect(interaction.completionRule).toBe('confirmed');
            interaction.payload.options.forEach(option => expect(option.explanation).toBe(input.checkpointOptionFeedback[index].byOptionId[option.id]));
            expect(interaction.feedback.correct).toBe(input.checkpointOptionFeedback[index].byOptionId[item.correctOptionId]);
        });
    });

    it('refuses an incomplete option feedback map instead of using a generic fallback', () => {
        const input = realEditorialPreview();
        const [first, ...rest] = input.checkpointOptionFeedback;
        const entries = Object.entries(first.byOptionId).slice(1);
        expect(createEditorialPreviewMaterial({ ...input, checkpointOptionFeedback: [{ ...first, byOptionId: Object.fromEntries(entries) }, ...rest] }))
            .toMatchObject({ ok: false, issues: expect.arrayContaining(['invalid-checkpoint-option-feedback']) });
    });

    it('refuses feedback from a different item and orphan feedback', () => {
        const input = realEditorialPreview();
        expect(createEditorialPreviewMaterial({ ...input, checkpointOptionFeedback: input.checkpointOptionFeedback.map(entry => ({ ...entry, targetId: 'item:other' })) }).ok).toBe(false);
        expect(createEditorialPreviewMaterial({ ...input, checkpointOptionFeedback: [...input.checkpointOptionFeedback, input.checkpointOptionFeedback[0]] }).ok).toBe(false);
    });

    it('refuses a recovery activity with a reused identity', () => {
        const input = realEditorialPreview();
        const [first, second] = input.recoveryActivities;
        expect(createEditorialPreviewMaterial({ ...input, recoveryActivities: [{ ...first, id: input.candidate.activities[0].id }, second] }))
            .toMatchObject({ ok: false, issues: expect.arrayContaining(['duplicate-preview-identity']) });
    });

    it('refuses recovery with another competency, source, version or missing cycle', () => {
        const input = realEditorialPreview();
        const [first, second] = input.recoveryActivities;
        for (const changed of [
            { ...first, competencyIds: ['competency:other'] },
            { ...first, provenance: { ...first.provenance, sourceIds: ['source:other'] } },
            { ...first, provenance: { ...first.provenance, contentVersion: 'other' } },
        ]) expect(createEditorialPreviewMaterial({ ...input, recoveryActivities: [changed, second] }).ok).toBe(false);
        expect(createEditorialPreviewMaterial({ ...input, recoveryActivities: [first] }).ok).toBe(false);
    });

    it('refuses unbound or empty help', () => {
        const input = realEditorialPreview();
        for (const optionalHelp of [{ ...input.optionalHelp, targetId: 'activity:other' }, { ...input.optionalHelp, text: '' }])
            expect(createEditorialPreviewMaterial({ ...input, optionalHelp }).ok).toBe(false);
    });

    it('refuses swapped recovery modes', () => {
        const input = realEditorialPreview();
        expect(createEditorialPreviewMaterial({ ...input, recoveryActivities: [...input.recoveryActivities].reverse() }).ok).toBe(false);
    });

    it('refuses retired identities in a new recovery context', () => {
        const input = realEditorialPreview();
        expect(createEditorialPreviewMaterial({ ...input, recoveryActivities: input.recoveryActivities.map((activity, index) => index === 0 ? { ...activity, id: 'lesson-1' } : activity) }).ok).toBe(false);
    });

    it('fails closed on missing or malformed input', () => {
        for (const input of [undefined, null, {}, { candidate: {} }])
            expect(createEditorialPreviewMaterial(input).ok).toBe(false);
    });
});
