/** Como a pessoa saiu da apresentação de primeiro uso. */
export type FirstRunExitReason = 'completed' | 'skipped';

export interface FirstRunState {
    /** Quando a apresentação foi vista pela primeira vez. */
    seenAt: number | null;

    /** Quando a pessoa saiu (concluindo ou pulando). */
    exitedAt: number | null;

    /** Concluiu a apresentação ou pulou. */
    exitReason: FirstRunExitReason | null;

    /** Passo em que a pessoa saiu; 1 na bancada atual, 1..3 nos registros anteriores. */
    exitStep: number | null;
}
