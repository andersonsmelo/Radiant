/**
 * Guarda de padrão do elenco (bíblia de 2026-11-13, seção "Guarda").
 *
 * Lê a ÁRVORE RENDERIZADA de cada retrato (as props de `Path`, `Circle`,
 * `Rect`, `Ellipse` como o componente as recebe), nunca o texto do arquivo:
 * um comentário que cita uma cor não a desenha. Reprova:
 *  1. cor fora dos tokens do tema;
 *  2. traço fora das duas espessuras da bíblia;
 *  3. personagem sem alguma expressão do conjunto comum, ou com duas
 *     expressões iguais, ou com feição fora da caixa 64 (diferença sem
 *     validade não vale);
 *  4. personagem sem rótulo acessível com o nome, e rótulo que esconde a
 *     expressão quando ela muda o sentido;
 *  5. silhueta ou feição sem contraste contra a placa grafite.
 *
 * Cada auditor é visto falhando dentro desta própria suíte, contra um
 * personagem com o defeito exato que ele nomeia (os blocos "pega"). A execução
 * vermelha contra o código real, com os mesmos defeitos injetados, está em
 * `docs/evidence/2026-11-13-f7-personagens/guarda-vermelha.txt`.
 */
import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import type { LessonCastId } from '../../../types/learningActivity';
import { DialogueScene } from '../../../features/lesson-flow/components/DialogueScene';
import { castColors, galaxyColors, medalColors, pixelColors } from '../../theme';
import { PIXEL_EXPRESSIONS } from '../pixelExpressions';
import { CastAvatar, CastPortrait } from './CastAvatar';
import { CAST_CANDIDATES } from './castCandidates';
import {
    CAST_ACCESSORIES, CAST_BROWS, CAST_EXPRESSION_LABEL, CAST_EXPRESSIONS, CAST_EYES, CAST_FACES, CAST_MOUTHS,
    labelExpressionFor, pixelExpressionFor, type CastExpression,
} from './castExpressions';
import { CAST_INK, CAST_LOOKS, CAST_STROKE, CAST_VIEWBOX, LESSON_LOOK_IDS, type CastLook } from './castLooks';
import { CAST } from './castRegistry';

type ReactTestInstance = ReturnType<typeof screen.getByTestId>;

