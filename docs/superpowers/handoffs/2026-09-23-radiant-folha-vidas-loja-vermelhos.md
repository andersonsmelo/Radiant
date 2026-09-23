# Execuções vermelhas — folha de vidas ligada à loja (2026-09-23)

Evidência da Task 8 da 1.4, item "folha de vidas oferece a assinatura".
Registrada como saída de execução, não como prosa. Relatório em
[`2026-09-23-radiant-folha-vidas-loja-relatorio.md`](2026-09-23-radiant-folha-vidas-loja-relatorio.md).

Ambiente: Node `v20.20.2`, `radiant-app`, branch `feat/folha-vidas-loja` aberta
de `feat/quiztopbar-infinito` em `647b2c3`. Comando de cada execução:

```bash
npx jest --runInBand <suítes da etapa>
```

## 1. Testes novos contra o código anterior (`647b2c3`)

Serviço — o método ainda não existe:

```text
● SubscriptionService — escolha do adaptador padrão › com o módulo nativo, a folha de vidas pode oferecer a assinatura — sem tocar a loja
  TypeError: service.storeAvailable is not a function
● SubscriptionService — escolha do adaptador padrão › sem o módulo nativo, a folha de vidas diz que a assinatura não existe neste aparelho
  TypeError: service.storeAvailable is not a function
● SubscriptionService — escolha do adaptador padrão › o adaptador indisponível injetado também não oferece a assinatura
  TypeError: service.storeAvailable is not a function
Tests:       3 failed, 34 skipped, 37 total
```

Lição — `storeAvailable={false}` e `onSubscribe` vazio fixos; vidas lidas só na montagem:

```text
● LessonFlowScreen — economia de vidas › folha de vidas e a loja › com loja no binário, a folha oferece a assinatura e leva à tela dela
  Unable to find an element with text: folha: com assinatura
● LessonFlowScreen — economia de vidas › folha de vidas e a loja › voltando da compra, a lição relê as vidas e mostra ∞
  Unable to find an element with accessibility label: Vidas ilimitadas
Tests:       2 failed, 20 passed, 22 total
```

Checkpoint — idem:

```text
● CheckpointScreen flow › folha de vidas e a loja › com loja no binário, a folha oferece a assinatura e leva à tela dela
  Unable to find an element with text: folha: com assinatura
● CheckpointScreen flow › folha de vidas e a loja › voltando da compra, o checkpoint relê as vidas e deixa começar
  Unable to find an element with text: Uma estrutura neutra perde um elétron. Como fica sua carga relativa?
Tests:       2 failed, 7 passed, 9 total
```

Jornada — só a oferta; a releitura no foco já existia:

```text
● JourneyHomeScreen — a trilha soberana decide o próximo nó › folha de vidas e a loja › com loja no binário, a folha oferece a assinatura e leva à tela dela
  Unable to find an element with text: folha: com assinatura
Tests:       1 failed, 11 passed, 12 total
```

Os testes "sem loja" (três telas) e "voltando da compra" da Jornada passaram
contra o código antigo, porque o valor fixo e a releitura já davam o resultado.
Só as mutações abaixo provam que eles guardam alguma coisa.

> ⚠️ Na primeira execução da Jornada, `emits app_open` também falhou: o evento
> sai **uma vez por processo** (`appOpenEmittedForProcess`), e o bloco novo,
> inserido antes, gastou essa vez. O bloco foi movido para o fim do arquivo.
> Não era o vermelho previsto e não foi contado como tal.

## 2. Mutações — cada guarda vista vermelha com o defeito que nomeia

Aplicadas uma de cada vez sobre o código pronto, com o arquivo restaurado de
cópia depois. `git diff | shasum` conferido idêntico antes e depois das seis.

**M1 — `storeAvailable()` sempre `true`:**

```text
● … › sem o módulo nativo, a folha de vidas diz que a assinatura não existe neste aparelho
  Expected: false
  Received: true
● … › o adaptador indisponível injetado também não oferece a assinatura
  Expected: false
  Received: true
Tests:       2 failed, 35 passed, 37 total
```

**M2 — `storeAvailable()` chama `loadProducts` e `currentEntitlement`** (a folha tocaria a loja a cada montagem):

```text
● … › com o módulo nativo, a folha de vidas pode oferecer a assinatura — sem tocar a loja
  Expected number of calls: 0
  Received number of calls: 1
Tests:       1 failed, 36 passed, 37 total
```

**M3 — `storeAvailable={true}` fixo nas três telas:** falham exatamente os três
"sem loja no binário, a folha não oferece a assinatura" (Lição, Checkpoint,
Jornada). `Tests: 3 failed, 40 passed, 43 total`.

**M4 — `storeAvailable={false}` fixo nas três telas (o estado de antes):**
falham exatamente os três "com loja no binário, a folha oferece a assinatura e
leva à tela dela". `Tests: 3 failed, 40 passed, 43 total`.

**M5 — `onSubscribe` navega sem fechar a folha** (o `Modal` ficaria por cima da
tela da assinatura): falham os três "com loja no binário…" e, por consequência,
os "voltando da compra" da Lição e do Checkpoint, onde a folha continua aberta.
`Tests: 5 failed, 38 passed, 43 total`.

**M6 — vidas lidas só na montagem** (`useEffect(useCallback(…), [])` no lugar do
`useFocusEffect`, nas três telas): falham exatamente os três "voltando da
compra…". `Tests: 3 failed, 40 passed, 43 total`.

> ⚠️ A primeira versão da M6 trocava `useFocusEffect(useCallback(` por
> `useEffect((` e deixava `}, []))` — uma expressão com vírgula que entrega `[]`
> ao `useEffect`. As 43 falharam com `TypeError: create is not a function`:
> vermelho na **montagem**, não no defeito. Descartada e refeita; o resultado
> acima é o da versão correta.

## 3. Gate

`EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, Node `v20.20.2`:
**exit 0, 133 suítes / 1190 testes** (1178 da fatia do ∞ + 12 novos), lint
0 erros / 26 avisos (o de `JourneyNodeCompletionGuard.test.tsx:4`, `router`
sem uso, já existia em `647b2c3`), Visual QA 0 regressões (61 baselined, 3
exceções de escopo).
