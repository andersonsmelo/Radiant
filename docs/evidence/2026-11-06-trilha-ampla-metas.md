# Trilha ampla: metas e progresso (frente D), 2026-11-06

Evidência da frente D do [plano de trilha ampla](../plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md),
mais duas tarefas pedidas pelo controlador no mesmo dia: os itens de recuperação na fila de
revisão e a conferência do confete. Tudo abaixo foi medido em 2026-11-06, no Node 20.20.2, na
worktree `trilha-2026-10-20`, com testes focados. **Nada foi visto em simulador nem em aparelho.**

## O que foi construído

| Peça | Arquivo | O que faz |
|---|---|---|
| Nível por XP | `gamification/services/levelFromXp.ts` | `levelFromXp(xp)` devolve `{ level, title, xpIntoLevel, xpForNext }`. Sair do nível N custa 20 × N XP; o nível L começa em 10 × L × (L − 1): 2 em 20, 3 em 60, 4 em 120, 5 em 200, 10 em 900. Doze títulos sobre o caminho de estudo. |
| Selo de nível | `gamification/components/LevelBadge.tsx` | Linha com número, título e barra. Na trilha fica sob o HUD e dispara `level_up` uma vez por subida; no Perfil só mostra. |
| Proteção de sequência | `gamification/services/StreakFreezeService.ts` | Regra pura `advanceStreak` e store `@radiant:streak_freeze_v1`. Uma proteção a cada 7 dias de sequência, teto de 2; um dia perdido gasta uma; dois ou mais recomeçam em 1. Ligada em `GamificationService.updateStreak`, o único lugar que calcula a sequência. |
| Missões do dia | `missions/services/DailyMissionsService.ts` | Três por dia local, de quatro famílias (aula, acertos, revisão, meta). Progresso lido do diário de respostas (`itemReviewRepository.getAttempts()`) e da meta diária. Bônus de 5 XP por missão, uma vez, com a marca gravada antes do crédito. |
| Tela e entrada | `missions/screens/MissionsScreen.tsx`, `app/missions.tsx`, `missions/components/DailyMissionsCard.tsx` | Rota `/missions`; entrada em linha na Estude (cabeçalho da trilha) e no Perfil. |
| Comemoração de unidade | `journey/components/UnitCompleteCelebration.tsx` | Confete, medalha, uma frase e "Continuar", uma vez por unidade (store `@radiant:unit_celebrations_v1`), com `unit_complete`. |
| Recuperação na revisão | `spaced-repetition/services/ItemReviewService.ts`, `student-checkpoints/AssessmentAttemptRepository.ts` | Conferência reprovada da trilha rtg-2026 semeia os dois itens de recuperação da aula como cartões de revisão. |

### Decisões que mudam o que o aluno vê

- **A tela de missões antiga não voltou como era.** Ela saiu do Perfil na T09 do Medalhão
  (etiquetas em caixa alta, cartão laranja, vidas repetidas do HUD, travessão com espaços). A rota
  nova usa o mesmo arquivo, reescrito em linhas, e mantém a observação inerte `useShadowCheckpoint`
  que `screen-integrations.test.ts` exige.
- **Sem revisão disponível, o dia não pede revisão.** As missões são fixadas na primeira leitura do
  dia; uma revisão que vence mais tarde não troca as já mostradas.
- **Unidade concluída é aula e conferência concluídas**, sem esperar a conquista. Na primeira
  leitura do store, as unidades já concluídas viram a base sem festa: quem atualiza o app não vê a
  comemoração do que já tinha feito.
- **Recuperação: o item guiado vence na hora e o de transferência no dia seguinte.** É a regra de
  `seedLegacyGroups`, que eu não podia editar. A semente roda antes do diário da conferência,
  porque `seedLegacyGroups` pula a lição que já tem cartão.

### Defeito antigo encontrado e consertado no caminho

