import { Platform, Settings } from 'react-native';

/**
 * Argumento de lançamento que liga "Reduzir movimento" no app, sem mexer no
 * sistema (FILA 49, pacote E1 do plano de melhoria da trilha).
 *
 * Existe para o E2E. Com o fundo estrelado em laço infinito, a tela nunca
 * assenta, e o Maestro espera por ela a cada tentativa de rolagem: em
 * 2026-10-16 cada tentativa custou de 8 a 11 s no `reward-unlock`. O mesmo
 * roteiro, com este argumento, roda pelo caminho que o app já usa para quem
 * pediu menos movimento ao aparelho: o fundo para e o confete não sobe.
 *
 * **Como chega aqui.** No iOS, todo argumento `-chave valor` do lançamento
 * entra no domínio de argumentos do `NSUserDefaults`, que o `Settings` do
 * React Native expõe. Não é preciso dependência nativa nova: o
 * `React-RCTSettings` já está no binário. O Maestro 2.7 só escreve o `-` antes
 * da chave quando o valor **não** é booleano (`IOSLaunchArguments`, no
 * `maestro-ios-driver`). Por isso os roteiros passam `'1'`, e o contrato
 * Maestro reprova um `true`, que chegaria sem o `-` e seria ignorado.
 *
 * **Android:** o Maestro entrega os argumentos como extras da intent, que o
 * `Settings` não lê. Lá o argumento não tem efeito. Ler a intent exige módulo
 * nativo, decisão do dono.
 */
export const REDUCE_MOTION_LAUNCH_ARGUMENT = 'radiantReduceMotion';
export const REDUCE_MOTION_LAUNCH_VALUE = '1';

/** `true` quando o app foi lançado com `-radiantReduceMotion 1`. */
export function isReduceMotionForcedByLaunchArgument(): boolean {
  if (Platform.OS !== 'ios') return false;

  try {
    return String(Settings.get(REDUCE_MOTION_LAUNCH_ARGUMENT)) === REDUCE_MOTION_LAUNCH_VALUE;
  } catch {
    // Sem o módulo nativo (Jest, por exemplo), não há argumento a ler.
    return false;
  }
}
