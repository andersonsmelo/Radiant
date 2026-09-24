export type BodyPosture = 'anatomical' | 'supine' | 'prone';
export type BodyPerspective = 'front' | 'back';

/** Viewbox do SVG do mapa. As posições abaixo estão nessas coordenadas. */
export const CANVAS = { width: 240, height: 330 } as const;

/**
 * Onde cada landmark fica no viewBox, antes de girar ou espelhar. Movido sem
 * alteração de `BodyReferenceMap.tsx` em 2026-09-23.
 */
export const LANDMARK_POSITIONS: Readonly<Record<string, readonly [number, number]>> = {
  'patient-left-hand': [184, 162], 'patient-right-hand': [56, 162], 'head-marker': [120, 38], 'foot-marker': [120, 294], 'midline-marker': [120, 150], 'outer-arm-marker': [68, 150], 'shoulder-marker': [83, 116], 'wrist-marker': [53, 183], 'outer-layer': [156, 142], 'inner-layer': [135, 142], 'anterior-thorax': [105, 142], 'posterior-thorax': [140, 142],
};

export const FALLBACK_POSITION: readonly [number, number] = [120, 160];

export function canvasRotation(posture: BodyPosture): '0deg' | '90deg' | '-90deg' {
  return posture === 'anatomical' ? '0deg' : posture === 'supine' ? '90deg' : '-90deg';
}

export function geometryId(posture: BodyPosture, perspective: BodyPerspective): string {
  return `${posture === 'anatomical' ? 'upright' : posture}-${perspective}`;
}

/** Altura do quadro em pixels (`styles.frame.height` do mapa). */
export const FRAME_HEIGHT = 330;

export type ScreenPoint = Readonly<{ x: number; y: number }>;
export type ScreenRegion = 'direita' | 'esquerda' | 'cima' | 'baixo';

function rotationRadians(posture: BodyPosture): number {
  return posture === 'anatomical' ? 0 : posture === 'supine' ? Math.PI / 2 : -Math.PI / 2;
}

/** Diâmetro do marcador tocável (alvo mínimo de 44 pt). */
export const MARKER_SIZE = 44;

export type ScreenBox = Readonly<{ left: number; top: number; right: number; bottom: number }>;

/**
 * Onde o landmark aparece no quadro, em pixels.
 *
 * O canvas tem o tamanho exato do viewBox (240×330) e fica centralizado no
 * quadro, que tem a largura do aparelho e 330 de altura. Assim o SVG não
 * escala nem se desloca em relação aos marcadores — até 2026-09-23 o canvas
 * esticava na largura, o desenho ficava centralizado e os marcadores em
 * porcentagem da largura esticada: o "2" aparecia longe da mão no simulador.
 *
 * O `Animated.View` recebe `[escala, scaleX, rotate]` e, como no CSS, o ponto é
 * girado primeiro e espelhado depois, sempre em torno do centro do canvas.
 */
export function landmarkScreenPoint(landmarkId: string, posture: BodyPosture, perspective: BodyPerspective, frameWidth: number): ScreenPoint {
  const [canvasX, canvasY] = LANDMARK_POSITIONS[landmarkId] ?? FALLBACK_POSITION;
  const dx = canvasX - CANVAS.width / 2;
  const dy = canvasY - CANVAS.height / 2;
  const angle = rotationRadians(posture);
  const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
  const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
  const mirroredX = perspective === 'back' ? -rotatedX : rotatedX;
  return { x: frameWidth / 2 + mirroredX, y: FRAME_HEIGHT / 2 + rotatedY };
}

/** O retângulo que o marcador ocupa no quadro: centrado no ponto do landmark. */
export function markerBounds(landmarkId: string, posture: BodyPosture, perspective: BodyPerspective, frameWidth: number): ScreenBox {
  const { x, y } = landmarkScreenPoint(landmarkId, posture, perspective, frameWidth);
  const half = MARKER_SIZE / 2;
  return { left: x - half, top: y - half, right: x + half, bottom: y + half };
}

export function isBoxInsideFrame(box: ScreenBox, frameWidth: number): boolean {
  return box.left >= 0 && box.right <= frameWidth && box.top >= 0 && box.bottom <= FRAME_HEIGHT;
}

/**
 * Transformação do número do marcador que desfaz a do canvas: sem ela, a vista
 * de costas mostrava "Ƨ" e os decúbitos, o número deitado. Canvas = S·R; rótulo
 * = R⁻¹·S, e o produto é a identidade.
 */
export function labelCounterTransform(posture: BodyPosture, perspective: BodyPerspective): [{ rotate: string }, { scaleX: number }] {
  const rotation = canvasRotation(posture);
  const inverse = rotation === '0deg' ? '0deg' : rotation === '90deg' ? '-90deg' : '90deg';
  return [{ rotate: inverse }, { scaleX: perspective === 'front' ? 1 : -1 }];
}

/** Em que lado do centro do quadro o landmark aparece, pelo eixo dominante. */
export function landmarkScreenRegion(landmarkId: string, posture: BodyPosture, perspective: BodyPerspective, frameWidth: number): ScreenRegion {
  const point = landmarkScreenPoint(landmarkId, posture, perspective, frameWidth);
  const dx = point.x - frameWidth / 2;
  const dy = point.y - FRAME_HEIGHT / 2;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'direita' : 'esquerda';
  return dy >= 0 ? 'baixo' : 'cima';
}

export function isInsideFrame(point: ScreenPoint, frameWidth: number): boolean {
  return point.x >= 0 && point.x <= frameWidth && point.y >= 0 && point.y <= FRAME_HEIGHT;
}
