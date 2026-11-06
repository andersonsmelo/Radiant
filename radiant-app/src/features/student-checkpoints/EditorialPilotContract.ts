import type { LearningActivityV2, LearningInteractionV2 } from '../../types/learningActivity';
import type { ClaimProvenanceV1, EditorialCurriculumCandidateV1, EditorialSourceV1 } from './EditorialCurriculumCandidate';

export type EditorialDiagramAssetV1 = Readonly<{
    id: string;
    kind: 'authorial-diagram';
    uri: string;
    author: string;
    attribution: string;
    authorshipRef: string;
    sha256: string;
    license: EditorialSourceV1['license'];
    sourceIds: readonly string[];
}>;

export type EditorialPilotContractV1 = Readonly<{
    schemaVersion: 1;
    namespace: 'rtg-2026';
    assets: readonly EditorialDiagramAssetV1[];
    evidence: readonly Readonly<{
        targetId: string;
        variantId: string;
        successCriterion: string;
        criticalErrors: readonly string[];
        accessibleAlternative: string;
        responseMode: 'choice-buttons' | 'region-list' | 'order-buttons' | 'increment-buttons';
        sourceIds: readonly string[];
        modelLimits?: string;
    }>[];
}>;

export const PILOT_ACTIVITY_FAMILIES = ['multiple-choice', 'ordering', 'hotspot', 'comparison', 'bench'] as const;
const filled = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const https = (value: string) => { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; } };

export function pilotResponseIds(interaction: LearningInteractionV2): string[] {
    switch (interaction.type) {
        case 'multiple-choice': case 'comparison': return interaction.payload.options.map(option => option.id);
        case 'ordering': return interaction.payload.items.map(item => item.id);
        case 'hotspot': return interaction.payload.regions.map(region => region.id);
        default: return [];
    }
}

/** Expected claims derive from the actual authored activity, never a parallel answer key. */
export function pilotActivityClaims(activity: LearningActivityV2): ClaimProvenanceV1[] {
    const claims: ClaimProvenanceV1[] = [];
    const add = (claimId: string, claimKind: ClaimProvenanceV1['claimKind'], distractor = false) => claims.push({
        claimId, claimKind, provenanceKind: distractor ? 'authorial-distractor' : 'source-backed',
        sourceIds: distractor ? [] : activity.provenance.sourceIds,
    });
    for (const step of activity.steps) {
        if (step.kind === 'presentation') { add(`${step.id}:presentation`, 'prompt'); continue; }
        const interaction = step.interaction;
        add(`${activity.id}:prompt`, 'prompt');
        add(`${activity.id}:feedback:correct`, 'feedback');
        add(`${activity.id}:feedback:incorrect`, 'feedback');
        switch (interaction.type) {
            case 'multiple-choice': case 'comparison':
                interaction.payload.options.forEach(option => add(option.id,
                    option.id === interaction.payload.correctOptionId ? 'correct-answer' : 'distractor',
                    option.id !== interaction.payload.correctOptionId));
                break;
            case 'ordering': case 'hotspot':
                pilotResponseIds(interaction).forEach(id => add(id, 'prompt'));
                add(`${activity.id}:answer`, 'correct-answer');
                break;
            case 'bench':
                add(`${activity.id}:answer`, 'correct-answer');
                add(`${activity.id}:model`, 'feedback');
                break;
        }
    }
    return claims;
}

