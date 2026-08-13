# Fiação da cadeia de conteúdo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dar ponto de entrada às funções puras de conteúdo entregues pelas Tasks 1–8 e produzir o primeiro dado real ancorado, para que o validador estrito passe a ter o que validar.

**Architecture:** nenhuma função pura muda. Cada uma ganha um runner fino no mesmo arquivo — carregadores testáveis mais um `main()` — seguindo o padrão que já existe em `extract-source.py`. A cadeia roda em sequência: extrair → manifesto (filtrado por direitos) → claims à mão com `excerptId` → resolver os hashes → validar. Nenhum passo toca a rede. O validador estrito só entra no `.loop/project.yaml` na última task, quando já existe dado real para ele reprovar ou aprovar.

**Tech Stack:** Python 3 (`pypdf==6.9.2`, `unittest`), Node 20 (`node --test`), CLI `loop`. Nada de cliente de IA nesta passada.

**Spec:** [`docs/superpowers/specs/2026-08-07-fiacao-cadeia-conteudo-design.md`](../specs/2026-08-07-fiacao-cadeia-conteudo-design.md)

## Global Constraints

- **Toda alteração de arquivo passa pelo Loop.** Abrir com `node scripts/loop/abrir.mjs "<descrição>" <arquivo>...` **antes** de criar qualquer arquivo, declarando todos os arquivos da task.
- **Ordem de fechamento, não negociável:** `loop validate` → `loop step finish` → (`loop memory write`) → `loop run close`. **Nunca encadear com `&&`** — a CLI reporta erro no corpo do JSON com status de saída zero. Conferir o `code` de cada resposta separadamente.
- **`scripts/loop/fechar.mjs` só serve para task SEM memória** — ele fecha o run incondicionalmente e depois de `run close` não há transição para `memory_written`.
- **Não rodar `loop validate` enquanto um E2E estiver em execução** — 2,3× de desaceleração medida no emulador.
- **Testes Python:** `python3 scripts/content/<nome>.test.py`. Os scripts têm hífen no nome, então os testes carregam o módulo por `importlib.util.spec_from_file_location` — copiar o preâmbulo de `build-manifest.test.py`.
- **Testes Node:** `node --test scripts/content/<nome>.test.mjs`.
- **Padrão de runner:** `argparse` (ou `process.argv`), `main()`, resumo em JSON no stdout, **saída não-zero em erro**.
- **Prova de mutação obrigatória:** cada ramo novo tem um teste que fica vermelho quando o ramo é neutralizado. **Casar a mensagem, nunca a contagem.**
- **Fixture de dublê é tipado, nunca `as any`.**
- **Um teste de reaproveitamento só mede reaproveitamento se a primeira passada TIVER chamado.** Afirmar que o recurso existiu antes de afirmar que ele sumiu.
- **`Conteúdo/` está em `.git/info/exclude`**; `content-manifest/` é rastreado. Artefato que precisa ser auditável nasce em `content-manifest/`.
- **Todo passo que gera subproduto fora de `writePolicy.allowedRoots` roda ANTES do `abrir.mjs`.** O guarda de escopo do Loop compara o repositório inteiro contra a baseline tirada na abertura do run, e `.gitignore` **não** é `context.excludes` — um arquivo pode estar fora do git e ainda assim derrubar `step finish` com `OUT_OF_SCOPE_CHANGE`. Medido em 2026-08-07 na primeira execução da Task 2. De `needs_human` não existe transição para `memory_written`: o run só pode ser fechado ou revertido, e o aprendizado dele se perde.
- **Guarda de entrypoint em ESM:** usar `pathToFileURL(process.argv[1]).href`, **nunca** `file://${process.argv[1]}` — os caminhos deste repositório têm acento e o segundo quebra silenciosamente.

## File Structure

| Arquivo | Responsabilidade | Task |
| --- | --- | --- |
| `scripts/content/validate-taxonomy-map.mjs` | `mapErrors` (puro, inalterado) + `loadInputs` + `main` | 1 |
| `scripts/content/validate-taxonomy-map.test.mjs` | testes do carregador e do código de saída | 1 |
| `scripts/content/build-manifest.py` | funções puras (inalteradas) + `rights_by_slug` + `partition_excerpts` + `main` | 2 |
| `scripts/content/build-manifest.test.py` | testes do filtro de direitos e do relatório de descarte | 2 |
| `content-manifest/excerpts/manifest.jsonl` | manifesto de excertos citáveis (rastreado) | 2 |
| `content-manifest/excerpts/descartes.json` | quem ficou de fora e por quê (rastreado) | 2 |
| `content-manifest/lessons/<aula>.claims.json` | afirmações humanas do piloto, cada uma com seu `excerptId` (rastreado) | 4 |
| `scripts/content/anchor-lesson.py` | funções puras (inalteradas) + `load_allowed` + `resolve_anchors` + `main` | 5 |
| `scripts/content/anchor-lesson.test.py` | testes de `load_allowed`, `resolve_anchors` e da forma das claims | 4, 5 |
| `content-manifest/lessons/<aula>.anchored.json` | saída da ancoragem (rastreado) | 5 |
| `scripts/content/validate-content-anchoring.mjs` | `anchoringErrors` (puro, inalterado) + `loadLesson` + `main` | 6 |
| `scripts/content/validate-content-anchoring.test.mjs` | testes existentes + testes do runner | 6 |
| `.loop/project.yaml` | novo validador `content-anchoring-data` | 6 |

> **Task 3 adiada em 2026-08-07, por decisão do dono de rodar somente local.**
> Não há motor de embedding disponível na máquina — medido: `ollama` ausente,
> nada em `127.0.0.1:11434`, sem `torch` nem `sentence-transformers`, e o `lms`
> do LM Studio sem daemon instalado; o modelo de 8,7 GB em `~/.lmstudio` é um
> instruct, não um embedder. A cadeia fecha assim mesmo, porque
> **`anchoringErrors` nunca lê um vetor**: ele checa `excerptId` presente,
> pertencimento ao manifesto, `rightsClass` e hash. Os embeddings serviam apenas
> para `anchor_report` **descobrir** a âncora por similaridade, e num piloto de
> 5–10 claims escritas à mão o humano que lê os excertos atribui o `excerptId`
> melhor do que o cosseno. `embed-excerpts.py` e `anchor_report` seguem funções
> puras com testes, sem runner, até existir motor local — e nada em
> `content-manifest/embeddings/` chega a ser criado nesta passada.

