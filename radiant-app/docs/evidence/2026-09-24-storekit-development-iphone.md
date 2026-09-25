# Evidência — StoreKit no iPhone com iOS 27.2, build `development` (2026-09-24)

**Item:** 4 da lista de pendências da 1.4, "o que fecha a fatia 2" na
[FILA](../../../docs/FILA.md).  
**Quem executou:** o dono, no aparelho, das 18:02 às 21:03 (−03). O agente
conduziu o roteiro, subiu o Metro e mediu pelo Mac.  
**Aparelho:** iPhone 16 (`iPhone17,3`), **iOS 27.2** build `24B5089g`, com o
Modo de Desenvolvedor ligado. Medido com `xcrun devicectl`.

## A build

| Tentativa | Id no EAS | Commit | Resultado |
|---|---|---|---|
| 1 | `0a545c74-4292-448a-8f0c-12a055042d20` | `c4be0c8` | `XCODE_BUILD_ERROR` no `sentry-cli`: faltava a organização do Sentry para enviar os source maps. O perfil `development` não desligava esse envio |
| 2 | `ac4b49df-35c8-4c26-8879-91ed5461b4ea` | `fd0c630` | `FINISHED`, depois do conserto do perfil (`SENTRY_DISABLE_AUTO_UPLOAD`, com contrato) |

- Perfil `development`, imagem `macos-sequoia-15.6-xcode-26.0`, app 1.3.1,
  build 11.
- **A tentativa 2 é a primeira compilação real do Swift de
  `modules/radiant-storekit`.**
- A tentativa 1 não mediu o Swift: o log do Xcode dela voltou `NoSuchKey` no
  armazenamento da Expo.
- O eas-cli do projeto (16.32) imprimiu "Build request failed" na tentativa 1
  com a build já criada. A build foi conferida no `build:list` antes de
  qualquer nova tentativa.

## Metro

- Node 20, com as flags de homologação do `scripts/start-ios-v2.sh` e
  `npx expo start --dev-client`. A checagem de precedência de ambiente passou.
- Foram necessárias duas reconexões:
  - o endereço do Wi-Fi que o agente passou primeiro estava velho;
  - depois que o adaptador de rede USB saiu, o Mac voltou ao Wi-Fi com outro IP
    e ficou sem alcançar o iPhone (0 de 3 pings, sem entrada ARP);
  - numa reconexão seguinte, na mesma rede, o ping passou (3 de 3), com o
    endereço físico do iPhone na tabela ARP.
- **A hipótese de isolamento de clientes na rede foi descartada.**

## Medido

| Ponto do roteiro | Resultado | Como foi medido |
|---|---|---|
| O app abre no iOS 27.2 | ✅ | O processo continuou vivo cerca de 20 s depois da carga. O Metro entregou 2177 módulos em 7,4 s |
| Planos e preços vindos da Apple | ✅ | Os dois planos apareceram. Com a conta de teste do Brasil: **R$ 19,90/mês** e **R$ 149,90/ano**, iguais à ADR de produtos |
| Compra mensal no sandbox | ✅ | A folha da Apple dizia "Apenas para fins de teste. Você não será cobrado" |
| Tela e cartão de assinante | ✅ | "Você é assinante"; no Perfil, "Assinante · vidas ilimitadas · Renova em …" e "Vidas · Assinante: ilimitadas" |
| HUD da trilha | ✅ | ∞ no lugar das vidas |
| Renovação acelerada | ✅ | Conta de teste do Brasil com renovação mensal a cada 5 minutos: "Renova em 24/09/2026", o mesmo dia |
| Expiração sozinha | ✅ | Por volta de uma hora depois da compra, a tela voltou aos planos e o HUD voltou a **5 vidas**, sem ação do aluno |
| Reinstalar e reconhecer a assinatura | ✅ | O caminho do pacote mudou de `199BAD98-…` para `080AE48F-…`. O Perfil mostrou o cartão de assinante **sem tocar em Restaurar** |

## Não verificado

- **Plano anual:** não foi comprado. Só o preço foi visto.
- **Cancelamento:** no iOS 27.2 (`24B5089g`), os Ajustes fecham, ou mostram
  "Não é possível conectar", ao abrir o gerenciamento da conta sandbox. Foram
  tentadas as entradas por Desenvolvedor e por App Store. O texto "Cancelada"
  só tem cobertura de teste automatizado.
- **O botão Restaurar compras:** não foi preciso tocar nele depois da
  reinstalação.
- **Reembolso:** no sandbox, o pedido só sai de dentro do app, pelo
  `beginRefundRequest`, e o app não tem essa entrada.
- **Ask to Buy:** precisa de um grupo familiar no sandbox.
- **Modo avião:** saiu do roteiro por decisão do dono
  ([ADR](../../../docs/adr/ADR-2026-09-24-storekit-roteiro-no-aparelho.md)).
- **VoiceOver (item 4b):** não foi feito nesta sessão.
- **A primeira compra da sessão** foi feita com o Apple ID real do dono no
  ambiente sandbox, sem cobrança. O Apple ID real não tem renovação acelerada,
  e a data "Renova em 25/09/2026" dessa compra não serve de evidência. As
  medições acima usam a conta de teste.

## Achados

Nenhum bloqueia a 1.4. Todos foram registrados na FILA.

1. **Preço de outra loja até o app recarregar.**
   - **O que aconteceu:** os preços carregados antes do login ficaram em
     **US$ 2,99 / US$ 22,99**, enquanto a folha da Apple cobrava
     **R$ 19,90**. Depois de recarregar, os preços vieram em reais.
   - **Pelo código:** o módulo não observa a troca de loja, pois não há
     referência a `Storefront`.
2. **Estado de renovação desconhecido aparece como "Cancelada".** Só pelo
   código, sem medição:
   - `willAutoRenew` devolve `nil` quando o iOS não informa a renovação
     (`RadiantStoreKitModule.swift:175-178`);
   - o adaptador converte isso em `false` (`willAutoRenew === true`,
     `StoreKit2Adapter.ts:41`);
   - o resultado é que o cartão diz "Cancelada" a um assinante pagante. As
     vidas ilimitadas não são afetadas.
3. **"Gerenciar" não gerencia.** O botão do cartão no Perfil abre a tela
   interna, que só manda o aluno aos Ajustes. A folha da Apple dentro do app
   (`showManageSubscriptions`) é a alternativa. É decisão de produto.
4. **Aquecimento.** O dono relatou o aparelho "extremamente quente" com a
   build `development` enquanto carregava.
   - **Hipótese, não medida:** o `StarfieldBackground` mantém de 90 a 120
     animações em repetição infinita, mais três nebulosas, e as abas visitadas
     continuam montadas.
   - **Por que não foi medido:** o Instruments deste Mac (Xcode 27.0) não
     alcançou o iOS 27.2.
   - **Teste que separaria as causas:** fora do carregador, 5 minutos com e
     sem Reduzir Movimento.
