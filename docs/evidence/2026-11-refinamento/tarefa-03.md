# Tarefa 3: folha de retorno no rodapé da aula

Medido em 2026-11-16, Node 20.20.2, em `radiant-app`.

## Vermelho

`AnswerFeedbackSheet.test.tsx`, com um esboço da folha que só repassa as props
ao `AnswerFeedbackCard` de hoje (para as asserções falharem pelo defeito, não
por módulo ausente):
`npx jest --runInBand src/features/lesson-flow/components/AnswerFeedbackSheet.test.tsx`

```
    ✕ acerto usa a variante success e erro usa error no botão (57 ms)
    ✕ heartLost mostra "Menos 1 vida" (13 ms)
    ✓ correctLabel aparece como "Resposta certa: …" só no erro (13 ms)
    ✕ sem rich, não chama a animação de entrada com duração (6 ms)
    ✓ com rich, sobe na faixa de confirmar resposta (150 ms), e sob "Reduzir movimento" aparece no lugar (13 ms)
    ✕ o botão chama onAction uma vez (7 ms)
    ✕ o botão fica fora da área que rola, e a altura máxima é dois terços da janela (8 ms)
    ✕ mede a própria altura para a tela (6 ms)
    ✕ ao aparecer, o foco do leitor de tela vai para o título, uma vez (13 ms)
    ✓ título e texto não têm teto de fonte (6 ms)
      ✓ sem rich, base: feliz no acerto, pensando no erro, retrato de 48 pt, sem incentivo (10 ms)
      ✓ com rich: o marco comemora, o retrato é o médio e o incentivo aparece (7 ms)
      ✓ com rich, o acerto comum fica feliz e o rótulo diz isso (5 ms)
    Unable to find an element with testID: app-button-face
    Unable to find an element with text: Menos 1 vida
    Expected number of calls: 0
    Received number of calls: 2
    Unable to find an element with role: button, name: Concluir e voltar
    Unable to find an element with testID: lesson-item-feedback-body
    Expected: 212
    Expected number of calls: 1
    Received number of calls: 0
Tests:       7 failed, 6 passed, 13 total
```

Nasceram verdes contra o esboço, porque migram o que o cartão já fazia:
`correctLabel` só no erro, a entrada de 150 ms com `rich`, o Pixel do retorno
e o teto de fonte. (O teste "sem rich, não chama a animação" foi substituído na
rodada 1; ver abaixo.)

`LessonFlowScreen.flow.test.tsx`, bloco novo "Tarefa 3", com a tela no estado de `HEAD`:
`npx jest --runInBand src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx -t "Tarefa 3"`

```
    ✕ depois de conferir, o retorno está fora da ScrollView e o rodapé antigo não está na árvore (10 ms)
    ✕ em múltipla escolha a folha não repete "Sua resposta" (32 ms)
    ✕ em ordenar, a folha diz a resposta certa (33 ms)
    ✕ com fontScale 3,1 e janela de 568 pt de altura, o botão de continuar está dentro da janela (47 ms)
    ✓ com ENABLE_RICH_FEEDBACK desligada, nenhum som novo é emitido ao abrir a folha (434 ms)
    ✕ o erro que gasta vida diz "Menos 1 vida" na folha, e o aviso sob o HUD não aparece (1076 ms)
  ● Tarefa 3 — folha de retorno no rodapé › depois de conferir, o retorno está fora da ScrollView e o rodapé antigo não está na árvore
    Unable to find an element with testID: lesson-footer
  ● Tarefa 3 — folha de retorno no rodapé › em múltipla escolha a folha não repete "Sua resposta"
  ● Tarefa 3 — folha de retorno no rodapé › em ordenar, a folha diz a resposta certa
    Unable to find an element with text: Resposta certa: Segundo; Primeiro
  ● Tarefa 3 — folha de retorno no rodapé › com fontScale 3,1 e janela de 568 pt de altura, o botão de continuar está dentro da janela
    Expected: "absolute"
    Received: undefined
  ● Tarefa 3 — folha de retorno no rodapé › o erro que gasta vida diz "Menos 1 vida" na folha, e o aviso sob o HUD não aparece
    Unable to find an element with text: Menos 1 vida
```

