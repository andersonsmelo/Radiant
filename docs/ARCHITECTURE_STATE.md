# Radiant — estado arquitetural

## Produto vigente

Radiant é um app Expo/React Native local-first. Catálogo, lições, progresso e
revisões permanecem utilizáveis sem backend. A API Fastify/PostgreSQL existe
para autenticação e sincronização, mas a API pública conhecida está registrada
como inativa (HTTP 502) no
[`status canônico`](EXECUTION_STATUS_2026-08-09.md) e não faz parte do caminho
crítico do teste fechado.

Componentes principais:

- `radiant-app/src/app`: única árvore oficial de rotas;
- `LessonCatalogService`: fachada do catálogo local/remoto;
- `JourneyDefinitionService`: projeta trilhas do catálogo para a jornada;
- `JourneyProgressService`: mantém seleção e progresso por trilha;
- `LessonOutcomeService`: registra resultado, XP e evidência de conclusão;
- `LegacyLessonAdapter`: converte bloco legado em atividade v2, puro e 1:1;
- `ActivityRendererRegistry` + `useLearningActivity`: player desacoplado dos
  tipos de atividade, com contrato único `interaction/value/onChange`;
- `LearningEvidenceRepository`: evidência estruturada por interação;
- `CompetencyMasteryService`: domínio por competência, puro e determinístico;
- `CompetencyReviewService`: store e agendamento por competência, ainda sem
  chamador de leitura em produção;
- `Conteúdo/`: pipeline editorial com proveniência;
- `radiant-api/`: auth, sync e catálogo remoto opcional.

## Jornada atual

A Learning Road V2 usa `journey-progress.v2`, preserva progresso separado por
trilha e migra o store legado quando possível. O catálogo runtime expõe
Fundamentos, Tórax e Abdome; as 18 atividades existentes continuam sendo o
baseline compatível durante a evolução.

Regra arquitetural: alternar trilhas não apaga progresso, uma falha de sync não
bloqueia o estudo e estados vazios devem manter continuidade no fluxo principal.

Na saída da apresentação de primeiro uso, `RootLayout` persiste o encerramento
antes de consultar `JourneyProgressService`. O desfecho **Começar** abre o
`nextRecommendedNode` pela mesma política de roteamento da jornada, somente
depois que o `Stack` está montado; **Pular apresentação** abre a Home. Não há id
de lição fixo, e falha ou nó não navegável degrada para Home.

## Kernel de checkpoints — fundação em `off` implementada

Em 2026-08-09 foi aprovado o desenho de um kernel central para registrar e
retomar as telas principais da jornada. Ele não substitui os serviços acima:
coordena estado mínimo retomável por adaptadores e delega progresso, evidência,
domínio, revisão, XP e desbloqueio aos donos atuais.

O contrato usa `off | shadow | active`, stores separados para ativo/shadow,
diário limitado e um commit local recuperável e idempotente por `operationId`.
Cada operação nasce junto de uma intenção imutável de replay no mesmo registro
serializado; cada serviço persiste o recibo de idempotência atomicamente com o
efeito antes de a saga marcar a etapa como concluída.
O loop pedagógico será ligado a um loop editorial com revisões humanas clínica,
de direitos e de acessibilidade independentes.

Em 2026-08-09 a Onda 2 criou o módulo isolado
`radiant-app/src/features/student-checkpoints/`: contratos/schemas fechados,
stores ativo/shadow, quarentena, coordenadores, journal recuperável, sete
autoridades transacionais e outbox auxiliar. Nenhum adaptador foi conectado às
telas ou aos serviços legados; produção permanece `off`, rotas/progresso/XP não
mudaram e sync remoto continua inexistente.

Ordem normativa: governança → fundação transacional → shadow → runtime interno
→ Task 12 educacional → Galáxia/pipeline/Unidade 1 → outbox e beta pedagógico local/offline
→ expansão pedagógica. Sync remoto é uma trilha posterior e independente, com
gates próprios de carga/soak, API/auth, conflitos e sink verificado.

## Evolução por competências

A decisão de 2026-07-31 introduz um contrato de atividade v2 com renderizadores
reutilizáveis, tentativas estruturadas e domínio por competência. A Galáxia
deverá se tornar uma projeção da mesma jornada canônica, não uma segunda árvore
de progresso. O catálogo legado será preservado por adaptador durante a
migração.

Fluxo-alvo:

```text
fonte + decisão de direitos
          ↓
conceito + competência + atividade
          ↓
revisão humana da unidade
          ↓
catálogo canônico
     ↙          ↘
jornada        Galáxia
     ↓
tentativa → domínio → revisão espaçada
```

Estado de implementação (a autoridade é o status canônico; esta lista é
conveniência e decai):

