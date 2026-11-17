# Tarefa 6: cores e tamanhos por token, com guarda em AST

Medido em 2026-11-17, Node 20.20.2, sobre a árvore de trabalho da branch
`claude/refinamento-1-6-desenho` (base `9c844a9`).

## 1. O contrato `style-literal-contract`

`scripts/style-literal-contract.mjs` lê a AST (`typescript`) de `src/features/**`
e `src/app/**`, fora de teste, história e dos isentos listados no próprio script,
e acusa cor literal inteira (`#rgb`, `#rrggbb`, `rgb(`, `rgba(`, também montada
por template), `fontSize` numérico (em estilo, em ternário e em prop de SVG) e
`textTransform: 'uppercase'`.

RED com o módulo vazio (`node --test scripts/style-literal-contract.test.mjs`):
10 casos "acusa" e os 4 de escopo/isenção/linha/app falharam; os 5 casos "não
acusa" nasceram verdes contra o vazio e foram vistos falhando, cada um, com o
defeito que nomeiam (mutantes descartados depois):

| Defeito injetado | Caso que reprovou |
|---|---|
| cor por regex sem âncora | não acusa: cor citada em texto que não é valor de estilo |
| isenções de `home`, `curriculum-v3` e `app/telemetry.tsx` removidas | não acusa arquivo isento |
| texto JSX com `#` acusado | não acusa: cor citada em texto |
| `fontSize` acusado com qualquer valor | não acusa: fontSize por token |
| `textTransform` acusado com qualquer valor | não acusa: textTransform que não é caixa alta |
| regex de cor aceitando `#topo-da-pagina` | não acusa: âncora de link com cerquilha |
| busca por texto no arquivo inteiro | não acusa: cor citada em comentário (e mais 5) |

GREEN: `# pass 18 # fail 1`, e o que faltava era o caso "o app não tem literal",
com a lista de trabalho abaixo.

### Saída inicial sobre o app (56 achados)

