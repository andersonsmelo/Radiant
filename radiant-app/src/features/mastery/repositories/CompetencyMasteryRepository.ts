/**
 * CompetencyMasteryRepository
 *
 * Guarda o domínio calculado, indexado por competência, em chave versionada.
 *
 * **Ausência significa `not-started`, e é isso que a migração vazia entrega.**
 * Quem já usava o app antes do sistema de competências não recebe domínio
 * retroativo: nada aqui olha XP, nó concluído ou sequência para inferir que
 * alguém "provavelmente domina" algo. Inferir seria plausível e errado, e um
 * domínio inventado corrompe justamente a métrica que o produto promete medir —
 * mesma postura do ADR de progresso não retroativo.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { CompetencyMastery, MasteryState } from '../../../types/mastery';
import { MASTERY_ORDER } from '../../../types/mastery';

const SCHEMA_VERSION = 'competency-mastery.v1';

type CompetencyMasteryStore = {
    schemaVersion: typeof SCHEMA_VERSION;
    mastery: Record<string, CompetencyMastery>;
};

function isCompetencyMastery(value: unknown): value is CompetencyMastery {
    if (typeof value !== 'object' || value === null) return false;
    const entry = value as Record<string, unknown>;

    return (
        typeof entry.competencyId === 'string'
        && MASTERY_ORDER.includes(entry.state as MasteryState)
        && typeof entry.score === 'number'
        && typeof entry.evidenceCount === 'number'
        && Array.isArray(entry.blockedBy)
        && typeof entry.evaluatedAt === 'string'
    );
}

export function notStarted(competencyId: string, evaluatedAt = ''): CompetencyMastery {
    return {
        competencyId,
        state: 'not-started',
        score: 0,
        evidenceCount: 0,
        blockedBy: [],
        evaluatedAt,
    };
}

class CompetencyMasteryRepositoryImpl {
    async getAll(): Promise<Record<string, CompetencyMastery>> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEYS.COMPETENCY_MASTERY);
            if (!raw) return {};

            const parsed: unknown = JSON.parse(raw);
            if (typeof parsed !== 'object' || parsed === null) return {};

            const entries = (parsed as Record<string, unknown>).mastery;
            if (typeof entries !== 'object' || entries === null) return {};

            return Object.fromEntries(
                Object.entries(entries as Record<string, unknown>).filter(([, value]) => isCompetencyMastery(value)),
            ) as Record<string, CompetencyMastery>;
        } catch (error) {
            console.error('[CompetencyMasteryRepository] Falha ao ler domínio:', error);
            return {};
        }
    }

    async get(competencyId: string): Promise<CompetencyMastery> {
        const all = await this.getAll();
        return all[competencyId] ?? notStarted(competencyId);
    }

    async save(mastery: CompetencyMastery): Promise<void> {
        try {
            const store: CompetencyMasteryStore = {
                schemaVersion: SCHEMA_VERSION,
                mastery: { ...(await this.getAll()), [mastery.competencyId]: mastery },
            };

            await AsyncStorage.setItem(STORAGE_KEYS.COMPETENCY_MASTERY, JSON.stringify(store));
        } catch (error) {
            console.error('[CompetencyMasteryRepository] Falha ao gravar domínio:', error);
        }
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.COMPETENCY_MASTERY);
        } catch (error) {
            console.error('[CompetencyMasteryRepository] Falha ao limpar domínio:', error);
        }
    }
}

export const CompetencyMasteryRepository = new CompetencyMasteryRepositoryImpl();
