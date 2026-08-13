/**
 * O vínculo lição→planeta é gerado; este teste guarda o que a geração promete
 * e, principalmente, que o mapa de galáxias CONSOME o que foi gerado. Um módulo
 * gerado que ninguém lê é indistinguível de um módulo que não existe.
 */
import { GALAXY_CATALOG } from './galaxy-catalog';
import { GALAXY_NODES_BY_BODY } from './galaxy-nodes';
import { AI_LESSONS } from './ai-lessons';
import { AI_TRACK } from './ai-catalog';

const corpos = GALAXY_CATALOG.flatMap((galaxia) => galaxia.bodies);
const nosDoMapa = corpos.flatMap((corpo) => corpo.nodes);

describe('vínculo lição→planeta no mapa de galáxias', () => {
  it('entrega no mapa todas as lições que o módulo gerado atribuiu', () => {
    const geradas = Object.values(GALAXY_NODES_BY_BODY)
      .flat()
      .map((no) => no.lessonId)
      .sort();
    const noMapa = nosDoMapa
      .map((no) => no.lessonId)
      .filter((id): id is string => Boolean(id?.startsWith('ai-lesson:')))
      .sort();

    // Se isto falhar com `noMapa` vazio, o módulo gerado deixou de ser
    // consumido — que é o defeito que este arquivo existe para pegar.
    expect(noMapa).toEqual(geradas);
  });

  it('põe as 16 lições da trilha no mapa, cada uma uma vez só', () => {
    const noMapa = nosDoMapa
      .map((no) => no.lessonId)
      .filter((id): id is string => Boolean(id?.startsWith('ai-lesson:')));

    expect(noMapa).toHaveLength(AI_TRACK.lessonIds.length);
    expect(new Set(noMapa).size).toBe(noMapa.length);
    expect([...noMapa].sort()).toEqual([...AI_TRACK.lessonIds].sort());
  });

  it('aponta cada nó para uma lição que existe de verdade no bundle', () => {
    const idsDeLicao = new Set(AI_LESSONS.map((licao) => licao.id));

    for (const no of nosDoMapa) {
      if (!no.lessonId?.startsWith('ai-lesson:')) continue;
      expect(idsDeLicao.has(no.lessonId)).toBe(true);
    }
  });

  it('não repete o rótulo de formato no título do nó', () => {
    for (const no of nosDoMapa) {
      // `type` já diz que o nó é uma lição; "Quiz:" no título faria o mapa
      // repetir a palavra dezesseis vezes.
      expect(no.title).not.toMatch(/^Quiz:/);
      expect(no.title.length).toBeGreaterThan(0);
    }
  });

  it('não esconde conteúdo atrás de galáxia travada', () => {
    for (const galaxia of GALAXY_CATALOG) {
      const temConteudo = galaxia.bodies.some((corpo) => corpo.nodes.length > 0);
      if (temConteudo) {
        expect(galaxia.status).not.toBe('locked');
      }
    }
  });

  it('não reduz o acesso que a trilha plana já dava', () => {
    // As 16 já eram alcançáveis pela trilha. Um nó nascendo `locked` no mapa
    // tiraria acesso em vez de acrescentar caminho.
    for (const no of nosDoMapa) {
      if (!no.lessonId?.startsWith('ai-lesson:')) continue;
      expect(no.status).not.toBe('locked');
    }
  });

  it('ordena as lições dentro do planeta pela sequência pedagógica da trilha', () => {
    for (const corpo of corpos) {
      const ordem = corpo.nodes
        .map((no) => no.lessonId)
        .filter((id): id is string => Boolean(id?.startsWith('ai-lesson:')))
        .map((id) => AI_TRACK.lessonIds.indexOf(id));

      expect(ordem).toEqual([...ordem].sort((a, b) => a - b));
    }
  });
});
