import { useContext, useEffect, useState } from 'react';
import { NavigationContext } from '@react-navigation/native';

/**
 * Se a tela que contém o componente está em foco.
 *
 * A aba visitada continua montada, e a tela empilhada deixa as abas montadas
 * embaixo. Animação infinita numa tela escondida continua custando CPU: medido
 * no simulador em 2026-09-25 e 2026-09-28, o fundo de estrelas somava ~24
 * pontos por fundo escondido (FILA, 12), e o ícone de sequência que respira,
 * ~31 % com as duas abas cobertas (FILA, 33). Quem anima em laço infinito
 * pausa fora de foco.
 *
 * Lê o `NavigationContext` direto, e não `useIsFocused`, porque este lança
 * erro fora de um navegador. Sem navegador, não há tela para perder o foco, e
 * o componente se comporta como em foco.
 */
export function useScreenFocused(): boolean {
  const navigation = useContext(NavigationContext);
  const [focused, setFocused] = useState(() => navigation?.isFocused() ?? true);

  useEffect(() => {
    if (!navigation) return undefined;
    setFocused(navigation.isFocused());
    const offFocus = navigation.addListener('focus', () => setFocused(true));
    const offBlur = navigation.addListener('blur', () => setFocused(false));
    return () => {
      offFocus();
      offBlur();
    };
  }, [navigation]);

  return focused;
}
