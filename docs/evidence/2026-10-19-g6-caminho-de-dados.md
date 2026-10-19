# G6 — abrir a revisão e confirmar uma resposta com 1.000 cartões, no emulador Android

Medido em 2026-10-19, às 14:10 e às 14:12 (−03), no emulador
`radiant-entrada-api34`: Android 14, API 34, 2 GB, 2 núcleos e arm64, num Mac M5.
- **App:** o dev client Debug 1.4.0 (3) da FILA 61.
- **JS:** servido pelo Metro da worktree `claude/g6-caminho-de-dados`, que é a
  `main` em `7726296` mais este run, com `EXPO_PUBLIC_RADIANT_STORE_BENCH=1`.

**O que esta medida não prova:**
- não prova aparelho de entrada, nem build Release, nem o tempo da tela;
- o emulador roda num Mac rápido;
- o Debug tem o JS sem otimização e a ponte de desenvolvimento.

O número é uma linha de base para comparar no mesmo cenário, e não um orçamento
aprovado.

## O que foi medido

O medidor da FILA 61 (`ItemReviewRepository.deviceBench.ts`) ganhou a medida
`session`. Ela usa o coordenador real da revisão (`ItemReviewCoordinator`), o
mesmo que `useReview` chama:
- **`openCold`:** `loadQueue` num coordenador novo, sem o store validado em
  cache. É a abertura da revisão;
- **`openWarm`:** o segundo `loadQueue` do mesmo coordenador, como na volta à
  tela;
- **`confirm`:** `recordAnswer` do primeiro item da fila, que lê e grava o
  store. É a confirmação de uma resposta.

O store tem 1.000 cartões, 1.143.057 bytes, montado pelo mesmo gerador do R6.
Todos estão vencidos, e a fila para no teto de 50. Um catálogo de teste conhece
exatamente esses itens: sem ele, o coordenador descartaria os cartões como
órfãos. São 30 rodadas por passada, e cada rodada repõe o store original fora do
cronômetro. As chaves têm o prefixo `@radiant:bench:` e são apagadas no fim, e o
store do aluno não é lido nem escrito.

## Resultado

**[medido]** Duas passadas, cada uma com 30 amostras de cada medida
([logcat 1](2026-10-19-g6-caminho-de-dados/logcat.txt),
[logcat 2](2026-10-19-g6-caminho-de-dados/logcat-2.txt),
[resumo](2026-10-19-g6-caminho-de-dados/resultado.json)):

| Medida | p50, passada 1 | p95, passada 1 | p50, passada 2 | p95, passada 2 |
| --- | --- | --- | --- | --- |
| Abrir a revisão, a frio | 215,1 ms | 386,3 ms | 210,8 ms | 370,9 ms |
| Abrir a revisão, a quente | 179,7 ms | 274,1 ms | 167,8 ms | 277,8 ms |
| Confirmar uma resposta | 55,7 ms | 74,3 ms | 30,7 ms | 80,9 ms |

Nas 60 rodadas, a fila veio com 50 itens e as 30 confirmações de cada passada
foram aceitas.
- **A abertura se repete entre as passadas**, com p50 de ~211 a 215 ms a frio
  e p95 de ~370 a 390 ms.
- **A confirmação oscila mais no p50,** de 31 a 56 ms, com o p95 perto de
  75 a 80 ms.

**Para comparar:** nas mesmas passadas, com 5 rodadas, o medidor da FILA 61 mediu
o store de 1.000 cartões:
- a leitura nativa do valor teve mediana de 7,7 e 7,6 ms;
- a leitura fria pelo repositório, `inspect()`, teve mediana de 84,3 e 82,9 ms.

Abrir a revisão custa mais que duas leituras frias.

**[inferido do código, não medido]** A abertura a quente ganha pouco sobre a
fria. O cache do repositório pula o parse e a validação, mas o `loadQueue` chama
`inspect()` três vezes, e cada chamada relê e clona o store inteiro. Isso vale
para a decisão A2 da FILA 61: particionar por lição reduziria o que cada
abertura lê, mas o tamanho do ganho só se mede depois de escolher o desenho.

## O teste

`ItemReviewRepository.deviceBench.test.ts` ganhou dois casos:
- **abrir e confirmar:** a medida `session`, com 60 cartões, devolve a fila
  no teto de 50, as 4 confirmações aceitas, 4 amostras de cada medida e o p95
  maior ou igual ao p50;
- **store ilegível:** a sessão para e registra `review-store-unavailable`.

O caso do log passou a esperar a linha `session`. Os casos antigos não montam a
sessão, para não gerar 1.000 cartões no Jest. **Vermelho [medido]:** contra o
medidor sem a medida `session`, três casos reprovaram, um deles com
`Received has value: undefined`
([vermelho](2026-10-19-g6-caminho-de-dados/vermelho.txt)). Com ela, os 7 passaram
([verde](2026-10-19-g6-caminho-de-dados/verde.txt)).

## Remedir

No emulador com o dev client da FILA 61:
1. ligue o Metro com
   `EXPO_NO_TYPESCRIPT_SETUP=1 EXPO_NO_DOTENV=1 EXPO_PUBLIC_RADIANT_STORE_BENCH=1 npx expo start --dev-client --port 8081`;
2. rode `adb reverse tcp:8081 tcp:8081`;
3. abra o dev client em
   `exp+radiant-app://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`.
   Com `radiantapp://` e `10.0.2.2`, o app ficou em tela branca;
4. abra `radiantapp://dev-console`;
5. espere a linha `done` em `adb logcat -d | grep radiant-store-bench`.

Desligue o emulador e o Metro antes de validar.
