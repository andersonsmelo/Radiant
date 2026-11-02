## REQ-01 — Aulas antigas retiradas e sem reintrodução no runtime

> "Sim, retirar todo o conteúdo de aulas, inclusive exemplos e protótipos"
>
> "O catálogo deve declarar estado explícito `retired`, e o runtime deve recusar reintrodução por catálogo remoto, fallback ou deep link antigo. Ausência acidental de arquivos não equivale a retirada válida."
>
> — `docs/adr/ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md`, confirmação do escopo e § Escopo da retirada.

**Verdict final:** implemented · confidence: high, limitada ao checkout e aos caminhos abaixo, após corrigir o contraexemplo do onboarding.

**Proveniência da correção:** o veredito inicial deste revisor foi `implemented · confidence: high` e estava errado quanto ao escopo total. Ele cobriu catálogos, remoto, retomada, revisão e protótipos, mas omitiu o exemplo instrucional embutido no primeiro acesso. O achado posterior tornou o requisito **partial** até a correção descrita ao fim. O resultado final não torna correta a declaração inicial nem altera a cronologia.

**Medição:** 02/11/2026, branch `claude/trilha-medalhao-design`, worktree `trilha-2026-10-20`; HEAD base `34147e114de338a73a02ec68e8079c6bf3296c1d` com diff ainda não commitado. Auditoria documental e estática por requisito, com reprodução de testes focados. Adaptação do checker da skill `spec-to-code-compliance`; o workflow hospedado completo não foi executado. Este revisor implementou a retirada editorial, portanto essa parte constitui revisão adversarial do próprio código; runtime, rotas e protótipos foram escritos por outros agentes.

**What this demands of an implementation:** todas as fontes ativas anteriores devem retornar zero aulas/itens; a inicialização e atualização não podem buscar conteúdo remoto enquanto o marcador estiver aposentado; IDs persistidos ou recebidos por deep link não podem reconstruir a aula removida. Engines e dados do aluno podem permanecer, desde que não forneçam o texto retirado à interface.

---

**Where enforcement lives:**

