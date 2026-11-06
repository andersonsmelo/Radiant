# T06 — implementação congelada para revisão

**DONE_WITH_CONCERNS** — FIX3 congelado para revisão; P2 visual aguarda medição nativa final e P3 cauda permanece. Histórico inicial implementado e validado localmente em 2026-10-28T06:10:25.921001-03:00. Nativo, revisão independente e fechamento Loop pertencem ao controlador.

Worktree `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`; branch `claude/trilha-medalhao-design`; BASE/HEAD `d033433f268422020551ef3e4e20d2e121ec8ceb`. Mesmo writer `run-1793154878719-98187baa`; nenhum comando Loop/brain executado nesta retomada. Ownership respeitado; cinco arquivos de produto/testes/contratos alterados, o sexto consumidor permaneceu intacto. Documentação operacional do controlador foi preservada.

## Resultado

- Destino inexistente, tipo errado, unidade ausente ou fallback sem reward conhecido retorna automaticamente por `router.dismissTo('/(tabs)')` e RewardScreen renderiza null após resolver a leitura. Unidade é validada antes de setCurrentNode. Carregamento e erro de leitura permanecem distintos de ausência; erro oferece tentar novamente e saída.
- Reward válido usa JourneyMedal e resolveNodeTheme existentes, ouro para disponível/concluído, cinza quando bloqueado, título do catálogo e nenhuma estrela ou XP fictício. O estado bloqueado conserva saída. O concluído mostra Continuar ligado ao destino real (lição/revisão/checkpoint/reward ou trilha), com hint da ação.
- canCollectReward e sua tabela foram preservados. markNodeCompleted continua autoridade de coleta. Snapshot de recusa não dispara avaliação nem celebração. Ref de operação e IDs confirmados impedem callback capturado de recolher durante o pedido e após confirmação. Não se promete idempotência absoluta do serviço: contrato lógico, timestamp e sync continuam intactos.
- Fallback sem ID mantém o ID escolhido quando o snapshot passa a completed, inclusive com outro reward disponível. Saída e reabertura por ID confirmado não recolhem nem solicitam avaliação outra vez. Contexto da área de origem conserva getSnapshotForNode/baseSnapshot.track. Shadow reward e CONTENT_VERSION permanecem, sem restore ativo.
- reward-unlock preserva percurso real das sete aulas e agora segue Continuar até a trilha. reward-locked mantém o ID canônico e também cobre destino inexistente. Contrato novo sobre o botão vivo usa AST e exige o onPress real, não texto de comentário.

## Evidência por fase

| Fase | Resultado |
|---|---|
| RED herdado, executado pelo I original | 13 FAIL / 15 PASS / 28, 19.908s; prefixo intacto por SHA |
| RED adicional anterior ao produto | 15 FAIL / 15 PASS / 30, 23.231s; guardas válidas de observação |
| RED fallback anterior ao produto | 1 FAIL / 30 skipped / 31, 8.717s |
| RED contrato Maestro | dois casos causais separados, 1 FAIL / 38 skipped em cada seleção |
| GREEN focal inicial | 4 suítes / 85 testes, 10.827s |
| Contraprovas iniciais | 8 produto + 4 contrato detectadas e restauradas; R1 limitou a antiga invalid-unit-activated à prova de retorno (:253) |
| FIX1, contraprova isolada adicional | ativação indevida com dismiss/null preservados: falha exata em :255; 1 FAIL / 30 skipped / 31, 8.832s; GREEN mínimo restaurado 1 PASS / 30 skipped / 31, 6.862s, exit 0 |
| GREEN focal final restaurado, taskpolicy -b | 4 suítes / 85 testes, 54.844s |
| Regressões JourneyHome/Definition/Recommendation/UnitProgress | 4 suítes / 76 testes, 18.197s |
| Maestro contrato completo final | 39/39, exit 0 |
| TypeScript final | tsc --noEmit exit 0; TS7006 inicial corrigido e log preservado |
| Lint paths alterados | exit 0 |
| visual:qa:strict | 463 arquivos; 0 regressões, 49 baseline + 3 exceções existentes, exit 0 |
| Diff | git diff --check exit 0 |

