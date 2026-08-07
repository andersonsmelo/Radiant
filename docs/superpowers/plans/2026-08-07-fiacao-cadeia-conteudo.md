# Fiação da cadeia de conteúdo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dar ponto de entrada às funções puras de conteúdo entregues pelas Tasks 1–8 e produzir o primeiro dado real ancorado, para que o validador estrito passe a ter o que validar.

**Architecture:** nenhuma função pura muda. Cada uma ganha um runner fino no mesmo arquivo — carregadores testáveis mais um `main()` — seguindo o padrão que já existe em `extract-source.py`. A cadeia roda em sequência: extrair → manifesto (filtrado por direitos) → embeddings → claims à mão → ancorar → validar. O validador estrito só entra no `.loop/project.yaml` na última task, quando já existe dado real para ele reprovar ou aprovar.

**Tech Stack:** Python 3 (`pypdf==6.9.2`, `openai==1.75.0`, `unittest`), Node 20 (`node --test`), CLI `loop`.

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
| `scripts/content/embed-excerpts.py` | funções puras (inalteradas) + `embed_missing` + `main` | 3 |
| `scripts/content/embed-excerpts.test.py` | teste de reaproveitamento com dublê de embedder | 3 |
| `content-manifest/lessons/<aula>.claims.json` | afirmações humanas do piloto (rastreado) | 4 |
| `scripts/content/anchor-lesson.py` | funções puras (inalteradas) + `load_allowed` + `main` | 5 |
| `scripts/content/anchor-lesson.test.py` | teste de `load_allowed` e do relatório | 5 |
| `content-manifest/lessons/<aula>.anchored.json` | saída da ancoragem (rastreado) | 5 |
| `scripts/content/validate-content-anchoring.mjs` | `anchoringErrors` (puro, inalterado) + `loadLesson` + `main` | 6 |
| `scripts/content/validate-content-anchoring.test.mjs` | testes existentes + testes do runner | 6 |
| `.loop/project.yaml` | novo validador `content-anchoring-data` | 6 |

`content-manifest/embeddings/` **não é versionado** — os vetores são deriváveis do texto mais o modelo, `needs_embedding` já invalida por hash, e `anchoringErrors` não lê vetor nenhum. Task 3 acrescenta a linha ao `.gitignore`. Versioná-los somaria alguns MB por fonte a um repositório de 26,3 MB sem comprar nenhuma garantia.

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

- [ ] **Step 1: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Runner do manifesto de excertos com filtro de direitos na entrada" scripts/content/build-manifest.py scripts/content/build-manifest.test.py content-manifest/excerpts/manifest.jsonl content-manifest/excerpts/descartes.json
```

- [ ] **Step 2: Extrair o PDF do piloto**

O runner precisa de excertos, e a única extração existente é de fonte `blocked`. Rode o extrator, que **já tem ponto de entrada**:

```bash
python3 scripts/content/extract-source.py --source "Conteúdo/Atualiza-o-em-Mamografia-para-T-cnicos-em-Radiologia-INCA.pdf" --output-dir "Conteúdo/extrações/atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca"
```

Expected: JSON com `sourceSlug`, `pageCount` e `excerptCount`. Confira que o `sourceSlug` impresso é `atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca` — ele é derivado do nome do arquivo por `normalize_source_slug` e é a chave que liga o excerto ao catálogo de direitos. Se sair diferente, **use o valor impresso** e ajuste o `--output-dir`; não force o nome.

Nada disso entra em git: `Conteúdo/` está excluído.

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

### Task 3: Runner dos embeddings de excerto

**Files:**
- Modify: `scripts/content/embed-excerpts.py` (hoje 30 linhas), `.gitignore`
- Test: `scripts/content/embed-excerpts.test.py`

**Interfaces:**
- Consumes: `content-manifest/excerpts/manifest.jsonl` da Task 2 — lê `id` e `hash` de cada linha.
- Produces: `embed_missing(lines: list[dict], texts: dict[str, str], root: Path, embed: Callable[[str], list[float]]) -> dict` com as chaves `embedded` e `skipped`; arquivos em `content-manifest/embeddings/<id com ':' virado '_'>.json` no formato `{"excerptId", "hash", "embedding"}` que a Task 5 consome.

- [ ] **Step 1: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Runner de embeddings de excerto com reaproveitamento por hash" scripts/content/embed-excerpts.py scripts/content/embed-excerpts.test.py .gitignore
```

