# Diagnóstico estrutural global da trilha — 2026-10-16

**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta nesta sessão.  
**Método:** execução isolada dos módulos puros de catálogo, inspeção dos consumidores e comparação com avaliações anteriores. Evidência [código]; prioridades e consequências [inferido].  
**Estado medido:** HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`, branch `codex/radiant-study-improvements`, árvore documental alterada e preservada. App Expo 54, React Native 0.81.5, TypeScript 5.9.2; instrumento no Node 20.20.2.  
**Aparelho/tela:** nenhum operado nesta avaliação. Não houve nova nota Nielsen, captura, teste funcional nativo ou remedição da versão pública. As avaliações de tela de 16/10 continuam evidência anterior, com seus limites.

## 1. Veredito

[inferido] O Radiant já tem peças importantes para uma trilha ampla: catálogo local, jornada, player por contrato, evidência de aprendizagem, domínio, agendamento, promoção de lotes e painel editorial. O gargalo global é fazê-las operar como uma cadeia coerente, generalizar trechos feitos para um único lote e controlar qualidade/custo na produção. Acrescentar dezenas de lições ao formato atual multiplicaria suas limitações.

[inferido] A prioridade é **generalizar catálogo e motor, organizar o currículo e industrializar a produção**. A expansão não depende de aulas piloto: a direção foi corrigida pelo dono na [ADR global](../../adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md).

## 2. Inventário reproduzido

[código] Medição completa, horário UTC e hashes dos oito módulos carregados no [JSON do inventário](2026-10-16-inventario-estrutural.json). Reproduzir da raiz, no Node 20:

```bash
node scripts/qa/trilha-structural-inventory.cjs
```

[código] O instrumento transpila e executa somente módulos locais puros, com imports externos recusados, sem inicializar app, storage, rede ou API. A composição da fachada replica a união/deduplicação de `LessonCatalogService`; **não afirma visibilidade de cada trilha numa instalação real**.

| Conjunto | Trilhas | Lições/atividades | Perguntas ou nós |
| --- | ---: | ---: | --- |
| Catálogo legado selecionado | 3 | 18 lições | 38 perguntas; 0 com imagem |
| Lote V2 promovido compilado | 1 | 12 atividades | 18 nós projetados |
| Fachada local combinada | 4 | 30 resumos | Tipos e player distintos; não são 30 quizzes legados |

| Trilha legada, título atual | Slug persistido | Lições | Perguntas | Nós projetados pelo construtor atual |
| --- | --- | ---: | ---: | ---: |
| Fundamentos de Radiologia | fundamentos | 7 | 16 | 15 |
| Radiação, Modalidades e Equipamento | torax | 6 | 12 | 13 |
| Prática, Qualidade e Profissão | abdome | 5 | 10 | 11 |

[código] Só duas das 18 lições legadas trazem `journey.intro` autoral. O construtor de introdução seleciona uma pergunta, mesmo quando o payload tem outras. Ele cria também um nó de revisão por lição e uma conquista por trilha; o cálculo de nós da tabela é projeção dessa regra, não contagem em pixels.

[código] No legado completo, a certa é estritamente a alternativa mais longa em **21/38** perguntas, ou **22/38** incluindo empates. No subconjunto gerado por IA, são **18/32** estritas e **19/32** incluindo empates. Assim, o 18/32 da avaliação anterior é compatível com um recorte específico; não é a contagem do catálogo inteiro. [inferido] Comprimento é um alerta de autoria, não prova de que o aluno respondeu pela pista.

## 3. Achados por impacto global

| ID / prioridade proposta | Evidência atual [código] | Consequência e correção proposta [inferido] |
| --- | --- | --- |
| D1 — P0 | `JourneyDefinitionService.buildIntroBlock` usa uma pergunta e textos de molde como fallback | Corrigir a montagem de **todas** as lições legadas e aplicar um contrato de sessão compartilhado; não reescrever tela por lição. Reaproveitar P1 da FILA 50. |
| D2 — P0 | Fachada combina legado e V2; `LessonFlowService` resolve atividade promovida por outro caminho | Inventário deve distinguir resumos, payloads, atividades e nós alcançáveis. Definir fachada canônica e adaptadores, preservando IDs e histórico. |
| D3 — P0 para expansão | `ProductionCurriculumCatalog` fixa slug, títulos, descrição, título da unidade e ID da conquista em Matéria/energia | Um segundo lote não fica independente apenas por adicionar JSON: pode repetir metadados e IDs. Parametrizar o projetor e provar duas trilhas independentes, depois escala sintética. |
| D4 — P0 para imagem | `ProductionBatchDraftV1.media` é `readonly never[]`; o validador rejeita mídia não vazia | Versionar o contrato de lote e sua cadeia de hashes/aprovações, incluindo manifesto de assets; não basta obter imagens licenciadas. |
| D5 — P1 | `SpacedRepetitionService` mantém cartão por `lessonId`, com qualidade agregada do quiz | Introduzir identidade estável de item/conceito, agenda e seleção por item. Evitar um acerto agregado apagar a dificuldade de um conceito. |
| D6 — P1 | `CompetencyReviewService.observeExposure` tem chamador; `getDue` não possui chamador de produção encontrado. Resolver da jornada retorna competência sintética por lição | Conectar leitura, seleção, tentativa e reconciliação de revisão; definir como competências legadas entram sem gerar avalanche de revisões. Não “ligar o serviço” sem política de compatibilidade. |
| D7 — P1 | `LearningEvidenceRepository` tem teto global de 1.000 registros e filtra por competência após carregar o conjunto | Medir crescimento e preservar agregados por competência antes de descartar detalhe. Aumentar o teto sozinho não é estratégia de persistência. |
| D8 — P1 | `TelemetryService` tem fila/eventos locais e registro de adaptadores; adaptador de produto disponível é noop | Definir contrato de eventos por versão e item; métricas remotas continuam dependentes de provedor/privacidade. Instrumentação local e produção editorial não precisam aguardar essa escolha. |
| D9 — P1 | `JourneyTrail` **já usa FlatList**, com `initialNumToRender=12` e `windowSize=7` | Não propor “adicionar virtualização” como conserto ainda inexistente. Medir projeção completa, índices, acesso ao próximo nó e storage em catálogo sintético grande. |
| D10 — P1 | Slugs/IDs históricos de tórax/abdome descrevem atualmente outros agrupamentos | Revisar taxonomia visível e mapa de competências; preservar aliases de IDs, migração de progresso e deep links. Não renomear todos os IDs para organizar o texto. |
| D11 — P0 editorial | Há painel, geradores, validação de fontes e promoção com seis gates/hashes | Reutilizar essa cadeia e torná-la produtiva em lotes. Não começar por comprar CMS ou gerar milhares de perguntas sem contrato. |
| D12 — P1 imagem | Hotspot contém regiões numeradas/lista textual; comparação usa `cover` e quadro 16:9 | Tratar prontidão visual em todo o catálogo: enquadramento, geometria, pistas, equivalência acessível e disponibilidade offline. [Pesquisa anterior](../pesquisas/2026-10-16-exercicios-imagem-celular-evidencias.md). |

## 4. O que já existe e deve ser aproveitado

[código] `LegacyLessonAdapter`, `ActivityRendererRegistry`, `useLearningActivity`, `LessonOutcomeService`, `LearningEvidenceRepository`, `CompetencyMasteryService`, `CompetencyReviewService`, `ProductionBatch` e `production-batch.mjs` já fornecem fronteiras de contrato, persistência, projeção e promoção. O pipeline usa proveniência, revisão por lote e invalidação de aprovação por mudança material. O painel tem páginas de bundles, grafo, promoção e lotes.

[inferido] O trabalho é conectar, generalizar e verificar essas fronteiras. Não há evidência aqui de que trocar toda a arquitetura, o framework ou o sistema de storage seja necessário. SQLite, CMS novo, FSRS e serviço remoto são opções a decidir após medir seu problema específico, não pré-requisitos universais.

## 5. Limites da capacidade atual

[código] `CurriculumMigrationService` mantém o currículo ativo legado e não suporta ativação V3 nessa fase. Ter arcos registrados em `CurriculumV3Definition` não comprova conteúdo pronto. `LessonCatalogService` aceita payload remoto no contrato de quiz; o V2 promovido continua vindo de batches compilados.

[inferido] O diagnóstico não conclui: quantidade de alunos, retenção real, custo mensal, throughput editorial, uso de memória em aparelho, direitos atuais de todo o acervo, qualidade clínica de cada item ou disponibilidade atual da API. Esses dados não foram medidos. O instrumento também não inventaria cada store/migração ou toda a cadeia de fontes; essas ampliações estão no pacote G0 do plano.

## 6. Ordem recomendada

[inferido] **G0 inventário ampliado → G1 catálogo/motor globais e P1 → G2 organização curricular → G3 fábrica editorial → G4 revisão/evidência por item → G5 mídia e pacotes offline → G6 escala/QA → G7 publicação autorizada → G8 observação e replanejamento.** G2/G3 e o levantamento de mídia podem avançar durante G1 com escopos separados, mantendo um único escritor por projeto. Detalhe no [fluxo global](../plano/2026-10-16-loop-global-de-evolucao-da-trilha.md).

## 7. Referências locais inspecionadas

Todas lidas em 2026-10-16. Links indicam código, não prova nativa.

- [Catálogo legado](../../../radiant-app/src/data/catalog.ts), [payloads locais](../../../radiant-app/src/data/lessons.ts), [payloads gerados](../../../radiant-app/src/data/ai-lessons.ts).
- [Fachada](../../../radiant-app/src/features/content/services/LessonCatalogService.ts), [projetor da jornada](../../../radiant-app/src/features/journey/services/JourneyDefinitionService.ts), [projetor V2](../../../radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.ts), [lotes compilados](../../../radiant-app/src/features/student-checkpoints/production-batches.ts).
- [Contrato do lote](../../../radiant-app/src/features/student-checkpoints/ProductionBatch.ts), [player](../../../radiant-app/src/features/lesson-flow/services/LessonFlowService.ts), [persistência de resultados](../../../radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts).
- [SM-2](../../../radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts), [revisão por competência](../../../radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.ts), [resolver de competências](../../../radiant-app/src/features/journey/services/JourneyNodeCompetencyResolver.ts), [evidência](../../../radiant-app/src/features/mastery/repositories/LearningEvidenceRepository.ts).
- [Telemetria](../../../radiant-app/src/features/telemetry/TelemetryService.ts), [adaptador](../../../radiant-app/src/features/telemetry/adapters/ProductAnalyticsAdapter.ts), [FlatList da trilha](../../../radiant-app/src/features/journey/components/JourneyTrail.tsx).
- [Migração V3](../../../radiant-app/src/features/curriculum-v3/CurriculumMigrationService.ts), [arcos V3](../../../radiant-app/src/features/curriculum-v3/CurriculumV3Definition.ts), [pipeline declarado](../../CONTENT_PIPELINE.md), [publicador de lotes](../../../scripts/content/production-batch.mjs), [painel](../../../tools/editorial-panel/app/production-batches/page.tsx).
