/**
 * Percorre todas as famílias de interação. Tipo novo aceito num portão e
 * esquecido em outro compilava e só falhava com o aluno na tela (travado no
 * "Continuar" desativado); aqui ele reprova antes.
 */
import { INTERACTION_FAMILY_FIXTURES } from '../../../test/fixtures/interactionFamilyFixtures';
import { INTERACTION_TYPES, validateLearningActivity } from '../../../types/learningActivity';
import type { InteractionType, LearningActivityV2 } from '../../../types/learningActivity';
import { FAMILY_LABEL } from '../../student-checkpoints/batches/rtgBatchFactory';
import { WIDE_ACTIVITY_FAMILIES } from '../../student-checkpoints/EditorialWideContract';
import { correctAnswerText } from '../screens/LessonFlowScreen';
import { feedbackFor } from '../services/feedbackFor';
import { REGISTERED_INTERACTION_TYPES } from './ActivityRendererRegistry';
import { isCompleteInteractionValue, isCorrectInteractionValue } from './InteractionAnswerValue';

/** Sem exemplo completo ainda. A tarefa 9 esvazia esta lista. */
const PENDING_FAMILIES: readonly InteractionType[] = ['parameter-lab', 'risk-hunt'];
/** Os tipos que a aula-fonte (`TYPES` de rtg-lesson-lint.mjs) aceita hoje; as próximas tarefas ampliam. */
const SOURCE_FAMILIES: readonly InteractionType[] = [
    'multiple-choice', 'case-decision', 'ordering', 'matching', 'comparison', 'cloze', 'true-false', 'categorize', 'multi-select',
];
/** Sem resposta curta e única: a bancada tem o retorno autoral, e a categorização mostra o grupo certo em cada ficha (ver `correctAnswerText`). */
const WITHOUT_ANSWER_TEXT: readonly InteractionType[] = ['bench', 'categorize'];

const complete = INTERACTION_TYPES.filter(type => !PENDING_FAMILIES.includes(type));

// A tela importa a telemetria, que lê o armazenamento nativo.
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('famílias de interação', () => {
    it('só os tipos de PENDING_FAMILIES nascem pendentes', () => {
        const pending = INTERACTION_TYPES.filter(type => INTERACTION_FAMILY_FIXTURES[type] === 'pending');
        expect(pending).toEqual(PENDING_FAMILIES);
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

        expect(feedbackFor(interaction, wrongValue, false).trim()).not.toBe('');
        if (!WITHOUT_ANSWER_TEXT.includes(type)) expect(correctAnswerText(interaction)?.trim()).toBeTruthy();
    });

    it.each(SOURCE_FAMILIES)('%s: entra em WIDE_ACTIVITY_FAMILIES e em FAMILY_LABEL', type => {
        expect(WIDE_ACTIVITY_FAMILIES).toContain(type);
        expect(FAMILY_LABEL).toHaveProperty([type]);
    });
});
