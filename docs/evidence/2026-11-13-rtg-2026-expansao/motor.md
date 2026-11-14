# Fatia do motor: unidade inserida no meio da trilha (F1 da 1.6)

Levantamento feito em 2026-11-13, antes de qualquer edição de código, por pedido do
controlador da 1.6 (lição 2 de 2026-09-22 no `AGENTS.md`: ao mudar quem alcança um
estado, enumerar as regras dele e quem passa a encontrá-las). Leitura por um agente
Claude Sonnet, conferida pela sessão da F1. Linhas na branch `claude/f1-trilha-ampliada`
no commit `7a89d77`.

## Regra decidida

Entradas: trilhas na ordem; conjunto das concluídas; conjunto das **iniciadas** (com ao
menos um nó concluído, derivado de `completedNodeIds` em `@radiant:journey_progress_v1`,
sem chave nova). `furthest` é o índice da trilha iniciada mais adiante, ou −1.

- **Acesso:** a trilha N está aberta se N = 0, se N−1 está concluída, se a própria N está
  concluída ou iniciada (a), ou se N < `furthest` (b). Para quem não tem progresso nenhum,
  nada muda: ordem estrita.
- **Trilha ativa (c):** sem progresso, a primeira aberta e não concluída. Com progresso,
  a primeira aberta e não concluída a partir de `furthest`; se todas dali em diante estão
  concluídas, a última trilha, como hoje. Uma única função pura serve à Home, ao
  percurso da Estude e ao Perfil.
- **Escrita:** `setCurrentNode` e `setResumableNode` gravam na trilha do nó, não na
  ativa.

Fora da regra, aceito e registrado: quem concluiu M03 e não tinha nenhum nó concluído em
M04 vê M04 fechar e `m15` virar a próxima, porque para ele `m15` é de fato a próxima na
ordem pedagógica. Nada que ele já fez fecha.

Base: `radiant-app/src/...` (caminhos abaixo relativos a `src/`). Análise só de leitura, 2026-11-13. "não conferido" = não li o código a fundo.
Não existe pasta `radiant-app/app`: as rotas estão em `src/app/`.

## 1. Quem decide acesso, trilha ativa e "próximo nó"

### 1.1 Regra em si (`features/journey/services/JourneyTrackUnlockService.ts`)
- `sortTracks` :34 · `resolveTrackAccess` :70-89 (`unlocked = index===0 || previousCompleted`, :78; o `completed` da própria trilha é ignorado) · `resolveActiveTrackId` :99-110 (primeira `unlocked && !completed`, senão a última).
- Docstring :66-68 promete "trilha concluída continua desbloqueada"; o código não cumpre.

### 1.2 Chamadores de produção (7 pontos de decisão; só 3 chamam as funções do serviço)
| # | Onde | O que decide |
|---|------|--------------|
| 1 | `JourneyProgressService.ts:417` (`resolveActiveTrackId`) dentro de `resolveTrackDefinition` :406-422 | Trilha ativa para **todo** `getSnapshot/bootstrap/setCurrentNode/setResumableNode/markLessonNodeCompleted/markReviewNodeCompleted/reset` sem trilha explícita (:63,69,99,126,260,276,289) |
| 2 | `JourneyProgressService.ts:371-383` `isTrackCompleted` privado (usa `completedNodeIds` do store + `trackCompletion.ts:32`) | Conjunto de concluídas que alimenta o item 1 (:414) |
| 3 | `JourneyCurriculumService.ts:110` (`resolveTrackAccess`) | `unlocked/completed` de cada segmento (:125-130); `unlocked=false` rebaixa nós a `locked` via `lockUnreachedUnits` :55-62 |
| 4 | `JourneyCurriculumService.ts:43` `isTrackUnitsCompleted` (por **status** de nó, não por `completedNodeIds`) | Concluídas para o item 3. Segunda derivação, divergente da do item 2 |
| 5 | `JourneyCurriculumService.ts:137-141` (`segments.find(unlocked && !completed)`) | `trail.recommendedNodeId` (duplica a régua de `resolveActiveTrackId`, comentário :135-136) |
| 6 | `features/profile/screens/ProfileScreen.tsx:28-37, :32` (`segments.find(unlocked && !completed)`) | "Unidade atual" da prateleira de medalhas (:87) |
| 7 | `features/journey/screens/JourneyHomeScreen.tsx:138,154,228` | Home: `snapshot.nextRecommendedNode ?? trail.recommendedNodeId` (snapshot vem do item 1; fallback do item 5). `currentStage` :147-173 acha o segmento do nó recomendado, senão o último com nó concluído, senão o primeiro |