jest.mock('../../accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreference: () => true,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));

// ---------------------------------------------------------------- auditores

function flattenColors(value: unknown, into: Set<string>): Set<string> {
    if (typeof value === 'string') into.add(value.toLowerCase());
    else if (value && typeof value === 'object') for (const inner of Object.values(value)) flattenColors(inner, into);
    return into;
}
const TOKEN_COLORS = flattenColors([galaxyColors, pixelColors, castColors, medalColors], new Set(['none']));
const STROKES = new Set<number>(Object.values(CAST_STROKE));
const SVG_SHAPES = new Set<unknown>([Path, Circle, Rect, Ellipse]);

type ShapeNode = { type: unknown; props: Record<string, any> };

function svgShapes(): ShapeNode[] {
    return screen.UNSAFE_root.findAll((node: ReactTestInstance) => SVG_SHAPES.has(node.type), { deep: true }) as unknown as ShapeNode[];
}

/** As coordenadas extremas de uma forma, para conferir que ela cabe na caixa. */
function extent(node: ShapeNode): number[] {
    const p = node.props;
    if (node.type === Circle) return [p.cx - p.r, p.cx + p.r, p.cy - p.r, p.cy + p.r];
    if (node.type === Ellipse) return [p.cx - p.rx, p.cx + p.rx, p.cy - p.ry, p.cy + p.ry];
    if (node.type === Rect) return [p.x, p.x + p.width, p.y, p.y + p.height];
    const d = String(p.d);
    const numbers = (d.match(/-?\d+(?:\.\d+)?/gu) ?? []).map(Number);
    // Num arco, os números são as pontas: a altura sai do centro e do raio.
    for (const [, y, r] of d.matchAll(/M[\d.]+ ([\d.]+) A([\d.]+) /gu)) numbers.push(Number(y) - Number(r), Number(y) + Number(r));
    return numbers;
}

/** Defeitos de desenho de uma árvore renderizada: cor, traço e caixa. */
function auditDrawing(): string[] {
    const problems: string[] = [];
    for (const node of svgShapes()) {
        for (const prop of ['fill', 'stroke'] as const) {
            const color = node.props[prop];
            if (color !== undefined && !TOKEN_COLORS.has(String(color).toLowerCase())) problems.push(`cor fora dos tokens: ${color}`);
        }
        const width = node.props.strokeWidth;
        if (width !== undefined && !STROKES.has(width)) problems.push(`traço fora da bíblia: ${width}`);
        const out = extent(node).filter((n) => n < 0 || n > CAST_VIEWBOX);
        if (out.length > 0) problems.push(`fora da caixa ${CAST_VIEWBOX}: ${out.join(', ')}`);
    }
    return problems;
}

/** A assinatura do rosto: tudo que o grupo `cast-face-*` desenha. */
function faceSignature(expression: CastExpression): string | null {
    const groups = screen.UNSAFE_root.findAll((node: ReactTestInstance) => node.type === G && node.props.testID === `cast-face-${expression}`, { deep: true });
    if (groups.length !== 1) return null;
    return groups[0].findAll((node: ReactTestInstance) => SVG_SHAPES.has(node.type), { deep: true })
        .map((node: ReactTestInstance) => JSON.stringify([node.props.d, node.props.cx, node.props.cy, node.props.r])).join('|');
}

/**
 * Defeitos de expressão: cada uma das cinco precisa existir, ser diferente das
 * outras e continuar desenhável (cor, traço e caixa valem para todas).
 */
/** A assinatura que a tabela `CAST_FACES` manda desenhar, na ordem do desenho. */
function expectedFaceSignature(expression: CastExpression): string {
    const face = CAST_FACES[expression];
    return [...CAST_BROWS[face.brows], ...CAST_EYES[face.eyes], ...CAST_MOUTHS[face.mouth], ...CAST_ACCESSORIES[face.accessory]]
        .map((shape) => JSON.stringify([
            'd' in shape ? shape.d : undefined, 'cx' in shape ? shape.cx : undefined,
            'cy' in shape ? shape.cy : undefined, 'r' in shape ? shape.r : undefined,
        ])).join('|');
}

function auditExpressions(draw: (expression: CastExpression) => React.ReactElement, checkTable = false): string[] {
    const problems: string[] = [];
    const seen = new Map<string, CastExpression>();
    for (const expression of CAST_EXPRESSIONS) {
        const view = render(draw(expression));
        const signature = faceSignature(expression);
        if (signature === null) problems.push(`sem a expressão ${expression}`);
        else if (seen.has(signature)) problems.push(`${expression} igual a ${seen.get(signature)}`);
        else seen.set(signature, expression);
        if (checkTable && signature !== null && signature !== expectedFaceSignature(expression)) {
            problems.push(`${expression} não desenha o rosto da tabela`);
        }
        for (const problem of auditDrawing()) problems.push(`${expression}: ${problem}`);
        view.unmount();
    }
    return problems;
}

/** Defeitos de acessibilidade de um avatar que fala por si (não decorativo). */
function auditLabel(element: React.ReactElement, name: string, expression: CastExpression): string[] {
    const view = render(element);
    const images = screen.UNSAFE_root.findAll((node: ReactTestInstance) => typeof node.type === 'string' && node.props.accessibilityLabel !== undefined
        && node.props.accessibilityRole === 'image', { deep: true });
    const labels: string[] = images.map((node: ReactTestInstance) => String(node.props.accessibilityLabel));
    view.unmount();
    if (labels.length === 0) return ['sem rótulo acessível'];
    const problems: string[] = [];
    if (!labels.some((label) => label.includes(name))) problems.push(`rótulo sem o nome ${name}: ${labels.join(' / ')}`);
    const mood = CAST_EXPRESSION_LABEL[expression];  // quem chama já traduz pelo rosto mostrado
    if (mood && !labels.some((label) => label.includes(mood))) problems.push(`rótulo sem a expressão ${expression}: ${labels.join(' / ')}`);
    return problems;
}

function contrastRatio(foreground: string, background: string): number {
    const luminance = (hex: string) => {
        const [r, g, b] = (hex.slice(1).match(/.{2}/gu) ?? []).map((c) => {
            const v = Number.parseInt(c, 16) / 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
}

/** Defeitos de contraste (WCAG 1.4.11, 3:1 para forma gráfica) contra a placa e a tinta. */
function auditContrast(look: CastLook): string[] {
    const plate = galaxyColors.surfaceActive;
    const problems: string[] = [];
    const hair = contrastRatio(look.tones.hair, plate);
    const shine = contrastRatio(look.tones.hairLight, plate);
    if (Math.max(hair, shine) < 3) problems.push(`cabelo some na placa: ${Math.max(hair, shine).toFixed(2)}:1`);
    // Cabelo escuro depende da faixa de luz: ela precisa ter tamanho de forma, não de ponto.
    if (hair < 3) {
        const numbers = (look.hairShine.match(/-?\d+(?:\.\d+)?/gu) ?? []).map(Number);
        const xs = numbers.filter((_, index) => index % 2 === 0);
        const ys = numbers.filter((_, index) => index % 2 === 1);
        const width = xs.length ? Math.max(...xs) - Math.min(...xs) : 0;
        const height = ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
        if (width < 3 || height < 3) problems.push(`faixa de luz pequena demais: ${width.toFixed(1)} × ${height.toFixed(1)}`);
    }
    const clothing = contrastRatio(look.tones.clothing, plate);
    if (clothing < 3) problems.push(`roupa some na placa: ${clothing.toFixed(2)}:1`);
    const features = contrastRatio(CAST_INK, look.tones.skin);
    if (features < 3) problems.push(`feição some na pele: ${features.toFixed(2)}:1`);
    return problems;
}

// ---------------------------------------------------------------- o elenco

const ALL_LOOKS = Object.values(CAST_LOOKS);
const SPEAKERS = Object.keys(CAST) as LessonCastId[];

describe('padrão do elenco: os personagens reais', () => {
    it.each(ALL_LOOKS.map((look) => [look.id, look] as const))('%s: as cinco expressões existem, são distintas, só usam tokens e as duas espessuras, e cabem na caixa', (_id, look) => {
        expect(auditExpressions((expression) => <CastPortrait look={look} expression={expression} />, true)).toEqual([]);
    });

    it.each(ALL_LOOKS.map((look) => [look.id, look] as const))('%s: silhueta, roupa e feições têm 3:1 contra a placa grafite', (_id, look) => {
        expect(auditContrast(look)).toEqual([]);
    });

    it.each(ALL_LOOKS.map((look) => [look.id, look] as const))('%s: tem ao menos um traço de identidade que não depende de cor', (_id, look) => {
        expect(look.identity.length).toBeGreaterThan(0);
    });

    it.each(SPEAKERS.flatMap((speaker) => CAST_EXPRESSIONS.map((expression) => [speaker, expression] as const)))(
        '%s %s: o avatar é lido com o nome e, quando muda o sentido, a expressão',
        (speaker, expression) => {
            expect(auditLabel(<CastAvatar speaker={speaker} expression={expression} />, CAST[speaker].displayName, labelExpressionFor(speaker, expression))).toEqual([]);
        },
    );

    it('decorativo, nenhum avatar fica na árvore de acessibilidade', () => {
        for (const speaker of SPEAKERS) {
            const view = render(<CastAvatar speaker={speaker} expression="feliz" decorative />);
            // `includeHiddenElements`: sem ele a consulta já pula nó escondido e passaria sempre.
            if (speaker !== 'pixel') {
                expect(screen.queryByLabelText(new RegExp(CAST[speaker].displayName, 'u'), { includeHiddenElements: true })).toBeNull();
            }
            expect(screen.getByTestId(`cast-avatar-${speaker}`, { includeHiddenElements: true }).props.importantForAccessibility).toBe('no-hide-descendants');
            view.unmount();
        }
    });

    it('o Pixel responde às cinco expressões comuns com rostos dele, sem redesenho', () => {
        for (const expression of CAST_EXPRESSIONS) expect(PIXEL_EXPRESSIONS[pixelExpressionFor(expression)]).toBeDefined();
    });

    it('os candidatos têm nome, papel e uma ficha de desenho que passa pela mesma guarda', () => {
        for (const candidate of CAST_CANDIDATES) {
            expect(candidate.displayName.trim()).not.toBe('');
            expect(candidate.role.trim()).not.toBe('');
            expect(CAST_LOOKS[candidate.look]).toBeDefined();
            expect(LESSON_LOOK_IDS).not.toContain(candidate.look);
        }
    });
});

// ---------------------------------------------------------------- cada auditor pega o seu defeito

describe('padrão do elenco: cada auditor reprova o defeito que nomeia', () => {
    const base = CAST_LOOKS.caio;

    it('pega cor fora dos tokens', () => {
        const look: CastLook = { ...base, details: [...base.details, { kind: 'circle', cx: 40, cy: 58, r: 2, color: '#FF00AA' }] };
        expect(auditExpressions((expression) => <CastPortrait look={look} expression={expression} />))
            .toContain('neutro: cor fora dos tokens: #FF00AA');
    });

    it('pega traço fora das duas espessuras', () => {
        const look: CastLook = { ...base, details: [...base.details, { kind: 'path', d: 'M30 50 L34 50', strokeWidth: 2, color: pixelColors.coat.shade }] };
        expect(auditExpressions((expression) => <CastPortrait look={look} expression={expression} />))
            .toContain('neutro: traço fora da bíblia: 2');
    });

    it('pega personagem que ignora a expressão pedida (o retrato fixo de antes)', () => {
        expect(auditExpressions(() => <CastPortrait look={base} expression="neutro" />)).toEqual(expect.arrayContaining([
            'sem a expressão feliz', 'sem a expressão pensativo', 'sem a expressão preocupado', 'sem a expressão comemorando',
        ]));
    });

    it('pega duas expressões iguais', () => {
        // Um rosto que desenha o mesmo para tudo, mas com o grupo certo: diferença é exigida, não só presença.
        const SameFace = ({ expression }: { expression: CastExpression }) => (
            <Svg viewBox="0 0 64 64"><G testID={`cast-face-${expression}`}><Path d="M29 33 Q32 34.6 35 33" stroke={CAST_INK} strokeWidth={1.4} /></G></Svg>
        );
        expect(auditExpressions((expression) => <SameFace expression={expression} />)).toContain('feliz igual a neutro');
    });

    it('pega expressão diferente, mas fora da caixa (diferença sem validade)', () => {
        const Outside = ({ expression }: { expression: CastExpression }) => (
            <Svg viewBox="0 0 64 64"><G testID={`cast-face-${expression}`}>
                <Circle cx={CAST_EXPRESSIONS.indexOf(expression) * 20 - 10} cy={27} r={1.4} fill={CAST_INK} />
            </G></Svg>
        );
        const problems = auditExpressions((expression) => <Outside expression={expression} />);
        // As cinco são diferentes entre si, e mesmo assim duas reprovam.
        expect(problems.filter((line) => / igual a /u.test(line))).toEqual([]);
        expect(problems).toEqual(['neutro: fora da caixa 64: -11.4, -8.6', 'comemorando: fora da caixa 64: 68.6, 71.4']);
    });

    it('pega personagem sem rótulo acessível, e rótulo sem o nome ou sem a expressão', () => {
        expect(auditLabel(<View accessibilityRole="image" />, 'Caio', 'neutro')).toEqual(['sem rótulo acessível']);
        expect(auditLabel(<View accessibilityRole="image" accessibilityLabel="tecnólogo" />, 'Caio', 'neutro')).toEqual(['rótulo sem o nome Caio: tecnólogo']);
        expect(auditLabel(<CastAvatar speaker="caio" expression="preocupado" accessibilityLabel="Caio, tecnólogo do plantão" />, 'Caio', 'preocupado'))
            .toEqual(['rótulo sem a expressão preocupado: Caio, tecnólogo do plantão']);
    });

    it('pega cabelo escuro com a faixa de luz reduzida a um ponto', () => {
        expect(auditContrast({ ...CAST_LOOKS.lia, hairShine: 'M0 0 Z' })).toEqual(['faixa de luz pequena demais: 0.0 × 0.0']);
    });

    it('pega rosto que troca de lugar com outro da tabela', () => {
        const Swapped = ({ expression }: { expression: CastExpression }) => (
            <CastPortrait look={base} expression={expression === 'feliz' ? 'comemorando' : expression === 'comemorando' ? 'feliz' : expression} />
        );
        // O grupo leva o nome da expressão desenhada; renomeado, só a tabela denuncia a troca.
        const Relabeled = ({ expression }: { expression: CastExpression }) => (
            <Svg viewBox="0 0 64 64"><G testID={`cast-face-${expression}`}><Swapped expression={expression} /></G></Svg>
        );
        expect(auditExpressions((expression) => <Relabeled expression={expression} />, true)).toEqual(expect.arrayContaining([
            'feliz não desenha o rosto da tabela', 'comemorando não desenha o rosto da tabela',
        ]));
    });

    it('pega cabelo escuro sem a faixa de luz, roupa que some e feição sem contraste', () => {
        expect(auditContrast({ ...CAST_LOOKS.lia, tones: { ...CAST_LOOKS.lia.tones, hairLight: castColors.lia.hair } })).toEqual(['cabelo some na placa: 1.03:1']);
        expect(auditContrast({ ...base, tones: { ...base.tones, clothing: galaxyColors.border } })[0]).toMatch(/^roupa some na placa/u);
        expect(auditContrast({ ...base, tones: { ...base.tones, skin: galaxyColors.surfaceMuted } })[0]).toMatch(/^feição some na pele/u);
    });
});

// ---------------------------------------------------------------- desempenho

function countHostNodes(json: unknown): number {
    if (Array.isArray(json)) return json.reduce((total: number, child) => total + countHostNodes(child), 0);
    if (!json || typeof json !== 'object') return 0;
    return 1 + countHostNodes((json as { children?: unknown }).children);
}

describe('padrão do elenco: o retrato continua leve', () => {
    // Medido em 2026-11-13 (evidência `desempenho.txt`): o retrato mais pesado
    // tem 22 nós; antes da F7 eram 14 a 17. O teto deixa folga para um
    // acessório, não para um segundo desenho.
    const PORTRAIT_NODE_BUDGET = 26;

    it.each(ALL_LOOKS.map((look) => [look.id, look] as const))('%s: cabe no teto de nós em qualquer expressão', (_id, look) => {
        for (const expression of CAST_EXPRESSIONS) {
            const view = render(<CastPortrait look={look} expression={expression} />);
            expect(countHostNodes(view.toJSON())).toBeLessThanOrEqual(PORTRAIT_NODE_BUDGET);
            view.unmount();
        }
    });

    it('uma cena de seis falas com o elenco inteiro fica no teto medido', () => {
        const speakers: LessonCastId[] = ['lia', 'caio', 'duda', 'paciente', 'pixel', 'lia'];
        const lines = speakers.map((speaker, index) => ({ speaker, name: index === 3 ? 'Dona Marta' : undefined, text: 'Fala?' }));
        const view = render(<DialogueScene dialogue={{ lines }} visibleCount={6} />);
        // 169 nós antes da F7; a placa do Pixel e as feições somam ~30. Ver `desempenho.txt`.
        expect(countHostNodes(view.toJSON())).toBeLessThanOrEqual(215);
        view.unmount();
    });
});
