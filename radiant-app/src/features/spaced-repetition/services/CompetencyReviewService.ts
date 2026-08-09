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
    CompetencyReviewCard,
    CompetencyReviewEvidenceKind,
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

/**
 * A sessão de revisão exige do chamador a terceira condição da §4 da spec: se
 * **aquela** competência admite `delayed-retention` no currículo. O serviço não
 * lê o catálogo — quem chama é que sabe —, e o campo é obrigatório de propósito:
 * só 10 das 30 competências admitem, e um default permissivo concederia às
 * outras 20 uma promoção a `retained` que o teto do currículo (spec §3) registra
 * como deliberadamente inalcançável. Ausência de informação não pode conceder.
 */
type RecordReviewInput = ReviewInput & {
    admitsDelayedRetention: boolean;
};

function storeVazio(now: string): CompetencyReviewStore {
    return {
        schemaVersion: COMPETENCY_REVIEW_SCHEMA_VERSION,
        cards: {},
        updatedAt: now,
    };
}

function ehObjeto(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function temFormaDeCartao(value: unknown): value is CompetencyReviewCard {
    if (!ehObjeto(value)) {
        return false;
    }

    return typeof value.competencyId === 'string'
        && typeof value.stability === 'number'
        && typeof value.difficulty === 'number'
        && typeof value.reps === 'number'
        && typeof value.lapses === 'number'
        && typeof value.lastReviewedAt === 'string'
        && typeof value.dueAt === 'string';
}

/**
 * JSON válido não é store válido. `{"schemaVersion":1,"cards":null}` desserializa
 * sem erro e só explodiria mais tarde, em `store.cards[id] = …`, com o
 * `TypeError` escapando para fora do serviço. A forma é conferida antes do uso,
 * e o que não passa segue o mesmo caminho do JSON quebrado: quarentena.
 */
function temFormaDeStore(value: unknown): value is CompetencyReviewStore {
    if (!ehObjeto(value)) {
        return false;
    }

    if (typeof value.schemaVersion !== 'number' || !ehObjeto(value.cards)) {
        return false;
    }

    return Object.values(value.cards).every(temFormaDeCartao);
}

/**
 * Basta ser objeto com `schemaVersion` numérico maior que a atual. Não se exige
 * o resto do contrato: é justamente o resto que se espera diferente numa versão
 * futura.
 */
function ehVersaoFutura(value: unknown): boolean {
    return ehObjeto(value)
        && typeof value.schemaVersion === 'number'
        && value.schemaVersion > COMPETENCY_REVIEW_SCHEMA_VERSION;
}

function desserializar(cru: string): unknown {
    try {
        return JSON.parse(cru);
    } catch {
        return null;
    }
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
        let cru: string | null = null;

        try {
            cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
            if (!cru) {
                return storeVazio(now);
            }

            const parsed = desserializar(cru);

            // A versão vem ANTES da forma, e a ordem é o ponto. Store de uma
            // versão futura do app tem forma diferente por definição — campos
            // que esta versão não conhece, campos que lá deixaram de existir.
            // Julgá-lo pelo contrato de hoje o chamaria de corrompido e o
            // mandaria para a quarentena, destruindo exatamente o dado que a
            // recusa de escrita existe para preservar. Forma inesperada
            // costuma ser corrupção; vinda de versão futura, é normalidade.
            if (ehVersaoFutura(parsed)) {
                return storeVazio(now);
            }

            if (!temFormaDeStore(parsed)) {
                console.error('[CompetencyReviewService] Store ilegivel ou com forma inesperada, indo para quarentena');
                await this.quarentenar(cru);
                return storeVazio(now);
            }

            return { ...storeVazio(now), ...parsed, cards: { ...parsed.cards } };
        } catch (error) {
            // Falha do próprio storage: não é store corrompido, então nada vai
            // para a quarentena. O serviço só começa limpo nesta leitura.
            console.error('[CompetencyReviewService] Falha ao ler o store:', error);
            return storeVazio(now);
        }
    }

    private static async quarentenar(cru: string): Promise<void> {
        try {
            await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE, cru);
            await AsyncStorage.removeItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
        } catch (quarantineError) {
            console.error('[CompetencyReviewService] Falha ao pôr em quarentena:', quarantineError);
        }
    }

    private static async saveStore(store: CompetencyReviewStore, now: string): Promise<void> {
        try {
            const cru = await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE);
            if (cru) {
                // Mesma ordem da leitura, pelo mesmo motivo: a versão futura
                // veta a escrita sem passar pelo contrato de forma desta
                // versão, senão o dado que a regra protege seria sobrescrito
                // por não se parecer com o que hoje se espera. O que não tem
                // forma de store já foi para a quarentena na leitura.
                if (ehVersaoFutura(desserializar(cru))) {
                    return;
                }
            }

            await AsyncStorage.setItem(
                COMPETENCY_REVIEW_STORAGE_KEYS.STORE,
                JSON.stringify({ ...store, updatedAt: now }),
            );
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao salvar:', error);
        }
    }

    /**
     * Atividade autorada: o agendador apenas observa. O tipo da evidência
     * continua sendo do autor, por `interaction.evidenceKind`.
     *
     * Best-effort: falha ao agendar não derruba a conclusão da atividade.
     */
    static async observeExposure(input: ReviewInput): Promise<void> {
        try {
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
        } catch (error) {
            console.error('[CompetencyReviewService] Falha ao observar exposição:', error);
        }
    }

    /**
     * Sessão de revisão: aqui o agendador é a autoridade sobre o tipo da
     * evidência, porque foi ele quem marcou a hora.
     *
     * As três condições da §4 da spec, e nenhuma delas dispensável: desfecho
     * correto, decorrido acima do limiar, e competência que admita
     * `delayed-retention`.
     */
    static async recordReview(
        input: RecordReviewInput,
    ): Promise<{ evidenceKind: CompetencyReviewEvidenceKind }> {
        try {
            const store = await this.loadStore(input.now);
            const atual = store.cards[input.competencyId] ?? null;

            const retardada = input.admitsDelayedRetention
                && input.grade.outcome === 'correct'
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
        } catch (error) {
            // Falha fechada: sem saber o que foi lido ou gravado, a revisão não
            // pode render retenção retardada.
            console.error('[CompetencyReviewService] Falha ao registrar revisão:', error);
            return { evidenceKind: 'independent-recall' };
        }
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
                    // `dueAt` ilegível — inclusive o marcador que o modelo grava
                    // quando não pôde agendar — lê como não vencido.
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
