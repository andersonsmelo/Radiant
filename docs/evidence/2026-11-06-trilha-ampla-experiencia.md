# Trilha ampla: experiência da aula (frente C)

Data: 2026-11-05. Plano: [trilha ampla e engajamento](../plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md),
frente C. Autor: Claude (subagente da frente C), sem commit e sem run do Loop
próprios: o run é do controlador.

**Limite que vale para o documento inteiro:** nada aqui foi visto em simulador
ou aparelho. Não subi Metro, não abri o app e não ouvi nenhum som. O que está
provado é o que o Jest, o `tsc`, o ESLint e os contratos medem. Desenho dos
retratos, ritmo das animações, volume e timbre dos três sons novos, leitura real
do VoiceOver e do TalkBack e o comportamento com Dynamic Type no aparelho ficam
**não verificados**.

## O que foi construído

- **Elenco (I5).** `src/ui/characters/cast/castRegistry.ts` exporta `CAST`
  (Pixel, Profa. Lia, Caio, Duda e Paciente, com papel), `castSpeakerName` e os
  tons dos retratos. `CastAvatar.tsx` desenha Lia, Caio, Duda e o paciente em
  SVG autoral de 64 x 64 e entrega o Pixel à cabeça do mascote que já existia.
  As silhuetas diferem pelo cabelo: coque no alto, topo reto e curto, cachos
  largos e só as laterais. Cada retrato tem rótulo de imagem com nome e papel, e
  some do leitor de tela quando o texto ao lado já diz quem fala.
- **Cena de diálogo.** `DialogueScene.tsx` mostra o cenário e as falas, uma por
  toque no botão do rodapé. A tela conta as falas reveladas; com todas na tela,
  o mesmo botão avança o passo. Cada fala é um nó só, lido como "Nome: fala". A
  fala nova é anunciada, porque o foco do leitor de tela está no botão. Na
  abertura o título vem antes das falas e o corpo depois da última; no fecho, o
  cartão de síntese aparece depois da última fala.
- **Pontos-chave.** `KeyPointsList.tsx` lista `keyPoints` sob o corpo do conceito.
- **Pista.** `LessonHelpButton.tsx` oferece "Ver pista" nos itens com `help`,
  antes da resposta. Depois de responder a oferta some; a pista aberta fica.
- **Retorno da resposta.** `AnswerFeedbackCard.tsx` substitui o cartão parado:
  entra com `useCardEnter` (220 ms), mostra a cabeça do Pixel com a expressão
  `feliz` no acerto e `pensando` no erro, o título em texto, as duas respostas
  na múltipla escolha e o retorno autoral. No erro, a área de resposta treme com
  `useShakeError`.
- **Sequência.** `lessonCombo.ts` exporta `nextCombo(state, correct)`, que
  devolve `{ count, milestone }` com marcos em 3, 5 e 10; o erro zera.
  `ComboBadge.tsx` escreve "3 seguidas", "5 seguidas" ou "10 seguidas" no topo
  por 2,4 s. O marco de 3 emite `streak`; os de 5 e 10 emitem `combo`. No marco,
  esse som entra **no lugar** do acerto, para dois sons não saírem juntos.
- **Vida perdida.** `heart_lost` volta a ser emitido, 320 ms depois do erro e no
  mesmo instante em que o aviso "Menos 1 vida" aparece no topo, com o coração
  que esvazia (`HeartIcon` com `useHeartLossAnimation`). Só quando o contador
  caiu de fato: assinante e revisão continuam sem ouvir nada sobre vidas.
- **Conclusão.** Com pelo menos uma estrela, o resumo solta o confete
  (`Confetti`, 36 peças) e a tela emite `lesson_complete` (som `fim`). Com zero
  acerto, nem um nem outro. Antes o `fim` exigia a nota de aprovação.
- **Retorno por item na aula ampla.** Aula com mais de uma interação passa a
  mostrar o retorno de cada item antes de seguir. Sem isso, a aula de cinco
  interações só comentaria a última.
- **Sons (I6).** `scripts/synth-sounds.mjs` sintetiza `combo.m4a`, `nivel.m4a` e
  `unidade.m4a`. `lessonSounds` carrega nove sons e `lessonFeedback` ganhou os
  eventos `combo`, `level_up` e `unit_complete`, com som e vibração, pelos
  mesmos interruptores de sempre. O README dos sons foi reescrito.

