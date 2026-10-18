# Assessment B — detector e evidência mecânica (trilha "Estude" e lição)

> **Anexo da [reavaliação da trilha](2026-10-16-reavaliacao-da-trilha.md).**
> Avaliação isolada feita por subagente, no método `impeccable critique`. As
> capturas e os arquivos brutos citados (`trilha-NN.png`, `licao-NN.png`,
> `errado-NN.png`, `hierarchy-trilha.json`) ficaram no espaço temporário da
> sessão e **não foram versionados**. Para reproduzir, veja "Como reproduzir"
> na síntese.

Data da medição: 2026-10-16, ~17:36. Branch `codex/radiant-study-improvements`, árvore limpa.
Simulador `0A1B5AAA-A517-484B-A386-0F48D3B229A1` ("Radiant E2E item 38"), 402×874 pt, @3x.
Nenhum arquivo do repositório nem estado do app foi alterado. Leitura apenas: `maestro hierarchy`,
`simctl io screenshot`, `simctl spawn defaults read`.

Artefatos desta avaliação (todos no scratchpad `critique/`):
- `hierarchy-trilha.json`: árvore de acessibilidade, 130 KB, 115 nós com bounds
- `hierarchy-momento.png`: captura tirada logo após a hierarquia, para correlacionar
- `detect.json`: saída do detector

---

## 1. Detector do impeccable

Comando, executado a partir de `radiant-app/`:

```
node ~/.claude/skills/impeccable/scripts/detect.mjs --json \
  src/features/journey/screens/JourneyHomeScreen.tsx \
  src/features/journey/components/{JourneyLevelBand,JourneyNodeCard,JourneyRecommendationCard,JourneyStageHeader,JourneyTrail,JourneyTrailSpine}.tsx \
  src/features/lesson-flow/screens/LessonFlowScreen.tsx \
  src/features/quiz/components/LessonSummary.tsx \
  src/features/push/components/PushOptInCard.tsx
```

| Medida | Valor |
|---|---|
| Código de saída | 0 |
| Saída (stdout) | `[]` |
| stderr | vazio |
| Achados | **0** |
| Arquivos e linhas analisados | 10 arquivos, 2.371 linhas |

Uma segunda rodada sobre `src/ui/theme.ts`, `src/ui/styles.ts`, `StarfieldBackground.tsx`, `HUD.tsx` e
`QuizTopBar.tsx` também terminou com código 0 e `[]`.

**O vazio não atesta a interface.** O detector aceita `.tsx`: a lista de extensões em
`detector/node/file-system.mjs:26-28` inclui a extensão. Mas o motor de regex
(`detector/engines/regex/detect-text.mjs`) procura propriedades CSS, `className`/Tailwind e marcação
HTML. Os estilos do React Native são objetos `StyleSheet.create` com chaves em camelCase, e nenhuma
regra os alcança. Os achados das seções 2 a 5 (contraste abaixo de AA, alvo de 40 pt, texto vazando
do contêiner, animação infinita) **não** aparecem no detector. Zero achados aqui significa
"fora do alcance da ferramenta", não "limpo".

---

## 2. Árvore de acessibilidade real (`maestro hierarchy`)

`maestro --device 0A1B… hierarchy` terminou com código 0 em 12,7 s. O estado no momento da captura
era a trilha aberta no nó PRÓXIMO "Quiz: Ressonância magnética" (ver `hierarchy-momento.png`).

### 2.1 Elementos interativos e área

