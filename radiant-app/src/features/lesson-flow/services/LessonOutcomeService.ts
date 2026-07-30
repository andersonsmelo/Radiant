/**
 * LessonOutcomeService
 *
 * Registra a consequência de concluir um bloco de lição: reavalia o card de
 * repetição espaçada sempre, e concede XP, sequência e meta diária quando a
 * conclusão é premiável.
 *
 * Regra de premiação (spec §3): nó de lição paga só na primeira conclusão; nó de
 * revisão paga sempre que estava vencido. Quem decide se uma revisão está
 * vencida é o SM-2, não o usuário — por isso a revisão não é farmável.
 */

import type { LessonBlock } from '../../../types/lessonFlow';
import type { QuizResult } from '../../../types/quiz';
import type { XpAward } from '../../../types/gamification';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';

export type LessonOutcomeInput = {
    block: LessonBlock;
    nodeId: string;
    /** stepId do passo interativo → a escolha confirmada estava correta */
    confirmedAnswers: Record<string, boolean>;
    answeredAt?: Date;
};

export type LessonOutcome = {
    award: XpAward | null;
    rewarded: boolean;
};

class LessonOutcomeServiceImpl {
    async recordCompletion(input: LessonOutcomeInput): Promise<LessonOutcome> {
        // A elegibilidade vem PRIMEIRO: gravar o recall avança o intervalo do
        // SM-2 e o card deixa de estar vencido, então na ordem inversa uma
        // revisão vencida nunca pagaria.
        const rewarded = await this.isRewardable(input.nodeId);
        const result = this.toQuizResult(input);

        await this.recordRecall(result);

        if (!rewarded) {
            return { award: null, rewarded: false };
        }

        const award = await this.recordReward(result);
        return { award, rewarded: true };
    }

    private async isRewardable(nodeId: string): Promise<boolean> {
        try {
            const snapshot = await JourneyProgressService.getSnapshot();
            const node = snapshot.track.units
                .flatMap((unit) => unit.nodes)
                .find((entry) => entry.id === nodeId);

            if (!node) {
                console.warn(`[LessonOutcomeService] Nó desconhecido "${nodeId}"; nada será premiado.`);
                return false;
            }

            if (node.type === 'review') {
                return snapshot.progress.pendingReviewNodeIds.includes(nodeId);
            }

            return !snapshot.progress.completedNodeIds.includes(nodeId);
        } catch (error) {
            // Falhar para "não premiar" é o lado seguro: nunca paga duas vezes.
            console.error('[LessonOutcomeService] Falha ao resolver elegibilidade:', error);
            return false;
        }
    }

    private toQuizResult({ block, confirmedAnswers, answeredAt }: LessonOutcomeInput): QuizResult {
        const choiceStepIds = block.steps
            .filter((definition) => definition.step.type === 'multiple-choice')
            .map((definition) => definition.contract.id);

        return {
            lessonId: block.lessonId,
            totalQuestions: choiceStepIds.length,
            correctAnswers: choiceStepIds.filter((stepId) => confirmedAnswers[stepId] === true).length,
            answeredAt: answeredAt ?? new Date(),
        };
    }

    private async recordRecall(result: QuizResult): Promise<void> {
        try {
            await SpacedRepetitionService.recordQuizResult(result);
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar recall:', error);
        }
    }

    private async recordReward(result: QuizResult): Promise<XpAward | null> {
        let award: XpAward | null = null;

        try {
            const granted = await GamificationService.recordQuizCompletion(result);
            award = granted.award;
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar XP:', error);
        }

        try {
            await DailyGoalService.recordQuizCompletion(result.answeredAt);
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar meta diária:', error);
        }

        return award;
    }
}

export const LessonOutcomeService = new LessonOutcomeServiceImpl();
