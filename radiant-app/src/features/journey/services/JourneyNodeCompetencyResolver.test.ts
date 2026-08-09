import type { JourneyNodeDefinition } from '../../../types/journey';
import { resolveNodeCompetencies } from './JourneyNodeCompetencyResolver';

function no(overrides: Partial<JourneyNodeDefinition> = {}): JourneyNodeDefinition {
    return {
        id: 'node:lesson-1',
        unitId: 'unit:foundations',
        type: 'lesson',
        title: 'Lição 1',
        lessonId: 'lesson-1',
        ...overrides,
    } as JourneyNodeDefinition;
}

describe('resolveNodeCompetencies', () => {
    it('resolve nó de lição legada para a competência sintética da lição', () => {
        const resultado = resolveNodeCompetencies(no());

        expect(resultado.competencyIds).toEqual(['competency:legacy:lesson-1']);
        expect(resultado.legacyOnly).toBe(true);
        expect(resultado.nodeId).toBe('node:lesson-1');
    });

    it('devolve lista vazia e não-legado quando o nó não aponta para lição', () => {
        const resultado = resolveNodeCompetencies(
            no({ id: 'node:checkpoint:foundations', type: 'checkpoint', lessonId: undefined }),
        );

        expect(resultado.competencyIds).toEqual([]);
        expect(resultado.legacyOnly).toBe(false);
    });

    it('marca legacyOnly quando toda competência resolvida tem o prefixo legado', () => {
        const resultado = resolveNodeCompetencies(no({ lessonId: 'lesson-2' }));

        expect(resultado.competencyIds.every((id) => id.startsWith('competency:legacy:'))).toBe(true);
        expect(resultado.legacyOnly).toBe(true);
    });
});