- [ ] **Step 2: Escrever os testes que falham**

Acrescente a `scripts/content/embed-excerpts.test.py`:

```python
class EmbedMissingTest(unittest.TestCase):
    def setUp(self):
        self.linhas = [{"id": "excerpt:a:p1:c1", "hash": "h1"}]
        self.textos = {"excerpt:a:p1:c1": "Os raios X foram descobertos em 1895."}

    def test_primeira_passada_chama_e_segunda_reaproveita(self):
        chamadas = []

        def embed(texto):
            chamadas.append(texto)
            return [0.1, 0.2, 0.3]

        with tempfile.TemporaryDirectory() as tmp:
            raiz = Path(tmp)
            primeiro = MODULE.embed_missing(self.linhas, self.textos, raiz, embed)
            # A prova de que o recurso EXISTIU, antes de afirmar que ele sumiu.
            self.assertEqual(primeiro["embedded"], 1)
            self.assertEqual(len(chamadas), 1)

            segundo = MODULE.embed_missing(self.linhas, self.textos, raiz, embed)
            self.assertEqual(segundo["skipped"], 1)
            self.assertEqual(segundo["embedded"], 0)
            self.assertEqual(len(chamadas), 1)

    def test_hash_diferente_reembeda(self):
        chamadas = []

        def embed(texto):
            chamadas.append(texto)
            return [0.1]

        with tempfile.TemporaryDirectory() as tmp:
            raiz = Path(tmp)
            MODULE.embed_missing(self.linhas, self.textos, raiz, embed)
            self.assertEqual(len(chamadas), 1)
            MODULE.embed_missing(
                [{"id": "excerpt:a:p1:c1", "hash": "h2"}], self.textos, raiz, embed
            )
            self.assertEqual(len(chamadas), 2)

    def test_excerto_sem_texto_estoura_em_vez_de_embedar_vazio(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(KeyError):
                MODULE.embed_missing(self.linhas, {}, Path(tmp), lambda t: [0.1])
```

- [ ] **Step 3: Rodar os testes para verificar que falham**

Run: `python3 scripts/content/embed-excerpts.test.py`
Expected: FAIL com `AttributeError: module 'embed_excerpts' has no attribute 'embed_missing'`

- [ ] **Step 4: Implementar**

Acrescente a `scripts/content/embed-excerpts.py`:

