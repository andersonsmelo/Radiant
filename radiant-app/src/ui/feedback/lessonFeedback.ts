import type { FeedbackPreferences } from './feedbackPreferences';
import { hapticCelebrate, hapticError, hapticLifeLost, hapticSelection, hapticStreak, hapticSuccess } from './haptics';
import type { LessonSoundId, LessonSoundPlayer } from './lessonSounds';

export type LessonFeedbackEvent =
  | 'option_tap' | 'correct' | 'incorrect' | 'streak' | 'heart_lost' | 'lesson_complete'
  // Trilha ampla (plano de 2026-11-05, I6): 5 e 10 seguidas, subida de nível e unidade concluída.
  | 'combo' | 'level_up' | 'unit_complete'
  // F3 da 1.6: soltar ficha (cloze, categorize), passar de etapa e revelar fala de diálogo.
  | 'token_drop' | 'advance' | 'dialogue_line';

export type LessonFeedback = Readonly<{ emit(event: LessonFeedbackEvent): void }>;

/**
 * Animações do vocabulário da aula, com as durações da seção 10 do plano de
 * 2026-11-02: pressionar 80–120 ms, confirmar 120–180, entrada de fala 160–240,
 * aviso no topo 150–250 e concluir 450–700. `none`: troca simples, sem animar
 * (passar de etapa). Quem respeita "reduzir movimento" são os hooks de
 * `ui/motion`, que recebem estas durações.
 */
export const FEEDBACK_MOTION_MS = { press: 100, confirm: 150, enter: 200, notice: 180, celebrate: 600, none: 0 } as const;
export type FeedbackMotion = keyof typeof FEEDBACK_MOTION_MS;

type Entry = Readonly<{ sound: LessonSoundId | null; haptic: (() => void) | null; motion: FeedbackMotion }>;

/**
 * O único lugar que diz, para cada momento da aula, o que toca, o que vibra e
 * como anima. A tela só emite momentos; nenhum componente toca som sozinho.
 */
export const LESSON_FEEDBACK: Readonly<Record<LessonFeedbackEvent, Entry>> = {
  option_tap: { sound: 'toque', haptic: hapticSelection, motion: 'press' },
  token_drop: { sound: 'soltar', haptic: hapticSelection, motion: 'press' },
  correct: { sound: 'acerto', haptic: hapticSuccess, motion: 'confirm' },
  incorrect: { sound: 'erro', haptic: hapticError, motion: 'confirm' },
  streak: { sound: 'sequencia', haptic: hapticStreak, motion: 'notice' },
  combo: { sound: 'combo', haptic: hapticStreak, motion: 'notice' },
  heart_lost: { sound: 'vida', haptic: hapticLifeLost, motion: 'notice' },
  // Avançar é o momento mais frequente da aula: vibra, mas não soa.
  advance: { sound: null, haptic: hapticSelection, motion: 'none' },
  // A fala soa baixo e não vibra: quem conversa não toca no aluno.
  dialogue_line: { sound: 'fala', haptic: null, motion: 'enter' },
  lesson_complete: { sound: 'fim', haptic: hapticCelebrate, motion: 'celebrate' },
  level_up: { sound: 'nivel', haptic: hapticCelebrate, motion: 'celebrate' },
  unit_complete: { sound: 'unidade', haptic: hapticCelebrate, motion: 'celebrate' },
};

/**
 * Com `ENABLE_RICH_FEEDBACK` desligada, o app é a base: soltar ficha soava
 * como o toque, e avançar e revelar fala não davam retorno nenhum.
 */
const BASE: Readonly<Partial<Record<LessonFeedbackEvent, Entry>>> = {
  token_drop: LESSON_FEEDBACK.option_tap,
  advance: { sound: null, haptic: null, motion: 'none' },
  dialogue_line: { sound: null, haptic: null, motion: 'enter' },
};

/** Duração, em ms, da animação do momento: o que os componentes passam aos hooks de `ui/motion`. */
export function motionMsFor(event: LessonFeedbackEvent): number {
  return FEEDBACK_MOTION_MS[LESSON_FEEDBACK[event].motion];
}

/** A lição fala em eventos; esta camada decide o que toca e o que vibra (spec §5.2). */
export function createLessonFeedback(
  sounds: Pick<LessonSoundPlayer, 'play'>,
  preferences: FeedbackPreferences,
  { rich = false }: { rich?: boolean } = {},
): LessonFeedback {
  return {
    emit(event) {
      const entry = (!rich && BASE[event]) || LESSON_FEEDBACK[event];
      if (preferences.sounds && entry.sound) sounds.play(entry.sound);
      if (preferences.haptics && entry.haptic) entry.haptic();
    },
  };
}
