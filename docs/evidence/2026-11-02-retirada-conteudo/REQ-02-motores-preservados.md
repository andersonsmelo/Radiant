## REQ-02 — Preservar motores, interface, biblioteca e dados do aluno

> Preservar motores genéricos, contratos/tipos, geometria, modelos físicos, renderizadores,
> UI Medalhão/Pixel/Sora, direitos, taxonomia, biblioteca de referência e extrações locais.
> Preservar economia, assinaturas, primeira resposta, retomada e schema guards. Não ler
> PDFs/extrações locais nem dados privados, não limpar/migrar AsyncStorage e não tocar
> o simulador reservado.
> — `docs/adr/ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md:L47-L51`

> A perda dos roteiros operacionais ligados às aulas antigas deve ficar explícita;
> não atribuir sua cobertura a um smoke de catálogo vazio.
> — mesma ADR, `L58-L59`

**Verdict:** implemented · confidence: high, no escopo estático descrito abaixo.

**Data:** 02/11/2026. Base de comparação: `34147e114de338a73a02ec68e8079c6bf3296c1d`.
Análise sobre a árvore de trabalho, sem commit de conclusão presumido.

**Execução e independência:** adaptação do checker por requisito do plugin
`spec-to-code-compliance`; o workflow hospedado não estava disponível e **não foi executado**.
Este agente implementou catálogos/fixtures do runtime, mas não implementou os motores
e apresentadores V3 nem as mudanças Maestro examinadas aqui. Esses são o foco independente.
A barreira de catálogo/AsyncStorage implementada por este agente pertence ao REQ-01;
seus testes não são apresentados aqui como revisão independente dessa barreira.

---

**What this demands of an implementation:** retirar definições curriculares sem
apagar os algoritmos e componentes que poderão consumir definições futuras;
não usar o desaparecimento do conteúdo para alegar preservação de cobertura nativa.
Preservação dos arquivos de referência e dos subsistemas existentes é verificada
por diferença contra a base, sem abrir a biblioteca nem dados privados.

**Where enforcement lives:**

| Caminho lido | Linhas | Resultado observado |
| --- | --- | --- |
| `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonSession.ts` | 28–92 | Busca no `lesson.challenges` recebido; erro para ID desconhecido; algoritmo de tentativa, apoio, recuperação nova, revisão e evidência permanece. Nenhum import de corpo de aula. |
| `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonSession.ts` | 30–136 | Definição recebida alimenta a busca e a continuação; recuperação direta/repetida/cenário repetido não demonstra domínio. Apoio após recuperação errada segue para o próximo objetivo e mantém dívida de revisão. |
| `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonSession.ts` | 48–141 | Recebe plano e fábrica de variante; mantém fila, primeira resposta, custo de vida, repetição, streak, tempos e resumo. A variante só é solicitada na primeira falha de desafio original. |
| `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.tsx` | 28–152 | Sem definição ou desafios mostra preparação; com definição monta sessão e componentes interativos. Seleção e confirmação permanecem separadas; exploração exige restaurar cenário antes de confirmar. |
| `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonPreview.tsx` | 39–110 | Sem definição ou desafios mostra preparação; com definição monta sessão/modelo, seleção, confirmação e continuação/revisão. |
| `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.tsx` | 22–33, 60–262 | Sem plano ou fábrica não monta a sessão; com ambos chama o motor e mantém portas de vidas/métricas, feedback, repetição, término e abandono. |
| `radiant-app/src/features/curriculum-v3/l1-body-reference/l1BodyReference.types.ts` | 55–66 | Identidade, título e versão aceitam strings; preserva estrutura de desafios/sequência. |
| `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingSpace.types.ts` | 67–79 | Mesma separação entre contrato reutilizável e definição removida. |
| `radiant-app/src/app/licao-hibrida.tsx` | 13–24 | Rota atual mostra preparação e saída; não inventa nova definição nem abre o piloto antigo. |

**Paths walked:**

- L1: `BodyReferenceLessonPreview` → guarda de definição → `BodyReferencePreview`
  → `createBodyReferenceLessonSession(lesson)` → busca/answer/requestHint/snapshot.
  Percorridos erro, acerto inicial, apoio, recuperação inédita, recuperação repetida
  e revisão após esgotar recuperação (`Session:L35-L92`).
- L2: `SlicingSpaceLessonPreview` → guarda → `SlicingSpacePreview`
  → `createSlicingSpaceLessonSession(lesson)` → answer/snapshot. Percorridos entrada
  direta em recuperação, tentativa independente, apoio necessário, recuperação
  repetida, cenário já visto e continuação após apoio (`Session:L36-L136`).