```python
import argparse
import sys

from openai import OpenAI

MODELO_DE_EMBEDDING = "text-embedding-3-small"


def embed_missing(lines: list[dict], texts: dict[str, str], root: Path, embed) -> dict:
    embedded, skipped = 0, 0
    for line in lines:
        if not needs_embedding(line["id"], line["hash"], root):
            skipped += 1
            continue
        save_excerpt_embedding(line["id"], line["hash"], embed(texts[line["id"]]), root)
        embedded += 1
    return {"embedded": embedded, "skipped": skipped}


def load_manifest(path: Path) -> list[dict]:
    return [json.loads(l) for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]


def load_texts(extractions: Path) -> dict[str, str]:
    textos: dict[str, str] = {}
    for arquivo in sorted(extractions.glob("*/excerpts.json")):
        for excerpt in json.loads(arquivo.read_text(encoding="utf-8"))["excerpts"]:
            textos[excerpt["id"]] = excerpt["text"]
    return textos


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--extractions", required=True)
    parser.add_argument("--out-dir", required=True)
    args = parser.parse_args()

    cliente = OpenAI()

    def embed(texto: str) -> list[float]:
        return cliente.embeddings.create(model=MODELO_DE_EMBEDDING, input=texto).data[0].embedding

    linhas = load_manifest(Path(args.manifest))
    if not linhas:
        print(json.dumps({"erro": "manifesto vazio"}, ensure_ascii=False))
        return 1

    resumo = embed_missing(linhas, load_texts(Path(args.extractions)), Path(args.out_dir), embed)
    print(json.dumps({"linhas": len(linhas), **resumo}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

`embed_missing` recebe `embed` por parâmetro justamente para que o teste passe um dublê e nenhuma suíte toque a rede.

- [ ] **Step 5: Rodar os testes para verificar que passam**

Run: `python3 scripts/content/embed-excerpts.test.py`
Expected: PASS, todos.

- [ ] **Step 6: Manter os vetores fora do versionamento**

Acrescente ao `.gitignore` da raiz:

```
content-manifest/embeddings/
```

- [ ] **Step 7: Rodar o runner contra o dado real**

```bash
python3 scripts/content/embed-excerpts.py --manifest content-manifest/excerpts/manifest.jsonl --extractions "Conteúdo/extrações" --out-dir content-manifest/embeddings
```

Precisa de `OPENAI_API_KEY` no ambiente. Expected: `embedded` igual ao número de linhas do manifesto e `skipped: 0`. Rode **de novo** e confirme `embedded: 0`, `skipped` igual ao total — é o reaproveitamento funcionando em dado real, e é barato de conferir.

- [ ] **Step 8: Prova de mutação**

Troque `if not needs_embedding(...)` por `if False:` e rode `python3 scripts/content/embed-excerpts.test.py`.
Expected: `test_primeira_passada_chama_e_segunda_reaproveita` vermelho na asserção `segundo["skipped"] == 1`; `test_hash_diferente_reembeda` continua **verde** (ele conta chamadas crescentes). Restaure e confirme. Registre as duas passadas.

- [ ] **Step 9: Commit**

```bash
git add scripts/content/embed-excerpts.py scripts/content/embed-excerpts.test.py .gitignore
git commit -m "feat(conteudo): ponto de entrada dos embeddings de excerto"
```

- [ ] **Step 10: Fechar o run** — sem memória

```bash
node scripts/loop/fechar.mjs <runId>
```

---

### Task 4: Claims do piloto, escritas à mão

Esta task **não tem código de produção**. O entregável é dado, e a validação é de forma.

**Files:**
- Create: `content-manifest/lessons/<aulaEscolhida>.claims.json`
- Test: `scripts/content/anchor-lesson.test.py` (só o teste de forma; o runner vem na Task 5)

**Interfaces:**
- Consumes: `content-manifest/excerpts/manifest.jsonl` (para saber quais excertos existem) e os textos em `Conteúdo/extrações/`.
- Produces: arquivo no formato `{"lessonId": str, "claims": [{"id": str, "claim": str}]}`. A Task 5 acrescenta `vector` a cada claim em memória; o arquivo em disco **não** guarda vetor.

- [ ] **Step 1: Escolher a aula do piloto** — decisão humana, não do implementador

Os 16 nós `ai-lesson:` do catálogo **não incluem mamografia**, que é o assunto da fonte do piloto. Quem escrever as claims escolhe o nó mais próximo e registra a escolha no relatório da task. Recomendação: `ai-lesson:qualidade-de-imagem`, porque o texto do INCA tem seção substancial de controle de qualidade e os excertos vão sustentar afirmações sobre isso. Alternativa defensável: `ai-lesson:interacao-das-radiacoes-e-protecao-radiologica`.

Se nenhum nó servir, **pare e reporte** em vez de forçar: um piloto ancorado no nó errado produz dado real e conclusão falsa, que é pior que não ter dado.

- [ ] **Step 2: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Claims escritas a mao para o piloto de ancoragem" content-manifest/lessons/<aulaEscolhida>.claims.json scripts/content/anchor-lesson.test.py
```

