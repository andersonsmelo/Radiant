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
 *
 * Consequência decidida e registrada: uma conclusão anterior à v1.3 (quando o laço
 * de gamificação ainda não tinha escritor alcançável) nunca é paga, e **não existe
 * backfill** — ver `docs/adr/ADR-2026-07-31-progresso-anterior-nao-retroativo.md`.
 * Antes de propor uma migração aqui, leia o ADR: ele mede a população afetada e
 * explica em que momento o mecanismo passa a ser necessário.
 */

import type { LessonBlock } from '../../../types/lessonFlow';
import type { QuizResult } from '../../../types/quiz';
import type { XpAward } from '../../../types/gamification';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { JourneyRecommendationService } from '../../journey/services/JourneyRecommendationService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import { LearningEvidenceRepository } from '../../mastery/repositories/LearningEvidenceRepository';
import { adaptLegacyBlock } from './LegacyLessonAdapter';
import type { DurationBand } from '../../../types/learningEvidence';

export type LessonOutcomeInput = {
    block: LessonBlock;
    nodeId: string;
    /** stepId do passo interativo → a escolha confirmada estava correta */
    confirmedAnswers: Record<string, boolean>;
    answeredAt?: Date;
    /**
     * Opcionais porque o player legado não os mede. Declarados desde já para que
     * o motor v2 possa preenchê-los sem mudar este contrato — e ausentes viram
     * `unknown`/`false`, que é o registro honesto de "não medido", nunca um
     * valor plausível inventado.
     */
    durationBandByInteraction?: Record<string, DurationBand>;
    hintUsedByInteraction?: Record<string, boolean>;
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
        const { rewarded, topicId } = await this.resolveNode(input.nodeId);
        const result = this.toQuizResult(input);

        await this.recordRecall(result);
        await this.recordAttempt(result, topicId);
        await this.recordEvidence(input, result);
        await this.enqueueSync(result);

        if (!rewarded) {
            return { award: null, rewarded: false };
        }

        const award = await this.recordReward(result);
        return { award, rewarded: true };
    }

    /**
     * Resolve, numa única leitura do snapshot, se a conclusão premia e a qual
     * unidade o nó pertence. A unidade é o agrupador que o domínio realmente
     * tem: `QuizLesson` não carrega tópico, então usar `unitId` evita inventar
     * uma taxonomia que ninguém mantém.
     */
    private async resolveNode(nodeId: string): Promise<{ rewarded: boolean; topicId: string | null }> {
        try {
            const snapshot = await JourneyProgressService.getSnapshot();
            const node = snapshot.track.units
                .flatMap((unit) => unit.nodes)
                .find((entry) => entry.id === nodeId);

            if (!node) {
                console.warn(`[LessonOutcomeService] Nó desconhecido "${nodeId}"; nada será premiado.`);
                return { rewarded: false, topicId: null };
            }

            const topicId = node.unitId ?? null;

            // A autorização mora aqui pelo mesmo motivo que mora em
            // `markNodeCompleted`: este também é um ponto de escrita — XP,
            // sequência e meta diária. A tela chama os dois em sequência, e
            // guardar só o segundo piorou o primeiro: com o nó recusado nunca
            // entrando em `completedNodeIds`, o predicado de reincidência
            // abaixo nunca fecha, e o mesmo deep link pagaria para sempre.
            //
            // A régua é `unlockRule`, não o status cru, e a checagem vem antes
            // do despacho por tipo — as duas coisas espelham `markNodeCompleted`
            // de propósito: duas réguas diferentes para a mesma pergunta
            // voltariam a divergir.
            if (!JourneyRecommendationService.isNodeUnlocked(node, snapshot.progress)) {
                console.warn(
                    `[LessonOutcomeService] Nó "${nodeId}" não está destravado; nada será premiado.`
                );
                return { rewarded: false, topicId };
            }

            if (node.type === 'review') {
                return { rewarded: snapshot.progress.pendingReviewNodeIds.includes(nodeId), topicId };
            }

            return { rewarded: !snapshot.progress.completedNodeIds.includes(nodeId), topicId };
        } catch (error) {
            // Falhar para "não premiar" é o lado seguro: nunca paga duas vezes.
            console.error('[LessonOutcomeService] Falha ao resolver elegibilidade:', error);
            return { rewarded: false, topicId: null };
        }
    }

    /**
     * Grava a tentativa que alimenta a acurácia. Roda mesmo quando a conclusão
     * não premia: refazer uma lição não paga XP, mas continua sendo informação
     * sobre memória.
     */
    private async recordAttempt(result: QuizResult, topicId: string | null): Promise<void> {
        if (!topicId) return;

        try {
            await LearningAttemptsRepository.append({
                lessonId: result.lessonId,
                topicId,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions,
                completedAt: result.answeredAt.toISOString(),
            });
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar tentativa:', error);
        }
    }

    /**
     * Grava uma evidência por interação, e não uma por lição.
     *
     * A competência e o tipo de evidência saem do **adaptador**, não de uma
     * segunda leitura do bloco: é ele que sabe que conteúdo legado produz
     * `legacy-lesson-recall` sob competência sintética. Derivar isso aqui de
     * novo criaria uma segunda definição da mesma regra, e as duas divergiriam
     * no dia em que o catálogo começasse a ter atividade v2 nativa.
     *
     * Best-effort como o resto: evidência não pode derrubar a conclusão.
     */
    private async recordEvidence(input: LessonOutcomeInput, result: QuizResult): Promise<void> {
        try {
            const activity = adaptLegacyBlock(input.block);
            const recordedAt = result.answeredAt.toISOString();

            for (const step of activity.steps) {
                if (step.kind !== 'interaction') continue;

                const { interaction } = step;
                await LearningEvidenceRepository.append({
                    activityId: activity.id,
                    interactionId: interaction.id,
                    competencyId: interaction.competencyIds[0],
                    evidenceKind: interaction.evidenceKind,
                    outcome: input.confirmedAnswers[interaction.id] === true ? 'correct' : 'incorrect',
                    hintUsed: input.hintUsedByInteraction?.[interaction.id] ?? false,
                    durationBand: input.durationBandByInteraction?.[interaction.id] ?? 'unknown',
                    contentVersion: activity.provenance.contentVersion,
                    recordedAt,
                });
            }
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar evidência:', error);
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

    private async enqueueSync(result: QuizResult): Promise<void> {
        // A API pública está em 502. Enfileirar mantém o card local e o remoto
        // convergentes quando ela voltar, e falhar aqui não pode derrubar a
        // conclusão da lição.
        try {
            await SyncQueueService.enqueueLessonProgressFromQuizResult(result);

            const cardState = await SpacedRepetitionService.getCardState(result.lessonId);
            if (cardState) {
                await SyncQueueService.enqueueReviewCard(cardState);
            }

            await SyncQueueService.flush();
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao enfileirar sincronização:', error);
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
