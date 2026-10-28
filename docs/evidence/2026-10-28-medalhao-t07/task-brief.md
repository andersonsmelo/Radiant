# Task9/T07 — brief vinculante R1

CWD /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20.
Branch claude/trilha-medalhao-design; BASE_TASK c694f95191d990f78056f4985c958b9ebe7518e5.
T06 publicada/CI246+151SUCCESS exactSHA; readsessionT07 brain-session-1793196240376-47a0d28b
consultada CLI/00referencehash0485d744 e será fechada anteswriter por brain-links.
Writer será fornecido após STEP_STARTED, nenhuma escrita antesdele.

## Cartão operacional inteiro

### Task 9: T07 — Fila de revisão

- **Dono:** I; **revisão:** R. **Skills:** T, U; **recursos:** Jest, inspeção nativa.
- **Pré-requisito:** T01 e `useReview` atual lido. **Saída:** fila/origens verdadeiras, sem Pixel, vida única e resposta persistida preservadas.

## T07 literal inteira do integrador

### T07 — Revisão como fila real, sem Pixel

**Plano 5/tarefa 6. Modificar:**
`radiant-app/src/features/review/screens/ReviewScreen.tsx`, `ReviewScreen.flow.test.tsx`.
**Criar:** `radiant-app/src/ui/components/ListRow.tsx`, `ListRow.test.tsx`.

- [ ] Testar fila com itens, vazia, erro de leitura/gravação, retomada e conclusão.
- [ ] Reusar `useReview`; não inventar método de serviço para conseguir a lista.
- [ ] Mostrar contagem e origens verdadeiras; retirar mascote do início e do fim.
- [ ] Preservar prêmio de vida único por fila, registro de resposta e saída.
- [ ] Rodar testes e conferir leitura acessível, inclusive sem a fala do Pixel.

## Global Constraints literais

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.

## Plano5/Tarefa6 literal

### Tarefa 6: Revisão

**Arquivos:**
- Modificar: `radiant-app/src/features/review/screens/ReviewScreen.tsx`
- Criar: `radiant-app/src/ui/components/ListRow.tsx`
- Testar: `ReviewScreen.flow.test.tsx` e `radiant-app/src/ui/components/ListRow.test.tsx`

**Interfaces:**
- Produz:
  - `ListRow(props: { leading?: React.ReactNode; title: string; detail?: string; trailing?: React.ReactNode; onPress?: () => void; accessibilityLabel?: string }): React.ReactElement`,
    linha com divisória, sem cartão; vira `Pressable` só com `onPress`;
  - a revisão em ordem de leitura: HUD, título "Revisão", a linha
    `"N itens de <unidade>. Leva uns M minutos."` com M arredondado de
    `N × 40 s`, a lista dos itens (assunto e há quanto tempo foi visto, com a
    medalha da aula de origem em 34 pt), e "Começar" no rodapé. Sem anel, sem
    Pixel e sem o cartão "Como essa sessão funciona".

- [ ] **Passo 1: Escrever os testes que falham**

- a ordem na árvore é título, contagem, itens, botão (o botão vem depois);
- não há `PixelIllustration` nem o anel "0 de 5";
- com 1 item, "1 item de …".

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/review src/ui/components/ListRow.test.tsx`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

Os assuntos vêm de onde a tela já busca os itens devidos
(`SpacedRepetitionService`). Se o serviço não expõe o título do item, use o
título da aula de origem; não invente texto.

- [ ] **Passo 4: Ver passar, com Maestro**

Run: `cd radiant-app && npx jest src/features/review src/ui/components && npm run test:maestro-contract`
Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/review radiant-app/src/ui/components/ListRow.tsx radiant-app/src/ui/components/ListRow.test.tsx
git commit -m "feat(revisão): título, contagem, itens e um botão, nessa ordem"
```

## Autoridade e rulings de dados

Spec11.3 linhaRevisão: título,contagem real,listaitenscom medalhaorigem,
umbotãoembaixo,semanelePixel. Preservar regrasvidas/estrelas/avaliação/revisão.
Remover Pixel do início E fim e anéis da tela incluindoativo; progressoativo
continuaTEXTUAL e cálculos shadow/ativo são preservados. Não trocar resumo
próprio por LessonSummary nem editar componentecompartilhado semnecessidade.