- Híbrido: `HybridLessonScreen` → guarda de plano/fábrica → `InjectedHybridLessonScreen`
  → `createHybridLessonSession`. Percorridos primeiro contato errado sem vida,
  desafio errado com variante, variante errada sem nova reinserção, resumo pela
  primeira resposta, vidas esgotadas e abandono (`Session:L48-L141`; `Screen:L65-L262`).
- As guardas de entrada opcional impedem conteúdo implícito; não tornam os motores
  inalcançáveis com definição explícita. Os testes independentes abaixo montam
  as três interfaces/sessões com dados sintéticos.

**Preservação por diferença:** existência dos oito arquivos abaixo conferida antes
de `git diff --quiet HEAD -- <arquivo>`; todos retornaram 0. Não se confundiu
caminho inexistente com arquivo preservado.

- `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceMap.tsx:L1-L108`
- `radiant-app/src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.ts:L1-L96`
- `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceModel.tsx:L1-L201`
- `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingGeometry.ts:L1-L190`
- `radiant-app/src/features/bench/exposureModel.ts:L1-L129`
- `radiant-app/src/features/bench/collimationModel.ts:L1-L103`
- `radiant-app/src/features/curriculum-v3/hybrid-l1/seededRandom.ts:L1-L22`
- `radiant-app/src/features/curriculum-v3/hybrid-l1/hybridItem.types.ts:L1-L43`

Também houve zero caminhos alterados, em `git diff --name-only HEAD --`, para:
`radiant-app/src/ui`, `radiant-app/src/storage`, `radiant-app/src/features/hearts`,
`radiant-app/src/features/subscription`, `radiant-app/src/features/lesson-flow/renderers`,
`radiant-app/src/features/lesson-flow/hooks`, `radiant-app/package.json`,
`radiant-app/package-lock.json`, `content-manifest/excerpts`, `conteúdo/fontes`,
`conteúdo/extrações`, `conteúdo/taxonomia`, `conteúdo/mídia`,
`conteúdo/governança/esquemas` e `scripts/content/source-rights-policy.json`.
Isso prova preservação versionada nesse diff; não é uma leitura dos arquivos
locais ignorados nem uma verificação do armazenamento de um aparelho.

---

**Maestro e perda de cobertura:**

- `git diff --name-only --diff-filter=D -- radiant-app/.maestro` retorna **17**
  roteiros retirados. O único fluxo descoberto agora é o shell.
- `radiant-app/.maestro/boot-to-home.yaml:L1-L17` declara no nome que não valida
  aulas e no comentário que não houve execução nativa. Só lança o app, dispensa
  superfícies iniciais e exige `journey-trail`.
- `radiant-app/scripts/maestro-contract.test.mjs:L439-L450` diz expressamente que
  contratos estáticos e smoke vazio não provam aulas; confere estado `retired`,
  descoberta/configuração limitada ao shell e ausência de deep link/toque didático.
- Guardas genéricas remanescentes foram lidas: glifos/AST e wrappers `L109-L216`,
  tema/cabeçalho/perfis `L219-L330`, prova datada por plataforma `L333-L354`,
  seletores/visibilidade `L357-L437` e parser sintético `L452-L455`.
  Não existe equivalência atribuída entre esses checks e os 17 fluxos removidos.

**Searched:**

- `createBodyReferenceLessonSession|createSlicingSpaceLessonSession|createHybridLessonSession`
  no `radiant-app/src`, excluídos testes: três fábricas e seus três apresentadores;
  os chamadores recebem/injetam definições, sem import de corpo antigo.
- `HybridLessonScreen|BodyReferenceLessonPreview|SlicingSpaceLessonPreview` em
  `radiant-app/src/features/dev-console`, `radiant-app/src/app` e
  `radiant-app/.rnstorybook`: **0 hits**. Busca geral encontrou as stories de
  preparação e exports internos, não um publicador de conteúdo no app do aluno.
- `AsyncStorage|clear|removeItem|setItem|delete|migration|curriculumState` nos seis
  motores/apresentadores: **2 hits**, ambos `setItem(session.current())` de estado
  React em `HybridLessonScreen:L69,L154`; nenhum acesso direto ao storage.
  A porta de métricas/vidas continua explícita em `HybridLessonScreen:L65-L149`.
- `git diff --name-only HEAD --` nos conjuntos de biblioteca/UI/storage acima:
  **0 caminhos**. Não foram abertos PDFs, páginas extraídas nem dados pessoais.

