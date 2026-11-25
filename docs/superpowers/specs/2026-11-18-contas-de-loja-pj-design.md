# Contas de loja da empresa — desenho

**Data:** 2026-11-18. **Decisor:** Anderson (dono), na conversa desta data.
**Substitui:** a decisão de contas pessoais da
[ADR de 2026-07-27](../../adr/ADR-2026-07-27-store-account-strategy.md), pela
[ADR de 2026-11-18](../../adr/ADR-2026-11-18-contas-de-loja-da-empresa.md).
**Plano:** [2026-11-18-contas-de-loja-pj.md](../plans/2026-11-18-contas-de-loja-pj.md).

## Intenção

O Radiant passa a ser vendido e faturado pela empresa do dono, e não pela
pessoa física, nas duas lojas. A empresa é uma LTDA ou SLU, com site público em
`https://saudediagnostica.com` (respondeu HTTP 200 em 2026-11-18), o mesmo
domínio que já hospeda a política de privacidade e a página de suporte do app.

## Estado de partida (medido em 2026-11-18)

- **Apple:** Apple Developer Program **individual**, ativo desde 2026-08-01. App
  `6797078156` no ar com a 1.6.0 (18) aprovada nesta data. A conta carrega as
  assinaturas por StoreKit 2 (sem servidor de recibos), o placar
  `radiant.liga.semanal.xp` do Game Center (sem grupo), o contêiner
  `iCloud.com.ascendcreative.radiant` do backup e o App Group
  `group.com.ascendcreative.radiant.widgets` dos widgets.
- **Google Play:** conta **pessoal**, verificada em 2026-07-31. Produção
  inativa; o teste fechado `alpha` tem 5 dos 12 testadores que a conta pessoal
  exige por 14 dias. O Android não cobra nada hoje.
- **Textos:** a política de privacidade e a página de suporte publicadas nomeiam
  o dono, pessoa física, como controlador e usam o e-mail pessoal.

## Objetivos

1. Conta do Play do tipo **Organização**, com perfil de pagamentos da empresa.
2. Assinatura da Apple do tipo **Organização**, com o mesmo Team ID.
3. Contratos, banco e dados fiscais das duas lojas em nome do CNPJ.
4. Política de privacidade, página de suporte e textos de loja coerentes com a
   empresa.

## Fora do escopo

- Trocar o bundle ID e o package `com.ascendcreative.radiant` ou os produtos
  `com.andersonmelo.radiant.ilimitado.*`. São identificadores imutáveis nas
  lojas e o usuário não os vê.
- Transferir o app para outra conta.
- Mudar o código do app.

## O que não pode acontecer

- Perder o app, as avaliações, os assinantes ou o backup no iCloud.
- Ficar sem poder enviar uma correção urgente durante a análise da Apple sem
  ter decidido isso de antemão.
- Publicar a política de privacidade com o controlador errado.
- Liberar dados fiscais ou bancários da empresa para o agente.

## Restrições

- **Google:** a troca não volta atrás. Pré-requisitos: conta pessoal sem aviso
  de verificação pendente, site verificado no console, perfil de pagamentos
  novo de organização com D-U-N-S. Depois, 72 h antes de qualquer envio novo.
  Fonte: [Play Console Help 16260648](https://support.google.com/googleplay/android-developer/answer/16260648?hl=en).
- **Apple:** a conversão é por pedido ao suporte
  ([Program enrollment](https://developer.apple.com/help/account/membership/program-enrollment/)).
  Exige personalidade jurídica (LTDA e SLU servem; MEI e EI, não), D-U-N-S,
  site público e e-mail no domínio da empresa. A Apple não documenta que o Team
  ID se mantém; uma resposta do suporte no fórum diz que sim. Há relato de 2026
  de conversão parada por mais de um mês sem poder enviar builds
  ([fórum 840600](https://developer.apple.com/forums/thread/840600)).
- **Quem faz:** cadastros com documentos, dados fiscais e bancários são do dono.
  O agente lê de volta o que foi salvo e atualiza o repositório.

## Abordagens

| Abordagem | Troca | Decisão |
| --- | --- | --- |
| **Converter as duas contas no lugar** | Mesmo app, mesmo Team ID, nenhum código. Na Apple, risco de envio bloqueado durante a análise, sem como reverter | **Escolhida pelo dono em 2026-11-18** |
| Conta nova da empresa na Apple e transferir o app | Conta atual segue funcionando durante a espera. Custa mais US$ 99 por ano, troca o Team ID, refaz credenciais no EAS, registra de novo o App Group, exige desligar o TestFlight e conferir o CloudKit depois | Descartada: mais pontos de falha silenciosa sem envio urgente que justifique |
| Conta nova da empresa no Google e transferir o app | Nenhum ganho sobre converter; outra taxa de US$ 25 | Descartada |

## Desenho

Quatro fases, nesta ordem, porque cada uma depende da anterior ou reduz o risco
da seguinte:

0. **Pré-requisitos da empresa (dono):** D-U-N-S, e-mail no domínio
   `saudediagnostica.com`, conta bancária no CNPJ e orientação do contador sobre
   a receita do exterior.
1. **Google:** conversão no console, 72 h de espera e conferência de que a
   exigência de 12 testadores sumiu. Vem primeiro porque é autoatendimento, não
   bloqueia envios e pode liberar a produção no Android.
2. **Apple:** primeiro uma pergunta por escrito ao suporte (Team ID, bloqueio de
   envio, prazo); depois o pedido de conversão, numa janela sem envio previsto.
   Depois de concluída: contrato de apps pagos, banco, formulários fiscais e o
   status de comerciante para a União Europeia.
3. **Repositório (agente, por run do Loop):** política de privacidade e página
   de suporte com a empresa como controladora, textos de loja, STATUS e ADR.

## Pronto quando

- A consulta pública da App Store mostra a empresa como vendedora.
- O Play Console mostra a conta como Organização, com o perfil de pagamentos da
  empresa.
- A política publicada em `saudediagnostica.com/radiant/privacidade` cita a
  empresa como controladora.
- O STATUS registra as duas contas com data.

## Decisões deixadas ao executor

- A ordem exata das telas de cada console, que muda sem aviso.
- O texto do pedido ao suporte da Apple, desde que pergunte as três coisas da
  fase 2.
