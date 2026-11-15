# F8: levantamento do que existe (2026-11-15)

Medido por `grep` do efeito na árvore da `main` em `741c3e3`, worktree
`f8-conversao-072f92`. Caminhos relativos a `radiant-app/src/`.

## 1. O que o assinante ganha, segundo o código

**Só vidas ilimitadas.** Nenhum outro ponto do app lê o direito de assinante.

- `features/subscription/SubscriptionService.ts:291-299` (`applyToHearts`): o
  único efeito do direito é `hearts.setUnlimited(expiresAt)`.
- Leitores do estado da assinatura fora da pasta dela: `app/_layout.tsx:178,238`
  (escuta da loja e releitura na abertura), `features/settings/screens/SettingsScreen.tsx:61`
  (cartão de status) e as três telas que só perguntam `storeAvailable()`
  (`JourneyHomeScreen.tsx:330`, `LessonFlowScreen.tsx:881`, `CheckpointScreen.tsx:732`).
  Nenhum libera conteúdo.
- `grep -ril premium src` não acha nada fora de testes. A própria tela diz
  "As aulas são as mesmas para todo mundo." (`SubscriptionScreen.tsx:260`).
- A proteção de sequência (`features/gamification/services/StreakFreezeService.ts`)
  não lê a assinatura: vale igual para o gratuito.

## 2. O que o gratuito perde

As regras estão em `features/hearts/HeartsService.ts`:

- `MAX_HEARTS = 5` (linha 3), uma vida volta a cada `REFILL_MIN = 30` minutos
  (linha 4, `refillByTime` 34-53);
- cada erro em item que custa vida tira uma (`spend`, 55-64). Sem vidas, a aula
  para no próximo item que custaria vida (`LessonFlowScreen.tsx:390-393`);
- cada revisão concluída devolve `REVIEW_REWARD = 1` vida (linha 5, `rewardReview`
  66-78, chamado em `features/review/screens/ReviewScreen.tsx:144` e
  `features/lesson-flow/services/LessonOutcomeService.ts:409`);
- fim de ilimitado devolve o estado CHEIO (`setUnlimited(null)` → `fullState`, 80-81;
  `resolveEntitlement` 23-26).

## 3. Todo chamador de `heartsRepository.spend`

| Chamador | Linha | O aluno alcança? |
| --- | --- | --- |
| `features/lesson-flow/screens/LessonFlowScreen.tsx` | 419 | Sim: toda aula da trilha. |
| `features/checkpoint/screens/CheckpointScreen.tsx` | 438 | Sim: avaliações (conferências). |
| `features/quiz/hooks/useQuiz.ts` | 153 | Não pela navegação: nada leva a `/quiz` (aprendizado validado do cérebro, 2026-07-28). |
| `features/curriculum-v3/hybrid-l1/HybridLessonScreen.tsx` | 133 (`hearts.spend`) | Só com ferramentas de desenvolvimento (`/licao-hibrida`). |

Onde a folha de vidas abre: `LessonFlowScreen.tsx:392` (sem vidas, antes de
responder) e `:475` (a última vida acabou depois do retorno); `CheckpointScreen.tsx:457`
e `:716`; `JourneyHomeScreen.tsx:267` (toque no contador do cabeçalho).

## 4. Todo ponto que hoje navega para a assinatura

`grep -rn subscription src | grep -i "push\|href\|navigate\|replace"`:

- `features/hearts/components/HeartsSheet.tsx:77-79`: link "Vidas ilimitadas",
  só com loja disponível. É chamado pelas três telas:
  `LessonFlowScreen.tsx:887-890`, `CheckpointScreen.tsx:734`, `JourneyHomeScreen.tsx:337-341`.
- `features/settings/screens/SettingsScreen.tsx:130`: cartão da assinatura nos Ajustes.

Não há outro convite. A comemoração de unidade (`features/journey/components/UnitCompleteCelebration.tsx`)
não fala da assinatura.

## 5. A tela e o serviço de assinatura

- Rota `app/subscription.tsx` → `features/subscription/screens/SubscriptionScreen.tsx`.
  Preço e período vêm só de `loadOffers()` (`displayPrice` da StoreKit,
  `subscription.types.ts:15-24`); a tela tem Restaurar, termos, privacidade e
  como cancelar (exigência 3.1.2 da Apple), e o botão Fechar (`:310-318`).
- `SubscriptionService.purchase` (`:213-241`) devolve `purchased`, `pending`,
  `cancelled`, `failed` ou `store-unavailable`.
- Estados: `none`, `pending` (Ask to Buy, 24 h), `unlimited`, `expired`
  (`resolveSubscriptionStatus`, `:98-108`).
- `storeAvailable()` (`:131-133`) diz se o binário tem loja, sem tocar a rede.

## 6. Interruptores, armazenamento e tela de desenvolvimento

- Flags em `config.ts`, todas por `readBooleanFlag(process.env.EXPO_PUBLIC_*, padrão)`.
  O contrato `config/killSwitches.contract.test.ts` lê a AST: nenhuma flag fixa e
  toda flag com leitor.
- Chaves em `constants/storageKeys.ts`; inventário em `storage/storageInventory.ts`,
  com guarda `storageInventory.test.ts` (chave gravada sem inventário reprova).
  Precedente de convite com limite: `@radiant:rating_prompt_v1`, classe `controle`
  (`services/RatingPromptService.ts`, 30 dias de intervalo).
- Tela de desenvolvimento existente: `features/dev-console/screens/DevConsoleScreen.tsx`,
  rota gated por `SHOW_DEV_TOOLS`; cartões como `HybridLessonMetricsCard` (`:309`).

## 7. Conflitos com as frentes abertas

`git diff origin/main...<branch>` nos arquivos que a F8 toca, em 2026-11-15:

- F4 (#72) acrescenta linhas em `config.ts`, `storageKeys.ts`, `storageInventory.ts`,
  `config/killSwitches.contract.test.ts` e `docs/STATUS.md`, e uma em
  `JourneyHomeScreen.tsx`. **Correção pela revisão:** este levantamento não tinha visto
  o teste de kill switches nem o `STATUS.md`, e o `git merge-tree` deu conflito nos dois.
  Os dois blocos da F8 foram movidos para outro ponto. Medido de novo em 2026-11-15:
  `git merge-tree --write-tree` sem conflito contra #71, #72, #73 e #74.
- F1 (#74) e F2 (#71) mudam 7 linhas de `LessonFlowScreen.tsx`, longe da folha de vidas.
- F7 (#73) não toca nenhum desses arquivos.
- Nenhuma frente toca `features/hearts`, `features/subscription`, `features/dev-console`
  nem `UnitCompleteCelebration.tsx`.

## 8. Consequências para o recorte

1. A comparação gratuito × assinante tem uma diferença real só: vidas. Ela sai das
   constantes de `HeartsService.ts`, nunca de texto solto.
2. "Sequência em risco" **não** recebe convite: a assinatura não protege sequência,
   e o convite prometeria o que o código não entrega.
3. Vidas esgotadas já tem a folha e o link. O convite entra nela, sem abrir tela nova.
4. Fim de unidade é o outro momento: a comemoração já é uma pausa, com "Continuar".