Comandos/Node/CWD/saídas completos em red.txt e green.txt; índice de linhas, proveniência, hashes e contraprovas em audit.md e mutations.json. As 8 suítes Jest (161 testes) são o conjunto focal/regressivo desta tarefa; **não equivalem ao quality completo**.

## Self-review do freeze inicial

Conferidos os quatro estados, fronteira de unidade antes da ativação, destinos recomendados reais e bloqueados, prêmio não concedido por redirect/saída, confirmação do serviço antes do RatingPrompt, callbacks capturados, persistência do ID do fallback e preservação de contexto/serviços/shadow. As mutações inflight e póscoleta são independentes. O teste de medalha inspeciona o desenho SVG real do componente compartilhado, sem mock da medalha nem espelho de props. Esse teste não rasteriza nem comprova composição visual no dispositivo. A única adaptação do harness de UI foi observação correta de RewardScreen e passagem dos props do AppButton; PixelHeroSplit continua mockado e não sustenta alegação visual.

## Preocupações e pendências

- JourneyNodeCompletionGuard tem console.error anterior no mock de SpacedRepetitionService.getCardState; os testes passam, o aviso foi preservado e descrito em audit.md. Não foi usado como evidência de ausência de erro em dispositivo. Preexistência confirmada no GREEN T05:2186-2193, com o mesmo SHA do consumidor. JourneyHome também registra o erro esperado `storage unavailable`, injetado pelo teste existente na linha 545; log preservado.
- Não houve nativo, gesto/volta física, execução Maestro em dispositivo, build ou instalação. A verificação desses pontos e os gates G1–G8/G2/T14 continuam com controlador/dono. Nenhum uso do simulador reservado, relógio, clearState ou mudança de storage ocorreu.
- Sem commit/push/CI/merge, sem quality completo e sem fechar/validar o writer do controlador. Produto está congelado nos seis hashes abaixo; mudanças dependem da revisão coordenada.

**Freeze R1/FIX1 histórico; o freeze atual FIX3 está ao final.**

| Path | SHA256 |
|---|---|
| `radiant-app/src/features/rewards/screens/RewardScreen.tsx` | `727cc17bf1099af3218ce70ff1c3f8fd2f5a29a8a8a0c3dc2a9809444aa026e7` |
| `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx` | `5f34ce4e62c27f433eb0d4fb6ab09e1b170a8a0d2d25e91a2363e3d1d1cfa5c9` |
| `radiant-app/.maestro/reward-locked.yaml` | `5adc42a3333fa67930fd61ce5e4c31d78c02797ffe658516a3d81e4eebd84d53` |
| `radiant-app/.maestro/reward-unlock.yaml` | `b4b9f90df9f8845b610b6c331df37ee755715ea21ce1fdade29770ee3096d0f7` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `f93b517123dd7993ae97648fffab1685c5f37cc79038a2f5a5a83b62f72f5759` |
| `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx` | `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28` |

## FIX1 — achado P2 de evidência causal atendido para nova revisão

A injeção inicial invalid-unit-activated foi preservada e reclassificada: ela demonstra falha de retorno em :253, não a asserção de não ativação. A nova contraprova invalid-unit-activation-preserves-dismiss chama setCurrentNode para o nó com unidade ausente e mantém dismiss/null corretos. O teste existente alcança e falha exatamente em RewardScreen.flow.test.tsx:255 (0 chamadas esperadas, 1 recebida). Source restaurado em finally, GREEN focal mínimo executado após restauração, seis hashes finais iguais ao freeze acima. Não houve mudança permanente de produto/testes nem repetição de suíte ampla. Audit/mutations/red/green contêm a prova e a classificação histórica corrigida. A aprovação da nova revisão permanece com o revisor; a observação nativa de fonte/cauda do balão não integra esta rodada.

## FIX2 — estado histórico para revisão e nova medição nativa

Freeze em 2026-10-28T06:36:29.108975-03:00. Somente RewardScreen.tsx e RewardScreen.flow.test.tsx mudaram nesta rodada. A tela observa fontScale exato e renova apenas a subárvore PixelHeroSplit, onde residem os Text e as medidas locais de layout. RewardScreen, snapshot, shadow, refs de coleta, scroll, medalha e controles ficam fora da chave. Nenhuma API, fonte, limite de escala, serviço, shared component ou política mudou. O diagnóstico e o índice causal completo estão em [audit.md](audit.md), seção FIX2.

