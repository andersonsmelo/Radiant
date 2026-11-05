import { LessonFlowService } from '../../lesson-flow/services/LessonFlowService';
import { JourneyDefinitionService } from '../../journey/services/JourneyDefinitionService';
import { LessonCatalogService } from './LessonCatalogService';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';

export type ResumeContentReference = { surface: string; flowId: string; journeyNodeId?: string; cursorId?: string; reviewCardId?: string };

/** Resolve current content only; never reconstruct an old lesson or write a cursor. */
export function isLearningContentMissing(id: string): boolean {
    try {
        return !LessonFlowService.getBlockById(id)
            && !(typeof LessonFlowService.getActivityById === 'function' && LessonFlowService.getActivityById(id));
    } catch { return false; } // The lesson bootstrap owns validation failures.
}

export function isResumeContentAvailable(reference: ResumeContentReference): boolean {
    if (reference.surface === 'first-run') return true;
    if (reference.surface === 'lesson') {
        return reference.flowId.startsWith('lesson:')
            && !isLearningContentMissing(reference.flowId.slice('lesson:'.length));
    }
    if (reference.surface === 'unit-checkpoint') {
        return Boolean(reference.journeyNodeId
            && JourneyDefinitionService.getNodeType(reference.journeyNodeId) === 'checkpoint');
    }
    if (reference.surface === 'review') {
        const ids = new Set<string>();
        for (const lesson of LessonCatalogService.listLessonSummaries()) {
            for (const question of LessonCatalogService.getReviewQuestionsForLesson(lesson.id) ?? []) ids.add(question.id);
            const activity = ProductionCurriculumCatalog.getActivityById(lesson.id);
            for (const step of activity?.steps ?? []) {
                if (step.kind === 'interaction' && step.interaction.type === 'multiple-choice') ids.add(step.interaction.id);
            }
        }
        for (const track of LessonCatalogService.listTracks()) {
            for (const unit of JourneyDefinitionService.getTrackDefinition(track.id).units) {
                for (const node of unit.nodes) {
                    const checkpoint = ProductionCurriculumCatalog.getCheckpointByNodeId(node.id);
                    for (const item of checkpoint?.items ?? []) ids.add(item.id);
                }
            }
        }
        const itemId = reference.reviewCardId ?? (reference.cursorId
            && !['review-start', 'review-finished'].includes(reference.cursorId) ? reference.cursorId : undefined);
        return itemId ? ids.has(itemId) : ids.size > 0;
    }
    return true;
}
