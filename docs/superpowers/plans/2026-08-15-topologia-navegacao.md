# Topologia de navegação: Estude e Perfil — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer da aba Estude a trilha contínua do currículo inteiro, absorver a Galáxia, separar o console de desenvolvimento da tela do aluno, criar o Perfil que agrega Progresso e Missões, e convergir os dois caminhos de entrega de lição para que a conclusão do sub-projeto 1 passe a ser alcançável.

**Architecture:** A ordenação sequencial das trilhas já existe em `JourneyTrackUnlockService` (`sortTracks`, `resolveTrackAccess`) e é a espinha da trilha contínua — nada de ordenação nova é inventado. Um serviço novo concatena as trilhas ordenadas num único percurso e é a **única** peça que mexe em dado; todo o resto é composição de tela. O `JourneyMap` deixa de ser lista de seções por unidade e vira caminho único. O console sai da `ProgressScreen` para uma rota montada sob flag, e o que sobra dela migra para o Perfil.

**Tech Stack:** React Native / Expo SDK 54, TypeScript, expo-router, Jest + @testing-library/react-native, AsyncStorage.

**Spec:** [docs/superpowers/specs/2026-08-15-topologia-navegacao-design.md](../specs/2026-08-15-topologia-navegacao-design.md)
**ADR:** [ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil](../../adr/ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md)

## Global Constraints

Valem para **todas** as tarefas, sem exceção:

- **Toda alteração de arquivo acontece dentro de uma transação Loop.** Sequência obrigatória
  por tarefa: `loop run start` → `loop context build` → `loop step begin --files <cada
  arquivo>` → editar → `loop validate` → `loop step finish` → `loop run close`.
- **Nunca encadeie comandos da CLI com `&&`.** A CLI reporta erro no corpo do JSON com status
  de saída zero; o `&&` não protege. Extraia o `code` de cada resposta.
- **A auto-revisão do que você escreveu vem ANTES de `loop validate`.** Depois de
  `VALIDATION_PASSED` a máquina de estados só aceita `step finish`.
- **Arquivos novos e apagados também são declarados** no `step begin`. Esta passagem apaga
  arquivos, o que a passagem anterior não fazia — e o guarda de escopo compara o repositório
  inteiro contra a baseline da abertura.
- **`git status --porcelain` antes de abrir cada run.** Desfazer também é mudança.
- **Portão de qualidade:** `npm run quality` dentro de `radiant-app`, com os 13 validadores.
  Nenhum validador é desligado, afrouxado ou contornado.
- **Verificação em simulador é obrigatória antes de declarar qualquer fase pronta.** Nenhum
  validador estático enxerga tela; na passagem anterior a checagem visual achou três defeitos
  que 691 testes não pegaram. As fases B e C são quase inteiramente visuais.
- **Paleta:** telas não importam a paleta clara `colors`. Cor nova entra como token dentro de
  `galaxyColors`, em `src/ui/theme.ts`.
- **Contraste:** nenhum estado de nó é sinalizado por `opacity` no bloco, porque apagaria o
  texto junto e reprovaria o `contrast-contract`. Quem perde cor é a arte, nunca o rótulo.
- Todos os caminhos abaixo são relativos a `radiant-app/`.

## Fases

Quatro fases, cada uma um PR próprio. A ordem não é arbitrária: **A** é o pré-requisito que a
spec chama de "separação antes da agregação"; **B** constrói a trilha antes de a aba mudar de
dono; **C** troca a topologia com a trilha já pronta; **D** é a convergência que faz o
sub-projeto 1 aparecer.

| Fase | Entrega | Tarefas |
| --- | --- | --- |
| A | Console de desenvolvimento fora da tela do aluno | 1–3 |
| B | Trilha contínua do currículo inteiro | 4–8 |
| C | Duas abas, Perfil, Galáxia absorvida | 9–14 |
| D | Convergência de `/learn` e `/quiz` | 15–18 |

