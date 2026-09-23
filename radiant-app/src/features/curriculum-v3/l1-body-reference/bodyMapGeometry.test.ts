import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { BodyReferenceMap } from './BodyReferenceMap';
import {
  LANDMARK_POSITIONS,
  canvasRotation,
  isInsideFrame,
  landmarkScreenPoint,
  landmarkScreenRegion,
  type BodyPerspective,
  type BodyPosture,
} from './bodyMapGeometry';

const POSTURES: readonly BodyPosture[] = ['anatomical', 'supine', 'prone'];
const PERSPECTIVES: readonly BodyPerspective[] = ['front', 'back'];
const WIDTHS = [320, 390, 430];
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