- [ ] **Step 3: Escrever 5 a 10 afirmações contra excertos reais**

Leia os excertos do piloto em `Conteúdo/extrações/atualiza-o-em-mamografia-para-t-cnicos-em-radiologia-inca/excerpts.json` e escreva afirmações que o texto **sustente**. Formato:

```json
{
  "lessonId": "ai-lesson:qualidade-de-imagem",
  "claims": [
    { "id": "claim:qualidade-de-imagem:1", "claim": "O controle de qualidade em mamografia inclui avaliação periódica do equipamento." }
  ]
}
```

Regras: afirmação factual e verificável, uma ideia por claim, sem número que o texto não traga, e **sem copiar frase do original** — a claim é afirmação, o excerto é a prova.

- [ ] **Step 4: Escrever o teste de forma**

Crie `scripts/content/anchor-lesson.test.py` se não existir, ou acrescente:

```python
class ClaimsDoPilotoTest(unittest.TestCase):
    def test_arquivo_de_claims_tem_a_forma_que_o_runner_espera(self):
        caminho = Path(__file__).resolve().parents[2] / "content-manifest" / "lessons"
        arquivos = sorted(caminho.glob("*.claims.json"))
        self.assertTrue(arquivos, "nenhum arquivo de claims encontrado")
        for arquivo in arquivos:
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
            self.assertTrue(dados["lessonId"].startswith("ai-lesson:"))
            self.assertGreaterEqual(len(dados["claims"]), 5)
            self.assertLessEqual(len(dados["claims"]), 10)
            ids = [c["id"] for c in dados["claims"]]
            self.assertEqual(len(ids), len(set(ids)), "ids de claim repetidos")
            for c in dados["claims"]:
                self.assertNotIn("vector", c, "o arquivo em disco nao guarda vetor")
                self.assertTrue(c["claim"].strip())
```

- [ ] **Step 5: Rodar o teste**

