/**
 * Evidência de aprendizagem por interação.
 *
 * Este arquivo é uma fronteira de privacidade, não só um contrato de dados. A
 * spec do sistema de aprendizagem é explícita: uma tentativa registra apenas
 * dados estruturados permitidos — atividade, competência, resultado, dica,
 * faixa de duração, versão de conteúdo e timestamp — e **nunca** imagem
 * clínica, resposta livre, identificador de paciente ou texto com risco de dado
 * sensível.
 *
 * A proteção é estrutural antes de ser uma verificação: **não existe campo para
 * prosa**. Todo campo de texto é um identificador com forma fixa, então uma
 * resposta escrita pelo aluno não tem onde caber, mesmo que alguém tente
 * enfiá-la. A varredura de valores sensíveis abaixo é a segunda camada, para o
 * caso de um identificador ser construído a partir de dado que não deveria
 * estar ali.
 */

import type { EvidenceKind } from './learningActivity';
import { EVIDENCE_KINDS } from './learningActivity';
import type { ValidationIssue } from './learningActivity';

export type EvidenceOutcome = 'correct' | 'incorrect' | 'skipped';

/**
 * Duração em faixa, nunca em milissegundos. Tempo exato de resposta é um traço
 * comportamental fino demais para o valor que entrega aqui; a faixa basta para
 * distinguir reconhecimento imediato de esforço, que é a única leitura que o
 * cálculo de domínio faz dela.
 */
export type DurationBand = 'unknown' | 'under-10s' | '10-30s' | '30-60s' | 'over-60s';

export type LearningEvidence = {
    activityId: string;
    interactionId: string;
    competencyId: string;
    evidenceKind: EvidenceKind;
    outcome: EvidenceOutcome;
    hintUsed: boolean;
    durationBand: DurationBand;
    contentVersion: string;
    recordedAt: string;
};

export const EVIDENCE_FIELDS = [
    'activityId',
    'interactionId',
    'competencyId',
    'evidenceKind',
    'outcome',
    'hintUsed',
    'durationBand',
    'contentVersion',
    'recordedAt',
] as const;

const ALLOWED_FIELDS = new Set<string>(EVIDENCE_FIELDS);
const OUTCOMES = new Set<string>(['correct', 'incorrect', 'skipped']);
const DURATION_BANDS = new Set<string>(['unknown', 'under-10s', '10-30s', '30-60s', 'over-60s']);

/** Identificador: sem espaço, sem acento, sem pontuação de prosa. */
const ID_PATTERN = /^[a-z0-9][a-z0-9:._-]*$/;
const CONTENT_VERSION_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

/**
 * Segunda camada: marcadores de dado clínico e esquemas de URI. Espelha o
 * detector do manifesto de mídia — o mesmo risco em outro ponto do pipeline
 * merece o mesmo teste, e duas definições divergiriam com o tempo.
 */
const SENSITIVE_VALUE =
    /(^|[^a-z])(dicom|pacs|paciente|patient|prontu[aá]rio|medical\s*record|cpf|rg)([^a-z]|$)|:\/\/|^data:|^file:/i;

function push(issues: ValidationIssue[], path: string, rule: string): void {
    if (!issues.some((issue) => issue.path === path && issue.rule === rule)) {
        issues.push({ path, rule });
    }
}

function checkSensitive(issues: ValidationIssue[], path: string, value: unknown): void {
    if (typeof value === 'string' && SENSITIVE_VALUE.test(value)) {
        push(issues, path, 'sensitive-value-detected');
    }
}

export function validateLearningEvidence(value: unknown): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return [{ path: 'evidence', rule: 'invalid-record' }];
    }

    const record = value as Record<string, unknown>;
    const path = typeof record.interactionId === 'string' && ID_PATTERN.test(record.interactionId)
        ? record.interactionId
        : 'evidence';

    for (const key of Object.keys(record)) {
        if (!ALLOWED_FIELDS.has(key)) {
            push(issues, path, 'disallowed-field');
        }
    }
    for (const field of EVIDENCE_FIELDS) {
        if (!Object.hasOwn(record, field)) {
            push(issues, path, 'required-field');
        }
    }

    for (const field of ['activityId', 'interactionId', 'competencyId'] as const) {
        const candidate = record[field];
        if (typeof candidate !== 'string' || !ID_PATTERN.test(candidate)) {
            push(issues, path, 'invalid-id');
        }
    }

    if (typeof record.contentVersion !== 'string' || !CONTENT_VERSION_PATTERN.test(record.contentVersion)) {
        push(issues, path, 'invalid-content-version');
    }
    if (!EVIDENCE_KINDS.includes(record.evidenceKind as EvidenceKind)) {
        push(issues, path, 'invalid-evidence-kind');
    }
    if (!OUTCOMES.has(record.outcome as string)) {
        push(issues, path, 'invalid-outcome');
    }
    if (!DURATION_BANDS.has(record.durationBand as string)) {
        push(issues, path, 'invalid-duration-band');
    }
    if (typeof record.hintUsed !== 'boolean') {
        push(issues, path, 'invalid-hint-flag');
    }
    if (typeof record.recordedAt !== 'string' || !ISO_TIMESTAMP_PATTERN.test(record.recordedAt)) {
        push(issues, path, 'invalid-timestamp');
    }

    for (const candidate of Object.values(record)) {
        checkSensitive(issues, path, candidate);
    }

    return issues;
}

export function isLearningEvidence(value: unknown): value is LearningEvidence {
    return validateLearningEvidence(value).length === 0;
}
