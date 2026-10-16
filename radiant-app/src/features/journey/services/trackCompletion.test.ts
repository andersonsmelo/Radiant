import { isTrackCompleted } from './trackCompletion';
import type { JourneyNodeType } from '../../../types/journey';

function node(id: string, type: JourneyNodeType) {
  return { id, type };
}

const done = (ids: string[]) => (candidate: { id: string }) => ids.includes(candidate.id);

describe('isTrackCompleted — revisão é prática paralela (ADR 2026-10-16)', () => {
  const trilha = [
    node('l1', 'lesson'),
    node('r1', 'review'),
    node('l2', 'lesson'),
    node('r2', 'review'),
    node('reward', 'reward'),
  ];

  it('conclui a trilha com lições e conquista feitas, mesmo sem nenhuma revisão', () => {
    // Visto no simulador em 2026-10-16: "8 DE 8", conquista coletada, e a
    // trilha seguinte trancada porque uma revisão só abria em 21/10.
    expect(isTrackCompleted(trilha, done(['l1', 'l2', 'reward']))).toBe(true);
  });

  it('não conclui enquanto falta uma lição', () => {
    expect(isTrackCompleted(trilha, done(['l1', 'r1', 'r2', 'reward']))).toBe(false);
  });

  it('não conclui enquanto falta a conquista', () => {
    expect(isTrackCompleted(trilha, done(['l1', 'l2']))).toBe(false);
  });

  it('não trata trilha sem nó nenhum como concluída', () => {
    expect(isTrackCompleted([], done([]))).toBe(false);
  });

  it('não trata trilha só de revisões como concluída', () => {
    // Sem nó obrigatório não há o que concluir; abrir a seguinte de graça é
    // o que o cadeado existe para impedir.
    expect(isTrackCompleted([node('r1', 'review')], done(['r1']))).toBe(false);
  });
});