Só testes chamam `sortTracks`: `JourneyTrackUnlockService.test.ts`, `rtgExpansionProgress.test.ts:36-44` (prova o contrato atual de que unidade nova só entra no fim; quebra com inserção no meio), `LessonFlowScreen.flow.test.tsx:837` (mock). `JourneyCurriculumService.test.ts:76` só cita.

### 1.3 Quem lê o resultado (`unlocked`, `nextRecommendedNode`, `locked`)
- Snapshot da trilha ativa: `JourneyRecommendationService.computeSnapshot` (:240-282; `NextNodeResolver.resolve` :30 filtra `unlocked && !completed`). Consumidores de `nextRecommendedNode`: `src/app/_layout.tsx:127-131` (saída do primeiro uso, abre o nó), `home/services/createLocalHomeDashboardService.ts:19`, `checkpoint/screens/CheckpointScreen.tsx:68`, `rewards/screens/RewardScreen.tsx:88`, `JourneyHomeScreen.tsx`.
- `src/app/_layout.tsx:270`: `JourneyProgressService.bootstrap()` na restauração de backup (hidrata a trilha ativa).
- `segment.unlocked`: só `JourneyTrail.tsx:537` → `JourneyLevelBand.tsx:31-44` (eyebrow "Próximo nível" vs "Bloqueado", dica "Abre ao concluir <anterior>"; `previousTrackTitle` = segmento anterior na lista, `JourneyTrail.tsx:127`).
- `locked` por nó: `JourneyNodeRouting.canOpenJourneyNode` :4-6 (nó `locked` nunca abre). Usado em `JourneyHomeScreen.tsx:179,210`, `CheckpointScreen.tsx:75`, `RewardScreen.tsx:95`, `_layout.tsx:130`. `JourneyTrail.tsx:547` rotula unidade "Bloqueada" se todos os nós `locked`.
- Cadeado entre trilhas existe **só na tela**: `lockUnreachedUnits` (item 3). Regra de nó (`unlockRule.requiresNodeIds`, `createProductionCurriculumCatalog.ts:124,138,150`, `ProductionCatalogComposition.ts:20`) é **intra-trilha**; o 1º nó de uma trilha não exige nada de outra. Logo `JourneyProgressService.markNodeCompleted` :150-185 não barra deep link para nó de trilha "fechada" (só barra pela regra de nó).

### 1.3.1 Escritas na trilha ERRADA (achado)
`setCurrentNode` (:95-108) e `setResumableNode` (:111-146) resolvem a trilha **ativa**, não a do nó. Chamadores com nó possivelmente de outra trilha: `JourneyHomeScreen.tsx:204` (toque no nó), `LessonFlowScreen.tsx:254-255, 477, 516-517, 530`. `markNodeCompleted` e `getSnapshotForNode` (:83,153) já usam a trilha do nó. Hoje isso só ocorre ao reabrir lição de trilha anterior. Com a regra (c), abrir a unidade inserida atrás do aluno passa a ser o caminho normal: grava `currentNodeId`/`resumableNodeId` estranho no progresso da trilha ativa, o que dispara o aviso de `JourneyHomeScreen.tsx:297-300` ("Seu ponto salvo pertence a um conteúdo atualizado"; checa `resumableNodeId` fora de `snapshot.track`) e perde a retomada da unidade inserida. A conclusão limpa (:516-517) na ativa, então o resíduo só some ao concluir. Conferido por leitura, não executado.

