import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export type ReducedMotionPreference = {
  /** `true` quando a pessoa pediu menos movimento. */
  reducedMotionEnabled: boolean;
  /**
   * `false` até a consulta assíncrona responder.
   *
   * Existe porque a primeira renderização acontece ANTES da resposta, e quem
   * agenda animação nessa primeira passada corre contra ela. Nas entradas em
   * cascata (`index * 80` no interior de galáxia, `index * 60` no interior de
   * planeta) os primeiros nós tinham atraso menor que o tempo de resposta da
   * `AccessibilityInfo`: a animação que a pessoa pediu para não ver começava, e
   * só os nós mais tardios respeitavam a preferência. Adiar até saber é a
   * diferença entre "respeita quase sempre" e "respeita".
   */
  resolved: boolean;
};

const UNDETERMINED: ReducedMotionPreference = { reducedMotionEnabled: false, resolved: false };

/**
 * O estado completo da preferência de movimento, incluindo o intervalo em que
 * ela ainda é desconhecida.
 *
 * `AccessibilityInfo` reporta o valor inicial de forma assíncrona e avisa
 * quando alguém muda a preferência com o app aberto.
 */
export function useReducedMotionPreferenceState(): ReducedMotionPreference {
  const [preference, setPreference] = useState<ReducedMotionPreference>(UNDETERMINED);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) {
          setPreference({ reducedMotionEnabled: enabled, resolved: true });
        }
      })
      .catch(() => {
        // Falha de consulta resolve como "sem redução": é o padrão do sistema,
        // e travar tudo por um erro de leitura seria pior do que animar.
        if (mounted) {
          setPreference({ reducedMotionEnabled: false, resolved: true });
        }
      });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setPreference({ reducedMotionEnabled: enabled, resolved: true });
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return preference;
}

/**
 * Mantém o comportamento de movimento alinhado à preferência do aparelho.
 *
 * Devolve só o booleano, que é o que a maioria dos consumidores precisa: um
 * componente que decide o valor de repouso a cada renderização não corre risco
 * de corrida, porque nada foi AGENDADO. Quem agenda — `setTimeout`, cascata,
 * laço contínuo — usa `useReducedMotionPreferenceState` e espera `resolved`.
 */
export function useReducedMotionPreference(): boolean {
  return useReducedMotionPreferenceState().reducedMotionEnabled;
}
