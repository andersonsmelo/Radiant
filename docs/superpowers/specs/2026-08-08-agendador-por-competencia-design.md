# Agendador de revisão por competência — Design

**Data:** 2026-08-08 · **Status:** aprovado, não implementado ·
**Emenda a:** Task 11 de
[`2026-07-31-sistema-aprendizagem-competencias.md`](../plans/2026-07-31-sistema-aprendizagem-competencias.md)

> Este documento decide **qual algoritmo** o `CompetencyReviewService` da Task 11
> usa, e como ele conversa com o motor de domínio. A Task 11 já decidiu o resto:
> serviço paralelo, chave e schema novos, sem migração destrutiva, e recomendação
> explicável com `reason: due-review | weak-competency | next-new`. Nada aqui
> revoga aquilo.

## 1. O que motivou revisitar a decisão

[`docs/specs/spaced-repetition.spec.md`](../../specs/spaced-repetition.spec.md)
colocou FSRS fora do MVP duas vezes — §2 "Não inclui" e §15 "Integrações
Futuras". Foi decisão consciente, não esquecimento, e continua válida para o
caminho por lição.

O que mudou é que a Task 11 cria um **segundo** caminho de revisão, por
competência, e ele nasce sem algoritmo definido: os critérios da task são
comportamentais ("retenção expande intervalo; erro ou dica reduz intervalo") e
não nomeiam SM-2 nem FSRS. Este documento preenche esse buraco.

## 2. O achado que reorienta o desenho

`CompetencyMasteryService` trava qualquer competência em `practicing` enquanto
não houver evidência `delayed-retention` — é o bloqueio `missing-retention`, e
essa evidência divide com `independent-recall` o maior peso da tabela (0,30).

Disso segue a tese deste design:

> **O agendador não existe para "organizar revisões". Ele existe para fabricar
> `delayed-retention` na hora certa. O intervalo que ele escolhe é o que decide
> se a evidência conta.**

E aparece um buraco que nem a spec de repetição espaçada nem a Task 11 fecham:
**quanto tempo precisa ter decorrido para uma recuperação contar como
retardada?** Hoje o SM-2 garante intervalo ≥ 1 dia em todos os ramos, o que
resolve a questão por acidente. Um agendador com intervalos mais finos quebraria
isso sem sinal algum, e competências subiriam para `retained` com evidência que
não sustenta o nome.

Este documento torna esse limiar um parâmetro declarado.

## 3. O teto do currículo, medido

Cruzando
[`Conteúdo/governança/foundations-safety-competencies.json`](../../../Conte%C3%BAdo/governan%C3%A7a/foundations-safety-competencies.json)
(30 competências, 6 unidades, versão `foundations-safety-2026-08-01`) com
`DEFAULT_MASTERY_PARAMS`:

| `evidenceMethods` admitidos | Score máximo | Teto | Quantas |
| --- | ---: | --- | ---: |
| `guided-practice` + `applied-transfer` | 0,40 | `practicing` | 8 |
| `guided-practice` + `independent-recall` | 0,45 | `practicing` | 12 |
| `guided` + `applied` + `delayed-retention` | 0,70 | `retained` | 7 |
| `guided` + `independent` + `delayed-retention` | 0,75 | `retained` | 3 |

Três fatos, todos verificáveis relendo o arquivo:

1. **`mastered` é inalcançável nas 30.** O limiar é 1,0; o teto do currículo é
   0,75.
2. **Vinte das trinta travam em `practicing`**, porque não admitem
   `delayed-retention` e o bloqueio `missing-retention` cai exatamente sobre
   elas.
3. **Não é defeito.** As 10 competências que admitem `delayed-retention` são
   **exatamente** as 10 com `criticalSafety: true` — sobreposição perfeita, zero
   exceções. Retenção retardada se cobra do que produz risco ao paciente.

