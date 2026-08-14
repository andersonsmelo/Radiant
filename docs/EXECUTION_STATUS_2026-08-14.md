# Radiant — Execution Status (2026-08-14)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-13.md`](EXECUTION_STATUS_2026-08-13.md)** como estado
canônico. Ele cobre uma passagem só: o **redesenho da informação da jornada**,
pedido pelo dono em sessão interativa com o app rodando no simulador iOS. Não
promove nenhum gate de release, não toca em publicação de loja/OTA e não altera
conteúdo curricular.

Em uma frase: a jornada passou a ser um percurso único com estados visíveis — o
seletor de trilhas saiu, os nós ganharam cadeado e cor, a revisão deixou de ser
objetivo da Home, e o destravamento sequencial entre trilhas foi modelado e
ligado. O redesenho foi publicado no `main` pelo commit `0ceff49`; os dois
caminhos antes sem observação em runtime foram verificados em simulador iOS com
um build Release local do mesmo commit.

## Estado de publicação

Os nove runs originais fecharam com `closed` e memória validada. Seu resultado,
o status canônico, este handoff e o contrato documental foram reunidos no commit
`0ceff49` (`feat(journey): commit guided learning path redesign`) e enviados para
`origin/main` em 2026-08-14.

O estado deve continuar sendo medido antes de uma alteração — `git status
--porcelain`, `git rev-parse --short HEAD` e a comparação com `origin/main` —,
pois este repositório é trabalhado por várias IAs em sessões independentes.

O `HEAD` de publicação desta passagem é `0ceff49`.

## Entregas

Todas passaram os 13 validadores e pertencem ao commit `0ceff49`.

| Entrega | Run | Verificado em aparelho |
| --- | --- | --- |
| Escala dos ícones do HUD: 24/24/28 | `run-1786730002048-d17d8ff5` | Sim |
| `SpeechBubble` nasce e recolhe a partir do rabicho | `run-1786730511404-06eb1aef` | Sim |
| Balão ancorado na boca do Pixel + razões de geometria exportadas | `run-1786731071483-a85e8f01` | Sim |
| Correção do `ReferenceError` de ordem de inicialização | `run-1786731691198-7b730ae4` | Sim |
| Caminho único: seletor de trilhas fora da Galáxia | `run-1786732372156-be808c39` | Sim |
| Estados visuais da trilha: cadeado, concluído, destravado | `run-1786734637864-1dc6520f` | Sim |
| Revisão deixa de ser objetivo da Home | `run-1786736333295-dfa559bf` | Sim — evidência P2 iOS Release abaixo |
| Ordem e destravamento sequencial de trilhas (regra pura) | `run-1786736928066-cceaea79` | Não se aplica (regra pura) |
| Avanço automático de trilha ligado | `run-1786737247876-aadfdf97` | Sim — evidência P2 iOS Release abaixo |

### Evidência de runtime P2 — iOS Release

Em 2026-08-14, no simulador `Radiant iPhone 17 Pro — iOS 26.5`, foi gerado e
instalado do zero o build Release local de `0ceff49`, com bundle JS embutido e
as variáveis do perfil `e2e-test`. O `main.jsbundle` do artefato teve SHA-256
`12216976c787b9317d2bc182e6120a538bec89589fc64ab7de21258baf17de0b`.

- Com revisão vencida e um checkpoint disponível, a Home anunciou
  `Checkpoint · Disponível` e exibiu `Abrir checkpoint`; a revisão não virou a
  manchete nem o alvo do CTA.
- Quando a revisão era a única etapa aberta, a Home anunciou `Revisão` e exibiu
  `Fazer revisão`, preservando o fallback verdadeiro.
- Com todos os nós de Fundamentos concluídos, o bootstrap abriu automaticamente
  `Radiação, Modalidades e Equipamento`, com `Lição · Disponível` e
  `Continuar jornada`.

As três árvores de acessibilidade e os screenshots sanitizados foram coletados
fora do Git; o registro reprodutível está em
[`radiant-app/docs/evidence/2026-08-14-journey-p2-ios.md`](../radiant-app/docs/evidence/2026-08-14-journey-p2-ios.md).

## Escopo do redesenho

### Percurso único

O carrossel `JourneyTrackShelf` saiu do `GalaxyMapScreen`, que era o **único**
lugar que o renderizava. Registro de uma premissa corrigida durante a sessão: o
catálogo de trilhas **nunca esteve na Home**. A Home é `JourneyHomeScreen` — HUD,
Pixel, "Foco de hoje" e CTA — e um teste mantém o `JourneyMap` fora dela porque a
aba Galáxia é dona dessa superfície.

O teste da Galáxia afirmava `owns both track selection and the canonical
JourneyMap`. Foi dividido: um caso para o mapa, e um caso novo que verifica a
**ausência** do seletor. Remover uma asserção não impede o que foi retirado de
voltar — só para de olhar.

`JourneyProgressService.selectTrack` continua existindo. Não é resíduo: é o
caminho pelo qual o destravamento automático troca de trilha.

### Estados visíveis na trilha

Antes, concluído e bloqueado desenhavam o mesmo cartão cinza com o mesmo ícone
azul, e a diferença vivia inteira numa palavra de rodapé. O azul de ação num nó
bloqueado ainda o fazia parecer clicável.

O estado passou a ir por três canais independentes — cor, ícone e palavra:

