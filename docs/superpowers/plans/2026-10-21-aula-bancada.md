# Aula-bancada — plano de implementação (plano 3)

> **Para agentes:** sub-skill obrigatória: superpowers:subagent-driven-development
> (recomendada) ou superpowers:executing-plans, tarefa por tarefa. Os passos
> usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** dar à aula um passo em que o aluno opera o equipamento e vê a
radiografia simulada responder, e entregar duas aulas de exemplo nesse formato
para a revisão de conteúdo do dono.

**Arquitetura:**
- **Um tipo novo de interação, `bench`, no contrato v2 que já existe**
  (`LearningInteractionV2`). Ele entra no `ActivityRendererRegistry` como os
  outros cinco e atravessa o mesmo contrato `interaction / value / onChange`.
  O player continua dono de confirmar, cobrar vida e repetir o item errado.
- **A física fica numa função pura** (`exposureModel`), testada sem Skia. O
  shader do Skia só pinta o que ela calcula. Assim a correção física é revisável
  em teste, e a GPU não decide nada.
- **As aulas de exemplo são atividades v2 num catálogo próprio**, consultado por
  `LessonFlowService.getActivityById` antes do catálogo de produção. Elas não
  entram na trilha neste plano; quem troca as aulas da trilha é o plano 4.

**Pilha:** Expo SDK 54, React Native 0.81, `@shopify/react-native-skia` 2.2.12
(`RuntimeEffect` e `Canvas`), Reanimated 4.1 e `react-native-gesture-handler`
2.28, todos já no app.