## Decisões tomadas na implementação

1. **Pista e pontuação.** `LessonOutcomeService` não usa pista para acertos,
   estrelas nem XP, e isso não mudou. O serviço já declarava
   `hintUsedByInteraction` "para que o motor v2 possa preenchê-los sem mudar
   este contrato". A tela passa a preenchê-lo quando a pista é aberta. O efeito
   é o que já estava escrito: o modelo de memória dá menos ganho de estabilidade
   ao acerto com pista (`hintPenalty`, em `memoryModel.ts`) e o
   `CompetencyMasteryService` não conta esse acerto para domínio. Sem pista
   usada, a chave nem é enviada.
2. **Retomada (foco 2).** As respostas não entram no checkpoint, por
   privacidade, e a conclusão precisa de todas. Por isso a regra que já existia
   continua: a sessão retomada volta à **primeira interação**, não ao passo
   salvo. O teste novo afirma isso para a aula de cinco interações.
3. **"Reduzir movimento" e o som da vida.** O aviso "Menos 1 vida" aparece nos
   dois modos; com movimento reduzido o coração fica vazio e parado. O som
   acompanha o aviso visível nos dois modos.
4. **Confete só a pedido.** `LessonSummary` ganhou a prop `celebrate`, que só a
   aula da trilha passa. O `QuizScreen` usa o mesmo resumo e tem teste que exige
   zero confete; ele não foi tocado.
5. **Testes de limite.** `LessonFlowService.test.ts` afirmava os limites antigos
   (6 passos, 4 interações). Passou a afirmar os de I2 pelos dois lados: aceita
   12 passos e recusa 13; aceita 8 interações e recusa 9.

## Execução vermelha

### 1. Antes da implementação

Os testes de fluxo foram escritos antes de a tela mudar. Contra a tela antiga:

```text
● LessonFlowScreen — conclusão da lição › resultado lesson mantém o título real e tema (ressonancia/protecao)
    Expected length: 1
● LessonFlowScreen — conclusão da lição › resultado review mantém o título real e tema (ressonancia/protecao)
    Expected length: 1
● LessonFlowScreen — conclusão da lição › resultado lesson mantém o título real e tema (undefined/protecao)
    Expected length: 1
● LessonFlowScreen — conclusão da lição › resultado review mantém o título real e tema (undefined/protecao)
    Expected length: 1
● LessonFlowScreen — sons e vibração › a vida perdida soa depois do erro, junto do aviso visível no topo da aula
    Unable to find an element with testID: lesson-heart-loss
● LessonFlowScreen — sem nó, a tela não grava progresso da trilha › abrir e concluir a aula sem nó não marca nó nem toca no ponto de retomada
    Expected length: 1
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (d) a cena de abertura revela uma fala por toque, na ordem, com o nome de quem fala, e o botão continua 
    Unable to find an element with text: Sala de exames, início do plantão.
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (a) a aula com cinco interações vai até o fim: retorno por item, selo de 3 e de 5 seguidas, fecho em diá
    Unable to find an element with text: Continuar
● Frente C — aula ampla com diálogo, retorno, sequência e pista › um erro treme a área de resposta, zera a sequência e o selo só volta com três novas seguidas
    Unable to find an element with text: Continuar
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (b) interromper depois da terceira interação e retomar volta à primeira pergunta, sem XP nem vida em dob
    Unable to find an element with text: Continuar
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (c) sem som, sem vibração e com "Reduzir movimento", cada estado continua escrito na tela (foco 5)
    Unable to find an element with text: Sala de exames, início do plantão.
● Frente C — aula ampla com diálogo, retorno, sequência e pista › a pista aparece só no item que a tem, antes da resposta, e some da oferta depois de responder
    Unable to find node on an unmounted component.
● Frente C — aula ampla com diálogo, retorno, sequência e pista › usar a pista não muda estrelas nem acertos; o uso segue para a evidência do item, como o serviço já prev
    Unable to find node on an unmounted component.
● Frente C — aula ampla com diálogo, retorno, sequência e pista › com 1 de 5 corretas (1 estrela ou mais), a conclusão toca o fim e solta o confete
    Unable to find node on an unmounted component.
● Frente C — aula ampla com diálogo, retorno, sequência e pista › com 3 de 5 corretas (2 estrela ou mais), a conclusão toca o fim e solta o confete
    Unable to find node on an unmounted component.
● Frente C — aula ampla com diálogo, retorno, sequência e pista › com zero acerto, a conclusão não comemora: sem confete, sem som de fim, sem vibração de festa
    Unable to find node on an unmounted component.
Tests:       16 failed, 93 passed, 109 total
```

