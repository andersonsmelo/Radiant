# Radiant 1.4 — Fluxo do usuário Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This project requires one Loop writer run per task and forbids subagent execution for this delivery.

**Goal:** Entregar localmente o fluxo da versão 1.4 com trilha soberana, vidas recuperáveis, estudo offline, assinatura e backup opcionais, preservando o currículo e o histórico existentes.

**Architecture:** Dois serviços puros decidem o comportamento central: `NextNodeResolver` escolhe o próximo nó a partir de uma fotografia imutável, e `HeartsService` transforma o estado de vidas com relógio injetado. Adaptadores persistentes e telas consomem esses contratos sem duplicar regras; StoreKit e CloudKit ficam atrás de portas injetáveis e só ganham adaptadores nativos depois de um build interno aprovado.

**Tech Stack:** Expo SDK 54, React Native 0.81, TypeScript 5.9, Expo Router 6, AsyncStorage, Jest 29, React Native Testing Library, Maestro e Sentry React Native 7.

**Spec:** `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`

## Global Constraints

- A spec aprovada e suas dez decisões da §1.2 não serão reabertas.
- Toda tela de estudo continua funcional sem rede, conta ou assinatura.
- O app mantém duas abas: **Estude** e **Perfil**; nenhuma aba nova será criada.
- `NextNodeResolver` e `HeartsService` são puros e recebem o relógio por parâmetro.
- Uma resposta incorreta consome vida somente na primeira confirmação da pergunta de lição nova ou checkpoint; revisão nunca consome e recompensa exatamente uma vida ao concluir.
- Produção é testada com `EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false`, sem API e sem formulário de login.
- Nenhum arquivo em `conteúdo/`, `Conteúdo/`, `content-manifest/` ou nos diretórios sujos do Arco 1 será tocado.
- `prepareV3()` não será chamado, o V3 não será ativado e o legado não será removido.
- Nenhum SDK de terceiro intermediará compras; o adaptador futuro será StoreKit 2 por módulo Expo local `modules/radiant-storekit/` (emendado em 2026-09-23 pela [ADR](../../adr/ADR-2026-09-23-storekit-modulo-expo-local.md); o texto original dizia `expo-iap`).
- Nenhum módulo nativo será instalado ou versionado sem build interno do perfil `development`; `eas build`, `eas submit` e `git push` não fazem parte desta execução.
- A assinatura desbloqueia **vidas ilimitadas — e só isso**; sem trial e sem promessa de conteúdo exclusivo.
- O backup usa banco privado do iCloud e nunca substitui progresso local por nuvem vazia.
- Sentry usa `sendDefaultPii=false`, sem IP ou identificador pessoal; a mudança de Privacy Label fica registrada como ação do dono.
- Testes do app usam Node 20 (`/Users/anderson/.nvm/versions/node/v20.20.2/bin`); comandos Loop usam Node 24 (`/Users/anderson/.nvm/versions/node/v24.14.1/bin`).
- Cada tarefa começa com `git status --porcelain`, abre por `scripts/loop/abrir.mjs`, observa RED diretamente, executa GREEN focado, roda um único `loop validate`, lê o `code`, finaliza e fecha o run em chamadas separadas.

## Mapa de arquivos e validação da política

Todos os caminhos abaixo estão sob raízes autorizadas em `.loop/project.yaml`: `docs`, `radiant-app/src`, `radiant-app/.maestro`, `radiant-app/plugins`, `radiant-app/package.json`, `radiant-app/package-lock.json`, `radiant-app/app.json` e `radiant-app/eas.json`. A união não inclui nenhum caminho de conteúdo ou o `radiant-app/src/ui/motion.ts` já sujo.