| Fase FIX2 | Evidência |
|---|---|
| RED antes do produto | 4 falhas / 31 skipped / 35 total,7.612s, ausência da renovação dos hosts |
| GREEN recompensa completa | 35/35,9.079s |
| Contraprovas nominais | remover key falha4casos; key normal/grande falha em3.1→2.5; source restaurado em finally por SHA |
| GREEN mínimo após restauração | 4 passaram /31skipped /35total,7.437s |
| Maestro contrato completo | 39/39,exit0 |
| tsc --noEmit / lint source+teste | exit0 / exit0 |
| visual:qa:strict | 463arquivos,0regressões,49baseline+3exceções existentes,exit0 |

Self-review FIX2: o teste observa hosts de fala/eyebrow em1→3.1,3.1→2.5 e3.1→1, conserva o mesmo host quando a escala não muda e preserva identidade do scroll, medalha e controles. O caso inflight mantém botão desabilitado e a guarda do callback capturado; após confirmar, a coleta/RatingPrompt não se repetem na volta à escala normal e Continuar segue utilizável. Essas são provas do mecanismo local e da preservação de estado no harness. **Jest identity não rasteriza e os quatro testes novos não provam que o clipping nativo foi resolvido.** Contrato Maestro/UI strict também não significam execução de flow em dispositivo.

O P2 visual aguarda nova medição do executor/controlador **na mesma montagem normal→máxima→normal**, com pares de capturas/intervalos antes de qualquer relaunch, incluindo mensagem inteira por scroll, eyebrow e saída. A captura anterior live prova clipping em um frame2.325s após troca; duração/persistência não foram medidas. As capturas max/max-settled anteriores são pósrestart e não demonstram recuperação ao vivo.

**P3 da cauda permanece**, por decisão do controlador, como resíduo visual compartilhado para T17/revisão ampla. bubbleStyle atua no wrapper ancestral e não separa cauda/texto internos; não foi aplicado padding placebo, copy workaround ou alteração shared. A tela normal não é chamada visualmente limpa.

Sem nativo, build, instalação, Git, Loop/brain, quality completo ou novos agentes nesta rodada. Revisão e medição nativa pertencem ao controlador; nenhum teste iniciado por esta rodada ficou ativo.

### Freeze FIX2 histórico — seis hashes

Os quatro paths além de source/test conservam seus hashes de R1/FIX1. Em mutations.json, currentFrozenHashes é atual; sourceSha256 e fix1FrozenHashes preservam a proveniência histórica.

| Path | SHA256 |
|---|---|
| `radiant-app/src/features/rewards/screens/RewardScreen.tsx` | `55f8d535692d9acebff733def9c32e225488b63a8d40629b1f95cc5cebc95344` |
| `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx` | `19956acd8ee00996dc450025aece0be321faff58df3b43b958c6e3cc9101b4da` |
| `radiant-app/.maestro/reward-locked.yaml` | `5adc42a3333fa67930fd61ce5e4c31d78c02797ffe658516a3d81e4eebd84d53` |
| `radiant-app/.maestro/reward-unlock.yaml` | `b4b9f90df9f8845b610b6c331df37ee755715ea21ce1fdade29770ee3096d0f7` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `f93b517123dd7993ae97648fffab1685c5f37cc79038a2f5a5a83b62f72f5759` |
| `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx` | `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28` |

## FIX3 — estado atual congelado, DONE_WITH_CONCERNS

Freeze em 2026-10-28T07:41:04.914137-03:00, mesmo round/run. O parecer R4 demonstrou clipping real fora do hero no source FIX2: capturas4.492s e11.414s após troca, mesma montagem sem scroll/restart entre elas, mais cartões em scroll. As três imagens de entrada foram abertas por view_image nesta reposição. O inventário e a análise de fronteiras estão em audit.md, seção FIX3.

A correção renova por **fontScale exato** todos os12 Text locais (erro inicial, header, rodapé, título/descrição, labels de XP/sequência, erro de coleta e título/corpo de ação) e os6 Text internos das3 GalaxyStatRow sem estado, pela menor fronteira local existente. São15 keys novas. Hero FIX2 continua como estava. ScrollView, medalha, cards, state/refs de prêmio, AppButtons e AnimatedCounter permanecem montados; contador é TextInput animado e conserva instância/valor. Sem alteração shared/API, copy, estilo, teto de fonte, serviços, elegibilidade, economia, hearts, shadow/version ou fingerprint.

