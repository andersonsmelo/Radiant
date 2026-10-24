import {
  DETECTOR_HEIGHT_CM,
  DETECTOR_WIDTH_CM,
  FULL_FIELD,
  UNEXPOSED_LUMINANCE,
  collimationModel,
  type CollimationInput,
} from './collimationModel';
import { exposureModel } from './exposureModel';
import { PHANTOM_HEIGHT, PHANTOM_WIDTH } from './exposureShader';

/** Os valores inteiros de `min` a `max`. */
function range(min: number, max: number): number[] {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

describe('collimationModel — o produto dose-área acompanha a área do campo', () => {
  it('o produto dose-área sobe a cada centímetro de largura, com a altura fixa', () => {
    const values = range(1, DETECTOR_WIDTH_CM).map(
      (fieldWidth) => collimationModel({ fieldWidth, fieldHeight: 20 }).relativeDoseArea,
    );

    values.slice(1).forEach((value, index) => {
      expect(value).toBeGreaterThan(values[index]);
      expect(value).toBeGreaterThan(0);
    });
  });

  it('o produto dose-área sobe a cada centímetro de altura, com a largura fixa', () => {
    const values = range(1, DETECTOR_HEIGHT_CM).map(
      (fieldHeight) => collimationModel({ fieldWidth: 15, fieldHeight }).relativeDoseArea,
    );

    values.slice(1).forEach((value, index) => {
      expect(value).toBeGreaterThan(values[index]);
      expect(value).toBeGreaterThan(0);
    });
  });

  it('fechar o campo baixa o produto dose-área: 18 × 24 cm dá menos que o campo todo', () => {
    const open = collimationModel(FULL_FIELD).relativeDoseArea;
    const closed = collimationModel({ fieldWidth: 18, fieldHeight: 24 }).relativeDoseArea;

    expect(closed).toBeGreaterThan(0);
    expect(closed).toBeLessThan(open);
  });

  it('o produto dose-área é proporcional à área: dobrar a largura o dobra', () => {
    const narrow = collimationModel({ fieldWidth: 6, fieldHeight: 20 }).relativeDoseArea;
    const wide = collimationModel({ fieldWidth: 12, fieldHeight: 20 }).relativeDoseArea;

    expect(wide / narrow).toBeCloseTo(2, 9);
  });

  it('o produto dose-área depende só da área: 10 × 20 e 20 × 10 dão o mesmo', () => {
    expect(collimationModel({ fieldWidth: 10, fieldHeight: 20 }).relativeDoseArea).toBeCloseTo(
      collimationModel({ fieldWidth: 20, fieldHeight: 10 }).relativeDoseArea,
      12,
    );
  });

  it('o produto dose-área relativo é a área dividida pela do campo todo, que vale 1', () => {
    const fullArea = DETECTOR_WIDTH_CM * DETECTOR_HEIGHT_CM;

    expect(collimationModel(FULL_FIELD).relativeDoseArea).toBe(1);
    [
      { fieldWidth: 1, fieldHeight: 1 },
      { fieldWidth: 18, fieldHeight: 24 },
      { fieldWidth: 27, fieldHeight: 5 },
    ].forEach((input) => {
      const out = collimationModel(input);
      expect(out.area).toBe(input.fieldWidth * input.fieldHeight);
      expect(out.relativeDoseArea).toBeCloseTo(out.area / fullArea, 12);
    });
  });
});

describe('collimationModel — o campo na imagem', () => {
  it('a imagem do fantoma cobre 27 × 33 cm: 10 unidades da prancheta por centímetro', () => {
    expect(DETECTOR_WIDTH_CM * 10).toBe(PHANTOM_WIDTH);
    expect(DETECTOR_HEIGHT_CM * 10).toBe(PHANTOM_HEIGHT);
    expect(FULL_FIELD).toEqual({ fieldWidth: DETECTOR_WIDTH_CM, fieldHeight: DETECTOR_HEIGHT_CM });
  });

  it('a fração do campo é a medida dividida pela da imagem, de 0 a 1', () => {
    const out = collimationModel({ fieldWidth: 18, fieldHeight: 22 });

    expect(out.fieldFraction.width).toBeCloseTo(18 / 27, 12);
    expect(out.fieldFraction.height).toBeCloseTo(22 / 33, 12);
    expect(collimationModel(FULL_FIELD).fieldFraction).toEqual({ width: 1, height: 1 });
  });

  it('fora do campo, a região sem feixe é mais clara que o osso, em qualquer kV', () => {
    // Na convenção da imagem, quanto menos sinal, mais claro: sem feixe nenhum,
    // nada é mais claro. A região colimada não pode se confundir com o osso.
    [40, 70, 120].forEach((kv) => {
      expect(UNEXPOSED_LUMINANCE).toBeGreaterThan(exposureModel({ kv, mas: 10 }).bone);
    });
    expect(UNEXPOSED_LUMINANCE).toBeLessThanOrEqual(1);
  });
});

describe('collimationModel — o domínio', () => {
  it('entrada fora do domínio é limitada a 1 cm e ao tamanho da imagem', () => {
    expect(collimationModel({ fieldWidth: 0, fieldHeight: -4 })).toEqual(
      collimationModel({ fieldWidth: 1, fieldHeight: 1 }),
    );
    expect(collimationModel({ fieldWidth: 90, fieldHeight: 400 })).toEqual(collimationModel(FULL_FIELD));
    expect(collimationModel({ fieldWidth: 90, fieldHeight: 10 }).fieldWidth).toBe(DETECTOR_WIDTH_CM);
  });

  it('entrada que não é número cai no campo todo', () => {
    expect(collimationModel({ fieldWidth: Number.NaN, fieldHeight: Number.POSITIVE_INFINITY })).toEqual(
      collimationModel(FULL_FIELD),
    );
  });

  it('o produto dose-área e as frações ficam entre 0 e 1, nos limites e fora deles', () => {
    const inputs: CollimationInput[] = [
      { fieldWidth: 1, fieldHeight: 1 },
      { fieldWidth: 27, fieldHeight: 33 },
      { fieldWidth: 0, fieldHeight: 0 },
      { fieldWidth: 1000, fieldHeight: 1000 },
      { fieldWidth: 12.5, fieldHeight: 3.2 },
    ];

    inputs.forEach((input) => {
      const out = collimationModel(input);
      [out.relativeDoseArea, out.fieldFraction.width, out.fieldFraction.height].forEach((measure) => {
        expect(Number.isFinite(measure)).toBe(true);
        expect(measure).toBeGreaterThan(0);
        expect(measure).toBeLessThanOrEqual(1);
      });
    });
  });
});
