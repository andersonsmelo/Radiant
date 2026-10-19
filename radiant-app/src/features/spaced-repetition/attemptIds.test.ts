import { assessmentAttemptSuffix, studyAttemptId } from './attemptIds';
import { ItemReviewRepository } from './repositories/ItemReviewRepository';
import { validateLearningEvidence } from '../../types/learningEvidence';
import { itemAttemptEvidence, type ItemAttempt } from '../../types/itemReview';

// FILA 63 (2026-10-18): o sufixo era sorteado em base 36, e o detector de dado
// sensível do validador de evidência reprovava o id quando o sorteio compunha
// "rg", "cpf" ou "pacs" entre dígitos. O journal recusava a tentativa, e a
// avaliação aprovada não era registrada: cerca de 1 em 1.600 envios.
const NOW = 1792365400705;
// Com o sorteio antigo, este valor dava o sufixo "rg5i…", o do CI da PR #51.
const DRAW_THAT_SPELLED_RG = 0.7624635631001372;
// Prefixo que a CheckpointScreen põe no `attemptId` da avaliação.
const assessmentAttemptId = (suffix: string) => `attempt:assessment:${suffix}`;
const ID_PATTERN = /^[a-z0-9][a-z0-9:._-]*$/;

function storage() {
    const data = new Map<string, string>();
    return { getItem: async (key: string) => data.get(key) ?? null,
        setItem: async (key: string, value: string) => { data.set(key, value); },
        removeItem: async (key: string) => { data.delete(key); } };
}
function attempt(attemptId: string, mode: 'assessment' | 'study'): ItemAttempt {
    return { attemptId, item: { lessonId: 'lesson:1', itemId: 'item:1', activityId: 'activity:1', competencyId: 'competency:1', contentVersion: 'v1', evidenceKind: 'independent-recall' },
        firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, durationBand: 'unknown', recordedAt: '2026-10-18T12:00:00.000Z', mode,
        ...(mode === 'assessment' ? { assessment: { competencyIds: ['competency:1'], isCriticalError: false } } : {}) };
}
/** Sequência fixa no lugar do `Math.random`: a amostra é a mesma em toda execução. */
function seededDraws(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const sensitiveIssues = (attemptId: string, mode: 'assessment' | 'study') =>
    validateLearningEvidence({ ...itemAttemptEvidence(attempt(attemptId, mode)), interactionId: attemptId });

describe('ids de tentativa do journal por item', () => {
    afterEach(() => { jest.restoreAllMocks(); });

    it('o journal aceita a avaliação cujo sorteio compunha "rg"', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(DRAW_THAT_SPELLED_RG);
        const id = assessmentAttemptId(assessmentAttemptSuffix(NOW));
        expect(await new ItemReviewRepository(storage()).recordBatch([attempt(id, 'assessment')]))
            .toEqual({ accepted: true, duplicate: false });
    });

    it('o journal aceita o estudo cujo sorteio compunha "rg"', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(DRAW_THAT_SPELLED_RG);
        const id = studyAttemptId(NOW);
        expect(await new ItemReviewRepository(storage()).record(attempt(id, 'study')))
            .toEqual({ accepted: true, duplicate: false });
    });

    it('nenhum de 20 mil sorteios produz id que o validador de evidência recuse', () => {
        jest.spyOn(Math, 'random').mockImplementation(seededDraws(63));
        const refused: string[] = [];
        for (let index = 0; index < 20000; index += 1) {
            const assessment = assessmentAttemptId(assessmentAttemptSuffix(NOW + index));
            const study = studyAttemptId(NOW + index);
            if (sensitiveIssues(assessment, 'assessment').length) refused.push(assessment);
            if (sensitiveIssues(study, 'study').length) refused.push(study);
        }
        expect(refused).toEqual([]);
    });

    // Recusar menos não pode custar o formato nem a unicidade: um sufixo
    // constante passaria no detector e colidiria toda tentativa.
    it('o id continua no formato do journal, com o instante e um sufixo que varia', () => {
        jest.spyOn(Math, 'random').mockImplementation(seededDraws(1));
        const suffixes = Array.from({ length: 5000 }, () => assessmentAttemptSuffix(NOW));
        const studies = Array.from({ length: 5000 }, () => studyAttemptId(NOW));
        expect(new Set(suffixes).size).toBe(5000);
        expect(new Set(studies).size).toBe(5000);
        for (const suffix of suffixes) expect(suffix).toMatch(new RegExp(`^${NOW}-[a-z0-9]{6,}$`));
        for (const study of studies) {
            expect(study).toMatch(new RegExp(`^study:${NOW}:[a-z0-9]{8,}$`));
            expect(study).toMatch(ID_PATTERN);
        }
        expect(assessmentAttemptId(suffixes[0])).toMatch(ID_PATTERN);
    });
});
