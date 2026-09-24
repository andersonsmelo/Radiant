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

/**
 * Onde o landmark aparece no quadro, em pixels, depois das transformações do
 * canvas. O `Animated.View` recebe `[escala, scaleX, rotate]` e, como no CSS, o
 * ponto é girado primeiro e espelhado depois, sempre em torno do centro. O
 * canvas tem a largura do aparelho e a altura do quadro, então a largura entra
 * como parâmetro.
 */
export function landmarkScreenPoint(landmarkId: string, posture: BodyPosture, perspective: BodyPerspective, frameWidth: number): ScreenPoint {
  const [canvasX, canvasY] = LANDMARK_POSITIONS[landmarkId] ?? FALLBACK_POSITION;
  const x = (canvasX / CANVAS.width) * frameWidth;
  const y = (canvasY / CANVAS.height) * FRAME_HEIGHT;
  const originX = frameWidth / 2;
  const originY = FRAME_HEIGHT / 2;
  const angle = rotationRadians(posture);
  const rotatedX = originX + (x - originX) * Math.cos(angle) - (y - originY) * Math.sin(angle);
  const rotatedY = originY + (x - originX) * Math.sin(angle) + (y - originY) * Math.cos(angle);
  return { x: perspective === 'back' ? 2 * originX - rotatedX : rotatedX, y: rotatedY };
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
