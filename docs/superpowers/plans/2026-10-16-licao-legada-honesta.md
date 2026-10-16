# Lição legada honesta — plano de implementação (P1)

> **Para agentes:** sub-skill obrigatória:
> `superpowers:subagent-driven-development` (recomendada) ou
> `superpowers:executing-plans`. Os passos usam caixas `- [ ]` para
> acompanhamento. Neste repositório, todo o pacote corre **dentro de um run do
> Loop**: abra pelo `scripts/loop/abrir.mjs` declarando **cada** arquivo da
> seção "Arquivos" como argumento separado, confira a lista no `state.json`
> logo depois e feche na ordem do `AGENTS.md`.

**Objetivo:** a lição legada que está no ar ensina com todas as suas perguntas,
explica o erro onde ele aconteceu e não se contradiz no fim. Nada disso exige
conteúdo novo.

**Arquitetura:**
- O bloco legado é montado em `JourneyDefinitionService` e convertido pelo
  `LegacyLessonAdapter` para o player `useLearningActivity`.
- O pacote muda três pontos:
  - a montagem: todas as perguntas, embaralhadas com semente estável e sem
    telas de molde;
  - o player: a confirmação passa a ter duas fases, conferir e avançar, e uma
    pergunta errada volta uma vez no fim;
  - o resumo: estado de reprovação com "Refazer agora".
- O embaralhamento reaproveita o `seededRandom` do piloto híbrido, que passa
  para `src/lib/`.

**Stack:** React Native/Expo, TypeScript, Jest (`--runInBand` no gate),
Maestro.

**Spec:** a [reavaliação da trilha](../../evidence/2026-10-16-reavaliacao-da-trilha.md)
(problemas 1 a 6) e o [programa](../../plans/2026-10-16-plano-de-melhoria-da-trilha.md)
(pacote P1).

## Restrições globais

- Testes e builds do app no **Node 20**; só a CLI `loop` usa o Node 24.
- O gate é `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app/`, mais o
  `loop validate`. Rodar `npx jest` solto não substitui o gate.
- Os ids de alternativa ficam `"<questionId>:option:<índiceOriginal>"`.
  Embaralhar muda a **posição**, nunca o id: roteiros Maestro e respostas
  gravadas dependem desse formato.
- Regra de vida (ADR de 2026-09-14, que vale para as lições legadas): o erro na
  **primeira** tentativa de uma pergunta da lição custa uma vida. A repetição
  da mesma pergunta no fim **não** custa. A revisão continua sem custo.
- O resultado da lição conta só a **primeira** tentativa de cada pergunta. A
  repetição ensina, mas não melhora a nota.
- O nó continua sendo concluído mesmo reprovado. Exigir aprovação para avançar
  mudaria a regra de progressão, pediria ADR e está fora deste pacote.
- Glossário da tela: trilha, lição, revisão. O título exibido não leva o
  prefixo "Quiz: ".
- Contraste: todo texto de estado da trilha ≥ 4,5:1 sobre o fundo do cartão.

## Foco de revisão

Cinco situações que as tarefas precisam cobrir com teste:
1. **Lição com 1 pergunta só:** é o caso das 2 lições legadas com 3 perguntas e
   de qualquer conteúdo futuro. Com 1 pergunta não há embaralhamento entre
   perguntas, e a errada volta uma vez. Teste na T3.
2. **Errar a repetição:** não custa vida, não volta outra vez e não muda o
   resultado. Teste na T4.
3. **Ficar sem vidas no meio:** se o erro da 1ª tentativa zerar as vidas, a
   folha de vidas aparece como hoje, e a repetição pendente não fura a regra.
   Teste na T4.
4. **Retomada:** `setResumableNode(nodeId, stepIndex)` precisa continuar válido
   com a fila maior; retomar não pode duplicar a repetição. Teste na T4.
5. **Mesma semente, mesma ordem:** o aluno que sai e volta vê as alternativas
   na mesma ordem; outra pergunta pode ter outra ordem. Teste na T1.

---

### T1: Embaralhamento com semente estável

**Arquivos:**
- Mover: `src/features/curriculum-v3/hybrid-l1/seededRandom.ts` →
  `src/lib/seededRandom.ts`, e o teste junto. Atualizar os 4 importadores
  (`l1HybridLessonPlan.ts`, `HybridLessonSession.ts`, `l1ItemTemplates.ts` e o
  teste deste último).
- Modificar: `src/features/journey/services/JourneyDefinitionService.ts`
  (`buildMultipleChoiceStep`).
- Teste: `src/lib/seededRandom.test.ts` e
  `src/features/journey/services/JourneyDefinitionService.test.ts`.

**Interfaces:**
- Produz: `seedFromString(value: string): number`, um FNV-1a de 32 bits sem
  sinal, em `src/lib/seededRandom.ts`, ao lado de `createRng` e `shuffled`, que
  já existem.

