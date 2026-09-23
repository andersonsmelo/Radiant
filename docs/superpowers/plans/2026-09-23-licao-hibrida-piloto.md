# Lição híbrida — piloto na L1 · Plano de implementação

> **Para agentes executores:** SUB-SKILL OBRIGATÓRIA: use
> `superpowers:subagent-driven-development` (recomendado) ou
> `superpowers:executing-plans` para implementar este plano tarefa por tarefa.
> Os passos usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** construir a L1 do Arco 1 no formato híbrido — 12 itens curtos
gerados por regra, som e vibração, custo de vida só no desafio e resumo no fim —
numa rota de desenvolvimento, sem build de distribuição.

**Arquitetura:** a verdade técnica mora em duas funções puras: a geometria do
mapa corporal, que já existia implícita no componente, e uma tabela de relações
revisada pelo dono. Os modelos de exercício geram itens a partir das duas, com
gabarito calculado. Uma sessão pura conduz a lição (fila, reinserção, sequência
de acertos, resumo). A tela só desenha estado e fala com três portas: vidas, som
e vibração, e medidas locais.

**Tecnologias:** Expo 54, React Native 0.81, TypeScript, `react-native-svg`,
`expo-haptics` (já instalado), `expo-audio ~1.1.1` (novo), Jest com `jest-expo`
e `@testing-library/react-native`.

**Spec:** [`2026-09-23-licao-hibrida-piloto-design.md`](../specs/2026-09-23-licao-hibrida-piloto-design.md)
· **ADR:** [`ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md`](../../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md)

## Restrições globais

Valem para toda tarefa, mesmo quando ela não as repete.

- **Forma da lição:** 4 itens de primeiro contato e 8 de desafio, uma ação por
  item; o item de desafio errado volta no fim, em outro cenário (spec §5.1).
- **Custo de vida:** o primeiro contato nunca custa; o desafio custa uma vida
  (ADR 2026-09-23, item 2). Revisão não é tocada.
- **Gabarito:** sempre calculado pelo código, a partir da tabela ou da
  geometria. Nenhum texto decide a resposta (spec §5.3).
- **Evidência:** a primeira tentativa de um desafio original é
  `initial_independent`; o primeiro contato e os itens reinseridos são
  `assisted_practice`. XP nunca é evidência de domínio.
- **XP só é exibido.** Nada grava no `GamificationService`: o V3 não está
  ativado (ADR V3, item 6). A fórmula é a do `XP_RULES`.
- **O V3 continua desligado:** não chamar `prepareV3()` nem ligar nada a
  catálogo, manifesto ou rota de aluno. O piloto vive na rota `/licao-hibrida`,
  atrás de `AppConfig.SHOW_DEV_TOOLS`.
- **Sons:** os seis de `radiant-app/assets/sounds/`, pré-carregados na abertura
  da lição e respeitando o silencioso. **A vibração é só no iOS**, a convenção
  de `src/ui/feedback/haptics.ts`.
- **O cartão "Sons e vibração" do Perfil fica atrás de `SHOW_DEV_TOOLS`**
  enquanto os sons só existirem no piloto. Mostrar ao aluno um interruptor de
  sons que ele nunca ouve seria texto prometendo o que não existe.
- **Acessibilidade:**
  - alvos de toque com pelo menos 44 pt;
  - rótulos que não anunciam a resposta;
  - com Reduce Motion, o estado final aparece sem animação;
  - nenhuma informação depende só de som ou só de cor.
- **Paleta:** só `galaxyColors` e `semanticColors.galaxy`, por causa do
  `identity-palette-contract`. Nenhuma chave de estilo local se chama `screen`,
  `container` ou `center`: a regra R2 do visual QA pede `layout.*` no lugar.
- **Privacidade:** as medidas ficam no aparelho, e nenhum adaptador de
  analytics é registrado (`telemetry-privacy-contract`).
- **Testes nunca ficam sob `src/app`** (`route-tree-purity-contract`).
- **Node:** testes e gate no Node 20
  (`export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"`); só a CLI
  `loop` usa o 24. Confira com `node --version` antes de citar número.
- **Gate:** `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`.
- **Toda guarda nova é vista falhando pelo defeito que nomeia.** A saída
  vermelha vai para `docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md`
  (lição 4 de 2026-09-22 no `AGENTS.md`).
- **Teste de tela:** a estreia do primeiro teste de um arquivo custa ~450 ms e
  estoura o prazo do `findBy*` com a CPU limitada. Aqueça a árvore num
  `beforeAll`; não aumente o prazo (lição de 2026-09-23 no `AGENTS.md`).
- **Copy** em português do Brasil, com frases curtas.

## Execução no Loop

Um único run cobre o plano inteiro. O controlador é dono dele: subagentes
editam, testam e commitam, mas **não executam nenhum comando `loop`**.
`PROJECT_BUSY` é o esperado. Antes de abrir, confira que `git status
--porcelain` está vazio.

```bash
cd /Users/anderson/Developer/Radiant
export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"
A=radiant-app/src; H=$A/features/curriculum-v3/hybrid-l1; L=$A/features/curriculum-v3/l1-body-reference; F=$A/ui/feedback
node scripts/loop/abrir.mjs "Piloto da lição híbrida na L1" \
  radiant-app/package.json radiant-app/package-lock.json radiant-app/app.json radiant-app/jest.config.cjs \
  $A/test/mocks/expoAudio.ts $A/constants/storageKeys.ts \
  $L/bodyMapGeometry.ts $L/bodyMapGeometry.test.ts $L/BodyReferenceMap.tsx $L/BodyReferenceMap.test.tsx \
  $H/hybridItem.types.ts $H/seededRandom.ts $H/seededRandom.test.ts $H/l1RelationTable.ts \
  $H/l1ItemTemplates.ts $H/l1ItemTemplates.test.ts $H/l1HybridLessonPlan.ts \
  $H/HybridLessonSession.ts $H/HybridLessonSession.test.ts \
  $H/l1TemplateApproval.ts $H/l1TemplateApproval.test.ts $H/__snapshots__/l1TemplateApproval.test.ts.snap \
  $H/HybridLessonScreen.tsx $H/HybridLessonScreen.flow.test.tsx \
  $H/HybridLessonMetricsRepository.ts $H/HybridLessonMetricsRepository.test.ts \
  $F/haptics.ts $F/feedbackPreferences.ts $F/feedbackPreferences.test.ts \
  $F/lessonSounds.ts $F/lessonSounds.test.ts $F/lessonFeedback.ts $F/lessonFeedback.test.ts \
  $A/features/profile/components/FeedbackPreferencesCard.tsx $A/features/profile/components/FeedbackPreferencesCard.test.tsx \
  $A/features/profile/screens/ProfileScreen.tsx $A/features/profile/screens/ProfileScreen.flow.test.tsx \
  $A/app/licao-hibrida.tsx $A/app/_layout.tsx $A/test/routes/licao-hibrida.test.tsx \
  $A/features/dev-console/screens/DevConsoleScreen.tsx \
  $A/features/dev-console/components/HybridLessonMetricsCard.tsx $A/features/dev-console/components/HybridLessonMetricsCard.test.tsx \
  docs/superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md \
  docs/FILA.md docs/archive/FILA_concluidos.md docs/STATUS.md docs/archive/STATUS_historico.md \
  docs/README.md docs/plans/2026-07-27-radiant-launch-roadmap.md
```

Nenhuma edição antes de ver `STEP_STARTED`. Se o `abrir.mjs` falhar, localize o
run órfão com `ls -t .loop/runs | head -1` e feche-o antes de tentar de novo.
O fechamento vem no fim da Tarefa 8.

## Mapa de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `l1-body-reference/bodyMapGeometry.ts` | Posições dos landmarks e transformação do canvas: onde cada ponto aparece na tela |
| `hybrid-l1/hybridItem.types.ts` | Tipos do item híbrido |
| `hybrid-l1/seededRandom.ts` | Sorteio determinístico: a mesma semente gera a mesma lição |
| `hybrid-l1/l1RelationTable.ts` | **A verdade técnica revisada pelo dono**: pares de relação, textos e dicas |
| `hybrid-l1/l1ItemTemplates.ts` | Três modelos (lateralidade, relação, verdadeiro/falso) e a variação de cenário |
| `hybrid-l1/l1HybridLessonPlan.ts` | Os 12 itens da L1 |
| `hybrid-l1/HybridLessonSession.ts` | Máquina de estados pura da lição |
| `hybrid-l1/l1TemplateApproval.ts` | Aprovação do dono por impressão digital |
| `hybrid-l1/HybridLessonScreen.tsx` | A tela |
| `hybrid-l1/HybridLessonMetricsRepository.ts` | Medidas locais das sessões |
| `ui/feedback/feedbackPreferences.ts` | Preferências "Sons" e "Vibração" |
| `ui/feedback/lessonSounds.ts` | Carrega e toca os seis sons |
| `ui/feedback/lessonFeedback.ts` | Evento da lição → som + vibração |
| `features/profile/components/FeedbackPreferencesCard.tsx` | Os dois interruptores |
| `features/dev-console/components/HybridLessonMetricsCard.tsx` | Lista das medidas no console |
| `app/licao-hibrida.tsx` | Rota de desenvolvimento |

---

### Tarefa 1: Geometria do mapa corporal como função pura

A spec exige que a descrição de cada opção bata com o que o mapa desenha. Hoje
essa geometria vive dentro de `BodyReferenceMap.tsx`: posições fixas num
viewBox de 240×330, depois o canvas gira (decúbitos) e espelha (vista de
costas). A tarefa extrai isso **sem mudar comportamento** e só depois acrescenta
as funções novas e suas guardas.

**Arquivos:**
- Criar: `radiant-app/src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.ts`
- Criar: `radiant-app/src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts`
- Modificar: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceMap.tsx`

**Interfaces:**
- Produz:
  - `type BodyPosture = 'anatomical' | 'supine' | 'prone'`
  - `type BodyPerspective = 'front' | 'back'`
  - `type ScreenRegion = 'direita' | 'esquerda' | 'cima' | 'baixo'`
  - `LANDMARK_POSITIONS`
  - `canvasRotation(posture): '0deg' | '90deg' | '-90deg'`
  - `landmarkScreenPoint(landmarkId, posture, perspective, frameWidth): { x: number; y: number }`
  - `landmarkScreenRegion(landmarkId, posture, perspective, frameWidth): ScreenRegion`
  - `isInsideFrame(point, frameWidth): boolean`
  - `FRAME_HEIGHT = 330`
- `BodyReferenceMap.tsx` continua exportando `BodyPosture` e `BodyPerspective`
  (reexportados), para não quebrar quem importa de lá.

- [ ] **Passo 1: Medir a linha de base dos testes do mapa**

Run: `cd radiant-app && npx jest src/features/curriculum-v3/l1-body-reference --runInBand`
Esperado: PASS. Anote o número de suítes e de testes; o passo 3 precisa dar o
mesmo número.

- [ ] **Passo 2: Extrair sem mudar nada**

Crie `bodyMapGeometry.ts` com o conteúdo movido de `BodyReferenceMap.tsx`, sem
alterar valores:

```ts
export type BodyPosture = 'anatomical' | 'supine' | 'prone';
export type BodyPerspective = 'front' | 'back';

/** Viewbox do SVG do mapa. As posições abaixo estão nessas coordenadas. */
export const CANVAS = { width: 240, height: 330 } as const;

/**
 * Onde cada landmark fica no viewBox, antes de girar ou espelhar. Movido sem
 * alteração de `BodyReferenceMap.tsx` em 2026-09-23.
 */
export const LANDMARK_POSITIONS: Readonly<Record<string, readonly [number, number]>> = {
  'patient-left-hand': [184, 162], 'patient-right-hand': [56, 162], 'head-marker': [120, 38], 'foot-marker': [120, 294], 'midline-marker': [120, 150], 'outer-arm-marker': [68, 150], 'shoulder-marker': [83, 116], 'wrist-marker': [53, 183], 'outer-layer': [156, 142], 'inner-layer': [135, 142], 'anterior-thorax': [105, 142], 'posterior-thorax': [140, 142],
};

export const FALLBACK_POSITION: readonly [number, number] = [120, 160];

export function canvasRotation(posture: BodyPosture): '0deg' | '90deg' | '-90deg' {
  return posture === 'anatomical' ? '0deg' : posture === 'supine' ? '90deg' : '-90deg';
}

export function geometryId(posture: BodyPosture, perspective: BodyPerspective): string {
  return `${posture === 'anatomical' ? 'upright' : posture}-${perspective}`;
}
```

Em `BodyReferenceMap.tsx`:
- apague `export type BodyPosture`, `export type BodyPerspective`, a constante `positions` e a função `geometryId`;
- acrescente:

```ts
import { FALLBACK_POSITION, LANDMARK_POSITIONS, canvasRotation, geometryId, type BodyPerspective, type BodyPosture } from './bodyMapGeometry';

export type { BodyPerspective, BodyPosture } from './bodyMapGeometry';
```

- troque `const rotation = posture === 'anatomical' ? '0deg' : posture === 'supine' ? '90deg' : '-90deg';` por `const rotation = canvasRotation(posture);`;
- troque `position: positions[entry.landmarkId] ?? [120, 160]` por `position: LANDMARK_POSITIONS[entry.landmarkId] ?? FALLBACK_POSITION`.

- [ ] **Passo 3: Confirmar que nada mudou**

Run: `cd radiant-app && npx jest src/features/curriculum-v3/l1-body-reference --runInBand`
Esperado: PASS, com o mesmo número de suítes e testes do passo 1.

- [ ] **Passo 4: Commit da extração**

```bash
git add radiant-app/src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.ts radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceMap.tsx
git commit -m "refactor(l1): extrai a geometria do mapa corporal sem mudar comportamento"
```

- [ ] **Passo 5: Escrever os testes das funções novas**

`bodyMapGeometry.test.ts`:

```ts
import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { BodyReferenceMap } from './BodyReferenceMap';
import {
  LANDMARK_POSITIONS,
  canvasRotation,
  isInsideFrame,
  landmarkScreenPoint,
  landmarkScreenRegion,
  type BodyPerspective,
  type BodyPosture,
} from './bodyMapGeometry';

const POSTURES: readonly BodyPosture[] = ['anatomical', 'supine', 'prone'];
const PERSPECTIVES: readonly BodyPerspective[] = ['front', 'back'];
const WIDTHS = [320, 390, 430];
const OPPOSITE = { direita: 'esquerda', esquerda: 'direita', cima: 'baixo', baixo: 'cima' } as const;
const COMBOS = POSTURES.flatMap((posture) => PERSPECTIVES.flatMap((perspective) => WIDTHS.map((width) => [posture, perspective, width] as const)));

