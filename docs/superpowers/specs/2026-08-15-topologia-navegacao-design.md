# Design — Topologia de navegação: Estude e Perfil

**Data:** 2026-08-15
**Sub-projeto:** 2 de 6 da reformulação guiada pelo EWA
**Estado:** **aprovado pelo dono em 2026-08-15**; virou
[plano de implementação](../plans/2026-08-15-topologia-navegacao.md)
**Base:** `e184be4` — o topo da branch `feat/atividade-fim-licao` (PR #5, sub-projeto 1), ainda **não** mergeada em `main`

## 1. Por que esta passagem existe

O dono decidiu, sobre a referência R4 do EWA, que a tab bar guarda **Estude** e **Perfil**,
com Progresso e Missões agregados dentro do Perfil. Hoje a barra tem quatro abas — Home,
Galáxia, Progresso, Missões — e a aba Perfil não existe.

Mas a passagem não é uma reorganização de ícones. Ao medir o repositório para planejá-la,
três fatos apareceram, e cada um deles é maior que o rearranjo da barra:

1. **A `ProgressScreen` não é uma tela de aluno.** São 1057 linhas com três naturezas
   misturadas — progresso do aluno, conta e sincronização, e um console de desenvolvimento
   com Learning Road, Beta Gate, Telemetry Debug, health da API e reset de estado local.
   Agregá-la ao Perfil como está arrasta o console para dentro do perfil do aluno.
2. **A aba Estude não tem trilha, e a Galáxia tem.** O documento de direção afirma que "a home
   já é a trilha desde `0ceff49`" — **é falso**. `JourneyHomeScreen` renderiza HUD,
   `JourneyHero`, um card "Foco de hoje" com três linhas de estatística e um botão "Continuar
   jornada". Nenhum nó, nenhum caminho. Quem renderiza `JourneyMap` é a `GalaxyMapScreen`. E a
   `PlanetInteriorScreen`, dentro da Galáxia, é um dos três únicos lugares que empurram para
   `/learn`.
3. **O caminho vivo de lição não tem tela de conclusão nenhuma.** O `LessonFlowScreen`
   (`/learn`), terminada a última interação, chama `LessonOutcomeService`, marca o nó e
   executa `router.replace('/(tabs)')`. O aluno acaba a lição e é devolvido em silêncio à
   aba. Sem estrelas, sem XP, sem frase, sem avaliação.

O terceiro fato reposiciona o sub-projeto 1 inteiro. Todo o fim de lição entregue no PR #5 —
`LessonSummary`, `resolveLessonStars`, o banco de frases, a avaliação da aula — está montado
no `QuizScreen`, na rota `/quiz`, que **não tem nenhum ponto de entrada in-app**. A entrega
existe, passou os 13 validadores, foi verificada em simulador por deep link, e nenhum aluno
pode alcançá-la.

Isso torna a convergência dos dois caminhos a parte mais valiosa desta passagem — não a
dívida secundária que a spec anterior previu.

## 2. Decisões do dono

Quatro decisões foram tomadas em sessão interativa de 2026-08-15 e são premissas fixas
deste design:

| # | Questão | Escolha |
| --- | --- | --- |
| 1 | O que é a aba Estude | **A trilha**, em rolagem contínua — não o painel de retomada de hoje |
| 2 | Alcance da trilha | O currículo inteiro numa rolagem só |
| 3 | Destino da Galáxia | **Absorvida por Estude**; deixa de existir como superfície |
| 4 | Console de desenvolvimento | Sai para rota própria fora das abas, atrás de `SHOW_DEV_TOOLS` |
| 5 | Convergência de lição | `/learn` adota os componentes novos; `/quiz` é aposentada |
| 6 | Liga (sub-projeto 6) | Vira métrica local — o aluno comparado com ele mesmo |

A decisão 3 resolve a pergunta aberta 1 do documento de direção. A decisão 6 resolve a
pergunta 7 e destrava o sub-projeto 6 **sem** revisar o contrato de privacidade — mas o
sub-projeto 6 continua fora desta passagem.

As decisões 4 e 5 não estavam entre as oito perguntas abertas; nasceram da medição do
repositório descrita na seção 1.

As decisões 1 e 2 chegaram depois, com duas capturas de tela do EWA e a frase do dono: *"no
estude o que nós iremos fazer é uma trilha de forma contínua"*. Elas **substituem** a primeira
versão desta spec, que mandava a Galáxia virar superfície interna de Estude — decisão apoiada
na afirmação falsa de que a Home já era a trilha.

## 3. Topologia

### 3.1 A barra

Duas abas:

| Aba | Rota | Tela |
| --- | --- | --- |
| Estude | `src/app/(tabs)/index.tsx` | a trilha contínua — ver seção 3.2 |
| Perfil | `src/app/(tabs)/profile.tsx` | `ProfileScreen` (nova, sub-projeto 3) |

Saem da barra: `galaxy.tsx`, `progress.tsx`, `missions.tsx`.

**A barra continua sendo cartão flutuante.** A pergunta aberta 2 — cartão flutuante ou barra
rente à borda, como no EWA — **não foi decidida** e este documento não a decide. A
consequência é deliberada: enquanto a barra flutuar com `position: absolute`, ela cobre
conteúdo rolável, e `tabBarClearance` continua sendo uma obrigação real de toda tela de aba.
Se a barra virar rente, o contrato de clearance perde o motivo de existir e precisa ser
revisto por inteiro — trabalho de outra passagem, com outra decisão.

### 3.2 Estude é a trilha

Hoje a aba Estude não tem trilha. Ela ganha a trilha que hoje vive na Galáxia, e a Galáxia é
absorvida.

**O que Estude perde:** o card "Foco de hoje", com as três linhas de estatística — próximo,
disponível agora, offline. A trilha diz as três coisas melhor: o nó destacado é o próximo, os
nós abertos são o que está disponível, e o estado offline não é assunto de tela inicial.

**O que Estude mantém:** o HUD do topo e o `JourneyHero` com a fala esporádica do Pixel — a
referência R1 também tem uma linha de stats no topo, e a fala do Pixel é decisão registrada no
`ADR-2026-08-13` que nada aqui revoga.

**O que Estude ganha:** o caminho, o CTA `Continuar` flutuando perto da base como na
referência, e a faixa de próximo nível na transição entre unidades.

#### A trilha é contínua, não seccionada

O `JourneyMap` de hoje é `units.map(unit => <título> + <trilho próprio>)`, tudo dentro de um
card com borda. São trechos separados, um por unidade, com o título quebrando entre eles. O
trilho é uma linha reta vertical central de 8pt.

A trilha contínua muda quatro coisas:

1. **Um caminho só.** O título de unidade deixa de partir a trilha. A unidade vira marco ao
   longo do caminho — a faixa "PRÓXIMO NÍVEL", como na referência R7 — em vez de cabeçalho.
2. **O card sai.** Na referência o caminho vive direto sobre o fundo preto, sem moldura.
3. **O trilho reto vira caminho.** Nas referências ele serpenteia, alternando os nós entre
   esquerda, centro e direita, com o traçado pontilhado ligando um ao outro.
4. **O alcance passa a ser o currículo inteiro.** `JourneyMap` recebe hoje
   `journey.track.units` — as unidades de **uma** trilha. Passa a receber as trilhas
   encadeadas, para que o aluno role para trás e veja o que fez, e para frente e veja o que
   vem bloqueado. **Esta é a única parte que mexe em dado, não em desenho**, e é onde o risco
   da passagem se concentra: uma trilha que carrega o currículo inteiro numa lista precisa de
   virtualização, ou a rolagem morre em catálogo grande.

#### O que os nós mostram

As duas capturas do EWA enviadas pelo dono deixam explícito o que a descrição da R7 não
dizia — e o que já existe no `JourneyNodeCard` cobre parte:

| Sinal | Na referência | Hoje no Radiant |
| --- | --- | --- |
| Estado por cor do rótulo | cinza bloqueado, verde concluído, azul próximo | cadeado, borda tracejada e cor |
| Estrelas por nó | três, abaixo do rótulo, preenchidas por desempenho | **não existem no nó** |
| Ilustração do bloqueado | dessaturada, em cinza | não há ilustração |
| Texto do rótulo bloqueado | **branco e legível** | idem — decisão já registrada |

A linha das estrelas é a que importa mais: `resolveLessonStars`, entregue no sub-projeto 1,
calcula exatamente essas três estrelas pela melhor tentativa, e hoje elas só aparecem na tela
de conclusão. A trilha é onde elas viram progresso visível. Ligá-las ao nó não precisa de
asset nenhum.

**O que precisa de asset e portanto não entra:** a ilustração por aula. Isso é o sub-projeto 5,
bloqueado por assets autorais. A trilha contínua é construída com os nós como estão e recebe
arte depois — a dessaturação do bloqueado só faz sentido quando houver o que dessaturar.

### 3.3 O que acontece com as rotas da Galáxia

`GalaxyMapScreen` deixa de existir: seu conteúdo é a trilha, que sobe para Estude.

As rotas interiores **não podem ser simplesmente apagadas**:

- `src/app/galaxy/[galaxyId].tsx` → `GalaxyInteriorScreen`
- `src/app/galaxy/[galaxyId]/[bodyId].tsx` → `PlanetInteriorScreen`

A `PlanetInteriorScreen` empurra para `/learn`, e o `GalaxyInteriorScreen` empurra para ela.
Antes de removê-las, o plano precisa confirmar que **a trilha contínua alcança todo nó que
essa cadeia alcançava** — senão a remoção corta conteúdo do currículo em vez de reorganizá-lo.
Esta é a verificação que abre o trabalho da Galáxia, e ela é irmã da verificação de `/review`
na seção 5.3.

**Consequência para o clearance:** `MissionsScreen` deixa de ser tela de aba e deixa de
precisar de `tabBarClearance`; a trilha de Estude passa a precisar. O contrato reflete isso, e
é por isso que ele é reescrito e não afrouxado — ver seção 6.1.

### 3.3 Missões

`MissionsScreen` é 100% tela de aluno — meta diária, sequência, XP, corações, revisões
vencidas. Nada nela é console. Ela migra inteira para dentro do Perfil.

Nota de arrumação, sem efeito funcional: o arquivo vive hoje em
`src/features/galaxy/screens/MissionsScreen.tsx`, sob a feature `galaxy`, com a qual não tem
relação. A migração é a hora certa de movê-lo para uma feature própria.

## 4. A separação da ProgressScreen

A separação vem antes da agregação. As 1057 linhas se dividem em três destinos:

### 4.1 Progresso do aluno → Perfil

`StreakCalendarCard`, `AccuracyChartCard`, `StatsGrid`, `TopicsMasteredList`. Movem-se como
estão; o sub-projeto 3 decide como se compõem dentro do Perfil.

**Correção de 2026-08-15, feita durante a execução.** Uma versão anterior desta seção afirmava
que o bloco de tópicos dominados era embrulhado por um card **claro** — `styles.whiteCard` — e
que isso seria a classe de defeito que produziu os dois P0 de identidade. **Não é.** O
`backgroundColor` sempre foi `galaxyColors.surface`, branco a 5% sobre o fundo escuro, igual
ao do `GlassCard`. Só o nome era herança da era clara.

Não havia defeito a corrigir; havia um nome que fazia qualquer leitor suspeitar de um. O
estilo foi renomeado para `metricCard`, com o registro ao lado. **A lição que sobra é sobre
método:** o defeito foi inferido de um identificador sem abrir o bloco de estilo.

### 4.2 Conta e sincronização → Perfil, como identidade

Login, recuperação de senha, redefinição, fila de sync e badge de auth **não** são console.
São a identidade do aluno, e no EWA a identidade é o cabeçalho do perfil. Migram para o
Perfil nessa função.

O que fica de fora e desce para o console: health da API e o rótulo de `API_BASE_URL`.

### 4.3 Console → rota de desenvolvimento

Destino: rota fora do grupo de abas, montada apenas quando `AppConfig.SHOW_DEV_TOOLS` for
verdadeiro. Há precedente direto: a rota `src/app/telemetry.tsx` já existe com essa forma, e
`SHOW_DEV_TOOLS` já é lido em `src/app/_layout.tsx:63`.

Migram: `Catálogo local`, `Homologação iOS V2` (Learning Road, Beta Gate, Sync remoto,
Telemetry Debug, Modo), health da API, e o reset de estado local do smoke da Learning Road.

`SHOW_DEV_TOOLS` tem padrão `__DEV__ || EXPO_PUBLIC_ENABLE_DEV_TOOLS`, então em build de
release o console some da interface sem flag nova. A homologação em aparelho, que hoje depende
dessa tela, continua possível ligando a variável — que é como o beta gate já é contornado
hoje.

## 5. Convergência de `/learn` e `/quiz`

### 5.1 O estado medido

| | `/learn` (`LessonFlowScreen`) | `/quiz` (`QuizScreen`) |
| --- | --- | --- |
| Entrada in-app | 3 pontos: `JourneyHomeScreen`, `HomeScreen`, `PlanetInteriorScreen` | **nenhum** |
| Grava tentativa | sim, via `LessonOutcomeService.recordAttempt` | não |
| Topo enxuto (sub-projeto 1) | não — tem cabeçalho próprio com título e contagem | sim, `QuizTopBar` |
| Conclusão de lição | **nenhuma** — `router.replace('/(tabs)')` | sim, `LessonSummary` completo |

As duas telas são complementares e nenhuma está inteira: a que o aluno alcança não celebra, e
a que celebra o aluno não alcança.

### 5.2 A direção

`/learn` absorve o que o sub-projeto 1 construiu:

- `LessonFlowProgressHeader` cede lugar ao `QuizTopBar` — uma linha, `X` à esquerda, barra no
  meio, corações à direita. O cabeçalho atual repete título e contagem, que é a mesma
  repetição que o sub-projeto 1 removeu do quiz;
- ao terminar a última interação, em vez de `router.replace('/(tabs)')`, o `LessonFlowScreen`
  passa a renderizar `LessonSummary` com o resultado da tentativa;
- `resolveLessonStars` acorda sozinha: `/learn` **já é** o escritor de
  `LearningAttemptsRepository`, então `previousBest` acumula de verdade e a regra da melhor
  tentativa passa a valer desde a primeira execução. Nada precisa ser adivinhado — nem
  `topicId`, que `LessonOutcomeService.resolveNode` já resolve;
- `/quiz` e o `QuizScreen` são aposentados como rota de lição. `QuizTopBar`, `LessonSummary`,
  `resolveLessonStars`, `lessonSummaryPhrases` e `LessonRatingService` **sobrevivem** — são o
  produto do sub-projeto 1 e passam a ser consumidos por `/learn`.

### 5.3 O que precisa de cuidado

O modo de revisão (`/quiz?mode=review&lessonIds=…`) é hoje a única razão funcional da rota. A
rota `/review` existe em paralelo e é para onde `HomeScreen` e `PlanetInteriorScreen` mandam
revisão. **Antes de aposentar `/quiz`, o plano precisa confirmar que `/review` cobre o caso de
revisão por completo** — se não cobrir, `/quiz` não pode ser removida na mesma passagem, e a
aposentadoria vira etapa própria. Este documento não afirma que cobre; afirma que é a
verificação que abre o trabalho.

## 6. Contratos executáveis

Nenhum é desligado, afrouxado ou contornado. O portão é `npm run quality` inteiro, com os 13
validadores.

### 6.1 `tab-bar-clearance-contract` — reescrito

O contrato lista hoje cinco telas: `HomeScreen`, `JourneyHomeScreen`, `ProgressScreen`,
`MissionsScreen`, `GalaxyMapScreen`. Depois desta passagem, três delas não são mais
alcançáveis por aba.

Ele é **reescrito com a nova topologia**, não removido, e a lista passa a ser
`JourneyHomeScreen` e `ProfileScreen`. As três regras que ele afirma continuam valendo sem
alteração: `tabBarClearance` derivado das medidas reais da barra, reservado em toda tela de
aba que rola, e nenhuma constante de `paddingBottom` escrita à mão.

O comentário do topo do arquivo — que registra que o defeito já vazou uma vez, na Home, e
sobreviveu a review por tela — precisa sobreviver à reescrita. Ele é a razão de o contrato
existir.

**Armadilha a não repetir:** a lista atual inclui `HomeScreen`, que já hoje não é tela de aba
— `index.tsx` renderiza `JourneyHomeScreen` quando `ENABLE_LEARNING_ROAD` é verdadeira, e o
padrão é verdadeiro. Uma lista de caminhos escrita à mão envelhece em silêncio. A reescrita
deve considerar derivar a lista do próprio `_layout.tsx` em vez de repeti-la.

### 6.2 `identity-palette-contract`

Sem alteração. As telas novas usam `galaxyColors` e `semanticColors`. O `whiteCard` da seção
4.1 é corrigido justamente para não depender de o contrato não enxergá-lo.

### 6.3 `contrast-contract`

Sem alteração. Nenhum texto novo sobre fundo claro.

### 6.4 Os demais

`pixel-screen-geometry-contract` e `pixel-face-anchor-contract` não são atravessados: o Pixel
não muda de âncora nesta passagem. `maestro-contract` precisa ser conferido — os flows de E2E
navegam por abas nomeadas e a renomeação as quebra.

## 7. Testes

Novos:

- contrato de clearance reescrito, com a topologia de duas abas;
- a trilha contínua — um caminho só, sem quebra de seção por unidade; a faixa de próximo nível
  na transição; e o currículo inteiro presente, não só a trilha ativa;
- estrelas por nó, alimentadas por `resolveLessonStars` a partir da melhor tentativa, com as
  quatro faixas já cobertas pelo teste do sub-projeto 1;
- rótulo de nó bloqueado permanece legível — a guarda contra "ficar escuro" virar opacidade no
  texto, que reprovaria o `contrast-contract`;
- `ProfileScreen` — agrega progresso, missões e identidade, e **não** expõe nenhum controle de
  console;
- rota de desenvolvimento — monta com `SHOW_DEV_TOOLS` verdadeira, não monta com falsa;
- `LessonFlowScreen` — renderiza `LessonSummary` ao terminar, em vez de sair da tela; as
  estrelas refletem a melhor tentativa acumulada em `LearningAttemptsRepository`.

Atualizados:

- `ProgressScreen.flow.test.tsx` — a tela deixa de existir na forma atual; o teste segue as
  partes para os seus novos destinos;
- flows de Maestro que nomeiam as abas removidas.

## 8. Fora de escopo

- **Sub-projeto 3** — a composição visual da `ProfileScreen`. Esta passagem cria a aba e move
  o conteúdo para dentro dela; como esse conteúdo se organiza é o sub-projeto 3.
- **Sub-projeto 4** — marca no topo. Não existe asset de logo em `radiant-app`.
- **Sub-projeto 5** — arte da trilha e ícones de HUD. Bloqueado por assets autorais; o P4
  segue fechado.
- **Sub-projeto 6** — liga e social. A decisão 4 define a direção (métrica local), mas não
  autoriza a construção.
- **Pergunta aberta 2** — cartão flutuante ou barra rente. Ver seção 3.1.
- **Pergunta aberta 8** — o prompt nativo da App Store colidindo com a avaliação da aula.
  Fica mais urgente com esta passagem, porque a conclusão passa a ser alcançável de verdade.

## 9. O que este documento não pôde verificar

Esta spec foi escrita num contêiner Linux remoto, e três coisas do contrato do `AGENTS.md` não
são executáveis nele:

- **O cérebro do Loop.** `.loop/project.yaml` aponta `brainPath` para
  `/Users/anderson/Documents/obsidian/…`, que não existe aqui, e a CLI `loop` não está
  instalada. A sessão de leitura do cérebro não foi aberta, e nenhum run de escrita foi
  aberto ou fechado. O aprendizado desta sessão precisa ser gravado numa máquina com o vault.
- **A verificação em simulador.** É Linux; não há simulador iOS. Nenhuma tela desta passagem
  foi vista.
- Foi possível, e foi feito: `npm ci`, `npm run typecheck` limpo, e os contratos
  `tab-bar-clearance`, `contrast`, `identity-palette` e `pixel-screen-geometry` passando na
  base `e184be4`.

A consequência prática é a regra da passagem anterior, que custou três defeitos que 691 testes
não pegaram: **o portão estático não é suficiente para declarar esta passagem pronta.** A
implementação precisa fechar em máquina com simulador.
