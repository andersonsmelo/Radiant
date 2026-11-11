# T06 — auditoria e índice causal

Medido em 2026-10-28T06:10:25.921001-03:00. Worktree: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`. Branch `claude/trilha-medalhao-design`; HEAD `d033433f268422020551ef3e4e20d2e121ec8ceb`.

## Proveniência do vermelho

O prefixo herdado de red.txt tem **174024 bytes**, SHA256 `556892c403911a80648065f7da5cd11c9b9865f75ef259da4307defb876d8615`, preservado byte a byte. Foi executado pelo implementador original, não por esta retomada: 13 falhas / 15 passes / 28 testes, 19.908s. A retomada inspecionou as falhas e o source ainda BASE antes da primeira escrita de produto.

As duas asserções herdadas `screen.toJSON() === null` confundiam a tela com o SafeAreaProvider do harness. Foram ajustadas para observar os filhos renderizados de RewardScreen. Essa alteração é correção de observação; o prefixo original não prova essa asserção. O RED adicional válido foi executado antes do produto: **15 falhas / 15 passes / 30 testes**, 23.231s; falhas por retorno automático ausente, erro de leitura não exposto, medalha/Continuar ausentes, recusa silenciosa celebrada e chamadas duplicadas. Não houve erro de sintaxe, import ou timeout global do Jest apresentado como defeito de produto.

O RED separado de fallback sem ID falhou **1/31, 30 skipped**, 8.717s: após coletar, findFallbackReward deixava de resolver o reward concluído. Após o primeiro GREEN, o mesmo teste ganhou segundo reward disponível, saída e remontagem por ID; essa extensão é caracterização posterior e foi validada pela mutação `fallback-forgets-selected`, nunca alegada como RED inicial.

O contrato Maestro novo teve dois REDs causais separados: primeiro faltava Continuar→trilha no unlock; depois faltava o deep link inválido no locked. Os 38 contratos não selecionados ficaram skipped nesses REDs, não aprovados por inferência.

- red.txt:5014: `Test Suites: 1 failed, 1 total`
- red.txt:5015: `Tests:       13 failed, 15 passed, 28 total`
- red.txt:5017: `Time:        19.908 s`
- red.txt:5021: `--- RETOMADA: RED adicional antes de produto; prefixo original preservado ---`
- red.txt:10343: `Test Suites: 1 failed, 1 total`
- red.txt:10344: `Tests:       15 failed, 15 passed, 30 total`
- red.txt:10346: `Time:        23.231 s`
- red.txt:10349: `EXIT: 1`
- red.txt:10351: `--- RED fallback antes de produto ---`
- red.txt:10435: `Test Suites: 1 failed, 1 total`
- red.txt:10436: `Tests:       1 failed, 30 skipped, 31 total`
- red.txt:10438: `Time:        8.717 s`
- red.txt:10441: `EXIT: 1`
- red.txt:10443: `--- RED contrato Maestro, antes dos flows ---`
- red.txt:10689: `EXIT: 1`
- red.txt:10691: `--- RED contrato inválido, após corrigir apenas unlock ---`
- red.txt:10913: `EXIT: 1`

## Índice das verificações

Todos os comandos desta retomada estão com CWD/Node/command/exit nos logs. Node **v20.20.2**. Nenhum quality completo nem Loop validate foi executado pelo implementador.

- green.txt:1: `PHASE: focal after product`
- green.txt:3: `COMMAND: EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache src/features/rewards/screens/RewardScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx src/features/journey/services/JourneyProgressService.test.ts src/features/student-checkpoints/screen-integrations.test.ts`
- green.txt:138: `Test Suites: 4 passed, 4 total`
- green.txt:139: `Tests:       85 passed, 85 total`
- green.txt:141: `Time:        10.827 s`
- green.txt:144: `EXIT: 0`
- green.txt:146: `PHASE: contract/static`
- green.txt:148: `COMMAND: EXPO_NO_DOTENV=1 node --test scripts/maestro-contract.test.mjs`
- green.txt:347: `# tests 39`
- green.txt:349: `# pass 39`
- green.txt:350: `# fail 0`
- green.txt:356: `EXIT: 0`
- green.txt:358: `PHASE: contract/static`
- green.txt:360: `COMMAND: EXPO_NO_DOTENV=1 npx --no-install tsc --noEmit`
- green.txt:365: `EXIT: 2`
- green.txt:367: `PHASE: contract/static`
- green.txt:369: `COMMAND: EXPO_NO_DOTENV=1 npx --no-install eslint src/features/rewards/screens/RewardScreen.tsx src/features/rewards/screens/RewardScreen.flow.test.tsx scripts/maestro-contract.test.mjs`
- green.txt:372: `EXIT: 0`
- green.txt:374: `PHASE: contract/static`
- green.txt:376: `COMMAND: EXPO_NO_DOTENV=1 npm run visual:qa:strict`
- green.txt:390: `EXIT: 0`
- green.txt:392: `PHASE: final restored product / final tests`
- green.txt:394: `COMMAND: EXPO_NO_DOTENV=1 /usr/sbin/taskpolicy -b npx --no-install jest --runInBand --no-cache src/features/rewards/screens/RewardScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx src/features/journey/services/JourneyProgressService.test.ts src/features/student-checkpoints/screen-integrations.test.ts`
- green.txt:529: `Test Suites: 4 passed, 4 total`
- green.txt:530: `Tests:       85 passed, 85 total`
- green.txt:532: `Time:        54.844 s`
- green.txt:535: `EXIT: 0`
- green.txt:537: `PHASE: final restored product / final tests`
- green.txt:539: `COMMAND: EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache src/features/journey/screens/JourneyHomeScreen.flow.test.tsx src/features/journey/services/JourneyDefinitionService.test.ts src/features/journey/services/JourneyRecommendationService.test.ts src/features/journey/services/JourneyUnitProgress.test.ts`
- green.txt:583: `Test Suites: 4 passed, 4 total`
- green.txt:584: `Tests:       76 passed, 76 total`
- green.txt:586: `Time:        18.197 s`
- green.txt:589: `EXIT: 0`
- green.txt:591: `PHASE: final restored product / final tests`
- green.txt:593: `COMMAND: EXPO_NO_DOTENV=1 node --test scripts/maestro-contract.test.mjs`
- green.txt:792: `# tests 39`
- green.txt:794: `# pass 39`
- green.txt:795: `# fail 0`
- green.txt:801: `EXIT: 0`
- green.txt:803: `PHASE: final restored product / final tests`
- green.txt:805: `COMMAND: EXPO_NO_DOTENV=1 npx --no-install tsc --noEmit`
- green.txt:808: `EXIT: 0`
- green.txt:810: `PHASE: final restored product / final tests`
- green.txt:812: `COMMAND: EXPO_NO_DOTENV=1 npx --no-install eslint src/features/rewards/screens/RewardScreen.tsx src/features/rewards/screens/RewardScreen.flow.test.tsx scripts/maestro-contract.test.mjs`
- green.txt:815: `EXIT: 0`