As cinco últimas falhas ("unmounted component") não medem a tela: vinham de um
defeito do próprio teste (c), que devolvia o dublê de `isReduceMotionEnabled`
com `mockRestore` e o deixava sem implementação para os testes seguintes. O
teste passou a guardar e devolver a função inteira. Esses cinco testes foram
vistos falhando pelo motivo certo só na tabela de defeitos injetados, abaixo.

Os eventos novos de som, antes de existirem em `lessonFeedback` e `lessonSounds`:

```text
● feedback da lição › combo toca combo e vibra com hapticStreak
  ● feedback da lição › level_up toca nivel e vibra com hapticCelebrate
  ● feedback da lição › unit_complete toca unidade e vibra com hapticCelebrate
  ● tocador de sons da lição › pré-carrega os nove sons ao abrir e respeita o silencioso
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 0
    -   "combo",
    -   "nivel",
    -   "unidade",
    > 12 |     expect(LESSON_SOUND_IDS).toEqual(['toque', 'acerto', 'erro', 'vida', 'sequencia', 'fim', 'combo', 'nivel', 'unidade']);
      13 |     expect(createAudioPlayer).toHaveBeenCalledTimes(9);
      15 |     expect(new Set(mockAudioPlayers.map((player) => player.source)).size).toBe(9);
Test Suites: 2 failed, 1 passed, 3 total
Tests:       4 failed, 14 passed, 18 total
```

### 2. Cada asserção com o defeito que ela nomeia

A primeira execução acima falha no primeiro elemento que falta, e não diz se
cada asserção pega o defeito dela. Por isso, depois do verde, cada defeito foi
injetado sozinho no código, a suíte correu e o arquivo foi restaurado. Os 28
defeitos reprovaram. Abaixo, o primeiro teste que cai em cada um.

#### `combo-marco-errado`

Defeito injetado em src/features/lesson-flow/services/lessonCombo.ts: `[3, 5, 10];` -> `[4, 5, 10];`

```text
● sequência de acertos da aula › conta os acertos seguidos e marca só a 3ª, a 5ª e a 10ª
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   3,
    +   4,
    17 |         expect(passos.map((passo) => passo.count)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    > 18 |         expect(passos.map((passo) => passo.milestone)).toEqual([null, null, 3, null, 5, null, null, null, null, 10, null]);
Tests:       2 failed, 3 passed, 5 total
```

#### `combo-erro-nao-zera`

Defeito injetado em src/features/lesson-flow/services/lessonCombo.ts: `correct ? state.count + 1 : 0` -> `correct ? state.count + 1 : state.count`

```text
● sequência de acertos da aula › um erro zera a contagem, e o marco precisa ser alcançado de novo
    expect(received).toEqual(expected) // deep equality
    - Expected  - 2
    + Received  + 2
    -   0,
    -   1,
    +   4,
    +   5,
    > 24 |         expect(passos.map((passo) => passo.count)).toEqual([1, 2, 0, 1, 2, 3]);
Tests:       2 failed, 3 passed, 5 total
```

#### `elenco-nome-em-branco`

Defeito injetado em src/ui/characters/cast/castRegistry.ts: `name?.trim() || CAST` -> `name ?? CAST`

```text
● elenco das cenas de diálogo › o nome da fala vence o do elenco, e nome em branco não apaga quem fala
    expect(received).toBe(expected) // Object.is equality
    Expected: "Paciente"
    Received: "   "
    19 |         expect(castSpeakerName('paciente', 'Seu Antônio')).toBe('Seu Antônio');
    20 |         expect(castSpeakerName('paciente')).toBe('Paciente');
    > 21 |         expect(castSpeakerName('paciente', '   ')).toBe('Paciente');
    22 |         expect(castSpeakerName('lia')).toBe('Profa. Lia');
Tests:       1 failed, 2 passed, 3 total
```

#### `avatar-decorativo-anunciado`

Defeito injetado em src/ui/characters/cast/CastAvatar.tsx: `const hidden = decorative` -> `const hidden = false`

