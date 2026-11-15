import * as haptics from './haptics';
import { createLessonFeedback, motionMsFor, LESSON_FEEDBACK, type LessonFeedbackEvent } from './lessonFeedback';

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
  // Trilha ampla (plano de 2026-11-05, I6): 5 e 10 seguidas, nível e unidade.
  ['combo', 'combo', 'hapticStreak'],
  ['level_up', 'nivel', 'hapticCelebrate'],
  ['unit_complete', 'unidade', 'hapticCelebrate'],
];

// F3 da 1.6, com ENABLE_RICH_FEEDBACK ligada: os momentos que eram mudos.
const RICH: readonly (readonly [LessonFeedbackEvent, string | null, keyof typeof haptics | null])[] = [
  ['token_drop', 'soltar', 'hapticSelection'],
  ['dialogue_line', 'fala', null],
  ['advance', null, 'hapticSelection'],
];

beforeEach(() => jest.clearAllMocks());

function emitted(event: LessonFeedbackEvent, rich: boolean) {
  const sounds = { play: jest.fn(), release: jest.fn() };
  createLessonFeedback(sounds, { sounds: true, haptics: true }, { rich }).emit(event);
  const vibrated = Object.entries(hapticMocks).filter(([, mock]) => mock.mock.calls.length > 0).map(([name]) => name);
  return { played: sounds.play.mock.calls.map(([id]) => id), vibrated };
}

describe('feedback da lição', () => {
  it.each(EXPECTED)('%s toca %s e vibra com %s', (event, sound, haptic) => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: true, haptics: true }).emit(event);
    expect(sounds.play).toHaveBeenCalledWith(sound);
    expect(hapticMocks[haptic]).toHaveBeenCalledTimes(1);
  });

  it.each(EXPECTED)('%s não muda com o retorno rico ligado', (event, sound, haptic) => {
    expect(emitted(event, true)).toEqual({ played: [sound], vibrated: [haptic] });
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

describe('mapa único (F3): momentos novos', () => {
  it.each(RICH)('ligado, %s toca %s e vibra com %s', (event, sound, haptic) => {
    expect(emitted(event, true)).toEqual({ played: sound ? [sound] : [], vibrated: haptic ? [haptic] : [] });
  });

  // Contraprova: desligado, o app é a base. Soltar ficha soava como o toque, e
  // avançar e revelar fala não soavam nem vibravam.
  it('desligado, soltar ficha é o toque da base', () => {
    expect(emitted('token_drop', false)).toEqual({ played: ['toque'], vibrated: ['hapticSelection'] });
  });
  it.each(['advance', 'dialogue_line'] as const)('desligado, %s não toca nem vibra', (event) => {
    expect(emitted(event, false)).toEqual({ played: [], vibrated: [] });
  });
  it('o padrão, sem opção, é desligado', () => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: true, haptics: true }).emit('dialogue_line');
    expect(sounds.play).not.toHaveBeenCalled();
  });

  it('as preferências valem para os momentos novos', () => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: false, haptics: false }, { rich: true }).emit('token_drop');
    createLessonFeedback(sounds, { sounds: false, haptics: false }, { rich: true }).emit('dialogue_line');
    expect(sounds.play).not.toHaveBeenCalled();
    expect(hapticMocks.hapticSelection).not.toHaveBeenCalled();
  });
});

describe('animação de cada momento, nas faixas da seção 10 do plano de 2026-11-02', () => {
  // [momento, mínimo, máximo] em ms.
  const RANGES: readonly (readonly [LessonFeedbackEvent, number, number])[] = [
    ['option_tap', 80, 120], ['token_drop', 80, 120],
    ['correct', 120, 180], ['incorrect', 120, 180],
    ['dialogue_line', 160, 240],
    ['streak', 150, 250], ['combo', 150, 250],
    ['lesson_complete', 450, 700], ['unit_complete', 450, 700],
  ];

  it('todo momento do mapa diz qual animação usa', () => {
    for (const entry of Object.values(LESSON_FEEDBACK)) expect(entry.motion).toEqual(expect.any(String));
  });

  // A tabela é a especificação; quem prova que a tela a usa são os testes dos
  // componentes, sobre as chamadas de animação de fato feitas.
  it.each(RANGES)('%s anima entre %i e %i ms', (event, min, max) => {
    const ms = motionMsFor(event);
    expect(ms).toBeGreaterThanOrEqual(min);
    expect(ms).toBeLessThanOrEqual(max);
  });

  it('passar de etapa é troca simples: não anima', () => {
    expect(motionMsFor('advance')).toBe(0);
  });
});