describe('geometria do mapa corporal', () => {
  it('na posição anatômica vista de frente, a mão esquerda da pessoa aparece à direita de quem observa', () => {
    expect(landmarkScreenRegion('patient-left-hand', 'anatomical', 'front', 390)).toBe('direita');
    expect(landmarkScreenRegion('patient-right-hand', 'anatomical', 'front', 390)).toBe('esquerda');
  });

  it('vista por trás, a mão esquerda da pessoa aparece à esquerda de quem observa', () => {
    expect(landmarkScreenRegion('patient-left-hand', 'anatomical', 'back', 390)).toBe('esquerda');
    expect(landmarkScreenRegion('patient-right-hand', 'anatomical', 'back', 390)).toBe('direita');
  });

  it('em decúbito, a cabeça vai para uma lateral do quadro', () => {
    expect(landmarkScreenRegion('head-marker', 'supine', 'front', 390)).toBe('direita');
    expect(landmarkScreenRegion('head-marker', 'prone', 'front', 390)).toBe('esquerda');
  });

  it.each(COMBOS)('as duas mãos ficam em lados opostos (%s, %s, %i px)', (posture, perspective, width) => {
    const left = landmarkScreenRegion('patient-left-hand', posture, perspective, width);
    const right = landmarkScreenRegion('patient-right-hand', posture, perspective, width);
    expect(right).toBe(OPPOSITE[left]);
  });

  // Só as mãos: são os únicos landmarks cuja região vira texto (descrição da
  // lateralidade). Pontos perto do centro, como `inner-layer`, trocam de eixo
  // dominante em 320 px — medido ao escrever este plano — e não são descritos.
  it.each(COMBOS)('a região das mãos não depende da largura do aparelho (%s, %s, %i px)', (posture, perspective, width) => {
    for (const landmarkId of ['patient-left-hand', 'patient-right-hand']) {
      expect(landmarkScreenRegion(landmarkId, posture, perspective, width)).toBe(landmarkScreenRegion(landmarkId, posture, perspective, 390));
    }
  });

  it.each(COMBOS)('todo landmark fica dentro do quadro (%s, %s, %i px)', (posture, perspective, width) => {
    for (const landmarkId of Object.keys(LANDMARK_POSITIONS)) {
      expect({ landmarkId, inside: isInsideFrame(landmarkScreenPoint(landmarkId, posture, perspective, width), width) }).toEqual({ landmarkId, inside: true });
    }
  });

  it.each(POSTURES.flatMap((posture) => PERSPECTIVES.map((perspective) => [posture, perspective] as const)))(
    'o mapa desenhado usa a mesma rotação e o mesmo espelho da geometria (%s, %s)',
    (posture, perspective) => {
      const { getByTestId } = render(
        <BodyReferenceMap posture={posture} perspective={perspective} selectedRelation="medial-lateral" reduceMotion onPostureChange={jest.fn()} onPerspectiveChange={jest.fn()} onRegionSelect={jest.fn()} />,
      );
      const transform = (StyleSheet.flatten(getByTestId('body-map-canvas').props.style).transform ?? []) as Record<string, unknown>[];
      expect(transform).toContainEqual({ rotate: canvasRotation(posture) });
      expect(transform).toContainEqual({ scaleX: perspective === 'front' ? 1 : -1 });
    },
  );
});
```

- [ ] **Passo 6: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts --runInBand`
Esperado: FAIL, porque `landmarkScreenRegion`, `landmarkScreenPoint` e `isInsideFrame` não existem.

- [ ] **Passo 7: Implementar as funções novas**

Acrescente ao fim de `bodyMapGeometry.ts`:

```ts
/** Altura do quadro em pixels (`styles.frame.height` do mapa). */
export const FRAME_HEIGHT = 330;

export type ScreenPoint = Readonly<{ x: number; y: number }>;
export type ScreenRegion = 'direita' | 'esquerda' | 'cima' | 'baixo';

function rotationRadians(posture: BodyPosture): number {
  return posture === 'anatomical' ? 0 : posture === 'supine' ? Math.PI / 2 : -Math.PI / 2;
}

/**
 * Onde o landmark aparece no quadro, em pixels, depois das transformações do
 * canvas. O `Animated.View` recebe `[escala, scaleX, rotate]` e, como no CSS, o
 * ponto é girado primeiro e espelhado depois, sempre em torno do centro. O
 * canvas tem a largura do aparelho e a altura do quadro, então a largura entra
 * como parâmetro.
 */
export function landmarkScreenPoint(landmarkId: string, posture: BodyPosture, perspective: BodyPerspective, frameWidth: number): ScreenPoint {
  const [canvasX, canvasY] = LANDMARK_POSITIONS[landmarkId] ?? FALLBACK_POSITION;
  const x = (canvasX / CANVAS.width) * frameWidth;
  const y = (canvasY / CANVAS.height) * FRAME_HEIGHT;
  const originX = frameWidth / 2;
  const originY = FRAME_HEIGHT / 2;
  const angle = rotationRadians(posture);
  const rotatedX = originX + (x - originX) * Math.cos(angle) - (y - originY) * Math.sin(angle);
  const rotatedY = originY + (x - originX) * Math.sin(angle) + (y - originY) * Math.cos(angle);
  return { x: perspective === 'back' ? 2 * originX - rotatedX : rotatedX, y: rotatedY };
}

/** Em que lado do centro do quadro o landmark aparece, pelo eixo dominante. */
export function landmarkScreenRegion(landmarkId: string, posture: BodyPosture, perspective: BodyPerspective, frameWidth: number): ScreenRegion {
  const point = landmarkScreenPoint(landmarkId, posture, perspective, frameWidth);
  const dx = point.x - frameWidth / 2;
  const dy = point.y - FRAME_HEIGHT / 2;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'direita' : 'esquerda';
  return dy >= 0 ? 'baixo' : 'cima';
}

export function isInsideFrame(point: ScreenPoint, frameWidth: number): boolean {
  return point.x >= 0 && point.x <= frameWidth && point.y >= 0 && point.y <= FRAME_HEIGHT;
}
```

- [ ] **Passo 8: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/curriculum-v3/l1-body-reference --runInBand`
Esperado: PASS.

- [ ] **Passo 9: Ver cada guarda falhar pelo defeito que nomeia**

Faça duas mutações, uma de cada vez. Rode, copie a saída vermelha para o
arquivo de vermelhos (seção "Tarefa 1") e reverta.
1. Em `LANDMARK_POSITIONS`, troque `'head-marker': [120, 38]` por
   `[120, -40]`. Esperado: FAIL em "todo landmark fica dentro do quadro",
   citando `head-marker`.
2. Em `BodyReferenceMap.tsx`, troque `canvasRotation(posture)` por `'90deg'`.
   Esperado: FAIL em "o mapa desenhado usa a mesma rotação", nos casos
   `anatomical` e `prone`.

Crie `docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md`
com o cabeçalho `# Lição híbrida — execuções vermelhas das guardas` e uma seção
por tarefa. Cada seção traz a mutação, o comando e o trecho da saída.

- [ ] **Passo 10: Commit**

```bash
git add radiant-app/src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.ts radiant-app/src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md
git commit -m "feat(l1): geometria do mapa na tela, com guardas de lado, quadro e rotação"
```

---

### Tarefa 2: Tabela de relações e modelos de exercício

**Arquivos:**
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/hybridItem.types.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/seededRandom.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/seededRandom.test.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/l1RelationTable.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.test.ts`

**Interfaces:**
- Consome: `landmarkScreenRegion`, `LANDMARK_POSITIONS`, `isInsideFrame`,
  `landmarkScreenPoint` e os tipos da Tarefa 1; `L1AnswerOption` e
  `L1Misconception` de `l1BodyReference.types.ts`.
- Produz:
  - `HybridItem`, `HybridOption`, `HybridPhase`, `HybridFormat`, `RelationId`, `HybridItemSource`
  - `createRng(seed): Rng`, `shuffled(items, rng)`
  - `L1_RELATION_TABLE`, `LATERALITY_ENTRY`, `LANDMARK_DESCRIPTIONS`, `relationEntry(id)`
  - `lateralityItem(params, rng)`, `relationItem(params, rng)`, `trueFalseItem(base, optionIndex, id)`
  - `variantOf(item, rng)`, `nextScenario(posture, perspective)`, `scenarioIntro(posture, perspective)`
  - `describeRegion(region)`, `REFERENCE_FRAME_WIDTH = 390`

- [ ] **Passo 1: Tipos**

`hybridItem.types.ts`:

```ts
import type { BodyPerspective, BodyPosture } from '../l1-body-reference/bodyMapGeometry';
import type { L1AnswerOption, L1Misconception } from '../l1-body-reference/l1BodyReference.types';

export type HybridPhase = 'first_contact' | 'challenge';
export type HybridFormat = 'tap' | 'choice' | 'true_false';
export type RelationId = 'superior-inferior' | 'medial-lateral' | 'proximal-distal' | 'superficial-deep' | 'anterior-posterior';

export type HybridOption = Readonly<{ id: string; label: string; landmarkId: string | null; textDescription: string }>;

export type HybridItemSource =
  | Readonly<{ kind: 'laterality'; side: 'left' | 'right' }>
  | Readonly<{ kind: 'relation'; relation: RelationId; termIndex: 0 | 1 }>
  | Readonly<{ kind: 'true_false'; base: HybridItem; optionIndex: number }>;

export type HybridItem = Readonly<{
  id: string;
  source: HybridItemSource;
  /** Verdadeiro para o item que voltou depois de um erro. Nunca demonstra domínio. */
  variant: boolean;
  phase: HybridPhase;
  format: HybridFormat;
  objectiveId: string;
  misconception: L1Misconception;
  posture: BodyPosture;
  perspective: BodyPerspective;
  /** Relação que o mapa destaca (`selectedRelation` do BodyReferenceMap). */
  relation: string;
  intro: string;
  prompt: string;
  accessiblePrompt: string;
  /** O que o aluno escolhe. */
  options: readonly HybridOption[];
  /** O que o mapa numera. Igual a `options`, exceto no verdadeiro/falso. */
  landmarks: readonly L1AnswerOption[];
  correctOptionId: string;
  feedback: Readonly<{ correct: string; incorrect: string }>;
  /** Frase curta que nomeia a confusão; aparece no erro de primeiro contato. */
  hint: string;
  optionNoun: string;
  optionArticle: 'a' | 'o';
  /** Afirmação verdadeira sobre a opção certa; alimenta o verdadeiro/falso. */
  claim: string;
}>;
```

- [ ] **Passo 2: Teste do sorteio determinístico**

`seededRandom.test.ts`:

```ts
import { createRng, shuffled } from './seededRandom';

describe('sorteio determinístico', () => {
  it('a mesma semente gera a mesma sequência', () => {
    const a = createRng(7);
    const b = createRng(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('gera números em [0, 1)', () => {
    const rng = createRng(3);
    for (let i = 0; i < 200; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('embaralha sem perder nem repetir itens', () => {
    expect([...shuffled([1, 2, 3, 4], createRng(1))].sort()).toEqual([1, 2, 3, 4]);
  });

  it('sementes diferentes mudam a ordem em algum dos sorteios', () => {
    const orders = new Set(Array.from({ length: 20 }, (_, seed) => shuffled(['a', 'b'], createRng(seed)).join('')));
    expect(orders.size).toBe(2);
  });
});
```

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/seededRandom.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 3: Implementar o sorteio**

`seededRandom.ts`:

```ts
export type Rng = () => number;

/** mulberry32: a mesma semente gera a mesma lição, o que torna a revisão do dono estável. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
```

Run o mesmo comando. Esperado: PASS.

- [ ] **Passo 4: A tabela de relações**

`l1RelationTable.ts`. Os feedbacks e as descrições acessíveis são os aprovados
no parecer v4 da L1, copiados de `l1BodyReferenceContent.ts`. Os enunciados, as
afirmações e as dicas são novos e passam pela revisão do dono (Tarefa 3).

```ts
import type { L1Misconception } from '../l1-body-reference/l1BodyReference.types';
import type { RelationId } from './hybridItem.types';

export type RelationTerm = Readonly<{ id: string; landmarkId: string; question: string; claim: string }>;

export type RelationEntry = Readonly<{
  relation: RelationId;
  objectiveId: string;
  misconception: L1Misconception;
  optionLabel: 'Marcador' | 'Superfície';
  optionNoun: 'marcador' | 'superfície';
  optionArticle: 'a' | 'o';
  terms: readonly [RelationTerm, RelationTerm];
  feedback: Readonly<{ correct: string; incorrect: string }>;
  hint: string;
}>;

/**
 * A verdade técnica da L1 em forma de tabela. **O dono revisa este arquivo**
 * (spec §5.3): cada par diz qual landmark responde a qual pergunta. O gabarito
 * dos itens sai daqui, nunca do texto.
 */
export const L1_RELATION_TABLE: readonly RelationEntry[] = [
  {
    relation: 'superior-inferior', objectiveId: 'O-L1-superior-inferior', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'superior', landmarkId: 'head-marker', question: 'qual marcador está mais próximo da cabeça?', claim: 'está mais próximo da cabeça' },
      { id: 'inferior', landmarkId: 'foot-marker', question: 'qual marcador está mais próximo dos pés?', claim: 'está mais próximo dos pés' },
    ],
    feedback: { correct: 'Superior descreve proximidade da cabeça, não a parte mais alta da tela.', incorrect: 'Use a referência cabeça–pés do corpo, não a altura do quadro.' },
    hint: 'Superior é perto da cabeça, não o alto da tela.',
  },
  {
    relation: 'medial-lateral', objectiveId: 'O-L1-medial-lateral', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'medial', landmarkId: 'midline-marker', question: 'qual marcador está mais próximo da linha mediana?', claim: 'está mais próximo da linha mediana' },
      { id: 'lateral', landmarkId: 'outer-arm-marker', question: 'qual marcador está mais afastado da linha mediana?', claim: 'está mais afastado da linha mediana' },
    ],
    feedback: { correct: 'Medial é a relação com a linha mediana.', incorrect: 'Compare cada marcador com a linha mediana, não com a borda da tela.' },
    hint: 'Medial é perto da linha mediana, não da borda.',
  },
  {
    relation: 'proximal-distal', objectiveId: 'O-L1-proximal-distal', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'proximal', landmarkId: 'shoulder-marker', question: 'qual marcador está mais perto da ligação do braço com o tronco?', claim: 'está mais perto da ligação do braço com o tronco' },
      { id: 'distal', landmarkId: 'wrist-marker', question: 'qual marcador está mais longe da ligação do braço com o tronco?', claim: 'está mais longe da ligação do braço com o tronco' },
    ],
    feedback: { correct: 'Proximal se aproxima da ligação do membro.', incorrect: 'Use a ligação com o tronco como referência do membro.' },
    hint: 'Proximal é perto da ligação com o tronco.',
  },
  {
    relation: 'superficial-deep', objectiveId: 'O-L1-superficial-deep', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'superficial', landmarkId: 'outer-layer', question: 'qual marcador está na camada mais perto da superfície do corpo?', claim: 'está na camada mais perto da superfície do corpo' },
      { id: 'deep', landmarkId: 'inner-layer', question: 'qual marcador está na camada mais profunda?', claim: 'está na camada mais profunda' },
    ],
    feedback: { correct: 'Superficial está mais perto da superfície.', incorrect: 'Compare as duas camadas locais, não a altura delas no quadro.' },
    hint: 'Superficial é a camada mais externa.',
  },
  {
    relation: 'anterior-posterior', objectiveId: 'O-L1-referencia-sob-mudanca-de-postura', misconception: 'E-GRV',
    optionLabel: 'Superfície', optionNoun: 'superfície', optionArticle: 'a',
    terms: [
      { id: 'anterior', landmarkId: 'anterior-thorax', question: 'qual superfície do tórax é a anterior?', claim: 'é a anterior' },
      { id: 'posterior', landmarkId: 'posterior-thorax', question: 'qual superfície do tórax é a posterior?', claim: 'é a posterior' },
    ],
    feedback: { correct: 'Anterior continua sendo a frente do corpo; a referência anatômica não vira cima ou baixo quando a pessoa deita.', incorrect: 'Não use a gravidade como referência. Anterior e posterior permanecem definidos pelo corpo, mesmo em outra postura.' },
    hint: 'Anterior é a frente do corpo, mesmo deitado.',
  },
];

export const LATERALITY_ENTRY = {
  objectiveId: 'O-L1-lateralidade-corpo-observador',
  misconception: 'E-LAT-OBS',
  feedback: { correct: 'Você tomou o corpo examinado como referência, não o seu lado da tela.', incorrect: 'O lado direito ou esquerdo pertence ao corpo descrito. Troque a perspectiva do observador pela referência anatômica.' },
  hint: 'Você usou o seu lado, não o da pessoa.',
} as const;

/** Descrições acessíveis aprovadas no parecer v4. Não altere sem nova revisão. */
export const LANDMARK_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'head-marker': 'Marcador junto à extremidade da cabeça.',
  'foot-marker': 'Marcador junto à extremidade dos pés.',
  'midline-marker': 'Marcador junto à linha tracejada central.',
  'outer-arm-marker': 'Marcador junto ao contorno externo do braço.',
  'shoulder-marker': 'Marcador junto à ligação do braço com o tronco.',
  'wrist-marker': 'Marcador junto ao punho.',
  'outer-layer': 'Marcador no contorno sólido mais externo.',
  'inner-layer': 'Marcador na camada tracejada interna.',
  'anterior-thorax': 'Painel com contorno contínuo.',
  'posterior-thorax': 'Painel com traço pontilhado.',
};

