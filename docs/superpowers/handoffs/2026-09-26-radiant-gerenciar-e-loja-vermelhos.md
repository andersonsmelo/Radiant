# Execuções vermelhas — "Gerenciar", preço da loja e ordem dos planos (2026-09-26)

Registro das execuções vermelhas do run `run-1790430075902-df36447c`, itens 19a
e 19b da ordem de prioridade. Todas rodaram no Node `v20.20.2`, com
`EXPO_NO_DOTENV=1 npx jest <arquivo>`, em `radiant-app`.

Há dois tipos de vermelho. **Antes do código:** o teste falha porque o
comportamento não existe. **Defeito injetado:** o comportamento existe, e o
defeito específico que o teste nomeia foi reintroduzido à mão, visto falhar e
desfeito. O `shasum` do arquivo foi conferido depois de cada restauração.

## Antes do código

### `StoreKit2Adapter.test.ts` — 4 falharam, 27 passaram

| Teste | Falha observada | Prevista? |
|---|---|---|
| o mensal vem primeiro mesmo quando a Apple devolve o anual antes | esperado `["monthly", "annual"]`, recebido `["annual", "monthly"]` | sim: o adaptador não ordenava |
| abre a folha de gerenciamento da Apple e informa que ela foi mostrada | `manageSubscriptions is not a function` | sim |
| falha nativa ao abrir a folha vira falha com o código estável, sem lançar | `manageSubscriptions is not a function` | sim |
| avisa o ouvinte quando o nativo recebe Storefront.updates, e só por esse evento | `onStorefrontChanged is not a function` | sim |

O nativo falso passou a separar os ouvintes por evento, para que um ouvinte de
transação não fosse acordado por troca de loja. Os 27 testes antigos
continuaram verdes com ele.

### `SubscriptionService.test.ts` — 5 falharam

| Teste | Falha observada |
|---|---|
| abre a folha e, quando ela fecha, relê a assinatura | `service.manageSubscription is not a function` |
| folha que não abre é falha, e a assinatura não é relida | idem |
| loja sem folha (indisponível) informa, sem lançar | idem |
| avisa quem pediu quando a loja da conta muda, e para ao cancelar | `service.watchStorefront is not a function` |
| loja sem aviso de troca (indisponível) não quebra quem pede para escutar | idem |

### `SubscriptionScreen.flow.test.tsx` — 3 falharam, 14 passaram

| Teste | Falha observada |
|---|---|
| assinante gerencia pela folha da Apple, e ao fechá-la a tela mostra o que mudou nela | `Unable to find an element with role: button, name: Gerenciar assinatura` |
| se a folha da Apple não abre, avisa e o caminho pelos Ajustes continua na tela | idem |
| com os planos na tela, a troca de loja da conta recarrega os preços | `Unable to find an element with text: R$ 19,90`; a tela continuou com `US$ 2,99` |

## Defeito injetado

Nos casos em que o vermelho anterior foi só "o método não existe", ele não
prova que o teste pega o defeito que nomeia. Por isso, depois do código, cada
defeito foi reintroduzido:

| Defeito injetado | Teste que falhou | Falha observada |
|---|---|---|
| `SubscriptionService.manageSubscription` devolve o cache (`getStatus`) em vez de reler a loja (`refresh`) | "abre a folha e, quando ela fecha, relê a assinatura" | a ordem esperada `['folha', 'releitura']` recebeu só `['folha']` |
| A tela ignora o `status` que volta da folha (`void result.status` no lugar de `setStatus`) | "ao fechá-la a tela mostra o que mudou nela" | `Unable to find … Cancelada — válida até 14/10/2026`; a tela continuou em "Renova em 14/10/2026" |
| A tela recebe as ofertas novas e não as aplica (`void nextOffers` no lugar de `setOffers`) | "a troca de loja da conta recarrega os preços" | `Unable to find an element with text: R$ 19,90`; a tela continuou com `US$ 2,99` e `US$ 22,99` |

Depois de cada restauração, `shasum -c` deu `OK` para `SubscriptionService.ts`
e para `SubscriptionScreen.tsx`.

**Um tropeço, registrado:** a primeira tentativa das duas injeções na tela
passou ao Jest o arquivo da tela, e não o do teste. A saída foi "No tests
found", e nenhum teste rodou. O resultado só foi aceito depois de refazer as
injeções com o arquivo de teste e ler a falha.

## O que não tem vermelho

O Swift. O Jest não roda Swift. A conferência dele está no relatório: a
compilação local contra o Expo real e o que foi visto no simulador.
