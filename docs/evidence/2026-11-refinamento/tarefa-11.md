# Tarefa 11: ajustes finais (parte de código)

Medido em 2026-11-17, Node 20.20.2, em `radiant-app`. Onde o defeito já estava
consertado na branch, o vermelho veio de uma injeção temporária (o código da
tarefa anterior ou um valor errado), desfeita logo depois; o `git diff` final
não tem nenhuma delas.

## A. Defeitos de tela

**A1, margem da assinatura.** `npx jest --runInBand src/features/subscription/screens/SubscriptionScreen.flow.test.tsx -t "margem do conteúdo"`

```
✕ o conteúdo rolável tem a margem horizontal do título, e nenhum filho a anula
    Expected: 16
    Received: undefined
```

Verde depois de `paddingHorizontal: space.s3` no contêiner da rolagem. A parte
"nenhum filho tem margem negativa" nasceu verde (guarda contra regressão).

**A2, resposta certa na folha.** `npx jest --runInBand src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx -t "folha diz|primeiro contato|acerto de marcar"`

```
✕ M4 primeiro contato não custa; só erro no retorno custa uma vida
    Unable to find an element with text: /^Resposta certa: /
✕ em múltipla escolha a folha diz a resposta certa, e não repete "Sua resposta"
    Unable to find an element with text: Resposta certa: Opção A
✕ em certo ou errado, a folha diz o julgamento certo de cada afirmação
    Unable to find an element with text: Resposta certa: Certo: A distância reduz a dose. Errado: O dosímetro reduz a dose.
✕ em marcar várias, a folha diz as certas separadas por vírgula
    Unable to find an element with text: Resposta certa: Opção A, Opção C
Tests: 4 failed, 132 skipped, 6 passed
```

"No acerto de marcar várias, a linha não aparece" nasceu verde: o acerto já
escondia a linha. Verde: o arquivo inteiro, 142 de 142 (depois, 143 com A3).

**A3, faixa abaixo da folha.** Folha: `npx jest --runInBand src/features/lesson-flow/components/AnswerFeedbackSheet.test.tsx -t "borda de baixo"`

```
✕ a superfície vai até a borda de baixo e o padding inferior inclui o inset da área segura
    Expected: 50
    Received: 16
```

Tela, com `LessonFlowScreen.tsx` e `AnswerFeedbackSheet.tsx` de `HEAD`: `-t "com inset inferior"`

```
✕ com inset inferior, o rodapé e a folha descem até a borda e levam o inset por dentro
    Expected value: not "bottom"
    Received array:     ["top", "bottom"]
```

Verde: `src/features/lesson-flow/` inteiro, 28 suítes e 554 testes.

**A4, folga do resumo.** O rodapé do `LessonSummary` é irmão da rolagem, e ela
reservava `ctaClearance` (104). `-t "irmão da rolagem"`, já com o `testID` do rodapé:

```
✕ o rodapé é irmão da rolagem: a folga é só space.s3 e o rodapé leva o inset inferior
    Expected: 16
    Received: 104
```

Verde com `useFixedFooter`, o gancho da recompensa: `src/features/quiz`, 8 suítes e 128 testes.

## C. Pendentes

- **C1**, `PixelHeroSplit` injetado na tela por um instante:
  `ReviewScreen.flow -t "retira Pixel"` deu `✕ retira Pixel e anel no estado start`
  (`Received: {... "elementType": [Function PixelHeroSplit] ...}`);
  `CheckpointScreen.flow -t "sem Pixel"` deu `✕ disponível em outra trilha usa snapshot do nó, prata e regra real sem Pixel`
  (`> 354 | expect(screen.UNSAFE_queryByType(PixelHeroSplit)).toBeNull()`). Verde: 120 de 120.
- **C2**, cor do "Menos 1 vida" trocada por `#7a3340`: `not ok 19`,
  `"Menos 1 vida" sobre a superfície de erro: #7a3340 sobre #2c1820 rende 1.89:1, exigido 4.5:1`.
  Verde: 19 de 19. Medidos: 6,31, 7,35, 6,67, 7,17 e 6,01:1.
- **C3**, véu da região escolhida trocado pelo verde cheio:
  `Expected: "rgba(3, 3, 13, 0.34)" Received: "#2BD67B"`. Verde: 4 de 4.
- **C4**, `QuizFeedback.tsx` de antes da Tarefa 6:
  `✕ ... selo "Reforçar"` (`Expected: "#3a0d17" Received: "#eef0f6"`) e
  `✕ ... selo "Mantém"` (`Expected: "#0b2a18" Received: "#eef0f6"`).
  `PushOptInCard.tsx` de antes da Tarefa 6: `✕ "Agora não" tem o tamanho do corpo, 16`
  (`Expected: 16 Received: 14`). Verdes.
- **C7**, `StreakWeek`: o teste documenta a divergência e nasceu verde de propósito.
  Não há defeito a consertar nesta tarefa.

## Gate local (não é o `quality` inteiro)

- `npx tsc --noEmit`: limpo. `npx eslint src scripts`: 0 erros e 23 avisos, todos
  em arquivos que esta tarefa não toca.
- Contratos: contrast 19/19, identity-palette 1/1, icon-assets 14/14,
  copy-style 65/65, storybook-config 3/3, ci-gate-parity 3/3, style-literal 19/19.
- `visual:qa:strict`: 656 arquivos, 0 regressões.
- `npx jest --runInBand`: 284 suítes e 3836 testes, todos verdes. A árvore tinha
  só esta tarefa e os já existentes `.playwright-mcp/` e `.serena/`.