O primeiro tsc falhou com TS7006 em dois parâmetros `node` nos testes de medalha. Corrigiu-se somente a anotação estrutural do callback. A falha foi preservada em green.txt e o tsc final saiu 0. A primeira mensagem ao controlador que dizia tsc aprovado foi corrigida explicitamente antes do freeze.

Avisos preservados: JourneyProgressService emite os diagnósticos esperados de schema desconhecido, nó bloqueado e nó inexistente. JourneyNodeCompletionGuard passa com console.error anterior de LessonFlowScreen: `SpacedRepetitionService.getCardState is not a function` no mock compartilhado; não foi suprimido nem consertado nesta tarefa. O teste consumidor não precisou de adaptação para T06 e ficou intacto. A preexistência de getCardState foi conferida em docs/evidence/2026-10-27-medalhao-t05/green.txt:2186-2193 (FIX3, mesmo SHA do teste consumidor). A regressão JourneyHome emite também `storage unavailable`: o próprio teste já injeta essa rejeição em JourneyHomeScreen.flow.test.tsx:545, sem alteração de T06. Nenhum desses diagnósticos foi suprimido.

## Contraprovas

O lote inicial aplicou cada mutação sobre a baseline final, com âncora única (count==1) e restauração em finally. A revisão R1 identificou que invalid-unit-activated era detectada pelo retorno ausente, antes da asserção de não ativação; essa limitação foi corrigida pela prova adicional FIX1 abaixo. Logs completos ficam no SDD excluído; mutations.json contém comandos, Node/CWD, falhas, hashes da baseline/mutante/restauração e SHA dos logs. Nenhuma falha de harness foi contada como mutação morta.