---

### Task 1: Runner do validador de taxonomia (Ponta A)

Independente do piloto: as três entradas já estão em disco. É a task que prova o padrão de runner ponta a ponta antes de qualquer coisa depender dele.

**Files:**
- Modify: `scripts/content/validate-taxonomy-map.mjs` (hoje 21 linhas, só `mapErrors`)
- Test: `scripts/content/validate-taxonomy-map.test.mjs`

**Interfaces:**
- Consumes: nada de tasks anteriores.
- Produces: `loadInputs(root: string) => { map: Array<{taxonomyId: string|null, catalogId: string, rationale: string}>, taxonomyIds: Set<string>, catalogIds: Set<string> }` e `main(root?: string) => number` (0 sucesso, 1 erro). `mapErrors` permanece com a assinatura atual.

- [ ] **Step 1: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Runner do validador de mapa de taxonomia" scripts/content/validate-taxonomy-map.mjs scripts/content/validate-taxonomy-map.test.mjs
```

Guarde o `runId` impresso.

- [ ] **Step 2: Escrever os testes que falham**

Acrescente ao fim de `scripts/content/validate-taxonomy-map.test.mjs` (mantenha os testes existentes de `mapErrors`):

```javascript
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadInputs, main } from './validate-taxonomy-map.mjs';

function arvoreDeFixture({ map, galaxias, planetas, estrelas, tracks }) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'taxonomia-'));
  mkdirSync(path.join(raiz, 'content-manifest'), { recursive: true });
  mkdirSync(path.join(raiz, 'Conteúdo', 'taxonomia'), { recursive: true });
  mkdirSync(path.join(raiz, 'Conteúdo', 'governança'), { recursive: true });

  const escrever = (relativo, valor) =>
    writeFileSync(path.join(raiz, relativo), JSON.stringify(valor), 'utf8');

  escrever(path.join('content-manifest', 'taxonomy-catalog-map.json'), map);
  escrever(path.join('Conteúdo', 'taxonomia', 'galaxias.json'), galaxias);
  escrever(path.join('Conteúdo', 'taxonomia', 'planetas.json'), planetas);
  escrever(path.join('Conteúdo', 'taxonomia', 'estrelas.json'), estrelas);
  escrever(path.join('Conteúdo', 'governança', 'wave-1-priority-tracks.json'), { version: 1, tracks });
  return raiz;
}

const FIXTURE_VALIDA = {
  map: [{ taxonomyId: 'star-torax', catalogId: 'ai-lesson:qualidade-de-imagem', rationale: 'x' }],
  galaxias: [{ id: 'galaxy-anatomia' }],
  planetas: [{ id: 'planet-torax' }],
  estrelas: [{ id: 'star-torax' }],
  tracks: [{ id: 'track-a', lessonIds: ['ai-lesson:qualidade-de-imagem', 'lesson-1'] }],
};

test('loadInputs une os tres arquivos de taxonomia num so conjunto', () => {
  const { taxonomyIds } = loadInputs(arvoreDeFixture(FIXTURE_VALIDA));
  assert.deepEqual([...taxonomyIds].sort(), ['galaxy-anatomia', 'planet-torax', 'star-torax']);
});

test('loadInputs colhe catalogIds da uniao de lessonIds, com e sem prefixo', () => {
  const { catalogIds } = loadInputs(arvoreDeFixture(FIXTURE_VALIDA));
  assert.equal(catalogIds.has('ai-lesson:qualidade-de-imagem'), true);
  assert.equal(catalogIds.has('lesson-1'), true);
});

test('MUTACAO: main devolve 0 quando o mapa fecha', () => {
  assert.equal(main(arvoreDeFixture(FIXTURE_VALIDA)), 0);
});

test('MUTACAO: main devolve 1 quando o mapa aponta para taxonomia inexistente', () => {
  const raiz = arvoreDeFixture({
    ...FIXTURE_VALIDA,
    map: [{ taxonomyId: 'star-fantasma', catalogId: 'ai-lesson:qualidade-de-imagem', rationale: 'x' }],
  });
  assert.equal(main(raiz), 1);
});
```

- [ ] **Step 3: Rodar os testes para verificar que falham**

Run: `node --test scripts/content/validate-taxonomy-map.test.mjs`
Expected: FAIL com `SyntaxError: The requested module './validate-taxonomy-map.mjs' does not provide an export named 'loadInputs'`

- [ ] **Step 4: Implementar o carregador e o `main`**

Acrescente ao fim de `scripts/content/validate-taxonomy-map.mjs`, deixando `mapErrors` exatamente como está:

```javascript
import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ARQUIVOS_DE_TAXONOMIA = ['galaxias.json', 'planetas.json', 'estrelas.json'];

function lerJson(caminho) {
  return JSON.parse(readFileSync(caminho, 'utf8'));
}

export function loadInputs(root) {
  const map = lerJson(path.join(root, 'content-manifest', 'taxonomy-catalog-map.json'));

  const taxonomyIds = new Set();
  for (const arquivo of ARQUIVOS_DE_TAXONOMIA) {
    for (const no of lerJson(path.join(root, 'Conteúdo', 'taxonomia', arquivo))) {
      taxonomyIds.add(no.id);
    }
  }

  const catalogIds = new Set();
  for (const track of lerJson(path.join(root, 'Conteúdo', 'governança', 'wave-1-priority-tracks.json')).tracks) {
    for (const lessonId of track.lessonIds) catalogIds.add(lessonId);
  }

  return { map, taxonomyIds, catalogIds };
}

