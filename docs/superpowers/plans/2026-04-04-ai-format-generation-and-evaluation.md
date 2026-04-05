# Templates de Geração AI com Split Claude / OpenAI — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir os bundles pedagógicos determinísticos por conteúdo gerado por IA usando templates versionados, alternando entre Claude Sonnet (formatos narrativos) e GPT-4o-mini (formatos estruturados) — usando apenas tokens dos planos já contratados. Todos os bundles gerados começam como `needs-review`; o gate de qualidade é o painel editorial (Plano 3), não um LLM-as-judge.

**Architecture:** Um script Python (`ai-generate-formats.py`) opera sobre os artefatos existentes em `conteúdo/`. Lê `learning-sequence.json` para processar conceitos na ordem pedagógica e escreve em `formatos/<tipo>/<source>/ai-bundles.json`. Roteia chamadas para Claude (microlições, casos, rewards) ou OpenAI (quizzes, reviews, checkpoints) com base no formato.

**Tech Stack:** Python 3.11+, Anthropic SDK (`claude-sonnet-4-6`), OpenAI SDK (`gpt-4o-mini`), pipeline de scripts existente.

**Split de modelos:**
| Formato | Modelo | Justificativa |
|---|---|---|
| `microlições` | Claude Sonnet 4.6 | Narrativa pedagógica |
| `casos` | Claude Sonnet 4.6 | Criatividade de cenário clínico |
| `rewards` | Claude Sonnet 4.6 | Texto motivacional com nuance |
| `quizzes` | GPT-4o-mini | Output estruturado, 4 alternativas |
| `reviews` | GPT-4o-mini | Cards frente/verso, estrutura fixa |
| `checkpoints` | GPT-4o-mini | Lista de afirmações, estrutura simples |

> Este é o **Plano 2 de 3**. Requer os artefatos do Plano 1 (`learning-sequence.json`). Plano 3 cobre Painel Editorial Web + Script de Promoção.

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `conteúdo/governança/prompt-templates/microlição.md` | Criar | Prompt para geração de microlições |
| `conteúdo/governança/prompt-templates/quiz.md` | Criar | Prompt para geração de quizzes |
| `conteúdo/governança/prompt-templates/review-card.md` | Criar | Prompt para geração de review cards |
| `conteúdo/governança/prompt-templates/caso-clinico.md` | Criar | Prompt para geração de casos clínicos |
| `conteúdo/governança/prompt-templates/checkpoint.md` | Criar | Prompt para geração de checkpoints |
| `conteúdo/governança/prompt-templates/reward.md` | Criar | Prompt para geração de rewards |
| `scripts/content/ai-generate-formats.py` | Criar | Gerador AI com split Claude / OpenAI por formato |
| `scripts/content/ai-generate-formats.test.py` | Criar | Testes do gerador |

---

### Task 1: Templates de prompt por formato

**Files:**
- Create: `conteúdo/governança/prompt-templates/microlição.md`
- Create: `conteúdo/governança/prompt-templates/quiz.md`
- Create: `conteúdo/governança/prompt-templates/review-card.md`
- Create: `conteúdo/governança/prompt-templates/caso-clinico.md`
- Create: `conteúdo/governança/prompt-templates/checkpoint.md`
- Create: `conteúdo/governança/prompt-templates/reward.md`

- [ ] **Step 1.1: Criar diretório de templates**

```bash
mkdir -p "conteúdo/governança/prompt-templates"
```

- [ ] **Step 1.2: Criar template de microlição**

Criar `conteúdo/governança/prompt-templates/microlição.md`:

