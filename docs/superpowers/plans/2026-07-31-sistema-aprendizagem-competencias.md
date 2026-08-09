# Sistema de aprendizagem por competências — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Entregar uma primeira unidade de Fundamentos e Segurança com atividades visuais, domínio por competência, revisão posterior e Galáxia alimentada pela jornada canônica.

**Architecture:** Um contrato de atividade v2 amplia o player por meio de renderizadores registrados, preservando um adaptador para os blocos legados. Tentativas estruturadas alimentam domínio e repetição por competência; catálogo, jornada e Galáxia passam a compartilhar a mesma definição. O pipeline editorial valida fontes, mídia, direitos e revisão antes de promover o corte vertical.

**Tech Stack:** React Native / Expo, TypeScript, Jest + `@testing-library/react-native`, AsyncStorage, Node.js 24, JSON Schema, scripts Node do pipeline editorial, Maestro para E2E em device.

**Spec:** [`docs/superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md`](../specs/2026-07-31-sistema-aprendizagem-competencias-design.md)

**Spec de emenda (Task 11):**
[`docs/superpowers/specs/2026-08-08-agendador-por-competencia-design.md`](../specs/2026-08-08-agendador-por-competencia-design.md)
— fecha o algoritmo do agendador por competência, que esta spec deixara em
aberto, e registra o teto de domínio medido no currículo.

**Status:** em execução desde 2026-07-31. Tasks 1, 2, **4** a **9** e **11**
concluídas; infraestrutura da Task 3 concluída, aguardando o primeiro lote de
ativos autorizados. Próxima: **Task 10** (primeiro conjunto de jogos acessíveis)
— é ela que registra os sete tipos de interação que ainda não têm renderizador.

> **A Task 11 fechou fora de ordem, em 2026-08-09**, pelo plano delegado
> [`2026-08-08-agendador-por-competencia.md`](2026-08-08-agendador-por-competencia.md)
> (commits `1ac9a1e..adb5e63`). Ela pôde adiantar-se à Task 10 porque não depende
> de conteúdo v2: o agendador entra **desligado** e acende quando houver o que
> agendar.
>
> Duas consequências para quem retomar:
>
> 1. **O agendador está pronto e não tem o que agendar.** `getDue` não tem
>    chamador de produção, e todo nó ainda resolve para competência legada
>    sintética. Ligar o lado de leitura antes da Task 10 recomendaria revisão de
>    competência que o currículo não reconhece.
> 2. **Um achado ficou deferido com decisão registrada** —
>    `temFormaDeCartao` aceita `NaN` em campo numérico. Está descrito no plano
>    delegado e é o primeiro item de quem voltar ao subsistema.

*A Task 4 não dependia do lote de mídia: o gate da Fase 0 pede "zero mídia sem
decisão de direitos" e "currículo com 30 competências válido" como condições
irmãs do mesmo gate, não como etapas em sequência.*

**Evidência atual:** `library-catalog.json` registra 41 PDFs, 36 fontes únicas e
5 duplicatas; direitos = 4 `authorized`, 15 `reference-only`, 17 `blocked`.
`media-manifest.json` está `awaiting-authorized-assets`, com 0 itens aprovados e
5 candidatos rejeitados.

---

## 0. Restrições globais

- Cada task material usa um run Loop próprio ou um run com escopo explicitamente
  declarado; nunca editar antes de `loop step begin`.
- A Task 1 altera somente `.loop/project.yaml` e fecha antes de qualquer escrita
  que ela venha a autorizar.
- Preservar as 18 atividades legadas durante toda a migração.
- Não editar arquivos gerados (`ai-lessons.ts`, `ai-catalog.ts`, `catalog.ts`)
  manualmente; usar os scripts de sync.
- Não copiar texto ou imagem de livro comercial. Fonte `reference-only` permite
  conferência factual e redação original, não reprodução.
- Nenhuma imagem entra sem manifesto de autorização e anonimização.
- Nenhuma escrita de domínio ou sync pode impedir a saída da lição.
- Vidas não bloqueiam estudo. Não adicionar novos call sites de `loseHeart` ou
  `canStartLesson`.
- Cada atividade precisa de alternativa acessível sem drag obrigatório e sem
  depender exclusivamente de cor.
- Não mudar o binário do closed test sem tratar a alteração como novo ciclo de
  release e repetir os gates aplicáveis.

## 1. Reconciliação requisito → capacidade

| Capacidade | Estado atual | Tratamento |
| --- | --- | --- |
| catálogo local-first | funcional | preservar |
| progresso/desbloqueio | funcional em `JourneyProgressService` | preservar |
| XP, sequência e meta | funcional via `LessonOutcomeService` | estender para evidência v2 |
| SM-2 | cartão por lição | estender gradualmente para competência |
| player | 5 tipos, 1 múltipla escolha por bloco | estender com atividade v2 |
| conteúdo | `QuizLesson` universal | substituir por `LearningActivity` com adaptador |
| domínio | acurácia por tentativa/unidade | criar estado por competência |
| Galáxia | árvore e status estáticos | substituir por projeção canônica |
| mídia clínica | imagem local ad hoc | criar manifesto autorizado |
| direitos das fontes | não catalogados para a nova biblioteca | criar governança |
| revisão por lote | processo editorial existente, sem unidade v2 | estender |
| jogos | inexistentes como contratos | criar biblioteca de renderizadores |

## 2. Gates por fase

| Fase | Gate de saída |
| --- | --- |
| 0 — governança | 36 PDFs únicos classificados; zero mídia sem decisão de direitos; currículo com 30 competências válido |
| 1 — motor | legado verde; contrato v2 e quatro interações acessíveis; domínio persistente; Galáxia sem estado fictício |
| 2 — corte vertical | 5 competências, 10–12 sessões e checkpoint aprovados pelo revisor |
| 3 — beta | evidência de checkpoint e revisão posterior; P0/P1 pedagógico ou de a11y igual a zero |
| 4 — expansão | cada unidade aprovada individualmente; no máximo um novo tipo de interação por lote |

---

### Task 1: Autorizar raízes editoriais necessárias em transação separada — CONCLUÍDA

**Files:**
- Modify: `.loop/project.yaml`

**Step 1: Verificar o bloqueio atual**