| Elemento (rótulo) | Bounds (pt) | Área | ≥ 44×44? |
|---|---|---|---|
| "3 de 5 vidas; próxima em 8 minutos" (botão das vidas) | [206,72][382,122] | 176×50 | sim |
| "Quiz: Tomografia computadorizada. Concluído." | [219,0][386,156] | 167×156 | sim (cortado pela borda da lista, ver 2.4) |
| "Revisar Quiz: Tomografia computadorizada. Disponível em 17/10/2026 às 17:34." (enabled=false) | [16,172][182,370] | 166×198 | sim |
| "Quiz: Ressonância magnética. Próximo passo." | [219,386][386,568] | 167×182 | sim |
| "Revisar Quiz: Ressonância magnética. Bloqueado." (enabled=false) | [16,584][182,764] | 166×180 | sim |
| "Quiz: Equipamentos de radiologia convencional. Bloqueado." (enabled=false, fora da tela) | [219,780][386,960] | 167×180 | sim |
| "Estude, tab, 1 of 2" | [0,801][201,848] | 201×47 | sim |
| "Perfil, tab, 2 of 2" | [201,801][402,848] | 201×47 | sim |

- **Interativos com área menor que 44×44 na trilha: 0.**
- Elementos pequenos que não são interativos: pílulas do HUD "156 XP" (75×36) e
  "1 dia de sequência" (66×36), ambas `accessibilityRole="text"` (`HUD.tsx:44`); âncoras da linha
  (18×18); ícones (44×44); pílula PRÓXIMO (89×20). **Falsos positivos** para alvo de toque.
- Fora da trilha, no código: alvos menores que 44 pt, ver seção 3.2.

### 2.2 Elementos sem rótulo

- **Interativos sem rótulo: 0.** Todo `Pressable` da trilha tem `accessibilityLabel`
  (`JourneyNodeCard.tsx:161`, `HUD.tsx:197`).
- Nós sem rótulo na árvore:
  - **24 nós de 1×1 a 3×3 pt**, nas profundidades 22 e seguintes, sob `journey-home-screen`. São
    as 24 estrelas de `StarfieldBackground variant="focused"`. A quantidade bate com o padrão do
    componente (`StarfieldBackground.tsx:210`).
  - 5 corações `hud-heart-0..4` (28×28).
  - Nós de layout em tela cheia.
  - **Falso positivo provável para o VoiceOver:** as estrelas não declaram `accessible`, e os
    corações são `accessible={false}` quando o botão existe (`HUD.tsx:103`). O XCUITest/Maestro lista
    views com `testID` ou com geometria, não só elementos do VoiceOver. Mesmo assim, as estrelas
    **pesam na árvore que o Maestro percorre a cada consulta** (24 de 115 nós) e não têm
    `accessibilityElementsHidden`/`importantForAccessibility="no-hide-descendants"`, ao contrário da
    linha (`JourneyTrailSpine.tsx:54-55`).

### 2.3 Rótulos redundantes, vazados ou incompletos

1. **Valor "direita"/"esquerda" exposto em cada linha.** `JourneyTrail.tsx:194` põe
   `accessibilityValue={{ text: alignRight ? 'direita' : 'esquerda' }}` na `View` da linha. Na árvore
   ele aparece como `text`/`value` = "direita"/"esquerda" em 5 de 5 linhas. É um gancho de teste de
   layout. Não verificado se o VoiceOver o lê: a `View` não é `accessible`, então provavelmente não
   lê.
2. **Esse valor mente com texto grande.** `JourneyTrail.tsx:189` calcula
   `alignRight = nodeIndex % 2 === 1`, mas o cartão usa `largeText || nodeIndex % 2 === 1`
   (`JourneyNodeCard.tsx:132`). Com `fontScale > 1.3`, todo cartão vai para a direita e metade das
   linhas continua anunciando "esquerda".
3. **O tipo do nó fica fora do rótulo.** O cartão mostra o sobrescrito "LIÇÃO", "REVISÃO",
   "CHECKPOINT" ou "CONQUISTA" (`JourneyNodeCard.tsx:198`), mas o rótulo é só
   `${title}. ${status}.` (linha 161). Exemplo da árvore: "Quiz: Ressonância magnética. Próximo
   passo." Quem usa leitor de tela não ouve o tipo, e os títulos de conquista ("Conquista da
   unidade") e de checkpoint ("Avaliação 1 de 5") dependem dele.