```markdown
# Microlição — Template de Prompt

## Persona
Você é um professor especialista em radiologia e diagnóstico por imagem criando material didático para estudantes e técnicos em radiologia brasileiros. Seu estilo é claro, direto e progressivo — como um professor experiente explicando para um aluno atento.

## Tarefa
Escreva uma microlição sobre o conceito abaixo. A microlição deve:
- Explicar o conceito em 2 a 3 parágrafos curtos, do mais simples ao mais específico
- Incluir pelo menos um exemplo prático do cotidiano da radiologia (sala de exame, laudo, posicionamento, equipamento)
- Usar terminologia técnica correta — ao introduzir um termo novo, explique-o brevemente
- NÃO mencionar o nome do livro de origem nem fazer referências bibliográficas
- NÃO usar listas com marcadores; use prosa fluida

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um objeto JSON com esta estrutura, sem nenhum texto fora do JSON:
{
  "explanation": "<2 a 3 parágrafos de explicação em prosa>",
  "example": "<1 parágrafo de exemplo prático>",
  "keyPoints": ["<ponto-chave 1>", "<ponto-chave 2>", "<ponto-chave 3>"]
}
```

- [ ] **Step 1.3: Criar template de quiz**

Criar `conteúdo/governança/prompt-templates/quiz.md`:

```markdown
# Quiz — Template de Prompt

## Persona
Você é um especialista em avaliação educacional em radiologia. Crie questões que testem compreensão e aplicação, não apenas memorização de nomes.

## Tarefa
Crie 2 questões de múltipla escolha sobre o conceito abaixo. Cada questão deve:
- Testar compreensão real ou aplicação prática, não apenas reconhecimento do título
- Ter exatamente 4 alternativas (A, B, C, D): 1 correta e 3 distratores plausíveis
- Os distratores devem ser erros comuns ou conceitos próximos que um estudante poderia confundir com o correto
- Incluir uma explicação da resposta correta em 2 a 3 linhas

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um array JSON com 2 objetos, sem nenhum texto fora do JSON:
[
  {
    "question": "<texto da questão>",
    "options": ["<alternativa A>", "<alternativa B>", "<alternativa C>", "<alternativa D>"],
    "correct": <índice 0-3 da alternativa correta>,
    "explanation": "<explicação da resposta correta>"
  }
]
```

- [ ] **Step 1.4: Criar template de review card**

Criar `conteúdo/governança/prompt-templates/review-card.md`:

```markdown
# Review Card — Template de Prompt

## Persona
Você é um especialista em repetição espaçada para radiologia. Crie cards de revisão que reforcem a retenção de conceitos-chave.

## Tarefa
Crie 3 cards de revisão frente/verso sobre o conceito abaixo. Cada card deve:
- Ter uma frente com uma pergunta ou prompt curto (máximo 15 palavras)
- Ter um verso com a resposta precisa (máximo 30 palavras)
- Cobrir aspectos diferentes do conceito (definição, aplicação, relação com outros conceitos)

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um array JSON com 3 objetos, sem nenhum texto fora do JSON:
[
  {
    "front": "<pergunta ou prompt>",
    "back": "<resposta precisa>"
  }
]
```

- [ ] **Step 1.5: Criar template de caso clínico**

Criar `conteúdo/governança/prompt-templates/caso-clinico.md`:

```markdown
# Caso Clínico — Template de Prompt

## Persona
Você é um professor de radiologia que usa casos clínicos para contextualizar conceitos teóricos. O caso deve ser realista mas educacionalmente focado.

## Tarefa
Escreva um caso clínico curto que ilustre o conceito abaixo. O caso deve:
- Descrever um paciente fictício com contexto clínico breve (sexo, idade, queixa principal)
- Descrever o achado radiológico relevante ao conceito em 2 a 3 frases
- Terminar com uma pergunta educacional clara para o estudante
- NÃO fornecer a resposta — o caso é o estímulo, não a aula

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um objeto JSON com esta estrutura, sem nenhum texto fora do JSON:
{
  "scenario": "<descrição do paciente e contexto clínico>",
  "finding": "<descrição do achado radiológico relevante>",
  "question": "<pergunta educacional para o estudante>"
}
```

- [ ] **Step 1.6: Criar template de checkpoint**

Criar `conteúdo/governança/prompt-templates/checkpoint.md`:

```markdown
# Checkpoint — Template de Prompt

## Persona
Você é um professor que cria momentos de síntese ao final de uma unidade de estudo em radiologia.

## Tarefa
Crie um checkpoint para o conceito abaixo. O checkpoint deve:
- Listar 3 a 5 afirmações verdadeiras que resumem o que o aluno deve saber sobre este conceito
- Cada afirmação deve ser uma frase curta e precisa (máximo 20 palavras)
- Cobrir os aspectos mais importantes: definição, aplicação e relação com a prática

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um objeto JSON com esta estrutura, sem nenhum texto fora do JSON:
{
  "summary": "<frase de fechamento da unidade, 1 linha>",
  "assertions": ["<afirmação 1>", "<afirmação 2>", "<afirmação 3>"]
}
```

- [ ] **Step 1.7: Criar template de reward**

Criar `conteúdo/governança/prompt-templates/reward.md`:

```markdown
# Reward — Template de Prompt

## Persona
Você cria mensagens motivacionais pedagógicas para estudantes de radiologia que acabaram de completar uma unidade de estudo.

## Tarefa
Crie uma mensagem de recompensa para o estudante que acabou de estudar o conceito abaixo. A mensagem deve:
- Reconhecer o progresso de forma genuína (sem exageros ou elogios vazios)
- Conectar o conceito estudado com sua importância prática na carreira do técnico em radiologia
- Terminar com um estímulo para continuar (1 frase)
- Tom: encorajador, profissional, sem infantilizar

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um objeto JSON com esta estrutura, sem nenhum texto fora do JSON:
{
  "message": "<mensagem de reconhecimento, 2 a 3 frases>",
  "connection": "<como este conceito importa na prática, 1 frase>",
  "encouragement": "<estímulo para continuar, 1 frase>"
}
```

- [ ] **Step 1.8: Commit dos templates**

```bash
git add "conteúdo/governança/prompt-templates/"
git commit -m "feat: add AI prompt templates for all 6 pedagogical format types"
```

---

### Task 2: Gerador AI de formatos (`ai-generate-formats.py`)

**Files:**
- Create: `scripts/content/ai-generate-formats.py`
- Create: `scripts/content/ai-generate-formats.test.py`

- [ ] **Step 2.1: Escrever o teste primeiro**

Criar `scripts/content/ai-generate-formats.test.py`:

```python
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("ai-generate-formats.py")
SPEC = importlib.util.spec_from_file_location("ai_generate_formats", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

SAMPLE_CONCEPT = {
    "id": "concept:test-source:radiopacidade",
    "sourceId": "source:test-source",
    "sourceSlug": "test-source",
    "slug": "radiopacidade",
    "title": "Radiopacidade",
    "definition": "Grau de absorção dos raios X por diferentes estruturas do corpo.",
    "galaxyId": "galaxy-fisica",
    "planetId": "planet-radiopacidade",
    "starId": "star-principios-basicos",
    "sourceExcerptIds": ["excerpt:test-source:p1:c1"],
}


class BuildPromptTests(unittest.TestCase):
    def test_replaces_title_placeholder(self):
        template = "Conceito: {{title}}"
        result = MODULE.build_prompt(template, SAMPLE_CONCEPT)
        self.assertIn("Radiopacidade", result)
        self.assertNotIn("{{title}}", result)

    def test_replaces_definition_placeholder(self):
        template = "Def: {{definition}}"
        result = MODULE.build_prompt(template, SAMPLE_CONCEPT)
        self.assertIn("Grau de absorção", result)
        self.assertNotIn("{{definition}}", result)

    def test_replaces_all_taxonomy_placeholders(self):
        template = "{{galaxyId}} {{planetId}} {{starId}}"
        result = MODULE.build_prompt(template, SAMPLE_CONCEPT)
        self.assertNotIn("{{galaxyId}}", result)
        self.assertNotIn("{{planetId}}", result)
        self.assertNotIn("{{starId}}", result)


class BuildAiBundleTests(unittest.TestCase):
    def test_bundle_has_required_fields(self):
        ai_content = {"explanation": "test", "example": "ex", "keyPoints": []}
        bundle = MODULE.build_ai_bundle("microlições", SAMPLE_CONCEPT, ai_content)
        required = {"id", "formatType", "generationStrategy", "title", "sourceId",
                    "conceptIds", "sourceExcerptIds", "reviewStatus", "qualityScore", "aiContent"}
        for field in required:
            self.assertIn(field, bundle, f"Missing field: {field}")

    def test_bundle_id_contains_ai_suffix(self):
        ai_content = {"explanation": "test"}
        bundle = MODULE.build_ai_bundle("quizzes", SAMPLE_CONCEPT, ai_content)
        self.assertTrue(bundle["id"].endswith(":ai"))

    def test_bundle_review_status_is_pending(self):
        ai_content = {}
        bundle = MODULE.build_ai_bundle("microlições", SAMPLE_CONCEPT, ai_content)
        self.assertEqual(bundle["reviewStatus"], "pending")

    def test_bundle_quality_score_is_none(self):
        ai_content = {}
        bundle = MODULE.build_ai_bundle("microlições", SAMPLE_CONCEPT, ai_content)
        self.assertIsNone(bundle["qualityScore"])


class IsGeneratedTests(unittest.TestCase):
    def test_returns_false_when_file_missing(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            result = MODULE.is_generated("microlições", SAMPLE_CONCEPT, formats_root)
        self.assertFalse(result)

    def test_returns_false_when_bundle_id_absent(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            path = formats_root / "microlições" / "test-source"
            path.mkdir(parents=True)
            (path / "ai-bundles.json").write_text(
                json.dumps({"version": 1, "bundles": []}), encoding="utf-8"
            )
            result = MODULE.is_generated("microlições", SAMPLE_CONCEPT, formats_root)
        self.assertFalse(result)

    def test_returns_true_when_bundle_id_present(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            path = formats_root / "microlições" / "test-source"
            path.mkdir(parents=True)
            bundle_id = "format:microlições:test-source:radiopacidade:ai"
            (path / "ai-bundles.json").write_text(
                json.dumps({"version": 1, "bundles": [{"id": bundle_id}]}), encoding="utf-8"
            )
            result = MODULE.is_generated("microlições", SAMPLE_CONCEPT, formats_root)
        self.assertTrue(result)


class AppendBundleTests(unittest.TestCase):
    def test_creates_file_if_missing(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            bundle = {"id": "format:microlições:test-source:foo:ai", "formatType": "microlições"}
            MODULE.append_bundle("microlições", "test-source", bundle, formats_root)
            path = formats_root / "microlições" / "test-source" / "ai-bundles.json"
            self.assertTrue(path.exists())

    def test_appends_to_existing_file(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            path = formats_root / "microlições" / "test-source"
            path.mkdir(parents=True)
            (path / "ai-bundles.json").write_text(
                json.dumps({"version": 1, "generationStrategy": "ai-claude-sonnet-v1", "bundles": []}),
                encoding="utf-8",
            )
            bundle = {"id": "format:microlições:test-source:foo:ai"}
            MODULE.append_bundle("microlições", "test-source", bundle, formats_root)
            data = json.loads((path / "ai-bundles.json").read_text(encoding="utf-8"))
            self.assertEqual(len(data["bundles"]), 1)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2.2: Rodar e confirmar que falha**

```bash
python3 scripts/content/ai-generate-formats.test.py -v
```

Expected: FAIL.

- [ ] **Step 2.3: Implementar `ai-generate-formats.py`**

Criar `scripts/content/ai-generate-formats.py`:

```python
from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

import anthropic
import openai

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"
FORMATS_ROOT = CONTENT_ROOT / "formatos"
TEMPLATES_DIR = CONTENT_ROOT / "governança" / "prompt-templates"
SEQUENCE_PATH = CONTENT_ROOT / "governança" / "learning-sequence.json"
GENERATOR_VERSION = "ai-split-v1"

FORMAT_TYPES = ["microlições", "quizzes", "reviews", "casos", "checkpoints", "rewards"]

FORMAT_TITLES = {
    "microlições": "Microlição",
    "quizzes": "Quiz",
    "reviews": "Revisão",
    "casos": "Caso",
    "checkpoints": "Checkpoint",
    "rewards": "Recompensa",
}

