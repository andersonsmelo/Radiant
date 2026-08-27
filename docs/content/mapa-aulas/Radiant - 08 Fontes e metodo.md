# Fontes e método

**Medido em 27/08/2026 · código `a05e94b` · inspeção estática.** Não certifica o comportamento de todas as telas no build do TestFlight nem aprovação clínica.

## Reprodução e escopo

Inventário do catálogo local e dos módulos de produção em `a05e94b`, com documentos de auditoria ainda não commitados. Não consulta dados de alunos, credenciais ou capturas com identificadores. Não é medição de banco remoto, catálogo futuro, uso real ou aprovação clínica.

Contagens de dados: importação TypeScript de `LESSONS`, `AI_LESSONS`, `LESSON_CATALOG`, `PRODUCTION_BATCHES` e `ProductionCurriculumCatalog`, combinada com leitura dos JSONs governados. Contagem legada de nós calculada a partir de `buildUnit`: duas entradas por aula, checkpoint entre aulas e recompensa final. 54 legados + 18 promovidos = 72 nós. A rota construída e a disponibilidade de cada tela em aparelho são perguntas diferentes.

## Código — caminhos relativos à raiz Radiant

- Catálogo: `radiant-app/src/data/lessons.ts`, `ai-lessons.ts`, `catalog.ts`, `ai-catalog.ts`.
- Catálogo consumidor: `radiant-app/src/features/content/services/LessonCatalogService.ts`.
- Trilha: `radiant-app/src/features/journey/services/JourneyDefinitionService.ts`, `JourneyCurriculumService.ts`, `JourneyNodeRouting.ts`.
- Atividades promovidas: `radiant-app/src/features/student-checkpoints/production-batches.ts`, `ProductionCurriculumCatalog.ts`.
- Fluxo e painel: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`, `components/LessonVisualPanel.tsx`, `renderers/`.
- Avaliações: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx` (texto fixo na linha 620 no snapshot).
- Revisão: `radiant-app/src/features/review/hooks/useReview.ts`, `screens/ReviewScreen.tsx`, `components/ReviewCard.tsx`.
- Memória: `radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.ts`.
- Movimento: `radiant-app/src/ui/motion.ts`.
- Pipeline: `scripts/content/sync-catalog-to-app.mjs`.
- Dados editoriais: `conteúdo/governança/catalog-payload.json`, `foundations-safety-competencies.json`, `learning-sequence.json`.
- Mídia: `conteúdo/mídia/manifest.json`. Apenas o item aprovado foi considerado; nenhum candidato rejeitado é distribuído neste atlas.

## Documentação operacional

`docs/STATUS.md` continua sendo a única fonte de estado vivo. O roadmap ativo é `docs/plans/2026-07-27-radiant-launch-roadmap.md`. A auditoria inicial está em `docs/content/2026-08-27-revisao-licoes-ios.md`. Este atlas é um snapshot de inventário e uma proposta, não outro status operacional.

## Referências externas consultadas em 27/08/2026

- [JSON Canvas 1.0 — especificação oficial](https://jsoncanvas.org/spec/1.0/): estrutura do artefato.
- [Skill json-canvas de kepano](https://github.com/kepano/obsidian-skills/blob/main/skills/json-canvas/SKILL.md): orientação de autoria; consultada, sem instalação global.
- [IES — Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1): princípios de recuperação, espaçamento, exemplos e representações. A escolha dos pilotos é uma aplicação proposta pelo agente, não conclusão de estudo específico do Radiant.
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion): movimento a serviço da compreensão e do feedback.
- [Apple — Reduced Motion evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/): comportamento equivalente com movimento reduzido.

## Verificações do artefato

O gerador verifica contagens esperadas, IDs únicos, referências das conexões, dimensões positivas, ausência de sobreposição entre cartões e resolução de notas/âncoras. Essas verificações não validam a redação clínica das perguntas transcritas. A inspeção visual é relatada separadamente no fechamento da tarefa.