| Injeção | Classe | Exit | Falha causal |
|---|---|---:|---|
| invalid-auto-grants | product | 1 | True |
| invalid-no-dismiss | product | 1 | True |
| invalid-unit-activated | product | 1 | True, somente retorno (:253); não prova ativação |
| duplicate-inflight | product | 1 | True |
| duplicate-after-confirmed | product | 1 | True |
| refusal-prompts-review | product | 1 | True |
| fallback-forgets-selected | product | 1 | True |
| eligibility-ignores-completion | product | 1 | True |
| continue-unbound | contract | 1 | True |
| flow-missing-continue | contract | 1 | True |
| flow-missing-invalid-link | contract | 1 | True |
| flow-missing-invalid-negative | contract | 1 | True |
| invalid-unit-activation-preserves-dismiss (FIX1) | product | 1 | True, barreira setCurrentNode (:255) |

O source restaurado tem SHA `727cc17bf1099af3218ce70ff1c3f8fd2f5a29a8a8a0c3dc2a9809444aa026e7`, igual à baseline das contraprovas. O GREEN focal final sob taskpolicy -b ocorreu **depois** das 12 restaurações. Os dois branches inflight e pósconfirmação foram removidos separadamente, sem mascarar um ao outro. O teste do fallback resolve o mesmo ID mesmo quando aparece outro reward disponível.

## Freeze R1 histórico dos seis paths de ownership

| Path | SHA256 |
|---|---|
| `radiant-app/src/features/rewards/screens/RewardScreen.tsx` | `727cc17bf1099af3218ce70ff1c3f8fd2f5a29a8a8a0c3dc2a9809444aa026e7` |
| `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx` | `5f34ce4e62c27f433eb0d4fb6ab09e1b170a8a0d2d25e91a2363e3d1d1cfa5c9` |
| `radiant-app/.maestro/reward-locked.yaml` | `5adc42a3333fa67930fd61ce5e4c31d78c02797ffe658516a3d81e4eebd84d53` |
| `radiant-app/.maestro/reward-unlock.yaml` | `b4b9f90df9f8845b610b6c331df37ee755715ea21ce1fdade29770ee3096d0f7` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `f93b517123dd7993ae97648fffab1685c5f37cc79038a2f5a5a83b62f72f5759` |
| `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx` | `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28` |

JourneyNodeCompletionGuard.test.tsx foi apenas lido/executado, sem diff. `git diff --check`: exit 0, saída vazia. Evidência bruta:

- `red.txt`: `fde2db72508c37aa8b71def015b405c57d0d44d70fcd670eeae184b10022de87`
- `green.txt`: `6008305c5ede9c1ac532026b179973e4e54a1bd1d744c36f2fa67089865a5667`
- `mutations.json`: `e2578e7e5954f101dd68ca172b2785cd71b9ba78376db9a4e38d6dd933726bb0`

## Limites

Validação local de UI e fluxo em Jest/AST e visual:qa:strict; sem rasterização de tela, leitura de gesto nativo, dispositivo, build, instalação, EAS, OTA, publicação ou restauração ativa. Os flows Maestro foram editados e validados por contrato, **não executados em dispositivo**. O simulador reservado 5FD8C926 não foi acessado. Nenhum agente, brain, writer, commit, push ou alteração de política foi criado por esta retomada. O writer do controlador permanece sob responsabilidade dele; a leitura de estado observou `editing`.

## FIX1 — contraprova isolada da barreira de unidade ausente

Medido em 2026-10-28T06:22:07.580299-03:00. Achado P2 da revisão R1: a injeção antiga invalid-unit-activated falha em RewardScreen.flow.test.tsx:253 (dismiss ausente), antes da asserção :255; o log antigo foi preservado integralmente e mutations.json agora limita sua prova ao retorno à trilha. Não é prova isolada da barreira de ativação.

