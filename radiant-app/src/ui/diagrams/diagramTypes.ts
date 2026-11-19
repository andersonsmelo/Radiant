// Tipos puros dos diagramas em código. Sem importar pacote: o verificador e a
// fábrica de conteúdo carregam este módulo por `load-app-contract.cjs`.

export type LayerMotion =
  | { kind: 'translate'; dx: number; dy: number }
  | { kind: 'rotate'; degrees: number; cx: number; cy: number }
  | { kind: 'scale'; from: number; to: number; cx: number; cy: number }
  | { kind: 'fade'; from: number; to: number };

// Limite: na tela a camada com movimento é desenhada com folga de uma largura e
// uma altura para cada lado do quadro (`layerFrameSvg`). Geometria a mais de uma
// largura ou altura fora do quadro não entra girando, e o desenho parado
// (`diagramSvgAt`) não tem esse corte.
export type DiagramLayer = {
  /** Miolo de um `<svg>` nas coordenadas `0..width`, `0..height`. */
  svg: string;
  /**
   * `range` [a, b]: a camada só anda no trecho a..b da fração do ciclo e fica parada fora dele.
   * Encadeia fases com um relógio só: o braço desce até 0,5 e espera; o feixe acende de 0,9 a 1.
   * `keys` [tempo, valor]: curva por trechos (acende, segura, apaga) no lugar da rampa linear. O tempo é a
   * fração DEPOIS do modo e do `range` (num `pingpong`, `keys` já vê a ida e a volta dobradas: acender em 0,3
   * acende duas vezes por período); o valor é a fração do movimento. Tempos estritamente crescentes, de 0 a 1. `ease: 'inOut'` suaviza cada trecho (ou a rampa, sem `keys`).
   */
  motion?: LayerMotion & {
    mode: 'loop' | 'pingpong' | 'once';
    phase?: number;
    range?: [number, number];
    keys?: readonly (readonly [at: number, value: number])[];
    ease?: 'linear' | 'inOut';
  };
};

export type DiagramSpec = {
  id: string;
  alt: string;
  width: number;
  height: number;
  layers: DiagramLayer[];
  /** Arte importada (acervo aberto ou gerador externo): réguas próprias, cores livres. */
  art?: 'imported';
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
