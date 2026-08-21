# Atividade e Fim de Lição — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enxugar a tela de atividade do quiz e extrair a conclusão de lição para um componente próprio, com estrelas de desempenho, frase variável e avaliação da aula.

**Architecture:** A regra das estrelas e o banco de frases saem como módulos puros, sem I/O, testáveis com argumentos. A conclusão vira o componente `LessonSummary`, e a barra superior da atividade vira `QuizTopBar`. O `QuizScreen` deixa de ser dono das duas telas e passa a orquestrar, encolhendo das 707 linhas atuais.

**Tech Stack:** React Native / Expo SDK 54, TypeScript, expo-router, Jest + @testing-library/react-native, AsyncStorage.

**Spec:** [docs/superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md](../specs/2026-08-14-atividade-e-fim-de-licao-design.md)

## Global Constraints

Valem para **todas** as tarefas, sem exceção:

- **Toda alteração de arquivo acontece dentro de uma transação Loop.** A CLI é o
  contrato durável do projeto. Sequência obrigatória por tarefa:
  `loop run start` → `loop context build` → `loop step begin --files <cada arquivo>`
  → editar → `loop validate` → `loop step finish` → `loop run close`.
- **Nunca encadeie comandos da CLI com `&&`.** A CLI reporta erro no corpo do JSON
  com status de saída zero; o `&&` não protege. Extraia o `code` de cada resposta.
- **A auto-revisão do que você escreveu vem ANTES de `loop validate`.** Depois de
  `VALIDATION_PASSED` a máquina de estados só aceita `step finish`, e qualquer edição
  posterior deixa a evidência descrevendo uma versão do arquivo que não existe mais.
- **Arquivos novos também são declarados** no `step begin`, para o checkpoint registrar
  a inexistência anterior.
- **`PROJECT_BUSY` significa outra sessão escrevendo.** Não contorne o lock.
- **Portão de qualidade:** `npm run quality` dentro de `radiant-app`, com os 13
  validadores. Nenhum validador é desligado, afrouxado ou contornado.
- **Nota de corte:** 70, lida de `QUIZ_THRESHOLDS.PASSING_SCORE` em
  `src/constants/quiz.ts`. Nunca repita o número literal.
- **Faixas de estrela:** `<70%` → 0, `>=70%` → 1, `>=85%` → 2, `100%` → 3.
- **Paleta:** telas não importam a paleta clara `colors`. Cor clara nova entra como
  token dentro de `galaxyColors`, em `src/ui/theme.ts`.
- **Sem texto livre e sem PII** em qualquer evento de telemetria novo.
- Todos os caminhos abaixo são relativos a `radiant-app/`.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/features/quiz/services/resolveLessonStars.ts` | Regra pura: acurácia → estrelas; melhor tentativa |
| `src/features/quiz/constants/lessonSummaryPhrases.ts` | Banco de frases por faixa + sorteio sem repetir |
| `src/features/quiz/services/LessonRatingService.ts` | Avaliação da aula: persistência local + evento |
| `src/features/quiz/components/QuizTopBar.tsx` | Linha superior da atividade: fechar, progresso, corações |
| `src/features/quiz/components/LessonSummary.tsx` | Tela de conclusão inteira |
| `src/ui/theme.ts` | Token novo `celebrationBand` |
| `src/features/telemetry/telemetry.types.ts` | Evento `lesson_rated` |
| `src/constants/storageKeys.ts` | Chave das avaliações |
| `src/features/quiz/screens/QuizScreen.tsx` | Orquestração; perde as duas telas |

---

### Task 1: Regra das estrelas

**Files:**
- Create: `src/features/quiz/services/resolveLessonStars.ts`
- Test: `src/features/quiz/services/resolveLessonStars.test.ts`

**Interfaces:**
- Consumes: `QUIZ_THRESHOLDS` de `src/constants/quiz.ts`; o tipo `LearningAttempt` de `src/features/progress/services/LearningStatsService.ts` (campos: `lessonId`, `topicId`, `correctAnswers`, `totalQuestions`, `completedAt`).
- Produces: `type LessonStars = 0 | 1 | 2 | 3`; `resolveLessonStars(correctAnswers: number, totalQuestions: number): LessonStars`; `resolveBestLessonStars(lessonId: string, attempts: readonly LearningAttempt[], current: { correctAnswers: number; totalQuestions: number; completedAt: string }): { stars: LessonStars; improved: boolean }`.

**Por que `completedAt` entra na assinatura:** o `LessonOutcomeService.recordAttempt`
grava a tentativa atual no repositório **antes** de a conclusão ser exibida. Se a função
não excluir essa tentativa do histórico, a melhor anterior já inclui a atual e `improved`
seria sempre `false`. A exclusão é por `completedAt`, que vem de `result.answeredAt.toISOString()`.

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { resolveLessonStars, resolveBestLessonStars } from './resolveLessonStars';

const attempt = (over: Partial<{ lessonId: string; correctAnswers: number; totalQuestions: number; completedAt: string }> = {}) => ({
  lessonId: 'licao-1',
  topicId: 'topico-1',
  correctAnswers: 10,
  totalQuestions: 10,
  completedAt: '2026-08-01T10:00:00.000Z',
  ...over,
});

describe('resolveLessonStars', () => {
  it('reprova abaixo da nota de corte', () => {
    expect(resolveLessonStars(69, 100)).toBe(0);
  });
  it('dá uma estrela exatamente na nota de corte', () => {
    expect(resolveLessonStars(70, 100)).toBe(1);
  });
  it('dá duas estrelas a partir de 85%', () => {
    expect(resolveLessonStars(84, 100)).toBe(1);
    expect(resolveLessonStars(85, 100)).toBe(2);
  });
  it('dá três estrelas só em 100%', () => {
    expect(resolveLessonStars(99, 100)).toBe(2);
    expect(resolveLessonStars(10, 10)).toBe(3);
  });
  it('devolve zero quando não há questões', () => {
    expect(resolveLessonStars(0, 0)).toBe(0);
  });
});

describe('resolveBestLessonStars', () => {
  it('usa a tentativa atual quando não há histórico', () => {
    expect(resolveBestLessonStars('licao-1', [], { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 1, improved: true });
  });

  it('mantém a melhor marca quando a tentativa atual é pior', () => {
    const historico = [attempt({ correctAnswers: 10, totalQuestions: 10, completedAt: 'antes' })];
    expect(resolveBestLessonStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 3, improved: false });
  });

  it('ignora a própria tentativa atual já persistida', () => {
    const historico = [attempt({ correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' })];
    expect(resolveBestLessonStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 1, improved: true });
  });

  it('ignora tentativas de outras lições', () => {
    const historico = [attempt({ lessonId: 'outra', correctAnswers: 10, totalQuestions: 10, completedAt: 'antes' })];
    expect(resolveBestLessonStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 1, improved: true });
  });
});
```