export function relationEntry(relation: RelationId): RelationEntry {
  const entry = L1_RELATION_TABLE.find((candidate) => candidate.relation === relation);
  if (!entry) throw new Error(`UNKNOWN_RELATION:${relation}`);
  return entry;
}
```

- [ ] **Passo 5: Escrever as guardas dos modelos**

`l1ItemTemplates.test.ts`:

```ts
import { LANDMARK_POSITIONS, isInsideFrame, landmarkScreenPoint, landmarkScreenRegion, type BodyPerspective, type BodyPosture } from '../l1-body-reference/bodyMapGeometry';
import { L1_RELATION_TABLE } from './l1RelationTable';
import { REFERENCE_FRAME_WIDTH, describeRegion, lateralityItem, nextScenario, relationItem, trueFalseItem, variantOf } from './l1ItemTemplates';
import { createRng } from './seededRandom';
import type { HybridItem } from './hybridItem.types';

const POSTURES: readonly BodyPosture[] = ['anatomical', 'supine', 'prone'];
const PERSPECTIVES: readonly BodyPerspective[] = ['front', 'back'];
const SCENARIOS = POSTURES.flatMap((posture) => PERSPECTIVES.map((perspective) => [posture, perspective] as const));
const MISCONCEPTIONS = ['E-LAT-OBS', 'E-GRV', 'E-REL', 'E-POS'];

function everyItem(): HybridItem[] {
  const rng = createRng(11);
  const items: HybridItem[] = [];
  for (const [posture, perspective] of SCENARIOS) {
    for (const side of ['left', 'right'] as const) {
      items.push(lateralityItem({ id: `lat-${posture}-${perspective}-${side}`, posture, perspective, side, phase: 'challenge', format: 'tap' }, rng));
    }
    for (const entry of L1_RELATION_TABLE) {
      for (const termIndex of [0, 1] as const) {
        const base = relationItem({ id: `rel-${entry.relation}-${termIndex}-${posture}-${perspective}`, relation: entry.relation, termIndex, posture, perspective, phase: 'challenge', format: 'choice' }, rng);
        items.push(base, trueFalseItem(base, 0, `${base.id}-tf0`), trueFalseItem(base, 1, `${base.id}-tf1`));
      }
    }
  }
  return items;
}

describe('modelos de exercício da L1', () => {
  it('lateralidade: a resposta é a mão do lado pedido do corpo, em qualquer cenário', () => {
    const rng = createRng(1);
    for (const [posture, perspective] of SCENARIOS) {
      for (const side of ['left', 'right'] as const) {
        const item = lateralityItem({ id: 'x', posture, perspective, side, phase: 'challenge', format: 'tap' }, rng);
        const correct = item.options.find((option) => option.id === item.correctOptionId);
        expect(correct?.landmarkId).toBe(`patient-${side}-hand`);
      }
    }
  });

  it('lateralidade: a descrição de cada mão diz onde o mapa a desenha', () => {
    const rng = createRng(2);
    for (const [posture, perspective] of SCENARIOS) {
      const item = lateralityItem({ id: 'x', posture, perspective, side: 'left', phase: 'challenge', format: 'tap' }, rng);
      for (const option of item.options) {
        const region = landmarkScreenRegion(option.landmarkId ?? '', posture, perspective, REFERENCE_FRAME_WIDTH);
        expect(option.textDescription).toContain(describeRegion(region));
      }
    }
  });

  it('relação: a resposta é o landmark que a tabela liga ao termo pedido, e a outra opção é o par dele', () => {
    const rng = createRng(3);
    for (const entry of L1_RELATION_TABLE) {
      for (const termIndex of [0, 1] as const) {
        for (const [posture, perspective] of SCENARIOS) {
          const item = relationItem({ id: 'x', relation: entry.relation, termIndex, posture, perspective, phase: 'challenge', format: 'choice' }, rng);
          const byId = new Map(item.options.map((option) => [option.id, option.landmarkId]));
          expect(byId.get(item.correctOptionId)).toBe(entry.terms[termIndex].landmarkId);
          expect([...byId.values()].sort()).toEqual([entry.terms[0].landmarkId, entry.terms[1].landmarkId].sort());
        }
      }
    }
  });

  it('validade: todo landmark que um item numera existe e aparece dentro do quadro', () => {
    for (const item of everyItem()) {
      for (const landmark of item.landmarks) {
        expect(LANDMARK_POSITIONS[landmark.landmarkId]).toBeDefined();
        for (const width of [320, 390, 430]) {
          expect({ item: item.id, landmark: landmark.landmarkId, inside: isInsideFrame(landmarkScreenPoint(landmark.landmarkId, item.posture, item.perspective, width), width) })
            .toEqual({ item: item.id, landmark: landmark.landmarkId, inside: true });
        }
      }
    }
  });

  it('verdadeiro/falso: é verdadeiro exatamente quando a opção citada é a certa do item de origem', () => {
    const base = relationItem({ id: 'b', relation: 'medial-lateral', termIndex: 0, posture: 'supine', perspective: 'front', phase: 'challenge', format: 'choice' }, createRng(4));
    base.options.forEach((option, index) => {
      const tf = trueFalseItem(base, index, `tf${index}`);
      expect(tf.correctOptionId).toBe(option.id === base.correctOptionId ? 'verdadeiro' : 'falso');
      expect(tf.prompt).toContain(`${base.optionNoun} ${index + 1} ${base.claim}`);
      expect(tf.landmarks).toEqual(base.landmarks);
    });
  });

  it('forma: todo item tem objetivo, código de erro conhecido, opções únicas, resposta entre as opções e textos dentro do limite', () => {
    for (const item of everyItem()) {
      const ids = item.options.map((option) => option.id);
      expect(item.objectiveId).not.toBe('');
      expect(MISCONCEPTIONS).toContain(item.misconception);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain(item.correctOptionId);
      expect(item.prompt.length).toBeLessThanOrEqual(140);
      expect(item.hint.length).toBeLessThanOrEqual(80);
      expect(item.feedback.correct).not.toBe('');
      expect(item.feedback.incorrect).not.toBe('');
      expect(item.accessiblePrompt.startsWith(item.prompt)).toBe(true);
    }
  });

  it('variação: o item que volta usa outro cenário, a mesma regra e é marcado como variante', () => {
    const rng = createRng(5);
    const original = relationItem({ id: 'o', relation: 'proximal-distal', termIndex: 1, posture: 'anatomical', perspective: 'back', phase: 'challenge', format: 'choice' }, rng);
    const variant = variantOf(original, rng);
    expect([variant.posture, variant.perspective]).toEqual(nextScenario('anatomical', 'back'));
    expect([variant.posture, variant.perspective]).not.toEqual(['anatomical', 'back']);
    expect(variant.source).toEqual(original.source);
    expect(variant.variant).toBe(true);
    expect(variant.id).toBe('o-v');
  });

  it('determinismo: a mesma semente gera os mesmos itens', () => {
    const make = () => lateralityItem({ id: 'x', posture: 'prone', perspective: 'back', side: 'right', phase: 'challenge', format: 'choice' }, createRng(9));
    expect(make()).toEqual(make());
  });
});
```

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 6: Implementar os modelos**

`l1ItemTemplates.ts`:

```ts
import { landmarkScreenRegion, type BodyPerspective, type BodyPosture, type ScreenRegion } from '../l1-body-reference/bodyMapGeometry';
import type { L1AnswerOption } from '../l1-body-reference/l1BodyReference.types';
import { LANDMARK_DESCRIPTIONS, LATERALITY_ENTRY, relationEntry } from './l1RelationTable';
import { shuffled, type Rng } from './seededRandom';
import type { HybridFormat, HybridItem, HybridOption, HybridPhase, RelationId } from './hybridItem.types';

/** Largura de referência para descrever posições. A região não depende da largura (guarda da Tarefa 1). */
export const REFERENCE_FRAME_WIDTH = 390;

const POSTURE_TEXT: Readonly<Record<BodyPosture, string>> = { anatomical: 'Na posição anatômica', supine: 'Em decúbito dorsal', prone: 'Em decúbito ventral' };
const PERSPECTIVE_TEXT: Readonly<Record<BodyPerspective, string>> = { front: 'vista de frente', back: 'vista por trás' };
const ACCESSIBLE_SUFFIX = 'As opções são numeradas; as descrições indicam posições, não a resposta.';

const SCENARIOS: readonly (readonly [BodyPosture, BodyPerspective])[] = [
  ['anatomical', 'front'], ['anatomical', 'back'], ['supine', 'front'], ['supine', 'back'], ['prone', 'front'], ['prone', 'back'],
];

export const TRUE_FALSE_OPTIONS: readonly HybridOption[] = [
  { id: 'verdadeiro', label: 'Verdadeiro', landmarkId: null, textDescription: 'A afirmação está correta.' },
  { id: 'falso', label: 'Falso', landmarkId: null, textDescription: 'A afirmação está errada.' },
];

type CommonParams = Readonly<{ id: string; posture: BodyPosture; perspective: BodyPerspective; phase: HybridPhase; format: Exclude<HybridFormat, 'true_false'> }>;
export type LateralityParams = CommonParams & Readonly<{ side: 'left' | 'right' }>;
export type RelationParams = CommonParams & Readonly<{ relation: RelationId; termIndex: 0 | 1 }>;

export function scenarioIntro(posture: BodyPosture, perspective: BodyPerspective): string {
  return `${POSTURE_TEXT[posture]}, ${PERSPECTIVE_TEXT[perspective]},`;
}

export function describeRegion(region: ScreenRegion): string {
  if (region === 'direita') return 'à direita de quem observa';
  if (region === 'esquerda') return 'à esquerda de quem observa';
  return region === 'cima' ? 'na parte de cima do quadro' : 'na parte de baixo do quadro';
}

export function nextScenario(posture: BodyPosture, perspective: BodyPerspective): readonly [BodyPosture, BodyPerspective] {
  const index = SCENARIOS.findIndex(([p, v]) => p === posture && v === perspective);
  return SCENARIOS[(index + 1) % SCENARIOS.length];
}

const accessible = (prompt: string): string => `${prompt} ${ACCESSIBLE_SUFFIX}`;

export function lateralityItem(params: LateralityParams, rng: Rng): HybridItem {
  const options: L1AnswerOption[] = shuffled(['left', 'right'] as const, rng).map((side, index) => {
    const landmarkId = `patient-${side}-hand`;
    const region = landmarkScreenRegion(landmarkId, params.posture, params.perspective, REFERENCE_FRAME_WIDTH);
    return { id: `patient-${side}`, label: `Mão ${index + 1}`, landmarkId, textDescription: `Mão ${index + 1}: aparece ${describeRegion(region)}.` };
  });
  const sideWord = params.side === 'left' ? 'esquerdo' : 'direito';
  const intro = scenarioIntro(params.posture, params.perspective);
  const prompt = `${intro} qual mão pertence ao lado ${sideWord} da pessoa?`;
  return {
    id: params.id, source: { kind: 'laterality', side: params.side }, variant: false,
    phase: params.phase, format: params.format,
    objectiveId: LATERALITY_ENTRY.objectiveId, misconception: LATERALITY_ENTRY.misconception,
    posture: params.posture, perspective: params.perspective, relation: 'medial-lateral',
    intro, prompt, accessiblePrompt: accessible(prompt),
    options, landmarks: options, correctOptionId: `patient-${params.side}`,
    feedback: LATERALITY_ENTRY.feedback, hint: LATERALITY_ENTRY.hint,
    optionNoun: 'mão', optionArticle: 'a', claim: `pertence ao lado ${sideWord} da pessoa`,
  };
}

export function relationItem(params: RelationParams, rng: Rng): HybridItem {
  const entry = relationEntry(params.relation);
  const asked = entry.terms[params.termIndex];
  const options: L1AnswerOption[] = shuffled(entry.terms, rng).map((term, index) => ({
    id: term.id, label: `${entry.optionLabel} ${index + 1}`, landmarkId: term.landmarkId, textDescription: LANDMARK_DESCRIPTIONS[term.landmarkId] ?? '',
  }));
  const intro = scenarioIntro(params.posture, params.perspective);
  const prompt = `${intro} ${asked.question}`;
  return {
    id: params.id, source: { kind: 'relation', relation: params.relation, termIndex: params.termIndex }, variant: false,
    phase: params.phase, format: params.format,
    objectiveId: entry.objectiveId, misconception: entry.misconception,
    posture: params.posture, perspective: params.perspective, relation: entry.relation,
    intro, prompt, accessiblePrompt: accessible(prompt),
    options, landmarks: options, correctOptionId: asked.id,
    feedback: entry.feedback, hint: entry.hint,
    optionNoun: entry.optionNoun, optionArticle: entry.optionArticle, claim: asked.claim,
  };
}

export function trueFalseItem(base: HybridItem, optionIndex: number, id: string): HybridItem {
  const option = base.options[optionIndex];
  const prompt = `${base.intro} verdadeiro ou falso: ${base.optionArticle} ${base.optionNoun} ${optionIndex + 1} ${base.claim}.`;
  return {
    ...base,
    id,
    source: { kind: 'true_false', base, optionIndex },
    format: 'true_false',
    prompt,
    accessiblePrompt: accessible(prompt),
    options: TRUE_FALSE_OPTIONS,
    landmarks: base.landmarks,
    correctOptionId: option.id === base.correctOptionId ? 'verdadeiro' : 'falso',
  };
}

/** O item que volta depois de um erro: mesma regra, próximo cenário, nova ordem de opções. */
export function variantOf(item: HybridItem, rng: Rng): HybridItem {
  const [posture, perspective] = nextScenario(item.posture, item.perspective);
  const id = `${item.id}-v`;
  const source = item.source;
  if (source.kind === 'laterality') {
    return { ...lateralityItem({ id, posture, perspective, side: source.side, phase: 'challenge', format: item.format === 'true_false' ? 'choice' : item.format }, rng), variant: true };
  }
  if (source.kind === 'relation') {
    return { ...relationItem({ id, relation: source.relation, termIndex: source.termIndex, posture, perspective, phase: 'challenge', format: item.format === 'true_false' ? 'choice' : item.format }, rng), variant: true };
  }
  const base = variantOf(source.base, rng);
  return { ...trueFalseItem(base, source.optionIndex, id), variant: true };
}
```

Atenção: no verdadeiro/falso, `variantOf(source.base)` avança o cenário a
partir do **item de origem**, que tem o mesmo cenário do verdadeiro/falso.
O teste de variação cobre a relação; a Tarefa 3 cobre o verdadeiro/falso
dentro da sessão.

- [ ] **Passo 7: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1 --runInBand`
Esperado: PASS.

- [ ] **Passo 8: Ver as guardas falharem pelo defeito que nomeiam**

Uma mutação de cada vez; registre a saída na seção "Tarefa 2" dos vermelhos e
reverta.
1. **Gabarito pela tela, não pelo corpo** — em `lateralityItem`, troque o
   `correctOptionId` por `options.find((o) => o.textDescription.includes('à direita'))?.id ?? ''`.
   Esperado: FAIL em "lateralidade: a resposta é a mão do lado pedido do
   corpo", na vista de costas.
2. **Descrição que não bate com o desenho** — em `lateralityItem`, troque
   `describeRegion(region)` por `describeRegion('direita')`. Esperado: FAIL em
   "a descrição de cada mão diz onde o mapa a desenha".
3. **Par errado** — na tabela, troque o `landmarkId` de `lateral` para
   `'shoulder-marker'`. Esperado: FAIL em "relação: a resposta é o landmark
   que a tabela liga". Essa é a diferença válida porém errada que a lição 1
   de 2026-09-22 manda cobrir.

- [ ] **Passo 9: Commit**

```bash
git add radiant-app/src/features/curriculum-v3/hybrid-l1 docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md
git commit -m "feat(l1-hibrida): tabela de relações e três modelos com gabarito calculado"
```

---

### Tarefa 3: Plano da lição, sessão e aprovação do dono

**Arquivos:**
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/l1HybridLessonPlan.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonSession.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonSession.test.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/l1TemplateApproval.ts`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/l1TemplateApproval.test.ts`
- Gerado: `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`

**Interfaces:**
- Consome: `lateralityItem`, `relationItem`, `trueFalseItem`, `variantOf` e
  `createRng` da Tarefa 2; `XP_RULES` de `src/constants/gamification.ts`.