**A fase D pode ser adiantada.** Ela é independente de A, B e C, e é a de maior valor por
esforço: hoje o aluno termina uma lição e volta em silêncio para a aba. Se a passagem precisar
ser cortada, corte por B ou C, nunca por D.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/app/dev-console.tsx` | Rota do console, montada só sob `SHOW_DEV_TOOLS` |
| `src/features/dev-console/screens/DevConsoleScreen.tsx` | Flags, health da API, reset local |
| `src/features/journey/services/JourneyCurriculumService.ts` | Percurso contínuo: trilhas ordenadas → um caminho |
| `src/features/journey/components/JourneyTrail.tsx` | O caminho contínuo (substitui `JourneyMap`) |
| `src/features/journey/components/JourneyLevelBand.tsx` | Faixa "próximo nível" na transição de trilha |
| `src/features/journey/components/JourneyNodeCard.tsx` | Ganha estrelas e cor de estado no rótulo |
| `src/features/profile/screens/ProfileScreen.tsx` | Progresso + Missões + identidade |
| `src/features/missions/screens/MissionsScreen.tsx` | Movida de `features/galaxy` |
| `src/app/(tabs)/_layout.tsx` | Duas abas |
| `src/app/(tabs)/profile.tsx` | Rota da aba Perfil |
| `scripts/tab-bar-clearance-contract.test.mjs` | Reescrito com a topologia nova |
| `src/features/lesson-flow/screens/LessonFlowScreen.tsx` | Adota `QuizTopBar` e `LessonSummary` |

**Apagados ao final:** `src/app/(tabs)/galaxy.tsx`, `src/app/(tabs)/progress.tsx`,
`src/app/(tabs)/missions.tsx`, `src/features/galaxy/screens/GalaxyMapScreen.tsx`,
`src/features/journey/components/JourneyMap.tsx`, `src/app/quiz.tsx`.

---

# Fase A — o console sai da tela do aluno

### Task 1: Rota do console sob flag

**Files:**
- Create: `src/app/dev-console.tsx`
- Create: `src/features/dev-console/screens/DevConsoleScreen.tsx`
- Test: `src/features/dev-console/screens/DevConsoleScreen.flow.test.tsx`

**Interfaces:**
- Consumes: `AppConfig.SHOW_DEV_TOOLS` de `src/config.ts`.
- Produces: rota `/dev-console`.

**Por que a rota vem antes da mudança:** criar o destino primeiro deixa a Task 2 ser um
movimento puro, sem inventar tela e mover conteúdo no mesmo passo. O precedente de forma é
`src/app/telemetry.tsx`.

`SHOW_DEV_TOOLS` tem padrão `__DEV__ || EXPO_PUBLIC_ENABLE_DEV_TOOLS`, então em build de
release a rota some sem flag nova.

- [ ] **Step 1: Teste que falha** — a rota monta com `SHOW_DEV_TOOLS: true` e **não** monta com `false`.
- [ ] **Step 2: Implementar** a tela vazia com título e a montagem condicional.
- [ ] **Step 3: `npm run quality`.**

### Task 2: Mover o console da ProgressScreen

**Files:**
- Modify: `src/features/dev-console/screens/DevConsoleScreen.tsx`
- Modify: `src/features/progress/screens/ProgressScreen.tsx`
- Modify: `src/features/progress/screens/ProgressScreen.flow.test.tsx`

**Migram para o console:** `Catálogo local`; `Homologação iOS V2` inteiro (Learning Road, Beta
Gate, Sync remoto, Telemetry Debug, Modo); health da API e o rótulo de `API_BASE_URL`; o reset
de estado local do smoke da Learning Road; o botão de abrir o Telemetry Debug.

**NÃO migram, e é a distinção que importa:** login, recuperação e redefinição de senha, fila
de sync e badge de auth. Isso não é console — é a identidade do aluno, e no Perfil vira
cabeçalho. Fica na `ProgressScreen` até a Task 10 levá-lo ao Perfil.

- [ ] **Step 1: Teste que falha** — `ProgressScreen` não renderiza nenhum controle de flag, health de API ou reset; `DevConsoleScreen` renderiza todos.
- [ ] **Step 2: Mover** os blocos, sem reescrevê-los.
- [ ] **Step 3: `npm run quality`.**

### Task 3: Corrigir o card claro

**Files:**
- Modify: `src/features/progress/screens/ProgressScreen.tsx`

O bloco de tópicos dominados é embrulhado por `styles.whiteCard`. Card claro em identidade
galaxy dark é a classe de defeito que produziu os dois P0 de design. O
`identity-palette-contract` **não pega este caso** — ele proíbe a importação da paleta clara
primitiva, não um branco escrito à mão.

- [ ] **Step 1:** trocar `whiteCard` por `GlassCard`.
- [ ] **Step 2: `npm run quality`.**
- [ ] **Step 3: Verificação em simulador** — o card lê corretamente sobre o fundo escuro.

---

# Fase B — a trilha contínua

### Task 4: Serviço do percurso contínuo

**Files:**
- Create: `src/features/journey/services/JourneyCurriculumService.ts`
- Test: `src/features/journey/services/JourneyCurriculumService.test.ts`

**Interfaces:**
- Consumes: `sortTracks` e `resolveTrackAccess` de `JourneyTrackUnlockService`;
  `LessonCatalogService.listTracks()`; `JourneyDefinitionService.getTrackDefinition(trackId)`;
  `JourneyRecommendationService.computeSnapshot`.
- Produces:
  `type CurriculumSegment = { trackId: string; trackTitle: string; unlocked: boolean; order: number; units: JourneyUnit[] }`
  e `getCurriculumTrail(): Promise<{ segments: CurriculumSegment[]; recommendedNodeId?: string }>`.

**Esta é a única tarefa que mexe em dado, e o risco da passagem inteira mora aqui.** Todo o
sistema de jornada é hoje escopado a **uma** trilha: `JourneyProgress` tem `activeTrackId`, o
store é `tracks: { [trackId]: progress }`, e cada API recebe um `trackDefinition` que assume o
ativo. Um percurso contínuo precisa de estado das trilhas **todas**.

**Não invente ordenação.** `sortTracks` já resolve `order` explícito com desempate por posição,
e `resolveTrackAccess` já dá o destravamento sequencial — trilha N aberta se N−1 concluída. O
serviço concatena o que esses dois já decidem.

**Nós de trilha bloqueada entram no percurso com `status: 'locked'`**, independentemente do que
a recomendação daquela trilha diria isoladamente. É isso que dá ao aluno o "o que vem" da
referência.

- [ ] **Step 1: Teste que falha** — trilhas saem na ordem de `sortTracks`; a segunda trilha vem inteira bloqueada enquanto a primeira não fecha; o `recommendedNodeId` é o da trilha ativa; catálogo vazio devolve lista vazia sem lançar.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**

**Nota de desempenho, medida e não adivinhada:** o catálogo de hoje tem ~29 lições em
`src/data/catalog.ts` e 6 entradas em `ProductionCurriculumCatalog` — dezenas de nós, que
rolam sem virtualização. **Não virtualize agora**; seria projetar para requisito inexistente. O
gatilho está registrado na Task 5.

### Task 5: `JourneyTrail` — o caminho único

**Files:**
- Create: `src/features/journey/components/JourneyTrail.tsx`
- Test: `src/features/journey/components/JourneyTrail.test.tsx`
- Delete (ao final da fase): `src/features/journey/components/JourneyMap.tsx`

**O que muda em relação ao `JourneyMap`:**

1. **Sem quebra por unidade.** Hoje é `units.map(unit => <título> + <trilho próprio>)`. O
   título de unidade deixa de partir o caminho.
2. **Sem card.** Hoje tudo vive dentro de `styles.card`, com borda e fundo. Na referência o
   caminho fica direto sobre o fundo preto.
3. **Sem trilho reto central.** Hoje é uma barra de 8pt em `left: 50%`. Vira traçado
   pontilhado ligando nó a nó.
4. **Recebe `segments`,** não `units`.

**O que NÃO precisa ser feito:** a alternância esquerda/direita já existe —
`JourneyNodeCard` calcula `alignRight = nodeIndex % 2 === 1`. O índice passa a ser contínuo ao
longo do percurso, não reiniciado por unidade.

**Gatilho de virtualização, para não voltar a ser decidido por palpite:** quando o percurso
passar de ~150 nós, ou quando a rolagem da trilha medir queda de frame no simulador, troque o
`ScrollView` por lista virtualizada. Registre a medição junto.

- [ ] **Step 1: Teste que falha** — renderiza os nós de todos os segmentos em sequência; não emite título de unidade como cabeçalho separador; índice de alternância é contínuo entre unidades.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**
- [ ] **Step 4: Verificação em simulador** — o caminho lê como um percurso só.

### Task 6: Estrelas no nó

**Files:**
- Modify: `src/features/journey/components/JourneyNodeCard.tsx`
- Test: `src/features/journey/components/JourneyNodeCard.test.tsx`

**Interfaces:**
- Consumes: `resolveBestLessonStars` de `src/features/quiz/services/resolveLessonStars.ts`;
  as tentativas de `LearningAttemptsRepository`.

**Esta é a tarefa que faz o sub-projeto 1 aparecer na trilha.** A regra das três estrelas por
faixa de acurácia, pela melhor tentativa, já existe e está testada — hoje só é usada na tela de
conclusão. O nó ganha as mesmas três estrelas abaixo do rótulo, como na referência.

Nó sem tentativa registrada mostra três estrelas vazias. Nó que não é lição — `review`,
`checkpoint`, `reward` — não mostra estrelas.

**Acessibilidade:** as estrelas precisam de rótulo lido por leitor de tela. A passagem anterior
enviou estrelas sem anúncio e a checagem visual pegou; não repita.

- [ ] **Step 1: Teste que falha** — as quatro faixas rendem 0/1/2/3 estrelas; nó sem tentativa rende três vazias; nó não-lição não rende estrelas; o conjunto é anunciado.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**

### Task 7: Estado por cor do rótulo

**Files:**
- Modify: `src/features/journey/components/JourneyNodeCard.tsx`
- Modify: `src/ui/theme.ts` (tokens de pílula, se faltarem)

Na referência o rótulo codifica estado: cinza bloqueado, verde concluído, azul
próximo/disponível. Hoje o `JourneyNodeCard` sinaliza por cadeado, borda tracejada e cor de
âncora — o rótulo em si não muda.

**O texto do rótulo continua branco e legível em todos os estados**, inclusive no bloqueado.
"Ficar escuro" aplicado ao texto reprova o `contrast-contract`; na referência quem perde cor é
a arte. Rode o `contrast-contract` com os tokens novos antes de considerar a tarefa fechada.

- [ ] **Step 1: Teste que falha** — cada estado rende sua cor de pílula; o texto mantém o token de alto contraste em todos.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`, com atenção ao `contrast-contract`.**

