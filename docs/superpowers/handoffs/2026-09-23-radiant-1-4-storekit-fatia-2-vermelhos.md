# Vermelhos registrados — 1.4, Task 8, fatia 2 (2026-09-23)

Evidência do passo vermelho de cada teste e guarda desta fatia, exigida pelo
prompt de continuidade ("'falhou antes' em prosa é inauditável"). Gerado a
partir dos logs brutos das execuções; cada entrada traz o comando, o defeito
introduzido e o que falhou.

- **Ambiente:** Node `v20.20.2`, `radiant-app/`, `npx jest <arquivo>` (a suíte do
  arquivo; o gate completo roda depois, em banda única).
- **Método:** para os testes escritos antes do código, o vermelho é o do
  esqueleto. Para cada guarda de validade, o defeito **específico** que ela
  nomeia foi reintroduzido depois do verde, a execução foi registrada e o
  arquivo foi restaurado (`cmp` confirmou os bytes originais; o `package.json`
  do app não aparece no `git status`).
- **Verde final:** `EXPO_NO_DOTENV=1 npm run quality` → `quality exit=0`,
  132 suítes / 1163 testes, Visual QA sem regressão.

## Adaptador — esqueleto (falta a funcionalidade)

### `adapter-skeleton`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** `StoreKit2Adapter.ts` com todos os métodos lançando `Error("não implementado")`
- **Resultado:** `Tests:       26 failed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — produtos › entrega os dois planos da ADR com o período da tabela e o preço da Apple
  - StoreKit2Adapter — produtos › descarta produto que não está na ADR, mesmo que a Apple o devolva
  - StoreKit2Adapter — produtos › lista vazia é loja indisponível, não uma tela de planos sem planos
    - `expect(received).toBe(expected) // Object.is equality`
    - `Expected: true`
    - `Received: false`
  - StoreKit2Adapter — direito atual › transação verificada de produto da ADR vira o direito, com o período da tabela
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › transação NÃO verificada não dá direito, mesmo sendo a única
    - `expect(received).resolves.toBeNull()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › não verificada não vence a verificada, mesmo expirando depois
  - StoreKit2Adapter — direito atual › produto fora da ADR não dá direito
    - `expect(received).resolves.toBeNull()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › transação revogada traduz a data de revogação para a porta
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › transação expirada passa com a data real; quem decide que expirou é o serviço, com o relógio
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › entre duas válidas, vence a que expira mais tarde
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › renovação desconhecida vira willRenew false: a porta não promete o que a Apple não confirmou
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › transação sem data de expiração válida não dá direito
    - `expect(received).resolves.toBeNull()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — direito atual › sem transação nenhuma, sem direito
    - `expect(received).resolves.toBeNull()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — compra › compra verificada devolve o direito do produto comprado
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — compra › compra com transação NÃO verificada é falha, sem direito
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — compra › Ask to Buy fica pendente
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — compra › desistência da pessoa é cancelamento, não falha
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — compra › erro nativo vira falha com o código estável
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — compra › produto fora da ADR falha sem chegar à Apple
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — restaurar › sincroniza com a App Store antes de ler o direito local
  - StoreKit2Adapter — restaurar › nada a restaurar devolve null
    - `expect(received).resolves.toBeNull()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — restaurar › se a sincronização falhar, ainda lê o que já está no aparelho
    - `expect(received).resolves.toEqual()`
    - `Received promise rejected instead of resolved`
    - `Rejected to value: [Error: não implementado]`
  - StoreKit2Adapter — atualizações de transação › avisa o ouvinte quando o nativo recebe Transaction.updates, e para de avisar ao cancelar
  - resolveStoreKitAdapter — degradação sem binário nativo › usa o adaptador StoreKit 2 quando o módulo nativo está no binário
  - resolveStoreKitAdapter — degradação sem binário nativo › módulo ausente (Android, Jest, Expo Go) → loja indisponível
  - resolveStoreKitAdapter — degradação sem binário nativo › exceção do carregador não derruba a abertura: loja indisponível

## Adaptador — cada defeito reintroduzido depois do verde

### `mut-M1-sem-verificacao`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** remove `if (!transacao.verified) return null;` — transação não verificada passa a dar direito
- **Resultado:** `Tests:       3 failed, 23 passed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — direito atual › transação NÃO verificada não dá direito, mesmo sendo a única
    - `expect(received).resolves.toBeNull()`
    - `Received: {"expiresAt": "2027-09-23T12:00:00.000Z", "period": "monthly", "productId": "com.andersonmelo.radiant.ilimitado.mensal", "revokedAt": null, "willRenew": true}`
  - StoreKit2Adapter — direito atual › não verificada não vence a verificada, mesmo expirando depois
    - `expect(received).toEqual(expected) // deep equality`
  - StoreKit2Adapter — compra › compra com transação NÃO verificada é falha, sem direito
    - `expect(received).resolves.toEqual(expected) // deep equality`

