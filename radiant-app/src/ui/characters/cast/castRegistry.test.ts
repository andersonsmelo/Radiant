import type { LessonCastId } from '../../../types/learningActivity';
import { CAST, CAST_TONES, castSpeakerName } from './castRegistry';

const ELENCO: LessonCastId[] = ['pixel', 'lia', 'caio', 'duda', 'paciente'];

describe('elenco das cenas de diálogo', () => {
    it('tem os cinco personagens do contrato, com nome e papel', () => {
        expect(Object.keys(CAST).sort()).toEqual([...ELENCO].sort());
        expect(ELENCO.map((id) => `${CAST[id].displayName}, ${CAST[id].role}`)).toEqual([
            'Pixel, guia de estudo',
            'Profa. Lia, supervisora de estágio',
            'Caio, tecnólogo do plantão',
            'Duda, colega de turma',
            'Paciente, paciente',
        ]);
    });

    it('o nome da fala vence o do elenco, e nome em branco não apaga quem fala', () => {
        expect(castSpeakerName('paciente', 'Seu Antônio')).toBe('Seu Antônio');
        expect(castSpeakerName('paciente')).toBe('Paciente');
        expect(castSpeakerName('paciente', '   ')).toBe('Paciente');
        expect(castSpeakerName('lia')).toBe('Profa. Lia');
    });

    it('cada retrato tem cabelo e roupa de cor própria, e toda cor é um hexadecimal válido', () => {
        const retratos = Object.values(CAST_TONES);
        expect(new Set(retratos.map((tons) => tons.hair)).size).toBe(retratos.length);
        expect(new Set(retratos.map((tons) => tons.clothing)).size).toBe(retratos.length);
        for (const tons of retratos) {
            for (const cor of Object.values(tons)) expect(cor).toMatch(/^#[0-9A-Fa-f]{6}$/u);
        }
    });
});