O "não repete Sua resposta" reprovou com `Found multiple elements with text: /Sua resposta|Resposta certa/`.
Nasceram verdes, ditas como tal: "com ENABLE_RICH_FEEDBACK desligada, nenhum som
novo" (a folha não emite som; o teste guarda contra regressão) e a asserção que
ficou da Tarefa 2 (`accessibilityValue` "certa" e "errada"), que a Tarefa 2 já
implementou.

Duas asserções foram vistas falhando depois, com o defeito específico injetado
na implementação e revertido em seguida:

- aviso sob o HUD com a folha aberta (`showsInSheet = false`):
  `expect(screen.queryByTestId('lesson-heart-loss')).toBeNull()` recebeu o nó;
- folga da rolagem sem a altura da folha (`paddingBottom: space.s4`):
  `Expected: >= 240, Received: 20`.

Asserções antigas da mesma suíte que reprovaram com a implementação e foram
migradas (5 testes): M4, M3 e M2 do "FILA 58" e o "(c)" da "Frente C" liam
"Sua resposta: …" e "Resposta certa: …" na múltipla escolha; o C2 lia
`borderColor` do cartão. Agora: a folha não tem essas linhas, as alternativas
dizem "certa" e "errada" pelo valor de acessibilidade, e o C2 lê superfície e
lábio de `feedbackColors`.

## Verde

```
    ✓ depois de conferir, o retorno está fora da ScrollView e o rodapé antigo não está na árvore (109 ms)
    ✓ em múltipla escolha a folha não repete "Sua resposta" (39 ms)
    ✓ em ordenar, a folha diz a resposta certa (26 ms)
    ✓ com fontScale 3,1 e janela de 568 pt de altura, o botão de continuar está dentro da janela (27 ms)
    ✓ com ENABLE_RICH_FEEDBACK desligada, nenhum som novo é emitido ao abrir a folha (433 ms)
    ✓ o erro que gasta vida diz "Menos 1 vida" na folha, e o aviso sob o HUD não aparece (579 ms)
Tests:       127 skipped, 6 passed, 133 total
AnswerFeedbackSheet.test.tsx — Tests:       13 passed, 13 total
LessonFlowScreen.flow.test.tsx inteiro — Tests: 133 passed, 133 total
```

Suíte inteira em banda (`npx jest --runInBand`): 276 suítes e 3713 testes, todos verdes.
`npx tsc --noEmit` e `npx eslint` nos arquivos tocados: sem saída.
Contratos: contraste 18/18, paleta 1/1, ícones 14/14, texto 65/65, Storybook 3/3,
Maestro 11/11, folga da barra de abas 3/3; `visual:qa:strict` sem regressão.

Contraste medido na superfície de erro (`#2c1820`): "Menos 1 vida" (`#FF6B6B`)
6,01:1, título (`#FF8298`) 7,07:1, texto principal 14,64:1. Na de acerto
(`#14281f`): título 8,14:1, texto 13,62:1, incentivo em ouro 9,60:1.

## Quem alcança o estado de retorno (passo 4)

`grep` por `AnswerFeedbackCard` e `lastFeedback` em `radiant-app/src`:

| Lugar | Decisão |
|---|---|
| `LessonFlowScreen.tsx` (único chamador do cartão) | migra para a folha |
| `LessonFlowScreen.tsx`, `ReinforceStepRenderer` do passo legado e do fechamento | fica: é passo de conteúdo, não retorno de resposta |
| `editorial-preview/EditorialLessonPreview.tsx` | fica: prévia editorial, fora do caminho do aluno |
| `CaseDecisionStepRenderer.test.tsx` (harness com `lastFeedback`) | fica: teste do renderizador |
| `useLearningActivity.ts` e teste | fica: é a fonte do estado |
| `features/review` e `features/checkpoint` | ficam: retorno próprio (decisão do controlador) |

## Ficou para o controlador

Os roteiros do Maestro e a prova em aparelho (passo 6).

## Rodada 1 de correção (revisão do controlador)

Decisão do controlador: a folha sempre entra pelo gancho da base, 220 ms sem a
chave e 150 ms com ela; sob "reduzir movimento", no lugar.

### Vermelho

Testes novos de `AnswerFeedbackSheet`, `ChoiceOption`, `MultipleChoiceStepRenderer`
e `ActivityRendererRegistry` (`npx jest --runInBand <os quatro arquivos>`):

