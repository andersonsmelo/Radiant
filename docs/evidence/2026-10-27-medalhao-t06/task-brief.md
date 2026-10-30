# Task8 / T06 — brief vinculante R1

Worktree /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20.
Branch claude/trilha-medalhao-design; BASE_TASK d033433f268422020551ef3e4e20d2e121ec8ceb.
T05 concluída e publicada, CI245/150SUCCESS desseSHA confirmado por receipts.
Sessão cérebro T06 brain-session-1793153947009-39e14016 consultada viaCLI;
00Radiant consultada por referência/hash0485d744 e contexto relevante de IDs
derivados. O controlador fecha a sessão antes writer por brain-links.
Run será fornecido após STEP_STARTED; nenhuma escrita de produto antes dele.

## Cartão operacional literal

### Task 8: T06 — Recompensa

- **Dono:** I; **revisão:** R. **Skills:** T, U; **recursos:** Jest, contrato Maestro, nativo.
- **Pré-requisito:** T01. **Saída:** estados inválido/bloqueado/coletado com saída, sem alterar elegibilidade ou idempotência.


## T06 literal e inteira do integrador

### T06 — Recompensa sem saída morta

**Plano 5/tarefa 5. Arquivos:**
`radiant-app/src/features/rewards/screens/RewardScreen.tsx`, `RewardScreen.flow.test.tsx`,
`radiant-app/.maestro/reward-locked.yaml`, `radiant-app/.maestro/reward-unlock.yaml`.

- [ ] Testar deep link inválido, recompensa válida, bloqueada e já coletada.
- [ ] Demonstrar o vermelho do estado vazio sem saída; voltar à trilha quando inválido.
- [ ] Preservar `canCollectReward` e idempotência; redirecionar não concede prêmio.
- [ ] Rodar fluxo e contrato Maestro; conferir gesto/volta e registrar.


## Global Constraints literais

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.


## Plano5/tarefa5 original literal

### Tarefa 5: Recompensa sem estado vazio

**Arquivos:**
- Modificar: `radiant-app/src/features/rewards/screens/RewardScreen.tsx`
- Testar: `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx`

**Interfaces:**
- Produz: quando não há recompensa válida para o nó, a tela chama
  `router.dismissTo('/(tabs)')` no efeito de carga e não desenha nada. Com
  recompensa, a celebração usa a mesma peça da tarefa 4.

- [ ] **Passo 1: Escrever os testes que falham**

- sem recompensa: `router.dismissTo` com `'/(tabs)'`, e nenhum texto
  "Conquista indisponível", "elegível" ou "jornada" na árvore;
- com recompensa: a medalha de ouro e "Continuar".

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/rewards`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

- [ ] **Passo 4: Ver passar**

Run: o mesmo do passo 2. Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/rewards
git commit -m "feat(recompensa): sem recompensa, a rota volta para a trilha"
```


## Autoridade e interpretação vinculante

A spec aprovada §11.3 diz: a tela “Conquista indisponível” deixa de existir;
a rota volta para a trilha. HEAD JÁ possui botão de saída no inválido e no
bloqueado. Não alegar que HEAD é “vazio sem saída”. O vermelho real é o
retorno AUTOMÁTICO ao resolver ausência de recompensa, sem renderizar essa
tela; manter loading/erro de leitura distintos de ausência conhecida.
Inválido: ID inexistente/tipo errado/unidade ausente ou falta de reward no
fallback semID. Bloqueado: nó válido com elegibilidade insatisfeita; jácoletado:
statuscompleted ou estado confirmado de coleta. Não redirecionar os dois
últimos como se fossem nó inexistente; preservar saídas e ação real seguinte.

O plano5 prevê medalha ouro e Continuar na celebração com recompensa. Reusar
peça Medalhão existente (JourneyMedal/tema canônico, hooks se necessários),
sem chamar LessonSummary com estrelas/XP fictícios, inventar dados ou fazer
redesign. Rótulo de coleta deve expressar a ação real; rótulos e seletores
Maestro precisam permanecer coerentes. Tema/título vêm dos dados existentes.
Não mudar SDK/políticas/baselines/exceções/currículo ou serviços de prêmio.

Preservar canCollectReward exportado e sua tabela available/active+não
completed. Bootstrap/getSnapshotForNode e baseSnapshot.track mantém área de
origem; não usar área ativa errada. setCurrentNode somente quando devido,
markNodeCompleted continua autoridade de coleta, RatingPromptService somente
no evento correto. Snapshot retornado pelo serviço pode recusar elegibilidade
sem lançar; não presumir que retorno de Promise implica prêmio concedido.
Idempotência do serviço é lógica (IDs/backup); ele ainda grava timestamp/sync
em repetição. Não prometer idempotência absoluta ou alterar esse contrato.
Cobrir interação repetida/inflight/póscoleta sem inventar novas regras.
Shadow checkpoint reward e seu CONTENT_VERSION continuam; nenhum restoreativo.

## Ownership fechado do implementador

