# Relatório — 1.4, Task 8: a folha de vidas oferece a assinatura (2026-09-23)

Condição de pronto: nas três telas que montam a `HeartsSheet` (Lição,
Checkpoint, Jornada), a folha oferece "Ver assinatura" quando o binário tem
loja e explica a ausência quando não tem, sem chamada nova à loja ou à rede no
caminho de estudo; o botão leva a `/subscription`; voltando da compra, a tela
relê as vidas e mostra ∞. Guardas vistas vermelhas; `quality` exit 0; FILA,
STATUS e roadmap atualizados.

Branch `feat/folha-vidas-loja`, aberta de `feat/quiztopbar-infinito` em
`647b2c3`, sem upstream. Três runs do Loop, dois fechados sem validar (ver
"Nota de processo"): `run-1790176027374-e0123d50`,
`run-1790176197086-02d31eb2` e o que entregou, `run-1790176732353-dbbd4a06`.
**Sem build, push nem merge.**

## Decisões tomadas com o dono antes de escrever

1. **Entra na 1.4.** A spec §98 pede "sempre as três saídas: Esperar · Revisar
   · Assinar", e o plano (Task 5, Step 1) já dizia "sem Assinar quando loja
   indisponível", ou seja, com Assinar quando disponível. O item não estava na
   lista "AGENTE — o que sobrou da Task 8" da FILA.