### `mut-M2-produto-fora-da-ADR`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** produto fora da tabela da ADR ganha período `monthly` em vez de ser descartado
- **Resultado:** `Tests:       1 failed, 25 passed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — direito atual › produto fora da ADR não dá direito
    - `expect(received).resolves.toBeNull()`
    - `Received: {"expiresAt": "2026-10-23T12:00:00.000Z", "period": "monthly", "productId": "monthly_plus", "revokedAt": null, "willRenew": true}`

### `mut-M3-renovacao-otimista`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** `willAutoRenew === true` → `!== false`: renovação desconhecida vira "renova"
- **Resultado:** `Tests:       1 failed, 25 passed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — direito atual › renovação desconhecida vira willRenew false: a porta não promete o que a Apple não confirmou
    - `expect(received).resolves.toEqual(expected) // deep equality`

### `mut-M4-revogacao-perdida`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** `revokedAt` sempre `null`
- **Resultado:** `Tests:       1 failed, 25 passed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — direito atual › transação revogada traduz a data de revogação para a porta
    - `expect(received).resolves.toEqual(expected) // deep equality`

### `mut-M5-lista-vazia-aceita`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** remove o `throw StoreUnavailableError` da lista de produtos vazia
- **Resultado:** `Tests:       1 failed, 25 passed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — produtos › lista vazia é loja indisponível, não uma tela de planos sem planos
    - `expect(received).toBe(expected) // Object.is equality`
    - `Expected: true`
    - `Received: false`

### `mut-M6-id-alias`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** `subscriptionProducts.ts`: ID mensal vira alias `…mensal.v2`
- **Resultado:** `Tests:       13 failed, 13 passed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — produtos › entrega os dois planos da ADR com o período da tabela e o preço da Apple
    - `expect(jest.fn()).toHaveBeenCalledWith(...expected)`
  - StoreKit2Adapter — produtos › descarta produto que não está na ADR, mesmo que a Apple o devolva
    - `expect(received).toEqual(expected) // deep equality`
  - StoreKit2Adapter — direito atual › transação verificada de produto da ADR vira o direito, com o período da tabela
    - `expect(received).resolves.toEqual(expected) // deep equality`
    - `Expected: {"expiresAt": "2026-10-23T12:00:00.000Z", "period": "monthly", "productId": "com.andersonmelo.radiant.ilimitado.mensal", "revokedAt": null, "willRenew": true}`
    - `Received: null`
  - StoreKit2Adapter — direito atual › não verificada não vence a verificada, mesmo expirando depois
    - `expect(received).toEqual(expected) // deep equality`
    - `Expected: ObjectContaining {"expiresAt": "2026-10-23T12:00:00.000Z", "productId": "com.andersonmelo.radiant.ilimitado.mensal"}`
    - `Received: null`
  - StoreKit2Adapter — direito atual › transação revogada traduz a data de revogação para a porta
    - `expect(received).resolves.toEqual(expected) // deep equality`
    - `Expected: ObjectContaining {"productId": "com.andersonmelo.radiant.ilimitado.mensal", "revokedAt": "2026-09-20T09:00:00.000Z"}`
    - `Received: null`
  - StoreKit2Adapter — direito atual › transação expirada passa com a data real; quem decide que expirou é o serviço, com o relógio
    - `expect(received).resolves.toEqual(expected) // deep equality`
    - `Expected: ObjectContaining {"expiresAt": "2026-08-23T12:00:00.000Z", "productId": "com.andersonmelo.radiant.ilimitado.mensal", "revokedAt": null}`
    - `Received: null`
  - StoreKit2Adapter — direito atual › renovação desconhecida vira willRenew false: a porta não promete o que a Apple não confirmou
    - `expect(received).resolves.toEqual(expected) // deep equality`
    - `Expected: ObjectContaining {"willRenew": false}`
    - `Received: null`
  - StoreKit2Adapter — compra › compra com transação NÃO verificada é falha, sem direito
    - `expect(received).resolves.toEqual(expected) // deep equality`
  - StoreKit2Adapter — compra › Ask to Buy fica pendente
    - `expect(received).resolves.toEqual(expected) // deep equality`
  - StoreKit2Adapter — compra › desistência da pessoa é cancelamento, não falha
    - `expect(received).resolves.toEqual(expected) // deep equality`
  - StoreKit2Adapter — compra › erro nativo vira falha com o código estável
    - `expect(received).resolves.toEqual(expected) // deep equality`
  - StoreKit2Adapter — restaurar › sincroniza com a App Store antes de ler o direito local
    - `expect(received).toEqual(expected) // deep equality`
    - `Expected: ObjectContaining {"expiresAt": "2026-10-23T12:00:00.000Z", "productId": "com.andersonmelo.radiant.ilimitado.mensal"}`
    - `Received: null`
  - StoreKit2Adapter — restaurar › se a sincronização falhar, ainda lê o que já está no aparelho
    - `expect(received).resolves.toEqual(expected) // deep equality`
    - `Expected: ObjectContaining {"productId": "com.andersonmelo.radiant.ilimitado.mensal"}`
    - `Received: null`