- governança das novas raízes editoriais: concluída;
- catálogo dos 36 documentos únicos: concluído;
- validação do manifesto de mídia: concluída;
- primeiro lote original de mídia: **concluído para o corte autorizado** — uma
  ilustração sintética está `ready`; cinco candidatas históricas continuam
  rejeitadas;
- grafo curricular de 30 competências: **concluído**;
- contrato `LearningActivityV2` e adaptador do catálogo legado: **concluídos**;
- evidência estruturada por interação e domínio por competência: **concluídos**;
- registro de renderizadores e player desacoplado: **concluído**;
- agendador por competência: **concluído e inerte** — observa exposições, mas
  `getDue` ainda não alimenta a jornada; campos numéricos persistidos exigem
  `Number.isFinite` e stores inválidos vão para quarentena;
- renderizadores de hotspot, comparação, associação e ordenação:
  **concluídos**, ao lado da múltipla escolha; `parameter-lab`, `risk-hunt` e
  `case-decision` permanecem para ondas futuras;
- guarda de ativação do agendador: **concluída** — competência sintética legada
  falha fechada; leitura curricular continua aguardando conteúdo v2;
- kernel de checkpoints e commit recuperável: **fundação isolada em `off`
  concluída**; telas e serviços legados ainda desconectados;
- checkpoint e reforço adaptativo (Task 12 educacional): **pendentes**, agora depois da
  fundação transacional do kernel.

Antes de ativar o lado de leitura do agendador, o resolver ainda precisa apontar
para competência curricular real do conteúdo v2. A guarda já impede que
competências sintéticas legadas produzam recomendação visível.

Duas propriedades que o motor v2 já garante e convém não perder de vista ao
evoluí-lo:

- **O caminho legado segue intacto.** `LessonBlock` continua validado por exceção
  com exatamente uma múltipla escolha por bloco, e é o bloco legado — não a
  atividade adaptada — que vai para o `LessonOutcomeService`. As 18 atividades do
  catálogo funcionam durante toda a migração.
- **Evidência legada é rastreável e separável.** Conteúdo antigo produz
  `legacy-lesson-recall` sob competência sintética `competency:legacy:*`, e o
  cálculo de domínio a **ignora por padrão** — lição antiga não foi escrita contra
  o currículo, então sua evidência não sabe qual competência mede.

## Contratos editoriais

- `Conteúdo/fontes/library-catalog.json`: inventário por SHA-256 e decisão de
  direitos;
- `Conteúdo/mídia/manifest.json`: autorização, anonimização, acessibilidade e
  regiões interativas;
- `Conteúdo/governança/catalog-payload.json`: catálogo promovido legado;
- `scripts/content/validate-foundation.mjs`: gate agregado;
- `scripts/content/validate-media-manifest.mjs`: gate específico de mídia.

Fonte `reference-only` serve somente para consulta factual e redação original.
Fonte `blocked` não alimenta conteúdo. Nenhum ativo de imagem entra no app sem
autorização e anonimização verificadas.

## Fontes de verdade

| Tema | Documento |
| --- | --- |
| Estado operacional | [`EXECUTION_STATUS_2026-08-09.md`](EXECUTION_STATUS_2026-08-09.md) |
| Produto | [`PRD.md`](PRD.md) |
| Ordem entre as frentes | [`plans/2026-08-01-radiant-roadmap-mestre.md`](plans/2026-08-01-radiant-roadmap-mestre.md) |
| Roadmap de lançamento | [`plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md) |
| Pipeline editorial | [`CONTENT_PIPELINE.md`](CONTENT_PIPELINE.md) |
| Runtime do app | [`../radiant-app/README.md`](../radiant-app/README.md) |
| Runtime da API | [`../radiant-api/README.md`](../radiant-api/README.md) |
| Decisão educacional | [`adr/ADR-2026-07-31-aprendizagem-por-competencias.md`](adr/ADR-2026-07-31-aprendizagem-por-competencias.md) |
| Kernel de checkpoints | [`superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md`](superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md) |
| Plano do kernel | [`superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md`](superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md) |
| Privacidade de checkpoints | [`STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md`](STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md) |
| Rollout/rollback do kernel | [`runbooks/student-checkpoint-rollout-rollback.md`](runbooks/student-checkpoint-rollout-rollback.md) |

## Regras de consistência

- o status canônico governa o presente; snapshots anteriores são históricos;
- arquivos gerados do catálogo não são editados manualmente;
- promoção exige proveniência, revisão e validadores verdes;
- vidas não podem bloquear novas lições;
- nenhuma mudança de binário entra no closed test sem repetir os gates de
  release aplicáveis.