`GamificationService.updateStreak` passava a chave `AAAA-MM-DD` por `new Date(...)`, que é UTC. Em
fuso negativo (Brasília, UTC−3) o "dia seguinte" calculado saía igual ao último dia ativo, e a
sequência **nunca passava de 1**. Não havia teste de sequência no serviço. O vermelho abaixo é
natural: o teste novo falhou contra o código antigo, nesta máquina, que está em −03. No CI, que roda
em UTC, o mesmo teste teria passado contra o código antigo; a regra nova compara chaves de
calendário e não depende de fuso.

```
● GamificationService: sequência com proteção › dias seguidos somam na sequência, em qualquer fuso (à noite, no horário de Brasília)
    expect(received).toMatchObject(expected)
      Object {
        "lastActiveDate": "2026-11-05",
    -   "streakDays": 2,
    +   "streakDays": 1,
      }
```

## Chaves novas do AsyncStorage

Todas com `schemaVersion: 1` e recusa de escrita sobre versão desconhecida, no inventário do G7:

| Chave | Classe | Conteúdo |
|---|---|---|
| `@radiant:streak_freeze_v1` | economia | `{ schemaVersion, freezes }` |
| `@radiant:daily_missions_v1` | economia | `{ schemaVersion, dateKey, missionIds, rewarded }` |
| `@radiant:unit_celebrations_v1` | controle | `{ schemaVersion, unitIds }` |

Com versão desconhecida: as proteções valem zero, as missões aparecem sem pagar bônus e a
comemoração não toca. Em nenhum dos três casos o store é regravado.

## Confete (`components/ui/Confetti.tsx`)

Conferido, sem mudança. O confete cai de 2 a 3,5 s, mas é desenhado numa camada com
`pointerEvents="none"` e nenhum código espera por ele: `RewardScreen` e `CheckpointScreen` montam o
resumo no mesmo quadro (`run={rewardCompleted}` e `run={completed}`, sem temporizador ligado à
queda). Não bloqueia toque nem atrasa o resumo. Com "reduzir movimento" ele não é montado.

## Execuções vermelhas

Três vermelhos foram naturais (teste escrito antes do código): a sequência acima e os dois da
recuperação. Os demais foram produzidos por injeção, um defeito por vez, com âncora única no arquivo
(contagem igual a 1 exigida pelo roteiro), o teste que nomeia o defeito, e o arquivo restaurado e
conferido por hash depois de cada execução.

### Recuperação, vermelho natural

Comando: `npx jest src/features/student-checkpoints/AssessmentAttemptRepository.test.ts -t "recuperação depois"`,
antes de qualquer mudança em `AssessmentAttemptRepository.ts` (só com `reviewCatalog` exportado).

```
● ... › semeia os dois itens de recuperação como cartões sem tentativa: o guiado vence na hora e a transferência no dia seguinte
    - Expected  - 12
    + Received  +  1
    - Array [ Array [ "guided-practice", "2026-10-12T12:00:01.000Z", null ], Array [ "applied-transfer", "2026-10-13T12:00:01.000Z", null ] ]
    + Array []
● ... › na trilha rtg-2026 a fila de revisão entrega a pergunta guiada daquela aula logo depois da reprovação
    Expected value: "A ficha da simulação informa o objetivo, mas usa um termo que você não conhece. Antes de mexer nos controles, o que ajuda a definir a sua tarefa?"
    Received array: []
Tests:       2 failed, 14 skipped, 1 passed, 17 total
```

### Recuperação, por injeção (o terceiro teste passava antes do código, por afirmar ausência)

- `if (!attempt.passed) await this.seedRecovery(attempt);` trocado por `await this.seedRecovery(attempt);`:
  `conferência aprovada não semeia recuperação...` falhou com `+ "recovery:guided-practice", + "recovery:applied-transfer"`.
- o `catch` de `seedRecovery` trocado por `catch (error) { throw error; }`: o mesmo teste falhou com
  `catalog-unavailable` na linha da tentativa reprovada.

