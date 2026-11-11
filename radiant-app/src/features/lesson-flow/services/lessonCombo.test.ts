import { COMBO_START, comboLabel, nextCombo, type ComboState } from './lessonCombo';

function responder(respostas: readonly boolean[]): ComboState[] {
    const passos: ComboState[] = [];
    let estado = COMBO_START;
    for (const correta of respostas) {
        estado = nextCombo(estado, correta);
        passos.push(estado);
    }
    return passos;
}

describe('sequência de acertos da aula', () => {
    it('conta os acertos seguidos e marca só a 3ª, a 5ª e a 10ª', () => {
        const passos = responder(Array.from({ length: 11 }, () => true));

        expect(passos.map((passo) => passo.count)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        expect(passos.map((passo) => passo.milestone)).toEqual([null, null, 3, null, 5, null, null, null, null, 10, null]);
    });

    it('um erro zera a contagem, e o marco precisa ser alcançado de novo', () => {
        const passos = responder([true, true, false, true, true, true]);

        expect(passos.map((passo) => passo.count)).toEqual([1, 2, 0, 1, 2, 3]);
        expect(passos.map((passo) => passo.milestone)).toEqual([null, null, null, null, null, 3]);
    });

    it('errar logo depois de um marco não carrega o selo para o erro', () => {
        expect(responder([true, true, true, false]).at(-1)).toEqual({ count: 0, milestone: null });
    });

    it('não muda o estado recebido', () => {
        const estado = { count: 2, milestone: null };
        nextCombo(estado, true);
        expect(estado).toEqual({ count: 2, milestone: null });
    });

    it('o selo diz quantas foram, por extenso curto', () => {
        expect([3, 5, 10].map((marco) => comboLabel(marco as 3 | 5 | 10))).toEqual(['3 seguidas', '5 seguidas', '10 seguidas']);
    });
});
