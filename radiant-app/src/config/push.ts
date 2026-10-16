import { readBooleanFlag } from './contracts';

export const PushConfig = {
    ENABLE_PUSH: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_PUSH, true),
    // Ligado em 2026-10-16 por decisão do dono (ADR do dia). Até então o
    // serviço só registrava a intenção e nenhum lembrete chegava ao aluno.
    PUSH_SHADOW_MODE: false,
    PUSH_WINDOW_START_HOUR: 18, // local time
    PUSH_WINDOW_END_HOUR: 21,   // local time
};
