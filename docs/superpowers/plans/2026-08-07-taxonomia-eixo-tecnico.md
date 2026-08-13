# Eixo técnico da taxonomia — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar destino de taxonomia às 16 lições `ai-lesson:`, que hoje mapeiam
todas para `null`, criando uma galáxia e seis planetas que descrevem o eixo
técnico do currículo.

**Architecture:** Puramente de dados. Três arquivos JSON governados ganham
registros; nenhum código de produto é tocado. `Conteúdo/taxonomia/galaxias.json`
recebe um registro, `Conteúdo/taxonomia/planetas.json` recebe seis, e
`content-manifest/taxonomy-catalog-map.json` troca 16 `taxonomyId: null` por 16
ids reais. As asserções de regressão entram no arquivo de teste que já roda no
gate, para não precisar mexer em `.loop/project.yaml`.

**Tech Stack:** Node 20 (`node --test`), JSON. Sem dependência nova.

**Desenho de origem:** [`2026-08-07-taxonomia-eixo-tecnico-design.md`](../specs/2026-08-07-taxonomia-eixo-tecnico-design.md),
aprovado pelo dono em 2026-08-07.

## Global Constraints

- **Declare todo caminho como o SISTEMA DE ARQUIVOS o soletra.** O disco escreve
  `Conteúdo/` com **Ç maiúsculo**; o índice do git carrega `conteúdo/` minúsculo
  de um commit antigo. O guarda de escopo do Loop compara **texto**: declarar em
  minúscula devolve `OUT_OF_SCOPE_CHANGE` na versão maiúscula do mesmo arquivo.
  Confira com `ls`, nunca com `git ls-files`.
- **`git status --porcelain` antes de todo `abrir.mjs`.** A baseline do run
  inclui a sujeira que já existia na abertura, então **desfazer também é mudança
  fora de escopo**.
- **Nunca encadeie os comandos de fechamento com `&&`.** A CLI reporta erro no
  corpo do JSON com status de saída **zero**. Extraia o `code` de cada resposta.
  Ordem: `loop validate` → `loop step finish` → `loop memory write` →
  `loop run close`.
- **Não rode `loop validate` enquanto um E2E estiver rodando** — 2,3× de
  desaceleração medida no emulador, e o flow morre em timeout que parece defeito
  do app.
- **Estes slugs não podem sair:** `validate-foundation.mjs:230-245` exige que
  existam os slugs de galáxia `fundamentos`, de planeta `torax` e `abdome`, e de
  estrela `fundamentos`, `torax` e `abdome`. Este plano só **acrescenta**
  registros; nenhum slug existente muda.
- **Nenhum registro existente é editado ou removido.** Os 2 planetas de
  interpretação seguem `planned`, as 6 estrelas seguem `planned`, as 3 galáxias
  seguem como estão. `wave-1-priority-tracks.json` e `catalog-payload.json` não
  são tocados.
- **Prova de mutação mede QUAL teste fica vermelho, não SE fica.** Registre
  previsto × observado; divergência é achado, não ruído.

---

## File Structure

| Arquivo | Responsabilidade | Ação |
| --- | --- | --- |
| `Conteúdo/taxonomia/galaxias.json` | Grandes domínios do currículo | Modificar — +1 registro |
| `Conteúdo/taxonomia/planetas.json` | Trilhas longas principais | Modificar — +6 registros |
| `Conteúdo/taxonomia/README.md` | Descreve o MVP da pasta | Modificar — a lista de galáxias envelheceu |
| `content-manifest/taxonomy-catalog-map.json` | Liga cada `ai-lesson:` a um nó | Modificar — 16 entradas |
| `scripts/content/validate-taxonomy-map.test.mjs` | Testes do validador de mapa | Modificar — asserções sobre dado real |

**Por que as asserções novas vão para `validate-taxonomy-map.test.mjs` e não
para um arquivo próprio:** esse arquivo já é executado pelo validador
`content-anchoring` do `.loop/project.yaml`. Um arquivo de teste novo exigiria
editar `project.yaml` para entrar no gate, e um teste que não está no gate é
indistinguível de um teste que não existe. O custo é misturar teste de fixture
com teste de dado real no mesmo arquivo; as seções ficam separadas por cabeçalho
de comentário.

