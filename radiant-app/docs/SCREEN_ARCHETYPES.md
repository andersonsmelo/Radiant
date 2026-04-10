# 🏗 SCREEN_ARCHETYPES.md — Radiant (v1)
Status: ✅ Oficial (congelado)
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
5. **Personagem Contextual:** A presença de Lux é regulada pelo arquétipo (nunca "jogado" na tela).

---

## 3) Arquétipos Oficiais (v1)

### A) Dashboard Screen
**Exemplos:** `HomeScreen`
**Intento:** Visão geral, motivação, ponto de partida.
**Estrutura:**
- Cabeçalho claro (Saudação + Stats).
- Cards informativos (Stats, Banner).
- CTA de entrada para Fluxos.
**Ritmo Vertical:** `layout.stackMd` (respiro generoso).
**Motion:**
- Entrada em cascata (`stagger`) dos cards.
**Lux (Personagem):**
- **Permitido:** Sim.
- **Posição:** Topo (Cabeçalho/Slot).
- **Estado:** Idle, Greeting, Thinking.
**Anti-padrões:**
- Textos longos.
- Múltiplas ações de igual peso.

### B) Flow Screen
**Exemplos:** `QuizScreen`, `ReviewScreen`
**Intento:** Progresso focado, imersão, passo-a-passo.
**Estrutura:**
- Barra de progresso / Top info discreto.
- Cartão de Conteúdo (Centralizado visualmente).
- Área de Input / Resposta.
- Rodapé com CTA de avanço.
**Ritmo Vertical:** `layout.stackSm` ou customizado para densidade.
**Motion:**
- Transições de entrada/saída laterais ou fade+scale.
- Feedback imediato (Shake, Pulse).
**Lux (Personagem):**
- **Restrito:** Geralmente ausente para não distrair.
- **Exceção:** Feedback imediato (ex: celebrar acerto difícil), mas deve sair em seguida.
**Anti-padrões:**
- Botões de saída no meio do fluxo (use o `X` no topo).
- Elementos piscando ou competindo por atenção.

### C) Summary Screen
**Exemplos:** `QuizSummary`, `ReviewFinish`
**Intento:** Fechamento, recompensa, reflexão.
**Estrutura:**
- Grande indicador de sucesso (Icon / Motion / Score).
- Resumo de métricas (XP, Accuracy).
- CTA de "Voltar" ou "Próximo".
**Ritmo Vertical:** `layout.stackMd` e `layout.center` (frequente).
**Motion:**
- Celebração (Confetti, Scale-up, Sparkles).
- Entrada sequencial de stats.
**Lux (Personagem):**
- **Encorajado:** Sim.
- **Estado:** Happy, Excited, Celebrate.
**Anti-padrões:**
- Mostrar erros detalhados sem solicitação (foco no positivo).
- Botões pequenos demais.

### D) Utility Screen
**Exemplos:** `TelemetryDebugScreen`, `Settings` (futuro)
**Intento:** Informação densa, configuração, diagnóstico.
**Estrutura:**
- Listas longas, tabelas ou seções densas.
- Scroll vertical mandatório.
**Ritmo Vertical:** `layout.stackSm`.
**Motion:**
- Mínimo/Nulo. Apenas feedback de toque.
**Lux (Personagem):**
- **Proibido:** Não faz sentido narrativo.
**Anti-padrões:**
- Espaçamento exagerado (o foco é densidade de dados).
- Motion decorativo.

---

## 4) Layout Trees (Pseudocode)

### Dashboard Tree
```text
screen
  container + stackMd
    Header (Row)
      Title
      LuxSlot
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
    LuxFeedback (Optional)
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

## 6) Character (Lux) Placement Rules

- **Onde:** Sempre em um `CharacterSlot` definido ou área reservada. Nunca flutuando sobre texto.
- **States:**
  - `Idle/Greeting`: Apenas Dashboard.
  - `Thinking/Hint`: Apenas Flow (se solicitado).
  - `Celebrate`: Apenas Summary.
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