**Evidência executada pelo revisor:** Node **20.20.2**, `jest --runInBand --silent`
sobre dez suítes: sessões L1/L2/híbrida, previews L1/L2/tela híbrida, mapa/geometria
L1 e modelo/geometria L2. **10/10 suítes, 157/157 testes, 0 snapshots, 0 skips**,
2,794 s; resultado local `/tmp/radiant-req02-targeted.json`.
`node --test scripts/maestro-contract.test.mjs`: **11/11**, 0 skips; 375,6455 ms.
Esses são testes focados de preservação e contratos; não constituem o gate final
`EXPO_NO_DOTENV=1 npm run quality` nem prova de execução Maestro.

---

**How the verdict was reached:** os algoritmos não foram substituídos por retornos
vazios. O vazio pertence às entradas de conteúdo; a injeção explícita percorre
os motores e interfaces preservados e foi exercitada pelo revisor. Os componentes
geométricos, modelos, UI/economia e referências enumeradas não mudaram. A perda
de cobertura nativa está expressa no shell e no contrato atual. Por isso o veredito
é `implemented`, com os limites de independência e plataforma acima.

**Divergences / documentProblem — P2 detectado e corrigido:** na primeira leitura,
o runbook `radiant-app/docs/E2E_RUNBOOK.md:L69-L83,L410-L415` ainda descrevia o
workspace e receitas com fluxos excluídos. Os relatos datados não eram falsos;
a apresentação como receita atual era deriva documental. O achado foi encaminhado
ao integrador, que confirmou e corrigiu o documento. Esta releitura é independente
da autoria da correção e preserva o achado inicial, sem apagá-lo retroativamente.

Na versão corrigida de `radiant-app/docs/E2E_RUNBOOK.md`, lida em 02/11/2026:

- `L3-L22` delimita o checkout retirado e nega equivalência entre smoke e aulas,
  revisão, economia, retomada, avaliação da loja ou segundo dia;
- `L24-L38` contém **uma** receita atual: `maestro --device
  <dedicated-authorized-udid> test .maestro/boot-to-home.yaml`, em `L33`;
  não autoriza build, instalação, limpeza ou destino reservado;
- `L40-L54` enumera os **17** fluxos retirados e diz que não são comandos
  disponíveis, exigindo roteiros novos para o lote futuro;
- `L67-L71` separa o histórico e remete ao runbook anterior no SHA
  `34147e114de338a73a02ec68e8079c6bf3296c1d`; as medições posteriores exibidas
  sob essa seção permanecem limitadas a seus SHAs e ambientes.

O achado P2 do runbook está **addressed**. Não houve destruição de motor nem nova
aprovação E2E. A validação configurada final continua pendente do integrador.
Após a correção, o revisor repetiu somente `node --test
scripts/maestro-contract.test.mjs` no Node20: **11/11 PASS**, 0 skips,
830,912625 ms. Essa repetição não executa os YAMLs no aparelho.

Também foi lida a correção correlata em `radiant-api/README.md:L126-L141`: lista
somente schema/migração preservados, registra exclusão dos seeds sem SQL e explica
que linhas já existentes em servidor não foram apagadas. Na primeira releitura,
duas frases residuais da introdução (`L41` e `L56-L57`) ainda contradiziam a
retirada dos seeds e a fonte de estado canônico; foram encaminhadas ao integrador.
A segunda releitura confirmou ambas corrigidas: `L41` declara schema/contratos
preservados, seeds retirados sem alteração de banco e recusa de catálogo remoto
pelo app retirado; `L43` qualifica o estado de agosto como histórico; `L56-L57`
remete ao único estado vivo, `docs/STATUS.md`. Complemento documental **addressed**.
Não se executou migração nem se inferiu disponibilidade atual da API por essa leitura.

**Open questions / notChecked:**

- Não executados simulador, dispositivo, leitor de tela, FPS, build, EAS, OTA,
  release ou fluxos Maestro; nenhuma dessas provas decorre dos testes acima.
- Não auditada troca de definição por props no meio da mesma sessão montada;
  a verificação cobre injeção explícita inicial, não hot reload de um curso.
- Não auditada correção clínica/física integral dos modelos preservados; foram
  comparados com a base e exercitados por suas regressões existentes.
- Não lidos arquivos privados/ignorados da biblioteca ou containers do aluno;
  preservação desses bytes não foi remensurada por esta análise.
- Barreiras e testes escritos pelo próprio revisor no runtime não recebem selo
  independente neste registro. REQ-01 e gate final são evidências separadas.
