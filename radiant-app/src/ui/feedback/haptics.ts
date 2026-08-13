import * as Haptics from 'expo-haptics';

/**
 * Feedback tátil dos momentos que importam.
 *
 * Antes disto o app só vibrava na tab bar: acertar uma questão, errar e
 * concluir uma lição — os três momentos em que o corpo espera resposta —
 * passavam em silêncio.
 *
 * Regras:
 * - iOS apenas. O motor háptico do Android varia demais entre aparelhos e o
 *   projeto já segue essa convenção em components/haptic-tab.tsx.
 * - Nunca lança. Háptico é enfeite sensorial: se o motor falhar ou o aparelho
 *   não tiver um, o fluxo do quiz não pode quebrar por causa disso.
 * - Chamado sem await. Quem chama não deve esperar pela vibração.
 */

function isSupported(): boolean {
  return process.env.EXPO_OS === 'ios';
}

function run(effect: () => Promise<void>): void {
  if (!isSupported()) {
    return;
  }

  void effect().catch(() => {
    // Silencioso de propósito: ver a nota sobre não lançar acima.
  });
}

/** Resposta certa. */
export function hapticSuccess(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Resposta errada — aviso, não punição: o padrão Warning é mais leve que Error. */
export function hapticError(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

/** Conquista, checkpoint, fim de lição. */
export function hapticCelebrate(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/**
 * Perda de vida — o único evento punitivo do app.
 *
 * Separado de `hapticError` de propósito. Errar e **perder uma vida** são
 * eventos de peso diferente, e até aqui produziam exatamente o mesmo sinal:
 * no modo revisão o erro não custa nada, e mesmo assim vibrava igual. Um
 * feedback uniforme para eventos de significância diferente é o que faz uma
 * interface parecer genérica.
 *
 * `Heavy` porque é o mais pesado do vocabulário de impacto, e este é o evento
 * mais pesado que o app cobra. Dispara **depois** do `hapticError`, quando a
 * escrita da vida resolve — a sequência "errou" → "e custou" é a encenação;
 * os dois no mesmo tick viram um borrão só.
 */
export function hapticLifeLost(): void {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}

/** Toque em ação primária. */
export function hapticTap(): void {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}
