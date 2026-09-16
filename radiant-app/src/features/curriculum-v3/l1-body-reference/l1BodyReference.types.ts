export type L1EvidenceKind = 'initial_independent' | 'assisted_practice' | 'later_independent_retrieval';

export type L1Misconception = 'E-LAT-OBS' | 'E-GRV' | 'E-REL' | 'E-POS';

export type L1Source = Readonly<{
  id: string;
  title: string;
  authority: string;
  edition: string;
  sections: readonly string[];
  url: string;
  consultedOn: string;
  use: string;
}>;

export type L1Relationship = Readonly<{
  id: 'superior-inferior' | 'anterior-posterior' | 'medial-lateral' | 'proximal-distal' | 'superficial-deep';
  label: string;
  operationalDefinition: string;
  visualCue: string;
}>;

export type L1Feedback = Readonly<{
  correct: string;
  incorrect: string;
}>;

export type L1AnswerOption = Readonly<{
  id: string;
  label: string;
  landmarkId: string;
  textDescription: string;
}>;

export type L1Challenge = Readonly<{
  id: string;
  objectiveId: string;
  prompt: string;
  accessiblePrompt: string;
  answerOptions: readonly L1AnswerOption[];
  correctAnswerId: string;
  evidenceKind: L1EvidenceKind;
  awardsXp: boolean;
  misconception: L1Misconception;
  feedback: L1Feedback;
  remediationChallengeId: string;
  nextChallengeId?: string;
  nextActionLabel?: string;
  additionalRecoveryChallengeId?: string;
  reviewTargetId: string;
  posture: 'anatomical' | 'supine' | 'prone';
  perspective: 'front' | 'back';
}>;

export type L1BodyReferenceLesson = Readonly<{
  id: 'lesson:v3:arc:spatial-orientation:l1-body-reference';
  title: 'O corpo como referência';
  audienceLabel: string;
  version: '1.0.0-draft';
  sources: readonly L1Source[];
  relationships: readonly L1Relationship[];
  challenges: readonly L1Challenge[];
  sequence: readonly string[];
  synthesis: readonly string[];
  reviewPlan: readonly string[];
}>;
