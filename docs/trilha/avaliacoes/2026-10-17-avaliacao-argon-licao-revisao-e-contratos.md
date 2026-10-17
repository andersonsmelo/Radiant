# Avaliação técnica: qualidade dentro da lição, revisão espaçada G4, contratos E2E e prova nativa

- **Autoria:** Argon — Gemini 4 Argon (High)
- **Data:** 2026-10-17
- **Objetivo:** Auditar e corrigir os gargalos de maior impacto pedagógico e técnico dentro da lição legada (`FILA 50`, `FILA 47`, `D1`), da revisão espaçada `G4` (`FILA 55` / `A1`, `A2` e defeitos visuais/textuais da `ReviewScreen`) e verificar nativamente `G2` + `G4` no simulador iOS (`R1`).
- **Método:** Inspeção estática de código e AST dos contratos (`scripts/maestro-contract.test.mjs`, `.maestro/*.yaml`), execução TDD (teste visto falhando antes de cada correção), medição de payload e chamadas de parse/validação em `ItemReviewRepository`, e verificação nativa no simulador iOS (`iPhone 17 Pro`, iOS 26.5, UDID `0A1B5AAA-A517-484B-A386-0F48D3B229A1`).
- **Grau das afirmações:** `[oficial]`, `[terceiro]`, `[usuário]`, `[estudo]`, `[código]`, `[visto]`, `[inferido]`.

---

## 1. Colisões descobertas no plano P1 (`2026-10-16-licao-legada-honesta.md`) e o que foi implementado

A revisão do plano P1 contra os contratos automatizados do repositório revelou três colisões diretas que quebrariam o gate `npm run quality` se aplicadas literalmente:

1. **Bloqueio de `disabled={` em `MultipleChoiceStepRenderer.tsx`:** `[código]`
   - O plano P1 (Tarefa 3) propunha adicionar `disabled={submitted}` nos `Pressable` de `radiant-app/src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.tsx`.
   - Porém, `radiant-app/scripts/maestro-contract.test.mjs:508` contém a asserção explícita `assert.ok(!multipleChoiceRenderer.includes('disabled={'))`, criada para impedir que o Maestro perca o alvo de toque no passo de múltipla escolha.
   - **Decisão técnica:** Preservamos `MultipleChoiceStepRenderer.tsx` sem `disabled={` (o bloqueio funcional pós-envio já ocorre no handler `handleSelect` quando `submitted === true`, linha 31) e atacamos o problema real de desconexão pedagógica no passo 4 (`ReinforceStepRenderer.tsx`). `[código]`

2. **Prefixo `"Quiz: "` nos títulos da trilha vs. contrato `.maestro/reward-unlock.yaml`:** `[código]` `[visto]`
   - Na tela inicial da jornada (`JourneyHomeScreen`), os nós de revisão exibiam `"Revisar Quiz: Raios X: descoberta e pr..."` (com dois dois-pontos e truncamento na 3ª linha, medido no simulador iOS antes da correção). `[visto]`
   - O arquivo `.maestro/reward-unlock.yaml` (linhas 170, 210, 250, 290 e 330) exige o texto `"Quiz: ..."` **apenas dentro da `LessonFlowScreen`** (`ContextStepRenderer`), e não nos cards da `JourneyHomeScreen`. `[código]`
   - **Correção implementada (`JourneyDefinitionService.ts`):** Criamos `displayLessonTitle(rawTitle)` (mesma regra `replace(/^Quiz:\s*/i, '').trim()` de `scripts/content/sync-catalog-to-app.mjs:186`) e aplicamos aos títulos dos nós da trilha (`node.title` da lição e `"Revisar ${lessonTitle}"` do nó de revisão) e ao cabeçalho da revisão (`buildReviewBlock`), preservando `lesson.title` intacto no `ContextStepRenderer` da lição introdutória. `[código]` `[visto]`

3. **Contrato de subtítulo em `LessonSummary.tsx` (`maestro-contract.test.mjs:1186`):** `[código]`
   - Quando o aluno errava a única questão da lição (`stars === 0`, `accuracy === 0`, `xpEarned === 0`), `LessonSummary.tsx` exibia `"A lição foi concluída"`, faixa dourada de celebração (`styles.rewardBand`), o mascote Pixel em `state="celebrate"` e a frase `"Esta ficou pela metade — vale rever antes de seguir."` (`lessonSummaryPhrases.ts:17`). `[código]`
   - O contrato `scripts/maestro-contract.test.mjs:1186` extrai a primeira ocorrência literal de `<Text style={styles.subtitle}>([^<]+)</Text>` em `LessonSummary.tsx` e exige que ela case com `"A lição foi concluída"`. `[código]`
   - **Correção implementada (`LessonSummary.tsx` e `lessonSummaryPhrases.ts`):**
     - Mantivemos `<Text style={styles.subtitle}>A lição foi concluída</Text>` como primeiro ramo da ternária (`stars > 0 || kind === 'review'`) e renderizamos `<Text style={styles.subtitle}>A lição ainda não fechou</Text>` quando `stars === 0 && kind !== 'review'`. `[código]`
     - Trocamos `styles.rewardBand` por `styles.zeroBand` (superfície neutra `galaxyColors.surface` com borda `galaxyColors.border`) e mudamos `PixelIllustration` para `state="guide"` com `accessibilityLabel="Pixel incentivando a tentar novamente"` quando `stars === 0`. `[código]`
     - Substituímos `'Esta ficou pela metade — vale rever antes de seguir.'` por `'Zero desta vez — rever agora fixa melhor do que seguir.'` em `LESSON_SUMMARY_PHRASES[0]`. `[código]`