**Decisão (2026-08-08):** o teto é deliberado. O agendador serve memória para as
30; a UI passa a exibir o teto alcançável de cada competência, para que
`practicing` permanente se leia como limite do currículo e não como fracasso do
aluno. `CompetencyMasteryService` **não** se altera — é Task 8 concluída e
testada.

## 4. Arquitetura

Três módulos novos. Nenhum arquivo existente reescrito.

| Módulo | Natureza | Responsabilidade |
| --- | --- | --- |
| `features/spaced-repetition/models/memoryModel.ts` | **pura** | `scheduleNext(state, grade, params, now) → state` |
| `features/spaced-repetition/services/CompetencyReviewService.ts` | impura, fina | store, consulta de vencidas, gravação de desfecho |
| `constants/competencyReview.ts` | dados | constantes de modelo e de política |

O modelo é puro e recebe `now` por parâmetro — sem relógio interno, sem storage,
sem catálogo. É a mesma disciplina de `calculateCompetencyMastery`, adotada pelo
motivo que aquele arquivo declara: sem relógio interno, o mesmo conjunto de
entradas sempre produz o mesmo estado, e discordar do resultado vira discutir
limiares em vez de caçar não-determinismo.

### A fronteira que faz o desenho funcionar

O agendador decide o **tipo** da evidência que uma revisão produz:

> recuperação correta, decorrido ≥ `delayedRetentionMinHours`, **e** competência
> que admita `delayed-retention` → grava `delayed-retention`.
> Caso contrário → grava `independent-recall`.

Com isso, o motor de domínio continua sem saber que existe agendador, e o
agendador continua sem saber como se calcula domínio. Cada um lê o currículo para
o que lhe cabe: o agendador lê `evidenceMethods`, o motor lê os pesos.

## 5. O modelo de memória

### Estado

```ts
type CompetencyReviewCard = {
    competencyId: string;
    stability: number;       // dias até a recuperabilidade cair ao alvo
    difficulty: number;      // 0–1
    reps: number;
    lapses: number;
    lastReviewedAt: string;  // ISO
    dueAt: string;           // ISO, derivado; persistido para consulta barata
    schemaVersion: number;
};

/**
 * A nota de uma revisão. Não é a escala 0–5 do SM-2: o motor de domínio já
 * registra `outcome` e `hintUsed` por interação (`LearningEvidence`), e inventar
 * uma segunda escala aqui criaria duas verdades sobre o mesmo acerto.
 */
type ReviewGrade = {
    outcome: 'correct' | 'incorrect';
    hintUsed: boolean;
};
```

### Fórmulas

**Recuperabilidade** decai por potência, não por exponencial:

```
R(t) = (1 + t / S) ^ (-α)
```

Esquecimento tem cauda pesada; a exponencial erra justamente nos intervalos
longos, que são os que interessam a um sistema de manutenção de competência.

**Intervalo** sai invertendo a curva no alvo de retenção:

```
I = S · ( r ^ (-1/α) − 1 )
```

**Ganho de estabilidade no acerto** (`outcome: 'correct'`):

```
ganho = a · (1 − difficulty) · (1 − R) · (hintUsed ? h : 1)
S'    = S · (1 + ganho)
```

O termo `(1 − R)` é o coração da decisão: acertar quando a recuperabilidade já
caiu vale mais que acertar logo depois. É a dificuldade desejável expressa como
aritmética, e é a única coisa que o SM-2 estruturalmente não sabe fazer — seu
`easeFactor` não conhece o tempo decorrido.

O fator `h` desconta a dica. Acertar com apoio disponível é acerto, mas não é
recuperação independente — a mesma distinção que os pesos do motor de domínio já
fazem entre `guided-practice` e `independent-recall`. Sem ele, o critério "erro
**ou dica** reduz intervalo", que a Task 11 exige, não teria como ser satisfeito.

**No erro** (`outcome: 'incorrect'`):

```
S' = max(initialStabilityIncorrect, S · b)   e   lapses += 1
```

