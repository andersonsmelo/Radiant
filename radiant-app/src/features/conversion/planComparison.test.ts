import { MAX_HEARTS, REFILL_MIN, REVIEW_REWARD } from '../hearts/HeartsService';
import { planComparison } from './planComparison';

describe('planComparison', () => {
    const rows = planComparison();
    const row = (label: string) => rows.find(r => r.label === label);

    it('tem as três linhas, cada uma com texto nos dois planos', () => {
        expect(rows.map(r => r.label)).toEqual(['Aulas, revisões e avaliações', 'Vidas', 'Revisão concluída']);
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
        expect(vidas.plus).toMatch(/ilimitadas/i);
    });

    it('a revisão devolve exatamente a recompensa do código ao gratuito', () => {
        expect(row('Revisão concluída')!.free).toContain(`${REVIEW_REWARD} vida`);
    });

    it('as aulas são iguais nos dois planos: nenhum conteúdo é exclusivo', () => {
        const aulas = row('Aulas, revisões e avaliações')!;
        expect(aulas.free).toBe(aulas.plus);
    });
});
