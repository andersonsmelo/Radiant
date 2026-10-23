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

- [x] **Passo 1: Escrever os testes que falham**

- primeira leitura com recomendado `a`: `playing` falso;
- recomendado muda de `a` para `b` com `a` concluído: `playing` verdadeiro, e
  depois de `done()`, falso;
- recomendado muda de `a` para `b` sem `a` concluído (o aluno abriu outra
  coisa): `playing` falso;
- na tela, o Pixel (cabeça, `size="sm"`) aparece ao lado da medalha
  recomendada, com o rosto `feliz`.

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/journey`
Expected: FAIL.

- [x] **Passo 3: Implementar**

O "Começar" é um `AppButton` pequeno sob a medalha recomendada. Ele aparece
sempre; o momento só anima a entrada dele. Ele chama o mesmo `openNode` da
medalha.

- [x] **Passo 4: Ver passar, com o gate**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`
Expected: código 0.

- [x] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/journey radiant-app/src/ui/motion.ts
git commit -m "feat(trilha): o Pixel percorre o caminho até a próxima aula"
```

### Tarefa 7: Medição e evidência

**Arquivos:**
- Criar: `docs/evidence/<data>-trilha-medalhao.md` e a pasta de capturas

- [x] **Passo 1: Simulador iOS** (2026-10-22/23; revisão integral em 2026-10-23, com achado de texto máximo, ver retomada)

Capture a trilha na abertura, depois de concluir uma aula (o momento, em três
quadros), com "reduzir movimento" e com o maior tamanho de texto.

- [x] **Passo 2: AVD de entrada** (2026-10-23, 40 concluídas no Storybook, três rodadas)

No `radiant-entrada-api34`, com o medidor do G6 (PR #59), role a trilha de
ponta a ponta com as medalhas visíveis. Registre fps médio e o pior quadro.
Esta é também a remedição de quadros com rolagem que ficou do plano 1 (R22).
Rode com a tela do Mac desbloqueada.

- [ ] **Passo 3: Rodar os roteiros Maestro da trilha** (primeira execução e vidas iOS PASS em 2026-10-22; segundo dia Android PASS integral em 2026-10-23; o segundo dia iOS só vence em 30/10/2026)

Run: `maestro test .maestro/radiant-1-4-primeira-execucao.yaml .maestro/radiant-1-4-segundo-dia.yaml .maestro/radiant-1-4-vidas-esgotadas.yaml`
Expected: os três passam.

- [x] **Passo 4: Escrever a evidência e fazer commit** ([retomada](../../evidence/2026-10-23-trilha-medalhao-retomada.md))

```bash
git add docs/evidence/
git commit -m "docs(trilha): evidência da trilha Medalhão no simulador e no AVD"
```

---

## Registro de execução (2026-10-22)

**Estado:**
- **Tarefas 0 a 5:** concluídas e revisadas.
- **Tarefa 6:** implementada e revisada em 2026-10-22; gate completo aprovado no segundo run (15/15), após corrigir o mock consumidor. Prova nativa é da tarefa 7.
- **Tarefa 7:** coleta parcial em 2026-10-22/23; correções implementadas, aceite nativo pendente. Pausa solicitada pelo dono em 2026-10-23; ver o adendo final abaixo.
- **Revisão final:** fonte corrigida com parecer favorável; pacote nativo e aprovação integral pendentes. O histórico abaixo conserva os achados que motivaram a onda.

Execução com subagentes: um implementador e um revisor por tarefa.

| Tarefa | Commits | Observação |
| --- | --- | --- |
| 0 | `e10a553` | `runtimeVersion: { "policy": "fingerprint" }`, decidido pelo dono em 2026-10-21 |
| 1, 2 | `6d968ed`, `6b916f6` | tema por nó; recorde de estrelas por aula |
| 3 | `4dd5229` | `JourneyMedal`, `nodeCopy.ts`, `medalColors.silver` |
| 4 | `f04171f`, `2ca3839` | caminho de medalhas; uma rodada de correção (geometria) |
| 5 | `318df2e`, `a8f5dd9` | cabeçalho, linha de revisão, lembrete e estrelas na tela; uma rodada de correção (barra) |
| 6 | base `5ffefee`, reaplicada sobre `453d7a4` | implementada e aprovada pela revisão independente em 2026-10-22; 15/15 validadores no segundo run, com ajuste mínimo do mock consumidor |

**Decisões que mudam ou completam o texto do plano.** Elas valem para quem
continuar:
- **Rótulos (tarefa 3):** o rótulo da medalha continua exatamente
  `"<título>. <estado>."`, com a copy de hoje ("Concluído", "Próximo passo",
  "Revisão devida · N devidas", "Disponível em …"). As estrelas vão em
  `accessibilityValue` ("2 estrelas", "1 estrela", "0 estrelas"). O exemplo
  "Concluída, 2 estrelas." do plano quebraria os roteiros Maestro.
- **Copy dos nós (tarefa 3):** `getStatusCopy` e `getRecommendationCopy` moram
  em `src/features/journey/components/nodeCopy.ts`. O `maestro-contract` lê
  esse arquivo.
- **Estrelas (tarefa 3):** sem tentativa registrada, nenhuma estrela; com
  tentativa sem acerto, três vazias.
- **Geometria (tarefa 4):** **o ciclo de deslocamento do plano foi trocado.**
  As medalhas alternam esquerda e direita a ±0,35 da meia-largura, como pedem a
  spec §4 e a prancheta. O pontilhado sai da lateral da medalha, na altura do
  centro, e desce até o topo da seguinte, em duas peças (uma por linha da
  `FlatList`) alinhadas no mesmo x. Os títulos ficam sob a medalha, em até 2
  linhas. Os pontos são redondos (`"1 18"`, espessura 10).
- **Altura da trilha (tarefa 4):** o passo entre medalhas é de 135 a 175 pt,
  maior que o da prancheta. Foi aceito, porque compactar exigiria sobrepor
  linhas virtualizadas. Vai para o dono.
- **Barra de progresso (tarefa 5):** azul `actionPrimary`, com a faixa clara
  interna da prancheta e sem sombra. O "N de M" fica em minúsculas, branco, a
  5,75:1 sobre o azul e 13,55:1 sobre o trilho.
- **Estrelas na tela (tarefa 5):** carregadas no mesmo `Promise.all` da tela.
  Se a leitura falhar, a trilha abre sem estrelas.
- **`PushOptInCard`:** fica no repositório, porque a `HomeScreen` antiga o usa.
  Só deixou de ser montado em Estude.
- **O cartão de recomendação sai na tarefa 6, não na 5.** Sete roteiros Maestro
  tocam "Continuar jornada" e o testID `journey-recommendation-action`. O botão
  sob a medalha recomendada herda esse testID e a copy de ação do cartão, que
  vai para `nodeCopy.ts`. O `maestro-contract` passa a ler a nova fonte. Trocar
  o texto "Continuar jornada" é do plano 5, junto com os YAMLs.
- **Escopo:** o Loop não amplia o escopo de um run aberto. Quando um arquivo
  fora do escopo precisou mudar, o run foi fechado sem validar e reaberto
  declarando tudo.

**Tarefa 6, retomada em 2026-10-22:**
- O diff inteiro do WIP `5ffefee` foi lido e reaplicado por arquivo sobre
  `453d7a4`, dentro do run `run-1792669270895-535089fb`.
- O Pixel percorre o pontilhado; na coluna de texto grande parte da cauda
  desenhada depois do título da origem, com o apoio alinhado ao Path. O momento
  espera as medidas nativas da origem adjacente
  e do destino virtualizado antes de gastar o tempo. A rota fica fixa depois
  da partida, para uma medição posterior não reposicionar a cabeça.
- A revisão da tarefa 6 resolveu a expressão "faz a mola" do plano a favor
  da spec §4 (o nó cresce) e do DESIGN (mola só na cunhagem): ficam os dois
  `withTiming` de crescimento e assentamento, sem spring nova. A mesma
  revisão corrigiu a partida da coluna, que antes passava pelo título; o teste
  compara o apoio da cabeça ao primeiro ponto do `Path` realmente desenhado.
- O `AppButton` sob a recomendada preserva `journey-recommendation-action`,
  as palavras de ação atuais e o mesmo `openNode` da medalha. O cartão saiu;
  a fonte do `maestro-contract` foi reapontada por AST.
- Primeira leitura, foco repetido e mudança sem conclusão não tocam o momento.
  "Reduzir movimento" chega ao estado final imediatamente, sem esperar layout.
- O helper `getAnimatedStyle` ficou só em `src/test/readMotionStyle.ts`, sem
  dependência de teste no módulo de animação do app. A política do visual QA
  não mudou. Na retomada, o `visual:qa:strict` já retornou zero regressões;
  a falha relatada no handoff não foi reproduzida.
- Evidência vermelha e verde:
  [tarefa 6](../../evidence/2026-10-22-trilha-medalhao-t6.md).
  **Gate final aprovado: 15/15 validadores no segundo run.** A revisão
  independente inicial encontrou um P2 da coluna, corrigido e conferido pelo
  controlador. A releitura independente foi retomada e aprovou a correção em
  spec, qualidade e movimento. Rasterização e ocupação do retângulo inteiro
  da cabeça de 48 pt com texto grande vão para a tarefa 7; alinhamento do apoio
  ao Path não prova ausência de sobreposição.
- O primeiro gate completo reprovou em 2026-10-22: 13/15 validadores passaram;
  os dois do app encontraram os mesmos três testes de retomada com dublê da
  trilha que descartava `recommendedAction`. O consumidor é um 18º arquivo,
  fora do run original. O primeiro run `run-1792669270895-535089fb` fechou
  sem sucesso, e o produto foi preservado em WIP local limpo. O segundo run,
  `run-1792685891709-af8000bd`, declarou 18 arquivos, ajustou só o encaminhamento
  da prop no mock e passou os 15 validadores. Sua baseline já contém o produto.
- O Pixel é `PixelIllustration variant="head" size="sm" expression="feliz"`
  no `pixelSlot`. A conferência de sua captura nativa a 48 pt é da tarefa 7.

**Pendências antes do merge (corrigir na revisão final do plano):**
- a faixa clara da barra passa sob o "N de M" e baixa o contraste do número
  para cerca de 3,4:1 quando o preenchimento passa de ~60%;
- a faixa usa `pixelColors.coat.light`; deve usar
  `semanticColors.galaxy.textOnAccent`.

**Menores que ficam:**
- `types/journey.ts` importa um tipo da camada de UI (`illustrationPlayback`);
- os raios das medalhas estão duplicados entre `trailLayout.ts` e
  `JourneyMedal.tsx`;
- a peça de saída do pontilhado aparece um quadro depois da linha;
- o título mede a meia-largura antes do `onLayout`;
- o teste de "reduzir movimento" do anel não prova o comportamento no
  aparelho;
- os glifos claros sobre o ouro (~1,8:1, decorativos);
- `medalStateFor` não tem caso para nó bloqueado e recomendado;
- o interruptor do lembrete reflete o opt-in salvo, não a permissão do sistema;
- duas leituras de permissão ao ligar o lembrete;
- o comentário de `src/config/appVersion.contract.test.ts:11-12` e
  `docs/store/EAS_SUBMIT_SETUP.md:110-111` ainda falam da política
  `appVersion`.

**Para o dono:**
- Com `fingerprint`, um `eas update` comum não chega mais ao binário 1.4.0 da
  loja. Uma correção OTA para ele exige publicar com o runtime `1.4.0`
  explícito.
- A linha do lembrete é um rodapé fixo e ocupa cerca de 60 pt da área da
  trilha.
- Uma banda ou um cabeçalho de unidade entre dois nós interrompe o pontilhado.


**Tarefa 7, coleta em 2026-10-22 (Codex):**
- Fonte `76158274b0f253e56467a3a61a6370ff2b9f6f97`, run documental
  `run-1792686789421-4d7b1961`, 25 arquivos declarados. O agente de preflight
  esgotou a quota antes de executar; o controlador realizou a coleta.
- Reutilizados dev clients Debug 1.4.0 (3) com Skia e Metro deste worktree.
  Sem build, EAS, merge, loja ou alteração de dados/relógio. O simulador de
  dia 2 recebeu o binário compatível sem desinstalar/limpar seu container.
- Capturas iOS na abertura, vídeo real de retorno e três quadros, dois PNGs
  idênticos sob movimento reduzido e texto máximo. **Não aprovam o momento**:
  a cabeça 48×46 está montada em x=-249,75 pt, fora do viewport. A medida
  nativa sustenta que `right: '100%'` está resolvendo contra a linha de 370 pt,
  não a medalha de 80 pt. Android também sem cabeça visível. A correção exige
  nova prova nativa, incluindo coluna e clipping entre células.
- Maestro canônico: primeira execução PASS; segundo dia PASS na terceira
  tentativa, após vencer naturalmente a revisão22/10 às13h56 no mesmo
  simulador (as duas tentativas anteriores eram prematuras); vidas FAIL ao tocar L1 concluída sob o HUD. Probe
  complementar com centralização PASS abriu a L1, sem aprovar vidas esgotadas.
- Android: trilha real de 57 nós, três desbloqueados. Três rodadas de ponta a
  ponta e volta com HWUI estimaram 59,919 / 59,925 / 59,879 FPS; pior quadro
  preservado 67,185 ms. Depois de excluir linhas transitórias inválidas, a coleta tem uma linha
  válida por rodada a menos que o total; a causa não foi estabelecida. Não
  declarar pior quadro absoluto nem cenário de 40 medalhas desbloqueadas.
  O medidor G6 mede dados/abertura, não FPS contínuo; não foi usado para
  inventar taxa de rolagem.
- [Evidência e limites completos](../../evidence/2026-10-22-trilha-medalhao.md).
  Apps, simuladores, AVD e Metro encerrados antes da validação configurada.
- **Tarefa 7 não aprovada funcionalmente; Plano 2 não concluído.** A revisão
  forte preliminar confirmou cinco itens além do achado nativo: cabeça inteira
  invade título na coluna; medalhas fora do viewport seguem animando; data da
  revisão futura só no label acessível; faixa reduz contraste a 3,368:1;
  faixa usa token do jaleco. A altura em cache na transição continua lacuna
  de prova. Tratar tudo na onda única final, com vermelho/verde específico,
  evidência nativa remediada e revisão independente final.

- Gate documental T7: **15/15**, `VALIDATION_PASSED`; após ajustes da revisão,
  docs-contract **18/18 + PASS**. Revisão independente forte aprovou o registro
  negativo (métricas, vídeo, hashes e logs), **sem aprovar o Plano 2**. O
  fechamento do writer segue a CLI pública; sessão de cérebro T7 `closed`.


## Pausa e correção final — 2026-10-23

O dono pediu encerrar a implementação/coleta e deixar documentação e prompt
versionados. **Não marcar o Plano 2 ou a tarefa 7 como concluídos.** O histórico
acima descreve a medição anterior; o estado atual está no STATUS e nesta
[evidência consolidada](../../evidence/2026-10-22-trilha-medalhao-final.md).

A onda corrigiu os seis achados iniciais e os três P2 da revisão integral:
largura da data, reconciliação do lembrete após falha e topologia real
L1 → revisão futura → L2. O percurso agora espera medidas atuais/positivas de
todas as linhas e contorna os nós intermediários. Corredores permanentes64pt
na coluna e reserva inferior31pt no zigue-zague foram considerados compatíveis
com a spec, preservando fonte e texto integral, sem reflow ao fim do momento.
A faixa usa `textOnAccent` e evita o retângulo medido do contador (5,75:1).

Vermelhos específicos e verdes foram preservados: 8 suítes/260 testes focais;
lembrete13/13; contrato Maestro final37/37; typecheck/lint passaram. A revisão
forte conferiu a fonte congelada e não confirmou novo P1/P2. Isso não substitui
a aprovação nativa nem o gate configurado de fechamento.

- iOS normal: vídeo e três quadros provam cabeça inteira atravessando a área
  de outra célula, contorno visível e chegada. L1 está acima da janela pela
  ancoragem existente; sua partida é prova de fonte/geometria, não da câmera.
- Movimento reduzido e texto máximo iOS: coletas completas preservadas; falta
  revisão independente integral. O vídeo iOS contém normal seguido de máximo.
- Android: texto200% e cabeça48×45,818dp registrados. Vídeo do momento
  inconclusivo:142quadros/19,5985s e lacuna1,785622s na transição; causa não
  estabelecida. Medir âncora, ready/holding, scroll, slot e onDone com timestamps
  antes de decidir qualquer patch. Não aumentar a duração para fabricar PASS.
- Primeira execução e vidas iOS: PASS completos. Segundo dia Android: FAIL
  somente na assert final do roteiro anterior, após revisão3/3 e retorno.
  Corrigidos espera pela trilha e scrollUP100% com500ms de assentamento,
  preservando a regex completa. Contrato37/37 e checkpoint complementarPASS;
  **fullrerun do YAML corrigido ainda depende de revisão naturalmente devida**.
- Storybook `Trilha/JourneyTrail/QuarentaConcluidas` prepara40nós sintéticos
  concluídos com cinco temas, sem ler/escrever progresso. Benchmark e prova
  de playback nativo fora do viewport não foram executados nesse cenário.
- Planos 3 e5 não iniciados; Plano 4 não escrito e depende do3. Nenhuma remoção,
  build, EAS, merge ou ação de loja está autorizada por esta pausa.

O writer atual declara57arquivos; duas janelas anteriores fecharam sem
validação apenas para ampliar o escopo. Nenhum lock foi contornado. O resultado
do gate e o fechamento estão na evidência. Sessão do cérebro já encerrada;
nenhuma memória nova foi gravada nesta onda. Reabrir contexto/sessão e writer
para o próximo objetivo, depois de reconciliar a árvore e o remoto.

Prompt completo: [continuidade](2026-10-21-trilha-medalhao-indice.md#prompt-de-continuidade--pausa-de-2026-10-23).

## Retomada — 2026-10-23

Writer `run-1792757625819-e00263ec`, a partir do WIP `8ad10e8`. Medições e
limites na [evidência da retomada](../../evidence/2026-10-23-trilha-medalhao-retomada.md).
**Passos 1, 2 e 4 da tarefa 7 executados; no passo 3, falta o segundo dia
iOS (30/10/2026). O Plano 2 não está aceito:** falta a decisão do dono sobre o
texto máximo (item 3 abaixo).

1. **Segundo dia integral, Android:** PASS em relógio real, com o YAML
   corrigido, sem editar relógio, store ou snapshot. O simulador iOS reservado
   tem revisão só em 30/10/2026 às 14:07.
2. **Momento Android:** a lacuna de 2026-10-22 era da gravação
   (`adb shell screenrecord` emite quadro só quando a tela muda). Com o
   gravador do emulador a 60 fps e uma linha do tempo instrumentada, o
   percurso aparece completo: âncora antes da partida, cabeça inteira entrando
   pelo topo e chegada com o botão. Isso revelou outro defeito: em 2 de 4
   gravações sem instrumentação, aparece um quadro do estado final antes do
   percurso. Houve um **conserto parcial** em `useTrailMomentStyles`, com o
   vermelho específico: durante a espera, as camadas guardam o começo; o Pixel
   sem rota só aparece no fim; e a rota de um momento anterior é descartada.
   **O quadro continua** em 1 de 4 gravações com o conserto. Com logs, o
   defeito some (0 de 10), e a causa restante não foi observada. O próximo
   instrumento é o rastreamento nativo sem log JS.
3. **Texto máximo (AX5 e Android a 200%):** a cabeça está inteira, mas o
   texto da coluna quebra no meio da palavra ("Princípio / s", "24/10/20 / 26",
   "Com / putadorizada"), e "Lembrete diário" sai cortado no Android. A causa
   provável é a largura que sobra entre os corredores de 64 pt. **Decisão do
   dono:** os corredores e a fonte integral não foram mexidos, porque o prompt
   da retomada manda preservá-los.
4. **40 concluídas:** um contador nativo no thread de UI prova que só as
   medalhas com corpo visível avançam quadros, nenhuma fora do conjunto. Três
   rodadas sem instrumentação deram ≈59,7 quadros/s, jank de 0,11–0,50% no
   gfxinfo e pior quadro de 50 ms, em emulador Debug.
5. **Achado à parte:** o bundle do Storybook não monta na branch nem na
   `main`, porque duas stories importam `lesson-xray-panel.png`, que não existe.

**CI da PR #66 (2026-10-23):** reprovou em `ef40365` por tempo-limite do Jest
em "percorre L1 → revisão futura → L2". Os testes de fluxo do momento esperam
a animação em relógio real: a primeira renderização, a volta à tela e o
momento inteiro, às vezes duas vezes. A soma passa dos 5 s padrão do Jest, e o
fim do momento só começa a contar depois que a trilha re-renderiza com a
medida. Com `taskpolicy -b`, 3 dos 5 testes reprovavam, entre 5,9 e 8,2 s.

O `37e7688` mudou só o teste:
- a espera do fim passou a `TRAIL_MOMENT_MS + FIRST_RENDER_TIMEOUT_MS`;
- cada teste ganhou um prazo que cobre as próprias esperas.

Os 5 passam com a CPU limitada. Com o fim do momento desligado em `motion.ts`,
"acaba sozinho" continua reprovando. CI verde em `37e7688`.

