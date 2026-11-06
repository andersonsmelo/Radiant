# Retirada integral de conteúdo e planejamento — evidência

Medido em02/11/2026, America/Bahia. Branch `claude/trilha-medalhao-design`,
worktree `trilha-2026-10-20`; base `34147e114de338a73a02ec68e8079c6bf3296c1d`.
A [ADR](../adr/ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md) registra a
instrução do dono e a ampliação para exemplos/protótipos. Retirada local,
sem alterar o binário distribuído ou banco remoto.

## O que saiu e o que fica

- Catálogos de aulas legadas/IA, blocos/trilha, H4 e produção/bancada estão vazios.
  Payloads de exemplos exposição/colimação e V3 L1/L2/híbrido foram excluídos.
  O exercício de kV embutido nas boas-vindas também integra a retirada final;
  a apresentação/navegação continuam sem exercício obrigatório.
- Classificações/conceitos/formatos, claims/anchoring, competências antigas,
  prompts de geração e grafo/sequência foram retirados/esvaziados. O gerador com
  corpus embutido saiu; o normalizador exige especificação explícita.
- Seeds SQL002/003 de aulas foram excluídos; schema001 e recuperação de senha
  permanecem. Nenhum SQL foi executado. O README da API deixou de instruir sua
  regeneração; sincronizadores recusam geração enquanto `retired`.
- A spec curricular V3, fichas/planos L1/L2, runbook do Arco1, candidato H4,
  documento das amostras e atlas foram retirados:21documentos de conteúdo.
  Histórias/ADRs/evidências continuam como proveniência, sem currículo paralelo.
- Motores, tipos, geometria, modelos, renderizadores, Medalhão, Pixel e economia
  permanecem. Sessões/previews V3 recebem definições explicitamente; sem definição
  não têm aula. A rota híbrida informa conteúdo em preparação.
- Biblioteca/fontes, excertos, taxonomias, schemas, direitos e mídia de referência
  foram preservados. Nenhum PDF/extração local ou dado privado foi lido.
  AsyncStorage não foi limpo ou migrado por esta tarefa.

O arquivo congelado T15-v1 mantém SHA256
`2f299f7b1e5a5d9a9fd1fc5a2cd712f6050bd085fbefe4c5e375d1e40487574f`.
A autorização atual sucede sua ordem antiga, sem reescrever o inventário.

## Prova funcional focal e passos vermelhos

| Frente | Comando/escopo | Resultado observado |
| --- | --- | --- |
| Aposentadoria do runtime | Node20, Jest `--runInBand src/features/content/services/ContentRetirement.test.ts` |7/7:9coleções vazias;5IDs antigos não resolvem; bootstrap/refresh não consultam remoto/cache/storage nem migram histórico. |
| Estado editorial explícito | Node20 `node --test scripts/content/curriculum-state.test.mjs` |3/3; ausência/marcador inválido, dados residuais e bundles ocultos não passam como aposentadoria válida. |
| Motores V3/híbrido | Node20, Jest `--runInBand src/features/curriculum-v3 src/test/routes/licao-hibrida.test.tsx` |17suítes/226testes, zero snapshots; fixtures abstratas, sem payloads ativos. |
| Runtime e consumidores alterados | Node20, Jest, lista nominal de32suítes do diff |32suítes/642testes, sem skips/snapshots; tsc e ESLint do escopo passaram. |
| Pipeline editorial | Node20, cinco invocações focais de suites; Python execução direta dos três arquivos alterados |121testes Node e30Python passaram; foundation/anchoring/taxonomy/audit declararam0aulas e `publicationReady:false`. |
| API | Node20, tsx `--test src/routes/content-contract.test.ts src/routes/content.test.ts` |3/3; seeds ausentes e schema presente, contrato genérico preservado. |
| Maestro estático | Node20 `node --test scripts/maestro-contract.test.mjs` em radiant-app |11/11; não foi executado Maestro no simulador. |
| Copy AST | Node20 `node --test scripts/copy-style-contract.test.mjs` |65/65; exclusão precisa das fixtures de teste, sem ampliar tetos de copy. |
| Documentação | Node20 `node --test scripts/qa/docs-contract.test.mjs` e `node scripts/qa/docs-contract.mjs` |18/18 e PASS. |