### Frente D, por injeção

### D01 custo de nível deixa de crescer
- arquivo `src/features/gamification/services/levelFromXp.ts`
- trecho `return (COST_STEP / 2) * level * (level - 1);` trocado por `return COST_STEP * (level - 1);`
- comando: `npx jest src/features/gamification/services/levelFromXp.test.ts -t "limiar"`

```
● levelFromXp › sobe exatamente no limiar, com custo crescente por nível
    expect(received).toEqual(expected) // deep equality
    - Expected  - 3
    + Received  + 3
    +   40,
    -   120,
    -   200,
Tests:       1 failed, 4 skipped, 5 total
```

### D02 XP negativo vira nível
- arquivo `src/features/gamification/services/levelFromXp.ts`
- trecho `Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0` trocado por `Number.isFinite(xp) ? Math.floor(xp) : 0`
- comando: `npx jest src/features/gamification/services/levelFromXp.test.ts -t "quebrado"`

```
● levelFromXp › começa no nível 1 com 0 XP e trata XP quebrado como zero
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   "xpIntoLevel": 0,
    +   "xpIntoLevel": -5,
Tests:       1 failed, 4 skipped, 5 total
```

### D03 título alega habilitação
- arquivo `src/features/gamification/services/levelFromXp.ts`
- trecho `'Trilha de ouro',` trocado por `'Especialista da trilha',`
- comando: `npx jest src/features/gamification/services/levelFromXp.test.ts -t "títulos"`

```
● levelFromXp › tem dez ou mais títulos distintos, em frase, sem alegar habilitação profissional
    expect(received).not.toMatch(expected)
    Expected pattern: not /habilitad|especialista|profissional|técnic|tecnólog|doutor|mestre|formad|certificad|diplomad/i
    Received string:      "Especialista da trilha"
Tests:       1 failed, 4 skipped, 5 total
```

### D04 proteção cobre dois dias perdidos
- arquivo `src/features/gamification/services/StreakFreezeService.ts`
- trecho `const usedFreeze = gap === 2 && stored > 0;` trocado por `const usedFreeze = gap >= 2 && stored > 0;`
- comando: `npx jest src/features/gamification/services/StreakFreezeService.test.ts -t "dois ou mais"`

```
● advanceStreak (regra pura da sequência) › dois ou mais dias perdidos recomeçam em 1 mesmo com duas proteções, que ficam guardadas
    expect(received).toMatchObject(expected)
    - Expected  - 2
    + Received  + 2
    -   "streakDays": 1,
    -   "usedFreeze": false,
    +   "streakDays": 21,
Tests:       1 failed, 8 skipped, 9 total
```

### D05 proteções passam do teto de 2
- arquivo `src/features/gamification/services/StreakFreezeService.ts`
- trecho `freezes: Math.min(MAX_STREAK_FREEZES, stored - (usedFreeze ? 1 : 0) + (earnedFreeze ? 1 : 0)),` trocado por `freezes: stored - (usedFreeze ? 1 : 0) + (earnedFreeze ? 1 : 0),`
- comando: `npx jest src/features/gamification/services/StreakFreezeService.test.ts -t "a cada 7"`

```
● advanceStreak (regra pura da sequência) › ganha uma proteção a cada 7 dias seguidos, até 2 guardadas
    expect(received).toMatchObject(expected)
    - Expected  - 1
    + Received  + 1
    -   "freezes": 2,
    +   "freezes": 3,
Tests:       1 failed, 8 skipped, 9 total
```

### D06 proteção grava sobre schemaVersion desconhecido
- arquivo `src/features/gamification/services/StreakFreezeService.ts`
- trecho `if (!rawHasUnknownSchemaVersion(raw, KNOWN_SCHEMA_VERSIONS)) {` trocado por `if (raw !== undefined) {`
- comando: `npx jest src/features/gamification/services/StreakFreezeService.test.ts -t "schemaVersion desconhecido"`

