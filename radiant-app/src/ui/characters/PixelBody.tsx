/**
 * Corpo do Pixel — vetor em três tons, sem rosto.
 *
 * Substitui o render 3D (`pixel_core_faceless.png`) pelo desenho aprovado em
 * 2026-10-21 (`docs/design/2026-10-21-pixel-medalhao.html`). Cada peça tem base,
 * sombra embaixo à direita e luz em cima à esquerda, como a medalha. As
 * coordenadas são as da prancheta, copiadas sem redesenho.
 *
 * O desenho cabe na MESMA caixa de 576 × 864 do PNG que ele troca. É isso que
 * mantém `PIXEL_SCREEN`, o `PixelFace` e os contratos de geometria valendo: a
 * tela escura abaixo fica em x 168, y 200, 168 × 112, e o rosto continua sendo
 * desenhado por cima pelo `PixelFace`. O contrato
 * `pixel-screen-geometry-contract` lê `PIXEL_VIEWBOX` e `PIXEL_SCREEN_RECT`
 * deste arquivo por AST.
 *
 * O corpo é decorativo. O rótulo ("Mascote Pixel") mora no frame de
 * `PixelIllustration`, um só, e o corpo se esconde do leitor de tela.
 *
 * O braço direito fica num `G` próprio (`testID="pixel-right-arm"`): é nele
 * que o aceno encaixa, sem mexer no desenho. A flutuação não mora aqui. Ela é
 * do frame (`PixelIllustration`), porque o rosto é desenhado FORA deste SVG e
 * precisa subir e descer junto com ele.
 *
 * O aceno gira o braço direito em volta do ombro, entre 0 e -14 graus, num
 * ciclo de 1,6 s. Só existe na pose `acena` e com `waving`; com "reduzir
 * movimento" o braço fica parado onde a pose o põe. O giro chega ao braço como
 * `matrix`, a única transformação que o `RNSVGGroup` nativo declara: `rotation`
 * e `origin` só viram matriz no caminho JS do `G`, e o Reanimated manda as props
 * animadas direto ao nativo, onde elas seriam descartadas.
 */

import React, { useEffect } from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect, type GProps } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { pixelColors } from '../theme';
import { useReducedMotionPreferenceState } from '../accessibility/useReducedMotionPreference';
import { PIXEL_ARMS, type PixelArm, type PixelPose } from './pixelPoses';

/** A caixa em que o corpo é desenhado, a mesma do PNG antigo. */
export const PIXEL_VIEWBOX = { width: 576, height: 864 } as const;

/** A tela escura do rosto, nas unidades da caixa. */
export const PIXEL_SCREEN_RECT = { x: 168, y: 200, width: 168, height: 112 } as const;

/**
 * A janela da cabeça (antena, orelhas e tela), nas unidades da caixa.
 * `PixelIllustration` com `variant="head"` recorta a caixa inteira por aqui.
 */
export const PIXEL_HEAD_WINDOW = { x: 84, y: 56, width: 344, height: 330 } as const;

type PixelBodyProps = {
  pose: PixelPose;
  width: number;
  height: number;
  /**
   * Liga o aceno do braço direito. Só tem efeito na pose `acena` e com o
   * movimento permitido; fora disso o braço fica na posição da pose.
   */
  waving?: boolean;
};

/** O ombro direito, em volta do qual o braço gira (unidades da caixa). */
const WAVE_ORIGIN = { x: 360, y: 408 } as const;
/** Quanto o braço se inclina no ponto mais alto do aceno, em graus. */
const WAVE_DEGREES = -14;
/** Meio ciclo: ida ou volta. O ciclo inteiro dura 1,6 s. */
const WAVE_HALF_CYCLE_MS = 800;
/** Curva do aceno, a mesma do respirar do `PixelIllustration`. */
const ACENA = { easing: Easing.inOut(Easing.quad) } as const;

/** A matriz do `G` no formato do `react-native-svg`: [a, b, c, d, tx, ty]. */
type GroupMatrix = [number, number, number, number, number, number];

// O tipo público do `G` não lista `matrix`, mas o `RNSVGGroup` nativo a declara
// e o `setNativeProps` do próprio `G` a aceita. O tipo só ganha a prop que existe.
const AnimatedG = Animated.createAnimatedComponent(
  G as React.ComponentType<GProps & { matrix?: GroupMatrix }>,
);

