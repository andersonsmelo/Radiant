# PC06-A — integração dos dados auxiliares na prévia M01.01

Medido em 03/11/2026, branch `claude/conteudo-reinicio-tecnologo`, HEAD
`dcb6810`. Anderson pediu “Vamos para a próxima task” depois da entrega dos
payloads PC05. Este primeiro recorte de implementação do PC06 integra ajuda,
retornos por alternativa e os dois contextos de recuperação da aula completa.
O PC06 inteiro continua aberto; esta entrega não presume build ou publicação.

## Componente e material

`radiant-app/src/features/editorial-preview/EditorialLessonPreview.tsx` é um
componente React Native de revisão, com material e etapa fornecidos pelo
chamador. Sem material, mostra “Conteúdo em preparação”; entrada inválida
mostra indisponibilidade da prévia. Não importa o JSON editorial, não tem
rota na navegação e não é registrado no catálogo ou na bancada.

O adaptador `EditorialPreviewMaterial.ts` recebe explicitamente os quatro
campos do pacote PC05: `candidate`, `checkpointOptionFeedback`, `optionalHelp`
e `recoveryActivities`. Valida o candidato pelo contrato existente e recusa
dados auxiliares incompletos, fontes/competência/versão divergentes, IDs
reutilizados ou fora de `rtg-2026`, modos de recuperação trocados e atividades
críticas fora deste recorte introdutório. Não concede aprovação por hash.

O chamador escolhe uma destas etapas, sem roteamento automático de aluno:

| Etapa | Comportamento integrado |
| --- | --- |
| `lesson` | Preserva as quatro etapas de M01.01. A ajuda aparece somente quando solicitada; sua abertura distingue a primeira confirmação assistida. |
| `checkpoint` | Adapta os dois itens já escritos para interações do motor, com o retorno autoral de cada alternativa em `explanation` e o retorno correto específico. A observação conserva o ID original do item. |
| `guided-recovery` | Usa o primeiro contexto de recuperação, sua ajuda de apresentação e evidência `guided-practice`; marca a observação como assistida. |
| `different-context-retry` | Usa o segundo contexto, ID próprio e evidência `applied-transfer`, sem tratá-lo como repetição do item do checkpoint. |

Reutiliza `useLearningActivity`, `ActivityInteractionRenderer`, `feedbackFor`
e `AppButton`. Selecionar não confirma; o retorno só aparece após confirmar,
e as alternativas conferidas ficam indisponíveis para mudança. Uma nova
questão começa sem seleção. Ajuda, confirmação e encerramento têm guardas
contra duplicação. Trocar a etapa ou o material autorado recria o cursor
efêmero; não apresenta resposta ou retorno da sessão anterior.

`onObservation` informa apenas ao chamador local ajuda/valor confirmado,
correção, tipo de evidência, etapa e uso de apoio. `onFinish` entrega as
primeiras respostas confirmadas da prévia uma única vez. O componente não
chama repositórios de progresso, coordenador de checkpoint, outbox, XP,
vidas, recompensa ou analytics de produção. Esses callbacks não certificam
aprendizagem nem substituem os fluxos transacionais existentes.

## Como exercitar e o que os testes medem

As duas suítes novas usam o material real de
[`2026-11-03-pc05-payloads.json`](2026-11-03-pc05-payloads.json) por um helper
exclusivo de testes, `src/test/fixtures/realEditorialPreview.ts`. O produto
não importa o helper nem esse JSON. O helper lê o arquivo local em vez de
manter outra cópia do texto ou gabarito do piloto.

No diretório `radiant-app`, com Node 20.20.2:

```sh
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --runTestsByPath \
  src/features/editorial-preview/EditorialPreviewMaterial.test.ts \
  src/features/editorial-preview/EditorialLessonPreview.test.tsx \
  src/features/lesson-flow/hooks/useLearningActivity.test.ts \
  src/features/lesson-flow/services/feedbackFor.test.ts
```

**4 suítes / 62 testes passaram**, incluindo **20 testes novos**. Também
passaram `npx tsc --noEmit` e lint dos cinco arquivos novos. As interações de
UI usam os renderers e o hook reais; apenas a preferência de movimento é
fixada no teste e o ícone nativo é substituído. Não são dublês do player.

Evidência vermelha específica:

- Remover temporariamente `explanation` do adaptador fez o teste do retorno
  da alternativa escolhida reprovar porque o texto autoral não estava na
  árvore renderizada. A implementação foi restaurada antes do verde.
  Recibo local: `/tmp/radiant-pc06a-feedback-red.log`.
- Antes das duas guardas finais, os testes de recuperações trocadas e de ID
  `lesson-1` reprovaram separadamente: esperavam recusa e receberam aceite.
  As guardas foram implementadas e os testes passaram.
  Recibo local: `/tmp/radiant-pc06a-context-red.log`.
- Os primeiros testes também detectaram colisão dos IDs de apresentação da
  aula e do checkpoint. O adaptador agora usa sufixos próprios `check-hook`
  e `check-closing`; não foi removida a guarda de unicidade.

O erro inicial de importação de módulo ainda inexistente não é usado como
prova de uma guarda de comportamento. Recibos finais focados:
`/tmp/radiant-pc06a-focused-final.log`, `/tmp/radiant-pc06a-typecheck.log` e
`/tmp/radiant-pc06a-lint.log`.

## Limites e próxima entrega