```
● AnswerFeedbackSheet › entra sempre pelo gancho da base: 220 ms sem a chave, 150 ms com ela
    Expected: > 0
    Received:   0
  ● AnswerFeedbackSheet › sob "Reduzir movimento" aparece no lugar, visível (rich=false)
    Expected: 1
    Received: undefined
  ● AnswerFeedbackSheet › revealOffset: quanto rolar para a alternativa escolhida ficar acima da folha › alternativa já visível acima da folha não rola
    TypeError: (0 , _AnswerFeedbackSheet.revealOffset) is not a function
  ● AnswerFeedbackSheet › revealOffset: quanto rolar para a alternativa escolhida ficar acima da folha › alternativa sob a folha rola o mínimo para o fim dela encostar na folha, com a margem
    TypeError: (0 , _AnswerFeedbackSheet.revealOffset) is not a function
  ● AnswerFeedbackSheet › revealOffset: quanto rolar para a alternativa escolhida ficar acima da folha › alternativa acima do topo visível volta até ela
    TypeError: (0 , _AnswerFeedbackSheet.revealOffset) is not a function
  ● AnswerFeedbackSheet › revealOffset: quanto rolar para a alternativa escolhida ficar acima da folha › alternativa mais alta que a área visível mostra o começo dela
    TypeError: (0 , _AnswerFeedbackSheet.revealOffset) is not a function
  ● AnswerFeedbackSheet › revealOffset: quanto rolar para a alternativa escolhida ficar acima da folha › nunca rola para antes do início
    TypeError: (0 , _AnswerFeedbackSheet.revealOffset) is not a function
    Unable to find an element with testID: multiple-choice-options
  ● MultipleChoiceStepRenderer › informa a posição da alternativa escolhida, relativa ao próprio renderer
    Unable to find an element with testID: multiple-choice-options
Tests:       9 failed, 44 passed, 53 total
    ✕ repassa a medida da peça inteira, com o lábio, a quem pede (7 ms)
    Expected: "View"
    Received: [Function View]
    ✕ repassa a medida da peça inteira, com o lábio, a quem pede (9 ms)
    Expected: [Function mockConstructor]
    Received: undefined
```

O `ChoiceOption` nasceu verde na primeira forma, porque o `fireEvent` sobe até a
prop do componente. A asserção passou a exigir o manejador na vista do relevo
(a que o nativo mede). Vista falhando com a ligação tirada:

```
✕ repassa a medida da peça inteira, com o lábio, a quem pede (8 ms)
    Expected: [Function mockConstructor]
    Received: undefined
```

Bloco "Tarefa 3" da tela (`-t "Tarefa 3"`):

```
✓ depois de conferir, o retorno está fora da ScrollView e o rodapé antigo não está na árvore (44 ms)
    ✓ em múltipla escolha a folha não repete "Sua resposta" (25 ms)
    ✓ em ordenar, a folha diz a resposta certa (25 ms)
    ✓ com fontScale 3,1 e janela de 568 pt de altura, o botão de continuar está dentro da janela (26 ms)
    ✓ com ENABLE_RICH_FEEDBACK desligada, nenhum som novo é emitido ao abrir a folha (431 ms)
    ✓ o erro que gasta vida diz "Menos 1 vida" na folha, e o aviso sob o HUD não aparece (580 ms)
    ✕ em associar, a folha diz os pares certos (46 ms)
    ✕ em região, a folha diz as regiões certas (30 ms)
    ✕ com a folha, o anúncio do conferir diz só o resultado; o resto o leitor lê na folha (24 ms)
    ✕ o acerto anuncia só "Resposta correta." (22 ms)
    ✕ a rolagem leva a alternativa escolhida para cima da folha, com a janela medida depois que o rodapé sai (6 ms)
    Unable to find an element with text: Resposta certa: A → Alfa; B → Beta
    Unable to find an element with text: Resposta certa: Região A, Região C
    - Expected  - 1
    + Received  + 1
    - Expected  - 1
    + Received  + 1
    Unable to find an element with testID: lesson-answer
Tests:       5 failed, 127 skipped, 6 passed, 138 total
```