```
src/app/(tabs)/_layout.tsx:25  fontSize  11
src/features/hearts/components/HeartsSheet.tsx:128  color  'rgba(3, 3, 13, 0.72)'
src/features/journey/components/JourneyLevelBand.tsx:97  uppercase  'uppercase'
src/features/journey/components/JourneyReviewRow.tsx:68  fontSize  13
src/features/journey/components/JourneyStageHeader.tsx:146  fontSize  12
src/features/journey/screens/JourneyHomeScreen.tsx:365  color  'rgba(255,59,48,0.10)'
src/features/journey/screens/JourneyHomeScreen.tsx:368  color  'rgba(255,59,48,0.25)'
src/features/journey/screens/JourneyHomeScreen.tsx:371  color  '#FF6B6B'
src/features/league/components/LeagueNoticeRow.tsx:54  fontSize  13
src/features/lesson-flow/renderers/ComparisonStepRenderer.tsx:90  color  'rgba(93,227,174,0.10)'
src/features/lesson-flow/renderers/ContextStepRenderer.tsx:25  uppercase  'uppercase'
src/features/lesson-flow/renderers/HotspotStepRenderer.tsx:127  color  'rgba(3,3,13,0.34)'
src/features/lesson-flow/renderers/HotspotStepRenderer.tsx:136  color  'rgba(93,227,174,0.16)'
src/features/lesson-flow/renderers/ReinforceStepRenderer.tsx:22  color  'rgba(93,227,174,0.12)'
src/features/lesson-flow/renderers/ReinforceStepRenderer.tsx:24  color  'rgba(245,166,35,0.12)'
src/features/lesson-flow/renderers/ReinforceStepRenderer.tsx:28  color  'rgba(93,227,174,0.30)'
src/features/lesson-flow/renderers/ReinforceStepRenderer.tsx:30  color  'rgba(245,166,35,0.30)'
src/features/lesson-flow/screens/LessonFlowScreen.tsx:1060  color  'rgba(255,255,255,0.07)'
src/features/lesson-flow/screens/LessonFlowScreen.tsx:1093  color  'rgba(255,59,48,0.10)'
src/features/lesson-flow/screens/LessonFlowScreen.tsx:1096  color  'rgba(255,59,48,0.25)'
src/features/lesson-flow/screens/LessonFlowScreen.tsx:1102  color  '#FF6B6B'
src/features/missions/components/DailyMissionsCard.tsx:37  fontSize  13
src/features/progress/components/AccountSyncCard.tsx:342  color  'rgba(93,227,174,0.12)'
src/features/progress/components/AccountSyncCard.tsx:379  color  '#FFFFFF'
src/features/push/components/PushOptInCard.tsx:14  color  '#FFFFFF'
src/features/push/components/PushOptInCard.tsx:15  color  '#8E8E93'
src/features/push/components/PushOptInCard.tsx:16  color  '#0A84FF'
src/features/push/components/PushOptInCard.tsx:78  color  'rgba(10, 132, 255, 0.3)'
src/features/push/components/PushOptInCard.tsx:79  color  'rgba(10, 132, 255, 0.05)'
src/features/push/components/PushOptInCard.tsx:95  fontSize  14
src/features/push/components/PushOptInCard.tsx:107  fontSize  14
src/features/quiz/components/QuizFeedback.tsx:85  color  'rgba(93,227,174,0.14)'
src/features/quiz/components/QuizFeedback.tsx:89  color  'rgba(255,130,152,0.14)'
src/features/quiz/components/QuizFeedback.tsx:116  color  'rgba(93,227,174,0.16)'
src/features/quiz/components/QuizFeedback.tsx:119  color  'rgba(255,130,152,0.16)'
src/features/quiz/components/QuizFeedback.tsx:124  uppercase  'uppercase'
src/features/quiz/components/QuizQuestion.tsx:95  uppercase  'uppercase'
src/features/quiz/components/QuizQuestion.tsx:135  color  'rgba(93,227,174,0.16)'
src/features/quiz/components/QuizQuestion.tsx:139  color  'rgba(255,130,152,0.16)'
src/features/quiz/components/QuizQuestion.tsx:151  color  '#FFFFFF'
src/features/quiz/components/QuizQuestion.tsx:152  color  '#FFFFFF'
src/features/quiz/components/QuizQuestion.tsx:161  color  '#FFFFFF'
src/features/quiz/components/QuizTopBar.tsx:64  fontSize  24
src/features/quiz/components/QuizTopBar.tsx:71  color  'rgba(255,255,255,0.07)'
src/features/review/components/ReviewCard.tsx:113  uppercase  'uppercase'
src/features/review/components/ReviewCard.tsx:152  color  'rgba(93,227,174,0.16)'
src/features/review/components/ReviewCard.tsx:157  color  'rgba(93,227,174,0.16)'
src/features/review/components/ReviewCard.tsx:158  color  'rgba(93,227,174,0.36)'
src/features/review/components/ReviewCard.tsx:161  color  'rgba(245,166,35,0.14)'
src/features/review/components/ReviewCard.tsx:162  color  'rgba(245,166,35,0.36)'
src/features/review/components/ReviewCard.tsx:165  color  'rgba(255,130,152,0.14)'
src/features/review/components/ReviewCard.tsx:166  color  'rgba(255,130,152,0.36)'
src/features/review/components/ReviewCard.tsx:171  uppercase  'uppercase'
src/features/review/components/ReviewCard.tsx:213  color  'rgba(245,166,35,0.16)'
src/features/review/screens/ReviewScreen.tsx:434  color  'rgba(255,255,255,0.07)'
src/features/review/screens/ReviewScreen.tsx:463  color  'rgba(255,255,255,0.03)'
56 literal(is) de estilo fora dos isentos.
```

Depois da limpeza: `0 literal(is) de estilo fora dos isentos.` e
`npm run test:style-literal-contract` → `# pass 19 # fail 0`.

## 2. Segunda contagem, independente (grep por linha sobre `HEAD`)

| Busca | Isentos do brief | Isentos do adendo | Depois |
|---|---|---|---|
| `rgba\(` | 41 | 33 | 0 |
| cor hex entre aspas | 12 | 9 | 0 |
| `fontSize: [0-9]` | 8 | 8 | 0 |
| `textTransform: 'uppercase'` | 6 | 6 | 0 |
| **total** | **67** | **56** | **0** |

Com os isentos do adendo, o grep dá 56 linhas, o mesmo número da AST, nos mesmos
arquivos. A diferença para a medição do controlador (70, isentos do brief) tem
duas partes: 11 linhas em `curriculum-v3` (8) e `app/telemetry.tsx` (3), que o
adendo isentou; e 3 menções que a regex dele conta e a AST não, entre elas o
`rgb(` de `bench/exposureShader.ts` (comentário e template, arquivo isento). Os
26 arquivos coincidem.

## 3. Trocas por tela

