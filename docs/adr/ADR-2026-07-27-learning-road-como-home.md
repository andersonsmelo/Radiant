# ADR — A Learning Road é a home de produção (2026-07-27)

**Status:** aceita
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** task B0 do
[roadmap de lançamento](../plans/2026-07-27-radiant-launch-roadmap.md)

## Contexto

A rota da primeira aba escolhe entre duas telas:

```tsx
AppConfig.ENABLE_LEARNING_ROAD ? <JourneyHomeScreen /> : <HomeScreen />
```

Auditoria de 2026-07-27 constatou que `ENABLE_LEARNING_ROAD` tinha default
`false` e era ligada **apenas** no perfil `e2e-test` do `eas.json` e no `.env`
local. Consequências verificadas:

1. Um build `preview` ou `production` renderizava `HomeScreen`.
2. O E2E em device de 2026-07-26 rodou sob `e2e-test` e validou
   `JourneyHomeScreen` — ou seja, a evidência de fluxo crítico não cobria o
   caminho que seria distribuído.
3. O desenvolvimento manual, por causa do `.env`, também via a tela do E2E, o
   que tornava a divergência invisível no dia a dia.

O defeito de recorte do CTA corrigido em `86d1867` seguia o mesmo padrão: foi
aplicado à tela flagada, enquanto a `HomeScreen` de produção permanecia com
folga insuficiente (corrigido depois em `a9846a2`).

## Decisão

A **Learning Road (`JourneyHomeScreen`) é a home oficial do produto** e a que
lança na v1.3.

Em consequência:

1. `EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true` passa a ser declarada
   explicitamente nos perfis `development`, `preview` e `production` do
   `eas.json` — não só no `e2e-test`.
2. O default de `ENABLE_LEARNING_ROAD` em `src/config.ts` muda para `true`,
   para que um build sem variável de ambiente renderize a mesma tela que a
   produção. Um default que diverge do que se distribui foi a causa raiz
   original; declarar a flag nos perfis sem corrigir o default deixaria a
   armadilha de pé para qualquer build fora do EAS.

## Consequências

- A evidência de E2E existente passa a corresponder ao caminho de produção. Os
  três flows continuam válidos porque sempre exercitaram a `JourneyHomeScreen`.
- `HomeScreen` (`src/features/home/screens/HomeScreen.tsx`) torna-se código
  alcançável apenas desligando a flag explicitamente. Não é removida agora:
  serve de rollback rápido se o beta revelar bloqueio na Learning Road. Após o
  beta, remover a flag e a tela morta é limpeza pendente.
- `HomeScreen.flow.test.tsx` passa a fixar `ENABLE_LEARNING_ROAD: false` no
  mock de configuração. A tela só é alcançável nessa configuração, e o teste
  antes herdava o default do ambiente: quando o default virou `true`, a tela
  passou a renderizar o título da missão duas vezes — no hero e no card da
  jornada — e o teste quebrou por ambiguidade. Fixar a flag descreve a
  configuração real em que a tela existe e torna o teste independente do
  default. A duplicação em si não é alcançável pelo usuário, porque com a flag
  ligada a rota entrega a `JourneyHomeScreen`.
- A flag deixa de ser um interruptor de redesign em andamento e passa a ser um
  kill switch de rollback. O README ainda a descreve como redesign em
  andamento; essa descrição precisa ser atualizada.
- Nenhuma evidência anterior a esta data que tenha sido colhida sob perfil com
  flags divergentes deve ser reaproveitada sem reconferir o perfil.

## Reversão

Desligar a flag nos perfis EAS restaura a `HomeScreen` clássica. Enquanto a
`HomeScreen` existir e passar no gate de clearance, a reversão custa um build.
Depois de removida a tela, a reversão exige reverter o commit de remoção.
