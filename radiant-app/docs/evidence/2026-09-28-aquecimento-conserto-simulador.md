# Aquecimento: o conserto do fundo fora de foco, no simulador — 2026-09-28

**A pergunta, do item 12 da [FILA](../../../docs/FILA.md):** depois de o
`StarfieldBackground` parar a animação quando a tela sai de foco, quanto do
custo medido em 2026-09-25 some? A medição anterior está em
[2026-09-25-aquecimento-simulador.md](2026-09-25-aquecimento-simulador.md).

**O que esta medição é e o que não é:** ela mede a **CPU do processo do app no
simulador**, e não a temperatura de um aparelho. Os números valem só como
comparação **dentro desta passagem**: a mesma tela já deu ~94 % numa passagem e
~42 % em outra.

## O conserto

- `src/ui/components/StarfieldBackground.tsx`: o fundo lê o foco da tela pelo
  `NavigationContext` e, fora de foco, faz o mesmo que já fazia com Reduzir
  Movimento: a estrela fica no brilho de repouso, e a nebulosa, sem deriva.
  Fora de um navegador, o fundo anima como antes.
- O conserto não usa o `useIsFocused`, porque ele lança erro fora de um
  navegador, e vários testes de tela renderizam sem um.
- O conserto também não usa o `freezeOnBlur`, porque ele não alcança a aba
  coberta por uma tela empilhada. Inferido, sem medir: ele congela só as
  renderizações do React, e as animações do Reanimated rodam fora delas.

## O teste, visto falhando

`src/ui/components/StarfieldBackground.test.tsx`, com o Reanimated real do
Jest. Ele lê o estilo animado de cada estrela e nebulosa ao longo de ~12 s de
relógio falso e conta os quadros distintos.

- **Vermelho contra o código de antes** (`2049a63`, `StarfieldBackground.tsx`
  com `shasum` `2588b5f7…`, o mesmo de 2026-09-25):
  - falharam "fora de foco, o fundo não anima com o passar do tempo" e "a
    animação que já rodava para quando a tela perde o foco", os dois com
    `Expected: 1`, `Received: 5`;
  - os quatro casos de validade passaram: em foco anima; ao voltar o foco
    recomeça; fora de um navegador anima; e com Reduzir Movimento fica parado.
- **Uma primeira versão do teste estava cega.** Ela lia o invólucro
  `Animated.View`, que não carrega o estilo animado, e o `getAnimatedStyle`
  devolvia `{}` sempre. Quem denunciou foi o caso de validade "em foco, o fundo
  anima", que falhou contra um código que sabidamente anima.
  - O teste final lê o `jestAnimatedStyle.value` do nó nativo, que é o que o
    `getAnimatedStyle` do Reanimated lê. Antes de contar os quadros, ele
    confere que leu 15 nós (3 nebulosas e 12 estrelas).
  - Ele não importa o Reanimated. Com o import, a regra R4 do
    `visual:qa:strict`, que é textual e também varre os testes, reprovou o
    gate. O vermelho foi repetido com esta versão final, com o mesmo
    resultado.
- **Verde depois do conserto:** 6 de 6.
- **Duas injeções de defeito**, cada uma revertida e conferida com `shasum`:
  - sem o ouvinte de `blur`, só o caso "a animação que já rodava para" falhou
    (`Received: 5`);
  - sem o ouvinte de `focus`, só o caso "ao voltar o foco, a animação
    recomeça" falhou (`Expected: > 1`, `Received: 1`).

## Método da medição

- **Quando e onde:** 2026-09-28, das 14:31 às 14:47, no simulador
  `E3C547AE-…` (iPhone 17, iOS 26.5), com o cliente de desenvolvimento já
  instalado nele.
- **O código:** o JS servido pelo Metro, no Node `v20.20.2`, a partir da
  árvore de `feat/d4-decisoes-de-revisao` (`2049a63`). Durante o "antes", o
  `StarfieldBackground.tsx` estava intacto. Durante o "depois", ele já tinha o
  conserto (`shasum` `e4ca8cc4…`).
- **As variáveis:** as do `scripts/start-ios-v2.sh`, conferidas pelo
  `check-env-precedence.mjs`.
- **A janela do Simulador não estava aberta.** Os toques e as capturas foram
  feitos sem exibição.
