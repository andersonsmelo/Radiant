# FILA 55 (A1) — a versão nova de conteúdo preserva a data de revisão

**Data:** 2026-10-18 (America/Bahia).
**Autor:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).
**Decisão:** [ADR do A1](../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md).
**Branch:** `claude/fila-55-a1`, a partir da `main` em `116e384`.

## O defeito

A chave do cartão inclui a `contentVersion` (`types/itemReview.ts:29-30`). Quando
um lote ganhava versão nova, nenhum cartão casava com o catálogo:
- a fila descartava os cartões;
- a lição continuava "gerida", então nunca era semeada de novo;
- `effectiveSchedule` a apagava da agenda.

Corrigir um erro de digitação, com a versão incrementada como o contrato pede,
tirava a lição da revisão de todos os alunos
([revisão, A1](../trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md)).

## A correção

- **`ItemReviewRepository.reconcileVersions`** faz a troca numa escrita atômica,
  para cada lição com cartões de versão que o catálogo não tem mais:
  - o mesmo `itemId` na versão atual herda **só o `dueAt`**. Intervalo,
    repetições e tentativa recomeçam (`interval 1`, `repetitions 0`,
    `lastAttemptId null`). As tentativas antigas continuam no journal, na versão
    em que foram registradas;
  - o item removido sai da agenda;
  - o item novo é semeado como na migração do legado, depois dos herdados:
    `max(vencimento mais cedo, agora) + 1 dia` por posição;
  - se a lição não tem definições atuais, nada muda: uma falha do catálogo não
    pode apagar a agenda;
  - um cartão da versão atual já criado por estudo prevalece, e o órfão sai.
- **`ItemReviewCoordinator`** monta o plano pelo catálogo e reconcilia antes de
  montar a fila (`loadQueue`, que o `dueCount` também usa) e a agenda
  (`effectiveSchedule`). Se a escrita falhar, a fila acusa
  `review-store-unavailable`, como já fazia na semeadura, e a agenda segue com
  os órfãos ignorados.

## Quem usa a agenda

A enumeração foi feita com `grep -rln`, sem cortar a saída:
- **gravam:** `LessonOutcomeService` (estudo), `AssessmentAttemptRepository`
  (avaliação) e o próprio serviço (semeadura e revisão). Todos gravam com a
  versão atual;
- **leem a agenda:** `SpacedRepetitionService` (`effectiveSchedule`, `dueCount`)
  e `useReview` (`loadQueue`, `recordReview`, `recordAnswer`);
- **leem só as tentativas:** `LearningEvidenceRepository`. As tentativas não
  mudam;
- a chave `ITEM_REVIEW` não entra na sincronização de progresso.

## Vermelho, antes da correção

[Log](2026-10-18-a1-preserva-data/red-a1.log), Node `v20.20.2`, Jest em banda
única. Três falhas pelos motivos previstos:
- os cartões continuavam em `v1`;
- o item removido continuava na agenda;
- o órfão sobrava ao lado do cartão de estudo.

A quarta asserção, a do catálogo vazio que não apaga a agenda, passou antes e
depois. Ela é a guarda de validade de um comportamento que já existia.

O teste antigo, que exigia fila e agenda vazias depois da troca de versão, foi
substituído. A intenção dele continua coberta: nenhuma tentativa é criada nem
transferida. O que ele aceitava, a lição sumir da revisão, agora é barrado: o
teste novo exige a lição de volta à fila e à agenda na data herdada.

## Gates

- **Quality:** Node `v20.20.2`, `EXPO_NO_DOTENV=1 npm run quality`.
  - **1ª execução: reprovou** num teste que este pacote não toca:
    `CheckpointScreen.flow.test.tsx`, "sem crédito, a celebração mostra só o
    total", que não achou "XP total: 120" dentro do prazo. O caminho dessa
    celebração não passa pela reconciliação, e os `reconcile` do diretório de
    checkpoints são outras funções. O arquivo isolado passou 3 de 3 nesta
    branch. Com a CPU limitada (`taskpolicy -b`, `--no-cache`), passou 3 de 3
    nesta branch e 3 de 3 numa worktree limpa da `main`. Leio como instabilidade
    de tempo sob a carga da suíte inteira, mas isso não foi provado.
  - **2ª execução: saída 0.** São 173 suítes e 1.763 testes: os 1.760
    anteriores mais 3, porque 4 testes novos substituíram 1. O visual QA teve
    60 achados e 0 regressões. [Log](2026-10-18-a1-preserva-data/quality.log),
    da 2ª execução.
- **Loop:** `VALIDATION_PASSED`, 15/15, no `run-1792331403454-827ca735`, depois da 2ª execução do quality.

## Limites

- Não há prova nativa: a mudança está na camada de dados e não tem tela nova.
  O caminho do aluno na revisão segue coberto pelos testes de `useReview`.
- Nenhum lote real mudou de versão ainda, então o efeito em dados de aluno não
  foi observado fora dos testes.