---

### Task 1: Os sete registros de taxonomia

**Files:**
- Modify: `Conteúdo/taxonomia/galaxias.json`
- Modify: `Conteúdo/taxonomia/planetas.json`
- Modify: `Conteúdo/taxonomia/README.md`
- Test: `scripts/content/validate-taxonomy-map.test.mjs`

**Interfaces:**
- Consumes: nada de tarefas anteriores.
- Produces: os ids `galaxy-tecnologia`, `planet-fisica-da-radiacao`,
  `planet-producao-e-protecao`, `planet-equipamento`, `planet-modalidades`,
  `planet-imagem-na-pratica`, `planet-profissao-e-aplicacoes`. A Task 2 aponta o
  mapa para exatamente esses sete nomes.

- [ ] **Step 1: Escrever o teste que falha**

Acrescente ao **fim** de `scripts/content/validate-taxonomy-map.test.mjs`:

```javascript
// ════════════════════════════════════════════════════════════════════════
// Dado real — o eixo técnico da taxonomia
// Os testes acima usam fixture; os daqui para baixo leem os arquivos do
// repositório. Fixture prova que a função funciona; dado real prova que o
// currículo está montado.
// ════════════════════════════════════════════════════════════════════════

import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function lerReal(...partes) {
  return JSON.parse(readFileSync(path.join(RAIZ, ...partes), 'utf8'));
}

// A galáxia de destino de cada planeta do eixo técnico. Escrito à mão porque é
// a decisão de currículo, não uma derivação: `galaxy-fisica` recebe dois e
// `galaxy-tecnologia` recebe quatro.
const PLANETAS_DO_EIXO_TECNICO = {
  'planet-fisica-da-radiacao': 'galaxy-fisica',
  'planet-producao-e-protecao': 'galaxy-fisica',
  'planet-equipamento': 'galaxy-tecnologia',
  'planet-modalidades': 'galaxy-tecnologia',
  'planet-imagem-na-pratica': 'galaxy-tecnologia',
  'planet-profissao-e-aplicacoes': 'galaxy-tecnologia',
};

test('galaxy-tecnologia existe, ativa, com o titulo que o app ja reservou', () => {
  const galaxias = lerReal('Conteúdo', 'taxonomia', 'galaxias.json');
  const tecnologia = galaxias.find((g) => g.id === 'galaxy-tecnologia');
  assert.ok(tecnologia, 'galaxy-tecnologia ausente de galaxias.json');
  assert.equal(tecnologia.status, 'active');
  // O titulo nao e livre: galaxy-catalog.ts:204 ja embarca este id com este
  // titulo, travado e vazio. Divergir aqui recria a divergencia que a decisao
  // do dono resolveu de graca.
  assert.equal(tecnologia.title, 'Tecnologia em Imagem');
});

test('os seis planetas do eixo tecnico existem, ativos, na galaxia certa', () => {
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const porId = new Map(planetas.map((p) => [p.id, p]));

  for (const [planetaId, galaxiaId] of Object.entries(PLANETAS_DO_EIXO_TECNICO)) {
    const planeta = porId.get(planetaId);
    assert.ok(planeta, `planeta ausente de planetas.json: ${planetaId}`);
    assert.equal(planeta.galaxyId, galaxiaId, `${planetaId} na galaxia errada`);
    // Nasce 'active' porque as licoes existem e embarcam hoje. Os dois planetas
    // de interpretacao seguem 'planned' e sao a contraprova viva desta regra.
    assert.equal(planeta.status, 'active', `${planetaId} deveria nascer active`);
    assert.equal(planeta.trackKind, 'long-form');
  }
});

test('os planetas de interpretacao seguem planned, intocados', () => {
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const porId = new Map(planetas.map((p) => [p.id, p]));
  for (const id of ['planet-formacao-imagem', 'planet-radiopacidade']) {
    assert.equal(porId.get(id)?.status, 'planned', `${id} nao devia ter mudado`);
  }
});

test('toda galaxyId de planeta resolve numa galaxia existente', () => {
  const galaxias = lerReal('Conteúdo', 'taxonomia', 'galaxias.json');
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const idsDeGalaxia = new Set(galaxias.map((g) => g.id));
  for (const planeta of planetas) {
    assert.ok(
      idsDeGalaxia.has(planeta.galaxyId),
      `${planeta.id} aponta para galaxia inexistente ${planeta.galaxyId}`,
    );
  }
});

test('slugs de galaxia e de planeta seguem unicos dentro do proprio arquivo', () => {
  const galaxias = lerReal('Conteúdo', 'taxonomia', 'galaxias.json');
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const slugsDeGalaxia = galaxias.map((g) => g.slug);
  const slugsDePlaneta = planetas.map((p) => p.slug);
  assert.equal(new Set(slugsDeGalaxia).size, slugsDeGalaxia.length);
  assert.equal(new Set(slugsDePlaneta).size, slugsDePlaneta.length);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
node --test scripts/content/validate-taxonomy-map.test.mjs
```

