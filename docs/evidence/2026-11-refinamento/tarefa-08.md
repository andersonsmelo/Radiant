# Tarefa 8: missões de hoje com peça e recompensa

Medido em 2026-11-16, Node 20.20.2, em `radiant-app`. Sem regra de produto nova: leitura, `loading`/`unavailable`, telemetria e `mission-fill-<id>` iguais.

## Vermelho

`npx jest --runInBand src/ui/components/MissionIcons.test.tsx src/features/missions/screens/MissionsScreen.flow.test.tsx`

```
Cannot find module './MissionIcons' from 'src/ui/components/MissionIcons.test.tsx'
Tests: 3 failed, 3 passed, 6 total   (recompensa, peça em ouro, botão "Continuar a trilha")
```

Nasceram verdes, ditos como tais: as três asserções antigas da tela (progressbar com valor, `mission-fill-<id>`, Voltar).

## Verde

- Focados (`MissionIcons`, `features/missions`, `JourneyHomeScreen.flow`, `ProfileScreen.flow`, `student-checkpoints`): verdes.
- `tsc --noEmit` e `eslint`: limpos.
- Contratos contrast, identity-palette, icon-assets, copy-style, storybook-config: `# fail 0`; `visual:qa:strict` passou.
- Suíte inteira em banda: 283 suítes, 3790 testes.

## Fora do escopo

História no Storybook (arquivo `.stories` fora da lista) e prova em aparelho: ficam para o controlador. `DailyMissionsCard` não mudou.