| Arquivo e linhas lidas (1-based) | Propriedade verificada |
| --- | --- |
| `radiant-app/src/data/curriculum-state.json:L1-L6` | Estado local explícito: schema 1, `retired`, público e motivo exatos. |
| `radiant-app/src/data/lessons.ts:L1-L4`, `ai-lessons.ts:L1-L3`, `catalog.ts:L1-L8` | Arrays legados/IA, summaries e tracks vazios; inicial nula. |
| `radiant-app/src/data/journey/defaultBlocks.ts:L1-L3`, `defaultTrack.ts:L1-L8` | Sem blocos ou unidades curriculares padrão. |
| `radiant-app/src/features/student-checkpoints/production-batches.ts:L1-L3`, `production-catalog-entries.ts:L1-L10`, `ProductionCurriculumCatalog.ts:L1-L4` | Registro promovido vazio; entradas derivadas dele, sem fallback H4. |
| `radiant-app/src/features/student-checkpoints/createProductionCurriculumCatalog.ts:L173-L252` | Maps começam vazios, só recebem entradas no loop sobre os lotes; consultas retornam `null` quando não há entrada. Não há seed oculto no retorno. |
| `radiant-app/src/features/content/services/LessonCatalogService.ts:L1-L237` | Construção usa apenas arrays locais e composição promovida. `bootstrap` retorna por `refresh` antes da migração; `refresh:L155-L159` retorna local antes de telemetria, remoto ou sanitização. `getLessonById:L223-L225` lê exclusivamente o map atual. |
| `radiant-app/src/features/content/services/RemoteCatalogService.ts:L1-L38`, `composeCurriculumCatalog.ts:L1-L22` | Remoto poderia fornecer payload quando chamado, mas só há um chamador de runtime, atrás do retorno `retired`; composição não cria aulas quando ambos os lados estão vazios. |
| `radiant-app/src/features/bench/lessons/BenchLessonCatalog.ts:L1-L12` | Sem IDs; resolver retorna `null` em qualquer build. |
| `radiant-app/src/features/lesson-flow/services/LessonFlowService.ts:L1-L100` | Caminho completo: bancada, promovido, depois bloco da jornada. Nenhum lê payload do storage ou da URL. |
| `radiant-app/src/features/journey/services/JourneyDefinitionService.ts:L98-L112,L193-L274` | Blocos dependem do catálogo atual; ID ausente retorna `null`; trilha sem entrada produz unidade vazia, sem nós. |
| `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx:L147-L225` | Retomada fornece cursor; conteúdo precisa ser novamente resolvido pelo serviço. Sem atividade, termina em erro de atividade não encontrada, sem reconstruir prosa do checkpoint persistido. |
| `radiant-app/src/features/quiz/screens/QuizScreen.tsx:L40-L120` | ID da URL/lista de revisão resolve no catálogo; ausência mostra estado vazio. |
| `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx:L151-L204,L501-L521` | Nó atual precisa existir na jornada e seus itens precisam vir do catálogo promovido; não há itens de questão embutidos como fallback. |
| `radiant-app/src/features/spaced-repetition/services/ItemReviewService.ts:L1-L163` | Definições vêm do catálogo promovido ou legado atual. `loadQueue` só adiciona cartão com definição atual; o cartão antigo por si só não contém questão a renderizar. |
| `radiant-app/src/app/licao-hibrida.tsx:L1-L37` | Deep link híbrido mostra preparação/retorno; não importa player nem corpus anterior. |
| `radiant-app/src/features/curriculum-v3/CurriculumV3Definition.ts:L1-L9` | Nenhum arco ativo e nenhum manifesto publicável. |
| `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.tsx:L28-L38`, `l2-slicing-space/SlicingSpaceLessonPreview.tsx:L39-L48`, `hybrid-l1/HybridLessonScreen.tsx:L22-L74` | Payload precisa ser injetado; sem ele, aparece preparação. Intro e síntese híbridas são entradas, com padrões vazios. |
| `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.stories.tsx:L1-L12`, `l2-slicing-space/SlicingSpaceLessonPreview.stories.tsx:L1-L12` | Stories não injetam as aulas antigas nem fixtures novas. |
| `scripts/content/curriculum-state.mjs:L4-L50` | Validação estrita do marcador, arrays curriculares vazios, ausência de arquivos anchored/claims e de bundles JSON ocultos nos diretórios editoriais; ausência da antiga competência. |
| `scripts/content/sync-catalog-to-api.mjs:L142-L145`, `sync-catalog-to-app.mjs:L216-L219` | Geração para app/API recusa o marcador aposentado antes de escrever artefatos. |

---

**Paths walked:**

- `bootstrap → refresh → retired return`: não alcança `CurriculumMigrationService.bootstrap`, `RemoteCatalogService.fetchManifest` ou leitura de AsyncStorage pelo catálogo.
- `refresh → createLocalManifest → composeCurriculumCatalog → empty production entries`: manifest e map permanecem vazios; nem payload remoto nem fallback local contêm as aulas antigas.
- `learn?blockId=antigo → LessonFlowService → bench null → production null → JourneyDefinitionService null`: nenhuma atividade é criada. Cursor de retomada só é aplicado depois de obter uma atividade atual.
- `quiz?lessonId=antigo → getLessonById → null`: estado de nenhuma lição disponível.
- `checkpoint?nodeId=antigo → jornada sem nós → checkpointNode null → productionItems []`: não há questão antiga exibível. O estado visual desse link não foi validado em dispositivo.
- `review → ItemReviewCoordinator.loadQueue → current definitions [] → old cards ignored`: preserva storage, sem converter a identidade persistida em prosa.
- `/licao-hibrida`: preparação incondicional. Previews L1/L2 e storybook sem definição: preparação.
- Validador editorial: marcador ausente não significa retirada; marcador inválido lança; resíduo conhecido não vazio lança. Os sincronizadores não substituem o estado retirado por conteúdo gerado.

**Searched:**

