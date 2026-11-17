# Tarefa 4: classificar em grupos

Medido em 2026-11-16, Node 20.20.2, em `radiant-app`.

## Vermelho

Antes de implementar, `GroupArea.test.tsx`, `CategorizeStepRenderer.test.tsx`, o caso "em classificar, o botão diz quantas fichas faltam" em `LessonFlowScreen.flow.test.tsx` e o caso do lábio em `TapChip.test.tsx`:
`npx jest --runInBand <arquivos> -t "GroupArea|CategorizeStepRenderer|categorizePendingCount|em classificar"`

```
Cannot find module './GroupArea' from 'src/features/lesson-flow/renderers/GroupArea.test.tsx'
● CategorizeStepRenderer › não existe mais o rótulo "Colocar em"
● CategorizeStepRenderer › tocar numa ficha e depois num grupo põe a ficha dentro do grupo
● CategorizeStepRenderer › com ficha escolhida, o grupo avisa que recebe e os ids de teste continuam
● categorizePendingCount › (4 casos: módulo ainda sem a função)
● LessonFlowScreen — escolha da alternativa › em classificar, o botão diz quantas fichas faltam e volta a Conferir resposta com 0
● TapChip › tem lábio sólido atrás da face, na cor do estado, e a face mantém 44 pt
Tests: 8 failed, 138 skipped, 2 passed
```

Nasceram verdes, ditos como tais: "tocar numa ficha já colocada a devolve" e
"depois de conferir, ficha no grupo errado mostra o grupo certo" (o
comportamento já existia; guardam contra regressão na nova disposição).
`categorize-group-*` e `categorize-item-*` seguem existindo (asserção própria).

## Verde

- `npx jest --runInBand src/features/lesson-flow src/features/checkpoint`: 28 suítes, 584 testes.
- Suíte inteira em banda: 278 suítes, 3742 testes.
- `tsc --noEmit` e `eslint src/features/lesson-flow` limpos; `visual:qa:strict`, `test:contrast-contract`, `test:identity-palette-contract`, `test:copy-style-contract`, `test:storybook-config` verdes.

## Pontos a saber

- Roteiro do Maestro: `.maestro/f2-formatos/m01.yaml`, `rtg-2026/m16-aula-01.yaml` e `m16-avaliacao-01.yaml` tocam `categorize-item-*` e depois `categorize-group-*`; os ids foram mantidos. Rodar em aparelho ficou para o controlador.

## Rodada 1 de correção (2026-11-16)

Vermelho, antes de corrigir (`npx jest --runInBand src/ui/__tests__/motion.test.ts .../TapChip.test.tsx .../CategorizeStepRenderer.test.tsx`):

```
TypeError: (0 , _motion.usePressDescend) is not a function
✕ usePressDescend › desce em duration.micro e volta ao soltar
✕ usePressDescend › sob reduzir movimento desce de uma vez
✕ usePressDescend › desabilitado não desce
● CategorizeStepRenderer › ao abrir, nenhuma ficha está escolhida e nenhum grupo mostra a dica
● CategorizeStepRenderer › tocar num grupo sem ficha escolhida não muda o valor
● CategorizeStepRenderer › depois de colocar, nenhuma ficha fica escolhida
● TapChip › a descida só ocorre com pressão e sem disabled
```

Nasceram verdes, ditos como tais: "tocar numa ficha e depois num grupo põe a ficha dentro" (o fluxo com toque na ficha já funcionava), "o lábio acompanha os estados escolhida e errada" (o lábio já existia) e "tocar numa ficha já colocada a devolve".

Mudanças: `usePressDescend` e `MotionPressable` em `ui/motion.ts`, usados por `TapChip` e `ChoiceOption` (que deixou de importar reanimated); sem escolha automática de ficha, com rótulo "Grupo X, N fichas" e dica "Toque numa ficha primeiro"; os testes que dependiam da escolha automática (`NewFamilyRenderers`, `LessonFlowScreen.flow`) agora tocam a ficha antes.

Avaliação: as questões de classificar da avaliação passam pelo mesmo `LessonFlowScreen` (o `CheckpointScreen` só tem o fluxo de alternativas), então "Faltam N fichas" vale nas duas. O teste da tela não distingue aula de avaliação, e por isso o teste existente cobre o rótulo nos dois modos sem separá-los.

Verde: suíte inteira em banda, 278 suítes e 3749 testes; `tsc`, `eslint`, `visual:qa:strict` e `test:reanimated-easing-contract` verdes.