- **Montagem limpa:** entre o "antes" e o "depois", o app foi encerrado e
  reaberto.
- **Amostragem:** `top -l 31 -s 2 -pid <pid> -stats pid,cpu`, ou seja, 30
  amostras válidas em 60 s, em porcentagem de um núcleo do Mac. É a mesma de
  2026-09-25.
- **As condições:**
  - **M1:** a Estude recém-aberta;
  - **M4:** o Perfil, depois de passar pela Estude;
  - **M5:** a tela da assinatura empilhada sobre as abas, aberta pelo
    "Gerenciar" do Perfil. Ela não tem fundo animado e cobre a tela inteira.

## Resultado

| # | Condição | Média | Mediana | Mín. | Máx. |
|---|---|---|---|---|---|
| M1 | Estude recém-aberta, **antes** | 39,4 % | 39,5 % | 30,3 % | 44,0 % |
| M4 | Perfil depois da Estude, **antes** | 63,6 % | 63,8 % | 54,2 % | 65,7 % |
| M5 | Assinatura sobre as abas, **antes** | 65,3 % | 65,5 % | 54,9 % | 66,5 % |
| M1 | Estude recém-aberta, **depois** | 38,9 % | 39,2 % | 32,7 % | 40,9 % |
| M4 | Perfil depois da Estude, **depois** | 43,9 % | 43,8 % | 34,1 % | 50,8 % |
| M5 | Assinatura sobre as abas, **depois** | 31,4 % | 31,5 % | 23,9 % | 38,3 % |
| M5 | Idem, com Reduzir Movimento ligado | 0,1 % | 0,0 % | 0,0 % | 2,5 % |
| M5 | Idem, Reduzir Movimento desligado de novo | 31,4 % | 31,2 % | 21,0 % | 38,0 % |

**A volta ao foco:**
- Ao fechar a assinatura, o Perfil voltou a animar: duas capturas com 2 s de
  intervalo diferiram em 1836 pixels, e a CPU foi a 43,0 % (10 amostras).
- Na Estude, duas capturas diferiram em 863 pixels numa faixa de céu sem
  texto.

### O que os números dizem

- **Medido:**
  - o fundo da aba escondida parou de somar. O M4 caiu de 63,6 % para 43,9 %,
    e o M5, de 65,3 % para 31,4 %;
  - a tela **em foco** custa o mesmo de antes (M1: 39,4 % e 38,9 %). O
    conserto não mexe nela;
  - com as duas abas cobertas, sobra 31,4 %, e esse resto também obedece a
    Reduzir Movimento: foi a 0,1 % com a preferência ligada e voltou a 31,4 %
    ao desligar.
- **Inferido na hora, e confirmado pela segunda passagem, abaixo:** o resto
  é o ícone de sequência (`StreakIcon`, em `src/ui/components/HudIcons.tsx`).
  Ele "respira" em laço infinito com `useBreathingScale`
  (`src/ui/motion.ts`), obedece a Reduzir Movimento e não sabia do foco.
  - **Corrigido na segunda passagem:** a primeira versão desta nota dizia
    que o ícone estava só no HUD da Estude. Ele também está no Perfil, que
    monta as seções de Missões e de Progresso, e cada uma usa o `StreakIcon`.
  - Os 31 % batem com o piso de uma animação infinita só, medido em
    2026-09-25 (uma estrela, 28 %).
  - O conserto disso ficou fora da primeira passagem, que se limitou ao
    fundo. Ele virou o item 33 e foi feito na segunda.

## Progresso do simulador

- Entre o fim do M5 "antes" e o fim do M5 "depois", mudaram só
  `@radiant:subscription_v1` e a telemetria (`telemetry.daily.v1` e
  `telemetry.events.v1`).
- **Não verificado nesta passagem:** `@radiant:journey_progress_v1` foi
  regravado às 14:33 e às 14:39, os dois minutos em que o Perfil foi aberto.
  Não havia cópia anterior ao M4 "antes", então não se sabe se o conteúdo
  mudou ou só foi reescrito igual. Na segunda passagem, que abriu o Perfil
  duas vezes, o arquivo terminou byte-idêntico ao do início.
- Reduzir Movimento terminou desligado, conferido por
  `defaults read com.apple.Accessibility ReduceMotionEnabled`, que devolveu
  `0`.
