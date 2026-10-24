import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Skia } from '@shopify/react-native-skia';

import { ExposureImage } from './ExposureImage';
import { exposureModel } from './exposureModel';
import { EXPOSURE_SKSL, grayTone } from './exposureShader';

// O fantoma radiográfico da bancada. O Jest não rasteriza Skia: o módulo é
// trocado por um dublê em que `Skia.RuntimeEffect.Make` é controlável, e as
// asserções recaem sobre o que decide o que o aluno vê: os números que o
// modelo entrega ao shader e, se o shader não compila, os tons do fantoma de
// `View`s. Que o SkSL compila no Skia nativo o Jest não prova (ver o relatório).
//
// O aviso de shader quebrado sai uma vez por motivo na sessão, e não um por
// imagem. Esse registro é do módulo e atravessa os testes deste arquivo, então
// cada teste de aviso usa um motivo (retorno nulo ou exceção) que nenhum outro
// teste quebra.

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
        Skia: { RuntimeEffect: { Make: jest.fn() } },
    };
});

const make = Skia.RuntimeEffect.Make as jest.Mock;
const EFFECT = { kind: 'effect' };
const INPUT = { kv: 70, mas: 10 };

describe('ExposureImage', () => {
    let warn: jest.SpyInstance;

    beforeEach(() => {
        make.mockReset();
        make.mockReturnValue(EFFECT);
        warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
        warn.mockRestore();
    });

    describe('com o shader compilado', () => {
        it('compila o SkSL da bancada e o aplica no Canvas, sem fallback', () => {
            const { getByTestId, queryByTestId } = render(
                <ExposureImage input={INPUT} size={200} label="Fantoma simulado" />,
            );

            expect(make).toHaveBeenCalledWith(EXPOSURE_SKSL);
            expect(getByTestId('skia-Canvas')).toBeTruthy();
            expect(getByTestId('skia-Shader').props.source).toBe(EFFECT);
            expect(queryByTestId('exposure-image-fallback')).toBeNull();
            expect(warn).not.toHaveBeenCalled();
        });

        it('entrega ao shader os números do modelo, e só eles', () => {
            const { getByTestId } = render(<ExposureImage input={INPUT} size={200} label="x" />);
            const { uniforms } = getByTestId('skia-Shader').props;
            const out = exposureModel(INPUT);

            expect(uniforms.bone).toBe(out.bone);
            expect(uniforms.soft).toBe(out.soft);
            expect(uniforms.background).toBe(out.background);
            expect(uniforms.noise).toBe(out.noise);
            // Os três tons e o ruído são válidos (de 0 a 1) e o osso é mais claro que as partes moles.
            for (const key of ['bone', 'soft', 'background', 'noise'] as const) {
                expect(uniforms[key]).toBeGreaterThanOrEqual(0);
                expect(uniforms[key]).toBeLessThanOrEqual(1);
            }
            expect(uniforms.bone).toBeGreaterThan(uniforms.soft);
            expect(uniforms.soft).toBeGreaterThan(uniforms.background);
        });

        it('muda o uniforme com a exposição: mais kV, menos contraste; mais mAs, menos ruído', () => {
            const base = render(<ExposureImage input={{ kv: 60, mas: 4 }} size={200} label="x" />);
            const baseUniforms = base.getByTestId('skia-Shader').props.uniforms;
            base.unmount();

            const highKv = render(<ExposureImage input={{ kv: 110, mas: 4 }} size={200} label="x" />);
            const highKvUniforms = highKv.getByTestId('skia-Shader').props.uniforms;
            highKv.unmount();
            expect(highKvUniforms.bone - highKvUniforms.soft).toBeLessThan(baseUniforms.bone - baseUniforms.soft);
            expect(highKvUniforms.noise).toBe(baseUniforms.noise);

            const highMas = render(<ExposureImage input={{ kv: 60, mas: 30 }} size={200} label="x" />);
            const highMasUniforms = highMas.getByTestId('skia-Shader').props.uniforms;
            expect(highMasUniforms.noise).toBeLessThan(baseUniforms.noise);
            expect(highMasUniforms.bone - highMasUniforms.soft).toBe(baseUniforms.bone - baseUniforms.soft);
        });

        it('passa o tamanho do fantoma, na proporção da prancheta (270 por 330)', () => {
            const { getByTestId } = render(<ExposureImage input={INPUT} size={270} label="x" />);
            const { uniforms } = getByTestId('skia-Shader').props;

            expect(uniforms.size).toEqual([270, 330]);
            expect(Number.isFinite(uniforms.seed)).toBe(true);
        });

        it('é uma imagem para o leitor de tela, com o rótulo recebido', () => {
            const { getByLabelText } = render(
                <ExposureImage input={INPUT} size={200} label="Fantoma simulado, 70 kV e 10 mAs" />,
            );
            const image = getByLabelText('Fantoma simulado, 70 kV e 10 mAs');

            expect(image.props.accessibilityRole).toBe('image');
        });
    });

    describe('SkSL', () => {
        it('declara os seis uniformes que a imagem alimenta', () => {
            for (const name of ['bone', 'soft', 'background', 'noise', 'seed']) {
                expect(EXPOSURE_SKSL).toMatch(new RegExp(`uniform float ${name};`));
            }
            expect(EXPOSURE_SKSL).toMatch(/uniform float2 size;/);
            expect(EXPOSURE_SKSL).toMatch(/half4 main\(float2 \w+\)/);
        });
    });

    describe('sem o shader (fallback de Views)', () => {
        it('com Make devolvendo null, desenha o fantoma de Views e avisa uma vez só', () => {
            make.mockReturnValue(null);

            const first = render(<ExposureImage input={INPUT} size={200} label="Fantoma simulado" />);
            expect(first.getByTestId('exposure-image-fallback')).toBeTruthy();
            expect(first.queryByTestId('skia-Canvas')).toBeNull();
            first.unmount();

            // Uma segunda imagem na mesma sessão (a referência ao lado) não repete o aviso.
            render(<ExposureImage input={{ kv: 90, mas: 20 }} size={200} label="Referência" />);

            expect(warn).toHaveBeenCalledTimes(1);
            expect(String(warn.mock.calls[0][0])).toContain('ExposureImage');
        });

        it('com Make lançando, desenha o fantoma de Views e avisa uma vez só, sem derrubar a tela', () => {
            make.mockImplementation(() => {
                throw new Error('shader quebrado');
            });

            expect(() => render(<ExposureImage input={INPUT} size={200} label="x" />)).not.toThrow();
            const second = render(<ExposureImage input={INPUT} size={200} label="x" />);

            expect(second.getByTestId('exposure-image-fallback')).toBeTruthy();
            expect(warn).toHaveBeenCalledTimes(1);
            expect(String(warn.mock.calls[0][0])).toContain('shader quebrado');
        });

        it('pinta o fundo, as partes moles e o osso com os três tons do modelo', () => {
            make.mockReturnValue(null);
            const { getByTestId } = render(<ExposureImage input={{ kv: 100, mas: 10 }} size={200} label="x" />);
            const out = exposureModel({ kv: 100, mas: 10 });
            const color = (id: string) => {
                return StyleSheet.flatten(getByTestId(id).props.style).backgroundColor;
            };

            expect(color('exposure-fallback-background')).toBe(grayTone(out.background));
            expect(color('exposure-fallback-soft')).toBe(grayTone(out.soft));
            expect(color('exposure-fallback-bone')).toBe(grayTone(out.bone));
            // Os três tons são distintos, na ordem da radiografia: osso > partes moles > fundo.
            expect(new Set([
                color('exposure-fallback-background'),
                color('exposure-fallback-soft'),
                color('exposure-fallback-bone'),
            ]).size).toBe(3);
        });

        it('segue sendo uma imagem para o leitor de tela, com o rótulo recebido', () => {
            make.mockReturnValue(null);
            const { getByLabelText } = render(
                <ExposureImage input={INPUT} size={200} label="Fantoma simulado, 70 kV e 10 mAs" />,
            );

            expect(getByLabelText('Fantoma simulado, 70 kV e 10 mAs').props.accessibilityRole).toBe('image');
        });
    });
});

describe('grayTone', () => {
    it('converte a luminância de 0 a 1 em cinza e limita fora da faixa', () => {
        expect(grayTone(0)).toBe('rgb(0, 0, 0)');
        expect(grayTone(1)).toBe('rgb(255, 255, 255)');
        expect(grayTone(0.5)).toBe('rgb(128, 128, 128)');
        expect(grayTone(-3)).toBe('rgb(0, 0, 0)');
        expect(grayTone(7)).toBe('rgb(255, 255, 255)');
    });
});