| Unidade | Responsabilidade |
| --- | --- |
| `features/journey/services/NextNodeResolver.*` | motor puro e tabela §4 |
| `features/hearts/*` | estado puro, persistência e leitura das vidas |
| `features/storage-migration/*` | backup local e migração 1.3.1 → 1.4 |
| `features/journey/components/*`, `JourneyHomeScreen.*` | trilha virtualizada, motivo e contagem |
| `features/hearts/components/HeartsSheet.*`, `ui/components/HUD.*` | folha sobre a tela e cabeçalho |
| `LessonFlowScreen.*`, `ReviewScreen.*`, `CheckpointScreen.*`, `LessonSummary.*` | gasto, pausa, recompensa e próxima revisão |
| `features/subscription/*`, `app/subscription.tsx` | contrato StoreKit, tela e estados |
| `features/progress-sync/*`, `ProfileScreen.*` | merge de backup e cartões do Perfil |
| `config.ts`, `eas.json`, telemetria e documentação legal | Sentry mínimo e declarações |
| `.maestro/radiant-1-4-*.yaml` | três caminhos dourados da §8.6 |

---

### Task 1: Motor puro do próximo nó

**Files:**
- Create: `radiant-app/src/features/journey/services/NextNodeResolver.ts`
- Create: `radiant-app/src/features/journey/services/NextNodeResolver.test.ts`
- Modify: `radiant-app/src/types/journey.ts`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: fotografia de nós, agenda de revisão e `nowMs` fornecidos pelo chamador.
- Produces: `NextNodeResolver.resolve(input): NextNodeDecision | null`, sem IO, rede, conta ou assinatura.

```ts
export type NextNodeCandidate = {
  nodeId: string;
  type: 'lesson' | 'review' | 'checkpoint';
  order: number;
  unlocked: boolean;
  completed: boolean;
  pausedStepIndex?: number;
  dueAtMs?: number;
};

export type NextNodeDecision = {
  nodeId: string;
  reason: 'paused-lesson' | 'due-review' | 'checkpoint' | 'next-lesson';
  resumeStepIndex?: number;
  dueReviewCount: number;
};
```

- [ ] **Step 1: escrever a suíte vermelha a partir da tabela §4**

Criar casos literais para: pausada vence tudo; revisão `dueAt <= nowMs` mais vencida vence checkpoint/lição; checkpoint destravado vence lição; próxima lição não concluída segue `order`; duas revisões empatam por `order`; tudo concluído devolve `null`, salvo revisão/checkpoint ainda vivos. Incluir casos de revisão futura e nó bloqueado.

- [ ] **Step 2: observar RED diretamente**

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/journey/services/NextNodeResolver.test.ts`

Expected: FAIL porque `NextNodeResolver` ainda não existe.

- [ ] **Step 3: implementar o resolver mínimo**

Filtrar candidatos bloqueados/concluídos, aplicar os quatro degraus em ordem e contar todas as revisões vencidas. Não importar React, AsyncStorage, configuração ou serviços.

- [ ] **Step 4: observar GREEN e mutações**

Repetir o comando focado; inverter manualmente cada precedência durante a revisão mental deve tornar pelo menos um caso vermelho.

- [ ] **Step 5: validar, sinalizar e commitar**

Executar o fechamento Loop obrigatório. Commit: `feat(1.4): add sovereign next-node resolver`.

### Task 2: Economia pura e persistente das vidas

**Files:**
- Create: `radiant-app/src/features/hearts/hearts.types.ts`
- Create: `radiant-app/src/features/hearts/HeartsService.ts`
- Create: `radiant-app/src/features/hearts/HeartsService.test.ts`
- Create: `radiant-app/src/features/hearts/HeartsRepository.ts`
- Create: `radiant-app/src/features/hearts/HeartsRepository.test.ts`
- Modify: `radiant-app/src/constants/storageKeys.ts`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: `HeartsStateV1`, `nowMs` e uma porta `KeyValueStorage` no repositório.
- Produces: transformações puras `spend`, `refillByTime`, `rewardReview`, `setUnlimited`; snapshots para UI.

```ts
export type HeartsStateV1 = {
  schemaVersion: 1;
  count: number;
  lastRefillAt: string | null;
  unlimitedUntil: string | null;
};

export const MAX_HEARTS = 5;
export const REFILL_MIN = 30;
export const REVIEW_REWARD = 1;
```

- [ ] **Step 1: escrever a matriz vermelha da §5**

Cobrir CHEIA, RECUPERANDO, VAZIA e ILIMITADA; primeiro gasto inicia relógio; múltiplos intervalos; teto 5; relógio voltando; salto à frente; recompensa até 5; assinatura ativa; expiração/reembolso → 5; cache offline válido até a data. O esperado vem de literais, nunca do próprio serviço.

- [ ] **Step 2: observar RED diretamente**

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/hearts/HeartsService.test.ts`