```text
● CastAvatar › decorativo, o retrato some do leitor de tela, porque o texto ao lado já diz quem fala
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: undefined
    63 |         expect(screen.queryByLabelText('Profa. Lia, supervisora de estágio')).toBeNull();
    > 65 |         expect(retrato.props.accessibilityElementsHidden).toBe(true);
    66 |         expect(retrato.props.importantForAccessibility).toBe('no-hide-descendants');
Tests:       2 failed, 12 passed, 14 total
```

#### `avatar-silhueta-repetida`

Defeito injetado em src/ui/characters/cast/CastAvatar.tsx: `caio: 'M21 24 C20 14 26 12 32 12 C39 12 45 14 43 24 C42 20 40 18 37 18 L27 18 C24 18 22 20` -> `caio: 'M20 28 C18 22 20 18 24 17 C22 21 22 25 22 30 Z M44 28 C46 22 44 18 40 17 C42 21 42 `

```text
● CastAvatar › as quatro silhuetas de cabelo são diferentes entre si e cabem na caixa do desenho
    expect(received).toBe(expected) // Object.is equality
    Expected: 4
    Received: 3
    > 43 |         expect(new Set(tracados).size).toBe(RETRATOS.length);
Tests:       1 failed, 13 passed, 14 total
```

#### `avatar-coque-fora-da-caixa`

Defeito injetado em src/ui/characters/cast/CastAvatar.tsx: `circle(32, 10, 6)` -> `circle(32, 4, 6)`

```text
● CastAvatar › as quatro silhuetas de cabelo são diferentes entre si e cabem na caixa do desenho
    expect(received).toBeGreaterThanOrEqual(expected)
    Expected: >= 0
    Received:    -2
    > 53 |                 expect(Number(y) - Number(r)).toBeGreaterThanOrEqual(0);
    54 |                 expect(Number(y) + Number(r)).toBeLessThanOrEqual(CAST_VIEWBOX);
Tests:       1 failed, 13 passed, 14 total
```

#### `dialogo-ordem-invertida`

Defeito injetado em src/features/lesson-flow/components/DialogueScene.tsx: `return dialogue.lines.slice(0, Math.max(1, Math.min(visibleCount, dialogue.lines.length)))` -> `return dialogue.lines.slice(0, Math.max(1, Math.min(visibleCount, dialogue.lines.length)))`

```text
● DialogueScene › revela uma fala de cada vez, e as anteriores continuam na tela
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   "Profa. Lia: Antes de posicionar, confira o pedido.",
    +   "Profa. Lia: Antes de posicionar, confira o pedido.",
    > 47 |         expect(falasLidas()).toEqual([
Tests:       2 failed, 6 passed, 8 total
```

#### `dialogo-sem-nome-no-rotulo`

Defeito injetado em src/features/lesson-flow/components/DialogueScene.tsx: `return `${castSpeakerName(line.speaker, line.name)}: ${line.text}`;` -> `return line.text;`

```text
● DialogueScene › abre com o cenário e só a primeira fala, e diz em texto quantas faltam
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   "Profa. Lia: Antes de posicionar, confira o pedido.",
    +   "Antes de posicionar, confira o pedido.",
    37 |         expect(screen.getByText('Sala de exames, início do plantão.')).toBeTruthy();
    > 38 |         expect(falasLidas()).toEqual(['Profa. Lia: Antes de posicionar, confira o pedido.']);
    39 |         expect(screen.queryByText('Vai demorar muito, doutora?')).toBeNull();
Tests:       4 failed, 4 passed, 8 total
```

#### `dialogo-anima-com-reduzir-movimento`

Defeito injetado em src/ui/motion.ts: `if (reducedMotionEnabled) {

```text
            opacity.setValue(1);
            translateY.setVal` -> ``
● DialogueScene › com "Reduzir movimento", as falas aparecem no lugar, sem animação (foco 5)
    expect(jest.fn()).not.toHaveBeenCalled()
    Expected number of calls: 0
    Received number of calls: 6
    > 90 |         expect(timing).not.toHaveBeenCalled();
    91 |         expect(falasLidas()).toHaveLength(3);
    93 |             expect(StyleSheet.flatten(fala.props.style).opacity).toBe(1);
Tests:       1 failed, 7 passed, 8 total
```