TEMPLATE_FILES = {
    "microlições": "microlição.md",
    "quizzes": "quiz.md",
    "reviews": "review-card.md",
    "casos": "caso-clinico.md",
    "checkpoints": "checkpoint.md",
    "rewards": "reward.md",
}

# Claude handles narrative formats; OpenAI handles structured formats
FORMAT_PROVIDERS = {
    "microlições": "claude",
    "casos": "claude",
    "rewards": "claude",
    "quizzes": "openai",
    "reviews": "openai",
    "checkpoints": "openai",
}

_reader_spec = importlib.util.spec_from_file_location(
    "concepts_reader", Path(__file__).with_name("concepts-reader.py")
)
_reader_module = importlib.util.module_from_spec(_reader_spec)
_reader_spec.loader.exec_module(_reader_module)
load_all_concepts = _reader_module.load_all_concepts


def load_template(format_type: str) -> str:
    return (TEMPLATES_DIR / TEMPLATE_FILES[format_type]).read_text(encoding="utf-8")


def build_prompt(template: str, concept: dict) -> str:
    return (
        template
        .replace("{{title}}", concept["title"])
        .replace("{{definition}}", concept["definition"])
        .replace("{{galaxyId}}", concept["galaxyId"])
        .replace("{{planetId}}", concept["planetId"])
        .replace("{{starId}}", concept["starId"])
    )


def build_ai_bundle(format_type: str, concept: dict, ai_content: dict | list) -> dict:
    return {
        "id": f"format:{format_type}:{concept['sourceSlug']}:{concept['slug']}:ai",
        "formatType": format_type,
        "generationStrategy": GENERATOR_VERSION,
        "title": f"{FORMAT_TITLES[format_type]}: {concept['title']}",
        "sourceId": concept["sourceId"],
        "conceptIds": [concept["id"]],
        "sourceExcerptIds": concept["sourceExcerptIds"],
        "reviewStatus": "pending",
        "qualityScore": None,
        "aiContent": ai_content,
    }


def is_generated(
    format_type: str, concept: dict, formats_root: Path = FORMATS_ROOT
) -> bool:
    path = formats_root / format_type / concept["sourceSlug"] / "ai-bundles.json"
    if not path.exists():
        return False
    data = json.loads(path.read_text(encoding="utf-8"))
    expected_id = f"format:{format_type}:{concept['sourceSlug']}:{concept['slug']}:ai"
    return any(b["id"] == expected_id for b in data["bundles"])


def append_bundle(
    format_type: str,
    source_slug: str,
    bundle: dict,
    formats_root: Path = FORMATS_ROOT,
) -> None:
    path = formats_root / format_type / source_slug / "ai-bundles.json"
    if path.exists():
        data = json.loads(path.read_text(encoding="utf-8"))
    else:
        data = {"version": 1, "generationStrategy": GENERATOR_VERSION, "bundles": []}
    data["bundles"].append(bundle)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def load_ordered_concepts() -> list[dict]:
    """Return concepts ordered by learning-sequence.json, unlinked concepts appended last."""
    sequence = json.loads(SEQUENCE_PATH.read_text(encoding="utf-8"))
    all_concepts = load_all_concepts()
    concept_map = {c["id"]: c for c in all_concepts}

    ordered: list[dict] = []
    seen: set[str] = set()
    for planet in sequence["sequences"]:
        for concept_id in planet["sequence"]:
            if concept_id in concept_map and concept_id not in seen:
                ordered.append(concept_map[concept_id])
                seen.add(concept_id)

    for concept in all_concepts:
        if concept["id"] not in seen:
            ordered.append(concept)

    return ordered


def call_claude(prompt: str, client: anthropic.Anthropic) -> dict | list:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(message.content[0].text)


def call_openai(prompt: str, client) -> dict | list:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024,
    )
    return json.loads(response.choices[0].message.content)


def call_model(
    prompt: str,
    format_type: str,
    claude_client: anthropic.Anthropic,
    openai_client,
) -> dict | list:
    provider = FORMAT_PROVIDERS[format_type]
    if provider == "claude":
        return call_claude(prompt, claude_client)
    return call_openai(prompt, openai_client)