Run:

```bash
loop run start --task "Autorizar manifestos de fontes e midia do sistema educacional v2"
```

Tentar declarar `conteúdo/fontes/library-catalog.json` e
`conteúdo/mídia/manifest.json`. Expected: a raiz de mídia e/ou fontes é recusada
pela política atual. Não criar os arquivos neste run.

**Step 2: Iniciar novo run somente para a política**

Declarar apenas `.loop/project.yaml` e adicionar exatamente:

```yaml
    - conteúdo/fontes
    - conteúdo/mídia
```

**Step 3: Validar a política**

Run: `loop validate --run <policy-run-id>`

Expected: todos os validadores PASS e nenhum arquivo fora da política alterado.

**Step 4: Fechar o run**

Executar `loop step finish` e `loop run close`. Somente um novo run pode usar as
raízes autorizadas.

**Step 5: Commit**

```bash
git add .loop/project.yaml
git commit -m "chore(loop): autoriza governanca de fontes e midia educacional"
```

---

### Task 2: Catalogar fontes, duplicatas e direitos — CONCLUÍDA

**Files:**
- Create: `scripts/content/catalog-library-sources.mjs`
- Test: `scripts/content/catalog-library-sources.test.mjs`
- Create: `conteúdo/governança/esquemas/library-source.schema.json`
- Create: `conteúdo/fontes/library-catalog.json`
- Modify: `scripts/content/validate-foundation.mjs`
- Test: `scripts/content/validate-foundation.test.mjs`

**Step 1: Escrever testes vermelhos**

Cobrir: SHA-256 obrigatório; detecção de duplicata; `rightsClass` limitado a
`authorized`, `reference-only`, `blocked`; edição/data/licença; e proibição de
`commercialUse: true` quando a licença é não comercial.

Run:

```bash
node --test scripts/content/catalog-library-sources.test.mjs scripts/content/validate-foundation.test.mjs
```

Expected: FAIL porque catálogo e schema ainda não existem.

**Step 2: Implementar o gerador determinístico**

O script lê somente metadados e hashes, nunca copia texto. A saída possui uma
entrada por hash e `duplicatePaths` para os cinco pares idênticos.

**Step 3: Preencher decisões humanas**

Classificar os 36 documentos únicos. Obras comerciais começam como
`reference-only`; licença incerta começa como `blocked`; nenhuma inferência de
permissão pelo nome do arquivo.

**Step 4: Rodar os testes e o foundation gate**

```bash
node --test scripts/content/catalog-library-sources.test.mjs scripts/content/validate-foundation.test.mjs
node scripts/content/validate-foundation.mjs
```

Expected: PASS e resumo `uniqueSourceCount: 36`, `duplicateFileCount: 5`.

**Step 5: Commit**

```bash
git add scripts/content conteúdo/fontes conteúdo/governança/esquemas
git commit -m "feat(content): governa fontes e direitos da biblioteca"
```

---

### Task 3: Criar manifesto seguro de mídia educacional — INFRAESTRUTURA CONCLUÍDA; LOTE PENDENTE

O schema, o manifesto e os validadores foram entregues. Os cinco arquivos
candidatos encontrados não satisfazem o contrato de finalidade educacional,
direitos e/ou ausência de dados pessoais; por isso, o manifesto foi fechado com
0 itens e estado `awaiting-authorized-assets`. Esta task só é considerada
integralmente concluída quando um lote autorizado passar pelo mesmo gate.

**Files:**
- Create: `conteúdo/governança/esquemas/media-manifest.schema.json`
- Create: `conteúdo/mídia/manifest.json`
- Create: `scripts/content/validate-media-manifest.mjs`
- Test: `scripts/content/validate-media-manifest.test.mjs`
- Modify: `scripts/content/validate-foundation.mjs`

**Step 1: Escrever o contrato vermelho**

Cada item requer `id`, `assetPath`, `sha256`, `modality`, `region`,
`authorizationRef`, `anonymization.status=verified`, descrição acessível e, se
aplicável, hotspots normalizados entre 0 e 1. Rejeitar nome de paciente,
prontuário, data de nascimento e campos DICOM livres.

**Step 2: Rodar o teste**

Run: `node --test scripts/content/validate-media-manifest.test.mjs`

Expected: FAIL porque o validador não existe.

**Step 3: Implementar validação por allowlist**

O validador reporta apenas caminho, regra e contagem; nunca imprime metadado ou
texto suspeito.

**Step 4: Registrar o primeiro lote autorizado**

Não mover arquivos originais. O manifesto referencia apenas derivados já
anonimizados e autorizados para a Unidade 1.

**Step 5: Validar e commit**

```bash
node --test scripts/content/validate-media-manifest.test.mjs
node scripts/content/validate-media-manifest.mjs
git add scripts/content conteúdo/mídia conteúdo/governança/esquemas
git commit -m "feat(content): valida midia autorizada e anonimizada"
```

---

### Task 4: Versionar o currículo e o grafo de competências — CONCLUÍDA

**Concluída em 2026-08-01.** Medido pelo próprio validador: `unitCount: 6`,
`competencyCount: 30`, `cycleCount: 0`, `rootCount: 2`, `orphanCount: 0`,
`criticalSafetyCount: 10`. Dezessete testes passam e os nove validadores do Loop
fecharam verdes no run que entregou o trabalho.

Três decisões que o plano não fixava e que ficam registradas aqui:

- **`order` e `prerequisiteIds` são independentes.** O primeiro é a rota
  recomendada de estudo, o segundo é a dependência conceitual. A spec já
  autorizava misturar unidades em revisões, então tratar a ordem como se fosse a
  dependência engessaria exatamente o que a trilha espiral precisa fazer. O grafo
  tem **duas raízes** (`atribuicoes-e-limites` e `estrutura-atomica-e-ionizacao`)
  por consequência disso, e não por omissão.
- **Objetivo observável é validado por lista de recusa, não de permissão.** Uma
  lista de permissão teria de crescer a cada unidade nova e reprovaria verbo
  legítimo por omissão; o conjunto de verbos de estado interno (`entender`,
  `saber`, `conhecer`, `compreender`) é pequeno e estável. O verbo pode vir
  seguido de vírgula — objetivos compostos como "registrar, comunicar e escalar"
  são a redação da própria spec, e a primeira versão do validador os reprovava.
