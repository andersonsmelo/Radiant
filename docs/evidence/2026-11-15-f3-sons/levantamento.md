# F3: levantamento do retorno da aula (2026-11-15)

Feito por `grep` do efeito na branch `claude/f3-sons-e-microinteracoes-db21d1`,
sobre a F2 (`0974282`) com a F7 mesclada (`ca1f20e`). Caminhos relativos a
`radiant-app/`. Linhas medidas **antes** de qualquer edição da F3.

## Quem toca som e quem vibra

| Efeito | Onde mora | Quem chama |
| --- | --- | --- |
| `expo-audio` (`createAudioPlayer`) | `src/ui/feedback/lessonSounds.ts:1` e `:38`, carrega os 9 sons na abertura | só `createLessonFeedback` |
| `expo-haptics` | `src/ui/feedback/haptics.ts:1` | `lessonFeedback.ts:17-20`; fora da aula, `useQuiz.ts:140,142,169`, `QuizScreen.tsx:361`, `RewardScreen.tsx:236`, `AppButton.tsx:119`, `components/haptic-tab.tsx:3` |
| Mapa evento → som e vibração | `src/ui/feedback/lessonFeedback.ts:12-20`, duas tabelas (`SOUND`, `HAPTIC`), sem animação | `LessonFlowScreen.tsx:147`, `CheckpointScreen.tsx:146`, `HybridLessonScreen.tsx:116`, `JourneyHomeScreen.tsx:81-84`, `LevelBadge.tsx:32`, `UnitCompleteCelebration.tsx:76` |
| Preferências | `src/ui/feedback/feedbackPreferences.ts` (`sounds`, `haptics`), lidas em `LessonFlowScreen.tsx:138` | |
| Modo silencioso | `lessonSounds.ts:34`, `playsInSilentMode: false` | |

Nenhum componente do tocador toca som por conta própria hoje: todo som da aula
passa por `emit` na tela. O que falta é o **mapa** dizer também a animação, e os
momentos sem evento.

## Sons e onde tocam na aula (`LessonFlowScreen.tsx`)

| Evento | Som (duração `afinfo`) | Vibração | Linha |
| --- | --- | --- | --- |
| `option_tap` | `toque` (40 ms) | seleção | `:810`, em todo `onChange` do registro, para as 9 famílias |
| `incorrect` | `erro` (136 ms) | aviso | `:411` (sem custo) e `:421` (com custo) |
| `heart_lost` | `vida` (188 ms), 320 ms depois | pesado | `:438` |
| `correct` | `acerto` (290 ms) | sucesso | `:445` |
| `streak` (3ª seguida) | `sequencia` (373 ms) | tá-tá | `:445` |
| `combo` (5ª e 10ª) | `combo` (450 ms) | tá-tá | `:445` |
| `lesson_complete` | `fim` (993 ms) | sucesso | `:646`, só com estrela |
| `level_up` | `nivel` (700 ms) | sucesso | `LevelBadge.tsx:32` |
| `unit_complete` | `unidade` (1400 ms) | sucesso | `UnitCompleteCelebration.tsx:76`, emitido pela trilha |

## Animações do tocador e da conclusão

Todas em `src/ui/motion.ts`, com `useNativeDriver: true` (RN `Animated`) ou
Reanimated; nenhuma redesenha pelo JS por quadro.

| Animação | Hook | Duração | Onde |
| --- | --- | --- | --- |
| Pressão de ficha (F2) | `usePressScale` 0,98 | 100 ms | `TapChip.tsx:33` |
| Veredito de ficha (F2) | `useScalePop` | 150 ms | `TapChip.tsx:34-36` |
| Entrada de etapa (F2) | `useCardEnter` | 200 ms | `TapChip.tsx:61-64` |
| Pressão de alternativa (múltipla escolha) | **nenhuma** | — | `MultipleChoiceStepRenderer.tsx:48-69`, `Pressable` sem escala |
| Entrada do cartão de retorno | `useCardEnter` | 220 ms (`duration.ui`) | `AnswerFeedbackCard.tsx:25-26` |
| Tremor no erro | `useShakeError` | 360 ms | `LessonFlowScreen.tsx:158`, `:449` |
| Selo de sequência | `useScalePop` | 180 ms | `ComboBadge.tsx:14-15` |
| Entrada de fala | `useCardEnter` | 220 ms | `DialogueScene.tsx:24-25` |
| Progresso da aula | `AnimatedProgressBar` (Reanimated `withTiming`) | — | `QuizTopBar.tsx:46` |
| Conclusão: medalha | `useMedalMint` (mola 300 ms) | só quando `starsImproved` | `LessonSummary.tsx:133-147` |
| Conclusão: estrelas, confete | `StarRow`, `Confetti` | | `LessonSummary.tsx:166`, `:244` |
| Unidade: modal com confete, medalha **parada** | `Modal` fade | | `UnitCompleteCelebration.tsx:79-90` |

## As quatro famílias novas (F2) e as cenas de diálogo

| Família | Toque | Acerto, erro | Avançar |
| --- | --- | --- | --- |
| `true-false` | `judge` → `onChange` (`TrueFalseStepRenderer.tsx:22`) → `toque` | o mesmo `emit` da confirmação | sem som |
| `cloze` | pôr ficha na lacuna → `onChange` (`ClozeStepRenderer.tsx:25`) → `toque`; tirar (`:27`) → `toque` | idem | sem som |
| `categorize` | **escolher o item é mudo** (`setPicked`, `CategorizeStepRenderer.tsx:48`); pôr no grupo → `onChange` (`:20`) → `toque` | idem | sem som |
| `multi-select` | marcar → `onChange` (`MultiSelectStepRenderer.tsx:15`) → `toque` | idem | sem som |
| Cena de diálogo | revelar fala (`LessonFlowScreen.tsx:384`): anuncia ao leitor, **sem som e sem vibração** | — | — |

## Momentos hoje mudos ou parados

1. **Soltar ficha** (cloze, categorize): soa igual a tocar numa alternativa;
   não há som de "encaixe".
2. **Escolher o item no categorize**: mudo e sem vibração (estado local).
3. **Avançar de etapa**: nenhum som, nenhuma vibração.
4. **Fala de diálogo**: aparece com entrada, mas muda.
5. **Pressão de alternativa da múltipla escolha**: parada (só a borda muda).
6. **Retorno**: o Pixel é `feliz`/`pensando` (`AnswerFeedbackCard.tsx:32`); a F7
   deixou o seletor `castExpressionFor({ kind: 'retorno' })`, sem ligar. O
   acerto que fecha marco não comemora.
7. **Entrada do cartão de retorno**: 220 ms, acima da faixa de "confirmar
   resposta" da seção 10 (120–180 ms).
8. **Incentivo**: só o selo de sequência (texto "3 seguidas"); nada para a aula
   sem erro nem para o acerto depois de um erro.
9. **Conclusão de unidade**: medalha parada; conclusão de aula sem recorde novo
   também não cunha a medalha.

Fora do recorte da F3: `useQuiz`, `QuizScreen`, `RewardScreen` (fluxo antigo de
quiz) e `CheckpointScreen` usam o mesmo mapa e não mudam.
