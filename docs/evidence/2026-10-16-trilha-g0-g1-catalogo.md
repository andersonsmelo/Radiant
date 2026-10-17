# Trilha: alcançabilidade e catálogo de múltiplos lotes — 2026-10-16

**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Objetivo:** primeira entrega de implementação da FILA 54, G0/G1 do [programa global](../trilha/plano/2026-10-16-loop-global-de-evolucao-da-trilha.md), autorizado por Anderson com “prossiga”.  
**Base:** branch `codex/radiant-study-improvements`, HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`, árvore compartilhada já alterada antes da abertura.  
**Método:** testes de comportamento antes da generalização; extração do compositor existente; execução dos serviços de jornada/player com uma porta local sem storage/rede; auditoria do grafo; injeções discriminantes; validação configurada pelo Loop. [código] designa medição local; [inferido] designa implicação ou próximo caminho.

## Resultado local

[código] O catálogo de produção agora usa registros explícitos de apresentação por lote e índices de atividades, checkpoints e jornadas montados uma vez por snapshot imutável. Título, slug, descrição, unidade e conquista deixam de vir do primeiro lote. Os dados clínicos, seus fingerprints e os seis gates de promoção não foram alterados. O registro compilado continua contendo apenas o lote histórico H4; fixtures não ampliam o conteúdo entregue ao aluno.

[código] IDs vazios/duplicados, atividades sem estágio declarado, estágios sem avaliação e itens sem estágio são recusados. Um lote promovido sem apresentação não desaparece silenciosamente. Dois lotes com o mesmo trackId são recusados: composição de várias unidades numa mesma área ainda precisa do contrato curricular seguinte. Não foi introduzida regra nova de desbloqueio entre unidades.

[código] A projeção histórica completa de trilhas, resumos e jornadas mantém SHA-256 `317fcdfb56a98493100bb1e2e884ca860bbf301451ce1bf25e5e447a81c5d5b8`, medido antes da extração sobre JSON.stringify({tracks,summaries,journeys}). O teste compara a saída nova à medição anterior, abrangendo nomes, IDs, ordem e pré-requisitos. Nenhum formato de progresso ou storage foi escrito pela mudança; isso não substitui um teste de restauração em aparelho.

[código] O [novo inventário](../trilha/avaliacoes/2026-10-16-alcancabilidade-apos-g0-g1.json), schema 2, resolve o catálogo pelos mesmos JourneyDefinitionService e LessonFlowService usados no app, incluindo LegacyLessonAdapter e validação de atividades. O compositor usado pela fachada foi extraído sem mudar a precedência existente. A única substituição é a porta de LessonCatalogService, abastecida pelos dados locais; não há bootstrap, hidratação remota ou estado real de usuário.

| Medição [código] | Resultado |
| --- | ---: |
| Trilhas / resumos locais | 4 / 30 |
| Nós no grafo / estruturalmente alcançáveis | 57 / 57 |
| Nós de atividade resolvidos (36 legados + 12 V2) | 48 |
| Avaliações resolvidas / itens | 5 / 10 |
| Conquistas | 4 |
| Violações estruturais ou de payload | 0 |
| Perguntas legadas no banco / referidas pelos nós de Estude | 38 / 36 |

[código] `q3` e `ct-q2` não aparecem nos nós de lição/revisão de Estude. A ausência é deste percurso, não de toda rota de quiz/revisão do app. Todas as 48 interações desses nós continuam sendo múltipla escolha; generalizar o catálogo não criou variedade pedagógica nem imagens.

[inferido] A lacuna de duas perguntas reforça a prioridade da FILA 50/P1. A fábrica editorial pode crescer sobre identidades verificáveis, mas ainda precisa de composição por unidades, cobertura por competência/fonte/item e correção da experiência legada para evitar multiplicar as limitações atuais.

## Evidência de testes

[código] Node 20.20.2 para app/inventário; Node 24.14.1 para Loop.

A primeira execução dos testes ampliados contra o catálogo anterior terminou em **6 falhas, 8 passes, 14 testes**, sem erro de carregamento. Trechos da execução:

```text
usa os metadados e a conquista de cada lote, sem colisão
Expected: slug "fixture-segundo-lote", title "Segundo lote sintético"
Received: slug "materia-energia-e-radiacao", title "Matéria, energia e radiação"

recusa IDs de conquista duplicados
Received function did not throw

recusa sobrepor dois lotes na mesma trilha sem contrato de composição
Received function did not throw

recusa estágio sem itens
Received function did not throw

recusa item de avaliação sem estágio correspondente
Received function did not throw

