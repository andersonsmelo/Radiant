# ADR — Topologia de navegação: Estude e Perfil (2026-08-15)

**Status:** **aprovada pelo dono em 2026-08-15**; não implementada. **Supera
[`ADR-2026-08-13-home-e-galaxia-progressao-unica`](ADR-2026-08-13-home-e-galaxia-progressao-unica.md).**
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** sessão interativa de planejamento do sub-projeto 2 da reformulação
guiada pelo EWA, com medição do repositório

> **Revisada no mesmo dia.** A primeira versão desta ADR mandava a Galáxia virar superfície
> interna de Estude, preservando o ADR de 13/08. Ela se apoiava numa afirmação do documento de
> direção — "a home já é a trilha" — que **não confere com o código**. A leitura do
> `JourneyHomeScreen` mostrou que a aba Estude não tem trilha nenhuma, e que a trilha mora na
> Galáxia. Com a premissa corrigida e a direção da trilha contínua dada pelo dono, a decisão
> mudou. O registro do erro fica porque ele explica por que a recomendação anterior existia.

## Contexto

O dono decidiu, sobre a referência R4 do EWA, manter **Estude** e **Perfil** na tab bar, com
Progresso e Missões agregados dentro do Perfil. A barra tem hoje quatro abas — Home, Galáxia,
Progresso, Missões — e a aba Perfil não existe.

Duas coisas impediam a execução direta dessa decisão, e a medição do repositório expôs uma
terceira:

1. **O destino da Galáxia nunca tinha sido decidido**, e o repositório estava mal descrito
   sobre ela. O documento de direção afirma que "a home já é a trilha desde `0ceff49`". **É
   falso.** `JourneyHomeScreen` — a aba Estude — renderiza HUD, `JourneyHero`, um card "Foco
   de hoje" com três linhas de estatística e um botão "Continuar jornada". Nenhum nó, nenhum
   caminho. Quem renderiza `JourneyMap` é a `GalaxyMapScreen`: **a trilha mora na Galáxia.**
   Além disso, a `PlanetInteriorScreen`, dentro dela, é um dos três únicos lugares do app que
   empurram para `/learn`.
2. **A `ProgressScreen` não é uma tela de aluno.** São 1057 linhas com progresso do aluno,
   conta e sincronização, e um console de desenvolvimento — Learning Road, Beta Gate, Sync
   remoto, Telemetry Debug, health da API e reset de estado local. Agregá-la ao Perfil como
   está arrastaria o console para dentro do perfil do aluno.
3. **O caminho vivo de lição não tem tela de conclusão.** O `LessonFlowScreen` (`/learn`)
   termina em `router.replace('/(tabs)')`. Todo o fim de lição entregue no sub-projeto 1 —
   estrelas, frase variável, placar, avaliação da aula — está no `QuizScreen`, na rota
   `/quiz`, que não tem nenhum ponto de entrada in-app.

## Decisão

- a tab bar passa a ter **duas** abas: Estude e Perfil (`ProfileScreen`, nova);
- **Estude passa a ser a trilha**, em rolagem contínua, e não o painel de retomada de hoje. A
  trilha sobe da `GalaxyMapScreen` para a aba;
- a trilha mostra o **currículo inteiro numa rolagem só** — o aluno rola para trás e vê o que
  já fez, rola para frente e vê o que vem bloqueado. Ela deixa de receber as unidades de uma
  trilha ativa e passa a receber as trilhas encadeadas;
- **a trilha é contínua, não seccionada.** Hoje o `JourneyMap` quebra em seções por unidade,
  cada uma com título e trilho próprios, tudo dentro de um card. O caminho passa a ser um só,
  e a unidade vira marco ao longo dele — faixa de "próximo nível" na transição — em vez de
  cabeçalho que o parte;
