import type { LessonBlock } from '../../../types/lessonFlow';
import { JourneyDefinitionService } from '../../journey/services/JourneyDefinitionService';

function validateBlock(block: LessonBlock): void {
    if (block.steps.length < 2 || block.steps.length > 4) {
        throw new Error(`[lesson-flow] Block "${block.id}" must have between 2 and 4 steps.`);
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

    if (interactiveCount !== 1) {
        throw new Error(`[lesson-flow] Block "${block.id}" must contain exactly one interactive step.`);
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
}

export const LessonFlowService = new LessonFlowServiceImpl();
