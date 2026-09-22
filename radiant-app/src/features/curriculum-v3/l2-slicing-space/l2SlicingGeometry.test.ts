import {
  MIDLINE_X,
  VIEWBOX_HEIGHT,
  bodyPathFor,
  candidatePathFor,
  candidatePaths,
  knownScenarioIds,
  orientationPaths,
  scenarioDetail,
  shouldRevealImmediately,
} from './l2SlicingGeometry';
import { L2_SLICING_SPACE } from './l2SlicingSpaceContent';

/**
 * Extrai os pontos de um `d` de SVG.
 *
 * Fica no teste, não na produção: o parecer v3 reprovou a lição por asseverar
 * sobre um espelho das props embarcado no componente só para os testes.
 */
const pointsOf = (path: string): readonly (readonly [number, number])[] => {
  const numbers = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const points: [number, number][] = [];
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    points.push([numbers[index], numbers[index + 1]]);
  }
  return points;
};

const horizontalExtent = (path: string): readonly [number, number] => {
  const xs = pointsOf(path).map(([x]) => x);
  return [Math.min(...xs), Math.max(...xs)];
};

const verticalExtent = (path: string): readonly [number, number] => {
  const ys = pointsOf(path).map(([, y]) => y);
  return [Math.min(...ys), Math.max(...ys)];
};

describe('geometria do modelo 2.5D da L2', () => {
  it('centra a silhueta no eixo mediano em TODO cenário, para que a placa mediana divida o corpo desenhado', () => {
    // A linha mediana, as placas e os marcadores vivem no mesmo grupo que a
    // silhueta e recebem a mesma translação de cenário. Se o caminho do corpo
    // trouxer o deslocamento embutido além dessa translação, o corpo anda duas
    // vezes e o eixo uma só — e a resposta correta de `l2-initial-median` e
    // `l2-median-recovery` passa a ser falsa no desenho.
    const offCentre = knownScenarioIds().filter((scenarioId) => {
      const [left, right] = horizontalExtent(bodyPathFor(scenarioId));
      return (left + right) / 2 !== MIDLINE_X;
    });

    expect(offCentre).toEqual([]);
  });

  it('desenha o plano coronal como área de face, não como segmento horizontal', () => {
    const coronal = orientationPaths.coronal;
    const [top, bottom] = verticalExtent(coronal);

    expect(coronal).toMatch(/Z\s*$/);
    expect(bottom - top).toBeGreaterThan(0);
  });

  it('distingue o coronal do transversal pela extensão vertical, não só pela altura', () => {
    const [coronalTop, coronalBottom] = verticalExtent(orientationPaths.coronal);
    const [transverseTop, transverseBottom] = verticalExtent(orientationPaths.transverse);

    expect(coronalBottom - coronalTop).toBeGreaterThan((transverseBottom - transverseTop) * 2);
  });

  it('dá entrada própria a cada cenário declarado pelo conteúdo', () => {
    const declared = [...new Set(L2_SLICING_SPACE.challenges.map((entry) => entry.visualScenarioId))];

    expect(declared.filter((id) => !knownScenarioIds().includes(id))).toEqual([]);
  });

  it('não repete legenda nem marcadores entre cenários de uma mesma família', () => {
    const initial = scenarioDetail('abdomen-transverse');
    const recovery = scenarioDetail('pelvis-coronal-recovery');

    expect(recovery.caption).not.toBe(initial.caption);
    expect([recovery.markerY, recovery.markerLeft, recovery.markerRight])
      .not.toEqual([initial.markerY, initial.markerLeft, initial.markerRight]);
  });

  it('revela a geometria final sem animar enquanto a preferência de movimento é desconhecida', () => {
    expect(shouldRevealImmediately({ reduceMotion: false, motionResolved: false })).toBe(true);
    expect(shouldRevealImmediately({ reduceMotion: true, motionResolved: true })).toBe(true);
    expect(shouldRevealImmediately({ reduceMotion: false, motionResolved: true })).toBe(false);
  });

  it('desenha todo candidato inteiramente dentro do quadro, em todo cenário', () => {
    // A guarda anterior exigia só que as matrizes DIFERISSEM entre cenários — e
    // uma translação que joga a figura para fora do `viewBox` satisfaz isso com
    // folga. Foi assim que a resposta correta de duas recuperações passou a ser
    // falsa no desenho: em `l2-section-recovery` a segunda das "duas faces" que
    // o texto da alternativa nomeia caía inteira fora do quadro.
    const offenders: string[] = [];
    for (const scenarioId of knownScenarioIds()) {
      for (const answerId of Object.keys(candidatePaths)) {
        const ys = pointsOf(candidatePathFor(answerId, scenarioId)).map(([, y]) => y);
        if (Math.min(...ys) < 0 || Math.max(...ys) > VIEWBOX_HEIGHT) {
          offenders.push(`${scenarioId}/${answerId}: ${Math.min(...ys)}..${Math.max(...ys)}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('mantém as duas faces do volume visíveis, que são o que a alternativa correta nomeia', () => {
    const ys = pointsOf(candidatePathFor('region-with-nominal-thickness', 'pelvis-region-thickness-recovery'))
      .map(([, y]) => y);

    expect(new Set(ys).size).toBeGreaterThanOrEqual(4);
    expect(Math.max(...ys)).toBeLessThanOrEqual(VIEWBOX_HEIGHT);
  });

  it('não move candidatos de corpo inteiro, que não pertencem a região nenhuma', () => {
    // Uma placa mediana corre da cabeça aos pés; ela não fica "na pelve".
    // Transladá-la para a região do cenário era errado antes de ser recorte.
    expect(candidatePathFor('median', 'pelvis-symmetry')).toBe(candidatePathFor('median', 'thorax-midline'));
    expect(candidatePathFor('coronal', 'pelvis-coronal-recovery')).toBe(candidatePathFor('coronal', 'abdomen-transverse'));
  });

  it('posiciona candidatos ligados a nível na região que o cenário nomeia', () => {
    const thorax = pointsOf(candidatePathFor('transverse', 'thorax-midline')).map(([, y]) => y);
    const pelvis = pointsOf(candidatePathFor('transverse', 'pelvis-coronal-recovery')).map(([, y]) => y);

    expect(Math.min(...pelvis)).toBeGreaterThan(Math.min(...thorax));
  });
});
