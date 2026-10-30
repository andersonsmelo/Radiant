# Continuidade Medalhão — T12 Vidas

Passagem preparada em 29/10/2026, America/Bahia. Confirmar fechamento e publicação da T11 na evidência vinculada antes de iniciar T12. Este documento é um prompt de execução; reconcilie sempre com `docs/STATUS.md` e Git.

## Objetivo da próxima conversa

Continue por subagentes, apenas a **Task14/T12 — Vidas**. Não refaça T00–T11 ou P2 PushOptIn. O controlador cuida de Loop, escopo, evidência e documentação; implementador novo altera produto; revisor independente confere. Leia o estado final de T11 na [evidência](../../evidence/2026-10-29-medalhao-t11.md), nos recibos vinculados e no STATUS antes de tratar qualquer requisito como concluído.

## Checkout e fontes

Worktree `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`, branch `claude/trilha-medalhao-design`, [PR66](https://github.com/andersonsmelo/Radiant/pull/66). Não implementar no checkout principal.

1. Leia AGENTS.md, .loop/project.yaml, docs/STATUS.md e docs/plans/2026-07-27-radiant-launch-roadmap.md.
2. Leia Task14 de docs/plans/2026-10-25-medalhao-execucao-subagentes.md, T12 de docs/plans/2026-10-25-medalhao-pendencias-e-fechamento.md e tarefa11 de docs/superpowers/plans/2026-10-21-demais-telas-medalhao.md. Integrador/spec/ADR prevalecem sobre exemplos antigos.
3. Confira `git status --short`, branch, HEAD, histórico, worktrees e ref remoto. Se usar PR/CI para decidir, remedir no SHA exato; esta passagem não transfere um PASS de CI para outro commit.
4. Use lean-task-start, using-loop e desenvolvimento por subagentes. Abra cérebro próprio do objetivo, consulte contexto/00 Radiant pela CLI pública; nunca edite o vault. A sessão de T11 foi fechada antes do writer por reentrada de brain-links. Não reutilize run/sessão de T11.

## T11 — estado técnico e limites

T11 foi implementada por I/high e revisada por RF/high: R1 encontrou P2 no nome acessível anual, corrigido em fix1/R2 SpecPASS/APPROVED. Preço numérico/moeda opcionais vêm de Swift, sem parsing de displayPrice; planos Medalhão e CTA único usam ofertas reais.159 focais iniciais,48 fluxo final,47 CPU após fix1 e17 mutações causais; tipos/lint/copy/AST estáticos. Consulte evidência final para Loop/commit/CI, sem herdar PASS de um SHA anterior. R3 aprovou fix2 geométrico; Loop final15/15 no segundo ciclo após strict de raios falhar no primeiro. Writer T11 run-1793305617553-786111c0; cérebro CLOSED. Confirmar run CLOSED e Git/CI do commit antes de iniciar. Prova nativa segue G6.

## T12 — escopo e aceites

Comece pelos chamadores reais de HeartsSheet; enumerar todos antes do writer. Arquivos apontados pelo integrador: `radiant-app/src/features/hearts/components/HeartsSheet.tsx`, seu teste, `.maestro/radiant-1-4-vidas-esgotadas.yaml` e chamadores efetivamente afetados. A lista do plano é ponto de partida, não prova de completude.

- Ilimitado não abre a folha: provar nos chamadores, não só na aparência interna.
- Cinco corações e seus estados, título real, tempo até recarga, Revisar agora quando há revisões devidas.
- Assinatura é link; se a loja está indisponível, não inventar ação/produto.
- Preservar economia, primeira resposta, recarga, retorno à aula/revisão e todos os contratos vigentes.
- Vermelho causal antes código, focais com CPU limitada quando pertinentes, mutações específicas, revisão independente e uma final configurada. E2E integral de vidas fica em T18.

## Decisões e limites preservados

Direção Medalhão aprovada, Sora, Pixel vetorial somente nos quatro momentos, ouro funcional, lábio dos botões, `runtimeVersion: fingerprint`. Sem redesenhar identidade, SDK, currículo ou armazenamento por conveniência. Produto/currículo/storage/M7/A2 permanecem com Anderson. T10 usa filas nos serviços DailyGoal/Push para coordenar operações entre telas; não substituir por locks de navegação/UI.

T11 altera contrato nativo de metadados StoreKit: **G6 fica pendente** até autorização específica de build/instalação e prova em binário compatível. O cliente 1.4.0(3) existente não prova Swift novo. Testes JS/parse são estáticos; não equivalem a compra nativa, renderização, fala audível, fonte ao vivo ou FPS. Leia o parecer RF de T11 e eventuais limites antes de usar sua entrega.

G1–G8 seguem separados. G5 não permite inventar histórico semanal. G2/T14 segue conteúdo em desenvolvimento. P3 dos chevrons legais de T10 fica em T17; gesto iOS em Ajustes não passou nas duas tentativas, sem causa de produto confirmada. Segundo dia fica em T18.

## Loop e runtime

Node24.14.1 só para Loop; Node20.20.2 para app/testes. Declare união nominal completa (produto, testes, consumidores, artefatos e docs) conforme bytes reais e allowedRoots. Abra por `node scripts/loop/abrir.mjs`, espere STEP_STARTED. Um writer; PROJECT_BUSY é bloqueio real, sem contorno. Preserve `.loop/project.yaml` e `radiant-app/expo-env.d.ts`. Não alterar política sem decisão do dono.

Nenhum build/install/EAS/OTA/merge/loja/dependência/remoção de conteúdo foi autorizado. Implementação local, docs, commit/push próprios na branch e CI exato estão autorizados. Sem reset/clean/stash, relógio, fixtures ou storage privado. Sem tarefas ou mensagens externas automáticas.

Não usar, limpar, reinstalar ou alterar o reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3`. Para ensaio permitido em cliente compatível, os destinos usuais são E262D4C1-99BE-496B-8567-0291C14E6533 e AVD radiant-entrada-api34; confirmar identidade/serial novamente. Nunca usar alvo implícito booted. Antes e depois de runtime, medir fontes, processos, portas e reverse próprios; encerrar somente o que a sessão iniciou.

Final Loop: carga baixa, caffeinate, sem Metro/E2E concorrentes. `EXPO_NO_DOTENV=1 npm run quality` é o gate do app; Jest isolado não substitui. Validate → step finish → memória opcional → run close, chamadas separadas e code JSON conferido; fechar cérebro independentemente.

## Relatório esperado

Arquivos/commit/branch, vermelho/verde/mutações, revisão, validação completa, CI no SHA publicado, limites de evidência, gates humanos, processos e estados separados de writer/cérebro. Atualize STATUS e planos no mesmo escopo; não criar status paralelo. Prepare próximo objetivo em nova conversa.
