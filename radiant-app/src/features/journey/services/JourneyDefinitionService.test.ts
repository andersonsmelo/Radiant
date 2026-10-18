import { JourneyDefinitionService } from './JourneyDefinitionService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import type { ContentLesson, LearningTrack, LessonCatalogSummary } from '../../content/content.types';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';

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

    // ADR de 2026-09-28: os checkpoints das trilhas do catálogo eram só um
    // botão, sem pergunta nem custo de vida, e saíram. A lição seguinte passa
    // a exigir a anterior. As avaliações da V2 ficam, e o teste de delegação,
    // abaixo, cuida delas.
    it('builds the journey in catalog order, each lesson unlocked by the previous one', () => {
        const definition = JourneyDefinitionService.getTrackDefinition();
        const unit = definition.units[0];

        expect(definition.id).toBe('track-thorax');
        expect(definition.title).toBe('Tórax');
        expect(definition.initialUnitId).toBe(unit.id);
        expect(unit.title).toBe('Tórax');
        expect(unit.nodes.map((node) => node.id)).toEqual([
            'node:lesson-b',
            'node:review:lesson-b',
            'node:lesson-a',
            'node:review:lesson-a',
            'node:lesson-c',
            'node:review:lesson-c',
            'node:reward:radiology:final',
        ]);
        expect(unit.nodes.some((node) => node.type === 'checkpoint')).toBe(false);
        expect(unit.nodes.find((node) => node.id === 'node:lesson-b')?.unlockRule).toBeUndefined();
        expect(unit.nodes.find((node) => node.id === 'node:lesson-a')?.unlockRule).toEqual({
            requiresNodeIds: ['node:lesson-b'],
        });
        expect(unit.nodes.find((node) => node.id === 'node:lesson-c')?.unlockRule).toEqual({
            requiresNodeIds: ['node:lesson-a'],
        });
        // Validade: a conquista continua exigindo a última lição.
        expect(unit.nodes.find((node) => node.id === 'node:reward:radiology:final')?.unlockRule).toEqual({
            requiresNodeIds: ['node:lesson-c'],
        });
    });

    // A lição precisa saber se o nó é revisão para não cobrar vida no erro
    // (ADR de 2026-10-16), e o nó pode estar em qualquer trilha do percurso.
    it('devolve o tipo de um nó de qualquer trilha, e null para id desconhecido', () => {
        expect(JourneyDefinitionService.getNodeType('node:review:lesson-a')).toBe('review');
        expect(JourneyDefinitionService.getNodeType('node:lesson-a')).toBe('lesson');
        expect(JourneyDefinitionService.getNodeType('node:inexistente')).toBeNull();
    });

    it('returns the default catalog track id for journey bootstrap', () => {
        expect(JourneyDefinitionService.getDefaultTrackId()).toBe('track-thorax');
    });

    it('delega trilha curricular v2 promovida para sua definição canônica', () => {
        const productionTrack = ProductionCurriculumCatalog.listTracks()[0];
        const definition = JourneyDefinitionService.getTrackDefinition(productionTrack.id);

        expect(definition.id).toBe(productionTrack.id);
        expect(definition.units[0].nodes.filter((node) => node.type === 'lesson')).toHaveLength(12);
        expect(definition.units[0].nodes.at(-2)?.type).toBe('checkpoint');
        // Validade da ADR de 2026-09-28: as 5 avaliações da V2 ficam.
        expect(definition.units[0].nodes.filter((node) => node.type === 'checkpoint').map((node) => node.title)).toEqual([
            'Avaliação 1 de 5',
            'Avaliação 2 de 5',
            'Avaliação 3 de 5',
            'Avaliação 4 de 5',
            'Avaliação 5 de 5',
        ]);
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
        expect(introBlock?.steps.filter(s => s.step.type === 'multiple-choice')).toHaveLength(2);
        expect(introBlock?.steps[3].step.type).toBe('multiple-choice');
    });

    it('remove o prefixo "Quiz: " dos nós de lição e de revisão na trilha sem alterar títulos sem prefixo', () => {
        mockedLessonCatalogService.listLessonSummaries.mockReturnValue([
            lessonSummaryFixture[0],
            lessonSummaryFixture[1],
            {
                ...lessonSummaryFixture[2],
                title: 'Quiz: Raios X: descoberta e propriedades',
            },
        ]);
        mockedLessonCatalogService.getLessonById.mockImplementation((id: string) => {
            if (id === 'lesson-c') {
                return {
                    ...lessonFixtureById['lesson-c'],
                    title: 'Quiz: Raios X: descoberta e propriedades',
                };
            }
            return lessonFixtureById[id] ?? null;
        });

        const [unit] = JourneyDefinitionService.getTrackDefinition('track-thorax').units;
        const lessonANode = unit.nodes.find((node) => node.id === 'node:lesson-a');
        const lessonCNode = unit.nodes.find((node) => node.id === 'node:lesson-c');
        const reviewCNode = unit.nodes.find((node) => node.id === 'node:review:lesson-c');
        const reviewCBlock = JourneyDefinitionService.getBlockById('block:review:lesson-c');

        expect(lessonANode?.title).toBe('Anatomia');
        expect(lessonCNode?.title).toBe('Raios X: descoberta e propriedades');
        expect(reviewCNode?.title).toBe('Revisar Raios X: descoberta e propriedades');
        expect(reviewCBlock?.steps[0].step.type === 'context' ? reviewCBlock.steps[0].step.payload.title : null).toBe(
            'Revisar Raios X: descoberta e propriedades'
        );
    });
    it('M1 usa todas as perguntas, com IDs únicos e gabaritos válidos', () => {
        const block = JourneyDefinitionService.getBlockById('block:lesson-a:intro')!;
        const choices = block.steps.filter(s => s.step.type === 'multiple-choice');
        expect(choices).toHaveLength(2);
        expect(new Set(choices.map(s => s.contract.id)).size).toBe(2);
        expect(choices.map(s => s.step.type === 'multiple-choice' && s.step.payload.prompt))
            .toEqual(['Onde está o hilo pulmonar?', 'Qual estrutura cruza o mediastino?']);
        for (const { step } of choices) {
            if (step.type === 'multiple-choice') {
                expect(step.payload.options.some(o => o.id === step.payload.correctOptionId)).toBe(true);
                expect(step.payload.explanation.length).toBeGreaterThan(0);
            }
        }
    });
    it('M5 retira o molde e preserva o texto autoral e as interações', () => {
        const plain = JourneyDefinitionService.getBlockById('block:lesson-b:intro')!;
        expect(plain.steps.map(s => s.step.type)).toEqual(['context', 'multiple-choice']);
        const authored = JourneyDefinitionService.getBlockById('block:lesson-a:intro')!;
        expect(authored.steps.filter(s => s.step.type === 'teach')).toHaveLength(1);
        expect(authored.steps.some(s => s.step.type === 'teach' && s.step.payload.body === 'Leia os marcos antes de responder.')).toBe(true);
    });
    it('M8 revisão usa os itens distintos uma vez e declara sessão sem retorno', () => {
        const block = JourneyDefinitionService.getBlockById('block:review:lesson-a')!;
        expect(block.steps.map(s => s.step.type)).toEqual(['context', 'multiple-choice', 'multiple-choice']);
        expect(new Set(block.steps.map(s => s.contract.id)).size).toBe(3);
        expect(block).toMatchObject({ sessionMode: 'hybrid-review' });
    });

});