- [ ] **Passo 1: testes que falham**
  - `seedFromString('a') === seedFromString('a')`;
  - `seedFromString('a') !== seedFromString('b')`;
  - o resultado é inteiro entre 0 e 2^32−1;
  - em `JourneyDefinitionService.test.ts`, `getBlock('block:<lição>:intro')`,
    chamado duas vezes, devolve as alternativas da mesma pergunta **na mesma
    ordem**;
  - em pelo menos uma pergunta do catálogo, a ordem difere da original;
  - o `correctOptionId` aponta para a alternativa de texto correto.
- [ ] **Passo 2:** `npx jest src/lib/seededRandom.test.ts
  src/features/journey/services/JourneyDefinitionService.test.ts` reprova
  porque `seedFromString` não existe e a ordem é a original.
- [ ] **Passo 3:** mover o arquivo e implementar `seedFromString`. Em
  `buildMultipleChoiceStep`, montar as opções como hoje, com o id pelo índice
  original, e passá-las por `shuffled(opções, createRng(seedFromString(question.id)))`.
- [ ] **Passo 4:** os mesmos testes passam, e a suíte do `curriculum-v3` passa
  sem mudança de snapshot.
- [ ] **Passo 5: commit** `feat(licao): alternativas embaralhadas com semente por pergunta`.

### T2: Feedback na mesma tela da pergunta

**Arquivos:**
- Modificar: `src/features/lesson-flow/hooks/useLearningActivity.ts`;
  `src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx` e
  `MultipleChoiceStepRenderer.tsx`;
  `src/features/lesson-flow/screens/LessonFlowScreen.tsx`.
- Teste: `useLearningActivity.test.ts` e `LessonFlowScreen.flow.test.tsx`.

**Interfaces:**
- Produz, em `UseLearningActivity`:
  - `checked: boolean`, verdadeiro depois de conferir uma interação e antes de
    avançar;
  - `advance(): void`, que sai do estado conferido para o próximo passo.
- `confirm()` mantém a assinatura e o retorno. Numa interação, grava a resposta
  e liga `checked`, **sem** avançar. Num passo de apresentação, avança como
  hoje.
- Produz, em `InteractionRendererProps`: `feedback?: { correct: boolean;
  message: string; correctOptionId?: string }`. Com `feedback`, a
  múltipla escolha bloqueia a troca de alternativa e marca:
  - a escolhida errada com ✕ e `galaxyColors.critical`;
  - a correta com ✓ e `galaxyColors.nodeCompletedAccent`;
  - abaixo, um cartão com o título "Resposta correta" ou "Resposta incorreta"
    e a `message`.

- [ ] **Passo 1: testes que falham**
  - no hook, `confirm()` numa interação deixa `stepIndex` igual e
    `checked === true`; `advance()` incrementa `stepIndex` e zera `checked`;
  - no fluxo da tela, depois de "Conferir resposta" com a alternativa errada, a
    **mesma** tela mostra a pergunta, a alternativa marcada como incorreta, o
    texto "Resposta incorreta" e o botão "Continuar";
  - o leitor de tela continua anunciando "Resposta incorreta." e a perda de vida.
- [ ] **Passo 2:** os dois testes reprovam pelo motivo previsto, porque a tela
  avança para o passo de reforço.
- [ ] **Passo 3:** implementar.
  - `handleContinue` chama `confirm()` quando `!checked` e `advance()` quando
    `checked`. A cobrança de vida e o `emit` continuam no momento de conferir.
  - A conclusão da lição (`recordCompletion` e `markNodeCompleted`) passa a
    acontecer no `advance()` do último passo.
  - O rótulo do botão é "Conferir resposta" antes e "Continuar" depois de
    conferir.
- [ ] **Passo 4:** os testes passam, e `LessonFlowScreen.flow.test.tsx` passa
  inteiro. Os testes de vida e de retomada continuam verdes.
- [ ] **Passo 5: commit** `feat(licao): feedback no lugar da pergunta`.

### T3: Lição com todas as perguntas, sem telas de molde

**Arquivos:**
- Modificar: `src/features/journey/services/JourneyDefinitionService.ts`
  (`buildIntroBlock` e `buildReviewBlock`).
- Teste: `JourneyDefinitionService.test.ts`.

**Interfaces:**
- Produz: `displayLessonTitle(title: string): string`, exportada do mesmo
  arquivo, que remove um prefixo `"Quiz: "` no começo.
- `buildIntroBlock` monta:
  - o passo `context` só se `lesson.journey?.intro?.contextBody` existir;
  - o passo `teach` só se `teachBody` existir;
  - **uma etapa de múltipla escolha por pergunta**, na ordem
    `shuffled(perguntas, createRng(seedFromString(lesson.id)))`;
  - nenhum passo `reinforce`, porque o feedback já está no lugar desde a T2.