- radiant-app/src/features/rewards/screens/RewardScreen.tsx
- radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx
- radiant-app/.maestro/reward-locked.yaml
- radiant-app/.maestro/reward-unlock.yaml
- radiant-app/scripts/maestro-contract.test.mjs
- radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx

União nominal: só tocar o necessário. JourneyNodeCompletionGuard é consumidor
de autorização compartilhado, previsto para adaptar mock/guarda apenas se
necessário; não alterar JourneyProgressService nem outros serviços. O controlador
possui docs/status/evidência principal, autor só source/testes acima e os cinco
arquivos report/red/green/audit/mutations na pasta de evidência indicada.
Você não está sozinho: preserve trabalho alheio e ajustes do controlador.
Sem novos agentes, sessão/run Loop, commit/push, instalar/build/reset ou acesso
nativo antes de freeze. Se faltar caminho, pare só a escrita dependente e avise.

## Inventário de consumidores e contratos

RewardScreen.flow hoje cobre inválido só por texto; falta auto-dismiss,
render inicial jácoletado, clique de saídas/close/destinos e handler repetido.
Fixtureavailable alimenta também setCurrentNode, cujo retorno troca snapshot.
MockAppButton perde alguns props e PixelHeroSplit é apagado: tornar observação
adequada se a asserção depender desses elementos, sem fabricar fallback.
Mockserviço expõe apenas métodos atuais. Mockshadow requer hook E constante.

Maestrocontract recompensa usa regex de fonte/labels e catálogo derivado;
reward-unlock segue percurso real das sete aulas e proíbe shortcut deeplink.
Preservar suas invariantes ao mudar UI. Guarda nova/tocada sobre código usaAST,
não regex que aceita comentário; não migrar contratos não relacionados.
Regressões existentes a ler/executar conforme risco (sem editar por padrão):
JourneyNodeCompletionGuard, JourneyProgressService.test, JourneyHomeScreen.flow,
JourneyDefinitionService.test, JourneyRecommendationService.test,
JourneyUnitProgress.test e student-checkpoints/screen-integrations.test.

## Skills e execução

TDD e verification-before-completion instaladas em
/Users/anderson/.codex/plugins/cache/claude-plugins-official/superpowers/7.0.0/skills/.
Impeccable instalado /Users/anderson/.agents/skills/impeccable/SKILL.md:
Operate, direção Medalhão existente, ler harden e craft-floor antes UI.
Context script já executado nesta conversa: não rerodar nem reparar drift
por inferência. UI tokens e spec ganham sobre exemplosCSS/DOM da skill.
Animate-expo só se movimento necessário; reusar hooks atuais, sem nova animação
ou Reanimated em feature. Observer260: cada barreira deve ter caso negativo
que não seja mascarado por outra. Observer264: texto máximo inicial e troca
ao vivo são provas diferentes, Jest não rasteriza.

App/testes Node20.20.2, registrar node --version/CWD/command/saída. Focais:
EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache
src/features/rewards/screens/RewardScreen.flow.test.tsx
src/features/journey/services/JourneyNodeCompletionGuard.test.tsx
src/features/journey/services/JourneyProgressService.test.ts
src/features/student-checkpoints/screen-integrations.test.ts.
Node --test scripts/maestro-contract.test.mjs, tsc--noEmit, lint paths alterados
e visual:qa:strict se UI/labels mudarem. Uma focal sob taskpolicy-b quando
esperas assíncronas relevantes; não rodar quality/Loop final no agente.

Vermelho específico auto-dismiss e celebração/estado de acordo com requisito
antes código; casos4estados e saídas/destinos reais. Guardas de não conceder
prêmio por redirect e coleta única devem morrer com defeito específico na
barreira exata; logs de sintaxe/timeout/harness não são productmutation.
Preservar código/restaurar porSHA após injeções; registrar casos jáverdes como
caracterização, nunca fabricar “red inicial”. Não suprimir avisos antigos.

Relatório docs/evidence/2026-10-27-medalhao-t06/implementation-report.md,
mais red.txt/green.txt/audit.md/mutations.json nessa pasta. Auxiliares somente
SDD excluído. Retornar DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED com
selfreview, paths, testes por fase, hashes e limites; congelar produto.
Nativo/Loop/commit/CI pertencem ao controlador após freeze e revisão.

## Limites nativos previstos

Só clientes existentes compatíveis; principal iOSE262D4C1 e AVD de entrada,
jamais reservado5FD8C926. Invalidrota real /reward?nodeId=reward-inexistente;
bloqueado usa ID canônico do catálogo, não derivação inventada. Coletável
exige percurso real/estado legítimo já existente; sem clearState/storagefake/
relógio alterado para produzir cenário. JavaMaestro ausente na última medição:
não instalar. CLIUI existente pode conferir volta/gesto, registrar limites de
coletável/coletado se não alcançados naturalmente, sem declararE2Eexecutado.
Segundo dia fica no fechamento e G1–G8/G2/T14 continuam do dono.