4. **Reconexão entre pergunta, gabarito e explicação no passo 4 (`ReinforceStepRenderer.tsx`):** `[código]`
   - Na arquitetura de 4 passos (`context` → `teach` → `multiple_choice` → `reinforce`), a explicação pedagógica (`question.explanation`) só aparecia no passo 4 (`Vamos reforçar` / `Fixe este ponto`), depois que o enunciado e as alternativas já tinham saído da tela. `[código]`
   - **Correção implementada (`src/types/lessonFlow.ts`, `JourneyDefinitionService.ts`, `ReinforceStepRenderer.tsx`):** Estendemos `ReinforcePayload` com `prompt?: string` e `correctAnswerLabel?: string`, populamos ambos em `buildIntroBlock` e `buildReviewBlock`, e renderizamos o bloco `testID="reinforce-question-recap"` com `"Pergunta: ..."` e `"Gabarito: ..."` imediatamente acima da explicação no passo 4. `[código]`

---

## 2. Achados estruturais no catálogo e no adaptador de lições

Durante a auditoria do fluxo de lições, identificamos três fatos estruturais no código atual que devem guiar o próximo passo de conteúdo (`FILA 51` / `G1`):

1. **`DEFAULT_LESSON_BLOCKS` (`radiant-app/src/data/journey/defaultBlocks.ts`) é código morto em produção:** `[código]`
   - O arquivo define blocos multi-questão (`block-lesson-1-intro` com `q1` e `q2`), mas só é importado em `LegacyLessonAdapter.test.ts` e `scripts/maestro-contract.test.mjs`. Em produção, `JourneyDefinitionService.ts` constrói todos os blocos dinamicamente com `buildIntroBlock` (`questionIndex = 0`) e `buildReviewBlock` (`questionIndex = 1`). `[código]`

2. **Questões escritas à mão em `radiant-app/src/data/lessons.ts` inacessíveis na trilha:** `[código]`
   - `LESSONS` possui 3 lições com 3 questões cada (`q1–q3`, `ct-q1–q3`, `mri-q1–q3`). Como `buildIntroBlock` usa apenas `questionIndex = 0` e `buildReviewBlock` usa `questionIndex = 1`, a 3ª questão de cada lição (`q3`, `ct-q3`) e toda a `lesson-3` (Ressonância Magnética, `mri-q1..q3`, fora das trilhas de `catalog.ts`) nunca são exibidas na trilha principal. `[código]`

3. **Viés de comprimento na alternativa correta em `AI_LESSONS` (`radiant-app/src/data/ai-lessons.ts`):** `[código]`
   - Das 16 lições e 32 questões geradas em `AI_LESSONS`, a alternativa correta é a mais longa (em caracteres) em **23 de 32 questões (71,9%)**, contra 25% esperados ao acaso em múltipla escolha de 4 alternativas, confirmando quantitativamente o diagnóstico `D1`. `[código]`

---

## 3. Auditoria da Revisão Espaçada `G4` (`ReviewScreen`, `ReviewCard`, `A1`/`FILA 55` e `A2`)

### 3.1. Dois defeitos de UI/UX encontrados e corrigidos na `ReviewScreen` (`G4`)

1. **Instrução obsoleta na tela inicial de revisão (`ReviewScreen.tsx:256`):** `[código]` `[visto]`
   - Mesmo após a entrega de `G4` (que substituiu a autoavaliação subjetiva por múltipla escolha de 4 alternativas + botão de consulta com ajuda), o card `"Como essa sessão funciona"` em `ReviewScreen.tsx:256` continuava dizendo: `"Formato: Revele a resposta e avalie se lembrou de cada item"`. `[código]` `[visto]`
   - **Correção:** Atualizado para `"Escolha uma alternativa e confirme, ou consulte a resposta com ajuda"`, alinhado ao comportamento real do `ReviewCard`. `[código]` `[visto]`

