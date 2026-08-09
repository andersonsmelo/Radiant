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

    it('devolve due-review quando uma vencida é coberta por nó já desbloqueado', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:lesson-1')],
        );

        expect(snapshot.recommendationReason).toBe('due-review');
    });

    it('NÃO destrava nó bloqueado, mesmo com vencida crítica apontando para ele', () => {
        const snapshot = JourneyRecommendationService.computeSnapshot(
            defaultTrack, progressoInicial(), [vencida('competency:legacy:lesson-2', true)],
        );

        expect(snapshot.nextRecommendedNode?.status).not.toBe('locked');
        expect(snapshot.recommendationReason).toBe('next-new');
    });
});
