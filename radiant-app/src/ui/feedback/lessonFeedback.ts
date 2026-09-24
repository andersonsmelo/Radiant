import type { FeedbackPreferences } from './feedbackPreferences';
import { hapticCelebrate, hapticError, hapticLifeLost, hapticSelection, hapticStreak, hapticSuccess } from './haptics';
import type { LessonSoundId, LessonSoundPlayer } from './lessonSounds';

export type LessonFeedbackEvent = 'option_tap' | 'correct' | 'incorrect' | 'streak' | 'heart_lost' | 'lesson_complete';

export type LessonFeedback = Readonly<{ emit(event: LessonFeedbackEvent): void }>;

const SOUND: Readonly<Record<LessonFeedbackEvent, LessonSoundId>> = {
  option_tap: 'toque', correct: 'acerto', incorrect: 'erro', streak: 'sequencia', heart_lost: 'vida', lesson_complete: 'fim',
};

const HAPTIC: Readonly<Record<LessonFeedbackEvent, () => void>> = {
  option_tap: hapticSelection, correct: hapticSuccess, incorrect: hapticError, streak: hapticStreak, heart_lost: hapticLifeLost, lesson_complete: hapticCelebrate,
};

/** A lição fala em eventos; esta camada decide o que toca e o que vibra (spec §5.2). */
export function createLessonFeedback(sounds: Pick<LessonSoundPlayer, 'play'>, preferences: FeedbackPreferences): LessonFeedback {
  return {
    emit(event) {
      if (preferences.sounds) sounds.play(SOUND[event]);
      if (preferences.haptics) HAPTIC[event]();
    },
  };
}
