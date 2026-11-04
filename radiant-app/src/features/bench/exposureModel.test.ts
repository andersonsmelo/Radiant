import {
  REFERENCE_EXPOSURE,
  exposureModel,
  subjectContrast,
  type ExposureInput,
  type ExposureOutput,
} from './exposureModel';

/** Variação relativa entre dois valores, tomando o primeiro como base. */
function relativeChange(from: number, to: number): number {
  return Math.abs(to - from) / Math.abs(from);
}

/** Nove valores igualmente espaçados de `min` a `max`. */
function span(min: number, max: number): number[] {
  return Array.from({ length: 9 }, (_, index) => min + ((max - min) * index) / 8);
}

const MEASURES: (keyof ExposureOutput)[] = ['bone', 'soft', 'background', 'noise'];

describe('exposureModel — o kV controla a penetração e o contraste', () => {
  it('o contraste entre osso e partes moles cai quando o kV sobe de 50 para 100', () => {
    const low = subjectContrast(exposureModel({ kv: 50, mas: 10 }));
    const high = subjectContrast(exposureModel({ kv: 100, mas: 10 }));

    expect(low).toBeGreaterThan(0);
    expect(high).toBeGreaterThan(0);
    expect(high).toBeLessThan(low);
  });

  it('o contraste cai a cada passo do kV, do mínimo ao máximo', () => {
    const contrasts = span(40, 120).map((kv) => subjectContrast(exposureModel({ kv, mas: 10 })));

    contrasts.slice(1).forEach((contrast, index) => {
      expect(contrast).toBeLessThan(contrasts[index]);
      expect(contrast).toBeGreaterThan(0);
    });
  });

  it('o ruído não muda com o kV, dentro de 5%', () => {
    const base = exposureModel({ kv: 40, mas: 10 }).noise;

    span(40, 120).forEach((kv) => {
      expect(relativeChange(base, exposureModel({ kv, mas: 10 }).noise)).toBeLessThanOrEqual(0.05);
    });
  });
});

describe('exposureModel — o mAs controla o ruído, e o processamento digital mantém o brilho', () => {
  it('o ruído cai quando o mAs sobe de 2 para 20', () => {
    const grainy = exposureModel({ kv: 70, mas: 2 }).noise;
    const clean = exposureModel({ kv: 70, mas: 20 }).noise;

    expect(grainy).toBeGreaterThan(0);
    expect(clean).toBeGreaterThan(0);
    expect(clean).toBeLessThan(grainy);
  });

  it('o ruído cai com 1/√mAs: quadruplicar o mAs divide o ruído por dois', () => {
    const quarter = exposureModel({ kv: 70, mas: 2.5 }).noise;
    const whole = exposureModel({ kv: 70, mas: 10 }).noise;

    expect(quarter / whole).toBeCloseTo(2, 6);
  });

  it('osso, partes moles e fundo não mudam mais que 5% quando só o mAs muda', () => {
    [40, 70, 120].forEach((kv) => {
      const low = exposureModel({ kv, mas: 1 });
      const high = exposureModel({ kv, mas: 40 });

      (['bone', 'soft', 'background'] as const).forEach((region) => {
        expect(relativeChange(low[region], high[region])).toBeLessThanOrEqual(0.05);
      });
    });
  });

  it('o contraste entre osso e partes moles não muda mais que 5% quando só o mAs muda', () => {
    [40, 70, 120].forEach((kv) => {
      const base = subjectContrast(exposureModel({ kv, mas: 1 }));

      span(1, 40).forEach((mas) => {
        const contrast = subjectContrast(exposureModel({ kv, mas }));

        expect(relativeChange(base, contrast)).toBeLessThanOrEqual(0.05);
      });
    });
  });
});

describe('exposureModel — a convenção da radiografia e o domínio', () => {
  it('osso mais claro que partes moles, e estas mais claras que o fundo, em todo o domínio', () => {
    span(40, 120).forEach((kv) => {
      span(1, 40).forEach((mas) => {
        const out = exposureModel({ kv, mas });

        expect(out.bone).toBeGreaterThan(out.soft);
        expect(out.soft).toBeGreaterThan(out.background);
      });
    });
  });

  it('subjectContrast é a diferença entre osso e partes moles', () => {
    const out = exposureModel({ kv: 80, mas: 5 });

    expect(subjectContrast(out)).toBe(out.bone - out.soft);
  });

  it('o ponto de referência é 70 kV e 10 mAs, dentro do domínio', () => {
    expect(REFERENCE_EXPOSURE).toEqual({ kv: 70, mas: 10 });
  });

  it('todo valor fica entre 0 e 1, nos limites e fora deles', () => {
    const inputs: ExposureInput[] = [
      { kv: 40, mas: 1 },
      { kv: 40, mas: 40 },
      { kv: 120, mas: 1 },
      { kv: 120, mas: 40 },
      { kv: 0, mas: 0 },
      { kv: -50, mas: -3 },
      { kv: 1000, mas: 1000 },
      { kv: 70, mas: 0 },
    ];

    inputs.forEach((input) => {
      const out = exposureModel(input);

      MEASURES.forEach((measure) => {
        expect(Number.isFinite(out[measure])).toBe(true);
        expect(out[measure]).toBeGreaterThanOrEqual(0);
        expect(out[measure]).toBeLessThanOrEqual(1);
      });
    });
  });

  it('entrada fora do domínio é limitada ao domínio', () => {
    expect(exposureModel({ kv: 10, mas: 0.1 })).toEqual(exposureModel({ kv: 40, mas: 1 }));
    expect(exposureModel({ kv: 500, mas: 900 })).toEqual(exposureModel({ kv: 120, mas: 40 }));
  });

  it('entrada que não é número cai no ponto de referência', () => {
    expect(exposureModel({ kv: Number.NaN, mas: Number.NaN })).toEqual(
      exposureModel(REFERENCE_EXPOSURE),
    );
  });
});
