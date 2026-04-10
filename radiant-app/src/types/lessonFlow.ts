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