- `eyebrow` do contexto: `track.title`, e não `Unidade ${lessonOrder}`.
- `buildReviewBlock`: as mesmas perguntas da lição, em outra ordem, com a
  semente `` `${lesson.id}:review` ``, sem passo de reforço. O título usa
  `displayLessonTitle`.

- [ ] **Passo 1: testes que falham**
  - para uma `ai-lesson` de 2 perguntas, o bloco de intro tem exatamente 2
    passos `multiple-choice` e nenhum `context`, `teach` ou `reinforce`;
  - para uma lição legada com `contextBody`, o `context` existe e tem
    `eyebrow === track.title`;
  - `displayLessonTitle('Quiz: Raios X') === 'Raios X'`;
  - `displayLessonTitle('Raios X') === 'Raios X'`;
  - **foco 1:** lição com 1 pergunta gera 1 passo, sem erro.
- [ ] **Passo 2:** os testes reprovam porque hoje são 4 passos.
- [ ] **Passo 3:** implementar.
  - `displayLessonTitle` vale em todo título exibido: o nó da trilha, o cartão
    "Próxima lição", o contexto e a revisão ("Revisar <título>").
  - Corrigir no catálogo a grafia "deflectido" para "defletido" e "a correta
    janela" para "a janela correta".
  - Rodar `npm run test:maestro-contract` para ver o que quebra: os roteiros
    entram na T7.
- [ ] **Passo 4:** os testes de jornada e de lição passam.
- [ ] **Passo 5: commit** `feat(licao): todas as perguntas e sem telas de molde`.

### T4: A pergunta errada volta uma vez no fim, sem custo

**Arquivos:**
- Modificar: `useLearningActivity.ts` e `LessonFlowScreen.tsx`.
- Teste: `useLearningActivity.test.ts` e `LessonFlowScreen.flow.test.tsx`.

**Interfaces:**
- `useLearningActivity(activity, initialStepIndex, options?: { requeueMissed?:
  boolean })`. Com `requeueMissed`, a primeira resposta errada de uma interação
  acrescenta ao fim da fila **uma** cópia dela, com `id` igual a
  `` `${id}:retry` `` e o campo novo `retryOf: string` no passo.
- A cópia não volta de novo.
- `confirmedAnswers` registra só o `id` original. A cópia não sobrescreve o
  resultado.
- Na tela, um passo com `retryOf` nunca chama `heartsRepository.spend`.

- [ ] **Passo 1: testes que falham**
  - errar a pergunta A faz `totalSteps` crescer em 1, e o último passo é A, com
    `retryOf`;
  - **foco 2:** errar a repetição não cobra vida, não acrescenta outro passo e
    `confirmedAnswers[A] === false`;
  - acertar a primeira tentativa não acrescenta nada;
  - **foco 3:** com 1 vida, errar A zera as vidas e abre a folha; a repetição
    não é cobrada;
  - **foco 4:** retomar com `initialStepIndex` no meio não duplica a repetição.
- [ ] **Passo 2:** os testes reprovam pelo motivo previsto.
- [ ] **Passo 3:** implementar.
  - A tela passa `requeueMissed: !isReview`.
  - O `QuizTopBar` e "Passo N de M" usam o `totalSteps` atualizado.
- [ ] **Passo 4:** os testes passam, e a suíte de vidas (`src/features/hearts`)
  continua verde.
- [ ] **Passo 5: commit** `feat(licao): pergunta errada volta no fim sem custo`.

### T5: Fim reprovado honesto, com "Refazer agora"

**Arquivos:**
- Modificar: `src/features/quiz/components/LessonSummary.tsx` e
  `LessonFlowScreen.tsx`.
- Teste: `LessonSummary.test.tsx` e `LessonFlowScreen.flow.test.tsx`.

**Interfaces:**
- `LessonSummaryProps` ganha `onRetry?: () => void`.
- Quando `kind === 'lesson'`, `stars === 0` e `onRetry` existe:
  - o botão primário é "Refazer agora" (`onRetry`);
  - o secundário é "Seguir mesmo assim" (`onContinue`);
  - o subtítulo vira `` `Você chegou ao fim. ${correctAnswers} de ${totalQuestions} certas.` ``,
    no lugar de "A lição foi concluída";
  - a faixa usa a superfície neutra, sem o amarelo de celebração;
  - o Pixel usa o estado `guide`, com o rótulo "Pixel te acompanhando";
  - "Avalie a aula" não aparece.
- Na tela:
  - `onRetry` reabre a mesma lição: `router.replace` para a rota atual, com o
    mesmo `nodeId` e `blockId`;
  - o `Confetti` fica desligado quando `stars === 0`, como já acontece por
    `lessonPassed`;
  - o confete de 1 a 3 estrelas não muda.