- A prévia não é uma tela acessível pelo app distribuído ou por uma nova rota
  de desenvolvimento. Sua montagem exige injeção explícita pelo host de
  revisão. Não há importação automática, promoção ou nova aula ativa.
- Cada etapa é aberta explicitamente. Não implementa avaliação completa,
  seleção automática de reforço, cálculo de domínio ou retenção atrasada.
- Cursor e observações são efêmeros. Desmontar e remontar começa outra
  prévia; não existe persistência, migração de histórico ou prova de retomada
  transacional. A idempotência medida vale para uma montagem da prévia.
- A UI usa texto escalável, botões nomeados, estado de seleção/desabilitado,
  confirmação separada e anúncio de retorno. Jest não mede VoiceOver,
  TalkBack, leitura audível, texto máximo, layout, FPS ou qualidade tátil.
- Não houve build, Metro, simulador/aparelho, instalação, EAS/OTA, merge,
  push ou release. O simulador reservado não foi usado.

**Próximo recorte PC06-B:** cena abstrata nova da bancada de colimação e
resolução dos diagramas por ativos locais conferidos, com controles e texto
equivalente. Não alimentar o renderer antigo com o novo payload e reapresentar
o fantoma retirado. Depois: transição das aulas retiradas, Q6 e prova nativa
do conjunto. As quatro aulas ainda em brief e seus checkpoints continuam
pendentes antes da promoção do lote completo; seis aceites por hash permanecem
nos gates próprios.

## Escopo e validação final

Writer `run-1793733495523-85ad88f7`, com onze arquivos declarados: cinco
arquivos de código/teste/helper e seis documentos (este, pipeline, STATUS,
FILA, plano e roadmap). A baseline já continha o trabalho anterior não
commitado; ele foi preservado. Não houve commit ou CI desta entrega.
Sessão do cérebro `brain-session-1793733274689-855ea95b`, consultada e fechada
antes do writer porque o gate configurado chama a CLI para validar links.

Resultado final: **`VALIDATION_PASSED`, 15/15, no terceiro ciclo**, após as
duas correções descritas abaixo. Comando configurado:
`PYTHONDONTWRITEBYTECODE=1 caffeinate -i loop validate --run run-1793733495523-85ad88f7`.
Loop no Node 24.14.1, app/API no Node 20.20.2. Inclui
`EXPO_NO_DOTENV=1 CI=1 npm run quality`, suíte inteira do app sem cache,
contratos de conteúdo/documentação, API e links do cérebro. A fundação
confirma `retired`, zero aulas e `publicationReady: false`.
A medição cobre a árvore local com as alterações anteriores; não é CI de um SHA.
Recibo local: `/tmp/radiant-pc06a-validation-final-3.json`.

| Validador | Resultado | Evidência |
| --- | --- | --- |
| docs-contract | passou | `evidence-81bf749c-bb00-4e29-858e-24daddd08f30` |
| content-foundation | passou | `evidence-fcafc025-b4b6-4775-8d9c-ce50f7313b59` |
| content-wave1 | passou | `evidence-5030b1b8-b77d-4f18-80dc-dde17296c709` |
| content-production | passou | `evidence-dc77246d-017a-4617-804b-3cee6361c177` |
| content-anchoring | passou | `evidence-46ec0a97-285a-4cfc-a587-b7ebe0837276` |
| content-anchoring-data | passou | `evidence-1cfc9504-57c1-48f3-96bd-db7c17e947cb` |
| content-no-verbatim | passou | `evidence-d0525193-6cfd-4b39-a28c-7c460283f08f` |
| content-source-rights | passou | `evidence-ff23f3e0-37ab-41c7-adc7-87f9f11435fd` |
| content-python | passou | `evidence-03fce6be-1ae7-4ae9-95f6-4da422d0263d` |
| app-quality | passou | `evidence-eb05d944-8520-4914-a444-fb59cd212581` |
| app-test | passou | `evidence-77091594-9705-4068-9521-95c2665d437d` |
| api-lint | passou | `evidence-c2b95045-8b31-4b46-8a78-1e5ca51c4c2f` |
| api-typecheck | passou | `evidence-69ed2abf-c4a2-4711-90b7-7dfcd2bb6690` |
| api-test | passou | `evidence-3f936134-448d-4037-9789-b659cc67f7a9` |
| brain-links | passou | `evidence-21429faa-6c76-4692-8905-a3ac6f8f1b19` |

Os envelopes públicos de `step finish` e `run close` são a autoridade para o
fechamento; validar sozinho não fecha o escritor.

O primeiro ciclo passou em 14/15 validadores: `app-test` passou, mas
`app-quality` parou no contrato de clareza da cópia por um título novo
“Checkpoint” (`jargon 1 exceeds 0`). O título visível passou a “Avaliação”;
identidades técnicas e comportamento não mudaram. Nenhum orçamento, exceção,
schema ou teste foi afrouxado. A repetição do gate decorre dessa falha real.
Diagnóstico completo: `/tmp/radiant-pc06a-quality-diagnosis.log`.

O segundo ciclo também passou em 14/15: o agregado chegou ao final dos
207 conjuntos/2.814 testes, todos verdes, e reprovou em `visual:qa:strict`
por uma definição local de `screen` (R2). O componente passou a compor
`layout.screen` com a cor da superfície; o padding interno complementa o
primitivo compartilhado. Nenhuma entrada de baseline ou exceção foi criada.
Diagnóstico: `/tmp/radiant-pc06a-quality-diagnosis-2.log`.
