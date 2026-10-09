import type { HeartsSnapshot } from './hearts.types';
import { heartLossAnnouncement } from './heartLossAnnouncement';

function vidas(count: number, status: HeartsSnapshot['status']): HeartsSnapshot {
    return { count, status, nextRefillAt: null, unlimitedUntil: null };
}

describe('heartLossAnnouncement', () => {
    it('diz quantas vidas restam quando o contador cai', () => {
        expect(heartLossAnnouncement(vidas(5, 'full'), vidas(4, 'recovering')))
            .toBe('Você perdeu uma vida; restam 4.');
    });

    it('diz que foi a última quando o contador chega a zero', () => {
        expect(heartLossAnnouncement(vidas(1, 'recovering'), vidas(0, 'empty')))
            .toBe('Você perdeu sua última vida.');
    });

    it('não diz nada ao assinante, que não perde vida', () => {
        expect(heartLossAnnouncement(vidas(5, 'unlimited'), vidas(5, 'unlimited'))).toBeNull();
        // A assinatura preserva a contagem: quem assinou com zero segue em zero,
        // e a queda aparente contra o padrão de 5 não é perda.
        expect(heartLossAnnouncement(vidas(5, 'full'), vidas(0, 'unlimited'))).toBeNull();
    });

    it('não diz nada quando o contador não cai', () => {
        expect(heartLossAnnouncement(vidas(0, 'empty'), vidas(0, 'empty'))).toBeNull();
    });
});
