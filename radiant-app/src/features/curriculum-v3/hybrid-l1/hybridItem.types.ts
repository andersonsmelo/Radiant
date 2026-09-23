import type { BodyPerspective, BodyPosture } from '../l1-body-reference/bodyMapGeometry';
import type { L1AnswerOption, L1Misconception } from '../l1-body-reference/l1BodyReference.types';

export type HybridPhase = 'first_contact' | 'challenge';
export type HybridFormat = 'tap' | 'choice' | 'true_false';
export type RelationId = 'superior-inferior' | 'medial-lateral' | 'proximal-distal' | 'superficial-deep' | 'anterior-posterior';

export type HybridOption = Readonly<{ id: string; label: string; landmarkId: string | null; textDescription: string }>;

export type HybridItemSource =
  | Readonly<{ kind: 'laterality'; side: 'left' | 'right' }>
  | Readonly<{ kind: 'relation'; relation: RelationId; termIndex: 0 | 1 }>
  | Readonly<{ kind: 'true_false'; base: HybridItem; optionIndex: number }>;

export type HybridItem = Readonly<{
  id: string;
  source: HybridItemSource;
  /** Verdadeiro para o item que voltou depois de um erro. Nunca demonstra domínio. */
  variant: boolean;
  phase: HybridPhase;
  format: HybridFormat;
  objectiveId: string;
  misconception: L1Misconception;
  posture: BodyPosture;
  perspective: BodyPerspective;
  /** Relação que o mapa destaca (`selectedRelation` do BodyReferenceMap). */
  relation: string;
  intro: string;
  prompt: string;
  accessiblePrompt: string;
  /** O que o aluno escolhe. */
  options: readonly HybridOption[];
  /** O que o mapa numera. Igual a `options`, exceto no verdadeiro/falso. */
  landmarks: readonly L1AnswerOption[];
  correctOptionId: string;
  feedback: Readonly<{ correct: string; incorrect: string }>;
  /** Frase curta que nomeia a confusão; aparece no erro de primeiro contato. */
  hint: string;
  optionNoun: string;
  optionArticle: 'a' | 'o';
  /** Afirmação verdadeira sobre a opção certa; alimenta o verdadeiro/falso. */
  claim: string;
}>;
