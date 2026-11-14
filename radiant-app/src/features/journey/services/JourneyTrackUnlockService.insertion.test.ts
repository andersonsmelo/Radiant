import type { LearningTrack } from '../../content/content.types';
import { resolveActiveTrackId, resolveTrackAccess } from './JourneyTrackUnlockService';

/**
 * Unidade inserida no meio do percurso de um app já em produção (F1 da 1.6).
 * Regra decidida em `docs/evidence/2026-11-13-rtg-2026-expansao/motor.md`:
 * quem tem progresso não é bloqueado nem puxado de volta; o aluno novo segue a
 * ordem estrita, com a unidade nova no lugar dela.
 */

function track(id: string): LearningTrack {
    return { id, slug: id, title: id, description: '', lessonIds: [] };
}

const ORDEM = ['m01', 'm02', 'm03', 'nova', 'm04', 'm05', 'm06', 'm07'];
const TRILHAS = ORDEM.map(track);

function abertas(concluidas: string[], iniciadas: string[] = concluidas): Record<string, boolean> {
    return Object.fromEntries(
        resolveTrackAccess(TRILHAS, new Set(concluidas), new Set(iniciadas))
            .map((entry) => [entry.trackId, entry.unlocked]),
    );
}

function ativa(concluidas: string[], iniciadas: string[] = concluidas): string | null {
    return resolveActiveTrackId(TRILHAS, new Set(concluidas), new Set(iniciadas));
}

describe('unidade inserida no meio do percurso', () => {
    it('(1) trilha concluída continua aberta depois da inserção', () => {
        const concluidas = ['m01', 'm02', 'm03', 'm04', 'm05'];
        const acesso = abertas(concluidas);

        expect(acesso.m04).toBe(true);
        expect(acesso.m05).toBe(true);
        // Validade, não só diferença: a seguinte à última concluída abre pela
        // regra antiga, e a depois dela continua fechada.
        expect(acesso.m06).toBe(true);
        expect(acesso.m07).toBe(false);
    });

    it('(2) trilha em andamento logo após o ponto de inserção continua aberta e ativa', () => {
        const concluidas = ['m01', 'm02', 'm03'];
        const iniciadas = [...concluidas, 'm04'];

        expect(abertas(concluidas, iniciadas).m04).toBe(true);
        expect(abertas(concluidas, iniciadas).m05).toBe(false);
        expect(ativa(concluidas, iniciadas)).toBe('m04');
    });

    it('(3) aluno adiante não é bloqueado, e a inserida abre sem virar a ativa', () => {
        const concluidas = ['m01', 'm02', 'm03', 'm04', 'm05', 'm06'];
        const iniciadas = [...concluidas, 'm07'];
        const acesso = abertas(concluidas, iniciadas);

        expect(acesso.nova).toBe(true);
        expect(acesso.m07).toBe(true);
        expect(ativa(concluidas, iniciadas)).toBe('m07');
    });

    it('(4) quem concluiu tudo menos a inserida recebe a inserida como recomendação', () => {
        // Nada adiante da iniciada mais distante resta; cair na última trilha,
        // já concluída, deixaria o aluno sem recomendação com a inserida por fazer.
        const concluidas = ORDEM.filter((id) => id !== 'nova');

        expect(abertas(concluidas).nova).toBe(true);
        expect(ativa(concluidas)).toBe('nova');
    });

    it('(4b) contraprova: quem está no meio de m06 continua em m06, com a inserida aberta atrás', () => {
        const concluidas = ['m01', 'm02', 'm03', 'm04', 'm05'];
        const iniciadas = [...concluidas, 'm06'];

        expect(abertas(concluidas, iniciadas).nova).toBe(true);
        expect(ativa(concluidas, iniciadas)).toBe('m06');
    });

    it('(4c) quem concluiu tudo, a inserida inclusive, fica na última trilha', () => {
        expect(ativa(ORDEM)).toBe('m07');
    });

    it('(5) aluno novo segue a ordem: a inserida vem depois de m03 e m04 espera por ela', () => {
        const ateM03 = ['m01', 'm02', 'm03'];

        expect(abertas(ateM03).nova).toBe(true);
        expect(abertas(ateM03).m04).toBe(false);
        expect(ativa(ateM03)).toBe('nova');

        const comNova = [...ateM03, 'nova'];
        expect(abertas(comNova).m04).toBe(true);
        expect(ativa(comNova)).toBe('m04');
    });

    it('(6) sem o conjunto de iniciadas, cada prefixo se comporta como antes', () => {
        // O comportamento de antes, escrito como fato e não como cópia do código:
        // com o prefixo de k trilhas concluídas, abrem as k+1 primeiras e a
        // ativa é a de índice k (ou a última, quando todas terminaram).
        for (let k = 0; k <= ORDEM.length; k += 1) {
            const concluidas = new Set(ORDEM.slice(0, k));
            const acesso = resolveTrackAccess(TRILHAS, concluidas).map((entry) => entry.unlocked);

            expect(acesso).toEqual(ORDEM.map((_, index) => index <= k));
            expect(resolveActiveTrackId(TRILHAS, concluidas)).toBe(ORDEM[Math.min(k, ORDEM.length - 1)]);
        }
    });
});
