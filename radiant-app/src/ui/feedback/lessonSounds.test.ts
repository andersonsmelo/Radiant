import { createAudioPlayer, mockAudioPlayers, setAudioModeAsync } from '../../test/mocks/expoAudio';
import { LESSON_SOUND_IDS, createLessonSoundPlayer } from './lessonSounds';

beforeEach(() => {
  mockAudioPlayers.length = 0;
  jest.clearAllMocks();
});

describe('tocador de sons da lição', () => {
  it('pré-carrega os seis sons ao abrir e respeita o silencioso', () => {
    createLessonSoundPlayer();
    expect(LESSON_SOUND_IDS).toEqual(['toque', 'acerto', 'erro', 'vida', 'sequencia', 'fim']);
    expect(createAudioPlayer).toHaveBeenCalledTimes(6);
    expect(setAudioModeAsync).toHaveBeenCalledWith({ playsInSilentMode: false });
  });

  it('toca do começo o som pedido, e só ele', async () => {
    const sounds = createLessonSoundPlayer();
    sounds.play('acerto');
    await Promise.resolve();
    const acerto = mockAudioPlayers[LESSON_SOUND_IDS.indexOf('acerto')];
    expect(acerto.seekTo).toHaveBeenCalledWith(0);
    expect(acerto.play).toHaveBeenCalledTimes(1);
    expect(mockAudioPlayers.filter((player) => player !== acerto).every((player) => player.play.mock.calls.length === 0)).toBe(true);
  });

  it('libera os players ao sair', () => {
    const sounds = createLessonSoundPlayer();
    sounds.release();
    expect(mockAudioPlayers.every((player) => player.remove.mock.calls.length === 1)).toBe(true);
  });

  it('falha ao carregar não derruba a lição', () => {
    createAudioPlayer.mockImplementationOnce(() => { throw new Error('sem áudio'); });
    const sounds = createLessonSoundPlayer();
    expect(() => sounds.play('toque')).not.toThrow();
  });
});