- [ ] **Step 3: implementar o serviço puro e observar GREEN**

O serviço nunca chama `Date.now()`. Se `nowMs < lastRefillAt`, mantém o estado; se a assinatura expira, retorna CHEIA; em ILIMITADA, `spend` é no-op.

- [ ] **Step 4: testar e implementar o repositório**

Primeiro RED em `HeartsRepository.test.ts`; depois persistir somente o estado V1 sob `STORAGE_KEYS.HEARTS`, serializar operações e expor `getSnapshot(nowMs)`, `spend(nowMs)`, `rewardReview(nowMs)` e `setUnlimited(until, nowMs)`.

- [ ] **Step 5: validar, sinalizar e commitar**

Commit: `feat(1.4): add persistent hearts economy`.

### Task 3: Integrar a decisão soberana ao progresso e à retomada

**Files:**
- Modify: `radiant-app/src/features/journey/services/JourneyRecommendationService.ts`
- Modify: `radiant-app/src/features/journey/services/JourneyRecommendationService.test.ts`
- Modify: `radiant-app/src/features/journey/services/JourneyProgressService.ts`
- Modify: `radiant-app/src/features/journey/services/JourneyProgressService.test.ts`
- Modify: `radiant-app/src/features/journey/services/JourneyNodeRouting.ts`
- Create: `radiant-app/src/features/journey/services/JourneyNodeRouting.test.ts`
- Modify: `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts`
- Modify: `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.test.ts`
- Modify: `radiant-app/src/types/journey.ts`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: `NextNodeResolver`, cards SM-2 com `nextReviewAt` e progresso existente.
- Produces: `JourneySnapshot.nextDecision`; retomada inclui `resumeStepIndex`; deep link de lembrete aponta ao nó decidido.

- [ ] **Step 1: escrever RED de adaptação e compatibilidade**

Casos: ordem SM-2 mais vencida preservada; lição pausada ganha de revisão; passo retomável vira `resumeCursorId=step-N`; revisão futura não aparece; API antiga de snapshot continua retornando nó para consumidores existentes.

- [ ] **Step 2: observar RED diretamente**

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/journey/services/JourneyRecommendationService.test.ts src/features/journey/services/JourneyProgressService.test.ts src/features/journey/services/JourneyNodeRouting.test.ts src/features/spaced-repetition/services/SpacedRepetitionService.test.ts`

- [ ] **Step 3: implementar adaptadores mínimos**

Adicionar relógio opcional aos leitores SM-2, guardar `resumableStepIndex` sem alterar nós concluídos e fazer `JourneyRecommendationService` delegar a precedência ao resolver puro.

- [ ] **Step 4: observar GREEN, validar, sinalizar e commitar**

Commit: `feat(1.4): route journey through next-node engine`.

### Task 4: Migração segura de armazenamento na abertura

**Files:**
- Create: `radiant-app/src/features/storage-migration/StorageMigrationService.ts`
- Create: `radiant-app/src/features/storage-migration/StorageMigrationService.test.ts`
- Create: `radiant-app/src/features/storage-migration/v131Fixtures.ts`
- Modify: `radiant-app/src/constants/storageKeys.ts`
- Modify: `radiant-app/src/app/_layout.tsx`
- Modify: `radiant-app/src/features/first-run/startup-gate.flow.test.tsx`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: allowlist de stores locais pedagógicos 1.3.1, porta AsyncStorage e callback de progresso.
- Produces: `migrateToV14(): MigrationResult` com `unchanged`, `migrated`, `restored-backup` ou `started-clean-with-warning`.

- [ ] **Step 1: escrever RED com fixtures reais da 1.3.1**

Casos: backup antes da primeira escrita; instalação limpa cria CHEIA; falha após backup restaura; JSON corrompido restaura cópia; backup ausente inicia limpo e devolve aviso; migração idempotente; barra só aparece após 1 s.

- [ ] **Step 2: observar RED diretamente**

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/storage-migration/StorageMigrationService.test.ts src/features/first-run/startup-gate.flow.test.tsx`

- [ ] **Step 3: implementar serviço e integrar antes dos bootstraps**

