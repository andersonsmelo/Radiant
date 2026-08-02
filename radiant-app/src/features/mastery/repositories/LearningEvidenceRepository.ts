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
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { LearningEvidence } from '../../../types/learningEvidence';
import type { ValidationIssue } from '../../../types/learningActivity';
import { isLearningEvidence, validateLearningEvidence } from '../../../types/learningEvidence';

const SCHEMA_VERSION = 'learning-evidence.v1';

/**
 * Teto de registros. O cálculo de domínio agrega por competência e dá peso a
 * recuperação recente, então histórico além disso não muda a leitura de forma
 * perceptível — e um array sem limite em AsyncStorage cresce para sempre.
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
    async getAll(): Promise<LearningEvidence[]> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEYS.LEARNING_EVIDENCE);
            if (!raw) return [];

            const parsed: unknown = JSON.parse(raw);
            if (typeof parsed !== 'object' || parsed === null) return [];

            const entries = (parsed as Record<string, unknown>).evidence;
            if (!Array.isArray(entries)) return [];

            // Revalida na leitura, e não só na escrita: um registro pode ter
            // vindo de uma versão anterior do contrato, ou de escrita manual.
            return entries.filter(isLearningEvidence);
        } catch (error) {
            console.error('[LearningEvidenceRepository] Falha ao ler evidências:', error);
            return [];
        }
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

        try {
            const entries = [...(await this.getAll()), evidence];
            const store: LearningEvidenceStore = {
                schemaVersion: SCHEMA_VERSION,
                evidence: entries.slice(-LEARNING_EVIDENCE_CAP),
            };

            await AsyncStorage.setItem(STORAGE_KEYS.LEARNING_EVIDENCE, JSON.stringify(store));
            return { accepted: true, issues: [] };
        } catch (error) {
            console.error('[LearningEvidenceRepository] Falha ao gravar evidência:', error);
            return { accepted: false, issues: [] };
        }
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
