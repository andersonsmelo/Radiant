# Radiant 1.4 — Relatório de execução (sessão de 2026-09-14)

**Escopo desta sessão:** commit da Task 6 (já validada por sessão anterior),
execução da Task 7 com TDD, uma correção pós-Task 7 encontrada por medição,
e a decisão de **não** abrir a Task 8 por ausência dos gates humanos.

**Plano:** `docs/superpowers/plans/2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md`
**Spec:** `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`
**Branch:** `codex/radiant-1-4` · base `6e7f804` · HEAD ao escrever este relatório: `583dc62`

Toda afirmação de estado abaixo traz a data e o comando que a mediu. O que não
foi executado está dito como não executado — em especial: **nenhum E2E,
aparelho, VoiceOver, medição de desempenho, build ou integração nativa foi
executado nesta sessão.**

---

## 1. O que foi feito, por tarefa

Medido em 2026-09-14 com `git log --oneline 6e7f804..HEAD` e
`python3 -c 'import json; ...' .loop/runs/<run>/state.json|events.jsonl`.

| Task | Commit | Run do Loop | Evidência registrada |
| --- | --- | --- | --- |
| Plano | `c42f61d` | `run-1789425325025-2d00e0ca` (fechado) | sessão anterior |
| 1 — NextNodeResolver | `d54e9a1` | `run-1789425789429-909b7b9f` (fechado, 14/14) | 9/9 focados (STATUS) |
| 2 — Economia de vidas | `22b365f` | `run-1789426055783-1615ffb3` (fechado, 14/14) | 18/18 focados (STATUS) |
| 3 — Decisão soberana no progresso | `75cc9da` | `run-1789426404960-34024089` (fechado; 28 eventos de validador, 2 reprovados na 1ª passada e 14/14 na 2ª) | 25/25 focados (STATUS) |
| 4 — Migração 1.3.1 → 1.4 | `325c4e8` | `run-1789427103646-98418172` (fechado, 14/14) | 28/28 focados (STATUS) |
| 5 — Trilha, HUD e folha | `933f88f` | `run-1789427824235-dc40c48b` (fechado; 28 eventos, 1 reprovado na 1ª passada e 14/14 na 2ª) | 54/54 focados (STATUS) |
| **6 — Cobrar, pausar, revisar, concluir** | **`425b61f`** (esta sessão) | `run-1789428607305-cf3b7436` (fechado, 14/14; validado na sessão anterior) | 6 suítes, 50/50; tsc; eslint; `git diff --check` |
| **7 — Assinatura, backup, telas e Perfil** | **`d096a01`** (esta sessão) | **`run-1789430036784-190087b4`** (fechado; 1ª passada `app-quality` reprovado, 2ª `VALIDATION_PASSED` 14/14; `MEMORY_WRITTEN`) | 9 suítes novas/alteradas, 72 testes; lição 17/17; checkpoint 23/23; tsc; eslint |
| **Correção pós-7** | **`583dc62`** (esta sessão) | **`run-1789431458242-28d4efde`** (fechado, 14/14) | 5 suítes, 68 testes; tsc; eslint |
| Relatório | (este commit) | `run-1789431806426-38a3d37b` | validação do run |
| 8 — Gate nativo | **não iniciada** | nenhum run aberto | ver §2 |

### Task 6 — o que esta sessão fez

Revisou o diff sem alterar código e commitou. O stage dos documentos foi
parcial por `git hash-object -w --stdin` + `git update-index --cacheinfo`:
o índice recebeu HEAD + somente o parágrafo "Task 6 concluída localmente em
2026-09-14" (STATUS) e a troca de K4 para `[CONCLUÍDA — LOCAL, 2026-09-14]`
(roadmap). Os hunks do Currículo V3 da outra sessão ficaram só na working tree
(`git status` mostrava `MM` nos dois arquivos antes do commit). Nenhum run foi
aberto para esse commit.

### Task 7 — arquivos

