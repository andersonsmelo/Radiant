# Refinamento visual antes da 1.6 — plano de execução

> **Para quem executa (agente):** use `superpowers:subagent-driven-development`
> (recomendado) ou `superpowers:executing-plans`, tarefa por tarefa. Os passos
> usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** levar o ciclo de resposta da aula, as telas fracas e as sobras do
sistema antigo ao nível do Medalhão antes de a 1.6 ir para a loja.

**Arquitetura:** três componentes novos (alternativa com relevo, folha de
retorno, área de grupo) e uma variante do `AppButton` entram primeiro, com
teste e história; depois cada tela passa a consumi-los. Uma guarda em AST
impede que cor e tamanho de texto literais voltem.

**Stack:** React Native 0.81, Expo 54, TypeScript, Jest, Reanimated 4,
`react-native-svg`, Maestro.

**Desenho:** [`2026-11-16-refinamento-visual-1-6-design.md`](../superpowers/specs/2026-11-16-refinamento-visual-1-6-design.md),
aprovado pelo dono em 2026-11-16. Quem executa lê os dois.

**Estado:** executado na noite de 2026-11-16 para 2026-11-17, na branch
`claude/refinamento-1-6-desenho`, até `f6b39148`. As tarefas 1 a 10 estão feitas e
revisadas. Da tarefa 11, ficaram sem fazer a imagem de abertura (passo 1), as
capturas no Android, no texto máximo e com "reduzir movimento" (passo 3) e a suíte
em worktree limpa (passo 4). A execução mudou alguns pontos do desenho; eles estão
na seção 11 da spec. [Evidência](../evidence/2026-11-refinamento/README.md). As
caixas abaixo não foram marcadas uma a uma: o registro é a evidência de cada tarefa.
A 1.6.0 já tem build no EAS; este trabalho pede build novo, que é do dono.

## Restrições globais

- Cor só por `galaxyColors`, `medalColors`, `feedbackColors`, `hudIconTones`,
  `hudLabelTones` e `semanticColors.galaxy`. Cor nova nasce em
  `radiant-app/src/ui/theme.ts`.
- Tamanho de texto só por `typography.*` de `radiant-app/src/ui/styles.ts`.
- Ícone é SVG desenhado no código, em três tons, com a luz de cima à esquerda.
  Nunca emoji, caractere de texto nem `@expo/vector-icons` novo.
- Alvo de toque de 44 pt ou mais. Texto ampliado até o máximo do sistema sem
  corte. Toda animação tem estado parado sob "reduzir movimento".
- Texto do app: sem etiqueta em caixa alta acima de título, sem travessão de
  efeito, sem palavra interna do código.
- Os `testID` que os roteiros do Maestro usam não mudam de nome:
  `lesson-item-feedback`, `lesson-option-<id>`, `categorize-group-<rótulo>`,
  `categorize-item-<rótulo>`, `multi-select-*`, `true-false-certo`,
  `true-false-errado`, `mission-fill-<id>`.
- Com cada chave da 1.6 desligada (`ENABLE_LEAGUE`, `ENABLE_DECORATIONS`,
  `ENABLE_CONVERSION_PROMPTS`, `ENABLE_RICH_FEEDBACK`), a tela se comporta como
  antes da chave.
- Fora do escopo: `HomeScreen` antiga, tela da liga além da limpeza, prévias
  das decorações, reescrita de conteúdo de aula.
- Cada tarefa é um run do Loop: `node scripts/loop/abrir.mjs "<descrição>"
  <arquivos>` antes de criar qualquer arquivo, e `node scripts/loop/fechar.mjs`
  ao fim. Os comandos `loop` usam Node 24; teste e gate usam Node 20.
- Teste focado: `cd radiant-app && npx jest --runInBand <arquivo>`. Gate de
  cada tarefa: `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`.
- Toda asserção nova é vista falhando com o defeito que ela nomeia, e a
  execução vermelha vai para `docs/evidence/2026-11-refinamento/` como texto.

## Foco de revisão

1. **Texto no máximo de acessibilidade na folha de retorno.** A folha cresce, e
   acima de dois terços da tela rola por dentro; o botão de continuar nunca sai
   da tela. Teste na tarefa 3.