```
● StreakFreezeService (store) › não grava por cima de um store com schemaVersion desconhecido, e não usa as proteções dele
    expect(received).toMatchObject(expected)
    - Expected  - 2
    + Received  + 2
    -   "streakDays": 1,
    -   "usedFreeze": false,
    +   "streakDays": 8,
Tests:       1 failed, 8 skipped, 9 total
```

### D07 sequência ignora a proteção (serviço não integrado)
- arquivo `src/features/gamification/services/GamificationService.ts`
- trecho `store.streakDays = next.streakDays;` trocado por `store.streakDays = next.usedFreeze ? 1 : next.streakDays;`
- comando: `npx jest src/features/gamification/services/GamificationService.test.ts -t "um dia perdido gasta"`

```
● GamificationService: sequência com proteção › um dia perdido gasta a proteção ganha no sétimo dia; o segundo dia perdido recomeça a sequência
    expect(received).toBe(expected) // Object.is equality
    Expected: 8
    Received: 1
Tests:       1 failed, 5 skipped, 6 total
```

### D08 bônus de missão pago a cada leitura
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `mission.progress >= mission.goal && !store.rewarded.includes(mission.id)` trocado por `mission.progress >= mission.goal`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "uma única vez"`

```
● DailyMissionsCoordinator › paga o bônus de cada missão concluída uma única vez no dia, mesmo com leituras simultâneas
    expect(received).toBe(expected) // Object.is equality
    Expected: 0
    Received: 10
Tests:       1 failed, 10 skipped, 11 total
```

### D09 XP creditado antes de gravar a marca
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `await AsyncStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(next));` trocado por `void new Promise(resolve => setTimeout(resolve, 0)).then(() => AsyncStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(next)));`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "grava a marca antes"`

```
● DailyMissionsCoordinator › grava a marca antes de creditar: bônus que falha ao creditar não é pago em dobro depois
    expect(received).toEqual(expected) // deep equality
    - Expected  - 4
    + Received  + 1
    - Array [
    -   "aula-1",
    -   "seguidas-5",
Tests:       1 failed, 10 skipped, 11 total
```

### D10 missões gravam sobre schemaVersion desconhecido
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `writable = !rawHasUnknownSchemaVersion(raw, KNOWN_SCHEMA_VERSIONS);` trocado por `writable = true;`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "schemaVersion desconhecido"`

```
● DailyMissionsCoordinator › não grava por cima de um store com schemaVersion desconhecido, e sem poder marcar não paga bônus
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
Tests:       1 failed, 10 skipped, 11 total
```

### D11 registro ilegível derruba a leitura
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `this.ports.goal(now).catch(() => null),` trocado por `this.ports.goal(now),`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "não lê vale"`

```
● DailyMissionsCoordinator › registro que não lê vale progresso zero: nada conclui e nada é pago

Tests:       1 failed, 10 skipped, 11 total
```

### D12 erro não zera a sequência de acertos
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `run = attempt.firstOutcome === 'correct' ? run + 1 : 0;` trocado por `run = attempt.firstOutcome === 'correct' ? run + 1 : run;`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "maior sequência"`

```
● missionProgress › mede a maior sequência de acertos do dia pela ordem das respostas, e o erro zera a contagem
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   "progress": 4,
    +   "progress": 5,
Tests:       1 failed, 10 skipped, 11 total
```

### D13 respostas de ontem contam hoje
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `.filter(attempt => formatLocalDateKey(new Date(attempt.recordedAt)) === dateKey)` trocado por `(removido)`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "aulas distintas"`

```
● missionProgress › conta aulas distintas estudadas hoje, e não as de ontem nem revisão
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   "progress": 1,
    +   "progress": 2,
Tests:       1 failed, 10 skipped, 11 total
```

