// Nota: `defaultTrack.ts` exporta `DEFAULT_JOURNEY_TRACK_DEFINITION`, não
// `defaultTrack` — o brief da task usava um nome de import que não existe no
// arquivo real. Reaproveitamos o alias para manter os testes legíveis.
import { DEFAULT_JOURNEY_TRACK_DEFINITION as defaultTrack } from '../../../data/journey/defaultTrack';
import type { DueCompetency } from '../../../types/competencyReview';
import type { JourneyProgress } from '../../../types/journey';
import { JourneyRecommendationService } from './JourneyRecommendationService';

function progressoInicial(): JourneyProgress {
    return {
        schemaVersion: '1',
        activeTrackId: defaultTrack.id,
        currentUnitId: defaultTrack.initialUnitId,
        currentNodeId: null,
        completedNodeIds: [],
        pendingReviewNodeIds: [],
        lastUpdatedAt: '2026-01-01T00:00:00.000Z',
        pendingSyncEvents: [],
    };
}

function vencida(competencyId: string, criticalSafety = false): DueCompetency {
    return { competencyId, retrievability: 0.2, criticalSafety };
}

describe('motivo da recomendação', () => {
    it('GUARDA DE REGRESSÃO: sem vencidas, o motivo é next-new', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(defaultTrack, progressoInicial());

        expect(snapshot.recommendationReason).toBe('next-new');
    });

    it('GUARDA DE REGRESSÃO: omitir o parâmetro é o mesmo que não ter vencidas', () => {
        const semParametro = JourneyRecommendationService.computeSnapshot(defaultTrack, progressoInicial());

        expect(semParametro.recommendationReason).toBe('next-new');
        expect(semParametro.nextRecommendedNode?.id).toBe('node:lesson-1');
    });

    it('GUARDA DE REGRESSÃO: o nó recomendado não muda por causa do parâmetro novo', () => {
        const semParametro = JourneyRecommendationService.computeSnapshot(defaultTrack, progressoInicial());
        const comVencidaIrrelevante = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:inexistente')],
        );

        expect(comVencidaIrrelevante.nextRecommendedNode?.id).toBe(semParametro.nextRecommendedNode?.id);
    });

    it('GUARDA DE ATIVAÇÃO: não recomenda revisão por competência sintética legada', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:lesson-1')],
        );

        expect(snapshot.nextRecommendedNode?.id).toBe('node:lesson-1');
        expect(snapshot.recommendationReason).toBe('next-new');
    });

    it('devolve next-new quando a vencida é coberta por outro nó, não pelo recomendado', () => {
        // Antes bastava qualquer nó não-`locked` cobrir a vencida, inclusive um
        // já concluído: o snapshot dizia "revisão vencida" enquanto a tela
        // mostrava o checkpoint inédito. O motivo agora descreve o que está na
        // tela, ou não descreve nada.
        const progresso = { ...progressoInicial(), completedNodeIds: ['node:lesson-1'] };

        const snapshot = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progresso, [vencida('competency:legacy:lesson-1')],
        );

        expect(snapshot.nextRecommendedNode?.id).toBe('node:checkpoint:foundations');
        expect(snapshot.recommendationReason).toBe('next-new');
    });

    it('NÃO destrava nó bloqueado, mesmo com vencida crítica apontando para ele', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:lesson-2', true)],
        );

        expect(snapshot.nextRecommendedNode?.status).not.toBe('locked');
        expect(snapshot.recommendationReason).toBe('next-new');
    });
});