- **`criticalSafety` carrega o critério junto.** O arquivo declara
  `criticalSafetyCriterion` no topo, porque a marcação governa a regra de
  checkpoint "nenhum erro crítico de segurança" e, sem o critério escrito, cada
  revisor aplicaria um limiar diferente. São **10 de 30** competências marcadas:
  as cinco de Proteção Radiológica, quatro da Unidade 1 e o equilíbrio entre
  qualidade, repetição e exposição da Unidade 5.

*O gate da Fase 0 pede "currículo com 30 competências válido" ao lado da decisão
de direitos de mídia — são condições irmãs do mesmo gate, não etapas em
sequência. Esta task não dependia do primeiro lote de mídia autorizada.*

**Files:**
- Create: `conteúdo/governança/esquemas/competency.schema.json`
- Create: `conteúdo/governança/foundations-safety-competencies.json`
- Create: `scripts/content/validate-competencies.mjs`
- Test: `scripts/content/validate-competencies.test.mjs`
- Modify: `scripts/content/validate-foundation.mjs`

**Step 1: Escrever testes vermelhos**

Exigir 6 unidades, 5 competências por unidade, ids únicos, objetivo observável,
pré-requisitos existentes, ausência de ciclos, `criticalSafety` explícito e ao
menos um método de evidência por competência.

**Step 2: Rodar o teste**

Run: `node --test scripts/content/validate-competencies.test.mjs`

Expected: FAIL por arquivos ausentes.

**Step 3: Implementar schema, grafo e validador**

Transcrever as 30 competências da spec sem introduzir novo escopo clínico.

**Step 4: Validar**

```bash
node --test scripts/content/validate-competencies.test.mjs
node scripts/content/validate-competencies.mjs
node scripts/content/validate-foundation.mjs
```

Expected: PASS, `unitCount: 6`, `competencyCount: 30`, `cycleCount: 0`.

**Step 5: Commit**

```bash
git add scripts/content conteúdo/governança
git commit -m "feat(content): define curriculo por competencias"
```

---

### Task 5: Introduzir o contrato `LearningActivityV2` — CONCLUÍDA

**Concluída em 2026-08-01.** 18 testes novos passam e a suíte inteira de
`lesson-flow` fecha em **38 testes, 3 suítes** — o caminho legado continua com o
mesmo comportamento, validado por exceção e com a regra de exatamente uma
múltipla escolha por bloco.

Quatro decisões que o plano não fixava:

- **A validação v2 devolve lista; a legada continua lançando.** Conteúdo
  educacional é revisado em lote antes da promoção, e um validador que lança na
  primeira violação esconde as outras vinte do revisor. O formato `{ path, rule }`
  é o mesmo dos validadores em `scripts/content/`, para que uma violação
  signifique a mesma coisa dos dois lados do pipeline editorial.
- **`EvidenceKind` reusa o vocabulário exato do grafo de competências.** Se o app
  e o conteúdo divergirem nesses quatro nomes, a evidência produzida deixa de
  casar com o domínio medido — e a divergência apareceria só ao calcular
  domínio, tarde demais.
- **Coordenadas de `hotspot` e `risk-hunt` usam a mesma regra normalizada do
  manifesto de mídia** (0–1, com `x+width ≤ 1`). São o mesmo conceito em dois
  lugares do pipeline; duas definições divergiriam no primeiro asset recortado.
- **`correctOrder` precisa ser permutação exata dos itens.** Uma ordem que
  repete ou omite item aceita mais de uma resposta "certa", e aí a evidência
  registrada deixa de significar alguma coisa sobre o aluno.

*O contrato v2 ainda não tem consumidor no player — isso é a Task 6 (adaptador do
legado) e a Task 9 (registro de renderizadores). Introduzir o contrato antes do
consumidor é a ordem do plano, e não um descuido: é o contrato que permite as
duas tasks seguintes rodarem sem reescrever o catálogo.*

**Files:**
- Create: `radiant-app/src/types/learningActivity.ts`
- Modify: `radiant-app/src/types/lessonFlow.ts`
- Modify: `radiant-app/src/features/lesson-flow/services/LessonFlowService.ts`
- Test: `radiant-app/src/features/lesson-flow/services/LessonFlowService.test.ts`

**Step 1: Escrever o teste vermelho**

Testar união discriminada para `multiple-choice`, `hotspot`, `comparison`,
`matching`, `ordering`, `parameter-lab`, `risk-hunt` e `case-decision`; 3–6
passos; 1–4 interações; ids únicos; competência e evidência obrigatórias;
feedback obrigatório; hotspot normalizado.

**Step 2: Rodar o teste focado**

```bash
cd radiant-app
EXPO_NO_DOTENV=1 CI=1 npx jest src/features/lesson-flow/services/LessonFlowService.test.ts --runInBand
```

Expected: FAIL porque `LearningActivityV2` não existe.

**Step 3: Implementar contrato e validação pura**

Exportar `validateLearningActivity(activity): ValidationIssue[]`. Manter
`LessonBlock` e a validação legada sem mudança de comportamento.

**Step 4: Rodar testes do player**

```bash
EXPO_NO_DOTENV=1 CI=1 npx jest src/features/lesson-flow --runInBand
```

Expected: PASS para legado e v2.

**Step 5: Commit**

```bash
git add radiant-app/src/types radiant-app/src/features/lesson-flow/services
git commit -m "feat(learning): define contrato de atividade v2"
```

---

### Task 6: Adaptar blocos legados sem reescrever o catálogo — CONCLUÍDA

**Concluída em 2026-08-02.** 12 testes novos; `lesson-flow` fecha em **50 testes,
4 suítes**, e a paridade de fluxos (`npm run test:flows`) passa em **6 suítes, 15
testes, sem atualizar snapshot algum**. Os quatro blocos reais do catálogo
adaptam sem uma violação sequer, cada um preservando o número e a ordem das telas.

Três decisões que o plano não fixava, e uma correção de escopo:

- **A competência do conteúdo legado é sintética, com prefixo
  `competency:legacy:`.** Lição antiga não foi escrita contra o currículo, então
  não se sabe qual competência ela mede. Atribuir uma competência real inventaria
  um dado que depois contamina o cálculo de domínio — e contaminaria de forma
  invisível, porque o número sairia plausível. O prefixo mantém a evidência
  rastreável e separável.
- **`criticalSafety` do legado é `false`, não indefinido.** Conteúdo legado nunca
  passou por classificação de segurança. `true` inventaria criticidade e
  indefinido violaria a exigência de o campo ser explícito.
- **`reinforce` e `advance` viram ambos `closing`.** Um papel v2 por tipo legado
  faria o contrato novo espelhar o que ele veio substituir. O que se perderia na
  fusão — o `tone` do reforço e a imagem do `teach` — foi preservado como campo
  opcional da apresentação, então nenhuma informação de renderização se perde.
- **Correção de escopo:** a task também alterou `src/types/learningActivity.ts`,
  que o plano não listava. Foram duas mudanças que só a chegada do legado
  revelou: `EvidenceKind` ganhou `legacy-lesson-recall` **separado** dos quatro
  métodos do currículo (via `AuthoredEvidenceKind`, que segue espelhando o grafo),
  e o corpo da apresentação virou opcional, porque o contrato legado permite uma
  tela de `advance` só com título.

**O adaptador é fiel, não corretivo.** Um bloco legado de dois passos — que o
contrato legado permite e o v2 não — sai com dois passos e é reprovado pelo
validador. Há teste para isso. Preencher o buraco faria passar escondendo a
incompatibilidade exatamente onde ela precisa aparecer.

**Files:**
- Create: `radiant-app/src/features/lesson-flow/services/LegacyLessonAdapter.ts`
- Test: `radiant-app/src/features/lesson-flow/services/LegacyLessonAdapter.test.ts`
- Modify: `radiant-app/src/features/lesson-flow/services/LessonFlowService.ts`

**Step 1: Escrever testes vermelhos**

Converter cada tipo legado, preservar ids, resposta correta, explicação e
`lessonId`, e marcar evidência antiga como `legacy-lesson-recall`. Uma atividade
adaptada deve produzir o mesmo número e ordem de telas que o bloco original.

**Step 2: Verificar o vermelho**

Run: `cd radiant-app && npx jest src/features/lesson-flow/services/LegacyLessonAdapter.test.ts --runInBand`

**Step 3: Implementar adaptador puro**

Não ler storage nem catálogo dentro do adaptador.

**Step 4: Rodar paridade**

Run: `cd radiant-app && npm run test:flows -- --runInBand`

Expected: PASS sem atualizar snapshots para esconder diferença.

**Step 5: Commit**

```bash
git add radiant-app/src/features/lesson-flow/services
git commit -m "feat(learning): adapta licoes legadas ao motor v2"
```

---

### Task 7: Registrar evidência por interação — CONCLUÍDA

**Concluída em 2026-08-02.** 15 testes no repositório e 5 na integração; `npm run
quality` fecha em **38 suítes e 167 testes**, contra 117 antes da Task 5.

**A proteção de privacidade é estrutural antes de ser verificação.** A spec proíbe
registrar resposta livre, imagem clínica ou identificador de paciente. A defesa
principal não é uma varredura de conteúdo: é que **não existe campo para prosa**.
Os nove campos da allowlist são ids com forma fixa, enums e um timestamp ISO — uma
resposta escrita pelo aluno não tem onde caber, mesmo que alguém tente enfiá-la.
A varredura de URI e de marcador clínico é a segunda camada, para o caso de um id
ser construído a partir de dado que não deveria estar ali.

Três decisões que o plano não fixava:

- **Escrita recusa, infraestrutura engole.** Registro inválido não é gravado e a
  chamada devolve as violações — gravar primeiro e limpar depois significaria que
  o dado proibido existiu em disco, e num app local-first "depois" pode ser
  nunca. Já falha de AsyncStorage vira log e não propaga, porque evidência é
  informação secundária e não pode derrubar a conclusão de uma lição.
- **A validação roda também na leitura.** Um registro pode ter vindo de uma versão
  anterior do contrato ou de escrita manual; ler sem revalidar reintroduziria
  exatamente o que a escrita recusou.
- **Duração é faixa, nunca milissegundo.** Tempo exato de resposta é traço
  comportamental fino demais para o valor que entrega; a faixa basta para
  distinguir reconhecimento imediato de esforço, que é a única leitura que o
  domínio faz dela. Quando o player não mede, grava `unknown` — o registro
  honesto de "não medido", nunca um valor plausível inventado.

*Correção de escopo:* a task também alterou `src/constants/storageKeys.ts`, que o
plano não listava, para a chave versionada do repositório.

*A competência e o tipo de evidência vêm do **adaptador** da Task 6, não de uma
segunda leitura do bloco. Derivar isso aqui de novo criaria uma segunda definição
da mesma regra, e as duas divergiriam no dia em que o catálogo tivesse atividade
v2 nativa.*

**Files:**
- Create: `radiant-app/src/types/learningEvidence.ts`
- Create: `radiant-app/src/features/mastery/repositories/LearningEvidenceRepository.ts`
- Test: `radiant-app/src/features/mastery/repositories/LearningEvidenceRepository.test.ts`
- Modify: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts`
- Test: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts`

**Step 1: Escrever testes vermelhos**

Contrato permitido: ids, competência, `evidenceKind`, resultado, dica usada,
faixa de duração, versão e timestamp. Rejeitar texto livre, URI clínica,
metadado de imagem e chaves fora da allowlist. Teto de 1.000 registros com
remoção dos mais antigos.

**Step 2: Rodar os testes focados**

```bash
cd radiant-app
npx jest src/features/mastery/repositories/LearningEvidenceRepository.test.ts src/features/lesson-flow/services/LessonOutcomeService.test.ts --runInBand
```

**Step 3: Implementar repositório e integração**

Persistir em chave versionada. Falha de storage gera log e não bloqueia
`markNodeCompleted`.

**Step 4: Validar regressão**

Run: `cd radiant-app && npm run quality`

**Step 5: Commit**

```bash
git add radiant-app/src/types radiant-app/src/features/mastery radiant-app/src/features/lesson-flow
git commit -m "feat(mastery): registra evidencias estruturadas"
```

