import type { HeartsState } from './hearts.types';
import { HeartsService, MAX_HEARTS, REFILL_MIN, REVIEW_REWARD } from './HeartsService';

const AGORA = Date.parse('2026-09-14T12:00:00.000Z');
const AGORA_ISO = '2026-09-14T12:00:00.000Z';
const INTERVALO = 30 * 60 * 1000;

function estado(overrides: Partial<HeartsState> = {}): HeartsState {
    return {
        count: 5,
        lastRefillAt: null,
        unlimitedUntil: null,
        ...overrides,
    };
}

describe('HeartsService', () => {
    it('mantém as constantes aprovadas pela spec', () => {
        expect({ MAX_HEARTS, REFILL_MIN, REVIEW_REWARD }).toEqual({
            MAX_HEARTS: 5,
            REFILL_MIN: 30,
            REVIEW_REWARD: 1,
        });
    });

    it('inicia toda instalação CHEIA e sem relógio', () => {
        expect(HeartsService.initialState()).toEqual(estado());
        expect(HeartsService.getSnapshot(estado(), AGORA)).toEqual({
            count: 5,
            status: 'full',
            nextRefillAt: null,
            unlimitedUntil: null,
        });
    });

    it('o primeiro gasto inicia o relógio', () => {
        expect(HeartsService.spend(estado(), AGORA)).toEqual(estado({
            count: 4,
            lastRefillAt: AGORA_ISO,
        }));
    });

    it('um novo gasto não reinicia o relógio que já corre', () => {
        expect(HeartsService.spend(estado({
            count: 3,
            lastRefillAt: '2026-09-14T11:50:00.000Z',
        }), AGORA)).toEqual(estado({
            count: 2,
            lastRefillAt: '2026-09-14T11:50:00.000Z',
        }));
    });

    it('recupera uma vida por intervalo completo e avança o marco', () => {
        expect(HeartsService.refillByTime(estado({
            count: 1,
            lastRefillAt: '2026-09-14T10:50:00.000Z',
        }), AGORA)).toEqual(estado({
            count: 3,
            lastRefillAt: '2026-09-14T11:50:00.000Z',
        }));
    });

    it('limita a recuperação a cinco e encerra o relógio', () => {
        expect(HeartsService.refillByTime(estado({
            count: 4,
            lastRefillAt: '2026-09-14T11:29:59.000Z',
        }), AGORA)).toEqual(estado());
    });

    it('não dá nem desconta vida quando o relógio volta', () => {
        const futuro = estado({
            count: 2,
            lastRefillAt: '2026-09-14T13:00:00.000Z',
        });

        expect(HeartsService.refillByTime(futuro, AGORA)).toEqual(futuro);
    });

    it('um salto à frente recupera somente até CHEIA', () => {
        expect(HeartsService.refillByTime(estado({
            count: 0,
            lastRefillAt: new Date(AGORA - 99 * INTERVALO).toISOString(),
        }), AGORA)).toEqual(estado());
    });

    it('recompensa uma revisão em uma vida e respeita o teto', () => {
        expect(HeartsService.rewardReview(estado({
            count: 2,
            lastRefillAt: '2026-09-14T11:50:00.000Z',
        }), AGORA)).toEqual(estado({
            count: 3,
            lastRefillAt: '2026-09-14T11:50:00.000Z',
        }));
        expect(HeartsService.rewardReview(estado(), AGORA)).toEqual(estado());
    });

    it('expõe VAZIA sem inventar uma contagem negativa', () => {
        const vazia = estado({ count: 0, lastRefillAt: AGORA_ISO });

        expect(HeartsService.spend(vazia, AGORA)).toEqual(vazia);
        expect(HeartsService.getSnapshot(vazia, AGORA)).toEqual({
            count: 0,
            status: 'empty',
            nextRefillAt: '2026-09-14T12:30:00.000Z',
            unlimitedUntil: null,
        });
    });

    it('assinatura ativa produz ILIMITADA e torna gasto e recompensa no-op', () => {
        const ilimitada = estado({
            count: 0,
            lastRefillAt: '2026-09-14T11:45:00.000Z',
            unlimitedUntil: '2026-10-14T12:00:00.000Z',
        });

        expect(HeartsService.spend(ilimitada, AGORA)).toEqual(ilimitada);
        expect(HeartsService.rewardReview(ilimitada, AGORA)).toEqual(ilimitada);
        expect(HeartsService.getSnapshot(ilimitada, AGORA)).toEqual({
            count: 0,
            status: 'unlimited',
            nextRefillAt: null,
            unlimitedUntil: '2026-10-14T12:00:00.000Z',
        });
    });

    it('confirma assinatura de qualquer estado até a data informada', () => {
        expect(HeartsService.setUnlimited(
            estado({ count: 0, lastRefillAt: AGORA_ISO }),
            '2026-10-14T12:00:00.000Z',
            AGORA,
        )).toEqual(estado({
            count: 0,
            lastRefillAt: AGORA_ISO,
            unlimitedUntil: '2026-10-14T12:00:00.000Z',
        }));
    });

    it('cache offline vale antes da data e vira CHEIA ao expirar ou ser removido', () => {
        const ilimitada = estado({
            count: 1,
            lastRefillAt: '2026-09-14T11:55:00.000Z',
            unlimitedUntil: '2026-09-14T12:30:00.000Z',
        });

        expect(HeartsService.refillByTime(ilimitada, AGORA)).toEqual(ilimitada);
        expect(HeartsService.refillByTime(ilimitada, AGORA + INTERVALO)).toEqual(estado());
        expect(HeartsService.setUnlimited(ilimitada, null, AGORA)).toEqual(estado());
    });
});
