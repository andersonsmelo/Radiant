import type { LessonBlock } from '../../../types/lessonFlow';
import type { LearningActivityV2, ValidationIssue } from '../../../types/learningActivity';
import { validateLearningActivity } from '../../../types/learningActivity';
import { adaptLegacyBlock } from './LegacyLessonAdapter';
import { JourneyDefinitionService } from '../../journey/services/JourneyDefinitionService';
import { BenchLessonCatalog } from '../../bench/lessons/BenchLessonCatalog';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';

function validateBlock(block: LessonBlock): void {
    const maxSteps = block.sessionMode ? 32 : 4;
    if (block.steps.length < 2 || block.steps.length > maxSteps) {
        throw new Error(`[lesson-flow] Block "${block.id}" must have between 2 and ${maxSteps} steps.`);
    }

    const ids = new Set<string>();
    let interactiveCount = 0;

    block.steps.forEach((definition, index) => {
        if (ids.has(definition.contract.id)) {
            throw new Error(`[lesson-flow] Duplicate step id "${definition.contract.id}" in "${block.id}".`);
        }

        ids.add(definition.contract.id);

        if (definition.step.type === 'multiple-choice') {
            interactiveCount += 1;
        }

        if (definition.step.type === 'reinforce') {
            const hasInteractiveBefore = block.steps.slice(0, index).some((step) => step.step.type === 'multiple-choice');
            if (!hasInteractiveBefore) {
                throw new Error(`[lesson-flow] Reinforce step in "${block.id}" must come after an interactive step.`);
            }
        }

        if ((definition.step.type === 'context' || definition.step.type === 'teach') && block.steps.slice(0, index).some((step) => step.step.type === 'multiple-choice')) {
            throw new Error(`[lesson-flow] Context/teach step in "${block.id}" cannot appear after interaction.`);
        }
    });

    if (interactiveCount < 1 || (!block.sessionMode && interactiveCount !== 1)) {
        throw new Error(`[lesson-flow] Block "${block.id}" must contain valid interactive steps.`);
    }

    const advanceIndex = block.steps.findIndex((step) => step.step.type === 'advance');
    if (advanceIndex >= 0 && advanceIndex !== block.steps.length - 1) {
        throw new Error(`[lesson-flow] Advance step in "${block.id}" must be the last step.`);
    }
}

class LessonFlowServiceImpl {
    getBlockById(blockId: string): LessonBlock | null {
        const block = JourneyDefinitionService.getBlockById(blockId);

        if (!block) {
            return null;
        }

        validateBlock(block);
        return block;
    }

    /**
     * Entrada v2. Devolve a lista de violações em vez de lançar, ao contrário do
     * caminho de blocos acima. Atividades promovidas e blocos híbridos coexistem
     * durante a migração.
     */
    validateActivity(activity: LearningActivityV2): ValidationIssue[] {
        return validateLearningActivity(activity);
    }

    /**
     * Devolve o bloco legado já convertido em atividade v2.
     *
     * A busca no catálogo mora aqui, e não no adaptador, que é puro de propósito.
     * O caminho de blocos (`getBlockById`) continua disponível; o modo da sessão
     * habilita várias perguntas nos blocos híbridos.
     *
     * As aulas-bancada de exemplo vêm primeiro, e só em build de
     * desenvolvimento: fora de `__DEV__` o catálogo delas devolve `null`, e o
     * mesmo id não chega a nenhuma aula.
     */
    getActivityById(blockId: string): LearningActivityV2 | null {
        const bench = BenchLessonCatalog.getActivityById(blockId);
        if (bench) return bench;
        const promoted = ProductionCurriculumCatalog.getActivityById(blockId);
        if (promoted) return promoted;
        const block = JourneyDefinitionService.getBlockById(blockId);

        if (!block) {
            return null;
        }

        validateBlock(block);
        return adaptLegacyBlock(block);
    }
}

export const LessonFlowService = new LessonFlowServiceImpl();