A rolagem reprovou primeiro por falta do `testID` da área de resposta. Com o
defeito específico injetado e revertido em seguida:
- ignorando a alternativa escolhida (a área inteira, como antes): `y` 236 em vez de 186;
- sem recalcular quando a janela cresce (rodapé saindo depois da medida da folha): `y` 266 em vez de 186.

```
✕ a rolagem leva a alternativa escolhida para cima da folha, com a janela medida depois que o rodapé sai (1051 ms)
    - Expected
    + Received
    -   "y": 186,
    +   "y": 236,
    > 3410 |       await waitFor(() => expect(scrollTo).toHaveBeenLastCalledWith({ y: 186, animated: false }));
    ✓ a rolagem leva a alternativa escolhida para cima da folha, com a janela medida depois que o rodapé sai (47 ms)
    ✕ a rolagem leva a alternativa escolhida para cima da folha, com a janela medida depois que o rodapé sai (1054 ms)
    -   "y": 186,
    +   "y": 266,
```

Asserções antigas que reprovaram com o anúncio curto e foram migradas (19 testes):
M4 do "FILA 58", as duas do "feedbackFor" (escolha e bancada), as 12 do `it.each`
do T04, a "(a)" da "Frente C", "famílias da 1.6" e duas do "F3". Agora asseveram o
anúncio exato e leem a explicação e o incentivo na folha.

### Verde

```
✓ depois de conferir, o retorno está fora da ScrollView e o rodapé antigo não está na árvore (44 ms)
    ✓ em múltipla escolha a folha não repete "Sua resposta" (25 ms)
    ✓ em ordenar, a folha diz a resposta certa (24 ms)
    ✓ com fontScale 3,1 e janela de 568 pt de altura, o botão de continuar está dentro da janela (25 ms)
    ✓ com ENABLE_RICH_FEEDBACK desligada, nenhum som novo é emitido ao abrir a folha (427 ms)
    ✓ o erro que gasta vida diz "Menos 1 vida" na folha, e o aviso sob o HUD não aparece (572 ms)
    ✓ em associar, a folha diz os pares certos (44 ms)
    ✓ em região, a folha diz as regiões certas (28 ms)
    ✓ com a folha, o anúncio do conferir diz só o resultado; o resto o leitor lê na folha (26 ms)
    ✓ o acerto anuncia só "Resposta correta." (22 ms)
    ✓ a rolagem leva a alternativa escolhida para cima da folha, com a janela medida depois que o rodapé sai (34 ms)
Tests:       127 skipped, 11 passed, 138 total
Test Suites: 4 passed, 4 total
Tests:       53 passed, 53 total
```

Suíte inteira em banda, Node 20.20.2: 276 suítes e 3727 testes, todos verdes.
`tsc --noEmit` e `eslint` nos arquivos tocados: sem saída.

### Resposta certa em texto, por formato

| Formato | Linha na folha | Motivo |
|---|---|---|
| múltipla escolha, verdadeiro ou falso, múltipla seleção | não | as alternativas mostram certa e errada |
| ordenar | sim, "a; b" | a tela não mostra a ordem certa |
| associar | sim, "esquerda → direita; …" | `MatchingStepRenderer` não mostra os pares certos |
| região | sim, "Região A, Região C" | `HotspotStepRenderer` não mostra as regiões certas |
| comparação, decisão de caso | sim, rótulo da opção certa | |
| lacunas | sim, fichas certas por lacuna | |
| categorizar | não | cada ficha já mostra "(certo: grupo)" depois de conferir |
| bancada | não | a resposta é uma faixa de valor; a dica do lado certo vem no retorno autoral |
| laboratório de parâmetros, caça ao risco | não | sem resposta curta e única; o retorno autoral explica |

### Ajuste final: vidas restantes no leitor de tela

A folha ganhou `heartsLeft?: { current; max }`. O aviso "Menos 1 vida" fica num
nó acessível com o rótulo "Você perdeu uma vida. Restam N de M.", e sem a prop o
rótulo é "Você perdeu uma vida.". Vermelho (`-t "quantas restam"`):

```
    ✕ a vida perdida diz ao leitor de tela quantas restam, quando a tela sabe (44 ms)
    Unable to find an element with testID: lesson-feedback-heart-loss-group
```

Verde: folha e tela, Tests:       158 passed, 158 total. Na tela, a folha mostra "Restam 4 de 5." depois
de gastar uma vida, com a contagem gravada.
