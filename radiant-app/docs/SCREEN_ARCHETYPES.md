# 🏗 SCREEN_ARCHETYPES.md — Radiant (v2)
Status: ✅ Oficial — atualizado em v1.2.0 (2026-05-02)
Escopo: Definição estrutural das telas do Radiant.

> **Objetivo:**
> Garantir consistência visual e comportamental definindo **como** as telas são estruturadas, independente do conteúdo.
> Evita "telas ad-hoc" e mantém o padrão *premium*.

---

## 1) Propósito dos Arquétipos

O Radiant não usa telas genéricas. Cada tela deve se encaixar em um **Arquétipo Oficial**.
Isso garante:
1. **Consistência Cognitiva:** O usuário sabe instintivamente como interagir (ex: onde está a ação principal).
2. **Velocidade de Desenvolvimento:** Não reinventamos o layout; apenas preenchemos slots.
3. **Sensação Premium:** Ritmo vertical, motion e tipografia são pré-calibrados.

Os arquétipos funcionam em conjunto com:
- `LAYOUT_PRIMITIVES.md` (estrutura física)
- `RADIANT_MOTION.md` (comportamento cinético)

---

## 2) Regras Globais

Aplicáveis a **todos** os arquétipos:

1. **Estrutura Base:** `layout.screen` > `layout.container`.
2. **Foco Único:** Cada tela tem **um** objetivo claro.
3. **Ação Primária Única:** Apenas um botão/CTA primário por estado visual.
4. **Motion de Suporte:** Animações guiam o olho ou celebram; nunca decoram sem propósito.
5. **Personagem Contextual:** A presença de Pixel é regulada pelo arquétipo (nunca "jogado" na tela).

---

## 3) Arquétipos Oficiais (v2)

### A) Dashboard Screen
**Exemplos:** `HomeScreen`
**Intento:** Visão geral, motivação, ponto de partida.
**Modo visual:** Light (`#F5FAFF`)
**Estrutura:**
- Cabeçalho (data micro + saudação Sora ExtraBold + avatar).
- Linha de StatPills (XP, streak, coração).
- Hero card com LinearGradient e Pixel mascote.
- Cards informativos (Journey, Stats).
**Ritmo Vertical:** `layout.stackMd` (respiro generoso).
**Motion:**
- Entrada em cascata (`stagger`) dos cards via Reanimated.
**Pixel (Personagem):**
- **Permitido:** Sim.
- **Posição:** Dentro do hero card.
- **Estado:** `happy`, `guide`.
**Anti-padrões:**
- Textos longos sem hierarquia.
- Múltiplas ações de igual peso.

### B) Flow Screen
**Exemplos:** `QuizScreen`, `ReviewScreen`
**Intento:** Progresso focado, imersão, passo-a-passo.
**Modo visual:** Light (`#F5FAFF`)
**Estrutura:**
- Barra de progresso LinearGradient no topo (track `#EAF2FF`).
- Cartão de Conteúdo (`QuizQuestion` com `XrayPanel` para questões de imagem).
- `QuizFeedback` drawer após resposta.
- Rodapé com CTA de avanço.
**Ritmo Vertical:** `layout.stackSm` ou customizado para densidade.
**Motion:**
- `useCardEnter` na entrada de cada questão.
- `useShakeError` no feedback negativo.
- `useScalePop` no feedback positivo.
**Pixel (Personagem):**
- **Restrito:** Geralmente ausente para não distrair.
**Anti-padrões:**
- Botões de saída no meio do fluxo (use o `X` no topo).
- Elementos piscando ou competindo por atenção.

### C) Summary / Reward Screen
**Exemplos:** `RewardScreen`, `CheckpointScreen` (estado `completed`)
**Intento:** Fechamento, recompensa, celebração.
**Modo visual:** Dark (`#03030D`) para Reward; Light gradient (`#EAF2FF → #F5FAFF`) para Checkpoint.
**Estrutura:**
- `StarfieldBackground` ou `LinearGradient` de fundo.
- `Confetti` component ativo.
- `PixelIllustration` state `celebrate` como herói visual.
- Achievement card com badge dourado, título, XP box.
- CTA primário + ação secundária ghost.
**Ritmo Vertical:** Flex column com `ScrollView` (safe em iPhone SE).
**Motion:**
- `Confetti` com 30–50 partículas.
- XP counter animado (incremento por setInterval).
- Reanimated `withDelay/withTiming` nos cards de recompensa.
**Pixel (Personagem):**
- **Encorajado:** Sim.
- **Estado:** `celebrate`.
**Anti-padrões:**
- Layout 100% absolute sem ScrollView fallback.
- Mostrar erros detalhados (foco no positivo).

### D) Map Screen
**Exemplos:** `GalaxyMapScreen`
**Intento:** Navegação espacial, escolha de destino.
**Modo visual:** Dark (`#03030D`)
**Estrutura:**
- `StarfieldBackground` com `extraNebulas` das galáxias.
- Mapa posicional absoluto com galáxias como `GalaxyBlob`.
- SVG `<Line>` para trilhas pontilhadas entre galáxias.
- `PixelIllustration` state `guide` próximo à galáxia ativa.
- `BlurView` glass CTA fixo no rodapé.
**Motion:**
- `withSpring` no press de cada `GalaxyCard`.
**Pixel (Personagem):**
- **Permitido:** Próximo à galáxia ativa.
- **Estado:** `guide`.
**Anti-padrões:**
- ScrollView (mapa é posicional, não linear).
- CTA primário sem BlurView no contexto dark.