- **a Galáxia é absorvida por Estude e deixa de existir como superfície.** Sem a trilha, não
  sobra nada dela que Estude não passe a ter. As rotas interiores `/galaxy/[galaxyId]` e
  `/galaxy/[galaxyId]/[bodyId]` precisam ser reancoradas ou aposentadas — e a
  `PlanetInteriorScreen` empurra para `/learn`, então isso é pré-condição, não acabamento;
- a `ProgressScreen` é **separada antes de ser agregada**, em três destinos: progresso do
  aluno e identidade/conta vão para o Perfil; o console de desenvolvimento sai para rota
  própria fora das abas, montada apenas sob `AppConfig.SHOW_DEV_TOOLS`;
- `MissionsScreen` migra inteira para dentro do Perfil — é 100% tela de aluno;
- **`/learn` adota os componentes do sub-projeto 1** (`QuizTopBar`, `LessonSummary`) e
  `/quiz` é aposentada como rota de lição, condicionada à confirmação de que `/review` cobre
  o modo de revisão;
- a barra **continua sendo cartão flutuante**. Cartão flutuante contra barra rente à borda
  não foi decidido e esta ADR não decide.

## Consequências

- `resolveLessonStars` e a regra da melhor tentativa deixam de ser inertes sem código novo de
  persistência: `/learn` já é o escritor de `LearningAttemptsRepository`, então `previousBest`
  passa a acumular de verdade. Nada de `topicId` precisa ser adivinhado —
  `LessonOutcomeService.resolveNode` já o resolve;
- o sub-projeto 1 passa a ser alcançável por aluno. Até esta ADR ser implementada, ele existe
  e ninguém pode vê-lo;
- `tab-bar-clearance-contract` é **reescrito** com a nova topologia, não removido. Três das
  cinco telas que ele lista deixam de ser alcançáveis por aba, e uma delas — `HomeScreen` — já
  não era;
- a `GalaxyMapScreen` deixa de existir; `JourneyMap` sobrevive, reescrito como caminho
  contínuo, e passa a ser renderizado pela aba Estude;
- o `ADR-2026-08-13` é superado. O princípio dele — uma progressão só, sem catálogo
  concorrente — é **cumprido com mais rigor**, porque deixa de haver duas superfícies para
  divergirem;
- os flows de Maestro que navegam por abas nomeadas quebram e precisam acompanhar;
- a colisão entre o prompt nativo de avaliação da App Store e a avaliação da aula fica mais
  urgente, porque a tela de conclusão passa a receber tráfego real;
- o sub-projeto 3 (composição visual do Perfil) fica destravado; esta passagem cria a aba e
  move o conteúdo, não o organiza.

## Alternativas descartadas

**Galáxia como terceira aba:** preservaria o ADR de 13/08 sem esforço nenhum, mas contraria a
decisão explícita do dono sobre a barra.

**Galáxia como superfície interna de Estude:** foi a primeira decisão desta ADR, e caiu com a
premissa que a sustentava. Se a trilha sobe para Estude, a Galáxia fica sem conteúdo próprio —
manter a superfície seria manter uma casca.

**Galáxia com papel novo — visão geral, salto entre níveis distantes:** sobreviveria à trilha
contínua, mas exigiria definir esse papel antes do código, e ainda não existe demanda que o
justifique. Volta à mesa se a rolagem contínua se mostrar longa demais para navegar.

**Trilha contínua limitada ao trecho em volta do aluno:** mais barata e mais perto do que o
código já faz, mas o aluno não veria o currículo inteiro — que é justamente o que a rolagem
contínua da referência entrega.

**Console num recuo dentro do Perfil ("Avançado"):** moveria menos código, mas manteria o
console no perfil do aluno — só recuado — e empurraria o problema para o sub-projeto 3.

**Console removido do app inteiro:** mais limpo para o aluno, mas custaria a homologação em
aparelho que hoje depende dessa tela.

**`/quiz` ganhando entrada e virando o caminho de lição:** exigiria escrever a persistência de
tentativa a partir do `QuizScreen` e adivinhar `topicId` — que é exatamente o motivo pelo qual
a spec do sub-projeto 1 não o fez.
