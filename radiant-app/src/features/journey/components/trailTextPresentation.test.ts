import { trailColumnText } from './trailTextPresentation';

// A remoção dos pontos linguísticos ou da quebra entre componentes de data
// deixa palavras/datas sem a oportunidade de quebra da alternativa A.
it.each([
  ['Princípios de Tomografia Computadorizada', 'Prin\u00adcí\u00adpios de To\u00admo\u00adgra\u00adfi\u00ada Com\u00adpu\u00adta\u00addo\u00adri\u00adza\u00adda'],
  ['Revisar Princípios de Tomografia Computadorizada', 'Revisar Prin\u00adcí\u00adpios de To\u00admo\u00adgra\u00adfi\u00ada Com\u00adpu\u00adta\u00addo\u00adri\u00adza\u00adda'],
  ['Revisar Interação das radiações e proteção radiológica', 'Revisar In\u00adte\u00adra\u00adção das ra\u00addi\u00ada\u00adções e pro\u00adte\u00adção ra\u00addi\u00ado\u00adló\u00adgi\u00adca'],
  ['Revisar Aplicações radioisotópicas e medicina nuclear', 'Revisar A\u00adpli\u00adca\u00adções ra\u00addi\u00ado\u00adi\u00adso\u00adtó\u00adpi\u00adcas e me\u00addi\u00adci\u00adna nu\u00adcle\u00adar'],
  ['Disponível em 24/10/2026 às 06:20', 'Dis\u00adpo\u00adní\u00advel em 24/\u200b10/\u200b2026 às 06:20'],
])('oferece pontos de quebra conferidos sem mudar o conteúdo: %s', (source, visual) => {
  expect(trailColumnText(source)).toBe(visual);
  expect(trailColumnText(source).replace(/[\u00ad\u200b]/gu, '')).toBe(source);
});

it('preserva caixa, acentos, espaços e pontuação originais', () => {
  const source = '  TOMOGRAFIA, computadorizada! RadIoLóGiCa?\nXyzzylongo  ';
  expect(trailColumnText(source)).toBe('  TO\u00adMO\u00adGRA\u00adFI\u00adA, com\u00adpu\u00adta\u00addo\u00adri\u00adza\u00adda! Ra\u00addI\u00ado\u00adLó\u00adGi\u00adCa?\nXyzzylongo  ');
  expect(trailColumnText(source).replace(/[\u00ad\u200b]/gu, '')).toBe(source);
});

it.each(['', 'L1: kV/mAs — 100%!', 'Desconhecidíssima', 'Disponi\u0301vel'])('não inventa sílabas em palavras desconhecidas: %s', source => {
  expect(trailColumnText(source)).toBe(source.replace(/\//gu, '/\u200b'));
});

it('a reapresentação não duplica pontos discricionários', () => {
  const visual = 'Dis\u00adpo\u00adní\u00advel em 24/\u200b10/\u200b2026 às 06:20';
  expect(trailColumnText(visual)).toBe(visual);
});

it.each([
  ['acessórios', 'a|ces|só|rios'], ['alimentos', 'a|li|men|tos'], ['aplicações', 'a|pli|ca|ções'],
  ['atividade', 'a|ti|vi|da|de'], ['componentes', 'com|po|nen|tes'], ['consolidados', 'con|so|li|da|dos'],
  ['convencional', 'con|ven|ci|o|nal'], ['descoberta', 'des|co|ber|ta'],
  ['equipamento', 'e|qui|pa|men|to'], ['equipamentos', 'e|qui|pa|men|tos'],
  ['especializações', 'es|pe|ci|a|li|za|ções'], ['estrutura', 'es|tru|tu|ra'],
  ['fundamentos', 'fun|da|men|tos'], ['irradiação', 'ir|ra|di|a|ção'],
  ['magnética', 'mag|né|ti|ca'], ['mamografia', 'ma|mo|gra|fi|a'],
  ['modalidades', 'mo|da|li|da|des'], ['partículas', 'par|tí|cu|las'],
  ['preservação', 'pre|ser|va|ção'], ['processamento', 'pro|ces|sa|men|to'],
  ['produção', 'pro|du|ção'], ['profissão', 'pro|fis|são'], ['propriedades', 'pro|pri|e|da|des'],
  ['qualidade', 'qua|li|da|de'], ['radiação', 'ra|di|a|ção'],
  ['radioatividade', 'ra|di|o|a|ti|vi|da|de'], ['radiografia', 'ra|di|o|gra|fi|a'],
  ['radiográfico', 'ra|di|o|grá|fi|co'], ['radiologia', 'ra|di|o|lo|gi|a'],
  ['radiológicos', 'ra|di|o|ló|gi|cos'], ['radioterapia', 'ra|di|o|te|ra|pi|a'],
  ['ressonância', 'res|so|nân|cia'],
])('cobre as outras palavras extensas do catálogo atual: %s', (source, segmented) => {
  expect(trailColumnText(source)).toBe(segmented.replace(/\|/gu, '\u00ad'));
  expect(trailColumnText(source).replace(/\u00ad/gu, '')).toBe(source);
});