A nova injeção `invalid-unit-activation-preserves-dismiss` chama indevidamente `await JourneyProgressService.setCurrentNode(rewardNode.id, baseSnapshot.track)` dentro do ramo de unidade ausente, sem consumir o retorno e preservando setSnapshot(null), setLoadedRewardId(undefined), dismiss e return. O teste existente passa pelas asserções :253 (dismiss) e :254 (nenhum filho renderizado) e falha precisamente em **:255**, `expect(setCurrentNode).not.toHaveBeenCalled()`: esperadas 0 chamadas, recebida 1, com unitId missing-unit. Assim, a evidência não depende de falha anterior de navegação/renderização.

- RED FIX1: 1 falha / 30 skipped / 31 total, 8.832s, exit 1; log `.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task8-fix1-mutation-invalid-unit-activation-preserves-dismiss.txt` (SHA256 `45344207c2b62664941b5fb3d747cc8137a7ec6e159fae13b6831b503da169ba`); cópia em red.txt:10916.
- GREEN focal mínimo após restauração: 1 passou / 30 skipped / 31 total, 6.862s, exit 0; green.txt:817. Nenhuma suíte ampla/quality foi repetida nesta rodada.
- Comando: `EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache src/features/rewards/screens/RewardScreen.flow.test.tsx -t 'unidade ausente volta sem ativar nem coletar o nó'`. Node v20.20.2, mesmo CWD de radiant-app; argv registrado para reprodução sem ambiguidade de espaços.
- **Os seis hashes de produto/testes/contratos continuam idênticos ao freeze R1.** Nenhuma alteração permanente de source/testes foi necessária. Restauração em finally verificada por SHA antes do GREEN e novamente ao concluir a documentação.
- Total histórico: 13 injeções detectadas (9 produto + 4 contrato); a antiga unidade prova somente retorno, enquanto a nova FIX1 prova especificamente a asserção de não ativação.
- Sem Loop/brain, nativo, build, instalação, Git ou novos agentes nesta rodada. A observação nativa de fonte/cauda do balão foi deixada para a triagem separada do controlador.

## FIX2 — reflow local em mudança de fonte; freeze histórico

Medido em 2026-10-28T06:35:35.278859-03:00. O parecer R2 encerrou o P2 de evidência FIX1 e registrou um P2 novo de clipping no Dynamic Type ao vivo, mais P3 separado da cauda. Foi lido integralmente, junto com PixelHeroSplit, SpeechBubble e o padrão T05 LessonSummary. O diagnóstico não usa a analogia de T05 como prova de causa.

### Evidência nativa de entrada e limite

Foi inspecionada a imagem live `task8-native-ios-locked-max-live.png` (SHA1aa9fd1ee692340aabe63711fea65913fb4273a86d089b52e1adf0b0a3ea1dda) e a normal `task8-native-ios-locked-normal.png` (SHA23c3631fae134c1deb395ee69f0467eccdae8bc505e56c7fa79b806f64f6dd7f). A proveniência do executor registra a captura live 2.324819s após a conclusão da troca de fonte. Ela prova clipping nesse frame. Não há segunda captura tardia da mesma montagem antes do scroll/restart; duração, persistência e recuperação ao vivo não estão medidas. locked-max.png e locked-max-settled.png são ambas posteriores a terminate/relaunch/deep link e só demonstram abertura inicial máxima, sem comprovar recuperação ao vivo.

### Fatos do host e mecanismo escolhido

PixelHeroSplit mantém os hosts Text e medições locais illustrationTop/renderedMessage entre alterações de dimensão. SpeechBubble mantém naturalHeight e aplica wrapper height animado com overflow hidden; esses fatos são compatíveis com o risco de medida/layout antigo, mas não demonstram isoladamente a causa do frame nativo.

