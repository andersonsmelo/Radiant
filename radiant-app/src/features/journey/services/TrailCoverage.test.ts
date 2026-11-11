import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from './JourneyDefinitionService';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));


// Contagem independente: lê as aulas-fonte direto do repositório, sem passar pelo gerador.
type SourceUnit = { unit: { id: string }; sources: unknown[]; lessons: { id: string; interactions: unknown[]; checkpoint: unknown[] }[] };
function readSourceUnits(): SourceUnit[] {
    const fs = jest.requireActual<typeof import('fs')>('fs');
    const path = jest.requireActual<typeof import('path')>('path');
    const dir = path.resolve(__dirname, '../../../../../content-manifest/rtg-2026/aulas');
    return (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(name => name.endsWith('.json'))
        .map(name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')) as SourceUnit);
}
const sourceUnits = readSourceUnits();
const sum = (pick: (unit: SourceUnit) => number) => sourceUnits.reduce((total, unit) => total + pick(unit), 0);

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
    expect(require('../../../data/curriculum-state.json').state).toBe('retired');
    // O catálogo é a trilha rtg-2026 inteira e nada além dela: uma aula por aula-fonte, uma trilha por unidade.
    expect(catalogIds).toEqual(sourceUnits.flatMap(unit => unit.lessons.map(lesson => `activity:rtg-2026:${unit.unit.id}:aula-${lesson.id.slice(-2)}`)).sort());
    expect(trailIds.size).toBe(sum(unit => unit.lessons.length));
    expect(tracks.map(track => track.id).sort()).toEqual(sourceUnits.map(unit => `track:rtg-2026:${unit.unit.id}`).sort());
  });
});
