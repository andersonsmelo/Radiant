# Tarefa 9: perfil (evidência)

Medido em 2026-11-16, Node 20.20.2, `radiant-app`.

## Vermelho (antes de implementar)

`npx jest --runInBand src/features/profile/components/StreakWeek.test.tsx src/features/profile/components/MedalShelf.test.tsx`
reprovou 10 testes, pelos motivos previstos: sem "N de M" nem "Ver as N" na estante;
sem número com chama, sem "estudou"/"sem registro" e com "?" e parágrafos na semana;
sem a linha "N proteção guardada".

## Verde

`npx jest --runInBand src/features/profile src/features/league src/features/decorations src/ui src/features/missions src/features/journey/screens`:
51 suítes, 715 testes passando. `tsc --noEmit` e `eslint` limpos. Contratos
`contrast`, `identity-palette`, `icon-assets`, `copy-style` e `visual:qa:strict` passando.

Asserções que nasceram verdes: as de ausência no `ProfileScreen` (missões, "Hoje",
"Revisões pendentes") dependem de remoção de código e foram vistas verdes só após a remoção.

## Saiu / ficou

- `TodayGoals` (componente e teste) apagado: só o perfil o usava.
- `DailyMissionsCard` mantido (a tela inicial usa). O perfil ainda chama
  `DailyMissionsService.sync()` antes do XP, para o total vir com o bônus.
- Perfil não lê mais meta diária nem revisões devidas.
- `ListRow` ganhou `testID` opcional.

## Para o controlador

Prova em aparelho (captura do perfil, Maestro) fica com o controlador.
`SettingsScreen.flow.test.tsx` afirma o bloco "Hoje" do perfil e precisa de ajuste (fora da lista).

## Escopo ampliado (2026-11-16)

`SettingsScreen.flow.test.tsx` perdeu o ramo `profile` do teste de POP (o bloco "Hoje" saiu do perfil).
Teste novo: o XP do perfil é lido depois de `DailyMissionsService.sync()` (bônus no total); nasceu verde.
Suíte inteira em banda: 282 suítes, 3785 testes passando.

## Correção, rodada 1 (2026-11-17)

Semana da sequência por `streakWeekDays` (sequência viva cobre os dias da contagem; dia sem prova é ponto, não falta),
rótulos sem "estudou", `accessibilityState.expanded` na estante.
Vermelho: 13 testes de `StreakWeek`/`MedalShelf` reprovados antes da implementação; `streakWeekDays` nasceu verde (módulo novo).
Verde: suíte inteira em banda, 284 suítes e 3807 testes; `tsc`, `eslint` e `visual:qa:strict` limpos.
