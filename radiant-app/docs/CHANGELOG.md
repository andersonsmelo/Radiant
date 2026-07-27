# Changelog — Radiant

Todas as mudanças notáveis são documentadas aqui.
Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
Versionamento: [Semantic Versioning](https://semver.org/lang/pt-BR/)

---

## [Não lançado]

### Corrigido
- **Folga da tab bar em todas as telas roláveis** — `HomeScreen`, `ProgressScreen`, `MissionsScreen` e `GalaxyMapScreen` reservavam folga própria (32pt, 24pt, 120pt e 110pt) contra os 102pt da barra flutuante, deixando o último elemento sob a barra. As quatro passam a derivar de `tabBarClearance`, e a regra virou teste de contrato em `scripts/tab-bar-clearance-contract.test.mjs`, ligado ao `npm run quality` (`a9846a2`)
- **Estado efetivo do sync remoto na homologação** — o painel exibia `Sync remoto: ativado` a partir da flag crua, mas o sync também exige `isApiConfigured()`; passa a distinguir `ativado`, `ligado, sem API configurada` e `desativado` (`0bf3332`)

### Alterado
- **Learning Road é a home oficial** — `EXPO_PUBLIC_ENABLE_LEARNING_ROAD` era ligada apenas no perfil `e2e-test`, então builds de produção renderizavam a `HomeScreen` clássica enquanto o E2E validava o `JourneyHomeScreen`. A flag passa a ser declarada em `development`, `preview` e `production`, com default `true`, e vira kill switch de rollback ([ADR](../../docs/adr/ADR-2026-07-27-learning-road-como-home.md), `c4122e1`)
- **`ENABLE_REMOTE_SYNC=false` em `preview` e `production`** — estado real enquanto a API pública responde HTTP 502 (`0bf3332`)

### Documentação
- Roadmap de lançamento nas lojas com 6 marcos e ~35 tasks priorizadas, e requisitos de App Store e Google Play pesquisados em 2026-07-27
- ADRs de contas de loja (Play pessoal, Apple individual) e da home de produção
- Protocolo de coordenação multi-IA no `AGENTS.md`
- Status canônico promovido para [`docs/EXECUTION_STATUS_2026-07-27.md`](../../docs/EXECUTION_STATUS_2026-07-27.md)

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
