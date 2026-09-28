# Relatório — conserto do aquecimento (FILA, 12) — 2026-09-28

**Frente:** o item 12 do
[prompt (13)](2026-09-28-radiant-prompt-de-continuidade-13.md): parar o fundo
animado fora de foco e medir antes e depois.

**Condição de pronto, combinada com o dono antes do run:**
1. teste vermelho pelo defeito específico;
2. asserções de validade no mesmo teste;
3. código só no `StarfieldBackground.tsx` e no teste novo;
4. M1 e M4 antes e depois, na mesma passagem;
5. o gate inteiro, o Loop e o push;
6. a documentação.

A tela empilhada (M5) entrou porque existe uma que não grava progresso: a da
assinatura.

## O que mudou

- `radiant-app/src/ui/components/StarfieldBackground.tsx`:
  - o fundo lê o foco da tela pelo `NavigationContext` e, fora de foco, fica
    como já ficava com Reduzir Movimento;
  - fora de um navegador, anima como antes;
  - não usa o `useIsFocused`, porque ele lança erro fora de um navegador.
- `radiant-app/src/ui/components/StarfieldBackground.test.tsx`, novo, com 6
  testes:
  - dois do defeito: fora de foco não anima; perder o foco para a animação que
    já rodava;
  - quatro de validade: em foco anima; ao voltar o foco recomeça; fora de um
    navegador anima; e com Reduzir Movimento fica parado.
- A evidência nova, a FILA, o STATUS, os dois arquivos de histórico e o
  prompt (14).

## Medido

- **O vermelho,** contra o código de antes (`StarfieldBackground.tsx` com
  `shasum` `2588b5f7…`):
  - os dois testes do defeito falharam com `Expected: 1`, `Received: 5`
    quadros distintos;
  - os quatro de validade passaram;
  - o vermelho foi repetido com a versão final do teste, com o mesmo
    resultado.
- **Duas injeções de defeito,** cada uma revertida e conferida com `shasum`:
  - sem o ouvinte de `blur`, só o caso "perder o foco" falhou;
  - sem o ouvinte de `focus`, só o caso "voltar o foco" falhou.
- **O simulador, na mesma passagem,** em porcentagem de um núcleo, com 30
  amostras em 60 s cada
  ([evidência](../../../radiant-app/docs/evidence/2026-09-28-aquecimento-conserto-simulador.md)):

  | | Antes | Depois |
  |---|---|---|
  | M1, Estude em foco | 39,4 % | 38,9 % |
  | M4, Perfil depois da Estude | 63,6 % | 43,9 % |
  | M5, assinatura empilhada sobre as abas | 65,3 % | 31,4 % |

  - Com Reduzir Movimento ligado, o M5 depois foi a 0,1 %, e voltou a 31,4 %
    ao desligar.
  - Ao voltar o foco, o Perfil e a Estude voltaram a animar: as capturas
    diferiram, e a CPU voltou ao nível da tela em foco.
- **O gate** `EXPO_NO_DOTENV=1 npm run quality`, às 14:52, no Node
  `v20.20.2`:
  - exit 0, **154 suítes / 1473 testes**. Antes eram 153 / 1467; a diferença
    é a suíte nova, com 6 testes;
  - lint com 0 erros e 26 avisos, os mesmos de antes;
  - visual QA sem regressão.
- **A primeira rodada do gate reprovou** na regra R4 do `visual:qa:strict`,
  que é textual e varre também os testes. O teste importava o
  `getAnimatedStyle` do Reanimated. Ele passou a ler o mesmo valor do nó
  nativo, e a regra não foi contornada nem teve a política alterada.

## Inferido, sem verificar

- **O resto do M5 (31 %) é o ícone de sequência do HUD da Estude.** O
  `StreakIcon` respira em laço infinito com `useBreathingScale` e não sabe do
  foco. É a única outra animação infinita nas duas abas; o resto zera com
  Reduzir Movimento; e o valor bate com o piso de uma animação só (28 %).
  Não foi isolado, porque o arquivo está fora do escopo do run. Virou o
  **item 33** da FILA.
- O `freezeOnBlur` não teria parado as animações do Reanimated, que rodam fora
  das renderizações do React. Isso não foi medido.

## Não verificado

- O aparelho, que é o item 14, com o dono.
- As telas empilhadas com fundo próprio (lição, quiz, checkpoint, revisão),
  porque abri-las altera o progresso do simulador.
- Se o conteúdo de `@radiant:journey_progress_v1` mudou. A chave foi regravada
  às 14:33 e às 14:39, nos dois minutos em que o Perfil foi aberto, e não havia
  cópia anterior.
- Build `preview` ou `production`.

## Fica para o dono

- **A tela em foco** ainda anima em laço infinito, com ~39 % no simulador.
  Deixar de animá-la é decisão de design.
- **A ordem:** o agente recomenda o 33 antes do 14, para que a medição no
  aparelho já pegue as duas pausas.