### `mut-M7-restaurar-sem-sync`

- **Comando:** `npx jest src/features/subscription/StoreKit2Adapter.test.ts`
- **Defeito:** `restore()` deixa de chamar `sync()`
- **Resultado:** `Tests:       1 failed, 25 passed, 26 total`
- **Falharam:**
  - StoreKit2Adapter — restaurar › sincroniza com a App Store antes de ler o direito local
    - `expect(received).toEqual(expected) // deep equality`

## Serviço — testes novos antes da implementação

### `service-red`

- **Comando:** `npx jest src/features/subscription/SubscriptionService.test.ts`
- **Defeito:** `SubscriptionService.ts` ainda sem as mudanças da fatia
- **Resultado:** `Tests:       5 failed, 27 passed, 32 total`
- **Falharam:**
  - SubscriptionService — produtos da ADR › sem ids injetados, pede à loja exatamente os dois produtos da ADR
    - `expect(jest.fn()).toHaveBeenCalledWith(...expected)`
  - SubscriptionService — direito que some antes da data (reembolso) › ativo no cache e ausente na loja encerra o ilimitado das vidas
    - `expect(jest.fn()).toHaveBeenCalledTimes(expected)`
    - `Expected number of calls: 1`
    - `Received number of calls: 0`
  - SubscriptionService — atualizações da loja › relê o direito quando a loja avisa de uma transação nova
    - `TypeError: service.watchStoreUpdates is not a function`
  - SubscriptionService — atualizações da loja › loja sem aviso de atualização (indisponível) não quebra quem pede para escutar
    - `TypeError: service.watchStoreUpdates is not a function`
  - SubscriptionService — escolha do adaptador padrão › com o módulo nativo no binário, as ofertas vêm do StoreKit
    - `expect(received).resolves.toEqual(expected) // deep equality`

## Serviço — cada defeito reintroduzido depois do verde

### `mut-S1-sem-transicao`

- **Comando:** `npx jest src/features/subscription/SubscriptionService.test.ts`
- **Defeito:** remove o `setUnlimited(null)` da transição ativo → ausente (reembolso mantém o ilimitado)
- **Resultado:** `Tests:       1 failed, 31 passed, 32 total`
- **Falharam:**
  - SubscriptionService — direito que some antes da data (reembolso) › ativo no cache e ausente na loja encerra o ilimitado das vidas
    - `expect(jest.fn()).toHaveBeenCalledTimes(expected)`
    - `Expected number of calls: 1`
    - `Received number of calls: 0`

### `mut-S2-transicao-sem-antes`