### D14 pede revisão sem revisão disponível
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `const skipped = reviewAvailable ? day % FAMILIES.length : REVIEW_FAMILY;` trocado por `const skipped = day % FAMILIES.length;`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "nunca pede revisão"`

```
● missionIdsForDay › sem revisão disponível, nunca pede revisão
    expect(received).not.toContain(expected) // indexOf
    Expected value: not "revisao"
    Received array:     ["aula-2", "acertos-10", "revisao"]
Tests:       1 failed, 10 skipped, 11 total
```

### D15 missões do dia trocam no meio do dia
- arquivo `src/features/missions/services/DailyMissionsService.ts`
- trecho `saved && saved.dateKey === dateKey ? saved` trocado por `saved && saved.dateKey === dateKey && saved.rewarded.length ? saved`
- comando: `npx jest src/features/missions/services/DailyMissionsService.test.ts -t "fixa as missões"`

```
● DailyMissionsCoordinator › fixa as missões na primeira leitura do dia e recomeça no dia seguinte
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   "meta",
    +   "revisao",
Tests:       1 failed, 10 skipped, 11 total
```

### D16 primeira leitura anunciada como subida
- arquivo `src/features/gamification/components/LevelBadge.tsx`
- trecho `if (lastLevel.current !== null && info.level > lastLevel.current) {` trocado por `if (info.level > (lastLevel.current ?? 1)) {`
- comando: `npx jest src/features/gamification/components/LevelBadge.test.tsx -t "nunca na primeira"`

```
● LevelBadge › anuncia a subida uma vez por nível, e nunca na primeira leitura
    expect(jest.fn()).not.toHaveBeenCalled()
    Expected number of calls: 0
    Received number of calls: 1
Tests:       1 failed, 2 skipped, 3 total
```

### D17 nível 1 mostrado sem XP lido
- arquivo `src/features/gamification/components/LevelBadge.tsx`
- trecho `if (!known) return null;` trocado por `(removido)`
- comando: `npx jest src/features/gamification/components/LevelBadge.test.tsx -t "sem XP lido"`

```
● LevelBadge › sem XP lido não mostra nível nenhum
    expect(received).toBeNull()
    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793966685567, "alternate": null, "child": [FiberNode], "childLanes": 0, "deletions": null, "dependencies": null, "elementType": "Text", "flags": 0, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": null, "stateNode": [Object], "subtreeFlags": 1048576, "tag": 5, "treeBaseDuration": 0, "type": "Text", "updateQueue": null}}
Tests:       1 failed, 2 skipped, 3 total
```

### D18 entrada conta todas como concluídas
- arquivo `src/features/missions/components/DailyMissionsCard.tsx`
- trecho `missions.filter(mission => mission.done).length` trocado por `missions.length`
- comando: `npx jest src/features/missions/components/DailyMissionsCard.test.tsx -t "conta as missões"`

```
● DailyMissionsCard › conta as missões concluídas e abre as missões ao toque
    Unable to find an element with text: 1 de 3 concluídas
Tests:       1 failed, 2 skipped, 3 total
```

### D19 unidade conclui sem a conferência
- arquivo `src/features/journey/components/UnitCompleteCelebration.tsx`
- trecho `node.type === 'lesson' || node.type === 'checkpoint'` trocado por `node.type === 'lesson'`
- comando: `npx jest src/features/journey/components/UnitCompleteCelebration.test.tsx -t "última conferência"`

```
● completedCelebrationUnits › conclui a unidade quando a última aula e a última conferência fecham, sem esperar a conquista
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 7
    - Array []
    + Array [
    +   Object {
Tests:       1 failed, 7 skipped, 8 total
```

### D20 comemoração repete a cada leitura
- arquivo `src/features/journey/components/UnitCompleteCelebration.tsx`
- trecho `const fresh = completed.filter(unit => !seen?.includes(unit.id));` trocado por `const fresh = [...completed];`
- comando: `npx jest src/features/journey/components/UnitCompleteCelebration.test.tsx -t "uma única vez"`

```
● takeUnitCelebration › comemora cada unidade uma única vez, e a marca fica gravada com schemaVersion
    expect(received).toBeNull()
    Received: {"id": "m01", "theme": undefined, "title": "Unidade m01"}
Tests:       1 failed, 7 skipped, 8 total
```

### D21 quem atualiza recebe a festa do que já tinha feito
- arquivo `src/features/journey/components/UnitCompleteCelebration.tsx`
- trecho `return seen ? fresh[fresh.length - 1] : null;` trocado por `return fresh[fresh.length - 1] ?? null;`
- comando: `npx jest src/features/journey/components/UnitCompleteCelebration.test.tsx -t "primeira leitura"`

```
● takeUnitCelebration › quem já tinha unidades concluídas na primeira leitura não recebe a comemoração delas
    expect(received).toBeNull()
    Received: {"id": "m01", "theme": undefined, "title": "Unidade m01"}
Tests:       1 failed, 7 skipped, 8 total
```

### D22 comemoração grava sobre schemaVersion desconhecido
- arquivo `src/features/journey/components/UnitCompleteCelebration.tsx`
- trecho `if (rawHasUnknownSchemaVersion(raw, KNOWN_SCHEMA_VERSIONS)) return null;` trocado por `(removido)`
- comando: `npx jest src/features/journey/components/UnitCompleteCelebration.test.tsx -t "schemaVersion desconhecido"`

```
● takeUnitCelebration › não grava por cima de um store com schemaVersion desconhecido, e sem poder marcar não comemora
    expect(received).toBeNull()
    Received: {"id": "m01", "theme": undefined, "title": "Unidade m01"}
Tests:       1 failed, 7 skipped, 8 total
```

### D23 unit_complete toca a cada render
- arquivo `src/features/journey/components/UnitCompleteCelebration.tsx`
- trecho `}, [unitId]);` trocado por `});`
- comando: `npx jest src/features/journey/components/UnitCompleteCelebration.test.tsx -t "uma vez por unidade"`

```
● UnitCompleteCelebration › mostra medalha, a frase da unidade e Continuar, e toca unit_complete uma vez por unidade
    expect(received).toEqual(expected) // deep equality
    - Expected  - 0
    + Received  + 3
    +   Array [
    +     "unit_complete",
    +   ],