Anchoring Python adicional:12/12 e guarda AST de storage5/5 passaram após as
correções do gate. Três asserções dependentes do corpus de claims foram
substituídas por uma guarda explícita de retirada; regressões genéricas ficaram.

Boas-vindas após retirada do exemplo: Node20, seis suítes/87testes, zero skips,
ESLint dos cinco arquivos e typecheck do app aprovados. Guarda de ausência do
fantoma/controle/texto falhou antes da retirada; convite do Pixel também teve
passo vermelho próprio. Navegação, reentrada, safe area, texto máximo, privacidade
e checkpoint mantêm regressões ativas.

As contagens focais se sobrepõem; não somá-las como uma suíte única.
As fixtures mantêm IDs históricos somente quando necessários para regressão de
armazenamento, com conteúdo abstrato novo. Não são aulas disponíveis ao aluno.

Passos vermelhos realmente observados antes da correção:

1. **Bootstrap:** a guarda de aposentadoria falhou porque houve leitura
   `@radiant:curriculum_runtime_v1`. O retorno antecipado foi colocado antes da
   migração; verde7/7 depois, incluindo ausência de leituras/escritas.
2. **L1 injetada:**6testes falharam com `UNKNOWN_L1_CHALLENGE:initial/recovery`
   enquanto a sessão ainda buscava o corpus antigo; passaram após injeção explícita.
3. **Seeds:** teste falhou em `002_seed_content.sql`, `true !== false`; após
   excluir os dois seeds,3/3 passaram, mantendo exigência do schema.
4. **Maestro:** guarda nova falhou listando os17flows antigos adicionais; após
   retirada e descoberta explícita do único smoke,11/11 passaram. A primeira
   tentativa de substituir o arquivo foi recusada por regex ambígua pelo Serena;
   a execução subsequente que não selecionou testes não é citada como prova.
5. **Copy:** fixture em `src/test/fixtures` introduziu finding na varredura real;
   fixture dedicada reproduziu falha antes de excluir precisamente esse diretório.
   Todas as65asserções passaram depois; os tetos existentes não foram elevados.
6. **Editorial:** mutação temporária removeu a rejeição de coleção não vazia;
   duas asserções acusaram `Missing expected exception`, incluindo quiz residual.
   A guarda foi restaurada e a execução normal passou3/3.

## Divergência de sequência descoberta na auditoria final

A pesquisa começou depois de esvaziar os catálogos e retirar datasets/protótipos,
com guardas focais aprovadas. **Ainda havia um exemplo didático de exposição nas
boas-vindas**, alcançável pelo startup e replay de Ajustes. O primeiro inventário
e o primeiro parecer REQ-01 não o identificaram; a pesquisa já tinha iniciado.
Esse desvio da ordem do dono foi comunicado, não apagado da cronologia.

Conferência independente confirmou que três explicações por faixa de kV,
controle/fantoma e conclusão condicionada a manipulação formavam um exercício,
abrangido por “inclusive exemplos”. A correção retira a instância didática,
preserva os componentes/modelos genéricos, safe area, privacidade, saída única,
checkpoint e navegação; não cria outra aula no lugar. O parecer REQ-01 preserva o contraexemplo; o revisor conferiu a correção e
reproduziu19testes em3suítes, sem skips, antes do veredito final implemented.

## Perda explícita de evidência operacional

Foram retirados17flows Maestro dependentes das aulas e31testes de contrato
específicos desses flows, além de4suítes V3 exclusivamente curriculares e um
snapshot de conteúdo. Não se alega equivalência da cobertura removida.
Preservadas9guardas genéricas Maestro e acrescentadas2de aposentadoria/parser.
Há um smoke proposto de estrutura vazia; não aprova lição, economia, revisão,
conquista, offline, StoreKit, diálogo de avaliação ou segundo dia.

O [runbook atual](../../radiant-app/docs/E2E_RUNBOOK.md) oferece somente o smoke
e separa o histórico por SHA. Revisão independente encontrou P2 nas receitas
antigas; o achado foi confirmado por outro revisor e corrigido, junto de duas
frases residuais do README da API. Os relatórios originais permanecem intactos.

## Conformidade e revisão da proposta