useReview atual é fonte da fila, mesmo array/referência: não reconstruir a
queue ou carregarporoutrométodo. UI pode derivar metadados de queue memoizados.
ItemReviewService.loadQueue via getAllCards e legadofallback. Hook já expõe
queue/currentItem/currentIndex/totalItems/sessionXp/loading/state/startReview/
submitAnswer/continueReview/answerFeedback/saving/persistenceError/retrySubmission.
Resposta real recordAnswer aconteceantesfeedback; preserveajuda+concorrência,
retrymesmosargumentos/data,4XPsemduplicata. Nãoalterar hook/service/algoritmo
agenda/currículo/APIs/economia. WeakSet rewardedReviewQueues+ref tela preserva
vida única por referênciafilafinalizada e reverte marca sófalha. Repetidore/render
remountmesmaqueue NÃOpremiaoutravez,emptyNOpremia;falharewardpermiteretry.

ReviewItem{lessonId,question,card?},questionnão títuloassuntoseparado: usar
TÍTULO real da aula/origem, nunca prompt como previewgabarito e nuncainventar
assunto. Identidade lista inclui questão/carditemKey, não deduplicar poraula.
APIs existentes LessonCatalogService.listTracks/listLessonSummaries/getLessonById,
JourneyDefinitionService.getTrackDefinition e catálogo produtivo checkpoint
getCheckpointByNodeId/getBatchByCheckpointNodeId. Aula corresponde node.lessonId,
checkpointpodecorrespondernode.id. Não construir nó inventado para medalha.
Origemnãomapeável aparece desconhecida, semmedalha/título fictício.
resolveNodeTheme(node,unit) eJourneyMedalexistentes; size éRAIO. Ruling34pt=DIÂMETRO
visual, usarraio17; teste dimensões reaisSVG/host emvezespelharsizeprop.

card.lastReviewedAt SOMENTE é histórico real de revisão quando lastAttemptId
não nulo E data válida não futura. Seeds/reconcileVersions gravam now com
lastAttemptId=null: nunca chamarvistoagora. Semcard,inválido,futuro ou lastAttempt
nulo devemexpor datadesconhecida/semregistro, sem usar dueAt/createdAt como
substituto e sem escondererroleitura comoempty. Rótulorevisado/últimarevisão
podeexpressardadoatualcomprecisão sem dizerqueéúltimavisualizaçãonãoobservada.
Filaunidadeúnica: Nitem(s) de<unidadereal>. Mistura: apresentarunidadesreais
ouformulaçãopluralhonesta; nenhumaorigemdesconhecida éatribuídaàprimeiraunidade.
Estimativa do plano round(N*40/60),singular/plural:1→1min,2→1min,3→2min;
N0éemptysemestimativaartificial. Elaéestimativa deUI, não cálculoagenda.

ListRowAPIexata doPlano: leading/title/detail/trailing/onPress/accessibilityLabel.
Semcartão,divisória;ViewsempressãoquandonãoonPress,PressablesóseonPress,
role/hint/alvotoque adequados,leituracontígua,title/detail legíveisfontemáxima.
Não poluirfluxo com APIs/detalhesdeimplementação. TokensSora/Medalhãocanônicos.
Remodelaríndice eestadofinal sem afrouxarReviewCard answerbeforefeedback.

## Ownership implementador (união nominal fechada)

- radiant-app/src/features/review/screens/ReviewScreen.tsx
- radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx
- radiant-app/src/ui/components/ListRow.tsx
- radiant-app/src/ui/components/ListRow.test.tsx
- radiant-app/.maestro/review-due.yaml
- radiant-app/.maestro/rating-prompt.yaml
- radiant-app/.maestro/g4-native-evidence.yaml
- radiant-app/scripts/maestro-contract.test.mjs

Mais SOMENTE docs/evidence/2026-10-28-medalhao-t07/implementation-report.md,
audit.md,red.txt,green.txt,mutations.json. Rootpossuidocsstatus/roadmap/integrador/
plano/índice/evidênciaprincipal/fechamentoCI. VocêNÃOestásozinho:preserveajustes
root/declaredbaseline. Seoutropathfornecessário,nãoescreva;reporteimpedimento
específico. NãoeditaruseReview/serviços/catálogo/LessonSummary/copybaseline/policy.
Auxiliares SOMENTE .superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/.
Semagents/Loop/brain/Gitmutation/commit/push/native/install/build/fixtures/reset.