---

### Task 8: Calcular domínio por competência — CONCLUÍDA

**Concluída em 2026-08-02.** 20 testes no cálculo e 8 no repositório; `npm run
quality` fecha em **40 suítes e 195 testes**.

`calculateCompetencyMastery` é pura e determinística: não lê relógio, não lê
storage, não conhece catálogo. Isso não é purismo — é o que torna uma regra
pedagógica auditável. Sem relógio interno, o mesmo conjunto de evidências sempre
produz o mesmo estado, e discordar do resultado vira discutir os limiares em vez
de caçar não-determinismo.

**A decisão que a task existia para forçar:** evidência legada é **ignorada por
padrão**. Marcá-la de forma separável na Task 6 serviu exatamente para isto —
lição antiga não foi escrita contra o currículo, então sua evidência não sabe
qual competência mede, e somá-la produziria um número plausível e errado. O pior
tipo de erro, porque não parece errado. Contá-la exige `includeLegacyEvidence`
explícito, nunca um default.

Quatro decisões de modelo:

- **Pontua tipos distintos de evidência, não tentativas.** Repetir a mesma
  prática dez vezes não demonstra mais domínio que fazê-la uma vez; evidência
  nova vem de mudar o tipo de demanda. Pesos: guiada 0,15 · independente 0,30 ·
  aplicação 0,25 · retenção 0,30. Guiada pesa menos porque acertar com apoio
  demonstra menos que recuperar sozinho depois de um intervalo.
- **Bloqueio nunca promove.** Os gates só puxam para baixo. Estado alto só se
  alcança acumulando evidência de tipos diferentes.
- **O gate crítico de segurança é assimétrico de propósito.** Erro recente numa
  competência comum rebaixa **um nível**; numa competência crítica, **trava em
  `practicing`**. Errar sobre blindagem não é o mesmo que errar sobre um
  conceito, e o checkpoint da unidade depende dessa distinção.
- **`blockedBy` viaja no resultado.** A spec proíbe que o algoritmo esconda do
  aluno por que algo não avançou; sem esse campo, o motivo existiria só dentro da
  função.

*Migração vazia:* ausência significa `not-started`, e o repositório lê **apenas a
própria chave** — há teste para isso. Nada infere domínio a partir de XP, nó
concluído ou sequência, coerente com o ADR de progresso não retroativo.

*Correção de escopo:* mais uma chave em `src/constants/storageKeys.ts`, que o
plano não listava.

*Cuidado de ponto flutuante que virou defeito real durante a implementação:*
`0,15 + 0,30 + 0,25` sai `0,6999999999999999` em JS e reprovava no limiar de
`0,7` um percurso que deveria aprovar. Apareceria como "às vezes não sobe de
nível". A soma é arredondada a três casas.

**Files:**
- Create: `radiant-app/src/types/mastery.ts`
- Create: `radiant-app/src/features/mastery/services/CompetencyMasteryService.ts`
- Test: `radiant-app/src/features/mastery/services/CompetencyMasteryService.test.ts`
- Create: `radiant-app/src/features/mastery/repositories/CompetencyMasteryRepository.ts`
- Test: `radiant-app/src/features/mastery/repositories/CompetencyMasteryRepository.test.ts`

**Step 1: Escrever a matriz de testes**

Cobrir os cinco estados, pesos de guiada/independente/aplicação/retenção,
degradação por erro recente, bloqueio de `mastered` sem retenção e gate crítico
de segurança.

**Step 2: Rodar o vermelho**

Run: `cd radiant-app && npx jest src/features/mastery --runInBand`

**Step 3: Implementar função determinística**

`calculateCompetencyMastery(evidence[])` não acessa relógio nem storage; datas e
limiares entram como parâmetros.

**Step 4: Implementar repositório versionado e testar migração vazia**

Usuários legados começam `not-started`; não inferir domínio por XP ou nó
concluído.

**Step 5: Validar e commit**

```bash
cd radiant-app && npm run quality
git add src/types src/features/mastery
git commit -m "feat(mastery): calcula dominio por competencia"
```

---

### Task 9: Criar registro de renderizadores e estado do player — CONCLUÍDA

**Concluída em 2026-08-02.** 16 testes novos; `npm run quality` fecha em **42
suítes e 211 testes**, e a paridade de fluxos em 6 suítes / 15 testes.

**A evidência mais forte é o que não mudou:** o `LessonFlowScreen.flow.test.tsx`
passou **sem uma linha alterada**. Ele trava troca de alternativa antes de
confirmar, revelação do reforço, ordem entre `recordCompletion` e
`markNodeCompleted`, e o uso da resposta confirmada quando o passo interativo é o
último. O refactor atravessou tudo isso sem tocar no teste.

Três decisões de risco:

- **O bloco legado continua sendo o que vai para o outcome.** A atividade v2
  existe na tela para o percurso e para a interação; trocar o que o outcome
  recebe mexeria no caminho que paga XP e agenda revisão, e isso não pertence a
  uma task de desacoplamento de UI. Os ids batem porque o adaptador os preserva.
- **Apresentação continua nos renderizadores existentes, pelo passo legado
  alinhado por índice.** A copy do painel distingue `reinforce` de `advance`, e o
  v2 funde os dois em `closing` — renderizar a apresentação pelo v2 mudaria a
  copy, que a task proíbe. O alinhamento 1:1 é garantido pelo adaptador e tem
  teste.
- **Tipo sem renderizador não derruba a lição.** Conteúdo é versionado
  separadamente do app, então um binário antigo pode encontrar um tipo que não
  conhece. Lançar perderia a sessão inteira por causa de uma tela; o registro
  devolve um aviso e a lição segue.

*Reversão verificada (Step 4):* trocando o retorno de `confirm()` pelo estado
anterior, **três** testes falham, incluindo o da corrida. Restaurado, 11/11.

*O registro declara que só `multiple-choice` tem renderizador hoje* — os outros
sete tipos do contrato entram na Task 10, e `isInteractionTypeRegistered` existe
para que essa lacuna seja consultável em vez de descoberta em runtime.

