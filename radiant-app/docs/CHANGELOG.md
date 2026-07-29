# Changelog — Radiant

Todas as mudanças notáveis são documentadas aqui.
Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
Versionamento: [Semantic Versioning](https://semver.org/lang/pt-BR/)

---

## [Não lançado]

### Corrigido
- **E2E do fluxo crítico fechado nas duas plataformas (2026-07-29)** — `learning-critical-path` passou a usar o seletor de aba ancorado `^Progresso(, tab.*)?$` (o literal só-iOS `'Progresso, tab.*'` quebrava o Android; um `.*Progresso.*` quebrava os dois ao casar a legenda "Seu progresso…" sob matching case-insensitive), e ganhou um `- scroll` de elevação antes dos CTAs abaixo da dobra, que ficavam oclusos sob a tab bar flutuante no emulador rápido. Ambas as regressões travadas em `scripts/maestro-contract.test.mjs`. Resultado: iOS 3/3 e Android 3/3
- **Guarda de glifos de ícone alargada** — o contrato `keeps icon glyphs out of the accessibility tree` passou a varrer `components/` e `src/components/` além de `src/features`/`src/app` (o ponto cego dos defeitos de ícone do Android), excluindo os wrappers sancionados `icon-symbol.tsx` e `DecorativeIcon.tsx`
- **Alternativa da lição trava no primeiro toque** — `MultipleChoiceStepRenderer` recebia `locked={Boolean(selectedOptionId)}`, então quem tocasse a opção errada não podia corrigir antes do "Continuar", e a dica de a11y ainda anunciava "Resposta bloqueada após a seleção". A escolha passa a ser trocável enquanto o passo está na tela — quem confirma é o rodapé. O contrato do Maestro, que exigia a assinatura antiga, passou a **proibir** `disabled` no renderer (`fe254d9`)
- **Folga da tab bar em todas as telas roláveis** — `HomeScreen`, `ProgressScreen`, `MissionsScreen` e `GalaxyMapScreen` reservavam folga própria (32pt, 24pt, 120pt e 110pt) contra os 102pt da barra flutuante, deixando o último elemento sob a barra. As quatro passam a derivar de `tabBarClearance`, e a regra virou teste de contrato em `scripts/tab-bar-clearance-contract.test.mjs`, ligado ao `npm run quality` (`a9846a2`)
- **Estado efetivo do sync remoto na homologação** — o painel exibia `Sync remoto: ativado` a partir da flag crua, mas o sync também exige `isApiConfigured()`; passa a distinguir `ativado`, `ligado, sem API configurada` e `desativado` (`0bf3332`)

### Alterado
- **iPad desligado na v1.3 (2026-07-29)** — `ios.supportsTablet` passou a `false`; o lançamento inicial foca iPhone/Android phone, reduzindo escopo de screenshots e QA. iPad fica para uma versão futura
- **`eas submit` Android configurado** — o bloco `submit.production.android` do `eas.json` (antes só `ios: {}`) passou a declarar `serviceAccountKeyPath`, `track` e `releaseStatus`, pronto para a submissão ao Play (setup em `docs/store/EAS_SUBMIT_SETUP.md`)
- **Escala tipográfica única (Sora) nas telas da galáxia** — `GalaxyMapScreen`, `GalaxyInteriorScreen` e `PlanetInteriorScreen` dimensionavam texto com `fontSize` numérico, ou seja renderizavam em fonte de sistema, não na fonte da marca. As três passam a consumir `typography.*`, junto de `MissionsScreen` e `ProgressScreen`. Convenção fixada: glifo de ícone (chevron, check) e emoji **não** recebem token — são desenho, não texto (`524f935`, `8b974e5`, `d6e9809`)
- **Suíte Jest dentro do `npm run quality`** — o Loop já rodava `app-test` como validador separado, então a suíte já era obrigatória em toda entrega; o `ios:preflight`, caminho humano, não a via. Gate completo passou de ~12,5s para 19,5s (`1d0e633`)
- **Smoke de boot repontado** — `onboarding-to-home.yaml` guiava o wizard removido e já afirmava strings em inglês (`WELCOME TO RADIANT`, `STEP 3 OF 4`) que a migração pt-BR de 07-27 tornou obsoletas, então o "3/3 iOS" de 07-26 é anterior a essa deriva. Vira `boot-to-home.yaml`: instalação limpa → `Foco de hoje`, sem deep link. O contrato do Maestro passou a exigir a nova forma (`clearState` + asserção estável, proibindo `radiantapp://onboarding`). O device run do novo flow pertence à task B0.1

- **Learning Road é a home oficial** — `EXPO_PUBLIC_ENABLE_LEARNING_ROAD` era ligada apenas no perfil `e2e-test`, então builds de produção renderizavam a `HomeScreen` clássica enquanto o E2E validava o `JourneyHomeScreen`. A flag passa a ser declarada em `development`, `preview` e `production`, com default `true`, e vira kill switch de rollback ([ADR](../../docs/adr/ADR-2026-07-27-learning-road-como-home.md), `c4122e1`)
- **`ENABLE_REMOTE_SYNC=false` em `preview` e `production`** — estado real enquanto a API pública responde HTTP 502 (`0bf3332`)

### Removido
- **Wizard de onboarding inalcançável** — `src/app/onboarding/{index,value,goal}.tsx` era um protótipo inacabado (não persistia escolhas; `Build my plan →` só fazia `router.replace('/(tabs)')`) que nenhuma tela de produção navegava — só o deep link `radiantapp://onboarding`. A instalação limpa da v1.3 já cai na Home. Removido junto do `Stack.Screen name="onboarding"` fantasma do `_layout` (a rota real era `onboarding/index`, então o Metro o acusava a cada boot) e de 8 allowances órfãs no `visual-qa-policy.json`. `ENABLE_ONBOARDING` foi **mantido de propósito** — é kill switch do onboarding *suave* (`OnboardingService`), que segue vivo atrás da `HomeScreen`
- **2,9 MB de assets mortos e superdimensionados** — `src/ui/characters/assets/lux/` (6 PNGs idênticos, README declarando-a legada, zero referências no código) apagada, e `pixel_core.png` reexportado de 1024×1536 (2,2 MB) para 576×864 (257 KB), que é o maior tamanho que o app consegue pintar (`PIXEL_SIZE_MAP.lg` 176pt × `imageScale` 1,06 × 3). O registry `PIXEL_DEDICATED_ASSETS`, onde arte dedicada entra, ficou intacto (`8b0dfe9`)

### Documentação
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