2. **Tela curta (iPhone SE) com explicação longa.** A última alternativa
   continua alcançável por rolagem atrás da folha. Teste na tarefa 3.
3. **`ENABLE_RICH_FEEDBACK` desligada.** A folha aparece sem som, vibração nem
   animação nova. Teste na tarefa 3.
4. **Formatos sem alternativas** (ordenar, parear, bancada, hotspot, lacuna). A
   folha continua dizendo a resposta certa em texto. Teste na tarefa 3.
5. **Botão desabilitado no Android.** Sem opacidade, o lábio não aparece
   através da face. Teste na tarefa 1 e captura na tarefa 11.

---

## Mapa de arquivos

| Arquivo | Papel |
| --- | --- |
| `radiant-app/src/components/ui/AppButton.tsx` | variante desabilitada |
| `radiant-app/src/ui/components/VerdictIcons.tsx` (novo) | marcas de certo, errado e fechar |
| `radiant-app/src/components/ui/ChoiceOption.tsx` (novo) | alternativa com relevo |
| `radiant-app/src/features/lesson-flow/components/AnswerFeedbackSheet.tsx` (novo) | folha de retorno; substitui `AnswerFeedbackCard.tsx` |
| `radiant-app/src/features/lesson-flow/renderers/GroupArea.tsx` (novo) | área de grupo |
| `radiant-app/src/features/lesson-flow/renderers/teachBody.ts` (novo) | separa abertura e corpo do passo de ensino |
| `radiant-app/src/ui/components/MissionIcons.tsx` (novo) | três peças de missão |
| `radiant-app/src/features/subscription/components/PlanCard.tsx` (novo) | cartão de plano |
| `radiant-app/scripts/style-literal-contract.mjs` (novo) | guarda de cor e tamanho literais |

---

### Tarefa 1: botão desabilitado legível

**Arquivos:**
- Modificar: `radiant-app/src/components/ui/AppButton.tsx`,
  `radiant-app/src/components/ui/AppButton.test.tsx`,
  `radiant-app/src/components/ui/AppButton.stories.tsx`,
  `radiant-app/scripts/contrast-contract.test.mjs`, `docs/DESIGN.md`

**Interfaces:**
- Produz: `AppButton` com `disabled` passa a desenhar face
  `galaxyColors.surfaceActive`, borda de 1 px `galaxyColors.border`, lábio
  `galaxyColors.backgroundAlt` e rótulo `galaxyColors.textSecondary`, em
  qualquer variante com lábio. Na `ghost`, só o rótulo muda, para
  `galaxyColors.textTertiary`. A assinatura de `AppButtonProps` não muda.

- [ ] **Passo 1: testes que falham**, em `AppButton.test.tsx`:
  - `desabilitado não aplica opacidade`: nenhum estilo achatado da face nem do
    relevo tem `opacity` menor que 1.
  - `desabilitado usa a face neutra`: `backgroundColor` da face é
    `galaxyColors.surfaceActive` e a cor do rótulo é `galaxyColors.textSecondary`,
    para `primary`, `galaxy`, `gold`, `secondary`, `success` e `error`.
  - `desabilitado continua anunciado`: `accessibilityState.disabled` é `true`.
- [ ] **Passo 2:** rodar o teste focado e guardar a saída vermelha.
- [ ] **Passo 3:** trocar `styles.disabled` (`opacity: 0.45`) pela face neutra,
  e tirar `needsOffscreenAlphaCompositing`, que só existia por causa da
  opacidade.
- [ ] **Passo 4:** em `contrast-contract.test.mjs`, cobrar 4,5:1 para
  `textSecondary` sobre `surfaceActive`.
- [ ] **Passo 5:** história `Desabilitado` com as seis variantes.
- [ ] **Passo 6:** em `docs/DESIGN.md`, seção Buttons, trocar a linha
  "Desabilitado: opacidade 0,45…" pela variante nova.
- [ ] **Passo 7:** gate, fechar o run e commit `feat(ui): botão desabilitado legível`.

### Tarefa 2: marcas desenhadas e alternativa com relevo

**Arquivos:**
- Criar: `radiant-app/src/ui/components/VerdictIcons.tsx` e teste;
  `radiant-app/src/components/ui/ChoiceOption.tsx`, teste e história
