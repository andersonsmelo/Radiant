import * as haptics from './haptics';
import { createLessonFeedback, type LessonFeedbackEvent } from './lessonFeedback';

jest.mock('./haptics', () => ({
  hapticSelection: jest.fn(), hapticSuccess: jest.fn(), hapticError: jest.fn(),
  hapticStreak: jest.fn(), hapticLifeLost: jest.fn(), hapticCelebrate: jest.fn(),
}));

// Acesso por nome ao mock: `haptics[nome]` num namespace importado reprova no
// lint (`import/namespace`).
const hapticMocks = jest.requireMock<Record<keyof typeof haptics, jest.Mock>>('./haptics');

const EXPECTED: readonly (readonly [LessonFeedbackEvent, string, keyof typeof haptics])[] = [
  ['option_tap', 'toque', 'hapticSelection'],
  ['correct', 'acerto', 'hapticSuccess'],
  ['incorrect', 'erro', 'hapticError'],
  ['streak', 'sequencia', 'hapticStreak'],
  ['heart_lost', 'vida', 'hapticLifeLost'],
  ['lesson_complete', 'fim', 'hapticCelebrate'],
];

beforeEach(() => jest.clearAllMocks());

describe('feedback da lição', () => {
  it.each(EXPECTED)('%s toca %s e vibra com %s', (event, sound, haptic) => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: true, haptics: true }).emit(event);
    expect(sounds.play).toHaveBeenCalledWith(sound);
    expect(hapticMocks[haptic]).toHaveBeenCalledTimes(1);
  });

  it('com sons desligados, só vibra', () => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: false, haptics: true }).emit('correct');
    expect(sounds.play).not.toHaveBeenCalled();
    expect(haptics.hapticSuccess).toHaveBeenCalledTimes(1);
  });

  it('com vibração desligada, só toca', () => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: true, haptics: false }).emit('correct');
    expect(sounds.play).toHaveBeenCalledWith('acerto');
    expect(haptics.hapticSuccess).not.toHaveBeenCalled();
  });
});
