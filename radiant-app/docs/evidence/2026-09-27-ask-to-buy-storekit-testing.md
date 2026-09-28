# Evidência — Ask to Buy no StoreKit Testing do Xcode, no simulador (2026-09-27)

**Item:** 5 da ordem de prioridade da [FILA](../../../docs/FILA.md), pela
[ADR de 2026-09-25](../../../docs/adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md),
item 3. O comportamento conferido é o da
[ADR de 2026-09-23](../../../docs/adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md),
item 5: o pendente é aviso, não trava.

**Quem executou:** o agente, das 19:36 às 19:45 (−03), sem o aparelho e sem
tempo do dono. A condição de pronto foi combinada com o dono antes do run:
(a) o módulo Swift funciona sob o StoreKit Testing; (b) o pendente aparece,
com planos e Restaurar; (c) o aprovado chega por `Transaction.updates` e vira
∞ sem reabrir o app; (d) o recusado não trava nada.

## Ambiente

- Xcode 27.0 (`27A266a`); simulador "iPhone 17 (iOS 26.5)",
  `E3C547AE-4D2B-4C2D-9E0A-43AC36BBD1AD`.
- Build Debug por `xcodebuild`, com os contornos do STATUS
  (`IPHONEOS_DEPLOYMENT_TARGET=15.1`, `RUBYOPT=-rlogger`,
  `SENTRY_DISABLE_AUTO_UPLOAD=true`), e lançada pelo Xcode com
  **Product → Perform Action → Run Without Building**. Metro no Node
  `v20.20.2`, com as variáveis e a checagem do `scripts/start-ios-v2.sh`.
- **O arquivo de configuração** é o
  [`RadiantIlimitado.storekit`](../../modules/radiant-storekit/testing/RadiantIlimitado.storekit),
  local e escrito à mão pelo agente. O dono decidiu em 2026-09-27 que ele não
  seria sincronizado com o App Store Connect. O formato saiu das chaves que o
  parser do próprio Xcode reconhece (`IDEStoreKitCore`). Ele traz o grupo
  "Radiant Ilimitado", os dois produtos da ADR com R$ 19,90 e R$ 149,90, a
  loja `BRA` e **o Ask to Buy ligado** (`_askToBuyEnabled`). A guarda
  `storekitTestingConfig.contract.test.ts` amarra os IDs e os períodos a
  `subscriptionProducts.ts`.

### Como repetir

1. `radiant-app/ios/` é gerada e ignorada. Copie o arquivo para
   `radiant-app/ios/RadiantIlimitado.storekit` e acrescente ao `LaunchAction`
   do esquema `Radiant.xcscheme`:

   ```xml
   <StoreKitConfigurationFileReference
      identifier = "../RadiantIlimitado.storekit">
   </StoreKitConfigurationFileReference>
   ```

   O caminho é relativo ao `Radiant.xcodeproj`. Um `prebuild --clean` apaga
   a marcação.
2. Compile com `xcodebuild`, sem `-derivedDataPath`, para que o Xcode ache o
   produto, e lance pelo Xcode com o destino no simulador. **Lançado pelo
   `simctl`, o arquivo não vale.**
3. Para outro fluxo sem Ask to Buy, desligue no editor do arquivo, no Xcode.

## Medido

| # | O que | Resultado | Onde se vê |
|---|---|---|---|
| a | **O módulo Swift funciona sob o StoreKit Testing** | ✅ | A tela carregou os dois planos, e a folha de compra saiu com o título "Xcode" e "For testing purposes only". O Transaction Manager registrou as compras do app ([01](2026-09-27-ask-to-buy-storekit-testing/01-folha-xcode-mensal.png)) |
| b | Pedido pendente | ✅ | O diálogo "Ask Permission · [Environment: Xcode]" ([02](2026-09-27-ask-to-buy-storekit-testing/02-ask-permission.png)). Depois de "Ask", apareceu o aviso "Pedido enviado para aprovação", com os dois planos ([03](2026-09-27-ask-to-buy-storekit-testing/03-pendente-aviso.png)) e o Restaurar ([04](2026-09-27-ask-to-buy-storekit-testing/04-pendente-restaurar.png)) |
| d | **Pedido recusado**, às 19:40 | ✅ | No Xcode: "Status: Declined", "State: Ask to Buy Declined". O app não é avisado, como a Apple documenta. O aviso e os planos continuaram ([05](2026-09-27-ask-to-buy-storekit-testing/05-recusado-aviso-e-planos.png)), e o Perfil mostrou "Pedido aguardando aprovação" com "Ver" e as 5 vidas ([06](2026-09-27-ask-to-buy-storekit-testing/06-recusado-perfil-ver.png)) |
| c | **Pedido aprovado**, às 19:42 (pedido feito às 19:41:41) | ✅ | No Xcode: "Status: Purchased", "State: Ask to Buy Approved". O app releu o direito às 19:42:13, e o HUD da trilha mostrou **∞ sem reabrir o app** ([07](2026-09-27-ask-to-buy-storekit-testing/07-aprovado-hud-infinito.png)) |

