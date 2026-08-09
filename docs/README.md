# Radiant — mapa da documentação

Este repositório usa Specification Driven Development (SDD) e o Loop como
contrato de execução. Código, testes e documentação versionada são a fonte
operacional primária; o cérebro do projeto registra contexto e aprendizados
validados.

## Regras de manutenção

- nenhuma feature material entra sem requisito ou spec correspondente;
- mudanças estruturais relevantes exigem ADR;
- snapshots datados permanecem históricos e não devem ser reescritos para
  parecer atuais;
- toda afirmação de conclusão deve apontar para validação executada;
- o app permanece local-first e uma falha remota não pode impedir estudo;
- fontes e mídia só podem ser promovidas após decisão explícita de direitos,
  proveniência e anonimização.

## Precedência

Quando documentos divergirem, use esta ordem:

1. [`EXECUTION_STATUS_2026-08-09.md`](EXECUTION_STATUS_2026-08-09.md) para estado
   operacional atual e bloqueios;
2. [`../radiant-app/README.md`](../radiant-app/README.md) e
   [`../radiant-api/README.md`](../radiant-api/README.md) para contratos de
   runtime;
3. [`plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md)
   para o inventário ativo do lançamento; o
   [`roadmap mestre`](plans/2026-08-01-radiant-roadmap-mestre.md) preserva a
   ordem entre as três frentes e aponta os planos de cada uma —
   [lançamento](plans/2026-07-27-radiant-launch-roadmap.md),
   [recorte Android](plans/2026-07-29-android-closed-testing-plan.md),
   [sistema de aprendizagem](superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md);
4. [`ARCHITECTURE_STATE.md`](ARCHITECTURE_STATE.md) para arquitetura consolidada;
5. [`PRD.md`](PRD.md), specs e ADRs para intenção e decisões;
6. documentos datados substituídos, apenas como evidência histórica.

## Documentos atuais

### Produto e arquitetura

- [`PRD.md`](PRD.md)
- [`ARCHITECTURE_STATE.md`](ARCHITECTURE_STATE.md)
- [`CLIENT_FLOW.md`](CLIENT_FLOW.md) — o caminho da pessoa no app e a máquina de
  estados que decide se o próximo passo abre, em dois diagramas ancorados no
  código
- [`CONTENT_PIPELINE.md`](CONTENT_PIPELINE.md)
- [`EXECUTION_STATUS_2026-08-09.md`](EXECUTION_STATUS_2026-08-09.md)
- [`plans/2026-08-01-radiant-roadmap-mestre.md`](plans/2026-08-01-radiant-roadmap-mestre.md)
  — ordem e dependência entre as três frentes
- [`plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md)
  — execução da frente de lançamento

### Sistema educacional por competências

- decisão: [`adr/ADR-2026-07-31-aprendizagem-por-competencias.md`](adr/ADR-2026-07-31-aprendizagem-por-competencias.md)
- spec: [`superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md`](superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md)
- execução: [`superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md`](superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md)
- emenda da Task 11 (algoritmo do agendador):
  [spec](superpowers/specs/2026-08-08-agendador-por-competencia-design.md) ·
  [execução](superpowers/plans/2026-08-08-agendador-por-competencia.md)

O estado de 2026-08-09 é: Tasks 1, 2, **4 a 9** e **11** concluídas;
infraestrutura da Task 3 concluída; lote de mídia ainda sem ativos aprovados;
próxima é a **Task 10** (jogos acessíveis). As fundações concluídas não
dependeram do lote de mídia — o gate da Fase 0 trata currículo e direitos como
condições irmãs —, mas os jogos visuais dependem de ativos aprovados. O lote é
decisão de direitos do dono. A autoridade sobre este estado é o status canônico;
a linha acima é conveniência e decai.

A Task 11 fechou **fora de ordem** porque o agendador que ela entrega não depende
de conteúdo v2: ele entra desligado e acende quando houver o que agendar. O
efeito prático é que **existe hoje um agendador pronto sem nada para agendar**, e
o que destrava é o lote de direitos, não código.

O primeiro hardening pós-entrega também fechou em 2026-08-09:
`CompetencyReviewService` passou a rejeitar números não finitos nos quatro
campos numéricos do cartão e a quarentenar o store. Continua aberta a guarda
explícita de ativação e uma varredura do padrão `jest.spyOn` sobre mocks oficiais.

### Primeira vitória

- decisão e desenho:
  [`superpowers/specs/2026-08-09-primeira-vitoria-design.md`](superpowers/specs/2026-08-09-primeira-vitoria-design.md)
- execução:
  [`plans/2026-08-09-primeira-vitoria.md`](plans/2026-08-09-primeira-vitoria.md)
- resultado: **Começar** abre o próximo nó elegível; **Pular apresentação** abre
  a Home; o flow focado passou no iOS e no Android em 2026-08-09.

### Conta, premium e monetização

- decisão de posicionamento: [`adr/ADR-2026-07-31-conta-e-premium.md`](adr/ADR-2026-07-31-conta-e-premium.md)
  — a v1.3 lança sem conta
- decisão de modelo: [`adr/ADR-2026-08-01-modelo-de-entitlement-premium.md`](adr/ADR-2026-08-01-modelo-de-entitlement-premium.md)
  — conta própria + billing, com a ordem obrigatória da v1.4
- execução: **ainda não existe plano**; a ordem está na frente 3 do
  [roadmap mestre](plans/2026-08-01-radiant-roadmap-mestre.md)

### Links legais no app

- spec: [`superpowers/specs/2026-08-01-links-legais-no-app-design.md`](superpowers/specs/2026-08-01-links-legais-no-app-design.md)
- execução: [`plans/2026-08-01-links-legais-no-app.md`](plans/2026-08-01-links-legais-no-app.md)

### Lojas e beta

- checklist: [`release/CHECKLIST_RELEASE_V1.3.md`](release/CHECKLIST_RELEASE_V1.3.md)
- Play Console: [`store/RUNBOOK_PLAY_CONSOLE.md`](store/RUNBOOK_PLAY_CONSOLE.md)
- EAS: [`store/EAS_SUBMIT_SETUP.md`](store/EAS_SUBMIT_SETUP.md)
- convites: [`store/TESTER_INVITE_KIT.md`](store/TESTER_INVITE_KIT.md)
- dados e classificação: [`store/DATA_SAFETY_E_CLASSIFICACAO.md`](store/DATA_SAFETY_E_CLASSIFICACAO.md)

### Specs vigentes

- [`specs/quiz.spec.md`](specs/quiz.spec.md)
- [`specs/spaced-repetition.spec.md`](specs/spaced-repetition.spec.md)
- [`specs/gamification.spec.md`](specs/gamification.spec.md)
- [`specs/annotation.spec.md`](specs/annotation.spec.md)

## Histórico

`EXECUTION_STATUS_2026-08-08.md` e anteriores são snapshots substituídos. Planos
datados continuam úteis para proveniência, mas seu cabeçalho e seu status devem
deixar claro quando foram concluídos, substituídos ou parcialmente executados.

## Gates documentais e editoriais

```bash
node --test scripts/qa/docs-contract.test.mjs
node scripts/qa/docs-contract.mjs
node scripts/content/validate-foundation.mjs
node scripts/content/validate-media-manifest.mjs
```

O baseline integral é `loop validate` no run de escrita correspondente.
