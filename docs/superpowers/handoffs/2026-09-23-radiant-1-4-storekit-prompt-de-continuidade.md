# Prompt de continuidade — 1.4, Task 8, fatia 2: adaptador StoreKit por módulo local

Você vai implementar o adaptador StoreKit 2 real do Radiant, um app iOS de
treinamento em radiologia (Expo / React Native). O dono decidiu o caminho em
2026-09-23 e lê o resultado no fim. **Build, envio, push e merge são dele.**

**Objetivo desta conversa:** o adaptador TypeScript e o módulo Swift
`radiant-storekit` entregues, com testes, atrás da `StoreKitPort` que já existe.
**Pronto quando:** o gate passar, o adaptador estiver ligado no ponto único do
`SubscriptionService` e o relatório disser com clareza o que ficou esperando
build e sandbox, que nenhum teste desta suíte fecha.

## 1. Meça antes de planejar

    git fetch origin && git status --porcelain && git branch --show-current
    gh pr list --state open

Em 2026-09-23 havia dois PRs empilhados e não mergeados: o
[#15](https://github.com/andersonsmelo/Radiant/pull/15) (L2 v3→v6 e as fatias 1
e 5 da Task 8) e, sobre ele, o PR da branch `docs/storekit-modulo-local` (esta
decisão). **Se os dois ainda estiverem abertos, crie sua branch a partir de
`docs/storekit-modulo-local`, sem upstream** (`git switch -c <nova>`). Nunca use
`git switch -c <nova> origin/<outra>`: isso arma o push para a branch errada. Se
os dois já estiverem mergeados, parta de `origin/main`.

## 2. Leia, nesta ordem

1. `AGENTS.md`, com atenção a **"Quatro lições sobre GUARDAS"** e **"Três lições
   de MEDIÇÃO"**. As duas valem inteiras para esta fatia.
2. [`docs/adr/ADR-2026-09-23-storekit-modulo-expo-local.md`](../../adr/ADR-2026-09-23-storekit-modulo-expo-local.md)
   — a decisão, as oito regras de implementação e os dois pontos **a verificar**.
3. [`docs/adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md`](../../adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md)
   — os dois Product IDs. Não crie alias nem variante por ambiente.
4. Spec da 1.4, §6 e §8:
   [`2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](../specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md).
5. O código que você vai estender, em `radiant-app/src/features/subscription/`:
   `subscription.types.ts` (a porta), `UnavailableStoreKitAdapter.ts`,
   `SubscriptionService.ts` (o adaptador é escolhido na linha
   `this.store = deps.store ?? new UnavailableStoreKitAdapter()`) e o teste dele.
6. **O molde**, que já compilou e passou no iPhone em 2026-09-15:
   `radiant-app/modules/radiant-cloudkit/` (`expo-module.config.json` só com
   `apple`, podspec, `RadiantCloudKitModule.swift`, `index.ts`) e
   `radiant-app/src/features/progress-sync/CloudKitPrivateAdapter.ts`, que
   resolve o módulo com `requireOptionalNativeModule` e cai para o adaptador
   indisponível quando o nativo não existe (Android, Jest, Expo Go). O teste
   dele mostra como simular o módulo na fronteira.

## 3. Ordem de trabalho

1. **Plano curto primeiro**, em `docs/superpowers/plans/`, que resolve os dois
   pontos que a ADR deixou abertos, com fonte citada e sem presumir:
   - **`willRenew` sem rede.** `Transaction.currentEntitlements` é local. O
     estado de renovação vem de `Product.SubscriptionInfo.status` /
     `RenewalInfo`, e não está medido se isso responde offline. Se não
     responder, fixe um valor conservador e documente. A porta não promete o
     que a Apple não entrega sem rede, e a spec proíbe bloquear estudo por
     verificação de assinatura.
   - **Onde versionar o arquivo `.storekit`.** `ios/` não é versionado, porque
     sai do prebuild. Decida onde o arquivo mora e como chega ao projeto Xcode,
     sem config plugin se o Expo não exigir, como fez o CloudKit.
2. **Adaptador TS com TDD**, contra a porta: `purchased`, `pending` (Ask to
   Buy), `cancelled`, `failed`, transação revogada, expirada, não verificada,
   nada a restaurar, e módulo ausente → `store-unavailable`. **Registre o passo
   vermelho de cada teste** (saída em arquivo versionado ou no relatório com o
   comando exato). "Falhou antes" em prosa é inauditável.
3. **Módulo Swift** `radiant-app/modules/radiant-storekit/`, só StoreKit 2,
   zero dependência npm, zero pod de terceiro. Só transação **verificada** dá
   direito; toda transação tratada é finalizada; `Transaction.updates` escutado
   desde a abertura; nada de log de identificador de transação.
4. **Ligar no ponto único** do `SubscriptionService`, pelo mesmo padrão de
   resolução do CloudKit. Android e Jest continuam com o indisponível.

## 4. Guardas desta fatia — responda por escrito antes de escrevê-las

- **Que população passa a encontrar qual regra?** Ligar o adaptador real troca
  `store-unavailable` por estados reais para **todo usuário iOS**. Enumere o que
  o `SubscriptionService`, o `HeartsService` e as telas de Perfil, Assinatura e
  Barreira fazem com cada estado que hoje é inalcançável (`pending`, `expired`,
  revogado), e diga quem passa a vê-los. O diff não mostra isso, porque essas
  regras não serão editadas.
- **Validade, não diferença.** "O adaptador real difere do indisponível" não
  prova nada. Asserte o que o direito **é**: produto da ADR, data futura, não
  revogado, verificado.
- **Guarda sobre fonte lê AST ou dado estruturado, nunca regex.** Para "zero
  dependência npm" e "módulo só apple", leia o `package.json` e o
  `expo-module.config.json` como JSON. Para "nenhum log de transação", use AST
  ou não afirme.
- **Veja cada guarda falhar com o defeito que ela nomeia**, e registre a
  execução vermelha.

## 5. Regras que valem sempre

- **Loop é o contrato:** `node scripts/loop/abrir.mjs "<descrição>" <arquivos>`
  antes de criar qualquer arquivo. Declare **todo** caminho, inclusive os novos
  em `radiant-app/modules/radiant-storekit/`, e confira antes que estão em
  `writePolicy.allowedRoots` (`radiant-app/modules` está). Rode
  `git status --porcelain` antes de abrir. Com memória a gravar, a sequência é
  `validate` → `step finish` → `memory write` → `run close`, cada um numa
  invocação separada, lendo o `code` do envelope.
- **Node:** `loop` no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`), testes e builds
  no 20. Confira `node --version` antes de citar qualquer número.
- **O gate é `EXPO_NO_DOTENV=1 npm run quality`**, em `radiant-app`, e nada
  menos. Cite a suíte inteira no relatório.
- **Nada de build, envio, push ou merge** sem autorização datada do dono.

## 6. O que é do dono e fecha esta fatia de verdade

- **Build interno `development`** com o módulo novo: é a primeira vez que o
  Swift compila.
- **Sandbox no TestFlight**, ou arquivo `.storekit` no Xcode: compra, Ask to
  Buy, restauração e renovação acelerada.
- **Acordo de apps pagos em *Ativo*** no App Store Connect. Aceitar os termos
  não ativa.

## 7. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize
`STATUS.md` e `FILA.md` **na mesma passagem**, marcando a fatia 2 e destravando
as fatias 3 e 4 na fila. Separe o que foi **medido** do que foi **inferido** e
diga explicitamente o que **não** foi verificado — em especial todo o Swift, que
sem build não foi compilado.