4. **No nó recomendado, o rótulo troca o estado pela recomendação.** "Próximo passo" substitui
   "Disponível" (linha 161). A pílula PRÓXIMO fica escondida de propósito (linhas 190-191), o que é
   coerente e não é achado.
5. **Nós bloqueados não dizem como destravar.** Eles têm `enabled=false` (a árvore confirma em 3 de
   3), mas não têm `accessibilityHint`. O VoiceOver lê o rótulo seguido de "esmaecido". A faixa de
   nível, ao contrário, diz "Abre ao concluir …" (`JourneyLevelBand.tsx:33,39`).
6. **Botão das vidas sem `accessibilityHint`** (`HUD.tsx:194-198`). O toque abre a folha de vidas.
7. Os dois nós "Horizontal scroll bar, 1 page" em [16,739][386,769] são indicadores do
   `UIScrollView` que o iOS sempre expõe. **Falso positivo.**

### 2.4 Ordem de leitura a partir do topo

Status bar → "156 XP" → "1 dia de sequência" → "3 de 5 vidas…" (botão) → "Quiz: Tomografia
computadorizada. Concluído." → "Revisar Quiz: Tomografia… Disponível em…" → "Quiz: Ressonância
magnética. Próximo passo." → "Revisar Quiz: Ressonância magnética. Bloqueado." → "Quiz: Equipamentos…
Bloqueado." (fora da tela) → abas.

Fatos mecânicos sobre essa ordem:
- **O cabeçalho do estágio (`JourneyStageHeader`, role header) e o cartão de recomendação não estão
  na árvore.** A lista abre centralizada no PRÓXIMO (`JourneyTrail.tsx:13,131`), e o `ListHeaderComponent`
  foi virtualizado ou rolado para fora. **Não existe nenhum nó com role header na tela de abertura.**
- O primeiro cartão da trilha fica em [16,0][386,156], **atrás do HUD**. O viewport da lista começa em
  y=148, então o cartão é cortado visualmente e mesmo assim está na árvore com rótulo completo.
  Seletor por texto no Maestro acha esse cartão onde um toque cairia no HUD.

### 2.5 Densidade

- Viewport útil da trilha: [16,148][386,772], ou **624 pt de altura**.
- Linhas medidas: 156, 198, 182, 180 e 180 pt, mais 16 pt de folga (`TRAIL_GAP`). Isso dá cerca de
  196 pt por nó.
- **Cabem 3 cartões inteiros e uma lasca por tela.** Nas 17 capturas `trilha-01..17` o padrão se
  repete, com 3 a 4 cartões por quadro.
- Cada cartão ocupa 45% da largura (`JourneyNodeCard.tsx:276`) e alterna de lado. A outra metade de
  cada linha fica vazia (`marginRight/marginLeft: '55%'`, linhas 287 e 290).
- Elementos focáveis pelo VoiceOver na tela: 9 (3 do HUD, 4 cartões, 2 abas).
- Nós totais na árvore: 115, dos quais 24 são estrelas.
- Altura total do conteúdo da lista: 8.858 pt (o nó de conteúdo vai de [16,-4650] a [386,4208]),
  cerca de **14 telas** de rolagem.

---

## 3. Análise estática de UI

### 3.1 Truncamento (`numberOfLines`)

| Arquivo:linha | Texto | Regra |
|---|---|---|
| `JourneyNodeCard.tsx:199` | título do nó | `numberOfLines={largeText ? undefined : 3}`, ou seja, corta em 3 linhas sempre que `fontScale ≤ 1.3`, incluindo o tamanho padrão (1.0) e o XXL (≈1.24, `useLargeTextLayout.ts:6,11`) |
| `JourneyLevelBand.tsx:49` | nome da trilha seguinte | `numberOfLines={2}` fixo, também com texto grande |
| `JourneyStageHeader.tsx:46` | nome do estágio | 2 linhas, sem limite com texto grande |

