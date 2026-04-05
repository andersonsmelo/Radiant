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


def call_openai(prompt: str, client: openai.OpenAI) -> dict | list:
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
    openai_client: openai.OpenAI,
) -> dict | list:
    provider = FORMAT_PROVIDERS[format_type]
    if provider == "claude":
        return call_claude(prompt, claude_client)
    return call_openai(prompt, openai_client)


def run(format_type: str | None = None) -> None:
    claude_client = anthropic.Anthropic()
    openai_client = openai.OpenAI()
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