### Task 8: Faixa de próximo nível

**Files:**
- Create: `src/features/journey/components/JourneyLevelBand.tsx`
- Test: `src/features/journey/components/JourneyLevelBand.test.tsx`
- Modify: `src/features/journey/components/JourneyTrail.tsx`

Na transição entre segmentos, o percurso mostra a faixa com cadeado e o nome da trilha
seguinte — a "PRÓXIMO NÍVEL" da referência. É o que substitui o título de unidade que a Task 5
removeu: **o marco passa a viver ao longo do caminho, não como cabeçalho que o parte.**

- [ ] **Step 1: Teste que falha** — a faixa aparece entre segmentos e nomeia a trilha seguinte; não aparece depois do último.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**
- [ ] **Step 4: Verificação em simulador.**

---

# Fase C — a topologia

### Task 9: Estude passa a ser a trilha

**Files:**
- Modify: `src/features/journey/screens/JourneyHomeScreen.tsx`
- Modify: `src/features/journey/screens/JourneyHomeScreen.test.tsx`

**Sai:** o card "Foco de hoje", com as três linhas — próximo, disponível agora, offline. A
trilha diz as três melhor: o nó destacado é o próximo, os abertos são o disponível, e estado
offline não é assunto de tela inicial.

**Fica:** o HUD do topo e o `JourneyHero` com a fala esporádica do Pixel. A referência R1
também tem linha de stats no topo, e a fala do Pixel é decisão registrada que nada aqui revoga.

