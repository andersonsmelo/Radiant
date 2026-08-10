# Radiant — Execution Status (2026-08-09)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-08.md`](EXECUTION_STATUS_2026-08-08.md)** como estado
canônico. O snapshot anterior continua sendo a evidência detalhada da submissão
iOS e do trabalho editorial de 2026-08-08.

## Mudança de produto fechada hoje: primeira vitória

A apresentação de primeiro uso continua com as três telas aprovadas e o mesmo
atalho de saída, mas os dois desfechos agora têm intenções distintas:

- **Começar** persiste a saída da apresentação, consulta o progresso atual da
  jornada e abre o próximo nó elegível a partir da tela de contexto;
- **Pular apresentação** persiste a saída e abre a Home;
- instalações novas chegam à primeira lição sem perder contexto nem ensino;
- instalações com progresso preservam a recomendação vigente, inclusive uma
  revisão vencida, sem `lesson-1` hardcoded;
- falha de bootstrap ou nó não navegável degrada para Home;
- toque duplo não dispara duas persistências nem duas navegações;
- **Rever apresentação** continua sem navegação automática ao final.

A coordenação ficou em `src/app/_layout.tsx`: primeiro persiste, depois resolve a
jornada, monta o `Stack` e só então faz `router.replace`. O fluxo não ganhou
rede, PII nem um segundo bootstrap de aplicação.

Evidência executada em 2026-08-09:

- `startup-gate.flow.test.tsx`: **14/14**;
- contrato estático do Maestro: **19/19**;
- `first-run.yaml`: **1/1 passed no simulador iOS 26.5 e 1/1 passed no emulador
  Android API 36**, sobre builds locais Release, exigindo a cópia de contexto
  derivada da primeira lição real depois de **Começar**.

**Ressalva obrigatória:** somente o flow de primeira vitória foi reexecutado em
2026-08-09. Os passes não promovem os demais flows da matriz de 2026-08-03 nem
aparelhos físicos.

Design e execução:

- [`2026-08-09-primeira-vitoria-design.md`](superpowers/specs/2026-08-09-primeira-vitoria-design.md)
- [`2026-08-09-primeira-vitoria.md`](plans/2026-08-09-primeira-vitoria.md)
- [`2026-08-09-primeira-vitoria-ios.md`](../radiant-app/docs/evidence/2026-08-09-primeira-vitoria-ios.md)
- [`2026-08-09-primeira-vitoria-android.md`](../radiant-app/docs/evidence/2026-08-09-primeira-vitoria-android.md)

## Lojas

### iOS

A leitura autorizada do App Store Connect em **2026-08-09** confirmou `1.3.1
(7)` ainda em **Aguardando revisão**, com liberação manual configurada. Nenhuma
ação de loja foi executada. Se a Apple aprovar, a liberação é ação do dono e
destrava a instrumentação pós-lançamento.

Permanecem fechados: ficha, preço gratuito, direitos de conteúdo, privacy
labels, smoke físico, VoiceOver e Gate 2. A Apple não depende da F2 do Google
Play.

### Android

F2 continua represada por **12 ou mais participantes durante 14 dias
consecutivos**. A última leitura do Play Console, em 2026-08-03, mostrou **2
participantes de 14 contas vinculadas**; vinculação não equivale a opt-in e o
relógio ainda não havia começado. O número atual pertence ao console e deve ser
medido pelo dono.

Também seguem pendentes IARC/Play, aparelho Android físico e TalkBack. Nenhum
deles reabre a submissão Apple.

## Sistema de aprendizagem por competências

Tasks **1–11** estão concluídas. A Task 11 fechou inicialmente fora de ordem
pelo plano do agendador por competência; com o lote autorizado e a Task 10
entregue, a próxima task numerada do plano original é a **Task 12 educacional**, checkpoint
e reforço adaptativo. O design transversal aprovado mais tarde em 2026-08-09
insere antes dela fundação transacional, shadow e runtime interno; a ordem
vigente está na seção **Design aprovado** abaixo.

O dono autorizou explicitamente em **2026-08-09** a produção do primeiro lote
original e sintético de mídia educacional. O gate de direitos da Task 3/G1 está
fechado sem reaproveitar os arquivos rejeitados:

- `Conteúdo/mídia/manifest.json`: `ready`;
- **1** ilustração original aprovada e **5** candidatos históricos preservados
  como rejeitados;
- PNG 1448×1086 com hash fixado, sem paciente, DICOM, dado pessoal ou fonte de
  terceiros;
- texto alternativo e três hotspots normalizados para fonte, feixe e detector;
- 36 fontes catalogadas: **17 blocked**, **15 reference-only**, **4
  authorized** — nenhuma imagem dessas fontes foi necessária neste lote.

A autorização cobre este lote original; não aprova os cinco candidatos
rejeitados nem autoriza publicação de novo binário.

### Quatro interações acessíveis concluídas em 2026-08-09

O registry do player passou de um para cinco tipos registrados: múltipla
escolha, hotspot, comparação, associação e ordenação. Hotspot possui toque e
lista textual equivalentes; comparação não depende só de cor; associação é
sequencial e não exige arraste; ordenação tem botões acessíveis de subir e
descer. Todos os alvos novos medem no mínimo 44 pt.

O player continua controlando a resposta e separando seleção de confirmação.
Respostas compostas são serializadas como lista de ids, ficam bloqueadas até
estarem completas e são avaliadas como sequência integral. O feedback é
anunciado uma única vez no evento de confirmação, inclusive quando a interação
é o último passo. Quatro stories agora entram no glob real do Storybook.

Evidência: **8 suítes/35 testes focados**, lint, typecheck e Storybook config
verdes; suíte completa com **66 suítes/414 testes**. O visual QA detectou quatro
nomes locais de estilo, eles foram alinhados ao contrato e a repetição fechou
com **0 regressões**. Validação manual em aparelho/VoiceOver/TalkBack permanece
um gate separado; nenhum binário foi publicado.

### Correção do agendador fechada em 2026-08-09

`temFormaDeCartao` agora exige `Number.isFinite` para `stability`, `difficulty`,
`reps` e `lapses`. O registro anterior usava `NaN` como exemplo, mas `NaN`
literal não é representável em JSON. A regressão usa o vetor persistível real:
`1e400` é JSON válido e vira `Infinity` no `JSON.parse`. Cada um dos quatro
campos foi coberto; cartão não finito vai para quarentena, o store ativo é
removido e a leitura retorna vazia. Teste focado: **23/23**.

### Ressalvas do agendador ainda abertas

1. ~~A degradação graciosa não tinha trava explícita.~~ **Concluída em
   2026-08-09:** a recomendação falha fechada quando o nó resolve apenas
   competências sintéticas legadas (`legacyOnly`). Mesmo recebendo uma vencida
   `competency:legacy:*`, `computeSnapshot` preserva `next-new`; o teste de
   regressão passou com **6/6**. `getDue` segue sem chamador de produção e a
   ativação futura exige que o resolver aponte para competência curricular real
   do conteúdo v2.
2. ~~O padrão perigoso de `jest.spyOn` sobre mock oficial aguardava varredura.~~
   **Concluída em 2026-08-09:** `CompetencyReviewService.test.ts` permanece
   como a única correção necessária. A revisão das demais suítes não encontrou
   outro `mockRestore()` sobre mock de módulo; os usos ativos miram `console` ou
   `Intl` reais, e `AccessibilityInfo` restaura espiões reais. A execução
   focada passou com **7/7 suítes e 89/89 testes**; não houve mudança adicional
   de código.

## Checkpoints e loops do aluno: governança, fundação, shadow e active interno

Em 2026-08-09 o dono aprovou a arquitetura transversal de checkpoints nas telas
principais e de dois loops conectados — pedagógico e editorial. A **Onda 1 foi
somente governança documental**: spec, plano versionado, ADR, contrato de
privacidade e runbook de rollout/rollback.

Decisões fechadas:

- checkpoint mínimo por tela principal, não por microinteração;
- kernel central com adaptadores e modos `off | shadow | active`;
- store shadow separado e produção em `off`;
- commit local recuperável com operação + intenção imutável na mesma escrita e
  recibo de idempotência atômico com cada efeito;
- intents fechados para lição, review e checkpoint; sete autoridades obrigatórias
  por subconjunto e retry automático pausado na 20ª falha sem perda de estado;
