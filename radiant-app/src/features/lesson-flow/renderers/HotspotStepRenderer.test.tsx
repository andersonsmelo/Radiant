import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { Path } from 'react-native-svg';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { HotspotStepRenderer } from './HotspotStepRenderer';
import { touchSlop } from './hotspotTouch';

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

        const badge = StyleSheet.flatten(getByTestId('hotspot-selected-mark', { includeHiddenElements: true }).props.style);
        expect(badge.backgroundColor).toBe(galaxyColors.background);
        // O traço da marca, só dentro da marca: a cor do texto aparece em outros nós da tela.
        const strokes = getByTestId('hotspot-selected-mark', { includeHiddenElements: true }).findAllByType(Path).map((path: { props: { stroke?: string } }) => path.props.stroke);
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
        // O selo é irmão da região: o estilo já vem em pontos do quadro.
        const absolute = (style: { left: number; top: number; width: number; height: number }) => ({ left: style.left, top: style.top, width: style.width, height: style.height });
        const overlap = (a: { left: number; top: number; width: number; height: number }, b: { left: number; top: number; width: number; height: number }) =>
            a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
        for (const selectedRegionId of [undefined, 'detector']) {
            const { getByTestId, unmount } = render(
                <HotspotStepRenderer payload={payload} accessibilityLabel="Geometria" selectedRegionId={selectedRegionId} onSelect={jest.fn()} />,
            );
            fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
            payload.regions.forEach((region, index) => {
                const node = selectedRegionId === region.id ? getByTestId('hotspot-selected-mark', { includeHiddenElements: true }) : getByTestId(`hotspot-index-${index + 1}`, { includeHiddenElements: true });
                const box = absolute(StyleSheet.flatten(node.props.style));
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

    // E11, integrador: os selos de um item não se escondem entre si (m19-06, figura compacta).
    it('os selos do número de um item compacto não se sobrepõem', () => {
        const compact = {
            prompt: 'Onde fica o ânodo?', imageRef: 'diagram:tubo-raios-x', correctRegionIds: ['anodo'],
            regions: [
                { id: 'catodo', label: 'Cátodo', x: 0.2188, y: 0.3083, width: 0.1437, height: 0.2417 },
                { id: 'anodo', label: 'Ânodo', x: 0.5094, y: 0.0854, width: 0.4578, height: 0.2646 },
                { id: 'janela', label: 'Janela', x: 0.475, y: 0.4, width: 0.1453, height: 0.1167 },
                { id: 'ampola', label: 'Ampola', x: 0.2578, y: 0.0625, width: 0.1875, height: 0.1979 },
            ],
        };
        const { getByTestId } = render(<HotspotStepRenderer payload={compact} accessibilityLabel="Toque" onSelect={jest.fn()} />);
        fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
        const boxes = compact.regions.map((region, index) => {
            const style = StyleSheet.flatten(getByTestId(`hotspot-index-${index + 1}`, { includeHiddenElements: true }).props.style);
            return { left: style.left, top: style.top, width: style.width, height: style.height };
        });
        boxes.forEach((a, i) => boxes.slice(i + 1).forEach(b => {
            expect(a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height).toBe(false);
        }));
    });

    // Revoga a E13 (2026-11-20): o selo não recebe toque. Com o selo tocável, na M18.01 `i3` quem erra o lado e toca o
    // quadril direito acerta o selo do esquerdo. O Jest não faz o teste de acerto do toque: `hit` o refaz sobre a árvore
    // renderizada (a última irmã que contém o ponto vence; selo com `pointerEvents="none"` ou sem tratador não conta).
    it('M18.01 i3: o toque num ponto do selo do alvo certo, fora da área de toque dele, não seleciona o alvo certo', () => {
        const m18 = {
            prompt: 'Toque no osso que prende o membro inferior ao esqueleto axial, do lado esquerdo do paciente.',
            imageRef: 'asset://esqueleto.png',
            regions: [
                { id: 'r1', label: 'Crânio', x: 0.424, y: 0.046, width: 0.083, height: 0.122 },
                { id: 'r2', label: 'Caixa torácica', x: 0.393, y: 0.285, width: 0.147, height: 0.145 },
                { id: 'r3', label: 'Osso do quadril', x: 0.5, y: 0.52, width: 0.08, height: 0.1 },
                { id: 'r4', label: 'Fêmur esquerdo', x: 0.48, y: 0.74, width: 0.08, height: 0.12 },
            ],
            correctRegionIds: ['r3'],
        };
        const W = 280;
        const H = 210;
        const onSelect = jest.fn();
        const { getByTestId, getByLabelText } = render(<HotspotStepRenderer payload={m18} accessibilityLabel="Esqueleto" onSelect={onSelect} />);
        fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: W, height: H } } });
        const area = (r: typeof m18.regions[number]) => {
            const slop = touchSlop(r, { width: W, height: H });
            return { l: r.x * W - slop.left, t: r.y * H - slop.top, r: (r.x + r.width) * W + slop.right, b: (r.y + r.height) * H + slop.bottom };
        };
        const inside = (a: { l: number; t: number; r: number; b: number }, x: number, y: number) => x >= a.l && x <= a.r && y >= a.t && y <= a.b;
        const badgeOf = (index: number) => {
            const el = getByTestId(`hotspot-index-${index}`, { includeHiddenElements: true });
            const st = StyleSheet.flatten(el.props.style);
            return { el, l: st.left as number, t: st.top as number, r: (st.left as number) + (st.width as number), b: (st.top as number) + (st.height as number) };
        };
        const hit = (x: number, y: number) => {
            let found: string | undefined;
            m18.regions.forEach((r, i) => {
                if (inside(area(r), x, y)) found = r.id;
                const b = badgeOf(i + 1);
                const touchable = b.el.props.pointerEvents !== 'none' && (b.el.props.onClick || b.el.props.onResponderRelease);
                if (touchable && inside(b, x, y)) found = r.id;
            });
            return found;
        };
        getByLabelText('Selecionar Osso do quadril na imagem');
        const seal = badgeOf(3);
        const own = area(m18.regions[2]);
        // Validade: o selo está dentro do quadro e há pontos dele fora da área de toque do alvo certo.
        expect(seal.l).toBeGreaterThanOrEqual(0);
        expect(seal.r).toBeLessThanOrEqual(W);
        const points = [[seal.l + 1, seal.t + 1], [seal.r - 1, seal.t + 1], [seal.l + 1, seal.b - 1], [seal.r - 1, seal.b - 1], [(seal.l + seal.r) / 2, (seal.t + seal.b) / 2]]
            .filter(([x, y]) => !inside(own, x, y));
        expect(points.length).toBeGreaterThan(0);
        points.forEach(([x, y]) => expect(hit(x, y)).not.toBe('r3'));
    });

    it('o selo do número e a marca de selecionado não recebem toque e não aparecem como alvo', () => {
        const { getByTestId, queryAllByLabelText } = render(<HotspotStepRenderer payload={payload} accessibilityLabel="Geometria" onSelect={jest.fn()} selectedRegionId="source" />);
        fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
        [getByTestId('hotspot-selected-mark', { includeHiddenElements: true }), getByTestId('hotspot-index-2', { includeHiddenElements: true })].forEach(badge => {
            expect(badge.props.pointerEvents).toBe('none');
            expect(badge.props.onClick).toBeUndefined();
            expect(badge.props.accessible).toBeFalsy();
        });
        // Os alvos continuam os mesmos: um por região na imagem, mais um por região na lista.
        expect(queryAllByLabelText(/^Selecionar .* na imagem$/)).toHaveLength(2);
        expect(queryAllByLabelText(/^Selecionar .* na lista$/)).toHaveLength(2);
    });

    it('depois de conferir, o toque no selo não seleciona nada', () => {
        const onSelect = jest.fn();
        const { getByTestId } = render(<HotspotStepRenderer payload={payload} accessibilityLabel="Geometria" onSelect={onSelect} submitted />);
        fireEvent(getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });
        fireEvent.press(getByTestId('hotspot-index-1', { includeHiddenElements: true }));
        expect(onSelect).not.toHaveBeenCalled();
    });
});
