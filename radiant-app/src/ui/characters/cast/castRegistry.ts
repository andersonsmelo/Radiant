import type { LessonCastId } from '../../../types/learningActivity';
import { pixelColors } from '../../theme';

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
 * Tons dos retratos. Roupa clara e azul vêm do Pixel, para o elenco pertencer
 * ao mesmo mundo; pele e cabelo não existem em outro lugar do tema e nascem
 * aqui, uma vez. Cada material tem base e sombra, com a luz de cima à esquerda.
 */
export const CAST_TONES: Record<CastPortraitId, {
    skin: string; skinShade: string; hair: string; hairShade: string; clothing: string; clothingShade: string;
}> = {
    // Jaleco branco, cabelo escuro preso em coque.
    lia: { skin: '#B9785A', skinShade: '#9C5F44', hair: '#2B2230', hairShade: '#1C161F', clothing: pixelColors.coat.base, clothingShade: pixelColors.coat.shade },
    // Pijama cirúrgico azul, cabelo curto.
    caio: { skin: '#E3B08C', skinShade: '#C98F6B', hair: '#4A3426', hairShade: '#33231A', clothing: pixelColors.blue.shade, clothingShade: '#2C66B8' },
    // Moletom verde-água, cabelo cacheado cheio.
    duda: { skin: '#8C5A3C', skinShade: '#74472E', hair: '#C2562E', hairShade: '#9B3F1F', clothing: '#2FA39A', clothingShade: '#1F7F78' },
    // Avental hospitalar claro, cabelo grisalho só nas laterais.
    paciente: { skin: '#D9A382', skinShade: '#BD8565', hair: '#C9CED8', hairShade: '#A3AABB', clothing: '#A9D2FF', clothingShade: '#7FB4EA' },
};