- [ ] **Step 2: Rodar o teste e ver o vermelho**

Run: `cd radiant-app && npx jest src/features/quiz/services/resolveLessonStars.test.ts`
Expected: FAIL — `Cannot find module './resolveLessonStars'`

Observe este vermelho rodando o teste direto, **sem** gastar ciclo de `loop validate`.

- [ ] **Step 3: Implementar**

```ts
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { LearningAttempt } from '../../progress/services/LearningStatsService';

export type LessonStars = 0 | 1 | 2 | 3;

const TWO_STAR_ACCURACY = 85;

export function resolveLessonStars(correctAnswers: number, totalQuestions: number): LessonStars {
  if (totalQuestions <= 0) { return 0; }
  const accuracy = (correctAnswers / totalQuestions) * 100;
  if (accuracy >= 100) { return 3; }
  if (accuracy >= TWO_STAR_ACCURACY) { return 2; }
  if (accuracy >= QUIZ_THRESHOLDS.PASSING_SCORE) { return 1; }
  return 0;
}

export function resolveBestLessonStars(
  lessonId: string,
  attempts: readonly LearningAttempt[],
  current: { correctAnswers: number; totalQuestions: number; completedAt: string },
): { stars: LessonStars; improved: boolean } {
  const currentStars = resolveLessonStars(current.correctAnswers, current.totalQuestions);

  const previousBest = attempts.reduce<LessonStars>((best, entry) => {
    if (entry.lessonId !== lessonId) { return best; }
    if (entry.completedAt === current.completedAt) { return best; }
    const stars = resolveLessonStars(entry.correctAnswers, entry.totalQuestions);
    return stars > best ? stars : best;
  }, 0);

  return {
    stars: currentStars > previousBest ? currentStars : previousBest,
    improved: currentStars > previousBest,
  };
}
```

- [ ] **Step 4: Rodar o teste e ver o verde**

Run: `cd radiant-app && npx jest src/features/quiz/services/resolveLessonStars.test.ts`
Expected: PASS, 9 testes

- [ ] **Step 5: Fechar a transação**

```bash
loop validate --run <run-id>
```

Depois `loop step finish`, `loop run close`, e commit:

```bash
git add radiant-app/src/features/quiz/services/resolveLessonStars.ts radiant-app/src/features/quiz/services/resolveLessonStars.test.ts
git commit -m "feat(quiz): regra pura de estrelas por acuracia"
```

---

### Task 2: Banco de frases da conclusão

**Files:**
- Create: `src/features/quiz/constants/lessonSummaryPhrases.ts`
- Test: `src/features/quiz/constants/lessonSummaryPhrases.test.ts`

**Interfaces:**
- Consumes: `LessonStars` da Task 1.
- Produces: `LESSON_SUMMARY_PHRASES: Record<LessonStars, readonly string[]>`; `pickSummaryPhrase(stars: LessonStars, previous: string | null, pickIndex?: (length: number) => number): string`.

A injeção de `pickIndex` existe para o teste ser determinístico sem mexer em `Math.random` global.

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { LESSON_SUMMARY_PHRASES, pickSummaryPhrase } from './lessonSummaryPhrases';