Nenhum `ellipsizeMode` foi encontrado, então vale o padrão `tail`. O rótulo de acessibilidade carrega o
título completo (`JourneyNodeCard.tsx:161`), e por isso o corte é **só visual**.

### 3.2 Toques: papel, rótulo e alvo

| Arquivo:linha | Controle | Papel | Rótulo | Alvo |
|---|---|---|---|---|
| `JourneyNodeCard.tsx:157` | cartão do nó | button | sim | ≥166×156 (medido) |
| `HUD.tsx:194` | vidas | button | sim | 176×50 (medido) |
| `LessonSummary.tsx:192` | estrelas de avaliação (×5) | button | sim ("Avaliar a aula com n de 5") | `minWidth/minHeight: 48` (linhas 316-321) |
| `QuizTopBar.tsx:42` | fechar a lição | button | "Fechar quiz" | **40×40** (linhas 66-67), **sem `hitSlop`**, menor que 44 |
| `PushOptInCard.tsx:65` | "Agora não" | **sem `accessibilityRole`** | só o texto do filho | `padding: 12` com texto de 14 pt e altura de linha ≈17, **≈41 pt de altura (estimado, não medido: o cartão não estava na tela da hierarquia)** |

- `AppButton` (usado por PushOptIn, recomendação, lição e resumo) declara `accessibilityRole="button"`
  e `minHeight: 56` (`AppButton.tsx:122,158`). Não é achado.
- `hitSlop`: **0 ocorrências** em todos os arquivos-alvo.

### 3.3 Escala de fonte

- `allowFontScaling={false}`: 0 ocorrências.
- `maxFontSizeMultiplier` aparece em `JourneyStageHeader.tsx:46`, `JourneyRecommendationCard.tsx:48,55`,
  `HUD.tsx:51,187` e `LessonSummary.tsx:153`.
- O título do nó (`JourneyNodeCard.tsx:199`) e o texto da faixa (`JourneyLevelBand.tsx:48-52`) **não
  têm limite de escala**. Junto com o corte em 3 linhas até 1.3, o texto ampliado até XXL corta mais
  do que o medido na seção 5. Isso é inferência e não foi medido.

### 3.4 Cores fixas fora do tema

| Arquivo:linha | Valor | Observação |
|---|---|---|
| `PushOptInCard.tsx:13-17,76-77,103-104` | `#FFFFFF`, `#8E8E93`, `#0A84FF`, `rgba(10,132,255,…)`, `fontSize: 14` solto | paleta própria no estilo iOS; o resto da tela usa `galaxyColors`. `body` sobrescreve `fontSize`/`lineHeight` do token (linhas 92-93), e `secondaryText` não tem `fontFamily` (cai na fonte do sistema, não na Sora) |
| `JourneyHomeScreen.tsx:264,267,270` | `rgba(255,59,48,…)`, `#FF6B6B` | cartão de erro |
| `LessonFlowScreen.tsx:676,706,709,715` | os mesmos de erro, mais `rgba(255,255,255,0.07)` | duplicado de JourneyHome |
| `QuizTopBar.tsx` (iconButton) | `rgba(255,255,255,0.07)` | |
| `JourneyNodeCard.tsx:228` | `#FFFFFF` na pílula PRÓXIMO | o comentário justifica; o valor é igual a `textPrimary` |
| `StarfieldBackground.tsx:101,240-244` | `#FFFFFF`, nebulosas em rgba | decorativo |

### 3.5 Contraste WCAG dos pares da trilha

Calculei a composição alfa sobre `galaxyColors.background` `#03030d` (`theme.ts:98-139`) e conferi
três pares contra os pixels de `hierarchy-momento.png`. A composição bate com a captura: "Bloqueado"
renderiza `#69696F` sobre `#0D0D17`.