O piso é a própria estabilidade inicial de erro: um lapso devolve a competência
ao ponto de partida de quem errou na primeira exposição, e nunca abaixo disso.
Não há constante separada para o piso, porque duas constantes para o mesmo
conceito divergem no primeiro ajuste.

### Constantes

| Constante | Default | Por que existe |
| --- | ---: | --- |
| `alpha` (`α`) | 0,5 | forma da curva de esquecimento |
| `stabilityGain` (`a`) | 2,5 | quanto um acerto consolida |
| `lapseFactor` (`b`) | 0,4 | quanto um erro encolhe |
| `hintPenalty` (`h`) | 0,5 | desconto do acerto obtido com dica |
| `difficultyStep` | 0,1 | passo de ajuste de dificuldade |
| `initialStabilityCorrect` | 3 dias | primeira exposição com acerto |
| `initialStabilityIncorrect` | 1 dia | primeira exposição com erro |
| `initialDifficulty` | 0,3 | dificuldade de partida |
| `targetRetention` | 0,90 | alvo padrão |
| `targetRetentionCriticalSafety` | 0,95 | alvo das 10 competências críticas |
| `delayedRetentionMinHours` | 20 | limiar de retenção retardada |
| `minIntervalDays` | 1 | piso de agendamento |
| `maxIntervalDays` | 365 | teto de agendamento |

Oito de modelo e cinco de política, contra os 17–21 do FSRS mais as mesmas de
política. A escolha é deliberada: os parâmetros do FSRS foram otimizados sobre
históricos enormes de flashcards, e aplicá-los a microatividades de radiologia
com este volume seria herdar constantes que ninguém aqui pode justificar nem
reajustar. O formato do estado é o mesmo do FSRS, então promover a fórmula
completa depois é trocar a matemática, não remodelar dados.

### A assimetria de segurança

`criticalSafety` **não** entra como dificuldade inicial. Entra como alvo de
retenção: 0,90 padrão, 0,95 nas críticas. Isso repete no agendador a assimetria
que `MasteryParams` já declara — errar sobre blindagem não é o mesmo que errar
sobre um conceito — em vez de criar uma segunda regra para a mesma ideia.

### A invariante que fecha o laço

Com `targetRetention` 0,95 e estabilidade inicial de 3 dias, o intervalo
calculado sai em ≈ 7,8 horas — **abaixo** do limiar de retenção retardada. A
revisão aconteceria e não contaria. Por isso:

> **`minIntervalDays × 24 ≥ delayedRetentionMinHours`** — piso de 24 h contra
> limiar de 20 h.

Enquanto a desigualdade valer, toda revisão agendada e respondida no prazo produz
`delayed-retention`. É propriedade demonstrável, não coincidência, e vai travada
por teste. De quebra preserva o comportamento que
[`docs/CLIENT_FLOW.md`](../../CLIENT_FLOW.md) já documenta: `REVISÕES 0` no mesmo
dia da lição continua sendo o único resultado possível.

## 6. Fluxo de dados

### Escrita — dois pontos de entrada, um só decide o tipo

**Atividade normal (lição, checkpoint).** `LessonOutcomeService.recordEvidence`
continua como está: o tipo vem do autor, por `interaction.evidenceKind`. O
agendador apenas observa — recebe as evidências gravadas, agrupa por competência,
cria ou atualiza o cartão. Nunca sobrescreve o que o autor declarou.

**Sessão de revisão.** Aqui o agendador é a autoridade, porque foi ele quem
marcou a hora, segundo a regra da §4.

O autor decide o que a atividade **é**; o agendador decide o que a revisão
**provou**. Nenhum dos dois pisa no outro.

### Leitura — onde nasce o `reason`

`JourneyRecommendationService` ganha uma consulta antes de resolver o próximo nó:

1. `CompetencyReviewService.getDue(now)` devolve competências com `dueAt ≤ now`,
   ordenadas por recuperabilidade crescente — quem está mais perto de ser
   esquecido primeiro — com `criticalSafety` desempatando.
