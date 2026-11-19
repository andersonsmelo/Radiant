import type { DiagramLayer, DiagramSpec, LayerState } from './diagramTypes';

/**
 * Fração 0..1 do ciclo da camada: dente de serra (`loop`), triângulo (`pingpong`)
 * ou, em `once`, o próprio progresso sem dar a volta. `once` é para diagrama
 * dirigido por um controle: no valor máximo (progresso 1) o `loop` voltaria ao começo.
 */
/** Suavização inOut (smoothstep): 0 e 1 nos extremos, derivada zero neles. */
function smoothstep(x: number): number {
  'worklet';
  return x * x * (3 - 2 * x);
}

function fractionAt(motion: NonNullable<DiagramLayer['motion']>, progress: number): number {
  'worklet';
  const t = (((progress + (motion.phase ?? 0)) % 1) + 1) % 1;
  const f =
    motion.mode === 'once'
      ? Math.min(1, Math.max(0, progress + (motion.phase ?? 0)))
      : motion.mode === 'pingpong'
        ? 1 - Math.abs(2 * t - 1)
        : t;
  const r = motion.range ? Math.min(1, Math.max(0, (f - motion.range[0]) / (motion.range[1] - motion.range[0]))) : f;
  const keys = motion.keys;
  if (!keys || keys.length < 2) return motion.ease === 'inOut' ? smoothstep(r) : r;
  if (r <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    if (r <= t1) {
      const [t0, v0] = keys[i - 1];
      const local = (r - t0) / (t1 - t0);
      return v0 + (v1 - v0) * (motion.ease === 'inOut' ? smoothstep(local) : local);
    }
  }
  return keys[keys.length - 1][1];
}

/** Erro de `keys` (ordem estrita, tempo e valor de 0 a 1, ao menos duas), ou null. O registro chama isto. */
export function motionKeysError(motion: DiagramLayer['motion']): string | null {
  const keys = motion?.keys;
  if (!keys) return null;
  if (keys.length < 2) return 'keys precisa de ao menos duas chaves';
  for (let i = 0; i < keys.length; i++) {
    const [t, v] = keys[i];
    if (!(t >= 0 && t <= 1 && v >= 0 && v <= 1)) return `keys[${i}] fora de 0 a 1`;
    if (i > 0 && t <= keys[i - 1][0]) return `keys[${i}] fora de ordem crescente`;
  }
  return null;
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