describe('lessonSummaryPhrases', () => {
  it('tem ao menos três frases em cada faixa', () => {
    ([0, 1, 2, 3] as const).forEach((stars) => {
      expect(LESSON_SUMMARY_PHRASES[stars].length).toBeGreaterThanOrEqual(3);
    });
  });

  it('não celebra a faixa zero', () => {
    LESSON_SUMMARY_PHRASES[0].forEach((frase) => {
      expect(frase.toLowerCase()).not.toContain('parabéns');
    });
  });

  it('escolhe pela faixa informada', () => {
    const frase = pickSummaryPhrase(3, null, () => 0);
    expect(frase).toBe(LESSON_SUMMARY_PHRASES[3][0]);
  });

  it('não repete a frase anterior', () => {
    const anterior = LESSON_SUMMARY_PHRASES[2][0];
    const frase = pickSummaryPhrase(2, anterior, () => 0);
    expect(frase).not.toBe(anterior);
  });
});
```

- [ ] **Step 2: Rodar o teste e ver o vermelho**

Run: `cd radiant-app && npx jest src/features/quiz/constants/lessonSummaryPhrases.test.ts`
Expected: FAIL — módulo inexistente

- [ ] **Step 3: Implementar**

```ts
import type { LessonStars } from '../services/resolveLessonStars';

export const LESSON_SUMMARY_PHRASES: Record<LessonStars, readonly string[]> = {
  0: [
    'Ainda não fechou. Refazer agora é o caminho mais curto.',
    'Faltou pouco para o corte. A segunda passada costuma render.',
    'Esta ficou pela metade — vale rever antes de seguir.',
  ],
  1: [
    'Você conseguiu. Vamos continuar assim!',
    'Passou! Dá para apertar o resultado repetindo.',
    'Lição fechada. O próximo passo já está liberado.',
  ],
  2: [
    'Muito bom. Faltou pouco para a marca cheia.',
    'Resultado forte — quase tudo certo.',
    'Você está perto do domínio completo desta lição.',
  ],
  3: [
    'Perfeito. Nenhum erro nesta lição.',
    'Marca cheia! Leitura impecável.',
    'Três estrelas. Nada passou despercebido.',
  ],
};

export function pickSummaryPhrase(
  stars: LessonStars,
  previous: string | null,
  pickIndex: (length: number) => number = (length) => Math.floor(Math.random() * length),
): string {
  const todas = LESSON_SUMMARY_PHRASES[stars];
  const elegiveis = todas.filter((frase) => frase !== previous);
  const pool = elegiveis.length > 0 ? elegiveis : todas;
  const index = Math.min(Math.max(pickIndex(pool.length), 0), pool.length - 1);
  return pool[index];
}
```

- [ ] **Step 4: Rodar o teste e ver o verde**

Run: `cd radiant-app && npx jest src/features/quiz/constants/lessonSummaryPhrases.test.ts`
Expected: PASS, 4 testes

- [ ] **Step 5: Fechar a transação e commitar**

```bash
git add radiant-app/src/features/quiz/constants/
git commit -m "feat(quiz): banco de frases da conclusao por faixa de estrelas"
```

---

### Task 3: Token da faixa de celebração e adendo no ADR

**Files:**
- Modify: `src/ui/theme.ts` — adicionar ao objeto `galaxyColors`
- Modify: `docs/adr/2026-07-27-identidade-visual-galaxy-dark.md` (confirme o nome exato do arquivo com `ls docs/adr` antes de editar)
- Test: `scripts/identity-palette-contract.test.mjs` deve continuar passando sem alteração

**Interfaces:**
- Produces: `galaxyColors.celebrationBand` (fundo claro da faixa) e `galaxyColors.celebrationBandInk` (cor de traço sobre a faixa, para a arte, não para texto de leitura).

- [ ] **Step 1: Adicionar os tokens**

Dentro do objeto `galaxyColors` em `src/ui/theme.ts`, junto dos demais tokens:

```ts
  /**
   * Faixa de celebração do fim de lição. Vive na paleta ESCURA de propósito:
   * o contrato de identidade proíbe telas de importarem a paleta clara
   * `colors`, e a faixa precisa de cor clara sem reabrir aquela porta.
   * Nenhum texto de leitura é pintado sobre ela — só a arte do Pixel.
   */
  celebrationBand: '#F5C518',
  celebrationBandInk: '#1A1400',
```

- [ ] **Step 2: Verificar que o contrato de identidade continua verde**

Run: `cd radiant-app && node --test scripts/identity-palette-contract.test.mjs`
Expected: PASS — nenhuma importação de `colors` foi adicionada

- [ ] **Step 3: Registrar o adendo no ADR**

Acrescente ao final do ADR da identidade galaxy dark:

```markdown
## Adendo — 2026-08-14: faixa de celebração no fim de lição

