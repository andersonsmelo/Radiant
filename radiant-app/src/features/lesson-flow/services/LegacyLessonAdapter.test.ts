import type { LessonBlock } from '../../../types/lessonFlow';
import { validateLearningActivity } from '../../../types/learningActivity';
import { DEFAULT_LESSON_BLOCKS } from '../../../data/journey/defaultBlocks';
import {
    LEGACY_COMPETENCY_PREFIX,
    LEGACY_CONTENT_VERSION,
    adaptLegacyBlock,
} from './LegacyLessonAdapter';

function legacyBlock(overrides: Partial<LessonBlock> = {}): LessonBlock {
    return {
        id: 'block:lesson-9:intro',
        lessonId: 'lesson-9',
        steps: [
            {
                contract: { id: 'l9-context', type: 'context', completionRule: 'displayed', retryRule: 'allow_continue', branching: 'none' },
                step: { type: 'context', payload: { eyebrow: 'Unidade 9', title: 'Abertura', body: 'Texto de abertura.' } },
            },
            {
                contract: { id: 'l9-teach', type: 'teach', completionRule: 'displayed', retryRule: 'allow_continue', branching: 'none' },
                step: { type: 'teach', payload: { title: 'Ideia-chave', body: 'Conteúdo ensinado.', imageUrl: 'https://exemplo/img.png' } },
            },
            {
                contract: { id: 'l9-question', type: 'multiple-choice', completionRule: 'answered', retryRule: 'allow_continue', branching: 'none' },
                step: {
                    type: 'multiple-choice',
                    payload: {
                        prompt: 'Qual estrutura aparece mais radiopaca?',
                        options: [
                            { id: 'q9:option:0', label: 'Osso' },
                            { id: 'q9:option:1', label: 'Ar' },
                        ],
                        correctOptionId: 'q9:option:0',
                        explanation: 'Osso atenua mais o feixe.',
                    },
                },
            },
            {
                contract: { id: 'l9-reinforce', type: 'reinforce', completionRule: 'confirmed', retryRule: 'allow_continue', branching: 'none' },
                step: { type: 'reinforce', payload: { title: 'Fixe este ponto', body: 'Atenuação explica radiopacidade.', tone: 'neutral' } },
            },
        ],
        ...overrides,
    };
}