| Par (arquivo:linha do estilo) | Texto | Fundo | Razão | Mínimo | Resultado |
|---|---|---|---|---|---|
| **status "Bloqueado"** (caption 13 pt, `nodeLockedAccent` .38, `JourneyNodeCard.tsx:204`/`theme.ts:139`) | #69696F | #0D0D17 | **3,54:1** (pixel: 3,55) | 4,5 | **reprova AA** |
| **status "Disponível em …" da revisão futura** (mesmo token, mesmo estilo) | #69696F | #0D0D17 | **3,54:1** | 4,5 | **reprova AA** |
| título bloqueado (`textSecondary` .55, linha 316) | #929297 | #0D0D17 | 6,24:1 | 4,5 | passa |
| sobrescrito "REVISÃO"/"LIÇÃO" (`textTertiary` .46, micro 12 pt) | #7C7C82 | #0D0D17 | 4,66:1 | 4,5 | passa no limite |
| **"Próximo passo"** (caption 13 pt, `#3060FF` sobre `surfaceActive`) | #3060FF | #1A1A23 (pixel #1B1D29) | **3,49:1** (pixel: 3,38) | 4,5 | **reprova AA** |
| status "Disponível"/"Em andamento"/"Retomar" (`#3060FF` sobre `surface`) | #3060FF | #101019 | **3,82:1** | 4,5 | **reprova AA** |
| "Concluído" (`#3DD68C`) | #3DD68C | #0B0B14 | 10,44:1 | 4,5 | passa |
| pílula PRÓXIMO (branco sobre `#3060FF`, micro 12 pt) | #FFFFFF | #3060FF | 4,95:1 | 4,5 | passa |
| cadeado (ícone, .38) | #6D6D74 | #14141E | 3,56:1 | 3,0 (não texto) | passa |
| borda tracejada / âncora bloqueada (.38) | #636369 | #03030D | 3,44:1 | 3,0 | passa |
| **linha não percorrida** (`spine` .12) | #21212A | #03030D | **1,29:1** | 3,0 (gráfico) | **reprova 1.4.11** se a linha carrega informação |
| PushOptIn, corpo `#8E8E93` | #8E8E93 | #030919 | 6,09:1 | 4,5 | passa |

- **O contrato de contraste não cobre os pares reprovados.**
  `scripts/contrast-contract.test.mjs:77,98` testa só `textPrimary`, `textSecondary` e
  `textTertiary`, mais a faixa de nível (linhas 209-211). Um `grep` por `nodeLockedAccent` e por
  `ctaGradientEnd` nesse arquivo devolve 0 ocorrências.
- O comentário em `theme.ts:119-123` registra que `#4A9EFF` (`navBlue`) é o azul de texto e estado
  ativo, e que `#2155FF`/`#3060FF` é superfície. Mesmo assim, `JourneyNodeCard.tsx:9` usa
  `accent = ctaGradientEnd` (`#3060FF`) como **cor de texto** no status.
- Ressalva: o fundo estrelado tem estrelas brancas de 1 a 3 pt passando por trás do texto (visíveis em
  `trilha-02`: "Computadoriza..:"), o que gera variação local. Não altera as razões acima.

---

## 4. Animação, "Reduzir movimento" e o E2E

### 4.1 O que respeita "Reduzir movimento"

| Componente | Mecanismo | Arquivo:linha |
|---|---|---|
| `StarfieldBackground` (estrelas e nebulosas) | `still = reducedMotion \|\| !focused`; com `still`, opacidade fixa e deriva zerada | `StarfieldBackground.tsx:213-215,73-76,128-131` |
| `Confetti` | `if (reducedMotion) return null` | `components/ui/Confetti.tsx:91,99` |
| `useFadeInUp` e `useScalePop` (estrelas do resumo) | ramo com redução de movimento | `ui/motion.ts:74-80,114-117` |
| hook-base | `AccessibilityInfo.isReduceMotionEnabled()` mais o evento `reduceMotionChanged` | `ui/accessibility/useReducedMotionPreference.ts:36,50` |