RewardScreen passa a observar **fontScale exato** e renovar apenas a subárvore PixelHeroSplit por essa escala. A remontagem renova seus parágrafos e medições locais; RewardScreen, snapshot, refs de coleta, shadow, ScrollView, medalha e AppButtons permanecem fora dessa chave. Nenhum serviço, tela inteira, storage ou processo é reiniciado; nenhum teto de fonte foi introduzido. As props de estado/tier/copy do Pixel permanecem as existentes, preservando seus momentos. A subárvore visual do hero é renovada, não o estado de prêmio.

### Teste e contraprovas

O mock de PixelHeroSplit agora renderiza os Text recebidos e um host de observação. Ele permite verificar identidade de montagem; **não simula naturalHeight, não rasteriza e não comprova legibilidade nativa**. O wrapper SafeAreaProvider do teste é preservado pelo rerender.

- RED anterior ao produto em red.txt:10990: 4 falhas / 31 skipped / 35 total, 7.612s. Os hosts fala/eyebrow/hero eram os mesmos após 1→3.1, 3.1→2.5 e 3.1→1; o quarto caso falhou pela mesma ausência de renovação durante coleta em andamento.
- GREEN da recompensa completa após implementação em green.txt:869: **35/35**, 9.079s. Casos novos também mantêm identidade de scroll/medalha/controles, leitura/ativação única, botão desabilitado, refs de inflight/pósconfirmação e RatingPrompt único. Mesmo fontScale conserva o host. A coleta resolve normalmente depois da troca e Continuar permanece utilizável no retorno à escala normal.
- Mutação nominal `fix2-font-host-not-renewed`: remover somente a key do hero faz os quatro casos falharem por identidade antiga. `fix2-font-host-coarse-threshold`: key apenas normal/grande deixa 3.1→2.5 sem renovar e falha nesse caso, enquanto os outros três passam. Cada source foi restaurado em finally por SHA; os logs e a injeção exata estão em mutations.json.
- GREEN mínimo posterior às duas restaurações: 4 passaram / 31 skipped / 35 total; contrato Maestro completo39/39, tsc --noEmit, lint source/test e visual:qa:strict saíram0. UI strict:463 arquivos,0 regressões,49 baseline+3 exceções existentes. Sem repetir quality completo ou suítes amplas da trilha nesta rodada.

### P3 e pendência nativa

A cauda e o texto vivem dentro do content de SpeechBubble; bubbleStyle é aplicado ao wrapper ancestral. Padding/overflow nesse wrapper não separaria os irmãos cauda/texto. Nenhuma correção placebo nem mudança de copy foi feita. Por decisão explícita do controlador, **o P3 da cauda permanece resíduo visual compartilhado para T17/revisão ampla**, sem presumir preexistência visual. Os shared components não foram editados. A imagem normal não é chamada limpa.

O mecanismo local está implementado e validado no harness. **Resolução visual do P2 ainda depende da nova prova nativa**, na mesma montagem normal→máxima→normal, com intervalos registrados antes de qualquer relaunch, incluindo mensagem inteira por scroll, eyebrow e saída. O executor/controlador fará essa medição depois do freeze/revisão. Não executei operações nativas, builds, instalações, comandos Git, Loop/brain ou novos agentes nesta rodada.

### Seis hashes do freeze FIX2 — históricos

Apenas RewardScreen.tsx e seu teste mudaram em FIX2. Os quatro paths restantes conservam os hashes de R1/FIX1. Os campos históricos sourceSha256/fix1FrozenHashes de mutations.json permanecem com significado histórico; currentFrozenHashes é o freeze atual.

| Path | SHA256 |
|---|---|
| `radiant-app/src/features/rewards/screens/RewardScreen.tsx` | `55f8d535692d9acebff733def9c32e225488b63a8d40629b1f95cc5cebc95344` |
| `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx` | `19956acd8ee00996dc450025aece0be321faff58df3b43b958c6e3cc9101b4da` |
| `radiant-app/.maestro/reward-locked.yaml` | `5adc42a3333fa67930fd61ce5e4c31d78c02797ffe658516a3d81e4eebd84d53` |
| `radiant-app/.maestro/reward-unlock.yaml` | `b4b9f90df9f8845b610b6c331df37ee755715ea21ce1fdade29770ee3096d0f7` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `f93b517123dd7993ae97648fffab1685c5f37cc79038a2f5a5a83b62f72f5759` |
| `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx` | `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28` |

