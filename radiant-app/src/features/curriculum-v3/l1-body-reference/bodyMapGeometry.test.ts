import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { BodyReferenceMap } from './BodyReferenceMap';
import {
  CANVAS,
  LANDMARK_POSITIONS,
  MARKER_SIZE,
  canvasRotation,
  isBoxInsideFrame,
  labelCounterTransform,
  markerBounds,
  isInsideFrame,
  landmarkScreenPoint,
  landmarkScreenRegion,
  type BodyPerspective,
  type BodyPosture,
} from './bodyMapGeometry';

const POSTURES: readonly BodyPosture[] = ['anatomical', 'supine', 'prone'];
const PERSPECTIVES: readonly BodyPerspective[] = ['front', 'back'];
// Largura do quadro (tela menos o respiro de 16 pt de cada lado): do iPhone SE
// de 2ª geração (375) ao Pro Max (430).
const WIDTHS = [343, 370, 398];
const OPPOSITE = { direita: 'esquerda', esquerda: 'direita', cima: 'baixo', baixo: 'cima' } as const;
const COMBOS = POSTURES.flatMap((posture) => PERSPECTIVES.flatMap((perspective) => WIDTHS.map((width) => [posture, perspective, width] as const)));

describe('geometria do mapa corporal', () => {
  it('na posição anatômica vista de frente, a mão esquerda da pessoa aparece à direita de quem observa', () => {
    expect(landmarkScreenRegion('patient-left-hand', 'anatomical', 'front', 390)).toBe('direita');
    expect(landmarkScreenRegion('patient-right-hand', 'anatomical', 'front', 390)).toBe('esquerda');
  });

  it('vista por trás, a mão esquerda da pessoa aparece à esquerda de quem observa', () => {
    expect(landmarkScreenRegion('patient-left-hand', 'anatomical', 'back', 390)).toBe('esquerda');
    expect(landmarkScreenRegion('patient-right-hand', 'anatomical', 'back', 390)).toBe('direita');
  });

  it('em decúbito, a cabeça vai para uma lateral do quadro', () => {
    expect(landmarkScreenRegion('head-marker', 'supine', 'front', 390)).toBe('direita');
    expect(landmarkScreenRegion('head-marker', 'prone', 'front', 390)).toBe('esquerda');
  });

  it.each(COMBOS)('as duas mãos ficam em lados opostos (%s, %s, %i px)', (posture, perspective, width) => {
    const left = landmarkScreenRegion('patient-left-hand', posture, perspective, width);
    const right = landmarkScreenRegion('patient-right-hand', posture, perspective, width);
    expect(right).toBe(OPPOSITE[left]);
  });

  // Só as mãos: são os únicos landmarks cuja região vira texto (descrição da
  // lateralidade). Pontos perto do centro, como `inner-layer`, trocam de eixo
  // dominante em 320 px — medido ao escrever este plano — e não são descritos.
  it.each(COMBOS)('a região das mãos não depende da largura do aparelho (%s, %s, %i px)', (posture, perspective, width) => {
    for (const landmarkId of ['patient-left-hand', 'patient-right-hand']) {
      expect(landmarkScreenRegion(landmarkId, posture, perspective, width)).toBe(landmarkScreenRegion(landmarkId, posture, perspective, 390));
    }
  });

  it.each(COMBOS)('todo landmark fica dentro do quadro (%s, %s, %i px)', (posture, perspective, width) => {
    for (const landmarkId of Object.keys(LANDMARK_POSITIONS)) {
      expect({ landmarkId, inside: isInsideFrame(landmarkScreenPoint(landmarkId, posture, perspective, width), width) }).toEqual({ landmarkId, inside: true });
    }
  });

  it.each(POSTURES.flatMap((posture) => PERSPECTIVES.map((perspective) => [posture, perspective] as const)))(
    'o mapa desenhado usa a mesma rotação e o mesmo espelho da geometria (%s, %s)',
    (posture, perspective) => {
      const { getByTestId } = render(
        // Arquivo .ts, sem JSX: o Babel do Jest não lê JSX fora de .tsx.
        React.createElement(BodyReferenceMap, { posture, perspective, selectedRelation: 'medial-lateral', reduceMotion: true, onPostureChange: jest.fn(), onPerspectiveChange: jest.fn(), onRegionSelect: jest.fn() }),
      );
      const transform = (StyleSheet.flatten(getByTestId('body-map-canvas').props.style).transform ?? []) as Record<string, unknown>[];
      expect(transform).toContainEqual({ rotate: canvasRotation(posture) });
      expect(transform).toContainEqual({ scaleX: perspective === 'front' ? 1 : -1 });
    },
  );
});

