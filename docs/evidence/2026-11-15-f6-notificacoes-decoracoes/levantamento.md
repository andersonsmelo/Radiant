# F6: levantamento do que já existe (2026-11-15)

Medido por `grep` na `main` em `741c3e3`, na worktree `f6-notificacoes-decoracoes-8fda11`.
Caminhos relativos a `radiant-app/`.

## Notificações

- **Único agendador:** `src/features/push/services/PushService.ts`.
  - `expo-notifications` 0.32 carregado sob demanda por `require` (linhas 24 a 49), com
    `setNotificationHandler` (36).
  - Pedido de permissão: `getPermissionsAsync`/`requestPermissionsAsync` em
    `requestPermissionIfNeededUnlocked` (134 a 154).
  - Agendamento: `scheduleDailyIfEligibleUnlocked` (177 a 251) decide o tipo
    (`review` se há revisão vencida, senão `goal` se a meta está aberta), limita a 1 por
    dia por `push.lastSent.v1`/`push.lastScheduled.v1` e chama `scheduleOrShadow`
    (253 a 318), que sorteia um horário entre 18 h e 21 h **só para hoje**, com
    `cancelAllScheduledNotificationsAsync` antes (304) e gatilho `{ type: DATE, date }` (302).
  - Textos fixos em três variantes por tipo (277 a 287), `data: { type }` sem rota.
  - O recuo para quem ignora (`simulateIgnoredPushUnlocked`, 441) não tem efeito real: a
    ADR de 2026-10-16 já registra isso.
- **Nenhum ouvinte de toque:** não há `addNotificationResponseReceivedListener` nem
  `getLastNotificationResponseAsync` no `src/`. Hoje o toque só abre o app.
- **Chamadores do agendamento:** `features/journey/screens/JourneyHomeScreen.tsx:130`
  (foco da Estude) e `features/home/screens/HomeScreen.tsx:138` (Home legada);
  `PushOptInCard.tsx:33` logo após o aceite; `ReminderRow` via
  `PushService.changeReminderPreference` (`PushService.ts:94`).
- **Configuração:** `src/config/push.ts` (`ENABLE_PUSH` por ambiente, `PUSH_SHADOW_MODE: false`
  desde a ADR de 2026-10-16, janela 18 a 21).
- **Preferência do aluno:** `push.optin.v1` (liga e desliga o lembrete), na linha
  `ReminderRow` dos Ajustes (`features/settings/screens/SettingsScreen.tsx:133`) e no rodapé
  da Estude (`JourneyHomeScreen.tsx:303`).
- **Plugin:** `app.json:49` (`expo-notifications`). Pacote `~0.32.16` (`package.json:67`).

## Dados do aluno que alimentam a mensagem

- Sequência: `GamificationService.getSnapshot()` → `{ totalXp, streakDays, lastActiveDate }`
  (`features/gamification/services/GamificationService.ts:26`, tipo em
  `src/types/gamification.ts`). `lastActiveDate` é a data local do último estudo.
- Meta do dia: `DailyGoalService.getSnapshot()` → `isCompleted`, `earnedXpToday`, `goalXp`
  (`features/daily-goal/services/DailyGoalService.ts:49`, `src/types/dailyGoal.ts`).
- Revisão devida: `SpacedRepetitionService.getDueCount()` (usado em
  `features/missions/services/DailyMissionsService.ts:93`).
- Próxima aula: `JourneyCurriculumService.getCurriculumTrail()` → `recommendedNodeId`
  (`features/journey/services/JourneyCurriculumService.ts:78`); o nó tem `title`
  (`src/types/journey.ts:36`).
- Horário em que costuma estudar: `itemReviewRepository.getAttempts()` → `recordedAt` de
  cada tentativa (`DailyMissionsService.ts:91`).
- Liga: `LeagueService.getStanding()` só existe na PR #72 (não está na `main`).

## Conquistas e missões

- Missões do dia: `DailyMissionsService.sync()` (`DailyMissionsService.ts:108`) devolve as
  três missões com `done`; o store `@radiant:daily_missions_v1` guarda **só o dia corrente**.
- Nível por XP: `levelFromXp` (`features/gamification/services/levelFromXp.ts`).
- Medalhas e unidades: `MedalShelf` (`features/profile/components/MedalShelf.tsx`) lê a
  unidade atual; unidades concluídas saem de `getCurriculumTrail()` (status por nó).
- Proteção de sequência: `StreakFreezeService` (`@radiant:streak_freeze_v1`).
- Não há histórico de "maior sequência": `streakDays` é a sequência atual e volta a 1.

## Assinatura

- `subscriptionService.getStatus(nowMs)` → `SubscriptionStatus`, com
  `kind: 'unlimited'` para assinante (`features/subscription/SubscriptionService.ts:143`,
  `subscription.types.ts:36`). Leitura local, sem rede.
- Rota existente: `/subscription` (`src/app/subscription.tsx`), aberta por
  `SettingsScreen.tsx:130`, `JourneyHomeScreen.tsx:340`, `LessonFlowScreen.tsx:889` e
  `CheckpointScreen.tsx:734`.

## Onde o aluno se vê

- `features/profile/screens/ProfileScreen.tsx:85`: `ProfileIdentityHeader` (avatar com a
  inicial e o nome "Estudante"), em `features/profile/components/ProfileIdentityHeader.tsx:15`.
- Rota `/(tabs)/profile`. O layout das abas é `src/app/(tabs)/_layout.tsx`, que só monta
  depois dos portões do `_layout` raiz.

## Storage, backup e reset

- Inventário: `src/storage/storageInventory.ts` (guarda `storageInventory.test.ts` lê a AST
  e reprova chave gravada fora da lista). Chaves centrais em `src/constants/storageKeys.ts`.
- Backup no iCloud: `features/progress-sync/` (`ProgressBackup` em `progressSync.types.ts`,
  `mergeProgressBackups` em `ProgressSyncService.ts:40`, captura e aplicação em
  `LocalProgressAdapter.ts:66` e `:91`). Leva nós concluídos, agenda, XP, sequência e vidas;
  missões, proteção de sequência e preferências não entram.
- Reset: `IosHomologationService.resetLocalState()` (`features/progress/services/IosHomologationService.ts:66`),
  chamado pelo console de desenvolvimento.

## Kill switches

- Padrão em `src/config.ts`: `readBooleanFlag(process.env.EXPO_PUBLIC_<NOME>, padrão)`.
- Contrato `src/config/killSwitches.contract.test.ts`: nenhuma `ENABLE_*` fixa e toda
  `ENABLE_*` com leitor `AppConfig.<NOME>` em produção.