**Entra:** `JourneyTrail`, e o CTA `Continuar` perto da base.

- [ ] **Step 1: Teste que falha** — a tela renderiza nós de trilha; não renderiza mais o card "Foco de hoje"; mantém HUD e hero.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**
- [ ] **Step 4: Verificação em simulador.**

### Task 10: `ProfileScreen`

**Files:**
- Create: `src/features/profile/screens/ProfileScreen.tsx`
- Create: `src/app/(tabs)/profile.tsx`
- Test: `src/features/profile/screens/ProfileScreen.flow.test.tsx`
- Move: `src/features/galaxy/screens/MissionsScreen.tsx` → `src/features/missions/screens/MissionsScreen.tsx`

**Agrega:** o progresso do aluno que sobrou da `ProgressScreen` (streak, acurácia, XP, tópicos
dominados), as Missões inteiras, e a identidade — login, recuperação de senha, fila de sync —
como cabeçalho.

`MissionsScreen` é 100% tela de aluno e migra inteira. Ela vive hoje sob a feature `galaxy`,
com a qual não tem relação; a migração é a hora de corrigir isso.

**A composição visual do Perfil é o sub-projeto 3.** Esta tarefa cria a aba e move o conteúdo
para dentro dela; não organiza.

**Reserva `tabBarClearance`** no contêiner de rolagem — é tela de aba e a barra flutua.

