# Tarefa 7: recompensa e unidade concluída no padrão do resumo

Medido em 2026-11-16, Node 20.20.2, em `radiant-app`. Sem regra de produto nova:
estados da recompensa, navegação, coleta e telemetria ficam como estavam.

## Vermelho

`npx jest --runInBand src/features/rewards/screens/RewardScreen.flow.test.tsx -t "padrão do resumo"`

```
✕ registrada: não há "XP TOTAL", o XP aparece uma vez (no HUD) e a sequência não se repete
    Expected length: 1   Received length: 2
✕ pronta / bloqueada / registrada: sem etiqueta em caixa alta acima de título
✕ RewardScreen: nenhuma cor literal nem fontSize numérico
✕ UnitCompleteCelebration: nenhuma cor literal nem fontSize numérico
Tests: 6 failed, 3 passed
```

Nasceram verdes, ditos como tais: as três "há uma única ação principal" (a tela antiga já
tinha um botão principal por estado; a asserção guarda contra regressão).

## Verde

- Focados (`RewardScreen.flow`, `UnitCompleteCelebration`, `LessonSummary`, `SummaryHero`): verdes.
- `tsc --noEmit` e `eslint` nos arquivos tocados: limpos.
- Contratos `contrast`, `identity-palette`, `icon-assets`, `copy-style`, `storybook-config`: `# fail 0`; `visual:qa:strict` passou.
- Suíte inteira em banda: 282 suítes, 3782 testes.

## Decisões

- A fala do Pixel, a descrição e o texto de ação ficam como frases simples; `PixelHeroSplit`
  e `GalaxyStatRow` saem da recompensa. XP e sequência aparecem só no HUD (a tela tem HUD).
- `SummaryHero` (medalha no centro, Pixel opcional) e `ctaClearance` foram extraídos do
  `LessonSummary`, sem mudar o comportamento dele (57 testes dele seguem verdes).
- Botão de fechar passou de 36 para 44 pt.

## Fica para o controlador

Passo 4 do brief (roteiros `reward-locked`/`reward-unlock`) e capturas em aparelho.

## Rodada 1 (revisão)

Medido em 2026-11-16, Node 20.20.2. A guarda por AST de cor e `fontSize` saiu de
`RewardScreen.flow.test.tsx` (o contrato único da Tarefa 6 a cobre).

Vermelho (com o `testID` dos rodapés já no lugar, para o motivo ser o defeito):

```
RewardScreen, pronta e registrada: com rodapé de 180 pt medido, o paddingBottom da rolagem é pelo menos 180
    Expected: >= 180   Received: 104
rodapé: o paddingBottom inclui o inset inferior simulado (34)   Received has value: undefined
UnitCompleteCelebration: título e frase ficam num corpo rolável   (sem ScrollView)
UnitCompleteCelebration: folga medida e inset   (mesmos valores acima)
Tests: 7 failed, 68 passed
```

Correção: `useFixedFooter` / `scrollClearance` em `SummaryHero.tsx` (mede o rodapé por `onLayout`,
folga inicial `ctaClearance`, inset de `SafeAreaInsetsContext`, 0 sem provider). Verde: focados
(382 testes de rewards, journey/components, SummaryHero, LessonSummary), `tsc` e `eslint` limpos.
`LessonSummary` não foi tocado (usar a medida mudaria o comportamento dele).
