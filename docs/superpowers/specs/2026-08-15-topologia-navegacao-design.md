# Design — Topologia de navegação: Estude e Perfil

**Data:** 2026-08-15
**Sub-projeto:** 2 de 6 da reformulação guiada pelo EWA
**Estado:** decisões do dono tomadas em sessão interativa; pronto para virar plano de implementação
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
2. **A Galáxia não é decorativa.** O `ADR-2026-08-13-home-e-galaxia-progressao-unica`, aceito
   e implementado dois dias atrás, a define como a **única** superfície de exploração — o
   catálogo de trilhas e o `JourneyMap`. E a `PlanetInteriorScreen`, que vive dentro dela, é
   um dos três únicos lugares do app que empurram para `/learn`.
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
| 1 | Destino da Galáxia | Deixa de ser aba e vira superfície interna de Estude |
| 2 | Console de desenvolvimento | Sai para rota própria fora das abas, atrás de `SHOW_DEV_TOOLS` |
| 3 | Convergência de lição | `/learn` adota os componentes novos; `/quiz` é aposentada |
| 4 | Liga (sub-projeto 6) | Vira métrica local — o aluno comparado com ele mesmo |

A decisão 1 resolve a pergunta aberta 1 do documento de direção. A decisão 4 resolve a
pergunta 7 e destrava o sub-projeto 6 **sem** revisar o contrato de privacidade — mas o
sub-projeto 6 continua fora desta passagem.

As decisões 2 e 3 não estavam entre as oito perguntas abertas; nasceram da medição do
repositório descrita na seção 1.

## 3. Topologia

### 3.1 A barra

Duas abas:

| Aba | Rota | Tela |
| --- | --- | --- |
| Estude | `src/app/(tabs)/index.tsx` | `JourneyHomeScreen` (inalterada nesta passagem) |
| Perfil | `src/app/(tabs)/profile.tsx` | `ProfileScreen` (nova, sub-projeto 3) |

Saem da barra: `galaxy.tsx`, `progress.tsx`, `missions.tsx`.

**A barra continua sendo cartão flutuante.** A pergunta aberta 2 — cartão flutuante ou barra
rente à borda, como no EWA — **não foi decidida** e este documento não a decide. A
consequência é deliberada: enquanto a barra flutuar com `position: absolute`, ela cobre
conteúdo rolável, e `tabBarClearance` continua sendo uma obrigação real de toda tela de aba.
Se a barra virar rente, o contrato de clearance perde o motivo de existir e precisa ser
revisto por inteiro — trabalho de outra passagem, com outra decisão.

### 3.2 A Galáxia

Ela **não é removida e não perde papel**. Deixa de ser destino de aba e passa a ser alcançada
a partir da Home, por um ponto de entrada explícito de exploração no cabeçalho do mapa.

O `ADR-2026-08-13` continua valendo palavra por palavra: Home é a superfície de retomada,
Galáxia é a única superfície de exploração. O que muda é **como se chega nela**, não o que
ela é.

Rotas preservadas, intactas:

- `src/app/galaxy/[galaxyId].tsx` → `GalaxyInteriorScreen`
- `src/app/galaxy/[galaxyId]/[bodyId].tsx` → `PlanetInteriorScreen`

`GalaxyMapScreen` deixa de ser `src/app/(tabs)/galaxy.tsx` e passa a viver numa rota fora do
grupo de abas. Isso preserva a cadeia `GalaxyMapScreen → GalaxyInteriorScreen →
PlanetInteriorScreen → /learn`, que é um caminho de entrega de lição vivo e que uma remoção
apressada da aba teria cortado.

**Consequência para o clearance:** fora do grupo `(tabs)`, a `GalaxyMapScreen` deixa de ter a
barra flutuando sobre ela e deixa de precisar de `tabBarClearance`. O mesmo vale para
`MissionsScreen` enquanto ela não estiver dentro do Perfil. O contrato precisa refletir isso,
e é por isso que ele é reescrito e não afrouxado — ver seção 6.1.

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

Um achado a corrigir na mudança: o bloco de tópicos dominados é embrulhado hoje por um
`styles.whiteCard`. Card claro em identidade galaxy dark é exatamente a classe de defeito que
o `identity-palette-contract` existe para impedir — e ele não pega este caso, porque o
contrato proíbe a **importação** da paleta clara primitiva, não um branco escrito à mão. O
card precisa virar `GlassCard` na migração.

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
