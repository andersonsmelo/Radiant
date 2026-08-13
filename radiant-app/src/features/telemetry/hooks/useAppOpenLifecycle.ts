import { useEffect } from 'react';
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
 * ## Uma abertura por PROCESSO, não por montagem
 *
 * A primeira versão disparava a cada montagem e se protegia com um `useRef`,
 * que não deduplica nada além do que o array de dependências vazio já garante
 * (este app não roda em StrictMode): o teste passava com o ref apagado. O
 * efeito era comportamental, não cosmético — `app_open` passou a significar "o
 * componente da home montou". `LessonFlowScreen` e a tela de conquista fazem
 * `router.replace('/(tabs)')` ao concluir, então três lições numa sessão só
 * abriam o gate de `MIN_APP_OPENS = 3` do `RatingPromptService` sem que
 * ninguém tivesse aberto o app três vezes — mostrando o pedido de avaliação
 * antes da hora.
 *
 * A trava agora é de MÓDULO, e não de instância: o registro vive enquanto o
 * processo vive, então remontar a home (ou montar as duas homes) não conta de
 * novo. `N lançamentos de processo → N eventos` é a propriedade, e é ela que o
 * teste afirma.
 *
 * ## O que ficou deliberadamente de fora
 *
 * Contar `background → foreground` como abertura é decisão de PRODUTO, não de
 * engenharia: define o que conta como sessão para o gate da loja, e pode tornar
 * o gate mais fácil de abrir do que é hoje (uma pessoa que alterna entre apps
 * cinco vezes numa sessão acumularia cinco aberturas). O flow
 * `rating-prompt.yaml` continua alcançando o gate: ele faz três `launchApp`, e
 * cada um é um processo novo.
 *
 * **Decidido pelo dono em 2026-08-07: fica a leitura conservadora.** Abertura é
 * lançamento de processo, e o retorno do segundo plano não conta. Isto deixou
 * de ser uma pendência — mudá-lo agora é mudança de produto deliberada, com
 * ADR, não a resolução de algo que ficou em aberto.
 *
 * `checkHeuristics()` também ficou de fora, desde a extração. Ele renderiza
 * nudges, e religá-lo é decisão de produto com efeito visível na home; está
 * registrado como pendência própria, não perdido de novo.
 */

// Escopo de módulo = escopo de processo. É esta linha que dá ao evento o
// significado que os gates leem.
let appOpenEmittedForProcess = false;

/** Só para teste: `jest.resetModules()` reencena um lançamento de processo. */
export function __resetAppOpenForTests(): void {
    appOpenEmittedForProcess = false;
}

export function useAppOpenLifecycle(): void {
    useEffect(() => {
        if (appOpenEmittedForProcess) {
            return;
        }
        appOpenEmittedForProcess = true;

        void TelemetryService.track('app_open');
        void TelemetryService.markDayOpen();
        void PushService.onAppOpen();
    }, []);
}
