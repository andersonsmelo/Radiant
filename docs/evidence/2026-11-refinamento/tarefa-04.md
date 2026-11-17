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

- A descida da face da ficha na pressão é de uma vez (3 pt, `Pressable` com `pressed`), sem tween: `ui/motion` não tem hook de deslocamento e o visual-qa R4 barra `react-native-reanimated` direto fora das exceções. Por isso não há teste da descida (o testing-library não segura o dedo); o lábio e as cores têm.
- Roteiro do Maestro: `.maestro/f2-formatos/m01.yaml`, `rtg-2026/m16-aula-01.yaml` e `m16-avaliacao-01.yaml` tocam `categorize-item-*` e depois `categorize-group-*`; os ids foram mantidos. Rodar em aparelho ficou para o controlador.
- Avaliação: usa os mesmos renderizadores, então ganha área de grupo e ficha com relevo; o rótulo "Faltam N fichas" só vale na aula.