export function main(root = process.cwd()) {
  const { map, taxonomyIds, catalogIds } = loadInputs(root);
  const erros = mapErrors({ map, taxonomyIds, catalogIds });
  process.stdout.write(
    JSON.stringify(
      { mapEntries: map.length, taxonomyIds: taxonomyIds.size, catalogIds: catalogIds.size, errors: erros },
      null,
      2,
    ) + '\n',
  );
  return erros.length === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
```

Os `import` precisam subir para o topo do arquivo — ESM não aceita import depois de código. Mova-os para a primeira linha e deixe o resto no fim.

- [ ] **Step 5: Rodar os testes para verificar que passam**

Run: `node --test scripts/content/validate-taxonomy-map.test.mjs`
Expected: PASS, todos.

- [ ] **Step 6: Rodar o runner contra o dado real**

Run: `node scripts/content/validate-taxonomy-map.mjs`
Expected: JSON com `mapEntries: 16`, `taxonomyIds: 15`, `catalogIds: 18`. **O `errors` pode não estar vazio** — os 16 nós seguem com `taxonomyId: null` por decisão em aberto do dono, e `mapErrors` não reclama de `taxonomyId` nulo, mas pode reclamar de outra coisa. Se houver erro, **registre a saída no relatório da task e não conserte o dado**: corrigir o mapa é decisão de escopo de taxonomia, que é do dono e está listada em aberto.

- [ ] **Step 7: Prova de mutação**

Comente a linha `taxonomyIds.add(no.id);` e rode `node --test scripts/content/validate-taxonomy-map.test.mjs`.
Expected: os testes `loadInputs une os tres arquivos...` e `MUTACAO: main devolve 0...` ficam vermelhos. Restaure a linha e confirme que voltam ao verde. Registre as duas passadas no relatório.

- [ ] **Step 8: Commit**

```bash
git add scripts/content/validate-taxonomy-map.mjs scripts/content/validate-taxonomy-map.test.mjs
git commit -m "feat(conteudo): ponto de entrada do validador de mapa de taxonomia"
```

- [ ] **Step 9: Fechar o run** — sem memória, então o invólucro serve

```bash
node scripts/loop/fechar.mjs <runId>
```

---

### Task 2: Extração do piloto e runner do manifesto com filtro de direitos

**Files:**
- Modify: `scripts/content/build-manifest.py` (hoje 25 linhas)
- Test: `scripts/content/build-manifest.test.py`
- Create (rastreado): `content-manifest/excerpts/manifest.jsonl`, `content-manifest/excerpts/descartes.json`
- Produz fora do versionamento: `Conteúdo/extrações/<slug>/{pages,excerpts}.json`

**Interfaces:**
- Consumes: nada de tasks anteriores.
- Produces: `rights_by_slug(catalog: dict, normalize: Callable[[str], str]) -> dict[str, dict]`; `partition_excerpts(excerpts: list[dict], rights: dict) -> tuple[list[dict], list[dict]]` devolvendo `(linhas_de_manifesto, descartes)`; `main() -> int`. As linhas de manifesto têm as chaves `id`, `sourceSlug`, `pageStart`, `pageEnd`, `hash`, `rightsClass` — Task 3 e Task 5 leem exatamente `id` e `hash`.

- [ ] **Step 1: Extrair o PDF do piloto — ANTES de abrir o run**

> **Corrigido em 2026-08-07, depois de a primeira execução travar aqui.** Este
> passo vinha **depois** do `abrir.mjs`, e isso derruba o run: o extrator escreve
> `pages.json` e `excerpts.json` em `Conteúdo/extrações/<slug>/`, que não está em
> `context.excludes` nem em `writePolicy.allowedRoots`. O guarda de escopo do
> Loop vigia o repositório inteiro durante a janela de edição — e `.gitignore`
> não é `context.excludes`, são duas listas independentes. `loop step finish`
> devolveu `OUT_OF_SCOPE_CHANGE`, o run caiu em `needs_human`, e de lá **não há
> transição para `memory_written`**: o aprendizado do run se perde e o lock de
> escritor fica preso até alguém fechar à mão. A extração é subproduto fora da
> política, então ela roda **fora da transação**.

O runner precisa de excertos, e a única extração existente é de fonte `blocked`. Rode o extrator, que **já tem ponto de entrada**:

```bash
python3 scripts/content/extract-source.py --source "Conteúdo/Atualiza-o-em-Mamografia-para-T-cnicos-em-Radiologia-INCA.pdf" --output-dir "Conteúdo/extrações/atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca"
```

Expected: JSON com `sourceSlug`, `pageCount` e `excerptCount`. Confira que o `sourceSlug` impresso é `atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca` — ele é derivado do nome do arquivo por `normalize_source_slug` e é a chave que liga o excerto ao catálogo de direitos. Se sair diferente, **use o valor impresso** e ajuste o `--output-dir`; não force o nome.

Nada disso entra em git: `Conteúdo/` está excluído — e, como o passo roda antes do `abrir.mjs`, os arquivos já existem na baseline do run e não contam como mudança.

- [ ] **Step 2: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Runner do manifesto de excertos com filtro de direitos na entrada" scripts/content/build-manifest.py scripts/content/build-manifest.test.py content-manifest/excerpts/manifest.jsonl content-manifest/excerpts/descartes.json
```

- [ ] **Step 3: Escrever os testes que falham**

Acrescente a `scripts/content/build-manifest.test.py`, mantendo a classe existente:

```python
CATALOGO = {
    "schemaVersion": 1,
    "sources": [
        {
            "id": "library-source:autorizada",
            "primaryPath": "Conteúdo/Fonte-Autorizada.pdf",
            "rightsClass": "authorized",
            "commercialUse": False,
        },
        {
            "id": "library-source:bloqueada",
            "primaryPath": "Conteúdo/Fonte-Bloqueada.pdf",
            "rightsClass": "blocked",
            "commercialUse": False,
        },
    ],
}


def slug_simples(nome):
    return nome.rsplit(".", 1)[0].lower().replace("-", "-")


class FiltroDeDireitosTest(unittest.TestCase):
    def setUp(self):
        self.direitos = MODULE.rights_by_slug(CATALOGO, slug_simples)
        self.autorizado = dict(EXCERPT, id="excerpt:a:p1:c1", sourceSlug="fonte-autorizada")
        self.bloqueado = dict(EXCERPT, id="excerpt:b:p1:c1", sourceSlug="fonte-bloqueada")
        self.orfao = dict(EXCERPT, id="excerpt:o:p1:c1", sourceSlug="fonte-que-nao-esta-no-catalogo")

    def test_fonte_bloqueada_nao_gera_linha(self):
        linhas, _ = MODULE.partition_excerpts([self.autorizado, self.bloqueado], self.direitos)
        self.assertEqual([l["id"] for l in linhas], ["excerpt:a:p1:c1"])

    def test_descarte_nomeia_a_fonte_e_o_motivo(self):
        _, descartes = MODULE.partition_excerpts([self.bloqueado], self.direitos)
        self.assertEqual(len(descartes), 1)
        self.assertEqual(descartes[0]["sourceId"], "library-source:bloqueada")
        self.assertEqual(descartes[0]["rightsClass"], "blocked")
        self.assertIn("nao autorizada", descartes[0]["motivo"])

    def test_fonte_ausente_do_catalogo_e_descarte_com_motivo_proprio(self):
        linhas, descartes = MODULE.partition_excerpts([self.orfao], self.direitos)
        self.assertEqual(linhas, [])
        self.assertIn("ausente do catalogo", descartes[0]["motivo"])

    def test_a_linha_aceita_carrega_a_classe_da_fonte(self):
        linhas, _ = MODULE.partition_excerpts([self.autorizado], self.direitos)
        self.assertEqual(linhas[0]["rightsClass"], "authorized")
```

Os três `motivo` são mensagens distintas de propósito: um teste que casasse só a contagem de descartes ficaria verde com qualquer um dos dois ramos morto.

- [ ] **Step 4: Rodar os testes para verificar que falham**

Run: `python3 scripts/content/build-manifest.test.py`
Expected: FAIL com `AttributeError: module 'build_manifest' has no attribute 'rights_by_slug'`

- [ ] **Step 5: Implementar**

Acrescente a `scripts/content/build-manifest.py`, sem tocar em `excerpt_hash`, `manifest_line` e `write_manifest`:

```python
import argparse
import importlib.util
import sys

MOTIVO_SEM_CATALOGO = "fonte ausente do catalogo de direitos"
MOTIVO_SEM_AUTORIZACAO = "classe de direitos nao autorizada"


def rights_by_slug(catalog: dict, normalize) -> dict[str, dict]:
    tabela: dict[str, dict] = {}
    for fonte in catalog["sources"]:
        slug = normalize(Path(fonte["primaryPath"]).name)
        tabela[slug] = {
            "sourceId": fonte["id"],
            "rightsClass": fonte["rightsClass"],
            "commercialUse": fonte.get("commercialUse"),
        }
    return tabela


def partition_excerpts(excerpts: list[dict], rights: dict) -> tuple[list[dict], list[dict]]:
    linhas: list[dict] = []
    descartes: list[dict] = []
    for excerpt in excerpts:
        info = rights.get(excerpt["sourceSlug"])
        if info is None:
            descartes.append(
                {
                    "excerptId": excerpt["id"],
                    "sourceSlug": excerpt["sourceSlug"],
                    "sourceId": None,
                    "rightsClass": None,
                    "motivo": MOTIVO_SEM_CATALOGO,
                }
            )
            continue
        if info["rightsClass"] != "authorized":
            descartes.append(
                {
                    "excerptId": excerpt["id"],
                    "sourceSlug": excerpt["sourceSlug"],
                    "sourceId": info["sourceId"],
                    "rightsClass": info["rightsClass"],
                    "motivo": MOTIVO_SEM_AUTORIZACAO,
                }
            )
            continue
        linhas.append(manifest_line(excerpt, info["rightsClass"]))
    return linhas, descartes


def write_descartes(descartes: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps({"descartes": descartes}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def _normalize_source_slug():
    spec = importlib.util.spec_from_file_location(
        "extract_source", Path(__file__).with_name("extract-source.py")
    )
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo.normalize_source_slug


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--extractions", required=True, help="raiz de Conteúdo/extrações")
    parser.add_argument("--catalog", required=True)
    parser.add_argument("--out-dir", required=True)
    args = parser.parse_args()

    catalog = json.loads(Path(args.catalog).read_text(encoding="utf-8"))
    direitos = rights_by_slug(catalog, _normalize_source_slug())

    excerpts: list[dict] = []
    for arquivo in sorted(Path(args.extractions).glob("*/excerpts.json")):
        excerpts.extend(json.loads(arquivo.read_text(encoding="utf-8"))["excerpts"])

    linhas, descartes = partition_excerpts(excerpts, direitos)
    out = Path(args.out_dir)
    write_manifest(linhas, out / "manifest.jsonl")
    write_descartes(descartes, out / "descartes.json")

    print(
        json.dumps(
            {"excerptsLidos": len(excerpts), "linhas": len(linhas), "descartes": len(descartes)},
            ensure_ascii=False,
        )
    )
    return 0 if linhas else 1


if __name__ == "__main__":
    sys.exit(main())
```

Duas escolhas deliberadas:

- `return 0 if linhas else 1` — manifesto vazio é falha, não sucesso silencioso. É a mesma decisão do spec: verde significa "validei dados".
- `_normalize_source_slug()` importa a função de `extract-source.py` em vez de reimplementar o slug. Custa carregar `pypdf` (fixado em `scripts/content/requirements.txt`), e paga: duas implementações do slug divergiriam em silêncio, e a divergência apareceria como excerto órfão do catálogo — o descarte mais difícil de diagnosticar. Por isso `rights_by_slug` recebe `normalize` por parâmetro: o teste injeta um slug simples e não toca `pypdf`.

- [ ] **Step 6: Rodar os testes para verificar que passam**

Run: `python3 scripts/content/build-manifest.test.py`
Expected: PASS, todos.

- [ ] **Step 7: Rodar o runner contra o dado real**

```bash
python3 scripts/content/build-manifest.py --extractions "Conteúdo/extrações" --catalog "Conteúdo/fontes/library-catalog.json" --out-dir content-manifest/excerpts
```

Expected: saída não-zero de `excerptsLidos` (soma do piloto com os 109 da fonte bloqueada), `linhas` só do piloto, e `descartes` com pelo menos 109 — os da fonte `blocked` já extraída. Confira em `content-manifest/excerpts/descartes.json` que `library-source:f375049d4e936d05` aparece com `motivo` de classe não autorizada. **Esse é o teste de aceitação da decisão da Seção 1 do spec.**

- [ ] **Step 8: Prova de mutação**

Troque `if info["rightsClass"] != "authorized":` por `if False:` e rode `python3 scripts/content/build-manifest.test.py`.
Expected: `test_fonte_bloqueada_nao_gera_linha` e `test_descarte_nomeia_a_fonte_e_o_motivo` vermelhos, `test_fonte_ausente_do_catalogo...` **verde** (é o outro ramo). Restaure e confirme o verde geral. Repita neutralizando `if info is None:` para `if False:`: espere `test_fonte_ausente_do_catalogo...` vermelho com `KeyError`/`TypeError` e os outros verdes. Registre as quatro passadas.

- [ ] **Step 9: Commit**

```bash
git add scripts/content/build-manifest.py scripts/content/build-manifest.test.py content-manifest/excerpts/manifest.jsonl content-manifest/excerpts/descartes.json
git commit -m "feat(conteudo): manifesto de excertos com filtro de direitos na entrada"
```

- [ ] **Step 10: Fechar o run** — esta task tem aprendizado durável (o primeiro manifesto real e a contagem de descartes), então **não** use `fechar.mjs`

```bash
loop validate --run <runId>
```
Confira `code == VALIDATION_PASSED`. Depois, em chamadas separadas e conferindo o `code` de cada uma: `loop step finish --run <runId>` (`STEP_SUCCEEDED`), `loop memory write --run <runId> --input <candidato.json>` (`MEMORY_WRITTEN`), `loop run close --run <runId>` (`RUN_CLOSED`). No candidato, colha `evidenceIds` do `.loop/runs/<runId>/events.jsonl` filtrando `type == "validator"` e `payload.status == "passed"`, tomando o `id` **de topo** do evento, e mantenha o `summary` abaixo de 1000 caracteres.

---

### Task 3: Runner dos embeddings de excerto — ADIADA

**Não execute esta task.** Adiada em 2026-08-07 por decisão do dono de rodar
somente local, e não há motor de embedding na máquina. A justificativa completa,
com as medições, está na seção "File Structure" acima.

O que fica pendente, para quando existir um embedder local: dar `main()` a
`scripts/content/embed-excerpts.py` (reaproveitando por hash via `needs_embedding`),
acrescentar `content-manifest/embeddings/` ao `.gitignore`, e dar `main()` à
ancoragem por similaridade de `anchor_report` em `anchor-lesson.py`. As duas
funções continuam puras e testadas; o que falta é ponto de entrada, e a cadeia
viva desta passada será o instrumento contra o qual medir a similaridade quando
ela entrar.

**A cadeia segue da Task 2 direto para a Task 4.**

### Task 4: Claims do piloto, escritas à mão

Esta task **não tem código de produção**. O entregável é dado, e a validação é de forma.

**Files:**
- Create: `content-manifest/lessons/ai-lesson-qualidade-de-imagem.claims.json`
- Test: `scripts/content/anchor-lesson.test.py` (só o teste de forma; o runner vem na Task 5)

**Interfaces:**
- Consumes: `content-manifest/excerpts/manifest.jsonl` (296 linhas, todas do piloto) e os textos em `Conteúdo/extrações/atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca/excerpts.json`.
- Produces: arquivo no formato `{"lessonId": str, "claims": [{"id": str, "claim": str, "excerptId": str}]}`. A Task 5 resolve o `hash` de cada `excerptId` contra o manifesto. O arquivo em disco **não** guarda hash nem vetor: hash é derivado, e derivado escrito à mão envelhece errado.

O nó do catálogo é `ai-lesson:qualidade-de-imagem`, escolhido pelo dono em 2026-08-07. Nenhum dos 16 nós `ai-lesson:` é de mamografia, que é o assunto da fonte; este é o mais próximo porque o texto do INCA tem seção substancial de controle de qualidade.

- [ ] **Step 1: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Claims escritas a mao para o piloto de ancoragem" content-manifest/lessons/ai-lesson-qualidade-de-imagem.claims.json scripts/content/anchor-lesson.test.py
```

- [ ] **Step 2: Ler os excertos e escrever 5 a 10 afirmações**

Leia `Conteúdo/extrações/atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca/excerpts.json` e escolha excertos que sustentem afirmações sobre qualidade de imagem. Para cada afirmação, registre o `id` do excerto que a sustenta — ele tem a forma `excerpt:atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca:p<N>:c<M>`.

```json
{
  "lessonId": "ai-lesson:qualidade-de-imagem",
  "claims": [
    {
      "id": "claim:qualidade-de-imagem:1",
      "claim": "O controle de qualidade em mamografia inclui avaliação periódica do equipamento.",
      "excerptId": "excerpt:atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca:p42:c1"
    }
  ]
}
```

Regras, e cada uma existe porque o contrário produz dado real com conclusão falsa:

- A afirmação é factual e verificável, uma ideia por claim.
- **Sem número que o excerto não traga.** Se o texto não diz o valor, a claim não diz.
- **Sem copiar frase do original.** A claim é afirmação; o excerto é a prova. Copiar transforma a claim numa citação e a ancoragem em tautologia.
- O `excerptId` tem de existir no manifesto. Se o excerto que você quer não está lá, ele é de fonte não autorizada — escolha outro, não force.

- [ ] **Step 3: Escrever o teste de forma**

Crie `scripts/content/anchor-lesson.test.py` com o preâmbulo de `importlib` copiado de `build-manifest.test.py`, apontando para `anchor-lesson.py`, e acrescente:

```python
class ClaimsDoPilotoTest(unittest.TestCase):
    def setUp(self):
        raiz = Path(__file__).resolve().parents[2]
        self.pasta = raiz / "content-manifest" / "lessons"
        self.manifesto = {
            json.loads(l)["id"]
            for l in (raiz / "content-manifest" / "excerpts" / "manifest.jsonl")
            .read_text(encoding="utf-8")
            .splitlines()
            if l.strip()
        }

    def test_ha_pelo_menos_um_arquivo_de_claims(self):
        self.assertTrue(sorted(self.pasta.glob("*.claims.json")))

    def test_forma_do_arquivo_de_claims(self):
        for arquivo in sorted(self.pasta.glob("*.claims.json")):
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
            self.assertTrue(dados["lessonId"].startswith("ai-lesson:"))
            self.assertGreaterEqual(len(dados["claims"]), 5)
            self.assertLessEqual(len(dados["claims"]), 10)
            ids = [c["id"] for c in dados["claims"]]
            self.assertEqual(len(ids), len(set(ids)), "ids de claim repetidos")
            for c in dados["claims"]:
                self.assertTrue(c["claim"].strip())
                self.assertNotIn("hash", c, "hash e derivado; a Task 5 resolve")
                self.assertNotIn("vector", c, "o arquivo em disco nao guarda vetor")

    def test_todo_excerptId_existe_no_manifesto(self):
        for arquivo in sorted(self.pasta.glob("*.claims.json")):
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
            for c in dados["claims"]:
                self.assertIn(
                    c["excerptId"],
                    self.manifesto,
                    f"{c['id']} aponta para excerto fora do manifesto",
                )
```

O terceiro teste é o que impede o defeito mais provável desta task: um `excerptId` digitado com o número de página errado passa despercebido até a Task 6, e lá aparece como "excerto fora do manifesto" sem dizer que a causa foi um dedo trocado.

- [ ] **Step 4: Rodar o teste**

Run: `python3 scripts/content/anchor-lesson.test.py`
Expected: PASS, os três.

- [ ] **Step 5: Commit**

```bash
git add content-manifest/lessons/ scripts/content/anchor-lesson.test.py
git commit -m "feat(conteudo): claims do piloto escritas a mao sobre fonte autorizada"
```

- [ ] **Step 6: Fechar o run** — sem memória

```bash
node scripts/loop/fechar.mjs <runId>
```

---

### Task 5: Runner da ancoragem

Sem motor de embedding (Task 3 adiada), a ancoragem é resolução de hash, não busca por similaridade: o `excerptId` já veio escolhido pelo humano na Task 4, e o runner só precisa provar que ele está no manifesto e carimbar o hash vigente.

**Files:**
- Modify: `scripts/content/anchor-lesson.py` (hoje 36 linhas)
- Test: `scripts/content/anchor-lesson.test.py`
- Create (rastreado): `content-manifest/lessons/ai-lesson-qualidade-de-imagem.anchored.json`

**Interfaces:**
- Consumes: manifesto da Task 2 (`id`, `hash`), claims da Task 4 (`{"lessonId","claims":[{"id","claim","excerptId"}]}`).
- Produces: `load_allowed(manifest_lines: list[dict]) -> dict[str, str]` mapeando `excerptId -> hash`; `resolve_anchors(claims: list[dict], allowed: dict[str, str]) -> dict` no formato `{"claims": [{"claim", "excerptId", "hash"}], "unanchored": int}`; `main() -> int`. `cosine`, `best_anchor` e `anchor_report` permanecem **inalteradas e sem runner**.

O formato de saída de `resolve_anchors` é deliberadamente o mesmo de `anchor_report` menos o campo `similarity`, para que a Task 6 e o `anchoringErrors` não precisem saber qual dos dois produziu o arquivo.

- [ ] **Step 1: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Runner da ancoragem por resolucao de hash" scripts/content/anchor-lesson.py scripts/content/anchor-lesson.test.py content-manifest/lessons/ai-lesson-qualidade-de-imagem.anchored.json
```

- [ ] **Step 2: Escrever os testes que falham**

Acrescente a `scripts/content/anchor-lesson.test.py`:

```python
class LoadAllowedTest(unittest.TestCase):
    def test_allowed_liga_id_ao_hash_do_manifesto(self):
        linhas = [
            {"id": "excerpt:a:p1:c1", "hash": "h1", "rightsClass": "authorized"},
            {"id": "excerpt:b:p2:c1", "hash": "h2", "rightsClass": "authorized"},
        ]
        self.assertEqual(
            MODULE.load_allowed(linhas), {"excerpt:a:p1:c1": "h1", "excerpt:b:p2:c1": "h2"}
        )


class ResolveAnchorsTest(unittest.TestCase):
    def setUp(self):
        self.allowed = {"excerpt:a:p1:c1": "h1"}

    def test_carimba_o_hash_vigente_do_manifesto(self):
        claims = [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:a:p1:c1"}]
        r = MODULE.resolve_anchors(claims, self.allowed)
        self.assertEqual(r["claims"][0]["hash"], "h1")
        self.assertEqual(r["claims"][0]["excerptId"], "excerpt:a:p1:c1")
        self.assertEqual(r["unanchored"], 0)

    def test_excerto_fora_do_manifesto_conta_como_nao_ancorado(self):
        claims = [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:fantasma:p9:c9"}]
        r = MODULE.resolve_anchors(claims, self.allowed)
        self.assertIsNone(r["claims"][0]["hash"])
        self.assertEqual(r["unanchored"], 1)

    def test_a_saida_nao_carrega_similarity(self):
        claims = [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:a:p1:c1"}]
        r = MODULE.resolve_anchors(claims, self.allowed)
        self.assertNotIn("similarity", r["claims"][0])
```

- [ ] **Step 3: Rodar os testes para verificar que falham**

Run: `python3 scripts/content/anchor-lesson.test.py`
Expected: FAIL com `AttributeError: module 'anchor_lesson' has no attribute 'load_allowed'`

- [ ] **Step 4: Implementar**

Acrescente a `scripts/content/anchor-lesson.py`, sem tocar em `cosine`, `best_anchor` e `anchor_report`:

```python
import argparse
import json
import sys
from pathlib import Path


def load_allowed(manifest_lines: list[dict]) -> dict[str, str]:
    return {linha["id"]: linha["hash"] for linha in manifest_lines}


def resolve_anchors(claims: list[dict], allowed: dict[str, str]) -> dict:
    linhas, sem_ancora = [], 0
    for claim in claims:
        excerpt_id = claim["excerptId"]
        hash_vigente = allowed.get(excerpt_id)
        if hash_vigente is None:
            sem_ancora += 1
        linhas.append(
            {"claim": claim["claim"], "excerptId": excerpt_id, "hash": hash_vigente}
        )
    return {"claims": linhas, "unanchored": sem_ancora}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--claims", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    aula = json.loads(Path(args.claims).read_text(encoding="utf-8"))
    linhas = [
        json.loads(l)
        for l in Path(args.manifest).read_text(encoding="utf-8").splitlines()
        if l.strip()
    ]
    relatorio = resolve_anchors(aula["claims"], load_allowed(linhas))

    saida = {"lessonId": aula["lessonId"], **relatorio}
    destino = Path(args.out)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "lessonId": aula["lessonId"],
                "claims": len(relatorio["claims"]),
                "unanchored": relatorio["unanchored"],
            },
            ensure_ascii=False,
        )
    )
    return 0 if relatorio["unanchored"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 5: Rodar os testes para verificar que passam**

Run: `python3 scripts/content/anchor-lesson.test.py`
Expected: PASS, todos — inclusive os três da Task 4.

- [ ] **Step 6: Rodar o runner contra o dado real**

```bash
python3 scripts/content/anchor-lesson.py --claims content-manifest/lessons/ai-lesson-qualidade-de-imagem.claims.json --manifest content-manifest/excerpts/manifest.jsonl --out content-manifest/lessons/ai-lesson-qualidade-de-imagem.anchored.json
```

Expected: `unanchored: 0`. Se não for zero, **não baixe a régua**: algum `excerptId` da Task 4 não está no manifesto, e a correção é o `excerptId`, não o runner.

- [ ] **Step 7: Prova de mutação**

Troque `if hash_vigente is None:` por `if False:` e rode os testes.
Expected: `test_excerto_fora_do_manifesto_conta_como_nao_ancorado` vermelho na asserção de `unanchored`; os outros verdes. Restaure e confirme o verde geral. Depois troque `load_allowed` para devolver `{}`: espere `test_allowed_liga_id_ao_hash_do_manifesto` e `test_carimba_o_hash_vigente_do_manifesto` vermelhos. Registre as quatro passadas.

- [ ] **Step 8: Commit**

```bash
git add scripts/content/anchor-lesson.py scripts/content/anchor-lesson.test.py content-manifest/lessons/
git commit -m "feat(conteudo): ponto de entrada da ancoragem por resolucao de hash"
```

- [ ] **Step 9: Fechar o run** — com memória (primeira aula ancorada em dado real), seguindo o ritual do Step 10 da Task 2

---

### Task 6: Runner do validador estrito e entrada no gate

**Files:**
- Modify: `scripts/content/validate-content-anchoring.mjs` (hoje 25 linhas), `.loop/project.yaml`
- Test: `scripts/content/validate-content-anchoring.test.mjs`

**Interfaces:**
- Consumes: `content-manifest/lessons/*.anchored.json` da Task 5 e `content-manifest/excerpts/manifest.jsonl` da Task 2.
- Produces: `loadLesson(path: string) => {claims: Array<{claim: string, excerptId: string|null, hash: string|null}>}`, `loadManifest(path: string) => Array<object>`, `main(root?: string) => number`. `anchoringErrors` permanece inalterada.

- [ ] **Step 1: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Validador estrito de ancoragem sobre dado real, e sua entrada no gate" scripts/content/validate-content-anchoring.mjs scripts/content/validate-content-anchoring.test.mjs .loop/project.yaml
```

`.loop/project.yaml` **está** em `writePolicy.allowedRoots` — nominalmente, como entrada própria, ainda que o diretório `.loop` não esteja. Conferido em 2026-08-07.

- [ ] **Step 2: Escrever os testes que falham**

Acrescente a `scripts/content/validate-content-anchoring.test.mjs`, mantendo os quatro testes de mutação existentes:

```javascript
test('main devolve 1 quando nao ha aula ancorada nenhuma', () => {
  const raiz = mkdtempSync(path.join(tmpdir(), 'ancoragem-'));
  mkdirSync(path.join(raiz, 'content-manifest', 'lessons'), { recursive: true });
  mkdirSync(path.join(raiz, 'content-manifest', 'excerpts'), { recursive: true });
  writeFileSync(path.join(raiz, 'content-manifest', 'excerpts', 'manifest.jsonl'), '', 'utf8');
  assert.equal(main(raiz), 1);
});

test('main devolve 0 quando toda claim de toda aula esta ancorada', () => {
  const raiz = arvoreComAula({
    manifesto: [{ id: 'excerpt:a:p1:c1', hash: 'h1', rightsClass: 'authorized' }],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: 'x', excerptId: 'excerpt:a:p1:c1', hash: 'h1' }] },
  });
  assert.equal(main(raiz), 0);
});

test('main devolve 1 quando o hash do excerto mudou desde a ancoragem', () => {
  const raiz = arvoreComAula({
    manifesto: [{ id: 'excerpt:a:p1:c1', hash: 'OUTRO', rightsClass: 'authorized' }],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: 'x', excerptId: 'excerpt:a:p1:c1', hash: 'h1' }] },
  });
  assert.equal(main(raiz), 1);
});
```

O primeiro teste é a decisão do spec virando código: **ausência de dado reprova**. Sem ele, o validador passaria verde por vacuidade e a entrada no gate seria uma mentira.

O auxiliar `arvoreComAula`, no mesmo arquivo, acima dos testes:

```javascript
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { main } from './validate-content-anchoring.mjs';

function arvoreComAula({ manifesto, aula }) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'ancoragem-'));
  mkdirSync(path.join(raiz, 'content-manifest', 'lessons'), { recursive: true });
  mkdirSync(path.join(raiz, 'content-manifest', 'excerpts'), { recursive: true });

  writeFileSync(
    path.join(raiz, 'content-manifest', 'excerpts', 'manifest.jsonl'),
    manifesto.map((linha) => JSON.stringify(linha)).join('\n') + '\n',
    'utf8',
  );
  writeFileSync(
    path.join(raiz, 'content-manifest', 'lessons', 'piloto.anchored.json'),
    JSON.stringify(aula),
    'utf8',
  );
  return raiz;
}
```

- [ ] **Step 3: Rodar os testes para verificar que falham**

Run: `node --test scripts/content/validate-content-anchoring.test.mjs`
Expected: FAIL, `does not provide an export named 'main'`

- [ ] **Step 4: Implementar**

```javascript
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export function loadManifest(caminho) {
  return readFileSync(caminho, 'utf8')
    .split('\n')
    .filter((linha) => linha.trim())
    .map((linha) => JSON.parse(linha));
}

export function loadLesson(caminho) {
  return JSON.parse(readFileSync(caminho, 'utf8'));
}

export function main(root = process.cwd()) {
  const pastaDeAulas = path.join(root, 'content-manifest', 'lessons');
  const manifesto = loadManifest(path.join(root, 'content-manifest', 'excerpts', 'manifest.jsonl'));

  const aulas = existsSync(pastaDeAulas)
    ? readdirSync(pastaDeAulas).filter((nome) => nome.endsWith('.anchored.json'))
    : [];

  const relatorio = { aulas: aulas.length, excertos: manifesto.length, porAula: {} };

  if (aulas.length === 0) {
    relatorio.erro = 'nenhuma aula ancorada encontrada: verde so pode significar que validei dados';
    process.stdout.write(JSON.stringify(relatorio, null, 2) + '\n');
    return 1;
  }

  let total = 0;
  for (const nome of aulas) {
    const aula = loadLesson(path.join(pastaDeAulas, nome));
    const erros = anchoringErrors({ aula, manifesto });
    relatorio.porAula[nome] = erros;
    total += erros.length;
  }

  process.stdout.write(JSON.stringify(relatorio, null, 2) + '\n');
  return total === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
```

- [ ] **Step 5: Rodar os testes para verificar que passam**

Run: `node --test scripts/content/validate-content-anchoring.test.mjs`
Expected: PASS, incluindo os quatro testes de mutação que já existiam.

- [ ] **Step 6: Rodar o validador contra o dado real, FORA do gate**

Run: `node scripts/content/validate-content-anchoring.mjs`
Expected: código de saída 0 e `porAula` com lista vazia para a aula do piloto.

**Se não sair 0, pare aqui e não faça o Step 7.** Colocar no gate um validador que reprova trava todo `loop validate` do projeto para todas as IAs.

- [ ] **Step 7: Só então, entrar no gate**

Acrescente ao `validators:` de `.loop/project.yaml`, depois de `content-anchoring`:

```yaml
  - id: content-anchoring-data
    command: PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:/usr/bin:/bin node
      scripts/content/validate-content-anchoring.mjs
    timeoutMs: 120000
```

O validador `content-anchoring` existente **fica**: ele roda `node --test` sobre os testes unitários, e os dois medem coisas diferentes.

- [ ] **Step 8: Prova de mutação**

Troque `if (aulas.length === 0)` por `if (false)` e rode `node --test scripts/content/validate-content-anchoring.test.mjs`.
Expected: `main devolve 1 quando nao ha aula ancorada nenhuma` vermelho, os outros verdes. Restaure e confirme.

- [ ] **Step 9: Commit**

```bash
git add scripts/content/validate-content-anchoring.mjs scripts/content/validate-content-anchoring.test.mjs .loop/project.yaml
git commit -m "feat(conteudo): validador de ancoragem sobre dado real entra no gate"
```

- [ ] **Step 10: Fechar o run** — com memória (a cadeia fechou), seguindo o ritual do Step 10 da Task 2

- [ ] **Step 11: Sinalizar o trabalho, como o AGENTS.md exige**

Crie `docs/EXECUTION_STATUS_2026-<data>.md` dizendo qual documento substitui, registrando que a cadeia fechou, qual aula foi o piloto, quantos excertos entraram e quantos foram descartados. Isso vai em **run próprio**, não neste.

---

## Notas de escopo

**Fora deste plano, por decisão registrada no spec:**

- O extrator de claims por LLM. O piloto usa claims humanas; o extrator vem num plano seguinte, medido contra a cadeia viva.
- O eixo comercial dos direitos. As 4 fontes `authorized` são todas `commercialUse: false` e nenhum código lê esse campo. Não bloqueia a cadeia; bloqueia embarcar excerto verbatim num app com entitlement premium, e é decisão do dono.
- O escopo dos 16 nós de taxonomia (`taxonomyId: null`). A Task 1 pode expor erros do mapa; o plano manda **reportar**, não consertar.

**Dependências entre tasks:** 1 é independente e pode ir em qualquer momento. **3 está adiada.** A cadeia estrita é 2 → 4 → 5 → 6: a 4 precisa dos excertos e do manifesto da 2 para escolher `excerptId` que exista, e a 5 precisa das claims da 4.