A conclusão de lição inverte uma faixa no topo da tela, com fundo claro e a arte do
Pixel. Isso **não** é exceção a este ADR: a faixa usa `galaxyColors.celebrationBand`,
token que vive na paleta escura, e nenhuma tela passa a importar a paleta clara
`colors`. Nenhum texto de leitura é pintado sobre a faixa, então o contrato de
contraste também segue intacto. O corpo da tela continua escuro.
```

- [ ] **Step 4: Rodar os dois contratos de cor**

Run: `cd radiant-app && node --test scripts/identity-palette-contract.test.mjs scripts/contrast-contract.test.mjs`
Expected: PASS nos dois

- [ ] **Step 5: Fechar a transação e commitar**

```bash
git add radiant-app/src/ui/theme.ts docs/adr/
git commit -m "feat(ui): token da faixa de celebracao na paleta escura"
```

---

### Task 4: Avaliação da aula

**Files:**
- Create: `src/features/quiz/services/LessonRatingService.ts`
- Test: `src/features/quiz/services/LessonRatingService.test.ts`
- Modify: `src/features/telemetry/telemetry.types.ts` — acrescentar `'lesson_rated'` à união `TelemetryEventName`
- Modify: `src/constants/storageKeys.ts` — acrescentar a chave

**Interfaces:**
- Consumes: `TelemetryService.track(name, props)` de `src/features/telemetry/TelemetryService.ts`; `AsyncStorage`; `STORAGE_KEYS`.
- Produces: `LessonRatingService.getRating(lessonId: string): Promise<number | null>`; `LessonRatingService.rate(lessonId: string, rating: number): Promise<void>`.

Regra da spec: uma lição é avaliada **uma vez**. `rate` é idempotente — se já existe nota, não sobrescreve e não emite evento de novo.

- [ ] **Step 1: Escrever o teste que falha**

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonRatingService } from './LessonRatingService';
import { TelemetryService } from '../../telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));

describe('LessonRatingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    jest.spyOn(TelemetryService, 'track').mockResolvedValue(undefined);
  });

  it('devolve null quando a lição nunca foi avaliada', async () => {
    await expect(LessonRatingService.getRating('licao-1')).resolves.toBeNull();
  });

  it('grava a nota e emite o evento', async () => {
    await LessonRatingService.rate('licao-1', 4);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(TelemetryService.track).toHaveBeenCalledWith('lesson_rated', { lessonId: 'licao-1', rating: 4 });
  });

  it('não sobrescreve nem reemite quando já existe nota', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ 'licao-1': 5 }));
    await LessonRatingService.rate('licao-1', 2);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(TelemetryService.track).not.toHaveBeenCalled();
  });

  it('recusa nota fora de 1 a 5 sem gravar', async () => {
    await LessonRatingService.rate('licao-1', 9);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(TelemetryService.track).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Rodar o teste e ver o vermelho**

Run: `cd radiant-app && npx jest src/features/quiz/services/LessonRatingService.test.ts`
Expected: FAIL — módulo inexistente

- [ ] **Step 3: Acrescentar o evento à allowlist**

Em `src/features/telemetry/telemetry.types.ts`, dentro da união `TelemetryEventName`,
em ordem alfabética junto dos eventos de lição:

```ts
    | 'lesson_rated'
```

- [ ] **Step 4: Acrescentar a chave de storage**

Em `src/constants/storageKeys.ts`, seguindo o padrão de nomenclatura já usado no arquivo:

```ts
  LESSON_RATINGS: '@radiant/lesson-ratings',
```

- [ ] **Step 5: Implementar o serviço**

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { TelemetryService } from '../../telemetry/TelemetryService';

const MIN_RATING = 1;
const MAX_RATING = 5;

type RatingMap = Record<string, number>;

async function readAll(): Promise<RatingMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.LESSON_RATINGS);
    if (!raw) { return {}; }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) { return {}; }
    return parsed as RatingMap;
  } catch {
    return {};
  }
}

class LessonRatingServiceImpl {
  async getRating(lessonId: string): Promise<number | null> {
    const all = await readAll();
    const value = all[lessonId];
    return typeof value === 'number' ? value : null;
  }

  /**
   * Uma lição é avaliada uma vez. Repetir a lição não pede nota de novo, e não
   * existe desfazer pela interface — decisão registrada na spec.
   * Escrita best-effort: avaliar nunca pode derrubar a conclusão da lição.
   */
  async rate(lessonId: string, rating: number): Promise<void> {
    if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) { return; }
    const all = await readAll();
    if (typeof all[lessonId] === 'number') { return; }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LESSON_RATINGS, JSON.stringify({ ...all, [lessonId]: rating }));
      await TelemetryService.track('lesson_rated', { lessonId, rating });
    } catch (error) {
      console.error('[LessonRatingService] Falha ao registrar avaliação:', error);
    }
  }
}

export const LessonRatingService = new LessonRatingServiceImpl();
```

- [ ] **Step 6: Rodar o teste e ver o verde**

Run: `cd radiant-app && npx jest src/features/quiz/services/LessonRatingService.test.ts`
Expected: PASS, 4 testes

- [ ] **Step 7: Fechar a transação e commitar**

```bash
git add radiant-app/src/features/quiz/services/LessonRatingService.ts radiant-app/src/features/quiz/services/LessonRatingService.test.ts radiant-app/src/features/telemetry/telemetry.types.ts radiant-app/src/constants/storageKeys.ts
git commit -m "feat(quiz): avaliacao da aula com evento na allowlist"
```