## FIX3 — inventário completo fora do hero e freeze atual

Medido em 2026-10-28T07:41:04.914137-03:00. Mesmo round FIX3 e writer `run-1793154878719-98187baa`, já em STEP_STARTED pelo controlador; nenhum novo run/sessão. O autor anterior não escreveu FIX3. A entrada desta reposição é o freeze FIX2/R3: source `55f8d535692d9acebff733def9c32e225488b63a8d40629b1f95cc5cebc95344`, teste `19956acd8ee00996dc450025aece0be321faff58df3b43b958c6e3cc9101b4da`. Brief vinculante e parecer R4 lidos; skills TDD e verification-before-completion aplicadas, sem reiniciar processo da tarefa.

### Entrada visual e inventário antes da correção

Abri por view_image os arquivos reais `task8-native-r2-ios-locked-max-live-3s.png`, `task8-native-r2-ios-locked-max-live-10s.png` e `task8-native-r2-ios-live-scroll-2.png`. Header e cartão intermediário/ação aparecem como faixas de glifos. A evidência R4 confirma frames 4.492s e 11.414s após troca, mesma montagem, sem scroll/restart entre eles; não troquei os rótulos aproximados dos arquivos por tempos exatos fictícios. O hero tratado no FIX2 foi preservado. Não se chama todo T06 legível por o CTA continuar visível.

Inventário conferido em RewardScreen e consumidores antes do produto (linhas abaixo são do source FIX3 final):

| Fronteira local | Hosts / decisão |
|---|---|
| Erro inicial :299 | 1 Text, key exata load-error |
| Header :336 | 1 Text, key exata header; close permanece montado |
| Rodapé do hero :365/:366 | 2 Text, label/título da unidade; não keyar heroCard |
| Cartão :371/:372 | 2 Text, título/descrição reais, incluindo fallback/optional |
| Status/progresso/revisão :377/:389/:395 | 3 GalaxyStatRow reais e sem hooks/estado/controle, cada um com 2 Text internos; API só icon/label/value, portanto key local é a menor fronteira disponível sem editar shared |
| Celebração :414/:434/:439 | 3 Text, XP TOTAL/título/subtítulo da sequência; key só nos Text |
| Erro de coleta :448 | 1 Text, key exata collect-error |
| Ação :453/:460 | 2 Text, título/corpo de available/locked/completed, incluindo optional |
| AnimatedCounter :415 | TextInput animado, não Text. Preservar instância/valor/efeito, sem key nem alterar API shared |
| AppButton / HUD / JourneyMedal | Fronteiras shared preservadas. AppButton tem Text interno sem API de key isolada; controles estavam legíveis na prova e não são remontados. HUD e medalha não recebem chaves novas |

São 12 Text locais mais os 6 Text das 3 linhas de apresentação, com 15 keys locais no total. Nenhuma key foi posta em tela, ScrollView, cartão, CTA, medalha, contador, estado ou serviços. Todos os valores continuam reais; nenhum copy, padding, cap de fonte, allowFontScaling ou política foi introduzido. O padrão T05 LessonSummary foi lido como hipótese local, sem edição nem tratado como prova de causa nativa.

### RED, implementação e teste causal

Antes de editar produto: **11 FAIL /35 skipped /46**, Jest11.087s, exit1. Nove casos cobrem available/locked/completed em1→3.1,3.1→2.5 e3.1→1; outros dois cobrem erro de leitura e de coleta em1→3.1→2.5→1. As falhas apontam a lista literal de textos cujos hosts reais foram retidos (:291), ou identidade do erro (:330). Não são regex de source/key nem espelho de props. GalaxyStatRow e AnimatedCounter são reais; o mock PixelHeroSplit herdado continua limitado à identidade do hero e AppButton mockado conserva props para inspeção de callback/disabled, sem sustentar alegação visual.

