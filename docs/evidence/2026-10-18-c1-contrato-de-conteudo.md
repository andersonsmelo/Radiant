# C1: `questionIndex` e `reinforceBody` saem do contrato de conteúdo

**Data:** 2026-10-18. **Autor:** Claude Opus 5.5. **Base:** branch
`claude/r6-store-revisao` em `92764d7`, sobre a `main` em `e2e0524`.
**Origem:** o achado C1 da [revisão da PR #42](../trilha/avaliacoes/2026-10-18-revisao-da-pr-42.md)
e o item C1 da §4 do prompt de continuidade (19).

## Por que os dois saem juntos

Desde o motor híbrido (FILA 58), a lição usa todas as perguntas e a explicação
vem no feedback de cada item. `questionIndex` e `reinforceBody` ficaram sem
leitor no app. Eles continuavam no tipo porque eram parte do contrato da
`radiant-api`, e tirá-los de um pacote só abriria uma divergência.

**[código] Leitores conferidos antes de remover.** Fora do validador do
`LessonCatalogService`, ninguém lia os dois campos do estágio da jornada. O
`questionIndex` do `buildMultipleChoiceStep`, em `JourneyDefinitionService.ts`,
é o índice do laço, e não o campo. `contextBody` e `teachBody` continuam lidos e
ficam.

## O que mudou

- **API:**
  - os dois campos saíram dos tipos (`types.ts` e o tipo de linha em `server.ts`);
  - saíram também do seed `sql/002_seed_content.sql`, em quatro estágios de duas
    lições. A edição foi por linha, e os dois payloads continuam JSON válido,
    iguais ao original menos as duas chaves.
- **App:**
  - os campos saíram do `QuizLessonJourneyStageCopy`, do validador do catálogo
    remoto e das duas lições locais (`data/lessons.ts`);
  - as fixtures de teste também foram limpas.
- **[código] Compatibilidade.** A API devolve o `payload` do banco como está. O
  seed faz upsert do `payload` a cada `db:migrate`, então o próximo
  `db:migrate` tira os campos do banco. Até lá, um payload antigo que ainda os
  traga continua válido no app, que ignora os dois campos como qualquer chave
  desconhecida, mesmo com outro tipo.

## Vermelho antes do conserto

[medido] Os testes novos, escritos antes da remoção, no Node 20.20.2:

```text
### API: npx tsx --test src/routes/content-contract.test.ts
ok 1 - GET /v1/content/catalog adds metadata when upstream omits it
not ok 2 - the content seed serves journey stages with only the fields the app reads
    + actual - expected
    + [
    +   'lesson-1.intro.questionIndex',
    +   'lesson-1.intro.reinforceBody',
    +   'lesson-1.review.questionIndex',
    +   'lesson-1.review.reinforceBody',
    +   'lesson-2.intro.questionIndex',
    +   'lesson-2.intro.reinforceBody',
    +   'lesson-2.review.questionIndex',
    +   'lesson-2.review.reinforceBody'
    + ]
  expected:
  actual:
# pass 1
# fail 1

### API: npm run typecheck
src/routes/content-contract.test.ts(39,1): error TS2578: Unused '@ts-expect-error' directive.
src/routes/content-contract.test.ts(41,1): error TS2578: Unused '@ts-expect-error' directive.

### App: npx jest LessonCatalogService.test.ts
    ✕ aceita payload remoto antigo com questionIndex e reinforceBody e ignora os dois campos (1 ms)
    Expected: "Contexto remoto antigo"
    Received: "Você vai começar pelo papel dos raios-X e pelo raciocínio básico de contraste e radiopacidade."
Tests:       1 failed, 9 passed, 10 total

### App: npx tsc --noEmit
src/features/content/services/LessonCatalogService.test.ts(28,1): error TS2578: Unused '@ts-expect-error' directive.
src/features/content/services/LessonCatalogService.test.ts(30,1): error TS2578: Unused '@ts-expect-error' directive.
```

Cada um falhou pelo motivo previsto:
- o seed tinha 8 chaves fora do contrato;
- as typechecks dos dois pacotes reprovaram com "Unused '@ts-expect-error'",
  porque os campos ainda existiam no tipo;
- o app recusava o payload antigo, e a lição caía no conteúdo local.

## Depois

- **[medido] API:** `typecheck` e `lint` limpos, e 14 testes aprovados (eram 13).
- **[medido] App:** `tsc --noEmit` limpo, e 41 suítes com 477 testes aprovados
  em `content`, `journey`, `lesson-flow` e `quiz`. O gate inteiro roda no
  `loop validate` deste run.

## Limites

- Nenhum banco foi migrado nesta etapa. A API pública está inativa, e o campo
  sai do banco no próximo `db:migrate`.
- O `content_version` do seed não mudou, porque o conteúdo que o aluno vê é o
  mesmo.
