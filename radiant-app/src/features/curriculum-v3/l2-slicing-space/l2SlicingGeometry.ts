/**
 * Geometria e decisões puras do modelo 2.5D da L2.
 *
 * Existe separado do componente porque o ambiente de teste não rasteriza SVG:
 * asseverar sobre o desenho exige asseverar sobre os valores que o DETERMINAM.
 * O parecer v3 reprovou a lição em parte porque as asserções incidiam sobre um
 * espelho das props embarcado no componente — um `<Text>` cujo conteúdo era a
 * concatenação das próprias entradas, que passa sempre que a prop chega e não
 * pode falhar por defeito nenhum do desenho.
 */

export type L2ReferenceOrientation = 'coronal' | 'sagittal' | 'transverse';
export type L2MedianRelation = 'median' | 'offset';
export type L2Inclination = 'aligned' | 'oblique';
export type L2Region = 'thorax' | 'abdomen' | 'pelvis';
export type L2Thickness = 'thin' | 'nominal' | 'thick';

/** Eixo mediano do desenho, em unidades do `viewBox`. */
export const MIDLINE_X = 120;

/** Altura do `viewBox`; nada desenhado além dela chega à tela. */
export const VIEWBOX_HEIGHT = 320;

/**
 * Silhueta frontal, em coordenadas fixas e centrada no eixo mediano.
 *
 * Não recebe deslocamento de cenário: o cenário desloca o GRUPO inteiro, e a
 * silhueta vive dentro dele junto da linha mediana, das placas e dos
 * marcadores. Embutir o deslocamento aqui além da translação do grupo
 * deslocava o corpo duas vezes e o eixo uma só — era o achado C3, que punha a
 * placa "mediana" fora do centro do corpo e tornava falsa no desenho a
 * resposta correta de `l2-initial-median` e `l2-median-recovery`.
 */
export const bodyPathFor = (_scenarioId: string): string =>
  'M 96 60 C 104 42 136 42 144 60 L 162 125 L 150 274 L 90 274 L 78 125 Z';

export const LIMBS_PATH = 'M94 82 L58 150 M146 82 L182 150 M104 272 L88 298 M136 272 L152 298';

/**
 * Placas de referência do estado de exploração.
 *
 * A vista é frontal. Um plano coronal é PARALELO ao plano de visão, então ele
 * não se projeta como segmento: desenhá-lo como linha horizontal o tornava
 * indistinguível de um transversal em outra altura (achado C1). Coronal é área
 * de face e transversal é área rasa vista de perfil; sagital projeta-se como
 * segmento vertical porque é perpendicular à vista.
 */
export const orientationPaths: Record<L2ReferenceOrientation, string> = {
  coronal: 'M 54 118 L 186 118 L 172 282 L 68 282 Z',
  sagittal: 'M 120 36 L 120 302',
  transverse: 'M 52 192 L 188 192 L 170 216 L 70 216 Z',
};

/**
 * Deslocamento lateral da placa sagital quando ela não coincide com o eixo.
 *
 * A relação com a linha mediana é um eixo PRÓPRIO, separado da orientação de
 * referência: era o achado C2 — mediano e sagital apareciam como opções irmãs
 * e mutuamente exclusivas, de modo que escolher "mediano" desselecionava
 * "sagital" e o controle ensinava `E-PLN-MED`, o erro que a lição remedia.
 */
export const PARAMEDIAN_OFFSET = 30;

/** Inclinação aplicada à placa quando a relação com as referências é oblíqua. */
export const OBLIQUE_ROTATION_DEGREES = -34;

export const candidatePaths: Record<string, string> = {
  median: 'M 116 44 L 124 44 L 124 294 L 116 294 Z',
  'sagittal-not-median': 'M 146 44 L 154 44 L 154 294 L 146 294 Z',
  coronal: 'M 54 118 L 186 118 L 172 282 L 68 282 Z',
  transverse: 'M 52 192 L 188 192 L 170 216 L 70 216 Z',
  oblique: 'M 66 250 L 78 258 L 178 104 L 166 96 Z',
  'reference-plane': 'M 52 144 L 188 144 L 176 156 L 64 156 Z',
  'region-with-nominal-thickness': 'M 72 178 L 168 178 L 178 194 L 82 194 Z M 72 212 L 168 212 L 178 228 L 82 228 Z',
  'resulting-image': 'M 178 178 L 216 178 L 216 216 L 178 216 Z',
};

export const regionBounds: Record<L2Region, readonly [number, number]> = {
  thorax: [106, 166],
  abdomen: [166, 226],
  pelvis: [226, 282],
};

export const thicknessBandCount: Record<L2Thickness, number> = { thin: 1, nominal: 2, thick: 3 };

/**
 * Região anatômica que o cenário nomeia.
 */
export const scenarioRegion = (scenarioId: string): L2Region => {
  if (scenarioId.startsWith('abdomen')) return 'abdomen';
  if (scenarioId.startsWith('pelvis')) return 'pelvis';
  return 'thorax';
};

/**
 * Candidatos que pertencem a um NÍVEL, e por isso acompanham a região.
 *
 * Os demais — placa mediana, paramediana, coronal e oblíqua — correm da cabeça
 * aos pés e não ficam "na pelve": mover a figura inteira deles era errado antes
 * de ser recorte.
 */
const LEVEL_BOUND_CANDIDATES = new Set([
  'transverse', 'reference-plane', 'region-with-nominal-thickness', 'resulting-image',
]);

