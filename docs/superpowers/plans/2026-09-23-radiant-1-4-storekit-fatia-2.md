# Plano — 1.4, Task 8, fatia 2: adaptador StoreKit 2 por módulo local

**Data:** 2026-09-23 · **Decisão de origem:**
[ADR-2026-09-23](../../adr/ADR-2026-09-23-storekit-modulo-expo-local.md) ·
**Produtos:** [ADR-2026-09-15](../../adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md) ·
**Run Loop:** `run-1790165894890-be3cd0ab`

Plano curto de propósito. Registra as decisões que a ADR deixou **a verificar**,
o contrato da fronteira nativa e a enumeração de quem passa a encontrar cada
estado. Se o código divergir deste texto, o relatório da fatia registra a
divergência; este plano não é reescrito para parecer certo.

## 0. Achado de medição antes de planejar

`SUBSCRIPTION_PRODUCT_IDS` (`SubscriptionService.ts:28`) derivava de
`PaywallPlan.offers.*.id`, que são `monthly_plus` e `annual_plus` — **não** os IDs
da ADR de produtos. Nenhum arquivo de `radiant-app/src` continha
`com.andersonmelo.radiant.ilimitado.*` em 2026-09-23. Com o adaptador real, o app
pediria à Apple dois produtos inexistentes. A correção desta fatia: os IDs da ADR
passam a morar em `subscriptionProducts.ts`, fonte única, e o `PaywallPlan` (que
alimenta a telemetria de interesse, `offerId`) não é tocado.

## 1. Os dois pontos que a ADR deixou abertos

### 1.1 `willRenew` sem rede — **não medido; valor conservador `false`**

Fontes lidas em 2026-09-23 (documentação da Apple, JSON do DocC):

- `Transaction.currentEntitlements` emite a última transação de cada assinatura
  auto-renovável "que tem um `RenewalState` de `subscribed` ou `inGracePeriod`",
  e "produtos que a App Store reembolsou ou revogou não aparecem". (iOS 15+)
- `AppStore.sync()`: "StoreKit automatically keeps up to date transaction
  information and subscription status available to your app."
- `Transaction.subscriptionStatus`: array de status do grupo, com renovação e
  transação.

Nenhuma fonte encontrada afirma se `subscriptionStatus` / `RenewalInfo` responde
**sem rede**. "Mantém disponível" sugere cache local, mas é inferência. Decisão:

- O Swift tenta `transaction.subscriptionStatus`, lê `renewalInfo` **só se
  verificado**, e devolve `willAutoRenew: Bool?` — `nil` quando a chamada falha,
  não devolve status do grupo ou o `renewalInfo` não verifica.
- O TypeScript traduz `nil` → `willRenew: false`. A porta não promete renovação
  que a Apple não confirmou.
- **Consequência nomeada:** assinante que abre o app sem rede, **se** a API não
  responder offline, vê "Cancelada · válida até dd/mm" no Perfil e na tela de
  assinatura. O direito de uso (vidas) não depende de `willRenew`. A medição é
  do dono, no sandbox: abrir com modo avião e ler o cartão. Se aparecer
  "Cancelada", a copy do estado `willRenew: false` precisa de decisão (texto
  neutro "Válida até dd/mm").

### 1.2 Onde mora o arquivo `.storekit` — **decidido, arquivo a gerar pelo dono**

- **Onde:** `radiant-app/modules/radiant-storekit/testing/RadiantIlimitado.storekit`.
  Fica ao lado do módulo que ele testa, dentro de `writePolicy.allowedRoots`
  (`radiant-app/modules`) e **fora** do glob do podspec
  (`**/*.{h,m,mm,swift,hpp,cpp}`), então não entra no binário.
- **Como nasce:** pelo Xcode (14+), *File → New → StoreKit Configuration File*
  com **Sync with App Store Connect**. O arquivo sincronizado espelha o grupo e
  os dois produtos da ADR, e evita digitar à mão IDs e preços que podem divergir.
  Exige login da conta do dono no Xcode: é do dono, e esta fatia **não** cria o
  arquivo. Fonte: Apple, *Setting up StoreKit Testing in Xcode* — arquivos
  locais e, "in Xcode 14 and later, synced"; o sincronizado é somente leitura e
  se atualiza pelo botão *Sync*.
- **Como chega ao projeto Xcode:** sem config plugin. O arquivo `.storekit` só
  vale para execução local pelo Xcode — build EAS e TestFlight usam o sandbox,
  não o arquivo. Após `npx expo prebuild` / `npx expo run:ios`: abrir
  `ios/Radiant.xcworkspace` → *Product → Scheme → Edit Scheme → Run → Options →
  StoreKit Configuration* → escolher o arquivo. O esquema vive em `ios/` (não
  versionado) e um `prebuild --clean` apaga a escolha; ela é refeita à mão. Um
  plugin só se justificaria se o teste com `.storekit` virasse rotina de CI, e
  não é.

## 2. Contrato da fronteira nativa

