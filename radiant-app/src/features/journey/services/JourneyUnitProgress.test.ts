import { computeUnitPrimaryProgress } from './JourneyUnitProgress';
import type { JourneyUnit } from '../../../types/journey';

function makeUnit(nodes: JourneyUnit['nodes']): JourneyUnit {
  return { id: 'unit-1', title: 'Unidade', nodes };
}

describe('computeUnitPrimaryProgress', () => {
  it('retorna zero/zero quando não há unidade ativa', () => {
    expect(computeUnitPrimaryProgress(null)).toEqual({ completed: 0, total: 0 });
  });

  it('conta só os nós primários (exclui review) no total, e só os concluídos entre eles', () => {
    // Mutação que este teste pega: incluir nós de review no total ou no
    // completed, ou contar como concluído qualquer status diferente de
    // 'completed'.
    const unit = makeUnit([
      { id: 'n1', unitId: 'unit-1', type: 'lesson', title: 'Lição 1', status: 'completed' },
      { id: 'n2', unitId: 'unit-1', type: 'lesson', title: 'Lição 2', status: 'available' },
      { id: 'n3', unitId: 'unit-1', type: 'checkpoint', title: 'Checkpoint', status: 'completed' },
      { id: 'n4', unitId: 'unit-1', type: 'review', title: 'Revisão', status: 'completed' },
    ]);

    expect(computeUnitPrimaryProgress(unit)).toEqual({ completed: 2, total: 3 });
  });

  it('conta zero concluídos quando nenhum nó primário está completed', () => {
    const unit = makeUnit([
      { id: 'n1', unitId: 'unit-1', type: 'lesson', title: 'Lição 1', status: 'locked' },
      { id: 'n2', unitId: 'unit-1', type: 'reward', title: 'Conquista', status: 'available' },
    ]);

    expect(computeUnitPrimaryProgress(unit)).toEqual({ completed: 0, total: 2 });
  });
});
