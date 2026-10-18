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

   Desde a revisão do Codex na PR #51 (ver abaixo), ela acha a rolagem pela
   AST, com `countScrollCommands` sobre o YAML já parseado. Em cada roteiro
   listado, ela também exige que o parser e o texto contem o mesmo número de
   rolagens, porque as duas guardas de baixo só leem a grafia
   `- scrollUntilVisible:` de topo.

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

## Revisão do Codex na PR #51: a completude lia texto

O Codex apontou, como P1, que a primeira versão da guarda de completude achava
a rolagem por texto (`/scrollUntilVisible:/`). Uma chave entre aspas
(`- 'scrollUntilVisible':`) ou explícita (`? scrollUntilVisible`) é YAML válido
e o mesmo comando para o Maestro, e a busca não a via. O achado procede, e é a
regra do AGENTS de que guarda sobre código-fonte lê a AST.

Medido em 2026-10-18 ([`injecoes-p1.txt`](2026-10-18-fila62-guardas-de-rolagem/injecoes-p1.txt)).
Cada injeção é YAML válido, e o parser conta as mesmas rolagens antes e com ela.

**Passo 0, contrato do `0cb5441`, sem edição.** De 4 injeções, 3 passam verdes:
- um roteiro novo, fora da lista, com uma rolagem de chave entre aspas;
- a chave entre aspas, sem o `visibilityPercentage`, no `review-due`;
- a chave explícita, sem o `visibilityPercentage`, no `hybrid-native-evidence`.

A quarta, a chave entre aspas no `boot-to-home`, reprovava por acaso. Como esse
roteiro tem uma rolagem só, a busca de texto deixava de vê-lo, e a guarda dizia
que ele "não rola mais", que é o motivo errado.

**Conserto.** A completude conta a rolagem pela AST. Em cada roteiro listado, o
número de rolagens que o parser acha tem de ser igual ao de linhas
`- scrollUntilVisible:` de topo. Uma grafia que as guardas de texto não leem,
inclusive a aninhada, reprova ali.

**Passo C.** O contrato passa 34/34. As 4 injeções reprovam, cada uma em um
teste só, a guarda de completude:
- o roteiro novo, como fora da lista;
- as outras três, com `N scrollUntilVisible commands parsed, N−1 written as a
  top-level - scrollUntilVisible: step`, com o nome do roteiro.

As 9 injeções da FILA 62 continuam reprovando. As 2 de `visibilityPercentage`
reprovam só na guarda delas. As 7 de aninhamento reprovam em dois testes: na
guarda do aninhamento, pelo motivo dela, e na de completude, porque a rolagem
aninhada não está escrita como passo de topo.

## CI da PR #51: um teste do checkpoint reprovou uma vez

No `0cb5441`, o job `quality` reprovou em
`CheckpointScreen flow › XP da aprovação › a celebração mostra o ganho e o total
depois dele`: o `findByText('+18 XP')` não achou o texto, e a tela impressa
ainda mostrava "Avaliação 1 de 5"
([extrato e reprodução](2026-10-18-fila62-guardas-de-rolagem/ci-instavel.txt)).
- O diff desta PR não toca código do app, e a `main` em `2304c94`, com o mesmo
  código, passou no mesmo workflow.
- Aqui, com a CPU presa nos núcleos de eficiência
  (`/usr/sbin/taskpolicy -b npx jest --runInBand --no-cache`), o arquivo passou
  3 de 3, e o caso levou de 199 a 236 ms.

O job foi reenviado e, na segunda tentativa, passou com o mesmo commit. A causa
não foi achada: a de que a cadeia assíncrona depois
de "Enviar checkpoint" passou do prazo de 1000 ms do `findByText` no CI é
inferência, não medida. Ficou na FILA 63.

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

O `loop validate` desse run deu 15/15 (`run-1792357763193-7f559ab0`).

**Remedido depois do P1,** em 2026-10-18 às 18:28 (−03), sobre o `0cb5441` mais
o diff do conserto: `exit=0` de novo, com 174 suítes e 1.787 testes, o contrato
do Maestro em 34/34, 0 erros de lint e o visual QA sem regressões. O resultado
do `loop validate` do run do P1 (`run-1792358827164-46cc4590`) está na
descrição da PR.

## O que não foi verificado

- Nenhum roteiro rodou no simulador. A mudança é só no contrato estático, e
  nenhuma tela mudou.
- As guardas do `visibilityPercentage` e do aninhamento continuam lendo texto.
  O que as torna confiáveis agora é a asserção da grafia na guarda de
  completude, que reprova quando o parser e o texto discordam. Uma rolagem em
  fluxo YAML (`- {scrollUntilVisible: …}`) também cairia nessa asserção, com o
  parser contando 1 e o texto 0. Isso é inferido do código, e não foi injetado.
- A causa do teste instável do checkpoint (FILA 63).