#### `retorno-titulo-igual-no-erro`

Defeito injetado em src/features/lesson-flow/components/AnswerFeedbackCard.tsx: `{correct ? 'Resposta correta' : 'Vamos reforçar'}` -> `{'Resposta correta'}`

```text
● AnswerFeedbackCard › no erro, o título muda, o Pixel pensa junto e as duas respostas aparecem por escrito
    Unable to find an element with role: header, name: Vamos reforçar
Tests:       3 failed, 4 passed, 7 total
```

#### `retorno-pixel-feliz-no-erro`

Defeito injetado em src/features/lesson-flow/components/AnswerFeedbackCard.tsx: `correct ? 'feliz' : 'pensando'` -> `'feliz'`

```text
● AnswerFeedbackCard › no erro, o título muda, o Pixel pensa junto e as duas respostas aparecem por escrito
    expect(received).toBe(expected) // Object.is equality
    Expected: "pensando"
    Received: "feliz"
    42 |         expect(screen.getByRole('header', { name: 'Vamos reforçar' })).toBeTruthy();
    43 |         expect(screen.getByLabelText('Pixel pensando com você')).toBeTruthy();
    > 44 |         expect(screen.getByTestId('pixel-expression', { includeHiddenElements: true }).props.children).toBe('pensando');
    45 |         expect(screen.getByText('Sua resposta: Próton')).toBeTruthy();
    46 |         expect(screen.getByText('Resposta certa: Elétron')).toBeTruthy();
Tests:       1 failed, 6 passed, 7 total
```

#### `selo-sem-texto`

Defeito injetado em src/features/lesson-flow/components/ComboBadge.tsx: `{comboLabel(milestone)}` -> `{String(milestone)}`

```text
● ComboBadge › no marco de 3, escreve "3 seguidas"
    Unable to find an element with text: 3 seguidas
    > 25 |         expect(screen.getByText(texto)).toBeTruthy();
    26 |         expect(screen.getByLabelText(`${marco} respostas certas seguidas`).props.accessibilityRole).toBe('text');
Tests:       4 failed, 1 passed, 5 total
```

#### `pista-aberta-antes-do-pedido`

Defeito injetado em src/features/lesson-flow/components/LessonHelpButton.tsx: `useState(false)` -> `useState(true)`

```text
● LessonHelpButton › oferece a pista sem mostrá-la antes do pedido
    Unable to find an element with role: button, name: Ver pista
    > 16 |         expect(screen.getByRole('button', { name: 'Ver pista' })).toBeTruthy();
    17 |         expect(screen.queryByText(`Pista: ${PISTA}`)).toBeNull();
    18 |         expect(announce).not.toHaveBeenCalled();
Tests:       5 failed, 5 total
```

#### `pista-uso-nao-contado`

Defeito injetado em src/features/lesson-flow/components/LessonHelpButton.tsx: `onReveal?.();` -> ``

```text
● LessonHelpButton › ao pedir, mostra a pista por escrito, avisa o leitor de tela e conta o uso uma vez
    expect(jest.fn()).toHaveBeenCalledTimes(expected)
    Expected number of calls: 1
    Received number of calls: 0
    27 |         expect(screen.getByText(`Pista: ${PISTA}`)).toBeTruthy();
    28 |         expect(screen.queryByRole('button', { name: 'Ver pista' })).toBeNull();
    > 29 |         expect(onReveal).toHaveBeenCalledTimes(1);
    30 |         expect(announce).toHaveBeenCalledWith(`Pista: ${PISTA}`);
Tests:       1 failed, 4 passed, 5 total
```

#### `resumo-confete-com-zero`

Defeito injetado em src/features/quiz/components/LessonSummary.tsx: `{celebrate && !isZeroStars ?` -> `{celebrate ?`

```text
● LessonSummary — confete da conclusão › com zero acerto, não há confete mesmo com o pedido
    expect(received).toHaveLength(expected)
    Expected length: 0
    Received length: 1
    Received array:  [{"_fiber": {"_debugHookTypes": ["useMemo"], "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": {"_debugHookTypes": ["useState", "useEff
    > 577 |     expect(screen.UNSAFE_queryAllByType(Confetti)).toHaveLength(0);
    578 |     expect(screen.getByText('0 de 5 corretas')).toBeTruthy();
Tests:       1 failed, 49 skipped, 3 passed, 53 total
```

