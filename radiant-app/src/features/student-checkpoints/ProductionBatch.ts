import {
    validateEditorialCurriculumCandidate,
    type EditorialCurriculumCandidateV1,
} from './EditorialCurriculumCandidate';

export const PRODUCTION_BATCH_APPROVAL_GATES = [
    'technical',
    'editorial',
    'accessibility',
    'rights',
    'schema',
    'product',
] as const;

export type ProductionBatchApprovalGate = (typeof PRODUCTION_BATCH_APPROVAL_GATES)[number];

export type ProductionBatchApprovalV1 = Readonly<{
    schemaVersion: 1;
    gate: ProductionBatchApprovalGate;
    decision: 'approved';
    reviewerRef: string;
    reviewerRole: string;
    decidedAt: string;
    materialSha256: string;
}>;

export type ProductionBatchDraftV1 = Readonly<{
    schemaVersion: 1;
    state: 'ready-for-promotion';
    batchId: string;
    materialSha256: string;
    schemaRefs: Readonly<{
        activity: 'learning-activity.v2';
        checkpoint: 'unit-checkpoint.v1';
        batch: 'production-batch.v1';
    }>;
    media: readonly never[];
    candidate: EditorialCurriculumCandidateV1;
    approvals: readonly ProductionBatchApprovalV1[];
}>;

export type ProductionBatchV1 = Readonly<{
    schemaVersion: 1;
    state: 'promoted';
    batchId: string;
    materialSha256: string;
    trackId: string;
    unitId: string;
    contentVersion: string;
    competencyIds: EditorialCurriculumCandidateV1['competencyIds'];
    sources: EditorialCurriculumCandidateV1['sources'];
    activities: EditorialCurriculumCandidateV1['activities'];
    checkpoint: EditorialCurriculumCandidateV1['checkpoint'];
    reinforcement: EditorialCurriculumCandidateV1['reinforcement'];
    claimProvenance: EditorialCurriculumCandidateV1['claimProvenance'];
    schemaRefs: ProductionBatchDraftV1['schemaRefs'];
    media: ProductionBatchDraftV1['media'];
    approvals: readonly ProductionBatchApprovalV1[];
    promotedAt: string;
    promotionRef: string;
}>;

const SHA256 = /^[a-f0-9]{64}$/;
const SHA256_WORDS = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

function rotateRight(value: number, count: number): number {
    return (value >>> count) | (value << (32 - count));
}

function utf8(value: string): number[] {
    const bytes: number[] = [];
    for (const character of value) {
        const point = character.codePointAt(0) ?? 0;
        if (point <= 0x7f) bytes.push(point);
        else if (point <= 0x7ff) bytes.push(0xc0 | (point >>> 6), 0x80 | (point & 0x3f));
        else if (point <= 0xffff) bytes.push(0xe0 | (point >>> 12), 0x80 | ((point >>> 6) & 0x3f), 0x80 | (point & 0x3f));
        else bytes.push(0xf0 | (point >>> 18), 0x80 | ((point >>> 12) & 0x3f), 0x80 | ((point >>> 6) & 0x3f), 0x80 | (point & 0x3f));
    }
    return bytes;
}

function sha256(value: string): string {
    const bytes = utf8(value);
    const bitLength = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    const high = Math.floor(bitLength / 0x100000000);
    const low = bitLength >>> 0;
    for (let shift = 24; shift >= 0; shift -= 8) bytes.push((high >>> shift) & 0xff);
    for (let shift = 24; shift >= 0; shift -= 8) bytes.push((low >>> shift) & 0xff);

    const hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
    ];
    const words = new Array<number>(64).fill(0);

    for (let offset = 0; offset < bytes.length; offset += 64) {
        for (let index = 0; index < 16; index += 1) {
            const start = offset + index * 4;
            words[index] = ((bytes[start] << 24) | (bytes[start + 1] << 16) | (bytes[start + 2] << 8) | bytes[start + 3]) >>> 0;
        }
        for (let index = 16; index < 64; index += 1) {
            const s0 = rotateRight(words[index - 15], 7) ^ rotateRight(words[index - 15], 18) ^ (words[index - 15] >>> 3);
            const s1 = rotateRight(words[index - 2], 17) ^ rotateRight(words[index - 2], 19) ^ (words[index - 2] >>> 10);
            words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
        }
        let [a, b, c, d, e, f, g, h] = hash;
        for (let index = 0; index < 64; index += 1) {
            const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
            const choice = (e & f) ^ (~e & g);
            const temp1 = (h + sigma1 + choice + SHA256_WORDS[index] + words[index]) >>> 0;
            const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
            const majority = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (sigma0 + majority) >>> 0;
            h = g; g = f; f = e; e = (d + temp1) >>> 0; d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
        }
        hash[0] = (hash[0] + a) >>> 0; hash[1] = (hash[1] + b) >>> 0;
        hash[2] = (hash[2] + c) >>> 0; hash[3] = (hash[3] + d) >>> 0;
        hash[4] = (hash[4] + e) >>> 0; hash[5] = (hash[5] + f) >>> 0;
        hash[6] = (hash[6] + g) >>> 0; hash[7] = (hash[7] + h) >>> 0;
    }
    return hash.map((word) => word.toString(16).padStart(8, '0')).join('');
}

function canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize((value as Record<string, unknown>)[key])]));
    }
    return value;
}

export function fingerprintProductionBatchMaterial(candidate: EditorialCurriculumCandidateV1): string {
    return sha256(JSON.stringify(canonicalize({
        trackId: candidate.trackId,
        unitId: candidate.unitId,
        contentVersion: candidate.contentVersion,
        competencyIds: candidate.competencyIds,
        sources: candidate.sources,
        activities: candidate.activities,
        checkpoint: candidate.checkpoint,
        reinforcement: candidate.reinforcement,
        claimProvenance: candidate.claimProvenance,
    })));
}

function isFilled(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isIsoTimestamp(value: unknown): value is string {
    return isFilled(value) && !Number.isNaN(Date.parse(value));
}

function deepCloneAndFreeze<T>(value: T): T {
    if (Array.isArray(value)) {
        return Object.freeze(value.map((entry) => deepCloneAndFreeze(entry))) as T;
    }
    if (value !== null && typeof value === 'object') {
        const clone = Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [key, deepCloneAndFreeze(entry)]),
        );
        return Object.freeze(clone) as T;
    }
    return value;
}

export function validateProductionBatchDraft(draft: ProductionBatchDraftV1): string[] {
    const issues: string[] = [];
    if (draft.schemaVersion !== 1 || draft.state !== 'ready-for-promotion') {
        issues.push('invalid-production-batch-envelope');
    }
    if (!isFilled(draft.batchId) || !SHA256.test(draft.materialSha256)) {
        issues.push('invalid-production-batch-identity');
    }
    if (draft.materialSha256 !== fingerprintProductionBatchMaterial(draft.candidate)) {
        issues.push('production-batch-material-hash-mismatch');
    }
    if (draft.schemaRefs.activity !== 'learning-activity.v2'
        || draft.schemaRefs.checkpoint !== 'unit-checkpoint.v1'
        || draft.schemaRefs.batch !== 'production-batch.v1') {
        issues.push('invalid-production-batch-schema-refs');
    }
    if (!Array.isArray(draft.media) || draft.media.length !== 0) {
        issues.push('unapproved-production-batch-media');
    }
    issues.push(...validateEditorialCurriculumCandidate(draft.candidate).map(
        (issue) => `invalid-editorial-candidate:${issue}`,
    ));

    for (const gate of PRODUCTION_BATCH_APPROVAL_GATES) {
        const decisions = draft.approvals.filter((entry) => entry.gate === gate);
        if (decisions.length === 0) {
            issues.push(`missing-approval:${gate}`);
            continue;
        }
        if (decisions.length > 1) {
            issues.push(`duplicate-approval:${gate}`);
            continue;
        }
        const decision = decisions[0];
        if (decision.schemaVersion !== 1
            || decision.decision !== 'approved'
            || !isFilled(decision.reviewerRef)
            || !isFilled(decision.reviewerRole)
            || !isIsoTimestamp(decision.decidedAt)) {
            issues.push(`invalid-approval:${gate}`);
        }
        if (decision.materialSha256 !== draft.materialSha256) {
            issues.push(`approval-material-mismatch:${gate}`);
        }
    }

    const knownGates = new Set<string>(PRODUCTION_BATCH_APPROVAL_GATES);
    if (draft.approvals.some((entry) => !knownGates.has(entry.gate))) {
        issues.push('unknown-approval-gate');
    }
    return issues;
}

export function promoteProductionBatch(
    draft: ProductionBatchDraftV1,
    promotion: Readonly<{ promotedAt: string; promotionRef: string }>,
): ProductionBatchV1 {
    const issues = validateProductionBatchDraft(draft);
    if (issues.length > 0) {
        throw new Error(`production-batch-invalid:${issues.join(',')}`);
    }
    if (!isIsoTimestamp(promotion.promotedAt) || !isFilled(promotion.promotionRef)) {
        throw new Error('production-batch-invalid:invalid-promotion-authorization');
    }

    const { candidate } = draft;
    return deepCloneAndFreeze({
        schemaVersion: 1,
        state: 'promoted',
        batchId: draft.batchId,
        materialSha256: draft.materialSha256,
        trackId: candidate.trackId,
        unitId: candidate.unitId,
        contentVersion: candidate.contentVersion,
        competencyIds: candidate.competencyIds,
        sources: candidate.sources,
        activities: candidate.activities,
        checkpoint: candidate.checkpoint,
        reinforcement: candidate.reinforcement,
        claimProvenance: candidate.claimProvenance,
        schemaRefs: draft.schemaRefs,
        media: draft.media,
        approvals: draft.approvals,
        promotedAt: promotion.promotedAt,
        promotionRef: promotion.promotionRef,
    } satisfies ProductionBatchV1);
}
