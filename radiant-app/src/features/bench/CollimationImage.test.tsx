import React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';

import { CollimationImage, CollimationReadout } from './CollimationImage';
import { collimationModel, FULL_FIELD } from './collimationModel';
import { REFERENCE_EXPOSURE, exposureModel } from './exposureModel';

// A imagem da bancada de colimação: o mesmo fantoma da exposição, com a máscara
// do campo. O Jest não rasteriza Skia: o dublê expõe os uniformes, e as
// asserções recaem sobre os números que o modelo entrega ao shader e sobre o
// texto que diz, em palavras, o que a imagem mostra.

describe('CollimationImage', () => {
    it('pinta o fantoma com a exposição de referência: colimar não muda kV nem mAs', () => {
        const { getByTestId } = render(
            <CollimationImage field={{ fieldWidth: 18, fieldHeight: 24 }} size={200} label="x" />,
        );
        const { uniforms } = getByTestId('skia-Shader').props;
        const out = exposureModel(REFERENCE_EXPOSURE);

        expect(uniforms).toMatchObject({ bone: out.bone, soft: out.soft, background: out.background, noise: out.noise });
    });

    it('entrega ao shader a fração do campo que o modelo calcula', () => {
        const { getByTestId } = render(
            <CollimationImage field={{ fieldWidth: 18, fieldHeight: 24 }} size={200} label="x" />,
        );
        const { fieldFraction } = collimationModel({ fieldWidth: 18, fieldHeight: 24 });

        expect(getByTestId('skia-Shader').props.uniforms.field).toEqual([fieldFraction.width, fieldFraction.height]);
    });

    it('fechar o campo encolhe a máscara, e ela continua dentro da imagem', () => {
        const open = render(<CollimationImage field={FULL_FIELD} size={200} label="x" />);
        const [openWidth, openHeight] = open.getByTestId('skia-Shader').props.uniforms.field as number[];
        open.unmount();

        const closed = render(<CollimationImage field={{ fieldWidth: 10, fieldHeight: 12 }} size={200} label="x" />);
        const [closedWidth, closedHeight] = closed.getByTestId('skia-Shader').props.uniforms.field as number[];

        expect([openWidth, openHeight]).toEqual([1, 1]);
        expect(closedWidth).toBeLessThan(openWidth);
        expect(closedHeight).toBeLessThan(openHeight);
        expect(closedWidth).toBeGreaterThan(0);
        expect(closedHeight).toBeGreaterThan(0);
    });

    it('é uma imagem para o leitor de tela, com o rótulo recebido', () => {
        const { getByLabelText } = render(
            <CollimationImage field={FULL_FIELD} size={200} label="Fantoma simulado: campo de 27 × 33 cm" />,
        );

        expect(getByLabelText('Fantoma simulado: campo de 27 × 33 cm').props.accessibilityRole).toBe('image');
    });
});

describe('CollimationReadout', () => {
    it('estica o readout e as linhas à largura disponível mesmo num pai centralizado', () => {
        const { UNSAFE_getByType } = render(<CollimationReadout field={FULL_FIELD} />);
        const readout = StyleSheet.flatten(UNSAFE_getByType(View).props.style);

        expect(readout).toMatchObject({ alignSelf: 'stretch', alignItems: 'stretch' });
        expect(readout.width).toBeUndefined();
        expect(readout.height).toBeUndefined();
        expect(readout.maxHeight).toBeUndefined();
        expect(readout.overflow).not.toBe('hidden');
    });

    it.each(['Campo de 27 × 33 cm, 891 cm²', 'Produto dose-área: 100% do campo todo'])(
        'centraliza %s dentro da linha sem limitar seu refluxo ou tamanho de fonte', (label) => {
            const { getByText } = render(<CollimationReadout field={FULL_FIELD} />);
            const line = getByText(label);
            // Contrato do Text real. A legibilidade dos glifos exige prova nativa.
            const style = StyleSheet.flatten(line.props.style);

            expect(style.textAlign).toBe('center');
            expect(style.fontFamily).toBe('Sora-Bold');
            expect(style.fontSize).toBe(16);
            expect(style.lineHeight).toBeUndefined();
            expect(style.height).toBeUndefined();
            expect(style.maxHeight).toBeUndefined();
            expect(style.overflow).not.toBe('hidden');
            expect(line.props.allowFontScaling).not.toBe(false);
            expect(line.props.maxFontSizeMultiplier).toBeUndefined();
            expect(line.props.numberOfLines).toBeUndefined();
            expect(line.props.adjustsFontSizeToFit).not.toBe(true);
        },
    );

    it('diz em texto o campo, a área e o produto dose-área', () => {
        const { getByText } = render(<CollimationReadout field={{ fieldWidth: 18, fieldHeight: 24 }} />);

        // 18 × 24 = 432 cm², e 432 / 891 ≈ 48% do produto dose-área do campo todo.
        expect(getByText('Campo de 18 × 24 cm, 432 cm²')).toBeTruthy();
        expect(getByText('Produto dose-área: 48% do campo todo')).toBeTruthy();
    });

    it('não chama de dose o que é produto dose-área: a dose do feixe direto num ponto não cai ao colimar', () => {
        const { queryByText, toJSON } = render(<CollimationReadout field={{ fieldWidth: 10, fieldHeight: 12 }} />);
        const shown = JSON.stringify(toJSON());

        // Ausência casada pela forma mais larga: nenhuma "dose" solta, só dentro de "dose-área".
        expect(shown.replace(/dose-área/gi, '')).not.toMatch(/dose/i);
        // Validade: o texto da grandeza está na tela.
        expect(queryByText(/^Produto dose-área: \d+% do campo todo$/)).toBeTruthy();
    });

    it('o campo todo é 100%', () => {
        const { getByText } = render(<CollimationReadout field={FULL_FIELD} />);

        expect(getByText('Campo de 27 × 33 cm, 891 cm²')).toBeTruthy();
        expect(getByText('Produto dose-área: 100% do campo todo')).toBeTruthy();
    });

    it('mostra o meio centímetro com vírgula, e não arredonda a medida', () => {
        const { getByText } = render(<CollimationReadout field={{ fieldWidth: 12.5, fieldHeight: 20 }} />);

        expect(getByText('Campo de 12,5 × 20 cm, 250 cm²')).toBeTruthy();
    });

    it('o produto dose-área fala sozinho ao mudar, para quem não vê a imagem', () => {
        const { getByText } = render(<CollimationReadout field={FULL_FIELD} />);

        expect(getByText(/^Produto dose-área/).props.accessibilityLiveRegion).toBe('polite');
    });
});
