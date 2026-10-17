# Evidência de implementação e verificação: lição legada honesta (`FILA 50` / `FILA 47`), correções de `G4` e cache de leitura em `ItemReviewRepository` (`A2`)

- **Autoria:** Argon — Gemini 4 Argon (High)
- **Data:** 2026-10-17
- **Branch:** `argon/trilha-melhorias-e-avaliacao` (baseada em `origin/feat/trilha-evolucao-global-g0-g4`, commit `cc459f6`)
- **Run do Loop:** `run-1792276493622-43dba884`
- **Objetivo:** Documentar de forma auditável cada ciclo TDD (passo **VERMELHO** antes da implementação e passo **VERDE** após a correção), a verificação nativa no simulador iOS (`R1`) e a execução completa do gate `EXPO_NO_DOTENV=1 npm run quality` no Node 20.
- **Método:** Execução de testes unitários e de fluxo no Node `v20.20.2` com `npx jest --runInBand --no-cache` antes e depois de cada alteração de código, execução dos contratos de Maestro (`node --test scripts/maestro-contract.test.mjs`) e captura de telas nativas via `xcrun simctl io 0A1B5AAA-A517-484B-A386-0F48D3B229A1 screenshot`.
- **Grau das afirmações:** `[código]`, `[visto]`.

---

## 1. Ciclos TDD — Testes novos vistos FALHANDO (RED) antes do conserto e PASSANDO (GREEN) depois

### Ciclo 1 — Remoção do prefixo `"Quiz: "` nos títulos de nós da trilha (`JourneyDefinitionService.ts` / `FILA 50`)

- **Arquivo de teste:** `radiant-app/src/features/journey/services/JourneyDefinitionService.test.ts` `[código]`
- **Execução VERMELHA (antes do conserto em `JourneyDefinitionService.ts`):** `[visto]`
  ```text
  FAIL src/features/journey/services/JourneyDefinitionService.test.ts
    ● JourneyDefinitionService › strips redundant "Quiz: " prefix from lesson and review node titles on the trail while keeping context step title intact

      expect(received).toBe(expected) // Object.is equality

      Expected: "Raios X: descoberta e propriedades"
      Received: "Quiz: Raios X: descoberta e propriedades"

        235 |         const reviewNode = snapshot.nodes.find(node => node.id === 'node:review:ai-lesson:raios-x-descoberta-e-propriedades');
        236 |
      > 237 |         expect(lessonNode?.title).toBe('Raios X: descoberta e propriedades');
            |                                   ^
        238 |         expect(reviewNode?.title).toBe('Revisar Raios X: descoberta e propriedades');
  ```
- **Execução VERDE (após `displayLessonTitle` em `JourneyDefinitionService.ts`):** `[visto]`
  ```text
  PASS src/features/journey/services/JourneyDefinitionService.test.ts
    Tests: 6 passed, 6 total
  ```

---

### Ciclo 2 — `LessonSummary` e `lessonSummaryPhrases` honestos quando `stars === 0` (`FILA 47` + `FILA 50`)

- **Arquivos de teste:** `radiant-app/src/features/quiz/constants/lessonSummaryPhrases.test.ts` e `radiant-app/src/features/quiz/components/LessonSummary.test.tsx` `[código]`
- **Execução VERMELHA (antes do conserto em `lessonSummaryPhrases.ts` e `LessonSummary.tsx`):** `[visto]`
  ```text
  FAIL src/features/quiz/constants/lessonSummaryPhrases.test.ts
    ● lessonSummaryPhrases › 0 estrelas nunca diz que a lição ficou pela metade (lição de 1 questão com 0% de acerto)

      expect(received).not.toContain(expected) // indexOf

      Expected substring: not "metade"
      Received string:    "esta ficou pela metade — vale rever antes de seguir."

  FAIL src/features/quiz/components/LessonSummary.test.tsx
    ● LessonSummary › renders honest non-celebratory copy and guide mascot when stars is 0 on a lesson

      Unable to find an element with text: A lição ainda não fechou
  ```
- **Execução VERDE (após atualizar `lessonSummaryPhrases.ts` e `LessonSummary.tsx` + verificação do contrato Maestro):** `[visto]`
  ```text
  PASS src/features/quiz/constants/lessonSummaryPhrases.test.ts
  PASS src/features/quiz/components/LessonSummary.test.tsx
    Test Suites: 2 passed, 2 total
    Tests:       34 passed, 34 total

  $ node --test scripts/maestro-contract.test.mjs
  ℹ tests 29 | pass 29 | fail 0
  ```

---

### Ciclo 3 — Reconexão da pergunta e do gabarito no passo 4 (`ReinforceStepRenderer.tsx` / `FILA 50`)

- **Arquivo de teste:** `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx` `[código]`
- **Execução VERMELHA (antes do conserto em `ReinforceStepRenderer.tsx` e `JourneyDefinitionService.ts`):** `[visto]`
  ```text
  FAIL src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx
    ● ActivityRendererRegistry › renders question prompt and correct answer recap inside reinforce step when provided

      Unable to find an element with testID: reinforce-question-recap

      <View>
        <View>
          <Text>Vamos reforçar</Text>
          <Text>Estruturas densas atenuam mais fótons de raios X.</Text>
        </View>
        <View accessible={true}>
          <Text>Entendi, continuar</Text>
        </View>
      </View>
  ```
