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
import { CompetencyReviewService } from '../../spaced-repetition/services/CompetencyReviewService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { JourneyRecommendationService } from '../../journey/services/JourneyRecommendationService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { LearningAttemptRecorder } from '../../progress/services/LearningAttemptRecorder';
import { LearningEvidenceRepository } from '../../mastery/repositories/LearningEvidenceRepository';
import { adaptLegacyBlock } from './LegacyLessonAdapter';
import type { DurationBand } from '../../../types/learningEvidence';
import type { LearningActivityV2 } from '../../../types/learningActivity';

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

export type ActivityOutcomeInput = Omit<LessonOutcomeInput, 'block'> & {
    activity: LearningActivityV2;
};

type MeasuredInteractionAnswers = Pick<
    LessonOutcomeInput,
    'confirmedAnswers' | 'durationBandByInteraction' | 'hintUsedByInteraction'
>;

export type LessonOutcome = {
    award: XpAward | null;
    rewarded: boolean;
    /**
     * A tentativa exatamente como foi gravada.
     *
     * A tela de conclusão precisa de `correctAnswers`, `totalQuestions`,
     * `lessonId` e `answeredAt` para montar estrelas e placar. Devolvê-los aqui,
     * em vez de deixar a tela derivá-los de novo do bloco ou da atividade,
     * fecha duas portas: a contagem não pode divergir da que alimentou a
     * acurácia, e `resolveBestLessonStars` recebe o MESMO `answeredAt` que
     * `recordAttempt` persistiu — é por esse carimbo que ela exclui a tentativa
     * atual do histórico ao calcular a melhor anterior. Um `new Date()` novo na
     * tela não casaria, e `improved` sairia sempre falso.
     */
    result: QuizResult;
};

class LessonOutcomeServiceImpl {
    async recordCompletion(input: LessonOutcomeInput): Promise<LessonOutcome> {
        // A elegibilidade vem PRIMEIRO: gravar o recall avança o intervalo do
        // SM-2 e o card deixa de estar vencido, então na ordem inversa uma
        // revisão vencida nunca pagaria.
        const { rewarded, topicId } = await this.resolveNode(input.nodeId);
        const result = this.toQuizResult(input);

        await this.recordRecall(result);
        await LearningAttemptRecorder.record(result, topicId);
        await this.recordEvidence(adaptLegacyBlock(input.block), input, result);
        await this.enqueueSync(result);

        if (!rewarded) {
            return { award: null, rewarded: false, result };
        }

        const award = await this.recordReward(result);
        return { award, rewarded: true, result };
    }

    async recordActivityCompletion(input: ActivityOutcomeInput): Promise<LessonOutcome> {
        const { rewarded, topicId } = await this.resolveNode(input.nodeId);
        const result = this.activityToQuizResult(input);

        await this.recordRecall(result);
        await LearningAttemptRecorder.record(result, topicId);
        await this.recordEvidence(input.activity, input, result);
        await this.enqueueSync(result);

        if (!rewarded) {
            return { award: null, rewarded: false, result };
        }

        const award = await this.recordReward(result);
        return { award, rewarded: true, result };
    }

    /**
     * Resolve, numa única leitura do snapshot, se a conclusão premia. A
     * tentativa é registrada pelo gravador compartilhado, que também resolve
     * a unidade para os dois caminhos de conclusão.
     */
    private async resolveNode(nodeId: string): Promise<{ rewarded: boolean; topicId: string | null }> {
        try {
            const snapshot = await JourneyProgressService.getSnapshot();
            const unit = snapshot.track.units.find((entry) => entry.nodes.some((node) => node.id === nodeId));
            const node = unit?.nodes.find((entry) => entry.id === nodeId);

            if (!node) {
                console.warn(`[LessonOutcomeService] Nó desconhecido "${nodeId}"; nada será premiado.`);
                return { rewarded: false, topicId: null };
            }

            const topicId = node.unitId ?? unit?.id ?? null;

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
    private async recordEvidence(
        activity: LearningActivityV2,
        input: MeasuredInteractionAnswers,
        result: QuizResult,
    ): Promise<void> {
        try {
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

            await this.observeCompetencies(activity, input, recordedAt);
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar evidência:', error);
        }
    }

    /**
     * Uma observação por COMPETÊNCIA, não por interação: o cartão modela a memória
     * da competência, e chamar o agendador uma vez por interação faria a mesma
     * sessão consolidar várias vezes o mesmo conhecimento.
     *
     * Acerto exige que todas as interações daquela competência tenham acertado;
     * dica basta uma. É a leitura conservadora, coerente com o resto do sistema:
     * ambiguidade resolve contra conceder domínio.
     *
     * Best-effort como o resto do arquivo: agendar não pode derrubar a conclusão.
     */
    private async observeCompetencies(
        activity: LearningActivityV2,
        input: MeasuredInteractionAnswers,
        recordedAt: string,
    ): Promise<void> {
        try {
            const porCompetencia = new Map<string, { acertou: boolean; usouDica: boolean }>();

            for (const step of activity.steps) {
                if (step.kind !== 'interaction') continue;

                const { interaction } = step;
                const competencyId = interaction.competencyIds[0];
                if (!competencyId) continue;

                const acertou = input.confirmedAnswers[interaction.id] === true;
                const usouDica = input.hintUsedByInteraction?.[interaction.id] ?? false;
                const atual = porCompetencia.get(competencyId);

                porCompetencia.set(competencyId, {
                    acertou: atual ? atual.acertou && acertou : acertou,
                    usouDica: atual ? atual.usouDica || usouDica : usouDica,
                });
            }

            for (const [competencyId, resumo] of porCompetencia) {
                await CompetencyReviewService.observeExposure({
                    competencyId,
                    grade: {
                        outcome: resumo.acertou ? 'correct' : 'incorrect',
                        hintUsed: resumo.usouDica,
                    },
                    // Competência legada não está no currículo, logo não carrega a
                    // marcação de segurança. Quando houver atividade v2, este valor
                    // passa a vir do currículo.
                    criticalSafety: false,
                    now: recordedAt,
                });
            }
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao observar competencias:', error);
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

    private activityToQuizResult({ activity, confirmedAnswers, answeredAt }: ActivityOutcomeInput): QuizResult {
        const interactionIds = activity.steps
            .filter((step) => step.kind === 'interaction')
            .map((step) => step.kind === 'interaction' ? step.interaction.id : '');

        return {
            lessonId: activity.id,
            totalQuestions: interactionIds.length,
            correctAnswers: interactionIds.filter((interactionId) => confirmedAnswers[interactionId] === true).length,
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
            await DailyGoalService.recordXp(award.totalXpAwarded, result.answeredAt);
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar XP:', error);
        }

        return award;
    }
}

export const LessonOutcomeService = new LessonOutcomeServiceImpl();
