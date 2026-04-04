# Knowledge Graph, Embeddings e Sequência de Aprendizagem — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o grafo de dependências entre conceitos, gerar embeddings para deduplicação semântica cross-book, e produzir uma sequência de aprendizagem topologicamente ordenada a partir do grafo validado.

**Architecture:** Três scripts Python novos operam sobre `conteúdo/conceitos/` e escrevem em `conteúdo/governança/`. Todo estado do grafo vive em `concept-graph.json`. A sequência de aprendizagem é produzida pelo algoritmo de Kahn sobre arestas com status `auto-accepted` ou `human-validated` apenas.

**Tech Stack:** Python 3.11+, OpenAI SDK (`text-embedding-3-small`), Anthropic SDK (`claude-haiku-4-5-20251001`), networkx, pipeline de scripts existente em `scripts/content/`.

> Este é o **Plano 1 de 3**. Plano 2 cobre Templates de Geração + LLM-as-judge. Plano 3 cobre Painel Editorial Web + Script de Promoção.

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `scripts/content/requirements.txt` | Modificar | Adicionar openai, anthropic, networkx |
| `scripts/content/concepts-reader.py` | Criar | Carregar todos os conceitos de todos os jobs |
| `scripts/content/concepts-reader.test.py` | Criar | Testes do loader |
| `scripts/content/generate-embeddings.py` | Criar | Gerar e armazenar embeddings por conceito |
| `scripts/content/generate-embeddings.test.py` | Criar | Testes de file I/O de embeddings |
| `scripts/content/suggest-dependencies.py` | Criar | Sugerir arestas via Claude Haiku e gravar no grafo |
| `scripts/content/suggest-dependencies.test.py` | Criar | Testes de threshold, merge e inicialização do grafo |
| `scripts/content/build-learning-sequence.py` | Criar | Ordenação topológica + detecção de gaps |
| `scripts/content/build-learning-sequence.test.py` | Criar | Testes de sort, ciclos e gaps |
| `conteúdo/governança/concept-graph.json` | Criar | Grafo vazio inicial |
| `conteúdo/governança/embeddings/.gitkeep` | Criar | Manter diretório no git |
| `conteúdo/governança/learning-sequence.json` | Criado pelo script | Output da ordenação topológica |

---

### Task 1: Setup — dependências e artefatos iniciais

**Files:**
- Modify: `scripts/content/requirements.txt`
- Create: `conteúdo/governança/concept-graph.json`
- Create: `conteúdo/governança/embeddings/.gitkeep`

- [ ] **Step 1.1: Atualizar requirements.txt**

Conteúdo final de `scripts/content/requirements.txt`:

```
pypdf==6.9.2
openai==1.75.0
anthropic==0.49.0
networkx==3.4.2
```

- [ ] **Step 1.2: Instalar dependências**

```bash
cd scripts/content && pip install -r requirements.txt
```

Expected: todos os pacotes instalados sem erro.

- [ ] **Step 1.3: Criar concept-graph.json vazio**

Conteúdo de `conteúdo/governança/concept-graph.json`:

```json
{
  "version": 1,
  "nodes": [],
  "edges": []
}
```

- [ ] **Step 1.4: Criar diretório de embeddings**

```bash
mkdir -p "conteúdo/governança/embeddings"
touch "conteúdo/governança/embeddings/.gitkeep"
```

- [ ] **Step 1.5: Commit**

```bash
git add scripts/content/requirements.txt "conteúdo/governança/concept-graph.json" "conteúdo/governança/embeddings/.gitkeep"
git commit -m "chore: setup knowledge graph and embeddings scaffolding"
```

---

### Task 2: Utilitário de coleta de conceitos (`concepts-reader.py`)

**Files:**
- Create: `scripts/content/concepts-reader.py`
- Create: `scripts/content/concepts-reader.test.py`

- [ ] **Step 2.1: Escrever o teste primeiro**

Criar `scripts/content/concepts-reader.test.py`:

