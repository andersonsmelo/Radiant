# Changelog — Radiant

Todas as mudanças notáveis são documentadas aqui.
Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
Versionamento: [Semantic Versioning](https://semver.org/lang/pt-BR/)

---

## [Não lançado]

### Adicionado
- **Medida da resolução de módulo, `storage_module_resolution` (2026-08-10)** — fecha a pergunta que a fronteira deixou aberta, e a resposta inverte a atribuição: dos ~440 ms que o piloto somou à partida em `active`, a resolução do AsyncStorage por `await import()` responde por **177–622 ms** e a leitura da chave por **menos de 2 ms**, em todos os seis lançamentos. Duas explicações sobreviviam com remédios opostos — resolução de módulo (artefato do Dev Client) contra abertura do banco nativo (real em produção) — e medir a resolução sozinha separa as duas por subtração. A prova estática dispensou build: `npx expo export` emite **um único** artefato JS (`entry-<hash>.hbc`, 6,4 MB) e `metadata.json` declara um bundle com 37 assets, **sem nenhum chunk assíncrono**, então num build embarcado o `import()` não tem o que buscar. **O kernel de checkpoints custa menos de 2 ms na partida** — a mais baixa das três medidas do kernel, contra 23,1 ms de persistência e 9,0 ms de restauração. Consequência sobre o instrumento: o delta de `first_frame` colhido em Dev Client **não pode julgar esta onda**, porque só um lado percorre o caminho de chunk; o remédio é aquecer a resolução no bootstrap nos dois modos, o que é validade de medição e não otimização. **16/16** no módulo do probe
- **Medida da fronteira de partida, `launch_inspection` (2026-08-10)** — o piloto da marca de primeiro frame atribuiu ~440 ms de custo de partida ao kernel, e a atribuição estava errada. `inspectLaunch` é a única etapa do bootstrap que difere entre `off` e `active` e era a única sem probe nenhum — por isso 9,0 ms de restauração medida nunca contradisseram os 440. Instrumentada nos **dois** modos: **0,5–0,9 ms em `off`** contra **184–357 ms em `active`**, ou seja ~72% do delta. O mecanismo saiu dos próprios números: a primeira operação de storage do kernel custa ~240 ms e a seguinte, no mesmo lançamento, 13–21 ms — assinatura de resolução de módulo, não de I/O. O store resolve o AsyncStorage por `await import()`, que o Metro do Expo serve como chunk assíncrono buscado por HTTP no Dev Client; em `off` o `inspectLaunch` retorna antes de tocar o store, então o baseline nunca paga e a diferença apareceu como se fosse custo do kernel. **A correção óbvia foi refutada:** import estático derruba **seis suítes** do kernel com `NativeModule: AsyncStorage is null`, porque `jest-expo` não mocka esse módulo e o adaptador em memória existe para essas suítes não precisarem de mock — o comentário que a troca ia apagar estava certo, e agora carrega os dois lados do trade-off. **Pergunta aberta que decide se há o que otimizar:** esse custo existe fora do Dev Client? `FirstFrameProbe` virou `StartupProbe`, com um emissor de partida independente de modo para as duas métricas. **13/13** no módulo
- **Marca de primeiro frame útil, e o gate de partida passou a usá-la (2026-08-10)** — o gate de cold start media a duração do `launchApp` do Maestro, que num Dev Client **termina no launcher, antes de o bundle JS ser buscado e avaliado**. O kernel de checkpoints é JavaScript, logo não vivia na janela medida: nenhum ajuste de limiar conserta uma métrica que não observa o objeto sob teste, e foi tentando gateá-la que o relatório primeiro reprovou por ruído e depois aprovou vazio. Entrou `first_frame`, do início da janela JS ao frame seguinte a `startupPhase` virar `ready` — que só acontece depois de `inspectLaunch` do runtime de checkpoints, então **o kernel está dentro da janela por construção**; a leitura final vai num `requestAnimationFrame`, para medir o frame pintado e não o commit do React. A marca é emitida em **todos** os modos do kernel, gated só no ambiente e na flag de performance: é isso que faz o baseline `off` produzir a coorte de comparação, e é o ponto que a justificativa do descarte anterior não cobria — ela valia para o probe de checkpoint, não para um timestamp de inicialização, que não é dado de checkpoint e não toca store. `cold_start` continua calculado e reportado, agora `advisory: true` e **fora** do veredito (reverter é tirar o nome de `ADVISORY_GATES`). "Off silencioso" deixou de ser afirmação e virou asserção: o gate `baseline_isolation` reprova o relatório se um log de baseline carregar `persistence` ou `restoration` — escrito depois de uma contaminação real por replay de buffer do CDP que, na época, nada pegaria porque o baseline não era lido. Emissor **9/9**, relatório **14/14**, cinco mutações provadas, **sem dependência nova e sem binário novo**. Limite declarado: a métrica exclui o lançamento nativo, e regressão puramente nativa só apareceria no `cold_start` informativo. [Desenho](../../docs/superpowers/specs/2026-08-10-marca-de-primeiro-frame-design.md)
- **Flow de viewport curto (2026-08-10)** — `.maestro/student-checkpoint-short-viewport.yaml` prova que a tela de retomada permanece usável na viewport mais curta disponível: `iPhone SE (3rd generation)`, `[0,0][375,667]`, 207 pt mais baixa que o aparelho das coortes H3, com o mesmo binário nativo. Passa em `medium`, AX3, AX4 e AX5, cobrindo retomada offline após kill/relaunch, ausência de redirect automático, CTA alcançado rolando e volta para a Tela 2 de 3. Registrado nas duas listas de contrato de rolagem; **21/21**. O item estava bloqueado por uma afirmação falsa — "este host não tem device type SE" — repetida em seis lugares e desmentida por um comando. Achado da medição: numa viewport curta a âncora da espera antes de `scrollUntilVisible` tem de ser o **primeiro** elemento da tela, porque em AX5 o corpo do cartão já nasce abaixo da dobra; e `maestro hierarchy`, como invocação separada, discordou da asserção do próprio Maestro em 4 de 5 leituras, então não serve de instrumento. Aparelho **físico** de tela baixa continua sem evidência
- **Agendador de revisão por competência (2026-08-08/09)** — modelo de memória, store com quarentena, resolução nó→competência, recomendação explicável e observação das atividades concluídas. O lado de leitura permanece inerte até conteúdo v2 e guarda explícita de ativação; a Task 11 fechou fora de ordem sem alterar a experiência visível

### Corrigido
- **Tela de retomada ficava sem saída com texto grande (2026-08-10)** — a partir de `accessibility-extra-extra-large`, `CheckpointResumeScreen` perdia os botões `Retomar estudo` e `Ir para a jornada`: o cartão transbordava a tela nas duas direções (título em `y=-257`, corpo até `y=1066` numa tela de 874 pt) e não havia `ScrollView`. Quem usa os dois maiores tamanhos de acessibilidade e tinha um checkpoint salvo abria o app numa tela sem nenhum controle. Agora o conteúdo mora num `ScrollView` cujo contêiner usa `flexGrow: 1` — `flex: 1` ali prenderia a altura ao viewport e recriaria o defeito. Teste vermelho antes da implementação e provado por mutação; prova em aparelho em AX4 e AX5
- **Gate de desempenho reprovava por ruído (2026-08-10)** — o limite de delta era `max(5% do p95, 50 ms)`, isto é 167,6 ms, sobre uma medida cuja dispersão interna era ~835 ms; um limiar cinco vezes menor que o ruído do próprio instrumento reprova qualquer coisa. O limite ganhou um terceiro termo, `baseline_p95 - baseline_p50`, e o relatório passou a expor `noiseFloorMs` e `baselineP50Ms` para mostrar qual termo mandou. Onde a medida é estável o termo é zero e os originais continuam valendo. **A ressalva que este item registrava — num host que degrada o limite acompanha o ruído e o gate aprova vazio — foi fechada no mesmo dia pelo item abaixo**
- **Gate de desempenho aprovava vazio quando o ruído dominava (2026-08-10)** — corrigido o falso-negativo do item acima, o gate passou a produzir o defeito simétrico e mais perigoso, porque tem cara de aprovação: com o host em swap, o piso de ruído do cold start foi 2863 ms contra um p95 de baseline de 5748 ms e o relatório fechou em `passed: true`. Um limite que tolera 2,9 s não distingue regressão de flutuação. O gate ganhou um **terceiro desfecho**, `inconclusive`, falha fechada com razão `measurement-too-noisy`, quando o piso de ruído passa de **um quinto do p95 do baseline** — quatro vezes a sensibilidade de 5% que o desenho pedia. `insufficient-samples` passou a classificar no mesmo desfecho: `fail` fica reservado ao candidato que regrediu de fato, e `inconclusive` manda remedir o instrumento em vez de investigar o produto. Cada gate e o relatório expõem `outcome`, e cada gate de delta expõe `maxNoiseFloorMs`. Recalculado sobre as três passagens reais de 2026-08-10, sem recoletar nada: a de host ocioso continua conclusiva, a que havia sido **descartada por julgamento humano** passa a ser reprovada pelo próprio instrumento, e o passe vazio da terceira virou `inconclusive`. Três casos novos, vermelhos antes da implementação, e cinco mutações provadas
- **Store do agendador rejeita números não finitos (2026-08-09)** — `stability`, `difficulty`, `reps` e `lapses` agora exigem `Number.isFinite`. A regressão usa JSON persistível (`1e400` → `Infinity`) e comprova quarentena, remoção do store ativo e fallback vazio nos quatro campos
- **E2E do fluxo crítico fechado nas duas plataformas (2026-07-29)** — `learning-critical-path` passou a usar o seletor de aba ancorado `^Progresso(, tab.*)?$` (o literal só-iOS `'Progresso, tab.*'` quebrava o Android; um `.*Progresso.*` quebrava os dois ao casar a legenda "Seu progresso…" sob matching case-insensitive), e ganhou um `- scroll` de elevação antes dos CTAs abaixo da dobra, que ficavam oclusos sob a tab bar flutuante no emulador rápido. Ambas as regressões travadas em `scripts/maestro-contract.test.mjs`. Resultado: iOS 3/3 e Android 3/3
- **Guarda de glifos de ícone alargada** — o contrato `keeps icon glyphs out of the accessibility tree` passou a varrer `components/` e `src/components/` além de `src/features`/`src/app` (o ponto cego dos defeitos de ícone do Android), excluindo os wrappers sancionados `icon-symbol.tsx` e `DecorativeIcon.tsx`
- **Alternativa da lição trava no primeiro toque** — `MultipleChoiceStepRenderer` recebia `locked={Boolean(selectedOptionId)}`, então quem tocasse a opção errada não podia corrigir antes do "Continuar", e a dica de a11y ainda anunciava "Resposta bloqueada após a seleção". A escolha passa a ser trocável enquanto o passo está na tela — quem confirma é o rodapé. O contrato do Maestro, que exigia a assinatura antiga, passou a **proibir** `disabled` no renderer (`fe254d9`)
- **Folga da tab bar em todas as telas roláveis** — `HomeScreen`, `ProgressScreen`, `MissionsScreen` e `GalaxyMapScreen` reservavam folga própria (32pt, 24pt, 120pt e 110pt) contra os 102pt da barra flutuante, deixando o último elemento sob a barra. As quatro passam a derivar de `tabBarClearance`, e a regra virou teste de contrato em `scripts/tab-bar-clearance-contract.test.mjs`, ligado ao `npm run quality` (`a9846a2`)
- **Estado efetivo do sync remoto na homologação** — o painel exibia `Sync remoto: ativado` a partir da flag crua, mas o sync também exige `isApiConfigured()`; passa a distinguir `ativado`, `ligado, sem API configurada` e `desativado` (`0bf3332`)

### Alterado
- **Primeira vitória encurtada (2026-08-09)** — as três telas da apresentação e **Pular apresentação → Home** foram preservadas; **Começar** agora persiste a saída e abre o próximo nó elegível da jornada. Falhas degradam para Home, toque duplo não duplica navegação e o flow focado passou no iOS 26.5 e no Android API 36
- **iPad desligado na v1.3 (2026-07-29)** — `ios.supportsTablet` passou a `false`; o lançamento inicial foca iPhone/Android phone, reduzindo escopo de screenshots e QA. iPad fica para uma versão futura
- **`eas submit` Android configurado** — o bloco `submit.production.android` do `eas.json` (antes só `ios: {}`) passou a declarar `serviceAccountKeyPath`, `track` e `releaseStatus`, pronto para a submissão ao Play (setup em `docs/store/EAS_SUBMIT_SETUP.md`)
- **Escala tipográfica única (Sora) nas telas da galáxia** — `GalaxyMapScreen`, `GalaxyInteriorScreen` e `PlanetInteriorScreen` dimensionavam texto com `fontSize` numérico, ou seja renderizavam em fonte de sistema, não na fonte da marca. As três passam a consumir `typography.*`, junto de `MissionsScreen` e `ProgressScreen`. Convenção fixada: glifo de ícone (chevron, check) e emoji **não** recebem token — são desenho, não texto (`524f935`, `8b974e5`, `d6e9809`)
- **Suíte Jest dentro do `npm run quality`** — o Loop já rodava `app-test` como validador separado, então a suíte já era obrigatória em toda entrega; o `ios:preflight`, caminho humano, não a via. Gate completo passou de ~12,5s para 19,5s (`1d0e633`)
- **Smoke de boot repontado** — `onboarding-to-home.yaml` guiava o wizard removido e já afirmava strings em inglês (`WELCOME TO RADIANT`, `STEP 3 OF 4`) que a migração pt-BR de 07-27 tornou obsoletas, então o "3/3 iOS" de 07-26 é anterior a essa deriva. Vira `boot-to-home.yaml`: instalação limpa → `Foco de hoje`, sem deep link. O contrato do Maestro passou a exigir a nova forma (`clearState` + asserção estável, proibindo `radiantapp://onboarding`). O device run do novo flow pertence à task B0.1

- **Learning Road é a home oficial** — `EXPO_PUBLIC_ENABLE_LEARNING_ROAD` era ligada apenas no perfil `e2e-test`, então builds de produção renderizavam a `HomeScreen` clássica enquanto o E2E validava o `JourneyHomeScreen`. A flag passa a ser declarada em `development`, `preview` e `production`, com default `true`, e vira kill switch de rollback ([ADR](../../docs/adr/ADR-2026-07-27-learning-road-como-home.md), `c4122e1`)
- **`ENABLE_REMOTE_SYNC=false` em `preview` e `production`** — estado real enquanto a API pública responde HTTP 502 (`0bf3332`)

### Removido
- **Wizard de onboarding inalcançável** — `src/app/onboarding/{index,value,goal}.tsx` era um protótipo inacabado (não persistia escolhas; `Build my plan →` só fazia `router.replace('/(tabs)')`) que nenhuma tela de produção navegava — só o deep link `radiantapp://onboarding`. Após a remoção, a instalação limpa caía na Home; desde 2026-08-02 ela passa antes pela apresentação real do Pixel. Removido junto do `Stack.Screen name="onboarding"` fantasma do `_layout` (a rota real era `onboarding/index`, então o Metro o acusava a cada boot) e de 8 allowances órfãs no `visual-qa-policy.json`. `ENABLE_ONBOARDING` foi **mantido de propósito** — é kill switch do onboarding *suave* (`OnboardingService`), que segue vivo atrás da `HomeScreen`
- **2,9 MB de assets mortos e superdimensionados** — `src/ui/characters/assets/lux/` (6 PNGs idênticos, README declarando-a legada, zero referências no código) apagada, e `pixel_core.png` reexportado de 1024×1536 (2,2 MB) para 576×864 (257 KB), que é o maior tamanho que o app consegue pintar (`PIXEL_SIZE_MAP.lg` 176pt × `imageScale` 1,06 × 3). O registry `PIXEL_DEDICATED_ASSETS`, onde arte dedicada entra, ficou intacto (`8b0dfe9`)

### Documentação
- Estado operacional promovido para [`docs/EXECUTION_STATUS_2026-08-09.md`](../../docs/EXECUTION_STATUS_2026-08-09.md), com primeira vitória, App Review reconfirmada, gargalo de direitos e hardening do agendador; READMEs, fluxo do cliente, roadmaps, fila, checklist e runbooks reconciliados no mesmo dia
- Roadmap de lançamento nas lojas com 6 marcos e ~35 tasks priorizadas, e requisitos de App Store e Google Play pesquisados em 2026-07-27
- ADRs de contas de loja (Play pessoal, Apple individual) e da home de produção
- Protocolo de coordenação multi-IA no `AGENTS.md`
- Status canônico promovido para [`docs/EXECUTION_STATUS_2026-07-27.md`](../../docs/EXECUTION_STATUS_2026-07-27.md) e, em 2026-07-28, para [`docs/EXECUTION_STATUS_2026-07-28.md`](../../docs/EXECUTION_STATUS_2026-07-28.md)
- **Ponteiros canônicos e a guarda que os vigia** — `docs/README.md`, o roadmap de lançamento e `context.includes` do `.loop/project.yaml` ainda apontavam para o snapshot de 07-27. Pior: `scripts/qa/docs-contract.mjs` governava o documento aposentado, então o contrato de documentação validava o status **antigo** desde que o de 07-28 nasceu. Existia teste para exatamente isso (`docs-contract.test.mjs`, "governs the newest execution status"), vermelho e sem executor — agora ligado ao validador `docs-contract`

> A versão `1.2.1` alinhou `package.json` e `app.json` em 2026-07-26 sem entrada própria neste changelog; as correções acima ainda não foram versionadas.

---

## [1.2.0] — 2026-05-02 · Design System Wave

### Adicionado
- **Design System completo** portado do protótipo web (`/New Layout/`) para o app React Native
- **Tokens expandidos** — `colors`, `gradients`, `shadows`, `fontFamily`, `textStyles`, `motion` em `src/ui/theme.ts` e `src/ui/styles.ts`
- **`AppButton`** — variante `galaxy` com gradiente + animação de press via Reanimated 4
- **`StatPill`** — componente de HUD com ícone SVG + valor + label
- **`ProgressRing`** — anel animado via Reanimated 4 `withSpring`
- **`XrayPanel`** — painel SVG de raio-X estilizado para questões de imagem
- **`Confetti`** — animação de partículas via Reanimated 4 para telas de celebração
- **`PixelIllustration`** — mascote com 6 estados animados (`idle`, `happy`, `guide`, `thinking`, `celebrate`, `oops`) via Reanimated 4
- **`StarfieldBackground`** — fundo escuro com estrelas piscantes e nebulosas coloridas
- **`GalaxyBlob`** — blob SVG orgânico para o mapa de galáxias
- **Tab Layout** — aba Home adicionada; ordem final: Home / Galaxy / Progress / Missions
- **Home Screen** — redesign completo: light mode, hero card com LinearGradient, StatPills, ProgressRing, mascote Pixel
- **Quiz Screen** — barra de progresso LinearGradient, `XrayPanel` para questões de imagem, estados de resposta correto/errado
- **Reward Screen** — `Confetti`, XP counter animado, cards de recompensa coloridos
- **Galaxy Map Screen** — `BlurView` glass CTA, guia Pixel próximo à galáxia ativa
- **Onboarding** — 3 telas: Welcome (dark + Pixel guide + speech bubble), Value (3 cards com stagger), Goal (seleção de especialidade + meta diária)
- **Progress Screen** — redesign light mode: streak calendar (7 tiles fire gradient), accuracy bar chart (8 barras), 2×2 stats grid, topics mastered list
- **Missions Screen** — redesign light mode: streak banner (orange gradient), `MissionCard` com progresso flex e XP badge, seções Daily/Weekly
- **Checkpoint Screen** — celebration view com `Confetti`, Pixel `celebrate`, achievement card com gold badge e XP box
- **Expo Blur** (`expo-blur`) instalado para efeitos `BlurView`
- **Sora Font** (`@expo-google-fonts/sora`) com 5 pesos carregados no layout raiz

### Alterado
- `SCREEN_ARCHETYPES.md` — v2: renomeado Lux → Pixel, adicionados arquétipos Map, Stats, Onboarding
- `RADIANT_UI_KIT.md` — v2: tokens reais, dois contextos visuais (light/dark), componentes e regras atualizadas

### Técnico
- Todas as barras de progresso usam `flex` — eliminadas `%` strings de `StyleSheet`
- TypeScript strict: zero erros em todos os 18 arquivos modificados
- Reanimated 4.1.1: `useSharedValue`, `withRepeat`, `withSequence`, `withDelay`, `withTiming`, `withSpring`
- `react-native-svg` para `XrayPanel`, `GalaxyBlob`, ícones SVG inline no Missions

---

## [1.1.0] — anterior

- Learning Road V2 (Journey Map, Spaced Repetition, Checkpoint flow)
- Gamification engine (XP, streaks, corações)
- Auth + sync remoto com fila local-first
- Telemetry service

---

## [1.0.0] — lançamento inicial

- Quiz engine com múltipla escolha
- Catálogo local de lições
- Onboarding básico
- App Store submission (iOS)