**Files:**
- Create: `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`
- Test: `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx`
- Create: `radiant-app/src/features/lesson-flow/hooks/useLearningActivity.ts`
- Test: `radiant-app/src/features/lesson-flow/hooks/useLearningActivity.test.ts`
- Modify: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- Modify: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`

**Step 1: Escrever testes vermelhos**

O registro resolve tipo conhecido, rejeita desconhecido com erro seguro e expõe
um único contrato `value/onChange/onConfirm`. O hook conserva resposta por etapa,
não avança sem evidência válida e entrega a resposta confirmada ao outcome.

**Step 2: Rodar testes focados**

Run: `cd radiant-app && npx jest src/features/lesson-flow --runInBand`

**Step 3: Implementar registro e hook**

Mover a lógica específica de múltipla escolha para o contrato comum sem mudar a
copy nem o resultado legado.

**Step 4: Integrar a tela e verificar reversão**

Trocar propositalmente o valor confirmado pelo valor anterior e confirmar que o
teste de corrida falha; restaurar e obter PASS.

**Step 5: Commit**

```bash
git add radiant-app/src/features/lesson-flow
git commit -m "refactor(learning): desacopla player dos tipos de atividade"
```

---

### Task 10: Implementar o primeiro conjunto de jogos acessíveis

**Files:**
- Create: `radiant-app/src/features/lesson-flow/renderers/HotspotStepRenderer.tsx`
- Create: `radiant-app/src/features/lesson-flow/renderers/ComparisonStepRenderer.tsx`
- Create: `radiant-app/src/features/lesson-flow/renderers/MatchingStepRenderer.tsx`
- Create: `radiant-app/src/features/lesson-flow/renderers/OrderingStepRenderer.tsx`
- Test: matching `*.test.tsx` files beside each renderer
- Create: matching `*.stories.tsx` files beside each renderer
- Modify: `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`

**Step 1: Escrever testes vermelhos por comportamento**

- hotspot aceita toque e seleção textual equivalente;
- comparação não depende de cor;
- matching funciona por seleção sequencial, sem drag obrigatório;
- ordering possui botões acessíveis subir/descer;
- todos anunciam confirmação uma única vez e têm alvo mínimo de 44 pt.

**Step 2: Rodar testes**

Run: `cd radiant-app && npx jest src/features/lesson-flow/renderers --runInBand`

**Step 3: Implementar o mínimo compartilhado**

Extrair apenas primitives repetidas por pelo menos dois renderizadores. Não
criar framework de jogos separado.

**Step 4: Storybook e qualidade**

```bash
cd radiant-app
npm run test:storybook-config
npm run quality
```

Expected: PASS, incluindo contraste e visual QA.

**Step 5: Commit**

```bash
git add radiant-app/src/features/lesson-flow
git commit -m "feat(learning): adiciona quatro interacoes acessiveis"
```

---

### Task 11: Agendar revisão e reforço por competência

> **Algoritmo decidido em 2026-08-08:**
> [`2026-08-08-agendador-por-competencia-design.md`](../specs/2026-08-08-agendador-por-competencia-design.md).
> Esta task nomeava só critérios de comportamento e deixava o algoritmo em
> aberto; a spec o fecha com um modelo de estabilidade/dificuldade em vez de
> SM-2, porque `easeFactor` não conhece o tempo decorrido e por isso não sabe
> premiar a recuperação feita quando o conteúdo já ia sendo esquecido.
>
> Três decisões daquela spec que mudam esta task, e que devem ser lidas antes de
> implementar:
>
> 1. **O agendador decide o tipo da evidência que a revisão produz** —
>    `delayed-retention` quando o decorrido passa do limiar e a competência a
>    admite, `independent-recall` caso contrário. É assim que ele alimenta o
>    bloqueio `missing-retention` do motor de domínio.
> 2. **Invariante `minIntervalDays × 24 ≥ delayedRetentionMinHours`**, travada por
>    teste. Sem ela, uma revisão agendada pode acontecer cedo demais e não contar
>    como retenção — falha silenciosa.
> 3. **O teto do currículo é deliberado.** `mastered` é inalcançável nas 30
>    competências e 20 delas travam em `practicing`, porque só as 10
>    `criticalSafety` admitem `delayed-retention`. O agendador serve memória para
>    as 30; a UI exibe o teto alcançável. `CompetencyMasteryService` não muda.

**Files:**
- Create: `radiant-app/src/features/spaced-repetition/models/memoryModel.ts`
- Test: `radiant-app/src/features/spaced-repetition/models/memoryModel.test.ts`
- Create: `radiant-app/src/constants/competencyReview.ts`
- Create: `radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.ts`
- Test: `radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.test.ts`
- Create: `radiant-app/src/features/journey/services/JourneyNodeCompetencyResolver.ts`
- Test: `radiant-app/src/features/journey/services/JourneyNodeCompetencyResolver.test.ts`
- Modify: `radiant-app/src/features/journey/services/JourneyRecommendationService.ts`
- Test: `radiant-app/src/features/journey/services/JourneyRecommendationService.test.ts`

> **`SpacedRepetitionService` saiu da lista.** A spec mantém o caminho por lição
> intocado — chave, schema e algoritmo — e o novo serviço roda em paralelo, que é
> o que o Step 3 abaixo já mandava fazer. Modificá-lo era contradição da própria
> task.

**Step 1: Escrever testes vermelhos**

Competência nova recebe primeira revisão; retenção expande intervalo; erro ou
dica reduz intervalo; crítico de segurança recebe reforço antes de avançar;
lições legadas continuam consultando o cartão por lição.

Somados pela spec de 2026-08-08, e nenhum deles é opcional:

- **a invariante** `minIntervalDays × 24 ≥ delayedRetentionMinHours`, assertada
  sobre as constantes;
- **revisar mais tarde consolida mais** — mesmo acerto, recuperabilidade menor,
  ganho de estabilidade maior. É o teste cuja falha significa que trocar de
  algoritmo não valeu a pena;
- **relógio falha fechado** — retrocedido, data ilegível ou decorrido zero nunca
  concedem `delayed-retention`;
- **guarda de regressão:** com o catálogo atual, só legado, a saída de
  `JourneyRecommendationService` é idêntica à de hoje (`reason: 'next-new'` em
  todos os casos). É esse teste que autoriza a task a entrar antes de existir
  conteúdo v2.

**Steps 2 a 5 — delegados**

> **Esta task é implementada por um plano próprio:**
> [`2026-08-08-agendador-por-competencia.md`](2026-08-08-agendador-por-competencia.md),
> em seis tasks com código de teste real e blocos de interface. **Ele é a fonte;
> o que está acima é a decisão, não o procedimento.** Se os dois divergirem,
> vale o plano de 2026-08-08 e esta seção deve ser corrigida.
>
> A delegação é deliberada. As outras 17 tasks deste arquivo estão em nível de
> esboço, e expandir só esta produziria uma seção muito maior que as irmãs; e
> descrever o mesmo trabalho em dois lugares é exatamente o que faz uma sessão
> seguinte reespecificar o que já estava especificado.
>
> O que o plano delegado entrega, em ordem: tipos e constantes com a invariante
> do limiar; o modelo de memória puro; o serviço com quarentena e relógio
> fechado; o resolver de nó para competência; e a recomendação explicável com a
> guarda de regressão que autoriza tudo isso a entrar antes de existir conteúdo
> v2.
>
> Uma consequência a não esquecer: **`weak-competency` fica declarado no tipo e
> não é emitido** enquanto todo domínio for `not-started`. Emiti-lo hoje poria
> uma explicação falsa na tela. Ele entra na Task 12.

---

### Task 12: Implementar checkpoint e reforço adaptativo

**Files:**
- Create: `radiant-app/src/features/mastery/services/UnitCheckpointService.ts`
- Test: `radiant-app/src/features/mastery/services/UnitCheckpointService.test.ts`
- Modify: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`
- Modify: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx`
- Modify: `radiant-app/src/features/journey/services/JourneyDefinitionService.ts`
- Test: `radiant-app/src/features/journey/services/JourneyDefinitionService.test.ts`

**Step 1: Escrever testes vermelhos**

Passa com ≥80% e zero erro crítico; reprovação devolve somente competências
frágeis; checkpoint usa aplicações não idênticas à prática; desbloqueio depende
do resultado, não de XP.

**Step 2: Rodar focados**

Run: `cd radiant-app && npx jest src/features/mastery src/features/checkpoint src/features/journey/services/JourneyDefinitionService.test.ts --runInBand`

**Step 3: Implementar serviço puro e rota de reforço**

Persistir resultado e versão do lote. Não apagar evidências anteriores.

**Step 4: Validar UI acessível**

Cobrir mensagem de reforço sem linguagem punitiva e CTA visível em viewport
curto após scroll real.

**Step 5: Commit**

```bash
git add radiant-app/src/features/mastery radiant-app/src/features/checkpoint radiant-app/src/features/journey
git commit -m "feat(mastery): adiciona checkpoint adaptativo"
```

---

### Task 13: Tornar a Galáxia uma projeção da jornada canônica

**Files:**
- Create: `radiant-app/src/features/galaxy/services/GalaxyProjectionService.ts`
- Test: `radiant-app/src/features/galaxy/services/GalaxyProjectionService.test.ts`
- Modify: `radiant-app/src/features/galaxy/screens/GalaxyMapScreen.tsx`
- Modify: `radiant-app/src/features/galaxy/screens/GalaxyInteriorScreen.tsx`
- Modify: `radiant-app/src/features/galaxy/screens/PlanetInteriorScreen.tsx`
- Modify: `radiant-app/src/data/galaxy-catalog.ts`
- Test: `radiant-app/src/features/galaxy/screens/PlanetInteriorScreen.flow.test.tsx`

**Step 1: Escrever o contrato vermelho**

Projetar galáxia/corpo/nó a partir de tracks, units e status reais. Nenhum nó
sem `lessonId/blockId` pode abrir `/learn`. Zero vidas nunca bloqueia uma lição.

**Step 2: Rodar focados**

Run: `cd radiant-app && npx jest src/features/galaxy --runInBand`

**Step 3: Implementar projeção pura**

Manter apenas configuração visual em `galaxy-catalog.ts`; remover títulos,
status e nós de aprendizado estáticos.

**Step 4: Integrar telas e testar paridade**

Concluir pela jornada e verificar que a Galáxia mostra o mesmo status após
reabrir o app.

**Step 5: Quality e commit**

```bash
cd radiant-app && npm run quality
git add src/features/galaxy src/data/galaxy-catalog.ts
git commit -m "feat(galaxy): projeta a jornada canonica"
```

---

### Task 14: Estender pipeline editorial para atividades v2

**Files:**
- Create: `conteúdo/governança/esquemas/learning-activity-v2.schema.json`
- Create: `scripts/content/build-learning-activities.mjs`
- Test: `scripts/content/build-learning-activities.test.mjs`
- Modify: `scripts/content/promote-to-catalog.mjs`
- Modify: `scripts/content/promote-to-catalog.test.mjs`
- Modify: `scripts/content/sync-catalog-to-app.mjs`
- Test: `scripts/content/wave-1-priority-tracks.test.mjs`

**Step 1: Escrever testes vermelhos**

Rejeitar atividade sem competência, fonte, página, evidência, feedback,
acessibilidade ou revisão. Conteúdo crítico alterado depois da aprovação volta
para `needs-review`. Catálogo legado permanece byte-equivalente quando não há v2.

**Step 2: Rodar pipeline focado**

```bash
node --test scripts/content/build-learning-activities.test.mjs scripts/content/promote-to-catalog.test.mjs scripts/content/wave-1-priority-tracks.test.mjs
```

**Step 3: Implementar geração e promoção**

Gerar contrato, nunca texto clínico final automaticamente. O lote editorial é a
unidade de aprovação.

**Step 4: Validar sync sem diff manual**

```bash
node scripts/content/sync-catalog-to-app.mjs
git diff --exit-code radiant-app/src/data
```

Expected antes do primeiro lote v2: nenhum diff. Depois do lote aprovado, diff
somente nos gerados declarados.

**Step 5: Commit**

```bash
git add scripts/content conteúdo/governança
git commit -m "feat(content): promove atividades por competencia"
```

---

### Task 15: Produzir e revisar o corte vertical da Unidade 1

**Files:**
- Create: `conteúdo/formatos/atividades/fundamentos-seguranca-unidade-1/bundles.json`
- Create: `conteúdo/formatos/atividades/fundamentos-seguranca-unidade-1/review.json`
- Modify: `conteúdo/governança/catalog-payload.json` via promoção
- Modify: generated app/API catalog files via sync scripts
- Create: `docs/content/2026-07-31-unidade-1-review-checklist.md`

**Step 1: Montar matriz antes de redigir**

Exigir 5 competências, 10–12 sessões, pelo menos quatro tipos de interação, um
checkpoint, uma recuperação posterior e cobertura de cada objetivo por ensino e
avaliação.

**Step 2: Gerar rascunho rastreável**

Texto original, fontes permitidas e imagens do manifesto. Proibir promoção com
placeholder ou licença pendente.

**Step 3: Rodar validações automatizadas**

```bash
node scripts/content/validate-foundation.mjs
node scripts/content/validate-media-manifest.mjs
node scripts/content/validate-competencies.mjs
```

**Step 4: Pausar para revisão humana por lote**

O revisor registra aprovação/correção/bloqueio por atividade. Não transformar
silêncio em aprovação.

**Step 5: Promover, sincronizar, validar e commit**

```bash
node scripts/content/promote-to-catalog.mjs
node scripts/content/sync-catalog-to-app.mjs
node scripts/content/sync-catalog-to-api.mjs
node scripts/qa/wave-1-smoke.mjs
git add conteúdo docs/content radiant-app/src/data radiant-api/src
git commit -m "feat(content): entrega unidade inicial de seguranca"
```

O remote smoke pode registrar `environment-blocked` pela API 502; contratos
locais precisam passar.

---

### Task 16: Instrumentar beta pedagógico sem dados sensíveis

**Files:**
- Modify: `radiant-app/src/features/telemetry/telemetry.types.ts`
- Modify: `radiant-app/src/features/telemetry/TelemetryService.ts`
- Modify: `radiant-app/src/features/telemetry/telemetry-privacy-contract.test.ts`
- Create: `radiant-app/src/features/mastery/services/LearningEvaluationService.ts`
- Test: `radiant-app/src/features/mastery/services/LearningEvaluationService.test.ts`
- Create: `docs/content/BETA_PEDAGOGICO_UNIDADE_1.md`

**Step 1: Escrever testes de privacidade e métricas**

Permitir somente ids/versionamento, resultado, dica, estado de domínio e faixa
de duração. Rejeitar resposta livre, caminho de mídia, identificador de pessoa,
email e payload aninhado.

**Step 2: Definir métricas antes de coletar**

Primárias: checkpoint, retenção posterior e erro crítico. Secundárias: conclusão,
abandono por etapa e uso de dica. Não usar XP como proxy de aprendizagem.

**Step 3: Implementar avaliação local e eventos allowlisted**

Analytics remoto continua condicionado às flags e ao contrato de privacidade.

**Step 4: Quality e documentação**

Run: `cd radiant-app && npm run quality`

**Step 5: Commit**

```bash
git add radiant-app/src/features/telemetry radiant-app/src/features/mastery docs/content
git commit -m "feat(beta): mede aprendizagem sem dados sensiveis"
```

---

### Task 17: Validar em device, acessibilidade e retenção

**Files:**
- Create: `radiant-app/.maestro/learning-unit-1.yaml`
- Modify: `radiant-app/scripts/maestro-contract.test.mjs`
- Create: `radiant-app/docs/evidence/YYYY-MM-DD-learning-unit-1.md`
- Modify: `docs/content/BETA_PEDAGOGICO_UNIDADE_1.md`

**Step 1: Preflight do ambiente**

Registrar separadamente iOS/Android como `passed`, `app-failed`,
`environment-blocked` ou `not-run`; inventariar runtime, device, espaço e build.

**Step 2: Escrever contrato Maestro vermelho**

Cobrir uma lição v2, quatro interações, checkpoint reprovado com reforço,
checkpoint aprovado, retorno da Galáxia e zero vidas sem bloqueio.

**Step 3: Rodar contrato estático**

Run: `cd radiant-app && npm run test:maestro-contract`

**Step 4: Executar uma plataforma por vez**

Usar build Release e scroll real em viewport curto. Fazer sessão manual com
VoiceOver/TalkBack para ordering, matching e hotspot textual.

**Step 5: Registrar retenção e decidir gate**

Reavaliar após o intervalo definido. P0/P1 ou erro crítico não resolvido bloqueia
a Fase 4. Commitar somente evidência sanitizada e o estado do gate.

---

### Task 18: Expandir unidades 2–6 por lotes

**Files:**
- Create/Modify: lotes sob `conteúdo/formatos/atividades/`
- Modify: catálogo gerado somente via scripts
- Modify: `docs/content/BETA_PEDAGOGICO_UNIDADE_1.md` ou relatório sucessor por lote
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`
- Modify/Create: status canônico mais recente