- Verde e rosa translúcidos → `feedbackColors.success.surface` / `error.surface`
  (QuizFeedback, QuizQuestion, ReviewCard, ComparisonStepRenderer,
  ReinforceStepRenderer, AccountSyncCard).
- Âmbar e vermelho de fundo → `surfaceActive` com borda na cor cheia
  (ReviewCard consultada, ReinforceStepRenderer reforço, cartões de erro de
  JourneyHomeScreen e LessonFlowScreen).
- Branco translúcido → degrau da escada: 7% → `surfaceActive`, 3% → `surface`.
- Véu escuro do modal e da área tocável sobre imagem → tokens novos
  `galaxyColors.scrim` e `imageScrim`. A região escolhida no hotspot perde o
  fundo verde: um fundo opaco apagaria a anatomia; só a borda muda.
- `#FFFFFF` de texto sobre azul → `semanticColors.galaxy.textOnAccent`.
- `fontSize` 11/12/13 → `typography.label|micro|caption.fontSize`; 24 → `h3`;
  14 → `body` (16). Não sobrou tamanho sem papel entre 16 e 24, então
  `typography.subtitle` não foi criado.
- Etiquetas acima de título que saíram: "Revisão" (ReviewCard), "Questão de
  múltipla escolha/guiada por imagem" (QuizQuestion), o `eyebrow` do passo de
  contexto. Caixa alta local tirada sem tirar o texto: o selo "Mantém/Reforçar"
  do QuizFeedback (agora cor cheia com `onFill`), o rótulo do retorno na revisão
  (agora `bodyStrong`) e o estado "Bloqueado/Disponível/Próximo nível" do
  `JourneyLevelBand`, que fica porque é o segundo canal do estado (Regra da Cor
  Muda).
- Usos de `typography.label` julgados e mantidos: `JourneyTrail.unitTitle` e
  `JourneyUnitNavigation.heading/title` (títulos, não etiqueta sobre outro
  título); `JourneyStageHeader.count`, `JourneyReviewRow.action`,
  `LeagueNoticeRow.action`, `DailyMissionsCard.action` (já com
  `textTransform: 'none'`).

Contraste dos pares novos de texto sobre superfície (WCAG, calculado):
`critical` sobre `surfaceActive` 6,31:1; `success.fill` sobre `success.surface`
8,14:1; `error.fill` sobre `error.surface` 7,07:1; `xpColor` sobre
`surfaceActive` 7,35:1; `textSecondary` sobre `success.surface` 6,67:1 e sobre
`error.surface` 7,17:1. `npm run test:contrast-contract` → 18/18.

## 4. TDD dos consertos (RED e GREEN)

`npx jest --runInBand --verbose <arquivos>`. Onde o teste foi só reescrito, a
falha foi vista rodando-o contra o código de `HEAD` (cópia restaurada logo
depois) ou contra um mutante com o defeito nomeado.

Cartão dentro de cartão e "Sessão ativa" (ReviewCard, ReviewScreen):
```
    ✕ renders the active review session with the current item (292 ms)
    ✕ a pergunta fica direto sobre o fundo, sem a moldura externa e sem a etiqueta "Revisão" (12 ms)
    ✕ o retorno correta usa superfície opaca com borda na cor do papel (2 ms)
    ✕ o retorno errada usa superfície opaca com borda na cor do papel (1 ms)
    ✕ o retorno consultada usa superfície opaca com borda na cor do papel
Tests:       5 failed, 39 passed, 44 total
```

GREEN: `Tests: 56 passed` em `src/features/review`.

Etiqueta acima da pergunta e do contexto (contra `HEAD`):
```
    ✕ mostra a contagem de questões e nenhum cabeçalho redundante (82 ms)
    ✕ não mostra a etiqueta acima do título; título e corpo ficam (15 ms)
Tests:       2 failed, 43 passed, 45 total
```

PushOptInCard, corpo em `typography.body` (contra `HEAD`):
```
    ✕ usa altura natural na escala 1 para Podemos te avisar em dias em que você decidir estudar. Sem pressão. Sem cobrança. (3 ms)
    ✕ usa altura natural na escala 2 para Podemos te avisar em dias em que você decidir estudar. Sem pressão. Sem cobrança. (2 ms)
    ✕ usa altura natural na escala 3.1 para Podemos te avisar em dias em que você decidir estudar. Sem pressão. Sem cobrança. (3 ms)
Tests:       3 failed, 8 passed, 11 total
```