O backup inclui apenas chaves pedagógicas allowlisted, nunca sessão, e-mail ou token. A tela mantém esqueleto; mostra progresso após 1 s; recuperação informa o ocorrido na voz do Pixel sem bloquear o modo local.

- [ ] **Step 4: observar GREEN, validar, sinalizar e commitar**

Commit: `feat(1.4): migrate local progress with backup`.

### Task 5: Trilha virtualizada, cabeçalho de vidas e folha modal

**Files:**
- Create: `radiant-app/src/features/hearts/components/HeartsSheet.tsx`
- Create: `radiant-app/src/features/hearts/components/HeartsSheet.test.tsx`
- Modify: `radiant-app/src/ui/components/HUD.tsx`
- Modify: `radiant-app/src/ui/components/HUD.test.tsx`
- Modify: `radiant-app/src/features/journey/components/JourneyTrail.tsx`
- Modify: `radiant-app/src/features/journey/components/JourneyTrail.test.tsx`
- Modify: `radiant-app/src/features/journey/components/JourneyNodeCard.tsx`
- Modify: `radiant-app/src/features/journey/components/JourneyNodeCard.test.tsx`
- Modify: `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`
- Modify: `radiant-app/src/features/journey/screens/JourneyHomeScreen.flow.test.tsx`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: `HeartsSnapshot`, `JourneySnapshot.nextDecision` e callbacks de navegação.
- Produces: HUD tocável; `HeartsSheet` sempre com Esperar/Revisar/Assinar segundo disponibilidade; `FlatList` de nós.

- [ ] **Step 1: escrever RED dos estados de produção**

Cobrir: carregando com esqueleto; tudo concluído com “novo arco em breve”; offline idêntico; erro com ação; contagem “N devidas”; motivo “revisão devida”/“continuar de onde parou”; HUD `♥3 · +1 em N min`; ∞ para assinante; folha sem Revisar quando nada devido e sem Assinar quando loja indisponível.

- [ ] **Step 2: observar RED diretamente**

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/hearts/components/HeartsSheet.test.tsx src/ui/components/HUD.test.tsx src/features/journey/components/JourneyTrail.test.tsx src/features/journey/components/JourneyNodeCard.test.tsx src/features/journey/screens/JourneyHomeScreen.flow.test.tsx`

- [ ] **Step 3: implementar componentes e virtualização**

`JourneyTrail` vira a superfície rolável `FlatList`; bandas e nós são itens achatados com chaves estáveis. O HUD não cria timer de domínio: apenas apresenta o próximo marco calculado na leitura.

- [ ] **Step 4: observar GREEN, validar, sinalizar e commitar**

Commit: `feat(1.4): add virtualized sovereign trail and hearts sheet`.

### Task 6: Cobrar, pausar, revisar e concluir

**Files:**
- Modify: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- Modify: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- Modify: `radiant-app/src/features/review/screens/ReviewScreen.tsx`
- Modify: `radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx`
- Modify: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`
- Modify: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx`
- Modify: `radiant-app/src/features/quiz/components/LessonSummary.tsx`
- Modify: `radiant-app/src/features/quiz/components/LessonSummary.test.tsx`
- Modify: `radiant-app/src/features/rewards/screens/RewardScreen.tsx`
- Modify: `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx`
- Modify: `radiant-app/src/features/paywall/PaywallService.ts`
- Modify: `radiant-app/src/features/paywall/PaywallService.test.ts`
- Modify: `radiant-app/src/features/paywall/PaywallPlan.ts`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: `HeartsRepository`, `HeartsSheet`, passo retomável e agenda SM-2.
- Produces: gasto idempotente por pergunta, pausa em zero, revisão livre com +1 uma vez e conclusão com “próxima revisão em N dias”.

- [ ] **Step 1: escrever RED por comportamento**

Casos: trocar alternativa não cobra; primeira confirmação errada cobra uma vez; reconfirmar não cobra; acerto não cobra; zero pausa e persiste o próximo passo; fechar preserva; reabrir retoma; revisão errada não cobra; conclusão de revisão recompensa uma vez; checkpoint segue a mesma idempotência; paywall antigo nunca aparece em checkpoint/recompensa; conclusão mostra intervalo SM-2.

- [ ] **Step 2: observar RED diretamente**

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx src/features/review/screens/ReviewScreen.flow.test.tsx src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/quiz/components/LessonSummary.test.tsx src/features/rewards/screens/RewardScreen.flow.test.tsx src/features/paywall/PaywallService.test.ts`

