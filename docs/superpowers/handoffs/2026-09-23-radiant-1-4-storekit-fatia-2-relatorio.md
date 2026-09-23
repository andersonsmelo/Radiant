# Relatório — 1.4, Task 8, fatia 2: adaptador StoreKit por módulo local

**Data:** 2026-09-23 · **Branch:** `feat/storekit-adaptador-fatia-2`, criada de
`docs/storekit-modulo-local` sem upstream (PRs #15 e #16 abertos na medição) ·
**Run Loop:** `run-1790165894890-be3cd0ab` · **Plano:**
[`2026-09-23-radiant-1-4-storekit-fatia-2.md`](../plans/2026-09-23-radiant-1-4-storekit-fatia-2.md) ·
**Vermelhos:** [`…-fatia-2-vermelhos.md`](2026-09-23-radiant-1-4-storekit-fatia-2-vermelhos.md)

Nada foi comitado, empurrado, construído ou enviado.

## O que foi entregue

- **`StoreKit2Adapter`** (`src/features/subscription/`) atrás da `StoreKitPort`,
  com o módulo nativo simulado na fronteira. Só transação **verificada**, de
  produto **da ADR** e com expiração válida dá direito; entre várias, vence a
  que expira mais tarde; `revocationDate` → `revokedAt`; renovação desconhecida
  → `willRenew: false`; lista de produtos vazia → `store-unavailable`; produto
  fora da ADR não chega à Apple.
- **Módulo Swift `radiant-app/modules/radiant-storekit/`**: 1 arquivo Swift,
  podspec, `expo-module.config.json` só `apple`, `index.ts`, `package.json` sem
  dependência. Só StoreKit 2. `Transaction.updates` num `Task` criado no
  `OnCreate`; `finish()` em toda transação verificada tratada; nenhum
  identificador de transação atravessa a fronteira; nenhum log.
- **Ligação no ponto único**: `SubscriptionService` resolve o adaptador
  preguiçosamente por `resolveStoreKitAdapter()` (mesmo padrão do CloudKit);
  Android, Jest e Expo Go ficam com o indisponível. A abertura
  (`_layout.tsx`) liga `watchStoreUpdates` depois da migração e desliga na
  desmontagem.
- **`subscriptionProducts.ts`**: fonte única dos dois Product IDs da ADR.

## Dois defeitos achados e corrigidos

1. **IDs errados.** `SUBSCRIPTION_PRODUCT_IDS` vinha do `PaywallPlan`
   (`monthly_plus`/`annual_plus`); os IDs da ADR não existiam em
   `radiant-app/src`. Com o adaptador real, o app pediria à Apple dois produtos
   inexistentes, e a lista vazia pareceria "acordo inativo". Corrigido; guarda
   compara com a **tabela da ADR** lida por coluna.
2. **Reembolso mantinha o ilimitado.** `currentEntitlements` omite transação
   reembolsada (documentação da Apple), então o direito não volta com
   `revokedAt` — ele some. `refresh` gravava `null` e `applyToHearts` não tocava
   nas vidas: o `unlimitedUntil` antigo seguia até o fim do período (até um ano
   no anual). Agora a **transição** de ativo para ausente chama
   `setUnlimited(null)` uma vez. A mutação S2 mostra por que "só na transição":
   sem ela, todo não-assinante ganharia vidas cheias a cada abertura.

## Medido

- **Gate:** `EXPO_NO_DOTENV=1 npm run quality`, Node `v20.20.2`, em
  `radiant-app/` → `quality exit=0`; **132 suítes / 1163 testes**; Visual QA
  sem regressão. A árvore só continha os arquivos desta fatia, então a contagem
  é a do conjunto que será comitado.
- **Testes novos:** 50 (26 do adaptador, 6 de contrato, 15 do serviço, 3 da
  abertura). **27 execuções vermelhas** registradas, cada uma com o defeito
  específico reintroduzido, mais um contraponto (comentário com `console.log`
  não derruba a guarda de AST).
- **`tsc --listFiles`** inclui `modules/radiant-storekit/index.ts` e os cinco
  arquivos novos de `src/features/subscription/`.
- **Swift:** `swiftc -parse` ok; `-dump-parse` sem `print`/`NSLog`/`os_log`/
  `Logger`; `-typecheck` nos modos 5 e 6 contra o SDK `iPhoneSimulator27.0`
  **com stub do ExpoModulesCore** → código 0. A checagem reprova um nome de API
  errado do StoreKit (vermelho registrado).
- **Fontes da Apple** (DocC, 2026-09-23): `currentEntitlements` só emite
  assinatura `subscribed`/`inGracePeriod` e omite reembolsada/revogada;
  `subscriptionStatus` é `get async`, retroportado a iOS 15; `updates` entrega
  transações não finalizadas uma vez na partida; arquivo `.storekit`
  sincronizado com o App Store Connect existe desde o Xcode 14.

## Inferido, não medido

- Que o `OnCreate` do módulo roda na criação do `AppContext`, e portanto
  "desde a abertura": lido em `ModuleHolder.swift` (`expo-modules-core`
  3.0.29), não observado em aparelho.
- Que `NSNull` não é necessário: o Swift **omite** campo ausente e o TS trata
  ausência como "sem direito" — mesmo padrão do CloudKit, que funcionou em
  aparelho.

## NÃO verificado

- **Todo o Swift.** Nunca compilou contra o `ExpoModulesCore` real nem rodou.
  A checagem de tipos com stub confere as APIs do StoreKit, não a integração.
- **`willRenew` sem rede** (plano §1.1). Se `subscriptionStatus` não responder
  offline, o assinante sem rede vê "Cancelada · válida até dd/mm". O direito às
  vidas não depende disso.
- `product.purchase()` sem cena explícita: pode gerar aviso de depreciação em
  SDKs novos; não medido.
- Compra, Ask to Buy, restauração, renovação acelerada, reembolso — nada disso
  rodou.

## Quem passa a encontrar qual regra (plano §3, resumo)

| Estado | Quem | Veredito |
| --- | --- | --- |
| Ofertas disponíveis | todo iOS na tela de assinatura | desejado |
| Reembolso / revogação | assinante reembolsado | **corrigido** (defeito 2) |
| Expirada | assinante que expira | vidas CHEIAS garantidas pelo `HeartsService`; a copy "Assinatura expirada" só aparece até a próxima releitura, depois vira "Conhecer" |
| **Pendente (Ask to Buy) recusado** | menor em Compartilhamento Familiar | **armadilha permanente**: cartão sem botão, tela sem planos e sem Restaurar, e recusa não gera transação que limpe o estado. Estudo não é afetado. **Decisão do dono**, não corrigida |
| `willRenew` desconhecido | assinante sem rede, se a API não responder offline | copy "Cancelada"; medir no sandbox |

## Do dono — o que fecha esta fatia de verdade

1. **Build interno `development`** com o módulo novo — primeira compilação real
   do Swift.
2. **Sandbox no TestFlight**, ou o arquivo `.storekit` sincronizado em
   `radiant-app/modules/radiant-storekit/testing/RadiantIlimitado.storekit`
   (plano §1.2): compra, Ask to Buy, restauração, renovação acelerada e **modo
   avião** para medir `willRenew`.
3. **Acordo de apps pagos em *Ativo*** no App Store Connect.
4. **Decidir a saída do pendente recusado** (validade do pendente, ou mostrar
   planos e Restaurar no estado pendente).

## Estado final

Run e sessão do cérebro: ver o fim da conversa que produziu este relatório;
`docs/STATUS.md` e `docs/FILA.md` foram atualizados na mesma passagem.