**Step 1: Escolher uma unidade**

Não executar duas unidades em paralelo com um único revisor. Revalidar fontes e
direitos do lote.

**Step 2: Aplicar o mesmo ciclo da Task 15**

Matriz → rascunho → validação → revisão humana → promoção.

**Step 3: Limitar novidade técnica**

Adicionar no máximo um tipo de interação novo quando a competência justificar.

**Step 4: Rodar gate completo local e device proporcional ao risco**

`npm run quality`, validators editoriais e flow E2E afetado.

**Step 5: Sinalizar estado e commit**

Atualizar roadmap/status no mesmo run. Não marcar unidade concluída antes da
revisão e evidência.

---

## 3. Sequência recomendada de execução

1. Tasks 1–4: governança antes de conteúdo.
2. Tasks 5–9: contratos de domínio antes de UI ampla.
3. Task 10: somente os quatro renderizadores do corte vertical.
4. Tasks 11–13: domínio, reforço e unificação da navegação.
5. Tasks 14–15: pipeline e conteúdo revisado.
6. Tasks 16–17: beta pedagógico e evidência.
7. Task 18: expansão condicionada ao gate.

O plano não autoriza automaticamente produção, publicação em loja, ingestão de
livros protegidos ou uso de novas imagens. Cada uma dessas ações mantém seu gate
próprio.