- Modificar: `radiant-app/src/components/ui/index.ts`,
  `radiant-app/src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.tsx`,
  `radiant-app/src/features/lesson-flow/renderers/TapChip.tsx`,
  `radiant-app/src/features/lesson-flow/renderers/HotspotStepRenderer.tsx`,
  `radiant-app/src/features/lesson-flow/renderers/ComparisonStepRenderer.tsx`,
  `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`,
  `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`, e os
  testes de cada um

**Interfaces:**
- Produz:
  ```ts
  // VerdictIcons.tsx
  export function VerdictIcon(props: { verdict: 'correct' | 'incorrect'; size?: number }): JSX.Element; // decorativo, 24 por padrão
  export function CloseIcon(props: { size?: number; color?: string }): JSX.Element; // 18 por padrão

  // ChoiceOption.tsx
  export type ChoiceOptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'dimmed';
  export function ChoiceOption(props: {
    label: string; state: ChoiceOptionState; onPress?: () => void; disabled?: boolean;
    role?: 'radio' | 'checkbox'; testID?: string; accessibilityLabel?: string; accessibilityHint?: string;
  }): JSX.Element;
  ```
- `MultipleChoiceStepRenderer` ganha `correctOptionId?: string`, lido só quando
  `submitted` é `true`. `LessonFlowScreen` passa
  `currentInteraction.payload.correctOptionId` quando `player.showingFeedback`.

Cores por estado da `ChoiceOption` (face, borda de 2 px, lábio de 4 pt, texto):

| Estado | Face | Borda | Lábio | Texto |
| --- | --- | --- | --- | --- |
| `idle` | `surface` | `border` | `backgroundAlt` | `textPrimary` |
| `selected` | `surfaceActive` | `navBlue` | `medalColors` lábio da unidade | `textPrimary` |
| `correct` | `feedbackColors` superfície de acerto | preenchimento de acerto | lábio de acerto | preenchimento de acerto |
| `incorrect` | superfície de erro | preenchimento de erro | lábio de erro | preenchimento de erro |
| `dimmed` | `surface` | `border` | `backgroundAlt` | `textTertiary` |

- [ ] **Passo 1: testes que falham.**
  - `ChoiceOption.test.tsx`: `mostra a marca de acerto só em correct`,
    `mostra a marca de erro só em incorrect`, `selected anuncia selecionado`
    (`accessibilityState.selected` ou `checked` conforme `role`),
    `altura mínima de 44` e `não usa opacidade em dimmed`.
  - `MultipleChoiceStepRenderer`: `depois de conferir, a certa fica correct, a
    escolhida errada fica incorrect e as outras dimmed`; `o texto "Selecionada"
    não aparece mais`; `lesson-option-<id>` continua existindo.
  - `TapChip`: `o veredito desenha VerdictIcon e o rótulo não começa com ✓ nem ✗`;
    `accessibilityLabel` continua dizendo o veredito por extenso.
  - `SubscriptionScreen`: `o botão de fechar não tem o caractere ✕`.
- [ ] **Passo 2:** rodar os testes focados e guardar a saída vermelha.
- [ ] **Passo 3:** implementar `VerdictIcons.tsx` e `ChoiceOption.tsx`. O
  relevo segue o do `AppButton`: lábio atrás da face, e a face desce na
  pressão em `duration.micro`, de uma vez sob "reduzir movimento".
- [ ] **Passo 4:** trocar a linha de alternativa do
  `MultipleChoiceStepRenderer` por `ChoiceOption`, e os caracteres de
  `TapChip`, `HotspotStepRenderer`, `ComparisonStepRenderer` e
  `SubscriptionScreen` pelos ícones.
- [ ] **Passo 5:** enumerar o que sobrou. Meta: nenhum caractere `✓ ✗ ✕ ✔ ✖ ×`
  usado como ícone em `radiant-app/src` fora de teste. Duas buscas com
  convenções diferentes (o caractere literal e o escape `\u27xx`), e a
  contagem zero registrada na evidência.
- [ ] **Passo 6:** histórias da `ChoiceOption` nos cinco estados, com texto
  ampliado.
- [ ] **Passo 7:** gate, fechar o run e commit
  `feat(aula): alternativa com relevo e marcas desenhadas`.

