import { splitKeyPoint, splitTeachBody } from './teachBody';

describe('splitTeachBody', () => {
    it('uma frase só devolve rest vazio', () => {
        expect(splitTeachBody('O pedido orienta o exame.')).toEqual({ lead: 'O pedido orienta o exame.', rest: '' });
    });
    it('duas frases separam a abertura do resto', () => {
        expect(splitTeachBody('Primeira ideia. Segunda ideia, mais longa.')).toEqual({
            lead: 'Primeira ideia.',
            rest: 'Segunda ideia, mais longa.',
        });
    });
    it('ponto dentro de número não corta', () => {
        const body = 'A Lei 12.842/2013 põe o laudo entre as atividades privativas do médico. Existe ainda a dúvida.';
        expect(splitTeachBody(body)).toEqual({
            lead: 'A Lei 12.842/2013 põe o laudo entre as atividades privativas do médico.',
            rest: 'Existe ainda a dúvida.',
        });
    });
    it('texto vazio devolve os dois vazios', () => {
        expect(splitTeachBody('')).toEqual({ lead: '', rest: '' });
    });
    it('pergunta seguida de frase corta na interrogação', () => {
        expect(splitTeachBody('Quem assina o laudo? Quem o interpretou.')).toEqual({
            lead: 'Quem assina o laudo?',
            rest: 'Quem o interpretou.',
        });
    });
    it('texto sem pontuação final vira só abertura', () => {
        expect(splitTeachBody('Sem ponto final')).toEqual({ lead: 'Sem ponto final', rest: '' });
    });
});

describe('splitKeyPoint', () => {
    it('separa termo e texto, com o texto em maiúscula', () => {
        expect(splitKeyPoint('Tarefa técnica: adquirir a imagem com qualidade.')).toEqual({
            term: 'Tarefa técnica',
            text: 'Adquirir a imagem com qualidade.',
        });
    });
    it('ponto sem dois-pontos devolve term nulo e o texto inteiro', () => {
        expect(splitKeyPoint('Leia o pedido inteiro.')).toEqual({ term: null, text: 'Leia o pedido inteiro.' });
    });
    it('termo terminando em número não corta', () => {
        expect(splitKeyPoint('Às 10: comece')).toEqual({ term: null, text: 'Às 10: comece' });
    });
    it('mais de 40 caracteres antes dos dois-pontos não corta', () => {
        const longo = `${'a'.repeat(41)}: resto`;
        expect(splitKeyPoint(longo)).toEqual({ term: null, text: longo });
    });
    it('exatamente 40 caracteres ainda corta', () => {
        expect(splitKeyPoint(`${'a'.repeat(40)}: resto`)).toEqual({ term: 'a'.repeat(40), text: 'Resto' });
    });
});

describe('splitKeyPoint — conteúdo real', () => {
    it.each([
        'Pedido, faixa, série e registro: quatro passos.',
        'Corrente × tempo = carga: mA × s = mAs.',
    ])('enumeração e fórmula não viram termo: %s', (ponto) => {
        expect(splitKeyPoint(ponto)).toEqual({ term: null, text: ponto });
    });
    it('texto que começa por unidade não é capitalizado', () => {
        expect(splitKeyPoint('Carga: mAs é corrente vezes tempo.')).toEqual({ term: 'Carga', text: 'mAs é corrente vezes tempo.' });
        expect(splitKeyPoint('Tensão: kV muda o contraste.')).toEqual({ term: 'Tensão', text: 'kV muda o contraste.' });
    });
});
