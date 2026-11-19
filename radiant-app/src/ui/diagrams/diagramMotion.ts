import type { DiagramLayer, DiagramSpec, LayerState } from './diagramTypes';

/** Fração 0..1 do ciclo da camada: dente de serra (`loop`) ou triângulo (`pingpong`). */
function fractionAt(motion: NonNullable<DiagramLayer['motion']>, progress: number): number {
  'worklet';
  const t = (((progress + (motion.phase ?? 0)) % 1) + 1) % 1;
  return motion.mode === 'pingpong' ? 1 - Math.abs(2 * t - 1) : t;
}

/** Estado da camada no progresso dado. Roda no thread de UI (worklet). */
export function layerStateAt(motion: DiagramLayer['motion'], progress: number): LayerState {
  'worklet';
  if (!motion) return { translateX: 0, translateY: 0, rotateDeg: 0, scale: 1, opacity: 1 };
  const f = fractionAt(motion, progress);
  const state = { translateX: 0, translateY: 0, rotateDeg: 0, scale: 1, opacity: 1 };
  if (motion.kind === 'translate') {
    state.translateX = motion.dx * f;
    state.translateY = motion.dy * f;
  } else if (motion.kind === 'rotate') {
    state.rotateDeg = motion.degrees * f;
  } else if (motion.kind === 'scale') {
    state.scale = motion.from + (motion.to - motion.from) * f;
  } else {
    state.opacity = motion.from + (motion.to - motion.from) * f;
  }
  return state;
}

const n = (value: number) => Number(value.toFixed(3));

function layerSvgAt(layer: DiagramLayer, progress: number): string {
  const { motion } = layer;
  if (!motion) return layer.svg;
  const s = layerStateAt(motion, progress);
  if (motion.kind === 'fade') return `<g opacity="${n(s.opacity)}">${layer.svg}</g>`;
  if (motion.kind === 'translate') return `<g transform="translate(${n(s.translateX)} ${n(s.translateY)})">${layer.svg}</g>`;
  if (motion.kind === 'rotate') return `<g transform="rotate(${n(s.rotateDeg)} ${motion.cx} ${motion.cy})">${layer.svg}</g>`;
  return `<g transform="translate(${motion.cx} ${motion.cy}) scale(${n(s.scale)}) translate(${-motion.cx} ${-motion.cy})">${layer.svg}</g>`;
}

/** O `<svg>` completo daquele instante, para o quadro parado e para o script de revisão. */
export function diagramSvgAt(spec: DiagramSpec, progress: number): string {
  const body = spec.layers.map((layer) => layerSvgAt(layer, progress)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${spec.width} ${spec.height}" width="${spec.width}" height="${spec.height}">${body}</svg>`;
}

/** Camadas contíguas sem movimento viram um bloco só; cada camada móvel fica sozinha. */
export function groupLayers(layers: DiagramLayer[]): DiagramLayer[][] {
  const groups: DiagramLayer[][] = [];
  for (const layer of layers) {
    const last = groups[groups.length - 1];
    if (!layer.motion && last && !last[0].motion) last.push(layer);
    else groups.push([layer]);
  }
  return groups;
}

/** O `<svg>` de uma camada móvel, com folga de uma largura e uma altura de cada lado. */
export function layerFrameSvg(spec: DiagramSpec, layer: DiagramLayer): string {
  const { width: w, height: h } = spec;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-w} ${-h} ${3 * w} ${3 * h}">${layer.svg}</svg>`;
}

/** Origem da transformação, em porcentagem da view ampliada (3 larguras por 3 alturas). */
export function layerOrigin(motion: DiagramLayer['motion'], width: number, height: number) {
  const cx = motion && (motion.kind === 'rotate' || motion.kind === 'scale') ? motion.cx : width / 2;
  const cy = motion && (motion.kind === 'rotate' || motion.kind === 'scale') ? motion.cy : height / 2;
  return { x: ((cx + width) / (3 * width)) * 100, y: ((cy + height) / (3 * height)) * 100 };
}

/** Estilo da view ampliada no progresso dado; a translação sai em porcentagem dela. Worklet. */
export function layerStyleAt(motion: DiagramLayer['motion'], progress: number, width: number, height: number) {
  'worklet';
  const s = layerStateAt(motion, progress);
  return {
    opacity: s.opacity,
    translateXPercent: (s.translateX / (3 * width)) * 100,
    translateYPercent: (s.translateY / (3 * height)) * 100,
    rotateDeg: s.rotateDeg,
    scale: s.scale,
  };
}