2. **Base no ∞.** O `StoreKit2Adapter` não está na `main`: vive na pilha do
   [PR #17](https://github.com/andersonsmelo/Radiant/pull/17). A fatia do ∞
   estava pronta e sem commit na checkout principal, tocando a
   `LessonFlowScreen`. O dono autorizou comitá-la como estava (`647b2c3`), e
   esta branch parte dela.

## O que mudou

| Arquivo | Mudança |
|---|---|
| `SubscriptionService.ts` | `storeAvailable(): boolean` — o binário tem o módulo `RadiantStoreKit`? Síncrono; resolve o adaptador (só procura o módulo, e o resultado fica memorizado) e **não chama** `loadProducts`, `currentEntitlements` nem `sync`. |
| `LessonFlowScreen.tsx` | `storeAvailable={subscriptionService.storeAvailable()}`; `onSubscribe` fecha a folha e faz `router.push('/subscription')`; vidas relidas por `useFocusEffect` em vez de só na montagem. |
| `CheckpointScreen.tsx` | Idem. A leitura da gamificação continua na montagem. |
| `JourneyHomeScreen.tsx` | `storeAvailable` e `onSubscribe` iguais; a releitura no foco já existia. |
| três `*.flow.test.tsx` | Mock de `expo-router` com foco controlável (`voltarParaATela`), mock da folha que expõe `storeAvailable`/`onSubscribe`, e três testes por tela: com loja, sem loja, volta da compra. |
| `JourneyNodeCompletionGuard.test.tsx` | O mock de `expo-router` ganhou `useFocusEffect`, porque a suíte monta a Lição e o Checkpoint reais. |
| `SubscriptionService.test.ts` | Três testes de `storeAvailable`. |

**Por que fechar a folha antes de navegar:** ela é um `Modal` do React Native,
que fica por cima de qualquer rota empurrada. Aberta, cobriria a tela da
assinatura.

**Por que "disponível" é propriedade do binário e não da loja agora:** a folha
é montada no caminho de estudo, e saber se a loja responde exige
`Product.products`, que usa a rede. O binário com o módulo é o único fato local
e barato. Quando o binário tem loja e ela não responde (sem rede, sem produto),
a tela `/subscription` já tem o estado "loja indisponível" (spec §99).

## Divergências da spec, para o dono decidir

1. **Offline com binário capaz de vender:** a folha mostra "Ver assinatura", e
   o motivo aparece na tela da assinatura. A spec §98 lista o estado `offline`
   da folha como "assinar indisponível, com o motivo". Mostrar o motivo na
   folha exigiria saber da rede na montagem: uma dependência nova
   (`@react-native-community/netinfo`, ausente do `package.json`), que testa
   o alcance da internet com uma requisição — justamente o que este trabalho
   foi instruído a não adicionar ao estudo.
2. **Volta sem compra:** a folha não reabre sozinha. A Lição e o Checkpoint
   continuam pausados e a reabrem no próximo toque que custaria vida, o
   comportamento de pausa que já existia.

## O que ficou provado e o que não

- ✅ As três telas, com loja e sem loja, e a volta com ∞, em teste de fluxo.
  A Lição mostra ∞ no topo, o Checkpoint deixa começar e a Jornada passa o
  ilimitado ao cabeçalho, com a folha fechada. Vermelhos, com seis mutações,
  em [`2026-09-23-radiant-folha-vidas-loja-vermelhos.md`](2026-09-23-radiant-folha-vidas-loja-vermelhos.md).
- ✅ Gate, Node `v20.20.2`: `EXPO_NO_DOTENV=1 npm run quality` → **exit 0,
  133 suítes / 1190 testes**, lint 0 erros / 26 avisos (nenhum novo), Visual QA
  sem regressão.
- ✅ **Por leitura de código, não por execução:** as vidas já estão gravadas
  quando a pessoa volta. `SubscriptionService.purchase` só devolve depois de
  `applyToHearts` → `setUnlimited`, e a `SubscriptionScreen` só sai pelo
  "Fechar" (`router.back()`), acionado depois da compra.
- ❌ **Não medido em aparelho.** Duas perguntas só o build responde: se o
  `useFocusEffect` dispara ao voltar de `/subscription` no navegador real (o
  teste simula o foco), e se o `requireOptionalNativeModule` encontra o módulo
  no binário da 1.4, o que depende do Swift que ainda não compilou contra o
  Expo real (FILA, item 2).
- ⚠️ **Fora do alcance desta mudança:** um Ask to Buy aprovado enquanto a
  pessoa está *dentro* da lição chega às vidas pelo `watchStoreUpdates`, mas a
  tela só o vê no próximo foco. Não há assinatura de mudança no
  `HeartsRepository`.

## Nota de processo

O primeiro run foi aberto sem o `JourneyNodeCompletionGuard.test.tsx`, que
monta as duas telas reais com um mock de `expo-router` sem `useFocusEffect`.
`step begin` só aceita arquivos em `context_ready`, então o escopo não cresce
num run em `editing`. O run foi fechado (`editing → closed`, transição válida)
e reaberto com a união. As edições já feitas entraram sujas na baseline do
segundo, mas estavam todas declaradas, sem risco de `OUT_OF_SCOPE_CHANGE`.

O segundo run reprovou no `loop validate` por **ambiente**, não por código: a
worktree não tinha `radiant-api/node_modules` nem os `pages.json` e
`excerpts.json` da extração de `fundamentos-de-radiologia-everton-costa-pinto`,
que são ignorados pelo git e só existem na checkout principal
(`content-foundation`, `api-lint`, `api-typecheck` e `api-test` reprovados;
`app-quality` e `app-test` aprovados). Links simbólicos para os originais foram
criados **com o run fechado** — criados dentro dele, contariam como mudança fora
do escopo —, os quatro validadores foram conferidos à mão (exit 0) e o terceiro
run foi aberto com os links já na baseline. O mesmo vale para
`radiant-app/node_modules`, ligado antes do primeiro run.

Numa worktree nova, antes do primeiro `abrir.mjs`:

```bash
git -C /Users/anderson/Developer/Radiant status --porcelain --ignored -- radiant-api "Conteúdo/extrações"
```

Para achar quem monta uma tela antes de declarar o escopo:

```bash
grep -rl -E "LessonFlowScreen|CheckpointScreen" radiant-app/src | grep "\.test\."
```
