# FILA 62 — as guardas de rolagem do Maestro leem os 17 roteiros que rolam

**Medido em 2026-10-18,** pelo Claude, na branch `claude/fila62-guardas-de-rolagem`,
a partir da `main` em `2304c94` (merge da PR #50). Node v20.20.2. Condição de
pronto combinada com Anderson na conversa, antes de abrir o run.

## O que a FILA dizia e o que se mediu

A FILA 62 dizia que dois roteiros, o `review-due.yaml` e o
`hybrid-native-evidence.yaml`, rolavam fora das duas listas de
`radiant-app/scripts/maestro-contract.test.mjs` que exigem `visibilityPercentage`
e proíbem rolagem aninhada.

Medido na `main` em `2304c94`:
- dos 18 roteiros de `radiant-app/.maestro/`, **17** usam `scrollUntilVisible`.
  Só o `first-run.yaml` não rola. Nenhum subflow rola;
- a guarda do `visibilityPercentage` lê a `MAESTRO_FLOWS_WITH_SCROLL`, com 15
  roteiros. Faltavam exatamente os dois da FILA;
- a guarda do aninhamento tinha **uma lista própria, com 10 roteiros**. Faltavam
  sete: os dois da FILA e mais `boot-to-home`, `student-checkpoint-active-resume`,
  `student-checkpoint-performance-baseline`, `student-checkpoint-no-duplicate-effect`
  e `student-checkpoint-short-viewport`. Os sete cumprem a regra hoje: toda
  rolagem deles é passo de topo, e não há rolagem aninhada.

## O que mudou

Só `radiant-app/scripts/maestro-contract.test.mjs`. Nenhum roteiro YAML mudou.

1. Os dois roteiros entraram na `MAESTRO_FLOWS_WITH_SCROLL`, que agora tem 17.
2. A guarda do aninhamento (`never lets a scroll-until-visible hide behind a
   visibility guard`) deixou a lista própria e lê a mesma constante.
3. Uma guarda nova, `lists exactly the flows that scroll until an element is
   visible`, compara a constante com o diretório. Ela reprova nos dois sentidos:
   - um roteiro que rola e está fora da lista;
   - uma entrada da lista que não rola mais.

   A lista continua explícita, como o comentário dela pede: quem cria um roteiro
   que rola decide incluí-lo, e a guarda só impede o esquecimento.

**Fica de fora:** a lista da espera por `assertVisible` antes de rolar
(`makes every scroll-until-visible wait for the screen it is about to scroll`),
que continua à mão e sem o G4, por decisão do dono. Não foi medido se o
`review-due` e o `hybrid-native-evidence` cumprem essa regra.

## Cada guarda vista falhando

Os logs estão em
[`injecoes.txt`](2026-10-18-fila62-guardas-de-rolagem/injecoes.txt) e
[`vermelho.txt`](2026-10-18-fila62-guardas-de-rolagem/vermelho.txt). Cada
injeção muda um arquivo, roda `node --test` no contrato inteiro e restaura o
arquivo byte a byte.

**Passo 0, contrato da `main`, sem edição.** O contrato passa 33/33. Com cada um
dos 9 defeitos injetados, ele **continua verde**:
- sem o `visibilityPercentage` no primeiro `scrollUntilVisible` do `review-due`
  e do `hybrid-native-evidence`;
- com o primeiro `scrollUntilVisible` aninhado sob um `runFlow when` em cada um
  dos sete roteiros de fora da lista do aninhamento.

Isso confirma a cegueira que a FILA descrevia, e a amplia de dois para sete
roteiros na segunda guarda.

**Passo A, guarda de completude contra a lista da `main`.** Reprova 1 de 34, no
teste novo, com a mensagem `hybrid-native-evidence.yaml, review-due.yaml use
scrollUntilVisible but are missing from MAESTRO_FLOWS_WITH_SCROLL`. É o defeito
da FILA, sem injeção: a lista como estava.

**Passo B, conserto.** O contrato passa 34/34.

**Passo C, as mesmas 9 injeções contra o contrato corrigido.** As 9 reprovam,
cada uma em exatamente um teste, e o teste é o que nomeia o defeito:
- as 2 de `visibilityPercentage` reprovam em `makes every scroll-until-visible
  state the visibility bar it is measured by`, com o arquivo e a linha;
- as 7 de aninhamento reprovam em `never lets a scroll-until-visible hide behind
  a visibility guard`, com o arquivo e a linha.

Uma décima injeção põe na lista o `first-run.yaml`, que não rola. Ela reprova em
`lists exactly the flows…`, com `first-run.yaml are listed in
MAESTRO_FLOWS_WITH_SCROLL but no longer use scrollUntilVisible`. O script
confere que cada arquivo voltou byte a byte, e o contrato, rodado depois das
injeções, passou 34/34.

## Gate

`EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`, no Node v20.20.2, sobre a
`main` em `2304c94` mais o diff desta entrega, em 2026-10-18 às 18:11 (−03):
`exit=0` ([extrato](2026-10-18-fila62-guardas-de-rolagem/gate.txt)).
- O contrato do Maestro passou 34/34.
- O Jest em banda única deu 174 suítes e 1.787 testes, os mesmos números do R6.
  O contrato roda no `node --test`, fora do Jest, e o teste novo não muda essa
  contagem.
- O lint deu 0 erros e 27 avisos, nenhum no arquivo mudado. Não comparei os
  27 avisos com os da `main`.
- O `visual:qa:strict` não achou regressões.

O `loop validate` deste run roda depois que este relatório é escrito; o
resultado está no run `run-1792357763193-7f559ab0` e na descrição da PR.

## O que não foi verificado

- Nenhum roteiro rodou no simulador. A mudança é só no contrato estático, e
  nenhuma tela mudou.
- A guarda de completude lê texto, e não AST: conta uma linha com
  `scrollUntilVisible:` que não comece por `#`. As duas guardas que ela protege
  leem texto do mesmo jeito. Um `scrollUntilVisible` escrito em fluxo YAML
  (`- {scrollUntilVisible: …}`) seria contado por ela, reprovaria na guarda do
  aninhamento como se estivesse aninhado e não seria lido pela do
  `visibilityPercentage`, que só procura a forma de bloco. Nenhum roteiro usa
  essa forma hoje. [inferido do código, não injetado]
