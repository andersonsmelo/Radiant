# "Gerenciar", preço da loja e ordem dos planos — relatório de 2026-09-26

Itens **19a** e **19b** da ordem de prioridade
([FILA](../../FILA.md#ordem-de-prioridade-combinada-em-2026-09-25)), pelas ADRs
[do "Gerenciar"](../../adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md)
e [da amostra, da D4 e dos planos](../../adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md).
Run do Loop: `run-1790430075902-df36447c`.

**Condição de pronto, combinada com o dono:**
- o código, com testes vistos vermelhos;
- o gate inteiro;
- o Swift compilado localmente contra o Expo real, e o app aberto no
  simulador;
- sem build de distribuição e sem PR.

## O que mudou

- **Swift** (`RadiantStoreKitModule.swift`):
  - `showManageSubscriptions` abre a folha da Apple
    (`AppStore.showManageSubscriptions(in:)`) na cena ativa e resolve quando
    ela fecha;
  - uma escuta de `Storefront.updates` emite `onStorefrontChanged`, sem corpo,
    como já era feito com `Transaction.updates`;
  - o comentário de cabeçalho, que ainda dizia "nunca foi compilado", agora
    diz o que foi verificado e onde.
- **TypeScript:**
  - tipos da fronteira, porta (`manageSubscriptions`, `onStorefrontChanged`,
    ambos opcionais) e adaptador;
  - **19b:** o adaptador ordena os planos com o mensal primeiro;
  - **serviço:** `manageSubscription` abre a folha e, quando ela fecha, **relê
    a assinatura**, porque cancelar não gera transação e o aviso de
    `Transaction.updates` não chegaria. `watchStorefront` repassa a troca de
    loja;
  - **tela:** o assinante ganha "Gerenciar assinatura". Se a folha não abre,
    aparece "O gerenciamento da Apple não abriu agora. Tente de novo mais
    tarde.", e o texto dos Ajustes continua na tela. Com os planos à mostra,
    uma troca de loja recarrega as ofertas.
- O cartão do Perfil continua abrindo a tela interna.

## Medido

- **Testes:** 12 novos, todos vistos vermelhos antes do código. Três deles
  foram vistos vermelhos de novo, com o defeito específico injetado e desfeito
  ([vermelhos](2026-09-26-radiant-gerenciar-e-loja-vermelhos.md)).
- **Gate:**
  - `EXPO_NO_DOTENV=1 npm run quality` com exit 0, no Node `v20.20.2`;
  - **151 suítes e 1446 testes**, 12 a mais que os 1434 da #37;
  - lint com 0 erros e 26 avisos, igual a antes;
  - visual QA sem regressão;
  - a árvore só tinha os arquivos deste run.
- **Compilação local:**
  - `xcodebuild` Debug para o simulador, com o Xcode 27 (SDK do simulador
    27.0) e os contornos do STATUS;
  - deu **`BUILD SUCCEEDED`**, **sem aviso nem erro** em
    `RadiantStoreKitModule.swift`;
  - o binário contém `showManageSubscriptions` e `onStorefrontChanged`.
- **Simulador `E3C547AE` (iOS 26.5), com esse binário:**
  - o app abriu, com o módulo criado na abertura, e a escuta da loja começou
    sem derrubar nada;
  - a tela de assinatura mostrou o mensal primeiro;
  - **os preços vieram em dólar, `$2.99` e `$22.99`,** porque o simulador não
    tem conta da App Store e usa a loja padrão. É o cenário do defeito do
    aparelho.

## Não verificado

- **A folha da Apple não foi aberta.** No simulador ninguém é assinante, e o
  botão só aparece para assinante. O StoreKit Testing só vale quando o app é
  lançado pelo Xcode, e ele é a infraestrutura do item 5 (Ask to Buy).
- **A troca de loja não foi vista.** Para isso seria preciso entrar numa conta
  de sandbox nos Ajustes do simulador, e o agente não digita senha.
- **Inferido, não medido:** que a cena implícita do UIKit basta para a folha
  num app sem `UIScene`.
- **Inferido, não medido:** que pedir os produtos de novo depois de
  `Storefront.updates` traz a moeda nova, sem cache do StoreKit no meio.
- **Uma amostra só** da ordem dos planos na tela: quem prova a ordem é o teste.

## Próximo

- **Dono:**
  1. disparar uma build `development` nova no EAS, com este branch;
  2. no iPhone, abrir "Gerenciar assinatura" e cancelar pela folha (item 4);
  3. trocar de conta de sandbox com a tela de planos aberta e ver se o preço
     muda de moeda;
  4. conferir se só reabrir a tela já corrige o preço (ADR, item 4).
- **Agente:** o item 5, Ask to Buy no StoreKit Testing. A mesma configuração
  deve permitir abrir a folha no simulador, o que também vale como verificação
  deste item.