Ninguém nos arquivos-alvo usa `useReducedMotion` nem `ReduceMotion` do Reanimated: as animações são
`withRepeat(…, -1)` cruas, e a decisão vem do hook do projeto. **Não encontrei animação desses alvos
que ignore a preferência.**

### 4.2 O que anima sem parar quando a preferência está desligada

- **Trilha:** 24 estrelas, cada uma com `withRepeat(withSequence(withTiming(max), withTiming(min)), -1)`,
  ciclos de 1,5 a 5 s e atrasos até 4 s (`StarfieldBackground.tsx:78-88,232-233`). Elas só param
  quando a tela perde o foco.
- **Resumo da lição:** variante `galaxy` com **120 estrelas e 3 nebulosas em deriva** (9 s por meio
  ciclo), mais `Confetti count={40}` (`LessonFlowScreen.tsx:475-476`).
- **Estado do simulador medido:**
  `xcrun simctl spawn 0A1B… defaults read com.apple.Accessibility ReduceMotionEnabled` devolve `0`.
  O E2E roda com a animação ligada.

### 4.3 Como desligar em teste

- **Não existe argumento de lançamento nem variável de ambiente para isso.** O `grep` por
  `E2E|launchArg|LaunchArguments|DISABLE_ANIM|reduceMotion` em `src/` acha só o hook acima e
  comentários. `src/config.ts` não tem chave de movimento.
- Os 17 fluxos de `.maestro/` chamam `launchApp` sem `arguments:` (exemplo: `boot-to-home.yaml:7-10`).
- O único desligamento disponível é o do sistema: ligar `ReduceMotionEnabled` no simulador, o que o
  hook do projeto respeita. Esse caminho não foi testado aqui, porque a tarefa era só de leitura.

### 4.4 Custo medido no E2E

`critique/maestro-out/2026-10-16_172012/lesson/logs/maestro.log` registra **12 tentativas
consecutivas** de `scrollUntilVisible` sobre `journey-recommendation-action`, entre 17:20:48 e 17:22:21.
Os intervalos medidos entre os avisos foram **8,8 / 9,0 / 8,9 / 8,8 / 9,0 / 9,1 / 11,0 / 10,4 / 9,5 /
8,8 s**. Cada tentativa gasta cerca de 3,3 s no deslize (17:20:48,10 → 17:20:51,40) e cerca de 5,5 s
até a próxima consulta à árvore.

A atribuição dos cerca de 5,5 s à espera de tela estática é **inferência**, compatível com uma tela
que nunca assenta (estrelas em laço infinito). O log não nomeia a espera. A confirmação mecânica seria
repetir o mesmo fluxo com `ReduceMotionEnabled=1` e comparar os intervalos.

---

## 5. Evidência visual: títulos truncados com "…" (`shots/trilha-*.png`)

Revisei as 18 capturas `trilha-00` a `trilha-17`, todas em 17:17-17:19, com o PRÓXIMO em "Quiz:
Interação das radiações…". Cerca de 57 cartões distintos aparecem nelas.

**Títulos distintos truncados: 15.** São 9 revisões ("Revisar …") e 6 lições.