Tests:       1 failed, 7 skipped, 8 total
```

### D24 comemoração anima com reduzir movimento
- arquivo `src/features/journey/components/UnitCompleteCelebration.tsx`
- trecho `animationType={reducedMotion ? 'none' : 'fade'}` trocado por `animationType="fade"`
- comando: `npx jest src/features/journey/components/UnitCompleteCelebration.test.tsx -t "reduzir movimento"`

```
● UnitCompleteCelebration › com "reduzir movimento" abre sem transição e sem confete, com o texto e o botão no lugar
    expect(received).toBe(expected) // Object.is equality
    Expected: "none"
    Received: "fade"
Tests:       1 failed, 7 skipped, 8 total
```

### D25 tela promete bônus não creditado
- arquivo `src/features/missions/screens/MissionsScreen.tsx`
- trecho `? mission.rewarded ? `Concluída, +${MISSION_BONUS_XP} XP` : 'Concluída'` trocado por `? `Concluída, +${MISSION_BONUS_XP} XP``
- comando: `npx jest src/features/missions/screens/MissionsScreen.flow.test.tsx -t "três missões"`

```
● MissionsScreen na rota /missions › mostra as três missões do dia com o progresso e o bônus de cada uma
    Unable to find an element with accessibility label: Bata a meta diária. Concluída.
