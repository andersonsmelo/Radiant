/**
 * O Jest não tem o módulo nativo do expo-audio. Este mock substitui o pacote
 * inteiro (moduleNameMapper em jest.config.cjs) e expõe os players criados
 * para os testes inspecionarem.
 */
export type MockAudioPlayer = { source: unknown; play: jest.Mock; seekTo: jest.Mock; remove: jest.Mock };

export const mockAudioPlayers: MockAudioPlayer[] = [];

export const createAudioPlayer = jest.fn((source: unknown): MockAudioPlayer => {
  const player: MockAudioPlayer = { source, play: jest.fn(), seekTo: jest.fn(() => Promise.resolve()), remove: jest.fn() };
  mockAudioPlayers.push(player);
  return player;
});

export const setAudioModeAsync = jest.fn(() => Promise.resolve());
