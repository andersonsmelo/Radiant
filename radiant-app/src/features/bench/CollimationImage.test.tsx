import React from 'react';
import { render } from '@testing-library/react-native';

import { CollimationImage, CollimationReadout } from './CollimationImage';
import { collimationModel, FULL_FIELD } from './collimationModel';
import { REFERENCE_EXPOSURE, exposureModel } from './exposureModel';

// A imagem da bancada de colimação: o mesmo fantoma da exposição, com a máscara
// do campo. O Jest não rasteriza Skia: o dublê expõe os uniformes, e as
// asserções recaem sobre os números que o modelo entrega ao shader e sobre o
// texto que diz, em palavras, o que a imagem mostra.

jest.mock('@shopify/react-native-skia', () => {
    const ReactInMock = require('react');
    const { View } = require('react-native');
    const host = (name: string) => {
        const Host = ({ children, ...props }: { children?: unknown }) =>
            ReactInMock.createElement(View, { ...props, testID: `skia-${name}` }, children);
        Host.displayName = name;
        return Host;
    };
    return {
        Canvas: host('Canvas'),
        Fill: host('Fill'),
        Shader: host('Shader'),
        Skia: { RuntimeEffect: { Make: jest.fn(() => ({ kind: 'effect' })) } },
    };
});

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
