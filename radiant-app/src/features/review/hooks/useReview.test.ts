import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useReview } from './useReview';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { ItemReviewService } from '../../spaced-repetition/services/ItemReviewService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { itemReviewRepository } from '../../spaced-repetition/repositories/ItemReviewRepository';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from '../../student-checkpoints/production-batches';
import { itemAttemptEvidence, itemReviewTiming } from '../../../types/itemReview';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: {
        getAllCards: jest.fn().mockResolvedValue([]),
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
    afterEach(() => jest.restoreAllMocks());
    beforeEach(async () => {
        jest.clearAllMocks();
        await AsyncStorage.clear();
        await OnboardingService.reset();
        jest.spyOn(ItemReviewService, 'loadQueue').mockImplementation(async () => ['lesson-1', 'lesson-2'].map(lessonId => ({ lessonId, question: question(`question-${lessonId}`) as import('../../../types/quiz').QuizQuestion })));
        (SpacedRepetitionService.getDueLessons as jest.Mock).mockResolvedValue(['lesson-1', 'lesson-2']);
        (LessonCatalogService.getReviewQuestionsForLesson as jest.Mock)
            .mockImplementation((lessonId: string) => [question(`question-${lessonId}`)]);
    });

    it('persists first review value before exposing the finished state to the prompt caller', async () => {
        const { result } = renderHook(() => useReview());
        await waitFor(() => expect(result.current.loading).toBe(false));
        act(() => result.current.startReview());
        await act(async () => result.current.submitRating(true));
        expect(JSON.parse((await AsyncStorage.getItem('@radiant/onboarding'))!).firstReviewAt).toBeNull();
        await act(async () => result.current.submitRating(true));
        expect(result.current.state).toBe('finished');
        expect(JSON.parse((await AsyncStorage.getItem('@radiant/onboarding'))!).firstReviewAt).toEqual(expect.any(Number));
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


describe('useReview — commit por item', () => {
    afterEach(() => jest.restoreAllMocks());
    it('recusa avançar/premiar se a escrita falha e permite retry explícito', async () => {
        const reviewItem = { lessonId: 'lesson:1', question: question('item:1'), card: {} } as unknown as Awaited<ReturnType<typeof ItemReviewService.loadQueue>>[number];
        jest.spyOn(ItemReviewService, 'loadQueue').mockResolvedValue([reviewItem]);
        const commit = jest.spyOn(ItemReviewService, 'recordReview').mockResolvedValueOnce({ accepted: false, duplicate: false }).mockResolvedValue({ accepted: true, duplicate: false });
        const { result } = renderHook(() => useReview());
        await waitFor(() => expect(result.current.loading).toBe(false));
        act(() => result.current.startReview());
        await act(async () => result.current.submitRating(true));
        expect(result.current.state).toBe('review'); expect(result.current.persistenceError).toBeTruthy();
        const xpBeforeRetry = (GamificationService.addManualXp as jest.Mock).mock.calls.length;
        await act(async () => result.current.retrySubmission());
        expect(result.current.state).toBe('finished'); expect(commit).toHaveBeenCalledTimes(2);
        expect(GamificationService.addManualXp).toHaveBeenCalledTimes(xpBeforeRetry + 1);
    });
    it('dois envios concorrentes confirmam e premiam um único item', async () => {
        const reviewItem = { lessonId: 'lesson:1', question: question('item:concurrent'), card: {} } as unknown as Awaited<ReturnType<typeof ItemReviewService.loadQueue>>[number];
        jest.spyOn(ItemReviewService, 'loadQueue').mockResolvedValue([reviewItem]);
        const commit = jest.spyOn(ItemReviewService, 'recordReview').mockResolvedValue({ accepted: true, duplicate: false });
        const { result } = renderHook(() => useReview());
        await waitFor(() => expect(result.current.loading).toBe(false)); act(() => result.current.startReview());
        const before = (GamificationService.addManualXp as jest.Mock).mock.calls.length;
        await act(async () => { await Promise.all([result.current.submitRating(true), result.current.submitRating(true)]); });
        expect(commit).toHaveBeenCalledTimes(1); expect(GamificationService.addManualXp).toHaveBeenCalledTimes(before + 1);
    });
});

describe('useReview — resposta corrigida antes do feedback', () => {
    afterEach(() => jest.restoreAllMocks());
    it('percorre o catálogo promovido real, persiste primeira resposta independente e só termina após o feedback', async () => {
        await AsyncStorage.clear();
        (SpacedRepetitionService.getAllCards as jest.Mock).mockResolvedValue([]);
        const activity = MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.activities[0];
        const step = activity.steps.find(entry => entry.kind === 'interaction');
        if (!step || step.kind !== 'interaction') throw Error('fixture');
        await itemReviewRepository.record({ attemptId: 'study:integration', mode: 'study',
            item: { lessonId: activity.id, itemId: step.interaction.id, activityId: activity.id, competencyId: activity.competencyIds[0], contentVersion: activity.provenance.contentVersion, evidenceKind: step.interaction.evidenceKind },
            firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, durationBand: 'unknown', recordedAt: new Date(Date.now() - 3 * 86400000).toISOString() });
        const { result } = renderHook(() => useReview());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.queue).toHaveLength(1);
        act(() => result.current.startReview());
        await act(async () => result.current.submitAnswer(result.current.currentItem.question.correctAnswerIndex));
        expect(result.current.answerFeedback).toEqual({ correct: true, assisted: false });
        expect(result.current.state).toBe('review');
        const entry = (await itemReviewRepository.getAttempts()).at(-1)!;
        expect(entry).toMatchObject({ mode: 'review-answer', firstOutcome: 'correct', hintUsed: false });
        expect(itemAttemptEvidence(entry).evidenceKind).toBe('independent-recall');
        expect(itemReviewTiming(entry)).toBe('after-interval');
        await act(async () => result.current.continueReview());
        expect(result.current.state).toBe('finished');
    });
    it('falha não revela feedback; retry conserva escolha/data e confirmação espera Continuar', async () => {
        jest.spyOn(ItemReviewService, 'loadQueue').mockResolvedValue([{ lessonId: 'lesson:new', question: question('item:new') as any, card: {} as any }]);
        const commit = jest.spyOn(ItemReviewService, 'recordAnswer').mockResolvedValueOnce({ accepted: false, duplicate: false, correct: false, assisted: false })
            .mockResolvedValue({ accepted: true, duplicate: false, correct: false, assisted: false });
        const { result } = renderHook(() => useReview());
        await waitFor(() => expect(result.current.loading).toBe(false));
        act(() => result.current.startReview());
        await act(async () => result.current.submitAnswer(1));
        expect(result.current.answerFeedback).toBeNull();
        expect(result.current.state).toBe('review');
        expect(result.current.persistenceError).toBeTruthy();
        await act(async () => result.current.retrySubmission());
        expect(commit.mock.calls[1]).toEqual(commit.mock.calls[0]);
        expect(result.current.answerFeedback).toEqual({ correct: false, assisted: false });
        expect(result.current.state).toBe('review');
        await act(async () => result.current.continueReview());
        expect(result.current.state).toBe('finished');
    });
    it('ajuda não premia XP e dois envios não duplicam a confirmação', async () => {
        jest.spyOn(ItemReviewService, 'loadQueue').mockResolvedValue([{ lessonId: 'lesson:help', question: question('item:help') as any, card: {} as any }]);
        const commit = jest.spyOn(ItemReviewService, 'recordAnswer').mockResolvedValue({ accepted: true, duplicate: false, correct: false, assisted: true });
        const { result } = renderHook(() => useReview());
        await waitFor(() => expect(result.current.loading).toBe(false));
        act(() => result.current.startReview());
        const xp = (GamificationService.addManualXp as jest.Mock).mock.calls.length;
        await act(async () => { await Promise.all([result.current.submitAnswer(null), result.current.submitAnswer(null)]); });
        expect(commit).toHaveBeenCalledTimes(1);
        expect(GamificationService.addManualXp).toHaveBeenCalledTimes(xp);
        expect(result.current.answerFeedback?.assisted).toBe(true);
    });
});
