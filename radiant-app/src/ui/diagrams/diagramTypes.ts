// Tipos puros dos diagramas em código. Sem importar pacote: o verificador e a
// fábrica de conteúdo carregam este módulo por `load-app-contract.cjs`.

export type LayerMotion =
  | { kind: 'translate'; dx: number; dy: number }
  | { kind: 'rotate'; degrees: number; cx: number; cy: number }
  | { kind: 'scale'; from: number; to: number; cx: number; cy: number }
  | { kind: 'fade'; from: number; to: number };

export type DiagramLayer = {
  /** Miolo de um `<svg>` nas coordenadas `0..width`, `0..height`. */
  svg: string;
  motion?: LayerMotion & { mode: 'loop' | 'pingpong'; phase?: number };
};

export type DiagramSpec = {
  id: string;
  alt: string;
  width: number;
  height: number;
  layers: DiagramLayer[];
  /** Presente quer dizer laço. */
  periodMs?: number;
  /** Progresso (0 a 1) do quadro parado. */
  posterAt?: number;
};

export type LayerState = {
  translateX: number;
  translateY: number;
  rotateDeg: number;
  scale: number;
  opacity: number;
};
