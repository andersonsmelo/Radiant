# Medição do valor `@radiant:item_review_v1` com a trilha dobrada (310 aulas)

Data: 2026-11-19. Valor medido no Node, não no CursorWindow do Android.

Node v20.20.2, Jest com o AsyncStorage de teste. Limite de comparação: 1,9 MiB = 1.992.294 B (o maior valor que voltou íntegro no emulador Android; ver `docs/STATUS.md`, "1,9 MiB" / CursorWindow). É medida do Node, não do Android.

## Comando

```
cd radiant-app
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
BENCH_OUT=<arquivo.json> npx jest --runInBand \
  --testMatch '**/*.doubledTrail.bench.ts' src/features/spaced-repetition -t 'caso A'   # e 'caso B', 'caso C'
```

Arquivo criado (único): `radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.doubledTrail.bench.ts`. Fica fora da suíte pelo mesmo motivo do vizinho: o `testMatch` do `jest.config.cjs` só coleta `*.test.*`. Cada caso leva ~2 min (500 aulas).

## O que passa pelo código real e o que é sintético

Real (sem alteração):
- `LessonOutcomeService.recordActivityCompletion` -> `recordEvidence` -> `itemReviewRepository.record` (1 tentativa `study` + 1 cartão por interação, de qualquer tipo; `LessonOutcomeService.ts:128` e o laço seguinte).
- `assessmentAttemptRepository.submit` -> `reconcile` interno -> `seedRecovery` (só na reprovação) + `journal.recordBatch` (1 tentativa + 1 cartão por item de conferência; `AssessmentAttemptRepository.ts:91,100`).
- `ItemReviewCoordinator.loadQueue([], now)`, que roda o `reconcile` privado e `reconcileVersions` do repositório, com o `reviewCatalog` real (`ItemReviewService.ts:15-40`). Aplicado em um storage próprio, a partir de cópias do valor a cada 10 aulas.

Sintético:
- Catálogo: mock de `ProductionCurriculumCatalog` com os formatos de id do lote `rtg-2026-m01` (`activity:rtg-2026:m01:aula-01`, `interaction:...:i1`, `checkpoint-item:...:c1`, `recovery-item:...:guiada|transferencia`, nó `node:checkpoint:rtg-2026:m01:aula-01`, `contentVersion` `rtg-2026-m01-v1`). Competência 1 por aula, como no lote.
- Ids de tentativa (`study:<aula>:<n>`, `attempt:<aula>:<n>`): inventados; os de produção podem ter outro comprimento (efeito de poucos %).
- Snapshot da jornada e os demais serviços (Gamification, Sync, etc.) são mocks, iguais aos do `LessonOutcomeService.test.ts`.
- Ordem: por aula, estudo (5 interações) e em seguida a conferência da aula (2 itens). Em produção a conferência é por estágio/competência, que no lote real é 1 competência por aula; o par de recuperação também é por competência.

## Resultado, 310 aulas

| Caso | Momento | Cartões | Tentativas | Bytes | MiB | Margem vs 1,9 MiB |
|---|---|---|---|---|---|---|
| A (2 MC + 3 outros) | antes do `reconcile` | 2.170 | 2.000 (cap; 2.170 gravadas) | 2.251.332 | 2,147 | -0,247 (estoura) |
| A | depois do `reconcile` | 1.240 | 2.000 | 1.714.412 | 1,635 | +0,265 (cabe) |
| B (0 MC) | antes | 2.170 | 2.000 | 2.251.332 | 2,147 | -0,247 (estoura) |
| B | depois | 2.170 | 2.000 | 2.251.332 | 2,147 | -0,247 (estoura; nada muda) |
| C (A + conferências reprovadas + recuperação) | antes | 2.790 | 2.000 | 2.613.530 | 2,492 | -0,592 (estoura) |
| C | depois | 1.860 | 2.000 | 2.076.610 | 1,980 | -0,080 (estoura) |

Cartões por aula: A antes 7 (5 estudo + 2 conferência), A depois 4 (2 MC + 2 conferência); B 7 e 7; C antes 9 (5 + 2 + 2 recuperação), C depois 6 (2 + 2 + 2). Tentativas: 7 por aula (5 + 2) nos três casos, então o teto de 2.000 é atingido com ~286 aulas e as 2.000 pesam ≈ 1,0 MB (≈ 499 B cada). Cartão ≈ 577 B.

Comparação com a estimativa anterior: A estável 1,67 MiB (medido 1,635), pior caso 2,3 MiB (medido 2,147), pior+recuperação ≈ 2,7 MiB (medido 2,492). A estimativa era 2 a 7% conservadora; a conclusão qualitativa se confirma.

## 1. Em quantas aulas passa de 1,9 MiB (curva a cada 10 aulas, até 500)

| Caso | Primeira medida acima de 1,9 MiB | Observação |
|---|---|---|
| A, sem reconcile | 270 aulas (250 ainda cabe: 1,796 MiB) | transitório: só vale se o `reconcile` nunca roda |
| A, com reconcile | 430 aulas (400: 1,838 MiB; 500: 2,064 MiB) | o teto de tentativas satura a ~286 aulas; depois cresce só 4 cartões/aula ≈ 2,3 KB |
| B | 270 aulas, igual antes e depois do reconcile | 7 cartões/aula, permanentes |
| C, sem reconcile | 230 aulas | |
| C, com reconcile | 290 aulas (280 cabe; 300: 1,947 MiB) | já estoura nas 310 previstas |

