# Revisão da PR #42 — motor híbrido nas lições legadas (FILA 58)

**Data:** 2026-10-18 (America/Bahia).
**Revisor:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), coordenador.
**Autor revisado:** OpenAI Codex, commit `f773585` na branch `codex/motor-hibrido-licao`.
**Especificação:** [plano do pacote](../plano/2026-10-18-pacote-motor-hibrido-na-licao.md).

**Grau:** [reproduzido] executei de novo e obtive o mesmo resultado; [código] li
no diff ou no arquivo; [visto] olhei a captura ou a tela.

## 1. Veredito

**Aprovada, com os ajustes desta revisão.** A entrega cumpre M1 a M8, e o
relatório confere com o que medi. Três pontos eram decisão do dono e foram
decididos na [ADR da régua e da última vida](../../adr/ADR-2026-10-18-regua-de-estrelas-e-ultima-vida.md).
Os ajustes que restaram estão na branch `claude/pr42-ajustes`, empilhada sobre a
do Codex.

## 2. O que confere

| Afirmação do relatório | Conferência |
| --- | --- |
| Gate: 173 suítes, 1.757 testes, visual QA sem regressão | [reproduzido] Worktree limpa no SHA `f773585`, Node 20, `EXPO_NO_DOTENV=1 npm run quality`, saída 0 e os mesmos números |
| Contrato Maestro com 30 testes | [reproduzido] `node --test` deu 30 de 30. Uma contagem minha por `grep` deu 29 e estava errada |
| Loop 15/15 no run `run-1792326922046-8d387120` | [código] Os 4 runs citados estão `closed`, e o último validador de cada um dos 15 está `passed` |
| Vermelhos de M1 a M8 | [código] O log principal tem 11 falhas em 4 suítes, como diz o relatório |
| 9 capturas com SHA-256 | [reproduzido] 9 de 9 hashes conferem. [visto] 5 vidas no primeiro erro, 4 no retorno, resumo com 1 de 2, uma estrela e "Refazer" |
| Inventário de 36 para 76 | [código] `JourneyCatalogReachability.test.ts:47-49` |
| A correção final não infla o placar | [código] `toQuizResult` usa `firstConfirmedAnswers` no modo híbrido. A evidência do G4 também usa a primeira resposta (`LessonOutcomeService.ts:257` e `312`), então acertar o retorno não engana a revisão espaçada |
| Sem conflito com a `main` | [reproduzido] `git merge-tree` com `origin/main` sai limpo |

## 3. Achados

### D1–D3 — decisões do dono (decididas)

- **D1, régua de estrelas:** aprovada.
- **D2, última vida no último retorno:** o Codex fez a lição pausar sem
  concluir. O dono decidiu que ela conclui.
- **D3, primeiro contato com 0 vidas:** continua grátis.

Detalhes na ADR.

### C1 — campos de conteúdo sem leitor (não bloqueia)

[código] `questionIndex` e `reinforceBody` deixaram de ser lidos pelo motor
híbrido, mas continuam nas 2 lições manuais (`lessons.ts`). Eles **não são dado
morto do app**: fazem parte do contrato de conteúdo da `radiant-api`
(`radiant-api/src/types.ts`, `server.ts`) e da validação remota
(`LessonCatalogService.ts:119-122`). Tirá-los só do app abriria uma divergência
entre os pacotes. O ajuste anota no tipo que o motor não os lê. Limpar o contrato
fica como trabalho à parte, nos dois pacotes.

### C2 — acabamento (corrigido)

- O feedback era igual no acerto e no erro. Agora a borda e o título usam
  `statusSuccess` no acerto e `statusError` no erro, como o cartão da revisão G4.
- "Refazer" tinha o mesmo peso de "Continuar". Agora é `secondary` e fica abaixo.
- **Não corrigido:** o total de passos cresce quando o aluno erra, porque o item
  volta no fim, e a barra de progresso recua. Fica como observação de design.

### P1 — processo (não bloqueia)

O prompt pedia que a PR fosse aberta contra a branch da #41. A #41 foi mergeada
antes de a #42 ficar pronta, então a #42 precisa apontar para a `main`. O
relatório diz com franqueza que a revisão do Argon não estava na base dele, e
que ele a leu no checkout principal sem editá-lo.

## 4. O que os ajustes mudam

| Mudança | Prova |
| --- | --- |
| A última vida no último retorno conclui a lição (D2) | O teste novo foi [visto falhando](../../evidence/2026-10-18-pr42-ajustes/red-ultima-vida.log) com a folha de pausa na tela. Uma guarda de validade confere que perder a última vida num retorno intermediário ainda pausa antes do retorno seguinte |
| Tom do feedback (C2) | [Vermelho](../../evidence/2026-10-18-pr42-ajustes/red-feedback-tom.log): borda sem cor |
| "Refazer" secundário (C2) | [Vermelho](../../evidence/2026-10-18-pr42-ajustes/red-refazer-secundario.log): fundo da ação principal |
| Roteiro de vidas: a 5ª sessão conclui, a 6ª é barrada no retorno | [Vermelho do contrato](../../evidence/2026-10-18-pr42-ajustes/red-contrato-vidas.log). Execução nativa no [relatório dos ajustes](../../evidence/2026-10-18-pr42-ajustes.md) |

## 5. Limites desta revisão

- Não rodei nativamente os outros sete roteiros. Rodei o de vidas depois dos
  ajustes.
- Não verifiquei Android, aparelho físico, Release nem VoiceOver auditivo, assim
  como o Codex.
- O som, o XP e a sequência não mudaram nos ajustes. Confiei nos testes de
  integração do Codex, que passaram no gate reproduzido.