Rodapé irmão da rolagem (Reward, unidade concluída, `useFixedFooter`):
```
        ✕ a folga da rolagem é só space.s3 e não depende da altura do rodapé (52 ms)
        ✕ a folga da rolagem é só space.s3 e não depende da altura do rodapé (55 ms)
    ✕ a folga da rolagem é só space.s3 e não depende da altura do rodapé (5 ms)
    ✕ o rodapé fixo deixa à rolagem só space.s3 e leva o inset de baixo no próprio respiro (1 ms)
Tests:       4 failed, 74 passed, 78 total
```
GREEN: `Tests: 146 passed`.

Período em linha própria e esqueleto decorativo (PlanCard, SubscriptionScreen):
```
    ✕ mostra esqueleto enquanto carrega, nunca branco (96 ms)
    ✓ o botão de fechar não tem o caractere ✕ (57 ms)
    ✕ divide o número explícito pela duração anual e formata a moeda, sem ler displayPrice (1013 ms)
    ✕ atualiza também o equivalente anual quando a moeda da loja muda (1009 ms)
    ✕ anuncia preço anual e equivalente mensal exatamente uma vez, preservando o mensal (56 ms)
    ✕ preço ausente mostra o estado de carregamento atual e o botão desabilitado (64 ms)
    ✕ com o plano anual, o detalhe mostra o valor por mês calculado do preço do StoreKit (55 ms)
    ✕ é um botão de escolha lido como "título, preço, período, detalhe", com o estado de seleção (5 ms)
    ✕ o período fica numa linha própria em bodyRegular, separado do valor por mês em caption secundário (2 ms)
    ✕ sem detalhe, lê só título, preço e período, e não desenha linha vazia (2 ms)
    ✕ não selecionado anuncia selected falso (1 ms)
Tests:       10 failed, 52 passed, 62 total
```
GREEN: `Tests: 163 passed` em `src/features/subscription`.

KeyPointsList, teto de escala do número:
```
    ✕ o número tem teto de escala e cabe na face da peça (29 pt) no texto máximo (1 ms)
Tests:       1 failed, 5 passed, 6 total
```

`teachBody`, termo com ";" (mutante sem o `;` na regex; o caso nasce verde contra o código atual):
```
    ✕ enumeração e fórmula não viram termo: Dose; tempo e distância: reduza a exposição. (1 ms)
Tests:       1 failed, 14 passed, 15 total
```

MissionsScreen, bônus aceso e lido na mesma condição:
```
    ✕ o bônus acende e é lido na mesma condição: concluída E creditada (57 ms)
Tests:       1 failed, 6 passed, 7 total
```

HotspotStepRenderer, asserção restrita à marca. Mutante: marca pintada em `statusSuccess`. A asserção nova reprova; a antiga, por `JSON.stringify`, passava com o defeito:
```
    ✕ mantém o índice legível sobre imagem clara e fora do centro da região (6 ms)
Tests:       1 failed, 2 passed, 3 total
teste antigo com o defeito: Tests:       3 passed, 3 total
```

AppButton. Os 6 casos "desabilitado e carregando" nascem verdes contra o código atual; vistos falhando com o mutante `hasLip && disabled && !loading`. Os 2 do ghost falham contra o código atual (indicador branco):
```
    ✕ desabilitado e carregando juntos, primary fica na face neutra (2 ms)
    ✕ desabilitado e carregando juntos, galaxy fica na face neutra (1 ms)
    ✕ desabilitado e carregando juntos, gold fica na face neutra (1 ms)
    ✕ desabilitado e carregando juntos, secondary fica na face neutra (1 ms)
    ✕ desabilitado e carregando juntos, success fica na face neutra (1 ms)
    ✕ desabilitado e carregando juntos, error fica na face neutra (1 ms)
    ✕ ghost carregando (desabilitado: false) pinta o indicador na cor do próprio rótulo (1 ms)
    ✕ ghost carregando (desabilitado: true) pinta o indicador na cor do próprio rótulo
Tests:       8 failed, 54 passed, 62 total
```
GREEN: `Tests: 62 passed`.

## 5. Fechamento

- `npx tsc --noEmit`: sem erro.
- `npx eslint src scripts`: 0 erros, 23 avisos, nenhum em arquivo tocado.
- Contratos: contrast 18/18, identity-palette 1/1, icon-assets 14/14,
  copy-style 65/65, storybook-config 3/3, ci-gate-parity 3/3,
  style-literal 19/19.
- `npm run visual:qa:strict`: 651 arquivos, 0 regressões, 3 exceções de escopo.
- `npx jest --runInBand`: 284 suítes, 3825 testes, todos verdes.