describe('adaptLegacyBlock', () => {
    it('produz uma atividade v2 que o validador aceita', () => {
        expect(validateLearningActivity(adaptLegacyBlock(legacyBlock()))).toEqual([]);
    });

    it('preserva o número e a ordem das telas do bloco original', () => {
        const block = legacyBlock();
        const activity = adaptLegacyBlock(block);

        expect(activity.steps).toHaveLength(block.steps.length);
        expect(activity.steps.map((step) => (step.kind === 'presentation' ? step.id : step.interaction.id)))
            .toEqual(block.steps.map((definition) => definition.contract.id));
    });

    it('mapeia cada tipo legado ao papel correspondente', () => {
        const activity = adaptLegacyBlock(legacyBlock());
        const kinds = activity.steps.map((step) => (step.kind === 'presentation' ? step.role : 'interaction'));

        expect(kinds).toEqual(['hook', 'concept', 'interaction', 'closing']);
    });

    it('mapeia advance para fechamento, como reinforce', () => {
        const block = legacyBlock({
            steps: [
                legacyBlock().steps[0],
                legacyBlock().steps[2],
                {
                    contract: { id: 'l9-advance', type: 'advance', completionRule: 'confirmed', retryRule: 'allow_continue', branching: 'none' },
                    step: { type: 'advance', payload: { title: 'Avance' } },
                },
            ],
        });

        const activity = adaptLegacyBlock(block);
        const last = activity.steps[2];

        expect(last.kind).toBe('presentation');
        expect(last.kind === 'presentation' && last.role).toBe('closing');
        expect(validateLearningActivity(activity)).toEqual([]);
    });

    it('preserva prompt, opções, resposta correta e explicação', () => {
        const activity = adaptLegacyBlock(legacyBlock());
        const step = activity.steps[2];

        if (step.kind !== 'interaction' || step.interaction.type !== 'multiple-choice') {
            throw new Error('esperava interação de múltipla escolha na terceira tela');
        }

        expect(step.interaction.id).toBe('l9-question');
        expect(step.interaction.payload.prompt).toBe('Qual estrutura aparece mais radiopaca?');
        expect(step.interaction.payload.options).toEqual([
            { id: 'q9:option:0', label: 'Osso' },
            { id: 'q9:option:1', label: 'Ar' },
        ]);
        expect(step.interaction.payload.correctOptionId).toBe('q9:option:0');
        expect(step.interaction.feedback.correct).toBe('Osso atenua mais o feixe.');
        expect(step.interaction.feedback.incorrect).toBe('Osso atenua mais o feixe.');
    });

    it('preserva o lessonId na proveniência e no id da atividade', () => {
        const activity = adaptLegacyBlock(legacyBlock());

        expect(activity.provenance.sourceIds).toContain('lesson-9');
        expect(activity.provenance.contentVersion).toBe(LEGACY_CONTENT_VERSION);
        expect(activity.id).toContain('block:lesson-9:intro');
    });

    it('marca a evidência legada como legacy-lesson-recall', () => {
        const activity = adaptLegacyBlock(legacyBlock());
        const step = activity.steps[2];

        expect(step.kind === 'interaction' && step.interaction.evidenceKind).toBe('legacy-lesson-recall');
    });

    it('atribui competência sintética legada, nunca uma competência real do currículo', () => {
        const activity = adaptLegacyBlock(legacyBlock());
        const step = activity.steps[2];

        expect(activity.competencyIds).toEqual([`${LEGACY_COMPETENCY_PREFIX}lesson-9`]);
        expect(step.kind === 'interaction' && step.interaction.competencyIds)
            .toEqual([`${LEGACY_COMPETENCY_PREFIX}lesson-9`]);
        expect(activity.competencyIds.every((id) => id.startsWith(LEGACY_COMPETENCY_PREFIX))).toBe(true);
    });

    it('marca criticalSafety como false, porque conteúdo legado nunca foi classificado', () => {
        const activity = adaptLegacyBlock(legacyBlock());
        const step = activity.steps[2];

        expect(step.kind === 'interaction' && step.interaction.criticalSafety).toBe(false);
    });

    it('preserva o tom do reforço e a imagem do passo de ensino', () => {
        const activity = adaptLegacyBlock(legacyBlock());
        const teach = activity.steps[1];
        const reinforce = activity.steps[3];

        expect(teach.kind === 'presentation' && teach.payload.imageRef).toBe('https://exemplo/img.png');
        expect(reinforce.kind === 'presentation' && reinforce.payload.tone).toBe('neutral');
    });

    it('adapta os quatro blocos reais do catálogo sem violação', () => {
        expect(DEFAULT_LESSON_BLOCKS.length).toBeGreaterThan(0);

        for (const block of DEFAULT_LESSON_BLOCKS) {
            const activity = adaptLegacyBlock(block);

            expect(validateLearningActivity(activity)).toEqual([]);
            expect(activity.steps).toHaveLength(block.steps.length);
        }
    });

    it('não inventa tela para um bloco legado de dois passos — deixa o validador reprovar', () => {
        // O contrato legado permite 2 passos; o v2 exige 3. O adaptador é fiel e
        // não preenche o buraco: a incompatibilidade tem de aparecer.
        const curto = legacyBlock({ steps: [legacyBlock().steps[0], legacyBlock().steps[2]] });
        const activity = adaptLegacyBlock(curto);

        expect(activity.steps).toHaveLength(2);
        expect(validateLearningActivity(activity).map((issue) => issue.rule)).toContain('invalid-step-count');
    });
});