| Estado | Âncora | Cartão | Ícone |
| --- | --- | --- | --- |
| Concluído | verde, **preenchida** | normal | selo |
| Recomendado | anel azul | borda azul | ícone do tipo |
| Bloqueado | cinza, vazia | borda **tracejada** | **cadeado** |

A âncora cheia contra a vazia marca a fronteira do progresso sem exigir leitura
de rótulo. Os tokens `nodeCompleted` e `nodeLocked` já existiam no tema desde
antes e **nunca tinham sido usados por ninguém**; entraram agora, acompanhados de
`nodeCompletedAccent` e `nodeLockedAccent`.

`JourneyNodeCard` ganhou seu primeiro arquivo de teste, com seis casos.

### Revisão fora da Home

A revisão pertence à trilha, onde é um nó do percurso. A Home ganhou um
`homeNextNode`: quando a recomendação cai numa revisão, ela anuncia a próxima
etapa de **aprendizado** da unidade. A linha "Próximo", o rótulo do CTA e o
**alvo** do CTA passam todos por ele, então anúncio e destino não divergem.

Duas decisões deliberadas:

1. **O filtro é na tela, não no serviço.** `getNextRecommendedNode` é a
   autoridade sobre elegibilidade e alimenta também a Galáxia e o roteamento.
   Filtrar lá mudaria o elegível do app inteiro para resolver o destaque de uma
   tela.
2. **O fallback nomeia a revisão.** Se ela é a única coisa aberta, o botão diz
   "Fazer revisão", porque prometer lição e abrir revisão é pior. Existe um caso
   de teste cuja função é impedir que alguém "limpe" esse fallback achando que é
   resíduo.

Saiu também a duplicação `Revisão · Revisão pedida`, que repetia a palavra e
soava como cobrança.

### Destravamento sequencial entre trilhas

`LearningTrack` não tinha ordem nem pré-requisito. Ganhou `order?: number` —
**opcional** porque o catálogo pode chegar de um payload remoto que não conhece o
campo, e exigi-lo quebraria a leitura do payload inteiro por causa de uma
ordenação. Sem `order`, a posição no array desempata. As três trilhas locais
declaram 1, 2 e 3.

`JourneyTrackUnlockService` é a regra, e é **pura**: recebe as trilhas e o
conjunto de concluídas, não lê storage nem conhece o serviço de progresso.

- A primeira trilha está sempre aberta — senão um aluno novo veria o curso
  inteiro trancado.
- A seguinte abre quando a **anterior** termina, não quando qualquer uma
  termina. É a diferença entre um percurso em linha e um conjunto solto.
- Trilha concluída continua aberta: o cadeado impede pular adiante, não voltar.
- Tudo concluído devolve a última trilha, não `null` — o app precisa de algo
  para exibir.

O serviço **não** decide se uma trilha está concluída; isso depende dos nós e do
progresso, e entra como fato de entrada. Quem decide é
`JourneyProgressService.isTrackCompleted`, e a regra é: todos os nós concluídos.
Trilha sem progresso guardado e trilha sem nós não contam, senão um catálogo
vazio ou ainda não hidratado destravaria o curso inteiro de uma vez.

`resolveTrackDefinition` parou de ler `store.activeTrackId` como fonte da decisão
e passou a derivá-la da regra. `activeTrackId` virou registro do que foi
resolvido, não a decisão — guardar a decisão no store era exatamente o motivo de
nada mover o aluno ao concluir uma trilha.

## Defeitos encontrados durante a sessão

1. **`Easing` do `react-native` dentro de um worklet Reanimated.** O token
   `easing` de `src/ui/motion.ts` vem do `Easing` do `react-native` (linha 8), que
   não é worklet e não roda na UI thread. O contrato
   `reanimated-easing-contract` recusou, corretamente, uma chamada recém-escrita
   que o usava. `SpeechBubble.tsx` entrou na lista de alvos do contrato no mesmo
   run que ganhou animação — um contrato que enumera alvos não protege quem ele
   não nomeia.

2. **Os 13 validadores passaram e o app quebrou.** Uma constante derivada, lida
   no corpo do módulo, produziu `ReferenceError: Property
   'PIXEL_MOUTH_BASELINE' doesn't exist`: o grafo de imports chega ao módulo
   consumidor antes de o produtor terminar. Jest, `tsc`, lint e os onze
   contratos não enxergam ordem de inicialização — cada ferramenta monta o grafo
   do seu jeito. Só o app rodando pegou. A correção é estrutural: valor derivado
   de outro módulo se calcula **dentro de função**, onde a referência resolve em
   tempo de chamada.

3. **`opacity: 0.5` global no cartão bloqueado.** Derruba junto o contraste do
   título, e o `contrast-contract` não vê porque calcula tokens isolados, não
   composição de runtime. Foi substituído por cor explícita, borda tracejada e
   cadeado, mantendo o título legível — que é o que permite decidir se vale a
   pena destravar aquele ponto.

## O que fica aberto

Detalhado, com critérios de aceitação, em
[`handoff/2026-08-14-brief-jornada-e-pendencias.md`](handoff/2026-08-14-brief-jornada-e-pendencias.md).

Resumo: as pendências P1 e P2 fecharam. Restam a decisão de produto e a
implementação para a conclusão da última trilha, e a integração dos ícones Rive
do HUD, bloqueada pelos arquivos que só o dono produz.
