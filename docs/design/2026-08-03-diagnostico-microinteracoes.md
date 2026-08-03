# Diagnóstico de microinterações — 2026-08-03

> **O que este documento faz:** pontua a microinteração central do Radiant —
> responder uma questão — contra o diagnóstico de oito linhas do framework de
> Dan Saffer, registra o que foi corrigido nesta data e deixa nomeado o que
> continua aberto **e por que cada item aberto não é trabalho de engenharia**.
>
> Complementa a crítica de design de
> [2026-07-28](../../.impeccable/critique/2026-07-28T12-42-20Z__radiant-app.md)
> (17/40), que mediu o app inteiro por heurísticas de Nielsen. Aqui o recorte é
> mais estreito e mais fundo: uma interação, oito perguntas.

## Por que este recorte

A interação de responder uma questão é a mais frequente do produto e a única com
carga emocional dos dois sinais — acerto e punição. Se ela parecer genérica, o
app inteiro parece, independentemente do polimento das telas ao redor.

## Placar

| # | Linha do diagnóstico | Antes | Depois |
| --- | --- | :---: | :---: |
| 1 | Gatilho claro e descobrível | passa | passa |
| 2 | Gatilho mostra o estado atual | passa | passa |
| 3 | Regras simples e previsíveis | **falha** | **falha** |
| 4 | Feedback imediato (<100ms) | passa | passa |
| 5 | Feedback à altura do evento | **falha** | **passa** |
| 6 | A interação evolui com o tempo | **falha** | **falha** |
| 7 | Livre de modos desnecessários | passa | passa |
| 8 | Novato entende sem ajuda | **falha** | **falha** |
| | **Total** | **4/8 → 5/10** | **5/8 → 6/10** |

A banda de 5–6 do framework descreve o estado anterior com precisão
desconfortável: *"funciona, mas tem cara genérica — o feedback existe, porém é
uniforme"*. Era literal.

## O que foi corrigido: a linha 5

**O único evento punitivo do app passava em branco.** `hapticError()` disparava
idêntico tendo ou não custado uma vida — inclusive no **modo revisão, onde nada
é cobrado** —, e a perda em si não produzia sinal nenhum: o coração trocava de
❤️ para 🤍 e o app seguia.

Três peças, todas em `6b3dcc3`..`fde484e`:

- **`hapticLifeLost`** (`Heavy`), separado do `hapticError` (`Warning`).
  Disparado quando a escrita da vida resolve, e só se o contador de fato caiu.
  A sequência "errou" → "e custou" é a encenação; os dois no mesmo tick viram
  uma vibração só.
- **`useLossPulse`** na camada de motion (`1 → 1.35 → 1`, `micro` na ida e `ui`
  na volta). Movimento próprio em vez de reuso: `useScalePop` é chegada e
  `useShakeError` é o vocabulário de **erro** — e errar não é perder.
- **O HUD** anima só o coração que esvaziou, solta a marca quando as vidas
  voltam, e sob reduced motion cai para o rótulo de acessibilidade.

Fora da linha 5, na mesma frente: as quatro superfícies animadas da galáxia
passaram a respeitar reduced motion (`94d7e4c`), e o retorno tátil chegou às
ações de ênfase via `AppButton` (`6b3dcc3`).

## O que continua aberto — e por que não é engenharia

**Linha 3 — regras previsíveis.** Tocar uma alternativa já submete e já custa
uma vida, sem confirmar e sem desfazer. O conserto conhecido é separar seleção
de commit com um botão "Verificar", que é o padrão do gênero. **Isso muda o
modelo do quiz**, e portanto é decisão de produto: altera ritmo, número de
toques por questão e a sensação de risco. Não deve ser resolvido numa onda de
polimento.

**Linha 8 — novato entende sozinho.** Vidas nunca são explicadas em lugar
nenhum do app — verificado por varredura em `src/ui/copy/`. A pessoa perde a
primeira vida sem nunca ter sido informada de que vidas existem. É trabalho de
**conteúdo**, e depende de decidir onde explicar sem transformar a abertura num
tutorial.

**Linha 6 — evolui com o tempo.** Não há *long loop*: a interação é idêntica no
primeiro dia e no centésimo. Fechar isso é **feature nova** (redução
progressiva de andaimes), não ajuste.

## A pergunta de personalidade, que a pesquisa externa devolveu

O posicionamento declarado é "Duolingo para radiologia", e a pesquisa de
referência mostra que a personalidade daquele produto vem de **personagem como
sistema de estados** — dez personagens, vinte e tantos formatos de boca, partes
modulares combinadas por máquina de estados, reações ligadas ao progresso.

O Pixel tem **seis estados no código, um PNG no disco e um rosto desenhado por
cima proceduralmente**. A crítica de 2026-07-28 já havia feito a pergunta e ela
continua sem resposta:

> quanto do orçamento de "polimento Duolingo" deveria ir para animação **antes**
> de existirem seis desenhos reais do mascote?

Enquanto a resposta for "nenhum", mais curva de easing sobre um asset plano
produz movimento, não personalidade. Isto é decisão de investimento em arte,
provavelmente externa, e está fora do que engenharia fecha sozinha.

## Restrições que qualquer trabalho nesta frente herda

- **A regra R4 do `visual:qa:strict`** reprova qualquer import de
  `react-native-reanimated` fora de `src/ui/motion.ts`. Animação nova mora na
  camada, não no componente — e a regra casa **texto**, então ela também reprova
  comentários que citem o literal e arquivos de teste que precisem espionar a
  API. *Follow-up sugerido: isentar `*.test.*`.*
- **Testar supressão de animação pelo estilo renderizado não funciona.** Sob o
  mock do Reanimated a escrita em shared value não chega ao `toJSON()`; o que se
  lê é o valor inicial do `useSharedValue`, idêntico com o gate ligado ou
  desligado. Afirme sobre a chamada suprimida (espião em `withRepeat`) e inclua
  a contraprova no ramo oposto.
- **Feedback tátil é sinal, não cobertura.** O critério em vigor é ênfase:
  variantes `primary` e `galaxy` do `AppButton` vibram; `secondary` e `ghost`
  não. Saturar o sinal o destrói.

## Como reproduzir o placar

O diagnóstico é as oito perguntas do framework aplicadas a
`src/features/quiz/` — não há script. As evidências de cada linha:

```sh
# linha 2: estados visuais da alternativa
grep -n "isSelectedOption\|isCorrectHighlight\|accessibilityState" \
  radiant-app/src/features/quiz/components/QuizQuestion.tsx

# linha 5: os dois hápticos, agora distintos
grep -rn "hapticError\|hapticLifeLost" radiant-app/src/features/quiz/hooks/useQuiz.ts

# linha 7: o modo é visível no header
grep -n "Quiz de Revisão" radiant-app/src/features/quiz/screens/QuizScreen.tsx

# linha 8: a ausência que sustenta a falha
grep -rn "vida\|coração" radiant-app/src/ui/copy/
```
