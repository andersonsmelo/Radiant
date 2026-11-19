import React from 'react';
import { Image, Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { InteractionFigure } from './InteractionFigure';
import { diagramRef, DIAGRAMS } from '../../../ui/diagrams/diagramRegistry';
import { diagramSvgAt } from '../../../ui/diagrams/diagramMotion';

let mockReducedMotion = true;
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: mockReducedMotion, resolved: true }),
}));
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: () => true }));

const DIAGRAM = DIAGRAMS['tubo-raios-x'];

describe('InteractionFigure', () => {
    it('imagem licenciada: moldura na proporção do arquivo e rótulo acessível da alt', () => {
        const { getByTestId, getByLabelText } = render(
            <InteractionFigure imageRef="image:a" alt="Radiografia do tórax." resolveImage={() => ({ source: 1, width: 800, height: 1000 })} />,
        );
        expect(getByLabelText('Radiografia do tórax.')).toBeTruthy();
        expect(getByTestId('interaction-figure').props.style).toEqual(expect.arrayContaining([expect.objectContaining({ aspectRatio: 0.8 })]));
    });

    it('imagem sem alt passada usa a alt do cadastro; sem nenhuma, sai da árvore de acessibilidade', () => {
        const withRegistry = render(<InteractionFigure imageRef="image:a" resolveImage={() => ({ source: 1, width: 800, height: 1000, alt: 'Alt do cadastro.' })} />);
        expect(withRegistry.getByLabelText('Alt do cadastro.')).toBeTruthy();
        const without = render(<InteractionFigure imageRef="image:a" resolveImage={() => ({ source: 1, width: 800, height: 1000 })} />);
        expect(without.queryByLabelText(/./)).toBeNull();
        expect(without.UNSAFE_getByType(Image).props.accessible).toBe(false);
    });

    it('diagrama: desenha pelo registro, na proporção dele, com a alt do diagrama quando não vem alt', () => {
        const { getByTestId, getByLabelText } = render(<InteractionFigure imageRef={diagramRef('tubo-raios-x')} />);
        expect(getByLabelText(DIAGRAM.alt)).toBeTruthy();
        expect(getByTestId('diagram-frame')).toBeTruthy();
        expect(getByTestId('interaction-figure').props.style).toEqual(expect.arrayContaining([expect.objectContaining({ aspectRatio: DIAGRAM.width / DIAGRAM.height })]));
    });

    it('diagrama em laço fica parado no quadro de pôster mesmo com movimento ligado: os alvos de toque não acompanham movimento', () => {
        mockReducedMotion = false;
        try {
            const loop = Object.values(DIAGRAMS).find(spec => spec.periodMs && spec.layers.some(layer => layer.motion?.kind === 'translate'))!;
            const view = render(<InteractionFigure imageRef={diagramRef(loop.id)} />);
            expect(view.queryAllByTestId('diagram-layer')).toHaveLength(0);
            expect(view.getByTestId('diagram-still').props.xml).toBe(diagramSvgAt(loop, loop.posterAt ?? 0));
        } finally {
            mockReducedMotion = true;
        }
    });

    it('diagrama com alt passada: a alt passada vale', () => {
        const { getByLabelText, queryByLabelText } = render(<InteractionFigure imageRef={diagramRef('tubo-raios-x')} alt="Descrição do exercício." />);
        expect(getByLabelText('Descrição do exercício.')).toBeTruthy();
        expect(queryByLabelText(DIAGRAM.alt)).toBeNull();
    });

    it('sem figura: avisa "Imagem indisponível" e não chama children', () => {
        const children = jest.fn(() => <Text>sobre</Text>);
        const resolver = () => null;
        const refused = render(<InteractionFigure imageRef="image:nao-existe" resolveImage={resolver}>{children}</InteractionFigure>);
        expect(refused.getByText('Imagem indisponível')).toBeTruthy();
        const unknown = render(<InteractionFigure imageRef="diagram:nao-existe">{children}</InteractionFigure>);
        expect(unknown.getByText('Imagem indisponível')).toBeTruthy();
        expect(children).not.toHaveBeenCalled();
    });

    it('children recebe o tamanho medido em pontos e fica por cima da figura', () => {
        const children = jest.fn(({ width, height }: { width: number; height: number }) => <Text>{`${width}x${height}`}</Text>);
        const { getByTestId, getByText } = render(<InteractionFigure imageRef={diagramRef('tubo-raios-x')}>{children}</InteractionFigure>);
        fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
        expect(getByText('280x210')).toBeTruthy();
    });
});