A skill spec-to-code-compliance foi aplicada por adaptação à plataforma:
um requisito por contexto de agente, registros estruturados com caminhos/linhas,
checagem de enforcement/callers e refutação independente do achado documental.
O workflow hospedado do plugin não foi executado como se fosse uma CLI Node.

- [REQ-01 — conteúdo retirado](2026-11-02-retirada-conteudo/REQ-01-aulas-retiradas.md):
  implemented; revisor independente do runtime/protótipos, com autoria editorial
  anterior explicitada como limite.
- [REQ-02 — motores preservados](2026-11-02-retirada-conteudo/REQ-02-motores-preservados.md):
  implemented; revisão de V3/Maestro de outro autor. P2 documental resolvido.

A revisão curricular/direitos considerou a
[proposta](../plans/2026-11-02-planejamento-conteudo-radiant.md) apta para apresentar
como planejamento. Corrigidos três vínculos do grafo, inferência C07, distinção de
pontuação/diagnóstico e matriz de lacunas. Storyboard inspecionado visualmente:
estudo estático, sem aula ativa ou imagem clínica. Não é aceite docente/clínico.

## Validação configurada e lifecycle

**Validação de fechamento: VALIDATION_PASSED,15/15**, no writer
`run-1793652411232-ce3ced90`, um ciclo nele. No objetivo houve três execuções
configuradas:12/15 inicial,15/15 após correções e15/15 após retirar o exemplo
embutido nas boas-vindas. As duas últimas têm escopos de código diferentes;
o PASS intermediário não é apresentado como prova da retirada total.

O gate usa os comandos versionados em `.loop/project.yaml`, com Node20.20.2
para o app/API e Node24.14.1 para Loop, dotenv desativado, sem E2E concorrente.
Inclui `EXPO_NO_DOTENV=1 CI=1 npm run quality`, Jest completo em banda única,
contratos e `visual:qa:strict`; `app-test` completo também passou sem cache.
A saída do extrator informa um skip preexistente para PDF local não versionado
ausente; ele não foi lido, fabricado nem contado como teste aprovado.
Não há contagem final de testes inferida do preview truncado do Loop.

| Validador | Estado | Duração(ms) | Evidência |
| --- | --- | --- | --- |
| docs-contract | passed | 212 | `evidence-c0b02c9e-c08a-4eda-89c7-0b1c589d0eeb` |
| content-foundation | passed | 109 | `evidence-8a2ec0c8-fc39-47ad-856c-748db09477a3` |
| content-wave1 | passed | 58 | `evidence-7e8f7fa0-b8ca-4357-ba7f-d9d5a796b1c9` |
| content-production | passed | 1506 | `evidence-9c3ef28c-9f00-4f96-a9c6-beeb081d0a17` |
| content-anchoring | passed | 109 | `evidence-dd6d3fcf-2c3a-45fc-b139-b9b82145b5ae` |
| content-anchoring-data | passed | 32 | `evidence-4ae8b9d5-4988-4dae-8a8e-be846addc40c` |
| content-no-verbatim | passed | 3247 | `evidence-11d8b303-1c5e-4a0b-ae0e-84afc157e052` |
| content-source-rights | passed | 95 | `evidence-6834f1ac-d287-45d6-b7f2-221f20496252` |
| content-python | passed | 1047 | `evidence-48e28f4e-be85-4147-9846-7ac4f12f21f9` |
| app-quality | passed | 123689 | `evidence-9c67f0db-af04-4b98-b8a2-ebd4f51f7e8a` |
| app-test | passed | 154793 | `evidence-36fbc84a-97e0-49e8-94dd-e11ed2953688` |
| api-lint | passed | 1579 | `evidence-f51bb5d4-e06d-4e47-847c-edcd72cdcd75` |
| api-typecheck | passed | 2206 | `evidence-808c30ac-9c97-43b9-b84f-f9d2233b611c` |
| api-test | passed | 1005 | `evidence-e1bd3587-4a93-45e5-95a9-b957fe2152c0` |
| brain-links | passed | 123 | `evidence-ad7e26bc-85d9-40ad-9709-1f482158adc3` |

A política e os15validadores configurados não foram modificados.

