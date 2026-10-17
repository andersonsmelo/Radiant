# G3 — contrato editorial genérico da trilha

**Data:** 2026-10-17, America/Bahia.  
**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Base:** branch `codex/radiant-study-improvements`, HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`, árvore compartilhada com entregas G0/G1/G2 e reorganização documental anteriores preservadas.  
**Método:** inspeção do validador, dos dois publicadores, consumidores do catálogo, painel e CI; testes de comportamento, promoção sintética, publicação em diretório temporário, compilação pelo catálogo real, mutações discriminantes e replay sem dependências Expo. [código] = medição local; [usuário] = decisão recebida; [inferido] = continuidade proposta. Não é avaliação clínica ou nativa.

## Resultado e limites do contrato

[código] A generalização está na validação compartilhada, não no conteúdo. `EditorialBatchContract.ts` remove a dependência das quantidades e identidades do H4. O candidato histórico continua igual e reexporta a função por compatibilidade; a data da fonte passou de literal histórico a string validada. Não há novo lote registrado no app.

[código] O recorte v1 permanece uma múltipla escolha sem mídia por atividade e uma competência por atividade/item; exige prática e pelo menos dois itens por competência, 80%, dois ciclos de reforço e as licenças CC BY 4.0 já admitidas. Metadados vazios, data impossível, URL não HTTPS, versões incoerentes, IDs duplicados, claims ausentes/duplicados/órfãos e associação de fonte fora do item impedem a validação. Posições de gabarito são verificadas por grupo de tamanho de alternativas, exigindo posições distintas até o mínimo entre tamanho do grupo e número de alternativas. Isso é uma triagem estrutural; não prova ausência de pistas ou eficácia.

[código] Formatos com várias interações, imagens e outras famílias não são aceitos silenciosamente: requerem contrato de binding e mídia antes da promoção. A fonte de uma afirmação precisa estar entre as fontes declaradas pelo item; distratores autorais são explicitados. A correção factual e a permissão de uso seguem como gates humanos independentes.

[código] `ProductionBatch.validatePromotedProductionBatch` verifica artefatos promovidos reconstruindo o mesmo draft validado pelo app. O publicador Node deixou de aceitar apenas um hash e rótulos de aprovação: também confere material, schema, mídia, seis decisões/revisores/data, autorização de promoção e identidades entre lotes. Hash novo calculado sobre conteúdo inválido continua inválido. Hash antigo sobre conteúdo modificado invalida promoção. O catálogo anterior é validado antes do append; lock, compare-and-swap, `fsync`, rename e limpeza de temporário foram preservados.

[código] O carregador usa TypeScript instalado, executa somente módulos locais confiáveis dentro de `radiant-app/src` e rejeita imports externos. JSON recebido permanece dado. O CI de conteúdo instala TypeScript 5.9.2 em diretório temporário e usa `NODE_PATH`; não instala Expo para esses testes. Um novo gate Loop `content-production` executa as duas suítes Node e a auditoria do registro real. Os 14 validadores anteriores permanecem, totalizando 15 configurados.

[código] O relatório somente leitura `audit-production-batches.mjs` apresenta material válido, promoção válida, cobertura por competência, fontes/claims e lotes afetados por regra de retrabalho. Não chama aprovação antiga de válida após detectar hash divergente. O painel exibe contagens de fontes/claims e pendências pelo mesmo contrato do app. JSON em arquivo não integra automaticamente o app: apresentação, registro e composição exigem revisão de integração e gates de ativação.

## Evidência observada

[código] **App: seis suítes/65 testes.** Incluem contrato genérico, H4 histórico, promoção, catálogo, composição e cobertura. Um lote sintético de quatro atividades/quatro itens/duas competências/quatro fontes é validado, promovido com aprovações exclusivamente sintéticas e compilado pelo catálogo real; as duas avaliações têm dois itens cada. A fixture de capacidade faz o mesmo com **100 lotes independentes/400 atividades**. Não é benchmark de desempenho nem conteúdo pronto.

[código] **Scripts: 20 testes.** Publicação/rollback/conflito de hash/escritores concorrentes, gate ausente, conteúdo adulterado, schema/mídia/revisor inválidos, colisões entre lotes e relatório. O artefato persistido em diretório temporário é relido e montado por `createProductionCurriculumCatalog`, com resolução real de atividade. Todos os diretórios de teste são descartáveis; nenhum catálogo real foi publicado pela sessão.

[código] Primeiro vermelho do contrato: 12 falhas/9 passes. O lote menor era recusado pelos tamanhos fixos e competências do H4, e duplicados/órfãos/reforço não eram detectados. A fixture inicial também omitia uma fonte usada pelo item 1; essa omissão foi corrigida na fixture, preservando o gate. O teste de capacidade inicialmente reutilizou o trackId e falhou em `duplicate-identity`; a fixture foi corrigida com identidade independente por lote, sem alterar o compositor.

[código] Oito mutações, cada uma aplicada isoladamente com âncora única e restauração byte a byte em `finally`, foram detectadas por falha de asserção (erros de sintaxe/infraestrutura não contam):

| Mutação específica | Saída vermelha observada |
| --- | --- |
| Reintroduzir tamanho fixo 12 | 2 falhas/20 passes no contrato |
| Retirar guarda de identidade duplicada | 2 falhas/20 passes no contrato |
| Tratar claim ausente como claim esperado | 1 falha/21 passes no contrato |
| Desligar recomputação do hash material | 2 falhas/3 passes em ProductionBatch |
| Ignorar gate ausente | 1 falha/4 passes em ProductionBatch |
| Publicador devolver lista vazia sem chamar contrato comum | 11 falhas/6 passes nos scripts de publicação |
| Omitir verificação de identidade entre lotes | 1 falha/16 passes nos scripts de publicação |
| Relatório ignorar divergência material ao mostrar gates | 1 falha/2 passes na auditoria |

[código] A revisão final encontrou um defeito adicional no caminho real: `production-batches.ts` recalculava o hash das seis aprovações junto com o candidato importado. O novo teste substitui esse candidato por material alterado e importa o registro real em módulo isolado. Antes da correção: **1 falha/5 passes**, `Expected substring: production-batch-material-hash-mismatch; Received function did not throw`. O registro agora fixa o fingerprint do material já promovido no repositório: `9adbcc6094303a6ed1618b364aa12c345c12a944396b597f89e1d083cb86fba5`. O material atual e suas decisões não foram alterados; editar o candidato deixa de atualizar suas aprovações automaticamente. Aprovar material novo requer novas decisões explícitas.

[código] Typecheck do app no TypeScript 5.9.3 e do painel no TypeScript 5.8.3 passaram, ambos no Node 20; painel com `--incremental false` para não gerar artefato junto das fontes. Lint dos módulos alterados do app passou. Não houve build/abertura do painel; não é prova visual.

[código] Replay local em árvore temporária contendo apenas os sete módulos puros necessários e os scripts/testes, **sem `radiant-app/node_modules` ou Expo**, com o TypeScript 5.9.2 instalado e `NODE_PATH`: 20 testes, zero falhas. É reprodução local da preparação de dependências do CI; o job Linux remoto não foi executado.

[código] Auditoria real em 2026-10-17: um lote, material e promoção válidos, 12 atividades, dez itens, cinco competências, oito fontes, 154 claims, nenhuma pendência estrutural. Inventário schema 3 continua quatro trilhas/30 resumos e zero violações de grafo/cobertura. As suítes históricas mantêm a projeção e as identidades do H4.

## Reprodução

Usar Node 20 para os comandos abaixo; a CLI Loop usa Node 24.

```bash
node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/student-checkpoints/EditorialBatchContract.test.ts radiant-app/src/features/student-checkpoints/EditorialCurriculumCandidate.test.ts radiant-app/src/features/student-checkpoints/ProductionBatch.test.ts radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.test.ts radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.test.ts radiant-app/src/features/student-checkpoints/ProductionCurriculumCoverage.test.ts
node --test scripts/content/production-batch.test.mjs scripts/content/audit-production-batches.test.mjs
node scripts/content/audit-production-batches.mjs --check
node scripts/qa/trilha-structural-inventory.cjs --check
```

O `reworkByRule` conta cada lote uma vez por regra, não repete a mesma pendência do material e da promoção. O rendimento é da amostra validada neste comando, sem duração de autoria/revisão ou histórico de revisões. Produção real e medida longitudinal ainda são pendências de G3.

## Proveniência Loop e continuidade

Run final: `run-1792257625981-6ca008b4`; conferir resultado integral, evidências e estado por `loop run status --run run-1792257625981-6ca008b4`. Ordem: `validate → step finish → memória validada → run close`. Sessão de contexto `brain-session-1792256752025-cf15d952` fechada antes do run/validador que reentra no cérebro.

O run inicial `run-1792256830926-effb1d81` foi fechado sem validação integral, preservando os arquivos, quando a conferência do CI revelou a necessidade de declarar workflow e configuração do novo gate. O segundo run `run-1792257092672-3c1838ae` passou 15/15 no primeiro ciclo, mas foi fechado antes de concluir a entrega: a revisão identificou o defeito de aprovação autorrecalculada e exigiu incluir `production-batches.ts` no escopo. O run final declara a união completa e valida o estado final; o verde intermediário não substitui a prova final. Não houve bypass de lock ou alteração manual de estado/evidência.

[usuário] Preservada a decisão de Anderson: avaliação final aprovada libera a próxima unidade e conquista fica opcional. Nenhuma decisão curricular foi reaberta ou aprovada pela ferramenta.

[código] Sem migração de progresso, conteúdo novo aprovado/ativado, execução nativa, build, publicação do app/artefato real, commit, push ou merge. A árvore compartilhada anterior foi preservada. G2 ainda exige QA nativo; P1/FILA 50 permanece. [inferido] A próxima camada técnica é G4, evidência/revisão por item; G5 depende de acervo autorizado. Organização curricular ampla, novos lotes e revisão editorial seguem seus decisores/gates. G0–G8 não está concluído.

## Fontes locais — acesso em 2026-10-17

- [Contrato genérico e validação](../../radiant-app/src/features/student-checkpoints/EditorialBatchContract.ts) e [testes](../../radiant-app/src/features/student-checkpoints/EditorialBatchContract.test.ts).
- [Candidato histórico](../../radiant-app/src/features/student-checkpoints/EditorialCurriculumCandidate.ts), [promoção do app](../../radiant-app/src/features/student-checkpoints/ProductionBatch.ts), [registro real](../../radiant-app/src/features/student-checkpoints/production-batches.ts) e [montagem do catálogo](../../radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts).
- [Publicador atômico](../../scripts/content/production-batch.mjs), [carregador restrito](../../scripts/content/load-app-contract.cjs), [testes](../../scripts/content/production-batch.test.mjs), [auditoria](../../scripts/content/audit-production-batches.mjs) e [testes do relatório](../../scripts/content/audit-production-batches.test.mjs).
- [Painel](../../tools/editorial-panel/app/production-batches/page.tsx), [projeção](../../tools/editorial-panel/lib/production-batches.ts), [CI](../../.github/workflows/content-scripts.yml) e [validadores Loop](../../.loop/project.yaml).
- [Pipeline editorial](../CONTENT_PIPELINE.md), [plano global original](../trilha/plano/2026-10-16-loop-global-de-evolucao-da-trilha.md), [STATUS](../STATUS.md) e [FILA](../FILA.md).
