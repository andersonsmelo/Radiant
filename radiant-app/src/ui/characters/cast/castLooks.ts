import { castColors, galaxyColors, pixelColors } from '../../theme';

/**
 * Regras de construção do elenco (bíblia de 2026-11-13). Todo retrato é
 * desenhado numa caixa de 64 × 64 com os mesmos ombros, o mesmo rosto e as
 * mesmas feições; o que muda de um personagem para outro é só o que ele VESTE e
 * o cabelo. Por isso cada personagem é dado, não componente: um personagem
 * novo é mais um objeto desta lista, e o teste de padrão
 * (`castStandard.test.tsx`) o confere como confere os outros.
 */

/** Caixa de desenho de todo retrato. */
export const CAST_VIEWBOX = 64;

/** As duas espessuras de traço da bíblia, em unidades da caixa 64. Não há terceira. */
export const CAST_STROKE = {
    /** Óculos, lapela, cordão, prega: detalhe de roupa e acessório. */
    detalhe: 1.2,
    /** Olho em arco, boca, sobrancelha e gola: tudo que lê como feição. */
    feicao: 1.4,
} as const;

/**
 * Uma forma da caixa 64. Com `strokeWidth`, é traço; sem ele, é preenchimento.
 * `filled` só existe para deixar explícito um preenchimento numa tabela de
 * traços (a boca aberta, as faíscas).
 */
export type CastShape =
    | { kind: 'path'; d: string; strokeWidth?: number; filled?: boolean }
    | { kind: 'circle'; cx: number; cy: number; r: number; strokeWidth?: number; filled?: boolean }
    | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

/** Forma de roupa ou acessório: já vem com a cor, que sai sempre de um token. */
export type CastDetail = CastShape & { color: string };

export type CastLookId = 'lia' | 'caio' | 'duda' | 'paciente' | 'paciente-dona' | 'dentista' | 'ultrassom';

export type CastLook = {
    id: CastLookId;
    tones: {
        skin: string; skinShade: string;
        hair: string; hairLight: string;
        clothing: string; clothingShade: string;
    };
    /** A massa de cabelo, que separa as silhuetas. */
    hair: string;
    /** Cabelo que passa por trás da cabeça (cachos, cabelo solto) em vez de por cima. */
    hairBehind?: boolean;
    /** Mecha que cai na testa, por cima do rosto, quando o cabelo está atrás. */
    fringe?: string;
    /** A faixa de luz no alto à esquerda: o que destaca cabelo escuro da placa grafite. */
    hairShine: string;
    /** Roupa e acessório que ficam abaixo das feições. */
    details: readonly CastDetail[];
    /** O que fica por cima dos olhos (óculos). */
    overlay?: readonly CastDetail[];
    /**
     * O que identifica o personagem sem cor nenhuma (bíblia, "ficha visual").
     * O teste exige ao menos um; a bíblia diz qual forma desenha cada um.
     */
    identity: readonly string[];
};

