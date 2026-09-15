# Prompt de continuidade 2 — Radiant 1.4, depois das Tasks 1–7

Substitui o
[prompt 1](2026-09-14-radiant-1-4-prompt-de-continuidade.md), que levou a
1.4 até a Task 7. Cole o bloco entre as linhas `---` como primeira mensagem.

---

Você vai continuar a versão 1.4 do Radiant, um app iOS de treinamento em
radiologia (Expo / React Native). Sete das oito tarefas do plano já foram
implementadas por outra IA e revisadas de forma independente. Você trabalha
sozinho e entrega um relatório no fim. O dono lê o relatório, não o processo.

## 1. Leia, nesta ordem, antes de qualquer ação

1. `AGENTS.md` — o contrato entre IAs. A seção "Cinco lições operacionais da
   semana de 2026-09-08 a 14" é o que custou runs à IA anterior; não repita.
2. `docs/STATUS.md` — estado vivo. Os blocos de 2026-09-14 dizem o que a 1.4
   tem e não tem.
3. `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`
   — a spec, o contrato. Nenhuma das dez decisões da §1.2 é reaberta.
4. `docs/adr/ADR-2026-09-14-1-4-freemium-por-vidas-storekit-e-icloud.md`.
5. `docs/superpowers/plans/2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md`
   — o plano; a Task 8 é a única aberta.
6. `docs/superpowers/handoffs/2026-09-14-radiant-1-4-relatorio-execucao.md`
   — o relatório da IA anterior. As §2 (lacunas) e §3 (suposições) são a sua
   lista de entrada.

## 2. Estado que você vai encontrar (medido em 2026-09-14)

- `main` = `adb544d`, igual a `codex/radiant-1-4`, ambos no GitHub. Trabalhe
  numa branch sua a partir de `main`.
- Gates da 1.4 na `main`: **125 suítes / 958 testes verdes**, `tsc` exit 0,
  ESLint 0 erros / 24 avisos. Reproduza antes de começar: se algo estiver
  diferente, o estado mudou e o `STATUS.md` está atrasado.
- Implementado e verificado no código: `NextNodeResolver` decidindo a trilha
  (via `JourneyRecommendationService` → `JourneyProgressService.computeSnapshot`);
  `HeartsService` + `HeartsRepository`, descontados em lição e checkpoint;
  trilha virtualizada (`JourneyTrail`) com cabeçalho de vidas; folha de vidas
  nas três telas; migração 1.3.1 → 1.4 com backup; `SubscriptionService` com
  porta de loja e tela `/subscription`; `ProgressSyncService` com porta de
  nuvem.
- **Não implementado:** adaptadores nativos — StoreKit (`expo-iap` não está
  instalado), iCloud (entitlement ausente), Sentry (DSN ausente); E2E;
  medições em aparelho; versão ainda `1.3.1` em `package.json`/`app.json`.
- **Árvore suja de outra sessão — não toque, não commite, não reverta:**
  `docs/plans/2026-07-27-radiant-launch-roadmap.md`, `radiant-app/src/ui/motion.ts`,
  e os não rastreados `docs/curriculum-v3/`,
  `docs/superpowers/plans/2026-08-2*-curriculum-v3-arco-1-l*.md`,
  `radiant-app/src/features/curriculum-v3/l1-body-reference/`, `.../l2-slicing-space/`.
  `docs/STATUS.md` e `docs/FILA.md` também estão sujos por essa sessão: ao
  commitar os seus trechos neles, use stage parcial (`git hash-object -w` +
  `git update-index --cacheinfo` com o conteúdo de `HEAD` + suas linhas).
- `~/Developer/Radiant-release` é um worktree limpo de `main`, para builds.
  Não é seu para editar.

## 3. O que fazer — depende dos gates do dono

**Primeiro, meça os gates.** Pergunte ao dono, ou leia no `STATUS.md` se ele
já registrou, e anote com data no relatório:

| Gate | Como medir |
| --- | --- |
| Acordo de apps pagos aceito | só o dono vê (App Store Connect → Negócios); pergunte |
| Produto de assinatura criado, com ids e preços | o dono informa os ids; sem eles, não invente |
| DSN do Sentry no perfil `production` | `cd radiant-app && npx eas env:list --environment production` |
| Entitlement do iCloud + credencial EAS | o dono confirma; `npx eas credentials` pede interação dele |