**O estado gravado depois da aprovação**, lido do `RCTAsyncLocalStorage_V1`
do app, sem passar pela tela:

```text
@radiant:subscription_v1 => {"schemaVersion":1,"entitlement":{"productId":"com.andersonmelo.radiant.ilimitado.mensal","period":"monthly","expiresAt":"2026-10-27T22:41:41.317Z","willRenew":true,"revokedAt":null},"pendingSince":null,"checkedAt":"2026-09-27T22:42:13.733Z"}
@radiant:hearts_v1 => {"count":5,"lastRefillAt":null,"unlimitedUntil":"2026-10-27T22:41:41.317Z"}
```

**Por que a releitura das 19:42:13 foi o aviso de `Transaction.updates`:** o
`refresh` tem três gatilhos: a abertura do app (19:36), a montagem da tela da
assinatura (19:41, antes do pedido) e o ouvinte ligado em
`src/app/_layout.tsx:176`. Só este último podia rodar depois da compra.
Inferência por eliminação, sem log dedicado.

## Achado — a tela da assinatura não atualizava com a aprovação

Com a tela da assinatura **aberta** no momento da aprovação, ela continuou
mostrando "Pedido enviado para aprovação" e os botões "Assinar"
([08](2026-09-27-ask-to-buy-storekit-testing/08-aprovado-tela-assinatura-parada.png), 19:42,
depois da aprovação). O cache e o HUD já estavam em ∞.

- **Causa:** a tela lia o estado só ao montar (`SubscriptionScreen.tsx`, o
  `refresh` do primeiro efeito) e não escutava o aviso da loja.
- **Impacto:** só visual. O direito nunca se perdeu. Na vida real a aprovação
  costuma vir horas depois, com o aluno fora dessa tela.
- **Conserto, no mesmo run, por decisão do dono:**
  - `watchStoreUpdates` passou a entregar o estado relido a quem escuta;
  - a tela escuta e atualiza, e para de escutar ao fechar.
  - Os testes foram vistos vermelhos antes, pelo defeito: "Unable to find an
    element with text: Você é assinante", "Number of calls: 0". O
    cancelamento da escuta também foi visto vermelho, com o defeito injetado.

### Reconferência do conserto no simulador

✅ **Feita às 22:10–22:11**, depois que o dono desbloqueou o Mac:
1. as duas transações de teste foram apagadas no Transaction Manager, e o app
   foi relançado pelo Xcode com o JS do conserto. Voltou a 5 vidas;
2. com a tela da assinatura aberta, um pedido novo do mensal ("Ask") mostrou
   "Pedido enviado para aprovação";
3. aprovado no Xcode às 22:10:20 ("Ask to Buy Approved"), **a mesma tela
   passou sozinha a "Você é assinante · Renova em 27/10/2026"**, com
   "Gerenciar assinatura", sem ser fechada
   ([09](2026-09-27-ask-to-buy-storekit-testing/09-conserto-tela-atualiza.png)).

## Não verificado

- **O sumiço do aviso depois de 24 h:** depende do relógio. Continua coberto
  pela suíte (`ASK_TO_BUY_WINDOW_MS`).
- **O aparelho e o sandbox com grupo familiar:** a ADR trocou os dois pelo
  StoreKit Testing. O que o StoreKit Testing não reproduz, e que o agente não
  mediu, é a conta do responsável num segundo aparelho.
- **Se o `finish()` do ouvinte Swift rodou:** o Transaction Manager mostra o
  estado do Ask to Buy no lugar de "Finished" ou "Unfinished".
- **O Transaction Manager do Xcode 27 mostra dados velhos:** o pedido pendente
  apareceu como "Purchased" até a janela ser fechada e aberta de novo, e só
  então virou "Pending Approval" e liberou "Approve" e "Decline".
