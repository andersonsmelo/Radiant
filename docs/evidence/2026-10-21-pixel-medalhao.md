# Evidência — Pixel no Medalhão (plano 6), 2026-10-21

**Plano:** [Pixel no Medalhão](../superpowers/plans/2026-10-21-pixel-medalhao.md),
tarefa 4. **Branch:** `claude/trilha-medalhao-design`, commit `3fd2eb8`.
**Autoria:** Claude Opus 5.5 (`claude-opus-5-5`), como controlador da execução.
**Onde:** simulador iOS `Radiant E2E 17 Pro`, com o dev client que já tem o
Skia e o Metro servindo este worktree.

## Onde o Pixel aparece

Busquei de dois jeitos diferentes e comparei as listas.

- **Busca pelo nome do componente** (`PixelIllustration` ou `PixelHeroSplit`):
  - 9 telas: `CheckpointScreen`, `HybridLessonCharacter`, `WelcomeSlide`,
    `HomeScreen`, `JourneyHomeScreen`, `LessonSummary`, `QuizFeedback`,
    `ReviewScreen` e `RewardScreen`;
  - 2 componentes compartilhados: `PixelHeroSplit` e `SpeechBubble`.
- **Busca pelo import de `ui/characters`:**
  - as mesmas telas, menos `ReviewScreen` e `RewardScreen`, que chegam ao Pixel
    pelo `PixelHeroSplit`;
  - mais `WelcomeFlowScreen` e os dois arquivos de `pixel-mood`, que importam só
    tipos e expressões e não desenham o corpo.

Total: 9 telas e 2 componentes. Cada diferença entre as buscas está explicada
acima.

## O que foi visto no aparelho

| Tela | Tamanho | Pose | Rosto na tela | Captura |
| --- | --- | --- | --- | --- |
| Estude (`JourneyHomeScreen`, cartão de revisão) | `sm` | apontar (`guide`) | sim, centrado | [estude-sm](2026-10-21-pixel-medalhao/estude-sm.png), [ampliada](2026-10-21-pixel-medalhao/estude-sm-zoom.png) |
| Revisão (`ReviewScreen`, via `PixelHeroSplit`) | `md` | apontar | sim | [revisao](2026-10-21-pixel-medalhao/revisao.png) |
| Revisão concluída (`ReviewScreen`) | `md` | comemorar (`celebrate`) | sim | [revisao-concluida](2026-10-21-pixel-medalhao/revisao-concluida.png) |
| Boas-vindas, slide 1 (`WelcomeSlide`) | `lg` | apontar | sim | [boas-vindas](2026-10-21-pixel-medalhao/boas-vindas.png) |
| Boas-vindas, slides 2 e 3 | `md` | apontar | sim | [2](2026-10-21-pixel-medalhao/boas-vindas-2.png), [3](2026-10-21-pixel-medalhao/boas-vindas-3.png) |

**"Reduzir movimento".** Com a opção ligada no simulador, duas capturas da
revisão tiradas com 1,6 s de intervalo saíram idênticas byte a byte
([captura](2026-10-21-pixel-medalhao/reduzir-movimento.png)). Com a opção
desligada, o mesmo par de capturas sai diferente, porque o Pixel está
flutuando. A comparação ao contrário garante que o primeiro resultado não veio
de uma tela parada por outro motivo.

**O aceno, depois da correção da revisão final (commit `a294d97`).** A
revisão final do plano achou que o aceno animava `rotation`, `originX` e
`originY`, props que o `RNSVGGroup` nativo ignora: no aparelho, o braço ficaria
parado. A correção passou a animar a `matrix` nativa. Para conferir, respondi
certo a primeira pergunta do quiz (`radiantapp://quiz?lessonId=lesson-1`), o que
leva o Pixel do retorno ao estado `happy`, e tirei capturas com 0,6 s de
intervalo. A mão muda de lugar entre os quadros, então o braço está girando em
volta do ombro: [1](2026-10-21-pixel-medalhao/aceno-1.png),
[2](2026-10-21-pixel-medalhao/aceno-2.png), [3](2026-10-21-pixel-medalhao/aceno-3.png).

**Não vistas no aparelho, com o motivo:**
- `CheckpointScreen` e `RewardScreen` só desenham o Pixel quando há avaliação
  ou recompensa válida. Pelo deep link sem nó, as duas abrem no estado vazio,
  que não tem Pixel. Esse estado vazio sai no plano 5;
- `LessonSummary`, `QuizFeedback` e `HybridLessonCharacter` aparecem no meio de
  uma aula. Os testes de tela deles passam sem mudança no gate da tarefa 3;
- `HomeScreen` é a home antiga, inalcançável com `ENABLE_LEARNING_ROAD`.

A cabeça sozinha (`variant="head"`) ainda não tem tela que a use: a primeira é
a trilha do plano 2. A geometria dela foi conferida na revisão da tarefa 3. Nos
três tamanhos, o rosto cai dentro da tela a menos de 0,12 pt. Depois da
revisão final, a cabeça fica sempre na pose de repouso, sem aceno, em qualquer
estado, como na prancheta. A captura dela a 48 pt passa para a tarefa 7 do
plano 2.

## Para o dono olhar

Nenhum destes pontos foi corrigido aqui. Ou é do plano 5, ou fica para a
revisão final.

1. **A sombra do chão sobe junto com o Pixel.** Na prancheta, ela fica no chão
   e só pulsa. Aqui ela acompanha a flutuação de 10 unidades. Está registrado
   para a revisão final.
2. **O balão de fala corta uma letra.** A seta do `SpeechBubble` cobre o
   começo de uma linha: aparece "'tem por vez" e "'evolveu". O defeito é
   anterior a este plano. O Pixel e o balão saem da revisão no plano 5.
3. **O "Pular" das boas-vindas fica sob a barra de status** e não respondeu ao
   toque nas tentativas em 2026-10-21. Isso entra no plano 5, tarefa 3, que
   refaz as boas-vindas.
4. **Ícones de emoji nos links de Ajuda** (↗️ em "Política de Privacidade" e
   "Central de Suporte"). É uma violação da regra "sem emoji como ícone" e
   entra no plano 5, tarefa 9.
5. **Travamento visto uma vez e não reproduzido.** Um deep link para
   `licao-hibrida` disparado com o modal de boas-vindas aberto deixou os toques
   sem resposta. O app foi reiniciado, e o mesmo caminho sem o deep link
   funcionou. Não há indício de que o Pixel tenha causado o travamento.