**Spec:** [seção 5 da spec](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md#5-a-aula-bancada)
e as seções 7 e 8 ·
[prancheta da aula](../../design/2026-10-21-aula-bancada.html) ·
[índice](2026-10-21-trilha-medalhao-indice.md).

**Depende de:** plano 1 (feito). A tarefa 0 do plano 2 (política de runtime)
precisa estar resolvida antes de a tarefa 6 abrir uma aula com Skia numa rota.

**Gate do dono:** a **revisão do conteúdo** das duas aulas de exemplo, frase por
frase, antes de elas saírem do catálogo de exemplo.

## Restrições globais

As do [plano 1](2026-10-21-fundacao-visual-medalhao.md#restrições-globais)
valem todas. E mais:

- **Rigor:** a simulação é um fantoma estilizado, nunca uma incidência real, e a
  tela diz isso ("Fantoma simulado"). Simplificada **e** correta no que afirma:
  - **kV** controla a penetração. Subir o kV diminui o contraste entre osso e
    partes moles e escurece a imagem inteira;
  - **mAs** controla a quantidade de fótons. Subir o mAs diminui o ruído
    (mosqueado quântico) e escurece a imagem, sem mudar o contraste entre osso e
    partes moles;
  - a convenção é a da radiografia: mais exposição, imagem mais escura; osso
    claro.
- **Regras do player que continuam:** primeiro contato sem custo de vida, o item
  errado volta uma vez no fim, estrelas pela primeira resposta, explicação junto
  da resposta e a frase de 0 estrela sem "quase" (FILA 47).
- **Acessibilidade (spec, seção 8):** cada controle tem botões − e + além do
  arrasto, alvo de 48 dp, e rótulo com o valor ("70 kV"). O que a imagem mostra
  também aparece em texto no retorno.
- **Desempenho:** o shader recalcula por uniforme, nunca pixel a pixel no JS. O
  arrasto responde sem atraso perceptível no AVD de entrada.
- **Valor da resposta:** como nos outros tipos, uma `string`. A bancada usa JSON
  com os valores dos controles, por exemplo `{"kv":70,"mas":10}`.

## Foco da revisão

1. **Física que ensina errado.** O teste de `exposureModel` fixa as direções do
   kV e do mAs. Uma inversão acidental de sinal reprova. Tarefa 1.
2. **Controle por botões, sem arrasto.** O aluno chega ao alvo só com − e +, e o
   leitor de tela anuncia o valor a cada toque. Tarefa 3.
3. **Valor salvo antigo ou corrompido.** Uma aula retomada com `value` que não é
   JSON, ou com controle faltando, abre nos valores iniciais e não quebra.
   Tarefa 2.
4. **Skia ausente ou shader que não compila.** A bancada mostra o fantoma sem
   ruído, por `View`s, e os controles funcionam; o erro vai para o log uma vez.
   Tarefa 3.
5. **Alternativa errada sem explicação própria.** A leitura crítica cai na
   explicação geral de erro, e a validação da atividade avisa. Tarefa 4.

---

### Tarefa 1: O modelo de exposição

**Arquivos:**
- Criar: `radiant-app/src/features/bench/exposureModel.ts`
- Testar: `radiant-app/src/features/bench/exposureModel.test.ts`

**Interfaces:**
- Produz:
  - `type ExposureInput = { kv: number; mas: number }`, com kV de 40 a 120 e
    mAs de 1 a 40;
  - `type ExposureOutput = { bone: number; soft: number; background: number; noise: number }`,
    luminâncias de 0 (preto) a 1 (branco) e o desvio do ruído de 0 a 1;
  - `exposureModel(input: ExposureInput): ExposureOutput`;
  - `subjectContrast(out: ExposureOutput): number`, igual a `bone − soft`;
  - `REFERENCE_EXPOSURE: ExposureInput = { kv: 70, mas: 10 }`.

- [ ] **Passo 1: Escrever os testes que falham**

- `subjectContrast` cai quando o kV sobe de 50 para 100, com o mAs fixo;
- `background`, `soft` e `bone` caem (escurecem) quando o kV sobe e quando o mAs
  sobe;
- `noise` cai quando o mAs sobe de 2 para 20, e não muda com o kV dentro de 5%;
- `subjectContrast` não muda mais que 5% quando só o mAs muda;
- `bone > soft > background` em todo o domínio (amostre 9 × 9 pontos);
- todo valor fica entre 0 e 1, também nos limites e fora deles (entrada fora do
  domínio é limitada ao domínio).

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/bench/exposureModel.test.ts`
Expected: FAIL, módulo inexistente.

- [ ] **Passo 3: Implementar**

Um modelo de atenuação exponencial simplificado é suficiente: transmissão
`exp(−μ(kV) × espessura)` com μ caindo com o kV, mais para o osso que para as
partes moles; densidade proporcional a `mAs × transmissão`; ruído proporcional a
`1 / √mAs`. Escreva no topo do arquivo, em comentário, o que é simplificação e o
que é afirmação física, porque o dono revisa as duas coisas.

- [ ] **Passo 4: Ver passar**

Run: o mesmo do passo 2. Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/features/bench/
git commit -m "feat(bancada): modelo de exposição com kV e mAs, testado nas direções físicas"
```

### Tarefa 2: O tipo `bench` no contrato v2

**Arquivos:**
- Modificar: `radiant-app/src/types/learningActivity.ts`
- Modificar: `radiant-app/src/features/lesson-flow/renderers/InteractionAnswerValue.ts`
- Testar: `radiant-app/src/features/lesson-flow/services/LessonFlowService.test.ts`,
  onde a validação v2 já é testada, e
  `radiant-app/src/features/lesson-flow/renderers/InteractionAnswerValue.test.ts`

**Interfaces:**
- Produz:
  - `type BenchControl = { id: 'kv' | 'mas'; label: string; unit: string; min: number; max: number; step: number; initial: number }`;
  - `type BenchGoal = { kind: 'reach'; control: 'kv' | 'mas'; atLeast?: number; atMost?: number } | { kind: 'match'; reference: ExposureInput; tolerance: number }`.
    `match` compara `subjectContrast` e `background` de `exposureModel` com os da
    referência, cada um dentro de `tolerance`;
  - `type BenchPayload = { prompt: string; simulator: 'exposure'; mode: 'explore' | 'challenge' | 'correct'; controls: BenchControl[]; goal: BenchGoal; phantomLabel: string; hints: { tooLow: string; tooHigh: string } }`;
  - `'bench'` em `InteractionType` e o ramo `{ type: 'bench'; payload: BenchPayload }`
    em `LearningInteractionV2`;
  - `encodeBenchValue(values: Record<string, number>): string` e
    `decodeBenchValue(value: string | undefined, controls: BenchControl[]): Record<string, number>`,
    que devolve os `initial` para qualquer controle ausente, fora da faixa ou não
    numérico;
  - `benchDirection(interaction, value): 'ok' | 'tooLow' | 'tooHigh'`, que diz
    para que lado o aluno errou;
  - `isCompleteInteractionValue` e `isCorrectInteractionValue` com o ramo `bench`;
  - em `ChoiceOption`, o campo opcional `explanation?: string` (usado na tarefa 4).

- [ ] **Passo 1: Escrever os testes que falham**

- `decodeBenchValue` com `undefined`, `"lixo"`, `{"kv":999}` e `{"kv":70}`;
- `isCorrectInteractionValue` com `reach` `{control:'kv', atLeast:100}`: 99 é
  falso, 100 é verdadeiro;
- com `match` na referência `{kv:70, mas:10}` e tolerância 0,05: o próprio
  `{kv:70,mas:10}` é verdadeiro e `{kv:110,mas:10}` é falso;
- `benchDirection` devolve `tooLow` para kV 80 quando o alvo pede ao menos 100;
- `validateLearningActivity` reprova `bench` sem controles, com
  `min >= max`, com `initial` fora da faixa ou sem `hints`, com códigos
  `invalid-controls`, `invalid-initial` e `missing-hints`.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/lesson-flow/services/LessonFlowService.test.ts src/features/lesson-flow/renderers/InteractionAnswerValue.test.ts`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

- [ ] **Passo 4: Ver passar, com o typecheck**

Run: `cd radiant-app && npx jest src/features/lesson-flow && npm run typecheck`
Expected: PASS e zero erro.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/types/learningActivity.ts radiant-app/src/features/lesson-flow
git commit -m "feat(bancada): interação bench no contrato v2, com alvo verificável"
```

### Tarefa 3: A bancada na tela

**Arquivos:**
- Criar: `radiant-app/src/features/bench/ExposureImage.tsx`
- Criar: `radiant-app/src/features/bench/exposureShader.ts`
- Criar: `radiant-app/src/features/bench/BenchControlRow.tsx`
- Criar: `radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.tsx`
- Modificar: `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`
- Testar: `BenchStepRenderer.test.tsx`, `BenchControlRow.test.tsx` e
  `ActivityRendererRegistry.test.tsx`

**Interfaces:**
- Consome: `exposureModel`, `BenchPayload`, `encodeBenchValue`, `decodeBenchValue`.
- Produz:
  - `EXPOSURE_SKSL: string`, o shader com os uniformes `bone`, `soft`,
    `background`, `noise`, `seed` e `size`, que desenha o fantoma da prancheta
    (o joelho estilizado: duas diáfises, os côndilos e a patela sobre a silhueta
    de partes moles) e soma ruído de grão fino;
  - `ExposureImage(props: { input: ExposureInput; size: number; label: string }): React.ReactElement`,
    o `Canvas` com o `RuntimeEffect`. Se `Skia.RuntimeEffect.Make` devolver
    `null` ou lançar, desenha o mesmo fantoma com `View`s em três tons e avisa no
    log uma vez;
  - `BenchControlRow(props: { control: BenchControl; value: number; onChange: (next: number) => void }): React.ReactElement`,
    com rótulo e valor ("kV 70"), o `Slider` de `@react-native-community/slider`
    5.x, que já é dependência do app e ainda não tem uso em `src`, e os botões −
    e + de 48 dp, e `accessibilityRole="adjustable"` com `accessibilityValue` e as ações
    `increment` e `decrement`;
  - `BenchStepRenderer(props: InteractionRendererProps): React.ReactElement`,
    com o enunciado, a imagem, o rótulo "Fantoma simulado", uma linha por
    controle e, no modo `challenge`, a imagem de referência ao lado;
  - a entrada `bench: BenchInteraction` em `RENDERERS`.

- [ ] **Passo 1: Escrever os testes que falham**

Com o mock do Skia que `ThemeIllustration.test.tsx` já usa:
- tocar + três vezes no kV com `step` 10 a partir de 70 chama `onChange` com
  `{"kv":100,...}` e o rótulo vira "100 kV";
- `accessibilityActions` `increment` e `decrement` fazem o mesmo;
- o valor nunca sai de `[min, max]`;
- com `RuntimeEffect.Make` devolvendo `null`, a tela monta o fantoma de `View`s
  e `console.warn` é chamado uma vez;
- `isInteractionTypeRegistered('bench')` é verdadeiro.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/bench src/features/lesson-flow/renderers`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

O arrasto atualiza o uniforme a cada quadro, mas sobe `onChange` só no passo
(`step`), para o player não renderizar a cada pixel. Animação, se houver, sai de
`src/ui/motion.ts` (regra R4).

- [ ] **Passo 4: Ver passar, com o visual QA**

Run: `cd radiant-app && npx jest src/features/bench src/features/lesson-flow && npm run visual:qa:strict`
Expected: PASS e código 0.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/bench radiant-app/src/features/lesson-flow/renderers
git commit -m "feat(bancada): renderizador da bancada com shader e controles acessíveis"
```

### Tarefa 4: Retorno na bancada e explicação por alternativa

**Arquivos:**
- Criar: `radiant-app/src/features/lesson-flow/services/feedbackFor.ts`
- Modificar: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`,
  só a linha que escolhe a mensagem de retorno (hoje
  `correct ? feedback.correct : feedback.incorrect`)
- Modificar: `radiant-app/src/types/learningActivity.ts`, aviso de validação
  `missing-option-explanation` para escolha com alternativa errada sem
  `explanation`
- Testar: `radiant-app/src/features/lesson-flow/services/feedbackFor.test.ts`

**Interfaces:**
- Produz: `feedbackFor(interaction: LearningInteractionV2, value: string | undefined, correct: boolean): string`.
  - acerto: `feedback.correct`;
  - escolha errada com `explanation` na alternativa marcada: essa explicação;
  - bancada errada: `hints.tooLow` ou `hints.tooHigh` conforme `benchDirection`;
  - qualquer outro erro: `feedback.incorrect`.

- [ ] **Passo 1: Escrever os testes que falham**

Os quatro ramos acima, e o aviso `missing-option-explanation` na validação.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/lesson-flow/services`
Expected: FAIL.

- [ ] **Passo 3: Implementar e trocar a linha no player**

- [ ] **Passo 4: Ver passar, com o teste de fluxo do player**

Run: `cd radiant-app && npx jest src/features/lesson-flow`
Expected: PASS, incluindo `LessonFlowScreen.flow.test.tsx` sem mudança.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/features/lesson-flow radiant-app/src/types/learningActivity.ts
git commit -m "feat(aula): retorno pela direção na bancada e explicação por alternativa"
```

### Tarefa 5: Escolher a segunda bancada

**Arquivos:**
- Criar: `docs/evidence/<data>-segunda-bancada.md`

A spec deixa para o plano a escolha entre **colimação** (abrir e fechar o feixe
e ver dose e área) e **posicionamento** (girar o paciente até a incidência),
"depois de medir o custo de cada uma".

- [ ] **Passo 1: Medir o custo das duas**

Para cada uma, conte: componentes novos, mudanças no shader, campos novos em
`BenchPayload`, afirmações físicas que o dono teria de revisar, e se ela cabe no
mesmo `exposureModel`. Monte um protótipo descartável de no máximo uma hora para
a mais barata, na tela de desenvolvimento.

- [ ] **Passo 2: Registrar e decidir**

A recomendação do agente, em 2026-10-21, é a **colimação**: reaproveita o
fantoma e o shader (uma máscara retangular e a dose proporcional à área) e
ensina uma regra de proteção que o aluno usa todo dia. O posicionamento exige
geometria 3D do paciente e muitas afirmações anatômicas novas. Confirme ou
refute com as medidas do passo 1 e escreva a decisão na evidência.

- [ ] **Passo 3: Implementar a escolhida no mesmo molde das tarefas 1 a 3**

Para a colimação: `simulator: 'collimation'`, controles `fieldWidth` e
`fieldHeight` em cm, `collimationModel(input)` puro com dose relativa
proporcional à área do campo e testes de monotonicidade, e a máscara no shader.

- [ ] **Passo 4: Commit**

```bash
git add -A radiant-app/src/features/bench radiant-app/src/types docs/evidence/
git commit -m "feat(bancada): segunda bancada, escolhida pelo custo medido"
```

### Tarefa 6: As duas aulas de exemplo

**Arquivos:**
- Criar: `radiant-app/src/features/bench/lessons/exposicao.ts`
- Criar: `radiant-app/src/features/bench/lessons/<segunda-bancada>.ts`
- Criar: `radiant-app/src/features/bench/lessons/BenchLessonCatalog.ts`
- Modificar: `radiant-app/src/features/lesson-flow/services/LessonFlowService.ts`,
  consultando `BenchLessonCatalog.getActivityById` antes do
  `ProductionCurriculumCatalog`
- Criar: `docs/conteudo-bancada/2026-10-21-aulas-de-exemplo.md` (use a data do
  dia), com o texto de cada passo para o dono revisar
- Testar: `radiant-app/src/features/bench/lessons/BenchLessonCatalog.test.ts`

**Interfaces:**
- Produz: `BenchLessonCatalog.getActivityById(id: string): LearningActivityV2 | null`
  e `BENCH_LESSON_IDS = ['bancada:exposicao', 'bancada:<segunda>'] as const`.

**Roteiro da aula de exposição**, da prancheta da aula:
1. abertura (`presentation`, `hook`): a medalha do tema e o que o aluno vai
   fazer;
2. explorar (`bench`, `explore`, `reach` kV ≥ 100): o Pixel nomeia o efeito;
3. desafio (`bench`, `challenge`, `match` com `REFERENCE_EXPOSURE`);
4. leitura crítica (`multiple-choice`, imagem granulada): uma explicação por
   alternativa errada;
5. corrigir (`bench`, `correct`, `reach` mAs ≥ 16 a partir de 2);
6. fechamento (`presentation`, `closing`), em duas linhas.

São 6 passos e 4 interações, o máximo que `validateLearningActivity` aceita.

- [ ] **Passo 1: Escrever os testes que falham**

- `validateLearningActivity` devolve `[]` para as duas aulas;
- cada interação `bench` é resolvível: o alvo cabe na faixa dos controles, e o
  valor inicial **não** cumpre o alvo (senão o passo se responde sozinho);
- `LessonFlowService.getActivityById('bancada:exposicao')` devolve a aula.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/bench/lessons src/features/lesson-flow/services`
Expected: FAIL.

- [ ] **Passo 3: Escrever as aulas e o documento de revisão**

Cada frase de física vai, igual, para o documento de revisão, numa tabela com
três colunas: passo, frase e "ok do dono". Nenhuma frase usa "quase", travessão
de efeito ou jargão interno (A Regra Sem Cara de IA).

- [ ] **Passo 4: Ver passar, com o gate**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`
Expected: código 0.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/bench/lessons radiant-app/src/features/lesson-flow/services/LessonFlowService.ts docs/conteudo-bancada/
git commit -m "feat(aula): duas aulas-bancada de exemplo, para a revisão do dono"
```

### Tarefa 7: Aula de ponta a ponta e evidência

**Arquivos:**
- Criar: `docs/evidence/<data>-aula-bancada.md` e a pasta de capturas

- [ ] **Passo 1: Abrir a aula no simulador**

Abra `radiantapp://learn?blockId=bancada:exposicao` (ou pelo console de
desenvolvimento). Faça a aula inteira, errando o desafio uma vez para ver o
retorno pela direção e a repetição no fim. Capture cada passo.

- [ ] **Passo 2: Repetir só com botões e com o VoiceOver**

Chegue a cada alvo sem arrastar, e confira que o VoiceOver lê "kV, 70" e
anuncia cada mudança.

- [ ] **Passo 3: Medir no AVD de entrada**

Arraste o kV de ponta a ponta no `radiant-entrada-api34` com o medidor do G6.
Registre o fps e o atraso entre o dedo e a imagem.

- [ ] **Passo 4: Escrever a evidência, pedir a revisão do conteúdo e fazer commit**

A evidência termina com o link do documento de revisão e a pergunta ao dono.
As aulas não saem do catálogo de exemplo sem o ok dele.

```bash
git add docs/evidence/
git commit -m "docs(aula): evidência da aula-bancada no simulador e no AVD"
```

---

## Estado em 2026-10-22

Não começado. O pré-requisito da tarefa 6 está cumprido: a `runtimeVersion` é
`fingerprint` desde `e10a553` (plano 2, tarefa 0). `@react-native-community/slider`
5.x continua dependência sem uso em `src`, como o plano supõe.
