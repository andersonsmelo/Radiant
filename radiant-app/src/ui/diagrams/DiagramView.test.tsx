import React from 'react';
import { render } from '@testing-library/react-native';

import {
  useReducedMotionPreferenceState,
  type ReducedMotionPreference,
} from '../accessibility/useReducedMotionPreference';
import { useScreenFocused } from '../useScreenFocused';
import { DiagramView } from './DiagramView';
import { diagramSvgAt } from './diagramMotion';
import { DIAGRAMS } from './diagramRegistry';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreferenceState: jest.fn(),
}));

jest.mock('../useScreenFocused', () => ({ useScreenFocused: jest.fn() }));

const setPreference = (value: ReducedMotionPreference) =>
  (useReducedMotionPreferenceState as jest.Mock).mockReturnValue(value);
const HIDDEN = { includeHiddenElements: true };

describe('DiagramView', () => {
  beforeEach(() => {
    setPreference({ reducedMotionEnabled: false, resolved: true });
    (useScreenFocused as jest.Mock).mockReturnValue(true);
  });

  it('com "reduzir movimento" desenha o pôster, sem camadas animadas', () => {
    setPreference({ reducedMotionEnabled: true, resolved: true });
    const view = render(<DiagramView id="colimador-abrindo" />);
    expect(view.queryAllByTestId('diagram-layer')).toHaveLength(0);
    expect(view.getByTestId('diagram-still').props.xml).toBe(diagramSvgAt(DIAGRAMS['colimador-abrindo'], 0.5));
  });

  it('enquanto a preferência não resolve, também fica parado', () => {
    setPreference({ reducedMotionEnabled: false, resolved: false });
    const view = render(<DiagramView id="colimador-abrindo" />);
    expect(view.queryAllByTestId('diagram-layer')).toHaveLength(0);
  });

  it('laço com movimento liberado anima só as camadas com movimento', () => {
    const view = render(<DiagramView id="colimador-abrindo" />);
    const layers = DIAGRAMS['colimador-abrindo'].layers;
    expect(view.getAllByTestId('diagram-layer')).toHaveLength(layers.filter((l) => l.motion).length);
    // campo, cobertura do receptor e tubo: três blocos parados, separados por camadas móveis.
    expect(view.getAllByTestId('diagram-static-layer')).toHaveLength(3);
  });

  it('fora de foco desenha o pôster', () => {
    (useScreenFocused as jest.Mock).mockReturnValue(false);
    const view = render(<DiagramView id="colimador-abrindo" />);
    expect(view.queryAllByTestId('diagram-layer')).toHaveLength(0);
    expect(view.getByTestId('diagram-still').props.xml).toBe(diagramSvgAt(DIAGRAMS['colimador-abrindo'], 0.5));
  });

  it('diagrama sem periodMs desenha parado', () => {
    const view = render(<DiagramView id="tubo-raios-x" />);
    expect(view.queryAllByTestId('diagram-layer')).toHaveLength(0);
    expect(view.getByTestId('diagram-still').props.xml).toBe(diagramSvgAt(DIAGRAMS['tubo-raios-x'], 0));
  });

  it('com progress, quem chama dirige o quadro', () => {
    const view = render(<DiagramView id="colimador-abrindo" progress={0.25} />);
    expect(view.getByTestId('diagram-still').props.xml).toBe(diagramSvgAt(DIAGRAMS['colimador-abrindo'], 0.25));
  });

  it('expõe a figura com papel de imagem e o alt do diagrama', () => {
    const view = render(<DiagramView id="tubo-raios-x" />);
    expect(view.getByRole('image', { name: DIAGRAMS['tubo-raios-x'].alt })).toBeTruthy();
  });

  it('decorativo sai da árvore de acessibilidade', () => {
    const view = render(<DiagramView id="tubo-raios-x" decorative />);
    expect(view.queryByRole('image')).toBeNull();
    expect(view.getByTestId('diagram-frame', HIDDEN).props.accessibilityElementsHidden).toBe(true);
  });

  it('id desconhecido não lança e vira quadro vazio com rótulo', () => {
    const view = render(<DiagramView id="nao-existe" />);
    expect(view.getByLabelText('Figura indisponível')).toBeTruthy();
    expect(view.queryByTestId('diagram-still')).toBeNull();
  });
});
