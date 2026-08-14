import type { LearningTrack } from '../../content/content.types';
import {
    resolveActiveTrackId,
    resolveTrackAccess,
    sortTracks,
} from './JourneyTrackUnlockService';

function track(id: string, order?: number): LearningTrack {
    return {
        id,
        slug: id,
        title: id,
        description: '',
        lessonIds: [],
        ...(order === undefined ? {} : { order }),
    };
}

const TRILHAS = [track('a', 1), track('b', 2), track('c', 3)];

describe('sortTracks', () => {
    it('ordena por `order` declarado, ignorando a posição no array', () => {
        const embaralhado = [track('c', 3), track('a', 1), track('b', 2)];

        expect(sortTracks(embaralhado).map((t) => t.id)).toEqual(['a', 'b', 'c']);
    });

    it('cai na posição do array quando nenhuma trilha declara `order`', () => {
        // É o caso do payload remoto que não conhece o campo: a ordem do array
        // é a única informação de sequência disponível, e descartá-la deixaria
        // o percurso sem ordem nenhuma.
        const semOrdem = [track('x'), track('y'), track('z')];

        expect(sortTracks(semOrdem).map((t) => t.id)).toEqual(['x', 'y', 'z']);
    });

    it('põe as trilhas com `order` antes das sem, para um catálogo parcial não intercalar', () => {
        const misto = [track('sem-ordem'), track('segunda', 2), track('primeira', 1)];

        expect(sortTracks(misto).map((t) => t.id)).toEqual(['primeira', 'segunda', 'sem-ordem']);
    });
});

describe('resolveTrackAccess', () => {
    it('abre a primeira trilha mesmo sem nada concluído, senão não há por onde começar', () => {
        const acesso = resolveTrackAccess(TRILHAS, new Set());

        expect(acesso.map((e) => e.unlocked)).toEqual([true, false, false]);
    });

    it('abre a seguinte quando a ANTERIOR termina, e não quando qualquer uma termina', () => {
        // Esta é a diferença entre um percurso em linha e um conjunto solto:
        // concluir a trilha 1 abre a 2, e só a 2.
        const acesso = resolveTrackAccess(TRILHAS, new Set(['a']));

        expect(acesso.map((e) => e.unlocked)).toEqual([true, true, false]);
    });

    it('não abre a terceira quando a segunda foi pulada', () => {
        // Se `c` abrisse porque `a` terminou, o cadeado não seria sequencial —
        // seria só um atraso na primeira trilha.
        const acesso = resolveTrackAccess(TRILHAS, new Set(['a', 'c']));

        expect(acesso.find((e) => e.trackId === 'c')?.unlocked).toBe(false);
    });

    it('mantém aberta a trilha já concluída, porque o cadeado impede pular, não voltar', () => {
        const acesso = resolveTrackAccess(TRILHAS, new Set(['a', 'b']));
        const primeira = acesso.find((e) => e.trackId === 'a');

        expect(primeira?.completed).toBe(true);
        expect(primeira?.unlocked).toBe(true);
    });

    it('devolve lista vazia para catálogo vazio, sem estourar', () => {
        expect(resolveTrackAccess([], new Set())).toEqual([]);
    });
});

describe('resolveActiveTrackId', () => {
    it('aponta para a primeira trilha aberta que ainda não terminou', () => {
        expect(resolveActiveTrackId(TRILHAS, new Set(['a']))).toBe('b');
    });

    it('começa na primeira quando nada foi concluído', () => {
        expect(resolveActiveTrackId(TRILHAS, new Set())).toBe('a');
    });

    it('devolve a última quando o curso inteiro terminou, e não null', () => {
        // O app precisa de uma trilha para exibir. Quem concluiu tudo deve
        // continuar vendo o que fez, não uma tela vazia — o fato "curso
        // concluído" fica explícito em resolveTrackAccess, para quem precisar.
        expect(resolveActiveTrackId(TRILHAS, new Set(['a', 'b', 'c']))).toBe('c');
    });

    it('devolve null só quando não existe trilha nenhuma', () => {
        expect(resolveActiveTrackId([], new Set())).toBeNull();
    });
});
