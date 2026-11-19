import type { DiagramSpec } from './diagramTypes';
import { tuboRaiosX } from './specs/tubo-raios-x';
import { colimadorAbrindo } from './specs/colimador-abrindo';
import { tuboEmitindo } from './specs/tubo-emitindo';
import { feixeAtenuando } from './specs/feixe-atenuando';
import { radiacaoEspalhada } from './specs/radiacao-espalhada';
import { gradeAntidifusora } from './specs/grade-antidifusora';
import { focoEPenumbra } from './specs/foco-e-penumbra';
import { corteTomograficoGirando } from './specs/corte-tomografico-girando';
import { precessaoRm } from './specs/precessao-rm';
import { ecoUltrassom } from './specs/eco-ultrassom';
import { detectorConvertendo } from './specs/detector-convertendo';
import { compressaoMama } from './specs/compressao-mama';
import { inversoDoQuadrado } from './specs/inverso-do-quadrado';
import { blindagemCamadas } from './specs/blindagem-camadas';
import { decaimentoRadioativo } from './specs/decaimento-radioativo';

export const DIAGRAMS: Record<string, DiagramSpec> = {
  [tuboRaiosX.id]: tuboRaiosX,
  [colimadorAbrindo.id]: colimadorAbrindo,
  [tuboEmitindo.id]: tuboEmitindo,
  [feixeAtenuando.id]: feixeAtenuando,
  [radiacaoEspalhada.id]: radiacaoEspalhada,
  [gradeAntidifusora.id]: gradeAntidifusora,
  [focoEPenumbra.id]: focoEPenumbra,
  [corteTomograficoGirando.id]: corteTomograficoGirando,
  [precessaoRm.id]: precessaoRm,
  [ecoUltrassom.id]: ecoUltrassom,
  [detectorConvertendo.id]: detectorConvertendo,
  [compressaoMama.id]: compressaoMama,
  [inversoDoQuadrado.id]: inversoDoQuadrado,
  [blindagemCamadas.id]: blindagemCamadas,
  [decaimentoRadioativo.id]: decaimentoRadioativo,
};

export const DIAGRAM_IDS: readonly string[] = Object.keys(DIAGRAMS);

const PREFIX = 'diagram:';

/** O valor de `imageRef` de uma figura que é diagrama. */
export function diagramRef(id: string): string {
  return `${PREFIX}${id}`;
}

export function parseDiagramRef(ref: string): string | null {
  return ref.startsWith(PREFIX) && ref.length > PREFIX.length ? ref.slice(PREFIX.length) : null;
}
