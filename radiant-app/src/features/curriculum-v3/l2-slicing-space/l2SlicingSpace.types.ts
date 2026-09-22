export type L2EvidenceKind = 'initial_independent' | 'assisted_practice' | 'later_independent_retrieval';

export type L2Misconception = 'E-PLN-MED' | 'E-PLN-SEC' | 'E-PLN-OBL';

export type L2ModelLayerId = 'geometric-plane' | 'sampled-region' | 'nominal-thickness' | 'resulting-image';

export type L2Source = Readonly<{
  id: string;
  title: string;
  authority: string;
  edition: string;
  sections: readonly string[];
  url: string;
  consultedOn: string;
  use: string;
}>;

export type L2Objective = Readonly<{
  id: 'l2-reference-planes' | 'l2-median-is-sagittal' | 'l2-obliquity' | 'l2-spatial-region-thickness-image';
  statement: string;
  misconception: L2Misconception;
}>;

export type L2AnswerOption = Readonly<{
  id: string;
  /**
   * Descrição da geometria observável.
   *
   * Não existe rótulo aqui de propósito: um rótulo preso à identidade da
   * alternativa ("Opção 1" para `median` em todo item) sobrevive ao
   * embaralhamento e deixa acertar a recuperação sem ler o desenho. A posição
   * é responsabilidade de quem renderiza, e só dela.
   */
  textDescription: string;
}>;

export type L2Feedback = Readonly<{
  correct: string;
  incorrect: string;
}>;

export type L2Challenge = Readonly<{
  id: string;
  objectiveId: L2Objective['id'];
  prompt: string;
  accessiblePrompt: string;
  answerOptions: readonly L2AnswerOption[];
  correctAnswerId: string;
  evidenceKind: L2EvidenceKind;
  awardsXp: boolean;
  misconception: L2Misconception;
  feedback: L2Feedback;
  remediationChallengeId: string;
  nextChallengeId?: string;
  nextActionLabel?: string;
  additionalRecoveryChallengeId?: string;
  reviewTargetId: string;
  visualScenarioId: string;
}>;

export type L2ModelLayer = Readonly<{
  id: L2ModelLayerId;
  label: string;
  explanation: string;
}>;

export type L2SlicingSpaceLesson = Readonly<{
  id: 'lesson:v3:arc:spatial-orientation:l2-slicing-space';
  title: 'Cortando o espaço';
  audienceLabel: string;
  version: '1.0.0-draft';
  sources: readonly L2Source[];
  objectives: readonly L2Objective[];
  modelLayers: readonly L2ModelLayer[];
  challenges: readonly L2Challenge[];
  sequence: readonly string[];
  synthesis: readonly string[];
  reviewPlan: readonly string[];
}>;