Produto: key por fontScale exato em cada Text inventariado, e key local por escala em cada GalaxyStatRow sem estado. O green inicial da recompensa inteira foi **46/46**, Jest11.263s, exit0. Casos novos mantêm identidade do ScrollView, JourneyMedal, close, todos AppButtons e AnimatedCounter; TextInput do contador mantém valor real `54 XP`. Mesma escala retém os hosts novos. Uma leitura/ativação por montagem, sem coleta/RatingPrompt causados por troca de fonte. FIX2 continua cobrindo coleta inflight, botão desabilitado, callback capturado, confirmação e póscoleta sem duplicar ganho/avaliação. Nenhuma função de elegibilidade/coleta, fallback loadedRewardId, shadow/version, hearts ou economia mudou.

### Três contraprovas nominais, restauradas em finally

- `fix3-local-hosts-not-renewed`: retira somente as15 keys novas, mantendo key do hero FIX2. **11 FAIL /35 skipped**, por hosts locais retidos em :291/:330.
- `fix3-local-hosts-coarse-threshold`: troca só essas15 keys por normal/grande. **5 FAIL /35 skipped /6 PASS**; os3 estados falham em3.1→2.5, mais os2 erros no mesmo intervalo. As outras6 transições passam, mostrando a barreira específica de escala exata.
- `fix3-counter-remounted`: acrescenta key por fonte apenas ao AnimatedCounter. **3 FAIL /35 skipped /8 PASS**, em :297, que exige preservar a instância real do contador nos3 casos completed.

Cada mutação restaura os bytes originais em finally e confere igualdade/SHA `2fc7517cc11e5fe0f494321cbfcfbbe2b8d8cc8a2d51dd22cf800c7e226d2038`. Injeções exatas, logs, nomes das falhas e SHA dos mutants/restores estão em mutations.json. O agregador do segundo caso esperava os mesmos números em ordem diferente da saída Jest e marcou classificação false; o source já estava restaurado. A leitura raw confirmou a falha exata esperada, corrigiu o metadado e rodou apenas o terceiro caso pendente. Esse erro do agregador é registrado como harness, não nova falha de produto, e nenhum teste foi repetido por ele.

### Verificação final necessária e limites

- Focal restaurado sob `caffeinate -i /usr/sbin/taskpolicy -b`, Node20.20.2, **4 suítes /100 testes PASS**, Jest46.197s, wall54.869s. Suítes inteiras: RewardScreen.flow, JourneyNodeCompletionGuard, JourneyProgressService e student-checkpoints/screen-integrations. Carga antes do comando4.40. Sem quality completo ou repetição de regressões inalteradas.
- Avisos preservados: JourneyProgressService registra schema desconhecido, nó bloqueado e nó inexistente nos cenários próprios. JourneyNodeCompletionGuard passa com console.error herdado de mock incompleto de SpacedRepetitionService.getCardState em LessonFlowScreen. Consumidor não foi editado: nenhum failure real novo exigiu adaptação de mock.
- TypeScript inicial exit2: TS2322 em teste :289 porque o tuple inferiu1|3.1 para a variável mutável e o destino incluía2.5. Correção única `from as number`, sem efeito runtime; tsc posterior exit0. Focal restaurado precede essa anotação apagada na compilação; não se repetiu suíte por mudança só de tipo. Lint source+teste final exit0.
- Contrato Maestro completo **39/39**, exit0. Não equivale a execução de flow nativo.
- visual:qa:strict **463 arquivos,0 regressões,49 baseline+3 exceções existentes**, exit0. Não rasteriza clipping.
- Source final foi comparado ao snapshot FIX2: somente15 keys locais e1 comentário. Nenhuma alteração shared, API, copy, estilos, serviços, state/ref, controle ou modelo. O teste final só acrescenta o inventário/identidades e a anotação de tipo citada.

O P2 rasterizado continua **pendente de nativo R3 e revisão independente R5**. O controlador deve medir source final na mesma montagem normal→máxima→normal, pares com intervalos e scroll por todos os textos, além de abertura inicial máxima separada. Não executei nativo iOS/Android, gesto, Maestro em dispositivo, build, instalação, operações de storage/relógio, commit/push/CI, Loop validate/finalização ou agentes. Não acessei o reservado. P3 cauda normal continua resíduo real explicitamente deferido aT17, sem workaround ou declaração de tela limpa. Run/sessões e gates G1–G8/G2/T14 permanecem sob controlador/dono. Nenhum teste iniciado por esta reposição ficou ativo.

