import { realEditorialPilotEnvelope } from '../../test/fixtures/realEditorialPreview';
import { isAbstractCollimationInteraction } from './AbstractCollimationRenderer';
import { createEditorialPracticeMaterial } from './EditorialPracticeMaterial';

describe('PC06-B opt-in practice material', () => {
    it('accepts all real pilot practices and keeps the full-lot checkpoint gaps unpromoted', () => {
        const candidate = realEditorialPilotEnvelope();
        for (const activity of candidate.activities) {
            const result = createEditorialPracticeMaterial(candidate, activity.id);
            expect(result.ok).toBe(true);
            if (!result.ok) throw Error(result.issues.join(','));
            expect(result.session.activity).toBe(activity);
            expect(result.promotionReady).toBe(false);
            expect(result.coverageGaps).toHaveLength(0);
        }
        expect(candidate.promotionState).toBe('human-gates-pending');
        expect(Object.values(candidate.approvals)).toEqual(Array(6).fill('pending'));
    });

    it('refuses a changed asset digest and an unregistered image location', () => {
        for (const change of [{ sha256: '0'.repeat(64) }, { uri: 'https://example.invalid/not-local.png' }]) {
            const candidate = realEditorialPilotEnvelope();
            const pilot = candidate.pilot!;
            const changed = { ...candidate, pilot: { ...pilot, assets: pilot.assets.map((asset, i) => i ? asset : { ...asset, ...change }) } };
            expect(createEditorialPracticeMaterial(changed, candidate.activities[0].id)).toMatchObject({ ok: false });
        }
    });

    it('refuses missing rubric, supplied approval or unknown activity instead of registering a fallback', () => {
        const candidate = realEditorialPilotEnvelope();
        const pilot = candidate.pilot!;
        expect(createEditorialPracticeMaterial({ ...candidate, pilot: { ...pilot, evidence: [] } }, candidate.activities[0].id).ok).toBe(false);
        expect(createEditorialPracticeMaterial({ ...candidate, approvals: { ...candidate.approvals, product: 'approved' } }, candidate.activities[0].id).ok).toBe(false);
        expect(createEditorialPracticeMaterial(candidate, 'lesson-1').ok).toBe(false);
    });

    it('refuses another bench configuration instead of applying the pilot geometry silently', () => {
        const candidate = realEditorialPilotEnvelope();
        const bench = candidate.activities.find(activity => activity.steps.some(step => step.kind === 'interaction' && step.interaction.type === 'bench'))!;
        const step = bench.steps.find(step => step.kind === 'interaction');
        if (step?.kind !== 'interaction' || step.interaction.type !== 'bench') throw Error('Expected bench');
        expect(isAbstractCollimationInteraction(step.interaction)).toBe(true);
        const changedInteraction = { ...step.interaction, payload: { ...step.interaction.payload, goal: { kind: 'reach' as const, control: 'fieldWidth' as const, atMost: 19 } } };
        expect(isAbstractCollimationInteraction(changedInteraction)).toBe(false);
        const changed = { ...candidate, activities: candidate.activities.map(activity => activity.id === bench.id
            ? { ...activity, steps: activity.steps.map(value => value.kind === 'interaction' ? { kind: 'interaction' as const, interaction: changedInteraction } : value) } : activity) };
        expect(createEditorialPracticeMaterial(changed, bench.id)).toMatchObject({ ok: false, issues: ['unsupported-abstract-scene'] });
    });

    it('fails closed for malformed input and a missing opt-in contract', () => {
        for (const value of [undefined, null, {}, { ...realEditorialPilotEnvelope(), pilot: undefined }])
            expect(createEditorialPracticeMaterial(value, 'activity:rtg-2026:pilot:m06-04-a').ok).toBe(false);
    });
});
