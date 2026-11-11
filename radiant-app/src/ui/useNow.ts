import { useEffect, useState } from 'react';

/**
 * A hora atual, relida a cada `intervalMs` enquanto `enabled` (só há o que
 * contar quando uma vida está a caminho). Ler `Date.now()` direto no corpo do
 * componente não basta: nada o redesenha com o tempo, e o React Compiler ainda
 * guarda o valor da primeira vez (achado 3 da prova de 2026-11-07, o "próxima
 * em 32 minutos" que não mudava).
 */
export function useNow(enabled: boolean, intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return undefined;
    // Ao ligar, a hora guardada pode ser da montagem: relê na hora.
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);
  return now;
}