- [ ] **Passo 1: testes que falham**
  - com 0 estrela, o resumo tem "Refazer agora", "Seguir mesmo assim" e
    "Você chegou ao fim. 0 de 2 certas.", e não tem "A lição foi concluída",
    "Pixel comemorando" nem "Avalie a aula";
  - com 1 estrela ou mais, a tela é a de hoje;
  - na tela, tocar "Refazer agora" chama `router.replace` com o mesmo `nodeId`.
- [ ] **Passo 2:** reprovam pelo motivo previsto.
- [ ] **Passo 3:** implementar. A frase de 0 estrela do FILA 47 ("Faltou pouco",
  "pela metade") troca para uma sem suposição de quase acerto, por exemplo
  "Ainda não foi desta vez.". A troca entra aqui e fecha o FILA 47 nesta parte.
- [ ] **Passo 4:** os testes passam.
- [ ] **Passo 5: commit** `feat(resumo): fim reprovado com refazer`.

### T6: Contraste AA nos textos de estado da trilha

**Arquivos:**
- Modificar: `src/ui/theme.ts` (`nodeLockedAccent` e o token azul usado em
  "Próximo passo" e "Disponível"); `scripts/contrast-contract.test.mjs`.

**Interfaces:** nenhuma nova. Os tokens mudam de valor, não de nome.

- [ ] **Passo 1: teste que falha.** Em `contrast-contract.test.mjs`, um teste
  "galaxy: status de nó da trilha passa AA sobre o cartão" exige ≥ 4,5:1 para
  `nodeLockedAccent`, quando usado como texto, e para o azul do status, ambos
  sobre o fundo do cartão de nó. Tire a cor do cartão do
  `JourneyNodeCard.tsx`, não de uma cópia.
- [ ] **Passo 2:** `node --test scripts/contrast-contract.test.mjs` reprova com
  os valores de hoje: cerca de 3,5:1 e 3,5–3,8:1.
- [ ] **Passo 3:** ajustar os valores até passar.
  - Se `nodeLockedAccent` também for borda e ficar forte demais, separe um
    token de texto (`nodeLockedText`), sem mudar a borda.
  - Confirme a mudança numa captura antes e depois.
- [ ] **Passo 4:** o teste passa, e `JourneyNodeCard.test.tsx` continua verde.
- [ ] **Passo 5: commit** `fix(trilha): status de nó com contraste AA`.

### T7: Guarda de conteúdo, roteiros E2E e bateria

**Arquivos:**
- Criar: `src/data/answerLengthGuard.test.ts`.
- Modificar: os roteiros `.maestro/*.yaml` que afirmam "Ideia-chave",
  "Passo N de M" ou "Concluir e voltar", e
  `scripts/maestro-contract.test.mjs`.

**Medição exigida, não comando:**
- Enumere **todos** os roteiros afetados por duas buscas de convenções
  diferentes: o texto das telas removidas e os ids de passo
  (`-context`, `-teach`, `-reinforce`).
- Confira a contagem com a lista do contrato Maestro.
- Um roteiro que só aparece numa das buscas é investigado, não ignorado.

- [ ] **Passo 1: guarda de conteúdo.** O teste conta as perguntas de
  `ai-lessons.ts` em que a alternativa correta é a **única** mais longa e falha
  se a contagem passar de **18**, a medida de 2026-10-16. O teto só desce: quem
  reescrever um item baixa o número no mesmo commit. Veja o teste falhar
  trocando o teto para 17, e volte para 18.
- [ ] **Passo 2:** ajustar os roteiros para o fluxo novo:
  - pergunta, conferir, feedback no lugar, continuar;
  - os passos `Ideia-chave` saem;
  - a repetição de um item errado aparece no fim.
  Rode `npm run test:maestro-contract`: 29 de 29, ou o novo total com os
  testes acrescentados.
- [ ] **Passo 3:** rodar a bateria padrão no simulador:
  - `first-run`, `boot-to-home`, `learning-critical-path`, `offline-relaunch`,
    `reward-locked`, `reward-unlock`, `radiant-1-4-primeira-execucao` e
    `radiant-1-4-vidas-esgotadas`;
  - com o E1 já entregue, passando o argumento que desliga a animação.

  Resultado esperado: 8 de 8, registrado com o tempo de cada um.
- [ ] **Passo 4:** gate completo, `EXPO_NO_DOTENV=1 npm run quality`, no Node
  20. Cite a suíte inteira, não só as suítes tocadas.
- [ ] **Passo 5: commit** `test(e2e): roteiros no fluxo de lição novo`. Depois:
  - evidência em `docs/evidence/` com as capturas do fim reprovado, do feedback
    no lugar e da repetição;
  - FILA 47 marcada como concluída na parte da frase;
  - STATUS editado.