### 1.4 Rotas, deep links, notificações, widgets, revisão
- Rotas `src/app/{learn,checkpoint,reward,quiz,review}.tsx` recebem `nodeId/blockId` crus; não há gate de trilha em `learn.tsx` nem em `LessonFlowScreen` (só `tracksJourney = nodeId !== ''` :127). Nenhum esquema de deep link de trilha encontrado além dessas rotas. Gate efetivo = status do nó na Home + regra de nó em `markNodeCompleted`.
- `LessonFlowScreen.tsx:207-212`, `QuizScreen.tsx:173`, `ReviewScreen.tsx:69`, `ContentAvailability.ts:35`, `DevConsoleScreen.tsx:102`, `LessonOutcomeService.ts:186`: varrem **todas** as trilhas só para achar tema/origem/nó; independem de ordem e de acesso. Sem impacto.
- `progress/services/LearningAttemptRecorder.ts:16`: sem `knownTopicId`, usa o snapshot da trilha **ativa** e descarta a tentativa se a lição não está nela. Os caminhos novos passam `topicId` (`LessonOutcomeService.ts:105,130`); só o legado `QuizScreen.tsx:286` depende da ativa.
- Push (`push/services/PushService.ts`): só `review` e `goal`; não lê trilha (não conferido linha a linha). Widgets: nenhum no `src`. Fila de revisão: `getSnapshot` calcula `dueReviews` só da trilha ativa (`JourneyProgressService.ts:~330-345`), então a "recomendação de revisão vencida" da Home só vê a trilha ativa (já é assim hoje).
- Backup: `progress-sync/LocalProgressAdapter.ts:20,75,100-108` serializa `completedNodesByTrack` por trilha existente no store; `apply` só toca trilhas que já existem localmente. Trilha nova é neutra (id novo, sem conclusão).

Total: 7 pontos de decisão de produção (tabela 1.2) + 5 consumidores diretos de `nextRecommendedNode` + 4 caminhos de escrita por trilha ativa (1.3.1).

## 2. Funcionalidades derivadas de progresso (efeito de unidade inserida, nunca iniciada)

| Funcionalidade | Onde | Efeito de unidade nova não iniciada |
|---|---|---|
| Comemoração de unidade | `journey/components/UnitCompleteCelebration.tsx:21-56`; lida em `JourneyHomeScreen.tsx:117`; chave `@radiant:unit_celebrations_v1` `{schemaVersion:1, unitIds[]}` | Só comemora segmento com **todas** as aulas/conferências `completed` e id fora de `unitIds` (:24,47). Unidade nova sem conclusão: nenhuma festa retroativa; festeja ao concluir de fato (desejado). Um store ausente grava base sem festa (:36-38,51). Risco: alterar `id` de trilha existente ao inserir/renumerar (m15→renomear) faria ele reaparecer como "novo" e festejar se já estiver completo. |
| Conquistas/medalhas | nós `reward` por trilha (`RewardScreen.tsx`); `profile/components/MedalShelf.tsx` mostra aulas da "unidade atual" (`ProfileScreen.currentUnit` :28-37) | Nenhuma conquista é desfeita (completedNodeIds só cresce; `lockUnreachedUnits` :55 preserva concluídos). Nova unidade traz conquista nova não coletada. A prateleira muda de unidade se `recommendedNodeId` mudar (item 5/6 da 1.2). Sem registro global de conquistas além dos nós (não conferido se há outro). |
| Missões diárias | `missions/services/DailyMissionsService.ts:48-139` | Derivam do diário de tentativas e da meta diária; zero dependência de trilha. Sem efeito. |
| XP/nível | `gamification/services/GamificationService.ts`, `levelFromXp.ts` | Sem referência a jornada (grep). Sem efeito. |
| Sequência (streak) | `GamificationService`, `StreakFreezeService` | Idem; vem de atividade, não de trilha. Sem efeito. |
| "N de M" do cabeçalho | `JourneyStageHeader.tsx:28-80`, alimentado por `computeSegmentPrimaryProgress` (`JourneyUnitProgress.ts:41`) sobre o **segmento do nó recomendado** (`JourneyHomeScreen.tsx:147-173`) | Por segmento, não global: unidade nova não altera "N de M" de nenhuma outra. Muda **qual** segmento aparece se a recomendação mover. Contagem de unidades "Unidade X de Y" (`JourneyTrail.tsx:133`) é por trilha (cada trilha tem poucas unidades): sem efeito. |
| Linha de percurso da trilha | `JourneyTrail.tsx:109-120` (`reachedIndex = recommendedIndex`) | Nós da unidade inserida que ficam **antes** do nó recomendado são desenhados como "percorridos" (`traveled`) embora nunca iniciados. Consequência visual da regra (c). |
| Banda de nível | `JourneyLevelBand.tsx:32` | Unidade inserida atrás, agora `unlocked`, diz "Próximo nível" (mentira de cópia). |
| Pixel (momento) | `hooks/useTrailMoment.ts:36-50` | Só anima se o nó recomendado anterior estiver concluído; recomendação que se move por mudança de regra não anima. Baixo risco (não conferido a fundo). |
| Game Center / liga | — | Não existe no `src` (grep). |
| Revisão (SM-2) | `spaced-repetition`, `ReviewScreen.tsx:69-90` | Independe de trilha; unidade nova sem lições concluídas não gera cartões. Sem efeito. |
| Backup | ver 1.4 | Neutro. |