- `rg --files` em data, bench, V3 e SQL: ausentes `ai-catalog.ts`, `exposicao.ts`, `colimacao.ts`, `l1BodyReferenceContent.ts`, `l2SlicingSpaceContent.ts`, `l1HybridLessonPlan.ts`, `l1ItemTemplates.ts` e os seeds SQL 002/003 de conteúdo. Existência confirmada por `Path.exists()` para os nove arquivos de payload/seed enumerados e `scripts/content/generate-local-bundles.py`: dez resultados `false`.
- `getActivityById|getLessonById|LESSONS|AI_LESSONS|BenchLessonCatalog|RemoteCatalogService` em `src`, excluindo testes/stories/fixtures: fontes reais encontradas foram os arrays vazios, catálogo promovido derivado do registro vazio e os serviços listados acima. O único chamador de `fetchManifest` no runtime está em `LessonCatalogService` depois do retorno aposentado.
- `l1BodyReferenceContent|l2SlicingSpaceContent|l1HybridLessonPlan|l1ItemTemplates|l1RelationTable|l1TemplateApproval|ai-catalog|test/fixtures`, excluindo testes/stories/fixtures: **0 hits**.
- `HybridLessonScreen|BodyReferenceLessonPreview|SlicingSpaceLessonPreview` fora de testes/fixtures: componentes reutilizáveis e suas stories sem payload; a rota híbrida não os importa.
- `lessonId:|prompt:|question:|contextBody:|teachBody:|Tomografia|Energia e|Qualidade de imagem|Raios X|colimação|exposição` em `src/data`: **0 hits**.
- Diretórios editoriais de classificação/conceitos/formatos: apenas README/index; índices e seis arrays de catálogo vazios, sem cópias de aulas ancoradas. Referências, taxonomia, schemas e histórico foram preservados intencionalmente.

**Validation reproduced:**

```bash
# Node 20.20.2, em radiant-app, EXPO_NO_DOTENV=1
npm exec jest -- --runInBand \
  src/features/content/services/ContentRetirement.test.ts \
  src/test/routes/licao-hibrida.test.tsx
```

Resultado: **2 suítes / 9 testes aprovados**, 0 snapshots. O teste do catálogo usa o marcador real, todas as fontes reais vazias, um remoto sentinela e IDs antigos; verifica que remoto e AsyncStorage não foram chamados. Esta reprodução não equivale a E2E ou binário instalado.

A verificação editorial já registrada nesta execução passou em 121 testes Node e 30 Python. Essa seleção excluiu `register-source.test.mjs`, cuja fixture exige um PDF local ausente nesta worktree; a exclusão da medição não alterou a suíte nem o gate. A mutação controlada da guarda `entries.length !== 0` produziu falha específica nas asserções de resíduo de coleção e quiz; a guarda foi restaurada antes desta revisão. Isso é evidência da implementação editorial pelo seu autor, não uma segunda revisão independente.

---

**How the verdict was reached:** as fontes materiais anteriores estão ausentes/vazias e as cadeias de entrada verificadas dependem delas. A barreira de atualização vem antes do único chamador remoto. Os caminhos de URL, retomada e revisão resolvem definições atuais em vez de confiar em identidades persistidas. Nenhuma divergência de reintrodução foi encontrada nesses caminhos de catálogo. Essa conclusão inicial não cobria o onboarding: a busca complementar encontrou um exemplo diretamente embutido na interface, corrigido e verificado na seção seguinte. O veredito final depende também dessa correção, não apenas dos nove fornecedores vazios.

**Divergences:** houve um contraexemplo confirmado depois da primeira versão deste relatório: a atividade instrucional de kV permanecia no onboarding e no replay de Configurações. O agente integrador conferiu a fonte independentemente e confirmou que não havia exceção autorizando sua preservação. O achado foi corrigido e rechecado abaixo. Não se reivindica execução do workflow hospedado completo ou dupla refutação do plugin.

## Contraexemplo do onboarding, correção e cronologia

**Estado anterior comprovado:** `WelcomeFlowScreen.tsx` tinha `KV_CONTROL` e três frases sobre contraste em L22-L27, seleção do feedback por kV em L44-L51, obrigação de manipular antes de concluir em L70-L78 e instrução/fantoma/controle/feedback em L110-L115. Era um exemplo didático completo de um passo. `_layout.tsx:L453` e `SettingsScreen.tsx:L169` o tornavam alcançável sem passar pelo catálogo. A preservação dos componentes e do modelo físico genérico não autorizava preservar esse exercício e sua prosa. `WelcomeSlide.tsx:L14` ainda convidava a “tirar sua primeira radiografia”. Essas linhas são da versão anterior à correção, documentada no diff desta tarefa.

