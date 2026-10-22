# Trilha Medalhão — plano de implementação (plano 2)

> **Para agentes:** sub-skill obrigatória: superpowers:subagent-driven-development
> (recomendada) ou superpowers:executing-plans, tarefa por tarefa. Os passos
> usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** trocar a coluna de cartões da aba Estude pela trilha de medalhas
em zigue-zague, com estrelas, cabeçalho da unidade, a linha de revisão, a linha
do lembrete e o momento em que o Pixel percorre o caminho até a próxima aula.

**Arquitetura:**
- **Os dados não mudam de dono.** `JourneyProgressService`,
  `JourneyCurriculumService` e `JourneyNodeRouting` continuam decidindo estado,
  ordem e destino. Este plano troca só como a trilha é desenhada, mais dois
  dados de leitura: o tema de cada nó e as estrelas de cada aula.
- **A lista continua uma `FlatList` virtualizada** (`JourneyTrail`), com o
  mesmo achatamento em bandas, unidades e nós e a mesma ancoragem no nó
  recomendado. Cada nó vira uma linha com o trecho do caminho que chega até ele
  e a medalha deslocada no zigue-zague.
- **Animação só por `src/ui/motion.ts`**, como exige a regra R4 do
  `visual:qa:strict`. Os hooks novos moram lá.

**Pilha:** Expo SDK 54, React Native 0.81, Reanimated 4.1, `react-native-svg`
15.12 e o `ThemeIllustration` do plano 1, sobre `@shopify/react-native-skia`
2.2.12.

