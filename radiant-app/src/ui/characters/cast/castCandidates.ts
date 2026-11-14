import type { CastLookId } from './castLooks';

/**
 * Duas vozes propostas para as unidades novas da 1.6 (odontológica e
 * ultrassom), com ficha em `docs/design/2026-11-13-candidatos-de-personagens.md`.
 * NÃO são `LessonCastId`: o contrato da aula é da F2, e a entrada depende da
 * decisão do controlador. Existem aqui para que a arte delas passe pelo mesmo
 * teste de padrão que o elenco publicado.
 */
export type CastCandidate = {
    look: Extract<CastLookId, 'dentista' | 'ultrassom'>;
    displayName: string;
    role: string;
};

export const CAST_CANDIDATES: readonly CastCandidate[] = [
    { look: 'dentista', displayName: 'Dra. Iara', role: 'cirurgiã-dentista da clínica-escola' },
    { look: 'ultrassom', displayName: 'Dr. Ravi', role: 'médico ultrassonografista' },
];
