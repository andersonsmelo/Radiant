import { PIXEL_EXPRESSIONS } from '../pixelExpressions';
import {
    CAST_BROWS, CAST_EXPRESSION_LABEL, CAST_EXPRESSIONS, CAST_FACES, CAST_MOUTHS, pixelExpressionFor,
} from './castExpressions';

/** Os pontos (x, y) de um traçado só de M, L e Q. */
function points(d: string): number[][] {
    return [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/gu)].map(([, x, y]) => [Number(x), Number(y)]);
}

describe('expressões do elenco', () => {
    it('o conjunto comum tem as cinco do contrato da F7, cada uma com rosto e rótulo', () => {
        expect(CAST_EXPRESSIONS).toEqual(['neutro', 'feliz', 'pensativo', 'preocupado', 'comemorando']);
        for (const expression of CAST_EXPRESSIONS) {
            expect(CAST_FACES[expression]).toBeDefined();
            expect(expression in CAST_EXPRESSION_LABEL).toBe(true);
        }
        expect(CAST_EXPRESSION_LABEL.neutro).toBeNull();
    });

    it('a sobrancelha de preocupação sobe por dentro (empatia), e nenhuma desce por dentro (reprovação)', () => {
        const [leftOuter, leftInner, rightInner, rightOuter] = points(CAST_BROWS.preocupada[0].d);
        expect(leftInner[1]).toBeLessThan(leftOuter[1]);
        expect(rightInner[1]).toBeLessThan(rightOuter[1]);
        for (const [name, [shape]] of Object.entries(CAST_BROWS)) {
            // Duas metades: a esquerda vai de fora para dentro; a direita, de dentro para fora.
            const [left, right] = shape.d.split('M').filter(Boolean).map((half) => points(`M${half}`));
            const outer = [left[0][1], right[right.length - 1][1]];
            const inner = [left[left.length - 1][1], right[0][1]];
            // y cresce para baixo: ponta de dentro mais baixa que a de fora é a carranca.
            expect({ name, frown: inner[0] > outer[0] + 0.3 && inner[1] > outer[1] + 0.3 }).toEqual({ name, frown: false });
        }
    });

    it('a boca do preocupado é rasa e curta: acolhe, não reprova', () => {
        const [start, control, end] = points(CAST_MOUTHS.contida[0].d);
        expect(start[1] - control[1]).toBeGreaterThan(0);
        expect(start[1] - control[1]).toBeLessThanOrEqual(1.5);
        expect(end[0] - start[0]).toBeLessThanOrEqual(5);
    });

    it('o Pixel recebe as cinco sem rosto novo: cada uma aponta para uma expressão aprovada dele', () => {
        expect(CAST_EXPRESSIONS.map(pixelExpressionFor)).toEqual(['neutro', 'feliz', 'pensando', 'pensando', 'orgulhoso']);
        for (const expression of CAST_EXPRESSIONS) expect(PIXEL_EXPRESSIONS[pixelExpressionFor(expression)]).toBeDefined();
        // A família do Pixel passa direto, como o retorno da aula já usa.
        expect(pixelExpressionFor('pensando')).toBe('pensando');
        expect(pixelExpressionFor('surpreso')).toBe('surpreso');
    });
});
