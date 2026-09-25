# Aquecimento: medição indireta no simulador — 2026-09-25

**A pergunta, da FILA (achado 5 do StoreKit):** o iPhone esquentou com a
build `development`. A hipótese era o `StarfieldBackground`, que mantém de 90 a
120 animações infinitas.

**O que esta medição é e o que não é:** ela mede a **CPU do processo do app no
simulador**, e não a temperatura de um aparelho. É um indício que decide se
vale gastar a medição no iPhone, e não a substitui.

## Método

- **Simulador:** `A5FA5443-…` (iPhone 17, iOS 26.5), com o binário do E2E e o
  JS de desenvolvimento servido pelo Metro.
- **Tela:** a trilha "Matéria, energia e radiação", parada, sem nenhum toque.
  O `JourneyHomeScreen` monta o fundo com `starCount={120}`.
- **Amostragem:** `top -l 31 -s 2 -pid <pid> -stats pid,cpu`, ou seja, 30
  amostras válidas em 60 s, com a porcentagem de um núcleo do Mac.
- **Reduzir Movimento**, trocado com o app aberto:
  `xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool <true|false>`,
  seguido de `notifyutil -p com.apple.accessibility.reduce.motion.status`. O
  app escuta `reduceMotionChanged`
  (`src/ui/accessibility/useReducedMotionPreference.ts`).

## Resultado

| Reduzir Movimento | Média | Mediana | Mín. | Máx. |
|---|---|---|---|---|
| desligado | 94,4 % | 98,4 % | 61,4 % | 100,1 % |
| **ligado** | **0,4 %** | 0,4 % | 0,1 % | 0,4 % |
| desligado de novo | 95,3 % | 98,2 % | 51,1 % | 99,2 % |

A volta a ~95 % descarta coincidência: é a preferência que liga e desliga o
custo.

## A quem atribuir

- Na trilha, as únicas animações infinitas (`withRepeat`) que obedecem a
  Reduzir Movimento estão no `StarfieldBackground`: 120 estrelas piscando e as
  nebulosas à deriva. A outra que existe no app, o `PixelIllustration`, não
  aparece nesta tela.
- **Inferido:** o custo de ~1 núcleo com a tela parada é do fundo de estrelas.
  Não foi isolado desligando só o fundo. *Isolado na segunda passagem, abaixo.*

## Segunda passagem: isolamento e abas (2026-09-25, 17:54–18:06)

Item 9 do [prompt (6)](../../../docs/superpowers/handoffs/2026-09-25-radiant-prompt-de-continuidade-6.md).
Mesmo simulador, mesmo método de amostragem e o JS de
`feat/d4-decisoes-de-revisao` (`32b472b`), servido pelo Metro no Node
`v20.20.2`. A janela do Simulador não estava aberta, e o app rodou sem
exibição.

**Como cada condição foi montada:**
- As mudanças em `StarfieldBackground.tsx` foram só locais, uma por vez, e
  marcadas `MEDICAO-TEMP`.
- A cada mudança, o app foi encerrado e reaberto, para medir uma montagem
  limpa, e não o Fast Refresh.
- No fim, o arquivo foi restaurado e conferido com `shasum`
  (`2588b5f7…`, igual ao de antes). Nenhum código do app mudou.
- As abas foram trocadas por toque na barra de abas, que é fixa e não rola. O
  Maestro não foi usado, porque deixaria o driver dele rodando durante a
  amostragem.

