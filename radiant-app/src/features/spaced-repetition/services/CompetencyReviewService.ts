// radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.ts

/**
 * Agendamento de revisão por competência.
 *
 * Serviço paralelo ao `SpacedRepetitionService`: chave e schema novos, sem
 * migração destrutiva. O caminho legado por lição continua exatamente como
 * está.
 *
 * Impuro e fino de propósito — carrega, pergunta ao modelo, salva. Toda a regra
 * pedagógica vive em `memoryModel`, que é puro e testável sem esperar dias.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    COMPETENCY_REVIEW_SCHEMA_VERSION,
    COMPETENCY_REVIEW_STORAGE_KEYS,
    DEFAULT_MEMORY_PARAMS,
} from '../../../constants/competencyReview';
import type {
    CompetencyReviewStore,
    DueCompetency,
    ReviewGrade,
} from '../../../types/competencyReview';
import {
    elapsedDaysBetween,
    isDelayedRetention,
    retrievability,
    scheduleNext,
} from '../models/memoryModel';

type ReviewInput = {
    competencyId: string;
    grade: ReviewGrade;
    criticalSafety: boolean;
    now: string;
};

function storeVazio(now: string): CompetencyReviewStore {
    return {
        schemaVersion: COMPETENCY_REVIEW_SCHEMA_VERSION,
        cards: {},
        lastSeenClock: now,
        updatedAt: now,
    };
}

export class CompetencyReviewService {
    /**
     * Store ilegível não é apagado em silêncio: a string crua vai para uma
     * chave de quarentena. Perder progresso é ruim; perder progresso sem deixar
     * rastro é pior.
     *
     * `schemaVersion` maior que a atual lê como vazio — e `saveStore` recusa
     * escrever, para uma versão antiga do app não corromper dados de uma nova.
     */
    private static async loadStore(now: string): Promise<CompetencyReviewStore> {
        try {
            const cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
            if (!cru) {
                return storeVazio(now);
            }

            const parsed = JSON.parse(cru) as CompetencyReviewStore;
            if (parsed.schemaVersion > COMPETENCY_REVIEW_SCHEMA_VERSION) {
                return storeVazio(now);
            }

            return { ...storeVazio(now), ...parsed };
        } catch (error) {
            console.error('[CompetencyReviewService] Store ilegivel, indo para quarentena:', error);
            try {
                const cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
                if (cru) {
                    await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE, cru);
                    await AsyncStorage.removeItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
                }
            } catch (quarantineError) {
                console.error('[CompetencyReviewService] Falha ao pôr em quarentena:', quarantineError);
            }
            return storeVazio(now);
        }
    }

    private static async saveStore(store: CompetencyReviewStore, now: string): Promise<void> {
        try {
            const cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
            if (cru) {
                const atual = JSON.parse(cru) as CompetencyReviewStore;
                if (atual.schemaVersion > COMPETENCY_REVIEW_SCHEMA_VERSION) {
                    return;
                }
            }

            await AsyncStorage.setItem(
                COMPETENCY_REVIEW_STORAGE_KEYS.STORE,
                JSON.stringify({ ...store, lastSeenClock: now, updatedAt: now }),
            );
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao salvar:', error);
        }
    }

    /**
     * Atividade autorada: o agendador apenas observa. O tipo da evidência
     * continua sendo do autor, por `interaction.evidenceKind`.
     */
    static async observeExposure(input: ReviewInput): Promise<void> {
        const store = await this.loadStore(input.now);
        const atual = store.cards[input.competencyId] ?? null;

        store.cards[input.competencyId] = scheduleNext({
            card: atual,
            competencyId: input.competencyId,
            grade: input.grade,
            criticalSafety: input.criticalSafety,
            params: DEFAULT_MEMORY_PARAMS,
            now: input.now,
        });

        await this.saveStore(store, input.now);
    }

    /**
     * Sessão de revisão: aqui o agendador é a autoridade sobre o tipo da
     * evidência, porque foi ele quem marcou a hora.
     */
    static async recordReview(
        input: ReviewInput,
    ): Promise<{ evidenceKind: 'delayed-retention' | 'independent-recall' }> {
        const store = await this.loadStore(input.now);
        const atual = store.cards[input.competencyId] ?? null;

        const retardada = input.grade.outcome === 'correct'
            && atual !== null
            && isDelayedRetention(atual.lastReviewedAt, input.now, DEFAULT_MEMORY_PARAMS);

        store.cards[input.competencyId] = scheduleNext({
            card: atual,
            competencyId: input.competencyId,
            grade: input.grade,
            criticalSafety: input.criticalSafety,
            params: DEFAULT_MEMORY_PARAMS,
            now: input.now,
        });

        await this.saveStore(store, input.now);

        return { evidenceKind: retardada ? 'delayed-retention' : 'independent-recall' };
    }

    /** Vencidas primeiro, e entre elas quem está mais perto de ser esquecido. */
    static async getDue(
        now: string,
        isCriticalSafety: (competencyId: string) => boolean,
    ): Promise<DueCompetency[]> {
        try {
            const store = await this.loadStore(now);
            const referencia = Date.parse(now);
            if (Number.isNaN(referencia)) {
                return [];
            }

            return Object.values(store.cards)
                .filter((card) => {
                    const vence = Date.parse(card.dueAt);
                    return !Number.isNaN(vence) && vence <= referencia;
                })
                .map((card) => ({
                    competencyId: card.competencyId,
                    retrievability: retrievability(
                        elapsedDaysBetween(card.lastReviewedAt, now),
                        card.stability,
                        DEFAULT_MEMORY_PARAMS,
                    ),
                    criticalSafety: isCriticalSafety(card.competencyId),
                }))
                .sort((a, b) => {
                    if (a.retrievability !== b.retrievability) {
                        return a.retrievability - b.retrievability;
                    }
                    return Number(b.criticalSafety) - Number(a.criticalSafety);
                });
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao consultar vencidas:', error);
            return [];
        }
    }

    static async reset(): Promise<void> {
        try {
            await AsyncStorage.removeItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao limpar:', error);
        }
    }
}