- [ ] **Step 3: implementar com conjunto de charge keys local à sessão**

Usar identificador estável da pergunta/passo. O estado persistido de vidas continua exatamente com três campos de domínio; a idempotência da primeira resposta pertence à sessão/checkpoint existente, não ao store de vidas.

- [ ] **Step 4: observar GREEN, validar, sinalizar e commitar**

Commit: `feat(1.4): enforce hearts across study flows`.

### Task 7: Contratos de assinatura e backup, telas e Perfil

**Files:**
- Create: `radiant-app/src/features/subscription/subscription.types.ts`
- Create: `radiant-app/src/features/subscription/SubscriptionService.ts`
- Create: `radiant-app/src/features/subscription/SubscriptionService.test.ts`
- Create: `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`
- Create: `radiant-app/src/features/subscription/screens/SubscriptionScreen.flow.test.tsx`
- Create: `radiant-app/src/app/subscription.tsx`
- Create: `radiant-app/src/features/progress-sync/progressSync.types.ts`
- Create: `radiant-app/src/features/progress-sync/ProgressSyncService.ts`
- Create: `radiant-app/src/features/progress-sync/ProgressSyncService.test.ts`
- Create: `radiant-app/src/features/progress-sync/components/ICloudBackupCard.tsx`
- Create: `radiant-app/src/features/progress-sync/components/ICloudBackupCard.test.tsx`
- Create: `radiant-app/src/features/subscription/components/SubscriptionCard.tsx`
- Create: `radiant-app/src/features/subscription/components/SubscriptionCard.test.tsx`
- Modify: `radiant-app/src/app/_layout.tsx`
- Modify: `radiant-app/src/features/profile/screens/ProfileScreen.tsx`
- Modify: `radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx`
- Modify: `radiant-app/src/config/legal.ts`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: portas `StoreKitPort` e `PrivateCloudPort`, estado local e `HeartsRepository`.
- Produces: serviço de entitlement offline, merge monotônico de progresso, tela de assinatura e cartões de Perfil sem vocabulário de infraestrutura.

```ts
export interface StoreKitPort {
  loadProducts(ids: readonly string[]): Promise<StoreProduct[]>;
  currentEntitlement(): Promise<SubscriptionEntitlement | null>;
  purchase(productId: string): Promise<PurchaseOutcome>;
  restore(): Promise<SubscriptionEntitlement | null>;
}

export interface PrivateCloudPort {
  pull(): Promise<ProgressBackup | null>;
  push(snapshot: ProgressBackup): Promise<{ savedAt: string }>;
}
```

- [ ] **Step 1: escrever RED dos serviços puros**

Assinatura: cache válido offline → ILIMITADA; cache vencido/expirado/reembolsado → CHEIA; Ask to Buy → pendente; restauração. Backup: união de concluídos; agenda mais recente por nó; maior XP e sequência; `lastRefillAt` mais recente; nuvem vazia nunca substitui local.

- [ ] **Step 2: observar RED dos serviços**

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/subscription/SubscriptionService.test.ts src/features/progress-sync/ProgressSyncService.test.ts`

- [ ] **Step 3: implementar contratos e observar GREEN**

O adaptador padrão desta tarefa retorna `store-unavailable`/`cloud-unavailable`; ele não finge integração nativa. Serviços continuam inteiramente testáveis por portas injetadas.

- [ ] **Step 4: escrever RED e implementar telas na configuração de produção**

Assinatura cobre carregando preços, loja indisponível, pendente, assinante, restaurada e cancelada; mostra preços/períodos da Apple, renovação, restaurar, termos, privacidade e cancelamento nos Ajustes. Perfil cobre backup desligado/ativo com data/erro e assinatura ativa/expirada; não mostra login, e-mail, token, API, sync ou backend.

Run: `cd radiant-app && PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH" npx jest --runInBand src/features/subscription/screens/SubscriptionScreen.flow.test.tsx src/features/subscription/components/SubscriptionCard.test.tsx src/features/progress-sync/components/ICloudBackupCard.test.tsx src/features/profile/screens/ProfileScreen.flow.test.tsx`