2. Há vencidas **e** existe nó de revisão **já desbloqueado** que as cubra →
   `reason: 'due-review'`.
3. Senão, entre os nós disponíveis, algum cobre competência fraca →
   `reason: 'weak-competency'`.
4. Senão → `reason: 'next-new'`.

**As unlock rules continuam soberanas.** O `reason` ordena entre os nós já
disponíveis e **nunca destrava** nó algum. O currículo continua sendo do autor.

### O join, que é o ponto fraco deste desenho

Nó → `lessonId`/`blockId` → atividade → `competencyIds`, num resolver isolado,
`JourneyNodeCompetencyResolver`, com uma responsabilidade só — para que o dia em
que a Task 13 unificar Galáxia e jornada exista um lugar único a mudar.

Os dois espaços de identificador ainda não se tocam: a jornada usa
`node:lesson-1`, `node:review:lesson-1`
([`data/journey/defaultTrack.ts`](../../../radiant-app/src/data/journey/defaultTrack.ts));
o currículo usa `unit:profissao-e-cultura-de-seguranca` e
`competency:…:atribuicoes-e-limites`.

Portanto, **hoje o resolver devolve `competency:legacy:<lessonId>` para todos os
nós**, porque não existe atividade v2 — `LegacyLessonAdapter` emite competência
sintética por lição com `evidenceKind: 'legacy-lesson-recall'`, e
`includeLegacyEvidence` é `false` por padrão. `getDue` volta vazio.

### A propriedade de segurança que isso exige

Com `getDue` vazio, os passos 2 e 3 nunca disparam e a recomendação cai em
`next-new` — **exatamente o comportamento de hoje**. O sistema entra desligado e
acende sozinho quando a Task 10 e o lote de direitos entregarem conteúdo v2. Sem
flag, sem migração: a degradação graciosa é consequência do desenho, e vira
teste.

## 7. Erro, persistência e relógio

### Persistência

Chave nova, `@radiant:competency_review_v1`; as chaves do
`SpacedRepetitionService` ficam intocadas. O store guarda `schemaVersion`, os
cartões por `competencyId`, `lastSeenClock` e `updatedAt`.

**Sem array de histórico.** O store legado faz `store.reviewHistory.push(...)` sem
limite, e cresce para sempre no AsyncStorage do aparelho. Não herdamos o defeito:
`reps` e `lapses` são contadores. (Consertar o legado não é escopo deste
documento.)

Store ilegível **não** é apagado em silêncio: a string crua vai para uma chave de
quarentena e o serviço começa limpo. Perder progresso é ruim; perder progresso
sem deixar rastro é pior. `schemaVersion` maior que a atual: lê como vazio e
**recusa escrever**, para uma versão antiga do app não corromper dados de uma
nova.

### Erro

Best-effort em todo o caminho, no padrão que `LessonOutcomeService` e
`SpacedRepetitionService` já usam: falha ao agendar não derruba a conclusão da
atividade. Se `getDue` lançar, `JourneyRecommendationService` cai no
comportamento de hoje em vez de quebrar a Home.

### Relógio

O decorrido sai de timestamps guardados e é **clampado em zero**: `now <
lastReviewedAt` vira decorrido 0, nunca negativo. Com decorrido 0 o limiar não é
satisfeito, e a evidência é gravada como `independent-recall`. `lastSeenClock`
detecta relógio que andou para trás; na sessão em que isso ocorrer,
`delayed-retention` não é concedida.

O princípio é o que o motor de domínio já pratica — *bloqueio nunca promove*:
**ambiguidade resolve contra conceder domínio**. Data ilegível, decorrido
negativo, relógio retrocedido: todos falham fechado.

**Delimitação de ameaça.** Isto não derrota manipulação deliberada. O app é
local-first, sem conta e sem servidor; quem adianta o relógio para destravar
revisão engana a si mesmo, e não há autoridade externa para contradizê-lo. As
defesas existem para relógio que muda sem intenção — fuso, horário de verão,
correção de NTP. Fingir o contrário seria vender segurança que a arquitetura não
tem.

