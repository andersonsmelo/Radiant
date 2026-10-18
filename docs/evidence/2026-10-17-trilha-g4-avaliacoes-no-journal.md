# G4 — avaliações no journal comum de itens

**Data:** 2026-10-17, America/Bahia.  
**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Base:** `codex/radiant-study-improvements`, HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`. A árvore contém G0–G4 anteriores e reorganização documental compartilhada não commitados, preservados.  
**Método:** rastrear os chamadores reais de `AssessmentAttemptRepository`, manter o kernel opcional com seu rollout atual, exercitar stores em memória e tela montada, injetar falhas de escrita e defeitos específicos e executar o gate configurado do Loop. [código] significa prova local; [usuário], decisão recebida; [inferido], continuidade proposta. Não houve nova pesquisa clínica nem execução nativa.

## Lacuna medida

[código] A avaliação V2 usada por `CheckpointScreen` gravava o histórico específico de aprovação/reforço, mas não seus itens no journal usado por lições e revisão. O retry da última questão gerava outro ID/data; o repositório retornava uma tentativa já existente sem comparar o material recebido. São lacunas distintas de atomicidade entre os stores de XP, jornada e kernel, que esta entrega não resolve globalmente.

## Implementação

[código] O journal aceita `recordBatch`: valida todos os itens, recusa conflito ou capacidade excedida e confirma tentativa/agendas numa única escrita. Se um item posterior conflitar, o novo item anterior também não é gravado. Mesmo lote confirmado não altera os intervalos. O modo `assessment` conserva competências atribuídas, duração, ajuda e erro crítico, sem alternativa escolhida, prosa ou imagem. Há um cartão por item; a projeção de evidência cobre cada competência atribuída. Erro crítico conserva seu sinal e se projeta como erro, mesmo se `outcome` original vier correto.

[código] O histórico operacional permanece a autoridade de aprovação/reforço. O novo registro inclui `journalStatus: pending`; após confirmar o journal, recebe `confirmed`. `submit` e `getState` retomam o pendente. Assim, morte depois de gravar o resultado ou depois de confirmar os itens pode ser retomada por outra instância, sem exigir respostas novamente. Não se trata de uma transação atômica entre os dois stores: a pendência é explícita e a operação só retorna sucesso após o recibo. Histórico anterior sem marcador não gera backfill implícito.

[código] Escritores do histórico compartilham fila por porta de storage. As fachadas nativas do histórico e do journal usam a mesma porta. Mesmo ID com respostas/metadados distintos é recusado; divergência entre a tentativa persistida e o intent validado impede projetar e sobrescrever. Schema futuro ou JSON inválido do journal não autoriza apagar os bytes desconhecidos. Campos antigos do journal continuam legíveis; um leitor antigo que não conhece `assessment` recusa o envelope em vez de regravá-lo como vazio.

[código] A tela conserva o mesmo input no retry da última questão, inclusive ID e data, e bloqueia trocar sua resposta já enviada. Aprovação salva pode ser concluída após reabrir. A tela só oferece iniciar após ler/reconciliar o histórico; a falha permite tentar a leitura novamente. Um resultado final confirmado encerra a lista de cobranças da tentativa. Falha antes dessa confirmação preserva a cobrança única por pergunta. Retry de conclusão na mesma montagem não volta a solicitar crédito de XP.

[código] `ItemReviewService` resolve os itens da avaliação pelo checkpoint/nó e versão atuais, com payload do catálogo promovido. A integração de tela percorre uma avaliação real, confirma seus dois itens, abre a fila vencida e confirma autoavaliação assistida. A fila mantém o limite anterior de 50 e a separação entre versões; não foi criado um segundo algoritmo de agenda.

## Evidência

[código] **Nove suítes/160 testes focados** no Node 20: histórico de avaliação, regra de avaliação, journal, coordenador de revisão, projeção de evidência, tela da avaliação, outcome de lição, hook de revisão e cálculo de domínio. Incluem um lote de mil itens/uma escrita; concorrência entre instâncias; falhas no primeiro write do histórico, no journal e no recibo; retomada após reabrir; conflito tardio sem escrita parcial; preservação do schema futuro; múltiplas competências e erro crítico; retry da tela e payload real de avaliação.

[código] Vermelho inicial observado: os três testes novos do histórico falharam por asserção (nenhum item no journal; mesmo ID conflitante aceito; dependência futura ignorada), enquanto os cinco anteriores passaram. Uma fixture de ciclos usava o mesmo timestamp em tentativas diferentes e passou a representar horários crescentes. Um mock de escrita recursivo e uma fixture parcial sem `progress` foram corrigidos; essas falhas não contam como prova discriminante de persistência.

[código] **Cinco mutações**, aplicadas isoladamente com âncora única e restauração byte a byte em `finally`:

| Defeito injetado | Resultado observado |
| --- | --- |
| Escrever cada item antes de validar/aplicar o restante do lote | 2 falhas de asserção/3 passes |
| Gerar novo input no retry da última resposta | 1 falha de asserção/0 passes |
| Omitir reconciliação ao reabrir o histórico | 2 falhas de asserção/0 passes |
| Projetar só a primeira competência atribuída | 1 falha de asserção/0 passes |
| Projetar erro crítico como acerto | 1 falha de asserção/0 passes |

O verde final é medido após restaurar as injeções. Não se somam testes focados e suíte inteira como se fossem testes distintos. Os resultados integrais de lint, tipos e demais validadores ficam no próprio run; não representam CI remoto nem aplicativo distribuído.

[código] O primeiro gate integral teve 13 validadores aprovados e duas reprovações no app. A suíte inteira reproduziu **1 falha/1722 passes**: a releitura bem-sucedida do histórico apagava o erro de recusa da jornada no deep link de checkpoint bloqueado. A conclusão continuava recusada, mas seu erro desaparecia da tela. A releitura agora limpa apenas seu próprio erro de carregamento; o teste existente de fronteira foi reproduzido sem alterar suas expectativas. O gate foi repetido após essa correção, com resultado registrado no mesmo run.

## Reprodução e rastreabilidade

No Node 20, a partir de `radiant-app`:

```bash
node node_modules/jest/bin/jest.js --runInBand src/features/student-checkpoints/AssessmentAttemptRepository.test.ts src/features/student-checkpoints/UnitCheckpointService.test.ts src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts src/features/spaced-repetition/services/ItemReviewService.test.ts src/features/mastery/repositories/LearningEvidenceRepository.test.ts src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/lesson-flow/services/LessonOutcomeService.test.ts src/features/review/hooks/useReview.test.ts src/features/mastery/services/CompetencyMasteryService.test.ts
node node_modules/jest/bin/jest.js --runInBand src/features/journey/services/JourneyNodeCompletionGuard.test.tsx src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx
```

Run `run-1792262643188-24b24d6e`; gate e fechamento por `loop run status --run run-1792262643188-24b24d6e`. Sessão de leitura `brain-session-1792262582465-8d8de2c6` fechada antes de abrir o escritor, pois `brain-links` reentra na CLI. Fechamento pelo contrato público: `validate → step finish → memória opcional → run close`, com envelopes conferidos individualmente.

## Limites e continuidade

[código] Esta entrega integra as avaliações V2 do caminho atual. O kernel opcional conserva suas autoridades e seu rollout; V3 não foi ativado. A revisão continua revelando a resposta antes da autoavaliação: não prova recuperação independente nem retenção após intervalo. O registro de avaliação usa a classificação já emitida pelo player, sem alegar eficácia clínica/pedagógica ou autonomia profissional.

[código] Permanecem os tetos de 2 mil tentativas, 20 mil cartões e projeção de mil evidências; o histórico específico de avaliações ainda não tem política de arquivo. Se uma tentativa sair do journal antes de confirmar seu recibo, o retry pode recusar a confirmação e exigir recuperação explícita. A rotina não inventa sucesso para ultrapassar essa barreira. Capacidade em memória não é benchmark nativo; desempenho/tamanho em aparelho pertencem a G6.

[código] Não há transação global com XP, jornada, kernel, vidas e sync. O bloqueio de repetir XP na mesma montagem não resolve morte entre crédito e conclusão em outra montagem. Backup/reset/snapshot do novo store e essa janela de recuperação precisam de gates próprios (G7). O store continua exclusivamente local e não foi adicionado à migração histórica 1.4. Não houve build, publicação, execução em aparelho/simulador, commit, push ou merge nesta sessão.

[usuário] Avaliação final aprovada libera a próxima unidade e conquista fica opcional. Não houve mudança de nota mínima, regra de reforço, direitos de conteúdo ou aprovação de material novo. Aula piloto permanece fora dos gates de avanço do programa global.

[inferido] Próximo pacote G4: recuperação independente na revisão e definição de evidência retardada; depois QA nativo/performance G6 e compatibilidade/recuperação G7. Os programas de produção editorial real, acervo autorizado e organização curricular ampla continuam necessários.

## Fontes locais — acesso em 2026-10-17

- [Histórico e reconciliação](../../radiant-app/src/features/student-checkpoints/AssessmentAttemptRepository.ts), [testes](../../radiant-app/src/features/student-checkpoints/AssessmentAttemptRepository.test.ts), [regra de avaliação](../../radiant-app/src/features/student-checkpoints/UnitCheckpointService.ts).
- [Contrato do journal](../../radiant-app/src/types/itemReview.ts), [lote atômico](../../radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.ts), [testes](../../radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts).
- [Tela usada pelo aluno](../../radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx), [integração](../../radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx), [resolução da revisão](../../radiant-app/src/features/spaced-repetition/services/ItemReviewService.ts).
- [Projeção de evidência](../../radiant-app/src/features/mastery/repositories/LearningEvidenceRepository.ts), [testes](../../radiant-app/src/features/mastery/repositories/LearningEvidenceRepository.test.ts), [kernel preservado](../../radiant-app/src/features/student-checkpoints/CommitCoordinator.ts).
- [Camada G4 anterior](2026-10-17-trilha-g4-evidencia-e-revisao-por-item.md), [plano global](../trilha/plano/2026-10-16-loop-global-de-evolucao-da-trilha.md), [estado](../STATUS.md) e [fila](../FILA.md).
