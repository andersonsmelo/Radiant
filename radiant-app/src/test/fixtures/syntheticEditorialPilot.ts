import type { LearningActivityV2, LearningInteractionV2 } from '../../types/learningActivity';
import type { ClaimProvenanceV1 } from '../../features/student-checkpoints/EditorialCurriculumCandidate';

/** Synthetic contract data only; never register this fixture as student content. */
export function syntheticEditorialPilot() {
    const id = (kind: string, name: string) => `${kind}:rtg-2026:synthetic:${name}`;
    const sourceIds = [id('source', 'facts')];
    const uri = 'https://example.invalid/synthetic-diagram.svg';
    const secondUri = 'https://example.invalid/synthetic-comparison.svg';
    const feedback = { correct: 'Synthetic result accepted.', incorrect: 'Synthetic result needs another attempt.' };
    const types = ['multiple-choice', 'ordering', 'hotspot', 'comparison', 'bench'] as const;
    const claims: ClaimProvenanceV1[] = [];
    const claim = (claimId: string, claimKind: ClaimProvenanceV1['claimKind'], distractor = false) => claims.push({
        claimId, claimKind, provenanceKind: distractor ? 'authorial-distractor' : 'source-backed', sourceIds: distractor ? [] : sourceIds,
    });
    const activities: LearningActivityV2[] = types.map(type => {
        const activityId = id('activity', type);
        const options = ['a', 'b'].map(name => ({ id: id('option', `${type}-${name}`), label: `Synthetic ${name}`,
            ...(type === 'comparison' ? { imageRef: name === 'a' ? uri : secondUri } : {}) }));
        const common = { id: id('interaction', type), competencyIds: [id('competency', 'shape')],
            evidenceKind: 'guided-practice' as const, completionRule: 'confirmed' as const,
            criticalSafety: type === 'ordering', feedback, accessibility: { label: 'Synthetic control' } };
        const prompt = 'Select the requested synthetic state.';
        let interaction: LearningInteractionV2;
        switch (type) {
            case 'multiple-choice': case 'comparison':
                interaction = { ...common, type, payload: { prompt, options, correctOptionId: options[0].id } };
                options.forEach((option, i) => claim(option.id, i ? 'distractor' : 'correct-answer', i !== 0));
                break;
            case 'ordering': {
                const items = options.map(({ id, label }) => ({ id, label }));
                interaction = { ...common, type, payload: { prompt, items, correctOrder: items.map(item => item.id) } };
                items.forEach(item => claim(item.id, 'prompt'));
                claim(`${activityId}:answer`, 'correct-answer');
                break;
            }
            case 'hotspot': {
                const regions = options.map((option, i) => ({ id: option.id, label: option.label, x: i * 0.5, y: 0, width: 0.4, height: 0.4 }));
                interaction = { ...common, type, payload: { prompt, imageRef: uri, regions, correctRegionIds: [regions[0].id] } };
                regions.forEach(region => claim(region.id, 'prompt'));
                claim(`${activityId}:answer`, 'correct-answer');
                break;
            }
            case 'bench':
                interaction = { ...common, type, payload: { prompt, simulator: 'collimation', mode: 'challenge',
                    controls: [{ id: 'fieldWidth', label: 'Synthetic width', unit: '%', min: 10, max: 100, step: 1, initial: 80 }],
                    goal: { kind: 'reach', control: 'fieldWidth', atMost: 50 }, phantomLabel: 'Synthetic model',
                    hints: { tooLow: 'Synthetic lower boundary.', tooHigh: 'Synthetic upper boundary.' } } };
                claim(`${activityId}:answer`, 'correct-answer');
                claim(`${activityId}:model`, 'feedback');
                break;
        }
        claim(`${activityId}:prompt`, 'prompt');
        claim(`${activityId}:feedback:correct`, 'feedback');
        claim(`${activityId}:feedback:incorrect`, 'feedback');
        const hook = id('step', `${type}-hook`);
        const closing = id('step', `${type}-closing`);
        claim(`${hook}:presentation`, 'prompt');
        claim(`${closing}:presentation`, 'prompt');
        return { id: activityId, competencyIds: [id('competency', 'shape')], provenance: { sourceIds, contentVersion: 'rtg-2026-synthetic.v1' },
            steps: [{ kind: 'presentation', id: hook, role: 'hook', payload: { title: 'Synthetic task' } },
                { kind: 'interaction', interaction }, { kind: 'presentation', id: closing, role: 'closing', payload: { title: 'Synthetic finish' } }] };
    });
    const items = [0, 1].map(index => {
        const itemId = id('item', `check-${index}`);
        const options = ['a', 'b'].map(name => ({ id: id('option', `check-${index}-${name}`), label: `Synthetic ${name}` }));
        claim(`${itemId}:prompt`, 'prompt');
        options.forEach((option, i) => claim(option.id, i === index ? 'correct-answer' : 'distractor', i !== index));
        claim(`${itemId}:feedback:correct`, 'feedback'); claim(`${itemId}:feedback:incorrect`, 'feedback');
        return { id: itemId, competencyIds: [id('competency', 'shape')], sourceIds, prompt: 'Synthetic check.', options,
            correctOptionId: options[index].id, feedback };
    });
    const license = { label: 'CC BY 4.0' as const, url: 'https://creativecommons.org/licenses/by/4.0/' as const };
    const evidence = [...activities, ...items].map(target => {
        const type = activities.find(activity => activity.id === target.id)?.steps.find(step => step.kind === 'interaction');
        const family = type?.kind === 'interaction' ? type.interaction.type : 'multiple-choice';
        const responseMode = family === 'hotspot' ? 'region-list' as const : family === 'ordering' ? 'order-buttons' as const
            : family === 'bench' ? 'increment-buttons' as const : 'choice-buttons' as const;
        return { targetId: target.id, variantId: id('variant', target.id.split(':').at(-1)!), successCriterion: 'Match the synthetic target.',
            criticalErrors: ['Synthetic critical barrier.'], accessibleAlternative: 'Use the synthetic labeled buttons.', responseMode, sourceIds,
            ...(family === 'bench' ? { modelLimits: 'Synthetic qualitative model; no clinical inference.' } : {}) };
    });
    return { schemaVersion: 1 as const, promotionState: 'human-gates-pending' as const,
        trackId: id('track', 'core'), unitId: id('unit', 'pilot'), contentVersion: 'rtg-2026-synthetic.v1',
        competencyIds: [id('competency', 'shape')], sources: [{ id: sourceIds[0], title: 'Synthetic source', attribution: 'Synthetic author',
            url: 'https://example.invalid/synthetic-source', license, accessedAt: '2026-11-03', retrievedMaterialSha256: 'a'.repeat(64), adaptationNotice: 'Synthetic fixture only.' }],
        activities, checkpoint: { id: id('checkpoint', 'pilot'), targetScoreBasisPoints: 8000 as const, items },
        reinforcement: { cycles: [{ cycle: 1 as const, mode: 'guided-recovery' as const }, { cycle: 2 as const, mode: 'different-context-retry' as const }] as const },
        approvals: { technical: 'pending' as const, editorial: 'pending' as const, accessibility: 'pending' as const,
            rights: 'pending' as const, schema: 'pending' as const, product: 'pending' as const }, claimProvenance: claims,
        pilot: { schemaVersion: 1 as const, namespace: 'rtg-2026' as const,
            assets: [uri, secondUri].map((assetUri, i) => ({ id: id('asset', `diagram-${i}`), kind: 'authorial-diagram' as const, uri: assetUri, author: 'Synthetic author',
                attribution: 'Synthetic diagram, fixture only.', authorshipRef: 'https://example.invalid/synthetic-authorship',
                sha256: (i === 0 ? 'b' : 'c').repeat(64), license, sourceIds })), evidence } };
}