2. **Resposta errada ou com ajuda pintada de verde (`ReviewCard.tsx:103-114`):** `[código]`
   - Ao revelar o resultado (`revealed !== null`), o `ReviewCard` aplicava `styles.optionCorrect` (`borderColor: galaxy.statusSuccess`, fundo verde translúcido `rgba(93, 227, 174, 0.12)`) e `styles.optionTextCorrect` (`color: galaxy.statusSuccess`, `#5DE3AE`) à alternativa correta **independentemente de o aluno ter acertado (`correct`), errado (`wrong`) ou usado ajuda (`assisted`)**. Quando o aluno errava, o único destaque colorido nas opções era verde brilhante, contradizendo o banner de erro logo abaixo. `[código]`
   - **Correção (`ReviewCard.tsx`):** Diferenciamos o estilo de revelação da alternativa de gabarito por resultado:
     - `revealed.outcome === 'correct'` → `galaxy.statusSuccess` (`#5DE3AE`, verde);
     - `revealed.outcome === 'wrong'` → `galaxy.statusError` (`#FF8298`, rosa/vermelho de alerta);
     - `revealed.outcome === 'assisted'` → `galaxy.statusWarning` (`#F5A623`, âmbar). `[código]`

### 3.2. Análise do defeito `A1` (`FILA 55` — atualização de `contentVersion` remove lição da revisão)

- **Mecanismo no código:** `[código]`
  - `CompletionLedgerService.ts:137` (`getAllCompletedLessonIds`) filtra todas as entradas do ledger com `entry.contentVersion === this.getCurrentContentVersion(lessonId)`.
  - `ReviewService.ts:39` chama `this.completionLedger.getAllCompletedLessonIds()` para montar o conjunto de lições elegíveis para revisão (`completedSet`).
  - Consequência: qualquer incremento de `contentVersion` em uma lição (mesmo correção ortográfica de distrator) faz `getAllCompletedLessonIds()` omitir essa lição; na sessão seguinte, `ReviewService.getDueReviews()` ignora os cartões FSRS já agendados para os itens daquela lição até que o aluno refaça a lição inteira na trilha. `[código]`
- **Análise das 3 opções de produto (para decisão do Anderson — Regra 4):** `[inferido]`
  - **Opção 1 (Recomendada): Separar elegibilidade de revisão da conclusão estrita da versão atual.** Adicionar `getCompletedLessonIdsForReview()` em `CompletionLedgerService` que aceite qualquer conclusão histórica no ledger (`Boolean(entry)`), desde que o `itemId` da questão continue existindo no catálogo atual (`collectQuestions` em `ReviewService.ts:68` já descarta `itemId` inexistente no catálogo!). Enquanto isso, `isLessonCompleted` e `getAllCompletedLessonIds()` continuam exigindo `contentVersion` igual ao atual para desbloqueio de unidade/progresso, se desejado.
  - **Opção 2: Versionamento semântico (`major.minor`) em `contentVersion`.** Só invalidar o ledger em mudança `major` (troca de conceito/pergunta), mantendo conclusões em `minor` (ajuste de texto). Exige alterar o contrato numérico inteiro (`contentVersion: number` em `src/types/content.ts:105` e validadores de schema).
  - **Opção 3: Manter invalidação total e avisar o aluno na UI.** Pior retenção: pune o aluno que já tinha histórico FSRS acumulado por uma atualização editorial do app.

### 3.3. Análise e otimização de `A2` (capacidade e custo de `ItemReviewRepository` no Android)

