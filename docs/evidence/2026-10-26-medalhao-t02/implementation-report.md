# T02 HUD — Fix2 para snapshot r3

Produto pausado para revisão e novas capturas nativas do controlador. Novo writer autorizado:run-1793011345601-6bbdc725 com STEP_STARTED e união33paths. Run anterior run-1793009906160-fa339b65 fechado pelo controlador sem validar nem declarar sucesso, apenas para substituir escopo; trabalho preexistente preservado. BaseGit55e21aef2d7aa1ab3c78685996c59629752595a8.

## Correção de integração

A captura inicial /learn mostrou5corações: o consumidor real usa QuizTopBar, separado deHUD. O ruling anterior preservava equivocadamente esse visual; brief r4 exige coração único na aula/quiz também.

HeartsCountPill agora é o componente finito compartilhado exportado deHUD. HUD usa seu rótulo completo com recarga; QuizTopBar usa a mesma pílula real, animação e contagem, passandohearts/maxHearts. A APIdeQuizTopBar permanece igual, assim como rótulos, botãofechar e progresso. Ilimitado continua somente∞ por estado real. Não há um segundoHUD ou dados fabricados.

A API exportada HeartsDisplay continua desenhando5quando chamada diretamente, para compatibilidade; QuizTopBar agora usaHeartsCountPill. Os5visuaisnafolha40pt seguemT12/spec11.3. Não foram produzidos nesta entrega.

Atualizados os3mockscompletosdeHUD nos testes QuizScreen.flow/LessonFlowScreen.flow/JourneyNodeCompletionGuard para o novo export; nenhum serviço modificado. Os testes QuizTopBar usam componente compartilhado real e verificam seu render, não um mock de pílula.

## Evidência Fix2 — Node20.20.2

- Vermelho antes de produto: task-3-fix2-red.txt,5falhas/6passam. Casos0/1/3/5: esperado1vetor, recebido5. Caso maxHearts7: rótulo correto, porém superfície/borda da pílula ausente. ∞jápassava e foi preservado.
- Verde: task-3-fix2-green.txt,7suítes/173testes. Suítes:HUD.test.tsx, QuizTopBar.test.tsx, HeartsSheet.test.tsx, QuizScreen.flow.test.tsx, LessonFlowScreen.flow.test.tsx, JourneyNodeCompletionGuard.test.tsx e MissionsScreen.flow.test.tsx. Missions é consumidorHUD adicional, sem edição.
- Mesmo log verde:102contratosmaestro/copy passaram.
- task-3-fix2-visual.txt:visualstrict0regressões,50baselined/3exceções,462arquivos.
- git diff --check:sem erro. Copybaseline inalterada; somente2registrosHUD R1/R2 retirados.

Avisos observados nas7suítes: act() em AppButton/useReducedMotionPreference(Sheet) e LessonFlowAttempt; LessonFlowScreen captura TypeError de mock SpacedRepetitionService.getCardState ausente no caminho de resumo. As7suítes passaram; não chamar a saída de limpa. Não ampliamos ownership para corrigir o mock de outro domínio.

## Evidência anterior preservada

Logs originais task-3-red/green/visual.txt; Fix1 task-3-fix1-red/green/visual.txt; injeções restauradas restore/rapid-loss/cleanup provaram asserções próprias de restauração, prazo da2ªperda e cleanupganho/∞/unmount. Relatórios/auditoriasR1eR2 preservados em task-3-report-r1/r2.md e task-3-audit-r1/r2.md.

## Limites

8arquivos de produto/testes alterados nesta tarefa(3anteriores+5Fix2), dentro da união nominal do controlador. Sem serviços, Sheet, HudIcons ou MaestroYAML alterados. Sem quality completo, nativo, build, instalação, brain/run próprios, commit ou push. Documentação e capturas concorrentes do controlador preservadas. Revisão, restartMetro, capturas definitivas e15validadores pendem do controlador. Nenhum aceiteG1–G8 inferido.