def run(format_type: str | None = None) -> None:
    import openai as openai_lib

    claude_client = anthropic.Anthropic()
    openai_client = openai_lib.OpenAI()
    concepts = load_ordered_concepts()
    types_to_run = [format_type] if format_type else FORMAT_TYPES

    for fmt in types_to_run:
        template = load_template(fmt)
        provider = FORMAT_PROVIDERS[fmt]
        print(f"\n{fmt} [{provider}]:")
        generated = 0
        skipped = 0
        for concept in concepts:
            if is_generated(fmt, concept):
                skipped += 1
                continue
            prompt = build_prompt(template, concept)
            ai_content = call_model(prompt, fmt, claude_client, openai_client)
            bundle = build_ai_bundle(fmt, concept, ai_content)
            append_bundle(fmt, concept["sourceSlug"], bundle)
            print(f"  + {concept['slug']}")
            generated += 1
        print(f"  {generated} generated, {skipped} skipped")

    print("\nDone.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate AI-enriched pedagogical bundles")
    parser.add_argument("--format", choices=FORMAT_TYPES, help="Generate only this format type")
    args = parser.parse_args()
    run(args.format)
```

- [ ] **Step 2.4: Rodar e confirmar que passa**

```bash
python3 scripts/content/ai-generate-formats.test.py -v
```

Expected: PASS — 12 tests passing.

- [ ] **Step 2.5: Testar execução real (requer `ANTHROPIC_API_KEY` e `OPENAI_API_KEY`)**

Testar com um único formato Claude e um único formato OpenAI:

```bash
ANTHROPIC_API_KEY=<key> OPENAI_API_KEY=<key> python3 scripts/content/ai-generate-formats.py --format microlições
ANTHROPIC_API_KEY=<key> OPENAI_API_KEY=<key> python3 scripts/content/ai-generate-formats.py --format quizzes
```

Expected output example:
```
microlições:
  + profissao-e-atuacao-do-tecnico-em-radiologia
  + energia-e-materia
  ...
  16 generated, 0 skipped
Done.
```

Verificar bundle gerado:

```bash
python3 -c "
import json
from pathlib import Path
data = json.load(open('conteúdo/formatos/microlições/fundamentos-de-radiologia-everton-costa-pinto/ai-bundles.json'))
b = data['bundles'][0]
print('ID:', b['id'])
print('Status:', b['reviewStatus'])
print('Content keys:', list(b['aiContent'].keys()))
print('Explanation:', b['aiContent'].get('explanation', '')[:200])
"
```

- [ ] **Step 2.6: Commit**

```bash
git add scripts/content/ai-generate-formats.py scripts/content/ai-generate-formats.test.py
git commit -m "feat: add AI-powered format generator using Claude Sonnet with prompt templates"
```

---

## Validação ponta a ponta do Plano 2

Rodar a suíte de testes do plano:

```bash
python3 scripts/content/ai-generate-formats.test.py -v
```

Expected: 12 tests passing.

Pipeline completo do Plano 2 (ambas as chaves necessárias):

```bash
ANTHROPIC_API_KEY=<key> OPENAI_API_KEY=<key> python3 scripts/content/ai-generate-formats.py
```

Estado esperado após execução:

| Artefato | Verificação |
|---|---|
| `formatos/microlições/<source>/ai-bundles.json` | Bundles com `reviewStatus: "pending"`, prontos para o painel editorial |
| `formatos/quizzes/<source>/ai-bundles.json` | Bundles com questões de 4 opções e explicação |
| `formatos/casos/<source>/ai-bundles.json` | Bundles com `scenario`, `finding`, `question` |
| `generationStrategy` | `"ai-split-v1"` em todos os arquivos |

Verificar um bundle gerado:

```bash
python3 -c "
import json
from pathlib import Path
import glob
files = list(Path('conteúdo/formatos/microlições').glob('*/ai-bundles.json'))
if files:
    data = json.load(open(files[0]))
    b = data['bundles'][0]
    print('ID:', b['id'])
    print('Status:', b['reviewStatus'])
    print('Strategy:', data['generationStrategy'])
    print('Content keys:', list(b['aiContent'].keys()))
"
```