### Índice append-only desta rodada

O prefixo histórico de red.txt continua174024bytes, SHA256 `556892c403911a80648065f7da5cd11c9b9865f75ef259da4307defb876d8615`; FIX1 e FIX2/logs/contraprovas foram preservados.

- red.txt:11139: `--- FIX3 RED antes de produto: hosts locais fora hero ---`
- red.txt:11576: `--- fix3-local-hosts-not-renewed ---`
- red.txt:12013: `--- fix3-local-hosts-coarse-threshold ---`
- red.txt:12228: `--- fix3-counter-remounted ---`
- green.txt:1217: `--- FIX3 GREEN inicial recompensa inteira ---`
- green.txt:1283: `--- FIX3 GREEN final restaurado: quatro suites focais sob taskpolicy-b ---`
- green.txt:1430: `--- FIX3 TypeScript ---`
- green.txt:1441: `--- FIX3 TypeScript após anotação numérica do harness ---`
- green.txt:1450: `--- FIX3 ESLint source e teste alterados ---`
- green.txt:1459: `--- FIX3 contrato Maestro completo ---`
- green.txt:1673: `--- FIX3 visual qa strict ---`

| Log auxiliar no SDD | SHA256 |
|---|---|
| `task8-fix3-red.txt` | `d17277b7e7fd034460a4dd0ffb03e8d1a961d3118df94d3576e2aebd7f2cc8eb` |
| `task8-fix3-green-initial.txt` | `47e883dfae865004213227d6510100d496b4ef0843652ab3d7d55967683b9d7b` |
| `task8-mutation-fix3-local-hosts-not-renewed.txt` | `39718e3c4b5c08f34c7f5db43ef986a010a874ec7905e1e07ec430b3dee439c7` |
| `task8-mutation-fix3-local-hosts-coarse-threshold.txt` | `8ef1c05606859b0201af527bc113ad5c1cbd7697c8d50db0bdf413534315196b` |
| `task8-mutation-fix3-counter-remounted.txt` | `c0d7cd883b8e46093579a8cb1b42c081d11caddb3248dcde3e77b3ae430820ea` |
| `task8-fix3-green-final.txt` | `d867e9a1e675a621afb233ad8cb97b569e18c43e7276c630167ed9ca952c00d4` |
| `task8-fix3-tsc.txt` | `8572523f2ba5b4444f3c01236300ea26c17fca3c4af5c5477c573f024dd9c049` |
| `task8-fix3-tsc-corrected.txt` | `4d20f6ceb3745b7500d2f448658dbf7d3354117dbc262c96ebd7e23b95c83f9b` |
| `task8-fix3-eslint.txt` | `c7da435fd7972fedefb031b71378fda7d3513f1402f03c92e783da4d6f4ae646` |
| `task8-fix3-maestro-contract.txt` | `cb25f80235cafae192308c9b711d0670734d561607e394ac4e7d6bf9029541b5` |
| `task8-fix3-visual.txt` | `e59f2fa04731454628a2c8a8a93b614c6cc9ec999e190e0b850113ffacc8e508` |

### Freeze FIX3 atual — seis hashes

| Path | SHA256 |
|---|---|
| `radiant-app/src/features/rewards/screens/RewardScreen.tsx` | `2fc7517cc11e5fe0f494321cbfcfbbe2b8d8cc8a2d51dd22cf800c7e226d2038` |
| `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx` | `5194883d9e612bbdbe680eff037bf0075da990524da0dbe8949595220d55910d` |
| `radiant-app/.maestro/reward-locked.yaml` | `5adc42a3333fa67930fd61ce5e4c31d78c02797ffe658516a3d81e4eebd84d53` |
| `radiant-app/.maestro/reward-unlock.yaml` | `b4b9f90df9f8845b610b6c331df37ee755715ea21ce1fdade29770ee3096d0f7` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `f93b517123dd7993ae97648fffab1685c5f37cc79038a2f5a5a83b62f72f5759` |
| `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx` | `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28` |
