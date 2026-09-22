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

1. [`STATUS.md`](STATUS.md) para estado operacional atual e bloqueios;
2. [`../radiant-app/README.md`](../radiant-app/README.md) e
   [`../radiant-api/README.md`](../radiant-api/README.md) para contratos de
   runtime;
3. [`plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md)
   para o inventário ativo do lançamento; o
   [`roadmap mestre`](plans/2026-08-01-radiant-roadmap-mestre.md) preserva a
   ordem entre as três frentes e aponta os planos de cada uma —
   [lançamento](plans/2026-07-27-radiant-launch-roadmap.md),
   [recorte Android](plans/2026-07-29-android-closed-testing-plan.md),
   [sistema de aprendizagem](superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md)
   e [kernel de checkpoints](superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md);
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
- [`STATUS.md`](STATUS.md) — estado vivo e handoff para a próxima sessão

### 1.4 — fluxo do usuário, vidas, assinatura e backup (desenhada em 2026-09-14)

- decisão: [ADR 2026-09-14](adr/ADR-2026-09-14-1-4-freemium-por-vidas-storekit-e-icloud.md);
- spec aprovada: [`superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md);
- plano: [`superpowers/plans/2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md`](superpowers/plans/2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md);
- prompt para a IA executora: [`superpowers/handoffs/2026-09-14-radiant-1-4-prompt-de-continuidade.md`](superpowers/handoffs/2026-09-14-radiant-1-4-prompt-de-continuidade.md);
- prompt 2 (pós-Task 7): [`superpowers/handoffs/2026-09-14-radiant-1-4-prompt-de-continuidade-2.md`](superpowers/handoffs/2026-09-14-radiant-1-4-prompt-de-continuidade-2.md);
- **prompt atual (pós-sessão de 2026-09-22):** [`superpowers/handoffs/2026-09-22-radiant-prompt-de-continuidade.md`](superpowers/handoffs/2026-09-22-radiant-prompt-de-continuidade.md) — cobre as duas frentes abertas (Task 8 e L2 do currículo V3), os sete commits não empurrados e as decisões que são do dono;
- relatório de execução (Tasks 1–7; Task 8 bloqueada por gates do dono):
  [`superpowers/handoffs/2026-09-14-radiant-1-4-relatorio-execucao.md`](superpowers/handoffs/2026-09-14-radiant-1-4-relatorio-execucao.md);
- lançamento da 1.3.1 (rejeição, resposta e aprovação):
  [`release/APP_REVIEW_REPLY_1.3.1.md`](release/APP_REVIEW_REPLY_1.3.1.md);
- **checklist de declarações à loja da 1.4:**
  [`release/CHECKLIST_DECLARACOES_1.4.md`](release/CHECKLIST_DECLARACOES_1.4.md)
  — confere cada declaração da §9 da spec contra o código e traz o comando que
  remede a afirmação de privacidade. As linhas de assinatura estão bloqueadas até
  o adaptador StoreKit existir.
- [`archive/`](archive/) — os 21 status datados, de 2026-04-05 a 2026-08-15,
  mantidos porque ADRs e planos os citam como evidência
- [`plans/2026-08-01-radiant-roadmap-mestre.md`](plans/2026-08-01-radiant-roadmap-mestre.md)
  — ordem e dependência entre as três frentes
- [`plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md)
  — execução da frente de lançamento

### Currículo V3 — direção editorial vigente

- estado e pendências: [`STATUS.md`](STATUS.md) e Onda J do
  [roadmap ativo](plans/2026-07-27-radiant-launch-roadmap.md);
- decisão: [ADR do currículo contínuo](adr/ADR-2026-08-27-curriculo-v3-trilha-continua.md);
- contrato aprovado e desenho do Arco 1:
  [spec V3](superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md);
- fundação técnica entregue:
  [plano J2](superpowers/plans/2026-08-27-curriculum-v3-foundation.md);
- próxima execução: [produção do Arco 1](runbooks/curriculum-v3-arco-1.md),
  começando pela L1, sem repetir a fundação nem ativar o V3 antecipadamente;
- inventário anterior e proveniência: [atlas das aulas](content/mapa-aulas/README.md);
- **auditoria independente da L2**, em três pareceres consecutivos — leia-os em
  ordem antes de tocar na lição, porque o padrão deles é o dado mais útil:
  [v3](content/2026-09-22-l2-parecer-v3.md) (a prosa descrevia correções que o
  código não fazia), [v4](content/2026-09-22-l2-parecer-v4.md) (os críticos
  estavam corrigidos; reprovou pelos defeitos que a correção criou) e
  [v5](content/2026-09-22-l2-parecer-v5.md) (idem, terceira vez).

A engenharia educacional abaixo permanece referência de contratos existentes;
não é autorização para reaproveitar automaticamente conteúdo ou domínio do
currículo anterior. O acompanhamento operacional do V3 é pelo Trello, conforme
o status, sem novas ações no Todoist.

### Sistema educacional por competências

- decisão: [`adr/ADR-2026-07-31-aprendizagem-por-competencias.md`](adr/ADR-2026-07-31-aprendizagem-por-competencias.md)
- spec: [`superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md`](superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md)
- execução: [`superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md`](superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md)
- emenda da Task 11 (algoritmo do agendador):
  [spec](superpowers/specs/2026-08-08-agendador-por-competencia-design.md) ·
  [execução](superpowers/plans/2026-08-08-agendador-por-competencia.md)
- kernel de checkpoints e loops do aluno:
  [spec](superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md) ·
  [execução](superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md) ·
  [ADR](adr/ADR-2026-08-09-kernel-de-checkpoints-e-loops-do-aluno.md) ·
  [privacidade](STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md) ·
  [rollout/rollback](runbooks/student-checkpoint-rollout-rollback.md)

O estado de 2026-08-13 é: Tasks **1–11 concluídas**; H3 foi encerrada por
aceitação do dono, preservando a coorte `first_frame` histórica como
`inconclusive`. H4 foi integrada à `main` pelo PR #3 com `ProductionBatchV1`, 12
atividades v2 nativas, checkpoint 2×5/80%, reforço e painel editorial. Produção
segue `off`; o gate restante é percorrer aprovação, reforço, retomada sem
respostas e acessibilidade em aparelho. Sync remoto permanece uma trilha H6
separada; nenhum OTA ou novo binário foi autorizado. A autoridade é o status
canônico; esta linha é conveniência e decai.

A Task 11 fechou **fora de ordem** porque o agendador que ela entrega não depende
de conteúdo v2: ele entra desligado. H4 agora fornece conteúdo curricular v2,
mas a leitura continua `off` pelo limite explícito de rollout e só acende após
os gates do kernel.

O primeiro hardening pós-entrega também fechou em 2026-08-09:
`CompetencyReviewService` passou a rejeitar números não finitos nos quatro
campos numéricos do cartão e a quarentenar o store. A guarda de ativação e a
varredura do padrão `jest.spyOn` sobre mocks oficiais também fecharam em
2026-08-09; o agendador continua inerte até conteúdo curricular v2.

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

`archive/EXECUTION_STATUS_2026-08-08.md` e anteriores são snapshots substituídos. Planos
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