- **Execução VERDE (após adicionar `prompt` e `correctAnswerLabel` em `ReinforcePayload`, `ReinforceStepRenderer.tsx` e `JourneyDefinitionService.ts`):** `[visto]`
  ```text
  PASS src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx
    Tests: 8 passed, 8 total
  ```

---

### Ciclo 4 — Correção da instrução de formato em `ReviewScreen.tsx` e das cores de gabarito pós-erro/ajuda em `ReviewCard.tsx` (`G4`)

- **Arquivo de teste:** `radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx` `[código]`
- **Execução VERMELHA (antes do conserto em `ReviewScreen.tsx` e `ReviewCard.tsx`):** `[visto]`
  ```text
  FAIL src/features/review/screens/ReviewScreen.flow.test.tsx
    ● ReviewScreen flow › completa uma sessão de revisão acertando na múltipla escolha

      Unable to find an element with text: Escolha uma alternativa e confirme, ou consulte a resposta com ajuda
      (renderizava: "Revele a resposta e avalie se lembrou de cada item")

    ● ReviewScreen flow › reagenda o item ao errar na múltipla escolha sem gastar coração

      expect(received).toBe(expected) // Object.is equality

      Expected: "#FF8298"
      Received: "#5DE3AE"
  ```
- **Execução VERDE (após atualizar `ReviewScreen.tsx` e `ReviewCard.tsx`):** `[visto]`
  ```text
  PASS src/features/review/screens/ReviewScreen.flow.test.tsx
    Tests: 5 passed, 5 total
  ```

---

### Ciclo 5 — Cache em memória por snapshot de string em `ItemReviewRepository.ts` (`A2`)

- **Arquivo de teste:** `radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts` `[código]`
- **Execução VERMELHA (antes do conserto em `ItemReviewRepository.ts`):** `[visto]`
  ```text
  FAIL src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts
    ● ItemReviewRepository › caches parsed and validated store across consecutive reads when raw storage string has not changed

      expect(jest.fn()).toHaveBeenCalledTimes(expected)

      Expected number of calls: 0
      Received number of calls: 3
  ```
- **Execução VERDE (após adicionar `validatedStores` `WeakMap` + `cloneStore` em `ItemReviewRepository.ts`):** `[visto]`
  ```text
  PASS src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts
  PASS src/features/spaced-repetition/services/ItemReviewService.test.ts
    Test Suites: 2 passed, 2 total
    Tests:       29 passed, 29 total
  ```

---

## 2. Verificação nativa no simulador iOS (`R1`)

- **Dispositivo:** `iPhone 17 Pro` (UDID `0A1B5AAA-A517-484B-A386-0F48D3B229A1`, iOS 26.5) `[visto]`
- **Verificações realizadas:**
  1. `JourneyHomeScreen`: confirmada a remoção de `"Quiz: "` nos títulos dos nós (`"Revisar Raios X: descoberta e propriedades"` sem truncamento, comparado ao estado anterior `"Revisar Quiz: Raios X: descoberta e pr..."`) e a renderização nativa dos nós de conquista e separador da Unidade 2 (`G2`). `[visto]`
  2. `ReviewScreen` (`radiantapp://review`): confirmada a abertura nativa da tela de repetição espaçada `G4` e a exibição da instrução `"Escolha uma alternativa e confirme, ou consulte a resposta com ajuda"`. `[visto]`
  3. `LessonFlowScreen` (`radiantapp://learn?blockId=block%3Aai-lesson%3Araios-x-descoberta-e-propriedades%3Aintro&nodeId=node%3Aai-lesson%3Araios-x-descoberta-e-propriedades`): confirmada a abertura nativa do passo 1 preservando `"Quiz: Raios X: descoberta e propriedades"` exigido por `.maestro/reward-unlock.yaml`, seguida de `xcrun simctl shutdown all`. `[visto]`

---

## 3. Gate de qualidade completo (`EXPO_NO_DOTENV=1 npm run quality` no Node 20 e `loop validate` no Node 24)

- **Ambiente de teste do app:** Node `v20.20.2` (`EXPO_NO_DOTENV=1 npm run quality` em `radiant-app` e `node --test scripts/qa/docs-contract.test.mjs && node scripts/qa/docs-contract.mjs` na raiz). `[visto]`
- **Resultado:** `173 passed, 173 total` suítes e `1734 passed, 1734 total` testes (`jest --runInBand`), 0 erros de lint/typecheck, os 15 contratos de qualidade e o `visual:qa:strict` (`0 regressions`) aprovados, seguidos dos 15 validadores do `loop validate` no Node `v24.14.1`. `[visto]`

---

## 4. Fontes e limites

- **Fontes:** Código e suíte de testes de `radiant-app` na branch `argon/trilha-melhorias-e-avaliacao` (acesso em 2026-10-17). `[código]`
- **Limites:** Os testes de componente usam `@testing-library/react-native` sob Jest; a verificação visual nativa foi feita no simulador iOS (`iPhone 17 Pro`).