### 3A. Se os gates estiverem disponíveis → Task 8

Siga a Task 8 do plano. Ordem: adaptador StoreKit (`expo-iap`, ids reais,
`storeAvailable` e `onSubscribe` reais na folha das três telas) → adaptador
iCloud (plugin de configuração; chamar `backupNow` na conclusão de nó;
resolver a ordem de `restoreOnLaunch` vs. hidratação da jornada; suprimir
boas-vindas quando há progresso restaurado) → Sentry com configuração mínima
(sem IP, sem identificador) → `QuizTopBar` mostrando ∞ para assinante → bump
para `1.4.0` → E2E dos três caminhos dourados (Maestro) → checklist de
declarações à loja (spec §9) como arquivo novo em `docs/release/`.
**Build interno (`preview`) só com autorização explícita do dono; build de
produção e envio nunca.**

### 3B. Se algum gate faltar → o que não depende dele

Faça, cada item num run próprio, nesta ordem:

1. **Aposentar `hearts` legados do `GamificationService`** — duas fontes para
   o mesmo conceito (relatório §4.2; revisão independente). Migração com
   teste sobre fixture real da 1.3.1.
2. **Remover o cartão de conta morto de `ProgressScreen`** (o bloco
   condicionado por `remoteSyncAvailable`) e o teste que o mockava com sync
   ligado — o teste na configuração de produção fica.
3. **Ligar a folha de vidas à rota `/subscription`** nas três telas
   (`router.push`), com `storeAvailable` derivado do `SubscriptionService`
   mesmo sem adaptador (hoje é `false` fixo).
4. **`QuizTopBar` para assinante: ∞, não a contagem** (relatório §2).
5. **Chamar `backupNow` na conclusão de nó** contra a porta atual (no-op sem
   adaptador), com teste — para que ligar o iCloud depois seja só trocar o
   adaptador.
6. **Suprimir boas-vindas quando `restoreOnLaunch` devolveu progresso** e
   corrigir a ordem em relação à hidratação da jornada (relatório §2, §7).
7. Cobertura dos **quatro estados** (spec §8.1) nas telas que ainda não têm
   teste de estado na configuração de produção.

Cada um destes tem teste vermelho antes; as tabelas da spec (§4, §5) já são
suítes — não as reescreva, estenda.

## 4. Regras que valem sempre

- Toda alteração passa pelo Loop, aberto pelo embrulho
  `node scripts/loop/abrir.mjs "<descrição>" <arquivo>...`, com Node 24 no
  `PATH` para o `loop` e Node 20 para o app. Caminho com acento vem do
  `find`. Fechamento: `validate` → `step finish` → (`memory write`, em
  chamada separada, resumo < 1000 caracteres) → `run close`, lendo cada
  envelope. Detalhes e armadilhas: `AGENTS.md`.
- Sem `eas build` de produção, sem `eas submit`, sem `git push` — deixa
  pronto e relata. Build `preview` só com "pode" do dono, datado.
- Sem aba nova, sem formulário de login, sem SDK de terceiro para compras,
  sem palavra de infraestrutura em tela de aluno, sem trial.
- Não toque em `conteúdo/`, `Conteúdo/`, `content-manifest/`, direitos, nem
  no V3 (não chame `prepareV3()`).
- Não altere a spec. Se um ponto for inexecutável, pare a tarefa, prove com
  medição no relatório e siga para a próxima independente.
- Pare em `PROJECT_BUSY`, `needs_human`, `OUT_OF_SCOPE_CHANGE`,
  `SECRET_DETECTED`. Nunca recupere lock.

## 5. O relatório

`docs/superpowers/handoffs/<data>-radiant-1-4-relatorio-execucao-2.md`, em
português, e uma linha datada por tarefa no `docs/STATUS.md` (editando; nunca
um arquivo de status novo). Seções: (1) o que foi feito, por tarefa — arquivo,
commit, run, evidência com **a suíte inteira** (não só as tocadas); (2)
pendências e motivo; (3) suposições e alternativas descartadas; (4) achados
fora do escopo; (5) o que a próxima sessão precisa saber. Toda afirmação de
estado leva data e o comando que a remede. "Funciona" sem evidência não entra.

---
