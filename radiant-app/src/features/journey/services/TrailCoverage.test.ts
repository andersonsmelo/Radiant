jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from './JourneyDefinitionService';

/**
 * Invariante que autorizou a absorção da Galáxia por Estude, e que continua
 * valendo depois dela: **toda lição do catálogo é alcançável pela trilha.**
 *
 * A cadeia GalaxyMapScreen → GalaxyInteriorScreen → PlanetInteriorScreen era um
 * dos três caminhos in-app até `/learn`, então removê-la exigia provar que nada
 * de currículo dependia dela. A medição de 2026-08-21 mostrou algo mais forte: o
 * único nó de lição da Galáxia apontava para `lessonId: 'fundamentos-radiologia'`,
 * que **não existe no catálogo** — a lição com esse título é `lesson-1`. A cadeia
 * já estava quebrada e não abria conteúdo nenhum.
 *
 * Este teste guarda a garantia que importa a partir de agora: com a trilha como
 * única superfície de acesso, uma lição que ela não alcance é uma lição que
 * ninguém abre.
 */
describe('cobertura do currículo pela trilha contínua', () => {
  it('toda lição do catálogo aparece em alguma unidade da trilha', async () => {
    const summaries = await LessonCatalogService.listLessonSummaries();
    const catalogIds = summaries.map((lesson) => lesson.id).sort();

    const tracks = await LessonCatalogService.listTracks();
    const trailIds = new Set<string>();
    for (const track of tracks) {
      const definition = JourneyDefinitionService.getTrackDefinition(track.id);
      for (const unit of definition?.units ?? []) {
        for (const node of unit.nodes) {
          if (node.lessonId) trailIds.add(node.lessonId);
        }
      }
    }

    const unreachable = catalogIds.filter((id) => !trailIds.has(id));

    expect(unreachable).toEqual([]);
    expect(catalogIds.length).toBeGreaterThan(0);
  });
});
