import { resolveNextReviewInDays } from './nextReviewInDays';

const DAY_MS = 24 * 60 * 60 * 1000;
const answeredAt = new Date('2026-09-24T14:00:00.000Z');

/** O cartão que o SM-2 carimba com o próprio relógio, `skewMs` depois da resposta. */
function stampedCard(intervalDays: number, skewMs: number) {
    const lastReviewedAt = new Date(answeredAt.getTime() + skewMs);
    return {
        lastReviewedAt,
        nextReviewAt: new Date(lastReviewedAt.getTime() + intervalDays * DAY_MS),
    };
}

describe('resolveNextReviewInDays', () => {
    it('anuncia 1 dia para a revisão de 24 h carimbada 1 ms depois da resposta (defeito 2 do E2E)', () => {
        expect(resolveNextReviewInDays(stampedCard(1, 1), answeredAt)).toBe(1);
    });

    it('não converte a demora do armazenamento num dia a mais', () => {
        expect(resolveNextReviewInDays(stampedCard(1, 800), answeredAt)).toBe(1);
        expect(resolveNextReviewInDays(stampedCard(6, 3), answeredAt)).toBe(6);
    });

    it('arredonda para cima quando o cartão não foi carimbado por esta resposta', () => {
        const card = {
            lastReviewedAt: new Date(answeredAt.getTime() - 5 * DAY_MS),
            nextReviewAt: new Date(answeredAt.getTime() + 1.25 * DAY_MS),
        };

        expect(resolveNextReviewInDays(card, answeredAt)).toBe(2);
    });

    it('não anuncia dias negativos para cartão já vencido', () => {
        const card = {
            lastReviewedAt: new Date(answeredAt.getTime() - 5 * DAY_MS),
            nextReviewAt: new Date(answeredAt.getTime() - DAY_MS),
        };

        expect(resolveNextReviewInDays(card, answeredAt)).toBe(0);
    });
});
