import type { HeartsSnapshot } from './hearts.types';

/**
 * O que o leitor de tela ouve quando uma resposta errada custa uma vida.
 *
 * Quem enxerga vê o coração mudar no HUD; o leitor de tela precisa ouvir.
 * Segue a queda real do contador, e não a chamada a `spend`: o assinante e quem
 * já está em zero não perdem nada, e não podem ouvir que perderam.
 *
 * Mora aqui, e não em cada tela, porque a lição (FILA, 25) e as avaliações da V2
 * (FILA, 35) dizem a mesma frase, aprovada pelo dono em 2026-09-28. Duas cópias
 * voltariam a divergir.
 */
export function heartLossAnnouncement(before: HeartsSnapshot, after: HeartsSnapshot): string | null {
    if (after.status === 'unlimited' || after.count >= before.count) {
        return null;
    }

    return after.count === 0
        ? 'Você perdeu sua última vida.'
        : `Você perdeu uma vida; restam ${after.count}.`;
}
