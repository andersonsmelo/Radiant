/**
 * Centraliza a persistência de tentativas de aprendizagem. As telas de lição
 * e de quiz terminam por caminhos diferentes, mas alimentam a mesma métrica
 * de acurácia; manter a resolução do tópico aqui impede que um caminho fique
 * silenciosamente sem histórico.
 */
import type { QuizResult } from '../../../types/quiz';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LearningAttemptsRepository } from './LearningAttemptsRepository';

class LearningAttemptRecorderImpl {
    async record(result: QuizResult, knownTopicId?: string | null): Promise<void> {
        try {
            let topicId = knownTopicId;
            if (topicId === undefined) {
                const snapshot = await JourneyProgressService.getSnapshot();
                const unit = snapshot.track.units.find((entry) =>
                    entry.nodes.some((node) => node.lessonId === result.lessonId),
                );
                const node = unit?.nodes.find((entry) => entry.lessonId === result.lessonId);
                topicId = node?.unitId ?? unit?.id;
            }

            // Um deep link para lição ausente do snapshot não inventa um tópico:
            // registrar algo mal classificado corromperia as estatísticas.
            if (!topicId) return;

            await LearningAttemptsRepository.append({
                lessonId: result.lessonId,
                topicId,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions,
                completedAt: result.answeredAt.toISOString(),
            });
        } catch (error) {
            // Tentativas são telemetria local de aprendizagem, nunca motivo para
            // impedir a conclusão de uma lição ou quiz.
            console.error('[LearningAttemptRecorder] Falha ao registrar tentativa:', error);
        }
    }
}

export const LearningAttemptRecorder = new LearningAttemptRecorderImpl();