- Produz:
  - `L1_HYBRID_SEED`, `buildL1HybridPlan(seed?)`, `reviewSample()`
  - `createHybridLessonSession({ plan, now?, seed? })`, que devolve `{ current, position, answer, advance, isComplete, evidence, summary }`
  - os tipos `HybridEvent`, `HybridAnswerResult`, `HybridEvidence`, `HybridSummary`
  - `L1_TEMPLATE_APPROVAL`, `l1TemplateFingerprint()`, `isL1TemplateApproved()`

- [ ] **Passo 1: O plano da L1**

`l1HybridLessonPlan.ts`:

```ts
import { lateralityItem, relationItem, trueFalseItem, variantOf } from './l1ItemTemplates';
import { createRng } from './seededRandom';
import type { HybridItem } from './hybridItem.types';

export const L1_HYBRID_SEED = 20260923;

/** Os 12 itens da L1 (spec §5.1): 4 de primeiro contato e 8 de desafio. */
export function buildL1HybridPlan(seed: number = L1_HYBRID_SEED): readonly HybridItem[] {
  const rng = createRng(seed);
  return [
    lateralityItem({ id: 'h01-lat-frente', posture: 'anatomical', perspective: 'front', side: 'left', phase: 'first_contact', format: 'tap' }, rng),
    lateralityItem({ id: 'h02-lat-costas', posture: 'anatomical', perspective: 'back', side: 'left', phase: 'first_contact', format: 'tap' }, rng),
    relationItem({ id: 'h03-sup-inf', relation: 'superior-inferior', termIndex: 0, posture: 'anatomical', perspective: 'front', phase: 'first_contact', format: 'choice' }, rng),
    relationItem({ id: 'h04-med-lat', relation: 'medial-lateral', termIndex: 0, posture: 'anatomical', perspective: 'front', phase: 'first_contact', format: 'choice' }, rng),
    lateralityItem({ id: 'h05-lat-dorsal', posture: 'supine', perspective: 'front', side: 'right', phase: 'challenge', format: 'tap' }, rng),
    relationItem({ id: 'h06-prox-dist', relation: 'proximal-distal', termIndex: 0, posture: 'anatomical', perspective: 'front', phase: 'challenge', format: 'choice' }, rng),
    relationItem({ id: 'h07-sup-prof', relation: 'superficial-deep', termIndex: 1, posture: 'anatomical', perspective: 'back', phase: 'challenge', format: 'tap' }, rng),
    relationItem({ id: 'h08-ant-post', relation: 'anterior-posterior', termIndex: 0, posture: 'prone', perspective: 'front', phase: 'challenge', format: 'choice' }, rng),
    trueFalseItem(relationItem({ id: 'h09-base', relation: 'medial-lateral', termIndex: 1, posture: 'supine', perspective: 'front', phase: 'challenge', format: 'choice' }, rng), 0, 'h09-vf-med-lat'),
    lateralityItem({ id: 'h10-lat-ventral', posture: 'prone', perspective: 'back', side: 'left', phase: 'challenge', format: 'choice' }, rng),
    relationItem({ id: 'h11-sup-inf', relation: 'superior-inferior', termIndex: 1, posture: 'supine', perspective: 'front', phase: 'challenge', format: 'tap' }, rng),
    trueFalseItem(relationItem({ id: 'h12-base', relation: 'proximal-distal', termIndex: 1, posture: 'anatomical', perspective: 'back', phase: 'challenge', format: 'choice' }, rng), 1, 'h12-vf-prox-dist'),
  ];
}

/**
 * O que o dono revisa: os 12 itens mais a variante de cada desafio, que é
 * tudo o que a lição pode mostrar — 20 itens.
 */
export function reviewSample(seed: number = L1_HYBRID_SEED): readonly HybridItem[] {
  const plan = buildL1HybridPlan(seed);
  const rng = createRng(seed + 1);
  return [...plan, ...plan.filter((item) => item.phase === 'challenge').map((item) => variantOf(item, rng))];
}
```

- [ ] **Passo 2: Testes da sessão**

`HybridLessonSession.test.ts`:

```ts
import { buildL1HybridPlan } from './l1HybridLessonPlan';
import { createHybridLessonSession } from './HybridLessonSession';
import type { HybridItem } from './hybridItem.types';

const plan = buildL1HybridPlan();
const wrongOf = (item: HybridItem) => item.options.find((option) => option.id !== item.correctOptionId)!.id;

function clock() {
  let t = 1_000;
  return { now: () => t, tick: (ms: number) => { t += ms; } };
}

function answerAll(session: ReturnType<typeof createHybridLessonSession>, choose: (item: HybridItem) => string) {
  let guard = 0;
  while (!session.isComplete() && guard < 50) {
    const item = session.current()!;
    session.answer(choose(item));
    session.advance();
    guard += 1;
  }
}

describe('plano da L1 híbrida', () => {
  it('tem 4 itens de primeiro contato seguidos de 8 de desafio, nos três formatos', () => {
    expect(plan.map((item) => item.phase)).toEqual([...Array(4).fill('first_contact'), ...Array(8).fill('challenge')]);
    expect(new Set(plan.map((item) => item.format))).toEqual(new Set(['tap', 'choice', 'true_false']));
  });

  it('é determinístico', () => {
    expect(buildL1HybridPlan()).toEqual(buildL1HybridPlan());
  });
});

describe('sessão da lição híbrida', () => {
  it('erro de primeiro contato não custa vida, mostra a dica e repete o mesmo item', () => {
    const session = createHybridLessonSession({ plan });
    const first = session.current()!;
    const result = session.answer(wrongOf(first));
    expect(result).toMatchObject({ correct: false, costsHeart: false, retrySameItem: true, hint: first.hint, requeuedItemId: null });
    session.advance();
    expect(session.current()!.id).toBe(first.id);
  });

  it('erro de desafio custa vida e o item volta no fim em outro cenário', () => {
    const session = createHybridLessonSession({ plan });
    for (let i = 0; i < 4; i += 1) { session.answer(session.current()!.correctOptionId); session.advance(); }
    const challenge = session.current()!;
    const result = session.answer(wrongOf(challenge));
    expect(result).toMatchObject({ correct: false, costsHeart: true, retrySameItem: false, requeuedItemId: `${challenge.id}-v` });
    expect(result.events).toContain('heart_lost');
    expect(session.position().total).toBe(13);
  });

  it('a variante errada custa vida mas não volta de novo', () => {
    const session = createHybridLessonSession({ plan });
    answerAll(session, (item) => (item.id === 'h06-prox-dist' || item.id === 'h06-prox-dist-v' ? wrongOf(item) : item.correctOptionId));
    expect(session.position().total).toBe(13);
    expect(session.summary().heartsSpent).toBe(2);
  });

  it('só a primeira tentativa de um desafio original é evidência independente', () => {
    const session = createHybridLessonSession({ plan });
    answerAll(session, (item) => (item.id === 'h01-lat-frente' || item.id === 'h07-sup-prof' ? wrongOf(item) : item.correctOptionId));
    const kinds = new Map(session.evidence().map((entry) => [entry.itemId, entry.evidenceKind]));
    for (const item of plan) {
      expect(kinds.get(item.id)).toBe(item.phase === 'challenge' ? 'initial_independent' : 'assisted_practice');
    }
    expect(kinds.get('h07-sup-prof-v')).toBe('assisted_practice');
    expect(session.evidence().filter((entry) => entry.itemId === 'h01-lat-frente')).toHaveLength(1);
  });

  it('a sequência de acertos avisa aos 3 e aos 5, uma vez cada', () => {
    const session = createHybridLessonSession({ plan });
    const events: string[] = [];
    answerAll(session, (item) => item.correctOptionId);
    const replay = createHybridLessonSession({ plan });
    while (!replay.isComplete()) { events.push(...replay.answer(replay.current()!.correctOptionId).events); replay.advance(); }
    expect(events.filter((event) => event === 'streak3')).toHaveLength(1);
    expect(events.filter((event) => event === 'streak5')).toHaveLength(1);
    expect(session.summary().bestStreak).toBe(12);
  });

  it('resumo: acerto total dá 100% e 18 XP; seis de oito dão 75% e 10 XP', () => {
    const perfect = createHybridLessonSession({ plan });
    answerAll(perfect, (item) => item.correctOptionId);
    expect(perfect.summary()).toMatchObject({ accuracy: 1, xp: 18, requeued: 0, heartsSpent: 0 });

    const partial = createHybridLessonSession({ plan });
    answerAll(partial, (item) => (item.id === 'h05-lat-dorsal' || item.id === 'h08-ant-post' ? wrongOf(item) : item.correctOptionId));
    expect(partial.summary()).toMatchObject({ accuracy: 0.75, xp: 10, requeued: 2, heartsSpent: 2 });
    expect(partial.summary().misconceptions).toEqual({ 'E-LAT-OBS': 1, 'E-GRV': 1 });
  });

  it('mede o tempo de cada item e da lição pelo relógio injetado', () => {
    const { now, tick } = clock();
    const session = createHybridLessonSession({ plan, now });
    tick(2_000);
    session.answer(session.current()!.correctOptionId);
    session.advance();
    tick(3_000);
    answerAll(session, (item) => item.correctOptionId);
    expect(session.summary().itemTimesMs['h01-lat-frente']).toBe(2_000);
    expect(session.summary().durationMs).toBe(5_000);
  });
});
```

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/HybridLessonSession.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 3: Implementar a sessão**

`HybridLessonSession.ts`:

```ts
import { XP_RULES } from '../../../constants/gamification';
import type { L1EvidenceKind, L1Misconception } from '../l1-body-reference/l1BodyReference.types';
import { variantOf } from './l1ItemTemplates';
import { createRng } from './seededRandom';
import type { HybridItem } from './hybridItem.types';

export type HybridEvent = 'correct' | 'incorrect' | 'streak3' | 'streak5' | 'heart_lost';

export type HybridAnswerResult = Readonly<{
  correct: boolean;
  costsHeart: boolean;
  feedback: string;
  hint: string | null;
  retrySameItem: boolean;
  requeuedItemId: string | null;
  events: readonly HybridEvent[];
  streak: number;
}>;

export type HybridEvidence = Readonly<{
  itemId: string;
  objectiveId: string;
  evidenceKind: L1EvidenceKind;
  outcome: 'correct' | 'incorrect';
  misconception?: L1Misconception;
}>;

export type HybridSummary = Readonly<{
  xp: number;
  accuracy: number;
  durationMs: number;
  bestStreak: number;
  requeued: number;
  heartsSpent: number;
  misconceptions: Readonly<Record<string, number>>;
  itemTimesMs: Readonly<Record<string, number>>;
}>;

export type HybridLessonSession = Readonly<{
  current(): HybridItem | null;
  position(): Readonly<{ index: number; total: number }>;
  answer(optionId: string): HybridAnswerResult;
  advance(): Readonly<{ complete: boolean }>;
  isComplete(): boolean;
  evidence(): readonly HybridEvidence[];
  summary(): HybridSummary;
}>;

export function createHybridLessonSession(options: Readonly<{ plan: readonly HybridItem[]; now?: () => number; seed?: number }>): HybridLessonSession {
  const now = options.now ?? Date.now;
  const rng = createRng(options.seed ?? 1);
  const queue: HybridItem[] = [...options.plan];
  const originalChallenges = options.plan.filter((item) => item.phase === 'challenge');
  const firstAttemptCorrect = new Map<string, boolean>();
  const answered = new Set<string>();
  const requeued = new Set<string>();
  const evidence: HybridEvidence[] = [];
  const misconceptions: Record<string, number> = {};
  const itemTimesMs: Record<string, number> = {};
  const startedAt = now();
  let shownAt = startedAt;
  let finishedAt: number | null = null;
  let index = 0;
  let streak = 0;
  let bestStreak = 0;
  let heartsSpent = 0;
  let retryPending = false;

  const current = (): HybridItem | null => (index < queue.length ? queue[index] : null);

  return {
    current,
    position: () => ({ index: Math.min(index, queue.length - 1), total: queue.length }),
    isComplete: () => index >= queue.length,
    answer(optionId) {
      const item = current();
      if (!item) throw new Error('HYBRID_SESSION_COMPLETE');
      const correct = optionId === item.correctOptionId;
      if (!answered.has(item.id)) {
        answered.add(item.id);
        itemTimesMs[item.id] = now() - shownAt;
        const independent = item.phase === 'challenge' && !item.variant;
        const evidenceKind: L1EvidenceKind = independent ? 'initial_independent' : 'assisted_practice';
        evidence.push({ itemId: item.id, objectiveId: item.objectiveId, evidenceKind, outcome: correct ? 'correct' : 'incorrect', ...(correct ? {} : { misconception: item.misconception }) });
        if (independent) firstAttemptCorrect.set(item.id, correct);
      }
      if (!correct) misconceptions[item.misconception] = (misconceptions[item.misconception] ?? 0) + 1;
      streak = correct ? streak + 1 : 0;
      bestStreak = Math.max(bestStreak, streak);
      const events: HybridEvent[] = [correct ? 'correct' : 'incorrect'];
      if (correct && streak === 3) events.push('streak3');
      if (correct && streak === 5) events.push('streak5');
      const costsHeart = !correct && item.phase === 'challenge';
      let requeuedItemId: string | null = null;
      if (costsHeart) {
        heartsSpent += 1;
        events.push('heart_lost');
        if (!item.variant && !requeued.has(item.id)) {
          const variant = variantOf(item, rng);
          queue.push(variant);
          requeued.add(item.id);
          requeuedItemId = variant.id;
        }
      }
      retryPending = !correct && item.phase === 'first_contact';
      return {
        correct,
        costsHeart,
        feedback: correct ? item.feedback.correct : item.feedback.incorrect,
        hint: retryPending ? item.hint : null,
        retrySameItem: retryPending,
        requeuedItemId,
        events,
        streak,
      };
    },
    advance() {
      if (!retryPending) index += 1;
      retryPending = false;
      shownAt = now();
      const complete = index >= queue.length;
      if (complete && finishedAt === null) finishedAt = now();
      return { complete };
    },
    evidence: () => [...evidence],
    summary() {
      const correctCount = originalChallenges.filter((item) => firstAttemptCorrect.get(item.id) === true).length;
      const accuracy = originalChallenges.length === 0 ? 0 : correctCount / originalChallenges.length;
      const bonus = accuracy >= 0.9 ? XP_RULES.BONUS_XP_90PCT : accuracy >= 0.8 ? XP_RULES.BONUS_XP_80PCT : 0;
      return {
        xp: XP_RULES.BASE_XP_PER_QUIZ + bonus,
        accuracy,
        durationMs: (finishedAt ?? now()) - startedAt,
        bestStreak,
        requeued: requeued.size,
        heartsSpent,
        misconceptions: { ...misconceptions },
        itemTimesMs: { ...itemTimesMs },
      };
    },
  };
}
```

Run o comando do passo 2. Esperado: PASS.

- [ ] **Passo 4: Ver a guarda de evidência falhar**

Mutação: troque `const independent = item.phase === 'challenge' && !item.variant;`
por `const independent = item.phase === 'challenge';`. Esperado: FAIL em "só a
primeira tentativa de um desafio original é evidência independente", em
`h07-sup-prof-v`. Registre na seção "Tarefa 3" dos vermelhos e reverta.

- [ ] **Passo 5: Aprovação e amostra de revisão — testes**

`l1TemplateApproval.test.ts`:

```ts
import { reviewSample } from './l1HybridLessonPlan';
import { L1_TEMPLATE_APPROVAL, isL1TemplateApproved, l1TemplateFingerprint } from './l1TemplateApproval';
import type { HybridItem } from './hybridItem.types';

function describeForReview(item: HybridItem): string {
  return [
    `${item.id} · ${item.phase === 'first_contact' ? 'primeiro contato' : 'desafio'} · ${item.format} · ${item.posture}/${item.perspective}${item.variant ? ' · variante' : ''}`,
    `Pergunta: ${item.prompt}`,
    ...item.options.map((option) => `  ${option.id === item.correctOptionId ? '✓' : ' '} ${option.label}: ${option.textDescription}`),
    `Se acertar: ${item.feedback.correct}`,
    `Se errar: ${item.feedback.incorrect}`,
    `Dica de primeiro contato: ${item.hint}`,
  ].join('\n');
}

describe('aprovação dos modelos da L1', () => {
  it('amostra de revisão do dono — o que a lição pode mostrar, com o gabarito marcado', () => {
    expect(reviewSample().map(describeForReview).join('\n\n')).toMatchSnapshot();
  });

  it('a impressão digital é estável', () => {
    expect(l1TemplateFingerprint()).toBe(l1TemplateFingerprint());
    expect(l1TemplateFingerprint()).toMatch(/^[0-9a-f]{8}$/);
  });

  it('a aprovação cai quando o conteúdo muda depois da revisão', () => {
    if (L1_TEMPLATE_APPROVAL === null) {
      expect(isL1TemplateApproved()).toBe(false);
    } else {
      expect(l1TemplateFingerprint()).toBe(L1_TEMPLATE_APPROVAL.fingerprint);
    }
  });
});
```

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/l1TemplateApproval.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 6: Implementar a aprovação**

