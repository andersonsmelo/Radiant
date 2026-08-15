# ADR — Topologia de navegação: Estude e Perfil (2026-08-15)

**Status:** aceita; não implementada
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** sessão interativa de planejamento do sub-projeto 2 da reformulação
guiada pelo EWA, com medição do repositório

## Contexto

O dono decidiu, sobre a referência R4 do EWA, manter **Estude** e **Perfil** na tab bar, com
Progresso e Missões agregados dentro do Perfil. A barra tem hoje quatro abas — Home, Galáxia,
Progresso, Missões — e a aba Perfil não existe.

Duas coisas impediam a execução direta dessa decisão, e a medição do repositório expôs uma
terceira:

1. **O destino da Galáxia nunca tinha sido decidido.** O dono nomeou Estude, Perfil, Progresso
   e Missões, e não a citou. Mas o `ADR-2026-08-13-home-e-galaxia-progressao-unica`, aceito e
   implementado, a define como a **única** superfície de exploração do produto, e a
   `PlanetInteriorScreen` que vive dentro dela é um dos três únicos lugares do app que
   empurram para `/learn`. Removê-la da barra sem plano cortaria um caminho de entrega de
   lição vivo.
2. **A `ProgressScreen` não é uma tela de aluno.** São 1057 linhas com progresso do aluno,
   conta e sincronização, e um console de desenvolvimento — Learning Road, Beta Gate, Sync
   remoto, Telemetry Debug, health da API e reset de estado local. Agregá-la ao Perfil como
   está arrastaria o console para dentro do perfil do aluno.
3. **O caminho vivo de lição não tem tela de conclusão.** O `LessonFlowScreen` (`/learn`)
   termina em `router.replace('/(tabs)')`. Todo o fim de lição entregue no sub-projeto 1 —
   estrelas, frase variável, placar, avaliação da aula — está no `QuizScreen`, na rota
   `/quiz`, que não tem nenhum ponto de entrada in-app.

## Decisão

- a tab bar passa a ter **duas** abas: Estude (`JourneyHomeScreen`) e Perfil
  (`ProfileScreen`, nova);
- a **Galáxia deixa de ser aba e vira superfície interna de Estude**, alcançada por um ponto
  de entrada de exploração na Home. Ela não perde papel: o `ADR-2026-08-13` continua valendo
  palavra por palavra, e as rotas `/galaxy/[galaxyId]` e `/galaxy/[galaxyId]/[bodyId]`
  permanecem intactas, preservando a cadeia até `/learn`;
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
- fora do grupo `(tabs)`, `GalaxyMapScreen` deixa de precisar de `tabBarClearance`;
- os flows de Maestro que navegam por abas nomeadas quebram e precisam acompanhar;
- a colisão entre o prompt nativo de avaliação da App Store e a avaliação da aula fica mais
  urgente, porque a tela de conclusão passa a receber tráfego real;
- o sub-projeto 3 (composição visual do Perfil) fica destravado; esta passagem cria a aba e
  move o conteúdo, não o organiza.

## Alternativas descartadas

**Galáxia como terceira aba:** preservaria o ADR de 13/08 sem esforço nenhum, mas contraria a
decisão explícita do dono sobre a barra.

**Galáxia aposentada, catálogo absorvido pela Home:** revogaria na prática o ADR de 13/08 e
obrigaria a reancorar `PlanetInteriorScreen`, `GalaxyInteriorScreen` e as rotas interiores. É
o caminho mais caro, e paga por um problema que a superfície interna resolve.

**Console num recuo dentro do Perfil ("Avançado"):** moveria menos código, mas manteria o
console no perfil do aluno — só recuado — e empurraria o problema para o sub-projeto 3.

**Console removido do app inteiro:** mais limpo para o aluno, mas custaria a homologação em
aparelho que hoje depende dessa tela.

**`/quiz` ganhando entrada e virando o caminho de lição:** exigiria escrever a persistência de
tentativa a partir do `QuizScreen` e adivinhar `topicId` — que é exatamente o motivo pelo qual
a spec do sub-projeto 1 não o fez.
