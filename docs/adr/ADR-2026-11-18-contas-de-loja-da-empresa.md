# ADR — Contas de loja da empresa (2026-11-18)

**Status:** aceita
**Decisor:** Anderson (proprietário do projeto), na conversa de 2026-11-18
**Substitui:** a [ADR de 2026-07-27](ADR-2026-07-27-store-account-strategy.md),
que escolheu conta pessoal no Google Play e individual na Apple.

## Contexto

O dono quer que o Radiant seja vendido e faturado pela empresa dele, e não pela
pessoa física. A empresa é uma LTDA ou SLU, com site público em
`https://saudediagnostica.com`. Em 2026-11-18, o app estava no ar na App Store
(1.6.0 aprovada nesta data) e em teste fechado no Play, com 5 dos 12 testadores
que a conta pessoal exige.

A ADR anterior já previa a migração como projeto próprio, e a FILA registrava
que a exigência dos 12 testadores vale só para conta pessoal.

## Decisão

1. **Converter as duas contas atuais em contas de organização, sem transferir o
   app.**
2. **Google primeiro**, pelo próprio console. É autoatendimento, não bloqueia
   envios e pode tirar a exigência do teste fechado.
3. **Apple depois**, por pedido ao suporte, só depois de perguntar por escrito
   se o Team ID se mantém e se o envio fica bloqueado durante a análise.

O desenho está em
[`docs/superpowers/specs/2026-11-18-contas-de-loja-pj-design.md`](../superpowers/specs/2026-11-18-contas-de-loja-pj-design.md)
e os passos, em
[`docs/superpowers/plans/2026-11-18-contas-de-loja-pj.md`](../superpowers/plans/2026-11-18-contas-de-loja-pj.md).

## Alternativa descartada

Abrir uma conta nova da empresa na Apple e transferir o app. Ela não bloquearia
a conta atual durante a espera, mas troca o Team ID. Com isso, obrigaria a
refazer as credenciais no EAS e registrar de novo o App Group dos widgets, além
de desligar o TestFlight e conferir o contêiner do CloudKit depois. Custaria
também mais US$ 99 por ano. Sem envio urgente previsto, o dono escolheu
converter.

## Consequências

- A troca no Google não volta atrás. Depois dela, 72 h sem envio novo.
- Na Apple, a conta pode ficar sem enviar builds durante a análise. Há relato
  de 2026 de mais de um mês. Durante um bloqueio, só correção de JavaScript sai,
  pelo EAS Update.
- Os identificadores `com.ascendcreative.radiant` e
  `com.andersonmelo.radiant.ilimitado.*` ficam como estão.
- A política de privacidade e a página de suporte passam a ter a empresa como
  controladora, num run próprio depois das conversões.
- Se o Play deixar de exigir o teste fechado, o item 5 da FILA deixa de ser o
  caminho crítico do Android. Isso só se afirma depois de ler o painel.