- telemetria local separada dos fatos `SyncEventV1` aceitos pela outbox;
- app continua local-first e anônimo; sync futuro fica desligado;
- Task 12 educacional passa a usar a fundação transacional em vez de transação própria;
- promoção editorial exige gates humanos independentes de clínica, direitos e
  acessibilidade;
- nenhum OTA ou binário é autorizado sobre `1.3.1 (7)` em revisão.

**Onda 2 concluída em `off`:** o módulo isolado
`radiant-app/src/features/student-checkpoints/` agora contém contratos e
schemas fechados, stores ativo/shadow, quarentena, coordenadores, journal
recuperável, sete autoridades transacionais e outbox auxiliar. Nenhum adaptador
foi conectado às telas, rotas ou serviços legados; portanto produção continua
`off` e não houve mudança observável em progresso, XP, desbloqueio,
recomendação ou navegação.

**Onda 3 concluída em `shadow`:** as 12 superfícies aprovadas agora usam um
registry fechado de `ScreenCheckpointAdapter` e um hook comum de ciclo de vida.
O profile `preview` observa no store shadow; `development`, `e2e-test` e
`production` resolvem para `off`, com produção forçando falha fechada mesmo
diante de override. A decisão shadow nunca chega ao router nem aos serviços de
progresso, XP, desbloqueio, recomendação ou pedagogia. Storage indisponível,
deep link inválido e catálogo alterado degradam sem interromper o legado.

**Onda 4 implementada localmente em `active` interno:** o profile dedicado
`checkpoint-internal` resolve `development+active` em iOS e Android, enquanto
produção permanece forçada em `off`, `preview` em `shadow` e sync remoto
desligado. A retomada global só navega depois do CTA explícito e está limitada à
apresentação, Lição, Revisão e checkpoint de unidade. Incompatibilidade volta à
Home com mensagem segura e invalida apenas na segunda falha. As autoridades
legadas continuam decidindo progresso, XP, desbloqueio, revisão e jornada.

O gate operacional da Onda 4 continua aberto. Os builds internos foram gerados:
Android `62d44f3f-30d0-4e12-b262-21b86ea6326c` terminou em `1.3.1 (6)` pelo
contador remoto, e o retry iOS Simulator
`2d718691-288d-498e-9825-a03b14411bd2` terminou em `1.3.1 (7)`. O primeiro iOS
(`6e4d88b8-55c2-404c-99dc-f8ce23772510`) falhou no auto-upload Sentry; o profile
interno agora fixa `SENTRY_DISABLE_AUTO_UPLOAD=true`, protegido por teste. O
Android foi instalado no AVD após remover uma cópia `1.3.1 (3)` de assinatura
incompatível, mas nenhuma coorte Maestro foi executada. Permanecem pendentes as
20 execuções antes/depois, p95, kill/relaunch real, VoiceOver/TalkBack e viewport
curto. Isso não promove H3 nem autoriza iniciar a Task 12.

A ordem técnica agora é: fechar o gate de dispositivo do ativo interno → Task 12 educacional →
Galáxia/pipeline/Unidade 1 → outbox e beta pedagógico local. Expansão depende
desse beta; sync remoto é uma trilha separada, bloqueada por carga/soak,
API/auth, conflitos e sink verificado.

Documentos:

- [`spec`](superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md);
- [`plano`](superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md);
- [`ADR`](adr/ADR-2026-08-09-kernel-de-checkpoints-e-loops-do-aluno.md);
- [`privacidade`](STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md);
- [`runbook`](runbooks/student-checkpoint-rollout-rollback.md).

### Evidência Loop da Onda 1

O run `run-1786305869956-bae24030` executou o ciclo completo:

- `VALIDATION_PASSED` com **13 validadores** — contratos documentais, conteúdo,
  app, API e links do cérebro;
- `STEP_SUCCEEDED` sem mudança fora dos 11 arquivos declarados;
- `MEMORY_WRITTEN`, fingerprint
  `13700470b9ba77d0bd385981ec50ed1e6d8f81af21f5e0fe07b09eb75a5711cd`;
- `RUN_CLOSED`.

A revisão corretiva foi executada pelo run
`run-1786307084391-4828fa75`:

