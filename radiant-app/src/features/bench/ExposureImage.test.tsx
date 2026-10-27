import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Skia } from '@shopify/react-native-skia';

import { ExposureImage } from './ExposureImage';
import { exposureModel } from './exposureModel';
import { UNEXPOSED_LUMINANCE } from './collimationModel';
import { EXPOSURE_SKSL, grayTone } from './exposureShader';

/** Os nomes dos uniformes que o SkSL declara, para comparar com os que a imagem passa. */
function declaredUniforms(sksl: string): string[] {
    return [...sksl.matchAll(/^\s*uniform\s+\w+\s+(\w+)\s*;/gm)].map((match) => match[1]).sort();
}

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

        it('passa exatamente os uniformes que o SkSL declara, nem um a mais nem um a menos', () => {
            // Uniforme declarado e não passado faz o Skia lançar ao desenhar, fora
            // do try que leva ao fallback: a tela quebraria em vez de cair nas Views.
            const declared = declaredUniforms(EXPOSURE_SKSL);
            const plain = render(<ExposureImage input={INPUT} size={200} label="x" />);
            expect(Object.keys(plain.getByTestId('skia-Shader').props.uniforms).sort()).toEqual(declared);
            plain.unmount();

            const masked = render(<ExposureImage input={INPUT} size={200} label="x" field={{ width: 0.5, height: 0.4 }} />);
            expect(Object.keys(masked.getByTestId('skia-Shader').props.uniforms).sort()).toEqual(declared);
            // Validade: a lista lida do SkSL não está vazia e tem o campo.
            expect(declared).toEqual(['background', 'bone', 'field', 'noise', 'seed', 'size', 'soft']);
        });

        it('sem campo, a máscara cobre a imagem toda: field é [1, 1]', () => {
            const { getByTestId } = render(<ExposureImage input={INPUT} size={200} label="x" />);

            expect(getByTestId('skia-Shader').props.uniforms.field).toEqual([1, 1]);
        });

        it('com campo, passa ao shader a fração da imagem que o feixe cobre', () => {
            const { getByTestId } = render(
                <ExposureImage input={INPUT} size={200} label="x" field={{ width: 0.5, height: 0.25 }} />,
            );

            expect(getByTestId('skia-Shader').props.uniforms.field).toEqual([0.5, 0.25]);
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
        it('declara os sete uniformes que a imagem alimenta', () => {
            for (const name of ['bone', 'soft', 'background', 'noise', 'seed']) {
                expect(EXPOSURE_SKSL).toMatch(new RegExp(`uniform float ${name};`));
            }
            expect(EXPOSURE_SKSL).toMatch(/uniform float2 size;/);
            expect(EXPOSURE_SKSL).toMatch(/uniform float2 field;/);
            expect(EXPOSURE_SKSL).toMatch(/half4 main\(float2 \w+\)/);
        });

        it('fora do campo pinta o tom sem feixe do modelo de colimação, como float', () => {
            // Um inteiro ("1") numa `const float` não compila em SkSL.
            expect(EXPOSURE_SKSL).toContain(`const float UNEXPOSED = ${UNEXPOSED_LUMINANCE.toFixed(3)};`);
            expect(EXPOSURE_SKSL).toMatch(/outside\s*\?\s*UNEXPOSED\s*:/);
        });

        it('não usa pow(): com base negativa ele é indefinido e pode dar NaN na GPU', () => {
            // O Jest não executa SkSL, então a guarda é sobre o texto. `pow(x, y)`
            // em GLSL/SkSL é indefinido para x < 0, e `(y - 170) / 40` é negativo
            // na metade de cima do fantoma: em alguns aparelhos o resultado é NaN,
            // que apaga as partes moles e o ruído. O shader compila mesmo assim, e
            // não cai no fallback. Quadrados saem de `d * d`.
            expect(EXPOSURE_SKSL).not.toMatch(/\bpow\s*\(/);
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

        it('sem campo, não desenha faixa colimada', () => {
            make.mockReturnValue(null);
            const { queryByTestId } = render(<ExposureImage input={INPUT} size={200} label="x" />);

            for (const side of ['top', 'bottom', 'left', 'right']) {
                expect(queryByTestId(`exposure-fallback-mask-${side}`)).toBeNull();
            }
        });

        it('com campo, cobre fora dele com o tom sem feixe, em quatro faixas centradas', () => {
            make.mockReturnValue(null);
            // 270 de largura dá 330 de altura; o campo cobre metade da largura e 40% da altura.
            const { getByTestId } = render(
                <ExposureImage input={INPUT} size={270} label="x" field={{ width: 0.5, height: 0.4 }} />,
            );
            const box = (side: string) => StyleSheet.flatten(getByTestId(`exposure-fallback-mask-${side}`).props.style);

            for (const side of ['top', 'bottom', 'left', 'right']) {
                expect(box(side).backgroundColor).toBe(grayTone(UNEXPOSED_LUMINANCE));
            }
            expect(box('top')).toMatchObject({ top: 0, left: 0, width: 270 });
            expect(box('top').height).toBeCloseTo(99, 9);
            expect(box('bottom').height).toBeCloseTo(99, 9);
            expect(box('bottom').bottom).toBe(0);
            expect(box('left')).toMatchObject({ left: 0, width: 67.5 });
            expect(box('right')).toMatchObject({ right: 0, width: 67.5 });
            expect(box('left').top).toBeCloseTo(99, 9);
            expect(box('left').height).toBeCloseTo(132, 9);
            // O tom sem feixe é diferente do osso: a faixa não some contra ele.
            expect(grayTone(UNEXPOSED_LUMINANCE)).not.toBe(grayTone(exposureModel(INPUT).bone));
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