/** Círculo em comandos absolutos, para toda coordenada do traçado ficar dentro da caixa. */
export function circlePath(cx: number, cy: number, r: number): string {
    return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

/** Ombros e rosto são os mesmos em todo retrato; muda quem os veste. */
export const CAST_SHOULDERS = 'M8 64 C8 51 20 45 32 45 C44 45 56 51 56 64 Z';
export const CAST_SHOULDERS_SHADE = 'M32 45 C44 45 56 51 56 64 L42 64 C43 55 39 49 32 45 Z';
export const CAST_FACE = { cx: 32, cy: 27, rx: 11, ry: 12.5 } as const;
export const CAST_FACE_SHADE = 'M38 16 C44 20 45 33 38 39 C41 33 41 22 38 16 Z';
export const CAST_NECK = { x: 27, y: 36, width: 10, height: 11 } as const;
/** A tinta das feições: o grafite mais fundo, o mesmo do fundo do app. */
export const CAST_INK = galaxyColors.background;

const { lia, caio, duda, pacienteSeu, pacienteDona, gown, candidates } = castColors;
const DETALHE = 1.2;
const FEICAO = 1.4;

const GOWN_DETAILS: readonly CastDetail[] = [
    // Decote redondo e a estampa de bolinhas do avental hospitalar.
    { kind: 'path', d: 'M25 46 Q32 52 39 46', strokeWidth: FEICAO, color: gown.shade },
    { kind: 'circle', cx: 20, cy: 57, r: 1.3, color: gown.shade },
    { kind: 'circle', cx: 32, cy: 59, r: 1.3, color: gown.shade },
    { kind: 'circle', cx: 44, cy: 57, r: 1.3, color: gown.shade },
];

export const CAST_LOOKS: Record<CastLookId, CastLook> = {
    lia: {
        id: 'lia',
        tones: { skin: lia.skin, skinShade: lia.skinShade, hair: lia.hair, hairLight: lia.hairLight, clothing: pixelColors.coat.base, clothingShade: pixelColors.coat.shade },
        hair: `${circlePath(32, 10, 6)} M20 29 C17 16 24 11 32 11 C40 11 47 16 44 29 C42 22 38 18 32 18 C26 18 22 22 20 29 Z`,
        hairShine: 'M27.6 8.6 Q29 5.4 32.4 4.8 Q30 6.6 29.2 9.4 Z M21.4 23 C21.8 17.4 25.6 13.6 30.6 12.6 C26.8 14.8 24.4 18 23.2 22.6 Z',
        details: [
            // Gola da blusa azul, as duas lapelas do jaleco e o dosímetro na lapela.
            { kind: 'path', d: 'M27 45.5 L32 54 L37 45.5 Z', color: pixelColors.blue.base },
            { kind: 'path', d: 'M27 45.5 L24 58 M37 45.5 L40 58', strokeWidth: DETALHE, color: pixelColors.coat.shade },
            { kind: 'rect', x: 41.5, y: 51, width: 5, height: 7, rx: 1, color: pixelColors.metal.shade },
            { kind: 'rect', x: 42.5, y: 52.5, width: 3, height: 1.2, color: pixelColors.coat.light },
        ],
        overlay: [
            { kind: 'circle', cx: 27.5, cy: 27, r: 3.8, strokeWidth: DETALHE, color: lia.hairShade },
            { kind: 'circle', cx: 36.5, cy: 27, r: 3.8, strokeWidth: DETALHE, color: lia.hairShade },
            { kind: 'path', d: 'M31.3 27 L32.7 27', strokeWidth: DETALHE, color: lia.hairShade },
        ],
        identity: ['coque no alto da cabeça', 'óculos redondos', 'jaleco com lapelas', 'dosímetro na lapela'],
    },
    caio: {
        id: 'caio',
        tones: { skin: caio.skin, skinShade: caio.skinShade, hair: caio.hair, hairLight: caio.hairLight, clothing: pixelColors.blue.shade, clothingShade: caio.scrubShade },
        hair: 'M21 24 C20 14 26 12 32 12 C39 12 45 14 43 24 C42 20 40 18 37 18 L27 18 C24 18 22 20 21 24 Z',
        hairShine: 'M23 19.6 C23.4 15.6 27 13.4 31 13.2 C27.6 14.6 25.4 16.4 24.6 18.6 Z',
        details: [
            // Gola em V do pijama cirúrgico e o crachá do plantão.
            { kind: 'path', d: 'M27 45.5 L32 53 L37 45.5 Z', color: caio.skin },
            { kind: 'rect', x: 40, y: 54, width: 7, height: 8, rx: 1, color: pixelColors.coat.base },
            { kind: 'rect', x: 41.5, y: 57, width: 4, height: 1.2, color: pixelColors.coat.shade },
        ],
        identity: ['cabelo curto de topo reto', 'gola em V do pijama cirúrgico', 'crachá no peito'],
    },
    duda: {
        id: 'duda',
        tones: { skin: duda.skin, skinShade: duda.skinShade, hair: duda.hair, hairLight: duda.hairLight, clothing: duda.hoodie, clothingShade: duda.hoodieShade },
        hair: [circlePath(21, 20, 8), circlePath(30, 13, 8), circlePath(40, 14, 8), circlePath(46, 23, 7), circlePath(18, 30, 6), circlePath(47, 32, 6)].join(' '),
        hairBehind: true,
        fringe: `${circlePath(26, 17, 5)} ${circlePath(35, 16, 5)}`,
        hairShine: 'M15.4 18.4 Q16.8 14 21.2 13 Q18.2 15.2 17.4 18.8 Z M25 9.4 Q26.8 5.8 30.8 5.4 Q28 7.2 27.2 10.2 Z',
        details: [
            // Capuz do moletom e os dois cordões.
            { kind: 'path', d: 'M22 48 C26 53 38 53 42 48 C39 45 25 45 22 48 Z', color: duda.hoodieShade },
            { kind: 'path', d: 'M28 51.5 L28 58 M36 51.5 L36 58', strokeWidth: DETALHE, color: pixelColors.coat.shade },
        ],
        identity: ['cachos volumosos em volta da cabeça', 'capuz do moletom', 'cordões do capuz'],
    },
    paciente: {
        id: 'paciente',
        tones: { skin: pacienteSeu.skin, skinShade: pacienteSeu.skinShade, hair: pacienteSeu.hair, hairLight: pacienteSeu.hairLight, clothing: gown.base, clothingShade: gown.shade },
        hair: 'M20 28 C18 22 20 18 24 17 C22 21 22 25 22 30 Z M44 28 C46 22 44 18 40 17 C42 21 42 25 42 30 Z',
        hairShine: 'M20.6 25 C20.2 21.6 21.2 19.2 23.2 18 C22.2 20.2 21.8 22.6 21.8 25.4 Z',
        details: GOWN_DETAILS,
        identity: ['cabelo só nas laterais', 'avental hospitalar de decote redondo', 'estampa de bolinhas'],
    },
    'paciente-dona': {
        id: 'paciente-dona',
        tones: { skin: pacienteDona.skin, skinShade: pacienteDona.skinShade, hair: pacienteDona.hair, hairLight: pacienteDona.hairLight, clothing: gown.base, clothingShade: gown.shade },
        hair: 'M18.5 42 C15.5 33 16 18 32 13 C48 18 48.5 33 45.5 42 L40 42 C42 34 42 28 41 26 L23 26 C22 28 22 34 24 42 Z',
        hairBehind: true,
        fringe: 'M21 26 C20 18 25 13.5 32 13.5 C39 13.5 44 18 43 26 C40 20 35 18.5 30 19.5 C26 20.5 23 23 21 26 Z',
        hairShine: 'M21.8 22.6 C22.6 17.6 26 14.8 30.6 14.2 C27 16 24.8 18.8 23.6 22.4 Z',
        details: GOWN_DETAILS,
        identity: ['cabelo solto até os ombros, repartido de lado', 'avental hospitalar de decote redondo', 'estampa de bolinhas'],
    },
    dentista: {
        id: 'dentista',
        tones: { skin: candidates.dentista.skin, skinShade: candidates.dentista.skinShade, hair: candidates.dentista.cap, hairLight: candidates.dentista.hairLight, clothing: candidates.dentista.scrub, clothingShade: candidates.dentista.scrubShade },
        // A touca descartável cobre o cabelo: ela é a silhueta.
        hair: 'M20 24 C19 13 25 9.5 32 9.5 C39 9.5 45 13 44 24 C41 19 37 17.5 32 17.5 C27 17.5 23 19 20 24 Z',
        hairShine: 'M22.4 19 C23 14.4 26.6 11.4 31 11 C27.4 12.8 25.2 15.4 24.2 18.6 Z',
        details: [
            // Pregas da touca, gola em V e a máscara abaixada no pescoço.
            { kind: 'path', d: 'M26 12 L27 16 M32 10.5 L32 15 M38 12 L37 16', strokeWidth: DETALHE, color: candidates.dentista.scrubShade },
            { kind: 'path', d: 'M27 45.5 L32 53 L37 45.5 Z', color: candidates.dentista.skin },
            { kind: 'path', d: 'M25 42.5 Q32 47 39 42.5 L39 45.5 Q32 50 25 45.5 Z', color: pixelColors.coat.base },
            { kind: 'path', d: 'M25 43.5 L21.5 36 M39 43.5 L42.5 36', strokeWidth: DETALHE, color: pixelColors.coat.shade },
        ],
        identity: ['touca descartável com pregas', 'máscara abaixada no pescoço, com os elásticos', 'gola em V'],
    },
    ultrassom: {
        id: 'ultrassom',
        tones: { skin: candidates.ultrassom.skin, skinShade: candidates.ultrassom.skinShade, hair: candidates.ultrassom.hair, hairLight: candidates.ultrassom.hairLight, clothing: pixelColors.coat.base, clothingShade: pixelColors.coat.shade },
        hair: 'M21 23 C20 14 26 11.5 32 11.5 C38 11.5 44 14 43 23 C41 19 37 17 32 17 C27 17 23 19 21 23 Z',
        hairShine: 'M23 19 C23.6 15.2 27 12.8 31 12.6 C27.6 14.2 25.4 16 24.6 18.2 Z',
        details: [
            // Barba curta (abaixo da boca), camisa escura e o jaleco aberto.
            { kind: 'path', d: 'M22.5 31 C23 38 27.5 41 32 41 C36.5 41 41 38 41.5 31 C39 35 36 36.5 32 36.5 C28 36.5 25 35 22.5 31 Z', color: candidates.ultrassom.hair },
            { kind: 'path', d: 'M26 45.5 L32 58 L38 45.5 Z', color: candidates.ultrassom.shirt },
            { kind: 'path', d: 'M26 45.5 L23 58 M38 45.5 L41 58', strokeWidth: DETALHE, color: pixelColors.coat.shade },
        ],
        identity: ['barba curta', 'jaleco aberto sobre camisa escura', 'sem óculos e sem crachá'],
    },
};

/** Os retratos das aulas publicadas; os outros dois são candidatos (`castCandidates.ts`). */
export const LESSON_LOOK_IDS: readonly CastLookId[] = ['lia', 'caio', 'duda', 'paciente', 'paciente-dona'];

/**
 * O paciente muda a cada cena, e as aulas o chamam de "Dona" ou "Seu" (Dona
 * Marta, Seu Jorge). Dona Marta pergunta pelo atraso da menstruação (M01): o
 * senhor grisalho de antes a contradizia. O tratamento escolhe o retrato; sem
 * nome, fica o de sempre.
 */
export function castLookFor(speaker: Exclude<CastLookId, 'paciente-dona' | 'dentista' | 'ultrassom'>, name?: string): CastLook {
    if (speaker === 'paciente' && /^dona\s/iu.test(name?.trim() ?? '')) return CAST_LOOKS['paciente-dona'];
    return CAST_LOOKS[speaker];
}