`l1TemplateApproval.ts`:

```ts
import { reviewSample } from './l1HybridLessonPlan';

export type TemplateApproval = Readonly<{ fingerprint: string; approvedOn: string; approvedBy: string }>;

/**
 * Preenchido quando o dono aprovar a amostra em
 * `__snapshots__/l1TemplateApproval.test.ts.snap`. `null` = aguardando revisão.
 * Se o conteúdo mudar depois, o teste reprova e a tela volta a mostrar "prévia".
 */
export const L1_TEMPLATE_APPROVAL: TemplateApproval | null = null;

/** FNV-1a de 32 bits: detecta mudança, não protege contra adulteração. */
export function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export function l1TemplateFingerprint(): string {
  return fnv1a(JSON.stringify(reviewSample()));
}

export function isL1TemplateApproved(): boolean {
  return L1_TEMPLATE_APPROVAL !== null && L1_TEMPLATE_APPROVAL.fingerprint === l1TemplateFingerprint();
}
```

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1 --runInBand`
Esperado: PASS, e o snapshot é escrito. **Abra
`__snapshots__/l1TemplateApproval.test.ts.snap` e leia os 20 itens:** cada
`✓` precisa estar na resposta anatomicamente certa. Um `✓` errado é defeito da
tabela ou dos modelos. Corrija antes de commitar.

- [ ] **Passo 7: Commit**

```bash
git add radiant-app/src/features/curriculum-v3/hybrid-l1 docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md
git commit -m "feat(l1-hibrida): plano de 12 itens, sessão com reinserção e aprovação por impressão digital"
```

---

### Tarefa 4: Camada de som e vibração

**Arquivos:**
- Modificar: `radiant-app/package.json`, `radiant-app/package-lock.json` (instala `expo-audio`)
- Modificar: `radiant-app/jest.config.cjs`
- Criar: `radiant-app/src/test/mocks/expoAudio.ts`
- Modificar: `radiant-app/src/constants/storageKeys.ts`
- Modificar: `radiant-app/src/ui/feedback/haptics.ts`
- Criar: `radiant-app/src/ui/feedback/feedbackPreferences.ts` (+ `.test.ts`)
- Criar: `radiant-app/src/ui/feedback/lessonSounds.ts` (+ `.test.ts`)
- Criar: `radiant-app/src/ui/feedback/lessonFeedback.ts` (+ `.test.ts`)

**Interfaces:**
- Produz:
  - `FeedbackPreferences = { sounds: boolean; haptics: boolean }`, `DEFAULT_FEEDBACK_PREFERENCES`
  - `readFeedbackPreferences(storage?)`, `writeFeedbackPreferences(next, storage?)`
  - `LessonSoundId`, `createLessonSoundPlayer(): LessonSoundPlayer` (`play(id)`, `release()`)
  - `LessonFeedbackEvent = 'option_tap' | 'correct' | 'incorrect' | 'streak' | 'heart_lost' | 'lesson_complete'`
  - `createLessonFeedback(sounds, preferences): LessonFeedback` (`emit(event)`)
  - `hapticSelection()`, `hapticStreak()`
  - `STORAGE_KEYS.FEEDBACK_PREFERENCES`

- [ ] **Passo 1: Instalar o `expo-audio` e conferir a API instalada**

Run: `cd radiant-app && npx expo install expo-audio`
Esperado: `package.json` passa a ter `"expo-audio": "~1.1.1"`, a versão do
`bundledNativeModules.json` do Expo 54.

Confira em `node_modules/expo-audio/build/` que `createAudioPlayer(source)`
devolve um objeto com `play()`, `seekTo(seconds): Promise<void>` e `remove()`,
e que `setAudioModeAsync` aceita `{ playsInSilentMode: boolean }`. Se algum nome
divergir, use o nome instalado no código e no mock, e anote a diferença no
relatório. Rode `git diff --stat radiant-app/app.json`: o esperado é **nenhuma
mudança**. Se o instalador acrescentar um plugin, reverta o `app.json`, porque
tocar áudio não precisa de permissão.

**Observação para o dono:** o `expo-audio` é módulo nativo. O cliente de
desenvolvimento precisa ser recompilado (`npx expo run:ios`) para os sons
tocarem no simulador. Isso é compilação local, não build de teste, e só acontece
quando o dono quiser ver.

- [ ] **Passo 2: Mock do `expo-audio` para o Jest**

`src/test/mocks/expoAudio.ts`:

```ts
/**
 * O Jest não tem o módulo nativo do expo-audio. Este mock substitui o pacote
 * inteiro (moduleNameMapper em jest.config.cjs) e expõe os players criados
 * para os testes inspecionarem.
 */
export type MockAudioPlayer = { source: unknown; play: jest.Mock; seekTo: jest.Mock; remove: jest.Mock };

export const mockAudioPlayers: MockAudioPlayer[] = [];

export const createAudioPlayer = jest.fn((source: unknown): MockAudioPlayer => {
  const player: MockAudioPlayer = { source, play: jest.fn(), seekTo: jest.fn(() => Promise.resolve()), remove: jest.fn() };
  mockAudioPlayers.push(player);
  return player;
});

export const setAudioModeAsync = jest.fn(() => Promise.resolve());
```

Em `jest.config.cjs`, dentro de `moduleNameMapper`, acrescente:

```js
    '^expo-audio$': '<rootDir>/src/test/mocks/expoAudio.ts',
```

- [ ] **Passo 3: Chave de armazenamento**

Em `src/constants/storageKeys.ts`, dentro de `STORAGE_KEYS`, acrescente:

```ts
    FEEDBACK_PREFERENCES: '@radiant:feedback_preferences_v1',
    HYBRID_LESSON_METRICS: '@radiant:v3:hybrid_lesson_metrics_v1',
```

A segunda chave é usada na Tarefa 7. Nenhuma das duas entra em
`PEDAGOGICAL_STORAGE_KEYS`: são preferência e medida local, não progresso.

- [ ] **Passo 4: Testes das preferências**

`feedbackPreferences.test.ts`:

```ts
import { DEFAULT_FEEDBACK_PREFERENCES, readFeedbackPreferences, writeFeedbackPreferences } from './feedbackPreferences';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: jest.fn(async (key: string) => data[key] ?? null),
    setItem: jest.fn(async (key: string, value: string) => { data[key] = value; }),
  };
}

describe('preferências de som e vibração', () => {
  it('começam ligadas', async () => {
    expect(await readFeedbackPreferences(memoryStorage())).toEqual(DEFAULT_FEEDBACK_PREFERENCES);
    expect(DEFAULT_FEEDBACK_PREFERENCES).toEqual({ sounds: true, haptics: true });
  });

  it('guardam e devolvem a escolha', async () => {
    const storage = memoryStorage();
    await writeFeedbackPreferences({ sounds: false, haptics: true }, storage);
    expect(await readFeedbackPreferences(storage)).toEqual({ sounds: false, haptics: true });
  });

  it('valor corrompido volta ao padrão em vez de desligar tudo', async () => {
    expect(await readFeedbackPreferences(memoryStorage({ '@radiant:feedback_preferences_v1': '{quebrado' }))).toEqual(DEFAULT_FEEDBACK_PREFERENCES);
  });
});
```

Run: `cd radiant-app && npx jest src/ui/feedback/feedbackPreferences.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 5: Implementar as preferências**

`feedbackPreferences.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export type FeedbackPreferences = Readonly<{ sounds: boolean; haptics: boolean }>;

export const DEFAULT_FEEDBACK_PREFERENCES: FeedbackPreferences = { sounds: true, haptics: true };

type PreferencesStorage = Readonly<{
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}>;

export async function readFeedbackPreferences(storage: PreferencesStorage = AsyncStorage): Promise<FeedbackPreferences> {
  try {
    const raw = await storage.getItem(STORAGE_KEYS.FEEDBACK_PREFERENCES);
    if (!raw) return DEFAULT_FEEDBACK_PREFERENCES;
    const value = JSON.parse(raw) as Partial<FeedbackPreferences> | null;
    return { sounds: value?.sounds !== false, haptics: value?.haptics !== false };
  } catch {
    return DEFAULT_FEEDBACK_PREFERENCES;
  }
}

export async function writeFeedbackPreferences(next: FeedbackPreferences, storage: PreferencesStorage = AsyncStorage): Promise<void> {
  await storage.setItem(STORAGE_KEYS.FEEDBACK_PREFERENCES, JSON.stringify(next));
}
```

Run o comando do passo 4. Esperado: PASS.

- [ ] **Passo 6: Testes do tocador de sons**

`lessonSounds.test.ts`:

```ts
import { createAudioPlayer, mockAudioPlayers, setAudioModeAsync } from '../../test/mocks/expoAudio';
import { LESSON_SOUND_IDS, createLessonSoundPlayer } from './lessonSounds';

beforeEach(() => {
  mockAudioPlayers.length = 0;
  jest.clearAllMocks();
});

describe('tocador de sons da lição', () => {
  it('pré-carrega os seis sons ao abrir e respeita o silencioso', () => {
    createLessonSoundPlayer();
    expect(LESSON_SOUND_IDS).toEqual(['toque', 'acerto', 'erro', 'vida', 'sequencia', 'fim']);
    expect(createAudioPlayer).toHaveBeenCalledTimes(6);
    expect(setAudioModeAsync).toHaveBeenCalledWith({ playsInSilentMode: false });
  });

  it('toca do começo o som pedido, e só ele', async () => {
    const sounds = createLessonSoundPlayer();
    sounds.play('acerto');
    await Promise.resolve();
    const acerto = mockAudioPlayers[LESSON_SOUND_IDS.indexOf('acerto')];
    expect(acerto.seekTo).toHaveBeenCalledWith(0);
    expect(acerto.play).toHaveBeenCalledTimes(1);
    expect(mockAudioPlayers.filter((player) => player !== acerto).every((player) => player.play.mock.calls.length === 0)).toBe(true);
  });

  it('libera os players ao sair', () => {
    const sounds = createLessonSoundPlayer();
    sounds.release();
    expect(mockAudioPlayers.every((player) => player.remove.mock.calls.length === 1)).toBe(true);
  });

  it('falha ao carregar não derruba a lição', () => {
    createAudioPlayer.mockImplementationOnce(() => { throw new Error('sem áudio'); });
    const sounds = createLessonSoundPlayer();
    expect(() => sounds.play('toque')).not.toThrow();
  });
});
```

Run: `cd radiant-app && npx jest src/ui/feedback/lessonSounds.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 7: Implementar o tocador**

`lessonSounds.ts`:

```ts
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type LessonSoundId = 'toque' | 'acerto' | 'erro' | 'vida' | 'sequencia' | 'fim';

export const LESSON_SOUND_IDS: readonly LessonSoundId[] = ['toque', 'acerto', 'erro', 'vida', 'sequencia', 'fim'];

/** Os seis sons escolhidos pelo dono; origem e licença em assets/sounds/README.md. */
const SOURCES: Readonly<Record<LessonSoundId, number>> = {
  toque: require('../../../assets/sounds/toque.m4a'),
  acerto: require('../../../assets/sounds/acerto.m4a'),
  erro: require('../../../assets/sounds/erro.m4a'),
  vida: require('../../../assets/sounds/vida.m4a'),
  sequencia: require('../../../assets/sounds/sequencia.m4a'),
  fim: require('../../../assets/sounds/fim.m4a'),
};

type Player = Readonly<{ play(): void; seekTo(seconds: number): Promise<void>; remove(): void }>;

export type LessonSoundPlayer = Readonly<{ play(id: LessonSoundId): void; release(): void }>;

/**
 * Carrega os seis sons na abertura da lição (spec §5.2), para que tocar
 * depois não espere carregamento. Som é enfeite: nenhuma falha aqui pode
 * interromper a lição.
 */
export function createLessonSoundPlayer(): LessonSoundPlayer {
  // `playsInSilentMode: false` deixa a chave de silencioso do iPhone valer.
  void setAudioModeAsync({ playsInSilentMode: false }).catch(() => undefined);
  const players = new Map<LessonSoundId, Player>();
  for (const id of LESSON_SOUND_IDS) {
    try {
      players.set(id, createAudioPlayer(SOURCES[id]) as unknown as Player);
    } catch {
      // Sem este som; os outros continuam.
    }
  }
  return {
    play(id) {
      const player = players.get(id);
      if (!player) return;
      void player.seekTo(0).then(() => player.play()).catch(() => undefined);
    },
    release() {
      for (const player of players.values()) {
        try { player.remove(); } catch { /* já liberado */ }
      }
      players.clear();
    },
  };
}
```

Run o comando do passo 6. Esperado: PASS.

- [ ] **Passo 8: Vibrações novas**

No fim de `src/ui/feedback/haptics.ts`, acrescente:

```ts
/** Toque numa opção da lição: o mais leve do vocabulário. */
export function hapticSelection(): void {
  run(() => Haptics.selectionAsync());
}

/** Sequência de acertos: dois toques leves, "tá-tá". */
export function hapticStreak(): void {
  run(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 90));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  });
}
```

As funções existentes mantêm o sentido que o comentário do arquivo documenta:
o acerto usa `hapticSuccess` e a perda de vida usa `hapticLifeLost`, o `Heavy`.
A tabela da spec é intenção, e este vocabulário já tem decisões registradas.

- [ ] **Passo 9: Testes do mapeamento evento → som + vibração**

`lessonFeedback.test.ts`:

```ts
import * as haptics from './haptics';
import { createLessonFeedback, type LessonFeedbackEvent } from './lessonFeedback';

jest.mock('./haptics', () => ({
  hapticSelection: jest.fn(), hapticSuccess: jest.fn(), hapticError: jest.fn(),
  hapticStreak: jest.fn(), hapticLifeLost: jest.fn(), hapticCelebrate: jest.fn(),
}));

const EXPECTED: ReadonlyArray<readonly [LessonFeedbackEvent, string, keyof typeof haptics]> = [
  ['option_tap', 'toque', 'hapticSelection'],
  ['correct', 'acerto', 'hapticSuccess'],
  ['incorrect', 'erro', 'hapticError'],
  ['streak', 'sequencia', 'hapticStreak'],
  ['heart_lost', 'vida', 'hapticLifeLost'],
  ['lesson_complete', 'fim', 'hapticCelebrate'],
];

beforeEach(() => jest.clearAllMocks());

describe('feedback da lição', () => {
  it.each(EXPECTED)('%s toca %s e vibra com %s', (event, sound, haptic) => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: true, haptics: true }).emit(event);
    expect(sounds.play).toHaveBeenCalledWith(sound);
    expect(haptics[haptic]).toHaveBeenCalledTimes(1);
  });

  it('com sons desligados, só vibra', () => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: false, haptics: true }).emit('correct');
    expect(sounds.play).not.toHaveBeenCalled();
    expect(haptics.hapticSuccess).toHaveBeenCalledTimes(1);
  });

  it('com vibração desligada, só toca', () => {
    const sounds = { play: jest.fn(), release: jest.fn() };
    createLessonFeedback(sounds, { sounds: true, haptics: false }).emit('correct');
    expect(sounds.play).toHaveBeenCalledWith('acerto');
    expect(haptics.hapticSuccess).not.toHaveBeenCalled();
  });
});
```

Run: `cd radiant-app && npx jest src/ui/feedback/lessonFeedback.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 10: Implementar o mapeamento**

`lessonFeedback.ts`:

```ts
import type { FeedbackPreferences } from './feedbackPreferences';
import { hapticCelebrate, hapticError, hapticLifeLost, hapticSelection, hapticStreak, hapticSuccess } from './haptics';
import type { LessonSoundId, LessonSoundPlayer } from './lessonSounds';

export type LessonFeedbackEvent = 'option_tap' | 'correct' | 'incorrect' | 'streak' | 'heart_lost' | 'lesson_complete';

export type LessonFeedback = Readonly<{ emit(event: LessonFeedbackEvent): void }>;

const SOUND: Readonly<Record<LessonFeedbackEvent, LessonSoundId>> = {
  option_tap: 'toque', correct: 'acerto', incorrect: 'erro', streak: 'sequencia', heart_lost: 'vida', lesson_complete: 'fim',
};

const HAPTIC: Readonly<Record<LessonFeedbackEvent, () => void>> = {
  option_tap: hapticSelection, correct: hapticSuccess, incorrect: hapticError, streak: hapticStreak, heart_lost: hapticLifeLost, lesson_complete: hapticCelebrate,
};

/** A lição fala em eventos; esta camada decide o que toca e o que vibra (spec §5.2). */
export function createLessonFeedback(sounds: Pick<LessonSoundPlayer, 'play'>, preferences: FeedbackPreferences): LessonFeedback {
  return {
    emit(event) {
      if (preferences.sounds) sounds.play(SOUND[event]);
      if (preferences.haptics) HAPTIC[event]();
    },
  };
}
```

Run o comando do passo 9. Esperado: PASS.

- [ ] **Passo 11: Ver a guarda das preferências falhar**

Mutação: em `createLessonFeedback`, apague o `if (preferences.sounds)`.
Esperado: FAIL em "com sons desligados, só vibra". Registre na seção
"Tarefa 4" dos vermelhos e reverta.

- [ ] **Passo 12: Rodar typecheck e commitar**

Run: `cd radiant-app && npx tsc --noEmit`
Esperado: sem erros.

```bash
git add radiant-app/package.json radiant-app/package-lock.json radiant-app/jest.config.cjs radiant-app/src/test/mocks/expoAudio.ts radiant-app/src/constants/storageKeys.ts radiant-app/src/ui/feedback docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md
git commit -m "feat(feedback): camada de som e vibração da lição, com preferências"
```

---

### Tarefa 5: Cartão "Sons e vibração" no Perfil

**Arquivos:**
- Criar: `radiant-app/src/features/profile/components/FeedbackPreferencesCard.tsx`
- Criar: `radiant-app/src/features/profile/components/FeedbackPreferencesCard.test.tsx`
- Modificar: `radiant-app/src/features/profile/screens/ProfileScreen.tsx`
- Modificar: `radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx`

**Interfaces:**
- Consome: `FeedbackPreferences`, `DEFAULT_FEEDBACK_PREFERENCES`,
  `readFeedbackPreferences` e `writeFeedbackPreferences` da Tarefa 4.
- Produz: `FeedbackPreferencesCard({ preferences, onChange })`.

- [ ] **Passo 1: Teste do cartão**

`FeedbackPreferencesCard.test.tsx`:

```tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FeedbackPreferencesCard } from './FeedbackPreferencesCard';

describe('cartão de sons e vibração', () => {
  it('mostra os dois interruptores ligados por padrão enquanto carrega', () => {
    render(<FeedbackPreferencesCard preferences={null} onChange={jest.fn()} />);
    expect(screen.getByLabelText('Sons').props.value).toBe(true);
    expect(screen.getByLabelText('Vibração').props.value).toBe(true);
  });

  it('desligar sons mantém a vibração como estava', () => {
    const onChange = jest.fn();
    render(<FeedbackPreferencesCard preferences={{ sounds: true, haptics: false }} onChange={onChange} />);
    fireEvent(screen.getByLabelText('Sons'), 'valueChange', false);
    expect(onChange).toHaveBeenCalledWith({ sounds: false, haptics: false });
  });
});
```

Run: `cd radiant-app && npx jest src/features/profile/components/FeedbackPreferencesCard.test.tsx --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 2: Implementar o cartão**

`FeedbackPreferencesCard.tsx`, com os mesmos estilos de `ICloudBackupCard`:

```tsx
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { DEFAULT_FEEDBACK_PREFERENCES, type FeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type Props = Readonly<{ preferences: FeedbackPreferences | null; onChange: (next: FeedbackPreferences) => void }>;

function Row({ label, hint, value, onValueChange }: Readonly<{ label: string; hint: string; value: boolean; onValueChange: (value: boolean) => void }>) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.detail}>{hint}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityHint={hint}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }}
      />
    </View>
  );
}

export function FeedbackPreferencesCard({ preferences, onChange }: Props) {
  const value = preferences ?? DEFAULT_FEEDBACK_PREFERENCES;
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>LIÇÃO</Text>
      <Text style={styles.headline} accessibilityRole="header">Sons e vibração</Text>
      <Row label="Sons" hint="Acerto, erro e fim de lição. O modo silencioso do iPhone também desliga." value={value.sounds} onValueChange={(sounds) => onChange({ ...value, sounds })} />
      <Row label="Vibração" hint="Vibra ao responder e ao concluir a lição, no iPhone." value={value.haptics} onValueChange={(haptics) => onChange({ ...value, haptics })} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: galaxyColors.surface, borderRadius: radius.rLg, borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2 },
  eyebrow: { ...typography.label, color: galaxyColors.textTertiary },
  headline: { ...typography.h3, color: galaxyColors.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2, minHeight: 44 },
  copy: { flex: 1, gap: space.s0 },
  label: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  detail: { ...typography.caption, color: galaxyColors.textSecondary },
});
```

Run o comando do passo 1. Esperado: PASS.

- [ ] **Passo 3: Ligar ao Perfil, atrás de `SHOW_DEV_TOOLS`**

Em `ProfileScreen.tsx`:
- importe `FeedbackPreferencesCard` e `readFeedbackPreferences`, `writeFeedbackPreferences`, `type FeedbackPreferences` de `../../../ui/feedback/feedbackPreferences`;
- acrescente o estado `const [feedbackPreferences, setFeedbackPreferences] = useState<FeedbackPreferences | null>(null);`;
- dentro do callback do `useFocusEffect`, acrescente `void readFeedbackPreferences().then(setFeedbackPreferences);`;
- acrescente o handler:

```tsx
  const changeFeedbackPreferences = useCallback((next: FeedbackPreferences) => {
    setFeedbackPreferences(next);
    void writeFeedbackPreferences(next).catch((cause) => {
      console.error('[ProfileScreen] Falha ao gravar sons e vibração:', cause);
    });
  }, []);
```

- logo depois de `<ICloudBackupCard … />`, acrescente:

```tsx
          {/* Só no piloto: os sons existem apenas na lição híbrida, e o aluno
              não pode ver um interruptor de algo que nunca ouve. Tirar o
              gate quando a camada de som chegar às lições do aluno. */}
          {AppConfig.SHOW_DEV_TOOLS ? (
            <FeedbackPreferencesCard preferences={feedbackPreferences} onChange={changeFeedbackPreferences} />
          ) : null}
```

Em `ProfileScreen.flow.test.tsx`, acrescente, junto aos outros `jest.mock`:

```tsx
jest.mock('../../../ui/feedback/feedbackPreferences', () => ({
  DEFAULT_FEEDBACK_PREFERENCES: { sounds: true, haptics: true },
  readFeedbackPreferences: jest.fn().mockResolvedValue({ sounds: true, haptics: true }),
  writeFeedbackPreferences: jest.fn().mockResolvedValue(undefined),
}));
```

Se o arquivo já testar `SHOW_DEV_TOOLS` ligado e desligado, acrescente uma
asserção em cada caso: `Sons e vibração` aparece só quando a flag está ligada.
Se não testar, acrescente os dois casos no mesmo formato do teste do botão do
console.

Run: `cd radiant-app && npx jest src/features/profile --runInBand`
Esperado: PASS.

- [ ] **Passo 4: Commit**

```bash
git add radiant-app/src/features/profile
git commit -m "feat(perfil): interruptores de sons e vibração, só no piloto"
```

---

### Tarefa 6: A tela da lição híbrida e a rota de desenvolvimento

**Arquivos:**
- Modificar: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceMap.tsx`
- Modificar: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceMap.test.tsx`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.tsx`
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.flow.test.tsx`
- Criar: `radiant-app/src/app/licao-hibrida.tsx`
- Modificar: `radiant-app/src/app/_layout.tsx:496`
- Criar: `radiant-app/src/test/routes/licao-hibrida.test.tsx`
- Modificar: `radiant-app/src/features/dev-console/screens/DevConsoleScreen.tsx:293`

**Interfaces:**
- Consome:
  - `buildL1HybridPlan`, `createHybridLessonSession`, `isL1TemplateApproved`, `HybridItem` (Tarefas 2 e 3);
  - `createLessonSoundPlayer`, `createLessonFeedback`, `readFeedbackPreferences`, `LessonFeedback` (Tarefa 4);
  - `heartsRepository` (`getSnapshot(nowMs)`, `spend(nowMs)`, ambos `Promise<HeartsSnapshot>`).
- Produz:
  - `HybridLessonScreen(props)`, com `props = { plan?, hearts?, feedback?, now?, onExit }`;
  - os props novos do `BodyReferenceMap`: `showControls?`, `emphasizeMidline?`, `landmarksInteractive?`.

- [ ] **Passo 1: Testes dos props novos do mapa**

Em `BodyReferenceMap.test.tsx`, acrescente:

```tsx
  it('sem controles, a barra de vista e postura não aparece', () => {
    const { queryByLabelText } = render(<BodyReferenceMap posture="anatomical" perspective="front" selectedRelation="medial-lateral" reduceMotion showControls={false} onPostureChange={jest.fn()} onPerspectiveChange={jest.fn()} onRegionSelect={jest.fn()} />);
    expect(queryByLabelText('Controles do modelo corporal')).toBeNull();
  });

  it('destacar a linha mediana engrossa o traço', () => {
    const { getByTestId, rerender } = render(<BodyReferenceMap posture="anatomical" perspective="front" selectedRelation="medial-lateral" reduceMotion onPostureChange={jest.fn()} onPerspectiveChange={jest.fn()} onRegionSelect={jest.fn()} />);
    expect(getByTestId('body-map-midline').props.strokeWidth).toBe('2');
    rerender(<BodyReferenceMap posture="anatomical" perspective="front" selectedRelation="medial-lateral" reduceMotion emphasizeMidline onPostureChange={jest.fn()} onPerspectiveChange={jest.fn()} onRegionSelect={jest.fn()} />);
    expect(getByTestId('body-map-midline').props.strokeWidth).toBe('5');
  });

  it('landmarks não interativos não respondem ao toque nem se anunciam como botão', () => {
    const onRegionSelect = jest.fn();
    const { getByTestId } = render(<BodyReferenceMap posture="anatomical" perspective="front" selectedRelation="medial-lateral" reduceMotion landmarksInteractive={false} onPostureChange={jest.fn()} onPerspectiveChange={jest.fn()} onRegionSelect={onRegionSelect} />);
    const landmark = getByTestId('landmark-patient-left-hand');
    fireEvent.press(landmark);
    expect(onRegionSelect).not.toHaveBeenCalled();
    expect(landmark.props.accessibilityRole).not.toBe('button');
  });
```

Garanta `fireEvent` no import de `@testing-library/react-native` desse
arquivo. Rode e veja FAIL, porque os três props não existem.

- [ ] **Passo 2: Implementar os props do mapa**

Em `BodyReferenceMap.tsx`:
- nos props, acrescente `showControls?: boolean; emphasizeMidline?: boolean; landmarksInteractive?: boolean;`;
- na assinatura, desestruture `showControls = true, emphasizeMidline = false, landmarksInteractive = true`;
- troque a `<Line x1="120" …>` por:

```tsx
            <Line testID="body-map-midline" x1="120" x2="120" y1="30" y2="298" stroke={semanticColors.galaxy.statusInformation} strokeWidth={emphasizeMidline ? '5' : '2'} strokeDasharray="6 6" />
```

- troque o `map` dos landmarks por:

```tsx
        {displayedLandmarks.map(({ id, landmarkId, number, position, textDescription }) => {
          const placement = [styles.landmark, { left: `${position[0] / 2.4}%`, top: `${position[1] / 3.3}%` }];
          return landmarksInteractive
            ? <Pressable key={id} testID={`landmark-${landmarkId}`} accessibilityRole="button" accessibilityLabel={`Selecionar opção ${number} no mapa. ${textDescription}`} accessibilityHint="Seleciona esta opção para responder." onPress={() => onRegionSelect(id)} style={placement}><Text style={styles.landmarkNumber}>{number}</Text></Pressable>
            : <View key={id} testID={`landmark-${landmarkId}`} accessible accessibilityLabel={`Opção ${number} no mapa. ${textDescription}`} style={placement}><Text style={styles.landmarkNumber}>{number}</Text></View>;
        })}
```

- troque `<Controls {...{ posture, perspective, onPostureChange, onPerspectiveChange }} />` por `{showControls ? <Controls {...{ posture, perspective, onPostureChange, onPerspectiveChange }} /> : null}`.

Atenção: o `accessibilityHint` antigo dizia que a confirmação acontece em outro
controle. Na lição híbrida um toque responde, então o texto muda. Se algum
teste existente fixa o texto antigo, atualize a asserção. O comportamento que
ela protege (um toque seleciona a opção) continua o mesmo.

Run: `cd radiant-app && npx jest src/features/curriculum-v3 --runInBand`
Esperado: PASS.

- [ ] **Passo 3: Testes de fluxo da tela**

`HybridLessonScreen.flow.test.tsx`:

```tsx
import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { HybridLessonScreen } from './HybridLessonScreen';
import { buildL1HybridPlan } from './l1HybridLessonPlan';
import type { HybridItem } from './hybridItem.types';
import type { HeartsSnapshot } from '../../hearts/hearts.types';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const plan = buildL1HybridPlan();
const FULL: HeartsSnapshot = { count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null };

function makeDeps(spendResult: HeartsSnapshot = { count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null }) {
  const events: string[] = [];
  return {
    events,
    hearts: { getSnapshot: jest.fn().mockResolvedValue(FULL), spend: jest.fn().mockResolvedValue(spendResult) },
    feedback: { emit: (event: string) => { events.push(event); } },
    onExit: jest.fn(),
  };
}

function pressOption(item: HybridItem, optionId: string) {
  const option = item.options.find((candidate) => candidate.id === optionId)!;
  if (item.format === 'tap') fireEvent.press(screen.getByTestId(`landmark-${option.landmarkId}`));
  else fireEvent.press(screen.getByTestId(`hybrid-option-${option.id}`));
}

function currentItem(): HybridItem {
  const id = screen.getByTestId('hybrid-item-id').props.children as string;
  const found = [...plan, ...plan.map((item) => ({ ...item, id: `${item.id}-v` }))].find((item) => item.id === id);
  if (found) return found;
  throw new Error(`item fora do plano: ${id}`);
}

function renderScreen(deps: ReturnType<typeof makeDeps>) {
  renderWithProviders(<HybridLessonScreen plan={plan} hearts={deps.hearts} feedback={deps.feedback} onExit={deps.onExit} />);
}

beforeAll(() => {
  // Estreia da árvore fora da janela do findBy (lição de 2026-09-23).
  const warm = makeDeps();
  const { unmount } = renderWithProviders(<HybridLessonScreen plan={plan} hearts={warm.hearts} feedback={warm.feedback} onExit={warm.onExit} />);
  unmount();
});

