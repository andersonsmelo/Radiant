# Relatório — o ícone de sequência fora de foco (FILA, 33) — 2026-09-28

**Frente:** o item 33, aberto pelo
[conserto do fundo](2026-09-28-radiant-aquecimento-relatorio.md) (item 12) e
feito na mesma conversa, a pedido do dono.

**Condição de pronto, combinada com o dono antes do run:**
1. teste vermelho sobre o `StreakIcon` real;
2. asserções de validade no mesmo teste, e os 6 testes do fundo passando sem
   mudança;
3. código só em `motion.ts`, `StarfieldBackground.tsx`, no módulo novo e no
   teste novo;
4. M1, M4 e M5 antes e depois, na mesma passagem, com o M5 perto de zero;
5. o gate inteiro, o Loop e o push;
6. a documentação.

## O que mudou

- `radiant-app/src/ui/useScreenFocused.ts`, novo: o hook de foco, que saiu de
  dentro do `StarfieldBackground.tsx`.
- `radiant-app/src/ui/motion.ts`: o `useBreathingScale` fica na escala 1 fora
  de foco, como já ficava com Reduzir Movimento. Com isso param todos os
  `StreakIcon`:
  - o do HUD, na Estude, no checkpoint, na revisão e na recompensa;
  - os do Perfil, nas seções de Missões e de Progresso.
- `radiant-app/src/ui/components/StarfieldBackground.tsx`: passa a importar o
  hook, sem outra mudança.
- `radiant-app/src/ui/components/StreakIcon.test.tsx`, novo, com 6 testes no
  mesmo formato dos do fundo.
- A evidência, com a segunda passagem e a correção da atribuição; o relatório
  do 12, com a mesma correção; a FILA, o STATUS e os dois arquivos de
  histórico; e o prompt (15).

## Medido

- **O vermelho,** contra o código de antes (`motion.ts` com `shasum`
  `486468f9…`): os dois testes do defeito falharam com `Received: 6` quadros
  distintos, e os quatro de validade passaram.
- **O verde:** 6 de 6 no ícone, e os 6 do fundo continuaram passando.
- **Injeção no hook compartilhado:** sem o ouvinte de `blur`, falharam só os
  dois casos "perder o foco", o do ícone e o do fundo.
- **O simulador, na mesma passagem**
  ([evidência](../../../radiant-app/docs/evidence/2026-09-28-aquecimento-conserto-simulador.md)):

  | | Antes | Depois |
  |---|---|---|
  | M1, Estude em foco | 38,7 % | 38,5 % |
  | M4, Perfil depois da Estude | 42,2 % | 41,2 % |
  | M5, assinatura sobre as abas | 30,7 % | **0,1 %** |

  - Ao voltar à Estude, a chama do HUD voltou a respirar: seis capturas
    variaram entre 770 e 886 pixels, o que bate com a escala de 1 a 1,08.
  - As chaves de progresso ficaram byte-idênticas do início ao fim da
    passagem.
- **O gate** `EXPO_NO_DOTENV=1 npm run quality`, às 15:40, no Node
  `v20.20.2`:
  - exit 0, **155 suítes / 1479 testes**, a suíte nova e seus 6 testes a mais;
  - lint com 0 erros e 26 avisos, os mesmos de antes;
  - visual QA sem regressão.

## Correção de uma afirmação minha

O relatório do 12 atribuía o resto do M5 ao ícone "do HUD da Estude". O Perfil
também tem o ícone, nas seções de Missões e de Progresso. A correção está no
relatório do 12 e na evidência.

## Não verificado

- O aparelho, que é o item 14, com o dono. Ele não espera mais nada.
- As outras animações infinitas, do `PixelIllustration`, que aparecem em telas
  de primeiro plano (checkpoint, feedback do quiz, resumo da lição).
- Build `preview` ou `production`.

## Fica para o dono

- **O 14:** no simulador, a tela em foco custa ~39 %, e as escondidas, quase
  nada. O aparelho diz se isso ainda esquenta.
- **A tela em foco:** deixar de animá-la em laço infinito é decisão de design.