Criados:
- `radiant-app/src/features/subscription/subscription.types.ts` — `StoreKitPort`, `StoreProduct`, `SubscriptionEntitlement`, `PurchaseOutcome`, `SubscriptionStatus`, `StoreUnavailableError`, cache V1.
- `radiant-app/src/features/subscription/SubscriptionService.ts` (+ `.test.ts`, 18 casos) — `getStatus` (só cache), `refresh`, `loadOffers`, `purchase`, `restore`.
- `radiant-app/src/features/subscription/UnavailableStoreKitAdapter.ts` — adaptador padrão; toda operação lança `store-unavailable`.
- `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx` (+ `.flow.test.tsx`, 12 casos) — carregando, loja indisponível, pendente, assinante, restaurada, cancelada, expirada; preço/período só da porta; renovação por extenso, Restaurar compras, Termos, Privacidade, cancelamento nos Ajustes.
- `radiant-app/src/features/subscription/components/SubscriptionCard.tsx` (+ `.test.tsx`, 6 casos) — cartão Assinatura do Perfil.
- `radiant-app/src/app/subscription.tsx` — rota `/subscription`.
- `radiant-app/src/features/progress-sync/progressSync.types.ts` — `ProgressBackup`, `PrivateCloudPort`, `LocalProgressPort`, `CloudUnavailableError`, `BackupState`.
- `radiant-app/src/features/progress-sync/ProgressSyncService.ts` (+ `.test.ts`, 14 casos) — `mergeProgressBackups` puro; `getState`, `setEnabled`, `backupNow`, `restoreOnLaunch`.
- `radiant-app/src/features/progress-sync/UnavailablePrivateCloudAdapter.ts` — adaptador padrão; `cloud-unavailable`.
- `radiant-app/src/features/progress-sync/LocalProgressAdapter.ts` (+ `.test.ts`, 4 casos) — fotografa/aplica trilhas, agenda SM-2, vidas (`lastRefillAt`) e gamificação.
- `radiant-app/src/features/progress-sync/components/ICloudBackupCard.tsx` (+ `.test.tsx`, 5 casos) — cartão Backup no iCloud.
- `radiant-app/src/features/gamification/services/GamificationService.test.ts` (2 casos) — `absorbBackup`.

Modificados:
- `radiant-app/src/features/gamification/services/GamificationService.ts` — `absorbBackup({ totalXp, streakDays })` (maior de cada), passando pelo cache em memória do serviço.
- `radiant-app/src/features/profile/screens/ProfileScreen.tsx` (+ `.flow.test.tsx`, 5 casos novos em configuração de produção) — cartões Assinatura e Backup entre Missões e Progresso; `ProfileIdentityHeader` passa a receber `email={null}` e a tela deixou de importar `AuthService`.
- `radiant-app/src/app/_layout.tsx` — `Stack.Screen name="subscription"`.
- `radiant-app/src/config/legal.ts` (+ `.test.ts`) — `LEGAL_LINKS.terms` (ver §3, suposição 2).
- `radiant-app/src/constants/storageKeys.ts` — `SUBSCRIPTION` (`@radiant:subscription_v1`) e `PROGRESS_BACKUP` (`@radiant:progress_backup_v1`).
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx` e `checkpoint/screens/CheckpointScreen.tsx` (+ 1 caso em cada suíte) — bloqueio por `hearts.status === 'empty'` em vez de `count === 0` (ver §4, achado 1).
- `docs/STATUS.md`, `docs/plans/2026-07-27-radiant-launch-roadmap.md` — parágrafo da Task 7 e K5.

### Task 7 — evidência (medida em 2026-09-14)

```bash
cd radiant-app && PATH=/opt/homebrew/opt/node@20/bin:$PATH npx jest --runInBand \
  src/features/subscription src/features/progress-sync src/features/gamification \
  src/features/profile src/config/legal.test.ts
# → 9 suítes, 72 testes aprovados
PATH=/opt/homebrew/opt/node@20/bin:$PATH npx jest --runInBand \
  src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx \
  src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx
# → 17/17 e 23/23
PATH=/opt/homebrew/opt/node@20/bin:$PATH npx tsc --noEmit        # → sem erros
PATH=/opt/homebrew/opt/node@20/bin:$PATH npx eslint <arquivos de produção tocados>  # → 0 avisos
git diff --check                                                    # → limpo
```

RED foi observado antes de cada implementação: os serviços falharam por
módulo ausente; `absorbBackup` por "is not a function"; as telas por módulo
ausente; o Perfil com 5 casos vermelhos; lição e checkpoint com 1 caso
vermelho cada; `legal.test.ts` com 1 vermelho.

Loop (`run-1789430036784-190087b4`): a **primeira** `loop validate` devolveu
`VALIDATION_FAILED` — 13 validadores aprovados e `app-quality` reprovado.
Causa, reproduzida com `npm run quality` e o mesmo `PATH` do validador:
`visual:qa:strict`, regra R2 (chave de estilo local `screen` na tela nova;
o correto é `layout.screen`). Corrigido; a **segunda** `loop validate` devolveu
`VALIDATION_PASSED` 14/14. Depois: `STEP_SUCCEEDED`, `MEMORY_WRITTEN`
(fingerprint `4979768…`, 27 evidências `passed` citadas), `RUN_CLOSED`.

### Correção pós-Task 7 (`583dc62`)

Encontrada ao medir o que aconteceria ao ligar `refresh` na abertura:
`SubscriptionService.refresh` chamava `hearts.setUnlimited(null)` também para
quem não tem assinatura, e `HeartsService.setUnlimited(null)` devolve
`fullState()` — a cada abertura, todo aluno grátis teria as vidas cheias. O
teste da Task 7 havia codificado a chamada que a implementação fazia, não o
requisito. Correção: só `unlimited` (→ ilimitado) e `expired` (→ cheio, que é
o destino da spec §5.2 para expiração e reembolso) tocam as vidas; `none` e
`pending` não tocam. No mesmo run, `_layout.tsx` passou a chamar
`subscriptionService.refresh(Date.now())` e
`progressSyncService.restoreOnLaunch(Date.now())` no `Promise.all` pós-migração,
com `catch` para o console — falha ali não bloqueia o Stack (teste em
`startup-gate.flow.test.tsx`). Com os adaptadores padrão, as duas chamadas são
inertes.

---

## 2. Pendências e motivo

### Task 8 — bloqueada (medido em 2026-09-14)

Nenhum dos gates humanos do plano estava disponível, e a instrução da sessão
proibia instalar `expo-iap`, configurar iCloud/Sentry/plugins nativos e alterar
`package.json`, `package-lock.json`, `app.json` ou `eas.json` sem eles:

| Gate | Estado | Como foi medido |
| --- | --- | --- |
| Autorização separada para build interno (`development`) | ausente | não consta na instrução da sessão nem em `docs/STATUS.md` |
| Acordo de apps pagos aceito no App Store Connect | não medido nesta sessão (o STATUS de 2026-08-24 registra só o gratuito) | nenhum console foi aberto |
| IDs e preços mensal/anual | ausentes | `SUBSCRIPTION_PRODUCT_IDS` usa os ids legados de `PaywallPlan` (`monthly_plus`, `annual_plus`) como placeholders; preço nenhum no código |
| Entitlement iCloud e credencial EAS | ausentes | `grep -n iCloud radiant-app/app.json` → nada |
| DSN Sentry no perfil production | ausente | `grep -n SENTRY radiant-app/eas.json` → nada |

Confirmação de que nada nativo foi tocado (2026-09-14):

```bash
grep -c expo-iap radiant-app/package.json        # → 0
git status --porcelain | grep -E 'package|app.json|eas.json'   # → vazio
grep -n '"version"' radiant-app/package.json radiant-app/app.json  # → 1.3.1 nos dois
```

Consequência: `.maestro/radiant-1-4-*.yaml`, Sentry mínimo, adaptadores
`ExpoIapStoreKitAdapter`/`ICloudPrivateDatabaseAdapter`, plugin
`with-radiant-icloud.js`, versão `1.4.0` e as atualizações dos documentos
legais/loja **não existem**.

### Lacunas da spec ainda abertas (conferência seção a seção, 2026-09-14)

- **§3.6 transições:** notificação de lembrete abrindo no nó PRÓXIMO; "suas
  vidas voltaram"; boas-vindas suprimidas quando há progresso restaurado do
  iCloud. Não implementadas — dependem de push (fora) e do adaptador iCloud
  (Task 8).
- **§7 `push(snapshot)` a cada conclusão de nó:** `backupNow` existe e é
  testado, mas **nenhuma tela chama** (`grep -rn 'backupNow' radiant-app/src`
  só acha serviço e testes). Ligar em `JourneyProgressService.markNodeCompleted`
  quando o adaptador real existir.
- **§7 aplicação em trilha desconhecida:** `LocalProgressAdapter.apply` ignora
  trilhas que o aparelho ainda não hidratou (não inventa `JourneyProgress`).
  Numa reinstalação, a restauração precisa correr **depois** de a jornada ter
  sido hidratada; hoje ela corre no `Promise.all` da abertura, antes de
  `JourneyProgressService.bootstrap()`. Com nuvem real, revisar a ordem.
- **§5.1 ILIMITADA "corações somem":** `HUD` mostra ∞ (Task 5), mas
  `QuizTopBar` da lição e do checkpoint ainda recebe `hearts.count`; assinante
  vê a contagem que tinha ao assinar. Ajuste de superfície pendente.
- **Folha de vidas → "Ver assinatura":** as três telas passam
  `storeAvailable={false}` e `onSubscribe={() => undefined}`. A rota
  `/subscription` só é alcançável pelo cartão do Perfil. Quando a loja existir,
  ligar `router.push('/subscription')` nas três.
- **§8.1 quatro estados:** cobertos nas telas novas por teste; **não** foram
  vistos em aparelho.
- **§8.3 acessibilidade, §8.5 orçamentos (< 2 s, 60 fps, ≤ 60 MB), §8.6 E2E e
  smoke:** não medidos — exigem build.
- **§9 declarações à loja e §8.7 Sentry:** intocados (Task 8).
- **§6 sem trial:** cumprido — não há código de trial.

---

## 3. Suposições adotadas e alternativas descartadas

1. **Bloqueio pelo `status`, não pela contagem** (lição e checkpoint).
   Alternativa descartada: mudar `HeartsService.setUnlimited` para zerar
   `count` em `MAX_HEARTS` — quebraria um caso da Task 2 que afirma a
   preservação da contagem, e o `status` já é o campo feito para decidir.
2. **Link de termos = EULA padrão da Apple**
   (`https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`). A
   Guideline 3.1.2 exige o link na tela; o projeto não publica termos
   próprios. **Ação do dono:** substituir quando houver termos em
   `saudediagnostica.com`.
3. **IDs de produto** = os de `PaywallPlan` (`monthly_plus`, `annual_plus`),
   injetáveis por `productIds`. Não foram inventados ids novos; os reais vêm do
   App Store Connect (Task 8).
4. **`store-unavailable`/`cloud-unavailable` como erro tipado lançado pela
   porta** e absorvido pelo serviço (nunca lançado à tela). Alternativa
   descartada: valor de retorno discriminado em cada método — mudaria as
   assinaturas do plano.
5. **Backup por trilha** (`completedNodesByTrack: Record<trackId, string[]>`)
   em vez de lista plana — a união por trilha é o que torna "mescla, nunca
   apaga" bem definido quando existem várias trilhas.
6. **`ProfileScreen` deixou de ler `AuthService`**: com a decisão 4 da spec
   (sem conta própria), o e-mail de sessão não tem mais lugar no Perfil. O
   cabeçalho mantém a prop e mostra "Estudo local, sem conta".
7. **Cartões no Perfil entre Missões e Progresso** — depois do "o que fazer
   hoje" e antes do retrospectivo; a alternativa (depois do Progresso) os
   colocaria abaixo de "Ajuda e informações".
8. **`refresh` e `restoreOnLaunch` na abertura, no `Promise.all`** — inertes
   hoje. Alternativa descartada: só ligar na Task 8, deixando o contrato de
   abertura sem teste.
9. **Sem subagentes e sem worktree**, por instrução; o commit da Task 6 sem
   run, por instrução.
10. **"Cache vencido" foi lido como "data de expiração passada sem
    releitura"** (spec §6) — coberto por teste com a loja indisponível.

---

## 4. Achados fora do escopo

1. **`QuizTopBar` mostra contagem para assinante** (ver §2). Superfície da
   lição/checkpoint; não estava na Task 7.
2. **`GamificationService` ainda carrega `hearts`/`heartsLastRefillAt`
   legados** ao lado do `HeartsRepository` da Task 2. Duas fontes para o mesmo
   conceito; a de gamificação não é mais lida pelas telas da 1.4, mas
   permanece persistida.
3. **Saída dos validadores do Loop não é guardada**, só o hash
   (`events.jsonl` → `outputHash`). Para achar o passo reprovado de
   `app-quality` foi preciso reproduzir a cadeia inteira; a duração (43 s) não
   localiza — o passo reprovado era o **último**. Registrado na memória do run
   da Task 7.
4. **`loop --help` e `loop brain --help` devolvem `UNKNOWN_COMMAND`**, e não
   existe comando de leitura de nota; `00 Radiant.md` foi lido do vault com
   manifesto sha256 antes/depois (10/10 arquivos, sem alteração).
5. **`ProfileScreen.flow.test.tsx` e outros testes do projeto colocam
   `jest.mock` antes dos imports**, gerando avisos `import/first` — o `npm run
   lint` do projeto tolera avisos (0 erros, 24 avisos em 2026-09-14). Os
   arquivos novos desta sessão ficaram sem aviso.
6. **`docs/FILA.md`, `radiant-app/src/ui/motion.ts` e o Currículo V3**
   (L1/L2) seguem sujos na working tree, intocados, de outra sessão.

---

## 5. O que a próxima sessão precisa saber

- **Estado do git (2026-09-14, `git log --oneline -4`):** `583dc62` fix,
  `d096a01` Task 7, `425b61f` Task 6, `933f88f` Task 5. Nada foi enviado
  (`git push` proibido). Working tree com a sujeira V3 de outra sessão —
  **não** commitar nem reverter; usar stage parcial em STATUS/roadmap.
- **Loop:** todos os runs desta sessão fechados. Sessão cerebral desta
  conversa: `brain-session-1789429755523-58096822` (fechada ao final). A
  sessão citada no plano (`brain-session-1789424973587-443b4ee1`) é de outra
  conversa e não foi tocada.
- **Antes da Task 8:** obter do dono, com data: autorização de build interno,
  acordo de apps pagos aceito, ids/preços mensal e anual, entitlement iCloud +
  credencial EAS, DSN Sentry. Sem eles, a Task 8 continua bloqueada por
  inteiro — o plano permite bloquear só a parte dependente, mas todas as
  partes dependem de pelo menos um gate.
- **Ao ligar o adaptador real de StoreKit:** trocar o default de
  `SubscriptionService` (construtor `{ store }`), passar `storeAvailable` e
  `onSubscribe` reais para a `HeartsSheet` nas três telas, e substituir os ids
  placeholder.
- **Ao ligar o adaptador real de iCloud:** chamar `backupNow` na conclusão de
  nó; revisar a ordem de `restoreOnLaunch` em relação à hidratação da jornada;
  implementar "boas-vindas não aparecem se há progresso".
- **Memória do run da Task 7** registra as duas lições de método (status vs.
  número; localizar a falha de `app-quality` reproduzindo a cadeia, não pelo
  tempo). O log de observações do task-observer recebeu #315–#319.
- **Comandos:** app/testes com Node 20 (`/opt/homebrew/opt/node@20/bin`), Loop
  com Node 24 (`/opt/homebrew/opt/node@24/bin`); todo comando `loop` a partir
  da raiz do repositório.