---

### Task 5: Barra superior da atividade

**Files:**
- Create: `src/features/quiz/components/QuizTopBar.tsx`
- Test: `src/features/quiz/components/QuizTopBar.test.tsx`
- Modify: `src/ui/components/HUD.tsx` — exportar `HeartsDisplay`

**Interfaces:**
- Consumes: `AnimatedProgressBar` de `src/components/ui/AnimatedProgressBar`; `DecorativeIcon`; `HeartsDisplay` (recém-exportado do HUD); `galaxyColors`.
- Produces: `QuizTopBar({ questionIndex, totalQuestions, hearts, maxHearts, onClose })`.

A barra **não** carrega `accessibilityLabel` de progresso: quem anuncia a posição é a
contagem visível da Task 6. Duas fontes anunciariam a mesma coisa duas vezes.

- [ ] **Step 1: Escrever o teste que falha**

```tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { QuizTopBar } from './QuizTopBar';

describe('QuizTopBar', () => {
  it('chama onClose ao tocar em fechar', () => {
    const onClose = jest.fn();
    render(<QuizTopBar questionIndex={0} totalQuestions={5} hearts={3} maxHearts={5} onClose={onClose} />);
    fireEvent.press(screen.getByLabelText('Fechar quiz'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('não anuncia progresso pela barra', () => {
    render(<QuizTopBar questionIndex={2} totalQuestions={5} hearts={3} maxHearts={5} onClose={jest.fn()} />);
    expect(screen.queryByLabelText(/Questão 3 de 5/)).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar o teste e ver o vermelho**

Run: `cd radiant-app && npx jest src/features/quiz/components/QuizTopBar.test.tsx`
Expected: FAIL — módulo inexistente

- [ ] **Step 3: Exportar `HeartsDisplay`**

Em `src/ui/components/HUD.tsx`, trocar `function HeartsDisplay(` por `export function HeartsDisplay(`. Não altere o comportamento nem o restante do arquivo.

- [ ] **Step 4: Implementar a barra**

```tsx
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AnimatedProgressBar } from '../../../components/ui/AnimatedProgressBar';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { HeartsDisplay } from '../../../ui/components/HUD';
import { galaxyColors } from '../../../ui/theme';
import { radius, space } from '../../../ui/styles';

type QuizTopBarProps = {
  questionIndex: number;
  totalQuestions: number;
  hearts: number;
  maxHearts: number;
  onClose: () => void;
};

export function QuizTopBar({ questionIndex, totalQuestions, hearts, maxHearts, onClose }: QuizTopBarProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar quiz" style={styles.iconButton}>
        <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
      </Pressable>
      <View style={styles.barSlot}>
        <AnimatedProgressBar ratio={(questionIndex + 1) / Math.max(1, totalQuestions)} height={10} />
      </View>
      <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2, width: '100%' },
  barSlot: { flex: 1 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.rXl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
});
```

- [ ] **Step 5: Rodar o teste e ver o verde**

Run: `cd radiant-app && npx jest src/features/quiz/components/QuizTopBar.test.tsx`
Expected: PASS, 2 testes

- [ ] **Step 6: Fechar a transação e commitar**

```bash
git add radiant-app/src/features/quiz/components/QuizTopBar.tsx radiant-app/src/features/quiz/components/QuizTopBar.test.tsx radiant-app/src/ui/components/HUD.tsx
git commit -m "feat(quiz): barra superior unica da atividade"
```

---

### Task 6: Enxugar a tela de atividade

**Files:**
- Modify: `src/features/quiz/screens/QuizScreen.tsx` — bloco da questão ativa (hoje a partir da linha ~501)

**Interfaces:**
- Consumes: `QuizTopBar` da Task 5.
- Produces: nenhuma API nova; a tela passa a renderizar `QuizTopBar` + contagem + questão.

**Removidos deste bloco, na íntegra:** o `<HUD ... compact />` acima do layout; a
`headerRow` inteira, com o `iconButton` de fechar, o `headerLabel` ("Quiz"/"Quiz de
Revisão") e o `headerProgressText` (`5/5`); o `activeHeroCard` inteiro, com
`activeTitle`, `activeBody` e o `ProgressRing`; a `AnimatedProgressBar` solta, que passa
a viver dentro do `QuizTopBar`. Remova também os estilos que ficarem órfãos e o import
de `ProgressRing` se ele não for mais usado em nenhum outro ponto do arquivo.

- [ ] **Step 1: Escrever o teste que falha**

Acrescente a `src/features/quiz/screens/QuizScreen.flow.test.tsx`:

```tsx
it('mostra a contagem de questões e nenhum cabeçalho redundante', async () => {
  renderWithProviders(<QuizScreen lessonId={'licao-1' as never} />);
  await waitFor(() => expect(screen.getByText('Pergunta 1 de 5')).toBeTruthy());
  expect(screen.queryByText('Quiz')).toBeNull();
  expect(screen.queryByText('1/5')).toBeNull();
  expect(screen.queryByLabelText('Questões')).toBeNull();
});
```

Ajuste `lessonId` e o total de questões para a fixture que o arquivo de teste já monta.

- [ ] **Step 2: Rodar o teste e ver o vermelho**

Run: `cd radiant-app && npx jest src/features/quiz/screens/QuizScreen.flow.test.tsx -t "contagem de questões"`
Expected: FAIL — o texto `Quiz` ainda existe na tela

- [ ] **Step 3: Substituir o topo do bloco ativo**

```tsx
        <View style={[layout.container, styles.activeLayout]}>
          <QuizTopBar
            questionIndex={progress.currentQuestionIndex}
            totalQuestions={progress.totalQuestions}
            hearts={hearts}
            maxHearts={maxHearts}
            onClose={() => router.replace('/(tabs)')}
          />

          <Text style={styles.questionCounter}>
            Pergunta {progress.currentQuestionIndex + 1} de {progress.totalQuestions}
          </Text>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* QuizQuestion e QuizFeedback seguem exatamente como estão hoje */}
          </ScrollView>
        </View>
