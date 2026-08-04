# B5 — cobertura E2E do nó de reward, e o defeito que ela achou (2026-08-04)

Estado: **iOS `passed` (82s), Android `passed` (81s)** com o flow
`reward-locked.yaml`, sobre builds Release locais da 1.3.1 em configuração de
produção. Fecha o item 5 dos bloqueadores **pelo escopo de deep link**, com o
limite declarado abaixo.

## O que a task pedia, e por que o caminho óbvio não servia

O item 5 está aberto desde 2026-07-27: *"Nó de reward sem cobertura E2E (track
ativo tem 7 lições; conquista só no final)"*. A trilha ativa é gerada do
catálogo, e `JourneyDefinitionService` destrava a conquista com
`requiresNodeIds: [node:<última lição>]` — inalcançável num smoke. O
`learning-critical-path` chega a **proibir** afirmá-la, justamente por isso.

O escopo escolhido foi alcançar o nó pelo outro lado: `radiantapp://reward?nodeId=…`.
`findReward` resolve por id **sem** olhar status — de propósito, é o que permite
abrir uma conquista específica.

## O defeito que a sonda achou antes de existir flow

Ao abrir a tela por deep link numa instalação limpa, ela mostrava:

- **Status: "Pronta para ser coletada"**
- **Progresso: "0 de 14 marcos da unidade concluídos"**

E o botão "Receber conquista" chamava `handleComplete`, cuja única guarda era
`!rewardNode || rewardCompleted`. **Não havia checagem de status.** Tocar o botão
executava `markNodeCompleted(rewardNode.id)` e gravava a conquista da unidade com
zero lições feitas. O esquema `radiantapp://` é invocável de fora do app.

A assimetria estava dentro do próprio arquivo, e é o que torna o defeito
plausível em vez de descuidado: `loadSnapshot` **já checava**
`status === 'available' || 'active'` antes de mover o nó atual. O autor estava
consciente do status naquele caminho; o caminho de coleta não recebeu a mesma
guarda.

### O que isso fez com o desenho da cobertura

Se o flow tivesse sido escrito antes da correção, ele afirmaria "Pronta para ser
coletada" com 0 de 14 como comportamento esperado, e o contrato passaria a
**defender o defeito**. Cobertura que fossiliza defeito é pior que ausência de
cobertura: ela transforma um erro em requisito, e o próximo que tentar corrigir
verá um teste vermelho dizendo que ele está errado.

Corrigido primeiro, coberto depois.

## A correção

Decisão de produto: **mostrar o estado bloqueado com honestidade, sem oferecer
coleta.**

| Antes | Depois |
| --- | --- |
| Status: "Pronta para ser coletada" | Status: **"Bloqueada até a unidade fechar"** |
| "Pronto para coletar essa conquista?" | **"Esta conquista ainda não abriu"** |
| Botões: "Receber conquista" + "Voltar para jornada" | Apenas **"Voltar para jornada"** |
| `handleComplete` gravava | `handleComplete` recusa quando bloqueado |

A guarda em `handleComplete` é **defesa em profundidade**: a UI já não oferece o
botão, mas quem chega por deep link chega por um caminho que o app não controla,
e gravar progressão é irreversível. Coberta por teste que afirma que
`markNodeCompleted` **e** `setCurrentNode` não são chamados.

## O que o flow prova, e o que ele não prova

**Prova:** a tela existe, roteia por deep link, resolve o nó certo, mostra o
estado bloqueado com o progresso real, não oferece coleta, e devolve à jornada.

**Não prova:** a regra de destravamento. Isso exige percorrer as sete lições e
**segue sem cobertura** — o item foi fechado no escopo de deep link, não no
escopo completo. Quem reabrir o assunto deve saber que essa metade continua
aberta.

## Duas armadilhas de seletor, medidas aqui

1. **`scrollUntilVisible` não funciona nesta tela.** A primeira versão do flow
   usava `scrollUntilVisible` por texto e falhava, embora a rolagem estivesse
   acontecendo. A hierarquia explicou: **todos** os nós da tela expõem
   `accessibilityText` com `text` vazio, e `scrollUntilVisible` casa com
   `element.text`, nunca com `accessibilityText`. É a mesma armadilha que o
   runbook documenta para `AppButton` — aqui ela vale até para `<Text>` comum,
   por causa do agrupamento de acessibilidade. A saída é o
   `repeat ... while: notVisible`, cuja guarda usa `visible`, que casa.

2. **Rolar antes de afirmar ausência não é conveniência, é o que dá sentido à
   asserção.** O card de ação fica abaixo da dobra; sem rolar até ele,
   `assertNotVisible: Receber conquista` passaria porque o card não está na tela
   — provando nada. A ausência só é evidência quando o lugar onde o botão
   apareceria está sendo olhado.

## Contrato

`maestro-contract.test.mjs` ganhou uma regra que **deriva** o id do deep link:
lê o formato de `rewardNodeId()` em `JourneyDefinitionService.ts` e o slug da
primeira trilha em `src/data/catalog.ts`, e exige que o flow use exatamente o id
que o app monta hoje. Trocar o slug do catálogo sem trocar o flow produziria um
deep link que não resolve, e `findReward` cairia no fallback — que exige nó
**desbloqueado** —, deixando o flow vermelho com a atribuição errada.

A regra também exige as duas linhas de `assertNotVisible`: sem elas o flow
passaria mesmo que a coleta voltasse a ser oferecida para um nó bloqueado.