describe('lição híbrida na tela', () => {
  it('percorre a lição acertando tudo e mostra o resumo', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan) {
      expect(screen.getByText(item.prompt)).toBeTruthy();
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    expect(await screen.findByText('Lição concluída')).toBeTruthy();
    expect(screen.getByText('+18 XP')).toBeTruthy();
    expect(screen.getByText('Precisão 100%')).toBeTruthy();
    expect(deps.hearts.spend).not.toHaveBeenCalled();
    expect(deps.events.filter((event) => event === 'streak')).toHaveLength(2);
    expect(deps.events[deps.events.length - 1]).toBe('lesson_complete');
  });

  it('erro de primeiro contato não custa vida, mostra a dica e deixa tentar de novo', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    const first = plan[0];
    pressOption(first, first.options.find((option) => option.id !== first.correctOptionId)!.id);
    expect(await screen.findByText('Tentar de novo')).toBeTruthy();
    expect(screen.getByText(first.hint)).toBeTruthy();
    expect(deps.hearts.spend).not.toHaveBeenCalled();
    fireEvent.press(screen.getByText('Tentar de novo'));
    expect(screen.getByText(first.prompt)).toBeTruthy();
  });

  it('erro de desafio gasta uma vida e o item volta no fim', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan.slice(0, 4)) {
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    const challenge = plan[4];
    pressOption(challenge, challenge.options.find((option) => option.id !== challenge.correctOptionId)!.id);
    fireEvent.press(await screen.findByText('Continuar'));
    expect(deps.hearts.spend).toHaveBeenCalledTimes(1);
    expect(deps.events).toContain('heart_lost');
    expect(screen.getByText('6 de 13')).toBeTruthy();
  });

  it('sem vidas, a lição para e explica quando elas voltam', async () => {
    const deps = makeDeps({ count: 0, status: 'empty', nextRefillAt: null, unlimitedUntil: null });
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan.slice(0, 4)) {
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    const challenge = currentItem();
    pressOption(challenge, challenge.options.find((option) => option.id !== challenge.correctOptionId)!.id);
    expect(await screen.findByText('Suas vidas acabaram.')).toBeTruthy();
  });
});
```

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.flow.test.tsx --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 4: Implementar a tela**

`HybridLessonScreen.tsx`:

```tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../../components/ui/AppButton';
import { useReducedMotionPreference } from '../../../ui/accessibility/useReducedMotionPreference';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { createLessonFeedback, type LessonFeedback, type LessonFeedbackEvent } from '../../../ui/feedback/lessonFeedback';
import { readFeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { createLessonSoundPlayer } from '../../../ui/feedback/lessonSounds';
import { semanticColors } from '../../../ui/semantic-colors';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { heartsRepository } from '../../hearts/HeartsRepository';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import { BodyReferenceMap } from '../l1-body-reference/BodyReferenceMap';
import { createHybridLessonSession, type HybridAnswerResult, type HybridSummary } from './HybridLessonSession';
import { buildL1HybridPlan } from './l1HybridLessonPlan';
import { isL1TemplateApproved } from './l1TemplateApproval';
import type { HybridItem } from './hybridItem.types';

type HeartsPort = Readonly<{ getSnapshot(nowMs: number): Promise<HeartsSnapshot>; spend(nowMs: number): Promise<HeartsSnapshot> }>;

export type HybridLessonScreenProps = Readonly<{
  plan?: readonly HybridItem[];
  hearts?: HeartsPort;
  feedback?: LessonFeedback;
  now?: () => number;
  onExit: () => void;
}>;

type Phase = 'opening' | 'item' | 'feedback' | 'out_of_hearts' | 'done';

const SYNTHESIS = 'A referência é o corpo, não você nem a gravidade.';

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

export function HybridLessonScreen({ plan, hearts = heartsRepository, feedback, now = Date.now, onExit }: HybridLessonScreenProps) {
  const reduceMotion = useReducedMotionPreference();
  const session = useMemo(() => createHybridLessonSession({ plan: plan ?? buildL1HybridPlan(), now }), [plan, now]);
  const approved = useMemo(() => isL1TemplateApproved(), []);
  const [phase, setPhase] = useState<Phase>('opening');
  const [item, setItem] = useState<HybridItem | null>(() => session.current());
  const [result, setResult] = useState<HybridAnswerResult | null>(null);
  const [heartsSnapshot, setHeartsSnapshot] = useState<HeartsSnapshot | null>(null);
  const [summary, setSummary] = useState<HybridSummary | null>(null);
  const busy = useRef(false);
  const feedbackRef = useRef<LessonFeedback | null>(feedback ?? null);

  useEffect(() => {
    if (feedback) {
      feedbackRef.current = feedback;
      return undefined;
    }
    const sounds = createLessonSoundPlayer();
    let alive = true;
    void readFeedbackPreferences().then((preferences) => {
      if (alive) feedbackRef.current = createLessonFeedback(sounds, preferences);
    });
    return () => {
      alive = false;
      sounds.release();
    };
  }, [feedback]);

  const emit = useCallback((event: LessonFeedbackEvent) => feedbackRef.current?.emit(event), []);

  const start = useCallback(() => {
    setPhase('item');
    void hearts.getSnapshot(now()).then(setHeartsSnapshot);
  }, [hearts, now]);

  const choose = useCallback(async (optionId: string) => {
    if (phase !== 'item' || busy.current || !item || !item.options.some((option) => option.id === optionId)) return;
    busy.current = true;
    emit('option_tap');
    const answer = session.answer(optionId);
    emit(answer.correct ? 'correct' : 'incorrect');
    if (answer.events.includes('streak3') || answer.events.includes('streak5')) emit('streak');
    setResult(answer);
    setPhase('feedback');
    if (answer.costsHeart) {
      const next = await hearts.spend(now());
      setHeartsSnapshot(next);
      if (next.status !== 'unlimited') emit('heart_lost');
      if (next.status === 'empty') setPhase('out_of_hearts');
    }
    busy.current = false;
  }, [emit, hearts, item, now, phase, session]);

  const next = useCallback(() => {
    const { complete } = session.advance();
    setResult(null);
    if (complete) {
      setSummary(session.summary());
      setPhase('done');
      emit('lesson_complete');
      return;
    }
    setItem(session.current());
    setPhase('item');
  }, [emit, session]);

  if (phase === 'opening') {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>PILOTO · LIÇÃO HÍBRIDA</Text>
          <Text style={styles.title} accessibilityRole="header">O corpo como referência</Text>
          <BodyReferenceMap posture="anatomical" perspective="front" selectedRelation="medial-lateral" reduceMotion={reduceMotion} landmarks={[]} showControls={false} onPostureChange={() => undefined} onPerspectiveChange={() => undefined} onRegionSelect={() => undefined} />
          <Text style={styles.body}>A marca está à esquerda. Esquerda de quem?</Text>
          {!approved ? <Text style={styles.notice}>Prévia: os modelos de exercício aguardam a revisão do conteúdo.</Text> : null}
          <AppButton variant="galaxy" label="Começar" onPress={start} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === 'done' && summary) {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <PixelIllustration size="md" state={reduceMotion ? 'happy' : 'celebrate'} expression="orgulhoso" accessibilityLabel="Pixel comemorando o fim da lição" />
          <Text style={styles.title} accessibilityRole="header">Lição concluída</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>{`+${summary.xp} XP`}</Text>
            <Text style={styles.stat}>{`Precisão ${Math.round(summary.accuracy * 100)}%`}</Text>
            <Text style={styles.stat}>{`Tempo ${formatDuration(summary.durationMs)}`}</Text>
            <Text style={styles.stat}>{`Maior sequência ${summary.bestStreak}`}</Text>
          </View>
          <Text style={styles.body}>{SYNTHESIS}</Text>
          <AppButton variant="galaxy" label="Continuar" onPress={onExit} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === 'out_of_hearts') {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title} accessibilityRole="header">Suas vidas acabaram.</Text>
          <Text style={styles.body}>Elas voltam com o tempo, uma a cada 30 minutos. Revisar também devolve uma vida.</Text>
          <AppButton variant="galaxy" label="Sair" onPress={onExit} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!item) return null;
  const { index, total } = session.position();
  const firstContactMiss = phase === 'feedback' && result !== null && !result.correct && item.phase === 'first_contact';
  const streakText = result?.events.includes('streak5') ? 'Cinco seguidos!' : result?.events.includes('streak3') ? 'Três seguidos!' : null;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text testID="hybrid-item-id" style={styles.visuallyHidden} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{item.id}</Text>
        <View style={styles.header}>
          <Text style={styles.progressLabel}>{`${index + 1} de ${total}`}</Text>
          <Text style={styles.progressLabel} accessibilityLabel={heartsSnapshot?.status === 'unlimited' ? 'Vidas ilimitadas' : `${heartsSnapshot?.count ?? 5} vidas`}>
            {heartsSnapshot?.status === 'unlimited' ? 'Vidas ∞' : `Vidas ${heartsSnapshot?.count ?? 5}`}
          </Text>
        </View>
        <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: index }}>
          <View style={[styles.fill, { width: `${(index / total) * 100}%` }]} />
        </View>
        <Text style={styles.prompt} accessibilityLabel={item.accessiblePrompt}>{item.prompt}</Text>
        <BodyReferenceMap
          posture={item.posture}
          perspective={item.perspective}
          selectedRelation={item.relation}
          reduceMotion={reduceMotion}
          landmarks={item.landmarks}
          showControls={false}
          emphasizeMidline={firstContactMiss}
          landmarksInteractive={item.format === 'tap' && phase === 'item'}
          onPostureChange={() => undefined}
          onPerspectiveChange={() => undefined}
          onRegionSelect={(id) => { void choose(id); }}
        />
        {item.format === 'tap' ? (
          <Text style={styles.instruction}>Toque no número certo no mapa.</Text>
        ) : (
          <View style={styles.options}>
            {item.options.map((option) => (
              <Pressable
                key={option.id}
                testID={`hybrid-option-${option.id}`}
                accessibilityRole="button"
                accessibilityLabel={`${option.label}. ${option.textDescription}`}
                disabled={phase !== 'item'}
                onPress={() => { void choose(option.id); }}
                style={styles.option}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {option.landmarkId ? <Text style={styles.optionDetail}>{option.textDescription}</Text> : null}
              </Pressable>
            ))}
          </View>
        )}
        {phase === 'feedback' && result ? (
          <View style={styles.panel} accessibilityLiveRegion="polite">
            <Text style={[styles.resultTitle, result.correct ? styles.good : styles.miss]}>{result.correct ? 'Isso!' : 'Quase.'}</Text>
            {result.hint ? <Text style={styles.hint}>{result.hint}</Text> : null}
            <Text style={styles.body}>{result.feedback}</Text>
            {streakText ? (
              <View style={styles.streak}>
                <PixelIllustration size="sm" state={reduceMotion ? 'happy' : 'celebrate'} expression="feliz" accessibilityLabel="Pixel comemorando a sequência" />
                <Text style={styles.streakText}>{streakText}</Text>
              </View>
            ) : null}
            <AppButton variant="galaxy" label={result.retrySameItem ? 'Tentar de novo' : 'Continuar'} onPress={next} fullWidth />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  content: { padding: space.s3, gap: space.s3 },
  eyebrow: { ...typography.label, color: galaxyColors.textTertiary },
  title: { ...typography.h2, color: galaxyColors.textPrimary },
  body: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  notice: { ...typography.caption, color: semanticColors.galaxy.statusWarning },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { ...typography.caption, color: galaxyColors.textSecondary },
  track: { height: 6, borderRadius: radius.rMd, backgroundColor: galaxyColors.surfaceActive, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: semanticColors.galaxy.statusSuccess },
  prompt: { ...typography.h3, color: galaxyColors.textPrimary },
  instruction: { ...typography.caption, color: galaxyColors.textSecondary },
  options: { gap: space.s2 },
  option: { minHeight: 44, padding: space.s3, borderRadius: radius.rMd, borderWidth: 1, borderColor: galaxyColors.border, backgroundColor: galaxyColors.surface, gap: space.s0 },
  optionLabel: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  optionDetail: { ...typography.caption, color: galaxyColors.textSecondary },
  panel: { padding: space.s3, borderRadius: radius.rLg, borderWidth: 1, borderColor: galaxyColors.border, backgroundColor: galaxyColors.surface, gap: space.s2 },
  resultTitle: { ...typography.h3 },
  good: { color: semanticColors.galaxy.statusSuccess },
  miss: { color: semanticColors.galaxy.statusWarning },
  hint: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  streak: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  streakText: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  stats: { gap: space.s1 },
  stat: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  visuallyHidden: { height: 0, width: 0, opacity: 0 },
});
```

Antes de rodar, confira quatro coisas no repositório e ajuste o código se algo
divergir:
- `useReducedMotionPreference()` devolve `boolean`, como na prévia da L1;
- `PixelIllustration` aceita `state` `'happy'` e `'celebrate'` com `size` `'sm'` e `'md'`;
- `AppButton` renderiza o `label` num `Text`, que o `getByText` alcança;
- `galaxyColors.surfaceActive` existe.

Run o comando do passo 3. Esperado: PASS.

- [ ] **Passo 5: A rota de desenvolvimento**

`src/app/licao-hibrida.tsx`, com o mesmo gate da rota `dev-console`:

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppConfig } from '../config';
import { Card } from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { HybridLessonScreen } from '../features/curriculum-v3/hybrid-l1/HybridLessonScreen';
import { galaxyColors } from '../ui/theme';
import { layout, space, typography } from '../ui/styles';

// Piloto da lição híbrida (spec 2026-09-23). O gate vive na rota, como no
// console: o V3 não está ativado, e o aluno não alcança esta tela.
export default function HybridLessonRoute() {
  if (!AppConfig.SHOW_DEV_TOOLS) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[layout.screen, layout.container, layout.center]}>
          <Card style={styles.card}>
            <Text style={styles.title}>Diagnóstico restrito</Text>
            <Text style={styles.body}>Esta tela fica disponível apenas em builds de desenvolvimento ou homologação.</Text>
            <PrimaryButton onPress={() => router.replace('/(tabs)')} style={styles.button}>Voltar</PrimaryButton>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return <HybridLessonScreen onExit={() => router.back()} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  card: { width: '100%', maxWidth: 420, alignItems: 'center', gap: space.s3 },
  title: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
  body: { ...typography.caption, color: galaxyColors.textSecondary, textAlign: 'center' },
  button: { width: '100%' },
});
```

Em `src/app/_layout.tsx`, depois de `<Stack.Screen name="dev-console" />`,
acrescente `<Stack.Screen name="licao-hibrida" />`.

`src/test/routes/licao-hibrida.test.tsx`:

```tsx
import React from 'react';
import { screen } from '@testing-library/react-native';

import HybridLessonRoute from '../../app/licao-hibrida';
import { renderWithProviders } from '../renderWithProviders';
import { AppConfig } from '../../config';

jest.mock('expo-router', () => ({ router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() } }));
jest.mock('../../features/curriculum-v3/hybrid-l1/HybridLessonScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return { HybridLessonScreen: () => React.createElement(Text, null, 'Lição híbrida') };
});
jest.mock('../../config', () => ({ AppConfig: { SHOW_DEV_TOOLS: true } }));

describe('rota do piloto da lição híbrida', () => {
  afterEach(() => { AppConfig.SHOW_DEV_TOOLS = true; });

  it('monta a lição quando as ferramentas de desenvolvimento estão ligadas', () => {
    renderWithProviders(<HybridLessonRoute />);
    expect(screen.getByText('Lição híbrida')).toBeTruthy();
  });

  it('não monta a lição no build do aluno', () => {
    AppConfig.SHOW_DEV_TOOLS = false;
    renderWithProviders(<HybridLessonRoute />);
    expect(screen.queryByText('Lição híbrida')).toBeNull();
    expect(screen.getByText('Diagnóstico restrito')).toBeTruthy();
  });
});
```

No `DevConsoleScreen.tsx`, logo antes do botão "Abrir Telemetry Debug",
acrescente:

```tsx
                <ActionButton onPress={() => router.push('/licao-hibrida')} variant="secondary">
                    Piloto: lição híbrida (L1)
                </ActionButton>
```

- [ ] **Passo 6: Ver a guarda do gate falhar**

Mutação: na rota, troque `if (!AppConfig.SHOW_DEV_TOOLS)` por `if (false)`.
Esperado: FAIL em "não monta a lição no build do aluno". Registre na seção
"Tarefa 6" dos vermelhos e reverta.

- [ ] **Passo 7: Rodar a área inteira e os contratos de rota**

Run: `cd radiant-app && npx jest src/features/curriculum-v3 src/test/routes src/features/dev-console --runInBand && npm run test:route-tree-purity-contract`
Esperado: PASS.

- [ ] **Passo 8: Commit**

```bash
git add radiant-app/src/features/curriculum-v3 radiant-app/src/app/licao-hibrida.tsx radiant-app/src/app/_layout.tsx radiant-app/src/test/routes/licao-hibrida.test.tsx radiant-app/src/features/dev-console/screens/DevConsoleScreen.tsx docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md
git commit -m "feat(l1-hibrida): tela da lição híbrida e rota de desenvolvimento"
```

---

### Tarefa 7: Medidas locais das sessões