- `VALIDATION_PASSED` com **13 validadores**;
- `STEP_SUCCEEDED`;
- `MEMORY_WRITTEN`, fingerprint
  `efab846a4ee9f19b1e39d54fab0dbf73cc662fb1ca5c9fbc5304457de8510100`;
- `RUN_CLOSED`.

O terceiro fechamento de contratos foi executado pelo run
`run-1786308284127-f1e7ed86`:

- `VALIDATION_PASSED` com **13 validadores**;
- `STEP_SUCCEEDED`;
- `MEMORY_WRITTEN`, fingerprint
  `b81b5b8e2a21ec27701bb79c6590956bdd5a4d87dd08da4b5c53a0f211a02e89`;
- `RUN_CLOSED`.

A reconciliação arquitetural final pertence ao run
`run-1786309389781-10028930`:

- `VALIDATION_PASSED` com **13 validadores**;
- `STEP_SUCCEEDED` sem mudança fora dos 13 documentos declarados;
- `MEMORY_WRITTEN`, fingerprint
  `852298cecda96587ab83976f459ca24a97117d156bcb7af9c88ad2cf393ac268`;
- `RUN_CLOSED`.

O primeiro run declarou 11 documentos; o segundo acrescentou e reconciliou o
README e a emenda do plano educacional original. Os três runs fechados e o run
final acima abrangem os **13 documentos atuais** desta governança. As evidências
são cumulativas: cada reconciliação preserva as anteriores e registra sua
própria validação no journal do Loop.

Essa evidência conjunta valida a governança documental. O commit documental
intencional é `41ce9b7`; não houve push.

### Evidência da Onda 2

O run `run-1786311202497-fd99173e` declarou os 24 caminhos de código,
evidência e documentação antes de editar. A validação local executada antes do
fechamento foi:

- TDD vermelho inicial: cinco suítes falharam porque os módulos de produção
  ainda não existiam;
- Jest focado: **5 suítes/58 testes**;
- lint focado e `tsc --noEmit`: exit 0, sem warnings;
- Jest completo do app: **71 suítes/472 testes**;
- crash injection antes/depois das sete autoridades, antes/depois da outbox e
  retry explícito depois da 20ª falha;
- `off` com bytes legados idênticos e zero leitura/escrita/relógio/id/efeito do
  kernel.

Os intervalos testados demonstram deduplicação e retomada nesses limites; não
são alegação irrestrita de “exactly once”. O status público do run Loop é a
autoridade para `VALIDATION_PASSED`, `STEP_SUCCEEDED`, memória e fechamento
finais. Evidência detalhada:
[`2026-08-09-wave-2-student-checkpoint-foundation.md`](../radiant-app/docs/evidence/2026-08-09-wave-2-student-checkpoint-foundation.md).

Não houve integração com telas, Task 12, sync remoto, build, OTA, binário,
mudança de `1.3.1 (7)` ou publicação.

### Evidência da Onda 3

O run `run-1786314104218-908d111b` declarou os 28 caminhos de código, testes,
configuração, evidência e documentação antes da primeira edição. A validação
local executada antes do fechamento foi:

- TDD vermelho: **4 suítes falhando** pelos módulos/ligações ausentes;
- matriz nova: **4 suítes/22 testes**;
- módulo completo de checkpoints: **9 suítes/80 testes**;
- regressão das telas tocadas: **10 suítes/47 testes**;
- lint exit 0, com 11 warnings legados e nenhum erro; typecheck exit 0;
- Jest completo do app: **75 suítes/494 testes**;
- produção e valores inválidos em `off`, `preview` em `shadow`, zero decisão
  shadow conectada a navegação ou domínio.

A matriz cobre entrada/saída, background, relaunch, deep link inválido,
catálogo alterado, storage indisponível e navegação repetida, com divergência
determinística nula nos casos executados e somente ids/códigos allowlisted.
Evidência detalhada:
[`2026-08-09-wave-3-student-checkpoint-shadow.md`](../radiant-app/docs/evidence/2026-08-09-wave-3-student-checkpoint-shadow.md).

Não houve promoção para `active`, CTA de retomada, Task 12, sync remoto, build,
OTA, binário, mudança de `1.3.1 (7)` ou publicação. O status público do run é a
autoridade para validação e fechamento finais.

### Evidência da Onda 4 — implementação local

