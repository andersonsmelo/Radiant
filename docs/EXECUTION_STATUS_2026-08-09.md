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
- `first-run.yaml`: **1/1 passed no simulador iOS 26.5**, sobre build local
  Release, exigindo a cópia de contexto derivada da primeira lição real depois
  de **Começar**.

**Ressalva obrigatória:** a última matriz Android é de 2026-08-03 e antecede
esta mudança. O YAML atualizado ainda precisa ser executado no Android; o passe
iOS não promove a outra plataforma nem os demais flows da matriz.

Design e execução:

- [`2026-08-09-primeira-vitoria-design.md`](superpowers/specs/2026-08-09-primeira-vitoria-design.md)
- [`2026-08-09-primeira-vitoria.md`](plans/2026-08-09-primeira-vitoria.md)
- [`2026-08-09-primeira-vitoria-ios.md`](../radiant-app/docs/evidence/2026-08-09-primeira-vitoria-ios.md)

## Lojas

### iOS

A última leitura autorizada do App Store Connect, em **2026-08-08 às 12:05
BRT**, registrou `1.3.1 (7)` em **Aguardando revisão**. O repositório não informa
o estado de hoje; somente o console pode fazê-lo. Se a Apple já aprovou, a
liberação manual configurada é ação do dono e destrava a instrumentação
pós-lançamento.

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

### Ressalvas do agendador ainda abertas

1. `temFormaDeCartao` em `CompetencyReviewService.ts` aceita `NaN` porque usa
   `typeof value === 'number'`. O valor se propaga em `scheduleNext` e prende o
   cartão em `DUE_AT_INDETERMINADO`. A correção local prevista é
   `Number.isFinite`; **não foi feita nesta entrega**.
2. A degradação graciosa não tem trava explícita. O agendador entra desligado
   porque `getDue` não possui chamador e chamadas a `computeSnapshot` omitem o
   terceiro parâmetro, não porque uma guarda impeça sua ativação.
3. O padrão perigoso de `jest.spyOn` sobre mock oficial já foi corrigido em
   `CompetencyReviewService.test.ts`, mas não houve varredura das outras suítes.

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
2. Reexecutar o `first-run.yaml` atualizado no Android; o iOS já está `passed`.
3. Continuar recrutamento Android até 12 opt-ins e então contar 14 dias.
4. Resolver direitos do lote de mídia; só depois retomar Task 10 → conteúdo v2
   → ativação segura do agendador → Task 12.
5. Se o agendador for tocado antes disso, corrigir primeiro a aceitação de
   `NaN` e cobrir a quarentena/recuperação.