Run: `python3 scripts/content/anchor-lesson.test.py`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add content-manifest/lessons/ scripts/content/anchor-lesson.test.py
git commit -m "feat(conteudo): claims do piloto escritas a mao sobre fonte autorizada"
```

- [ ] **Step 7: Fechar o run** — sem memória

```bash
node scripts/loop/fechar.mjs <runId>
```

---

### Task 5: Runner da ancoragem

**Files:**
- Modify: `scripts/content/anchor-lesson.py` (hoje 36 linhas)
- Test: `scripts/content/anchor-lesson.test.py`
- Create (rastreado): `content-manifest/lessons/<aula>.anchored.json`

**Interfaces:**
- Consumes: manifesto da Task 2 (`id`, `hash`), embeddings da Task 3 (`{"excerptId","hash","embedding"}`), claims da Task 4 (`{"lessonId","claims":[{"id","claim"}]}`).
- Produces: `load_allowed(manifest_lines: list[dict]) -> dict[str, str]` mapeando `excerptId -> hash`; `main() -> int`; arquivo `{"lessonId", "claims": [...], "unanchored": int}` que a Task 6 valida. `anchor_report` permanece inalterada.

- [ ] **Step 1: Abrir o run do Loop**

```bash
node scripts/loop/abrir.mjs "Runner da ancoragem de claims em excertos autorizados" scripts/content/anchor-lesson.py scripts/content/anchor-lesson.test.py content-manifest/lessons
```

- [ ] **Step 2: Escrever os testes que falham**

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

    def test_relatorio_so_ancora_no_que_esta_em_allowed(self):
        vetores = {"excerpt:a:p1:c1": [1.0, 0.0], "excerpt:fora:p1:c1": [0.0, 1.0]}
        allowed = {"excerpt:a:p1:c1": "h1"}
        claims = [{"claim": "x", "vector": [0.0, 1.0]}]
        relatorio = MODULE.anchor_report(claims, vetores, allowed)
        # o vetor da claim aponta para o excerto FORA do allowed; ainda assim
        # a ancora tem de cair no unico permitido, e nunca no de fora.
        self.assertEqual(relatorio["claims"][0]["excerptId"], "excerpt:a:p1:c1")
        self.assertEqual(relatorio["claims"][0]["hash"], "h1")
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

from openai import OpenAI

MODELO_DE_EMBEDDING = "text-embedding-3-small"


def load_allowed(manifest_lines: list[dict]) -> dict[str, str]:
    return {linha["id"]: linha["hash"] for linha in manifest_lines}


def load_excerpt_vectors(root: Path) -> dict[str, list[float]]:
    vetores: dict[str, list[float]] = {}
    for arquivo in sorted(root.glob("*.json")):
        dados = json.loads(arquivo.read_text(encoding="utf-8"))
        vetores[dados["excerptId"]] = dados["embedding"]
    return vetores


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--claims", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--embeddings", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    aula = json.loads(Path(args.claims).read_text(encoding="utf-8"))
    linhas = [
        json.loads(l)
        for l in Path(args.manifest).read_text(encoding="utf-8").splitlines()
        if l.strip()
    ]
    allowed = load_allowed(linhas)
    vetores = load_excerpt_vectors(Path(args.embeddings))

    cliente = OpenAI()
    claims = [
        {
            "claim": c["claim"],
            "id": c["id"],
            "vector": cliente.embeddings.create(
                model=MODELO_DE_EMBEDDING, input=c["claim"]
            ).data[0].embedding,
        }
        for c in aula["claims"]
    ]

    relatorio = anchor_report(claims, vetores, allowed)
    saida = {"lessonId": aula["lessonId"], **relatorio}
    destino = Path(args.out)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {"lessonId": aula["lessonId"], "claims": len(claims), "unanchored": relatorio["unanchored"]},
            ensure_ascii=False,
        )
    )
    return 0 if relatorio["unanchored"] == 0 else 1
```

`anchor_report` devolve `claim` e não o `id` da claim; a saída fica com o texto, que é o que o validador precisa para o humano localizar o problema. Não mude `anchor_report` para carregar o `id` — isso é mudança de função pura já testada, e não é necessário nesta task.

- [ ] **Step 5: Rodar os testes para verificar que passam**

Run: `python3 scripts/content/anchor-lesson.test.py`
Expected: PASS, todos.

- [ ] **Step 6: Rodar o runner contra o dado real**

```bash
python3 scripts/content/anchor-lesson.py --claims content-manifest/lessons/<aula>.claims.json --manifest content-manifest/excerpts/manifest.jsonl --embeddings content-manifest/embeddings --out content-manifest/lessons/<aula>.anchored.json
```

Expected: `unanchored: 0`. Se não for zero, **não baixe a régua**: significa que alguma claim não encontrou excerto de apoio, e a correção é reescrever a claim (Task 4), não afrouxar o runner.

- [ ] **Step 7: Prova de mutação**

Troque `load_allowed` para devolver `{}` e rode os testes.
Expected: `test_allowed_liga_id_ao_hash_do_manifesto` e `test_relatorio_so_ancora_no_que_esta_em_allowed` vermelhos. Restaure e confirme o verde.

- [ ] **Step 8: Commit**

```bash
git add scripts/content/anchor-lesson.py scripts/content/anchor-lesson.test.py content-manifest/lessons/
git commit -m "feat(conteudo): ponto de entrada da ancoragem de claims"
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

**Dependências entre tasks:** 1 é independente e pode ir em qualquer momento. 2 → 3 → 5 → 6 é uma cadeia estrita. 4 depende de 2 (precisa dos excertos reais para escrever claims sustentáveis) e bloqueia 5.