O run `run-1786316805406-810b7633` declarou os 38 caminhos possíveis antes da
primeira edição. A entrega tocou somente o subconjunto necessário e foi
validada com TDD vermelho, **11 suítes/98 testes** focados, **10 suítes/102
testes** do módulo e `npm run quality` completo: **77 suítes/523 testes**,
typecheck, contratos estáticos e Visual QA sem regressões. O profile interno foi
resolvido pelo EAS CLI nos dois sistemas com `development+active`, distribuição
interna e sync remoto `false`.

O contrato Maestro novo cobre retomada offline explícita, mas ainda não foi
executado. Os builds internos iOS Simulator e Android foram concluídos e o APK
foi instalado no AVD; a sessão foi encerrada antes das coortes. Permanecem
pendentes mínimo de 20 execuções no mesmo aparelho/perfil,
persistência p95 ≤75 ms, restauração p95 ≤100 ms, delta de cold start,
VoiceOver/TalkBack e viewport curto. Evidência detalhada:
[`2026-08-09-wave-4-student-checkpoint-active-internal.md`](../radiant-app/docs/evidence/2026-08-09-wave-4-student-checkpoint-active-internal.md).

**Instrumentação do gate preparada no run `run-1786322344018-5986c9cc`:** o
app mede somente persistência/restauração quando `active` e o opt-in interno
estão ligados; cold start e Home→Lição vêm dos tempos end-to-end do Maestro.
O baseline `off` permanece silencioso. O relatório exige ≥20 amostras por
coorte e falha fechado nos quatro limites. Qualidade local: **78 suítes/527
testes**, contratos Maestro **21/21**, parser **4/4**, lint sem erros, typecheck
e Visual QA sem regressões. O gate continua aberto até execução real.

Não houve Task 12, sync remoto, build, OTA, binário, push, mudança de `1.3.1
(7)` ou publicação. O status público do run Loop é a autoridade para validação
e fechamento finais.

## Documentação viva reconciliada

READMEs, fluxo do cliente, PRD, arquitetura, roadmaps, fila, checklist, changelog
e runbooks de loja foram confrontados com este status em 2026-08-09. Saíram
instruções ainda tratadas como atuais sobre Apple sem team, TestFlight bloqueado,
disponibilidade remota da API, wizard de especialidade/meta e status substituídos. Os
registros datados foram preservados como históricos.

Esta reconciliação **não muda os gates de loja**: iOS continua aguardando a
Apple, Android continua no 12×14 e a API pública continua registrada em 502. O
gate de mídia, por outro lado, fechou com um ativo sintético autorizado.

## Qualidade da API no PR restaurada

O workflow `Radiant API Quality` ficou vermelho em 2026-08-09 depois que a
atualização documental tocou `radiant-api/README.md` e acionou a instalação
isolada da API. A causa não foi a documentação: `eslint.config.cjs` tentava
resolver `@typescript-eslint/parser` no pacote da API e, na ausência dele,
caía no `node_modules` do app. Esse atalho existia apenas no checkout local e
falhava no runner, que instala exclusivamente `radiant-api/package-lock.json`.

A API agora declara o parser diretamente e o fallback entre pacotes foi
removido. A comprovação local sob Node 20 foi `npm ci`, resolução do parser em
`radiant-api/node_modules`, `npm run lint`, `npm run build` e `npm run test`
(13/13). O PR #1 então passou nos checks independentes **Radiant API Quality**
(lint, build e testes) e **Radiant App Quality**. Isso não altera o estado da
API pública, que permanece em HTTP 502.

## Outros bloqueios e pendências

- A API pública continua fora do caminho crítico e sua última condição
  registrada é **HTTP 502**; o app permanece local-first.
- D1 está decidida e não implantada.
- B5 Android, C4, C5 e C6 exigem aparelho ou janela de host.
- A instrumentação pós-lançamento espera aprovação e liberação manual do iOS.

## Ordem recomendada

1. O dono consulta hoje o App Store Connect; se aprovado, faz a liberação
   manual.
2. Continuar recrutamento Android até 12 opt-ins e então contar 14 dias.
3. Executar runtime interno → Task 12 → conteúdo
   v2/ativação segura do agendador → Galáxia e pipeline.
