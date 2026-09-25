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
  Não foi isolado desligando só o fundo.

## O que falta

- **No aparelho, com o dono:**
  - a mesma tela parada por 5 minutos, fora do carregador, com e sem Reduzir
    Movimento;
  - de preferência numa build `preview`, porque o modo de desenvolvimento
    infla o custo das animações;
  - medir a bateria gasta e a sensação térmica; o Xcode Instruments, se houver
    Mac ligado.
- **Isolar o fundo:** medir com `starCount` reduzido ou com o fundo desligado,
  para separar estrelas de nebulosas.
- **Não medido:** a hipótese de que abas visitadas continuam montadas e
  somam animações.