#### `som-combo-trocado`

Defeito injetado em src/ui/feedback/lessonFeedback.ts: `combo: 'combo', level_up` -> `combo: 'sequencia', level_up`

```text
● feedback da lição › combo toca combo e vibra com hapticStreak
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: "combo"
    Received: "sequencia"
    Number of calls: 1
    > 32 |     expect(sounds.play).toHaveBeenCalledWith(sound);
    33 |     expect(hapticMocks[haptic]).toHaveBeenCalledTimes(1);
Tests:       1 failed, 10 passed, 11 total
```

#### `tela-duas-falas-por-toque`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `count: revealedLines + 1 }` -> `count: revealedLines + 2 }`

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (d) a cena de abertura revela uma fala por toque, na ordem, com o nome de quem fala, e o botão continua 
    expect(received).toEqual(expected) // deep equality
    - Expected  - 0
    + Received  + 1
    +   "Pixel: Repare em como ela responde.",
    > 2580 |     expect(falas()).toEqual(['Profa. Lia: Antes de posicionar, confira o pedido.', 'Seu Antônio: Vai demorar muito?']);
    2581 |     expect(announceForAccessibility).toHaveBeenLastCalledWith('Seu Antônio: Vai demorar muito?');
    2583 |     expect(screen.getByText('Passo 1 de 8')).toBeTruthy();
