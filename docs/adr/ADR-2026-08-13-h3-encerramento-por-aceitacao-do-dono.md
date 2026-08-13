# ADR — Encerramento de H3 por aceitação explícita do dono (2026-08-13)

**Status:** aceita e implementada
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** gate H3 do runtime interno de checkpoints

## Contexto

A primeira coorte de `first_frame` não encontrou regressão, mas fechou como
`inconclusive` por ruído de host. O contrato foi depois corrigido para separar
partidas `cold` de relançamentos `resume`, sem tornar a medição histórica um
`pass`. VoiceOver e TalkBack exigem passagem manual; a segunda falha de restauração
tem cobertura unitária, mas não é alcançável por Maestro neste binário sem uma
simulação externa de versão de conteúdo.

## Decisão

O dono confirmou a repetição em host silencioso e a passagem em aparelho físico de
tela baixa, sem fornecer métricas ou artefatos novos para versionamento. Também
aceitou a cobertura unitária existente para a segunda falha, em vez de exigir um
flow E2E artificial. H3 fica encerrada por aceitação operacional do dono.

## Consequências

- o resultado histórico `inconclusive` continua preservado e não é reclassificado
  como `pass`;
- o parser e seus gates permanecem falha-fechada para qualquer medição futura;
- a decisão não promove produção, OTA, TestFlight, App Store, versão ou build;
- a próxima unidade de trabalho é H4/Task 12 educacional.

## Alternativa descartada

Exigir novos artefatos numéricos e um simulador externo de `contentVersion` antes
de encerrar H3. Isso produziria mais evidência técnica, mas o dono aceitou os
checks manuais e a cobertura unitária existentes como suficientes para este marco.
