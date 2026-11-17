# Tarefa 10: assinatura com cartões de plano (evidência)

Medido em 2026-11-17, Node 20.20.2, `radiant-app`.

## Vermelho (antes de implementar)

`npx jest --runInBand src/features/subscription src/features/conversion`:
5 suítes e 11 testes reprovados, pelos motivos previstos:

- `PlanCard.test.tsx`: `Cannot find module './PlanCard'`.
- `o anual vem selecionado…` e `tocar no mensal…`: `accessibilityState.selected`
  `Expected: true, Received: undefined` (o cartão antigo só tinha `checked`).
- `preço ausente mostra o estado de carregamento atual e o botão desabilitado`:
  `Unable to find an element with role: progressbar, name: Carregando os planos`.
- `com o plano anual, o detalhe mostra o valor por mês…`:
  `Unable to find an element with role: radio, name: Anual, $22.99, por ano, $1.92 por mês`.
- Conversão ligada: `Unable to find an element with text: Errar não custa vida.`;
  as três outras, `Unable to find an element with text: Assinar o anual`.
- `SubscriptionCard`: `Unable to find an element with text: Errar não custa vida.`
- `planComparison`: rótulos `["Aulas, revisões e avaliações", "Vidas", "Revisão concluída"]`
  em vez de `["Vidas"]`; `Expected: "Sem limite"`, `Received: "Ilimitadas: errar não gasta vida"`.

Nasceram verdes: `há um único botão de assinar`, `o texto legal de hoje aparece
inteiro` e `"Restaurar compras" continua` (a tela já cumpria). Foram vistas
falhando com o defeito que nomeiam, por mutação temporária da tela, desfeita em
seguida: com uma vírgula a mais no texto legal ("até 24 horas, antes"), `Unable
to find an element with text: A assinatura renova automaticamente…`; com um
segundo botão "Assinar já", `Expected length: 1, Received length: 2`.

## Verde

`npx jest --runInBand src/features/subscription src/features/conversion`:
12 suítes, 191 testes passando. `tsc --noEmit` e `eslint` limpos. Contratos
`contrast`, `identity-palette`, `icon-assets`, `copy-style`, `storybook-config`
e `visual:qa:strict` passando.

## Para o controlador

Prova em aparelho (cartões lado a lado e empilhados, Ask to Buy, assinante) e a
captura da tela ficam com o controlador.
