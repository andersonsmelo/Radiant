import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findNationalReferences } from './rtg-national-terms.mjs';

const BARRADOS = [
  ['A Lei 12.842/2013 reserva o laudo ao médico.', 'Lei 12.842'],
  ['Veja a Lei nº 7.394.', 'Lei nº 7.394'],
  ['A Lei Brasileira de Inclusão garante o apoio.', 'Lei Brasileira'],
  ['A RDC 611 pede o teste de constância.', 'RDC 611'],
  ['A IN 91 trata da intervencionista.', 'IN 91'],
  ['A Anvisa fiscaliza o serviço.', 'Anvisa'],
  ['A norma CNEN 3.01 fixa o limite.', 'CNEN'],
  ['A ANSN 6.10 trata da radioterapia.', 'ANSN'],
  ['O CONTER regula a profissão.', 'CONTER'],
  ['O CRTR da região fiscaliza.', 'CRTR'],
  ['Parecer do CFM sobre o contraste.', 'CFM'],
  ['A LGPD protege o dado.', 'LGPD'],
  ['Protocolo do Ministério da Saúde.', 'Ministério da Saúde'],
  ['O exame é coberto pelo SUS.', 'SUS'],
  ['A Portaria 453 foi revogada.', 'Portaria 453'],
  ['O Decreto 5.626 trata de Libras.', 'Decreto 5.626'],
  ['A NR-32 trata do serviço de saúde.', 'NR-32'],
  ['Siga a norma regulamentadora.', 'norma regulamentadora'],
  ['O código de ética pede sigilo.', 'código de ética'],
  ['No Brasil se usa D e E.', 'No Brasil'],
  ['A norma brasileira pede a placa.', 'brasileira'],
  ['O tecnólogo brasileiro assina a ficha.', 'brasileiro'],
  ['A Resolução nº 5 do conselho.', 'Resolução nº 5'],
  ['Retome o que a lei exige do consentimento.', 'lei'],
  ['Protocolos alinhados à legislação e ao fabricante.', 'legislação'],
  ['A Política Nacional de Humanização orienta.', 'Política Nacional'],
  ['Apenas à autoridade sanitária, em visita.', 'autoridade sanitária'],
  ['A vigilância sanitária pede o registro.', 'vigilância sanitária'],
  ['Siga as instruções normativas.', 'normativas'],
  // Revisão da tarefa 1: lei citada pelo nome, grafias de número e órgãos fora da lista inicial.
  ['A lei de Libras garante intérprete.', 'lei'],
  ['A lei da profissão define o papel.', 'lei'],
  ['Veja a Lei de Diretrizes e Bases.', 'Lei'],
  ['A Lei n.º 7.394 trata da profissão.', 'Lei n.º 7.394'],
  ['A Lei nº. 7.394 trata da profissão.', 'Lei nº. 7.394'],
  ['A Portaria SVS/MS 453 foi revogada.', 'Portaria SVS/MS 453'],
  ['A RDC-611 pede o teste.', 'RDC-611'],
  ['A IN-91 trata da intervencionista.', 'IN-91'],
  ['A norma NN 3.01 fixa o limite.', 'NN 3.01'],
  ['O Conselho Federal publicou a regra.', 'Conselho Federal'],
  ['O Conselho Regional fiscaliza.', 'Conselho Regional'],
  ['Saiu no Diário Oficial.', 'Diário Oficial'],
  ['A Constituição garante o acesso.', 'Constituição'],
  ['O Código de Defesa do Consumidor vale aqui.', 'Código de Defesa'],
  ['O Estatuto do Idoso dá prioridade.', 'Estatuto do'],
  ['A CLT trata da jornada.', 'CLT'],
  ['A ABNT publica a norma.', 'ABNT'],
  ['O Inmetro verifica o medidor.', 'Inmetro'],
  ['O Ministério do Trabalho fiscaliza.', 'Ministério do Trabalho'],
  ['A Agência Nacional de Saúde regula.', 'Agência Nacional'],
];
const LIBERADOS = [
  'A lei do inverso do quadrado da distância vale aqui.',
  'Pela lei de Ohm, a corrente sobe.',
  'A lei da atenuação exponencial descreve a queda.',
  'A lei de Beer-Lambert descreve a atenuação.',
  'As leis de Newton valem para a mesa.',
  'A lei de Bergonié e Tribondeau relaciona divisão e sensibilidade.',
  'A frequência de Larmor depende do campo.',
  'A susceptibilidade magnética distorce a imagem.',
  'Dizer que é norma e que não cabe discutir.',
  'A posição habitual de um órgão tem exceções.',
  'A resolução espacial piora com o borramento.',
  'O sussurro do paciente foi ouvido.',
  'A fina camada absorve.',
  'O conteúdo da ficha foi conferido.',
  'A ICRP recomenda 20 mSv por ano em média.',
  'A IAEA publica o padrão básico de segurança.',
  'Use 80 kV e 10 mAs em 100 cm.',
];

for (const [frase, trecho] of BARRADOS) {
  test(`barra: ${frase}`, () => assert.deepEqual(findNationalReferences(frase), [trecho]));
}
for (const frase of LIBERADOS) {
  test(`libera: ${frase}`, () => assert.deepEqual(findNationalReferences(frase), []));
}
test('devolve os trechos na ordem em que aparecem', () => {
  assert.deepEqual(findNationalReferences('A Anvisa e a CNEN citam a RDC 611.'), ['Anvisa', 'CNEN', 'RDC 611']);
});
test('valor que não é texto não quebra', () => assert.deepEqual(findNationalReferences(undefined), []));