**Desvio de ordem:** a pesquisa na internet **já havia começado** quando esse conteúdo residual foi identificado. Portanto a instrução de retirar todo conteúdo, inclusive exemplos, antes da pesquisa não foi integralmente cumprida. A retirada posterior corrige o estado técnico final; não corrige retroativamente a ordem de execução. Nenhum horário exato não medido é atribuído aqui.

**Correção efetivamente lida:**

| Fonte atual | Evidência |
| --- | --- |
| `radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx:L1-L18` | Não importa `BenchControlRow`, `ExposureImage`, `REFERENCE_EXPOSURE` ou `BenchControl`; não contém `KV_CONTROL`/`KV_FEEDBACK`. |
| `WelcomeFlowScreen.tsx:L28-L67` | Sem estado de kV, preview ou `hasAdjusted`; `finish` usa apenas a trava idempotente. Continuar está habilitado imediatamente; não há critério de concluir exercício. |
| `WelcomeFlowScreen.tsx:L70-L97` | Apresentação mostra saudação genérica, “Conteúdo em preparação.”, aviso educacional e navegação. Sem fantoma, controle, explicação científica ou exemplo de exposição. |
| `radiant-app/src/features/first-run/components/WelcomeSlide.tsx:L9-L16` | Pixel e layout permanecem; convite passa a “Vamos conhecer o Radiant.”, sem prometer realizar uma radiografia. |
| `WelcomeFlowScreen.flow.test.tsx`, `WelcomeFlowReentry.test.tsx`, `WelcomeSlide.test.tsx` | Lidos no diff e executados independentemente: verificam ausência do exercício, saída imediata/idempotente, compatibilidade de cursores, replay e acessibilidade do texto. |

**Busca complementar reproduzida:** `KV_FEEDBACK|KV_CONTROL|ExposureImage|BenchControlRow|REFERENCE_EXPOSURE|hasAdjusted|Ajuste o kV|Osso branco|Tudo cinza|partes moles|fantoma|mão na massa|Arraste` em `src/features/first-run`, excluindo testes: **0 hits** após a correção. A fonte completa dos dois componentes foi lida, portanto a conclusão não depende apenas da ausência dessas palavras. Modelos físicos e controles genéricos em `features/bench` permanecem preservados, conforme a ADR.

**Reprodução independente depois da correção:** Node 20.20.2, `EXPO_NO_DOTENV=1`, sem suite integral ou binário:

```bash
npm exec jest -- --runInBand \
  src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx \
  src/features/first-run/screens/WelcomeFlowReentry.test.tsx \
  src/features/first-run/components/WelcomeSlide.test.tsx
```

Resultado: **3 suítes / 19 testes aprovados**, 0 snapshots, 0 skips. Isso confirma que o contraexemplo conhecido não permanece na primeira apresentação nem em seu replay. O writer atual é `run-1793652411232-ce3ced90`; a validação integral cabe ao integrador depois desta checagem. Nenhuma alteração de implementação foi feita por este revisor durante a rechecagem; somente este relatório foi atualizado.

**State conflict risks:** o runtime lê `state` do JSON compilado; público/motivo/schema exatos são aferidos pelo gate editorial. Alterar esse marcador ou inserir um novo fornecedor de conteúdo exige revisão própria: esta análise cobre o estado atual, não prova contra futuras alterações arbitrárias. O estado `retired` não despublica dados remotos nem muda o binário já distribuído, conforme a ADR.

**Open questions / notChecked:** dispositivo/simulador, E2E e experiência visual completa dos estados vazios; produção/App Store/API/banco remoto; dados privados/AsyncStorage reais; PDFs e extrações locais; histórico Git e relatórios antigos preservados deliberadamente. Não foi feita auditoria de cada texto geométrico, tipo anatômico ou modelo físico genérico preservado. Não foram avaliadas as novas funcionalidades propostas no planejamento, que ainda não são requisitos implementados.