- [ ] **Step 1: Teste que falha** — o Perfil renderiza progresso, missões e identidade, e **nenhum** controle de console.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**
- [ ] **Step 4: Verificação em simulador.**

### Task 11: Duas abas

**Files:**
- Modify: `src/app/(tabs)/_layout.tsx`
- Delete: `src/app/(tabs)/galaxy.tsx`, `src/app/(tabs)/progress.tsx`, `src/app/(tabs)/missions.tsx`

A barra fica com Estude e Perfil. **A barra continua sendo cartão flutuante** — flutuante
contra rente não foi decidido, e esta passagem não decide.

- [ ] **Step 1: Teste que falha** — a barra expõe duas abas e nenhuma das três removidas.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**

### Task 12: Absorver a Galáxia

**Files:**
- Delete: `src/features/galaxy/screens/GalaxyMapScreen.tsx`
- Modify ou Delete: `src/app/galaxy/[galaxyId].tsx`, `src/app/galaxy/[galaxyId]/[bodyId].tsx`

**Verificação que abre a tarefa, e que pode pará-la:** confirmar que a trilha contínua alcança
**todo nó** que a cadeia `GalaxyMapScreen → GalaxyInteriorScreen → PlanetInteriorScreen`
alcançava. A `PlanetInteriorScreen` empurra para `/learn`; se houver nó que só ela abre,
apagá-la corta conteúdo do currículo em vez de reorganizá-lo.

Se a verificação reprovar, **as rotas interiores ficam** e a tarefa vira "reancorar", não
"apagar". Registre o resultado da verificação seja qual for.

- [ ] **Step 1:** rodar a verificação de cobertura e registrar o resultado.
- [ ] **Step 2: Teste que falha** — nenhum nó do currículo fica inalcançável a partir de Estude.
- [ ] **Step 3: Implementar** conforme o resultado do Step 1.
- [ ] **Step 4: `npm run quality`.**

### Task 13: Reescrever o contrato de clearance

**Files:**
- Modify: `scripts/tab-bar-clearance-contract.test.mjs`

A lista passa a ser `JourneyHomeScreen` e `ProfileScreen`. As três regras que o contrato
afirma continuam valendo sem alteração.

**O comentário do topo sobrevive à reescrita** — ele registra que o defeito já vazou uma vez,
no CTA da Home, e que review por tela não o impediu. É a razão de o contrato existir.

**Armadilha a fechar:** a lista atual inclui `HomeScreen`, que já hoje não é tela de aba —
`index.tsx` renderiza `JourneyHomeScreen` quando `ENABLE_LEARNING_ROAD` é verdadeira, e o
padrão é verdadeiro. Uma lista escrita à mão envelhece em silêncio. **Derive a lista do próprio
`_layout.tsx`** em vez de repeti-la.

- [ ] **Step 1: Teste que falha** — o contrato reprova uma tela de aba sem `tabBarClearance` e aprova a topologia nova.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**

### Task 14: Flows de Maestro

**Files:**
- Modify: os flows em `.maestro/` que navegam por abas nomeadas

Os flows de E2E navegam por nome de aba; a renomeação os quebra. O `maestro-contract` é um dos
13 validadores.