- O app foi encerrado, o simulador desligado e o Metro parado.

## Segunda passagem: o ícone de sequência (item 33), 15:28–15:40

**O conserto:**
- O `useScreenFocused` saiu do `StarfieldBackground.tsx` e foi para
  `src/ui/useScreenFocused.ts`.
- O `useBreathingScale` passou a usá-lo: fora de foco, o ícone fica na
  escala 1, como já ficava com Reduzir Movimento.
- Isso cobre todo `StreakIcon`: o do HUD (Estude, checkpoint, revisão e
  recompensa) e os do Perfil (Missões e Progresso).

**O teste, visto falhando:** `src/ui/components/StreakIcon.test.tsx`, sobre o
`StreakIcon` real e com o mesmo método de leitura do fundo.
- Contra o código de antes (`cbb3025`, `motion.ts` com `shasum`
  `486468f9…`), falharam "fora de foco, o ícone não respira" e "a respiração
  que já rodava para quando a tela perde o foco", os dois com `Expected: 1`,
  `Received: 6`. Os quatro casos de validade passaram.
- Depois do conserto, os 6 passaram, e os 6 do fundo continuaram passando sem
  mudança.
- **Injeção no hook compartilhado:** sem o ouvinte de `blur`, falharam
  exatamente os dois casos "perder o foco", o do ícone (`Received: 6`) e o do
  fundo (`Received: 5`). O arquivo foi restaurado e conferido com `shasum`.

**A medição:** mesmo simulador, método e condições da primeira passagem. O
"antes" rodou com o `motion.ts` intacto, e o "depois", com o conserto
(`shasum` `af9d4f43…`), com o app encerrado e reaberto entre os dois.

| # | Condição | Média | Mediana | Mín. | Máx. |
|---|---|---|---|---|---|
| M1 | Estude recém-aberta, **antes** | 38,7 % | 39,0 % | 30,9 % | 40,4 % |
| M4 | Perfil depois da Estude, **antes** | 42,2 % | 42,6 % | 36,5 % | 44,1 % |
| M5 | Assinatura sobre as abas, **antes** | 30,7 % | 31,4 % | 22,4 % | 36,4 % |
| M1 | Estude recém-aberta, **depois** | 38,5 % | 39,0 % | 32,0 % | 40,1 % |
| M4 | Perfil depois da Estude, **depois** | 41,2 % | 41,5 % | 34,3 % | 42,7 % |
| M5 | Assinatura sobre as abas, **depois** | **0,1 %** | 0,0 % | 0,0 % | 1,6 % |

- **Medido:**
  - com as abas cobertas, o custo zerou, de 30,7 % para 0,1 %. O resto da
    primeira passagem era o ícone;
  - as telas em foco custam o mesmo;
  - o M4 antes desta passagem (42,2 %) reproduz o M4 depois da primeira
    (43,9 %).
- **A volta ao foco:** ao fechar a assinatura e voltar à Estude, seis
  capturas da chama do HUD, com ~0,3 s de intervalo, contaram entre 770 e 886
  pixels alaranjados. A razão de ~1,15 bate com a escala de 1 a 1,08, que
  daria ~1,17 de área. O ícone voltou a respirar.
- **O progresso:** entre o início e o fim da passagem, mudaram só
  `@radiant:subscription_v1` e a telemetria (`telemetry.daily.v1` e
  `telemetry.events.v1`). As chaves de progresso ficaram byte-idênticas.
- Reduzir Movimento terminou desligado (`0`), e o simulador, desligado.

## O que falta

- **No aparelho,** o item 14, com o dono. Ele não precisa esperar outra coisa.
- ~~O ícone de sequência fora de foco~~: feito na segunda passagem, acima.
- **Outras animações infinitas** continuam sem saber do foco: as do
  `PixelIllustration`, que aparecem em telas de primeiro plano (checkpoint,
  feedback do quiz, resumo da lição). Não foram medidas.
- **A tela em foco** continua com animação infinita, ~39 % no simulador.
  Deixar de animar a tela visível em laço infinito é decisão de design do dono.
- **Não medido:**
  - as telas empilhadas que têm fundo próprio (lição, quiz, checkpoint,
    revisão), porque abri-las altera o progresso do simulador;
  - build `preview` ou `production`.