/**
 * O giro do braço em volta do ombro, como o `rotate(graus, 360, 408)` do SVG.
 * Com c = cos e s = sin do ângulo: [c, s, -s, c, ox - c·ox + s·oy, oy - s·ox - c·oy].
 * Em 0 grau é a identidade, a pose sem giro.
 */
function waveMatrix(degrees: number): GroupMatrix {
  'worklet';
  const angle = (degrees * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const ox = WAVE_ORIGIN.x;
  const oy = WAVE_ORIGIN.y;
  return [c, s, -s, c, ox - c * ox + s * oy, oy - s * ox - c * oy];
}

const { coat, blue, visor, metal, stethoscope } = pixelColors;

// Sombra projetada no chão. É o único preto do desenho e não é cor de marca.
const GROUND_SHADOW = 'black';

// O crescente de luz no canto superior esquerdo da tela, em coordenadas da tela.
const { x: screenX, y: screenY } = PIXEL_SCREEN_RECT;
const SCREEN_GLINT =
  `M${screenX + 14},${screenY + 34} Q${screenX + 18},${screenY + 12} ${screenX + 54},${screenY + 12} ` +
  `L${screenX + 96},${screenY + 12} Q${screenX + 50},${screenY + 20} ${screenX + 30},${screenY + 46} Z`;

// Uma manga são três traços arredondados: a base, a sombra deslocada para
// baixo e para a direita, e a luz deslocada para cima e para a esquerda.
function Sleeve({ sleeve: [x1, y1, x2, y2] }: Pick<PixelArm, 'sleeve'>) {
  return (
    <>
      <Path d={`M${x1},${y1} L${x2},${y2}`} stroke={coat.base} strokeWidth={58} strokeLinecap="round" />
      <Path
        d={`M${x1 + 10},${y1 + 14} L${x2 + 10},${y2 + 10}`}
        stroke={coat.shade}
        strokeWidth={18}
        strokeLinecap="round"
      />
      <Path
        d={`M${x1 - 12},${y1 - 8} L${x2 - 10},${y2 - 10}`}
        stroke={coat.light}
        strokeWidth={10}
        strokeLinecap="round"
      />
    </>
  );
}

function Hand({ x, y, rotate }: PixelArm['hand']) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rotate})`}>
      <Rect x={-24} y={-10} width={48} height={16} rx={8} fill={blue.shade} />
      <Rect x={-22} y={0} width={44} height={40} rx={18} fill={blue.base} />
      <Rect x={-16} y={4} width={16} height={10} rx={5} fill={blue.light} />
      <Rect x={14} y={8} width={16} height={22} rx={8} fill={blue.base} />
    </G>
  );
}

function Arm({ sleeve, hand }: PixelArm) {
  return (
    <>
      <Sleeve sleeve={sleeve} />
      <Hand {...hand} />
    </>
  );
}

export function PixelBody({ pose, width, height, waving = false }: PixelBodyProps): React.ReactElement {
  const arms = PIXEL_ARMS[pose];
  // O aceno é um laço perpétuo: só se agenda depois que a preferência de
  // movimento respondeu, senão ele começaria antes de saber se pode.
  const { reducedMotionEnabled, resolved } = useReducedMotionPreferenceState();
  const shouldWave = pose === 'acena' && waving && resolved && !reducedMotionEnabled;
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!shouldWave) {
      // Atribuir um número cancela o laço em andamento e devolve o braço à pose.
      rotation.value = 0;
      return;
    }

    rotation.value = withRepeat(withTiming(WAVE_DEGREES, { duration: WAVE_HALF_CYCLE_MS, ...ACENA }), -1, true);
    return () => {
      rotation.value = 0;
    };
  }, [rotation, shouldWave]);

  const rightArmProps = useAnimatedProps(() => ({
    matrix: waveMatrix(rotation.value),
  }));

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${PIXEL_VIEWBOX.width} ${PIXEL_VIEWBOX.height}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Ellipse cx={252} cy={800} rx={92} ry={14} fill={GROUND_SHADOW} opacity={0.32} />
      {/* base flutuante */}
      <Ellipse cx={252} cy={688} rx={104} ry={44} fill={blue.shade} />
      <Ellipse cx={252} cy={676} rx={104} ry={42} fill={blue.base} />
      <Ellipse cx={226} cy={664} rx={54} ry={14} fill={blue.light} />

      <Arm {...arms.left} />

      {/* jaleco: corpo, sombra à direita e embaixo, luz em cima à esquerda */}
      <Path
        d="M156,404 Q156,384 182,380 L322,380 Q348,384 348,404 L352,640 Q352,662 330,662 L174,662 Q152,662 152,640 Z"
        fill={coat.base}
      />
      <Path d="M300,380 L322,380 Q348,384 348,404 L352,640 Q352,662 330,662 L292,662 Z" fill={coat.shade} />
      <Path d="M170,396 Q172,388 186,386 L214,386 L178,520 L168,520 Z" fill={coat.light} />

      {/* camisa azul entre as lapelas */}
      <Path d="M224,380 L280,380 L272,662 L232,662 Z" fill={blue.base} />
      <Path d="M262,380 L280,380 L272,662 L258,662 Z" fill={blue.shade} />

      {/* lapelas */}
      <Path d="M214,380 L252,452 L232,470 L198,388 Z" fill={coat.light} />
      <Path d="M290,380 L252,452 L272,470 L306,388 Z" fill={coat.shade} />

      {/* bolsos e botões */}
      <Rect x={176} y={540} width={62} height={54} rx={10} fill="none" stroke={coat.shade} strokeWidth={5} />
      <Rect x={268} y={540} width={62} height={54} rx={10} fill="none" stroke={coat.shade} strokeWidth={5} />
      <Circle cx={290} cy={486} r={7} fill={coat.shade} />
      <Circle cx={290} cy={522} r={7} fill={coat.shade} />

      {/* estetoscópio */}
      <Path
        d="M206,392 Q190,470 214,502 Q234,520 244,494"
        fill="none"
        stroke={stethoscope}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <Path
        d="M298,392 Q320,420 322,452"
        fill="none"
        stroke={stethoscope}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <Circle cx={322} cy={466} r={17} fill={metal.shade} />
      <Circle cx={320} cy={464} r={12} fill={metal.base} />
      <Circle cx={244} cy={494} r={7} fill={stethoscope} />

      <AnimatedG testID="pixel-right-arm" animatedProps={rightArmProps}>
        <Arm {...arms.right} />
      </AnimatedG>

      {/* pescoço */}
      <Rect x={226} y={350} width={52} height={36} rx={10} fill={blue.shade} />

      {/* antena */}
      <Rect x={245} y={96} width={14} height={60} rx={7} fill={blue.shade} />
      <Ellipse cx={252} cy={152} rx={30} ry={12} fill={blue.base} />
      <Circle cx={252} cy={88} r={20} fill={blue.base} />
      <Circle cx={246} cy={82} r={7} fill={blue.light} />

      {/* orelhas */}
      <Circle cx={120} cy={262} r={30} fill={blue.shade} />
      <Circle cx={116} cy={258} r={24} fill={blue.base} />
      <Circle cx={112} cy={252} r={8} fill={blue.light} />
      <Circle cx={388} cy={262} r={30} fill={blue.shade} />
      <Circle cx={392} cy={258} r={20} fill={blue.base} />

      {/* cabeça: base, sombra embaixo à direita, luz em cima à esquerda */}
      <Rect x={124} y={148} width={264} height={214} rx={76} fill={coat.shade} />
      <Rect x={124} y={142} width={256} height={208} rx={74} fill={coat.base} />
      <Path d="M150,236 Q150,166 214,160 L260,160 Q200,176 176,236 Z" fill={coat.light} />

      {/* tela do rosto, com o crescente de luz. O rosto vem do PixelFace. */}
      <Rect
        x={PIXEL_SCREEN_RECT.x}
        y={PIXEL_SCREEN_RECT.y}
        width={PIXEL_SCREEN_RECT.width}
        height={PIXEL_SCREEN_RECT.height}
        rx={38}
        fill={visor.base}
      />
      <Path d={SCREEN_GLINT} fill={visor.light} />
    </Svg>
  );
}