As medidas da spec (§5.4) ficam no aparelho, sem envio: tempo por item, erros
por código, itens que voltaram, vidas gastas e ponto de abandono. O console de
desenvolvimento lista as últimas sessões.

**Arquivos:**
- Criar: `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonMetricsRepository.ts` (+ `.test.ts`)
- Modificar: `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.tsx`
- Modificar: `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.flow.test.tsx`
- Criar: `radiant-app/src/features/dev-console/components/HybridLessonMetricsCard.tsx` (+ `.test.tsx`)
- Modificar: `radiant-app/src/features/dev-console/screens/DevConsoleScreen.tsx`

**Interfaces:**
- Consome: `HybridSummary` (Tarefa 3), `STORAGE_KEYS.HYBRID_LESSON_METRICS` (Tarefa 4).
- Produz:
  - `HybridLessonRecord = { finishedAt: string; outcome: 'completed' | 'out_of_hearts' | 'abandoned'; abandonedAtItemId: string | null; summary: HybridSummary }`
  - `HybridLessonMetricsRepository` (`list()`, `append(record)`), a instância `hybridLessonMetricsRepository` e `MAX_RECORDS = 20`
  - `HybridLessonMetricsCard({ repository? })`

- [ ] **Passo 1: Testes do repositório**

`HybridLessonMetricsRepository.test.ts`:

```ts
import { HybridLessonMetricsRepository, MAX_RECORDS, type HybridLessonRecord } from './HybridLessonMetricsRepository';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return { getItem: jest.fn(async (key: string) => data[key] ?? null), setItem: jest.fn(async (key: string, value: string) => { data[key] = value; }) };
}

const record = (n: number): HybridLessonRecord => ({
  finishedAt: `2026-09-23T10:${String(n).padStart(2, '0')}:00.000Z`,
  outcome: 'completed',
  abandonedAtItemId: null,
  summary: { xp: 18, accuracy: 1, durationMs: 200_000, bestStreak: 12, requeued: 0, heartsSpent: 0, misconceptions: {}, itemTimesMs: {} },
});

describe('medidas locais da lição híbrida', () => {
  it('guarda a sessão mais recente primeiro', async () => {
    const repository = new HybridLessonMetricsRepository(memoryStorage());
    await repository.append(record(1));
    await repository.append(record(2));
    expect((await repository.list()).map((entry) => entry.finishedAt)).toEqual([record(2).finishedAt, record(1).finishedAt]);
  });

  it(`mantém no máximo ${MAX_RECORDS} sessões`, async () => {
    const repository = new HybridLessonMetricsRepository(memoryStorage());
    for (let n = 0; n < MAX_RECORDS + 5; n += 1) await repository.append(record(n));
    expect(await repository.list()).toHaveLength(MAX_RECORDS);
  });

  it('dado corrompido vira lista vazia, sem lançar', async () => {
    const repository = new HybridLessonMetricsRepository(memoryStorage({ '@radiant:v3:hybrid_lesson_metrics_v1': '{x' }));
    expect(await repository.list()).toEqual([]);
  });
});
```

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/HybridLessonMetricsRepository.test.ts --runInBand`
Esperado: FAIL, módulo inexistente.

- [ ] **Passo 2: Implementar o repositório**

`HybridLessonMetricsRepository.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { HybridSummary } from './HybridLessonSession';

export type HybridLessonOutcome = 'completed' | 'out_of_hearts' | 'abandoned';

export type HybridLessonRecord = Readonly<{
  finishedAt: string;
  outcome: HybridLessonOutcome;
  abandonedAtItemId: string | null;
  summary: HybridSummary;
}>;

export const MAX_RECORDS = 20;

type MetricsStorage = Readonly<{ getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> }>;

function isRecord(value: unknown): value is HybridLessonRecord {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<HybridLessonRecord>;
  return typeof candidate.finishedAt === 'string' && typeof candidate.outcome === 'string' && typeof candidate.summary === 'object' && candidate.summary !== null;
}

/** Medidas do piloto (spec §5.4). Ficam no aparelho; nada é enviado. */
export class HybridLessonMetricsRepository {
  constructor(private readonly storage: MetricsStorage = AsyncStorage) {}

  async list(): Promise<readonly HybridLessonRecord[]> {
    try {
      const raw = await this.storage.getItem(STORAGE_KEYS.HYBRID_LESSON_METRICS);
      const value: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(value) ? value.filter(isRecord) : [];
    } catch {
      return [];
    }
  }

  async append(record: HybridLessonRecord): Promise<void> {
    const next = [record, ...(await this.list())].slice(0, MAX_RECORDS);
    await this.storage.setItem(STORAGE_KEYS.HYBRID_LESSON_METRICS, JSON.stringify(next));
  }
}

export const hybridLessonMetricsRepository = new HybridLessonMetricsRepository();
```

Run o comando do passo 1. Esperado: PASS.

- [ ] **Passo 3: A tela grava a sessão — teste**

Em `HybridLessonScreen.flow.test.tsx`:
- em `makeDeps`, acrescente `metrics: { append: jest.fn().mockResolvedValue(undefined) }`;
- passe `metrics={deps.metrics}` em `renderScreen` e no `beforeAll`;
- acrescente os casos:

```tsx
  it('grava a sessão concluída no aparelho', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan) {
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    await screen.findByText('Lição concluída');
    expect(deps.metrics.append).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'completed', abandonedAtItemId: null }));
  });

  it('sair no meio grava o abandono e o item em que parou', async () => {
    const deps = makeDeps();
    const { unmount } = renderWithProviders(<HybridLessonScreen plan={plan} hearts={deps.hearts} feedback={deps.feedback} metrics={deps.metrics} onExit={deps.onExit} />);
    fireEvent.press(screen.getByText('Começar'));
    unmount();
    expect(deps.metrics.append).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'abandoned', abandonedAtItemId: plan[0].id }));
  });
```

Rode e veja FAIL, porque o prop `metrics` não existe.

- [ ] **Passo 4: A tela grava a sessão — implementação**

Em `HybridLessonScreen.tsx`:
- importe `hybridLessonMetricsRepository`, `type HybridLessonOutcome` e `type HybridLessonRecord` de `./HybridLessonMetricsRepository`;
- nos props, acrescente `metrics?: Readonly<{ append(record: HybridLessonRecord): Promise<void> }>;`;
- desestruture `metrics = hybridLessonMetricsRepository`;
- depois dos `useState`, acrescente:

```tsx
  const phaseRef = useRef<Phase>('opening');
  const itemRef = useRef<HybridItem | null>(item);
  const recorded = useRef(false);
  phaseRef.current = phase;
  itemRef.current = item;

  const record = useCallback((outcome: HybridLessonOutcome) => {
    if (recorded.current) return;
    recorded.current = true;
    void metrics.append({
      finishedAt: new Date(now()).toISOString(),
      outcome,
      abandonedAtItemId: outcome === 'completed' ? null : itemRef.current?.id ?? null,
      summary: session.summary(),
    }).catch(() => undefined);
  }, [metrics, now, session]);

  // Ref, não dependência: a limpeza precisa rodar só na desmontagem. Com
  // `[record]`, uma troca de identidade no meio da lição gravaria um abandono falso.
  const recordRef = useRef(record);
  recordRef.current = record;
  useEffect(() => () => {
    if (phaseRef.current === 'item' || phaseRef.current === 'feedback') recordRef.current('abandoned');
  }, []);
```

- em `choose`, logo depois de `setPhase('out_of_hearts')`, chame `record('out_of_hearts')`;
- em `next`, logo depois de `setPhase('done')`, chame `record('completed')`.

Run: `cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1 --runInBand`
Esperado: PASS.

- [ ] **Passo 5: O cartão do console — teste e implementação**

`HybridLessonMetricsCard.test.tsx`:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HybridLessonMetricsCard } from './HybridLessonMetricsCard';

describe('cartão de medidas do piloto', () => {
  it('lista a sessão com precisão, tempo, vidas, itens que voltaram e confusões', async () => {
    const repository = { list: jest.fn().mockResolvedValue([{
      finishedAt: '2026-09-23T10:00:00.000Z', outcome: 'abandoned', abandonedAtItemId: 'h07-sup-prof',
      summary: { xp: 10, accuracy: 0.75, durationMs: 185_000, bestStreak: 4, requeued: 2, heartsSpent: 2, misconceptions: { 'E-REL': 2 }, itemTimesMs: { a: 10_000, b: 20_000 } },
    }]) };
    render(<HybridLessonMetricsCard repository={repository} />);
    expect(await screen.findByText(/Abandonou em h07-sup-prof/)).toBeTruthy();
    expect(screen.getByText(/Precisão 75%/)).toBeTruthy();
    expect(screen.getByText(/Tempo 3:05/)).toBeTruthy();
    expect(screen.getByText(/Média por item 15 s/)).toBeTruthy();
    expect(screen.getByText(/E-REL × 2/)).toBeTruthy();
  });

  it('sem sessões, diz que não há medida ainda', async () => {
    render(<HybridLessonMetricsCard repository={{ list: jest.fn().mockResolvedValue([]) }} />);
    expect(await screen.findByText('Nenhuma sessão do piloto neste aparelho.')).toBeTruthy();
  });
});
```

`HybridLessonMetricsCard.tsx`:

```tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hybridLessonMetricsRepository, type HybridLessonRecord } from '../../curriculum-v3/hybrid-l1/HybridLessonMetricsRepository';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type Props = Readonly<{ repository?: Readonly<{ list(): Promise<readonly HybridLessonRecord[]> }> }>;

const OUTCOME: Readonly<Record<HybridLessonRecord['outcome'], string>> = { completed: 'Concluiu', out_of_hearts: 'Ficou sem vidas', abandoned: 'Abandonou' };

function minutes(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function summaryLines(entry: HybridLessonRecord): string[] {
  const times = Object.values(entry.summary.itemTimesMs);
  const mean = times.length === 0 ? 0 : Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000);
  const confusions = Object.entries(entry.summary.misconceptions).map(([code, n]) => `${code} × ${n}`).join(', ') || 'nenhuma';
  return [
    `${entry.finishedAt.slice(0, 16).replace('T', ' ')} · ${OUTCOME[entry.outcome]}${entry.abandonedAtItemId ? ` em ${entry.abandonedAtItemId}` : ''}`,
    `Precisão ${Math.round(entry.summary.accuracy * 100)}% · Tempo ${minutes(entry.summary.durationMs)} · Média por item ${mean} s`,
    `Vidas gastas ${entry.summary.heartsSpent} · Itens que voltaram ${entry.summary.requeued} · Maior sequência ${entry.summary.bestStreak}`,
    `Confusões: ${confusions}`,
  ];
}

/** Medidas do piloto (spec §5.4), lidas do aparelho para a pessoa mostrar a tela. */
export function HybridLessonMetricsCard({ repository = hybridLessonMetricsRepository }: Props) {
  const [entries, setEntries] = useState<readonly HybridLessonRecord[] | null>(null);
  useEffect(() => { void repository.list().then(setEntries); }, [repository]);
  return (
    <View style={styles.card}>
      <Text style={styles.headline} accessibilityRole="header">Piloto da lição híbrida</Text>
      {entries === null ? null : entries.length === 0 ? (
        <Text style={styles.line}>Nenhuma sessão do piloto neste aparelho.</Text>
      ) : entries.map((entry) => (
        <View key={entry.finishedAt} style={styles.entry}>
          {summaryLines(entry).map((line) => <Text key={line} style={styles.line}>{line}</Text>)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: galaxyColors.surface, borderRadius: radius.rLg, borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2 },
  headline: { ...typography.h3, color: galaxyColors.textPrimary },
  entry: { gap: space.s0, paddingTop: space.s1, borderTopWidth: 1, borderTopColor: galaxyColors.border },
  line: { ...typography.caption, color: galaxyColors.textSecondary },
});
```

No `DevConsoleScreen.tsx`, logo antes do botão "Piloto: lição híbrida (L1)",
acrescente `<HybridLessonMetricsCard />` e o import
`import { HybridLessonMetricsCard } from '../components/HybridLessonMetricsCard';`.
Se o `DevConsoleScreen.flow.test.tsx` não mockar o AsyncStorage, acrescente
`jest.mock('../../curriculum-v3/hybrid-l1/HybridLessonMetricsRepository', () => ({ hybridLessonMetricsRepository: { list: jest.fn().mockResolvedValue([]) } }));`.

Run: `cd radiant-app && npx jest src/features/dev-console src/features/curriculum-v3/hybrid-l1 --runInBand`
Esperado: PASS.

- [ ] **Passo 6: Commit**

```bash
git add radiant-app/src/features/curriculum-v3/hybrid-l1 radiant-app/src/features/dev-console
git commit -m "feat(l1-hibrida): medidas locais das sessões do piloto no console"
```

---

### Tarefa 8: Gate, documentação e fechamento do run

**Artefatos:** a spec do piloto, `docs/FILA.md`, `docs/STATUS.md`, os dois
arquivos de histórico, o roadmap, `docs/README.md`, o arquivo de vermelhos e o
run do Loop.

- [ ] **Passo 1: Gate completo no Node 20**

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"; node --version
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```

Esperado: `v20.20.2` e exit 0. Anote suítes, testes, avisos de lint e o
resultado do visual QA. Se o visual QA reprovar por R2 ou pela paleta, corrija
o estilo; não afrouxe a regra.

- [ ] **Passo 2: Documentação**

- **Spec do piloto:** o estado passa a "implementado localmente em <data>, sem
  build de distribuição". Acrescente um parágrafo com a rota `/licao-hibrida`
  e o cartão de medidas no console.
- **`docs/FILA.md`, item do piloto:**
  - estado: implementado localmente;
  - **pendente do dono:** revisar a amostra
    `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`.
    Aprovando, o agente grava a impressão digital em `l1TemplateApproval.ts`;
  - build de teste e teste com pessoas: quando o dono decidir;
  - ver no simulador: `npx expo run:ios`, que recompila por causa do `expo-audio`.
- **`docs/STATUS.md`:** atualize a linha do Currículo V3. A frase que deixar de
  valer vai, sem edição, para o fim de `docs/archive/STATUS_historico.md`, com
  um cabeçalho de lote datado.
- **Roadmap (J3) e `docs/README.md`:** apontam para este plano.
- **Arquivo de vermelhos:** confira que tem uma seção por guarda nova, das
  Tarefas 1, 2, 3, 4 e 6.

- [ ] **Passo 3: Commit da documentação**

```bash
git add docs
git commit -m "docs: piloto da lição híbrida implementado localmente"
```

- [ ] **Passo 4: Fechar o run (controlador)**

Com o Node 24 no PATH, rode um comando de cada vez e confira o `code` de cada
resposta: `loop validate` → `loop step finish` → (se houver aprendizado durável)
`loop memory write --input <arquivo>` → `loop run close`. Nunca encadeie com
`&&`, e não valide com um E2E rodando.

---

## Autorrevisão (feita ao escrever o plano)

- **Cobertura da spec:**
  - §5.1 (forma da lição) → Tarefas 3 e 6;
  - §5.2 (som, vibração e interruptores) → Tarefas 4 e 5;
  - §5.3 (modelos, gabarito calculado, guardas e aprovação por impressão
    digital) → Tarefas 1, 2 e 3;
  - §5.4 (medidas locais) → Tarefa 7. O teste com pessoas e o build ficam com
    o dono, fora deste plano, por decisão de 2026-09-23;
  - §6 (vidas por tipo de item) → Tarefas 3 e 6.
- **Um desvio consciente da spec:** o cartão do Perfil fica atrás de
  `SHOW_DEV_TOOLS` enquanto os sons não chegarem ao aluno. A razão está nas
  restrições globais.
- **A IA não escreve texto neste piloto.** Os feedbacks aprovados no parecer v4
  foram reaproveitados, e os enunciados novos passam pela revisão do dono. O
  passo da IA entra quando a produção escalar para a L2 e a L3.
- **Tipos conferidos entre tarefas:**
  - `HybridItem.landmarks: readonly L1AnswerOption[]` (Tarefa 2) → `BodyReferenceMap.landmarks` (Tarefa 6);
  - `HybridSummary` (Tarefa 3) → `HybridLessonRecord.summary` (Tarefa 7);
  - `LessonFeedbackEvent` (Tarefa 4) → `emit` na tela (Tarefa 6).