## 3. Regra destino x população

Convenções: "M04" = trilha logo após o ponto de inserção; "m15" = inserida entre M03 e M04. População atual (regra antiga) para comparação.

**(a) trilha concluída continua aberta**
- Aluno novo: não muda nada (nada concluído).
- Concluiu trilhas além do ponto: ganha reabrir m15? Não; (a) só mantém abertas as concluídas. Efeito de (a) é conservar acesso a M01-M03 que já estavam abertas; sem mudança visível. Hoje já estão abertas porque as anteriores concluídas.
- Concluiu tudo: sem mudança por (a).

**(b) trilha N aberta se há nó concluído em trilha posterior** — **o furo**
- Aluno que concluiu M04+: m15 abre (disponível, nada forçado). OK.
- **Aluno no meio de M04 (≥1 nó concluído em M04, nada depois): (b) como escrita NÃO abre M04.** M04 passa a exigir m15 concluída (regra antiga, `previousCompleted`), a menos que se acrescente (b') "ou a própria trilha tem nó concluído". Sem isso M04 fecha em cima do aluno e o resumível some (`canOpenJourneyNode`, `lockUnreachedUnits` :55 preserva só os `completed`).
- **Aluno que concluiu M03 e ainda não tocou M04** (M04 estava aberta e ativa): com m15 no meio, M04 **fecha** (anterior m15 não concluída, sem progresso em M04 nem depois) e a Home passa a recomendar m15 em ordem estrita. É coerente com "aluno novo vai em ordem", mas é mudança visível para quem estava parado na fronteira. Decisão de produto: aceitar ou tratar "M03 concluída" como progresso suficiente para manter M04 aberta.
- Aluno no meio de ramo (trilha de ramo `s-*` ou unidade posterior): (b) abre toda trilha anterior com ordem menor, inclusive m15 e m16, e também qualquer trilha anterior pulada. Compatível. Exceção: `s-*` com ordem posterior que só abre quando as anteriores terminam; sob (b) um ramo só abre pelo critério (b) se houver progresso posterior (ramos mais ao fim). Conferir se os ramos `s-tc..s-ir` são independentes (não conferido; no teste `rtgExpansionProgress.test.ts:19-24` estão como sequência linear de 20).

**(c) trilha ativa conta a partir da trilha mais avançada com progresso**
- Aluno novo: nenhuma trilha com progresso, cai na regra estrita (1ª aberta e incompleta). Preservado se a implementação tratar "sem progresso" explicitamente.
- Aluno além do ponto: ativa = a mais avançada incompleta; m15 aparece como disponível, não forçada. Ok.
- Aluno no meio de M04: ativa continua M04 (se M04 ficar aberta, ver (b')).
- Aluno que concluiu tudo: hoje `resolveActiveTrackId` devolve a **última** (:109-110). Com m15 nova e não concluída, qualquer implementação que reuse "primeira aberta e incompleta" devolveria m15 e puxaria o aluno de volta; precisa devolver a última (ou a mais avançada) como hoje. As cópias (itens 5 e 6 da 1.2) precisam seguir a mesma função, senão Home (snapshot) e Perfil/`trail.recommendedNodeId` discordam (Home usa `snapshot.nextRecommendedNode ?? trail.recommendedNodeId`; Perfil só o `trail`).
- Aluno que concluiu a última trilha mas deixou m15/m16 abertas: Home mostra o fim; m15 aparece como disponível na trilha, com banda "Próximo nível" (cópia) e linha percorrida.

**Regras antigas que interagem**
- `isTrackCompleted` exige nó obrigatório concluído e ignora revisão (`trackCompletion.ts:32`): m15 só conclui com aulas+conferência+conquista (conquista sem `optionalForProgression` conta). Quem deixou a conquista de uma trilha pendente nunca "conclui" essa trilha e hoje trava a seguinte; com (b) não trava mais (progresso posterior abre). Aluno com `reward` aberto vê m15 aberta em vez de bloqueada atrás dele: aceitável.
- `lockUnreachedUnits` (:55-62): trilha fechada vira `locked` mas preserva concluídos. Com (b) m15 aberta mostra `available` na 1ª aula; ok.
- `completedCelebrationUnits`: não vê trilha, só nós `completed`; independe da regra de acesso (ver seção 2).
- Escritas na trilha ativa (1.3.1): quem abre m15 atrás da ativa dispara resíduo de retomada. Regra (c) torna isso comum.

## 4. Chaves de armazenamento

- `@radiant:journey_progress_v1` (`STORAGE_KEYS.JOURNEY_PROGRESS`, `constants/storageKeys.ts:9`): store `{schemaVersion, activeTrackId, tracks:{[trackId]:{completedNodeIds, pendingReviewNodeIds, currentNodeId, resumableNodeId, ...}}}`. `activeTrackId` é só registro (`JourneyProgressService.ts:387-395`).
- `@radiant:unit_celebrations_v1` (`UNIT_CELEBRATIONS` :39): ids de trilha já festejados.
- `@radiant:daily_missions_v1`, `@radiant:sr_schedule_v1`, `@radiant:hearts_v1`, `@radiant:progress_backup_v1`: indiretos, sem dependência de ordem.
- `@radiant:v3:journey_progress_v1` (`V3_JOURNEY_PROGRESS` :12): fora do caminho de acesso (migração; `curriculum-v3/CurriculumMigrationService`, não conferido).

**A regra (c) deriva do progresso existente, sem chave nova.** "Trilha com progresso" = `store.tracks[id].completedNodeIds.length > 0`, que `JourneyProgressService` já lê (:371-383) e o backup já serializa (`LocalProgressAdapter.ts:75-78`). A trilha inserida ainda não tem entrada até alguém chamar `ensureProgress` para ela; `getCurriculumTrail` (`JourneyCurriculumService.ts:88-91`) chama para cada trilha e persiste uma entrada vazia (`ensureProgress` :~195-200 grava quando o catálogo tem nós), inofensiva. Atenção: a Home e `resolveTrackDefinition` usam `completedNodeIds` do store, enquanto `getCurriculumTrail` usa `status` dos nós (item 4 da 1.2); a regra nova deve ter **uma** função pura de entrada comum (conjunto de trilhas concluídas + conjunto de trilhas com progresso) para as três cópias.

## 5. Resumo dos riscos (ordem)
1. Trilha com progresso parcial logo após a inserção fica fechada pela regra (b) como descrita: exige "ou a própria trilha tem nó concluído" (e, se quiser, "ou M(N−1) concluída" para quem parou na fronteira).
2. Três cópias da régua da trilha ativa (itens 1, 5, 6 da 1.2) + duas derivações de "concluída" (itens 2 e 4): divergência entre Home, trilha e Perfil, sobretudo para quem concluiu tudo.
3. Escritas de `setCurrentNode/setResumableNode` na trilha ativa em vez da do nó (1.3.1): unidade inserida atrás do aluno passa a ser o caminho comum e dispara o aviso de "ponto salvo" e perde a retomada.
4. Cópia/visual: banda "Próximo nível" e linha "percorrida" sobre unidade inserida atrás (`JourneyLevelBand.tsx:32`, `JourneyTrail.tsx:109-120`).
5. Testes a atualizar: `JourneyTrackUnlockService.test.ts`, `rtgExpansionProgress.test.ts` (afirma "só no fim"), mock em `LessonFlowScreen.flow.test.tsx:837`.
