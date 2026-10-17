# Composição multiunidade da trilha — 2026-10-16

**Estado:** decisão de produto aceita; contrato técnico implementado localmente. Ativação de novos conteúdos e validação nativa seguem nos gates próprios.  
**Decisor de produto:** Anderson. **Implementação técnica:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Contexto:** [direção global](ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md), FILA 54 e [evidência desta entrega](../evidence/2026-10-16-trilha-cobertura-e-multiunidade.md).

## Decisão de Anderson [usuário]

À pergunta sobre a liberação de futuras unidades da mesma área, Anderson escolheu:

> Avaliação final aprovada libera a próxima; conquista fica opcional

A avaliação continua usando o limiar do lote aprovado. A coleta da conquista não será pré-requisito de entrada na próxima unidade. A decisão não altera os seis gates editoriais nem aprova conteúdos novos.

## Contrato técnico [código]

- A ordem das unidades é declarada em `ProductionTrackComposition`; não depende da ordem de importação dos lotes.
- Toda unidade do conjunto aparece uma vez; metadados da mesma área são consistentes; IDs anteriores permanecem estáveis.
- A primeira unidade não recebe pré-requisito externo. As seguintes exigem exatamente o nó da avaliação final da unidade anterior. Um plano que exija a conquista é recusado.
- Referências inexistentes e ciclos são recusados. Resumos recebem ordem contínua na área; atividades, avaliações e seus lotes continuam resolvidos pelos índices globais.
- A composição é optativa e explícita. O singleton publicado continua com o lote H4 existente; esta entrega não acrescenta conteúdos ou configurações curriculares à distribuição.

## Consequências e continuidade

[código] Testes de persistência em AsyncStorage simulado confirmam que a inclusão de unidade preserva os IDs já concluídos, permite avançar sem coletar a conquista e preserva a nova conclusão ao reabrir. Isso não prova comportamento em aparelho.

[código] A recomendação existente ainda prioriza conquista pendente; `trackCompletion.ts` também exige conquistas para concluir uma área. A aplicação completa da opcionalidade às futuras áreas compostas exige harmonizar esses consumidores e o foco visual em G2, antes de ativar novos lotes. Esta ADR orienta essa implementação; a escolha de Anderson não deve ser perguntada novamente.

[inferido] O próximo contrato deve integrar mapa curricular, estado de conclusão de área e retomada, mantendo a consulta ao histórico e as conquistas coletáveis. A promoção editorial ainda tem regras específicas do H4 e requer generalização no pacote de produção G3.

## Evidências e fontes

Método: inspeção de consumidores, testes de composição/grafo, persistência com storage simulado e fixture de 100 unidades. Evidência local [código]; direção [usuário]; consequências propostas [inferido]. Fontes consultadas em 2026-10-16:

- [Compositor](../../radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.ts).
- [Fábrica do catálogo](../../radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts).
- [Testes de composição](../../radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.test.ts).
- [Testes de progresso](../../radiant-app/src/features/journey/services/JourneyProgressService.test.ts).
- [Régua atual de conclusão da área](../../radiant-app/src/features/journey/services/trackCompletion.ts).


## Implementação G2 — 2026-10-16

[código] A continuidade técnica acima foi implementada localmente: o compositor
marca conquistas opcionais, a conclusão e os contadores compartilham essa regra,
e a recomendação/foco permite seguir sem coleta. A área seguinte abre pela mesma
régua no progresso e no mapa. A tela busca uma conquista da área anterior pelo ID
e mantém o contexto de coleta; um destino desconhecido não oferece outra recompensa.

[código] Áreas compostas passam a ter marcadores e índice de unidades na mesma
lista. As regras anteriores permanecem nos nós sem marca explícita. IDs e schema
de progresso são preservados. Não houve novo conteúdo, ativação de áreas ou teste
nativo da interface; essa validação continua necessária antes de ativar composições.
[Evidência, limites e run](../evidence/2026-10-16-trilha-g2-progressao-e-unidades.md).
