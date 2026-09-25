# ADR — Lição concluída continua concluída; o reembolso sai do aparelho; a renovação desconhecida ganha estado próprio (2026-09-25)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-25, numa sessão na
nuvem, depois de pedir a recomendação do agente. Para o defeito 1, as palavras
do dono foram "A". Para as outras duas, "1A" e "2A".  
**Registro:** o [relatório da sessão na nuvem](../superpowers/handoffs/2026-09-25-radiant-relatorio-sessao-nuvem.md),
§2.2 e §2.6. A sessão local registrou a decisão por um run do Loop.  
**Escopo:** Radiant 1.4 · defeito 1 do E2E · roteiro do StoreKit · texto da
assinatura

## Contexto

1. **O defeito 1 do E2E.** O aluno reabre a L1, que já está concluída, e sai
   no meio. O cabeçalho cai de "1 de 14" para "0 de 14 etapas", e a trilha
   recomenda refazer a lição em vez do checkpoint.
   - `resolveNodeStatus` (`JourneyRecommendationService.ts:46`) devolve
     `resumable` antes de `completed`.
   - `LessonFlowScreen.tsx` marca a lição como retomável ao abrir (`:117`),
     nas vidas esgotadas (`:249`) e na saída (`:285`), inclusive quando ela já
     está concluída. Isto foi lido no código, e não medido.
2. **O reembolso.** No sandbox, o pedido de reembolso só sai de dentro do app
   (`beginRefundRequest`), e o app não tem essa entrada
   ([evidência](../../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)).
3. **A renovação desconhecida.** Quando o iOS não informa se a assinatura vai
   renovar, o `willAutoRenew` vira `nil`, e o adaptador converte isso em
   `false` (`RadiantStoreKitModule.swift:175-178`, `StoreKit2Adapter.ts:41`).
   O resultado é que um assinante pagante lê "Cancelada". Isto foi lido no
   código, e não medido.

## Decisão

1. **Defeito 1, opção A:** **o concluído vence o retomável.**
   - A lição concluída continua concluída, o cabeçalho continua em "1 de 14",
     e a recomendação continua no checkpoint.
   - **Inverter a precedência não basta.** A `resumableNodeId` velha ainda
     orienta o `resolveCurrentUnitId` e mudaria a unidade em foco. O conserto
     completo também deixa de marcar como retomável uma lição que já está
     concluída.
   - **Testes vermelhos antes do conserto:** o cabeçalho, a recomendação e a
     unidade em foco.
2. **Reembolso, 1A:** **sai do roteiro no aparelho, e o app não ganha um
   botão de reembolso.** A perda de acesso depois de um reembolso passa a ser
   testada pelo StoreKit Testing do Xcode, com o gerenciador de transações.
3. **Renovação desconhecida, 2A:**
   - **A renovação passa a ter três estados:** renova, não renova e
     desconhecido. Isso substitui o `nil → false`.
   - **No estado desconhecido,** o cartão mostra **"Ativa · acesso até
     DD/MM"**, e não "Cancelada".
   - **Teste vermelho antes:** um estado desconhecido não pode virar
     "Cancelada".

## Consequências

- **Dois consertos entram na FILA como trabalho do agente:** o defeito 1 e a
  renovação desconhecida. Cada um terá um run, com teste vermelho antes.
- **O roteiro do StoreKit no aparelho fica menor.** Sai o reembolso, depois
  de o modo avião já ter saído pela
  [ADR de 2026-09-24](ADR-2026-09-24-storekit-roteiro-no-aparelho.md).
- **O defeito 1 bloqueia o bump para a 1.4.0** (item 8 da lista), enquanto
  não for corrigido.

## Alternativas descartadas

O relatório da nuvem registra as escolhas, mas não as justificativas. As
razões abaixo são leitura da sessão local e não foram ditas pelo dono.

- **Defeito 1, opção B:** mostrar a retomada da lição concluída sem desfazer a
  contagem. Ela mantém dois estados que competem no mesmo nó.
- **Reembolso:** criar um "Pedir reembolso" no app, só para testar no sandbox.
- **Renovação desconhecida:** esconder a linha de renovação. O aluno perderia
  a data de acesso.