type Matrix = readonly [number, number, number, number];
const multiply = (a: Matrix, b: Matrix): Matrix => [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]];
function matrixOf(transform: readonly Record<string, unknown>[]): Matrix {
  // Como no CSS: a lista multiplica da esquerda para a direita.
  return transform.reduce<Matrix>((acc, entry) => {
    if (typeof entry.scaleX === 'number') return multiply(acc, [entry.scaleX, 0, 0, 1]);
    if (typeof entry.rotate === 'string') {
      const t = (parseFloat(entry.rotate) * Math.PI) / 180;
      return multiply(acc, [Math.cos(t), -Math.sin(t), Math.sin(t), Math.cos(t)]);
    }
    return acc;
  }, [1, 0, 0, 1]);
}

describe('marcadores sobre o desenho — revisão no simulador, 2026-09-23', () => {
  it('o canvas tem o tamanho do viewBox, para desenho e marcadores usarem as mesmas coordenadas', () => {
    const { getByTestId } = render(
      React.createElement(BodyReferenceMap, { posture: 'anatomical', perspective: 'front', selectedRelation: 'medial-lateral', reduceMotion: true, onPostureChange: jest.fn(), onPerspectiveChange: jest.fn(), onRegionSelect: jest.fn() }),
    );
    const canvas = StyleSheet.flatten(getByTestId('body-map-canvas').props.style);
    expect([canvas.width, canvas.height]).toEqual([CANVAS.width, CANVAS.height]);
  });

  it('o marcador é centrado no ponto do landmark, não ancorado pelo canto', () => {
    const { getByTestId } = render(
      React.createElement(BodyReferenceMap, { posture: 'anatomical', perspective: 'front', selectedRelation: 'medial-lateral', reduceMotion: true, landmarks: [{ id: 'x', label: 'Mão 1', landmarkId: 'foot-marker', textDescription: 'pé' }], onPostureChange: jest.fn(), onPerspectiveChange: jest.fn(), onRegionSelect: jest.fn() }),
    );
    const marker = StyleSheet.flatten(getByTestId('landmark-foot-marker').props.style);
    const [x, y] = LANDMARK_POSITIONS['foot-marker'];
    expect([marker.left, marker.top, marker.width, marker.height]).toEqual([x - MARKER_SIZE / 2, y - MARKER_SIZE / 2, MARKER_SIZE, MARKER_SIZE]);
  });

  it.each(COMBOS)('o marcador inteiro, não só o ponto, fica dentro do quadro (%s, %s, %i px)', (posture, perspective, width) => {
    for (const landmarkId of Object.keys(LANDMARK_POSITIONS)) {
      expect({ landmarkId, inside: isBoxInsideFrame(markerBounds(landmarkId, posture, perspective, width), width) }).toEqual({ landmarkId, inside: true });
    }
  });

  it.each(POSTURES.flatMap((posture) => PERSPECTIVES.map((perspective) => [posture, perspective] as const)))(
    'o número do marcador aparece desvirado: canvas × rótulo = identidade (%s, %s)',
    (posture, perspective) => {
      const canvas = matrixOf([{ scaleX: perspective === 'front' ? 1 : -1 }, { rotate: canvasRotation(posture) }]);
      const composed = multiply(canvas, matrixOf(labelCounterTransform(posture, perspective)));
      expect(composed.map((v) => Math.round(v * 1e6) / 1e6 + 0)).toEqual([1, 0, 0, 1]);
      const { getByText } = render(
        React.createElement(BodyReferenceMap, { posture, perspective, selectedRelation: 'medial-lateral', reduceMotion: true, landmarks: [{ id: 'x', label: 'Mão 1', landmarkId: 'patient-left-hand', textDescription: 'mão' }], onPostureChange: jest.fn(), onPerspectiveChange: jest.fn(), onRegionSelect: jest.fn() }),
      );
      expect(StyleSheet.flatten(getByText('1').props.style).transform).toEqual(labelCounterTransform(posture, perspective));
    },
  );
});