Uma sessão do cérebro para o objetivo:
`brain-session-1793623648711-6c4b54f6`, estado `closed` reconfirmado pela CLI.
Roteiro de escritores, sem concorrência e sem sucesso retroativo:

1. `run-1793624190997-c5e9fff3`: encerrado antes de edição; preflight ampliou
   união ao descobrir corpus embutido no normalizador.
2. `run-1793624313125-0d00dd8b`:235arquivos; fechado de `editing` para declarar
   três testes consumidores adicionais. Preservado o diff; não validado/concluído.
3. `run-1793633695270-2992c675`:238arquivos; fechado de `editing` após revisão
   encontrar runbook/README da API contraditórios.216mudanças estavam dentro da
   união nominal; nenhum sucesso declarado.
4. `run-1793634647644-24849977`:240arquivos declarados; primeiro gate completo
   teve12/15PASS. Falhas reais: `content-python` ainda exigia claims antigos;
   `app-quality` e `app-test` encontraram a mesma variável sintética `prefix`,
   interpretada pela guarda AST como chave de armazenamento. Diagnóstico completo:
   204suítes,203PASS/1FAIL,2.769testes,2.768PASS/1FAIL. Não foi timeout.
   Correção renomeia a variável, preservando guarda/inventário;5/5passaram.
   Fechado de `editing`, sem sucesso, para declarar `anchor-lesson.test.py`.
5. `run-1793651829785-f0e48499`:241arquivos; gate15/15PASS, mas fechado de
   `validating` sem `step finish` porque o escopo ainda continha o exemplo inicial. O teste
   Python deixa de exigir aulas retiradas e exige marcador exato/zero cópias,
   mantendo os testes genéricos de anchoring;12/12passaram no ambiente do gate.
6. `run-1793652255899-681f207a`:243arquivos; retirada do exercício inicial e
   passo vermelho/verde. Fechado de `editing` para declarar reentrada e a fala do
   componente de apresentação, que ainda convidava a fazer uma radiografia.
7. `run-1793652411232-ce3ced90`:246arquivos; inclui esses três consumidores,
   mantém Pixel/navegação sem exercício e oferece fechamento do diff completo.
   As validações anteriores não substituem o gate sobre esta correção.
   A baseline já contém alterações dos anteriores; por isso a revisão e o gate
   abrangem o diff completo contra `34147e1`, não só o delta deste writer.

A necessidade de reabrir foi descoberta de consumidores reais e omissões do inventário inicial, não autorização
para editar fora de escopo ou alargar política. Nenhum estado Loop foi editado à
mão. Fechamento confirmado até a gravação validada: `VALIDATION_PASSED`15/15 →
`STEP_SUCCEEDED` →`MEMORY_WRITTEN` (`status:written`, fingerprint
`cc098dd8529a17a07ac848c837eefa653790f5bb7e8545f90cc2186c31130d6f`).
O recibo final de `run close` é consultável pela CLI com o ID acima; não é
substituído por uma declaração antecipada neste arquivo. A sessão de leitura
continua fechada; nenhuma mudança no vault foi feita fora da CLI.

## Limites e continuação

- Sem build, instalação, execução nativa/E2E, dispositivo, FPS, fala audível,
  migração/reset de usuário, SQL, deploy, EAS/OTA, merge ou loja.
- Sem mudança em Trello, Todoist, Google Docs ou vault privado diretamente.
  Planejamento técnico está no repositório; nenhuma aula de produção foi escrita.
- O teste de registro de fonte que depende do PDF ignorado ausente na worktree
  não passou nesta máquina. A exclusão ambiental já existe no CI de conteúdo;
  não foi criada para este diff. O PDF não foi lido nem fabricado. Isso não é
  apresentado como falha corrigida do registrador.
- Aberturas de algumas fontes tiveram403/timeout/402; o anexo distingue índice,
  página consultada e licença não demonstrada. Não houve liberação de Radiopaedia.
- A proposta ainda precisa de revisão docente, escolha de ativos por licença e
  teste com alunos. PC03 é a próxima decisão concreta; PC04 só começa depois.
- Risco residual de UX: link inválido de checkpoint pode mostrar espera sem
  conteúdo; não houve prova nativa dos estados vazios. Nenhuma aula antiga foi
  encontrada por esse caminho e ele não foi modificado fora do escopo.

