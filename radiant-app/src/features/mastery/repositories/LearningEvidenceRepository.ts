/**
 * LearningEvidenceRepository
 *
 * Persiste a evidência estruturada de cada interação. É a fonte que o cálculo de
 * domínio por competência vai ler.
 *
 * Duas posturas, e elas são opostas de propósito:
 *
 * - **Na escrita, o repositório recusa.** Um registro inválido não é gravado e a
 *   chamada devolve as violações. Isto é fronteira de privacidade: gravar
 *   primeiro e limpar depois significaria que o dado proibido existiu em disco,
 *   e num app local-first "depois" pode ser nunca.
 * - **Na infraestrutura, o repositório engole.** Falha de AsyncStorage vira log
 *   e não propaga: evidência é informação secundária e não pode derrubar a
 *   conclusão de uma lição. Mesma postura do `LessonOutcomeService`.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { itemReviewRepository } from '../../spaced-repetition/repositories/ItemReviewRepository';
import { itemAttemptEvidenceEntries } from '../../../types/itemReview';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { LearningEvidence } from '../../../types/learningEvidence';
import type { ValidationIssue } from '../../../types/learningActivity';
import { isLearningEvidence, validateLearningEvidence } from '../../../types/learningEvidence';

const SCHEMA_VERSION = 'learning-evidence.v1';

/**
 * Projeção limitada para conter o crescimento em AsyncStorage. Não representa
 * histórico completo; o efeito do descarte sobre o domínio exige validação.
 */
export const LEARNING_EVIDENCE_CAP = 1000;

export type EvidenceAppendResult = {
    accepted: boolean;
    issues: ValidationIssue[];
};

type LearningEvidenceStore = {
    schemaVersion: typeof SCHEMA_VERSION;
    evidence: LearningEvidence[];
};

class LearningEvidenceRepositoryImpl {
    private pending: Promise<unknown> = Promise.resolve();
    private serialize<T>(work: () => Promise<T>): Promise<T> {
        const operation = this.pending.then(work);
        this.pending = operation.then(() => undefined, () => undefined);
        return operation;
    }
    private async readLegacy(forWrite = false): Promise<LearningEvidence[]> {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.LEARNING_EVIDENCE);
        if (raw === null) return [];
        const parsed = JSON.parse(raw) as LearningEvidenceStore;
        if (parsed?.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.evidence)) throw new Error('evidence-store-unavailable');
        if (forWrite && !parsed.evidence.every(isLearningEvidence)) throw new Error('evidence-store-invalid');
        return parsed.evidence.filter(isLearningEvidence);
    }
    async getAll(): Promise<LearningEvidence[]> {
        let legacy: LearningEvidence[] = [];
        try { legacy = await this.readLegacy(); } catch { /* Ausência de prova não vira evidência. */ }
        const current = (await itemReviewRepository.getAttempts()).flatMap(itemAttemptEvidenceEntries);
        return [...legacy, ...current].sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt)).slice(-LEARNING_EVIDENCE_CAP);
    }

    async getByCompetency(competencyId: string): Promise<LearningEvidence[]> {
        const all = await this.getAll();
        return all.filter((entry) => entry.competencyId === competencyId);
    }

    async append(evidence: LearningEvidence): Promise<EvidenceAppendResult> {
        const issues = validateLearningEvidence(evidence);

        if (issues.length > 0) {
            console.warn('[LearningEvidenceRepository] Evidência recusada pelo contrato:',
                issues.map((issue) => issue.rule).join(', '));
            return { accepted: false, issues };
        }

        return this.serialize(async () => {
            try {
                const previous = await this.readLegacy(true);
                const key = (entry: LearningEvidence) => JSON.stringify([entry.activityId, entry.interactionId, entry.competencyId, entry.contentVersion, entry.recordedAt]);
                const duplicate = previous.find(entry => key(entry) === key(evidence));
                if (duplicate) return { accepted: JSON.stringify(duplicate) === JSON.stringify(evidence), issues: [] };
                const store: LearningEvidenceStore = { schemaVersion: SCHEMA_VERSION, evidence: [...previous, evidence].slice(-LEARNING_EVIDENCE_CAP) };
                await AsyncStorage.setItem(STORAGE_KEYS.LEARNING_EVIDENCE, JSON.stringify(store));
                return { accepted: true, issues: [] };
            } catch { return { accepted: false, issues: [] }; }
        });
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.LEARNING_EVIDENCE);
        } catch (error) {
            console.error('[LearningEvidenceRepository] Falha ao limpar evidências:', error);
        }
    }
}

export const LearningEvidenceRepository = new LearningEvidenceRepositoryImpl();
