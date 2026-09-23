# Relatório — 1.4, Task 8, fatia 3: `QuizTopBar` mostra ∞ para assinante (2026-09-23)

Frente A do prompt de continuidade de 2026-09-23, escolhida pelo dono.
Condição de pronto: o topo da lição mostra ∞ exatamente quando errar não custa
vida; guardas vistas vermelhas; `quality` exit 0; FILA, STATUS e este relatório
atualizados. Branch `feat/quiztopbar-infinito`, aberta de
`fix/ask-to-buy-pendente` em `0b0283e` sem upstream, porque o
[PR #17](https://github.com/andersonsmelo/Radiant/pull/17) segue aberto. Run do
Loop `run-1790175261378-dbe5f251`.

## Decisão tomada com o dono antes de escrever

O prompt dizia que o estado viria do `SubscriptionService.getStatus`. O mapa
dos quatro estados mostrou que essa é a fonte errada para este indicador, e o
dono escolheu derivar o ∞ de `HeartsSnapshot.status === 'unlimited'`:

| `SubscriptionStatus` | Vidas | Errar custa? | Topo da lição |
|---|---|---|---|
| `none` | intocadas | sim | vidas |
| `pending` (Ask to Buy) | intocadas | sim | vidas — pendente não é assinante |
| `unlimited` | `unlimitedUntil = expiresAt` | não | **∞, sem corações** |
| `expired` / reembolso | `setUnlimited(null)` → CHEIA | sim | vidas (5 de 5) |
| `unlimited` vencido sem releitura | o relógio do `HeartsService` já trata como CHEIA | sim | vidas |

O motivo: `HeartsSnapshot.status === 'unlimited'` e o `spend` que não desconta
leem o **mesmo** predicado (`activeUnlimited`). O cache da assinatura só vira
vidas ilimitadas quando `applyToHearts` roda; lido direto, ele mostraria ∞ numa
janela em que o erro ainda custa. A justificativa ficou no JSDoc da
propriedade.

## O que mudou

- `QuizTopBar.tsx` — propriedade opcional `unlimited` (padrão `false`). Com ela,
  o componente mostra `∞` com rótulo acessível "Vidas ilimitadas" **no lugar**
  do `HeartsDisplay`, como a spec §ILIMITADA pede ("corações somem").
- `LessonFlowScreen.tsx` — passa `unlimited={hearts.status === 'unlimited'}`.
- `QuizScreen` (rota `/quiz`) **não mudou, de propósito**: ela cobra as vidas
  pelo contador legado `GamificationService.loseHeart`, que ignora a
  assinatura, e não tem entrada no app. Mostrar ∞ ali seria mentira.
- Testes: dois no `QuizTopBar.test.tsx` e dois no
  `LessonFlowScreen.flow.test.tsx`.

## Medido

- Vermelhos em
  [`2026-09-23-radiant-quiztopbar-infinito-vermelhos.md`](2026-09-23-radiant-quiztopbar-infinito-vermelhos.md):
  os testes novos contra `0b0283e`, o vermelho só da ligação com o componente
  já pronto, e três mutações (todo mundo vê ∞; ∞ ao lado dos corações; a tela
  liga ∞ para todos). Cada uma derrubou a guarda que a nomeia, e tudo voltou
  ao verde ao restaurar.
- Gate: `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, Node `v20.20.2`
  → **exit 0, 133 suítes / 1178 testes** (a suíte inteira; eram 1174 na
  medição anterior do mesmo branch, e os 4 são os testes novos); lint
  0 erros / 26 avisos, nenhum nos quatro arquivos tocados (`npx eslint` neles
  → exit 0); Visual QA sem regressão (0 regressions, 61 baselined, 3 scoped
  exceptions). Árvore sem outro arquivo sujo, então a contagem é a do conjunto
  rastreado mais esta mudança.
- Os dois avisos `act(...)` que aparecem no `LessonFlowScreen.flow.test.tsx`
  já existiam: a mesma contagem (2) sem esta mudança.

## Inferido, não medido

- Que o ∞ fica bem posicionado e legível ao lado da barra, inclusive com texto
  grande: o tamanho (24, `heartFull`) segue o peso visual dos corações, mas
  nenhuma tela foi renderizada.

## Não verificado — precisa de aparelho ou sandbox (dono)

- A tela com assinante real: depende do build interno `development` e da
  sandbox da fatia 2. A tela lê as vidas ao montar, então uma compra feita com
  a lição aberta só aparece na próxima montagem. Hoje isso não é alcançável:
  a folha de vidas não leva à loja (achado 3 abaixo). Quando levar, conferir
  no sandbox que o ∞ aparece ao voltar da compra.
- VoiceOver lendo "Vidas ilimitadas" no aparelho.

## Achados fora desta frente — viraram tarefas separadas

1. **Perfil mostra o contador legado.** A `MissionsScreen`, embutida no Perfil,
   lê `GamificationService.getSnapshot().hearts`, que o caminho vivo nunca
   desconta: mostra sempre 5 e nunca ∞. É a "duas fontes para o mesmo
   conceito" que o `STATUS.md` já anotava.
2. **O `HUD` mostra ∞ ao lado dos corações** — exatamente a mutação B deste
   relatório, que aqui é guardada e lá não.
3. **A folha de vidas nunca oferece a assinatura.** `HeartsSheet` tem o botão
   "Ver assinatura", mas as três telas que a montam (`LessonFlowScreen`,
   `CheckpointScreen`, `JourneyHomeScreen`) passam `storeAvailable={false}` e
   `onSubscribe={() => undefined}`. Todo aluno lê "Assinatura indisponível
   neste aparelho", mesmo com o adaptador StoreKit pronto. Medido por `grep`
   em 2026-09-23. Se isso vale para a 1.4 é decisão do dono.

## Estado final

Mudança não comitada, sem push e sem build. O run e a sessão do cérebro estão
descritos na mensagem final da conversa.
