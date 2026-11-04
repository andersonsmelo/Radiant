import type { JourneyNode, JourneyNodeStatus } from '../../../types/journey';
import { getRecommendationActionCopy, getRecommendationCopy, getStatusCopy } from './nodeCopy';

// As palavras do estado são lidas pelos roteiros Maestro (`<título>. <estado>.`).
// Estes testes fixam o que o cartão dizia no dia em que elas saíram dele.

function node(status: JourneyNodeStatus, overrides: Partial<JourneyNode> = {}): JourneyNode {
  return { id: `node-${status}`, unitId: 'unit-1', type: 'lesson', title: 'Aula', status, ...overrides };
}

describe('getStatusCopy', () => {
  it.each([
    ['completed', 'Concluído'],
    ['active', 'Em andamento'],
    ['resumable', 'Retomar'],
    ['due-review', 'Revisar'],
    ['available', 'Disponível'],
    ['locked', 'Bloqueado'],
  ] as const)('diz "%s" como "%s"', (status, copy) => {
    expect(getStatusCopy(node(status))).toBe(copy);
  });

  describe('revisão ainda não liberada', () => {
    afterEach(() => jest.restoreAllMocks());

    it('diz quando abre, em dd/mm/aaaa às hh:mm no relógio local', () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2026, 9, 12, 23, 59).getTime());
      const review = node('locked', { type: 'review', reviewAvailableAtMs: new Date(2026, 0, 3, 7, 5).getTime() });
      // O instante já passou em relação ao relógio acima: cai no estado.
      expect(getStatusCopy(review)).toBe('Bloqueado');

      const future = node('locked', { type: 'review', reviewAvailableAtMs: new Date(2026, 9, 13, 0, 5).getTime() });
      expect(getStatusCopy(future)).toBe('Disponível em 13/10/2026 às 00:05');
    });

    it('completa dia, mês e hora com zero à esquerda', () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2026, 0, 1).getTime());
      const review = node('locked', { type: 'review', reviewAvailableAtMs: new Date(2026, 1, 3, 7, 5).getTime() });
      expect(getStatusCopy(review)).toBe('Disponível em 03/02/2026 às 07:05');
    });

    it('só vale para revisão: lição com instante futuro continua com o estado', () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2026, 9, 12).getTime());
      const lesson = node('locked', { reviewAvailableAtMs: new Date(2026, 9, 13).getTime() });
      expect(getStatusCopy(lesson)).toBe('Bloqueado');
    });

    it('ignora instante que não é número', () => {
      const review = node('due-review', { type: 'review', reviewAvailableAtMs: Number.NaN });
      expect(getStatusCopy(review)).toBe('Revisar');
    });
  });
});

describe('getRecommendationCopy', () => {
  it('não diz nada de um nó que não é o recomendado', () => {
    expect(getRecommendationCopy(false, 'due-review', 3)).toBeNull();
  });

  it('diz "Continuar de onde parou" para a lição pausada', () => {
    expect(getRecommendationCopy(true, 'paused-lesson', 0)).toBe('Continuar de onde parou');
  });

  it('conta as revisões devidas, no singular e no plural', () => {
    expect(getRecommendationCopy(true, 'due-review', 1)).toBe('Revisão devida · 1 devida');
    expect(getRecommendationCopy(true, 'due-review', 2)).toBe('Revisão devida · 2 devidas');
  });

  it.each(['next-lesson', 'checkpoint', 'reward', undefined] as const)(
    'diz "Próximo passo" para o motivo %s',
    (reason) => {
      expect(getRecommendationCopy(true, reason, 0)).toBe('Próximo passo');
    },
  );
});

// A ação sob a medalha recomendada. Ela saiu do cartão de recomendação, que a
// trilha substituiu, com as mesmas palavras: os roteiros Maestro tocam
// "Continuar trilha" e "Receber conquista" pelo texto.
describe('getRecommendationActionCopy', () => {
  it.each([
    ['lesson', 'available', 'next-lesson', 'Continuar trilha'],
    ['lesson', 'active', undefined, 'Continuar trilha'],
    ['lesson', 'resumable', 'next-lesson', 'Retomar lição'],
    ['lesson', 'available', 'paused-lesson', 'Retomar lição'],
    ['review', 'due-review', 'due-review', 'Fazer revisão'],
    ['review', 'resumable', 'due-review', 'Retomar revisão'],
    ['review', 'available', 'paused-lesson', 'Retomar revisão'],
    ['checkpoint', 'available', 'checkpoint', 'Fazer avaliação'],
    ['checkpoint', 'resumable', 'checkpoint', 'Retomar avaliação'],
    ['reward', 'available', 'reward', 'Receber conquista'],
    // A conquista não se retoma: mesmo pausada, ela só se recebe.
    ['reward', 'resumable', 'paused-lesson', 'Receber conquista'],
  ] as const)('%s em %s, pelo motivo %s, diz "%s"', (type, status, reason, copy) => {
    expect(getRecommendationActionCopy(node(status, { type }), reason)).toBe(copy);
  });
});