```python
import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("concepts-reader.py")
SPEC = importlib.util.spec_from_file_location("concepts_reader", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class ConceptsReaderTests(unittest.TestCase):
    def test_load_all_concepts_returns_list(self):
        concepts = MODULE.load_all_concepts()
        self.assertIsInstance(concepts, list)
        self.assertGreater(len(concepts), 0)

    def test_each_concept_has_required_fields(self):
        concepts = MODULE.load_all_concepts()
        required = {"id", "title", "definition", "galaxyId", "planetId", "starId"}
        for concept in concepts:
            for field in required:
                self.assertIn(
                    field, concept,
                    f"Concept {concept.get('id')} missing field '{field}'"
                )

    def test_concept_ids_are_unique(self):
        concepts = MODULE.load_all_concepts()
        ids = [c["id"] for c in concepts]
        self.assertEqual(len(ids), len(set(ids)), "Duplicate concept IDs found")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2.2: Rodar e confirmar que falha**

```bash
python -m pytest scripts/content/concepts-reader.test.py -v
```

Expected: FAIL — `concepts-reader.py` not found.

- [ ] **Step 2.3: Implementar `concepts-reader.py`**

Criar `scripts/content/concepts-reader.py`:

```python
from __future__ import annotations

import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"


def load_all_concepts() -> list[dict]:
    """Load all canonical concepts from every normalization job in conceitos/index.json."""
    index_path = CONTENT_ROOT / "conceitos" / "index.json"
    index = json.loads(index_path.read_text(encoding="utf-8"))

    concepts: list[dict] = []
    for job in index["jobs"]:
        artifacts_path = CONTENT_ROOT / job["artifacts"]["concepts"]
        data = json.loads(artifacts_path.read_text(encoding="utf-8"))
        concepts.extend(data["concepts"])

    return concepts


if __name__ == "__main__":
    all_concepts = load_all_concepts()
    print(f"Loaded {len(all_concepts)} concepts")
    for c in all_concepts:
        print(f"  {c['id']}")