| # | Texto visível | Captura | Tipo | Estado |
|---|---|---|---|---|
| 1 | Princípios de Tomografia Computadoriza… | trilha-01 | lição | concluído |
| 2 | Revisar Princípios de Tomografia Computadoriza… | trilha-02 | revisão | disponível em data |
| 3 | Quiz: Profissão e atuação do técnico em radi… | trilha-02 | lição | concluído |
| 4 | Revisar Quiz: Profissão e atuação do técn… | trilha-02 | revisão | disponível em data |
| 5 | Revisar Quiz: Estrutura da matéria e núcle… | trilha-04 | revisão | disponível em data |
| 6 | Quiz: Radioatividade, partículas e ativ… | trilha-04 | lição | concluído |
| 7 | Revisar Quiz: Radioatividade, partículas e ativ… | trilha-04 | revisão | disponível em data |
| 8 | Revisar Quiz: Raios X: descoberta e pr… | trilha-05 | revisão | disponível em data |
| 9 | **Quiz: Interação das radiações e proteção radiol…** | trilha-06 | lição | **PRÓXIMO (nó recomendado)** |
| 10 | Revisar Quiz: Interação das radiações e prot… | trilha-06 | revisão | bloqueado |
| 11 | Quiz: Equipamentos de radiologia conv… | trilha-08 | lição | bloqueado |
| 12 | Revisar Quiz: Equipamentos de radiologia conv… | trilha-08 | revisão | bloqueado |
| 13 | (Quiz:) Componentes básicos do equi… | trilha-09 (topo cortado) | lição | bloqueado |
| 14 | Revisar Quiz: Componentes básicos do equi… | trilha-09 | revisão | bloqueado |
| 15 | Revisar Quiz: Preservação de alimentos por ir… | trilha-10 | revisão | bloqueado |

Contagens:
- Indeterminados, com o título cortado pela borda da captura e não por reticências: 2. São "Revisar
  Quiz: Aplicações…" (trilha-06 para 07) e "Revisar Quiz: Acessórios…" (trilha-10 para 11).
- Nenhum título da trilha "Matéria, energia e radiação" (trilha-13 a 17) foi truncado: são curtos.
- Na `trilha-00`, o título do cartão de recomendação ("Quiz: Interação das radiações e proteção
  radiológica") **não** tem reticências. Ele só é cortado pela borda da lista.

Outros defeitos mecânicos vistos nas capturas:
- **Texto vazando da placa da faixa de nível.** Ampliei os recortes em `scratchpad/crops/band09.png` e
  `band13.png`:
  - em `trilha-09`, o título "PRÁTICA, QUALIDADE E PROFISSÃO" ultrapassa a borda direita da placa
    em cerca de 5 pt;
  - em `trilha-13`, o "e" final da dica "Abre ao concluir Prática, Qualidade e" atravessa a borda.

  As duas placas têm cadeado. A causa provável, não verificada, é `copy: { alignItems: 'center' }`
  sem `flexShrink: 1` dentro de uma placa com `maxWidth: '72%'` (`JourneyLevelBand.tsx:82,84-86`): o
  ícone de 14 pt mais a folga empurram o texto. A faixa sem cadeado (`trilha-05`, "PRÓXIMO NÍVEL")
  não vaza.
- **Status cortado sem reticências.** Em `trilha-02`, o último cartão mostra "Disponível em 17/10/2(",
  com a data cortada na borda direita do cartão. Os outros cartões quebram a data em duas linhas.
  Pode ser um quadro de medição transitória, porque a captura foi tirada durante a rolagem. Precisa
  de nova captura para confirmar.
- O sobrescrito "BLOQUEADO" da faixa não fica centrado na placa (`trilha-09`, `trilha-13`): ele
  centra na coluna de texto, deslocada pelo cadeado. Falso positivo provável se a intenção é centrar
  no texto.

---

## Falsos positivos marcados

1. Detector com `[]`: ausência de cobertura, não ausência de defeito (seção 1).
2. 24 estrelas e 5 corações sem rótulo: não são elementos do VoiceOver. Pesam só na árvore do
   XCUITest/Maestro (2.2).
3. Pílulas do HUD de 36 pt de altura: não são interativas (2.1).
4. Barras de rolagem "Horizontal scroll bar": expostas pelo próprio iOS (2.3, item 7).
5. `accessibilityValue` "direita"/"esquerda": provavelmente não é lido pelo VoiceOver. É achado de
   higiene e de correção com texto grande, não de leitura (2.3, itens 1 e 2).
6. A pílula PRÓXIMO escondida do leitor é intencional e correta (2.3, item 4).
