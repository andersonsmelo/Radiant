/**
 * Percorre todas as famílias de interação. Tipo novo aceito num portão e
 * esquecido em outro compilava e só falhava com o aluno na tela (travado no
 * "Continuar" desativado); aqui ele reprova antes.
 */
import { INTERACTION_FAMILY_FIXTURES } from '../../../test/fixtures/interactionFamilyFixtures';
import { INTERACTION_TYPES, validateLearningActivity } from '../../../types/learningActivity';
import type { InteractionType, LearningActivityV2 } from '../../../types/learningActivity';
import { correctAnswerText } from '../screens/LessonFlowScreen';
import { feedbackFor } from '../services/feedbackFor';
import { REGISTERED_INTERACTION_TYPES } from './ActivityRendererRegistry';
import { isCompleteInteractionValue, isCorrectInteractionValue } from './InteractionAnswerValue';

/** Sem exemplo completo ainda. A tarefa 9 esvazia esta lista. */
const PENDING_FAMILIES: readonly InteractionType[] = ['parameter-lab'];
/** Sem resposta curta e única: a bancada tem o retorno autoral, e a categorização mostra o grupo certo em cada ficha (ver `correctAnswerText`). */
const WITHOUT_ANSWER_TEXT: readonly InteractionType[] = ['bench', 'categorize'];

/** Os tipos com retorno específico em `feedbackFor`; o `wrongValue` deles precisa produzir texto diferente do retorno autoral. */
const FEEDBACK_IS_SPECIFIC: readonly InteractionType[] = ['bench', 'multiple-choice', 'comparison', 'case-decision', 'multi-select', 'label', 'risk-hunt', 'conversation'];
/** Os que caem no `default` de `feedbackFor` (retorno autoral de erro). Tipo novo com ramo próprio sai daqui. */
const FEEDBACK_IS_GENERIC: readonly InteractionType[] = ['hotspot', 'matching', 'ordering', 'cloze', 'true-false', 'categorize'];

const complete = INTERACTION_TYPES.filter(type => !PENDING_FAMILIES.includes(type));

// A tela importa a telemetria, que lê o armazenamento nativo.
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('famílias de interação', () => {
    it('só os tipos de PENDING_FAMILIES nascem pendentes', () => {
        const pending = INTERACTION_TYPES.filter(type => INTERACTION_FAMILY_FIXTURES[type] === 'pending');
        expect(pending).toEqual(PENDING_FAMILIES);
    });

    it('FEEDBACK_IS_SPECIFIC e FEEDBACK_IS_GENERIC cobrem exatamente os tipos completos', () => {
        expect([...FEEDBACK_IS_SPECIFIC, ...FEEDBACK_IS_GENERIC].sort()).toEqual([...complete].sort());
    });

    it('a isenção de resposta em texto é exatamente esta', () => {
        expect(WITHOUT_ANSWER_TEXT).toEqual(['bench', 'categorize']);
    });

    it.each(complete)('%s: tela, validação, acerto, erro e retornos', type => {
        const fixture = INTERACTION_FAMILY_FIXTURES[type];
        if (fixture === 'pending') throw new Error('unreachable');
        const { interaction, correctValue, wrongValue } = fixture;

        expect(interaction.type).toBe(type);
        expect(REGISTERED_INTERACTION_TYPES).toContain(type);

        const activity: LearningActivityV2 = {
            id: `fx-activity:${type}`, competencyIds: interaction.competencyIds, provenance: { contentVersion: 'synthetic.v1', sourceIds: ['synthetic'] },
            steps: [
                { kind: 'presentation', id: 'fx:hook', role: 'hook', payload: { title: 'Abertura' } },
                { kind: 'interaction', interaction },
                { kind: 'presentation', id: 'fx:closing', role: 'closing', payload: { title: 'Fecho' } },
            ],
        };
        expect(validateLearningActivity(activity)).toEqual([]);

        expect(isCompleteInteractionValue(interaction, correctValue)).toBe(true);
        expect(isCorrectInteractionValue(interaction, correctValue)).toBe(true);
        expect(isCompleteInteractionValue(interaction, wrongValue)).toBe(true);
        expect(isCorrectInteractionValue(interaction, wrongValue)).toBe(false);

        const feedback = feedbackFor(interaction, wrongValue, false);
        expect(feedback.trim()).not.toBe('');
        if (FEEDBACK_IS_SPECIFIC.includes(type)) expect(feedback).not.toBe(interaction.feedback.incorrect);
        else expect(feedback).toBe(interaction.feedback.incorrect);
        if (!WITHOUT_ANSWER_TEXT.includes(type)) expect(correctAnswerText(interaction)?.trim()).toBeTruthy();
    });

});