```

- [ ] **Step 2.4: Rodar e confirmar que passa**

```bash
python -m pytest scripts/content/concepts-reader.test.py -v
```

Expected: PASS — 3 tests passing.

- [ ] **Step 2.5: Commit**

```bash
git add scripts/content/concepts-reader.py scripts/content/concepts-reader.test.py
git commit -m "feat: add concepts-reader utility for loading all canonical concepts"
```

---

### Task 3: Gerador de embeddings (`generate-embeddings.py`)

**Files:**
- Create: `scripts/content/generate-embeddings.py`
- Create: `scripts/content/generate-embeddings.test.py`

- [ ] **Step 3.1: Escrever o teste primeiro**

Criar `scripts/content/generate-embeddings.test.py`:

```python
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("generate-embeddings.py")
SPEC = importlib.util.spec_from_file_location("generate_embeddings", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class GenerateEmbeddingsTests(unittest.TestCase):
    def test_safe_filename_replaces_colons(self):
        concept_id = "concept:source-slug:concept-slug"
        result = MODULE.safe_filename(concept_id)
        self.assertNotIn(":", result)
        self.assertEqual(result, "concept_source-slug_concept-slug")

    def test_save_and_load_embedding_roundtrip(self):
        concept_id = "concept:test:foo"
        embedding = [0.1, 0.2, 0.3]
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            MODULE.save_embedding(concept_id, embedding, embeddings_dir)
            filename = MODULE.safe_filename(concept_id) + ".json"
            saved = json.loads((embeddings_dir / filename).read_text(encoding="utf-8"))
        self.assertEqual(saved["conceptId"], concept_id)
        self.assertEqual(saved["embedding"], embedding)

    def test_is_embedded_returns_false_when_missing(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            result = MODULE.is_embedded("concept:test:missing", Path(tmpdir))
        self.assertFalse(result)

    def test_is_embedded_returns_true_when_present(self):
        concept_id = "concept:test:present"
        embedding = [0.5, 0.6]
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            MODULE.save_embedding(concept_id, embedding, embeddings_dir)
            result = MODULE.is_embedded(concept_id, embeddings_dir)
        self.assertTrue(result)

    def test_cosine_similarity_identical_vectors(self):
        v = [1.0, 0.0, 0.0]
        result = MODULE.cosine_similarity(v, v)
        self.assertAlmostEqual(result, 1.0, places=5)

    def test_cosine_similarity_orthogonal_vectors(self):
        v1 = [1.0, 0.0]
        v2 = [0.0, 1.0]
        result = MODULE.cosine_similarity(v1, v2)
        self.assertAlmostEqual(result, 0.0, places=5)

    def test_find_duplicate_returns_none_when_no_match(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            MODULE.save_embedding("concept:test:a", [1.0, 0.0], embeddings_dir)
            # orthogonal vector — similarity = 0.0, well below threshold
            result = MODULE.find_duplicate([0.0, 1.0], "concept:test:b", embeddings_dir)
        self.assertIsNone(result)

    def test_find_duplicate_returns_id_when_similar(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            # near-identical vector — similarity ≈ 1.0
            MODULE.save_embedding("concept:test:a", [1.0, 0.001], embeddings_dir)
            result = MODULE.find_duplicate([1.0, 0.0], "concept:test:b", embeddings_dir)
        self.assertEqual(result, "concept:test:a")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 3.2: Rodar e confirmar que falha**

```bash
python -m pytest scripts/content/generate-embeddings.test.py -v
```

Expected: FAIL.

- [ ] **Step 3.3: Implementar `generate-embeddings.py`**

Criar `scripts/content/generate-embeddings.py`:

```python
from __future__ import annotations

import importlib.util
import json
import math
from pathlib import Path

from openai import OpenAI

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"
EMBEDDINGS_DIR = CONTENT_ROOT / "governança" / "embeddings"
DEDUP_THRESHOLD = 0.88

_reader_spec = importlib.util.spec_from_file_location(
    "concepts_reader", Path(__file__).with_name("concepts-reader.py")
)
_reader_module = importlib.util.module_from_spec(_reader_spec)
_reader_spec.loader.exec_module(_reader_module)
load_all_concepts = _reader_module.load_all_concepts


def safe_filename(concept_id: str) -> str:
    return concept_id.replace(":", "_")


def is_embedded(concept_id: str, embeddings_dir: Path = EMBEDDINGS_DIR) -> bool:
    return (embeddings_dir / f"{safe_filename(concept_id)}.json").exists()


def save_embedding(
    concept_id: str, embedding: list[float], embeddings_dir: Path = EMBEDDINGS_DIR
) -> None:
    embeddings_dir.mkdir(parents=True, exist_ok=True)
    path = embeddings_dir / f"{safe_filename(concept_id)}.json"
    path.write_text(
        json.dumps({"conceptId": concept_id, "embedding": embedding}, ensure_ascii=False),
        encoding="utf-8",
    )


def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)


def find_duplicate(
    embedding: list[float],
    exclude_id: str,
    embeddings_dir: Path = EMBEDDINGS_DIR,
    threshold: float = DEDUP_THRESHOLD,
) -> str | None:
    """Return concept_id of existing embedding with similarity >= threshold, or None."""
    for path in embeddings_dir.glob("*.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        if data["conceptId"] == exclude_id:
            continue
        if cosine_similarity(embedding, data["embedding"]) >= threshold:
            return data["conceptId"]
    return None


def embed_concept(concept: dict, client: OpenAI) -> list[float]:
    text = f"{concept['title']}: {concept['definition']}"
    response = client.embeddings.create(model="text-embedding-3-small", input=text)
    return response.data[0].embedding


def run() -> None:
    client = OpenAI()
    concepts = load_all_concepts()
    skipped = 0
    duplicates: list[tuple[str, str]] = []

    for concept in concepts:
        if is_embedded(concept["id"]):
            skipped += 1
            continue
        embedding = embed_concept(concept, client)
        duplicate = find_duplicate(embedding, concept["id"])
        if duplicate:
            duplicates.append((concept["id"], duplicate))
            print(f"  DUPLICATE {concept['id']} ≈ {duplicate}")
        else:
            save_embedding(concept["id"], embedding)
            print(f"  embedded {concept['id']}")

    processed = len(concepts) - skipped - len(duplicates)
    print(f"Done: {processed} embedded, {skipped} skipped, {len(duplicates)} duplicates detected")
    if duplicates:
        print("Duplicates (merge manually):")
        for new_id, existing_id in duplicates:
            print(f"  {new_id} → {existing_id}")


if __name__ == "__main__":
    run()
```

- [ ] **Step 3.4: Rodar e confirmar que passa**

```bash
python -m pytest scripts/content/generate-embeddings.test.py -v
```

Expected: PASS — 7 tests passing.

- [ ] **Step 3.5: Testar execução real (requer `OPENAI_API_KEY`)**

```bash
OPENAI_API_KEY=<your-key> python scripts/content/generate-embeddings.py
```

Expected output example:
```
  embedded concept:fundamentos-de-radiologia-everton-costa-pinto:acessorios-radiologicos
  embedded concept:fundamentos-de-radiologia-everton-costa-pinto:anatomia-radiologica-basica
  ...
Done: 16 embedded, 0 skipped, 0 duplicates detected
```

Verificar que os arquivos foram criados:

```bash
ls "conteúdo/governança/embeddings/" | wc -l
```

Expected: `17` (16 `.json` + `.gitkeep`)

- [ ] **Step 3.6: Commit**

```bash
git add scripts/content/generate-embeddings.py scripts/content/generate-embeddings.test.py "conteúdo/governança/embeddings/"
git commit -m "feat: add embedding generator with cosine deduplication"
```

---

### Task 4: Detecção de dependências e inicialização do grafo (`suggest-dependencies.py`)

**Files:**
- Create: `scripts/content/suggest-dependencies.py`
- Create: `scripts/content/suggest-dependencies.test.py`

- [ ] **Step 4.1: Escrever o teste primeiro**

Criar `scripts/content/suggest-dependencies.test.py`:

```python
import importlib.util
import json
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("suggest-dependencies.py")
SPEC = importlib.util.spec_from_file_location("suggest_dependencies", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class BuildGraphNodesTests(unittest.TestCase):
    def test_adds_new_node(self):
        graph = {"version": 1, "nodes": [], "edges": []}
        concepts = [
            {
                "id": "concept:test:foo",
                "title": "Foo",
                "galaxyId": "galaxy-fisica",
                "planetId": "planet-a",
                "starId": "star-b",
            }
        ]
        result = MODULE.build_graph_nodes(graph, concepts)
        self.assertEqual(len(result["nodes"]), 1)
        self.assertEqual(result["nodes"][0]["id"], "concept:test:foo")

    def test_skips_existing_node(self):
        existing = {
            "id": "concept:test:foo",
            "title": "Foo",
            "galaxyId": "galaxy-fisica",
            "planetId": "planet-a",
            "starId": "star-b",
        }
        graph = {"version": 1, "nodes": [existing], "edges": []}
        concepts = [existing]
        result = MODULE.build_graph_nodes(graph, concepts)
        self.assertEqual(len(result["nodes"]), 1)


class ApplyThresholdTests(unittest.TestCase):
    def test_confidence_threshold_constant(self):
        self.assertEqual(MODULE.CONFIDENCE_THRESHOLD, 0.85)

    def test_high_confidence_auto_accepted(self):
        edge = {"from": "concept:a", "to": "concept:b", "confidence": 0.90, "reason": "test"}
        result = MODULE.apply_threshold(edge)
        self.assertEqual(result["status"], "auto-accepted")

    def test_low_confidence_pending_review(self):
        edge = {"from": "concept:a", "to": "concept:b", "confidence": 0.70, "reason": "test"}
        result = MODULE.apply_threshold(edge)
        self.assertEqual(result["status"], "pending-review")

    def test_boundary_085_is_auto_accepted(self):
        edge = {"from": "concept:a", "to": "concept:b", "confidence": 0.85, "reason": "test"}
        result = MODULE.apply_threshold(edge)
        self.assertEqual(result["status"], "auto-accepted")


class MergeEdgesTests(unittest.TestCase):
    def test_adds_new_edge(self):
        graph = {"version": 1, "nodes": [], "edges": []}
        new_edges = [{"from": "concept:a", "to": "concept:b", "confidence": 0.90, "reason": "test"}]
        result = MODULE.merge_edges(graph, new_edges)
        self.assertEqual(len(result["edges"]), 1)
        self.assertEqual(result["edges"][0]["status"], "auto-accepted")

    def test_skips_duplicate_edge(self):
        existing = {
            "from": "concept:a",
            "to": "concept:b",
            "confidence": 0.9,
            "status": "auto-accepted",
            "reason": "old",
        }
        graph = {"version": 1, "nodes": [], "edges": [existing]}
        new_edges = [{"from": "concept:a", "to": "concept:b", "confidence": 0.95, "reason": "new"}]
        result = MODULE.merge_edges(graph, new_edges)
        self.assertEqual(len(result["edges"]), 1)
        self.assertEqual(result["edges"][0]["reason"], "old")

    def test_adds_reverse_direction_as_new_edge(self):
        existing = {
            "from": "concept:a",
            "to": "concept:b",
            "confidence": 0.9,
            "status": "auto-accepted",
            "reason": "forward",
        }
        graph = {"version": 1, "nodes": [], "edges": [existing]}
        new_edges = [{"from": "concept:b", "to": "concept:a", "confidence": 0.88, "reason": "reverse"}]
        result = MODULE.merge_edges(graph, new_edges)
        self.assertEqual(len(result["edges"]), 2)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 4.2: Rodar e confirmar que falha**

```bash
python -m pytest scripts/content/suggest-dependencies.test.py -v
```

Expected: FAIL.

- [ ] **Step 4.3: Implementar `suggest-dependencies.py`**

Criar `scripts/content/suggest-dependencies.py`:

```python
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

import anthropic

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"
GRAPH_PATH = CONTENT_ROOT / "governança" / "concept-graph.json"
CONFIDENCE_THRESHOLD = 0.85
BATCH_SIZE = 16

_reader_spec = importlib.util.spec_from_file_location(
    "concepts_reader", Path(__file__).with_name("concepts-reader.py")
)
_reader_module = importlib.util.module_from_spec(_reader_spec)
_reader_spec.loader.exec_module(_reader_module)
load_all_concepts = _reader_module.load_all_concepts

_SYSTEM_PROMPT = (
    "Você é um especialista em radiologia e pedagogia. "
    "Sua tarefa é identificar relações de pré-requisito entre conceitos de radiologia. "
    "Para cada relação, determine: qual conceito deve ser estudado primeiro (from) e qual depende dele (to), "
    "a confiança da relação (0.0 a 1.0) e uma justificativa em uma linha. "
    "Responda APENAS com JSON válido — um array de objetos, sem texto adicional fora do JSON."
)


def build_graph_nodes(graph: dict, concepts: list[dict]) -> dict:
    existing_ids = {n["id"] for n in graph["nodes"]}
    for concept in concepts:
        if concept["id"] not in existing_ids:
            graph["nodes"].append(
                {
                    "id": concept["id"],
                    "title": concept["title"],
                    "galaxyId": concept["galaxyId"],
                    "planetId": concept["planetId"],
                    "starId": concept["starId"],
                }
            )
    return graph


def apply_threshold(edge: dict) -> dict:
    status = "auto-accepted" if edge["confidence"] >= CONFIDENCE_THRESHOLD else "pending-review"
    return {**edge, "status": status}


def merge_edges(graph: dict, new_edges: list[dict]) -> dict:
    existing_pairs = {(e["from"], e["to"]) for e in graph["edges"]}
    for edge in new_edges:
        pair = (edge["from"], edge["to"])
        if pair not in existing_pairs:
            graph["edges"].append(apply_threshold(edge))
            existing_pairs.add(pair)
    return graph


def suggest_edges_for_batch(concepts: list[dict], client: anthropic.Anthropic) -> list[dict]:
    lines = "\n".join(
        f'- id: "{c["id"]}", título: "{c["title"]}", definição: "{c["definition"]}"'
        for c in concepts
    )
    prompt = (
        f"Analise os conceitos de radiologia abaixo e identifique todas as relações de pré-requisito entre eles.\n\n"
        f"{lines}\n\n"
        f'Retorne um array JSON. Cada objeto: "from" (id pré-requisito), "to" (id do conceito dependente), '
        f'"confidence" (0.0–1.0), "reason" (justificativa em uma linha). '
        f"Se não houver relações, retorne []."
    )
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        system=_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(message.content[0].text)


def run() -> None:
    client = anthropic.Anthropic()
    concepts = load_all_concepts()
    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    graph = build_graph_nodes(graph, concepts)

    all_new_edges: list[dict] = []
    for i in range(0, len(concepts), BATCH_SIZE):
        batch = concepts[i : i + BATCH_SIZE]
        print(f"Batch {i // BATCH_SIZE + 1}: {len(batch)} concepts...")
        edges = suggest_edges_for_batch(batch, client)
        all_new_edges.extend(edges)

    graph = merge_edges(graph, all_new_edges)
    GRAPH_PATH.write_text(json.dumps(graph, indent=2, ensure_ascii=False), encoding="utf-8")

    auto = sum(1 for e in all_new_edges if e["confidence"] >= CONFIDENCE_THRESHOLD)
    pending = len(all_new_edges) - auto
    print(f"Done: {len(all_new_edges)} edges ({auto} auto-accepted, {pending} pending-review)")
    print(f"Graph: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges total")


if __name__ == "__main__":
    run()
```

- [ ] **Step 4.4: Rodar e confirmar que passa**

```bash
python -m pytest scripts/content/suggest-dependencies.test.py -v
```

Expected: PASS — 9 tests passing.

- [ ] **Step 4.5: Testar execução real (requer `ANTHROPIC_API_KEY`)**

```bash
ANTHROPIC_API_KEY=<your-key> python scripts/content/suggest-dependencies.py
```

Expected output example:
```
Batch 1: 16 concepts...
Done: 14 edges (11 auto-accepted, 3 pending-review)
Graph: 16 nodes, 14 edges total
```

Verificar o grafo gerado:

```bash
python -c "
import json
g = json.load(open('conteúdo/governança/concept-graph.json'))
auto = [e for e in g['edges'] if e['status'] == 'auto-accepted']
pending = [e for e in g['edges'] if e['status'] == 'pending-review']
print(f'{len(g[\"nodes\"])} nodes, {len(auto)} auto-accepted, {len(pending)} pending-review')
for e in pending:
    print(f'  PENDING {e[\"from\"].split(\":\")[-1]} -> {e[\"to\"].split(\":\")[-1]} (conf={e[\"confidence\"]})')
"
```

- [ ] **Step 4.6: Commit**

```bash
git add scripts/content/suggest-dependencies.py scripts/content/suggest-dependencies.test.py "conteúdo/governança/concept-graph.json"
git commit -m "feat: add dependency suggestion pipeline with confidence threshold"
```

---

### Task 5: Ordenação topológica e sequência de aprendizagem (`build-learning-sequence.py`)

**Files:**
- Create: `scripts/content/build-learning-sequence.py`
- Create: `scripts/content/build-learning-sequence.test.py`

- [ ] **Step 5.1: Escrever o teste primeiro**

Criar `scripts/content/build-learning-sequence.test.py`:

```python
import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("build-learning-sequence.py")
SPEC = importlib.util.spec_from_file_location("build_learning_sequence", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class TopologicalSortTests(unittest.TestCase):
    def test_basic_chain_is_ordered(self):
        nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}]
        edges = [
            {"from": "A", "to": "B", "status": "auto-accepted"},
            {"from": "B", "to": "C", "status": "auto-accepted"},
        ]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertLess(ordered.index("A"), ordered.index("B"))
        self.assertLess(ordered.index("B"), ordered.index("C"))
        self.assertEqual(cycles, [])

    def test_cycle_is_detected(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [
            {"from": "A", "to": "B", "status": "auto-accepted"},
            {"from": "B", "to": "A", "status": "auto-accepted"},
        ]
        _ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertEqual(len(cycles), 2)

    def test_pending_review_edges_excluded(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"from": "A", "to": "B", "status": "pending-review"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertEqual(len(ordered), 2)
        self.assertEqual(cycles, [])

    def test_human_validated_edges_included(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"from": "A", "to": "B", "status": "human-validated"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertLess(ordered.index("A"), ordered.index("B"))

    def test_rejected_edges_excluded(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"from": "A", "to": "B", "status": "rejected"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertEqual(len(ordered), 2)
        self.assertEqual(cycles, [])

    def test_isolated_nodes_included(self):
        nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}]
        edges = [{"from": "A", "to": "B", "status": "auto-accepted"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertIn("C", ordered)
        self.assertEqual(cycles, [])


class DetectGapsTests(unittest.TestCase):
    def test_detects_missing_prerequisite(self):
        nodes = [{"id": "concept:B"}]
        edges = [{"from": "concept:A", "to": "concept:B", "status": "auto-accepted"}]
        gaps = MODULE.detect_gaps(nodes, edges)
        self.assertIn("concept:A", gaps)

    def test_no_gaps_when_all_present(self):
        nodes = [{"id": "concept:A"}, {"id": "concept:B"}]
        edges = [{"from": "concept:A", "to": "concept:B", "status": "auto-accepted"}]
        gaps = MODULE.detect_gaps(nodes, edges)
        self.assertEqual(gaps, [])

    def test_gaps_are_deduplicated(self):
        nodes = [{"id": "concept:B"}, {"id": "concept:C"}]
        edges = [
            {"from": "concept:A", "to": "concept:B", "status": "auto-accepted"},
            {"from": "concept:A", "to": "concept:C", "status": "auto-accepted"},
        ]
        gaps = MODULE.detect_gaps(nodes, edges)
        self.assertEqual(gaps.count("concept:A"), 1)


class GroupByPlanetTests(unittest.TestCase):
    def test_groups_by_galaxy_and_planet(self):
        nodes = [
            {"id": "A", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
            {"id": "B", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
            {"id": "C", "galaxyId": "galaxy-anatomia", "planetId": "planet-y", "starId": "star-2"},
        ]
        ordered = ["A", "B", "C"]
        groups = MODULE.group_by_planet(nodes, ordered)
        planet_ids = [g["planetId"] for g in groups]
        self.assertIn("planet-x", planet_ids)
        self.assertIn("planet-y", planet_ids)

    def test_preserves_order_within_planet(self):
        nodes = [
            {"id": "A", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
            {"id": "B", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
        ]
        ordered = ["A", "B"]
        groups = MODULE.group_by_planet(nodes, ordered)
        group = next(g for g in groups if g["planetId"] == "planet-x")
        self.assertEqual(group["sequence"], ["A", "B"])

    def test_unknown_node_id_in_ordered_is_skipped(self):
        nodes = [{"id": "A", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"}]
        ordered = ["A", "UNKNOWN"]
        groups = MODULE.group_by_planet(nodes, ordered)
        group = next(g for g in groups if g["planetId"] == "planet-x")
        self.assertNotIn("UNKNOWN", group["sequence"])


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 5.2: Rodar e confirmar que falha**

```bash
python -m pytest scripts/content/build-learning-sequence.test.py -v
```

Expected: FAIL.

- [ ] **Step 5.3: Implementar `build-learning-sequence.py`**

Criar `scripts/content/build-learning-sequence.py`:

```python
from __future__ import annotations

import json
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"
GRAPH_PATH = CONTENT_ROOT / "governança" / "concept-graph.json"
SEQUENCE_PATH = CONTENT_ROOT / "governança" / "learning-sequence.json"

_ACTIVE_STATUSES = {"auto-accepted", "human-validated"}


def topological_sort(nodes: list[dict], edges: list[dict]) -> tuple[list[str], list[str]]:
    """Kahn's algorithm on active edges only. Returns (ordered_ids, cycle_ids)."""
    node_ids = {n["id"] for n in nodes}
    in_degree: dict[str, int] = defaultdict(int)
    adj: dict[str, list[str]] = defaultdict(list)

    for edge in edges:
        if edge["status"] in _ACTIVE_STATUSES:
            frm, to = edge["from"], edge["to"]
            if frm in node_ids and to in node_ids:
                adj[frm].append(to)
                in_degree[to] += 1

    queue = deque(sorted(n for n in node_ids if in_degree[n] == 0))
    ordered: list[str] = []

    while queue:
        node = queue.popleft()
        ordered.append(node)
        for neighbor in sorted(adj[node]):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    cycles = sorted(n for n in node_ids if n not in ordered)
    return ordered, cycles


def detect_gaps(nodes: list[dict], edges: list[dict]) -> list[str]:
    """Concept IDs referenced as prerequisites but absent from nodes."""
    node_ids = {n["id"] for n in nodes}
    return sorted({e["from"] for e in edges if e["from"] not in node_ids})


def group_by_planet(nodes: list[dict], ordered: list[str]) -> list[dict]:
    node_map = {n["id"]: n for n in nodes}
    planet_sequences: dict[str, list[str]] = defaultdict(list)
    planet_meta: dict[str, dict] = {}

    for concept_id in ordered:
        if concept_id not in node_map:
            continue
        node = node_map[concept_id]
        key = f"{node['galaxyId']}:{node['planetId']}"
        planet_sequences[key].append(concept_id)
        if key not in planet_meta:
            planet_meta[key] = {"galaxyId": node["galaxyId"], "planetId": node["planetId"]}

    return [
        {**planet_meta[key], "sequence": seqs}
        for key, seqs in planet_sequences.items()
    ]


def run() -> None:
    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    ordered, cycles = topological_sort(graph["nodes"], graph["edges"])
    gaps = detect_gaps(graph["nodes"], graph["edges"])
    sequences = group_by_planet(graph["nodes"], ordered)

    output = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sequences": sequences,
        "gaps": gaps,
        "cycles": cycles,
    }

    SEQUENCE_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")

    total = sum(len(s["sequence"]) for s in sequences)
    print(f"Done: {total} concepts across {len(sequences)} planets")
    if gaps:
        print(f"Gaps (prerequisites missing from graph): {gaps}")
    if cycles:
        print(f"WARNING — cycles detected (resolve before promoting): {cycles}")


if __name__ == "__main__":
    run()
```

- [ ] **Step 5.4: Rodar e confirmar que passa**

```bash
python -m pytest scripts/content/build-learning-sequence.test.py -v
```

Expected: PASS — 12 tests passing.

- [ ] **Step 5.5: Testar execução real**

```bash
python scripts/content/build-learning-sequence.py
```

Expected output example:
```
Done: 16 concepts across 4 planets
```

Verificar o output:

```bash
python -c "
import json
s = json.load(open('conteúdo/governança/learning-sequence.json'))
print(f'Gaps: {s[\"gaps\"]}')
print(f'Cycles: {s[\"cycles\"]}')
for planet in s['sequences']:
    print(f'  {planet[\"galaxyId\"]} / {planet[\"planetId\"]}: {len(planet[\"sequence\"])} concepts')
"
```

Expected: gaps `[]`, cycles `[]`.

- [ ] **Step 5.6: Commit final do Plano 1**

```bash
git add scripts/content/build-learning-sequence.py scripts/content/build-learning-sequence.test.py "conteúdo/governança/learning-sequence.json"
git commit -m "feat: add topological sort and learning sequence generator"
```

---

## Validação ponta a ponta do Plano 1

Após todos os tasks, rodar a suíte completa:

```bash
python -m pytest \
  scripts/content/concepts-reader.test.py \
  scripts/content/generate-embeddings.test.py \
  scripts/content/suggest-dependencies.test.py \
  scripts/content/build-learning-sequence.test.py \
  -v
```

Expected: todos passando.

Rodar o pipeline completo do zero:

```bash
OPENAI_API_KEY=<key> python scripts/content/generate-embeddings.py
ANTHROPIC_API_KEY=<key> python scripts/content/suggest-dependencies.py
python scripts/content/build-learning-sequence.py
```

Verificar artefatos finais:

| Artefato | Verificação |
|---|---|
| `conteúdo/governança/embeddings/` | `ls \| wc -l` → 17 (16 + .gitkeep) |
| `conteúdo/governança/concept-graph.json` | nodes > 0, edges > 0, status presente |
| `conteúdo/governança/learning-sequence.json` | cycles: [], sequences por planeta |