Tests:       7 failed, 99 skipped, 3 passed, 109 total
```

#### `tela-fala-nova-sem-anuncio`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `AccessibilityInfo.announceForAccessibility(dialogueLineLabel(stepDialogue.lines[revealedLi` -> ``

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (d) a cena de abertura revela uma fala por toque, na ordem, com o nome de quem fala, e o botão continua 
    expect(jest.fn()).toHaveBeenLastCalledWith(...expected)
    Expected: "Seu Antônio: Vai demorar muito?"
    Number of calls: 0
    2580 |     expect(falas()).toEqual(['Profa. Lia: Antes de posicionar, confira o pedido.', 'Seu Antônio: Vai demorar muito?']);
    > 2581 |     expect(announceForAccessibility).toHaveBeenLastCalledWith('Seu Antônio: Vai demorar muito?');
    2583 |     expect(screen.getByText('Passo 1 de 8')).toBeTruthy();
    2584 |     expect(screen.getByRole('button', { name: 'Continuar' }).props.accessibilityState?.disabled).not.toBe(true);
Tests:       1 failed, 99 skipped, 9 passed, 109 total
```

#### `tela-fecho-conclui-com-fala-pendente`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `const confirmationLabel = dialoguePending

```text
        ? 'Continuar'
        : player.showingFe` -> `const confirmationLabel = player.showingFeedback`
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (a) a aula com cinco interações vai até o fim: retorno por item, selo de 3 e de 5 seguidas, fecho em diá
    expect(received).toBeNull()
    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-fra
    > 2565 |     expect(screen.queryByText('Concluir e voltar')).toBeNull();
Tests:       7 failed, 99 skipped, 3 passed, 109 total
```

#### `tela-sem-retorno-por-item`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `hybrid || interactionCount > 1 ||` -> `hybrid ||`

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (a) a aula com cinco interações vai até o fim: retorno por item, selo de 3 e de 5 seguidas, fecho em diá
    Unable to find an element with testID: lesson-item-feedback
Tests:       9 failed, 99 skipped, 1 passed, 109 total
```

#### `tela-erro-nao-zera-sequencia`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `combo.current = comboNow;` -> `combo.current = correct ? comboNow : combo.current;`

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › um erro treme a área de resposta, zera a sequência e o selo só volta com três novas seguidas
    expect(received).not.toContain(expected) // indexOf
    Expected value: not "sequencia"
    Received array:     ["toque", "acerto", "toque", "acerto", "toque", "erro", "toque", "sequencia", "toque", "acerto"]
    2668 |     expect(screen.queryByTestId('combo-badge')).toBeNull();
    > 2669 |     expect(tocados()).not.toContain('sequencia');
    2670 |     expect(tocados()).not.toContain('combo');
Tests:       1 failed, 99 skipped, 9 passed, 109 total
```

#### `tela-treme-no-acerto`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `if (!correct) answerShake.animateIn();` -> `answerShake.animateIn();`

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (a) a aula com cinco interações vai até o fim: retorno por item, selo de 3 e de 5 seguidas, fecho em diá
    expect(jest.fn()).not.toHaveBeenCalled()
    Expected number of calls: 0
    Received number of calls: 5
    2641 |     expect(haptics.hapticStreak).toHaveBeenCalledTimes(2);
    > 2642 |     expect(mockAnswerShake).not.toHaveBeenCalled();
    2643 |     expect(heartsRepository.spend).not.toHaveBeenCalled();
    2644 |     expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledTimes(1);
    2645 |     expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledWith(expect.objectContaining({
Tests:       2 failed, 99 skipped, 8 passed, 109 total
```

#### `tela-retomada-no-passo-salvo`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `interactionIndex >= 0 ? Math.min(requestedIndex, interactionIndex) : requestedIndex` -> `requestedIndex`

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (b) interromper depois da terceira interação e retomar volta à primeira pergunta, sem XP nem vida em dob
    Unable to find an element with text: Passo 3 de 8
Tests:       1 failed, 99 skipped, 9 passed, 109 total
```

#### `tela-pista-fora-da-evidencia`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `Object.keys(hintUsed.current).length > 0 ? { hintUsedByInteraction: hintUsed.current } : n` -> `null`

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › usar a pista não muda estrelas nem acertos; o uso segue para a evidência do item, como o serviço já prev
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: ObjectContaining {"hintUsedByInteraction": {"q2": true}}
    Received: {"activity": {"competencyIds": ["competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao"], "id": "activity:rtg-2026:m01:01", "provenance": {"co
    Number of calls: 1
    2797 |       expect(await screen.findByText('5 de 5 corretas')).toBeTruthy();
    2798 |       expect(screen.getByLabelText('3 de 3 estrelas')).toBeTruthy();
    > 2799 |       expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledWith(expect.objectContaining({
Tests:       1 failed, 99 skipped, 9 passed, 109 total
```

#### `tela-fim-com-zero-estrela`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `(summary?.stars ?? 0) > 0` -> `(summary?.stars ?? 0) >= 0`

```text
● Frente C — aula ampla com diálogo, retorno, sequência e pista › (a) a aula com cinco interações vai até o fim: retorno por item, selo de 3 e de 5 seguidas, fecho em diá
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 0
    -   "fim",
    2636 |     expect(screen.UNSAFE_queryAllByType(Confetti)).toHaveLength(1);
    > 2638 |     await waitFor(() => expect(tocados()).toEqual([
    2641 |     expect(haptics.hapticStreak).toHaveBeenCalledTimes(2);
Tests:       3 failed, 99 skipped, 7 passed, 109 total
```

#### `tela-vida-colada-no-erro`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `const HEART_LOSS_DELAY_MS = 320;` -> `const HEART_LOSS_DELAY_MS = 0;`

```text
● LessonFlowScreen — sons e vibração › a vida perdida soa depois do erro, junto do aviso visível no topo da aula
    expect(received).toEqual(expected) // deep equality
    - Expected  - 0
    + Received  + 1
    +   "vida",
    1496 |     expect(announceForAccessibility).toHaveBeenCalledWith(expect.stringContaining('Você perdeu uma vida; restam 4.'));
    > 1498 |     expect(tocados()).toEqual(['toque', 'erro']);
    1499 |     expect(haptics.hapticLifeLost).not.toHaveBeenCalled();
    1500 |     expect(screen.queryByTestId('lesson-heart-loss')).toBeNull();
Tests:       1 failed, 102 skipped, 6 passed, 109 total
```

#### `tela-vida-soa-para-assinante`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `if (heartLoss) {` -> `if (heartLoss || nextHearts.status === 'unlimited') {`

```text
● LessonFlowScreen — sons e vibração › o assinante erra e também ouve só o erro
    expect(received).toEqual(expected) // deep equality
    - Expected  - 0
    + Received  + 1
    +   "vida",
    > 1530 |     expect(tocados()).toEqual(['toque', 'erro']);
    1531 |     expect(haptics.hapticLifeLost).not.toHaveBeenCalled();
    1532 |     expect(screen.queryByTestId('lesson-heart-loss')).toBeNull();
Tests:       1 failed, 102 skipped, 6 passed, 109 total
```

#### `tela-vida-sem-aviso-visivel`

Defeito injetado em src/features/lesson-flow/screens/LessonFlowScreen.tsx: `setHeartLossVisible(true);` -> ``

```text
● LessonFlowScreen — sons e vibração › a vida perdida soa depois do erro, junto do aviso visível no topo da aula
    Unable to find an element with testID: lesson-heart-loss
Tests:       1 failed, 102 skipped, 6 passed, 109 total
```

## Execução verde

Node v20.20.2, na worktree `trilha-2026-10-20`, em 2026-11-05, com os arquivos
das outras duas frentes presentes e não commitados na árvore.

| Comando (em `radiant-app/`) | Resultado |
| --- | --- |
| `npx jest src/features/lesson-flow src/features/quiz src/ui/characters src/ui/feedback` | 36 suítes, 654 testes, todos passam |
| `npx jest src/features/lesson-flow/components src/features/lesson-flow/services/lessonCombo.test.ts src/ui/characters/cast src/ui/feedback src/features/quiz/components/LessonSummary.test.tsx src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx` | 12 suítes, 227 testes, todos passam |
| `npx tsc --noEmit -p .` | sem erro |
| `npx eslint` nos arquivos da frente | sem aviso |
| `npm run test:reanimated-easing-contract` | 1 de 1 |
| `npm run test:contrast-contract` | 17 de 17 |
| `npm run visual:qa:strict` | 0 regressões (41 na baseline, 3 exceções de escopo) |
| `npm run test:copy-style-contract` | 64 de 65. O teste 65 reprova por `eyebrow` em `src/features/student-checkpoints/batches/rtg-2026-*.ts` e `rtgBatchFactory.ts`, que são de outra frente. Nenhum arquivo desta frente aparece na lista |

Não rodei `npm run quality` nem a suíte inteira do Jest: o gate é do controlador.

## Sons: durações medidas com `afinfo`

| Arquivo | Duração | Formato | Pico (`volumedetect`) |
| --- | --- | --- | --- |
| `toque.m4a` | 0,040385 s | existente | |
| `erro.m4a` | 0,136417 s | existente | |
| `vida.m4a` | 0,188186 s | existente | |
| `acerto.m4a` | 0,289841 s | existente | |
| `sequencia.m4a` | 0,372880 s | existente | |
| `combo.m4a` | 0,450000 s | AAC, 1 canal, 44100 Hz | -3,0 dB |
| `nivel.m4a` | 0,700000 s | AAC, 1 canal, 44100 Hz | -2,9 dB |
| `fim.m4a` | 0,993039 s | existente | |
| `unidade.m4a` | 1,400000 s | AAC, 1 canal, 44100 Hz | -3,0 dB |

As nove durações são distintas. Duas execuções seguidas do script geraram os
mesmos bytes (SHA-256 no README dos sons).

## O que não foi feito ou não foi verificado

- **Nada foi visto nem ouvido** em simulador ou aparelho (ver o limite no topo).
- **O confete dura mais que 700 ms.** O `Confetti` existente cai por 2 a 3,5 s,
  com até 600 ms de atraso por peça. Ele não captura toque, então o Continuar
  responde enquanto ele cai, e some com "Reduzir movimento". Encurtá-lo pede
  mudança em `src/components/ui/Confetti.tsx`, fora da área desta frente.
- **Foco 2, contagem única.** O teste de retomada foi visto falhar com o defeito
  de passo errado. As asserções "uma conclusão" e "uma vida gasta" do mesmo
  teste não foram vistas falhando com um defeito próprio.
- **Foco 5 no fluxo.** O teste sem som e com movimento reduzido afirma os textos
  de cada estado. Na suíte de fluxo os hooks de movimento são dublês; quem prova
  "sem animação" são as suítes dos componentes, com o hook real.
- **Chave de silencioso.** `playsInSilentMode: false` já existia e continua
  afirmado em `lessonSounds.test.ts`. O comportamento no aparelho não foi medido.
- **Texto ampliado.** Os testes afirmam ausência de teto de fonte, de limite de
  linhas e de altura fixa nos textos novos. O Jest não mede glifos.
- **Sequência e retomada.** A contagem de seguidas recomeça numa sessão retomada.
- **`CastAvatar.stories.tsx`** não foi criado.
- **`src/ui/motion.ts`** não precisou mudar: os hooks existentes bastaram.