| Fase FIX3 | Evidência |
|---|---|
| RED antes do produto | 11 falhas /35 skipped /46total,11.087s, hosts reais retidos |
| GREEN recompensa inteira | 46/46,11.263s |
| Mutação retirar15keys novas | 11 FAIL; hero FIX2 preservado |
| Mutação limiar em vez de escala exata | 5 FAIL/6PASS, máximo→máximo nos3estados+2erros |
| Mutação remontar contador | 3 FAIL/8PASS na preservação de identidade AnimatedCounter |
| GREEN final restaurado, taskpolicy-b | 4suítes inteiras /100testes,46.197s,exit0 |
| TypeScript | TS2322 inicial de inferência no harness; anotação numérica corrigida, novo tsc exit0 |
| Lint source+teste | exit0 |
| Maestro contrato inteiro | 39/39,exit0 |
| visual:qa:strict | 463arquivos,0regressões,49baseline+3exceções existentes,exit0 |

Self-review: os casos observam Text reais por identidade em available/locked/completed e erros de leitura/coleta;1↔3.1 e3.1→2.5, além da estabilidade na mesma escala. Preservam controles/dados/leitura única/contador real; casos FIX2 mantêm inflight e pósconfirmação sem regrant/RatingPrompt duplicado. Todas mutações restauraram o source em finally por SHA. Um erro de classificação do agregador (ordem do resumo Jest) foi corrigido pela saída raw, sem repetir a mutação nem atribuí-lo a produto. A tipagem final `from as number` não altera runtime; a suíte focal restaurada precede essa anotação e tsc/lint final a incluem. Logs completos e limites honestos em audit/red/green/mutations; prefixo histórico174024bytes preservado.

Focal final incluiu RewardScreen.flow, JourneyNodeCompletionGuard, JourneyProgressService e student-checkpoints/screen-integrations. Os warnings de cenários do JourneyProgressService e o console.error herdado de mock getCardState do consumidor foram preservados, com100/100passando. Não houve necessidade de editar o sexto consumidor. Nenhum teste ficou ativo, nenhuma suíte ampla inalterada foi repetida e não rodei quality completo.

**Pendências:** P2 visual aguarda medição nativaR3 do source final e revisão independenteR5 pelo controlador; identidade Jest/AST/UI strict não provam rasterização. Medir na mesma montagem normal→máxima→normal, pares temporizados e scroll de todos os textos, com abertura inicial máxima separada. P3 cauda normal continua resíduo real deferido aT17, sem alteração shared/copy/padding placebo. Nativo Android/disponível/coletado, gesto/VoiceOver falado/aparelho/fps/produção/segundo dia não são comprovados por este trabalho. Sem nativo/build/instalação/commit/push/Loop/brain/novos agentes nesta reposição. Run e sessão são do controlador; G1–G8/G2/T14 continuam pendentes sob dono.

### Freeze FIX3 atual — seis hashes

Apenas source e teste mudaram neste FIX3; os outros4paths mantêm FIX2. currentFrozenHashes/currentFreeze em mutations.json apontam este freeze; hashes/histórico FIX1/FIX2 foram conservados.

| Path | SHA256 |
|---|---|
| `radiant-app/src/features/rewards/screens/RewardScreen.tsx` | `2fc7517cc11e5fe0f494321cbfcfbbe2b8d8cc8a2d51dd22cf800c7e226d2038` |
| `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx` | `5194883d9e612bbdbe680eff037bf0075da990524da0dbe8949595220d55910d` |
| `radiant-app/.maestro/reward-locked.yaml` | `5adc42a3333fa67930fd61ce5e4c31d78c02797ffe658516a3d81e4eebd84d53` |
| `radiant-app/.maestro/reward-unlock.yaml` | `b4b9f90df9f8845b610b6c331df37ee755715ea21ce1fdade29770ee3096d0f7` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `f93b517123dd7993ae97648fffab1685c5f37cc79038a2f5a5a83b62f72f5759` |
| `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx` | `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28` |