```

E o estilo novo, junto dos demais:

```ts
  questionCounter: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
```

- [ ] **Step 4: Rodar o teste e ver o verde**

Run: `cd radiant-app && npx jest src/features/quiz/screens/QuizScreen.flow.test.tsx`
Expected: PASS — a suíte inteira do arquivo

- [ ] **Step 5: Devolver o respiro ao enunciado**

Exigência da seção 3.3 da spec. Em `src/features/quiz/components/QuizQuestion.tsx`,
o enunciado e as alternativas ganham espaço, seguindo a referência: o enunciado
centralizado com margem vertical generosa, e cada alternativa ocupando a largura com
texto centralizado.

Declare `src/features/quiz/components/QuizQuestion.tsx` no `step begin` desta tarefa.

```ts
  // no StyleSheet de QuizQuestion.tsx
  prompt: {
    ...typography.h2,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
    marginVertical: space.s5,
  },
  option: {
    width: '100%',
    paddingVertical: space.s3,
    paddingHorizontal: space.s3,
    borderRadius: radius.rLg,
    backgroundColor: galaxyColors.surface,
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
  optionText: {
    ...typography.body,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
```

Preserve os estilos de estado que o arquivo já tem para alternativa selecionada,
correta e incorreta — este passo mexe em espaçamento e alinhamento, **não** em
sinalização de resposta.

- [ ] **Step 6: Rodar a suíte do quiz**

Run: `cd radiant-app && npx jest src/features/quiz`
Expected: PASS

- [ ] **Step 7: Rodar o portão inteiro**

Run: `cd radiant-app && npm run quality`
Expected: PASS nos 13 validadores

- [ ] **Step 8: Fechar a transação e commitar**

```bash
git add radiant-app/src/features/quiz/screens/QuizScreen.tsx radiant-app/src/features/quiz/screens/QuizScreen.flow.test.tsx radiant-app/src/features/quiz/components/QuizQuestion.tsx
git commit -m "refactor(quiz): topo da atividade com uma declaracao de progresso"
```

---

### Task 7: Componente da conclusão

**Files:**
- Create: `src/features/quiz/components/LessonSummary.tsx`
- Test: `src/features/quiz/components/LessonSummary.test.tsx`

**Interfaces:**
- Consumes: `LessonStars` e `resolveLessonStars` (Task 1); `pickSummaryPhrase` (Task 2); `galaxyColors.celebrationBand` (Task 3); `PixelHeroSplit` de `src/components/ui/PixelHeroSplit`; `AnimatedProgressBar`.
- Produces:

```ts
type LessonSummaryProps = {
  stars: LessonStars;
  starsImproved: boolean;
  phrase: string;
  xpAwarded: number;
  correctAnswers: number;
  totalQuestions: number;
  unitCompleted: number;
  unitTotal: number;
  habitLine: string | null;
  currentRating: number | null;
  onRate: (rating: number) => void;
  onContinue: () => void;
};
```

O componente é **puro de apresentação**: não lê storage, não chama serviço, não decide
frase. Quem resolve estrelas, frase e nota é a tela, na Task 8. Isso é o que o torna
testável sem montar o quiz inteiro.

- [ ] **Step 1: Escrever o teste que falha**

```tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { LessonSummary } from './LessonSummary';

const base = {
  stars: 2 as const,
  starsImproved: true,
  phrase: 'Muito bom.',
  xpAwarded: 30,
  correctAnswers: 9,
  totalQuestions: 10,
  unitCompleted: 7,
  unitTotal: 14,
  habitLine: 'Meta do dia fechada.',
  currentRating: null,
  onRate: jest.fn(),
  onContinue: jest.fn(),
};

describe('LessonSummary', () => {
  it('mostra os dois cards de placar da tentativa', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('9 de 10 corretas')).toBeTruthy();
    expect(screen.getByText('+30 XP nesta tentativa')).toBeTruthy();
  });

  it('mostra o progresso da unidade', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('7 de 14 lições')).toBeTruthy();
  });

  it('emite a nota escolhida', () => {
    const onRate = jest.fn();
    render(<LessonSummary {...base} onRate={onRate} />);
    fireEvent.press(screen.getByLabelText('Avaliar a aula com 4 de 5'));
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it('não pede avaliação quando a lição já foi avaliada', () => {
    render(<LessonSummary {...base} currentRating={5} />);
    expect(screen.queryByLabelText('Avaliar a aula com 4 de 5')).toBeNull();
  });

  it('não renderiza oferta de assinatura nem pedido de notificação', () => {
    render(<LessonSummary {...base} />);
    expect(screen.queryByText(/Radiant Plus/)).toBeNull();
    expect(screen.queryByText(/notifica/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar o teste e ver o vermelho**

Run: `cd radiant-app && npx jest src/features/quiz/components/LessonSummary.test.tsx`
Expected: FAIL — módulo inexistente

- [ ] **Step 3: Implementar o componente**

```tsx
export function LessonSummary({
  stars, starsImproved, phrase, xpAwarded, correctAnswers, totalQuestions,
  unitCompleted, unitTotal, habitLine, currentRating, onRate, onContinue,
}: LessonSummaryProps) {
  return (
    <View style={styles.root}>
      {/* Faixa invertida: só arte, nenhum texto de leitura sobre ela. */}
      <View style={styles.band}>
        <PixelHeroSplit state="celebrate" tier="intermediate" accessibilityLabel="Pixel comemorando" />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <StarRow stars={stars} animate={starsImproved} />

        <Text style={styles.phrase} accessibilityRole="header">{phrase}</Text>
        <Text style={styles.subtitle}>A lição foi concluída</Text>

        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{`+${xpAwarded} XP nesta tentativa`}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{`${correctAnswers} de ${totalQuestions} corretas`}</Text>
          </View>
        </View>

        <View style={styles.unitCard}>
          <Text style={styles.unitLabel}>Progresso da unidade</Text>
          <Text style={styles.unitValue}>{`${unitCompleted} de ${unitTotal} lições`}</Text>
          <AnimatedProgressBar ratio={unitCompleted / Math.max(1, unitTotal)} height={10} />
        </View>

        {habitLine ? <Text style={styles.habitLine}>{habitLine}</Text> : null}

        {currentRating === null ? (
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                onPress={() => onRate(n)}
                accessibilityRole="button"
                accessibilityLabel={`Avaliar a aula com ${n} de 5`}
              >
                <DecorativeIcon name="star" size={28} color={galaxyColors.textSecondary} />
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.ratingGiven}>{`Você avaliou esta aula com ${currentRating} de 5`}</Text>
        )}
      </ScrollView>

      <AppButton title="Continuar" onPress={onContinue} />
    </View>
  );
}
```

`StarRow` é local a este arquivo: recebe `stars` e `animate`, e pinta três estrelas —
`stars` preenchidas, o resto apagadas. Quando `animate` é `false`, elas entram já no
estado final, sem animação de ganho: a marca não melhorou e a tela não deve sugerir que
melhorou.

Confirme o nome exato do `state` de comemoração aceito por `PixelHeroSplit` antes de
usar `"celebrate"`; se o componente não expuser esse estado, use o mais próximo que
`pixelExpressions` já define. Use `galaxyColors` para todo o resto; **não importe a
paleta clara `colors`**.

- [ ] **Step 4: Rodar o teste e ver o verde**

Run: `cd radiant-app && npx jest src/features/quiz/components/LessonSummary.test.tsx`
Expected: PASS, 5 testes

- [ ] **Step 5: Rodar os contratos de cor**

Run: `cd radiant-app && node --test scripts/identity-palette-contract.test.mjs scripts/contrast-contract.test.mjs`
Expected: PASS nos dois

- [ ] **Step 6: Fechar a transação e commitar**

```bash
git add radiant-app/src/features/quiz/components/LessonSummary.tsx radiant-app/src/features/quiz/components/LessonSummary.test.tsx
git commit -m "feat(quiz): componente de conclusao de licao"
```

---

### Task 8: Ligar a conclusão e remover push e paywall

**Files:**
- Modify: `src/features/quiz/screens/QuizScreen.tsx` — bloco de resultado
- Modify: `src/features/quiz/screens/QuizScreen.flow.test.tsx`

**Interfaces:**
- Consumes: `LessonSummary` (Task 7), `resolveBestLessonStars` (Task 1), `pickSummaryPhrase` (Task 2), `LessonRatingService` (Task 4), `LearningAttemptsRepository.getAll()`.

A tela resolve, nesta ordem: lê as tentativas com `LearningAttemptsRepository.getAll()`;
chama `resolveBestLessonStars(result.lessonId, attempts, { correctAnswers, totalQuestions, completedAt: result.answeredAt.toISOString() })`;
sorteia a frase com `pickSummaryPhrase(stars, null)`; lê a nota com
`LessonRatingService.getRating(result.lessonId)`; e passa tudo para o `LessonSummary`.

**Removidos do bloco de resultado:** `PushOptInCard` e o estado `showPushOptIn` que só
o servia; `PaywallOfferCard`, `paywallOffer`, `paywallSubmitting`, `paywallFeedback` e
o handler de captura de interesse; os cards separados de meta diária e de "Leitura do
hábito", que viram a única linha `habitLine`; e o `actionCard` de próxima decisão.
Remova os imports que ficarem órfãos — `PaywallService`, `PaywallOfferCard`,
`UpgradeInterestService`, `PushOptInCard` — e os estilos sem uso.

**Não** remova `PushService` nem `RatingPromptService` sem antes conferir se o restante
do arquivo os usa.

- [ ] **Step 1: Escrever o teste que falha**

```tsx
it('conclui a lição sem oferta de assinatura nem pedido de notificação', async () => {
  renderWithProviders(<QuizScreen lessonId={'licao-1' as never} />);
  // responda todas as questões usando o mesmo padrão já usado nos testes deste arquivo
  await waitFor(() => expect(screen.getByText('A lição foi concluída')).toBeTruthy());
  expect(screen.queryByText(/Radiant Plus/)).toBeNull();
  expect(screen.queryByText(/Próxima decisão/)).toBeNull();
});
```

- [ ] **Step 2: Rodar o teste e ver o vermelho**

Run: `cd radiant-app && npx jest src/features/quiz/screens/QuizScreen.flow.test.tsx -t "sem oferta de assinatura"`
Expected: FAIL — `A lição foi concluída` ainda não existe

- [ ] **Step 3: Substituir o bloco de resultado pelo `LessonSummary`**

Resolva os dados antes de renderizar, num efeito disparado quando o resultado chega:

```tsx
const [summary, setSummary] = useState<{
  stars: LessonStars; improved: boolean; phrase: string; rating: number | null;
} | null>(null);

useEffect(() => {
  if (!result) { return; }
  let cancelado = false;
  void (async () => {
    const attempts = await LearningAttemptsRepository.getAll();
    const { stars, improved } = resolveBestLessonStars(result.lessonId, attempts, {
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      completedAt: result.answeredAt.toISOString(),
    });
    const rating = await LessonRatingService.getRating(result.lessonId);
    if (cancelado) { return; }
    setSummary({ stars, improved, phrase: pickSummaryPhrase(stars, null), rating });
  })();
  return () => { cancelado = true; };
}, [result]);
```

E o render do bloco de resultado passa a ser:

```tsx
{summary ? (
  <LessonSummary
    stars={summary.stars}
    starsImproved={summary.improved}
    phrase={summary.phrase}
    xpAwarded={xpAward?.totalXpAwarded ?? 0}
    correctAnswers={result.correctAnswers}
    totalQuestions={result.totalQuestions}
    unitCompleted={unitCompleted}
    unitTotal={unitTotal}
    habitLine={habitLine}
    currentRating={summary.rating}
    onRate={(nota) => {
      void LessonRatingService.rate(result.lessonId, nota);
      setSummary((atual) => (atual ? { ...atual, rating: nota } : atual));
    }}
    onContinue={() => router.replace('/(tabs)')}
  />
) : null}
```

`unitCompleted` e `unitTotal` saem do mesmo cálculo que o `RewardScreen` já faz sobre o
`JourneySnapshot` para a unidade ativa — leia aquele arquivo e reaproveite a lógica em
vez de inventar uma segunda. `habitLine` é a fusão, numa string só, do que hoje são os
cards de meta diária e de "Leitura do hábito"; quando nenhum dos dois tem o que dizer,
passe `null`.

Mantenha o `Confetti` e o `hapticCelebrate` que já existem, se o arquivo os dispara na
conclusão — eles não conflitam com a nova estrutura.

- [ ] **Step 4: Rodar a suíte do quiz e ver o verde**

Run: `cd radiant-app && npx jest src/features/quiz`
Expected: PASS

- [ ] **Step 5: Rodar os fluxos que tocam o quiz**

Run: `cd radiant-app && npm run test:flows`
Expected: PASS — inclui `QuizScreen.flow.test.tsx` e `ReviewScreen.flow.test.tsx`

- [ ] **Step 6: Rodar o portão inteiro**

Run: `cd radiant-app && npm run quality`
Expected: PASS nos 13 validadores

- [ ] **Step 7: Fechar a transação e commitar**

```bash
git add radiant-app/src/features/quiz/
git commit -m "feat(quiz): conclusao de licao enxuta com estrelas e avaliacao"
```

---

## Verificação final

Depois da Task 8, antes de declarar a passagem pronta:

- [ ] `cd radiant-app && npm run quality` — os 13 validadores, verdes
- [ ] Rodar o app no simulador iOS e percorrer uma lição inteira até a conclusão
- [ ] Conferir na tela, não no código: uma única declaração de progresso no topo; os
      corações visíveis durante a questão; a faixa de celebração invertida com o corpo
      escuro; os dois cards dizendo "nesta tentativa"; a avaliação sumindo depois de dada
- [ ] Confirmar que `QuizScreen.tsx` ficou **menor** que as 707 linhas iniciais

A verificação em simulador não é opcional: nenhum validador estático enxerga a tela.