### E) Stats Screen
**Exemplos:** `ProgressScreen`, `MissionsScreen`
**Intento:** Acompanhamento, motivação contínua, missões.
**Modo visual:** Light (`#F5FAFF`)
**Estrutura (Progress):**
- Header "YOUR STATS / Progress".
- Streak calendar (7 tiles com LinearGradient fire).
- Accuracy bar chart (8 barras, flex height).
- 2×2 stats grid + topics mastered list.
**Estrutura (Missions):**
- Header com badge de tempo restante.
- Streak banner LinearGradient `#FF8A4C → #FF6B2C`.
- Seções Daily / Weekly com `MissionCard` (progresso flex, XP badge).
**Motion:** Mínimo — apenas feedback de toque.
**Pixel (Personagem):** **Ausente** neste arquétipo.
**Anti-padrões:**
- Dark mode nessas telas.
- `%` strings em StyleSheet (usar flex para barras de progresso).

### F) Onboarding Screen
**Exemplos:** `onboarding/index.tsx`, `onboarding/value.tsx`, `onboarding/goal.tsx`
**Intento:** Ativação, apresentação de valor, personalização.
**Modo visual:** Dark nas duas primeiras (`#03030D`); Light na última (`#F5FAFF`).
**Estrutura:**
- Welcome: `StarfieldBackground` + Pixel `guide` lg + `BlurView` speech bubble + dots de paginação.
- Value: 3 `FeatureCard` com stagger `withDelay` (0/120/240ms).
- Goal: seleção de especialidade + meta diária + CTA `router.replace('/(tabs)')`.
**Motion:** `withDelay/withTiming` nos cards; `withSpring` nos toggles de seleção.
**Pixel (Personagem):**
- **Welcome:** state `guide`, size `lg`.
- **Value:** state `happy`, size `sm`, canto inferior direito.
**Anti-padrões:**
- Mais de 3 telas de onboarding.
- Conteúdo que não pode ser pulado.

### G) Utility Screen
**Exemplos:** `TelemetryDebugScreen`, seção de dev tools em `ProgressScreen`
**Intento:** Informação densa, configuração, diagnóstico.
**Modo visual:** Light (seção embutida) ou Dark (tela isolada).
**Estrutura:**
- Listas longas, tabelas ou seções densas.
- Scroll vertical mandatório.
**Motion:** Mínimo/Nulo. Apenas feedback de toque.
**Pixel (Personagem):** **Proibido.**
**Anti-padrões:**
- Espaçamento exagerado.
- Motion decorativo.

---

## 4) Layout Trees (Pseudocode)

### Dashboard Tree
```text
screen
  container + stackMd
    Header (Row)
      Title
      PixelSlot
    StatsRow (Row / Grid)
    InfoCard (Banner)
    MainActionCard (Center Action)
```

### Flow Tree
```text
screen
  container + stackMd
    TopBar (Progress / Close)
    ContentArea (Flex Grow)
      QuestionCard
    InputArea (StackSm)
      Options / TextField
    Footer
      PrimaryCTA
```

### Summary Tree
```text
screen
  container + stackMd (Centered content)
    SuccessIcon / Graphic
    MainScore (H1)
    StatsGrid (Row)
    PixelFeedback (Optional)
    Footer
      FinishButton
```

---

## 5) Motion Guidelines per Archetype

- **Dashboard:** Entrada suave na carga (`FadeInUp`). Elementos parecem "assentar" na tela.
- **Flow:** Transições rápidas (<300ms). O movimento deve indicar progresso (da direita para esquerda).
- **Summary:** Movimento expandido, elástico (`Spring`). Pode ser mais longo (>500ms) para celebrar.
- **Utility:** Apenas micro-interações funcionais (toggle, touch feedback).

---

## 6) Character (Pixel) Placement Rules

- **Onde:** Sempre em um `PixelSlot` definido ou área reservada. Nunca flutuando sobre texto de conteúdo.
- **Componente:** `<PixelIllustration state="..." size="sm|md|lg" />`
- **States por Arquétipo:**
  - `idle` / `guide`: Dashboard, Map, Onboarding Welcome.
  - `happy`: Dashboard hero card, Onboarding Value.
  - `thinking`: Flow (se solicitado por dica).
  - `celebrate`: Summary/Reward, Checkpoint completed.
  - `oops`: Flow — feedback de erro grave (uso esparso).
- **Sizes:**
  - `sm` (~60 pt): rodapé de onboarding, próximo a galáxia ativa.
  - `md` (~90 pt): hero card da Home.
  - `lg` (~120 pt): herói em Summary/Reward.
- **Gating:** Se o usuário desativar "Personagem", o layout não deve quebrar (o slot colapsa ou exibe vazio elegante).

---

## 7) Anti-padrões Globais (Proibidos)

1. **Frankenstein:** Misturar Dashboard com Flow (ex: Card de pergunta jogado na Home sem entrar em modo foco).
2. **Drift de Primitives:** Usar margins manuais para forçar layouts fora do padrão.
3. **Motion Náusea:** Animar fundo ou textos grandes sem necessidade.
4. **Overload:** Tentar mostrar Dashboard, Summary e Flow na mesma tela.

---

## 8) Política de Evolução

- **V1 (Atual):** Congelado. Use apenas estes 4 arquétipos.
- **Novos Arquétipos:** Só criar se houver necessidade clara de um padrão recorrente que não se encaixa nos existentes (ex: "Store/Marketplace" ou "Social Feed").
- **Processo:** Definir em documento separado antes de implementar.