- **Comando:** `npx jest src/features/subscription/SubscriptionService.test.ts`
- **Defeito:** a condição perde `antes.kind === "unlimited"`: toda releitura sem direito daria vidas cheias
- **Resultado:** `Tests:       5 failed, 27 passed, 32 total`
- **Falharam:**
  - SubscriptionService — direito de uso offline › sem direito e sem cache não há assinatura e as vidas NÃO são tocadas
    - `expect(jest.fn()).not.toHaveBeenCalled()`
    - `Expected number of calls: 0`
    - `Received number of calls: 1`
  - SubscriptionService — direito de uso offline › pedido pendente também não toca as vidas na releitura
    - `expect(jest.fn()).not.toHaveBeenCalled()`
    - `Expected number of calls: 0`
    - `Received number of calls: 1`
  - SubscriptionService — direito que some antes da data (reembolso) › encerra uma vez só: na abertura seguinte, quem nunca teve direito não ganha vidas cheias
    - `expect(jest.fn()).not.toHaveBeenCalled()`
    - `Expected number of calls: 0`
    - `Received number of calls: 1`
  - SubscriptionService — direito que some antes da data (reembolso) › quem nunca assinou não toca as vidas ao reler a loja
    - `expect(jest.fn()).not.toHaveBeenCalled()`
    - `Expected number of calls: 0`
    - `Received number of calls: 1`
  - SubscriptionService com o StoreKit2Adapter — estados de ponta a ponta › transação não verificada não deixa ninguém ilimitado
    - `expect(jest.fn()).not.toHaveBeenCalled()`
    - `Expected number of calls: 0`
    - `Received number of calls: 1`

### `mut-S3-resolucao-ansiosa`

- **Comando:** `npx jest src/features/subscription/SubscriptionService.test.ts`
- **Defeito:** o construtor resolve o módulo nativo no `import`
- **Resultado:** `Tests:       1 failed, 31 passed, 32 total`
- **Falharam:**
  - SubscriptionService — escolha do adaptador padrão › o módulo nativo só é consultado quando a loja é usada, não ao importar o serviço
    - `expect(jest.fn()).not.toHaveBeenCalled()`
    - `Expected number of calls: 0`
    - `Received number of calls: 1`

### `mut-S4-ids-do-paywall`

- **Comando:** `npx jest src/features/subscription/SubscriptionService.test.ts`
- **Defeito:** IDs padrão voltam a `monthly_plus`/`annual_plus`
- **Resultado:** `Tests:       1 failed, 31 passed, 32 total`
- **Falharam:**
  - SubscriptionService — produtos da ADR › sem ids injetados, pede à loja exatamente os dois produtos da ADR
    - `expect(jest.fn()).toHaveBeenCalledWith(...expected)`

### `mut-S5-aviso-ignorado`

- **Comando:** `npx jest src/features/subscription/SubscriptionService.test.ts`
- **Defeito:** o aviso da loja deixa de disparar `refresh`
- **Resultado:** `Tests:       1 failed, 31 passed, 32 total`
- **Falharam:**
  - SubscriptionService — atualizações da loja › relê o direito quando a loja avisa de uma transação nova
    - `expect(jest.fn()).toHaveBeenCalledTimes(expected)`
    - `Expected number of calls: 1`
    - `Received number of calls: 0`

## Guardas de contrato — cada uma derrubada pelo defeito que nomeia (bytes restaurados após cada execução)

### `guard-G1-dependencia-no-modulo`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `modules/radiant-storekit/package.json` ganha `dependencies: { "left-pad" }`
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › o módulo não declara dependência npm nenhuma (regra 1)
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G2-expo-iap-no-app`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `radiant-app/package.json` ganha `expo-iap`
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › o app não ganha biblioteca de compra: nenhum terceiro no caminho da compra (regra 1)
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G2b-revenuecat-no-app`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `radiant-app/package.json` ganha `react-native-purchases`
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › o app não ganha biblioteca de compra: nenhum terceiro no caminho da compra (regra 1)
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G3-modulo-android`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `expo-module.config.json` ganha a plataforma `android`
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › o módulo é só Apple, com exatamente o módulo Swift da fatia (regra 6)
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G4-id-alias`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `subscriptionProducts.ts`: ID anual vira `…anual.v2`
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › os produtos do app são exatamente os da tabela da ADR de produtos, sem alias
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G5-nome-divergente`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `index.ts` do módulo resolve `RadiantStoreKit2`
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › o adaptador e o ponto de entrada do módulo resolvem o MESMO nome nativo
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G6-log-de-transacao`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `console.log("compra", resultado.transaction.productId)` dentro da classe do adaptador
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › nenhum console.* dentro do adaptador StoreKit nem no ponto de entrada do módulo (regra 5)
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G6b-log-no-index`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** `console.info` no `index.ts` do módulo
- **Resultado:** `Tests:       1 failed, 5 passed, 6 total`
- **Falharam:**
  - radiant-storekit — ADR 2026-09-23 › nenhum console.* dentro do adaptador StoreKit nem no ponto de entrada do módulo (regra 5)
    - `expect(received).toEqual(expected) // deep equality`

