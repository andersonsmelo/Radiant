import { useEffect, useRef } from 'react';
import { PushService } from '../../push/services/PushService';
import { TelemetryService } from '../TelemetryService';

/**
 * O bloco de ciclo de vida de abertura vivia inline na home legada
 * (`HomeScreen`), que deixou de ser alcançável quando a Learning Road passou a
 * ser a home oficial: `(tabs)/index.tsx` só renderiza `HomeScreen` com
 * `ENABLE_LEARNING_ROAD=false`, e nenhum perfil do `eas.json` declara isso — o
 * default do `config.ts` é `true` de propósito. Junto com a tela foram embora o
 * **único** emissor de `app_open`, que `RatingPromptService` e `PaywallService`
 * contam para liberar oferta, e o **único** chamador de `markDayOpen()`, que é
 * onde `cohort.installDate` nasce. Os dois gates ficaram permanentemente
 * fechados sem que nada falhasse.
 *
 * Extrair para hook é o que impede a próxima troca de home de repetir a perda:
 * o comportamento passa a viajar com quem o consome, não com uma tela.
 *
 * Dispara **uma vez por montagem**. A guarda de reentrância é a mesma do
 * `bootstrap()` do first-run: a versão inline dependia de callbacks de
 * identidade instável (`[animateReviewCard, checkHeuristics, loadData]`), então
 * reemitia sempre que uma delas mudava — inflando exatamente a contagem que os
 * gates leem.
 *
 * `checkHeuristics()` ficou deliberadamente de fora. Ele renderiza nudges, e
 * religá-lo é decisão de produto com efeito visível na home; está registrado
 * como pendência própria, não perdido de novo.
 */
export function useAppOpenLifecycle(): void {
    const alreadyRan = useRef(false);

    useEffect(() => {
        if (alreadyRan.current) {
            return;
        }
        alreadyRan.current = true;

        void TelemetryService.track('app_open');
        void TelemetryService.markDayOpen();
        void PushService.onAppOpen();
    }, []);
}