**Spec:** [seção 4 da spec](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md#4-a-trilha-direção-medalhão)
e a linha "Estude" da [seção 11.3](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md#113-tela-a-tela) ·
[prancheta da trilha](../../design/2026-10-21-trilha-medalhao.html) ·
[prancheta do app](../../design/2026-10-21-app-medalhao.html) ·
[índice](2026-10-21-trilha-medalhao-indice.md).

**Depende de:** plano 1 (feito) e, só na tarefa 6, do plano 6 (Pixel), por
causa da cabeça do Pixel.

**Gate do dono antes da tarefa 1:** a política de versão nativa (tarefa 0).

## Restrições globais

As do [plano 1](2026-10-21-fundacao-visual-medalhao.md#restrições-globais)
valem todas. E mais:

- **Nenhuma rota importa o Skia antes da tarefa 0 estar resolvida.** Hoje a
  `runtimeVersion` é `{"policy":"appVersion"}` com `version` `1.4.0`: um
  `eas update` de uma rota com Skia chegaria aos binários da loja sem o Skia e
  derrubaria o app (STATUS, "Branch da trilha Medalhão").
- **Os rótulos de acessibilidade dos nós mantêm o formato `"<título>. <estado>."`**
  que os roteiros Maestro leem: `Fundamentos de Radiologia. Próximo passo.`,
  `Revisar Fundamentos de Radiologia. Revisão devida · 2 devidas.` e
  `Revisar … Disponível em dd/mm/aaaa às hh:mm.` Mudar um deles exige mudar o
  YAML e o `maestro-contract` na mesma tarefa.
- **Os `testID` de hoje continuam:** `journey-home-screen` e
  `journey-anchor-<id>`. `journey-icon-tile-<id>`, `journey-next-pill-<id>` e
  `journey-status-<id>` saem junto com o cartão; procure cada um nos testes e
  nos roteiros antes de apagar.
- **A Regra Sem Cara de IA** do DESIGN.md: nada de pílula "PRÓXIMO", etiqueta
  "LIÇÃO" ou cartão de recomendação. A medalha azul com o Pixel ao lado é a
  recomendação.
- **Medidas da prancheta:** medalha de raio 34 (concluída e bloqueada) e 40 (a
  próxima), lábio `depth.medalLip` (8), deslocamento lateral máximo de 30% da
  meia-largura, pontilhado de traço 10 com intervalo 18 e ponta redonda.
- **"Reduzir movimento":** o anel não pulsa, a ilustração fica no quadro de
  pose, e o momento vira troca instantânea.
- **Texto grande:** com `useLargeTextLayout()` verdadeiro, a trilha vira uma
  coluna centrada, sem zigue-zague, como já acontece hoje com os cartões.

## Foco da revisão

1. **Aluno que volta de uma aula concluída.** O momento toca uma vez por
   conclusão, não a cada foco da aba, e não toca na primeira abertura do app.
   Tarefa 6.
2. **Lista longa.** Com 40 nós, a rolagem continua a 60 fps no AVD
   `radiant-entrada-api34`, e só as medalhas visíveis tocam ilustração. Tarefa 7.
3. **Leitor de tela.** Cada medalha é um botão só, com título, estado e
   estrelas ("Tubo de raios X. Concluída, 3 estrelas."). O caminho e o Pixel são
   decorativos. Tarefas 3 e 4.
4. **Nó sem tema e aula sem tentativa.** Nó sem `theme` usa o tema da unidade e,
   sem ele, `radiacao`; aula concluída sem tentativa registrada aparece em ouro
   sem estrelas, nunca com zero estrelas cinzas. Tarefas 1 e 2.
5. **Lembrete recusado no sistema.** Se a permissão de notificação foi negada,
   ligar o interruptor abre o pedido de permissão e, negado de novo, ele volta a
   desligado sem erro. Tarefa 5.

---

### Tarefa 0: Política de versão nativa (gate do dono)

**Arquivos:**
- Modificar, depois da resposta do dono: `radiant-app/app.json`
- Modificar: `docs/STATUS.md`, seção "Branch da trilha Medalhão"

- [ ] **Passo 1: Medir o estado de hoje**

Run (raiz do repositório): `node -e "const a=require('./radiant-app/app.json').expo;console.log(a.version, JSON.stringify(a.runtimeVersion))"`
Expected em 2026-10-21: `1.4.0 {"policy":"appVersion"}`.

- [ ] **Passo 2: Perguntar ao dono**

Duas saídas, as duas evitam que um `eas update` leve Skia a um binário sem Skia:
- `runtimeVersion: { "policy": "fingerprint" }`: a versão de loja fica livre, e
  todo binário com nativo diferente ganha um runtime próprio;
- subir `version` para `1.5.0` (e o `buildNumber`), que também mexe no
  `check-native-version` e no `Info.plist`.

Build e distribuição são do dono. Não siga sem a resposta.

- [ ] **Passo 3: Aplicar a escolha e conferir**

Run: `cd radiant-app && npx expo config --type public | grep -A2 runtimeVersion && npm run test:native-version-contract`
Expected: o valor escolhido aparece e o contrato passa.

- [ ] **Passo 4: Commit**

```bash
git add radiant-app/app.json docs/STATUS.md
git commit -m "chore(release): política de runtime antes do Skia entrar numa rota"
```

### Tarefa 1: Tema de cada nó

**Arquivos:**
- Modificar: `radiant-app/src/types/journey.ts`, com `theme?: IllustrationTheme`
  em `JourneyNodeDefinition`
- Criar: `radiant-app/src/features/journey/services/resolveNodeTheme.ts`
- Testar: `radiant-app/src/features/journey/services/resolveNodeTheme.test.ts`

**Interfaces:**
- Produz: `resolveNodeTheme(node: Pick<JourneyNode, 'theme'>, unit?: Pick<JourneyUnit, 'theme'>): IllustrationTheme`.
  Ordem: `node.theme`, depois `unit.theme` se for um dos `ILLUSTRATION_THEMES`,
  depois `'radiacao'`.

- [ ] **Passo 1: Escrever o teste que falha**

Três casos: nó com `theme: 'tubo'` devolve `'tubo'`; nó sem tema numa unidade
com `theme: 'tomografia'` devolve `'tomografia'`; unidade com
`theme: 'qualquer-coisa'` devolve `'radiacao'`.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/journey/services/resolveNodeTheme.test.ts`
Expected: FAIL, módulo inexistente.

- [ ] **Passo 3: Implementar**

`unit.theme` é `string` livre em `JourneyUnitDefinition`; confira contra
`ILLUSTRATION_THEMES` antes de aceitar.

- [ ] **Passo 4: Ver passar, com o typecheck**

Run: `cd radiant-app && npx jest src/features/journey/services/resolveNodeTheme.test.ts && npm run typecheck`
Expected: PASS e zero erro.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/types/journey.ts radiant-app/src/features/journey/services/resolveNodeTheme.ts radiant-app/src/features/journey/services/resolveNodeTheme.test.ts
git commit -m "feat(trilha): tema de ilustração por nó, com queda para a unidade"
```

### Tarefa 2: Estrelas por aula

**Arquivos:**
- Criar: `radiant-app/src/features/journey/services/JourneyStarsService.ts`
- Testar: `radiant-app/src/features/journey/services/JourneyStarsService.test.ts`

**Interfaces:**
- Consome: `LearningAttemptsRepository.getAll(): Promise<LearningAttempt[]>` e
  `resolveLessonStars(correct, total): LessonStars`.
- Produz: `JourneyStarsService.getRecordStarsByLessonId(): Promise<Record<string, LessonStars>>`,
  o recorde de cada `lessonId` entre todas as tentativas. Aula sem tentativa não
  tem chave.

- [ ] **Passo 1: Escrever o teste que falha**

Com tentativas `{lessonId:'a', 2 de 3}`, `{lessonId:'a', 3 de 3}` e
`{lessonId:'b', 1 de 3}`, devolve `{ a: 3, b: 1 }`. Sem tentativas, `{}`.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/journey/services/JourneyStarsService.test.ts`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

- [ ] **Passo 4: Ver passar**

Run: o mesmo do passo 2. Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/features/journey/services/JourneyStarsService.ts radiant-app/src/features/journey/services/JourneyStarsService.test.ts
git commit -m "feat(trilha): recorde de estrelas por aula para as medalhas"
```

### Tarefa 3: A medalha

**Arquivos:**
- Criar: `radiant-app/src/features/journey/components/JourneyMedal.tsx`
- Modificar: `radiant-app/src/ui/motion.ts`, com `useMedalPulse`
- Modificar: `radiant-app/src/ui/theme.ts`, com `medalColors.silver`
- Testar: `radiant-app/src/features/journey/components/JourneyMedal.test.tsx`

**Interfaces:**
- Consome: `medalColors`, `depth`, `ThemeIllustration` (plano 1), `resolveNodeTheme`.
- Produz:
  - `type MedalState = 'done' | 'next' | 'locked'`;
  - `medalStateFor(node: JourneyNode, isRecommended: boolean): MedalState`:
    `completed → done`; recomendado → `next`; `locked` → `locked`; `available`,
    `active`, `resumable` e `due-review` não recomendados → `next` sem anel;
  - `JourneyMedal(props: { node: Pick<JourneyNode, 'id' | 'type'>; theme: IllustrationTheme; state: MedalState; pulsing: boolean; stars?: LessonStars; size?: number; onPress?: () => void; disabled?: boolean; accessibilityLabel: string }): React.ReactElement`.
    Sem `onPress`, desenha a mesma medalha sem botão, como imagem com o rótulo:
    é assim que o resultado e o Perfil do plano 5 a usam. `size` é o raio, com
    padrão 34;
  - `useMedalPulse(enabled: boolean): AnimatedStyle` em `motion.ts`: anel que
    vai de escala 1 a 1,18 e opacidade 0,5 a 0, em 1,6 s, repetido; parado e
    invisível com "reduzir movimento";
  - forma por tipo de nó: `lesson` é a medalha com `ThemeIllustration`;
    `review` é a medalha de raio 30 com o ícone de revisão desenhado;
    `checkpoint` é a medalha de prata com o número da unidade (os tons de prata
    entram em `medalColors.silver`: `#C9D1DE` / `#8E99AE` / `#B6BFCE`);
    `reward` é a medalha de ouro com a estrela.

- [ ] **Passo 1: Escrever os testes que falham**

- `medalStateFor` nos sete casos de status;
- `state="done"` com `stars=2` desenha três estrelas, duas cheias e uma vazia,
  e o rótulo termina em `"Concluída, 2 estrelas."`;
- `state="done"` sem `stars` não desenha estrela nenhuma;
- `state="locked"` passa `state="locked"` ao `ThemeIllustration` e o botão tem
  `accessibilityState.disabled`;
- só `pulsing` com `state="next"` monta o anel;
- o alvo de toque mede pelo menos 48 × 48.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/journey/components/JourneyMedal.test.tsx`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

Face, lábio e miolo como três círculos de `react-native-svg`, o lábio deslocado
`depth.medalLip` para baixo, a ilustração centrada no miolo com 72% do
diâmetro. Estrelas abaixo da medalha, na forma da prancheta (`star()` com raio
interno 0,45).

- [ ] **Passo 4: Ver passar, com o visual QA**

Run: `cd radiant-app && npx jest src/features/journey/components/JourneyMedal.test.tsx && npm run visual:qa:strict`
Expected: PASS e código 0.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/features/journey/components/JourneyMedal.tsx radiant-app/src/features/journey/components/JourneyMedal.test.tsx radiant-app/src/ui/motion.ts radiant-app/src/ui/theme.ts
git commit -m "feat(trilha): medalha com ilustração, estrelas e anel da próxima"
```

### Tarefa 4: Caminho em zigue-zague na `JourneyTrail`

**Arquivos:**
- Criar: `radiant-app/src/features/journey/components/trailLayout.ts`
- Criar: `radiant-app/src/features/journey/components/JourneyPathSegment.tsx`
- Modificar: `radiant-app/src/features/journey/components/JourneyTrail.tsx`
- Remover: `JourneyNodeCard.tsx`, `JourneyTrailSpine.tsx` e os testes deles,
  depois de mover para `JourneyMedal.test.tsx` e `JourneyTrail.test.tsx` o que
  eles garantiam e ainda vale
- Testar: `radiant-app/src/features/journey/components/trailLayout.test.ts` e
  `JourneyTrail.test.tsx`

**Interfaces:**
- Consome: `JourneyMedal`, `medalStateFor`, `resolveNodeTheme`.
- Produz:
  - `medalOffsetX(nodeIndex: number, halfWidth: number, column: boolean): number`,
    com o ciclo `[0, 0.22, 0.30, 0.22, 0, −0.22, −0.30, −0.22] × halfWidth`, e 0
    quando `column`;
  - `JourneyPathSegment(props: { fromX: number; toX: number; height: number; traveled: boolean }): React.ReactElement`,
    a curva pontilhada da lateral do nó anterior ao topo do seguinte, em
    `medalColors.unit.face` quando percorrida e `galaxyColors.surfaceMuted`
    quando não;
  - `JourneyTrail` ganha as props `starsByLessonId: Record<string, LessonStars>`
    e `pixelSlot?: (nodeId: string) => React.ReactNode`, que a tarefa 6 usa
    para pôr o Pixel ao lado da próxima medalha. As props de hoje continuam.

- [ ] **Passo 1: Escrever os testes que falham**

- `medalOffsetX` nos índices 0 a 8 com `halfWidth=100`, e sempre 0 com `column`;
- a `JourneyTrail` com cinco nós desenha quatro `JourneyPathSegment`, os dois
  primeiros `traveled` quando o recomendado é o terceiro;
- a medalha do nó recomendado recebe `pulsing` e o rótulo `"<título>. Próximo passo."`;
- o rótulo da revisão devida continua `"Revisar <título>. Revisão devida · 2 devidas."`;
- a ancoragem no recomendado continua: `scrollToIndex` é chamado com o índice
  dele e `viewPosition: 0.5` (o teste de hoje em `JourneyTrail.test.tsx`).

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/journey/components`
Expected: FAIL nas asserções novas.

- [ ] **Passo 3: Implementar**

A linha de cada nó desenha primeiro o segmento que chega a ela (a partir do
deslocamento do nó anterior) e depois a medalha. As bandas de trilha e o
cabeçalho de unidade continuam itens da lista; o cabeçalho de unidade fica
sem etiqueta acima do título.

- [ ] **Passo 4: Ver passar, com testes de tela e Maestro**

Run: `cd radiant-app && npx jest src/features/journey && npm run test:maestro-contract`
Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/journey/components
git commit -m "feat(trilha): caminho de medalhas em zigue-zague no lugar dos cartões"
```

### Tarefa 5: Cabeçalho, linha de revisão e linha do lembrete

**Arquivos:**
- Modificar: `radiant-app/src/features/journey/components/JourneyStageHeader.tsx`
- Criar: `radiant-app/src/features/journey/components/JourneyReviewRow.tsx`
- Criar: `radiant-app/src/features/push/components/ReminderRow.tsx`
- Modificar: `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`
- Remover: `radiant-app/src/features/journey/components/JourneyRecommendationCard.tsx`
  e, se nada mais o usar, `radiant-app/src/features/push/components/PushOptInCard.tsx`
- Testar: os `.test.tsx` de cada componente e `JourneyHomeScreen.flow.test.tsx`

**Interfaces:**
- Consome: `PushService.getOptIn()`, `setOptIn(value)`,
  `requestPermissionIfNeeded()` e `scheduleDailyIfEligible({ reason })`.
- Produz:
  - `JourneyStageHeader({ title, completed, total })`, a mesma API, com o título
    em `typography.h3` e a barra "N de M" de 22 pt com o brilho da prancheta;
  - `JourneyReviewRow(props: { dueCount: number; onPress: () => void }): React.ReactElement | null`,
    que some com `dueCount === 0`, com o texto `"1 item para revisar"` ou
    `"N itens para revisar"` e a ação `"Revisar"`;
  - `ReminderRow(props: { visible: boolean }): React.ReactElement | null`, uma
    linha `"Lembrete diário"` com `Switch` nativo. Ligar chama `setOptIn(true)`,
    `requestPermissionIfNeeded()` e `scheduleDailyIfEligible({ reason: 'optin_immediate' })`;
    permissão negada devolve o interruptor a desligado. Desligar chama
    `setOptIn(false)`.

O horário não aparece no texto: o `PushService` sorteia a hora dentro de uma
janela, e "às 19h" prometeria o que ele não faz.

- [ ] **Passo 1: Escrever os testes que falham**

- `JourneyReviewRow` com 0, 1 e 2;
- `ReminderRow` ligando com permissão concedida e negada (mock do `PushService`);
- a tela não mostra mais cartão de recomendação; mostra o cabeçalho, a linha de
  revisão quando há revisão devida e a trilha; a linha do lembrete aparece só
  depois da primeira aula concluída, a mesma regra de hoje do convite.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/journey src/features/push`
Expected: FAIL nas asserções novas.

- [ ] **Passo 3: Implementar**

A linha de revisão abre o mesmo nó que o `HeartsSheet` abre hoje em
`onReview` (`dueReviewNode`). O texto de erro de carga troca "jornada" por
"trilha" ("Não foi possível carregar a trilha.").

- [ ] **Passo 4: Ver passar**

Run: `cd radiant-app && npx jest src/features/journey src/features/push && npm run test:maestro-contract`
Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/journey radiant-app/src/features/push/components
git commit -m "feat(trilha): cabeçalho da unidade, linha de revisão e lembrete em linha"
```

### Tarefa 6: O momento do Pixel

**Arquivos:**
- Criar: `radiant-app/src/features/journey/hooks/useTrailMoment.ts`
- Modificar: `radiant-app/src/ui/motion.ts`, com `useTrailMomentStyles`
- Modificar: `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`
- Testar: `radiant-app/src/features/journey/hooks/useTrailMoment.test.ts` e
  `JourneyHomeScreen.flow.test.tsx`

**Interfaces:**
- Consome: `PixelIllustration` com `variant="head"` (plano 6) e
  `JourneyTrail.pixelSlot` (tarefa 4).
- Produz:
  - `useTrailMoment(recommendedNodeId: string | undefined, completedIds: ReadonlySet<string>): { playing: boolean; fromNodeId?: string; toNodeId?: string; done: () => void }`.
    Toca quando o recomendado mudou desde o último foco **e** o anterior está em
    `completedIds`. Não toca na primeira leitura (sem anterior).
  - `useTrailMomentStyles(playing: boolean): { segment: AnimatedProps; pixel: AnimatedStyle; medal: AnimatedStyle; cta: AnimatedStyle }`,
    em sequência: o trecho acende em 300 ms, o Pixel desliza até o lado da
    medalha em 450 ms, a medalha faz a mola de 1 a 1,08 e volta, e o botão
    "Começar" entra em 250 ms. Com "reduzir movimento", tudo no estado final no
    primeiro quadro.

- [ ] **Passo 1: Escrever os testes que falham**

- primeira leitura com recomendado `a`: `playing` falso;
- recomendado muda de `a` para `b` com `a` concluído: `playing` verdadeiro, e
  depois de `done()`, falso;
- recomendado muda de `a` para `b` sem `a` concluído (o aluno abriu outra
  coisa): `playing` falso;
- na tela, o Pixel (cabeça, `size="sm"`) aparece ao lado da medalha
  recomendada, com o rosto `feliz`.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/journey`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

O "Começar" é um `AppButton` pequeno sob a medalha recomendada. Ele aparece
sempre; o momento só anima a entrada dele. Ele chama o mesmo `openNode` da
medalha.

- [ ] **Passo 4: Ver passar, com o gate**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`
Expected: código 0.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/journey radiant-app/src/ui/motion.ts
git commit -m "feat(trilha): o Pixel percorre o caminho até a próxima aula"
```

### Tarefa 7: Medição e evidência

**Arquivos:**
- Criar: `docs/evidence/<data>-trilha-medalhao.md` e a pasta de capturas

- [ ] **Passo 1: Simulador iOS**

Capture a trilha na abertura, depois de concluir uma aula (o momento, em três
quadros), com "reduzir movimento" e com o maior tamanho de texto.

- [ ] **Passo 2: AVD de entrada**

No `radiant-entrada-api34`, com o medidor do G6 (PR #59), role a trilha de
ponta a ponta com as medalhas visíveis. Registre fps médio e o pior quadro.
Esta é também a remedição de quadros com rolagem que ficou do plano 1 (R22).
Rode com a tela do Mac desbloqueada.

- [ ] **Passo 3: Rodar os roteiros Maestro da trilha**

Run: `maestro test .maestro/radiant-1-4-primeira-execucao.yaml .maestro/radiant-1-4-segundo-dia.yaml .maestro/radiant-1-4-vidas-esgotadas.yaml`
Expected: os três passam.

- [ ] **Passo 4: Escrever a evidência e fazer commit**

```bash
git add docs/evidence/
git commit -m "docs(trilha): evidência da trilha Medalhão no simulador e no AVD"
```
