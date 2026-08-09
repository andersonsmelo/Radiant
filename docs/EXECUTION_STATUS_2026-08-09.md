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

Tasks **1, 2, 4–9 e 11** estão concluídas. A Task 11 fechou fora de ordem pelo
plano do agendador por competência; a próxima task técnica do plano é a **Task
10**, os quatro renderizadores.

O gargalo real continua sendo direitos, não implementação:

- `Conteúdo/mídia/manifest.json`: `awaiting-authorized-assets`;
- **0** itens aprovados e **5** candidatos rejeitados;
- 36 fontes catalogadas: **17 blocked**, **15 reference-only**, **4
  authorized**;
- bloqueado desde 2026-07-31.

Sem lote aprovado, Task 10 não tem mídia legítima para os jogos visuais; isso
trava conteúdo v2, o agendador já construído e a Task 12. A decisão é do dono e
nenhum agente deve contorná-la.

### Correção do agendador fechada em 2026-08-09

`temFormaDeCartao` agora exige `Number.isFinite` para `stability`, `difficulty`,
`reps` e `lapses`. O registro anterior usava `NaN` como exemplo, mas `NaN`
literal não é representável em JSON. A regressão usa o vetor persistível real:
`1e400` é JSON válido e vira `Infinity` no `JSON.parse`. Cada um dos quatro
campos foi coberto; cartão não finito vai para quarentena, o store ativo é
removido e a leitura retorna vazia. Teste focado: **23/23**.

### Ressalvas do agendador ainda abertas

1. A degradação graciosa não tem trava explícita. O agendador entra desligado
   porque `getDue` não possui chamador e chamadas a `computeSnapshot` omitem o
   terceiro parâmetro, não porque uma guarda impeça sua ativação.
2. O padrão perigoso de `jest.spyOn` sobre mock oficial já foi corrigido em
   `CompetencyReviewService.test.ts`, mas não houve varredura das outras suítes.

## Documentação viva reconciliada

READMEs, fluxo do cliente, PRD, arquitetura, roadmaps, fila, checklist, changelog
e runbooks de loja foram confrontados com este status em 2026-08-09. Saíram
instruções ainda tratadas como atuais sobre Apple sem team, TestFlight bloqueado,
disponibilidade remota da API, wizard de especialidade/meta e status substituídos. Os
registros datados foram preservados como históricos.

Esta reconciliação **não muda gates operacionais**: iOS continua aguardando a
Apple, Android continua no 12×14, mídia continua esperando decisão de direitos e
a API pública continua registrada em 502.

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
(13/13). A condição final da branch continua sendo os checks independentes do
PR; isso não altera o estado da API pública, que permanece em HTTP 502.

## Outros bloqueios e pendências

- A API pública continua fora do caminho crítico e sua última condição
  registrada é **HTTP 502**; o app permanece local-first.
- D1 está decidida e não implantada.
- B5 Android, C4, C5 e C6 exigem aparelho ou janela de host.
- A instrumentação pós-lançamento espera aprovação e liberação manual do iOS.
- O primeiro lote de mídia espera uma decisão explícita de direitos do dono.

## Ordem recomendada

1. O dono consulta hoje o App Store Connect; se aprovado, faz a liberação
   manual.
2. Continuar recrutamento Android até 12 opt-ins e então contar 14 dias.
3. Resolver direitos do lote de mídia; só depois retomar Task 10 → conteúdo v2
   → ativação segura do agendador → Task 12.
4. Antes de ativar o lado de leitura do agendador, adicionar uma trava explícita
   para que a degradação graciosa não dependa apenas da ausência de chamadores.
