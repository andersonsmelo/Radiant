# Tarefa 15 — componentes sem uso, apagados em 2026-11-17

O dono mandou apagar, em 2026-11-17, os três componentes que a tarefa 6 deixou sem uso.
Feita pelo controlador (Claude Fable 5.2).

## O que saiu

- `radiant-app/src/components/ui/PixelHeroSplit.tsx` e o teste dele
- `radiant-app/src/components/ui/AnimatedCounter.tsx`
- `radiant-app/src/ui/components/GalaxyStatRow.tsx`
- as duas menções no `README.md` do app e as duas entradas em
  `scripts/copy-style-baseline.json`

## Como foi conferido que não tinham uso

Busca pelos três nomes em `radiant-app/src`, `scripts`, `.rnstorybook` e no `README.md`:
fora dos próprios arquivos, só duas guardas de teste citavam `PixelHeroSplit`
(`CheckpointScreen.flow.test.tsx` e `ReviewScreen.flow.test.tsx`), para afirmar que a
tela não o montava. Nenhuma tela, rota, história nem exportação os importava.

## As duas guardas

Com o componente apagado, "a tela não monta `PixelHeroSplit`" passaria para sempre. A
da avaliação já tinha, na linha seguinte, a asserção mais forte (nenhum
`PixelIllustration`), e ficou só com ela. A da revisão passou a afirmar o mesmo:
nenhum `PixelIllustration` montado.

## Dependências

`ProgressRing` e `SpeechBubble`, que o `PixelHeroSplit` usava, continuam em uso pela
`HomeScreen` antiga e ficaram.
