# F3 da 1.6: sons, micro e macrointerações da aula (2026-11-15)

Frente F3 da atualização 1.6, delegada pelo controlador. Base: F2 (#71) com a F7
(#73) mesclada. Levantamento em
[`evidence/2026-11-15-f3-sons/levantamento.md`](../evidence/2026-11-15-f3-sons/levantamento.md);
decisões em [ADR 2026-11-15](../adr/ADR-2026-11-15-retorno-rico-da-aula.md).

## Pronto quando

- `lessonFeedback.ts` é o único lugar que diz som, vibração e animação de cada
  momento da aula, e a tela só emite momentos.
- Com `ENABLE_RICH_FEEDBACK` desligada, o que se ouve, se sente e se vê é o da
  base, com contraprova em teste.
- Ligada: soltar ficha e fala de diálogo têm som próprio, avançar vibra, a
  múltipla escolha afunda ao toque, o retorno entra em 150 ms com o elenco
  da F7, há incentivo nos três marcos e a conclusão de aula e de unidade
  cunham a medalha.
- Cada asserção nova foi vista falhando pelo defeito que nomeia
  (`vermelho.txt`), gate verde, sons confirmados pelo log do simulador.

## Passos

1. **Mapa** (`radiant-app/src/ui/feedback/lessonFeedback.ts`): uma tabela
   `LESSON_FEEDBACK` de momento → `{ sound, haptic, motion }`, mais os momentos
   `token_drop`, `advance` e `dialogue_line`. `createLessonFeedback` recebe
   `rich`; desligado, `token_drop` vira `toque` e os outros dois calam.
   `feedbackMotion(moment, reduced)` devolve a duração (0 com menos movimento).
   Teste: tabela inteira, contraprova desligada, faixas da seção 10.
2. **Sons** `soltar` e `fala`, sintetizados por `scripts/synth-sounds.mjs`
   (só os dois, por argumento; os três antigos não são regerados), registrados
   em `assets/sounds/README.md` e em `sons.md`.
3. **Tela** (`LessonFlowScreen.tsx`): `onChange` de cloze e categorize emite
   `token_drop`; revelar fala emite `dialogue_line`; passar de etapa sem
   conferir emite `advance`. Teste de fluxo, ligado e desligado.
4. **Retorno** (`AnswerFeedbackCard.tsx`): com `rich`, expressão por
   `castExpressionFor({ kind: 'retorno', correct, celebrate })`, `size="md"`,
   entrada em 150 ms e a linha de incentivo.
5. **Incentivo** (`encouragement.ts`): função pura, variantes em rodízio
   determinístico, nunca punitiva; sequência e retomada no retorno, aula sem
   erro na conclusão (`habitLine`, que a tela passava nula).
6. **Pressão** na alternativa da múltipla escolha. Executado com o `usePressScale`
   das fichas da F2 (RN Animated, driver nativo) em vez de um hook novo em
   Reanimated: o vocabulário já existia e não roda no fio do JS (ADR, decisão 4).
7. **Conclusão**: `LessonSummary` cunha a medalha em toda conclusão com
   estrela (`mintOnComplete`); `UnitCompleteCelebration` cunha a medalha da
   unidade. Nenhum dos dois espera animação para liberar "Continuar".
8. Desempenho, simulador, revisão independente, gate, ADR, `STATUS.md`, PR.

## Fora

Fala em voz alta (pede `expo-speech`, módulo nativo novo: pendência do dono),
som para escolher o item do categorize (exigiria nova prop no renderizador da
F2), checkpoint e quiz antigo.