Esperado: **2 falhas** — `galaxy-tecnologia existe...` com *"galaxy-tecnologia
ausente de galaxias.json"* e `os seis planetas...` com *"planeta ausente de
planetas.json: planet-fisica-da-radiacao"*. Os outros três passam desde já
(descrevem o estado atual, que já é válido) e são as contraprovas: se algum
deles ficar vermelho, a mudança quebrou algo que já estava certo.

- [ ] **Step 3: Acrescentar a galáxia**

Em `Conteúdo/taxonomia/galaxias.json`, **depois** do registro
`galaxy-patologias`, mantendo o arquivo como um array e a indentação de 2
espaços:

```json
  {
    "id": "galaxy-tecnologia",
    "slug": "tecnologia-em-imagem",
    "title": "Tecnologia em Imagem",
    "description": "Equipamento, modalidades e prática técnica que produzem o exame.",
    "status": "active"
  }
```

- [ ] **Step 4: Acrescentar os seis planetas**

Em `Conteúdo/taxonomia/planetas.json`, **ao fim** do array, na ordem abaixo:

```json
  {
    "id": "planet-fisica-da-radiacao",
    "galaxyId": "galaxy-fisica",
    "slug": "fisica-da-radiacao",
    "title": "Física da Radiação",
    "description": "Energia, matéria, núcleo atômico e as propriedades dos raios X.",
    "trackKind": "long-form",
    "status": "active"
  },
  {
    "id": "planet-producao-e-protecao",
    "galaxyId": "galaxy-fisica",
    "slug": "producao-e-protecao",
    "title": "Produção e Proteção",
    "description": "Como o feixe é produzido, como a radiação interage e como ela é contida.",
    "trackKind": "long-form",
    "status": "active"
  },
  {
    "id": "planet-equipamento",
    "galaxyId": "galaxy-tecnologia",
    "slug": "equipamento",
    "title": "Equipamento",
    "description": "O aparelho de radiologia convencional, seus componentes e acessórios.",
    "trackKind": "long-form",
    "status": "active"
  },
  {
    "id": "planet-modalidades",
    "galaxyId": "galaxy-tecnologia",
    "slug": "modalidades",
    "title": "Modalidades",
    "description": "Tomografia computadorizada, ressonância magnética e medicina nuclear.",
    "trackKind": "long-form",
    "status": "active"
  },
  {
    "id": "planet-imagem-na-pratica",
    "galaxyId": "galaxy-tecnologia",
    "slug": "imagem-na-pratica",
    "title": "Imagem na Prática",
    "description": "Processamento radiográfico e os fatores que decidem a qualidade da imagem.",
    "trackKind": "long-form",
    "status": "active"
  },
  {
    "id": "planet-profissao-e-aplicacoes",
    "galaxyId": "galaxy-tecnologia",
    "slug": "profissao-e-aplicacoes",
    "title": "Profissão e Aplicações",
    "description": "Atuação do técnico em radiologia e aplicações não-médicas da radiação.",
    "trackKind": "long-form",
    "status": "active"
  }
```

A descrição do último nomeia **aplicações não-médicas da radiação** de propósito:
é ela que faz `preservacao-de-alimentos-por-irradicao` caber ali sem ser exceção
escondida, que foi o julgamento aprovado pelo dono.

- [ ] **Step 5: Rodar os testes e confirmar que passam**

```bash
node --test scripts/content/validate-taxonomy-map.test.mjs
```