projeta 100 lotes / 1.200 atividades e resolve todos os destinos
Expected unique node count: 1800
Received unique node count: 1701
```

[código] Uma execução posterior isolou omissão do registro de apresentação: **1 falha, 17 passes**; o lote desconhecido não provocava `missing-presentation`. O registro passou a enumerar PRODUCTION_BATCHES e exigir metadados para cada entrada.

[código] Os testes da auditoria foram escritos antes do módulo; o primeiro carregamento sem módulo foi erro de infraestrutura e **não conta como vermelho de comportamento**. Depois de implementada, cada barreira foi retirada isoladamente do arquivo declarado e restaurada em `finally`. Sete execuções terminaram em falha de asserção do teste correspondente, sem erro de carregamento:

| Barreira retirada | Teste que falhou |
| --- | --- |
| Payload de atividade ausente | detecta atividade sem payload |
| Pré-requisito inexistente | detecta pré-requisito |
| Ciclo/destino não alcançável | detecta ciclo |
| ID de nó duplicado | detecta ID duplicado |
| Unidade incorreta | detecta ID duplicado — asserção de unidade |
| Resumo sem nó | detecta ID duplicado — asserção de resumo |
| Checkpoint sem payload | detecta checkpoint |

[código] A suíte focada final tem seis arquivos e 56 testes: catálogo de produção, auditoria, alcançabilidade integrada, fachada de catálogo, fluxo de lição e definição de jornada. Inclui 100 lotes sintéticos independentes, 1.200 atividades e 1.800 nós sem colisão, com resolução de todas as atividades. É teste de capacidade estrutural em memória; não é benchmark nativo nem execução do perfil completo de 10.000 itens previsto no plano.

Comando focado (raiz do repositório; PATH do Node 20):

```bash
node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.test.ts radiant-app/src/features/journey/services/JourneyCatalogAudit.test.ts radiant-app/src/features/journey/services/JourneyCatalogReachability.test.ts radiant-app/src/features/content/services/LessonCatalogService.test.ts radiant-app/src/features/lesson-flow/services/LessonFlowService.test.ts radiant-app/src/features/journey/services/JourneyDefinitionService.test.ts
node scripts/qa/trilha-structural-inventory.cjs --check
```

O flag `--check` devolve saída não zero se a auditoria encontrar violações. Os hashes dos módulos executados e do instrumento estão no JSON. O teste integrado da mesma auditoria participa da suíte normal do app.

## Gate e limites

Run desta entrega: `run-1792192200409-156b04d8`. As evidências integrais dos validadores e o estado final são consultáveis com `loop run status --run run-1792192200409-156b04d8`; o gate configurado é `loop validate`, seguido de `step finish`, memória validada quando aplicável e `run close`. A sessão de leitura `brain-session-1792192145306-494c2ce9` foi fechada separadamente antes do gate que reentra no cérebro.

[código] Não houve build, teste em aparelho, publicação, ativação V3, novo conteúdo clínico, nova migração, push ou merge. Arquivos e staging anteriores de outras sessões foram preservados. A localização dos metadados de apresentação é configuração compilada; não amplia o fingerprint do material clínico nem concede aprovação a futura apresentação.

[inferido] Restam no programa G0/G1: matriz de cobertura de fonte/competência por item, estados de persistência/migração, composição de vários lotes na mesma área e projeção curricular navegável. A FILA 50/P1 segue responsável pelo conteúdo completo e pelo feedback da lição legada. G2–G8, mídia licenciada, revisão editorial, QA nativo iOS/Android e publicação seguem nos gates próprios, sem piloto como condição de avanço.

## Fontes locais

- [Catálogo e singleton consumido pelo app](../../radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.ts).
- [Construtor e índices](../../radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts).
- [Registro de apresentação por lote](../../radiant-app/src/features/student-checkpoints/production-catalog-entries.ts).
- [Contrato e promoção preservados](../../radiant-app/src/features/student-checkpoints/ProductionBatch.ts).
- [Compositor compartilhado](../../radiant-app/src/features/content/services/composeCurriculumCatalog.ts).
- [Montagem da jornada](../../radiant-app/src/features/journey/services/JourneyDefinitionService.ts) e [resolução do player](../../radiant-app/src/features/lesson-flow/services/LessonFlowService.ts).
- [Auditoria](../../radiant-app/src/features/journey/services/JourneyCatalogAudit.ts) e [teste integrado](../../radiant-app/src/features/journey/services/JourneyCatalogReachability.test.ts).
- [Instrumento executável](../../scripts/qa/trilha-structural-inventory.cjs).
- [Diagnóstico anterior preservado](../trilha/avaliacoes/2026-10-16-diagnostico-estrutural-global-da-trilha.md).

Fontes consultadas em 2026-10-16; cada afirmação de implementação acima usa evidência local [código]. Não foi feita nova pesquisa bibliográfica nesta entrega.