| # | Condição | Média | Mediana | Mín. | Máx. |
|---|---|---|---|---|---|
| M1 | Como está: Estude, recém-aberta | 43,4 % | 43,7 % | 37,2 % | 45,2 % |
| M1b | Repetição do M1, mesmo processo | 40,6 % | 40,5 % | 37,0 % | 45,6 % |
| M1c | M1 com Reduzir Movimento ligado | 0,0 % | 0,0 % | 0,0 % | 0,1 % |
| M2 | Só as 3 nebulosas, 0 estrelas | 30,1 % | 29,6 % | 23,6 % | 34,7 % |
| M3 | Só as 120 estrelas, sem nebulosas | 39,3 % | 39,5 % | 34,1 % | 40,2 % |
| M3b | Uma estrela só, sem nebulosas | 28,1 % | 28,2 % | 24,1 % | 31,0 % |
| M4a | Perfil, depois de abrir na Estude | 65,8 % | 66,0 % | 56,2 % | 67,9 % |
| M4b | Estude, depois de passar pelo Perfil | 66,1 % | 66,2 % | 56,5 % | 69,2 % |

Cada linha tem 30 amostras em 60 s, da CPU do processo `Radiant` em
porcentagem de um núcleo.

**Montagem, medida por log.** Durante o M4, o log temporário escreveu no
Metro:
- `monta cr8d n=120` ao abrir na Estude;
- `monta 7t7c n=120` ao tocar no Perfil;
- nenhum `desmonta`, nem ao ir para o Perfil nem ao voltar.

A aba visitada **continua montada**, com o fundo e as 123 animações infinitas
dele. Isso bate com o padrão do `@react-navigation/bottom-tabs` 7, e o
`src/app/(tabs)/_layout.tsx` não o muda: não há `lazy`, `freezeOnBlur` nem
desmontagem.

### O que os números dizem

- **Medido:**
  - o custo não soma por animação: 30 % só com as nebulosas, 39 % só com as
    estrelas e 41–43 % com as duas;
  - **uma estrela só já custa 28 %**, dois terços do total;
  - com o segundo fundo montado, o custo sobe de ~42 % para ~66 %, tanto no
    Perfil quanto na Estude, depois de visitar o Perfil;
  - Reduzir Movimento continua zerando o custo (0,0 %).
- **Inferido:**
  - a maior parte do custo é um piso por fundo animado, e não o número de
    estrelas: enquanto houver uma animação infinita, o laço de quadros do
    Reanimated roda a cada quadro. As 120 estrelas somam ~11 pontos, e as
    nebulosas somam pouco sobre elas;
  - o piso é pago **por instância**, e não uma vez só, porque o segundo fundo
    acrescentou ~24 pontos. Isso não foi isolado com dois fundos de uma
    estrela só;
  - reduzir `starCount` ganharia pouco. O que corta o custo é **parar a
    animação da tela que não está em foco** e, na tela em foco, não manter
    animação infinita.

**A primeira passagem deu ~94 %, e esta, ~42 %, na mesma tela e no mesmo
simulador.** A causa não foi medida. A hipótese mais coerente com o M4 é que,
na primeira, o app já tinha passado por lições, checkpoint e as duas abas
durante a conferência da regra de vidas, e tinha mais fundos montados. Outra
diferença possível é que a janela do Simulador estivesse aberta. Por isso,
**compare condições dentro da mesma passagem**, e não números entre passagens.

## O que falta

- **No aparelho, com o dono:**
  - a mesma tela parada por 5 minutos, fora do carregador, com e sem Reduzir
    Movimento;
  - de preferência numa build `preview`, porque o modo de desenvolvimento
    infla o custo das animações;
  - medir a bateria gasta e a sensação térmica; o Xcode Instruments, se houver
    Mac ligado;
  - **anotar por quais abas e telas passou antes de medir**, porque cada fundo
    montado soma.
- **Não medido:**
  - telas empilhadas sobre as abas (lição, quiz, checkpoint, revisão), cada
    uma com o próprio fundo, enquanto as abas continuam montadas embaixo. Não
    foi medido para não alterar o progresso do simulador, que é decisão do
    dono;
  - dois fundos de uma estrela só, para confirmar que o piso é por instância;
  - build `preview` ou `production`, sem o modo de desenvolvimento.
- **Conserto, fora desta medição por decisão do dono em 2026-09-25:** item
  próprio na [FILA](../../../docs/FILA.md), achado 5 do StoreKit.