- [ ] **Step 1:** levantar quais flows nomeiam abas removidas.
- [ ] **Step 2:** atualizar.
- [ ] **Step 3: `npm run quality`.**

---

# Fase D — a convergência

### Task 15: Verificar a cobertura de `/review`

**Files:** nenhum — é levantamento.

O modo de revisão (`/quiz?mode=review&lessonIds=…`) é a única razão funcional que resta à rota
`/quiz`. A rota `/review` existe em paralelo e é para onde `HomeScreen` e
`PlanetInteriorScreen` mandam revisão.

**Se `/review` não cobrir o caso por completo, `/quiz` não pode ser aposentada nesta passagem**
e a Task 18 sai do escopo. Este plano não afirma que cobre.

- [ ] **Step 1:** comparar os dois caminhos de revisão e registrar o resultado.

### Task 16: `/learn` adota o topo enxuto

**Files:**
- Modify: `src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- Delete: `src/features/lesson-flow/components/LessonFlowProgressHeader.tsx`
- Modify: os testes de fluxo de `LessonFlowScreen`

O cabeçalho atual repete título e contagem — a mesma repetição que o sub-projeto 1 removeu do
quiz. Cede lugar ao `QuizTopBar`: uma linha, `X` à esquerda, barra no meio, corações à direita.

- [ ] **Step 1: Teste que falha** — a tela renderiza `QuizTopBar` e não o cabeçalho antigo.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**
- [ ] **Step 4: Verificação em simulador.**

### Task 17: `/learn` mostra a conclusão

**Files:**
- Modify: `src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- Modify: os testes de fluxo

Hoje, terminada a última interação, a tela chama `LessonOutcomeService`, marca o nó e executa
`router.replace('/(tabs)')` — o aluno acaba a lição e volta em silêncio para a aba. Passa a
renderizar `LessonSummary` com o resultado da tentativa.

**A regra da melhor tentativa acorda sozinha.** `/learn` **já é** o escritor de
`LearningAttemptsRepository` via `LessonOutcomeService.recordAttempt`, então `previousBest`
acumula de verdade desde a primeira execução. Nada precisa ser adivinhado — nem `topicId`, que
`LessonOutcomeService.resolveNode` já resolve.

**Ordem que importa:** `recordAttempt` grava a tentativa atual **antes** de a conclusão ser
exibida. `resolveBestLessonStars` recebe `completedAt` justamente para excluir a tentativa
atual do histórico; passe o mesmo valor que o `LessonOutcomeService` gravou, ou `improved` sai
sempre `false`.

- [ ] **Step 1: Teste que falha** — ao terminar, a tela renderiza `LessonSummary` em vez de sair; as estrelas refletem a melhor tentativa acumulada; `improved` é verdadeiro quando a tentativa supera a marca.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**
- [ ] **Step 4: Verificação em simulador** — percorrer uma lição inteira até a conclusão, duas vezes, com desempenhos diferentes.

### Task 18: Aposentar `/quiz`

**Files:**
- Delete: `src/app/quiz.tsx`, `src/features/quiz/screens/QuizScreen.tsx` e seus testes de fluxo

**Condicionada ao resultado da Task 15.**

**Sobrevivem, e são o produto do sub-projeto 1:** `QuizTopBar`, `LessonSummary`,
`resolveLessonStars`, `lessonSummaryPhrases`, `LessonRatingService` — todos passam a ser
consumidos por `/learn`.

- [ ] **Step 1: Teste que falha** — nenhum import remanescente de `QuizScreen`.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: `npm run quality`.**

---

## Pendências que este plano não resolve

- **Pergunta aberta 2** — cartão flutuante ou barra rente. A barra segue flutuante.
- **Pergunta aberta 8** — o prompt nativo de avaliação da App Store colide com a avaliação da
  aula. Fica **mais urgente** ao fim da fase D, porque a conclusão passa a receber tráfego
  real pela primeira vez.
- **Ilustração por aula e dessaturação do nó bloqueado** — sub-projeto 5, bloqueado por assets
  autorais. A trilha contínua é construída com os nós como estão; a dessaturação só faz sentido
  quando houver arte para dessaturar.
- **Composição visual do Perfil** — sub-projeto 3.
