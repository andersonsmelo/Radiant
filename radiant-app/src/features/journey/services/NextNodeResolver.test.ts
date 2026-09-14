import type { NextNodeCandidate } from '../../../types/journey';
import { NextNodeResolver } from './NextNodeResolver';

const AGORA = Date.parse('2026-09-14T12:00:00.000Z');

function candidato(
    nodeId: string,
    type: NextNodeCandidate['type'],
    order: number,
    overrides: Partial<NextNodeCandidate> = {},
): NextNodeCandidate {
    return {
        nodeId,
        type,
        order,
        unlocked: true,
        completed: false,
        ...overrides,
    };
}

describe('NextNodeResolver', () => {
    it('retoma a lição pausada no passo salvo antes de qualquer outro degrau', () => {
        const decision = NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('review:late', 'review', 1, { dueAtMs: AGORA - 60_000 }),
                candidato('checkpoint:1', 'checkpoint', 2),
                candidato('lesson:paused', 'lesson', 3, { pausedStepIndex: 4 }),
                candidato('lesson:new', 'lesson', 4),
            ],
        });

        expect(decision).toEqual({
            nodeId: 'lesson:paused',
            reason: 'paused-lesson',
            resumeStepIndex: 4,
            dueReviewCount: 1,
        });
    });

    it('escolhe a revisão mais vencida e conta todas as revisões devidas', () => {
        const decision = NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('review:recent', 'review', 1, { dueAtMs: AGORA - 60_000 }),
                candidato('review:oldest', 'review', 2, { dueAtMs: AGORA - 3_600_000 }),
                candidato('checkpoint:1', 'checkpoint', 3),
                candidato('lesson:new', 'lesson', 4),
            ],
        });

        expect(decision).toEqual({
            nodeId: 'review:oldest',
            reason: 'due-review',
            dueReviewCount: 2,
        });
    });

    it('considera revisão devida quando dueAt é exatamente agora', () => {
        expect(NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('review:now', 'review', 1, { dueAtMs: AGORA }),
                candidato('checkpoint:1', 'checkpoint', 2),
            ],
        })?.nodeId).toBe('review:now');
    });

    it('desempata revisões com o mesmo vencimento pela ordem do currículo', () => {
        expect(NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('review:second', 'review', 20, { dueAtMs: AGORA - 1_000 }),
                candidato('review:first', 'review', 10, { dueAtMs: AGORA - 1_000 }),
            ],
        })?.nodeId).toBe('review:first');
    });

    it('ignora revisão futura e escolhe o checkpoint destravado', () => {
        const decision = NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('review:future', 'review', 1, { dueAtMs: AGORA + 1 }),
                candidato('checkpoint:1', 'checkpoint', 2),
                candidato('lesson:new', 'lesson', 3),
            ],
        });

        expect(decision).toEqual({
            nodeId: 'checkpoint:1',
            reason: 'checkpoint',
            dueReviewCount: 0,
        });
    });

    it('escolhe a próxima lição não concluída pela ordem do currículo', () => {
        const decision = NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('lesson:later', 'lesson', 9),
                candidato('lesson:completed', 'lesson', 1, { completed: true }),
                candidato('lesson:next', 'lesson', 4),
            ],
        });

        expect(decision).toEqual({
            nodeId: 'lesson:next',
            reason: 'next-lesson',
            dueReviewCount: 0,
        });
    });

    it('não recomenda nós bloqueados em nenhum degrau', () => {
        const decision = NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('lesson:paused-locked', 'lesson', 1, {
                    unlocked: false,
                    pausedStepIndex: 2,
                }),
                candidato('review:locked', 'review', 2, {
                    unlocked: false,
                    dueAtMs: AGORA - 1_000,
                }),
                candidato('checkpoint:locked', 'checkpoint', 3, { unlocked: false }),
                candidato('lesson:available', 'lesson', 4),
            ],
        });

        expect(decision).toEqual({
            nodeId: 'lesson:available',
            reason: 'next-lesson',
            dueReviewCount: 0,
        });
    });

    it('retorna null quando tudo terminou e não há revisão ou checkpoint vivo', () => {
        expect(NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('lesson:done', 'lesson', 1, { completed: true }),
                candidato('review:done', 'review', 2, {
                    completed: true,
                    dueAtMs: AGORA - 1_000,
                }),
                candidato('checkpoint:locked', 'checkpoint', 3, { unlocked: false }),
            ],
        })).toBeNull();
    });

    it('mantém revisão e checkpoint vivos mesmo sem próxima lição', () => {
        expect(NextNodeResolver.resolve({
            nowMs: AGORA,
            candidates: [
                candidato('lesson:done', 'lesson', 1, { completed: true }),
                candidato('checkpoint:alive', 'checkpoint', 2),
            ],
        })?.nodeId).toBe('checkpoint:alive');
    });
});