## União efetivamente alterada (antes do fechamento)

225 arquivos alterados/criados/retirados; inventário do diff, não novo status vivo.

- ` M` `README.md`
- ` D` `content-manifest/lessons/ai-lesson-qualidade-de-imagem.anchored.json`
- ` D` `content-manifest/lessons/ai-lesson-qualidade-de-imagem.claims.json`
- ` M` `content-manifest/taxonomy-catalog-map.json`
- ` M` `conteúdo/classificação/README.md`
- ` D` `conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/classification-job.json`
- ` D` `conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/classifications.json`
- ` D` `conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/review-decisions.json`
- ` M` `conteúdo/classificação/index.json`
- ` M` `conteúdo/conceitos/README.md`
- ` D` `conteúdo/conceitos/fundamentos-de-radiologia-everton-costa-pinto/concept-job.json`
- ` D` `conteúdo/conceitos/fundamentos-de-radiologia-everton-costa-pinto/concepts.json`
- ` M` `conteúdo/conceitos/index.json`
- ` M` `conteúdo/formatos/README.md`
- ` D` `conteúdo/formatos/casos/fundamentos-de-radiologia-everton-costa-pinto/ai-bundles.json`
- ` D` `conteúdo/formatos/casos/fundamentos-de-radiologia-everton-costa-pinto/bundles.json`
- ` D` `conteúdo/formatos/casos/fundamentos-de-radiologia-everton-costa-pinto/format-job.json`
- ` D` `conteúdo/formatos/checkpoints/fundamentos-de-radiologia-everton-costa-pinto/ai-bundles.json`
- ` D` `conteúdo/formatos/checkpoints/fundamentos-de-radiologia-everton-costa-pinto/bundles.json`
- ` D` `conteúdo/formatos/checkpoints/fundamentos-de-radiologia-everton-costa-pinto/format-job.json`
- ` M` `conteúdo/formatos/index.json`
- ` D` `conteúdo/formatos/microlições/fundamentos-de-radiologia-everton-costa-pinto/ai-bundles.json`
- ` D` `conteúdo/formatos/microlições/fundamentos-de-radiologia-everton-costa-pinto/bundles.json`
- ` D` `conteúdo/formatos/microlições/fundamentos-de-radiologia-everton-costa-pinto/format-job.json`
- ` D` `conteúdo/formatos/quizzes/fundamentos-de-radiologia-everton-costa-pinto/ai-bundles.json`
- ` D` `conteúdo/formatos/quizzes/fundamentos-de-radiologia-everton-costa-pinto/bundles.json`
- ` D` `conteúdo/formatos/quizzes/fundamentos-de-radiologia-everton-costa-pinto/format-job.json`
- ` D` `conteúdo/formatos/reviews/fundamentos-de-radiologia-everton-costa-pinto/ai-bundles.json`
- ` D` `conteúdo/formatos/reviews/fundamentos-de-radiologia-everton-costa-pinto/bundles.json`
- ` D` `conteúdo/formatos/reviews/fundamentos-de-radiologia-everton-costa-pinto/format-job.json`
- ` D` `conteúdo/formatos/rewards/fundamentos-de-radiologia-everton-costa-pinto/ai-bundles.json`
- ` D` `conteúdo/formatos/rewards/fundamentos-de-radiologia-everton-costa-pinto/bundles.json`
- ` D` `conteúdo/formatos/rewards/fundamentos-de-radiologia-everton-costa-pinto/format-job.json`
- ` M` `conteúdo/governança/README.md`
- ` M` `conteúdo/governança/catalog-payload.json`
- ` D` `conteúdo/governança/foundations-safety-competencies.json`
- ` M` `conteúdo/governança/learning-sequence.json`
- ` D` `conteúdo/governança/prompt-templates/caso-clinico.md`
- ` D` `conteúdo/governança/prompt-templates/checkpoint.md`
- ` D` `conteúdo/governança/prompt-templates/microlição.md`
- ` D` `conteúdo/governança/prompt-templates/quiz.md`
- ` D` `conteúdo/governança/prompt-templates/review-card.md`
- ` D` `conteúdo/governança/prompt-templates/reward.md`
- ` M` `conteúdo/governança/wave-1-bundle-status.json`
- ` M` `conteúdo/governança/wave-1-priority-tracks.json`
- ` M` `docs/ARCHITECTURE_STATE.md`
- ` M` `docs/CONTENT_PIPELINE.md`
- ` M` `docs/FILA.md`
- ` M` `docs/PRD.md`
- ` M` `docs/PRODUCT.md`
- ` M` `docs/README.md`
- ` M` `docs/STATUS.md`
- ` M` `docs/archive/FILA_concluidos.md`
- ` M` `docs/archive/STATUS_historico.md`
- ` D` `docs/content/2026-08-13-h4-materia-energia-e-radiacao-candidato.md`
- ` D` `docs/content/mapa-aulas/README.md`
- ` D` `docs/content/mapa-aulas/Radiant - 00 Comece aqui.md`
- ` D` `docs/content/mapa-aulas/Radiant - 01 Inventario das aulas.md`
- ` D` `docs/content/mapa-aulas/Radiant - 02 Revisoes e avaliacoes.md`
- ` D` `docs/content/mapa-aulas/Radiant - 03 Conteudo editorial.md`
- ` D` `docs/content/mapa-aulas/Radiant - 04 Curriculo por competencias.md`
- ` D` `docs/content/mapa-aulas/Radiant - 05 Midia interacoes e movimento.md`
- ` D` `docs/content/mapa-aulas/Radiant - 06 Proposta para as aulas.md`
- ` D` `docs/content/mapa-aulas/Radiant - 07 Fila de revisao.md`
- ` D` `docs/content/mapa-aulas/Radiant - 08 Fontes e metodo.md`
- ` D` `docs/content/mapa-aulas/Radiant - Mapa das aulas.canvas`
- ` D` `docs/content/mapa-aulas/inventario.json`
- ` D` `docs/content/mapa-aulas/verificacao.json`
- ` D` `docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md`
- ` D` `docs/curriculum-v3/arco-1-l1-corpo-como-referencia.md`
- ` D` `docs/curriculum-v3/arco-1-l2-cortando-o-espaco.md`
- ` M` `docs/plans/2026-07-27-radiant-launch-roadmap.md`
- ` M` `docs/plans/2026-10-25-medalhao-execucao-subagentes.md`
- ` M` `docs/plans/2026-10-25-medalhao-pendencias-e-fechamento.md`
- ` D` `docs/runbooks/curriculum-v3-arco-1.md`
- ` D` `docs/superpowers/plans/2026-08-27-curriculum-v3-arco-1-l1.md`
- ` M` `docs/superpowers/plans/2026-08-27-curriculum-v3-foundation.md`
- ` D` `docs/superpowers/plans/2026-08-28-curriculum-v3-arco-1-l2.md`
- ` M` `docs/superpowers/plans/2026-10-21-aula-bancada.md`
- ` M` `docs/superpowers/plans/2026-10-21-trilha-medalhao-indice.md`
- ` M` `docs/superpowers/specs/2026-04-04-radiant-content-generation-system-design.md`
- ` M` `docs/superpowers/specs/2026-04-04-radiant-content-knowledge-framework-design.md`
- ` D` `docs/superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md`
- ` M` `docs/superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md`
- ` M` `docs/trilha/PROMPT-PARA-IAS.md`
- ` M` `docs/trilha/README.md`
- ` M` `radiant-api/README.md`
- ` D` `radiant-api/sql/002_seed_content.sql`
- ` D` `radiant-api/sql/003_seed_editorial_catalog.sql`
- ` M` `radiant-api/src/routes/content-contract.test.ts`
- ` M` `radiant-api/src/routes/content.test.ts`
- ` M` `radiant-app/.maestro/boot-to-home.yaml`
- ` M` `radiant-app/.maestro/config.yaml`
- ` D` `radiant-app/.maestro/first-run.yaml`
- ` D` `radiant-app/.maestro/g4-native-evidence.yaml`
- ` D` `radiant-app/.maestro/hybrid-native-evidence.yaml`
- ` D` `radiant-app/.maestro/learning-critical-path.yaml`
- ` D` `radiant-app/.maestro/offline-relaunch.yaml`
- ` D` `radiant-app/.maestro/radiant-1-4-primeira-execucao.yaml`
- ` D` `radiant-app/.maestro/radiant-1-4-segundo-dia.yaml`
- ` D` `radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml`
- ` D` `radiant-app/.maestro/rating-prompt.yaml`
- ` D` `radiant-app/.maestro/review-due.yaml`
- ` D` `radiant-app/.maestro/reward-locked.yaml`
- ` D` `radiant-app/.maestro/reward-unlock.yaml`
- ` D` `radiant-app/.maestro/store-capture.yaml`
- ` D` `radiant-app/.maestro/student-checkpoint-active-resume.yaml`
- ` D` `radiant-app/.maestro/student-checkpoint-no-duplicate-effect.yaml`
- ` D` `radiant-app/.maestro/student-checkpoint-performance-baseline.yaml`
- ` D` `radiant-app/.maestro/student-checkpoint-short-viewport.yaml`
- ` M` `radiant-app/docs/E2E_RUNBOOK.md`
- ` M` `radiant-app/scripts/copy-style-contract.mjs`
- ` M` `radiant-app/scripts/copy-style-contract.test.mjs`
- ` M` `radiant-app/scripts/maestro-contract.test.mjs`
- ` M` `radiant-app/src/app/licao-hibrida.tsx`
- ` D` `radiant-app/src/data/ai-catalog.ts`
- ` M` `radiant-app/src/data/ai-lessons.ts`
- ` M` `radiant-app/src/data/catalog.ts`
- ` M` `radiant-app/src/data/journey/defaultBlocks.ts`
- ` M` `radiant-app/src/data/journey/defaultTrack.ts`
- ` M` `radiant-app/src/data/lessons.ts`
- ` M` `radiant-app/src/features/bench/lessons/BenchLessonCatalog.test.ts`
- ` M` `radiant-app/src/features/bench/lessons/BenchLessonCatalog.ts`
- ` D` `radiant-app/src/features/bench/lessons/colimacao.ts`
- ` D` `radiant-app/src/features/bench/lessons/exposicao.ts`
- ` M` `radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx`
- ` M` `radiant-app/src/features/content/services/LessonCatalogService.test.ts`
- ` M` `radiant-app/src/features/content/services/LessonCatalogService.ts`
- ` M` `radiant-app/src/features/curriculum-v3/CurriculumV3Definition.test.ts`
- ` M` `radiant-app/src/features/curriculum-v3/CurriculumV3Definition.ts`
- ` M` `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.flow.test.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonSession.test.ts`
- ` M` `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonSession.ts`
- ` D` `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`
- ` D` `radiant-app/src/features/curriculum-v3/hybrid-l1/l1HybridLessonPlan.ts`
- ` D` `radiant-app/src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.test.ts`
- ` D` `radiant-app/src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.ts`
- ` D` `radiant-app/src/features/curriculum-v3/hybrid-l1/l1RelationTable.ts`
- ` D` `radiant-app/src/features/curriculum-v3/hybrid-l1/l1TemplateApproval.test.ts`
- ` D` `radiant-app/src/features/curriculum-v3/hybrid-l1/l1TemplateApproval.ts`
- ` M` `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.stories.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.test.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonSession.test.ts`
- ` M` `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonSession.ts`
- ` M` `radiant-app/src/features/curriculum-v3/l1-body-reference/l1BodyReference.types.ts`
- ` D` `radiant-app/src/features/curriculum-v3/l1-body-reference/l1BodyReferenceContent.test.ts`
- ` D` `radiant-app/src/features/curriculum-v3/l1-body-reference/l1BodyReferenceContent.ts`
- ` M` `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonPreview.stories.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonPreview.test.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonPreview.tsx`
- ` M` `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonSession.test.ts`
- ` M` `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonSession.ts`
- ` M` `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingGeometry.test.ts`
- ` M` `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingSpace.types.ts`
- ` D` `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingSpaceContent.test.ts`
- ` D` `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingSpaceContent.ts`
- ` M` `radiant-app/src/features/first-run/components/WelcomeSlide.test.tsx`
- ` M` `radiant-app/src/features/first-run/components/WelcomeSlide.tsx`
- ` M` `radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx`
- ` M` `radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx`
- ` M` `radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx`
- ` M` `radiant-app/src/features/journey/services/JourneyCatalogReachability.test.ts`
- ` M` `radiant-app/src/features/journey/services/JourneyDefinitionService.test.ts`
- ` M` `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx`
- ` M` `radiant-app/src/features/journey/services/JourneyProgressService.test.ts`
- ` M` `radiant-app/src/features/journey/services/JourneyRecommendationService.test.ts`
- ` M` `radiant-app/src/features/journey/services/TrailCoverage.test.ts`
- ` M` `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- ` M` `radiant-app/src/features/lesson-flow/services/LegacyLessonAdapter.test.ts`
- ` M` `radiant-app/src/features/lesson-flow/services/LessonFlowService.test.ts`
- ` M` `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts`
- ` M` `radiant-app/src/features/review/hooks/useReview.test.ts`
- ` M` `radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx`
- ` M` `radiant-app/src/features/spaced-repetition/services/ItemReviewService.test.ts`
- ` M` `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/AssessmentAttemptRepository.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/EditorialBatchContract.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/EditorialCurriculumCandidate.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/EditorialCurriculumCandidate.ts`
- ` M` `radiant-app/src/features/student-checkpoints/ProductionBatch.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/ProductionCurriculumCoverage.test.ts`
- ` M` `radiant-app/src/features/student-checkpoints/production-batches.ts`
- ` M` `radiant-app/src/features/student-checkpoints/production-catalog-entries.ts`
- ` M` `radiant-app/src/test/routes/licao-hibrida.test.tsx`
- ` M` `scripts/content/anchor-lesson.test.py`
- ` M` `scripts/content/audit-production-batches.mjs`
- ` M` `scripts/content/audit-production-batches.test.mjs`
- ` M` `scripts/content/catalog-runtime.mjs`
- ` M` `scripts/content/catalog-runtime.test.mjs`
- ` M` `scripts/content/classify-source.test.py`
- ` M` `scripts/content/foundation-structure.test.mjs`
- ` M` `scripts/content/generate-formats.test.py`
- ` D` `scripts/content/generate-local-bundles.py`
- ` M` `scripts/content/normalize-concepts.py`
- ` M` `scripts/content/normalize-concepts.test.py`
- ` M` `scripts/content/production-batch.test.mjs`
- ` M` `scripts/content/sync-catalog-to-api.mjs`
- ` M` `scripts/content/sync-catalog-to-api.test.mjs`
- ` M` `scripts/content/sync-catalog-to-app.mjs`
- ` M` `scripts/content/validate-competencies.test.mjs`
- ` M` `scripts/content/validate-content-anchoring.mjs`
- ` M` `scripts/content/validate-foundation.mjs`
- ` M` `scripts/content/validate-foundation.test.mjs`
- ` M` `scripts/content/validate-source-rights.test.mjs`
- ` M` `scripts/content/validate-taxonomy-map.mjs`
- ` M` `scripts/content/validate-taxonomy-map.test.mjs`
- ` M` `scripts/content/wave-1-priority-tracks.test.mjs`
- `??` `docs/adr/ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md`
- `??` `docs/design/2026-11-02-conteudo-radiant-storyboard.png`
- `??` `docs/evidence/2026-11-02-retirada-conteudo-radiant.md`
- `??` `docs/evidence/2026-11-02-retirada-conteudo/REQ-01-aulas-retiradas.md`
- `??` `docs/evidence/2026-11-02-retirada-conteudo/REQ-02-motores-preservados.md`
- `??` `docs/plans/2026-11-02-planejamento-conteudo-radiant.md`
- `??` `docs/research/2026-11-02-pesquisa-conteudo-radiant.md`
- `??` `radiant-app/src/data/curriculum-state.json`
- `??` `radiant-app/src/features/content/services/ContentRetirement.test.ts`
- `??` `radiant-app/src/test/fixtures/syntheticEditorialBatch.ts`
- `??` `radiant-app/src/test/fixtures/syntheticLessons.ts`
- `??` `radiant-app/src/test/fixtures/syntheticSpatialLessons.ts`
- `??` `scripts/content/curriculum-state.mjs`
- `??` `scripts/content/curriculum-state.test.mjs`