/**
 * Geometria do candidato no cenário, CONSTRUÍDA na banda da região.
 *
 * A versão anterior transladava os caminhos absolutos por `+60` ou `+120`, o
 * que empurrava nove figuras para fora do `viewBox`: a resposta correta de
 * `l2-section-recovery` perdia a segunda das "duas faces" que o texto da
 * alternativa nomeia, e o distrator de `l2-reference-plane-recovery`
 * praticamente não era desenhado. Era o achado C3 de volta por outro caminho —
 * a resposta correta falsa no desenho — e a guarda que exigia apenas matrizes
 * diferentes não podia enxergá-lo.
 */
export const candidatePathFor = (answerId: string, scenarioId: string): string => {
  const base = candidatePaths[answerId] ?? '';
  if (!LEVEL_BOUND_CANDIDATES.has(answerId)) return base;

  const [regionTop] = regionBounds[scenarioRegion(scenarioId)];
  const [thoraxTop] = regionBounds.thorax;
  const delta = regionTop - thoraxTop;
  if (delta === 0) return base;

  // A banda é reposicionada e, se necessário, comprimida para caber no quadro:
  // a figura precisa continuar inteira, porque é ela que o enunciado descreve.
  const ys = Array.from(base.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)).map((m) => Number(m[2]));
  const overflow = Math.max(...ys) + delta - (VIEWBOX_HEIGHT - 8);
  const shift = overflow > 0 ? delta - overflow : delta;
  let index = 0;
  return base.replace(/(-?\d+(?:\.\d+)?)(\s+)(-?\d+(?:\.\d+)?)/g, (_match, x, gap, y) => {
    index += 1;
    return `${x}${gap}${Number(y) + shift}`;
  });
};

export const scenarioOffsetFor = (scenarioId: string): number =>
  (Array.from(scenarioId).reduce((total, character) => total + character.charCodeAt(0), 0) % 3) * 4;

export type L2ScenarioDetail = Readonly<{
  caption: string;
  markerY: number;
  markerLeft: number;
  markerRight: number;
  dashed: boolean;
}>;

/**
 * Cada cenário tem entrada própria.
 *
 * O achado v2 (2) reabriu na v3 porque doze cenários caíam em quatro saídas por
 * `includes`: itens iniciais, assistidos e de recuperação de uma mesma família
 * recebiam legenda e marcadores idênticos, e "cenário novo" era só o nível
 * anatômico no enunciado. A tabela é exaustiva de propósito, e um teste afirma
 * que todo `visualScenarioId` do conteúdo tem entrada aqui.
 */
const scenarioDetails: Record<string, L2ScenarioDetail> = {
  'thorax-midline': { caption: 'Marcas nos ombros, à mesma distância do eixo central.', markerY: 108, markerLeft: 82, markerRight: 146, dashed: false },
  'thorax-paramedian': { caption: 'Uma faixa lateral do tórax está destacada, fora do eixo central.', markerY: 122, markerLeft: 132, markerRight: 158, dashed: true },
  'pelvis-symmetry': { caption: 'Dois marcadores pélvicos equidistantes do eixo central permitem comparar simetria.', markerY: 252, markerLeft: 88, markerRight: 140, dashed: false },
  'abdomen-transverse': { caption: 'Uma faixa abdominal separa uma porção superior de outra inferior.', markerY: 186, markerLeft: 74, markerRight: 154, dashed: false },
  'abdomen-transverse-assisted': { caption: 'Com apoio: a faixa rasa e a moldura de face aparecem lado a lado no abdome.', markerY: 198, markerLeft: 66, markerRight: 162, dashed: true },
  'pelvis-coronal-recovery': { caption: 'Na pelve, uma moldura de face e uma faixa rasa disputam a mesma altura.', markerY: 240, markerLeft: 70, markerRight: 158, dashed: false },
  'abdomen-oblique': { caption: 'Uma faixa diagonal atravessa o abdome, desalinhada das referências.', markerY: 178, markerLeft: 70, markerRight: 158, dashed: true },
  'abdomen-oblique-assisted': { caption: 'Com apoio: a faixa diagonal e uma faixa alinhada aparecem juntas no abdome.', markerY: 190, markerLeft: 78, markerRight: 150, dashed: true },
  'thorax-oblique-recovery': { caption: 'No tórax, a faixa inclinada cruza as marcas dos ombros em ângulo.', markerY: 126, markerLeft: 76, markerRight: 152, dashed: true },
  'abdomen-region-thickness': { caption: 'A moldura da região abdominal mostra duas faces e a distância entre elas.', markerY: 204, markerLeft: 82, markerRight: 146, dashed: true },
  'pelvis-region-thickness-recovery': { caption: 'Na pelve, a moldura do volume aparece ao lado do quadro plano resultante.', markerY: 258, markerLeft: 90, markerRight: 138, dashed: true },
  'abdomen-image-assisted': { caption: 'Com apoio: volume e quadro plano estão destacados ao mesmo tempo no abdome.', markerY: 216, markerLeft: 72, markerRight: 156, dashed: true },
  'demonstration-default': { caption: 'Marcas de referência distribuídas pelo modelo.', markerY: 150, markerLeft: 82, markerRight: 146, dashed: false },
};

export const scenarioDetail = (scenarioId: string): L2ScenarioDetail =>
  scenarioDetails[scenarioId] ?? scenarioDetails['demonstration-default'];

export const knownScenarioIds = (): readonly string[] => Object.keys(scenarioDetails);

/**
 * A geometria final entra sem animação enquanto a preferência de movimento não
 * é conhecida.
 *
 * `AccessibilityInfo` responde de forma assíncrona e a primeira renderização
 * acontece antes disso. Agendar nessa passada é a corrida que o comentário de
 * `useReducedMotionPreference` descreve: quem pediu menos movimento via a
 * sequência começar e ser cortada, a cada desafio. Era o achado C5.
 */
export const shouldRevealImmediately = (
  preference: Readonly<{ reduceMotion: boolean; motionResolved: boolean }>
): boolean => !preference.motionResolved || preference.reduceMotion;
