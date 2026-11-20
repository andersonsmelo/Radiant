import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { Path } from 'react-native-svg';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { HotspotStepRenderer } from './HotspotStepRenderer';

const payload = {
    prompt: 'Onde está o detector?',
    imageRef: 'asset://xray-beam.png',
    regions: [
        { id: 'source', label: 'Fonte de raios X', x: 0.34, y: 0.04, width: 0.32, height: 0.28 },
        { id: 'detector', label: 'Detector plano', x: 0.13, y: 0.72, width: 0.74, height: 0.22 },
    ],
    correctRegionIds: ['detector'],
};

describe('HotspotStepRenderer', () => {
    it('oferece toque na imagem e seleção textual equivalente', () => {
        const onSelect = jest.fn();
        const { getByLabelText } = render(
            <HotspotStepRenderer
                payload={payload}
                accessibilityLabel="Geometria simplificada do feixe de raios X"
                selectedRegionId={undefined}
                onSelect={onSelect}
            />,
        );

        fireEvent.press(getByLabelText('Selecionar Detector plano na imagem'));
        fireEvent.press(getByLabelText('Selecionar Detector plano na lista'));

        expect(onSelect).toHaveBeenNthCalledWith(1, 'detector');
        expect(onSelect).toHaveBeenNthCalledWith(2, 'detector');
    });

    it('expõe seleção por estado e mantém cada alvo com ao menos 44 pt, centrado na região', () => {
        const { getByLabelText } = render(
            <HotspotStepRenderer
                payload={payload}
                accessibilityLabel="Geometria simplificada do feixe de raios X"
                selectedRegionId="detector"
                onSelect={jest.fn()}
            />,
        );

        const target = getByLabelText('Selecionar Detector plano na imagem');
        const textAlternative = getByLabelText('Selecionar Detector plano na lista');
        expect(target.props.accessibilityState.selected).toBe(true);
        // Figura de 280 x 210 pt: a região do detector tem 207 x 46 pt e já passa de 44; a da fonte, 90 x 59 pt.
        fireEvent(screen.getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
        const source = screen.getByLabelText('Selecionar Fonte de raios X na imagem');
        expect(source.props.hitSlop).toEqual({ left: 0, right: 0, top: 0, bottom: 0 });
        expect(StyleSheet.flatten(target.props.style).minWidth).toBeUndefined();
        expect(StyleSheet.flatten(textAlternative.props.style).minHeight).toBeGreaterThanOrEqual(44);
    });

    // Tarefa 11: a região escolhida muda só a borda (mais grossa e verde) e
    // mantém o véu translúcido: um fundo opaco apagaria a anatomia escolhida.
    it('a região escolhida tem borda verde de 3 pt e o mesmo véu translúcido da região livre', () => {
        const { getByLabelText } = render(
            <HotspotStepRenderer
                payload={payload}
                accessibilityLabel="Geometria simplificada do feixe de raios X"
                selectedRegionId="detector"
                onSelect={jest.fn()}
            />,
        );
        const escolhida = StyleSheet.flatten(getByLabelText('Selecionar Detector plano na imagem').props.style);
        const livre = StyleSheet.flatten(getByLabelText('Selecionar Fonte de raios X na imagem').props.style);
        expect(livre.borderWidth).toBe(2);
        expect(livre.borderColor).toBe(semanticColors.galaxy.statusInformation);
        expect(escolhida.borderWidth).toBe(3);
        expect(escolhida.borderColor).toBe(semanticColors.galaxy.statusSuccess);
        // Validade: o fundo continua o véu, nas duas.
        expect(escolhida.backgroundColor).toBe(galaxyColors.imageScrim);
        expect(livre.backgroundColor).toBe(galaxyColors.imageScrim);
    });

    it('mantém o índice legível sobre imagem clara e fora do centro da região', () => {
        const { getByTestId, queryByText } = render(
            <HotspotStepRenderer
                payload={payload}
                accessibilityLabel="Geometria simplificada do feixe de raios X"
                selectedRegionId="source"
                onSelect={jest.fn()}
            />,
        );

        const badge = StyleSheet.flatten(getByTestId('hotspot-selected-mark').props.style);
        expect(badge.backgroundColor).toBe(galaxyColors.background);
        // O traço da marca, só dentro da marca: a cor do texto aparece em outros nós da tela.
        const strokes = getByTestId('hotspot-selected-mark').findAllByType(Path).map((path: { props: { stroke?: string } }) => path.props.stroke);
        expect(strokes.length).toBeGreaterThan(0);
        expect(strokes.every((stroke: string | undefined) => stroke === semanticColors.galaxy.textPrimary)).toBe(true);
        expect(queryByText('✓')).toBeNull();
        // O selo é absoluto, ancorado no canto: a região baixa não o corta (ver badgeBox).
        expect(badge.position).toBe('absolute');
    });

    it('uma região menor que 44 pt ganha folga igual nos dois lados, e o rótulo da interação vale para o diagrama', () => {
        const small = { ...payload, imageRef: 'diagram:tubo-raios-x', regions: [{ id: 'a', label: 'Parte pequena', x: 0.5, y: 0.5, width: 0.1, height: 0.1 }, payload.regions[1]], correctRegionIds: ['a'] };
        const { getByLabelText, getByTestId } = render(
            <HotspotStepRenderer payload={small} accessibilityLabel="Toque na imagem: Onde fica a parte?" onSelect={jest.fn()} />,
        );
        fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
        // 0,1 x 280 = 28 pt de largura e 21 pt de altura: faltam 16 e 23 pt, metade para cada lado.
        expect(getByLabelText('Selecionar Parte pequena na imagem').props.hitSlop).toEqual({ left: 8, right: 8, top: 11.5, bottom: 11.5 });
        expect(getByLabelText('Toque na imagem: Onde fica a parte?')).toBeTruthy();
    });

    // E11: o selo não pode esconder o objeto que a região mostra.
    it('o selo do número e a marca de selecionado ficam fora da região, inteiros no quadro', () => {
        const absolute = (style: { left: number; top: number; width: number; height: number }, region: { x: number; y: number }) =>
            ({ left: 280 * region.x + 2 + style.left, top: 210 * region.y + 2 + style.top, width: style.width, height: style.height });
        const overlap = (a: { left: number; top: number; width: number; height: number }, b: { left: number; top: number; width: number; height: number }) =>
            a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
        for (const selectedRegionId of [undefined, 'detector']) {
            const { getByTestId, unmount } = render(
                <HotspotStepRenderer payload={payload} accessibilityLabel="Geometria" selectedRegionId={selectedRegionId} onSelect={jest.fn()} />,
            );
            fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
            payload.regions.forEach((region, index) => {
                const node = selectedRegionId === region.id ? getByTestId('hotspot-selected-mark') : getByTestId(`hotspot-index-${index + 1}`);
                const box = absolute(StyleSheet.flatten(node.props.style), region);
                const area = { left: 280 * region.x, top: 210 * region.y, width: 280 * region.width, height: 210 * region.height };
                expect(overlap(box, area)).toBe(false);
                expect(box.left).toBeGreaterThanOrEqual(0);
                expect(box.top).toBeGreaterThanOrEqual(0);
                expect(box.left + box.width).toBeLessThanOrEqual(280);
                expect(box.top + box.height).toBeLessThanOrEqual(210);
            });
            unmount();
        }
    });
});