Esperado: todos verdes, incluindo os cinco anteriores de fixture.

- [ ] **Step 6: Confirmar que a fundação segue íntegra**

```bash
node scripts/content/validate-foundation.mjs
```

Esperado: saída 0. Este é o validador que confere integridade referencial de
planeta→galáxia e a presença dos slugs travados (`fundamentos`, `torax`,
`abdome`). Se ele reprovar, foi slug ou `galaxyId`, não o mapa.

- [ ] **Step 7: Atualizar o README da pasta**

Em `Conteúdo/taxonomia/README.md`, a seção "MVP inicial" lista três domínios e
envelheceu. Substitua a seção inteira por:

```markdown
## Domínios

Dois eixos convivem nesta taxonomia, e a distinção explica os `status`:

- **Interpretação de imagem** — Anatomia, Fundamentos, Patologias. Currículo
  pretendido: os planetas e estrelas seguem `planned`.
- **Eixo técnico** — Fundamentos (dois planetas novos) e Tecnologia em Imagem.
  Currículo entregue: nasce `active` porque as 16 lições `ai-lesson:` existem e
  já embarcam.

Um nó `active` significa currículo **entregue**, não pretendido.
```

- [ ] **Step 8: Commit**

```bash
git add Conteúdo/taxonomia/galaxias.json Conteúdo/taxonomia/planetas.json Conteúdo/taxonomia/README.md scripts/content/validate-taxonomy-map.test.mjs
git commit -m "feat(taxonomia): o eixo tecnico ganha uma galaxia e seis planetas"
```

---

### Task 2: As 16 atribuições, e a prova de que elas mordem

**Files:**
- Modify: `content-manifest/taxonomy-catalog-map.json`
- Test: `scripts/content/validate-taxonomy-map.test.mjs`

**Interfaces:**
- Consumes: os sete ids produzidos pela Task 1 — `galaxy-tecnologia`,
  `planet-fisica-da-radiacao`, `planet-producao-e-protecao`,
  `planet-equipamento`, `planet-modalidades`, `planet-imagem-na-pratica`,
  `planet-profissao-e-aplicacoes`. Consome também, do mesmo arquivo de teste, os
  helpers que a Task 1 introduziu: a constante `RAIZ` e a função
  `lerReal(...partes)`. `loadInputs` e `main` já estão importados no topo do
  arquivo desde antes — não reimporte nenhum dos quatro.
- Produces: `taxonomy-catalog-map.json` sem nenhum `taxonomyId: null`. É o
  critério de saída do desenho.

- [ ] **Step 1: Escrever o teste que falha**

Acrescente ao **fim** de `scripts/content/validate-taxonomy-map.test.mjs`:

```javascript
// Distribuicao aprovada pelo dono em 2026-08-07. Escrita por extenso, e nao
// derivada do arquivo, porque um teste que le a mesma fonte que valida nao
// testa nada.
const ATRIBUICOES = {
  'planet-fisica-da-radiacao': [
    'ai-lesson:energia-e-materia',
    'ai-lesson:estrutura-da-materia-e-nucleo-atomico',
    'ai-lesson:radioatividade-particulas-e-atividade',
    'ai-lesson:raios-x-descoberta-e-propriedades',
  ],
  'planet-producao-e-protecao': [
    'ai-lesson:interacao-das-radiacoes-e-protecao-radiologica',
    'ai-lesson:producao-dos-raios-x',
  ],
  'planet-equipamento': [
    'ai-lesson:acessorios-radiologicos',
    'ai-lesson:componentes-basicos-do-equipamento',
    'ai-lesson:equipamentos-de-radiologia-convencional',
  ],
  'planet-modalidades': [
    'ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear',
    'ai-lesson:ressonancia-magnetica',
    'ai-lesson:tomografia-computadorizada',
  ],
  'planet-imagem-na-pratica': [
    'ai-lesson:processamento-radiografico',
    'ai-lesson:qualidade-de-imagem',
  ],
  'planet-profissao-e-aplicacoes': [
    'ai-lesson:preservacao-de-alimentos-por-irradicao',
    'ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia',
  ],
};

test('nenhuma licao do catalogo segue sem destino de taxonomia', () => {
  const mapa = lerReal('content-manifest', 'taxonomy-catalog-map.json');
  const semDestino = mapa.filter((e) => e.taxonomyId === null).map((e) => e.catalogId);
  assert.deepEqual(semDestino, [], `entradas ainda nulas: ${semDestino.join(', ')}`);
});

test('todo taxonomyId do mapa real resolve num no de taxonomia real', () => {
  const { map, taxonomyIds } = loadInputs(RAIZ);
  for (const entrada of map) {
    if (entrada.taxonomyId === null) continue;
    assert.ok(
      taxonomyIds.has(entrada.taxonomyId),
      `${entrada.catalogId} aponta para ${entrada.taxonomyId}, que nao existe`,
    );
  }
});

test('as 16 licoes caem exatamente nos planetas aprovados', () => {
  const mapa = lerReal('content-manifest', 'taxonomy-catalog-map.json');
  const observado = {};
  for (const entrada of mapa) {
    (observado[entrada.taxonomyId] ??= []).push(entrada.catalogId);
  }
  for (const planeta of Object.keys(observado)) observado[planeta].sort();
  assert.deepEqual(observado, ATRIBUICOES);
});

test('toda entrada do mapa carrega rationale nao vazio', () => {
  const mapa = lerReal('content-manifest', 'taxonomy-catalog-map.json');
  for (const entrada of mapa) {
    assert.equal(typeof entrada.rationale, 'string');
    assert.ok(entrada.rationale.length > 0, `rationale vazio em ${entrada.catalogId}`);
  }
});

test('MUTACAO: main devolve 0 contra o repositorio real', () => {
  assert.equal(main(RAIZ), 0);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
node --test scripts/content/validate-taxonomy-map.test.mjs
```

Esperado: **3 falhas** — `nenhuma licao ... sem destino` listando as 16,
`as 16 licoes caem exatamente nos planetas aprovados` (o observado tem uma chave
`null` com as 16), e nada mais. `todo taxonomyId ... resolve` e
`MUTACAO: main devolve 0` passam **antes** da mudança: `null` é legal e o mapa
atual fecha. Eles não são inúteis — são as contraprovas que devem seguir verdes
depois, e o segundo é o que pega um id digitado errado no Step 3.

- [ ] **Step 3: Preencher os 16 `taxonomyId`**

Substitua `content-manifest/taxonomy-catalog-map.json` inteiro pelo conteúdo
abaixo. A ordem alfabética por `catalogId` é a do arquivo atual e se mantém. Os
`rationale` antigos explicavam por que **não** havia destino e ficaram falsos no
momento em que passou a haver:

```json
[
  {
    "taxonomyId": "planet-equipamento",
    "catalogId": "ai-lesson:acessorios-radiologicos",
    "rationale": "Acessorios sao parte do aparato fisico do exame, junto de aparelho e componentes. O planeta reune o equipamento como objeto; a licao descreve os acessorios que o acompanham."
  },
  {
    "taxonomyId": "planet-modalidades",
    "catalogId": "ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear",
    "rationale": "Medicina nuclear e uma modalidade de imagem, ao lado de TC e RM. O recorte do planeta e a modalidade como tecnica propria, nao a fisica que a sustenta."
  },
  {
    "taxonomyId": "planet-equipamento",
    "catalogId": "ai-lesson:componentes-basicos-do-equipamento",
    "rationale": "Anatomia interna do aparelho de radiologia convencional. Mesmo planeta de acessorios e do equipamento completo, que juntos descrevem a maquina."
  },
  {
    "taxonomyId": "planet-equipamento",
    "catalogId": "ai-lesson:equipamentos-de-radiologia-convencional",
    "rationale": "O aparelho de radiologia convencional visto por inteiro. E a licao de entrada do planeta; componentes e acessorios a detalham."
  },
  {
    "taxonomyId": "planet-fisica-da-radiacao",
    "catalogId": "ai-lesson:energia-e-materia",
    "rationale": "Fisica geral pre-raios X. Fica em Fisica da Radiacao e nao em Formacao da Imagem, porque o planeta de formacao pertence ao eixo de interpretacao e segue planned."
  },
  {
    "taxonomyId": "planet-fisica-da-radiacao",
    "catalogId": "ai-lesson:estrutura-da-materia-e-nucleo-atomico",
    "rationale": "Fisica nuclear basica, pre-requisito de radioatividade. Mesmo planeta de energia e materia, com quem forma a base do eixo tecnico."
  },
  {
    "taxonomyId": "planet-producao-e-protecao",
    "catalogId": "ai-lesson:interacao-das-radiacoes-e-protecao-radiologica",
    "rationale": "Interacao da radiacao com a materia e sua contencao. Fica com producao dos raios X porque as duas descrevem o feixe: uma como ele nasce, outra o que ele faz e como se protege dele. A estrela star-dose-radiacao segue planned e continua sem receber mapeamento, pela regra de nao ligar catalogo a promessa de curriculo."
  },
  {
    "taxonomyId": "planet-profissao-e-aplicacoes",
    "catalogId": "ai-lesson:preservacao-de-alimentos-por-irradicao",
    "rationale": "Aplicacao nao-medica da radiacao — nem imagem nem equipamento. Julgamento aprovado pelo dono em 2026-08-07: o planeta se chama Profissao e Aplicacoes e sua descricao nomeia aplicacoes nao-medicas, entao a licao nao e excecao escondida. A alternativa considerada, forcar na fisica, foi recusada."
  },
  {
    "taxonomyId": "planet-imagem-na-pratica",
    "catalogId": "ai-lesson:processamento-radiografico",
    "rationale": "Etapa tecnica entre a exposicao e a imagem pronta. Fica com qualidade de imagem, com quem forma o par do que se faz depois do disparo."
  },
  {
    "taxonomyId": "planet-producao-e-protecao",
    "catalogId": "ai-lesson:producao-dos-raios-x",
    "rationale": "Como o feixe e produzido. E a licao de entrada do planeta; interacao e protecao completam o ciclo do feixe."
  },
  {
    "taxonomyId": "planet-profissao-e-aplicacoes",
    "catalogId": "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia",
    "rationale": "Orientacao profissional e de carreira, sem paralelo nos demais planetas. Da nome ao planeta junto das aplicacoes nao-medicas."
  },
  {
    "taxonomyId": "planet-imagem-na-pratica",
    "catalogId": "ai-lesson:qualidade-de-imagem",
    "rationale": "Fatores tecnicos que decidem a qualidade do resultado. E a aula do piloto de ancoragem, e o planeta a poe ao lado do processamento, que e onde varios desses fatores agem."
  },
  {
    "taxonomyId": "planet-fisica-da-radiacao",
    "catalogId": "ai-lesson:radioatividade-particulas-e-atividade",
    "rationale": "Radioatividade e atividade, continuacao direta de estrutura da materia. Base fisica do eixo tecnico, anterior a qualquer equipamento."
  },
  {
    "taxonomyId": "planet-fisica-da-radiacao",
    "catalogId": "ai-lesson:raios-x-descoberta-e-propriedades",
    "rationale": "Historico e propriedades gerais dos raios X. Fecha a base fisica e antecede a producao do feixe, que fica no planeta seguinte."
  },
  {
    "taxonomyId": "planet-modalidades",
    "catalogId": "ai-lesson:ressonancia-magnetica",
    "rationale": "Modalidade propria, ao lado de TC e medicina nuclear. Sem recorte anatomico, o que a mantem fora das galaxias de interpretacao."
  },
  {
    "taxonomyId": "planet-modalidades",
    "catalogId": "ai-lesson:tomografia-computadorizada",
    "rationale": "Modalidade propria. O catalogo a agrupa na trilha de prioridade Torax, mas isso e coincidencia de rollout do wave-1 e nao de conteudo — a licao e sobre a tecnica, nao sobre anatomia toracica."
  }
]
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

```bash
node --test scripts/content/validate-taxonomy-map.test.mjs
```

Esperado: todos verdes.

- [ ] **Step 5: Medir o critério de saída**

```bash
node scripts/content/validate-taxonomy-map.mjs
```

Esperado, exatamente:

```json
{
  "mapEntries": 16,
  "taxonomyIds": 22,
  "catalogIds": 18,
  "errors": []
}
```

`taxonomyIds` sai de 15 e chega a **22** por soma explícita: 15 hoje + 1 galáxia
+ 6 planetas. `mapEntries` e `catalogIds` **não mudam** — nenhuma lição entra ou
sai. Se `taxonomyIds` vier 21, falta um registro da Task 1; se vier 23, entrou
registro a mais.

- [ ] **Step 6: Prova de mutação — prever, depois medir**

Três mutações, uma de cada vez, revertendo antes da seguinte. Registre
**previsto × observado** e trate divergência como achado.

| # | Mutação | Previsto |
| --- | --- | --- |
| 1 | Em `taxonomy-catalog-map.json`, trocar o `taxonomyId` de `ai-lesson:qualidade-de-imagem` por `null` | 2 vermelhos: `nenhuma licao ... sem destino` e `as 16 licoes caem exatamente nos planetas aprovados`. `main` segue **0** — `null` é legal para o validador |
| 2 | Trocar esse mesmo `taxonomyId` por `planet-fantasma` | 3 vermelhos: `todo taxonomyId ... resolve`, `as 16 licoes ...` e `MUTACAO: main devolve 0` |
| 3 | Em `planetas.json`, apagar o registro `planet-imagem-na-pratica` | 3 vermelhos: `os seis planetas do eixo tecnico existem`, `todo taxonomyId ... resolve` e `MUTACAO: main devolve 0` |

A mutação 1 existe para provar uma coisa específica: que o teste de "sem
destino" morde **sozinho**, sem depender do validador. O validador aceita `null`
por contrato — é o que permitia as 16 entradas nulas passarem verdes até hoje.
Se a mutação 1 deixar `main` vermelho, o contrato do validador mudou e isso é
outro achado.

Registre o resultado assim, no commit:

```
previsto 2/3/3 vermelhos; observado <n>/<n>/<n>
```

- [ ] **Step 7: Rodar o gate inteiro de conteúdo**

```bash
node scripts/content/validate-foundation.mjs
```

```bash
node --test scripts/content/validate-content-anchoring.test.mjs scripts/content/validate-taxonomy-map.test.mjs
```

```bash
node --test scripts/content/wave-1-priority-tracks.test.mjs
```

Esperado: os três verdes. O terceiro é o que pegaria uma quebra em
`wave-1-priority-tracks.json`, que este plano não toca — é contraprova.

- [ ] **Step 8: Commit**

```bash
git add content-manifest/taxonomy-catalog-map.json scripts/content/validate-taxonomy-map.test.mjs
git commit -m "feat(taxonomia): as 16 licoes ai-lesson ganham destino, e zero segue nulo"
```

---

## Fechamento do run

Depois da Task 2, e **sem encadear com `&&`**, conferindo o `code` de cada
resposta:

```bash
loop validate --run <runId>
```

```bash
loop step finish --run <runId>
```

```bash
loop memory write --run <runId> --input <candidato.json>
```

```bash
loop run close --run <runId>
```

Confira, um a um: `VALIDATION_PASSED`, `STEP_SUCCEEDED`, `MEMORY_WRITTEN`,
`RUN_CLOSED`.

Há aprendizado durável nesta entrega — a existência de dois catálogos
divergentes do mesmo universo —, então **o embrulho `fechar.mjs` não serve**:
ele fecha o run sem passo de memória, e depois de `run close` não existe
transição para `memory_written`.

Ao montar `evidenceIds`, filtre `payload.status == "passed"` e colha o `id` de
**topo** do evento, não um campo do `payload`. Mantenha o `summary` abaixo de
1000 caracteres.

## O que este plano deliberadamente não faz

- **Não reconcilia os dois catálogos.** `radiant-app/src/data/galaxy-catalog.ts`
  segue com `galaxy-casos` que a taxonomia não tem, sem `galaxy-patologias` que a
  taxonomia tem, e com `galaxy-fisica` intitulada "Física Radiológica" contra
  "Fundamentos". É trabalho próprio, com decisão de produto, e está registrado no
  desenho.
- **Não cria estrelas.** Decisão do dono: estrela é trilha curta complementar e
  não há nenhuma produzida.
- **Não corrige `wave-1-priority-tracks.json`,** que distribui as 16 lições em
  trilhas com nome de anatomia onde elas não pertencem. Já registrado como item
  aberto próprio no status canônico.
- **Não toca o bundle do app.** Nenhum destes registros chega ao usuário hoje.
