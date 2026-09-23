import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type LessonSoundId = 'toque' | 'acerto' | 'erro' | 'vida' | 'sequencia' | 'fim';

export const LESSON_SOUND_IDS: readonly LessonSoundId[] = ['toque', 'acerto', 'erro', 'vida', 'sequencia', 'fim'];

/** Os seis sons escolhidos pelo dono; origem e licença em assets/sounds/README.md. */
const SOURCES: Readonly<Record<LessonSoundId, number>> = {
  toque: require('../../../assets/sounds/toque.m4a'),
  acerto: require('../../../assets/sounds/acerto.m4a'),
  erro: require('../../../assets/sounds/erro.m4a'),
  vida: require('../../../assets/sounds/vida.m4a'),
  sequencia: require('../../../assets/sounds/sequencia.m4a'),
  fim: require('../../../assets/sounds/fim.m4a'),
};

type Player = Readonly<{ play(): void; seekTo(seconds: number): Promise<void>; remove(): void }>;

export type LessonSoundPlayer = Readonly<{ play(id: LessonSoundId): void; release(): void }>;

/**
 * Carrega os seis sons na abertura da lição (spec §5.2), para que tocar
 * depois não espere carregamento. Som é enfeite: nenhuma falha aqui pode
 * interromper a lição.
 */
export function createLessonSoundPlayer(): LessonSoundPlayer {
  // `playsInSilentMode: false` deixa a chave de silencioso do iPhone valer.
  void setAudioModeAsync({ playsInSilentMode: false }).catch(() => undefined);
  const players = new Map<LessonSoundId, Player>();
  for (const id of LESSON_SOUND_IDS) {
    try {
      players.set(id, createAudioPlayer(SOURCES[id]) as unknown as Player);
    } catch {
      // Sem este som; os outros continuam.
    }
  }
  return {
    play(id) {
      const player = players.get(id);
      if (!player) return;
      void player.seekTo(0).then(() => player.play()).catch(() => undefined);
    },
    release() {
      for (const player of players.values()) {
        try { player.remove(); } catch { /* já liberado */ }
      }
      players.clear();
    },
  };
}
