# Correção do achado 1 da revisão final: selo sem toque (2026-11-21)

Esta correção foi feita por IA, não por um profissional de radiologia.

## O achado

[Revisão final](revisoes/final.md), achado 1. Na M18.01 `i3` ("toque no osso do quadril, do lado esquerdo do paciente"), o selo numerado do alvo certo caía sobre o osso do quadril do lado direito, que não é região do item. Medido antes da correção: o selo cobria 85% dele em 280 pt, 67% em 320 pt e 49% em 358 pt. Como a E13 fazia o toque no selo selecionar o alvo dono dele, quem errava o lado e tocava o quadril direito tocava o selo e recebia "certo".

## A decisão

Do controlador, por delegação do dono em 2026-11-20. **Revoga a E13.** O selo numerado de tocar e de caça ao risco, e o selo do número de rotular, passam a ser `View` com `pointerEvents="none"`, sem tratador de toque e fora da árvore de acessibilidade como alvo. O toque atravessa para o que estiver embaixo: uma região ou ponto do item, se houver, ou nada. Não mudaram: a área de toque de cada alvo (44 pt), a posição dos selos, e os rótulos, a ordem e o estado de acessibilidade dos alvos.

## Por que o distrator do quadril direito não serviu

A saída pelo conteúdo seria declarar o quadril direito como região errada do item, para o toque nele ser contado como erro. Os dois quadris ficam a 33 pt um do outro, menos que os 44 pt da régua de toque: as áreas de toque se sobreporiam e o toque num deles seria ambíguo. Por isso a correção é no app.

## O teste vermelho

`HotspotStepRenderer.test.tsx`, "M18.01 i3: o toque num ponto do selo do alvo certo, fora da área de toque dele, não seleciona o alvo certo". Usa as quatro regiões reais da M18.01 `i3` num quadro de 280 x 210 pt e refaz o acerto do toque sobre a árvore renderizada (o Jest não faz isso): a última irmã que contém o ponto vence, e selo com `pointerEvents="none"` ou sem tratador não conta. Antes da correção falhou com `Expected: not "r3"`: o ponto do selo fora da área de toque do alvo 3 selecionava o alvo 3. Execução guardada em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/vermelho-selo-toque.txt` (2 falhas, 8 passes no arquivo). A asserção de validade (selo dentro do quadro e com ao menos um ponto fora da área do alvo) acompanha a de diferença.

## Testes alterados

Os da E13 que afirmavam o contrário foram substituídos, nos três renderers: tocar no selo não seleciona nem alterna o dono, o selo tem `pointerEvents="none"`, sem `onClick` e fora do acessível; os alvos (regiões e pontos) seguem tocáveis, e a lista e a contagem de alvos por rótulo continuam as mesmas.

## Números (Node 20, 2026-11-21)

- `npx jest src/features/lesson-flow src/ui/diagrams src/features/student-checkpoints`: 66 suítes, 1609 testes, todos verdes.
- `npx tsc --noEmit`: 0. `npx eslint` nos seis arquivos tocados: 0.
- `npm run visual:qa:strict`: passou, 0 regressões. `node scripts/qa/docs-contract.mjs`: passou.
- Não medido: o gate completo `npm run quality`, e o toque real num aparelho ou simulador.
