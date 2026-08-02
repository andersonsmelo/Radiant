/** Como a pessoa saiu da apresentação de primeiro uso. */
export type FirstRunExitReason = 'completed' | 'skipped';

export interface FirstRunState {
    /** Quando a apresentação foi vista pela primeira vez. */
    seenAt: number | null;

    /** Quando a pessoa saiu (concluindo ou pulando). */
    exitedAt: number | null;

    /** Concluiu as três telas ou pulou. */
    exitReason: FirstRunExitReason | null;

    /** Em qual tela (1..3) a pessoa saiu. Mede a cópia. */
    exitStep: number | null;
}
