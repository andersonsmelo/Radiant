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
import { salaComRiscos } from './specs/sala-com-riscos';
import { inversoDoQuadrado } from './specs/inverso-do-quadrado';
import { blindagemCamadas } from './specs/blindagem-camadas';
import { decaimentoRadioativo } from './specs/decaimento-radioativo';
import { conferenciaDeIdentidade } from './specs/conferencia-de-identidade';
import { transferenciaMacaMesa } from './specs/transferencia-maca-mesa';
import { pontosDeContatoDaSala } from './specs/pontos-de-contato-da-sala';
import { itensDeEmergenciaDaSala } from './specs/itens-de-emergencia-da-sala';
import { circuitoDoGerador } from './specs/circuito-do-gerador';
import { retificacaoDeOnda } from './specs/retificacao-de-onda';
import { anodoGiratorio } from './specs/anodo-giratorio';
import { espectroDeRaiosX } from './specs/espectro-de-raios-x';
import { esqueletoAxialApendicular } from './specs/esqueleto-axial-apendicular';
import { ossoLongo } from './specs/osso-longo';
import { colunaRegioes } from './specs/coluna-regioes';
import { articulacaoSinovial } from './specs/articulacao-sinovial';
import { marcosDeSuperficie } from './specs/marcos-de-superficie';
import { respiracaoDiafragma } from './specs/respiracao-diafragma';
import { circulacaoDupla } from './specs/circulacao-dupla';
import { tratoDigestivo } from './specs/trato-digestivo';
import { sistemaUrinario } from './specs/sistema-urinario';
import { sistemaNervoso } from './specs/sistema-nervoso';
import { danoAoDna } from './specs/dano-ao-dna';
import { grandezasDeDose } from './specs/grandezas-de-dose';
import { dosimetroNoCorpo } from './specs/dosimetro-no-corpo';
import { produtoDoseArea } from './specs/produto-dose-area';
import { histogramaELut } from './specs/histograma-e-lut';
import { realceESuavizacao } from './specs/realce-e-suavizacao';
import { monitorEPadraoDeTeste } from './specs/monitor-e-padrao-de-teste';
import { fluxoRisPacs } from './specs/fluxo-ris-pacs';
import { compressaoDeImagem } from './specs/compressao-de-imagem';
import { radiografiaRoteiro } from './specs/radiografia-roteiro';
import { artefatosDeObjeto } from './specs/artefatos-de-objeto';
import { artefatosDoDetector } from './specs/artefatos-do-detector';

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
  [salaComRiscos.id]: salaComRiscos,
  [inversoDoQuadrado.id]: inversoDoQuadrado,
  [blindagemCamadas.id]: blindagemCamadas,
  [decaimentoRadioativo.id]: decaimentoRadioativo,
  [conferenciaDeIdentidade.id]: conferenciaDeIdentidade,
  [transferenciaMacaMesa.id]: transferenciaMacaMesa,
  [pontosDeContatoDaSala.id]: pontosDeContatoDaSala,
  [itensDeEmergenciaDaSala.id]: itensDeEmergenciaDaSala,
  [circuitoDoGerador.id]: circuitoDoGerador,
  [retificacaoDeOnda.id]: retificacaoDeOnda,
  [anodoGiratorio.id]: anodoGiratorio,
  [espectroDeRaiosX.id]: espectroDeRaiosX,
  [esqueletoAxialApendicular.id]: esqueletoAxialApendicular,
  [ossoLongo.id]: ossoLongo,
  [colunaRegioes.id]: colunaRegioes,
  [articulacaoSinovial.id]: articulacaoSinovial,
  [marcosDeSuperficie.id]: marcosDeSuperficie,
  [respiracaoDiafragma.id]: respiracaoDiafragma,
  [circulacaoDupla.id]: circulacaoDupla,
  [tratoDigestivo.id]: tratoDigestivo,
  [sistemaUrinario.id]: sistemaUrinario,
  [sistemaNervoso.id]: sistemaNervoso,
  [danoAoDna.id]: danoAoDna,
  [grandezasDeDose.id]: grandezasDeDose,
  [dosimetroNoCorpo.id]: dosimetroNoCorpo,
  [produtoDoseArea.id]: produtoDoseArea,
  [histogramaELut.id]: histogramaELut,
  [realceESuavizacao.id]: realceESuavizacao,
  [monitorEPadraoDeTeste.id]: monitorEPadraoDeTeste,
  [fluxoRisPacs.id]: fluxoRisPacs,
  [compressaoDeImagem.id]: compressaoDeImagem,
  [radiografiaRoteiro.id]: radiografiaRoteiro,
  [artefatosDeObjeto.id]: artefatosDeObjeto,
  [artefatosDoDetector.id]: artefatosDoDetector,
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