Tests:       1 failed, 2 skipped, 3 total
```

### D26 falha de leitura fica em carregando
- arquivo `src/features/missions/screens/MissionsScreen.tsx`
- trecho `() => { if (alive) setReading({ state: 'unavailable' }); },` trocado por `() => undefined,`
- comando: `npx jest src/features/missions/screens/MissionsScreen.flow.test.tsx -t "não leu"`

```
● MissionsScreen na rota /missions › diz que não leu quando a leitura falha, sem inventar missão
    Unable to find an element with text: Não foi possível ler as missões agora. Tente de novo em instantes.
Tests:       1 failed, 2 skipped, 3 total
```

### D27 linha mostra o teto no lugar das proteções guardadas
- arquivo `src/features/profile/components/StreakWeek.tsx`
- trecho `Proteções de sequência: ${freezes.stored} de` trocado por `Proteções de sequência: ${freezes.max} de`
- comando: `npx jest src/features/profile/components/StreakWeek.test.tsx -t "proteções"`

```
● mostra as proteções de sequência em texto simples, e só quando foram lidas
    Unable to find an element with text: Proteções de sequência: 1 de 2. Cada uma cobre um dia sem estudo. Você ganha uma a cada 7 dias de sequência.
Tests:       1 failed, 20 skipped, 21 total
```

### D28 Perfil sem o nível ligado ao XP
- arquivo `src/features/profile/screens/ProfileScreen.tsx`
- trecho `<LevelBadge xp={validXp ? totalXp : null} />` trocado por `<LevelBadge xp={null} />`
- comando: `npx jest src/features/profile/screens/ProfileScreen.flow.test.tsx -t "mostra o nível"`

```
● mostra o nível que sai do XP, as proteções ao lado da sequência e a entrada das missões do dia
    Unable to find an element with accessibility label: Nível 3, Olhar atento. 12 de 60 XP para o próximo nível.
Tests:       1 failed, 19 skipped, 20 total
```

### D29 XP lido antes de as missões pagarem
- arquivo `src/features/journey/screens/JourneyHomeScreen.tsx`
- trecho `.then(() => GamificationService.getSnapshot()).then(setGamification);` trocado por `;
      void GamificationService.getSnapshot().then(setGamification);`
- comando: `npx jest src/features/journey/screens/JourneyHomeScreen.flow.test.tsx -t "mostra o nível sob o HUD"`

```
● JourneyHomeScreen: metas e progresso (frente D) › mostra o nível sob o HUD e a entrada das missões, lendo o XP depois de as missões pagarem o bônus
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 1
    -   "missões",
    +   "missões",
Tests:       1 failed, 52 skipped, 53 total
```

### D30 comemoração não ligada à trilha
- arquivo `src/features/journey/screens/JourneyHomeScreen.tsx`
- trecho `if (unit) setCelebration(unit);` trocado por `void unit;`
- comando: `npx jest src/features/journey/screens/JourneyHomeScreen.flow.test.tsx -t "fecha a unidade"`

```
● JourneyHomeScreen: metas e progresso (frente D) › na volta da aula que fecha a unidade, sobe de nível e comemora a unidade uma única vez
    Unable to find an element with role: header, name: Unidade concluída
Tests:       1 failed, 52 skipped, 53 total
```

### D31 nível da trilha sem o som de subida
- arquivo `src/features/journey/screens/JourneyHomeScreen.tsx`
- trecho `<LevelBadge xp={gamification ? gamification.totalXp : null} feedback={feedback} />` trocado por `<LevelBadge xp={gamification ? gamification.totalXp : null} />`
- comando: `npx jest src/features/journey/screens/JourneyHomeScreen.flow.test.tsx -t "fecha a unidade"`

```
● JourneyHomeScreen: metas e progresso (frente D) › na volta da aula que fecha a unidade, sobe de nível e comemora a unidade uma única vez
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 0
    -   "level_up",
