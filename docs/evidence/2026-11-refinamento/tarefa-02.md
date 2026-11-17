# Tarefa 2: marcas desenhadas e alternativa com relevo

Node 20.20.2. Comando:
`cd radiant-app && npx jest --runInBand src/ui/components/VerdictIcons.test.tsx src/components/ui/ChoiceOption.test.tsx src/features/lesson-flow/renderers/{MultipleChoiceStepRenderer,TapChip,NewFamilyRenderers,HotspotStepRenderer,ComparisonStepRenderer}.test.tsx src/features/subscription/screens/SubscriptionScreen.flow.test.tsx src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`

## Vermelho (código de produção no estado de `HEAD`, só os testes novos)

Reproduzido tirando `VerdictIcons.tsx` e `ChoiceOption.tsx` e devolvendo os demais
arquivos ao `HEAD`. Falhas pelo motivo previsto:

```
FAIL src/components/ui/ChoiceOption.test.tsx
    Cannot find module './ChoiceOption' from 'src/components/ui/ChoiceOption.test.tsx'
FAIL src/ui/components/VerdictIcons.test.tsx
    Cannot find module './VerdictIcons' from 'src/ui/components/VerdictIcons.test.tsx'
FAIL src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.test.tsx   (veredito por estado, sem ChoiceOption)
FAIL src/features/lesson-flow/renderers/TapChip.test.tsx                      (sem VerdictIcon: o rótulo ainda trazia ✓/✗)
FAIL src/features/lesson-flow/renderers/NewFamilyRenderers.test.tsx           (texto sem ✓/✗ e ícones desenhados)
FAIL src/features/lesson-flow/renderers/HotspotStepRenderer.test.tsx          (hotspot-selected-mark ausente)
FAIL src/features/subscription/screens/SubscriptionScreen.flow.test.tsx
  ● o botão de fechar não tem o caractere ✕
    > 315 |         expect(screen.queryByText('✕')).toBeNull();
FAIL src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx          (a escolhida sem o texto "Selecionada")
Tests: 11 failed, 192 passed, 203 total
```

O `ComparisonStepRenderer.test.tsx` também reprovou (`getByText('Selecionada')`
exato, porque o texto era "✓ Selecionada").

## Verde (com a implementação)

Sobre `src/ui`, `src/components/ui`, `src/features/lesson-flow` e `src/features/subscription`:

```
Test Suites: 1 failed, 58 passed, 59 total
Tests:       1 failed, 1083 passed, 1084 total
```

A suíte que reprova é `ActivityRendererRegistry.test.tsx` (linha 122,
`getByText('Selecionada')`), fora dos arquivos desta tarefa: o texto
"Selecionada" deixou de existir por decisão do brief. Fica para o controlador.

Asserções que nasceram verdes: `altura mínima de 44`, `não usa opacidade em
dimmed` (a antiga alternativa já tinha `minHeight: 56` e não usava opacidade;
a guarda protege o futuro) e `desabilitado não dispara onPress`.

## Verificações

- `npx tsc --noEmit`: sem erros.
- `npx eslint` nos arquivos tocados: 0 erros.
- Contratos: contraste 18/18, paleta de identidade 1/1, ícones 14/14,
  estilo de cópia 65/65, storybook 3/3, maestro 11/11; `visual:qa:strict`
  sem regressões.

## Enumeração dos caracteres de ícone (passo 5)

Duas buscas em `radiant-app/src`, fora de teste e fora de `features/home`,
`features/telemetry`, `features/dev-console`, `features/editorial-preview` e
`features/beta`:

1. literal `✓ ✗ ✕ ✔ ✖ ×`;
2. escape `✓ ✔ ✕ ✖ ✗ ✘ ×`.

- Escape: 0 ocorrências.
- Literal: o `×` restante é multiplicação ou dimensão em texto e comentário
  (`bench`, `student-checkpoints`, `gamification`, `conversion`, `ui/characters`),
  não ícone.
- **Ocorrência de ícone que sobra: 1**, em
  `src/components/ui/ProgressRing.stories.tsx:32` (`✓` como filho do anel).
  O arquivo está fora da lista permitida; a contagem zero só fecha quando o
  controlador o trocar por `CheckIcon`.

## Fora desta tarefa

Captura e roteiro do Maestro (prova em aparelho) ficam para o controlador.

## Escopo ampliado (2026-11-16)

- `ActivityRendererRegistry.test.tsx`: o `getByText('Selecionada')` virou
  `accessibilityState.selected` verdadeiro na escolhida (`Osso`), falso na
  outra (`Ar`), e `queryByText('Selecionada')` nulo.
- `ProgressRing.stories.tsx`: o `✓` virou `CheckIcon`.
- Enumeração refeita (Node 20.20.2), fora de teste e das cinco pastas excluídas:
  - literal `grep -rnE '✓|✗|✕|✔|✖' src`: 1 ocorrência, o comentário de
    `VerdictIcons.tsx:4`, que cita os caracteres que o arquivo substitui.
    **Uso como ícone: 0.** O `×` restante é multiplicação em texto e comentário.
  - escape `grep -rniE '\\u(2713|2714|2715|2716|2717|2718|00d7)' src`: **0**.
- Suíte inteira, `cd radiant-app && npx jest --runInBand`:
  `Test Suites: 276 passed, 276 total`, `Tests: 3710 passed, 3710 total`.
  `tsc --noEmit` limpo; `eslint` dos dois arquivos sem avisos.