### `guard-G6-contraponto-comentario`

- **Comando:** `npx jest src/features/subscription/radiantStoreKitModule.contract.test.ts`
- **Defeito:** CONTRAPONTO: a mesma chamada, mas dentro de um comentário — a guarda de AST precisa continuar verde
- **Resultado:** `Tests:       6 passed, 6 total`

## Abertura do app (`_layout.tsx`)

### `layout-red`

- **Comando:** `npx jest src/features/first-run/startup-gate.flow.test.tsx`
- **Defeito:** testes novos antes da ligação
- **Resultado:** `Tests:       2 failed, 24 passed, 26 total`
- **Falharam:**
  - gate de abertura em RootLayout › passa a reler a assinatura a cada aviso da loja, só depois da migração e uma vez
    - `expect(jest.fn()).toHaveBeenCalledTimes(expected)`
    - `Expected number of calls: 1`
    - `Received number of calls: 0`
  - gate de abertura em RootLayout › para de escutar a loja quando o layout desmonta
    - `expect(jest.fn()).toHaveBeenCalledTimes(expected)`
    - `Expected number of calls: 1`
    - `Received number of calls: 0`

### `mut-L1-sem-try`

- **Comando:** `npx jest src/features/first-run/startup-gate.flow.test.tsx`
- **Defeito:** remove o `try/catch` em volta de `watchStoreUpdates`
- **Resultado:** `Tests:       1 failed, 25 passed, 26 total`
- **Falharam:**
  - gate de abertura em RootLayout › falha ao ligar a escuta da loja não bloqueia a abertura

### `mut-L2-sem-cleanup`

- **Comando:** `npx jest src/features/first-run/startup-gate.flow.test.tsx`
- **Defeito:** a limpeza do efeito deixa de parar a escuta
- **Resultado:** `Tests:       1 failed, 25 passed, 26 total`
- **Falharam:**
  - gate de abertura em RootLayout › para de escutar a loja quando o layout desmonta
    - `expect(jest.fn()).toHaveBeenCalledTimes(expected)`
    - `Expected number of calls: 1`
    - `Received number of calls: 0`

### `mut-L3-antes-da-migracao`

- **Comando:** `npx jest src/features/first-run/startup-gate.flow.test.tsx`
- **Defeito:** a escuta é ligada no início do bootstrap, antes da migração
- **Resultado:** `Tests:       2 failed, 24 passed, 26 total`
- **Falharam:**
  - gate de abertura em RootLayout › passa a reler a assinatura a cada aviso da loja, só depois da migração e uma vez
    - `expect(jest.fn()).not.toHaveBeenCalled()`
    - `Expected number of calls: 0`
    - `Received number of calls: 1`
  - gate de abertura em RootLayout › falha ao ligar a escuta da loja não bloqueia a abertura
  - gate de abertura em RootLayout › falha ao ligar a escuta da loja não bloqueia a abertura

## Swift — medição única, fora do gate

Jest não lê Swift. O módulo nativo foi medido uma vez, com o Swift 6.4 do
Xcode desta máquina (`swiftlang-6.4.0.34.1`), SDK `iPhoneSimulator27.0`:

- `xcrun swiftc -parse RadiantStoreKitModule.swift` → sem erro.
- `xcrun swiftc -dump-parse` → nenhuma referência a `print`, `NSLog`,
  `os_log`, `debugPrint`, `dump` ou `Logger` na AST.
- `xcrun swiftc -typecheck -swift-version {5,6} -target arm64-apple-ios15.1-simulator`
  contra o SDK, com um **stub** mínimo do `ExpoModulesCore` (só as assinaturas
  de `Module`, `Exception`, `Name`, `Events`, `OnCreate`, `OnDestroy`,
  `AsyncFunction`) → código 0 nos dois modos. A primeira versão reprovava no
  modo 6 (`ISO8601DateFormatter` estático não é `Sendable`) e foi corrigida.
- **Vermelho da checagem:** trocar `renovacao.willAutoRenew` por
  `renovacao.autoRenews` → `error: value of type
  'Product.SubscriptionInfo.RenewalInfo' has no member 'autoRenews'`. A checagem
  confere as APIs do StoreKit; **não** confere a integração com o Expo real, que
  só o build interno compila.