Resolução da curva: 10 aulas (limiar real entre a última medida abaixo e a primeira acima). Referência: a trilha de hoje (157 aulas) mede 1.182.424 B (1,13 MiB) em A/B antes do reconcile e 910.500 B (0,87 MiB) depois.

## Aula sem nenhuma múltipla escolha deixa cartões que nunca saem?

Sim, 5 por aula, permanentes. Evidência de código e de execução:
- Gravação: toda interação, de qualquer tipo, cria cartão (`LessonOutcomeService.ts:128` -> `itemReviewRepository.record`; o `recordMany` cria/avança o cartão na mesma escrita da tentativa).
- Definições: só `multiple-choice` vira definição de revisão (`ItemReviewService.ts:37-38`). Para uma atividade sem MC o ramo `if (activity) return ...flatMap` devolve `[]` e não cai no catálogo legado.
- Limpeza: o coordenador só planeja a lição se `current.length` é positivo (`ItemReviewService.ts:71`), e o repositório pula `if (!current.length) continue` (`ItemReviewRepository.ts:261`; o comentário em 250 diz "lição sem definições atuais fica intacta"). Com 0 definições, nunca há plano, e os 5 cartões ficam.
- Execução: caso B, `orphanCardsPerLesson` = 0 (nada removido) e valor idêntico byte a byte antes/depois (2.251.332 B). Caso A: 3 cartões órfãos por aula removidos (5 - 2 MC), 930 no total.
- Nota: esses cartões também não aparecem na fila (sem definição), então ocupam espaço sem servir à revisão.

## 2. Mudança mínima, sem redesenhar o armazenamento (só descrição)

Efeito projetado com os custos medidos (577 B/cartão, 499 B/tentativa, 2.000 tentativas ≈ 1,0 MB), 310 aulas, depois do reconcile:

| Mudança | Cartões | MiB projetado | Cabe? |
|---|---|---|---|
| nenhuma, formato como em A | 1.240 | 1,635 | sim, folga 0,27 |
| régua de conteúdo: ao menos 1 MC por aula (1 MC/aula) | 930 | ≈ 1,46 | sim, folga ≈ 0,44 |
| régua de conteúdo mas com 0 MC (B) | 2.170 | 2,147 | não |
| não gravar cartão para interação sem definição, 0 MC (B) | 620 (só conferência) | ≈ 1,30 | sim, folga ≈ 0,6 |
| idem, com todas as conferências reprovadas (C) | 1.240 | ≈ 1,63 | sim |
| régua 1 MC/aula, C | 1.550 | ≈ 1,80 | sim, folga ≈ 0,1 (apertado) |

Recomendação: a mudança que remove a causa é **não criar cartão para interação sem definição de revisão** (gate em `recordEvidence`/`record`: só chamar a escrita do cartão quando `reviewCatalog.definitions(lessonId)` contém o item, ou uma flag do `record` para gravar a tentativa sem cartão). Torna B, o caso de formatos novos no lugar da MC, igual ao melhor caso e deixa o `reconcile` só para troca de versão. A régua "toda aula tem ao menos uma MC" também resolve o pior caso de forma estável, mas é frágil: depende de disciplina editorial (hoje só `RtgCatalog.test.ts:155-168` a exige, e só para M01-M03), e um contrato novo teria de cobrir as 310 aulas. As duas juntas dariam folga em C.

Lever extra de uma linha, se ainda faltar margem: `ITEM_ATTEMPT_CAP` de 2.000 para 1.000 poupa ≈ 0,48 MiB. Não verifiquei quem lê `attempts` para decidir se isso é seguro (o rollup/mastery depende de tentativas retidas?). É decisão para depois.

## Limites da medição

- Node, não o CursorWindow do Android: o limiar de 1,9 MiB vem de um único emulador (API 34), como já registrado em `docs/STATUS.md`.
- Ids de tentativa inventados; catálogo mockado com ids no formato do lote. Textos das aulas não entram no valor (só ids e datas), então o conteúdo real não muda o tamanho.
- Datas de `recordedAt`/`dueAt` são ISO de 24 caracteres, como em produção.
- O `reconcile` foi aplicado a cópias do valor a cada 10 aulas (com `now` único), não a cada abertura da Home. Em produção ele roda a cada `loadQueue`/`effectiveSchedule`, então o estado de A observado pelo aluno é "depois", com a exceção transitória da aula recém-concluída.
- Caso C reprova todas as 310 conferências uma vez, sem reforço nem nova tentativa; é extremo, não esperado.
- Achado lateral: o valor da chave `@radiant:assessment_attempts` (`STORAGE_KEYS.ASSESSMENT_ATTEMPTS`), separado e sem teto, mediu 1.315.032 B em 500 aulas (A/B: ≈ 2,6 KB/aula, ≈ 0,78 MiB aos 310) e 1.593.532 B em C (≈ 3,2 KB/aula, ≈ 0,94 MiB aos 310). Extrapolação linear, não medida além de 500: cruza 1,9 MiB perto de 757 aulas (A/B) e 625 (C). Está fora da pergunta, mas é o próximo valor único a crescer sem teto.
- Não rodei `quality`, `loop`, Metro nem simulador; só o jest do bench. O arquivo do bench não é commitado e não foi `git add`.
