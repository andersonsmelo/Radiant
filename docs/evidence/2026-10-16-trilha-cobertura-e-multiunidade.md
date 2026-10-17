# Cobertura editorial e composição multiunidade — 2026-10-16

**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Objetivo:** segunda entrega da FILA 54/G0–G1: matriz de referências por item e contrato de várias unidades na mesma área, preservando identidades e progresso.  
**Base:** branch `codex/radiant-study-improvements`, HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`, árvore compartilhada com a entrega anterior e documentação de outras sessões.  
**Método:** inspeção dos contratos/consumidores, testes contra o comportamento anterior, execução da instrumentação offline, testes de persistência com AsyncStorage simulado e mutações discriminantes. Afirmações [código] são medidas locais; [usuário] é decisão explícita; [inferido] indica consequência proposta.

## Entrega

[código] `ProductionCurriculumCoverage` liga cada interação promovida e item de avaliação às competências, fontes e claims declarados no seu lote. Fontes são resolvidas dentro do lote, sem atribuir validade clínica ou licença atual ao registro. Placeholders do legado recebem `legacy-unmapped`; não são promovidos a fontes ou competências clínicas.

[código] O inventário passa a schema 3, conserva os serviços reais de montagem/adaptação/resolução e acrescenta a matriz e os nós que resolvem os dez itens de avaliação. `--check` falha em violações estruturais/referenciais; lacunas conhecidas do legado continuam explícitas em `gaps`, sem fingir que a base está editorialmente completa.

| Medição local [código] | Resultado |
| --- | ---: |
| Interações promovidas / itens de avaliação | 12 / 10 |
| Itens de avaliação ligados a nós resolvidos | 10 / 10 |
| Competências declaradas / fontes declaradas | 5 / 8 |
| Claims esperados / ligados com classificação e referências válidas | 154 / 154 |
| Claims source-backed / distratores autorais | 88 / 66 |
| Interações legadas sem mapeamento editorial estruturado | 36 |
| Violações referenciais do conjunto atual | 0 |

[código] Quatro competências têm `guided-practice` e `independent-recall`. Atenuação tem `guided-practice` e `applied-transfer`, sem item marcado como `independent-recall`. Nenhuma tem `delayed-retention`. Isso mede o vocabulário dos itens autorais deste lote, não a aprendizagem do aluno; checkpoints permanecem separados desses quatro métodos. As duas perguntas ausentes dos nós de Estude, `q3` e `ct-q2`, permanecem fora do percurso legado.

[código] `ProductionTrackComposition` declara a ordem e os pré-requisitos das unidades. A fábrica reúne vários lotes do mesmo trackId, gera resumos com ordem contínua e mantém os índices de atividades/checkpoints. Unidades ausentes/duplicadas, referências inexistentes, ciclos e nomes contraditórios da mesma área são recusados. Sem composição explícita, lotes sobrepostos continuam sendo recusados.

[usuário] Anderson decidiu que a avaliação final aprovada libera a próxima unidade e a conquista fica opcional. O compositor exige o checkpoint final da unidade anterior e recusa a conquista como pré-requisito. [ADR e continuidade](../adr/ADR-2026-10-16-composicao-multiunidade-da-trilha.md).

[código] O singleton de produção continua com um lote/uma unidade. O novo contrato foi exercitado com 100 unidades sintéticas na mesma área, 1.200 atividades e 1.800 nós. O registro de conteúdo publicado não recebeu fixtures ou uma nova configuração curricular.

## Compatibilidade e limite de experiência

[código] A projeção histórica continua com SHA-256 `317fcdfb56a98493100bb1e2e884ca860bbf301451ce1bf25e5e447a81c5d5b8`, pelo teste da entrega anterior. Testes de progresso concluem a unidade original, acrescentam outra, verificam a nova unidade aberta sem conquista coletada, concluem um nó novo e reabrem preservando os IDs antigos e novos.

[código] Uma asserção inicial esperava que a inclusão de uma conclusão nova mudasse imediatamente `currentUnitId`. A execução mostrou unidade original e recomendação da conquista pendente: esse é o comportamento da recomendação existente, não perda de progresso. O teste final registra a persistência e essa prioridade; depois da coleta, o foco acompanha a unidade seguinte. O mapa renderiza os nós de todas as unidades. O teste não prova qualidade da navegação em aparelho.

[código] `trackCompletion.ts` ainda inclui conquistas entre os nós obrigatórios para concluir uma área. A opcionalidade aprovada já governa o portão entre unidades; harmonizar conclusão de áreas compostas, recomendação e foco visual pertence à próxima entrega G2 antes da ativação de novas áreas. A decisão não precisa ser refeita.

[código] O validador editorial ainda contém regras específicas do H4, incluindo 12 atividades, dez itens e as competências daquele corte. A composição não generaliza promoção editorial por si só. G3 deve resolver esse contrato antes da produção ampla de lotes diferentes. A matriz de claims desta versão conhece a convenção V1 de uma múltipla escolha por atividade; formatos sem essa convenção são sinalizados, sem inventar bindings.

## Evidência de execução

[código] Node 20.20.2 para app/inventário e Node 24.14.1 para Loop.

- Primeiro vermelho: duas suítes, **7 falhas/1 passe**. O catálogo recusava a composição com `duplicate-track-slug`; o plano desconhecido era ignorado; o instrumento devolvia schema 2, sem matriz.
- Versão resolvida divergente: **1 falha/8 passes**, pois a matriz aceitava a atividade com versão `stale` sem reportar `activity-version-mismatch`.
- Item de avaliação sem nó: falha de asserção por ausência de `checkpoint-item-without-node`, com resolução de checkpoints explicitamente fornecida.
- Regra escolhida por Anderson: falha de asserção porque o compositor ainda aceitava a conquista como portão. Depois passou a recusar com `composition-requires-final-checkpoint`.
- Um mock desnecessário com caminho incorreto impediu carregar a suíte de cobertura na primeira tentativa. Foi removido; esse erro não é evidência de vermelho de comportamento.

[código] **16 mutações detectadas por falha de asserção**, cada uma isolada, com âncora única e restauração do arquivo em `finally`: fonte de item desconhecida; fonte de claim desconhecida; claim ausente; duplicado; órfão; classificação incorreta; claim source-backed sem fonte; competência desconhecida; atividade sem nó; versão divergente; item de checkpoint sem nó; atividade V2 não registrada; conjunto de unidades incompleto; ciclo; conquista como portão; metadados contraditórios da área. Erros de carregamento não foram contados como detecção.

[código] Verde final focado: **nove suítes/101 testes**, incluindo catálogo de produção, composição, cobertura, auditoria, alcançabilidade integrada/CLI, progresso, fachada de catálogo, player e definição de jornada. Typecheck passou. Os avisos de nó bloqueado/desconhecido vêm dos testes negativos preexistentes do serviço de progresso.

Reproduzir na raiz, com PATH do Node 20:

```bash
node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.test.ts radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.test.ts radiant-app/src/features/student-checkpoints/ProductionCurriculumCoverage.test.ts radiant-app/src/features/journey/services/JourneyCatalogAudit.test.ts radiant-app/src/features/journey/services/JourneyCatalogReachability.test.ts radiant-app/src/features/journey/services/JourneyProgressService.test.ts radiant-app/src/features/content/services/LessonCatalogService.test.ts radiant-app/src/features/lesson-flow/services/LessonFlowService.test.ts radiant-app/src/features/journey/services/JourneyDefinitionService.test.ts
node scripts/qa/trilha-structural-inventory.cjs --check
```

Gate configurado integral, evidências e estado final: `loop run status --run run-1792193013965-901cfa98`. Fechamento segue `validate → step finish → memória validada → run close`; sessão de leitura `brain-session-1792192927180-9ffb0102` fechada separadamente antes do validador que reentra no cérebro.

## Continuidade

[inferido] Próxima entrega: G2, com mapa curricular/navegação, foco e conclusão de áreas compostas coerentes com conquistas opcionais; P1/FILA 50 segue corrigindo a experiência legada. Persistência/migração em aparelhos, contrato editorial genérico, fontes/licenças e produção/revisão em lotes continuam no programa global. Sem build, teste nativo novo, ativação V3, publicação, push ou merge nesta entrega.

## Fontes locais consultadas em 2026-10-16

- [Inventário executado e hashes](../trilha/avaliacoes/2026-10-16-cobertura-e-composicao-da-trilha.json).
- [Matriz de cobertura](../../radiant-app/src/features/student-checkpoints/ProductionCurriculumCoverage.ts) e [testes](../../radiant-app/src/features/student-checkpoints/ProductionCurriculumCoverage.test.ts).
- [Compositor](../../radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.ts) e [testes](../../radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.test.ts).
- [Fábrica](../../radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts), [progresso testado](../../radiant-app/src/features/journey/services/JourneyProgressService.test.ts) e [teste integrado/CLI](../../radiant-app/src/features/journey/services/JourneyCatalogReachability.test.ts).
- [Contrato editorial](../../radiant-app/src/features/student-checkpoints/EditorialCurriculumCandidate.ts), [conclusão de área](../../radiant-app/src/features/journey/services/trackCompletion.ts) e [recomendação](../../radiant-app/src/features/journey/services/JourneyRecommendationService.ts).
- [Instrumento](../../scripts/qa/trilha-structural-inventory.cjs) e [entrega anterior preservada](2026-10-16-trilha-g0-g1-catalogo.md).
