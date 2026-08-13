import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useReview } from './useReview';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: {
        getDueLessons: jest.fn(),
        recordQuizResult: jest.fn(),
        getCardState: jest.fn(),
    },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
    LessonCatalogService: { getReviewQuestionsForLesson: jest.fn() },
}));

jest.mock('../../gamification/services/GamificationService', () => ({
    GamificationService: { addManualXp: jest.fn() },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
    TelemetryService: {
        track: jest.fn(),
        markDayReviewed: jest.fn(),
        startTimer: jest.fn(),
        stopTimer: jest.fn(),
    },
}));

jest.mock('../../sync/SyncQueueService', () => ({
    SyncQueueService: { enqueueReviewCard: jest.fn(), flush: jest.fn() },
}));

const question = (id: string) => ({
    id,
    type: 'multiple-choice',
    prompt: id,
    options: [{ label: 'A' }, { label: 'B' }],
    correctAnswerIndex: 0,
    explanation: 'Explicação',
});

describe('useReview resume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (SpacedRepetitionService.getDueLessons as jest.Mock).mockResolvedValue(['lesson-1', 'lesson-2']);
        (LessonCatalogService.getReviewQuestionsForLesson as jest.Mock)
            .mockImplementation((lessonId: string) => [question(`question-${lessonId}`)]);
    });

    it('enters the explicitly resumed due card after the external CTA', async () => {
        const { result } = renderHook(() => useReview({ resumeCursorId: 'question-lesson-2' }));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.state).toBe('review');
        expect(result.current.currentIndex).toBe(1);
        expect(result.current.currentItem?.question.id).toBe('question-lesson-2');
    });

    it('falls back to the review intro when the saved card is no longer due', async () => {
        const { result } = renderHook(() => useReview({ resumeCursorId: 'question-missing' }));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.state).toBe('start');
        act(() => result.current.startReview());
        expect(result.current.state).toBe('review');
    });
});