3YAML consumidores+maestro-contract dependem Começar revisão; CTA agoraComeçar.
Preservar Resultado da sessão para contratoexistente. Novaguarda desource lê
AST/não regexqueaceitacomentário; sem migrarcontratosnãoafetados.
Copy-style-baseline nãoalterarparaesconderregressão;reduçõespodemavisar.

## Verificação e observações aplicáveis

App Node20.20.2,EXPO_NO_DOTENV=1,rawCWD/node/command/exit/timing.
Focal obrigatório em radiant-app:
EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache
src/features/review/screens/ReviewScreen.flow.test.tsx
src/features/review/hooks/useReview.test.ts
src/ui/components/ListRow.test.tsx.
Somarconsumidoresdiretosnecessários medidos. Umafocal sob /usr/sbin/taskpolicy -b
quando testesdetela novoscomo§9;não múltiplassuitesamplasinalteradassemcausa.
node --test scripts/maestro-contract.test.mjs;tsc --noEmit;eslintpaths tocados;
visual:qa:strict seUI. Rootfaz UMAconfiguredfinalLoopquality, não autor.

TDDreal: demosred específicos antescódigo paraordemtítulo/contagem/lista/CTA,
1itemplural/estimativa,doisitensmesmaaulanãodeduplicados,origensunidadesmistas/
unknown/dataforjada,Pixeliniciofim observável (mocksopaqueatuais seriamcegos),
semaneleativo,início/fim,empty/loading/readerror/writetry/resume/completion.
Erroleituradistintoempty; ajuda/confirmarresposta antesfeedback preservados.
Prêmioúnico: rerender+remountmesmaqueue,empty,nativeawardfailure/retry;evitar
aspreservaçõesficaremmascaradasporoutrosfiltros. Hookreal testes comprova
persistência,nãoinferirdeflowmock. Contraprovasnominaisbarreirascausais+SHAfinally;
falhasdesintaxe/timeout/harnessnãocontam. Cadaasserçãonova observadafalhandocom
seu defeito, não vizinho. Red,caracterização e ajustesmock separados.

Fontemáxima: montageminicial≠trocaaoVivo≠max→max. T06provouhoststextpodemreter
medidas nativas; adotar mecanismoLOCAL adequado de fontes se necessário sem
reiniciar tela,hook,queue,CTA/contador/persistência/award. Testesidentitynão
rasterizam. Não allowFontScalingfalse nem capartificial parapassar. Pixelremovido
não depende de animaçãonova;reusemotionexisting se necessário,semnovastack.

UseTDD/verification-before-completion em /Users/anderson/.codex/plugins/cache/
claude-plugins-official/superpowers/7.0.0/skills eImpeccable Operate/harden/craft-floor
/Users/anderson/.agents/skills/impeccable/. Contextscript járodounestaconversa,
NÃOrodardenovo/nãoreparardrift porinferência. Observer260exactbarriers/264fontstates
aplicam. Nãoinventarnovodesign ou produtodecisões; técnicaUIreversível foi rulada.

## Entrega

DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED,fullreport+selfreview/8hashes,
paths/commands/results/redgreen/mutations/restores/limites. Freeze8produtopaths
apóschecksnecessáriosPASS; semmaiswrites atéreviewerscopedfix. Raw5evidências
nofolder2026-10-28,semrenomear. Nãoexecutar native nemfinalquality/Loop.
Revisorindependente recebeexatobriefR1+snapshot. Rootcontroladocs/lifecycle/Git/CI.
P3caudadeT06permaneceT17(shared nãoéparteT07),AndroidliveT06errodevlinking
nãoépermissão paramigrarframework. Nativeapósfreeze sóclientesexistentesprincipal
E262D4C1-99BE-496B-8567-0291C14E6533/AVDentrada; reservado5FD8C926NUNCA.
Segundodia/G1–G8/G2/T14/merge/build/install/EAS/OTA/loja/reset/policy/currículo
seguempendentes;semvaultdireto/segredos/externalwritesautoinferidos.