export function validateEditorialPilotContract(candidate: EditorialCurriculumCandidateV1): string[] {
    const pilot = candidate.pilot!;
    const issues: string[] = [];
    const add = (code: string, id?: string) => issues.push(id ? `${code}:${id}` : code);
    if (pilot.schemaVersion !== 1 || pilot.namespace !== 'rtg-2026') add('invalid-pilot-envelope');
    const identities = new Set<string>();
    const identity = (value: string) => {
        if (!/^[a-z-]+:rtg-2026:[a-z0-9-]+(?::[a-z0-9-]+)*$/.test(value)) add('invalid-pilot-identity', value);
        if (identities.has(value)) add('duplicate-pilot-identity', value);
        identities.add(value);
    };
    [candidate.trackId, candidate.unitId, candidate.checkpoint.id, ...candidate.competencyIds,
        ...candidate.sources.map(source => source.id)].forEach(identity);
    if (!/^rtg-2026-[a-z0-9.-]+$/.test(candidate.contentVersion)) add('invalid-pilot-version');
    const sourceIds = new Set(candidate.sources.map(source => source.id));
    const sources = (ids: readonly string[]) => ids.length > 0 && new Set(ids).size === ids.length && ids.every(id => sourceIds.has(id));
    const assets = new Map<string, EditorialDiagramAssetV1>();
    for (const asset of pilot.assets) {
        identity(asset.id);
        if (assets.has(asset.uri)) add('duplicate-pilot-asset', asset.id);
        assets.set(asset.uri, asset);
        if (asset.kind !== 'authorial-diagram' || !https(asset.uri) || !https(asset.authorshipRef)
            || !filled(asset.author) || !filled(asset.attribution) || !/^[a-f0-9]{64}$/.test(asset.sha256)
            || asset.license.label !== 'CC BY 4.0' || asset.license.url !== 'https://creativecommons.org/licenses/by/4.0/'
            || !sources(asset.sourceIds)) add('invalid-pilot-asset', asset.id);
    }
    const used = new Set<string>();
    const image = (uri: string) => {
        if (!filled(uri) || !assets.has(uri)) add('undeclared-pilot-asset', uri);
        used.add(uri);
    };
    const targets = new Map<string, LearningInteractionV2 | null>();
    const targetSources = new Map<string, readonly string[]>();
    const payloadKeys: Record<string, readonly string[]> = {
        'multiple-choice': ['prompt', 'options', 'correctOptionId'],
        comparison: ['prompt', 'options', 'correctOptionId'],
        ordering: ['prompt', 'items', 'correctOrder'],
        hotspot: ['prompt', 'imageRef', 'regions', 'correctRegionIds'],
        bench: ['prompt', 'simulator', 'mode', 'controls', 'goal', 'phantomLabel', 'hints'],
    };
    for (const activity of candidate.activities) {
        identity(activity.id);
        for (const step of activity.steps) {
            if (step.kind === 'presentation') {
                identity(step.id);
                if (step.payload.imageRef !== undefined) image(step.payload.imageRef);
                continue;
            }
            const interaction = step.interaction;
            identity(interaction.id);
            pilotResponseIds(interaction).forEach(identity);
            targets.set(activity.id, interaction);
            targetSources.set(activity.id, activity.provenance.sourceIds);
            if (interaction.completionRule !== 'confirmed') add('unconfirmed-pilot-interaction', interaction.id);
            const allowedKeys = payloadKeys[interaction.type];
            if (!allowedKeys || Object.keys(interaction.payload).some(key => !allowedKeys.includes(key))) add('unsupported-pilot-payload', interaction.id);
            switch (interaction.type) {
                case 'multiple-choice': case 'comparison': {
                    const options = interaction.payload.options;
                    if (options.some(option => !filled(option.label))) add('invalid-pilot-choice', interaction.id);
                    options.forEach(option => { if (option.imageRef !== undefined) image(option.imageRef); });
                    if (interaction.type === 'multiple-choice' && options.some(option => option.imageRef !== undefined)) add('unsupported-pilot-payload', interaction.id);
                    if (interaction.type === 'comparison' && (options.length !== 2 || options.some(option => !filled(option.imageRef))
                        || new Set(options.map(option => assets.get(option.imageRef!)?.sha256)).size !== 2)) add('invalid-pilot-comparison', interaction.id);
                    break;
                }
                case 'hotspot': {
                    image(interaction.payload.imageRef);
                    const { regions, correctRegionIds } = interaction.payload;
                    if (new Set(correctRegionIds).size !== correctRegionIds.length
                        || regions.some(region => !filled(region.label) || !(region.width > 0) || !(region.height > 0))) add('invalid-pilot-regions', interaction.id);
                    break;
                }
                case 'ordering':
                    if (interaction.payload.items.some(item => !filled(item.label))) add('invalid-pilot-ordering', interaction.id);
                    break;
                case 'bench': {
                    const { controls, phantomLabel, mode } = interaction.payload;
                    if (!['challenge', 'correct'].includes(mode) || !filled(phantomLabel)
                        || new Set(controls.map(control => control.id)).size !== controls.length
                        || controls.some(control => !filled(control.label) || !filled(control.unit)
                            || ![control.min, control.max, control.initial, control.step].every(Number.isFinite)
                            || control.step <= 0 || control.step > control.max - control.min)) add('invalid-pilot-bench', interaction.id);
                    break;
                }
            }
        }
    }
    for (const item of candidate.checkpoint.items) {
        identity(item.id); item.options.forEach(option => identity(option.id));
        targets.set(item.id, null);
        targetSources.set(item.id, item.sourceIds);
    }
    const reviewed = new Set<string>();
    for (const evidence of pilot.evidence) {
        identity(evidence.variantId);
        if (evidence.variantId !== evidence.targetId.replace(/^[^:]+:/, 'variant:')) add('invalid-pilot-variant', evidence.targetId);
        if (!targets.has(evidence.targetId)) add('orphan-pilot-evidence', evidence.targetId);
        if (reviewed.has(evidence.targetId)) add('duplicate-pilot-evidence', evidence.targetId);
        reviewed.add(evidence.targetId);
        if (!filled(evidence.successCriterion) || !filled(evidence.accessibleAlternative) || !sources(evidence.sourceIds)
            || evidence.sourceIds.some(id => !targetSources.get(evidence.targetId)?.includes(id))
            || !Array.isArray(evidence.criticalErrors) || evidence.criticalErrors.some(error => !filled(error))) add('invalid-pilot-evidence', evidence.targetId);
        const interaction = targets.get(evidence.targetId);
        const type = interaction?.type;
        const expected = type === 'ordering' ? 'order-buttons' : type === 'hotspot' ? 'region-list'
            : type === 'bench' ? 'increment-buttons' : 'choice-buttons';
        if (evidence.responseMode !== expected) add('invalid-pilot-response-mode', evidence.targetId);
        if (interaction?.criticalSafety && evidence.criticalErrors.length === 0) add('invalid-pilot-critical-errors', evidence.targetId);
        if (type === 'bench' && !filled(evidence.modelLimits)) add('missing-pilot-model-limits', evidence.targetId);
    }
    for (const id of targets.keys()) if (!reviewed.has(id)) add('missing-pilot-evidence', id);
    for (const [uri, asset] of assets) if (!used.has(uri)) add('unused-pilot-asset', asset.id);
    return issues;
}
