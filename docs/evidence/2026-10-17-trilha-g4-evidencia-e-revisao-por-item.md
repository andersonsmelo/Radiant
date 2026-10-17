# G4 — camada de evidência e revisão por item

**Data:** 2026-10-17, America/Bahia.  
**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Base:** branch `codex/radiant-study-improvements`, HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`, com G0–G3 e reorganização documental anteriores não commitados e preservados.  
**Método:** rastrear escritores/leitores reais, testar persistência em portas de memória e AsyncStorage simulado, montar hooks/telas, usar atividade promovida real e fixtures de escala, injetar defeitos específicos e validar a árvore final pelo Loop. [código] é prova local; [usuário] é decisão recebida; [inferido] é continuidade proposta. Sem avaliação clínica, aprendizado de alunos ou execução nativa.

## Diagnóstico confirmado no código

[código] Antes desta etapa, `useReview` consultava o SM-2 por lição e selecionava somente `questions[0]`. Atividades promovidas não possuíam payload de quiz legado e podiam não aparecer nessa fila. O repositório de evidências fazia read-modify-write sem serialização ou deduplicação e não verificava schema antes de regravar. `LessonOutcomeService` observava competências mesmo quando `append` recusava a evidência.

[código] `ReviewCard` revela a resposta antes de oferecer “Acertei”. Esse resultado é autoavaliação assistida. O agendador por competência continua separado: `CompetencyReviewService.getDue/recordReview` não foram ligados à fila ativa nesta entrega. A fórmula escolhida para a agenda por item é o SM-2 já usado pelo app; não foi adotado FSRS ou feita uma recomendação científica nova.

## Contrato implementado

[código] `ItemReviewRepository` grava tentativa e cartão na mesma escrita de `@radiant:item_review_v1`. A identidade do cartão inclui lição, item e versão. O evento tem ID opaco, primeira resposta, resposta final, ajuda, faixa de duração e timestamp; não armazena alternativa selecionada, prosa ou imagem. O contrato reusa a validação de privacidade da evidência e recusa campos fora da allowlist, marcadores sensíveis e datas inválidas.

[código] Escritores com a mesma porta de storage são serializados, inclusive instâncias distintas. O mesmo ID/material confirmado devolve confirmação duplicada; outro resultado com o mesmo ID é recusado. Retry após falha de escrita pode persistir uma única vez. JSON inválido, schema desconhecido, corrupção e falha de leitura não são convertidos em store vazio na escrita. Os bytes originais permanecem. Isto é serialização dentro do mesmo processo JS, não compare-and-swap entre processos distintos.

[código] O player fornece identidade/data estáveis por conclusão e protege envios simultâneos. `LessonOutcomeService` usa o journal antes dos rollups e evita repetir agenda, tentativa agregada e recompensa de commit já confirmado. Só observa competências após persistir evidência. Erro inicial continua erro mesmo se o resultado final vier correto após ajuda. Escritas secundárias de XP/sync e o progresso da jornada continuam em seus stores existentes; não se afirma transação global entre todos eles.

[código] `LearningEvidenceRepository` lê a projeção dos eventos confirmados do journal junto ao legado. Sua escrita legada agora também é serializada, deduplicada e recusa sobrescrever schema inválido/futuro ou dados que não conseguiu ler. Evidência recusada não é reaproveitada para observar competência. Acertos com ajuda não pontuam recuperação independente em `calculateCompetencyMastery`.

[código] O SM-2 foi extraído para `advanceItemSm2`, função pura com relógio explícito. Preserva intervalos iniciais 1/3 dias, atualização de facilidade, reinício por erro e teto de 365 dias. O item é agendado pela primeira resposta; autoavaliação assistida não é convertida em evidência independente ou retenção retardada.

## Fila e migração

[código] `ItemReviewCoordinator` resolve cada item pelo catálogo atual: questão legada ou interação promovida. A identidade original da questão legada vem dos IDs de opções preservados pelo adaptador; a interação promovida mantém seu próprio ID. Nenhum ID de conteúdo ou progresso existente foi renomeado.

[código] `/review` usa essa fila, ordenada por vencimento, com até 50 cartões. A confirmação de escrita vem antes de avançar/premiar; há retry explícito em falha e proteção contra dois envios concorrentes. A tela informa indisponibilidade em vez de exibir “Nenhuma revisão pendente” quando a leitura falha. A linguagem de autoavaliação foi mantida e a promessa de uma fila necessariamente curta foi retirada.

[código] A migração é aditiva: lê a agenda antiga sem apagá-la e sem transformar o resultado agregado em tentativas/acertos. Cada abertura importa no máximo 50 lições disponíveis em **uma escrita atômica**. A presença de cartões é o cursor durável: depois de falha, o retry repete apenas a janela não confirmada; depois de sucesso, continua nas lições seguintes. Fonte sem payload é ignorada e não bloqueia outra disponível.

[código] O primeiro item mantém o vencimento antigo; os adicionais começam nos dias seguintes à data-base. A sessão continua limitada a 50, mesmo com grande backlog. É limite por sessão/janela de migração, não promessa de limite diário individual. Uma lição já gerenciada não é reimportada a partir de seu agregado. Outra versão material não herda agenda/evidência por equivalência implícita; só fica disponível quando houver confirmação compatível.

[código] `SpacedRepetitionService.getReviewSchedule/getDueLessons` projeta o menor vencimento dos itens atuais por lição. Assim, os consumidores existentes da trilha e push passam a recebê-lo. `getDueCount`, usado por missão/progresso, conta os itens gerenciados e mantém fallback de compatibilidade para agregados não migrados. `getDueCards` continua a vista legada de cartões agregados; a fila ativa não a usa.

## Evidência executada

[código] **Onze suítes/187 testes focados**, no Node 20, incluindo journal, coordenador, SM-2, repositório de evidência, domínio, outcome, player, hook/tela da revisão, agenda compartilhada e progresso da jornada. A integração conclui uma atividade promovida real, resolve seu payload na fila vencida e confirma a autoavaliação como assistida. Outra integração verifica que a agenda compartilhada usa esse item, sobrepondo o agregado antigo. A projeção de evidência mantém erro inicial e ajuda.

[código] **Capacidade em memória:** 10 mil itens e fila de 50; 51 lições migradas em duas janelas, uma escrita por janela; zero tentativas fabricadas. O primeiro teste de capacidade mostrou busca repetida de definições, depois substituída por índice de item e parada ao preencher a sessão. Não é benchmark nativo, orçamento de latência ou prova de tamanho em disco.

[código] Vermelhos observados: implementação mínima do journal falhou em seis dos sete testes iniciais; uma tentativa sem escrita não podia ser aceita, duplicação não podia ser tratada como evento novo e escritores concorrentes não podiam perder registros. A tela de erro falhou mostrando “Nenhuma revisão pendente” e passou após introduzir indisponibilidade/retry. A importação nativa de AsyncStorage no teste puro inicialmente falhou por infraestrutura; foi substituída por resolução tardia da porta nativa. Esse erro não conta como prova de defeito de produto.

[código] **13 mutações discriminantes**, isoladas e restauradas byte a byte em `finally`; só falhas de asserção contaram:

| Defeito injetado | Resultado vermelho observado |
| --- | --- |
| Aceitar sem persistir o envelope | 6 falhas/3 passes |
| Remover conjuntamente as barreiras de deduplicação | 2 falhas/7 passes |
| Executar escritores sem a fila compartilhada | 1 falha/8 passes |
| Tratar schema futuro como store ausente | 1 falha/8 passes |
| Colocar os itens migrados no mesmo vencimento | 1 falha/8 passes |
| Retirar o limite da sessão | 1 falha/5 passes na medição anterior às duas novas guardas da migração |
| Retirar versão da chave do item | 1 falha/5 passes |
| Projetar autoavaliação como sem ajuda | 1 falha/5 passes |
| Pontuar acertos com ajuda como recuperação independente | 1 falha/20 passes |
| Avançar a revisão sem confirmação da escrita | 1 falha/4 passes |
| Observar competência sem evidência persistida | 2 falhas/41 passes |
| Trocar ID promovido pelo prefixo das opções | 1 falha/42 passes |
| Retirar a janela de 50 lições da migração | 1 falha/7 passes |

O verde final foi medido após a restauração das injeções. Lint/typecheck e o resultado integral ficam nas evidências do run abaixo; as contagens focadas não são a contagem da suíte inteira ou do CI remoto.

## Reprodução

Usar Node 20:

```bash
node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts radiant-app/src/features/spaced-repetition/services/ItemReviewService.test.ts radiant-app/src/features/spaced-repetition/models/itemSm2.test.ts radiant-app/src/features/review/hooks/useReview.test.ts radiant-app/src/features/mastery/repositories/LearningEvidenceRepository.test.ts radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.test.ts radiant-app/src/features/mastery/services/CompetencyMasteryService.test.ts radiant-app/src/features/journey/services/JourneyProgressService.test.ts
node scripts/qa/trilha-structural-inventory.cjs --check
```

Run `run-1792258583607-c48e2add`; gate/estado por `loop run status --run run-1792258583607-c48e2add`. Fechamento público: `validate → step finish → memória validada → run close`. Sessão `brain-session-1792258367507-a9cee5e0` encerrada separadamente antes da validação que reentra na CLI. Não houve bypass de lock ou edição manual de estado/evidência.

## Limites e continuidade

[código] **G4 não está concluído integralmente.** Avaliações mantêm `AssessmentAttemptRepository`/kernel próprios; falta consolidá-las no journal comum. A micro revisão permanece autoavaliação revelada, portanto não prova recuperação independente/retardada. G4 ainda precisa definir e validar essa cadeia antes de ativar adaptação. O fluxo `/quiz`, sem entrada in-app, mantém seus escritores antigos.

[código] O journal guarda até 2 mil tentativas e 20 mil cartões; a leitura de evidência mantém a projeção limitada a mil registros. Não é histórico ilimitado nem evidência de eficácia. Semântica de arquivo/agregação e efeito desses limites no domínio futuro precisam de validação antes da adaptação em escala. Campos de duração continuam `unknown` onde o player não mede.

[código] O novo store é exclusivamente local. Não foi adicionado ao backup/sync remoto, ao snapshot V3 ou ao backup da migração 1.4. Não se alterou essa migração histórica nem se prometeu restauração cross-device do journal. Compatibilidade de backup e reset continua em G7. A proteção de schema novo impede esta versão de sobrescrever dados desconhecidos; versões antigas não escrevem nesta chave nova.

[usuário] Preservada a decisão de Anderson: avaliação final aprovada libera a próxima unidade; conquista opcional. Sem novo conteúdo aprovado, V3 ativado, build, execução em simulador/aparelho, Android, leitor de tela, publicação, commit, push ou merge nesta sessão. A árvore compartilhada foi preservada.

[inferido] Continuidade: consolidar G4 nas avaliações e na recuperação independente; validar nativamente a nova fila, sua retomada/erro e a migração, medir capacidade em aparelhos (G6) e integrar backup/compatibilidade (G7). Produção real/revisão editorial G3, mapa G2, P1/FILA 50 e acervo autorizado G5 continuam no programa global, sem aula piloto como gate.

## Fontes locais — acesso em 2026-10-17

- [Contrato dos itens](../../radiant-app/src/types/itemReview.ts), [journal](../../radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.ts), [testes](../../radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts).
- [Coordenador/resolução/migração](../../radiant-app/src/features/spaced-repetition/services/ItemReviewService.ts), [testes](../../radiant-app/src/features/spaced-repetition/services/ItemReviewService.test.ts), [SM-2 puro](../../radiant-app/src/features/spaced-repetition/models/itemSm2.ts) e [agenda compartilhada](../../radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts).
- [Outcome](../../radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts), [integração](../../radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts), [player](../../radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx).
- [Hook ativo da revisão](../../radiant-app/src/features/review/hooks/useReview.ts), [tela](../../radiant-app/src/features/review/screens/ReviewScreen.tsx), [componente de autoavaliação](../../radiant-app/src/features/review/components/ReviewCard.tsx).
- [Evidência](../../radiant-app/src/features/mastery/repositories/LearningEvidenceRepository.ts), [domínio](../../radiant-app/src/features/mastery/services/CompetencyMasteryService.ts), [repositório das avaliações ainda separado](../../radiant-app/src/features/student-checkpoints/AssessmentAttemptRepository.ts).
- [Plano global G4](../trilha/plano/2026-10-16-loop-global-de-evolucao-da-trilha.md), [estado](../STATUS.md), [fila](../FILA.md), [arquitetura](../ARCHITECTURE_STATE.md) e [fluxo](../CLIENT_FLOW.md).
