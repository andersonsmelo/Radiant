import type { LessonCastId } from '../../../types/learningActivity';
import { CAST_LOOKS, type CastLook } from './castLooks';

/**
 * Elenco das cenas de diálogo da trilha rtg-2026 (plano de 2026-11-05, I5).
 *
 * `displayName` é o nome que aparece e que o leitor de tela lê antes da fala.
 * O paciente muda a cada cena: a fala traz o nome dele em `name`, e
 * `displayName` é só a reserva.
 */
export const CAST: Record<LessonCastId, { displayName: string; role: string }> = {
    pixel: { displayName: 'Pixel', role: 'guia de estudo' },
    lia: { displayName: 'Profa. Lia', role: 'supervisora de estágio' },
    caio: { displayName: 'Caio', role: 'tecnólogo do plantão' },
    duda: { displayName: 'Duda', role: 'colega de turma' },
    paciente: { displayName: 'Paciente', role: 'paciente' },
};

/** Quem fala: o nome da própria fala vence o do elenco. */
export function castSpeakerName(speaker: LessonCastId, name?: string): string {
    return name?.trim() || CAST[speaker].displayName;
}

export type CastPortraitId = Exclude<LessonCastId, 'pixel'>;

/**
 * Tons dos retratos, lidos da ficha de cada um (`castLooks.ts`). As cores
 * moram em `castColors`, no tema; aqui só se escolhe qual vai onde.
 */
export const CAST_TONES: Record<CastPortraitId, CastLook['tones']> = {
    lia: CAST_LOOKS.lia.tones,
    caio: CAST_LOOKS.caio.tones,
    duda: CAST_LOOKS.duda.tones,
    paciente: CAST_LOOKS.paciente.tones,
};
