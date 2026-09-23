# ADR — Adaptador StoreKit 2 por módulo Expo local, sem `expo-iap` (2026-09-23)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-23  
**Escopo:** Radiant 1.4 · Task 8, fatia 2 · iOS  
**Emenda:** a spec [`2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](../superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md)
§6, que dizia "StoreKit 2 direto (`expo-iap`)". Não altera a
[ADR de produtos](ADR-2026-09-15-radiant-ilimitado-storekit-products.md): IDs,
grupo, preços e as nove regras dela continuam valendo.

## Contexto

A spec da 1.4 escolheu StoreKit 2 direto por um motivo **declarativo**: a
transação fica entre o aparelho e a Apple, sem backend nem terceiro, e as Privacy
Labels continuam "Dados não coletados" para quem assina. O `expo-iap` entrou no
texto como o **meio**, não como a razão.

Medido em 2026-09-23:

- `expo-iap` está na versão `5.6.3` (publicada em 2026-09-19), com **249 versões
  publicadas e 5 majors**. O repositório é `hyodotdev/openiap`: a biblioteca
  embarca o SDK OpenIAP do mesmo autor, além das dependências de Play Billing e
  Amazon (estas, opcionais).
- A porta `StoreKitPort` (`radiant-app/src/features/subscription/subscription.types.ts`)
  já tem o formato do StoreKit 2 — `currentEntitlements`, `revokedAt`, o estado
  `pending` do Ask to Buy — e são quatro métodos. O `SubscriptionService` escolhe
  o adaptador num ponto só (`SubscriptionService.ts:99`).
- O projeto já tem o precedente: `radiant-app/modules/radiant-cloudkit/`, módulo
  Expo local com 162 linhas de Swift e zero dependências npm, escolhido porque
  nenhuma biblioteca de CloudKit qualificou. Ele compilou e passou no iPhone em
  2026-09-15.
- Não foi conferido o manifesto de privacidade do `expo-iap` nem o que o OpenIAP
  faz em tempo de execução. Esta ADR não afirma que ele coleta dados; afirma que
  ele é um **terceiro no caminho da compra**, o que a spec quis evitar.

## Decisão

O adaptador real da `StoreKitPort` é um **módulo Expo local**,
`radiant-app/modules/radiant-storekit/`, em Swift, usando **somente o framework
StoreKit 2 da Apple**. O `expo-iap` **não** é instalado.

## Regras de implementação

1. **Zero dependências npm e zero pods de terceiro** no módulo, como no
   `radiant-cloudkit`. O `package.json` não ganha entrada de compra.
2. **Só APIs do StoreKit 2** e só o necessário para os quatro métodos da porta:
   carregar os dois produtos da ADR de produtos, comprar, ler
   `Transaction.currentEntitlements` e restaurar (`AppStore.sync`).
3. **Só transação verificada conta.** Resultado `unverified` não concede direito.
   Toda transação tratada é finalizada (`finish()`).
4. **Escutar `Transaction.updates` desde a abertura do app**, e não só dentro de
   `purchase`: renovação, reembolso e aprovação de Ask to Buy chegam por ali, e
   perdê-los deixa o cache de direito errado.
5. **Nada sai do aparelho além da conversa com a Apple.** O módulo não grava
   recibo, não loga identificador de transação e não passa nada ao Sentry. O
   `SubscriptionCacheV1` continua sendo o único estado persistido.
6. **Android fica com o `UnavailableStoreKitAdapter`.** O módulo é só iOS.
   Compras no Android exigem outra decisão, com produtos criados no Play; a 1.4
   não os prevê.
7. **O TypeScript não confia no Swift sem teste.** O adaptador TS que envolve o
   módulo é testado contra a porta com o módulo nativo simulado na fronteira, e
   a tradução de cada caso da porta (`purchased`, `pending`, `cancelled`,
   `failed`, revogado, expirado, nada a restaurar) tem teste próprio.
8. **Implementado não é validado.** O Swift só vale depois de compilado em build
   interno e exercitado na sandbox. Build e envio continuam do dono, com
   autorização datada.

## A verificar na implementação, não presumido aqui

- **`willRenew` sem rede.** `currentEntitlements` entrega a transação
  (produto, expiração, revogação) localmente. O estado de renovação vem de
  `Product.SubscriptionInfo` / `RenewalInfo`, e não está medido se isso responde
  offline. Se não responder, o adaptador precisa de um valor conservador
  documentado, e a porta não pode prometer o que a Apple não entrega sem rede.
- **Teste local com arquivo `.storekit`.** `ios/` não é versionado (prebuild), e
  a spec prevê um arquivo de configuração StoreKit no Xcode. O caminho versionado
  para esse arquivo precisa ser decidido no plano da fatia.

## Alternativas rejeitadas

- **`expo-iap`:** cobriria o Play Billing, mas põe um terceiro de alta rotatividade
  no caminho da compra, acrescenta permissão de billing e dependências ao build
  Android que já está no Play, e exige traduzir a API dele para a porta.
- **RevenueCat:** já vetado pela regra 6 da ADR de produtos. Obrigaria a declarar
  histórico de compras e identificador coletados por terceiro.
- **Tirar a assinatura da 1.4:** a economia de vidas ficaria sem saída paga.

## Consequências

- As fatias 3 (`QuizTopBar` com ∞) e 4 (E2E dos caminhos dourados) deixam de
  esperar decisão e passam a esperar a fatia 2.
- As Privacy Labels não mudam por esta decisão.
- O custo que se aceita: o Swift é código próprio, sem comunidade para corrigir,
  e compras no Android ficam para depois.