- **Medição de armazenamento (limite de 2 MB do `CursorWindow` SQLite do `AsyncStorage` no Android):** `[oficial]` `[código]`
  - No Android, o `AsyncStorage` usa SQLite sob uma `CursorWindow` de 2 MB por linha ([Documentação oficial Android CursorWindow](https://developer.android.com/reference/android/database/CursorWindow), acessada em 2026-10-17). `[oficial]`
  - Em `ItemReviewRepository.ts:32-33`, o repositório já aplica limites de retenção no momento da escrita: `MAX_ATTEMPTS = 1000` (descartando tentativas mais antigas que 180 dias acima de 1.000) e `MAX_CARDS = 2000`. `[código]`
  - Medindo o tamanho serializado de cada registro:
    - 1 `ItemReviewCard` ≈ 240 bytes JSON → 200 cartões = ~48 KB (no teto de 2.000 cartões = ~480 KB). `[código]`
    - 1 `ItemAttempt` ≈ 215 bytes JSON → 1.000 tentativas = ~215 KB. `[código]`
    - **Total para 200 cartões + 1.000 tentativas:** **~263 KB** (~13,1% do limite de 2 MB do Android; mesmo no teto de 2.000 cartões + 1.000 tentativas = ~695 KB, ~34,7% do limite). `[código]`
- **O gargalo real descoberto (CPU na thread JS, não bytes em disco):** `[código]`
  - Embora o volume em bytes caiba com folga no `AsyncStorage`, `ItemReviewRepository.readStore()` executava `JSON.parse(raw)` seguido de `validateStore(parsed)` **em toda leitura** (`getCards()`, `getAttempts()`, `inspect()`, `dueCount()`, `effectiveSchedule()`). `[código]`
  - `validateStore` percorre cada um dos até 2.000 cartões e 1.000 tentativas executando `isSafeId` (regex), `isValidIsoTimestamp` (`Date.parse` + regex) e checagens de tipo — mais de **4.000 validações por chamada**. Em uma única abertura/renderização da tela de revisão, `readStore` era chamado 3 a 5 vezes seguidas sobre a mesma string JSON inalterada (~12.000 a 20.000 validações redundantes na thread JS). `[código]`
- **Correção implementada (`ItemReviewRepository.ts`):** `[código]`
  - Adicionamos um cache em memória por instância de `Storage` (`WeakMap<Storage, { raw: string; store: Store }>`) acoplado a `cloneStore`: `readStore` continua lendo `await this.storage.getItem(STORAGE_KEY)` (respeitando mutações externas nos testes e no app), mas se a string bruta `raw` for idêntica à última string validada, retorna um clone raso do snapshot já validado sem reexecutar `JSON.parse` nem `validateStore`. `[código]`

---

## 4. Prova nativa no simulador iOS (`R1` — `G2` + `G4` + `FILA 50`)

Executada em 2026-10-17 no simulador `iPhone 17 Pro` (UDID `0A1B5AAA-A517-484B-A386-0F48D3B229A1`, iOS 26.5) conectado ao Metro a partir da worktree `argon-trilha`:

1. **Trilha multi-unidade (`G2`) + remoção de `"Quiz: "` (`FILA 50`):** `[visto]`
   - **Antes (`sim-current.png`):** O card de revisão exibia `"Revisar Quiz: Raios X: descoberta e pr..."` truncado na 3ª linha.
   - **Depois (`sim-after-trail.png`):** O card exibe `"Revisar Raios X: descoberta e propriedades"` completo em 3 linhas, sem truncamento e sem `"Quiz: "`. Logo abaixo aparecem o nó `"CONQUISTA / Conquista da unidade / Próximo passo"` e o separador da Unidade 2 (`"BLOQUEADO / RADIAÇÃO, MODALIDADES E EQUIPAMENTO / Abre ao concluir Fundamentos de Radiologia"`), comprovando `G2` renderizado nativamente.
2. **Tela de revisão (`G4` — `radiantapp://review`):** `[visto]`
   - **Depois (`sim-after-review-start.png`):** A rota `radiantapp://review` abre nativamente sem erros, exibindo o cabeçalho `REVISÃO`, o painel `REPETIÇÃO ESPAÇADA` com o mascote e, na seção `"Como essa sessão funciona"`, o novo texto de `FORMATO`: `"Escolha uma alternativa e confirme, ou consulte a resposta com ajuda"`.
3. **Fluxo de lição (`radiantapp://learn?...`):** `[visto]`
   - **Depois (`sim-after-lesson-step1.png`):** O passo 1 de 4 (`UNIDADE 7 / Quiz: Raios X: descoberta e propriedades`) abre nativamente preservando o título esperado pelo contrato `.maestro/reward-unlock.yaml`.

---

## 5. Fontes

1. Código-fonte do repositório Radiant (`radiant-app/src/features/journey/services/JourneyDefinitionService.ts`, `radiant-app/src/features/quiz/components/LessonSummary.tsx`, `radiant-app/src/features/lesson-flow/renderers/ReinforceStepRenderer.tsx`, `radiant-app/src/features/review/screens/ReviewScreen.tsx`, `radiant-app/src/features/review/components/ReviewCard.tsx`, `radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.ts`, `radiant-app/scripts/maestro-contract.test.mjs`), inspecionado em 2026-10-17. `[código]`
2. Android Developers — `CursorWindow` API Reference (`https://developer.android.com/reference/android/database/CursorWindow`), acessado em 2026-10-17. `[oficial]`
3. React Native Async Storage — Known Limits (`https://react-native-async-storage.github.io/async-storage/docs/limits/`), acessado em 2026-10-17. `[oficial]`

---

## 6. Limites desta avaliação

- A verificação nativa (`R1`) foi executada no simulador iOS (`iPhone 17 Pro`, iOS 26.5); não foi executada em aparelho físico Android nesta sessão.
- A correção definitiva de `A1` (`FILA 55`) depende da escolha de produto do Anderson entre as Opções 1, 2 e 3 detalhadas na Seção 3.2 (Regra 4).
- O reequilíbrio do comprimento das alternativas em `AI_LESSONS` (Seção 2.3) requer regeneração ou edição governada de `conteúdo/governança/catalog-payload.json` + `sync-catalog-to-app.mjs`.
