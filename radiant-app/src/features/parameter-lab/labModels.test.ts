import { LAB_MODEL_IDS, LAB_MODELS, isOnLabGrid, labGoalText, type LabModelId } from './labModels';

const readout = (id: LabModelId, v: number) => LAB_MODELS[id].readouts(v).map((r) => `${r.label}: ${r.value}`);

describe('modelos do laboratório', () => {
  it('lista os três modelos', () => {
    expect([...LAB_MODEL_IDS]).toEqual(['inverse-square', 'shielding', 'decay']);
  });

  it.each(LAB_MODEL_IDS)('%s: diagramId é texto não vazio', (id) => {
    expect(typeof LAB_MODELS[id].diagramId).toBe('string');
    expect(LAB_MODELS[id].diagramId.length).toBeGreaterThan(0);
  });

  it.each(LAB_MODEL_IDS)('%s: progress é 0 no mínimo e 1 no máximo', (id) => {
    const { min, max } = LAB_MODELS[id].parameter;
    expect(LAB_MODELS[id].progress(min)).toBe(0);
    expect(LAB_MODELS[id].progress(max)).toBe(1);
  });

  it('inverse-square: distância de 1 a 4 m, intensidade 100 / d²', () => {
    expect(LAB_MODELS['inverse-square'].parameter).toEqual({ label: 'Distância', unit: 'm', min: 1, max: 4, step: 0.5 });
    expect(readout('inverse-square', 1)).toEqual(['Intensidade relativa: 100%']);
    expect(readout('inverse-square', 1.5)).toEqual(['Intensidade relativa: 44,4%']);
    expect(readout('inverse-square', 2.5)).toEqual(['Intensidade relativa: 16%']);
    expect(readout('inverse-square', 4)).toEqual(['Intensidade relativa: 6,3%']);
    expect(LAB_MODELS['inverse-square'].progress(2.5)).toBe(0.5);
  });

  it('shielding: 0 a 5 camadas, 100 / 2ⁿ', () => {
    expect(LAB_MODELS.shielding.parameter).toEqual({ label: 'Camadas semirredutoras', unit: 'camadas', min: 0, max: 5, step: 1 });
    expect(readout('shielding', 0)).toEqual(['Radiação que passa: 100%']);
    expect(readout('shielding', 2)).toEqual(['Radiação que passa: 25%']);
    expect(readout('shielding', 3)).toEqual(['Radiação que passa: 12,5%']);
    expect(readout('shielding', 5)).toEqual(['Radiação que passa: 3,1%']);
    expect(LAB_MODELS.shielding.progress(1)).toBeCloseTo(0.2, 12);
  });

  it('decay: 0 a 6 meias-vidas, 100 / 2ⁿ', () => {
    expect(LAB_MODELS.decay.parameter).toEqual({ label: 'Meias-vidas', unit: 'meias-vidas', min: 0, max: 6, step: 1 });
    expect(readout('decay', 0)).toEqual(['Atividade restante: 100%']);
    expect(readout('decay', 3)).toEqual(['Atividade restante: 12,5%']);
    expect(readout('decay', 6)).toEqual(['Atividade restante: 1,6%']);
    expect(LAB_MODELS.decay.progress(3)).toBe(0.5);
  });

  it('isOnLabGrid: na grade, fora da grade e fora do intervalo', () => {
    expect(isOnLabGrid('inverse-square', 1)).toBe(true);
    expect(isOnLabGrid('inverse-square', 2.5)).toBe(true);
    expect(isOnLabGrid('inverse-square', 4)).toBe(true);
    expect(isOnLabGrid('inverse-square', 1.2)).toBe(false);
    expect(isOnLabGrid('inverse-square', 0.5)).toBe(false);
    expect(isOnLabGrid('inverse-square', 4.5)).toBe(false);
    expect(isOnLabGrid('shielding', 0)).toBe(true);
    expect(isOnLabGrid('shielding', 5)).toBe(true);
    expect(isOnLabGrid('shielding', 2.5)).toBe(false);
    expect(isOnLabGrid('shielding', -1)).toBe(false);
    expect(isOnLabGrid('shielding', 6)).toBe(false);
    expect(isOnLabGrid('decay', 6)).toBe(true);
    expect(isOnLabGrid('decay', 7)).toBe(false);
    expect(isOnLabGrid('decay', Number.NaN)).toBe(false);
    // erro de ponto flutuante tolerado
    expect(isOnLabGrid('inverse-square', 1 + 0.1 * 5 + 1e-12)).toBe(true);
  });

  it('labGoalText: valor, faixa e limite aberto, com vírgula decimal e a unidade do modelo', () => {
    expect(labGoalText('inverse-square', { atLeast: 2 })).toBe('2 m ou mais');
    expect(labGoalText('inverse-square', { atMost: 1.5 })).toBe('até 1,5 m');
    expect(labGoalText('shielding', { atLeast: 3, atMost: 5 })).toBe('de 3 a 5 camadas');
    expect(labGoalText('decay', { atLeast: 4, atMost: 4 })).toBe('4 meias-vidas');
  });
});
