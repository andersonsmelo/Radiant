# FILA 64 — "Remover animações" escondia o cartão da revisão no Android — 2026-10-19

**Medido em:** 2026-10-19, das 09:23 às 09:41 (America/Bahia).
**Autoria:** Claude (Opus 5.5), na worktree `claude/fila64-cartao-sem-animacao`,
cortada de `origin/main` em `d7bd696`.
**Origem:** o achado 2 da FILA 54
([evidência](https://github.com/andersonsmelo/Radiant/blob/claude/fila54-g4-nativo/docs/evidence/2026-10-19-fila54-g4-android-g7.md),
seção 2, na [PR #54](https://github.com/andersonsmelo/Radiant/pull/54), ainda
aberta).

Marcação: **[medido]** foi executado e visto; **[código]** foi lido no código, sem
execução; **[não verificado]** ficou de fora, com o motivo.

## Resultado

1. **[medido] Causa confirmada.** O `useCardEnter` começava a animação nativa
   antes de saber a preferência de movimento. Quando a preferência chegava
   `true`, a animação era interrompida e o cartão recebia opacidade 1. Mas o
   retorno nativo da animação interrompida chegava **depois** e gravava 0 por
   cima. O cartão ficava invisível e fora da árvore de acessibilidade.
2. **[medido] Conserto no hook, sem tocar nas telas.** A entrada só começa
   quando a preferência é conhecida, e `reset` e `animateIn` não mudam mais de
   identidade quando ela chega.
3. **[medido] Teste visto falhando pelo motivo previsto**
   ([vermelho](2026-10-19-fila64-cartao-sem-animacao/vermelho.txt)). Verde
   depois do conserto.
4. **[medido] Prova nativa nas três telas que usam o hook**, com escala 0 e com
   escala 1. Só a revisão sofria do defeito; quiz e início já apareciam com a
   `main`.

## 1. A causa

**Reprodução [medido].** É a da FILA 54, com o código da `main` intacto:
- emulador `radiant-entrada-api34` com as três escalas de animação em 0;
- cartões da L1 vencidos;
- `radiantapp://review` e um toque em "Começar revisão".

A sessão mostrou "1/3" e "Sessão ativa", sem pergunta nem alternativas, 25 s
depois do toque ([captura](2026-10-19-fila64-cartao-sem-animacao/antes-revisao-escala0.png),
estado `antes` de [a11y-android.txt](2026-10-19-fila64-cartao-sem-animacao/a11y-android.txt)).

**Diagnóstico [medido].** Foi feito com logs temporários no hook, fora do commit
([diagnostico.txt](2026-10-19-fila64-cartao-sem-animacao/diagnostico.txt)). A
sequência lida, nesta ordem:
1. primeira renderização: a preferência ainda é desconhecida e o hook a lê como
   "sem redução". O `ReviewCard` chama `reset` e `animateIn`, e começa uma
   animação com o driver nativo;
2. a resposta do sistema chega `true`. Como `animateIn` dependia da preferência,
   ele muda de identidade, e o efeito do `ReviewCard` roda de novo: o
   `reset` interrompe a animação, e `animateIn` grava opacidade 1;
3. o lado nativo devolve o valor da animação interrompida, 0, **depois** do 1.
   O RN grava esse valor no JS e chama `node.update()`, que o leva para a view.

O log que fecha a causa: `retorno nativo grava value=0 (JS antes=1)`, seguido de
`+500ms opacity JS=0`. O trecho do RN que faz isso está em
`react-native/Libraries/Animated/animations/Animation.js`, linhas 139–167, no
RN 0.81.5.

**Por que só no Android com "Remover animações" [medido + código]:**
- com as escalas em 1, a preferência chega `false`. `animateIn` não muda de
  identidade, nada interrompe a animação, e ela termina em 1;
- no Android, o RN lê "reduzir movimento" das escalas do sistema, então a
  escala 0 é o que faz a resposta chegar `true`;
- no iOS com o argumento do E1, a preferência já é conhecida na primeira
  passada e nenhuma animação começa.

**[não verificado]** o iOS com "Reduzir movimento" ligado no sistema, sem o
argumento do E1, passa pelo mesmo caminho assíncrono. Não foi medido.

**Duas armadilhas da medição, registradas no diagnóstico:**
- um `addListener` na opacidade **esconde o defeito**: com ele, o cartão
  apareceu. Por isso as medições que contam não usam listener;
- a corrida depende da ordem de chegada do retorno nativo. Numa remontagem por
  Fast Refresh, o valor ficou em 1. Nas três aberturas do app do zero, o cartão
  sumiu.

## 2. O conserto

Em [`motion.ts`](../../radiant-app/src/ui/motion.ts), no `useCardEnter`:
- o hook lê `useReducedMotionPreferenceState`, que separa "sem redução" de
  "ainda não sei". É o que o próprio comentário de
  `useReducedMotionPreference` já pedia de quem agenda animação;
- `animateIn` chamado antes da resposta só anota o pedido. O hook o cumpre
  quando a resposta chega: com redução, opacidade 1 sem animação; sem redução,
  a animação de sempre;
- `reset` e `animateIn` não dependem mais da preferência, que é lida por
  referência. Assim, a chegada dela não faz o efeito de quem chama rodar de
  novo e interromper a entrada.

`ReviewCard`, `QuizQuestion` e `HomeScreen` não mudaram.

**Custo [código]:** sem redução, a entrada começa alguns milissegundos depois,
quando o sistema responde. Antes, ela começava antes da resposta.

## 3. O teste

[`useCardEnter.test.tsx`](../../radiant-app/src/ui/__tests__/useCardEnter.test.tsx)
monta o hook como os três consumidores e controla quando a preferência chega.

**Vermelho contra a `main` [medido]:** 3 de 4 falharam
([saída](2026-10-19-fila64-cartao-sem-animacao/vermelho.txt)):

| Caso | Por que falhou | Era o motivo previsto? |
| --- | --- | --- |
| Antes da resposta, nenhuma animação; com redução, cartão parado e visível | 2 chamadas de `Animated.timing` com `useNativeDriver: true` antes da resposta | Sim: é o passo 1 da causa |
| Sem redução, anima uma vez só, depois da resposta | As mesmas 2 chamadas antes da resposta | Sim: a mesma asserção. A segunda (2 chamadas no total) passaria contra a `main` e não prova nada sozinha |
| A chegada da preferência não refaz o `reset` de quem chamou | O efeito do chamador rodou 2 vezes | Sim: é o passo 2 da causa |
| Com o argumento do E1, visível na primeira passada | Passou | É guarda de regressão, não prova do conserto |

O teste não simula o retorno nativo atrasado, que o Jest não tem. Ele prova as
duas condições sem as quais o retorno não acontece: animação começada antes da
resposta, e interrompida pelo efeito do chamador.

**Verde [medido]:** 4 de 4, e 234 de 234 nas pastas `src/ui`,
`src/features/review`, `src/features/quiz` e `src/features/home`, com lint e
`tsc` limpos. O gate inteiro está no fim deste relatório.

## 4. A prova nativa

**Ambiente:**
- **Emulador:** `radiant-entrada-api34` (Android 14, API 34), no Mac;
- **App:** o dev client Debug 1.4.0 (3) da FILA 61, já instalado no emulador,
  sem mexer naquela worktree;
- **JS:** servido pelo Metro desta worktree (Node 20.20.2,
  `EXPO_NO_TYPESCRIPT_SETUP=1`). A `HomeScreen` é a tela legada, inalcançável
  com `ENABLE_LEARNING_ROAD=true`. Ela foi medida num Metro com
  `EXPO_PUBLIC_ENABLE_LEARNING_ROAD=false`;
- **Fixture:** cartões vencidos por
  [`preparar-revisao-devida-android.py`](2026-10-19-fila64-cartao-sem-animacao/preparar-revisao-devida-android.py),
  copiado da FILA 54 sem alteração
  ([saída](2026-10-19-fila64-cartao-sem-animacao/fixture-android.txt)).

**Como foi conduzido:** por `adb`, pelo
[`conduzir.sh`](2026-10-19-fila64-cartao-sem-animacao/conduzir.sh), e não pelo
Maestro. Com as animações ligadas, o Maestro no Android não avança (FILA 54).
Cada estado foi lido pela árvore do `maestro hierarchy`
([a11y-android.txt](2026-10-19-fila64-cartao-sem-animacao/a11y-android.txt)) e
fotografado. Os hashes estão em
[`screenshots.json`](2026-10-19-fila64-cartao-sem-animacao/screenshots.json).

| Tela (consumidor) | Escala | `main` | Com o conserto |
| --- | ---: | --- | --- |
| Revisão (`ReviewCard`) | 0 | **sem cartão** ([captura](2026-10-19-fila64-cartao-sem-animacao/antes-revisao-escala0.png)) | pergunta, 4 alternativas, Confirmar e Ajuda ([captura](2026-10-19-fila64-cartao-sem-animacao/revisao-escala0.png)); o item 2 também aparece depois de "Continuar" |
| Revisão (`ReviewCard`) | 1 | visível (FILA 54) | visível ([captura](2026-10-19-fila64-cartao-sem-animacao/revisao-escala1.png)) |
| Quiz (`QuizQuestion`), `radiantapp://quiz?mode=review&lessonIds=lesson-1` | 0 | visível (só árvore) | visível ([captura](2026-10-19-fila64-cartao-sem-animacao/quiz-escala0.png)) |
| Quiz (`QuizQuestion`) | 1 | não medido | visível ([captura](2026-10-19-fila64-cartao-sem-animacao/quiz-escala1.png)) |
| Início legado (`HomeScreen`), "Revisões pendentes" | 0 | visível (só árvore) | visível ([captura](2026-10-19-fila64-cartao-sem-animacao/inicio-escala0.png)) |
| Início legado (`HomeScreen`) | 1 | não medido | visível ([captura](2026-10-19-fila64-cartao-sem-animacao/inicio-escala1.png)) |

**Por que quiz e início escapavam [não verificado]:** a hipótese é que essas
telas voltam a chamar `animateIn` depois que o retorno nativo já chegou.
- `QuizQuestion`: o efeito depende do objeto inteiro devolvido pelo hook;
- `HomeScreen`: o efeito depende também de `loadData`.

Não foi medido.

**Ao fim:** as escalas voltaram a 1. Antes, `animator_duration_scale` estava sem
valor gravado (`null`), que o Android trata como 1. O `adb reverse` foi
removido e o emulador, desligado. O simulador iOS `5FD8C926` não foi tocado.

## 5. Achado sem conserto

**[código]** O `useFadeInUp`, no mesmo arquivo, tem o mesmo padrão:
- começa com opacidade 0;
- `animateIn` depende do booleano da preferência e anima com o driver nativo.

Nos dois usos medidos aqui, com escala 0 e a `main`, nada sumiu: o herói do
início da revisão e o "Meta do dia concluída" do início legado. O resumo da
revisão (`state === 'finished'`) não foi medido. Fica como próximo item,
pequeno: aplicar a mesma espera pela preferência e medir o resumo com escala 0.

## Gate

O resultado do `EXPO_NO_DOTENV=1 npm run quality` e do `loop validate` deste run
está no corpo da PR.
