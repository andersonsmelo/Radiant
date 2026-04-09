import { JourneyDefinitionService } from './JourneyDefinitionService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import type { ContentLesson, LearningTrack, LessonCatalogSummary } from '../../content/content.types';

jest.mock('../../content/services/LessonCatalogService', () => ({
    LessonCatalogService: {
        listTracks: jest.fn(),
        listLessonSummaries: jest.fn(),
        getLessonById: jest.fn(),
    },
}));

const mockedLessonCatalogService = LessonCatalogService as jest.Mocked<typeof LessonCatalogService>;

const trackFixture: LearningTrack = {
    id: 'track-thorax',
    slug: 'thorax-radiology',
    title: 'Tórax',
    description: 'Base do módulo de tórax.',
    lessonIds: ['lesson-b', 'lesson-a', 'lesson-c'],
};

const lessonSummaryFixture: LessonCatalogSummary[] = [
    {
        id: 'lesson-a',
        slug: 'anatomia',
        title: 'Anatomia',
        difficulty: 'beginner',
        trackId: 'track-thorax',
        order: 2,
    },
    {
        id: 'lesson-b',
        slug: 'posicionamento',
        title: 'Posicionamento',
        difficulty: 'beginner',
        trackId: 'track-thorax',
        order: 1,
    },
    {
        id: 'lesson-c',
        slug: 'achados',
        title: 'Achados',
        difficulty: 'intermediate',
        trackId: 'track-thorax',
        order: 3,
    },
];

const lessonFixtureById: Record<string, ContentLesson> = {
    'lesson-a': {
        id: 'lesson-a',
        title: 'Anatomia',
        difficulty: 'beginner',
        journey: {
            intro: {
                questionIndex: 1,
                contextBody: 'Mapa anatômico inicial.',
                teachBody: 'Leia os marcos antes de responder.',
                reinforceBody: 'Anatomia bem vista reduz erro grosseiro.',
            },
            review: {
                questionIndex: 0,
                contextBody: 'Revisão rápida da anatomia.',
                reinforceBody: 'Anatomia repetida vira referência visual.',
            },
        },
        questions: [
            {
                id: 'anatomia-q1',
                type: 'multiple-choice',
                prompt: 'Onde está o hilo pulmonar?',
                options: [{ label: 'Centro' }, { label: 'Base' }],
                correctAnswerIndex: 0,
                explanation: 'O hilo fica mais central.',
            },
            {
                id: 'anatomia-q2',
                type: 'multiple-choice',
                prompt: 'Qual estrutura cruza o mediastino?',
                options: [{ label: 'Traqueia' }, { label: 'Pleura' }],
                correctAnswerIndex: 0,
                explanation: 'A traqueia ocupa o mediastino superior.',
            },
        ],
    },
    'lesson-b': {
        id: 'lesson-b',
        title: 'Posicionamento',
        difficulty: 'beginner',
        journey: {
            review: {
                questionIndex: 0,
                contextBody: 'Feche o posicionamento antes de avançar.',
                reinforceBody: 'Boa incidência melhora a leitura inteira.',
            },
        },
        questions: [
            {
                id: 'posicionamento-q1',
                type: 'multiple-choice',
                prompt: 'Qual incidência reduz magnificação cardíaca?',
                options: [{ label: 'AP' }, { label: 'PA' }],
                correctAnswerIndex: 1,
                explanation: 'PA costuma reduzir magnificação.',
            },
        ],
    },
    'lesson-c': {
        id: 'lesson-c',
        title: 'Achados',
        difficulty: 'intermediate',
        journey: {
            intro: {
                questionIndex: 0,
                contextBody: 'Agora entram padrões de achado.',
                teachBody: 'Compare forma, distribuição e densidade.',
                reinforceBody: 'Nomear o padrão certo encurta o raciocínio.',
            },
        },
        questions: [
            {
                id: 'achados-q1',
                type: 'multiple-choice',
                prompt: 'Qual padrão sugere derrame pleural?',
                options: [{ label: 'Menisco' }, { label: 'Broncograma' }],
                correctAnswerIndex: 0,
                explanation: 'O menisco é um sinal clássico.',
            },
            {
                id: 'achados-q2',
                type: 'multiple-choice',
                prompt: 'Qual achado sugere edema pulmonar?',
                options: [{ label: 'Linhas B' }, { label: 'Cisto aéreo' }],
                correctAnswerIndex: 0,
                explanation: 'Linhas B aparecem no edema.',
            },
        ],
    },
};

describe('JourneyDefinitionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedLessonCatalogService.listTracks.mockReturnValue([trackFixture]);
        mockedLessonCatalogService.listLessonSummaries.mockReturnValue(lessonSummaryFixture);
        mockedLessonCatalogService.getLessonById.mockImplementation((lessonId) => lessonFixtureById[lessonId] ?? null);
    });

    it('builds the journey in catalog order with milestones between lessons', () => {
        const definition = JourneyDefinitionService.getTrackDefinition();
        const unit = definition.units[0];

        expect(definition.id).toBe('track-thorax');
        expect(definition.title).toBe('Tórax');
        expect(definition.initialUnitId).toBe(unit.id);
        expect(unit.title).toBe('Tórax');
        expect(unit.nodes.map((node) => node.id)).toEqual([
            'node:lesson-b',
            'node:review:lesson-b',
            'node:checkpoint:radiology:lesson-b',
            'node:lesson-a',
            'node:review:lesson-a',
            'node:checkpoint:radiology:lesson-a',
            'node:lesson-c',
            'node:review:lesson-c',
            'node:reward:radiology:final',
        ]);
        expect(unit.nodes.find((node) => node.id === 'node:lesson-a')?.unlockRule).toEqual({
            requiresNodeIds: ['node:checkpoint:radiology:lesson-b'],
        });
    });

    it('returns the default catalog track id for journey bootstrap', () => {
        expect(JourneyDefinitionService.getDefaultTrackId()).toBe('track-thorax');
    });

    it('builds lesson blocks from the current catalog payloads', () => {
        const introBlock = JourneyDefinitionService.getBlockById('block:lesson-c:intro');
        const reviewBlock = JourneyDefinitionService.getBlockById('block:review:lesson-b');
        const introQuestionStep = introBlock?.steps[2].step;
        const reviewQuestionStep = reviewBlock?.steps[1].step;

        expect(introBlock?.lessonId).toBe('lesson-c');
        expect(introQuestionStep?.type).toBe('multiple-choice');
        expect(introQuestionStep && introQuestionStep.type === 'multiple-choice' ? introQuestionStep.payload.prompt : null).toBe(
            'Qual padrão sugere derrame pleural?'
        );
        expect(introBlock?.steps[0].step.type === 'context' ? introBlock.steps[0].step.payload.body : null).toBe(
            'Agora entram padrões de achado.'
        );
        expect(reviewQuestionStep && reviewQuestionStep.type === 'multiple-choice' ? reviewQuestionStep.payload.prompt : null).toBe(
            'Qual incidência reduz magnificação cardíaca?'
        );
        expect(reviewBlock?.steps[0].step.type === 'context' ? reviewBlock.steps[0].step.payload.body : null).toBe(
            'Feche o posicionamento antes de avançar.'
        );
    });
});