## 8. Teste

**Pureza torna o tempo testável.** `scheduleNext` recebe `now`, então "trinta dias
depois" é um argumento — sem espera, sem fake timer.

**A invariante vira teste**, assertada diretamente sobre as constantes: afinar o
alvo de retenção ou o piso de intervalo e quebrar o laço derruba a suíte com a
razão escrita, em vez de o sistema passar a agendar revisões que silenciosamente
não contam.

**Propriedades do modelo:**

- estabilidade nunca diminui no acerto, nunca aumenta no erro;
- dificuldade permanece em [0, 1] sob qualquer sequência;
- intervalo nunca sai abaixo do piso nem acima do teto;
- `R(t)` é monotonicamente decrescente em `t`;
- acerto com dica consolida **menos** que acerto sem dica, tudo mais igual — é o
  que satisfaz o critério "erro ou dica reduz intervalo" da Task 11;
- **a que justifica a troca:** para a mesma competência e o mesmo acerto, revisar
  mais tarde — com `R` menor — produz ganho de estabilidade maior que revisar
  cedo. Se este teste não passar, o algoritmo novo não vale a pena.

**Cenários longitudinais:** uma competência seguida por meses simulados, com
expectativas explícitas de agenda e dos estados de domínio produzidos —
incluindo o caso das 20 competências que travam em `practicing`, para que o teto
do currículo fique registrado como comportamento esperado e não vire defeito
reportado depois.

**Relógio:** retrocedido, data ilegível, decorrido zero. Um teste por modo de
falha, cada um afirmando o fechamento.

**Guarda de regressão que autoriza embarcar apagado:** com o catálogo atual, a
saída de `JourneyRecommendationService` tem de ser idêntica à de hoje —
`reason: 'next-new'` em todos os casos.

**Sem E2E agora, e de propósito.** Nada muda para o usuário até o corte vertical
existir; um flow do Maestro aqui testaria a ausência de mudança por um caminho
caro. O E2E pertence à Task 15.

Gate: `npm run quality` (`tsc`, `eslint`, jest) e os validadores do Loop no
fechamento do run.

## 9. O que este documento não decide

- **Não altera `CompetencyMasteryService`.** Task 8 concluída; pesos, limiares e
  bloqueios ficam como estão.
- **Não altera o caminho por lição.** `SpacedRepetitionService` e suas chaves
  continuam intocados, e `docs/specs/spaced-repetition.spec.md` continua vigente
  para ele — inclusive a decisão de manter FSRS fora daquele MVP.
- **Não corrige o currículo.** O teto em `retained` foi aceito como deliberado; se
  isso mudar, é decisão pedagógica de quem escreveu o critério de segurança.
- **Não define a UI.** Exibir o teto alcançável por competência é consequência da
  decisão da §3, mas o desenho da tela pertence à Task 13.
- **Não trata sincronização.** Progresso de revisão é local, como todo o resto.

## 10. Proveniência

- Motor de domínio: `radiant-app/src/features/mastery/services/CompetencyMasteryService.ts`
  e `radiant-app/src/types/mastery.ts`
- Currículo: `Conteúdo/governança/foundations-safety-competencies.json`,
  versão `foundations-safety-2026-08-01`
- Caminho legado: `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts`
  e `radiant-app/src/features/lesson-flow/services/LegacyLessonAdapter.ts`
- Recomendação: `radiant-app/src/features/journey/services/JourneyRecommendationService.ts`
- Plano que esta spec emenda: Task 11 de
  `docs/superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md`
- Pesquisas de referência trazidas pelo dono em 2026-08-08 sustentam a direção
  (recuperação ativa e repetição espaçada com suporte educacional substancial),
  mas **não** sustentam os parâmetros: os números desta spec são pontos de
  partida para ajuste, não evidência.
