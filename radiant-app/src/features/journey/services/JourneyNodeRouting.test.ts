import type { JourneyNode, NextNodeDecision } from '../../../types/journey';
import { getJourneyNodeHref, getNextNodeHref } from './JourneyNodeRouting';

const lesson: JourneyNode = {
    id: 'lesson:one',
    unitId: 'unit:one',
    type: 'lesson',
    title: 'Lição',
    blockId: 'block:one',
    status: 'resumable',
};

describe('JourneyNodeRouting', () => {
    it('mantém a rota direta antiga sem cursor', () => {
        expect(getJourneyNodeHref(lesson)).toEqual({
            pathname: '/learn',
            params: { nodeId: 'lesson:one', blockId: 'block:one' },
        });
    });

    it('leva a decisão pausada ao nó e passo exatos', () => {
        const decision: NextNodeDecision = {
            nodeId: lesson.id,
            reason: 'paused-lesson',
            resumeStepIndex: 4,
            dueReviewCount: 2,
        };

        expect(getNextNodeHref(lesson, decision)).toEqual({
            pathname: '/learn',
            params: {
                nodeId: 'lesson:one',
                blockId: 'block:one',
                resumeCursorId: 'step-4',
            },
        });
    });

    it('não injeta cursor em decisão de revisão', () => {
        expect(getNextNodeHref({ ...lesson, type: 'review' }, {
            nodeId: lesson.id,
            reason: 'due-review',
            dueReviewCount: 1,
        })).toEqual({
            pathname: '/learn',
            params: { nodeId: 'lesson:one', blockId: 'block:one' },
        });
    });
});
