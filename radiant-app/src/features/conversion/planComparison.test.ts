import { HeartsService, MAX_HEARTS, REFILL_MIN, REVIEW_REWARD } from '../hearts/HeartsService';
import { planComparison } from './planComparison';

describe('planComparison', () => {
    const rows = planComparison();
    const row = (label: string) => rows.find(r => r.label === label);

    it('tem só a linha em que os planos diferem: vidas', () => {
        expect(rows.map(r => r.label)).toEqual(['Vidas']);
        for (const r of rows) {
            expect(r.free.trim()).not.toBe('');
            expect(r.plus.trim()).not.toBe('');
        }
    });

    it('a linha das vidas difere entre os planos e cita as regras do código', () => {
        const vidas = row('Vidas')!;
        expect(vidas.free).not.toBe(vidas.plus);
        // Validade: os números vêm das constantes das vidas, não de texto solto.
        expect(vidas.free).toContain(String(MAX_HEARTS));
        expect(vidas.free).toContain(`${REFILL_MIN} min`);
        expect(vidas.plus).toBe('Sem limite');
    });

    it('não promete que todo erro gasta vida: revisão nunca gasta (LessonFlowScreen, costsHeart)', () => {
        const vidas = row('Vidas')!.free;
        expect(vidas).not.toMatch(/cada erro gasta/i);
        expect(vidas).toMatch(/revisão nunca gasta/i);
    });

    // Guarda de comportamento: os números do texto valem nas regras, e não só no texto.
    it('os números do texto são os que as regras de vidas aplicam', () => {
        const t0 = Date.parse('2026-11-15T12:00:00.000Z');
        const cheia = HeartsService.initialState();
        expect(cheia.count).toBe(MAX_HEARTS);
        const depoisDoErro = HeartsService.spend(cheia, t0);
        expect(depoisDoErro.count).toBe(MAX_HEARTS - 1);
        expect(HeartsService.refillByTime(depoisDoErro, t0 + REFILL_MIN * 60_000 - 1).count).toBe(MAX_HEARTS - 1);
        expect(HeartsService.refillByTime(depoisDoErro, t0 + REFILL_MIN * 60_000).count).toBe(MAX_HEARTS);
        const duas = HeartsService.spend(HeartsService.spend(depoisDoErro, t0), t0);
        expect(HeartsService.rewardReview(duas, t0).count).toBe(duas.count + REVIEW_REWARD);
    });
});