### Tarefa 3: folha de retorno

**Arquivos:**
- Criar: `radiant-app/src/features/lesson-flow/components/AnswerFeedbackSheet.tsx`,
  teste e história
- Remover: `radiant-app/src/features/lesson-flow/components/AnswerFeedbackCard.tsx`
  e o teste dele, depois de migrar as asserções
- Modificar: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`,
  `LessonFlowScreen.flow.test.tsx`,
  `radiant-app/src/features/hearts/components/HeartLossNotice.tsx` e quem o usa
  na aula, `docs/DESIGN.md`

**Interfaces:**
- Consome: `AppButton` (`success`, `error`), `CastAvatar`,
  `castExpressionFor`, `useCardEnter`, `motionMsFor`.
- Produz:
  ```ts
  export function AnswerFeedbackSheet(props: {
    correct: boolean; message: string;
    /** Só para formatos sem alternativas marcadas: a resposta certa em texto. */
    correctLabel?: string;
    heartLost?: boolean;
    actionLabel: string; onAction: () => void;
    rich?: boolean; celebrate?: boolean; encouragement?: string;
    onHeightChange?: (height: number) => void;
  }): JSX.Element;
  ```
  A raiz mantém `testID="lesson-item-feedback"`. O botão usa `actionLabel`, que
  é o `confirmationLabel` de hoje ("Continuar" ou "Concluir e voltar").

Comportamento:
- A folha fica fora da `ScrollView`, no lugar do `styles.footer`, só quando
  `player.showingFeedback && currentInteraction`. Antes de conferir, o rodapé
  de hoje continua igual.
- Fundo: superfície de acerto ou de erro de `feedbackColors`, com borda de cima
  de 2 px no lábio do mesmo par. Título "Resposta correta" ou "Vamos reforçar".
- `heartLost` mostra "Menos 1 vida" na linha do título, e o aviso que hoje
  aparece sob o HUD da aula deixa de aparecer nesse momento.
- `correctLabel` só é passado quando o formato não é `multiple-choice`,
  `true-false` nem `multi-select`.
- Altura máxima de dois terços da janela; acima disso, a explicação rola por
  dentro e o botão fica fixo.
- A `ScrollView` da aula recebe `paddingBottom` igual à altura medida da folha
  (`onHeightChange`), e rola até a alternativa escolhida.
- Ao aparecer, o foco de acessibilidade vai para o título.
- A moldura externa do passo (o cartão que envolve o conteúdo em
  `LessonFlowScreen`) sai: o conteúdo fica direto sobre o fundo.

- [ ] **Passo 1: testes que falham.**
  - `AnswerFeedbackSheet.test.tsx`: `acerto usa a variante success e erro usa
    error no botão`; `heartLost mostra "Menos 1 vida"`; `correctLabel aparece
    como "Resposta certa: …" só no erro`; `sem rich, não chama a animação de
    entrada com duração`; `o botão chama onAction uma vez`.
  - `LessonFlowScreen.flow.test.tsx`: `depois de conferir, o retorno está fora
    da ScrollView e o rodapé antigo não está na árvore`; `em múltipla escolha a
    folha não repete "Sua resposta"`; `em ordenar, a folha diz a resposta
    certa`; `com fontScale 3,1 e janela de 568 pt de altura, o botão de
    continuar está dentro da janela` (asserção sobre a altura máxima calculada,
    extraída para função pura `feedbackSheetMaxHeight(windowHeight: number): number`
    no mesmo arquivo da folha); `com ENABLE_RICH_FEEDBACK desligada, nenhum som
    novo é emitido ao abrir a folha`.
- [ ] **Passo 2:** rodar e guardar a saída vermelha.
- [ ] **Passo 3:** implementar a folha e trocar o uso em `LessonFlowScreen`.
- [ ] **Passo 4:** enumerar quem mais alcança o estado de retorno. Meta: todo
  chamador de `AnswerFeedbackCard` e todo lugar que mostra retorno de resposta
  (`grep` pelo componente e por `lastFeedback`), com a lista na evidência e a
  decisão de cada um: migra para a folha ou fica (revisão e avaliação têm tela
  própria e ficam).
- [ ] **Passo 5:** em `docs/DESIGN.md`, nova entrada "Folha de retorno" em
  Components.
- [ ] **Passo 6:** rodar os roteiros do Maestro da aula
  (`learning-critical-path.yaml`, `hybrid-native-evidence.yaml`,
  `g4-native-evidence.yaml`) no simulador e guardar o resultado.
- [ ] **Passo 7:** gate, fechar o run e commit `feat(aula): folha de retorno no rodapé`.

### Tarefa 4: classificar em grupos

**Arquivos:**
- Criar: `radiant-app/src/features/lesson-flow/renderers/GroupArea.tsx` e teste
- Modificar: `CategorizeStepRenderer.tsx`, `ClozeStepRenderer.tsx`,
  `LessonFlowScreen.tsx` (rótulo do botão) e os testes

**Interfaces:**
- Produz:
  ```ts
  // GroupArea.tsx
  export function GroupArea(props: {
    label: string; ready: boolean; empty: boolean; onPress?: () => void;
    accessibilityLabel: string; testID?: string; children?: ReactNode;
  }): JSX.Element;

  // CategorizeStepRenderer.tsx
  export function categorizePendingCount(payload: CategorizePayload, value?: string): number;
  ```
- `ready` é `true` quando há ficha escolhida: borda cheia em `navBlue` e a
  linha "Toque aqui para colocar a ficha escolhida". Sem ficha escolhida, borda
  tracejada em `borderActive`. `empty` mostra "Vazio".

- [ ] **Passo 1: testes que falham.**
  - `CategorizeStepRenderer`: `não existe mais o rótulo "Colocar em"`; `tocar
    numa ficha e depois num grupo põe a ficha dentro do grupo`; `tocar numa
    ficha já colocada a devolve`; `categorize-group-<rótulo>` e
    `categorize-item-<rótulo>` continuam existindo; `depois de conferir, ficha
    no grupo errado mostra o grupo certo`.
  - `categorizePendingCount`: 3 itens e nenhum colocado devolve 3; todos
    colocados devolve 0; valor malformado devolve o total.
  - `LessonFlowScreen`: `em classificar com 2 fichas pendentes, o botão diz
    "Faltam 2 fichas"; com 1, "Falta 1 ficha"; com 0, "Conferir resposta"`.
- [ ] **Passo 2:** rodar e guardar a saída vermelha.
- [ ] **Passo 3:** implementar `GroupArea` e reescrever a disposição do
  `CategorizeStepRenderer` sobre ela. O `ClozeStepRenderer` passa a usar a
  mesma ficha com relevo, sem mudar de comportamento.
- [ ] **Passo 4:** rodar o roteiro do Maestro que cobre classificar, se
  existir; se não existir, registrar isso na evidência.
- [ ] **Passo 5:** gate, fechar o run e commit `feat(aula): classificar em grupos`.

### Tarefa 5: passo de ensino

**Arquivos:**
- Criar: `radiant-app/src/features/lesson-flow/renderers/teachBody.ts` e teste;
  `radiant-app/src/ui/components/TeachBlockIcons.tsx`
- Modificar: `radiant-app/src/types/lessonFlow.ts`,
  `radiant-app/src/features/lesson-flow/renderers/TeachStepRenderer.tsx` e
  teste, e o validador de conteúdo que conhece `TeachPayload`

**Interfaces:**
- Produz:
  ```ts
  // lessonFlow.ts
  export type TeachBlockIcon = 'equipamento' | 'laudo' | 'duvida' | 'paciente' | 'protecao' | 'imagem';
  export type TeachBlock = { term: string; text: string; icon?: TeachBlockIcon };
  export type TeachPayload = { title: string; body: string; imageUrl?: string; blocks?: TeachBlock[]; source?: string };

  // teachBody.ts
  export function splitTeachBody(body: string): { lead: string; rest: string };
  ```
- `splitTeachBody`: `lead` é a primeira frase, até o primeiro ponto final
  seguido de espaço ou fim de texto; `rest` é o restante, sem espaço inicial.
  Ponto dentro de número ("12.842") não corta. Texto de uma frase só devolve
  `rest` vazio.

- [ ] **Passo 1: testes que falham.**
  - `teachBody.test.ts`: os três casos acima, mais texto vazio e texto com
    quebra de linha antes de marcadores.
  - `TeachStepRenderer`: `não mostra "Ideia-chave"`; `a frase de abertura usa
    textPrimary e o resto textSecondary`; `com blocks, cada bloco mostra termo
    e texto, e o body não aparece repetido`; `source aparece em texto
    terciário`; `bloco sem icon não desenha peça`.
- [ ] **Passo 2:** rodar e guardar a saída vermelha.
- [ ] **Passo 3:** implementar. Os seis ícones seguem a regra dos três tons.
- [ ] **Passo 4:** enumerar onde `TeachPayload` é validado ou gerado. Meta:
  todo esquema, lint e gerador de conteúdo que rejeitaria campo desconhecido
  (`grep` por `TeachPayload` e por `'teach'` em `radiant-app/scripts`,
  `radiant-app/src/features/content` e `scripts/`), cada um aceitando `blocks`
  e `source` como opcionais. Nenhuma aula é alterada.
- [ ] **Passo 5:** gate, fechar o run e commit
  `feat(aula): passo de ensino com abertura, blocos e fonte`.

### Tarefa 6: limpeza e guarda de literais

**Arquivos:**
- Criar: `radiant-app/scripts/style-literal-contract.mjs`,
  `radiant-app/scripts/style-literal-contract.test.mjs`
- Modificar: `radiant-app/package.json` (script `test:style-literal-contract`
  e entrada no `quality`), `.github/workflows/` onde o gate é espelhado, e as
  telas listadas no passo 3

**Interfaces:**
- Produz: `node scripts/style-literal-contract.mjs` sai com código 1 e lista
  `arquivo:linha` quando acha, em `src/features/**` ou `src/app/**`, fora de
  teste e história: literal de cor (`#rgb`, `#rrggbb`, `rgb(`, `rgba(`) como
  valor de propriedade de estilo; `fontSize` com literal numérico;
  `textTransform: 'uppercase'`. Lê a AST com o `typescript`, como o
  `copy-style-contract.mjs`. Isentos por caminho, numa lista no próprio
  arquivo: `features/home/`, `features/telemetry/`, `features/dev-console/`,
  `features/editorial-preview/`, `features/beta/`.

- [ ] **Passo 1: teste que falha**, em `style-literal-contract.test.mjs`, com
  trechos de código em memória: acusa `color: '#FF0000'`; acusa
  `fontSize: 14`; acusa `textTransform: 'uppercase'`; **não** acusa a cor
  citada num comentário nem numa string que não é valor de estilo; não acusa
  `fontSize: typography.body.fontSize`; não acusa arquivo isento.
- [ ] **Passo 2:** rodar, guardar a saída vermelha, implementar a guarda.
- [ ] **Passo 3:** rodar a guarda sobre o app e zerar os achados, tela por
  tela. Meta: zero achados fora da lista de isentos, conferida por uma segunda
  contagem independente (`grep` simples por `rgba(` e por `fontSize: [0-9]`),
  com as duas contagens na evidência. Regras da troca:
  - verde e rosa translúcidos viram as superfícies opacas de `feedbackColors`;
  - branco translúcido vira o degrau correspondente da escada de grafite;
  - âmbar e vermelho translúcidos de fundo viram `surfaceActive` com borda na
    cor cheia do papel;
  - etiqueta em caixa alta acima de título sai, e o título fica;
  - se sobrar tamanho sem papel entre 16 e 24, criar `typography.subtitle`
    (Sora Bold, 18/24) e registrar no `DESIGN.md`.
- [ ] **Passo 4:** tirar o cartão dentro de cartão de `ReviewCard` e do cartão
  "Sessão ativa" de `ReviewScreen` (a instrução vira uma linha de texto).
- [ ] **Passo 5:** conferir que nenhum texto fora do escopo promete o que saiu:
  buscar por "Sessão ativa", "Ideia-chave", "XP total" e "Selecionada" em
  `src`, `.maestro` e `docs/store`, e corrigir roteiro ou texto que ainda cite.
- [ ] **Passo 6:** espelhar o script novo no workflow e conferir com
  `npm run test:ci-gate-parity-contract`.
- [ ] **Passo 7:** gate, fechar o run e commit
  `refactor(ui): cores e tamanhos por token, com guarda`.

### Tarefa 7: recompensa e unidade concluída

**Arquivos:**
- Modificar: `radiant-app/src/features/rewards/screens/RewardScreen.tsx`,
  `RewardScreen.flow.test.tsx`, e o componente de unidade concluída que a
  trilha mostra (localizar por "Unidade concluída")

**Interfaces:**
- Consome: a disposição de `radiant-app/src/features/quiz/components/LessonSummary.tsx`
  (medalha no centro, número de XP sem caixa, uma ação).

- [ ] **Passo 1: testes que falham.** `não existe "XP TOTAL"`; `o XP aparece
  uma vez na tela`; `a sequência não é repetida fora do HUD`; `há uma única
  ação principal`; os estados bloqueada, pronta e registrada continuam com os
  textos que o teste de fluxo já cobra, menos os removidos.
- [ ] **Passo 2:** rodar e guardar a saída vermelha.
- [ ] **Passo 3:** reescrever a disposição sobre o padrão do resumo. Se dois
  blocos ficarem iguais ao do `LessonSummary`, extrair o bloco comum em vez de
  copiar.
- [ ] **Passo 4:** roteiros `reward-locked.yaml` e `reward-unlock.yaml` no
  simulador.
- [ ] **Passo 5:** gate, fechar o run e commit
  `feat(recompensa): recompensa e unidade no padrão do resumo`.

### Tarefa 8: missões de hoje

**Arquivos:**
- Criar: `radiant-app/src/ui/components/MissionIcons.tsx` e teste
- Modificar: `radiant-app/src/features/missions/screens/MissionsScreen.tsx`,
  `radiant-app/src/features/missions/components/DailyMissionsCard.tsx` e testes

**Interfaces:**
- Produz: `export function MissionIcon(props: { kind: 'aulas' | 'acertos' | 'meta'; done: boolean; size?: number }): JSX.Element`.
  `done` desenha a peça em ouro com a marca de feito; senão, no azul da unidade.
  O mapeamento de cada missão para `kind` sai do identificador que a missão já
  tem; identificador desconhecido usa `meta`.

- [ ] **Passo 1: testes que falham.** `cada linha mostra a recompensa
  "+<MISSION_BONUS_XP> XP"`; `missão concluída mostra a peça done e a
  recompensa em ouro`; `a linha continua sendo um progressbar acessível com
  valor`; `mission-fill-<id>` continua existindo; `há um botão "Continuar a
  trilha" que volta à trilha`.
- [ ] **Passo 2:** rodar, guardar a saída vermelha e implementar.
- [ ] **Passo 3:** gate, fechar o run e commit `feat(missoes): peça e recompensa em cada missão`.

### Tarefa 9: perfil

**Arquivos:**
- Modificar: `radiant-app/src/features/profile/screens/ProfileScreen.tsx`,
  `components/MedalShelf.tsx`, `components/StreakWeek.tsx`,
  `components/TodayGoals.tsx`, `components/ProfileIdentityHeader.tsx`, os
  testes deles, e as linhas de liga e decorações que o perfil monta

- [ ] **Passo 1: testes que falham.**
  - `ProfileScreen`: `não mostra a linha de missões`; `não mostra o bloco
    "Hoje"`; `não mostra "Revisões pendentes"`; `liga e decorações são linhas
    com o valor à direita`; `o total de XP aparece uma vez`.
  - `MedalShelf`: `mostra "<ganhas> de <total>"` e um caminho "Ver as <total>".
  - `StreakWeek`: `mostra o número de dias com a chama`; `dia sem registro não
    mostra "?"`; `os dois parágrafos de explicação não existem`; `hoje é
    anunciado ao leitor de tela como hoje`; `as proteções aparecem numa linha`.
- [ ] **Passo 2:** rodar e guardar a saída vermelha.
- [ ] **Passo 3:** implementar. Com as chaves `ENABLE_LEAGUE` e
  `ENABLE_DECORATIONS` desligadas, as linhas correspondentes não aparecem,
  como hoje.
- [ ] **Passo 4:** conferir quem mais lia o que saiu. Meta: todo consumidor de
  `TodayGoals` e da linha de missões no perfil (`grep`), para não deixar
  componente órfão nem quebrar outro uso.
- [ ] **Passo 5:** gate, fechar o run e commit `feat(perfil): estante, sequência e linhas`.

### Tarefa 10: assinatura

**Arquivos:**
- Criar: `radiant-app/src/features/subscription/components/PlanCard.tsx` e teste
- Modificar: `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`,
  `radiant-app/src/features/conversion/components/PlanComparison.tsx` e testes

**Interfaces:**
- Produz: `export function PlanCard(props: { title: string; price: string; detail: string; selected: boolean; tone: 'neutral' | 'gold'; onPress: () => void; testID?: string }): JSX.Element`.
  `selected` tem `accessibilityState.selected`.

- [ ] **Passo 1: testes que falham.** `o anual vem selecionado`; `tocar no
  mensal troca a seleção e o rótulo do botão para "Assinar o mensal"`; `há um
  único botão de assinar`; `a comparação mostra só a linha de vidas`; `o texto
  legal de hoje aparece inteiro` (comparar com a string atual, sem editar);
  `"Restaurar compra" continua`; `preço ausente mostra o estado de carregamento
  atual e o botão desabilitado`; `com o plano anual, o detalhe mostra o valor
  por mês calculado do preço do StoreKit`.
- [ ] **Passo 2:** rodar e guardar a saída vermelha.
- [ ] **Passo 3:** implementar. A frase de abertura é "Errar não custa vida.",
  e a linha "Vidas ilimitadas — e só isso." de Ajustes passa a "Errar não custa
  vida.".
- [ ] **Passo 4:** conferir os estados de assinante, cancelada e Ask to Buy,
  que a tela já tem: nenhum muda de texto.
- [ ] **Passo 5:** gate, fechar o run e commit `feat(assinatura): planos como cartões de escolha`.

### Tarefa 11: abertura, documento e prova

**Arquivos:**
- Modificar: `radiant-app/assets/images/splash-icon.png`, `docs/DESIGN.md`,
  `docs/STATUS.md`, `docs/archive/STATUS_historico.md`
- Criar: `docs/evidence/2026-11-refinamento/README.md` e as capturas

- [ ] **Passo 1:** gerar a imagem de abertura a partir do Pixel do Medalhão:
  capturar o `PixelIllustration` de corpo inteiro sobre o grafite no
  simulador, recortar e salvar nas mesmas dimensões do arquivo atual.
  Verificação: `sips -g pixelWidth -g pixelHeight` igual ao de antes, e a
  imagem aberta e conferida. Vale no próximo build.
- [ ] **Passo 2:** `docs/DESIGN.md`: conferir que cada componente novo
  (folha de retorno, alternativa, área de grupo, peça de missão, cartão de
  plano, variante desabilitada) e o papel tipográfico novo, se criado, têm
  entrada, e que os valores batem com o código.
- [ ] **Passo 3:** capturas no iOS e no Android, em tamanho normal e no texto
  máximo, com e sem "reduzir movimento": trilha, pergunta, retorno de acerto,
  retorno de erro, classificar, ensino, resumo, recompensa, perfil, missões,
  assinatura e ajustes. Logs e capturas pequenas entram versionados.
- [ ] **Passo 4:** a suíte inteira no conjunto rastreado, em worktree limpa
  (`git worktree add --detach <tmp> HEAD`), com `EXPO_NO_DOTENV=1 npm run
  quality`, e o número de suítes e testes citado na evidência.
- [ ] **Passo 5:** `docs/STATUS.md`: trocar a seção "Refinamento visual antes
  da 1.6" pelo estado medido, e mover o texto antigo para o histórico.
- [ ] **Passo 6:** abrir a PR. Lista para o dono na descrição: build novo,
  capturas da loja a refazer, liga a ver em aparelho com Game Center.

---

## Ordem e dependências

A tarefa 1 e a 2 vêm primeiro; a 3 e a 4 dependem da 2. As tarefas 5, 7, 8, 9
e 10 são independentes entre si. A 6 vem depois de todas as telas (3 a 5 e 7 a
10), porque limpa o que elas deixam e liga a guarda. A 11 fecha.

Todas tocam `radiant-app/src`, e o Loop aceita um escritor por vez: as tarefas
rodam em sequência, não em paralelo.