Lição do CloudKit (PR #14): **o Swift copia, o TypeScript julga**. Toda regra
(verificação, produto da ADR, escolha entre transações, tradução de resultado)
mora no TS, onde é testável; o Swift não roda nesta máquina.

| Função nativa | Devolve |
| --- | --- |
| `loadProducts(ids)` | `[{ id, displayName, displayPrice }]` |
| `currentEntitlements()` | `[{ productId, expirationDate, revocationDate, verified, willAutoRenew }]` — **inclui** não verificadas, marcadas |
| `purchase(productId)` | `{ kind: 'success', transaction }` \| `{ kind: 'pending' }` \| `{ kind: 'userCancelled' }`; erro com `code` |
| `sync()` | `void`; erro com `code` |
| evento `onTransactionsUpdated` | corpo vazio — nada de identificador atravessa |

Regras do Swift (ADR, regras 2–5):

- Só StoreKit 2; `Product.products(for:)`, `product.purchase()`,
  `Transaction.currentEntitlements`, `AppStore.sync()`, `Transaction.updates`.
- `finish()` em toda transação **verificada** tratada (compra e `updates`).
  Transação não verificada não é concedida nem finalizada — é o padrão do
  exemplo da Apple *Implementing a store in your app using the StoreKit API*, em
  que `checkVerified` lança antes do `finish()`.
- `Transaction.updates` escutado num `Task` criado no `OnCreate` do módulo. O
  `ModuleHolder` do `expo-modules-core` 3.0.29 dispara `moduleCreate` no
  registro do provedor de módulos, na criação do `AppContext` — lido no código,
  não medido em aparelho.
- Nenhum `print`, `NSLog`, `os_log` ou `Logger`; nenhum identificador de
  transação no retorno (não há `id`, `originalID` nem `appAccountToken` no
  contrato).

Tradução no TS (`StoreKit2Adapter`):

- **Direito** = transação verificada, de produto da ADR, com `expirationDate`
  válida. Entre várias, a de expiração mais tarde. Não verificada, produto
  desconhecido ou sem expiração → ignorada. `revocationDate` → `revokedAt`.
- **Período** vem da tabela da ADR, nunca do nativo.
- `loadProducts` vazio → `StoreUnavailableError` (acordo inativo ou IDs errados
  deixam a lista vazia; a tela já sabe mostrar "a loja não respondeu").
- Compra: sucesso verificado → `purchased`; sucesso não verificado → `failed`;
  `pending` → `pending`; `userCancelled` → `cancelled`; erro nativo → `failed`;
  produto fora da ADR → `failed` sem chamar o nativo.
- Restaurar: `sync()` e depois `currentEntitlements()`; falha do `sync` ainda lê
  o local.
- Módulo ausente (Android, Jest, Expo Go) → `UnavailableStoreKitAdapter`.

## 3. Quem passa a encontrar qual regra

Hoje todo usuário recebe `store-unavailable`. Ligar o adaptador real troca isso
por estados reais para **todo usuário iOS**. As regras abaixo não são editadas
pelo diff da ligação — por isso ficam enumeradas aqui.

| Estado agora alcançável | Quem passa a vê-lo | O que o código faz com ele | Veredito |
| --- | --- | --- | --- |
| Ofertas `available` | todo iOS que abre a tela de assinatura (Perfil ou "Ver assinatura" da Barreira) | lista os planos com preço da Apple | desejado |
| `refresh` com direito `null` | todo iOS sem assinatura, a cada abertura | grava `entitlement: null`; status `none`; vidas intocadas | equivalente ao de hoje |
| **Direito some antes da data** (reembolso, revogação) | assinante reembolsado | `currentEntitlements` omite o revogado → `refresh` grava `null` → `none`, e `applyToHearts` **não toca** nas vidas: `unlimitedUntil` antigo continua no futuro e o ilimitado segue até o fim do período (até um ano no anual) | **defeito promovido — corrigido nesta fatia**: a transição de ativo para ausente chama `setUnlimited(null)` uma vez |
| `expired` | assinante que expira | como `currentEntitlements` omite expirada, `refresh` grava `null` → `none`; o `HeartsService` já resolve `unlimitedUntil` vencido para CHEIA sozinho. O texto "Assinatura expirada / Renovar" só aparece entre a data e a próxima releitura | a promessa da spec (CHEIA) se mantém; a copy de expirada vira rara — relatado, não corrigido |
| `pending` (Ask to Buy) | conta de menor em Compartilhamento Familiar com Ask to Buy | grava `pendingSince`; o cartão do Perfil fica **sem botão**; a tela mostra "Pedido enviado" **sem planos e sem Restaurar**; `refresh` só limpa `pendingSince` se chegar direito. Recusa do responsável não gera transação | **armadilha permanente para quem teve o pedido recusado** — decisão de produto do dono (validade do pendente, ou mostrar planos no pendente); **não** corrigida aqui |
| `unlimited` com `willRenew: false` por desconhecido | assinante que abre sem rede, **se** a API não responder offline (§1.1) | "Cancelada · válida até" | relatado; medição do dono |
| `expired` persistido + `setUnlimited(null)` a cada abertura | só quando o direito vencido **fica** no cache: a loja lança erro não-`unavailable` | `applyToHearts` devolve vidas CHEIAS a cada abertura | com o adaptador real, só no caminho de erro; relatado |

## 4. Guardas desta fatia

- **Validade, não diferença:** o teste do adaptador asserta o que o direito
  **é** — produto da ADR, período da tabela, expiração da transação, não
  verificada ignorada, revogação traduzida.
- **Dado estruturado, não regex:** "zero dependência npm" lê o `package.json`
  do módulo e o da aplicação como JSON; "módulo só apple" lê o
  `expo-module.config.json` como JSON; "IDs da ADR" lê a tabela da ADR.
- **Nenhum log de transação:** no TS, AST pelo compilador `typescript` sobre o
  adaptador e o `index.ts` do módulo (nenhuma chamada `console.*`). No Swift,
  sem AST no gate: medição única com `swiftc -dump-parse`, relatada como
  medição, não como guarda.
- **Cada guarda vista falhando** com o defeito que ela nomeia, registrada em
  `docs/superpowers/handoffs/2026-09-23-radiant-1-4-storekit-fatia-2-vermelhos.md`.

## 5. Fora desta fatia

Build, sandbox, arquivo `.storekit`, acordo de apps pagos (do dono); a
armadilha do `pending` e a copy de `willRenew` desconhecido (decisão do dono);
fatias 3 e 4.
