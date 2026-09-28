# Ask to Buy no StoreKit Testing — relatório de 2026-09-27

Item **5** da ordem de prioridade
([FILA](../../FILA.md#ordem-de-prioridade-combinada-em-2026-09-25)), pela
[ADR de 2026-09-25](../../adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md),
item 3, a partir do
[prompt (7)](2026-09-27-radiant-prompt-de-continuidade-7.md). Run do Loop:
`run-1790549292982-036901fc`.

**Condição de pronto, combinada com o dono antes do run.** No simulador iOS
26.5, lançado pelo Xcode com o `.storekit`:
- **a.** o módulo carrega os produtos, o que prova que o Swift funciona sob o
  StoreKit Testing;
- **b.** o pendente aparece, com planos e Restaurar;
- **c.** o aprovado chega por `Transaction.updates` e vira ∞ sem reabrir o
  app;
- **d.** o recusado não trava nada.

Além disso, o registro: evidência, `.storekit` versionado, STATUS, FILA e
roadmap, e o gate com o `loop validate`.

**Decidido pelo dono nesta conversa:**
- o `.storekit` é local e escrito pelo agente, com uma guarda de IDs, e não
  sincronizado com o App Store Connect, como previa o plano da fatia 2 (§1.2);
- o achado da tela da assinatura é consertado neste run.

## Medido

Os quatro critérios passaram
([evidência](../../../radiant-app/docs/evidence/2026-09-27-ask-to-buy-storekit-testing.md)).

- **a:** a folha de compra saiu com "Xcode · For testing purposes only".
- **b:** saiu "Ask Permission · [Environment: Xcode]", e depois o aviso
  "Pedido enviado para aprovação", com os planos e o Restaurar.
- **d:** o Xcode marcou "Ask to Buy Declined". O app seguiu com o aviso e os
  planos, e o Perfil com "Pedido aguardando aprovação · Ver".
- **c:** o Xcode marcou "Ask to Buy Approved". O cache passou a ter o direito
  mensal com `pendingSince: null`, as vidas ganharam `unlimitedUntil`, e o HUD
  da trilha mostrou ∞ sem reabrir o app.
- **O conserto, na tela:** às 22:10, com as transações apagadas e o app
  relançado, um pedido novo aprovado com a tela da assinatura aberta a levou
  sozinha a "Você é assinante · Renova em 27/10/2026". Às 19:42, antes do
  conserto, a mesma situação deixava a tela no pendente. Entre as duas
  medições, a tela do Mac ficou bloqueada das 19:50 às 22:08.

**Gate** (`EXPO_NO_DOTENV=1 npm run quality`, Node `v20.20.2`, às 20:00):
exit 0, **152 suítes / 1450 testes**, lint com 0 erros e 26 avisos, visual
QA sem regressão. Em relação a 2026-09-26 (151 / 1446), a diferença é
exatamente o que este run acrescenta: 1 suíte (a guarda) e 4 testes.

## O que mudou

- **`modules/radiant-storekit/testing/RadiantIlimitado.storekit`:** o arquivo
  medido, byte a byte. Tem um grupo, os dois produtos, a loja `BRA` e o Ask to
  Buy ligado.
- **`storekitTestingConfig.contract.test.ts`:** a guarda lê o JSON e exige um
  grupo só, "Radiant Ilimitado", e os mesmos IDs e períodos de
  `subscriptionProducts.ts`.
- **O achado e o conserto:**
  - com a tela da assinatura aberta, a aprovação não aparecia nela, embora o
    cache e o HUD já estivessem em ∞;
  - `watchStoreUpdates` ganhou `onStatus`, que recebe o estado relido;
  - a `SubscriptionScreen` escuta o aviso e para de escutar ao fechar;
  - o ouvinte de `_layout.tsx` não mudou.
- **Swift:** só o comentário de cabeçalho, com o que foi verificado e onde.
- **Plano da fatia 2, §1.2:** ganhou uma nota dizendo que "como nasce" foi
  superado.

## Vermelhos

Todos rodados com o arquivo **de teste** no Jest, no Node 20.

| Guarda | Defeito | Falha observada |
|---|---|---|
| Serviço: `onStatus` recebe o estado relido | antes do código | "Number of calls: 0" |
| Tela: aprovado com a tela aberta | antes do código | "Unable to find an element with text: Você é assinante" |
| Tela: fechar para de escutar | `parar()` tirado da limpeza, e depois restaurado | "Expected number of calls: 1 · Received: 0" |
| `.storekit`: produtos do app | ID `…anual` → `…anuall` | `+ "com.andersonmelo.radiant.ilimitado.anuall": "annual"` |
| `.storekit`: períodos do app | mensal `P1M` → `P1Y` | `+ "com.andersonmelo.radiant.ilimitado.mensal": "annual"` |
| `.storekit`: um grupo só | nome → "Radiant Plus" | `+ "Radiant Plus"` |

Os blocos de console da suíte da assinatura são os mesmos antes e depois:
1 bloco, com os avisos de `act` do `AppButton` que já existiam.

## Não verificado, ou inferido

- **Inferido por eliminação:** que a releitura das 19:42:13 veio do aviso de
  `Transaction.updates`. Os outros dois gatilhos do `refresh` rodaram antes do
  pedido. Não há log dedicado.
- **Não visto:** o sumiço do aviso depois de 24 h. Depende do relógio e
  continua coberto pela suíte.
- **Não visto:** se o `finish()` do ouvinte Swift rodou. O Transaction Manager
  mostra o estado do Ask to Buy no lugar do estado de finalização.
- **Fora do StoreKit Testing:** a conta do responsável num segundo aparelho,
  que a ADR trocou pelo Xcode.

## Ambiente, para quem repetir

Os passos estão na evidência, em "Como repetir". Os detalhes do Xcode 27
nesta máquina:
- a IDE só aceita cliques;
- o lançamento é por Run Without Building;
- o Transaction Manager mostra dado velho até ser reaberto;
- o `screencapture` abre um pedido de gravação de tela, então não use.

`radiant-app/ios/` ficou com o `.storekit` e o esquema marcado. Os dois são
ignorados pelo git, e o backup do esquema está no scratchpad desta sessão.

## Próximo

- **Agente:** o **25**, anunciar a perda de vida ao leitor de tela. Depois
  dele, o 20 (bump), se o dono concordar.
- **Dono:** nada deste item.

## Revisão da PR #38 (2026-09-27, à noite)

O revisor automático da PR ([andersonsmelo/Radiant#38](https://github.com/andersonsmelo/Radiant/pull/38))
apontou dois defeitos. Os dois foram confirmados no código e consertados no
run `run-1790558846552-7c4a9040`, com teste vermelho antes:

- **`scripts/content/classify-source.py`, `_validate_placement`:** uma
  decisão `place` aprovada com galáxia e planeta nulos passava, porque
  `planet_galaxy.get(None)` é `None`. O mesmo acontecia com um planeta
  inexistente e galáxia nula. O registro saía aprovado sem destino.
  - Agora a validação exige galáxia não nula e planeta que exista na
    taxonomia.
  - Vermelho: "ValueError not raised" nos dois casos.
  - As 18 decisões `place` reais da fonte versionada continuam válidas.
- **`SubscriptionScreen`:** a carga de ofertas da abertura e a da troca de
  loja corriam sem ordem. Se a da abertura, com a moeda antiga, chegava por
  último, ela sobrescrevia os preços certos.
  - Agora um contador de geração deixa só a carga mais recente escrever.
  - Vermelho: "Unable to find an element with text: R$ 19,90", com
    "US$ 2,99" na tela.

**Gate depois da revisão** (Node `v20.20.2`): exit 0, **152 suítes / 1451
testes**. É um teste Jest a mais que às 20:00, o da tela; o teste Python roda
fora do Jest. Lint com 0 erros e 26 avisos, visual QA sem regressão. O
arquivo `classify-source.test.py` passou inteiro, com 25 testes.
