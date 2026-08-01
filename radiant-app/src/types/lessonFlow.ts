/**
 * Contrato **legado** do player de lições: exatamente uma múltipla escolha por
 * bloco, validado por exceção em `LessonFlowService`.
 *
 * Permanece intacto e em uso — as 18 atividades do catálogo dependem dele
 * durante toda a migração. O contrato que o sucede é `LearningActivityV2`, em
 * [`./learningActivity.ts`](./learningActivity.ts); os dois convivem até que um
 * adaptador converta o catálogo, e nenhuma entrega precisa reescrevê-lo inteiro
 * de uma vez.
 */

export type ContextPayload = {
    eyebrow?: string;
    title: string;
    body: string;
};

export type TeachPayload = {
    title: string;
    body: string;
    imageUrl?: string;
};

export type MultipleChoicePayload = {
    prompt: string;
    options: { id: string; label: string }[];
    correctOptionId: string;
    explanation: string;
};

export type ReinforcePayload = {
    title: string;
    body: string;
    tone: 'positive' | 'neutral' | 'corrective';
};

export type AdvancePayload = {
    title: string;
    body?: string;
};

export type LessonStep =
    | { type: 'context'; payload: ContextPayload }
    | { type: 'teach'; payload: TeachPayload }
    | { type: 'multiple-choice'; payload: MultipleChoicePayload }
    | { type: 'reinforce'; payload: ReinforcePayload }
    | { type: 'advance'; payload: AdvancePayload };

export type LessonStepContract = {
    id: string;
    type: LessonStep['type'];
    completionRule: 'displayed' | 'answered' | 'confirmed';
    retryRule: 'retry_same_step' | 'allow_continue';
    branching: 'none';
};

export type LessonStepDefinition = {
    step: LessonStep;
    contract: LessonStepContract;
};

export type LessonBlock = {
    id: string;
    lessonId: string;
    steps: LessonStepDefinition[];
};