- [ ] **Step 5: validar, sinalizar e commitar**

Commit: `feat(1.4): add subscription and private-backup contracts`.

### Task 8: Gate nativo, Sentry, E2E e preparação da versão

> **Estado em 2026-09-15: a fatia CloudKit foi implementada; StoreKit, Sentry e
> E2E não.** [PR #14](https://github.com/andersonsmelo/Radiant/pull/14), aberto.
>
> **Os caminhos planejados abaixo não foram os construídos**, e a divergência é
> deliberada:
>
> | Planejado | Construído | Por quê |
> | --- | --- | --- |
> | `plugins/with-radiant-icloud.js` | `app.json` → `ios.entitlements` | um config plugin era desnecessário: o Expo aceita os entitlements direto no app config, e `ios/` é gitignorado, então o contrato tem de afirmar sobre a fonte versionada |
> | `ICloudPrivateDatabaseAdapter.ts` | `CloudKitPrivateAdapter.ts` + `modules/radiant-cloudkit/` | nenhuma biblioteca RN/Expo de CloudKit qualificou (as duas candidatas têm ~5 estrelas e alargam a superfície de entitlements além do desenho aprovado), então foi módulo Expo local mínimo, com **zero dependências npm** |
> | `ExpoIapStoreKitAdapter.*` | — | fora do escopo desta fatia; `expo-iap` continua não instalado |
> | `.maestro/radiant-1-4-*.yaml` (nomes em inglês) | `radiant-1-4-primeira-execucao`, `radiant-1-4-segundo-dia`, `radiant-1-4-vidas-esgotadas` + `subflows/dismiss-dev-client` | **escritos e no contrato em 2026-09-24**; caminhos 1 e 3 `passed` no iOS 26.5, dia 2 do caminho 2 pendente de relógio real ([evidência](../../../radiant-app/docs/evidence/2026-09-24-e2e-caminhos-dourados-1-4.md)). O caminho 2 não injeta relógio porque o app não oferece como (decisão do dono) |
>
> A leitura da nuvem também ganhou forma que o plano não previa: `pull()` devolve
> **três** estados (`absent`/`usable`/`incompatible`) em vez de `Backup | null`,
> porque o sentinela único fazia registro ilegível ser lido como ausente e
> autorizava sobrescrevê-lo. Três rodadas de revisão independente, cinco achados,
> todos corrigidos — o histórico está no
> [relatório do slice CloudKit](../handoffs/2026-09-15-radiant-1-4-relatorio-cloudkit.md).

**Files:**
- Create: `radiant-app/src/features/subscription/ExpoIapStoreKitAdapter.ts`
- Create: `radiant-app/src/features/subscription/ExpoIapStoreKitAdapter.test.ts`
- Create: `radiant-app/plugins/with-radiant-icloud.js`
- Create: `radiant-app/src/features/progress-sync/ICloudPrivateDatabaseAdapter.ts`
- Create: `radiant-app/src/features/progress-sync/ICloudPrivateDatabaseAdapter.test.ts`
- Create: `radiant-app/.maestro/radiant-1-4-first-run.yaml`
- Create: `radiant-app/.maestro/radiant-1-4-second-day-review.yaml`
- Create: `radiant-app/.maestro/radiant-1-4-hearts-empty.yaml`
- Modify: `radiant-app/scripts/maestro-contract.test.mjs`
- Modify: `radiant-app/src/config.ts`
- Modify: `radiant-app/src/features/telemetry/bootstrap.ts`
- Modify: `radiant-app/src/features/telemetry/telemetry-privacy-contract.test.ts`
- Modify: `radiant-app/package.json`
- Modify: `radiant-app/package-lock.json`
- Modify: `radiant-app/app.json`
- Modify: `radiant-app/eas.json`
- Modify: `docs/legal/CONTRATO_TELEMETRIA.md`
- Modify: `docs/legal/politica-de-privacidade.md`
- Modify: `docs/store/DATA_SAFETY_E_CLASSIFICACAO.md`
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

**Interfaces:**
- Consumes: contratos validados na Task 7 e credenciais/itens de console fornecidos pelo dono.
- Produces: adaptadores nativos reais, configuração 1.4, Sentry mínimo e caminhos E2E estáticos.

- [ ] **Step 1: confirmar gates humanos antes de abrir o run**

Exigir, medidos na data: acordo de apps pagos aceito; IDs mensal/anual e preços definidos; entitlement iCloud e credencial EAS disponíveis; DSN Sentry configurado no perfil production; autorização separada para build interno. Ausência de qualquer item bloqueia somente a parte dependente e entra no relatório.

- [ ] **Step 2: escrever o módulo local `radiant-storekit` e testá-lo somente dentro do gate autorizado**

*(Emendado em 2026-09-23: o passo dizia "instalar e testar `expo-iap`"; ver a [ADR do módulo local](../../adr/ADR-2026-09-23-storekit-modulo-expo-local.md).)* O módulo segue o molde de `modules/radiant-cloudkit/`, sem dependência npm. O adaptador TS é testado contra a porta sem build; o Swift só conta como validado depois de build interno `development` e sandbox, autorizados pelo dono.

- [ ] **Step 3: testar o plugin iCloud no mesmo perfil**

Se o plugin não compilar, retirar backup da 1.4 sem afetar os contratos de assinatura, vidas ou estudo; registrar a medição e não contornar entitlement.

- [ ] **Step 4: escrever RED e integrar adaptadores**

Testar mapeamento de produtos/entitlements/transações, erros, Ask to Buy, restore, push/pull privado e merge. Nenhum teste afirma mock em vez de comportamento do adaptador.

- [ ] **Step 5: ligar Sentry e preparar os caminhos dourados**

Produção declara crash reporting ligado apenas com DSN; `sendDefaultPii=false` permanece imposto. Atualizar os três flows Maestro e o contrato estático, sem executar E2E contra binário inexistente.

- [ ] **Step 6: versionar somente se os adaptadores nativos passaram**

Alinhar `package.json` e `app.json` em `1.4.0`; não alterar build remoto. Atualizar documentos com o rótulo **Diagnóstico → Dados de falha, não vinculados a você**, sem clicar em consoles.

- [ ] **Step 7: validar, sinalizar e commitar**

Commit: `feat(1.4): wire native purchases backup and crash reporting`.

## Finalização e relatório

- [ ] Reexecutar somente o gate configurado que comprova o estado final; não repetir validações já aprovadas sem falha real.
- [ ] Conferir a spec seção por seção e registrar lacunas reais, inclusive build interno, E2E, smoke físico, VoiceOver, Dynamic Type, Reduce Motion, 60 fps, abertura <2 s e binário ≤60 MB.
- [ ] Criar `docs/superpowers/handoffs/2026-09-14-radiant-1-4-relatorio-execucao.md` em run próprio.
- [ ] Atualizar `docs/STATUS.md` e a Onda K do roadmap sem absorver os trechos sujos do Arco 1.
- [ ] O relatório lista por tarefa: arquivos, commit, run, contagem de testes, 14/14 ou reprovação, pendências do dono, suposições, achados fora do escopo e próximos passos.
- [ ] Fechar o último run e a sessão `brain-session-1789424973587-443b4ee1` separadamente.

## Self-review do plano

- **Cobertura da spec:** §4 → Task 1/3; §5 → Task 2/5/6; §3 e §8.1–§8.2 → Task 4–7; §6 → Task 7/8; §7 → Task 7/8; §8.3–§8.7 e §9 → Task 8 e relatório; §11 → gate nativo da Task 8.
- **Consistência de tipos:** `NextNodeDecision`, `HeartsStateV1`, `StoreKitPort` e `PrivateCloudPort` têm um único produtor e consumidores nomeados.
- **Escopo:** assinatura e backup continuam no mesmo plano porque a spec os absorveu como serviços e interruptores; os adaptadores nativos são uma tarefa final condicional, não uma promessa antecipada.
- **Conflito herdado:** a regra mais nova e específica da spec 1.4 — erro em lição nova/checkpoint consome vida — prevalece sobre a frase antiga da spec V3 que não retirava vidas; revisão continua sem custo em ambas.