Tests:       1 failed, 52 skipped, 53 total
```

### D32 chave nova fora do inventário
- arquivo `src/storage/storageInventory.ts`
- trecho `exact('@radiant:daily_missions_v1', 'economia'),` trocado por `(removido)`
- comando: `npx jest src/storage/storageInventory.test.ts`

```
● inventário de armazenamento (G7) › toda chave gravada pelo app está no inventário
    expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 5
    - Array []
    + Array [
    +   "@radiant:daily_missions_v1 (exact, src/constants/storageKeys.ts:39)",
Tests:       1 failed, 4 passed, 5 total
```

## Execução verde

Todos os comandos em `radiant-app`, com `node --version` em `v20.20.2`.

| Comando | Resultado |
|---|---|
| `npx jest src/features/gamification src/features/missions src/features/profile src/features/journey/screens src/features/journey/components/UnitCompleteCelebration.test.tsx src/features/daily-goal src/storage src/features/spaced-repetition src/features/student-checkpoints/AssessmentAttemptRepository.test.ts src/features/student-checkpoints/screen-integrations.test.ts src/components/ui` | 30 suítes, 373 testes, todos passam |
| `npx tsc --noEmit -p .` | saída 0 |
| `npx eslint` nos arquivos tocados | saída 0 |
| `npm run test:copy-style-contract` | 65 de 65 |
| `npm run test:reanimated-easing-contract` | 1 de 1 |
| `npm run test:contrast-contract` | 17 de 17 |
| `npm run test:tab-bar-clearance-contract` | 3 de 3 |
| `npm run visual:qa:strict` | 0 regressões, 24 na base, 3 exceções de escopo |

Consumidores dos serviços tocados (`lesson-flow`, `quiz`, `review`, `progress-sync`, `checkpoint`,
`student-checkpoints`, `rewards`, `home`): 66 suítes, 1122 testes, com 4 falhas em 2 suítes na hora
da medida. Uma era minha e foi consertada (`screen-integrations.test.ts` exige `useShadowCheckpoint`
na tela de missões; a suíte está na linha verde acima). As outras 3 são de
`batches/RtgCatalog.test.ts`, sobre o índice gerado, enquanto outro agente regenerava os lotes
m08 a m11 na mesma worktree; não toquei nessa pasta e não as remedi depois.

O contrato de texto reprovou uma vez no caminho: o título de nível "Longa jornada" usa uma palavra
da lista de jargão. Virou "Longo caminho".

## Limites

- **Nada rodou em simulador ou aparelho.** Layout do selo de nível sob o HUD, da linha de missões no
  cabeçalho da trilha, da comemoração e da tela `/missions`, texto ampliado e leitor de tela não
  foram vistos. Os sons `nivel` e `unidade` não foram ouvidos nem conferidos pelo log.
- **Som na trilha:** `JourneyHomeScreen` cria um tocador de sons na montagem (nove sons) e o mantém
  enquanto a aba existe, além do tocador da própria aula. O custo de memória não foi medido.
- **`npm run quality`, a suíte inteira do Jest e `loop validate` não foram rodados** por mim.
- **Missão de aula** conta atividades distintas com resposta em modo `study` no dia. Uma aula sem
  nenhuma interação registrada no diário não contaria; não conferi cada família de interação da
  trilha ampla.
- **Bônus de missão** é pago na leitura (abrir Estude, Perfil ou `/missions`). Missão concluída e
  nunca lida no mesmo dia não rende bônus. O bônus não entra na meta diária.
- **Recuperação:** a frase-gancho (`hook`) não aparece na revisão, só as duas perguntas. Se o aluno
  já tinha cartões daquele nó de conferência antes da reprovação (segunda reprovação, por exemplo),
  nada novo é semeado. Numa troca de versão de conteúdo, `reconcileVersions` semeia itens novos da
  lição para quem já tem cartões nela, o que passa a incluir os de recuperação mesmo para quem foi
  aprovado.
- **Reset de homologação** (`IosHomologationService`) não apaga as três chaves novas; o arquivo está
  fora da minha área.
- A leitura das missões lê o diário de respostas inteiro a cada foco da Estude e do Perfil; o custo
  com diário grande não foi medido.
